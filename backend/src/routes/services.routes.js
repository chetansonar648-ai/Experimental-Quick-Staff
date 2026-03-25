import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  listServices,
  createService,
  listWorkerServices,
  addWorkerService,
} from '../controllers/services.controller.js';

const router = Router();

router.get('/', listServices);
router.post('/', authRequired(['admin']), createService);
router.get('/worker/:workerId?', authRequired(), listWorkerServices);
router.post('/worker', authRequired(['worker']), addWorkerService);

export default router;

