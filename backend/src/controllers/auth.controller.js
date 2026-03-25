import pool, { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      bio,
      skills = [],
      hourly_rate,
      availability,
    } = req.body;

    const passwordHash = await hashPassword(password);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role`,
      [name, email, passwordHash, role, phone, address]
    );
    const user = userResult.rows[0];

    if (role === 'worker') {
      await client.query(
        `INSERT INTO worker_profiles (user_id, bio, skills, hourly_rate, availability)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, bio || '', skills, hourly_rate || null, availability || {}]
      );
    }

    await client.query('COMMIT');
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.status(201).json({ user, token });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Registration Error:', err);
    const isDuplicate = err?.message?.includes('users_email_key');
    return res.status(isDuplicate ? 409 : 500).json({
      message: isDuplicate ? 'Email already exists' : 'Registration failed',
    });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  console.log('Login attempt:', req.body.email);
  const { email, password } = req.body;
  const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = existing.rows[0];
  if (!user) {
    console.log('User not found for email:', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const valid = await comparePassword(password, user.password);
  console.log('Password valid for user:', user.id, valid);
  if (!valid) {
    console.log('Password mismatch for user:', user.id);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profile_image: user.profile_image,
      // Client Frontend Compatibility
      full_name: user.name,
      user_type: user.role,
      profile_image_url: user.profile_image
    },
    token,
  });
};

export const me = async (req, res) => {
  const userResult = await query(
    `SELECT u.id, u.name, u.email, u.role, u.phone, u.address, u.profile_image,
            wp.bio, wp.skills, wp.hourly_rate, wp.availability, wp.rating, wp.total_reviews
     FROM users u
     LEFT JOIN worker_profiles wp ON wp.user_id = u.id
     WHERE u.id = $1`,
    [req.user.id]
  );
  const user = userResult.rows[0];
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({
    user: {
      ...user,
      full_name: user.name,
      user_type: user.role,
      profile_image_url: user.profile_image
    }
  });
};

