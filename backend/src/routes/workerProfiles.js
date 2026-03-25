import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate } from '../middleware/auth.js'
import { query } from '../config/db.js'
import { uploadProfilePicture } from '../middleware/upload.js'

const router = Router()

const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(\s?(AM|PM))?$/i;

const validateAvailability = (availability) => {
  if (!availability || typeof availability !== 'object') {
    return true;
  }

  for (const [day, times] of Object.entries(availability)) {
    if (!validDays.includes(day)) {
      throw new Error(`Invalid day: ${day}. Must be one of: ${validDays.join(', ')}`);
    }

    if (!times || typeof times !== 'object') {
      throw new Error(`Availability for ${day} must be an object with start and end times`);
    }

    const { start, end } = times;

    if (!start && !end) continue;

    if ((start && !end) || (!start && end)) {
      throw new Error(`${day} must have both start and end times, or leave both empty`);
    }

    if (start && !timeRegex.test(start)) {
      throw new Error(`Invalid start time format for ${day}. Use HH:MM or HH:MM AM/PM`);
    }
    if (end && !timeRegex.test(end)) {
      throw new Error(`Invalid end time format for ${day}. Use HH:MM or HH:MM AM/PM`);
    }
  }

  return true;
};

// Get worker profile with user data
router.get('/me', authenticate(['worker']), async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.name, u.email, u.phone, u.profile_image, u.address,
              wp.bio, wp.skills, wp.hourly_rate, wp.availability, 
              wp.rating, wp.total_reviews, wp.completed_jobs,
              wp.title, wp.years_of_experience, wp.service_location
       FROM users u
       LEFT JOIN worker_profiles wp ON wp.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    )
    res.json(result.rows[0] || null)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/me',
  authenticate(['worker']),
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('phone').optional().isString().withMessage('Phone must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('hourly_rate').optional().isNumeric().withMessage('Hourly rate must be a number'),
    body('availability').optional().custom(validateAvailability),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('years_of_experience').optional().isInt({ min: 0 }).withMessage('Years of experience must be a non-negative integer'),
    body('address').optional().isString().withMessage('Address must be a string'),
    body('service_location').optional().isString().withMessage('Service location must be a string')
  ],
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, phone, bio, skills, hourly_rate, availability, title, years_of_experience, address, service_location } = req.body

    try {
      // Update user name/phone/address if provided
      if (name || phone || address) {
        await query(
          `UPDATE users SET 
            name = COALESCE($1, name), 
            phone = COALESCE($2, phone),
            address = COALESCE($3, address),
            updated_at = NOW() 
           WHERE id = $4`,
          [name || null, phone || null, address || null, req.user.id]
        )
      }

      // Check if worker profile exists
      const existing = await query('SELECT id FROM worker_profiles WHERE user_id=$1', [req.user.id])

      if (existing.rows[0]) {
        const updated = await query(
          `UPDATE worker_profiles
           SET bio = COALESCE($1, bio),
               skills = COALESCE($2, skills),
               hourly_rate = COALESCE($3, hourly_rate),
               availability = COALESCE($4, availability),
               title = COALESCE($5, title),
               years_of_experience = COALESCE($6, years_of_experience),
               service_location = COALESCE($7, service_location),
               updated_at = NOW()
           WHERE user_id = $8
           RETURNING *`,
          [bio, skills, hourly_rate, availability, title, years_of_experience, service_location, req.user.id]
        )
        return res.json(updated.rows[0])
      }

      // Insert new profile
      const inserted = await query(
        `INSERT INTO worker_profiles (user_id, bio, skills, hourly_rate, availability, title, years_of_experience, service_location)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [req.user.id, bio, skills, hourly_rate, availability, title, years_of_experience, service_location]
      )
      res.status(201).json(inserted.rows[0])
    } catch (err) {
      next(err)
    }
  }
)

// Upload profile picture
router.post(
  '/me/profile-picture',
  authenticate(['worker']),
  uploadProfilePicture.single('profile_picture'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }

      const imageUrl = `/uploads/profiles/${req.file.filename}`

      // Update users table profile_image column
      await query(
        'UPDATE users SET profile_image = $1, updated_at = NOW() WHERE id = $2',
        [imageUrl, req.user.id]
      )

      res.json({ profile_image: imageUrl, message: 'Profile picture updated successfully' })
    } catch (err) {
      next(err)
    }
  }
)

export default router
