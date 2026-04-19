import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { query } from '../config/db.js'

const router = Router()

router.get('/', authenticate(['worker']), async (req, res, next) => {
  try {
    const result = await query(
      `SELECT ws.*, s.name, s.category
       FROM worker_services ws
       JOIN services s ON ws.service_id = s.id
       WHERE ws.worker_id=$1`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/',
  authenticate(['worker']),
  [body('service_id').isInt(), body('price').isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { service_id, price } = req.body
    try {
      const inserted = await query(
        `INSERT INTO worker_services (worker_id, service_id, price)
         VALUES ($1,$2,$3)
         ON CONFLICT (worker_id, service_id) DO UPDATE SET price=EXCLUDED.price, is_active=true
         RETURNING *`,
        [req.user.id, service_id, price]
      )
      res.status(201).json(inserted.rows[0])
    } catch (err) {
      next(err)
    }
  }
)

router.patch('/:id/toggle', authenticate(['worker']), async (req, res, next) => {
  try {
    const result = await query(
      `UPDATE worker_services
       SET is_active = NOT is_active
       WHERE id=$1 AND worker_id=$2
       RETURNING *`,
      [req.params.id, req.user.id]
    )
    if (!result.rows[0]) return res.status(404).json({ message: 'Not found' })
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
})

export default router

