
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

// Get Upcoming Payments (bookings with pending payments)
router.get('/upcoming', authenticate(), async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Find bookings where user is involved and payment_status is 'pending' and status is not cancelled
        const result = await query(
            `SELECT * FROM bookings 
       WHERE (client_id = $1 OR worker_id = $1)
       AND payment_status = 'pending'
       AND status NOT IN ('cancelled', 'rejected')
       ORDER BY booking_date ASC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

export default router;
