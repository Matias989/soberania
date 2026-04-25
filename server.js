const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const HOME_FILE = 'soberania_cognitiva_web_design.html';
const MAINTENANCE_FILE = 'maintenance.html';
const MAINTENANCE_MODE = ['1', 'true', 'yes', 'on'].includes(
  String(process.env.MAINTENANCE_MODE || '').toLowerCase()
);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requestedPath = cleanPath === '/' ? HOME_FILE : cleanPath.replace(/^\/+/, '');
  const filePath = path.join(PUBLIC_DIR, requestedPath);
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((req, res) => {
  const filePath = MAINTENANCE_MODE
    ? path.join(PUBLIC_DIR, MAINTENANCE_FILE)
    : resolveRequestPath(req.url || '/');

  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const statusCode = MAINTENANCE_MODE ? 503 : 200;
    const cacheControl = MAINTENANCE_MODE ? 'no-store' : 'public, max-age=300';

    res.writeHead(statusCode, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': cacheControl
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(
    `Soberania site running on port ${PORT}${MAINTENANCE_MODE ? ' (maintenance mode ON)' : ''}`
  );
});
