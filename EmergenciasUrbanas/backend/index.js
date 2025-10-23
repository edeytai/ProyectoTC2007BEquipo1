const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { createObjectCsvWriter } = require('csv-writer');
const cron = require('node-cron');
const { executeBackup, initializeBackupSystem } = require('./backup');
const {
  encryptUserSensitiveData,
  decryptUserSensitiveData,
  encryptIncidentSensitiveData,
  decryptIncidentSensitiveData
} = require('./crypto-utils');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Configuracion de seguridad - Helmet
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
});

// Configuracion de CORS seguro
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://localhost:5174', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Configuracion de rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again after 15 minutes.' },
  skipSuccessfulRequests: true,
});

app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    if (res.statusCode === 429) {
      console.warn(`Rate limit alcanzado - IP: ${req.ip}, Path: ${req.path}`);
    }
    return originalJson.call(this, data);
  };
  next();
});

const PORT = process.env.PORT || 3444;
let db;
app.use(bodyParser.json());

/*
Tiempos de expiracion de JWT por rol (en segundos)
Configuracion personalizada segun el contexto de uso:
- Brigadistas: 12 horas (43200s) - Personal en campo
- Coordinadores: 120 horas (432000s) - Supervision continua
- Autoridad: 24 horas (86400s) - Consultas diarias
- Admin: 60 minutos (3600s) - Sesion corta por seguridad
*/
const EXPIRACION_TOKEN_POR_ROL = {
  'brigadista': 43200,
  'coordinador': 432000,
  'autoridad': 86400,
  'admin': 3600
};

/*
Registra acciones en la coleccion de logs para auditoria
Parametros: sujeto (string) - Usuario que realiza la accion
Parametros: objeto (string) - Recurso afectado
Parametros: accion (string) - Tipo de accion realizada
*/
async function log(sujeto, objeto, accion) {
  try {
    const toLog = {
      timestamp: new Date(),
      sujeto: sujeto,
      objeto: objeto,
      accion: accion
    };
    await db.collection("logs").insertOne(toLog);
  } catch (error) {
    console.error("Error al registrar log:", error);
  }
}

// Middleware para verificar token JWT en requests protegidos
async function verificarToken(req, res, next) {
  try {
    const token = req.get("Authentication");
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const verifiedToken = await jwt.verify(token, process.env.JWTKEY);
    req.usuario = verifiedToken.usuario;
    req.role = verifiedToken.role;
    next();
  } catch (error) {
    console.error("Error en verificacion de token:", error);
    res.status(401).json({ error: "Token invalido o expirado" });
  }
}

// POST /login - Autenticacion de usuarios con JWT
// Rate limiting: 5 intentos por 15 minutos
app.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contrasena requeridos" });
    }

    const user = await db.collection("users").findOne({ username: username });

    if (!user) {
      await log("sistema", "login", "intento_fallido");
      return res.status(401).json({ error: "Usuario o contrasena incorrectos" });
    }

    if (!user.active) {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    const passwordValido = await argon2.verify(user.password, password);

    if (!passwordValido) {
      await log(username, "login", "intento_fallido");
      return res.status(401).json({ error: "Usuario o contrasena incorrectos" });
    }

    const tiempoExpiracion = EXPIRACION_TOKEN_POR_ROL[user.role] || 3600;

    const token = jwt.sign(
      {
        usuario: user.username,
        id: user.id,
        role: user.role
      },
      process.env.JWTKEY,
      { expiresIn: tiempoExpiracion }
    );

    await db.collection("users").updateOne(
      { username: username },
      { $set: { lastLogin: new Date().toISOString() } }
    );

    await log(username, "login", "exitoso");

    res.json({
      token: token,
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      expiresIn: tiempoExpiracion
    });

  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /register - Register new users (admin only)
app.post("/register", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para registrar usuarios" });
    }

    const { username, password, fullName, email, role, department, phone } = req.body;

    if (!username || !password || !fullName || !email || !role) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const existingUser = await db.collection("users").findOne({ username: username });

    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16
    });

    const count = await db.collection("users").countDocuments();
    const id = `u${count + 1}`;

    let nuevoUsuario = {
      id: id,
      username: username,
      password: hash,
      fullName: fullName,
      email: email,
      role: role,
      department: department || "",
      phone: phone || "",
      active: true,
      createdAt: new Date().toISOString()
    };

    nuevoUsuario = encryptUserSensitiveData(nuevoUsuario);

    await db.collection("users").insertOne(nuevoUsuario);
    await log(req.usuario, "users", `crear_usuario_${username}`);

    res.status(201).json({ message: "Usuario creado exitosamente", id: id });

  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// POST /users - Crear usuario (alias de /register para React Admin)
app.post("/users", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para registrar usuarios" });
    }

    const { username, password, fullName, email, role, department, phone } = req.body;

    if (!username || !password || !fullName || !email || !role) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const existingUser = await db.collection("users").findOne({ username: username });

    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16
    });

    const count = await db.collection("users").countDocuments();
    const id = `u${count + 1}`;

    let nuevoUsuario = {
      id: id,
      username: username,
      password: hash,
      fullName: fullName,
      email: email,
      role: role,
      department: department || "",
      phone: phone || "",
      active: true,
      createdAt: new Date().toISOString()
    };

    nuevoUsuario = encryptUserSensitiveData(nuevoUsuario);

    await db.collection("users").insertOne(nuevoUsuario);
    await log(req.usuario, "users", `crear_usuario_${username}`);

    res.status(201).json({ message: "Usuario creado exitosamente", id: id });

  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// GET /incidents - Get list of incidents with filters, pagination and sorting
app.get("/incidents", verificarToken, async (req, res) => {
  try {
    let filtro = {};

    if (req.role === "brigadista") {
      filtro.createdBy = req.usuario;
    }

    // Aplicar filtros adicionales
    if (req.query.estadoReporte) {
      filtro.estadoReporte = req.query.estadoReporte;
    }
    if (req.query.tipoEmergencia) {
      filtro.tipoEmergencia = req.query.tipoEmergencia;
    }
    if (req.query.nivelGravedad) {
      filtro.nivelGravedad = req.query.nivelGravedad;
    }

    // Manejo de getList con paginacion y sorting
    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      const sortOrder = req.query._order === "ASC" ? 1 : -1;
      const inicio = Number(req.query._start) || 0;
      const fin = Number(req.query._end) || 10;

      const sorter = {};
      sorter[sortBy] = sortOrder;

      const data = await db
        .collection("incidents")
        .find(filtro)
        .sort(sorter)
        .project({ _id: 0 })
        .toArray();

      const decryptedData = data.map(incident => decryptIncidentSensitiveData(incident));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", decryptedData.length);

      const paginatedData = decryptedData.slice(inicio, fin);
      await log(req.usuario, "incidents", "leer_lista");
      res.json(paginatedData);
    } else if ("id" in req.query) {
      const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];
      const data = await db
        .collection("incidents")
        .find({ id: { $in: ids }, ...filtro })
        .project({ _id: 0 })
        .toArray();

      const decryptedData = data.map(incident => decryptIncidentSensitiveData(incident));

      res.json(decryptedData);
    } else {
      const data = await db
        .collection("incidents")
        .find(filtro)
        .project({ _id: 0 })
        .toArray();

      const decryptedData = data.map(incident => decryptIncidentSensitiveData(incident));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", decryptedData.length);
      await log(req.usuario, "incidents", "leer_lista");
      res.json(decryptedData);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener incidentes" });
  }
});

// GET /incidents/:id - Obtener un incidente especifico
app.get("/incidents/:id", verificarToken, async (req, res) => {
  try {
    const incidente = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    if (req.role === "brigadista" && incidente.createdBy !== req.usuario) {
      return res.status(403).json({ error: "No tiene permisos para ver este incidente" });
    }

    const decryptedIncident = decryptIncidentSensitiveData(incidente);

    await log(req.usuario, `incidente_${req.params.id}`, "leer");
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener incidente" });
  }
});

// POST /incidents - Crear nuevo incidente
app.post("/incidents", verificarToken, async (req, res) => {
  try {
    const count = await db.collection("incidents").countDocuments();
    const id = String(count + 1);

    let nuevoIncidente = {
      ...req.body,
      id: id,
      estadoReporte: "draft",
      createdBy: req.usuario,
      createdAt: new Date().toISOString(),
      trabajosRealizados: req.body.trabajosRealizados || [],
      dependencias: req.body.dependencias || [],
      autoridadesIntervinientes: req.body.autoridadesIntervinientes || []
    };

    nuevoIncidente = encryptIncidentSensitiveData(nuevoIncidente);

    await db.collection("incidents").insertOne(nuevoIncidente);
    await log(req.usuario, `incidente_${id}`, "crear");

    delete nuevoIncidente._id;
    const decryptedIncident = decryptIncidentSensitiveData(nuevoIncidente);
    res.status(201).json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al crear incidente" });
  }
});

// PUT /incidents/:id - Actualizar incidente con control de permisos por rol
app.put("/incidents/:id", verificarToken, async (req, res) => {
  try {
    const incidente = await db.collection("incidents").findOne({ id: req.params.id });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }
    if (req.role === "brigadista") {
      // Brigadistas solo pueden editar sus propios incidentes en draft
      if (incidente.createdBy !== req.usuario) {
        return res.status(403).json({ error: "No puede editar incidentes de otros brigadistas" });
      }
      if (incidente.estadoReporte !== "draft") {
        return res.status(403).json({ error: "Solo puede editar incidentes en estado draft" });
      }
    } else if (req.role === "autoridad") {
      // Autoridades no pueden editar
      return res.status(403).json({ error: "Las autoridades no pueden editar incidentes" });
    } else if (req.role === "coordinador") {
      // Coordinadores solo pueden cambiar el estado
      const camposPermitidos = ["estadoReporte"];
      const camposEnviados = Object.keys(req.body);
      const camposNoPermitidos = camposEnviados.filter(c => !camposPermitidos.includes(c));

      if (camposNoPermitidos.length > 0) {
        return res.status(403).json({
          error: "Coordinadores solo pueden cambiar el estado del reporte"
        });
      }
    }

    let datosActualizados = {
      ...req.body,
      updatedBy: req.usuario,
      updatedAt: new Date().toISOString()
    };
    if (datosActualizados.responsableInmueble || datosActualizados.observaciones) {
      const encryptedData = encryptIncidentSensitiveData(datosActualizados);
      Object.assign(datosActualizados, encryptedData);
    }

    await db.collection("incidents").updateOne(
      { id: req.params.id },
      { $set: datosActualizados }
    );

    const incidenteActualizado = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    const decryptedIncident = decryptIncidentSensitiveData(incidenteActualizado);

    await log(req.usuario, `incidente_${req.params.id}`, "actualizar");
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar incidente" });
  }
});

// DELETE /incidents/:id - Eliminar incidente (solo admin)
app.delete("/incidents/:id", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "Solo administradores pueden eliminar incidentes" });
    }

    const resultado = await db.collection("incidents").deleteOne({ id: req.params.id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    await log(req.usuario, `incidente_${req.params.id}`, "eliminar");
    res.json({ id: req.params.id });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar incidente" });
  }
});

// POST /incidents/:id/submit - Submit incident for review (brigadista → coordinador)
// Changes state from 'draft' to 'en_revision'
app.post("/incidents/:id/submit", verificarToken, async (req, res) => {
  try {
    const incidente = await db.collection("incidents").findOne({ id: req.params.id });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }
    if (req.role !== "brigadista" && req.role !== "admin") {
      return res.status(403).json({ error: "Solo brigadistas pueden enviar incidentes a revision" });
    }

    if (req.role === "brigadista" && incidente.createdBy !== req.usuario) {
      return res.status(403).json({ error: "Solo puede enviar sus propios incidentes" });
    }

    if (incidente.estadoReporte !== "draft") {
      return res.status(400).json({ error: "Solo se pueden enviar incidentes en borrador" });
    }
    await db.collection("incidents").updateOne(
      { id: req.params.id },
      {
        $set: {
          estadoReporte: "en_revision",
          submittedAt: new Date().toISOString(),
          submittedBy: req.usuario
        }
      }
    );

    const incidenteActualizado = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    await log(req.usuario, `incidente_${req.params.id}`, "enviar_a_revision");

    const decryptedIncident = decryptIncidentSensitiveData(incidenteActualizado);
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al enviar incidente" });
  }
});

// POST /incidents/:id/approve - Approve incident (coordinador/admin)
// Changes state from 'en_revision' to 'aprobado'
app.post("/incidents/:id/approve", verificarToken, async (req, res) => {
  try {
    const incidente = await db.collection("incidents").findOne({ id: req.params.id });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    if (req.role !== "coordinador" && req.role !== "admin") {
      return res.status(403).json({ error: "Solo coordinadores pueden aprobar incidentes" });
    }

    if (incidente.estadoReporte !== "en_revision") {
      return res.status(400).json({ error: "Solo se pueden aprobar incidentes en revision" });
    }
    await db.collection("incidents").updateOne(
      { id: req.params.id },
      {
        $set: {
          estadoReporte: "aprobado",
          approvedAt: new Date().toISOString(),
          approvedBy: req.usuario
        }
      }
    );

    const incidenteActualizado = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    await log(req.usuario, `incidente_${req.params.id}`, "aprobar");

    const decryptedIncident = decryptIncidentSensitiveData(incidenteActualizado);
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al aprobar incidente" });
  }
});

// POST /incidents/:id/reject - Reject incident (coordinador/admin)
// Changes state from 'en_revision' back to 'draft'
app.post("/incidents/:id/reject", verificarToken, async (req, res) => {
  try {
    const incidente = await db.collection("incidents").findOne({ id: req.params.id });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    if (req.role !== "coordinador" && req.role !== "admin") {
      return res.status(403).json({ error: "Solo coordinadores pueden rechazar incidentes" });
    }

    if (incidente.estadoReporte !== "en_revision") {
      return res.status(400).json({ error: "Solo se pueden rechazar incidentes en revision" });
    }

    const { motivo } = req.body;
    await db.collection("incidents").updateOne(
      { id: req.params.id },
      {
        $set: {
          estadoReporte: "draft",
          rejectedAt: new Date().toISOString(),
          rejectedBy: req.usuario,
          rejectionReason: motivo || "Sin especificar"
        }
      }
    );

    const incidenteActualizado = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    await log(req.usuario, `incidente_${req.params.id}`, "rechazar");

    const decryptedIncident = decryptIncidentSensitiveData(incidenteActualizado);
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al rechazar incidente" });
  }
});

// POST /incidents/:id/close - Close incident (coordinador/admin)
// Changes state from 'aprobado' to 'cerrado'
app.post("/incidents/:id/close", verificarToken, async (req, res) => {
  try {
    const incidente = await db.collection("incidents").findOne({ id: req.params.id });

    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }

    if (req.role !== "coordinador" && req.role !== "admin") {
      return res.status(403).json({ error: "Solo coordinadores pueden cerrar incidentes" });
    }

    if (incidente.estadoReporte !== "aprobado") {
      return res.status(400).json({ error: "Solo se pueden cerrar incidentes aprobados" });
    }
    await db.collection("incidents").updateOne(
      { id: req.params.id },
      {
        $set: {
          estadoReporte: "cerrado",
          closedAt: new Date().toISOString(),
          closedBy: req.usuario
        }
      }
    );

    const incidenteActualizado = await db
      .collection("incidents")
      .findOne({ id: req.params.id }, { projection: { _id: 0 } });

    await log(req.usuario, `incidente_${req.params.id}`, "cerrar");

    const decryptedIncident = decryptIncidentSensitiveData(incidenteActualizado);
    res.json(decryptedIncident);

  } catch (error) {
    res.status(500).json({ error: "Error al cerrar incidente" });
  }
});

// GET /users - Get list of users (admin only)
app.get("/users", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para ver usuarios" });
    }

    let filtro = {};

    // Aplicar filtros
    if (req.query.role) {
      filtro.role = req.query.role;
    }
    if (req.query.active !== undefined) {
      filtro.active = req.query.active === "true";
    }
    if (req.query.q) {
      const searchTerm = req.query.q;
      filtro.$or = [
        { username: { $regex: searchTerm, $options: "i" } },
        { fullName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } }
      ];
    }

    // Manejo de paginacion y sorting
    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      const sortOrder = req.query._order === "ASC" ? 1 : -1;
      const inicio = Number(req.query._start) || 0;
      const fin = Number(req.query._end) || 10;

      const sorter = {};
      sorter[sortBy] = sortOrder;

      const data = await db
        .collection("users")
        .find(filtro)
        .sort(sorter)
        .project({ _id: 0, password: 0 })
        .toArray();

      const decryptedData = data.map(user => decryptUserSensitiveData(user));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", decryptedData.length);

      const paginatedData = decryptedData.slice(inicio, fin);
      await log(req.usuario, "users", "leer_lista");
      res.json(paginatedData);
    } else {
      const data = await db
        .collection("users")
        .find(filtro)
        .project({ _id: 0, password: 0 })
        .toArray();

      const decryptedData = data.map(user => decryptUserSensitiveData(user));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", decryptedData.length);
      await log(req.usuario, "users", "leer_lista");
      res.json(decryptedData);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// GET /users/:id - Obtener un usuario especifico (solo admin)
app.get("/users/:id", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para ver usuarios" });
    }

    const usuario = await db
      .collection("users")
      .findOne({ id: req.params.id }, { projection: { _id: 0, password: 0 } });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const decryptedUser = decryptUserSensitiveData(usuario);

    await log(req.usuario, `usuario_${req.params.id}`, "leer");
    res.json(decryptedUser);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// PUT /users/:id - Actualizar usuario (solo admin)
app.put("/users/:id", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para editar usuarios" });
    }

    const usuario = await db.collection("users").findOne({ id: req.params.id });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const datosActualizados = { ...req.body };

    if (datosActualizados.password) {
      const hash = await argon2.hash(datosActualizados.password, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
        saltLength: 16
      });
      datosActualizados.password = hash;
    }

    if (datosActualizados.email || datosActualizados.phone || datosActualizados.fullName) {
      const encryptedData = encryptUserSensitiveData(datosActualizados);
      Object.assign(datosActualizados, encryptedData);
    }
    delete datosActualizados.id;
    delete datosActualizados.createdAt;

    await db.collection("users").updateOne(
      { id: req.params.id },
      { $set: datosActualizados }
    );

    const usuarioActualizado = await db
      .collection("users")
      .findOne({ id: req.params.id }, { projection: { _id: 0, password: 0 } });

    await log(req.usuario, `usuario_${req.params.id}`, "actualizar");
    res.json(usuarioActualizado);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// DELETE /users/:id - Eliminar usuario (solo admin)
app.delete("/users/:id", verificarToken, async (req, res) => {
  try {
    if (req.role !== "admin") {
      return res.status(403).json({ error: "No tiene permisos para eliminar usuarios" });
    }

    const resultado = await db.collection("users").deleteOne({ id: req.params.id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await log(req.usuario, `usuario_${req.params.id}`, "eliminar");
    res.json({ id: req.params.id });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// GET /reports/stats - Get aggregated statistics for reports dashboard
// Available to: coordinador, autoridad, admin
app.get("/reports/stats", verificarToken, async (req, res) => {
  try {
    if (req.role === "brigadista") {
      return res.status(403).json({ error: "No tiene permisos para ver estadisticas" });
    }

    const now = new Date();
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const [
      totalIncidents,
      criticalIncidents,
      incidentsByStatus,
      incidentsByType,
      monthIncidents
    ] = await Promise.all([
      db.collection("incidents").countDocuments(),
      db.collection("incidents").countDocuments({ nivelGravedad: "alta" }),
      db.collection("incidents").aggregate([
        { $group: { _id: "$estadoReporte", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").aggregate([
        { $group: { _id: "$tipoEmergencia", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").countDocuments({
        createdAt: { $gte: primerDiaMes.toISOString() }
      })
    ]);
    const byStatus = {};
    incidentsByStatus.forEach(item => {
      byStatus[item._id] = item.count;
    });

    const byType = {};
    incidentsByType.forEach(item => {
      byType[item._id] = item.count;
    });

    const stats = {
      totalIncidents,
      criticalIncidents,
      monthIncidents,
      byStatus,
      byType
    };

    await log(req.usuario, "reports", "ver_estadisticas");
    res.json(stats);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// GET /reports/export/csv - Export statistics as CSV file
// Available to: coordinador, autoridad, admin
app.get("/reports/export/csv", verificarToken, async (req, res) => {
  try {
    if (req.role === "brigadista") {
      return res.status(403).json({ error: "No tiene permisos para exportar estadisticas" });
    }
    const now = new Date();
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalIncidents,
      criticalIncidents,
      incidentsByStatus,
      incidentsByType,
      monthIncidents,
      allIncidents
    ] = await Promise.all([
      db.collection("incidents").countDocuments(),
      db.collection("incidents").countDocuments({ nivelGravedad: "alta" }),
      db.collection("incidents").aggregate([
        { $group: { _id: "$estadoReporte", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").aggregate([
        { $group: { _id: "$tipoEmergencia", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").countDocuments({
        createdAt: { $gte: primerDiaMes.toISOString() }
      }),
      db.collection("incidents").find().project({ _id: 0 }).toArray()
    ]);

    const timestamp = Date.now();
    const csvPath = path.join(__dirname, 'uploads', `reporte_${timestamp}.csv`);

    await fsPromises.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'fecha', title: 'Fecha' },
        { id: 'hora', title: 'Hora' },
        { id: 'tipoEmergencia', title: 'Tipo de Emergencia' },
        { id: 'nivelGravedad', title: 'Nivel de Gravedad' },
        { id: 'estadoReporte', title: 'Estado' },
        { id: 'ubicacion', title: 'Ubicación' },
        { id: 'createdBy', title: 'Creado por' },
        { id: 'createdAt', title: 'Fecha de creación' }
      ]
    });

    const records = allIncidents.map(inc => ({
      id: inc.id,
      fecha: inc.fecha || '',
      hora: inc.hora || '',
      tipoEmergencia: inc.tipoEmergencia || '',
      nivelGravedad: inc.nivelGravedad || '',
      estadoReporte: inc.estadoReporte || '',
      ubicacion: inc.ubicacion?.calle ? `${inc.ubicacion.calle}, ${inc.ubicacion.colonia}` : '',
      createdBy: inc.createdBy || '',
      createdAt: inc.createdAt || ''
    }));

    await csvWriter.writeRecords(records);

    await log(req.usuario, "reports", "exportar_csv");

    res.download(csvPath, `reporte_emergencias_${timestamp}.csv`, async (err) => {
      if (err) {
        console.error("Error al enviar CSV:", err);
      }
      try {
        await fsPromises.unlink(csvPath);
      } catch (unlinkErr) {
        console.error("Error al eliminar archivo temporal:", unlinkErr);
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error al exportar estadísticas" });
  }
});

// GET /reports/export/pdf - Export statistics as PDF file
// Available to: coordinador, autoridad, admin
app.get("/reports/export/pdf", verificarToken, async (req, res) => {
  try {
    if (req.role === "brigadista") {
      return res.status(403).json({ error: "No tiene permisos para exportar estadisticas" });
    }
    const now = new Date();
    const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalIncidents,
      criticalIncidents,
      incidentsByStatus,
      incidentsByType,
      monthIncidents
    ] = await Promise.all([
      db.collection("incidents").countDocuments(),
      db.collection("incidents").countDocuments({ nivelGravedad: "alta" }),
      db.collection("incidents").aggregate([
        { $group: { _id: "$estadoReporte", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").aggregate([
        { $group: { _id: "$tipoEmergencia", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection("incidents").countDocuments({
        createdAt: { $gte: primerDiaMes.toISOString() }
      })
    ]);

    const byStatus = {};
    incidentsByStatus.forEach(item => {
      byStatus[item._id] = item.count;
    });

    const byType = {};
    incidentsByType.forEach(item => {
      byType[item._id] = item.count;
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let yPosition = height - 50;
    page.drawText('Reporte de Emergencias Urbanas', {
      x: 50,
      y: yPosition,
      size: 20,
      font: helveticaBold,
      color: rgb(0.2, 0.2, 0.8)
    });

    yPosition -= 30;

    const fechaReporte = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    page.drawText(`Fecha del reporte: ${fechaReporte}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3)
    });

    yPosition -= 40;

    page.drawText('Resumen General', {
      x: 50,
      y: yPosition,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    yPosition -= 25;

    const estadisticasGenerales = [
      `Total de incidentes: ${totalIncidents}`,
      `Incidentes críticos (alta gravedad): ${criticalIncidents}`,
      `Incidentes del mes actual: ${monthIncidents}`
    ];

    estadisticasGenerales.forEach(stat => {
      page.drawText(stat, {
        x: 70,
        y: yPosition,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    });

    yPosition -= 20;

    page.drawText('Incidentes por Estado', {
      x: 50,
      y: yPosition,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    yPosition -= 25;

    const estadosLabels = {
      draft: 'Borrador',
      en_revision: 'En revisión',
      aprobado: 'Aprobado',
      cerrado: 'Cerrado'
    };

    Object.entries(byStatus).forEach(([estado, count]) => {
      const label = estadosLabels[estado] || estado;
      page.drawText(`${label}: ${count}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    });

    yPosition -= 20;

    page.drawText('Incidentes por Tipo', {
      x: 50,
      y: yPosition,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0)
    });

    yPosition -= 25;

    const tiposLabels = {
      inundacion: 'Inundación',
      incendio: 'Incendio',
      socavon: 'Socavón',
      deslave: 'Deslave',
      sismo: 'Sismo',
      fuga: 'Fuga',
      otro: 'Otro'
    };

    Object.entries(byType).forEach(([tipo, count]) => {
      const label = tiposLabels[tipo] || tipo;
      page.drawText(`${label}: ${count}`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: helvetica,
        color: rgb(0, 0, 0)
      });
      yPosition -= 20;
    });

    yPosition -= 40;

    page.drawText('Sistema de Gestion de Emergencias Urbanas', {
      x: 50,
      y: 30,
      size: 10,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();

    await log(req.usuario, "reports", "exportar_pdf");
    const timestamp = Date.now();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="reporte_emergencias_${timestamp}.pdf"`);
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    res.status(500).json({ error: "Error al exportar estadísticas" });
  }
});

// GET /history - Get audit logs with pagination
// Available to: coordinador, autoridad, admin
app.get("/history", verificarToken, async (req, res) => {
  try {
    if (req.role === "brigadista") {
      return res.status(403).json({ error: "No tiene permisos para ver el historial" });
    }

    let filtro = {};
    if (req.query.sujeto) {
      filtro.sujeto = req.query.sujeto;
    }
    if (req.query.accion) {
      filtro.accion = req.query.accion;
    }

    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      const sortOrder = req.query._order === "ASC" ? 1 : -1;
      const inicio = Number(req.query._start) || 0;
      const fin = Number(req.query._end) || 10;

      const sorter = {};
      sorter[sortBy] = sortOrder;

      const data = await db
        .collection("logs")
        .find(filtro)
        .sort(sorter)
        .project({ _id: 0 })
        .toArray();

      const dataWithIds = data.map((log, index) => ({
        id: log.timestamp.toISOString() + "_" + index,
        ...log,
        timestamp: log.timestamp.toISOString()
      }));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", dataWithIds.length);

      const paginatedData = dataWithIds.slice(inicio, fin);
      res.json(paginatedData);
    } else {
      const data = await db
        .collection("logs")
        .find(filtro)
        .sort({ timestamp: -1 })
        .limit(100)
        .project({ _id: 0 })
        .toArray();

      const dataWithIds = data.map((log, index) => ({
        id: log.timestamp.toISOString() + "_" + index,
        ...log,
        timestamp: log.timestamp.toISOString()
      }));

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", dataWithIds.length);
      res.json(dataWithIds);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

async function connectToDB() {
  try {
    const client = new MongoClient(process.env.DB);
    await client.connect();
    db = client.db();
    console.log(`Conectado a MongoDB: ${db.databaseName}`);
  } catch (error) {
    console.error(" Error al conectar a MongoDB:", error);
    process.exit(1);
  }
}

// Programa backups automaticos de la base de datos
// Ejecuta diariamente a las 2:00 AM
function scheduleBackups() {
  cron.schedule('0 2 * * *', async () => {
    try {
      await executeBackup(db);
    } catch (error) {
      console.error('[CRON] Error en backup:', error.message);
    }
  });
}

const certExists = fs.existsSync("backend.key") && fs.existsSync("backend.crt");

if (certExists) {
  const options = {
    key: fs.readFileSync("backend.key"),
    cert: fs.readFileSync("backend.crt")
  };

  https.createServer(options, app).listen(PORT, async () => {
    await connectToDB();
    await initializeBackupSystem(db);
    scheduleBackups();
    console.log(`Servidor HTTPS: https://localhost:${PORT}`);
  });
} else {
  console.warn(" Certificados no encontrados. Usando HTTP en lugar de HTTPS.");
  console.warn("  Para generar certificados: openssl req -nodes -new -x509 -keyout backend.key -out backend.crt");

  app.listen(PORT, async () => {
    await connectToDB();
    await initializeBackupSystem(db);
    scheduleBackups();
    console.log(`Servidor HTTP: http://localhost:${PORT}`);
  });
}
