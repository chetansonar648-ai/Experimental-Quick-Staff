import pool from '../config/db.js';

const debug = async () => {
    try {
        const res = await pool.query('SELECT id, client_id, status FROM bookings ORDER BY created_at DESC LIMIT 5');
        res.rows.forEach(r => console.log(`Booking: ID=${r.id}, Client=${r.client_id}, Status=${r.status}`));

        const users = await pool.query("SELECT id, email, role FROM users WHERE role='client' ORDER BY id DESC LIMIT 1");
        users.rows.forEach(u => console.log(`User: ID=${u.id}, Email=${u.email}`));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

debug();
