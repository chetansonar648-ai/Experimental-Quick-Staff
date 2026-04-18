import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.when('google_auth', {
      is: true,
      then: Joi.string().allow(null, '').optional(),
      otherwise: Joi.string().min(6).max(64).required(),
    }),
    role: Joi.string().valid('client', 'worker').required(),
    google_auth: Joi.boolean().optional(),
    googleToken: Joi.string().allow(null, '').optional(),
    profile_image: Joi.string().allow(null, '').optional(),
    phone: Joi.string().allow(null, '').optional(),
    address: Joi.string().allow(null, '').optional(),
    bio: Joi.string().allow(null, '').optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    hourly_rate: Joi.number().precision(2).optional(),
    availability: Joi.object().unknown(true).optional(),
    // New worker flow: single service selection
    service_id: Joi.number().integer().allow(null).optional(),

    // Backwards-compatible: older/newer flows may send an array
    services: Joi.array().items(Joi.number().integer()).optional(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

