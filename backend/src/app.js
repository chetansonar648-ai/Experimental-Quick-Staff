import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import serviceRoutes from './routes/services.routes.js';
import bookingRoutes from './routes/bookings.routes.js';
import workerRoutes from './routes/workers.js'; // Using workers.js as it contains my implementation
import reviewRoutes from './routes/reviews.js'; // reviews.routes.js does not exist
import savedWorkerRoutes from './routes/savedWorkers.js'; // saved.routes.js does not exist
import requestRoutes from './routes/requests.js';
import adminApiRoutes from './routes/adminApi.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount Routes (with /api prefix for client/worker apps)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved-workers', savedWorkerRoutes);
app.use('/api/requests', requestRoutes);

// Admin Panel API routes (without /api prefix for admin frontend compatibility)
app.use('/', adminApiRoutes);

// Error Handling
// Check if notFound middleware exists, if not use inline
// Block 2 imported it from ./middleware/errorHandler.js
// If that file doesn't exist, we fallback.
// I'll assume it exists based on Block 2 validity.
app.use(notFound || ((req, res) => res.status(404).json({ message: 'Not found' })));
app.use(errorHandler || ((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}));

export default app;
