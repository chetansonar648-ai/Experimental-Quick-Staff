
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const runInit = async () => {
    const client = await pool.connect();
    try {
        const sqlPath = path.join(__dirname, '../../database/init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running init.sql...');
        await client.query(sql);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
        await pool.end();
    }
};

runInit();
