import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";

export const validateReview = [
  body("booking_id").isInt(),
  body("reviewee_id").isInt(),
  body("rating").isInt({ min: 1, max: 5 }),
  body("comment").optional().isString(),
];

export const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { booking_id, reviewee_id, rating, comment } = req.body;
  try {
    const result = await query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [booking_id, req.user.id, reviewee_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const listReviewsForUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const result = await query(
      `SELECT r.*, u.name as reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.reviewee_id=$1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

