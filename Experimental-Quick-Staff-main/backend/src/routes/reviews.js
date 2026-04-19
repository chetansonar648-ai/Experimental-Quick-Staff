import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

// Get Pending Reviews (Bookings completed but no review yet)
router.get('/pending', authenticate(), async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Find bookings where current user is involved, status is completed, and review is missing.
    // If client, reviewer_id=client. If worker, reviewer_id=worker (for future).
    // Review logic: usually client reviews worker.

    // Check if review exists for booking where reviewer is current user
    const result = await query(
      `SELECT b.* 
       FROM bookings b
       LEFT JOIN reviews r ON b.id = r.booking_id AND r.reviewer_id = $1
       WHERE b.status = 'completed' 
       AND (b.client_id = $1 OR b.worker_id = $1)
       AND r.id IS NULL`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authenticate(),
  [
    body('booking_id').isInt(),
    body('reviewee_id').isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
  ],
  async (req, res, next) => {
    // ... same as before
    const { booking_id, reviewee_id, rating, comment } = req.body;
    try {
      const inserted = await query(
        `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [booking_id, req.user.id, reviewee_id, rating, comment || null]
      );
      res.status(201).json(inserted.rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/me', authenticate(), async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM reviews WHERE reviewee_id=$1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
