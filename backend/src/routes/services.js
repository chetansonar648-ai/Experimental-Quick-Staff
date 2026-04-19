import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  createService,
  listServices,
  listWorkerServices,
  addWorkerService
} from '../controllers/services.controller.js';
import { query } from '../config/db.js';

const router = Router();

// Get service names for dropdown
router.get('/names', async (req, res, next) => {
  try {
    const result = await query('SELECT DISTINCT name FROM services ORDER BY name');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    next(err);
  }
});

// List all services
router.get('/', listServices);

// Create Service (Admin)
router.post(
  '/',
  authenticate(['admin']),
  [
    body('name').notEmpty(),
    body('category').notEmpty(),
    body('base_price').isNumeric(),
  ],
  createService
);

// Worker Services
router.get('/me', authenticate(['worker']), listWorkerServices);
router.post('/attach', authenticate(['worker']), addWorkerService);

export default router;
