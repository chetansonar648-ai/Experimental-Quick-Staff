import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../config/db.js';
import { comparePassword, hashPassword } from '../utils/password.js';

const router = Router();

router.get('/profile', authenticate(['admin']), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, created_at, profile_image
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const profile = result.rows[0];
    if (profile.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin access required' });
    }

    return res.json({ profile });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch admin profile' });
  }
});

router.put('/change-password', authenticate(['admin']), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const userResult = await query(
      `SELECT id, role, password
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (!userResult.rows.length) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const user = userResult.rows[0];
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin access required' });
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [
      newPasswordHash,
      user.id,
    ]);

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password' });
  }
});

export default router;
