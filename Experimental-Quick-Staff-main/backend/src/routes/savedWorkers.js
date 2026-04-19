// import { Router } from 'express'
// import { body, validationResult } from 'express-validator'
// import { authenticate } from '../middleware/auth.js'
// import { query } from '../config/db.js'

// const router = Router()

// router.get('/', authenticate(['client', 'worker']), async (req, res, next) => {
//   try {
//     if (req.user.role === 'client') {
//       const result = await query(
//         `SELECT sw.*, u.name, u.email
//          FROM saved_workers sw
//          JOIN users u ON sw.worker_id = u.id
//          WHERE sw.client_id=$1`,
//         [req.user.id]
//       )
//       return res.json(result.rows)
//     }
//     const result = await query(
//       `SELECT sw.*, u.name, u.email
//        FROM saved_workers sw
//        JOIN users u ON sw.client_id = u.id
//        WHERE sw.worker_id=$1`,
//       [req.user.id]
//     )
//     return res.json(result.rows)
//   } catch (err) {
//     next(err)
//   }
// })

// router.post(
//   '/',
//   authenticate(['client']),
//   [body('worker_id').isInt()],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { worker_id } = req.body
//     try {
//       const inserted = await query(
//         `INSERT INTO saved_workers (client_id, worker_id)
//          VALUES ($1,$2)
//          ON CONFLICT (client_id, worker_id) DO NOTHING
//          RETURNING *`,
//         [req.user.id, worker_id]
//       )
//       res.status(201).json(inserted.rows[0] || { message: 'Already saved' })
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// router.delete('/:workerId', authenticate(['client']), async (req, res, next) => {
//   try {
//     await query(
//       'DELETE FROM saved_workers WHERE client_id=$1 AND worker_id=$2',
//       [req.user.id, req.params.workerId]
//     )
//     res.json({ success: true })
//   } catch (err) {
//     next(err)
//   }
// })

// export default router
// import { Router } from "express";
// import { authenticate, authorize } from "../middleware/auth.js";
// import { listSavedWorkers, removeSavedWorker, saveWorker } from "../controllers/savedWorkersController.js";

// const router = Router();

// router.get("/", authenticate, authorize("client"), listSavedWorkers);
// router.post("/", authenticate, authorize("client"), saveWorker);
// router.delete("/:id", authenticate, authorize("client"), removeSavedWorker);

// export default router;

import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/db.js';

const router = Router();

router.get('/', authenticate(['client', 'worker']), async (req, res, next) => {
  try {
    if (req.user.role === 'client') {
      const result = await query(
        `SELECT sw.*, u.name, u.email
         FROM saved_workers sw
         JOIN users u ON sw.worker_id = u.id
         WHERE sw.client_id=$1`,
        [req.user.id]
      );
      return res.json(result.rows);
    }

    const result = await query(
      `SELECT sw.*, u.name, u.email
       FROM saved_workers sw
       JOIN users u ON sw.client_id = u.id
       WHERE sw.worker_id=$1`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authenticate(['client']),
  [body('worker_id').isInt()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { worker_id } = req.body;

    try {
      const inserted = await query(
        `INSERT INTO saved_workers (client_id, worker_id)
         VALUES ($1,$2)
         ON CONFLICT (client_id, worker_id) DO NOTHING
         RETURNING *`,
        [req.user.id, worker_id]
      );
      res.status(201).json(inserted.rows[0] || { message: 'Already saved' });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:workerId', authenticate(['client']), async (req, res, next) => {
  try {
    await query(
      'DELETE FROM saved_workers WHERE client_id=$1 AND worker_id=$2',
      [req.user.id, req.params.workerId]
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
