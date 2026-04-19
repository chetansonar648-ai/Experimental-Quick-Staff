import { query } from '../config/db.js';

export const createBooking = async (req, res) => {
  const { worker_id, service_id, booking_date, start_time, end_time, duration_hours, total_price, address, special_instructions } =
    req.body;

  try {
    const result = await query(
      `INSERT INTO bookings (client_id, worker_id, service_id, booking_date, start_time, end_time, duration_hours,
        total_price, address, special_instructions, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING *`,
      [
        req.user.id,
        worker_id,
        service_id,
        booking_date,
        start_time || null,
        end_time || null,
        duration_hours,
        total_price,
        address || 'Not specified',
        special_instructions,
      ]
    );
    return res.status(201).json({ booking: result.rows[0] });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};


export const listBookings = async (req, res) => {
  const { status } = req.query;
  const isWorker = req.user.role === 'worker';
  const roleColumn = isWorker ? 'b.worker_id' : 'b.client_id';
  const otherRoleColumn = isWorker ? 'b.client_id' : 'b.worker_id';

  let queryText = `
    SELECT
      b.*,
      b.total_price as total_amount,
      COALESCE(s.name, 'General Service') as service_type,
      s.image_url as service_image,
      u.name as ${isWorker ? 'client_name' : 'worker_name'},
      u.profile_image as ${isWorker ? 'client_image' : 'worker_image'},
      u.address as user_address,
      wp.title as worker_role
    FROM bookings b
    LEFT JOIN services s ON b.service_id = s.id
    LEFT JOIN users u ON ${otherRoleColumn} = u.id
    LEFT JOIN worker_profiles wp ON b.worker_id = wp.user_id
    WHERE ${roleColumn} = $1
  `;

  const queryParams = [req.user.id];

  if (status) {
    if (status === 'pending' || status === 'requested') {
      // Catch-all for pending/requested/NULL to ensure visibility
      queryText += ` AND (b.status = 'pending' OR b.status = 'requested' OR b.status IS NULL)`;
    } else if (status === 'all_active') {
      // Broad filter: Pending, Accepted, In Progress (for Upcoming Tab)
      queryText += ` AND b.status IN ('pending', 'accepted', 'in_progress')`;
    } else {
      queryText += ` AND b.status = $2`;
      queryParams.push(status);
    }
  }

  queryText += ` ORDER BY b.created_at DESC`;

  try {
    const result = await query(queryText, queryParams);
    // Map usage of address
    const mappedRows = result.rows.map(row => ({
      ...row,
      location_address: row.address || row.user_address // Use booking address if set, else user address
    }));
    return res.json(mappedRows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status, cancelled_by, cancellation_reason } = req.body;
  const allowed = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    let queryText = `UPDATE bookings SET status = $1, updated_at = NOW()`;
    const params = [status, bookingId];
    let paramIndex = 3;

    if (status === 'cancelled') {
      queryText += `, cancelled_at = NOW(), cancelled_by = $${paramIndex}, cancellation_reason = $${paramIndex + 1}`;
      params.push(cancelled_by || 'unknown', cancellation_reason || 'No reason provided');
    }

    queryText += ` WHERE id = $2 RETURNING *`;

    const result = await query(queryText, params);
    return res.json({ booking: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

export const rescheduleBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { booking_date, start_time } = req.body;

  if (!booking_date || !start_time) {
    return res.status(400).json({ message: 'booking_date and start_time are required' });
  }

  try {
    // First, check if the booking belongs to the client
    const bookingCheck = await query(
      `SELECT * FROM bookings WHERE id = $1 AND client_id = $2`,
      [bookingId, req.user.id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or you do not have permission to reschedule it' });
    }

    // Update the booking with new date and time
    const result = await query(
      `UPDATE bookings 
       SET booking_date = $1, start_time = $2, updated_at = NOW() 
       WHERE id = $3 AND client_id = $4
       RETURNING *`,
      [booking_date, start_time, bookingId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Failed to reschedule booking' });
    }

    return res.json({
      message: 'Booking rescheduled successfully',
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('Reschedule error:', err);
    return res.status(500).json({ message: 'Failed to reschedule booking', error: err.message });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const isWorker = req.user.role === 'worker';
    const column = isWorker ? 'worker_id' : 'client_id';

    const result = await query(
      `SELECT status, COUNT(*) as count 
       FROM bookings 
       WHERE ${column} = $1 
       GROUP BY status`,
      [req.user.id]
    );

    const stats = {
      active: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    };

    result.rows.forEach(row => {
      const count = parseInt(row.count);
      stats.total += count;
      if (['pending', 'accepted', 'in_progress'].includes(row.status)) {
        stats.active += count;
      } else if (row.status === 'completed') {
        stats.completed += count;
      } else if (row.status === 'cancelled') {
        stats.cancelled += count;
      }
    });

    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getBookingsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Only workers can use this endpoint
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can view client booking history' });
    }

    const result = await query(
      `SELECT
        b.*,
        b.total_price as total_amount,
        COALESCE(s.name, 'General Service') as service_name,
        s.image_url as service_image,
        u.name as client_name,
        u.profile_image as client_image
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.client_id = u.id
      WHERE b.client_id = $1 AND b.worker_id = $2
      ORDER BY b.created_at DESC`,
      [clientId, req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client bookings:', err);
    return res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const createBookingReview = async (req, res) => {
  const { bookingId } = req.params;
  const { rating, comment } = req.body;

  if (!rating) return res.status(400).json({ message: 'Rating is required' });

  try {
    // Verify booking exists, belongs to client, and get worker_id
    const bookingRes = await query(
      `SELECT * FROM bookings WHERE id = $1 AND client_id = $2`,
      [bookingId, req.user.id]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    const booking = bookingRes.rows[0];
    const workerId = booking.worker_id;

    // Check if already reviewed
    const existingReview = await query(
      `SELECT id FROM reviews WHERE booking_id = $1`,
      [bookingId]
    );
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: 'Booking already reviewed' });
    }

    // Insert Review
    const reviewRes = await query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [bookingId, req.user.id, workerId, rating, comment]
    );

    // Update Worker Profile Stats
    await query(
      `INSERT INTO worker_profiles (user_id, rating, total_reviews, completed_jobs)
       VALUES ($1, $2, 1, 0)
       ON CONFLICT (user_id) DO UPDATE SET
         total_reviews = worker_profiles.total_reviews + 1,
         rating = ((COALESCE(worker_profiles.rating, 0) * COALESCE(worker_profiles.total_reviews, 0)) + $2) / (COALESCE(worker_profiles.total_reviews, 0) + 1),
         updated_at = CURRENT_TIMESTAMP`,
      [workerId, rating]
    );

    return res.status(201).json({ review: reviewRes.rows[0], message: "Review submitted successfully" });

  } catch (err) {
    console.error("Error submitting review:", err);
    return res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

