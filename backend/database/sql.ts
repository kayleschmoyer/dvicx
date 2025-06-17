import sql, { config as SqlConfig } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: SqlConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE as string,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  options: {
    encrypt: false, // change to true if using Azure
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolPromise = pool.connect();

export { sql, poolPromise };

