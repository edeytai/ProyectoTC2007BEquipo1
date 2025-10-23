// Script de seed para EmergenciasUrbanas
// Este script pobla la base de datos con datos iniciales:
// - 5 usuarios de prueba (uno de cada rol)
// - 5 incidentes de ejemplo
// Uso: node seed.js

const MongoClient = require("mongodb").MongoClient;
const argon2 = require("argon2");

require('fs').existsSync('.env') && require('child_process').execSync('node -p "require(\'fs\').readFileSync(\'.env\',\'utf8\')"').toString().split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) process.env[key] = values.join('=');
});

async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
    saltLength: 16
  });
}

async function seed() {
  console.log(" Iniciando seed de la base de datos...\n");

  try {
    // Conectar a MongoDB
    const DB_URL = process.env.DB || "mongodb://localhost:27017/emergencias_urbanas";
    console.log(" Conectando a:", DB_URL);

    const client = new MongoClient(DB_URL);
    await client.connect();
    const db = client.db();
    console.log(" Conectado a MongoDB\n");

    console.log("  Limpiando colecciones...");
    await db.collection("users").deleteMany({});
    await db.collection("incidents").deleteMany({});
    await db.collection("logs").deleteMany({});
    console.log(" Colecciones limpiadas\n");

    console.log(" Creando usuarios...");

    const usuarios = [
      {
        id: "b1",
        username: "brigadista1",
        password: await hashPassword("brigadista123"),
        fullName: "Juan Pérez García",
        email: "juan.perez@cuajimalpa.cdmx.gob.mx",
        role: "brigadista",
        department: "proteccion_civil",
        phone: "555-1234-001",
        active: true,
        createdAt: new Date("2024-01-01").toISOString()
      },
      {
        id: "b2",
        username: "brigadista2",
        password: await hashPassword("brigadista123"),
        fullName: "María Rodríguez López",
        email: "maria.rodriguez@cuajimalpa.cdmx.gob.mx",
        role: "brigadista",
        department: "bomberos",
        phone: "555-1234-002",
        active: true,
        createdAt: new Date("2024-01-01").toISOString()
      },
      {
        id: "c1",
        username: "coordinador1",
        password: await hashPassword("coordinador123"),
        fullName: "Carlos Martínez Díaz",
        email: "carlos.martinez@cuajimalpa.cdmx.gob.mx",
        role: "coordinador",
        department: "proteccion_civil",
        phone: "555-1234-100",
        active: true,
        createdAt: new Date("2024-01-01").toISOString()
      },
      {
        id: "a1",
        username: "autoridad1",
        password: await hashPassword("autoridad123"),
        fullName: "Ana Hernández Silva",
        email: "ana.hernandez@cuajimalpa.cdmx.gob.mx",
        role: "autoridad",
        department: "administracion",
        phone: "555-1234-200",
        active: true,
        createdAt: new Date("2024-01-01").toISOString()
      },
      {
        id: "admin",
        username: "admin",
        password: await hashPassword("admin123"),
        fullName: "Administrador Sistema",
        email: "admin@cuajimalpa.cdmx.gob.mx",
        role: "admin",
        department: "administracion",
        phone: "555-1234-999",
        active: true,
        createdAt: new Date("2024-01-01").toISOString()
      }
    ];

    await db.collection("users").insertMany(usuarios);
    console.log(` ${usuarios.length} usuarios creados\n`);

    console.log(" Creando incidentes...");

    const incidentes = [
      {
        id: "1",
        solicitudMitigacion: "SM-2024-001",
        fecha: "2024-01-15",
        hora: "10:30",
        turno: "matutino",
        modoActivacion: "llamada",
        personalACargo: "Juan Pérez García",
        horaAtencion: "10:45",
        tiempoTrasladoMin: 15,
        kmsRecorridos: 8.5,
        ubicacion: {
          lat: 19.3563,
          lng: -99.2842,
          calle: "Av. José María Castorena 375",
          colonia: "Cuajimalpa",
          referencias: "Cerca del parque central"
        },
        nivelGravedad: "media",
        trabajosRealizados: ["Retiro de escombros", "Acordonamiento de área"],
        observaciones: "Se atendió emergencia por inundación en vía pública",
        conclusionDictamen: "Emergencia controlada sin riesgos adicionales",
        dependencias: ["Protección Civil", "Obras Públicas"],
        autoridadesIntervinientes: ["Alcaldía Cuajimalpa"],
        responsableInmueble: "N/A",
        tipoEmergencia: "inundacion",
        estadoReporte: "aprobado",
        createdBy: "brigadista1",
        createdAt: new Date("2024-01-15T10:30:00Z").toISOString(),
        updatedAt: new Date("2024-01-15T12:00:00Z").toISOString()
      },
      {
        id: "2",
        solicitudMitigacion: "SM-2024-002",
        fecha: "2024-01-16",
        hora: "14:20",
        turno: "vespertino",
        modoActivacion: "oficio",
        personalACargo: "María Rodríguez López",
        horaAtencion: "14:35",
        tiempoTrasladoMin: 20,
        kmsRecorridos: 12,
        ubicacion: {
          lat: 19.3621,
          lng: -99.2915,
          calle: "Prolongación Reforma 1120",
          colonia: "Santa Fe",
          referencias: "Torre corporativa"
        },
        nivelGravedad: "alta",
        trabajosRealizados: ["Evacuación preventiva", "Evaluación estructural"],
        observaciones: "Incendio en piso 5 del edificio, controlado por bomberos",
        conclusionDictamen: "Se requiere revisión estructural completa",
        dependencias: ["Protección Civil", "Bomberos"],
        autoridadesIntervinientes: ["Alcaldía Cuajimalpa", "CDMX"],
        responsableInmueble: "Administración Torre A",
        tipoEmergencia: "incendio",
        estadoReporte: "en_revision",
        createdBy: "brigadista2",
        createdAt: new Date("2024-01-16T14:20:00Z").toISOString(),
        updatedAt: new Date("2024-01-16T16:00:00Z").toISOString()
      },
      {
        id: "3",
        solicitudMitigacion: "SM-2024-003",
        fecha: "2024-01-17",
        hora: "08:00",
        turno: "matutino",
        modoActivacion: "llamada",
        personalACargo: "Juan Pérez García",
        horaAtencion: "08:15",
        tiempoTrasladoMin: 10,
        kmsRecorridos: 5,
        ubicacion: {
          lat: 19.3545,
          lng: -99.2801,
          calle: "Camino Real al Yaqui",
          colonia: "El Yaqui",
          referencias: "Esquina con calle Jacarandas"
        },
        nivelGravedad: "baja",
        trabajosRealizados: ["Retiro de árbol caído"],
        observaciones: "Árbol caído por vientos fuertes, sin daños a propiedades",
        conclusionDictamen: "Vialidad despejada",
        dependencias: ["Protección Civil"],
        autoridadesIntervinientes: ["Alcaldía Cuajimalpa"],
        responsableInmueble: "N/A",
        tipoEmergencia: "otro",
        estadoReporte: "draft",
        createdBy: "brigadista1",
        createdAt: new Date("2024-01-17T08:00:00Z").toISOString()
      },
      {
        id: "4",
        solicitudMitigacion: "SM-2024-004",
        fecha: "2024-01-18",
        hora: "11:00",
        turno: "matutino",
        modoActivacion: "llamada",
        personalACargo: "Juan Pérez García",
        horaAtencion: "11:15",
        tiempoTrasladoMin: 12,
        kmsRecorridos: 7,
        ubicacion: {
          lat: 19.3580,
          lng: -99.2860,
          calle: "Av. Veracruz 60",
          colonia: "Cuajimalpa",
          referencias: "Frente al mercado"
        },
        nivelGravedad: "media",
        trabajosRealizados: ["Evacuación preventiva", "Evaluación de daños"],
        observaciones: "Fuga de gas en vivienda particular, atendida por bomberos",
        conclusionDictamen: "Situación controlada",
        dependencias: ["Protección Civil", "Bomberos"],
        autoridadesIntervinientes: ["Alcaldía Cuajimalpa"],
        responsableInmueble: "Propietario del inmueble",
        tipoEmergencia: "fuga",
        estadoReporte: "en_revision",
        createdBy: "brigadista1",
        createdAt: new Date("2024-01-18T11:00:00Z").toISOString(),
        updatedAt: new Date("2024-01-18T12:30:00Z").toISOString()
      },
      {
        id: "5",
        solicitudMitigacion: "SM-2024-005",
        fecha: "2024-01-19",
        hora: "16:45",
        turno: "vespertino",
        modoActivacion: "oficio",
        personalACargo: "María Rodríguez López",
        horaAtencion: "17:00",
        tiempoTrasladoMin: 25,
        kmsRecorridos: 15,
        ubicacion: {
          lat: 19.3600,
          lng: -99.2900,
          calle: "Carretera México-Toluca km 13",
          colonia: "Contadero",
          referencias: "Curva peligrosa"
        },
        nivelGravedad: "alta",
        trabajosRealizados: ["Rescate de víctimas", "Acordonamiento", "Evaluación estructural"],
        observaciones: "Socavón en carretera principal, 2 vehículos afectados",
        conclusionDictamen: "Se requiere cierre temporal de la vialidad",
        dependencias: ["Protección Civil", "Obras Públicas", "SSC"],
        autoridadesIntervinientes: ["Alcaldía Cuajimalpa", "Gobierno CDMX"],
        responsableInmueble: "N/A",
        tipoEmergencia: "socavon",
        estadoReporte: "aprobado",
        createdBy: "brigadista2",
        createdAt: new Date("2024-01-19T16:45:00Z").toISOString(),
        updatedAt: new Date("2024-01-19T20:00:00Z").toISOString()
      }
    ];

    await db.collection("incidents").insertMany(incidentes);
    console.log(` ${incidentes.length} incidentes creados\n`);

    await db.collection("logs").insertOne({
      timestamp: new Date(),
      sujeto: "sistema",
      objeto: "seed",
      accion: "seed_inicial_completado"
    });

    console.log(" Seed completado exitosamente!\n");
    console.log(" Resumen:");
    console.log(`   - Usuarios: ${usuarios.length}`);
    console.log(`   - Incidentes: ${incidentes.length}`);
    console.log("\nCredenciales de prueba:");
    console.log("   brigadista1 / brigadista123");
    console.log("   coordinador1 / coordinador123");
    console.log("   autoridad1 / autoridad123");
    console.log("   admin / admin123");

    await client.close();
    console.log("\n Desconectado de MongoDB");

  } catch (error) {
    console.error("\n Error durante el seed:", error);
    process.exit(1);
  }
}

seed();
