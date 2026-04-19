import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDb() {
    console.log('🔄 Connecting to database...');
    let client;
    try {
        client = await pool.connect();
        const sqlPath = path.join(__dirname, 'init.sql');
        console.log(`📂 Reading Schema + Seed SQL from ${sqlPath}...`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing Full Database Reset...');
        await client.query(sql);
        console.log('✅ Database reset and seeded successfully.');
        console.log('✨ All tables recreated and sample data inserted.');
    } catch (err) {
        console.error('❌ Error resetting database:', err);
    } finally {
        if (client) client.release();
        setTimeout(() => process.exit(), 100);
    }
}

resetDb();
