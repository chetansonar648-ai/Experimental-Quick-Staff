import { query } from '../config/db.js';

export const updateProfile = async (req, res) => {
  const { name, phone, address, profile_image } = req.body;
  try {
    const result = await query(
      `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone),
              address = COALESCE($3, address), profile_image = COALESCE($4, profile_image),
              updated_at = NOW()
       WHERE id = $5 RETURNING id, name, email, role, phone, address, profile_image`,
      [name, phone, address, profile_image, req.user.id]
    );
    return res.json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const list = async (_req, res) => {
  const result = await query(
    'SELECT id, name, email, role, phone, address, profile_image FROM users ORDER BY created_at DESC'
  );
  return res.json({ users: result.rows });
};

