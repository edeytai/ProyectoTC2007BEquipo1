#!/usr/bin/env node

/*
Servidor web estático con soporte HTTPS para el frontend

El frontend de React necesita servirse a través de HTTPS para que el navegador
permita la comunicación con el backend (que también usa HTTPS). Si el frontend
estuviera en HTTP, el navegador bloquearía las peticiones por mixed content.

Este servidor hace básicamente lo mismo que 'serve' o 'http-server', pero
con la ventaja de que puede usar los mismos certificados SSL del backend,
manteniendo toda la comunicación segura.

Uso: node serve-frontend-https.js
*/

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5174;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

function requestHandler(req, res) {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

  // Para SPAs con react-router
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  serveFile(filePath, res);
}

let server;
const keyPath = path.join(__dirname, 'backend.key');
const certPath = path.join(__dirname, 'backend.crt');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  server = https.createServer(options, requestHandler);
  console.log('Servidor HTTPS iniciado');
  console.log('Archivos en: ' + DIST_DIR);
  console.log('URL: https://localhost:' + PORT);
} else {
  // Si no hay certificados, usar HTTP como fallback
  server = http.createServer(requestHandler);
  console.log('ADVERTENCIA: Certificados no encontrados, usando HTTP');
  console.log('Archivos en: ' + DIST_DIR);
  console.log('URL: http://localhost:' + PORT);
}

server.listen(PORT, () => {
  console.log('Puerto: ' + PORT);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('Error: El puerto ' + PORT + ' ya esta en uso');
  } else {
    console.error('Error al iniciar servidor:', err);
  }
  process.exit(1);
});
