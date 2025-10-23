/*
Sistema de respaldos automaticos (RNF6)
Implementa backups periodicos de la base de datos MongoDB usando mongodump
Rotacion automatica: mantiene solo los ultimos 7 dias de backups
Instalacion: https://www.mongodb.com/try/download/database-tools
*/

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'backups');
const RETENTION_DAYS = 7;

/*
Ejecuta el respaldo de la base de datos
Parametros: db (Object) - Instancia de conexion a MongoDB (opcional, para logs)
Retorna: Promise<string> con ruta del backup creado
*/
async function executeBackup(db = null) {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = path.join(BACKUP_DIR, `backup_${timestamp}`);
    const dbUri = process.env.DB || 'mongodb://localhost:27017/emergencias_urbanas';
    const command = `mongodump --uri="${dbUri}" --out="${backupPath}"`;

    console.log(`Backup iniciado: ${backupPath}`);

    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error al ejecutar backup: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr && !stderr.includes('done dumping')) {
          console.warn(`Advertencias durante backup: ${stderr}`);
        }
        console.log('Backup completado');
        resolve(stdout);
      });
    });

    if (db) {
      try {
        await db.collection('logs').insertOne({
          timestamp: new Date(),
          sujeto: 'sistema',
          objeto: 'backup',
          accion: `backup_automatico_creado_${timestamp}`
        });
      } catch (logError) {
        console.warn('No se pudo registrar backup en logs:', logError.message);
      }
    }

    await cleanOldBackups();

    return backupPath;

  } catch (error) {
    console.error('Error durante el proceso de backup:', error);
    throw error;
  }
}

// Elimina backups mas antiguos que RETENTION_DAYS dias
async function cleanOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const now = Date.now();
    const maxAge = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    let deletedCount = 0;

    for (const file of files) {
      if (!file.startsWith('backup_')) continue;

      const filePath = path.join(BACKUP_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAge) {
        await fs.rm(filePath, { recursive: true, force: true });
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`Backups antiguos eliminados: ${deletedCount}`);
    }

  } catch (error) {
    console.error('Error al limpiar backups antiguos:', error.message);
  }
}

/*
Inicializa el sistema de backups
Parametros: db (Object) - Instancia de conexion a MongoDB
Parametros: immediate (boolean) - Si es true, ejecuta un backup inmediatamente
*/
async function initializeBackupSystem(db = null, immediate = false) {

  if (immediate) {
    try {
      await executeBackup(db);
    } catch (error) {
      console.error('Error en backup inicial:', error.message);
    }
  }
}

module.exports = {
  executeBackup,
  cleanOldBackups,
  initializeBackupSystem,
  BACKUP_DIR,
  RETENTION_DAYS
};
