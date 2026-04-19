import { Router } from 'express';
import { query } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { hashPassword, comparePassword } from '../utils/password.js';

const router = Router();

// Update Profile
router.patch('/', authenticate(), async (req, res) => {
    try {
        const { name, email, phone, address, profile_image } = req.body;

        await query(
            `UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        address = COALESCE($4, address),
        profile_image = COALESCE($5, profile_image),
        updated_at = NOW()
       WHERE id = $6`,
            [name, email, phone, address, profile_image, req.user.id]
        );

        const updatedUser = await query('SELECT id, name, email, phone, address, profile_image, role FROM users WHERE id=$1', [req.user.id]);
        res.json({ message: 'Profile updated successfully', user: updatedUser.rows[0] });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Change Password
router.patch('/password', authenticate(), async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        const userRes = await query('SELECT password FROM users WHERE id=$1', [req.user.id]);
        const user = userRes.rows[0];
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await comparePassword(current_password, user.password);
        if (!match) return res.status(401).json({ message: 'Current password incorrect' });

        const hashed = await hashPassword(new_password);
        await query('UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2', [hashed, req.user.id]);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Error changing password' });
    }
});

export default router;
