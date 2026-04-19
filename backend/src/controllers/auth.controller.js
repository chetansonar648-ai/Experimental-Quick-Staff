import pool, { query } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res) => {
  const clientConn = await pool.connect();
  try {
    await clientConn.query('BEGIN');

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
      service_id,
      services = [],
      google_auth = false,
      googleToken,
      profile_image,
    } = req.body;

    const isGoogleAuth = Boolean(google_auth || googleToken);
    let googlePayload = null;

    if (googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      googlePayload = ticket.getPayload();
      if (!googlePayload?.email) {
        await clientConn.query('ROLLBACK');
        return res.status(401).json({ message: 'Invalid Google token' });
      }
      if (email && googlePayload.email !== email) {
        await clientConn.query('ROLLBACK');
        return res.status(400).json({ message: 'Email does not match Google account' });
      }
    }

    const finalEmail = googlePayload?.email || email;
    const finalName = name || googlePayload?.name;
    const finalProfileImage = profile_image || googlePayload?.picture || null;

    if (!finalEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!finalName) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const existing = await clientConn.query('SELECT * FROM users WHERE email = $1', [finalEmail]);
    if (existing.rows.length > 0) {
      const existingUser = existing.rows[0];
      if (!isGoogleAuth) {
        await clientConn.query('ROLLBACK');
        return res.status(409).json({ message: 'Email already exists' });
      }
      const token = signToken({ id: existingUser.id, role: existingUser.role, email: existingUser.email });
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
      await clientConn.query('COMMIT');
      return res.json({
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          phone: existingUser.phone,
          address: existingUser.address,
          profile_image: existingUser.profile_image,
        },
        token,
      });
    }

    let passwordHash = 'google_auth';
    if (!isGoogleAuth) {
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }
      passwordHash = await hashPassword(password);
    }

    const userResult = await clientConn.query(
      `INSERT INTO users (name, email, password, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role`,
      [finalName, finalEmail, passwordHash, role, phone || null, address || null]
    );
    const user = userResult.rows[0];

    if (role === 'worker') {
      const singleServiceId = Number.isInteger(Number(service_id)) ? Number(service_id) : null;
      const legacyFirstServiceId =
        !singleServiceId && Array.isArray(services) && services.length
          ? Number(services[0])
          : null;
      const finalServiceId =
        singleServiceId || (Number.isInteger(legacyFirstServiceId) ? legacyFirstServiceId : null);

      let profileTitle = null;
      if (finalServiceId) {
        const svcRow = await clientConn.query(
          `SELECT name FROM services WHERE id = $1 AND is_active = TRUE`,
          [finalServiceId]
        );
        if (svcRow.rows[0]?.name) {
          profileTitle = svcRow.rows[0].name;
        }
      }

      await clientConn.query(
        `INSERT INTO worker_profiles (user_id, bio, skills, hourly_rate, availability, title)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.id, bio || '', skills, hourly_rate || null, availability || {}, profileTitle]
      );

      if (finalServiceId) {
        await clientConn.query(
          `INSERT INTO worker_services (worker_id, service_id, price)
           SELECT $1, s.id, COALESCE(s.base_price, 0)
           FROM services s
           WHERE s.is_active = TRUE AND s.id = $2`,
          [user.id, finalServiceId]
        );
      }
    }

    if (finalProfileImage) {
      await clientConn.query('UPDATE users SET profile_image = $1 WHERE id = $2', [finalProfileImage, user.id]);
      user.profile_image = finalProfileImage;
    }

    await clientConn.query('COMMIT');
    const token = signToken({ id: user.id, role: user.role, email: user.email });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.status(201).json({ user, token });
  } catch (err) {
    await clientConn.query('ROLLBACK');
    console.error('Registration Error:', err);
    const isDuplicate = err?.message?.includes('users_email_key');
    return res.status(isDuplicate ? 409 : 500).json({
      message: isDuplicate ? 'Email already exists' : 'Registration failed',
    });
  } finally {
    clientConn.release();
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

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token: googleIdToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let userResult = await query("SELECT * FROM users WHERE email=$1", [email]);

    if (userResult.rows.length === 0) {
      return res.json({
        isNewUser: true,
        googleData: { name, email, picture },
      });
    }

    const finalUser = userResult.rows[0];
    const jwtToken = signToken({ id: finalUser.id, role: finalUser.role, email: finalUser.email });
    res.cookie('token', jwtToken, { httpOnly: true, sameSite: 'lax' });

    return res.json({
      user: {
        id: finalUser.id,
        name: finalUser.name,
        email: finalUser.email,
        role: finalUser.role,
        phone: finalUser.phone,
        address: finalUser.address,
        profile_image: finalUser.profile_image,
      },
      token: jwtToken,
      isNewUser: false,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
};
