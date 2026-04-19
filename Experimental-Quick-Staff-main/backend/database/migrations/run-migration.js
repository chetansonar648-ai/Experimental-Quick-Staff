// Migration script to add missing columns to bookings table
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('Starting migration: Adding missing columns to bookings table...');

        // Start transaction
        await client.query('BEGIN');

        // Add start_time column
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS start_time TIME
    `);
        console.log('✓ Added start_time column');

        // Add end_time column
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS end_time TIME
    `);
        console.log('✓ Added end_time column');

        // Add cancelled_by column
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(50)
    `);
        console.log('✓ Added cancelled_by column');

        // Add cancellation_reason column
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancellation_reason TEXT
    `);
        console.log('✓ Added cancellation_reason column');

        // Add cancelled_at column
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP
    `);
        console.log('✓ Added cancelled_at column');

        // Update existing bookings to extract time from booking_date
        await client.query(`
      UPDATE bookings 
      SET start_time = booking_date::TIME
      WHERE start_time IS NULL AND booking_date IS NOT NULL
    `);
        console.log('✓ Updated existing bookings with start_time from booking_date');

        // Commit transaction
        await client.query('COMMIT');

        console.log('\n✅ Migration completed successfully!');
        console.log('The bookings table now has start_time, end_time, and cancellation tracking columns.');

    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the migration
runMigration()
    .then(() => {
        console.log('\nYou can now reschedule bookings!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration error:', error);
        process.exit(1);
    });
