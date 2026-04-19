import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const validateRegister = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("role").isIn(["client", "worker"]).withMessage("Role must be client or worker"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, role, phone, address } = req.body;
  try {
    const existing = await query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashed = await hashPassword(password);
    const result = await query(
      `INSERT INTO users (name, email, password, role, phone, address)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, role`,
      [name, email, hashed, role, phone || null, address || null]
    );
    const user = result.rows[0];
    if (role === "worker") {
      await query("INSERT INTO worker_profiles (user_id) VALUES ($1)", [user.id]);
    }
    const token = signToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const result = await query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const result = await query("SELECT id, name, email, role, phone, address FROM users WHERE id=$1", [
      req.user.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

