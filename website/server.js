const { createServer } = require("https");
const http = require("http");
const { parse } = require("url");
const next = require("next");
const { readFileSync } = require("fs");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// const port = 443;
// const httpPort = 80;

const port = 8443;
const httpPort = 8442;

const httpsOptions = {
  key: readFileSync("/opt/bitnami/nginx/conf/bitnami/certs/server.key"),
  cert: readFileSync("/opt/bitnami/nginx/conf/bitnami/certs/server.crt"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
  });

  http
    .createServer((req, res) => {
      res.writeHead(302, {
        Location: "https://" + req.headers.host + req.url,
      });

      res.end();
    })
    .listen(httpPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${httpPort}`);
    });
});
