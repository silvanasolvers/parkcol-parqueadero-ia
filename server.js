const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'public');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, 'index.html'), (fallbackErr, fallback) => {
        if (fallbackErr) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(fallback);
      });
      return;
    }
    res.writeHead(200, {'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream'});
    res.end(data);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => console.log(`Parkcol experience running on ${port}`));
