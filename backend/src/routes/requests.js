import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET ALL REQUESTS (WITH FILTERS)
router.get("/", async (req, res) => {
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

// CREATE REQUEST (MANUAL)
router.post("/", async (req, res) => {
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

// UPDATE REQUEST (ACCEPT/REJECT)
router.put("/:id", async (req, res) => {
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
        VALUES ($1, $2, $3, $4, 'pending', 'Address from Client Profile', 'pending', $5)`,
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

// DELETE REQUEST
router.delete("/:id", async (req, res) => {
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

export default router;
