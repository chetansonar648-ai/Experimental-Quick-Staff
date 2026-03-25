import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Database URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No');

const { Pool } = pg;

const dbConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'quickstaff',
        password: 'riddhi15',
        port: 5432,
        ssl: false,
    };

console.log('Using config:', 'DATABASE_URL' in dbConfig ? 'Connection String' : 'Manual Config');

const pool = new Pool(dbConfig);

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('Starting migration...');
        const migrationPath = path.join(__dirname, 'migrations', 'add_portfolio_column.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');
        await client.query('BEGIN');
        await client.query(migrationSql);
        await client.query('COMMIT');
        console.log('Migration completed successfully: Added portfolio column');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration().catch(err => console.error('Script failed:', err));
