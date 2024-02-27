const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[3] || 1313;
const publicDir = process.argv[2] || './public';

const server = http.createServer((req, res) => {
  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200);
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
