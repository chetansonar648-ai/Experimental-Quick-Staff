// import pg from 'pg'

// const { Pool } = pg

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// })

// pool.on('error', (err) => {
//   console.error('Unexpected Postgres error', err)
// })

// export const query = (text, params) => pool.query(text, params)

// export const ensureAuxTables = async () => {
//   await query(`
//     CREATE TABLE IF NOT EXISTS email_otps (
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(255) NOT NULL,
//       code VARCHAR(10) NOT NULL,
//       purpose VARCHAR(50) NOT NULL,
//       expires_at TIMESTAMP NOT NULL,
//       consumed BOOLEAN DEFAULT FALSE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `)
// }
// import pkg from 'pg';

// const { Pool } = pkg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
// });

// pool.on('error', (err) => {
//   // eslint-disable-next-line no-console
//   console.error('Unexpected PG error', err);
// });

// export const query = (text, params) => pool.query(text, params);

// export default pool;
// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.PGSSL ? { rejectUnauthorized: false } : undefined,
// });

// pool.on("error", (err) => {
//   // eslint-disable-next-line no-console
//   console.error("Unexpected PG error", err);
//   process.exit(-1);
// });

// export const query = (text, params) => pool.query(text, params);
// export const getClient = () => pool.connect();

import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }
    : {
      user: 'postgres',
      host: 'localhost',
      database: 'quickstaff',
      password: 'riddhi15',
      port: 5432,
      ssl: false,
    }
);

// ✅ Safe query helper
export const query = (text, params) => pool.query(text, params);

// ✅ Ensure auxiliary tables exist
export const ensureAuxTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(10) NOT NULL,
      purpose VARCHAR(50) NOT NULL,
      consumed BOOLEAN DEFAULT FALSE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

// ✅ Export pool (if needed elsewhere)
export default pool;
