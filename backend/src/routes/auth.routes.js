import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';
import { authRequired } from '../middleware/auth.js';
import { googleAuth } from "../controllers/auth.controller.js";

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authRequired(), me);
router.post("/google", googleAuth);


export default router;

