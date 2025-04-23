const http = require("http");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpPort = 8443;

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      handle(req, res, parsedUrl);
    })
    .listen(httpPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${httpPort}`);
    });
});
