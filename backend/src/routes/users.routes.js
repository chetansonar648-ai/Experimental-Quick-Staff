import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { updateProfile, list } from '../controllers/users.controller.js';

const router = Router();

router.get('/', authRequired(['admin']), list);
router.put('/me', authRequired(), updateProfile);

export default router;

