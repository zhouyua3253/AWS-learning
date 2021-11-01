const http = require('http');

const server = http.createServer(function (req, res) {
  const currentIp = Object.values(require("os").networkInterfaces())
    .flat()
    .find((item) => !item.internal && item.family === "IPv4").address;

  res.write(`<html><body>Hello from ${currentIp}</body></html>`);
  res.end();
});

server.listen(80);

console.log('Node.js web server at port 80 is running..')
