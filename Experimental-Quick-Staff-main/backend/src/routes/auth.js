// import { Router } from 'express'
// import { body, validationResult } from 'express-validator'
// import jwt from 'jsonwebtoken'
// import { query } from '../config/db.js'
// import { hashPassword, comparePassword } from '../utils/password.js'
// import { authenticate } from '../middleware/auth.js'

// const router = Router()

// const issueToken = (user) =>
//   jwt.sign(
//     { id: user.id, email: user.email, role: user.role, name: user.name },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   )

// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

// router.post(
//   '/register',
//   [
//     body('name').notEmpty(),
//     body('email').isEmail(),
//     body('password').isLength({ min: 6 }),
//     body('role').isIn(['client', 'worker'])
//   ],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { name, email, password, role, phone, address } = req.body
//     try {
//       const hashed = await hashPassword(password)
//       const result = await query(
//         'INSERT INTO users (name, email, password, role, phone, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role',
//         [name, email, hashed, role, phone || null, address || null]
//       )
//       const token = issueToken(result.rows[0])
//       res.status(201).json({ user: result.rows[0], token })
//     } catch (err) {
//       if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' })
//       next(err)
//     }
//   }
// )

// router.post(
//   '/login',
//   [body('email').isEmail(), body('password').notEmpty()],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { email, password } = req.body
//     try {
//       const result = await query('SELECT * FROM users WHERE email=$1 AND is_active=true', [email])
//       const user = result.rows[0]
//       if (!user) return res.status(401).json({ message: 'Invalid credentials' })
//       const match = await comparePassword(password, user.password)
//       if (!match) return res.status(401).json({ message: 'Invalid credentials' })
//       const token = issueToken(user)
//       res.json({
//         user: { id: user.id, name: user.name, email: user.email, role: user.role },
//         token
//       })
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// router.post(
//   '/request-otp',
//   [body('email').isEmail(), body('purpose').optional().isString()],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { email, purpose = 'verify_email' } = req.body
//     try {
//       const user = await query('SELECT id FROM users WHERE email=$1', [email])
//       if (!user.rows[0]) return res.status(404).json({ message: 'User not found' })
//       const code = generateOtp()
//       const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
//       await query(
//         `INSERT INTO email_otps (email, code, purpose, expires_at)
//          VALUES ($1,$2,$3,$4)`,
//         [email, code, purpose]
//       )
//       // In production, send code via email. For now, return a hint for testing.
//       res.json({ message: 'OTP sent', code })
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// router.post(
//   '/verify-otp',
//   [body('email').isEmail(), body('code').isLength({ min: 6, max: 6 })],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { email, code } = req.body
//     try {
//       const result = await query(
//         `SELECT * FROM email_otps
//          WHERE email=$1 AND code=$2 AND consumed=false AND expires_at > NOW()
//          ORDER BY created_at DESC
//          LIMIT 1`,
//         [email, code]
//       )
//       const otpRow = result.rows[0]
//       if (!otpRow) return res.status(400).json({ message: 'Invalid or expired code' })
//       await query('UPDATE email_otps SET consumed=true WHERE id=$1', [otpRow.id])
//       if (otpRow.purpose === 'verify_email') {
//         await query('UPDATE users SET is_verified=true WHERE email=$1', [email])
//       }
//       res.json({ success: true, purpose: otpRow.purpose })
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// router.post(
//   '/change-password',
//   authenticate(),
//   [
//     body('current_password').notEmpty(),
//     body('new_password').isLength({ min: 6 })
//   ],
//   async (req, res, next) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
//     const { current_password: currentPassword, new_password: newPassword } = req.body
//     try {
//       const userRes = await query('SELECT id, password FROM users WHERE id=$1', [req.user.id])
//       const user = userRes.rows[0]
//       if (!user) return res.status(404).json({ message: 'User not found' })
//       const match = await comparePassword(currentPassword, user.password)
//       if (!match) return res.status(401).json({ message: 'Current password incorrect' })
//       const hashed = await hashPassword(newPassword)
//       await query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, req.user.id])
//       res.json({ success: true })
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// export default router
// import { Router } from "express";
// import { authenticate } from "../middleware/auth.js";
// import { login, register, validateLogin, validateRegister, me, logout } from "../controllers/authController.js";

// const router = Router();

// router.post("/register", validateRegister, register);
// router.post("/login", validateLogin, login);
// router.get("/me", authenticate, me);
// router.post("/logout", authenticate, logout);

// export default router;

import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const issueToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['client', 'worker'])
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, password, role, phone, address } = req.body
    try {
      const hashed = await hashPassword(password)
      const result = await query(
        'INSERT INTO users (name, email, password, role, phone, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,name,email,role',
        [name, email, hashed, role, phone || null, address || null]
      )
      const token = issueToken(result.rows[0])
      res.status(201).json({ user: result.rows[0], token })
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ message: 'Email already exists' })
      next(err)
    }
  }
)

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    try {
      const result = await query('SELECT * FROM users WHERE email=$1 AND is_active=true', [email])
      const user = result.rows[0]
      if (!user) return res.status(401).json({ message: 'Invalid credentials' })
      const match = await comparePassword(password, user.password)
      if (!match) return res.status(401).json({ message: 'Invalid credentials' })
      const token = issueToken(user)
      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
      })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/request-otp',
  [body('email').isEmail(), body('purpose').optional().isString()],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, purpose = 'verify_email' } = req.body
    try {
      const user = await query('SELECT id FROM users WHERE email=$1', [email])
      if (!user.rows[0]) return res.status(404).json({ message: 'User not found' })
      const code = generateOtp()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      await query(
        `INSERT INTO email_otps (email, code, purpose, expires_at)
         VALUES ($1,$2,$3,$4)`,
        [email, code, purpose]
      )
      // In production, send code via email. For now, return a hint for testing.
      res.json({ message: 'OTP sent', code })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/verify-otp',
  [body('email').isEmail(), body('code').isLength({ min: 6, max: 6 })],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, code } = req.body
    try {
      const result = await query(
        `SELECT * FROM email_otps
         WHERE email=$1 AND code=$2 AND consumed=false AND expires_at > NOW()
         ORDER BY created_at DESC
         LIMIT 1`,
        [email, code]
      )
      const otpRow = result.rows[0]
      if (!otpRow) return res.status(400).json({ message: 'Invalid or expired code' })
      await query('UPDATE email_otps SET consumed=true WHERE id=$1', [otpRow.id])
      if (otpRow.purpose === 'verify_email') {
        await query('UPDATE users SET is_verified=true WHERE email=$1', [email])
      }
      res.json({ success: true, purpose: otpRow.purpose })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/change-password',
  authenticate(),
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { current_password: currentPassword, new_password: newPassword } = req.body
    try {
      const userRes = await query('SELECT id, password FROM users WHERE id=$1', [req.user.id])
      const user = userRes.rows[0]
      if (!user) return res.status(404).json({ message: 'User not found' })
      const match = await comparePassword(currentPassword, user.password)
      if (!match) return res.status(401).json({ message: 'Current password incorrect' })
      const hashed = await hashPassword(newPassword)
      await query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, req.user.id])
      res.json({ success: true })
    } catch (err) {
      next(err)
    }
  }
)

router.get('/me', authenticate(), async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, phone, address, profile_image, is_verified FROM users WHERE id=$1',
      [req.user.id]
    )
    if (!result.rows[0]) return res.status(404).json({ message: 'User not found' })
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
})

router.post('/logout', authenticate(), (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
