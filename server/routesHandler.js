import { findPhotos, getESP32Photo } from "./routesFunctions.js";

function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default class RoutesHandler {
  constructor(serverConfig) {
    this.server = serverConfig;
  }

  async handleRequest() {
    const { req, res, pool } = this.server;

    setCORSHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== "POST" && req.method !== "GET") {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Método não permitido');
      return;
    }

    if (req.url.includes("?")) {
      const [url, queryString] = req.url.split("?");
      req.query = Object.fromEntries(new URLSearchParams(queryString));
      req.url = url;
    }

    switch (req.url) {
      case '/upload':
        await getESP32Photo(req, res, pool);
        break;
      case '/find-photos':
        await findPhotos(req, res, pool);
        break;
      default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada');
    }

  }

}