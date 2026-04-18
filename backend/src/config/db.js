// import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pkg;

// const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//       connectionString: process.env.DATABASE_URL,
//       ssl:
//         process.env.NODE_ENV === 'production'
//           ? { rejectUnauthorized: false }
//           : false,
//     }
//     : {
//       user: 'postgres',
//       host: 'localhost',
//       database: 'quickstaff',
//       password: 'riddhi15',
//       port: 5432,
//       ssl: false,
//     }
// );

// // ✅ Safe query helper
// export const query = (text, params) => pool.query(text, params);

// // ✅ Ensure auxiliary tables exist
// export const ensureAuxTables = async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS email_otps (
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(255) NOT NULL,
//       code VARCHAR(10) NOT NULL,
//       purpose VARCHAR(50) NOT NULL,
//       consumed BOOLEAN DEFAULT FALSE,
//       expires_at TIMESTAMP NOT NULL,
//       created_at TIMESTAMP DEFAULT NOW()
//     );
//   `);
// };

// // ✅ Export pool (if needed elsewhere)
// export default pool;


import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

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

export default pool;