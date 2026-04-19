import { query } from '../config/db.js';

export const createReview = async (req, res) => {
  const { booking_id, reviewee_id, rating, comment } = req.body;
  try {
    const result = await query(
      `INSERT INTO reviews (booking_id, reviewer_id, reviewee_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [booking_id, req.user.id, reviewee_id, rating, comment]
    );


    await query(
      `UPDATE worker_profiles 
       SET 
         total_reviews = total_reviews + 1,
         rating = ((rating * total_reviews) + $1) / (total_reviews + 1)
       WHERE user_id = $2`,
      [rating, reviewee_id]
    );

    return res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    console.error("Create review error:", err);
    return res.status(500).json({ message: 'Failed to create review' });
  }
};

export const listReviewsForUser = async (req, res) => {
  const { userId } = req.params;
  const result = await query(
    `SELECT r.*, u.name as reviewer_name
     FROM reviews r
     JOIN users u ON r.reviewer_id = u.id
     WHERE r.reviewee_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return res.json({ reviews: result.rows });
};

