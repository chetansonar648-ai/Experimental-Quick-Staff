import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";

export const validateService = [
  body("name").notEmpty(),
  body("category").notEmpty(),
  body("description").optional(),
  body("base_price").optional().isDecimal(),
  body("duration_hours").optional().isInt(),
];

export const listServices = async (_req, res, next) => {
  try {
    const result = await query("SELECT * FROM services ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createService = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, category, base_price, duration_hours, image_url } = req.body;
  try {
    const result = await query(
      `INSERT INTO services (name, description, category, base_price, duration_hours, image_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, description, category, base_price, duration_hours, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const attachWorkerService = async (req, res, next) => {
  const { service_id, price } = req.body;
  try {
    const result = await query(
      `INSERT INTO worker_services (worker_id, service_id, price)
       VALUES ($1,$2,$3) RETURNING *`,
      [req.user.id, service_id, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const listWorkerServices = async (req, res, next) => {
  const workerId = req.params.workerId || req.user.id;
  try {
    const result = await query(
      `SELECT ws.*, s.name, s.category, s.description
       FROM worker_services ws
       JOIN services s ON s.id = ws.service_id
       WHERE ws.worker_id = $1 AND ws.is_active = TRUE`,
      [workerId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

