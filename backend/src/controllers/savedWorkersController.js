import { query } from "../config/db.js";

export const saveWorker = async (req, res, next) => {
  const { worker_id } = req.body;
  try {
    const result = await query(
      `INSERT INTO saved_workers (client_id, worker_id)
       VALUES ($1,$2) ON CONFLICT (client_id, worker_id) DO NOTHING
       RETURNING *`,
      [req.user.id, worker_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const removeSavedWorker = async (req, res, next) => {
  try {
    await query("DELETE FROM saved_workers WHERE client_id=$1 AND worker_id=$2", [req.user.id, req.params.id]);
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
};

export const listSavedWorkers = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT sw.worker_id, u.name, u.profile_image, wp.skills, wp.hourly_rate, wp.rating
       FROM saved_workers sw
       JOIN users u ON u.id = sw.worker_id
       LEFT JOIN worker_profiles wp ON wp.user_id = sw.worker_id
       WHERE sw.client_id=$1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

