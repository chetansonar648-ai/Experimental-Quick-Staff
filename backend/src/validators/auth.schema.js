import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(64).required(),
    role: Joi.string().valid('client', 'worker').required(),
    phone: Joi.string().allow(null, '').optional(),
    address: Joi.string().allow(null, '').optional(),
    bio: Joi.string().allow(null, '').optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    hourly_rate: Joi.number().precision(2).optional(),
    availability: Joi.object().unknown(true).optional(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

