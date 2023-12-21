const http = require("http");
const colors = require("colors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const servers = [
  { name: "auth", host: "localhost", port: "3200" },
  { name: "ums", host: "localhost", port: "1207" },
  { name: "ss", host: "localhost", port: "1208" },
  { name: "rms", host: "localhost", port: "1215" },
  { name: "oms", host: "localhost", port: "1206" },
  { name: "cms", host: "localhost", port: "2210" },
  { name: "hms", host: "localhost", port: "1205" },
  { name: "kyc", host: "localhost", port: "2206" },
  { name: "ms", host: "localhost", port: "2205" },
  { name: "onbs", host: "localhost", port: "1216" },
  { name: "ref_ms", host: "localhost", port: "1210" },
  { name: "pmt", host: "localhost", port: "8001" },
  { name: "sub", host: "localhost", port: "8002" },
  { name: "report", host: "localhost", port: "1230" },
  { name: "lms", host: "localhost", port: "1200" },
];

const proxy = createProxyMiddleware({
  changeOrigin: true,
  router: function (req) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const target = servers.find((server) =>
      url.pathname.startsWith(`/${server.name}`)
    );

    console.log(`Incoming request: ${req.method} ${req.url}`.green);

    console.log(
      `Outgoing request: ${req.method} ${target.host}:${target.port}${url.pathname}`
        .magenta
    );

    return `http://${target.host}:${target.port}`;
  },
});

const server = http.createServer((req, res) => {
  proxy(req, res);
});

server.listen(80, () => {
  console.log("listening on port 80".yellow);
});
