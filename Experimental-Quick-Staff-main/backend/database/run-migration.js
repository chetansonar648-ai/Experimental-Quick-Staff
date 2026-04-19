// Simple migration script to add missing columns to bookings table
import pool from '../src/config/db.js';

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('🔄 Starting migration: Adding missing columns to bookings table...\n');

        // Start transaction
        await client.query('BEGIN');

        // Add start_time column
        console.log('Adding start_time column...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS start_time TIME
    `);
        console.log('✅ Added start_time column');

        // Add end_time column
        console.log('Adding end_time column...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS end_time TIME
    `);
        console.log('✅ Added end_time column');

        // Add cancelled_by column
        console.log('Adding cancelled_by column...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(50)
    `);
        console.log('✅ Added cancelled_by column');

        // Add cancellation_reason column
        console.log('Adding cancellation_reason column...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancellation_reason TEXT
    `);
        console.log('✅ Added cancellation_reason column');

        // Add cancelled_at column
        console.log('Adding cancelled_at column...');
        await client.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP
    `);
        console.log('✅ Added cancelled_at column');

        // Update existing bookings to extract time from booking_date
        console.log('\nUpdating existing bookings...');
        const result = await client.query(`
      UPDATE bookings 
      SET start_time = booking_date::TIME
      WHERE start_time IS NULL AND booking_date IS NOT NULL
    `);
        console.log(`✅ Updated ${result.rowCount} existing booking(s) with start_time from booking_date`);

        // Commit transaction
        await client.query('COMMIT');

        console.log('\n✅ ✅ ✅ Migration completed successfully! ✅ ✅ ✅');
        console.log('The bookings table now has all required columns.');
        console.log('\nYou can now reschedule bookings! 🎉\n');

    } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error('\n❌ Migration failed:', error.message);
        console.error('Full error:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run the migration
runMigration()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Migration error:', error);
        process.exit(1);
    });
