import { createServer } from 'http';
import { config as initializeEnv } from 'dotenv';
import { connectToDatabase } from './postgresConector.js';
import RoutesHandler from './routesHandler.js';
import { pool } from './postgresConector.js';

initializeEnv();

const startServer = async () => {
  await connectToDatabase();

  const server = createServer(async (req, res) => {
    const handler = new RoutesHandler({ req, res, pool });
    await handler.handleRequest();
  });

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
};

startServer();
