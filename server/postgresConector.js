import { Pool } from 'pg';
import { config as initializeEnv } from 'dotenv';
initializeEnv();

export const pool = new Pool({
  connectionString: process.env.PG_URL,
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente inativo', err);
  process.exit(-1);
});

export const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado ao banco de dados PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Erro adquirindo cliente', err.stack);
    process.exit(-1);
  }
};
