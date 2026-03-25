import { query } from '../config/db.js';

export const listServices = async (_req, res) => {
  const services = await query('SELECT * FROM services ORDER BY created_at DESC');
  return res.json(services.rows);
};

export const createService = async (req, res) => {
  const { name, description, category, base_price, duration_hours, image_url } = req.body;
  try {
    const result = await query(
      `INSERT INTO services (name, description, category, base_price, duration_hours, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, category, base_price, duration_hours, image_url]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create service' });
  }
};

export const listWorkerServices = async (req, res) => {
  const workerId = req.params.workerId || req.user.id;
  const result = await query(
    `SELECT ws.*, s.name, s.category, s.image_url
     FROM worker_services ws
     JOIN services s ON ws.service_id = s.id
     WHERE ws.worker_id = $1 AND ws.is_active = TRUE`,
    [workerId]
  );
  return res.json(result.rows);
};

export const addWorkerService = async (req, res) => {
  const { services_id, service_id, price } = req.body;
  const sId = services_id || service_id;
  try {
    const result = await query(
      `INSERT INTO worker_services (worker_id, services_id, price)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, sId, price]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to add service' });
  }
};

