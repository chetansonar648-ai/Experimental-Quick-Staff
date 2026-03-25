
import pg from 'pg';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

const { Pool } = pg;
const { hash } = bcryptjs;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function safeQuery(text, params) {
    try {
        return await pool.query(text, params);
    } catch (err) {
        console.error('Query Error:', err.message);
        throw err;
    }
}

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Seeding data...');
        await client.query('BEGIN');

        // 1. Create Services
        console.log('Creating Services...');
        const services = [
            { name: 'House Cleaning', category: 'Cleaning', price: 50 },
            { name: 'Plumbing Repair', category: 'Plumbing', price: 80 },
            { name: 'Electrical Wiring', category: 'Electrical', price: 90 },
            { name: 'Garden Maintenance', category: 'Gardening', price: 60 },
            { name: 'Painting', category: 'Home Improvement', price: 70 },
        ];

        // Insert and store IDs
        const serviceIds = [];
        for (const s of services) {
            const res = await client.query(
                `INSERT INTO services (name, category, base_price, description) 
          VALUES ($1, $2, $3, 'Standard service') RETURNING services_id`,
                [s.name, s.category, s.price]
            );
            serviceIds.push(res.rows[0].services_id);
        }

        // 2. Create Users
        console.log('Creating Users...');
        const passwordHash = await hash('password123', 10);

        // Admin
        await client.query(
            `INSERT INTO users (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, 'admin', true)`,
            ['Admin User', 'admin@quickstaff.com', passwordHash]
        );

        // Client
        const clientRes = await client.query(
            `INSERT INTO users (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, 'client', true) RETURNING id`,
            ['Client One', 'client@quickstaff.com', passwordHash]
        );
        const clientId = clientRes.rows[0].id;

        // Worker 1
        const workerRes1 = await client.query(
            `INSERT INTO users (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, 'worker', true) RETURNING id`,
            ['Worker John', 'worker@quickstaff.com', passwordHash]
        );
        const workerId1 = workerRes1.rows[0].id;

        // Worker 1 Profile
        await client.query(
            `INSERT INTO worker_profiles (user_id, title, hourly_rate, bio, skills, availability) 
       VALUES ($1, 'Professional Cleaner', 55, 'Expert home cleaner', ARRAY['Cleaning', 'Organization'], '{"mon":["09:00","17:00"]}')`,
            [workerId1]
        );

        // Worker 1 Services
        await client.query(
            `INSERT INTO worker_services (worker_id, services_id, price) 
         VALUES ($1, $2, 55)`,
            [workerId1, serviceIds[0]] // House Cleaning
        );

        // Worker 2
        const workerRes2 = await client.query(
            `INSERT INTO users (name, email, password, role, is_active) 
       VALUES ($1, $2, $3, 'worker', true) RETURNING id`,
            ['Worker Jane', 'worker2@quickstaff.com', passwordHash]
        );
        const workerId2 = workerRes2.rows[0].id;

        // Worker 2 Profile
        await client.query(
            `INSERT INTO worker_profiles (user_id, title, hourly_rate, bio, skills, availability) 
       VALUES ($1, 'Licensed Plumber', 85, '10 years experience', ARRAY['Plumbing', 'Repairs'], '{"tue":["10:00","18:00"]}')`,
            [workerId2]
        );

        // Worker 2 Services
        await client.query(
            `INSERT INTO worker_services (worker_id, services_id, price) 
         VALUES ($1, $2, 85)`,
            [workerId2, serviceIds[1]] // Plumbing
        );

        // 3. Create a Booking
        console.log('Creating Booking...');
        await client.query(
            `INSERT INTO bookings (client_id, worker_id, service_id, booking_date, duration_hours, total_price, address, status, payment_status)
       VALUES ($1, $2, $3, NOW() + INTERVAL '1 day', 2, 110, '123 Main St', 'pending', 'pending')`,
            [clientId, workerId1, serviceIds[0]]
        );

        await client.query('COMMIT');
        console.log('Seeding completed successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seeding Failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
