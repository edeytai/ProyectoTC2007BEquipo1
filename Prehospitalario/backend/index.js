const express = require("express");
const https = require("https");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

// Configurar Helmet para seguridad de headers
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP para desarrollo
  crossOriginEmbedderPolicy: false
}));

// Configurar CORS de forma segura
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://127.0.0.1:5173'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo mas tarde'
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

// Rate limiting mas estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos de login
  message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos'
});

const PORT = 3001;
const HTTPS_PORT = 3443;
let db;
app.use(bodyParser.json());

// Funcion para registrar logs de auditoria
async function log(sujeto, objeto, accion) {
  const toLog = {};
  toLog["timestamp"] = new Date();
  toLog["sujeto"] = sujeto;
  toLog["objeto"] = objeto;
  toLog["accion"] = accion;
  await db.collection("log").insertOne(toLog);
}

// Middleware para verificar autenticacion
async function verificarAutenticacion(req, res, next) {
  try {
    const token = req.get("Authentication");
    if (!token) {
      return res.sendStatus(401);
    }
    const verifiedToken = await jwt.verify(token, process.env.JWTKEY);
    req.usuario = verifiedToken.usuario;
    req.rol = verifiedToken.rol;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
}

// Funcion para verificar si el usuario esta en su turno
function verificarTurno(turno) {
  const now = new Date();
  const mexicoTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  const hora = mexicoTime.getHours();
  const minutos = mexicoTime.getMinutes();
  const diaSemana = mexicoTime.getDay();
  const horaCompleta = hora + minutos / 60;
  const margen = 10 / 60;

  if (turno === "administrador") {
    return true;
  }
  if (turno === "autoridad") {
    return true;
  }
  if (turno === "lun-vie-matutino") {
    return diaSemana >= 1 && diaSemana <= 5 && horaCompleta >= (8 - margen) && horaCompleta < 15;
  }
  if (turno === "lun-vie-vespertino") {
    return diaSemana >= 1 && diaSemana <= 5 && horaCompleta >= (15 - margen) && horaCompleta < 21;
  }
  if (turno === "lun-mie-vie-nocturno") {
    if (horaCompleta >= (21 - margen)) {
      return diaSemana === 1 || diaSemana === 3 || diaSemana === 5;
    } else if (horaCompleta < 8) {
      return diaSemana === 2 || diaSemana === 4 || diaSemana === 6;
    }
    return false;
  }
  if (turno === "mar-jue-dom-nocturno") {
    if (horaCompleta >= (21 - margen)) {
      return diaSemana === 2 || diaSemana === 4 || diaSemana === 0;
    } else if (horaCompleta < 8) {
      return diaSemana === 3 || diaSemana === 5 || diaSemana === 1;
    }
    return false;
  }
  if (turno === "sab-dom-fest-dia") {
    return (diaSemana === 0 || diaSemana === 6) && horaCompleta >= (8 - margen) && horaCompleta < 20;
  }
  if (turno === "sab-dom-fest-nocturno") {
    if (horaCompleta >= (20 - margen)) {
      return diaSemana === 0 || diaSemana === 6;
    } else if (horaCompleta < 8) {
      return diaSemana === 0 || diaSemana === 1;
    }
    return false;
  }
  return false;
}

// Rutas de reportes

// getList y getMany
app.get("/reportes", verificarAutenticacion, async function(req, res) {
  try {
    const user = req.usuario;

    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      let sortOrder;
      if (req.query._order === "ASC") {
        sortOrder = 1;
      } else {
        sortOrder = -1;
      }
      const inicio = Number(req.query._start);
      const fin = Number(req.query._end);
      const sorter = {};
      sorter[sortBy] = sortOrder;
      let data = await db
        .collection("reportes")
        .find({})
        .sort(sorter)
        .project({ _id: 0 })
        .toArray();
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", data.length);
      data = data.slice(inicio, fin);
      log(user, "reportes", "leer");
      res.json(data);
    } else if ("id" in req.query) {
      let data = [];
      for (let index = 0; index < req.query.id.length; index = index + 1) {
        const dataParcial = await db
          .collection("reportes")
          .find({ id: Number(req.query.id[index]) })
          .project({ _id: 0 })
          .toArray();
        data = await data.concat(dataParcial);
      }
      res.json(data);
    } else {
      const data = await db
        .collection("reportes")
        .find(req.query)
        .project({ _id: 0 })
        .toArray();
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", data.length);
      res.json(data);
    }
  } catch (error) {
    console.error("Error en GET /reportes:", error);
    res.sendStatus(500);
  }
});

// getOne
app.get("/reportes/:id", verificarAutenticacion, async function(req, res) {
  try {
    const data = await db
      .collection("reportes")
      .find({ id: Number(req.params.id) })
      .project({ _id: 0 })
      .toArray();
    res.json(data[0]);
  } catch (error) {
    console.error("Error en GET /reportes/:id:", error);
    res.sendStatus(500);
  }
});

// createOne
app.post("/reportes", verificarAutenticacion, async function(req, res) {
  try {
    const valores = req.body;

    const ultimoReporte = await db
      .collection("reportes")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    if (ultimoReporte.length > 0) {
      valores["id"] = ultimoReporte[0].id + 1;
    } else {
      valores["id"] = 1;
    }
    valores["fechaCreacion"] = new Date();
    valores["creadoPor"] = req.usuario;

    delete valores["fechaModificacion"];
    delete valores["modificadoPor"];

    const data = await db.collection("reportes").insertOne(valores);
    log(req.usuario, "reportes", "crear");
    res.json(valores);
  } catch (error) {
    console.error("Error en POST /reportes:", error);
    res.sendStatus(500);
  }
});

// deleteOne
app.delete("/reportes/:id", verificarAutenticacion, async function(req, res) {
  try {
    const data = await db
      .collection("reportes")
      .deleteOne({ id: Number(req.params.id) });
    log(req.usuario, "reportes", "eliminar");
    res.json(data);
  } catch (error) {
    console.error("Error en DELETE /reportes/:id:", error);
    res.sendStatus(500);
  }
});

// updateOne
app.put("/reportes/:id", verificarAutenticacion, async function(req, res) {
  try {
    const valores = req.body;
    const reporteId = Number(req.params.id);

    // Usar el id del parametro de la URL
    valores["id"] = reporteId;
    valores["fechaModificacion"] = new Date();
    valores["modificadoPor"] = req.usuario;

    // Actualizar el reporte
    let data = await db
      .collection("reportes")
      .updateOne({ id: reporteId }, { $set: valores });

    // Buscar el reporte actualizado
    data = await db
      .collection("reportes")
      .find({ id: reporteId })
      .project({ _id: 0 })
      .toArray();

    // Validar que se encontro el reporte
    if (!data || !data[0]) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    log(req.usuario, "reportes", "actualizar");
    res.json(data[0]);
  } catch (error) {
    console.error("Error en PUT /reportes/:id:", error);
    res.status(500).json({ error: 'Error al actualizar reporte: ' + error.message });
  }
});

// Rutas de estadisticas

app.get("/estadisticas/dashboard", verificarAutenticacion, async function(req, res) {
  try {
    const reportes = await db.collection("reportes").find({}).toArray();

    const totalReportes = reportes.length;

    const motivosAtencion = {
      accidente: 0,
      enfermedad: 0,
      ginecoobstetrico: 0
    };

    const reportesPorSexo = {
      masculino: 0,
      femenino: 0
    };

    let reportesConTraslado = 0;
    let reportesSinTraslado = 0;

    for (let i = 0; i < reportes.length; i = i + 1) {
      const reporte = reportes[i];

      let motivo;
      if (reporte.datosServicio) {
        motivo = reporte.datosServicio.motivoAtencion;
      }
      if (motivo === "traumatismo" || motivo === "accidente") {
        motivosAtencion.accidente = motivosAtencion.accidente + 1;
      } else if (motivo === "enfermedad") {
        motivosAtencion.enfermedad = motivosAtencion.enfermedad + 1;
      } else if (motivo === "ginecoobstetrico") {
        motivosAtencion.ginecoobstetrico = motivosAtencion.ginecoobstetrico + 1;
      }

      let sexo;
      if (reporte.datosPaciente && reporte.datosPaciente.sexo) {
        sexo = reporte.datosPaciente.sexo.toLowerCase();
      }
      if (sexo === "masculino" || sexo === "hombre" || sexo === "m") {
        reportesPorSexo.masculino = reportesPorSexo.masculino + 1;
      } else if (sexo === "femenino" || sexo === "mujer" || sexo === "f") {
        reportesPorSexo.femenino = reportesPorSexo.femenino + 1;
      }

      let traslado;
      if (reporte.datosServicio) {
        traslado = reporte.datosServicio.traslado;
      }
      if (traslado === true || traslado === "si") {
        reportesConTraslado = reportesConTraslado + 1;
      } else {
        reportesSinTraslado = reportesSinTraslado + 1;
      }
    }

    const estadisticas = {
      totalReportes: totalReportes,
      motivosAtencion: motivosAtencion,
      reportesPorSexo: reportesPorSexo,
      reportesConTraslado: reportesConTraslado,
      reportesSinTraslado: reportesSinTraslado
    };

    res.json(estadisticas);
  } catch (error) {
    console.error("Error en GET /estadisticas/dashboard:", error);
    res.sendStatus(500);
  }
});

// Rutas de usuarios

// getList de usuarios
app.get("/usuarios", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const user = req.usuario;

    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      let sortOrder;
      if (req.query._order === "ASC") {
        sortOrder = 1;
      } else {
        sortOrder = -1;
      }
      const inicio = Number(req.query._start);
      const fin = Number(req.query._end);
      const sorter = {};
      sorter[sortBy] = sortOrder;
      let data = await db
        .collection("usuarios")
        .find({})
        .sort(sorter)
        .project({ password: 0 })
        .toArray();

      const newData = [];
      for (let i = 0; i < data.length; i = i + 1) {
        const usuario = data[i];
        const newUsuario = {
          usuario: usuario.usuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
          turno: usuario.turno,
          fechaCreacion: usuario.fechaCreacion,
          fechaModificacion: usuario.fechaModificacion,
          id: usuario._id.toString(),
          createdAt: usuario.fechaCreacion,
          updatedAt: usuario.fechaModificacion || usuario.fechaCreacion
        };
        newData.push(newUsuario);
      }

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", newData.length);
      const slicedData = newData.slice(inicio, fin);
      log(user, "usuarios", "leer");
      res.json(slicedData);
    } else if ("id" in req.query) {
      let data = [];
      for (let index = 0; index < req.query.id.length; index = index + 1) {
        const dataParcial = await db
          .collection("usuarios")
          .find({ _id: new ObjectId(req.query.id[index]) })
          .project({ password: 0 })
          .toArray();
        data = await data.concat(dataParcial);
      }
      const newData = [];
      for (let i = 0; i < data.length; i = i + 1) {
        const usuario = data[i];
        const newUsuario = {
          usuario: usuario.usuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
          turno: usuario.turno,
          fechaCreacion: usuario.fechaCreacion,
          fechaModificacion: usuario.fechaModificacion,
          id: usuario._id.toString(),
          createdAt: usuario.fechaCreacion,
          updatedAt: usuario.fechaModificacion || usuario.fechaCreacion
        };
        newData.push(newUsuario);
      }
      res.json(newData);
    } else {
      const data = await db
        .collection("usuarios")
        .find(req.query)
        .project({ password: 0 })
        .toArray();
      const newData = [];
      for (let i = 0; i < data.length; i = i + 1) {
        const usuario = data[i];
        const newUsuario = {
          usuario: usuario.usuario,
          nombre: usuario.nombre,
          rol: usuario.rol,
          turno: usuario.turno,
          fechaCreacion: usuario.fechaCreacion,
          fechaModificacion: usuario.fechaModificacion,
          id: usuario._id.toString(),
          createdAt: usuario.fechaCreacion,
          updatedAt: usuario.fechaModificacion || usuario.fechaCreacion
        };
        newData.push(newUsuario);
      }
      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", newData.length);
      res.json(newData);
    }
  } catch (error) {
    console.error("Error en GET /usuarios:", error);
    res.sendStatus(500);
  }
});

// Obtener perfil del usuario autenticado
app.get("/usuarios/perfil", verificarAutenticacion, async function(req, res) {
  try {
    const usuario = req.usuario;
    const rol = req.rol;

    const data = await db.collection("usuarios").findOne(
      { usuario: usuario },
      { projection: { _id: 0, password: 0 } }
    );

    if (!data) {
      return res.sendStatus(404);
    }

    const turnoInfo = obtenerInfoTurno(data.turno);
    const permisos = obtenerPermisos(rol);

    const perfil = {
      id: data.usuario,
      usuario: data.usuario,
      nombre: data.nombre,
      rol: data.rol,
      turno: data.turno,
      turnoInfo: turnoInfo,
      permisos: permisos,
      createdAt: data.fechaCreacion,
      updatedAt: data.fechaModificacion || data.fechaCreacion
    };

    res.json(perfil);
  } catch (error) {
    console.error("Error en GET /usuarios/perfil:", error);
    res.sendStatus(500);
  }
});

// getOne de usuario
app.get("/usuarios/:id", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const data = await db
      .collection("usuarios")
      .find({ _id: new ObjectId(req.params.id) })
      .project({ password: 0 })
      .toArray();
    if (data[0]) {
      data[0].id = data[0]._id.toString();
      data[0].createdAt = data[0].fechaCreacion;
      if (data[0].fechaModificacion) {
        data[0].updatedAt = data[0].fechaModificacion;
      } else {
        data[0].updatedAt = data[0].fechaCreacion;
      }
    }
    res.json(data[0]);
  } catch (error) {
    console.error("Error en GET /usuarios/:id:", error);
    res.status(500).json({ error: 'Error al obtener usuario: ' + error.message });
  }
});

// Funcion auxiliar para obtener informacion del turno
function obtenerInfoTurno(turno) {
  const turnos = {
    administrador: {
      nombre: "Administrador (Sin restricciones)",
      horario: { inicio: "00:00", fin: "23:59" },
      dias: [0, 1, 2, 3, 4, 5, 6],
      cruzaMedianoche: false,
      incluyeFestivos: true
    },
    autoridad: {
      nombre: "Autoridad (Sin restricciones)",
      horario: { inicio: "00:00", fin: "23:59" },
      dias: [0, 1, 2, 3, 4, 5, 6],
      cruzaMedianoche: false,
      incluyeFestivos: true
    },
    "lun-vie-matutino": {
      nombre: "Lun-Vie (matutino)",
      horario: { inicio: "08:00", fin: "15:00" },
      dias: [1, 2, 3, 4, 5],
      cruzaMedianoche: false,
      incluyeFestivos: false
    },
    "lun-vie-vespertino": {
      nombre: "Lun-Vie (vespertino)",
      horario: { inicio: "15:00", fin: "21:00" },
      dias: [1, 2, 3, 4, 5],
      cruzaMedianoche: false,
      incluyeFestivos: false
    },
    "lun-mie-vie-nocturno": {
      nombre: "Lun, Mie, Vie (nocturno)",
      horario: { inicio: "21:00", fin: "08:00" },
      dias: [1, 3, 5],
      cruzaMedianoche: true,
      incluyeFestivos: false
    },
    "mar-jue-dom-nocturno": {
      nombre: "Mar, Jue, Dom (nocturno)",
      horario: { inicio: "21:00", fin: "08:00" },
      dias: [2, 4, 0],
      cruzaMedianoche: true,
      incluyeFestivos: false
    },
    "sab-dom-fest-dia": {
      nombre: "Sab, Dom, Festivos (dia)",
      horario: { inicio: "08:00", fin: "20:00" },
      dias: [0, 6],
      cruzaMedianoche: false,
      incluyeFestivos: true
    },
    "sab-dom-fest-nocturno": {
      nombre: "Sab, Dom, Festivos (nocturno)",
      horario: { inicio: "20:00", fin: "08:00" },
      dias: [0, 6],
      cruzaMedianoche: true,
      incluyeFestivos: true
    }
  };

  if (turnos[turno]) {
    return turnos[turno];
  } else {
    return null;
  }
}

// Funcion auxiliar para obtener permisos basados en el rol
function obtenerPermisos(rol) {
  const permisosRoles = {
    paramedico: {
      reportes: ["create"]
    },
    jefe_turno: {
      reportes: ["create", "read"]
    },
    autoridad: {
      reportes: ["read"],
      dashboard: ["read"]
    },
    administrador: {
      reportes: ["create", "read", "update", "delete"],
      usuarios: ["create", "read", "update", "delete"],
      dashboard: ["read"]
    }
  };

  if (permisosRoles[rol]) {
    return permisosRoles[rol];
  } else {
    return {};
  }
}

// Login
app.post("/usuarios/login", loginLimiter, async function(req, res) {
  try {
    const user = req.body.username;
    const pass = req.body.password;

    const data = await db.collection("usuarios").findOne({ usuario: user });

    if (data === null) {
      return res.sendStatus(401);
    }

    const passwordVerified = await argon2.verify(data.password, pass);
    if (passwordVerified) {
      let enTurno;
      if (data.rol === "administrador" || data.rol === "autoridad") {
        enTurno = true;
      } else {
        enTurno = verificarTurno(data.turno);
      }

      const turnoDetalle = obtenerInfoTurno(data.turno);

      const token = jwt.sign(
        { usuario: data.usuario, rol: data.rol },
        process.env.JWTKEY,
        { expiresIn: 28800 }
      );

      log(user, "login", "autenticacion");
      res.json({
        token: token,
        id: data.usuario,
        usuario: data.usuario,
        rol: data.rol,
        turno: data.turno,
        enTurno: enTurno,
        turnoInfo: turnoDetalle
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error("Error en POST /usuarios/login:", error);
    res.sendStatus(500);
  }
});

// Crear usuario
app.post("/usuarios", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const usuario = req.body.usuario;
    let pass = req.body.password;
    if (!pass) {
      pass = req.body.contrasena;
    }
    let nombre = req.body.nombre;
    if (!nombre) {
      nombre = req.body.usuario;
    }
    const rol = req.body.rol;
    const turno = req.body.turno;

    // Validar campos requeridos
    if (!usuario) {
      return res.status(400).json({ error: 'El campo usuario es requerido' });
    }
    if (!pass) {
      return res.status(400).json({ error: 'El campo password o contrasena es requerido' });
    }
    if (!rol) {
      return res.status(400).json({ error: 'El campo rol es requerido' });
    }
    if (!turno) {
      return res.status(400).json({ error: 'El campo turno es requerido' });
    }

    // Verificar si el usuario ya existe
    const data = await db.collection("usuarios").findOne({ usuario: usuario });

    if (data !== null) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hash = await argon2.hash(pass, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
      saltLength: 16
    });

    const usuarioAgregar = {
      usuario: usuario,
      password: hash,
      nombre: nombre,
      rol: rol,
      turno: turno,
      fechaCreacion: new Date()
    };

    const result = await db.collection("usuarios").insertOne(usuarioAgregar);
    log(req.usuario, "usuarios", "crear");

    delete usuarioAgregar.password;
    usuarioAgregar.id = result.insertedId.toString();
    usuarioAgregar.createdAt = usuarioAgregar.fechaCreacion;
    usuarioAgregar.updatedAt = usuarioAgregar.fechaCreacion;
    res.status(201).json(usuarioAgregar);
  } catch (error) {
    console.error("Error en POST /usuarios:", error);
    res.status(500).json({ error: 'Error al crear usuario: ' + error.message });
  }
});

// Actualizar usuario
app.put("/usuarios/:id", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const valores = req.body;
    const usuarioId = req.params.id;

    // El ID que viene es el _id de MongoDB
    let filtro = { _id: new ObjectId(usuarioId) };

    // Eliminar campos que no deben actualizarse
    delete valores._id;
    delete valores.id;
    delete valores.createdAt;
    delete valores.updatedAt;
    delete valores.fechaCreacion;

    let newPassword = valores.password;
    if (!newPassword) {
      newPassword = valores.contrasena;
    }
    if (newPassword) {
      const hash = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism: 1,
        saltLength: 16
      });
      valores.password = hash;
      delete valores.contrasena;
    } else {
      delete valores.password;
      delete valores.contrasena;
    }

    valores["fechaModificacion"] = new Date();

    let data = await db
      .collection("usuarios")
      .updateOne(filtro, { $set: valores });

    // Buscar el usuario actualizado (sin excluir _id, solo password)
    data = await db
      .collection("usuarios")
      .find(filtro)
      .project({ password: 0 })
      .toArray();

    if (!data || !data[0]) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear la respuesta
    data[0].id = data[0]._id.toString();
    data[0].createdAt = data[0].fechaCreacion;
    if (data[0].fechaModificacion) {
      data[0].updatedAt = data[0].fechaModificacion;
    } else {
      data[0].updatedAt = data[0].fechaCreacion;
    }

    log(req.usuario, "usuarios", "actualizar");
    res.json(data[0]);
  } catch (error) {
    console.error("Error en PUT /usuarios/:id:", error);
    res.status(500).json({ error: 'Error al actualizar usuario: ' + error.message });
  }
});

// Eliminar usuario
app.delete("/usuarios/:id", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    // Primero obtener el usuario antes de eliminarlo para devolverlo
    const usuarioAEliminar = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });

    if (!usuarioAEliminar) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el usuario usando el _id de MongoDB
    const resultado = await db
      .collection("usuarios")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear la respuesta con el usuario eliminado
    usuarioAEliminar.id = usuarioAEliminar._id.toString();
    usuarioAEliminar.createdAt = usuarioAEliminar.fechaCreacion;
    usuarioAEliminar.updatedAt = usuarioAEliminar.fechaModificacion || usuarioAEliminar.fechaCreacion;

    log(req.usuario, "usuarios", "eliminar");
    res.json(usuarioAEliminar);
  } catch (error) {
    console.error("Error en DELETE /usuarios/:id:", error);
    res.status(500).json({ error: 'Error al eliminar usuario: ' + error.message });
  }
});

// Rutas de historial

// getList de logs
app.get("/log", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const user = req.usuario;

    if ("_sort" in req.query) {
      const sortBy = req.query._sort;
      let sortOrder;
      if (req.query._order === "ASC") {
        sortOrder = 1;
      } else {
        sortOrder = -1;
      }
      const inicio = Number(req.query._start);
      const fin = Number(req.query._end);
      const sorter = {};
      sorter[sortBy] = sortOrder;

      let data = await db
        .collection("log")
        .find({})
        .sort(sorter)
        .project({ _id: 0 })
        .toArray();

      const newData = [];
      for (let index = 0; index < data.length; index = index + 1) {
        const logEntry = data[index];
        let logId;
        if (logEntry.timestamp) {
          logId = logEntry.timestamp.getTime().toString();
        } else {
          logId = index.toString();
        }
        const newLogEntry = {
          id: logId,
          timestamp: logEntry.timestamp,
          sujeto: logEntry.sujeto,
          objeto: logEntry.objeto,
          accion: logEntry.accion
        };
        newData.push(newLogEntry);
      }

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", newData.length);
      const slicedData = newData.slice(inicio, fin);
      res.json(slicedData);
    } else if ("id" in req.query) {
      let data = [];
      for (let index = 0; index < req.query.id.length; index = index + 1) {
        const dataParcial = await db
          .collection("log")
          .find({ timestamp: new Date(Number(req.query.id[index])) })
          .project({ _id: 0 })
          .toArray();
        data = await data.concat(dataParcial);
      }
      const newData = [];
      for (let i = 0; i < data.length; i = i + 1) {
        const logEntry = data[i];
        let logId;
        if (logEntry.timestamp) {
          logId = logEntry.timestamp.getTime().toString();
        } else {
          logId = Math.random().toString();
        }
        const newLogEntry = {
          id: logId,
          timestamp: logEntry.timestamp,
          sujeto: logEntry.sujeto,
          objeto: logEntry.objeto,
          accion: logEntry.accion
        };
        newData.push(newLogEntry);
      }
      res.json(newData);
    } else {
      const data = await db
        .collection("log")
        .find(req.query)
        .project({ _id: 0 })
        .toArray();

      const newData = [];
      for (let i = 0; i < data.length; i = i + 1) {
        const logEntry = data[i];
        let logId;
        if (logEntry.timestamp) {
          logId = logEntry.timestamp.getTime().toString();
        } else {
          logId = Math.random().toString();
        }
        const newLogEntry = {
          id: logId,
          timestamp: logEntry.timestamp,
          sujeto: logEntry.sujeto,
          objeto: logEntry.objeto,
          accion: logEntry.accion
        };
        newData.push(newLogEntry);
      }

      res.set("Access-Control-Expose-Headers", "X-Total-Count");
      res.set("X-Total-Count", newData.length);
      res.json(newData);
    }
  } catch (error) {
    console.error("Error en GET /log:", error);
    res.sendStatus(500);
  }
});

// getOne de log
app.get("/log/:id", verificarAutenticacion, async function(req, res) {
  try {
    if (req.rol !== "administrador") {
      return res.sendStatus(403);
    }

    const timestamp = new Date(Number(req.params.id));

    const data = await db
      .collection("log")
      .find({ timestamp: timestamp })
      .project({ _id: 0 })
      .toArray();

    if (data[0]) {
      data[0].id = data[0].timestamp.getTime().toString();
    }

    res.json(data[0]);
  } catch (error) {
    console.error("Error en GET /log/:id:", error);
    res.sendStatus(500);
  }
});

// Conexion a base de datos

async function connectToDB() {
  try {
    const client = new MongoClient(process.env.DB);
    await client.connect();
    db = client.db();
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
}

// Iniciar servidor

async function iniciarServidor() {
  // Cargar variables de entorno
  if (fs.existsSync(".env")) {
    await process.loadEnvFile(".env");
  } else {
    console.error("Archivo .env no encontrado");
    process.exit(1);
  }

  // Conectar a base de datos
  await connectToDB();

  // Iniciar servidor HTTP (para compatibilidad)
  app.listen(PORT, function() {
    console.log("Servidor HTTP corriendo en puerto " + PORT);
    console.log("API disponible en http://localhost:" + PORT);
  });

  // Iniciar servidor HTTPS si existen los certificados
  const certPath = "./ssl/server.crt";
  const keyPath = "./ssl/server.key";

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    const opciones = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };

    https.createServer(opciones, app).listen(HTTPS_PORT, function() {
      console.log("Servidor HTTPS corriendo en puerto " + HTTPS_PORT);
      console.log("API segura disponible en https://localhost:" + HTTPS_PORT);
    });
  } else {
    console.log("Certificados SSL no encontrados en carpeta ssl/");
    console.log("Solo se inicio servidor HTTP. Para HTTPS, genera certificados:");
    console.log("  ./generar-certificados.sh");
  }
}

iniciarServidor();
