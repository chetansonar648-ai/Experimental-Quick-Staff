import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createBooking, listBookings, updateStatus } from '../controllers/bookings.controller.js';

const router = Router();

router.get('/', authRequired(), listBookings);
router.post('/', authRequired(['client']), createBooking);
router.patch('/:bookingId/status', authRequired(), updateStatus);

export default router;

