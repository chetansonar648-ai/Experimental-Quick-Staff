import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";

export const validateUpdate = [
  body("name").optional().isString(),
  body("phone").optional().isString(),
  body("address").optional().isString(),
];

export const getProfile = async (req, res, next) => {
  try {
    const result = await query(
      "SELECT id, name, email, role, phone, address, profile_image FROM users WHERE id=$1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, phone, address, profile_image } = req.body;
  try {
    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           profile_image = COALESCE($4, profile_image),
           updated_at = CURRENT_TIMESTAMP
       WHERE id=$5
       RETURNING id, name, email, role, phone, address, profile_image`,
      [name, phone, address, profile_image, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      "SELECT id, name, email, role, phone, address, profile_image FROM users WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

