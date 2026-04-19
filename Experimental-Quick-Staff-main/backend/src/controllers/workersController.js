import { body, validationResult } from "express-validator";
import { query } from "../config/db.js";

const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Time format regex: supports "09:00 AM", "05:00 PM", "09:00", "17:00"
const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(\s?(AM|PM))?$/i;

const validateAvailability = (availability) => {
  if (!availability || typeof availability !== 'object') {
    return true; // Optional field - allow null/undefined
  }

  for (const [day, times] of Object.entries(availability)) {
    // Check if day is valid
    if (!validDays.includes(day)) {
      throw new Error(`Invalid day: ${day}. Must be one of: ${validDays.join(', ')}`);
    }

    // Check if times object has start and end
    if (!times || typeof times !== 'object') {
      throw new Error(`Availability for ${day} must be an object with start and end times`);
    }

    const { start, end } = times;

    // Allow empty values (user can leave a day blank)
    if (!start && !end) continue;

    // If one is provided, both must be provided
    if ((start && !end) || (!start && end)) {
      throw new Error(`${day} must have both start and end times, or leave both empty`);
    }

    // Validate time format
    if (start && !timeRegex.test(start)) {
      throw new Error(`Invalid start time format for ${day}. Use HH:MM or HH:MM AM/PM`);
    }
    if (end && !timeRegex.test(end)) {
      throw new Error(`Invalid end time format for ${day}. Use HH:MM or HH:MM AM/PM`);
    }
  }

  return true;
};

export const validateWorkerProfile = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("phone").optional().isString().withMessage("Phone must be a string"),
  body("bio").optional().isString().withMessage("Bio must be a string"),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("hourly_rate").optional({ nullable: true, checkFalsy: true }).isDecimal().withMessage("Hourly rate must be a decimal number"),
  body("availability").optional().custom(validateAvailability),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("years_of_experience").optional({ nullable: true, checkFalsy: true }).isInt({ min: 0 }).withMessage("Years of experience must be a non-negative integer"),
  body("address").optional().isString().withMessage("Address must be a string"),
  body("service_location").optional().isString().withMessage("Service location must be a string"),
];

export const getWorkerProfile = async (req, res, next) => {
  const workerId = req.params.id || req.user.id;
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.address,
              COALESCE(u.profile_image, 'https://via.placeholder.com/300x200?text=Worker') as image_url,
              COALESCE(wp.title, 'Service Professional') as role,
              wp.bio as description, wp.bio,
              wp.skills,
              COALESCE(wp.hourly_rate, 25) as hourly_rate,
              wp.availability,
              COALESCE(wp.rating, 0) as rating,
              COALESCE(wp.total_reviews, 0) as rating_count,
              wp.completed_jobs,
              wp.years_of_experience,
              wp.service_location, wp.service_location as location,
              u.role as system_role
       FROM users u
       LEFT JOIN worker_profiles wp ON wp.user_id = u.id
       WHERE u.id=$1`,
      [workerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const worker = result.rows[0];

    // Get recent reviews
    const reviewsResult = await query(
      `SELECT r.*, u.name as client_name, u.profile_image as client_image
       FROM reviews r
       JOIN users u ON u.id = r.reviewer_id
       WHERE r.reviewee_id = $1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [workerId]
    );
    worker.reviews = reviewsResult.rows;

    // Get future booked dates
    const bookingsResult = await query(
      `SELECT booking_date 
       FROM bookings 
       WHERE worker_id = $1 
         AND status IN ('accepted', 'in_progress') 
         AND booking_date >= CURRENT_DATE`,
      [workerId]
    );
    worker.booked_dates = bookingsResult.rows.map(b => b.booking_date);

    res.json(worker);
  } catch (err) {
    next(err);
  }
};

export const updateWorkerProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, phone, bio, skills, hourly_rate, availability, title, years_of_experience, address, service_location } = req.body;
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
      );
    }

    // Check if profile exists
    const check = await query('SELECT id FROM worker_profiles WHERE user_id=$1', [req.user.id]);

    if (check.rows.length === 0) {
      // ID doesn't exist, INSERT
      const result = await query(
        `INSERT INTO worker_profiles 
           (user_id, bio, skills, hourly_rate, availability, title, years_of_experience, service_location)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
        [req.user.id, bio, skills, hourly_rate, availability, title, years_of_experience, service_location]
      );
      return res.json(result.rows[0]);
    } else {
      // UPDATE
      const result = await query(
        `UPDATE worker_profiles
           SET bio = COALESCE($1, bio),
               skills = COALESCE($2, skills),
               hourly_rate = COALESCE($3, hourly_rate),
               availability = COALESCE($4, availability),
               title = COALESCE($5, title),
               years_of_experience = COALESCE($6, years_of_experience),
               service_location = COALESCE($7, service_location),
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id=$8
           RETURNING *`,
        [bio, skills, hourly_rate, availability, title, years_of_experience, service_location, req.user.id]
      );
      res.json(result.rows[0]);
    }
  } catch (err) {
    next(err);
  }
};

export const getWorkerStats = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    // Get profile stats
    const profileRes = await query(
      `SELECT rating, completed_jobs, total_reviews FROM worker_profiles WHERE user_id = $1`,
      [workerId]
    );
    const profile = profileRes.rows[0] || { rating: 0, completed_jobs: 0, total_reviews: 0 };

    res.json({
      total_reviews: parseInt(profile.total_reviews || 0),
      completed_jobs: profile.completed_jobs,
      rating: parseFloat(profile.rating)
    });
  } catch (err) {
    next(err);
  }
};

export const getWorkerJobs = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const { status } = req.query; // 'pending', 'active', 'history' (custom), or specific DB status

    let statusClause = '';
    const params = [workerId];

    if (status) {
      if (status === 'history') {
        statusClause = `AND (b.status = 'completed' OR b.status = 'rejected' OR b.status = 'cancelled')`;
      } else if (status === 'active') {
        statusClause = `AND (b.status = 'accepted' OR b.status = 'in_progress')`;
      } else {
        params.push(status);
        statusClause = `AND b.status = $2`;
      }
    }

    const queryStr = `
      SELECT b.*, 
             COALESCE(s.name, 'General Service') as service_name, 
             u.name as client_name, u.profile_image as client_image,
             u.phone as client_phone, u.email as client_email
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.client_id = u.id
      WHERE b.worker_id = $1 ${statusClause}
      ORDER BY b.booking_date DESC
    `;

    const result = await query(queryStr, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching worker jobs:', err);
    next(err);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const workerId = req.user.id;

    // Validate status
    const allowedStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get current status before updating (for undo functionality)
    const currentJob = await query(
      `SELECT status FROM bookings WHERE id = $1 AND worker_id = $2`,
      [id, workerId]
    );

    if (currentJob.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const previousStatus = currentJob.rows[0].status;

    // Don't allow changes to completed jobs
    if (previousStatus === 'completed') {
      return res.status(400).json({ message: "Cannot modify completed jobs" });
    }

    // Update status with previous_status and status_changed_at for undo support
    const result = await query(
      `UPDATE bookings 
       SET status = $1, 
           previous_status = $2, 
           status_changed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND worker_id = $4 
       RETURNING *`,
      [status, previousStatus, id, workerId]
    );

    // If status is completed, increment worker_profiles.completed_jobs
    if (status === 'completed') {
      await query(
        `UPDATE worker_profiles SET completed_jobs = completed_jobs + 1 WHERE user_id = $1`,
        [workerId]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const getSavedClients = async (req, res, next) => {
  try {
    const workerId = req.user.id;
    const result = await query(
      `SELECT sc.id, sc.client_id, u.name, u.email, u.phone, u.profile_image, u.address
       FROM saved_clients sc
       JOIN users u ON sc.client_id = u.id
       WHERE sc.worker_id = $1`,
      [workerId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const listWorkers = async (req, res, next) => {
  try {
    // Get query parameters for filtering
    const { search, category, min_price, max_price, min_rating, location } = req.query;

    let whereClause = `WHERE u.role='worker' AND u.is_active = TRUE`;
    const params = [];
    let paramIndex = 1;

    // Add filtering logic
    if (search) {
      params.push(`%${search}%`);
      whereClause += ` AND (u.name ILIKE $${paramIndex} OR wp.title ILIKE $${paramIndex} OR wp.bio ILIKE $${paramIndex})`;
      paramIndex++;
    }

    if (category) {
      params.push(category);
      whereClause += ` AND $${paramIndex} = ANY(wp.skills)`;
      paramIndex++;
    }

    if (min_price) {
      params.push(parseFloat(min_price));
      whereClause += ` AND wp.hourly_rate >= $${paramIndex}`;
      paramIndex++;
    }

    if (max_price) {
      params.push(parseFloat(max_price));
      whereClause += ` AND wp.hourly_rate <= $${paramIndex}`;
      paramIndex++;
    }

    if (min_rating) {
      params.push(parseFloat(min_rating));
      whereClause += ` AND wp.rating >= $${paramIndex}`;
      paramIndex++;
    }

    if (location) {
      params.push(`%${location}%`);
      whereClause += ` AND wp.service_location ILIKE $${paramIndex}`;
      paramIndex++;
    }

    const result = await query(
      `SELECT u.id, u.name, 
              COALESCE(u.profile_image, 'https://via.placeholder.com/300x200?text=Worker') as image_url, 
              wp.skills, 
              COALESCE(wp.hourly_rate, 25) as hourly_rate, 
              COALESCE(wp.rating, 0) as rating, 
              COALESCE(wp.total_reviews, 0) as rating_count,
              COALESCE(wp.title, 'Service Professional') as role,
              wp.bio as description,
              wp.service_location as location
       FROM users u
       JOIN worker_profiles wp ON wp.user_id = u.id
       ${whereClause}
       ORDER BY wp.rating DESC NULLS LAST, wp.total_reviews DESC NULLS LAST`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Undo a job status change (within 60-second window)
export const undoJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const workerId = req.user.id;

    // Get current job with undo info
    const jobResult = await query(
      `SELECT id, status, previous_status, status_changed_at 
       FROM bookings 
       WHERE id = $1 AND worker_id = $2`,
      [id, workerId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const job = jobResult.rows[0];

    // Check if previous_status exists
    if (!job.previous_status) {
      return res.status(400).json({ message: "No previous status to revert to" });
    }

    // Check if within 60-second window
    const changedAt = new Date(job.status_changed_at);
    const now = new Date();
    const elapsedSeconds = (now - changedAt) / 1000;

    if (elapsedSeconds > 60) {
      return res.status(400).json({
        message: "Undo window expired (60 seconds)",
        elapsed: Math.floor(elapsedSeconds)
      });
    }

    // Revert to previous status and clear undo data
    const result = await query(
      `UPDATE bookings 
       SET status = $1, 
           previous_status = NULL, 
           status_changed_at = NULL,
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND worker_id = $3 
       RETURNING *`,
      [job.previous_status, id, workerId]
    );

    res.json({
      message: "Status reverted successfully",
      booking: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Save a client from a completed job
export const saveClientFromJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const workerId = req.user.id;

    // Get the job and verify it's completed
    const jobResult = await query(
      `SELECT client_id, status FROM bookings WHERE id = $1 AND worker_id = $2`,
      [jobId, workerId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const job = jobResult.rows[0];

    // Only allow saving clients from completed jobs
    if (job.status !== 'completed') {
      return res.status(400).json({ message: "Can only save clients from completed jobs" });
    }

    // Insert with ON CONFLICT to prevent duplicates
    const result = await query(
      `INSERT INTO saved_clients (worker_id, client_id)
       VALUES ($1, $2)
       ON CONFLICT (worker_id, client_id) DO NOTHING
       RETURNING *`,
      [workerId, job.client_id]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Client already saved", alreadySaved: true });
    }

    // Get client details for response
    const clientResult = await query(
      `SELECT id, name, email, phone, profile_image FROM users WHERE id = $1`,
      [job.client_id]
    );

    res.status(201).json({
      message: "Client saved successfully",
      client: clientResult.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

