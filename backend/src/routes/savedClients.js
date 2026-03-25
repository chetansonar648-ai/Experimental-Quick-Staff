import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

// Get saved clients for a worker
router.get('/', authenticate(['worker']), async (req, res, next) => {
  try {
    const result = await query(
      `SELECT sc.*, u.name, u.email, u.phone, u.address, u.profile_image
       FROM saved_clients sc
       JOIN users u ON sc.client_id = u.id
       WHERE sc.worker_id = $1
       ORDER BY sc.created_at DESC`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Save a client (worker saves client)
router.post(
  '/',
  authenticate(['worker']),
  [body('client_id').isInt().withMessage('Client ID must be an integer')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { client_id } = req.body;

    try {
      // Check if client exists
      const clientCheck = await query('SELECT id FROM users WHERE id = $1 AND role = $2', [
        client_id,
        'client'
      ]);
      if (clientCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const inserted = await query(
        `INSERT INTO saved_clients (worker_id, client_id)
         VALUES ($1, $2)
         ON CONFLICT (worker_id, client_id) DO NOTHING
         RETURNING *`,
        [req.user.id, client_id]
      );
      res.status(201).json(inserted.rows[0] || { message: 'Already saved' });
    } catch (err) {
      next(err);
    }
  }
);

// Remove saved client
router.delete('/:clientId', authenticate(['worker']), async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM saved_clients WHERE worker_id = $1 AND client_id = $2 RETURNING *',
      [req.user.id, req.params.clientId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Saved client not found' });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

