/*
Utilidades de cifrado para datos sensibles
Implementa cifrado AES-256-GCM para proteger PII (Personally Identifiable Information)
y datos sensibles almacenados en la base de datos
*/

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/*
Deriva una clave de cifrado de 32 bytes (256 bits) desde la clave maestra
Parametros: password (string) - Clave maestra desde variable de entorno
Parametros: salt (Buffer) - Salt para derivacion
Retorna: Buffer con clave derivada de 32 bytes
*/
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

/*
Cifra un texto usando AES-256-GCM
Parametros: text (string) - Texto a cifrar
Retorna: string con texto cifrado en formato salt:iv:authTag:encrypted (hex)
*/
function encrypt(text) {
  if (!text || text === '') {
    return text;
  }

  const masterKey = process.env.ENCRYPTION_KEY;
  if (!masterKey) {
    throw new Error('ENCRYPTION_KEY no esta definida en las variables de entorno');
  }

  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(masterKey, salt);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error('Error al cifrar el dato');
  }
}

/*
Descifra un texto cifrado con AES-256-GCM
Parametros: encryptedData (string) - Texto cifrado en formato salt:iv:authTag:encrypted
Retorna: string con texto descifrado
*/
function decrypt(encryptedData) {
  if (!encryptedData || encryptedData === '') {
    return encryptedData;
  }

  if (!encryptedData.includes(':')) {
    return encryptedData;
  }

  const masterKey = process.env.ENCRYPTION_KEY;
  if (!masterKey) {
    throw new Error('ENCRYPTION_KEY no esta definida en las variables de entorno');
  }

  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('Formato de dato cifrado invalido');
    }

    const salt = Buffer.from(parts[0], 'hex');
    const iv = Buffer.from(parts[1], 'hex');
    const authTag = Buffer.from(parts[2], 'hex');
    const encrypted = parts[3];

    const key = deriveKey(masterKey, salt);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error al descifrar:', error.message);
    return encryptedData;
  }
}

/*
Cifra los campos sensibles de un objeto de usuario
Parametros: user (Object) - Objeto de usuario
Retorna: Object con usuario con campos cifrados
*/
function encryptUserSensitiveData(user) {
  const encryptedUser = { ...user };

  if (encryptedUser.email) {
    encryptedUser.email = encrypt(encryptedUser.email);
  }

  if (encryptedUser.phone) {
    encryptedUser.phone = encrypt(encryptedUser.phone);
  }

  if (encryptedUser.fullName) {
    encryptedUser.fullName = encrypt(encryptedUser.fullName);
  }

  return encryptedUser;
}

/*
Descifra los campos sensibles de un objeto de usuario
Parametros: user (Object) - Objeto de usuario con campos cifrados
Retorna: Object con usuario con campos descifrados
*/
function decryptUserSensitiveData(user) {
  if (!user) return user;

  const decryptedUser = { ...user };

  if (decryptedUser.email) {
    decryptedUser.email = decrypt(decryptedUser.email);
  }

  if (decryptedUser.phone) {
    decryptedUser.phone = decrypt(decryptedUser.phone);
  }

  if (decryptedUser.fullName) {
    decryptedUser.fullName = decrypt(decryptedUser.fullName);
  }

  return decryptedUser;
}

// Cifra los campos sensibles de un objeto de incidente
// Parametros: incident (Object) - Objeto de incidente
// Retorna: Object con incidente con campos cifrados
function encryptIncidentSensitiveData(incident) {
  const encryptedIncident = { ...incident };

  if (encryptedIncident.responsableInmueble) {
    encryptedIncident.responsableInmueble = encrypt(encryptedIncident.responsableInmueble);
  }

  if (encryptedIncident.observaciones) {
    encryptedIncident.observaciones = encrypt(encryptedIncident.observaciones);
  }

  return encryptedIncident;
}

// Descifra los campos sensibles de un objeto de incidente
// Parametros: incident (Object) - Objeto de incidente con campos cifrados
// Retorna: Object con incidente con campos descifrados
function decryptIncidentSensitiveData(incident) {
  if (!incident) return incident;

  const decryptedIncident = { ...incident };

  if (decryptedIncident.responsableInmueble) {
    decryptedIncident.responsableInmueble = decrypt(decryptedIncident.responsableInmueble);
  }

  if (decryptedIncident.observaciones) {
    decryptedIncident.observaciones = decrypt(decryptedIncident.observaciones);
  }

  return decryptedIncident;
}

module.exports = {
  encrypt,
  decrypt,
  encryptUserSensitiveData,
  decryptUserSensitiveData,
  encryptIncidentSensitiveData,
  decryptIncidentSensitiveData
};
