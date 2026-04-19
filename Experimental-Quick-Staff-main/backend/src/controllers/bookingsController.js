import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";

export const validateBooking = [
  body("worker_id").isInt(),
  body("service_id").isInt(),
  body("booking_date").isISO8601(),
  body("duration_hours").isInt(),
  body("total_price").isDecimal(),
];

export const createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { worker_id, service_id, booking_date, duration_hours, total_price, address, special_instructions } =
    req.body;
  try {
    const result = await query(
      `INSERT INTO bookings (client_id, worker_id, service_id, booking_date, duration_hours, total_price, address, special_instructions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, worker_id, service_id, booking_date, duration_hours, total_price, address, special_instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const listBookings = async (req, res, next) => {
  const { role, id } = req.user;
  const filterColumn = role === "worker" ? "worker_id" : "client_id";
  try {
    const result = await query(
      `SELECT b.*, s.name AS service_name, u.name AS client_name, w.name AS worker_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users u ON u.id = b.client_id
       JOIN users w ON w.id = b.worker_id
       WHERE b.${filterColumn} = $1
       ORDER BY b.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  const { status } = req.body;
  const allowed = ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  try {
    const result = await query(
      `UPDATE bookings
       SET status=$1, updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getBookingsByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const result = await query(
      `SELECT b.*, s.name AS service_name, u.name AS client_name, w.name AS worker_name
       FROM bookings b
       JOIN services s ON s.services_id = b.service_id
       JOIN users u ON u.id = b.client_id
       JOIN users w ON w.id = b.worker_id
       WHERE b.client_id = $1 AND b.worker_id = $2
       ORDER BY b.created_at DESC`,
      [clientId, req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

