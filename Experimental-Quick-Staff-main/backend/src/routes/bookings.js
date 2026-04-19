import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { createBooking, listBookings, updateStatus, getBookingStats, getBookingsByClientId, rescheduleBooking, createBookingReview } from '../controllers/bookings.controller.js';

const validateBooking = [
  body('worker_id').isInt(),
  body('service_id').optional({ nullable: true }).isInt(),
  body('booking_date').notEmpty(),
  body('duration_hours').isInt(),
  body('total_price').isNumeric(),
];

const router = Router();

// Stats must be before /:id routes
router.get('/stats/summary', authenticate(['client', 'worker']), getBookingStats);

router.post('/', authenticate(['client']), validateBooking, createBooking);

router.get('/client', authenticate(['client']), listBookings);
router.get('/worker', authenticate(['worker']), listBookings);

// Get bookings by client ID (for workers viewing client profile)
router.get('/client/:clientId', authenticate(['worker']), getBookingsByClientId);

// Reschedule booking (clients only)
router.patch('/:bookingId/reschedule', authenticate(['client']), rescheduleBooking);

router.patch('/:bookingId/status', authenticate(['worker', 'client']), updateStatus);

// Create Booking Review by ID
router.post('/:bookingId/review', authenticate(['client']), createBookingReview);

export default router;
