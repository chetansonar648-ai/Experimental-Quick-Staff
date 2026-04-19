import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

// ============ ADMIN SUMMARY (Dashboard Stats) ============
router.get('/admin/summary', async (req, res) => {
    try {
        const [users, workers, clients, bookings] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 'worker'"),
            pool.query("SELECT COUNT(*) FROM users WHERE role = 'client'"),
            pool.query("SELECT COUNT(*) FROM bookings")
        ]);
        res.json({
            total_users: users.rows[0].count,
            total_workers: workers.rows[0].count,
            total_clients: clients.rows[0].count,
            total_bookings: bookings.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ CLIENTS ============
router.get('/clients', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE role = 'client' ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ WORKERS ============
router.get('/workers', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.phone, u.is_active, 
             COALESCE(wp.rating, 0) as rating, 
             COALESCE(wp.completed_jobs, 0) as completed_jobs
      FROM users u
      LEFT JOIN worker_profiles wp ON u.id = wp.user_id
      WHERE u.role = 'worker'
      ORDER BY u.id DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/workers', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role, phone)
       VALUES ($1, $2, '123456', 'worker', $3) RETURNING *`,
            [name, email, phone]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/workers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.json({ message: "Worker deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE WORKER
router.put('/workers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const result = await pool.query(
            `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), updated_at = NOW()
             WHERE id = $4 RETURNING *`,
            [name, email, phone, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Worker not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE USER STATUS (Active/Inactive toggle)
router.put('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        const result = await pool.query(
            "UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_active",
            [is_active, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE CLIENT
router.put('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        const result = await pool.query(
            `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), address = COALESCE($4, address), updated_at = NOW()
             WHERE id = $5 RETURNING *`,
            [name, email, phone, address, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Client not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE CLIENT
router.delete('/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.json({ message: "Client deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ SERVICES ============
router.get('/services', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM services ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ BOOKINGS ============
router.get('/bookings', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        b.*,
        c.name as client_name,
        w.name as worker_name,
        s.name as service_name
      FROM bookings b
      LEFT JOIN users c ON b.client_id = c.id
      LEFT JOIN users w ON b.worker_id = w.id
      LEFT JOIN services s ON b.service_id = s.id
      ORDER BY b.booking_date DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/bookings', async (req, res) => {
    try {
        const {
            client_id, worker_id, service_id, booking_date, duration_hours,
            total_price, status, address, special_instructions,
            payment_status, payment_method
        } = req.body;

        const result = await pool.query(
            `INSERT INTO bookings 
      (client_id, worker_id, service_id, booking_date, duration_hours, total_price, status, address, special_instructions, payment_status, payment_method)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
            [client_id, worker_id, service_id, booking_date, duration_hours, total_price, status || 'pending', address, special_instructions, payment_status || 'pending', payment_method]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;

        const result = await pool.query(
            `UPDATE bookings 
       SET status = COALESCE($1, status), 
           payment_status = COALESCE($2, payment_status),
           updated_at = NOW()
       WHERE id = $3 
       RETURNING *`,
            [status, payment_status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ REVIEWS ============
router.get('/reviews', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT r.*, 
             c.name as client_name, 
             w.name as worker_name
      FROM reviews r
      LEFT JOIN users c ON r.client_id = c.id
      LEFT JOIN users w ON r.worker_id = w.id
      ORDER BY r.created_at DESC
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/reviews', async (req, res) => {
    try {
        const { client_id, worker_id, booking_id, rating, comment } = req.body;
        const result = await pool.query(
            `INSERT INTO reviews (client_id, worker_id, booking_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [client_id, worker_id, booking_id, rating, comment]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============ REQUESTS (Job Requests) ============
router.get('/requests', async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
      SELECT 
        jr.*,
        c.name as client_name,
        w.name as worker_name,
        s.name as service_name
      FROM job_requests jr
      LEFT JOIN users c ON jr.client_id = c.id
      LEFT JOIN users w ON jr.worker_id = w.id
      LEFT JOIN services s ON jr.service_id = s.id
    `;

        const params = [];
        if (status && status !== 'All') {
            query += ` WHERE jr.status = $1`;
            params.push(status);
        }

        query += ` ORDER BY jr.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/requests', async (req, res) => {
    try {
        const {
            client_id, worker_id, service_id, title, description,
            requested_date, preferred_time, budget, status
        } = req.body;

        const result = await pool.query(
            `INSERT INTO job_requests 
      (client_id, worker_id, service_id, title, description, requested_date, preferred_time, budget, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
            [client_id, worker_id, service_id, title, description, requested_date, preferred_time, budget, status || 'pending']
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/requests/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { status } = req.body;

        const updateResult = await client.query(
            `UPDATE job_requests 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
            [status, id]
        );

        if (updateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Request not found" });
        }

        const request = updateResult.rows[0];

        // If Accepted, Create Booking
        if (status === 'accepted') {
            await client.query(
                `INSERT INTO bookings 
        (client_id, worker_id, service_id, booking_date, status, address, payment_status, total_price)
        SELECT $1, $2, $3, $4, 'pending', COALESCE(u.address, 'Address not provided'), 'pending', $5
        FROM users u WHERE u.id = $1`,
                [
                    request.client_id,
                    request.worker_id,
                    request.service_id,
                    request.requested_date,
                    request.budget || 0
                ]
            );
        }

        await client.query('COMMIT');
        res.json(request);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

router.delete('/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM job_requests WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.json({ message: "Request deleted successfully", deleted: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ============ ANALYTICS ============

// Monthly Bookings (Last 6 Months)
router.get('/admin/analytics/monthly', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                TO_CHAR(booking_date, 'Mon') as month, 
                COUNT(*) as value
            FROM bookings
            WHERE booking_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
            GROUP BY TO_CHAR(booking_date, 'Mon'), DATE_TRUNC('month', booking_date)
            ORDER BY DATE_TRUNC('month', booking_date)
        `);

        // If no data, return at least empty structure or handle in frontend
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Top Services
router.get('/admin/analytics/top-services', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.name, COUNT(b.id) as count
            FROM services s
            JOIN bookings b ON s.id = b.service_id
            GROUP BY s.name
            ORDER BY count DESC
            LIMIT 5
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Device Breakdown (Randomized for "Live" effect)
router.get('/admin/analytics/devices', async (req, res) => {
    const desktop = Math.floor(Math.random() * (65 - 50 + 1)) + 50;
    const mobile = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
    const tablet = 100 - desktop - mobile;

    res.json([
        { device: 'Desktop', percentage: desktop },
        { device: 'Mobile', percentage: mobile },
        { device: 'Tablet', percentage: tablet > 0 ? tablet : 0 }
    ]);
});

// Traffic Sources (Randomized for "Live" effect)
router.get('/admin/analytics/traffic', async (req, res) => {
    const direct = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
    const search = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    const social = 100 - direct - search;

    res.json([
        { source: 'Direct Search', percentage: direct },
        { source: 'Referral', percentage: search },
        { source: 'Social Media', percentage: social > 0 ? social : 0 }
    ]);
});

export default router;
