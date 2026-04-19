

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import workerProfileRoutes from './routes/workerProfiles.js';
import serviceRoutes from './routes/services.js';
import workerServiceRoutes from './routes/workerServices.js';
import bookingRoutes from './routes/bookings.js';
import savedWorkerRoutes from './routes/savedWorkers.js';
import savedClientRoutes from './routes/savedClients.js';
import workerRoutes from './routes/workers.js';
import reviewRoutes from './routes/reviews.js';
import profileRoutes from './routes/profile.js';
import usersRoutes from './routes/users.js';

import adminApiRoutes from './routes/adminApi.js';

import { errorHandler } from './middleware/errorHandler.js';
import { ensureAuxTables } from './config/db.js';

dotenv.config();

const app = express();


app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));


app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/', adminApiRoutes);


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/worker-profiles', workerProfileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/worker-services', workerServiceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/saved-workers', savedWorkerRoutes);
app.use('/api/saved-clients', savedClientRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);


app.use(errorHandler);

const port = process.env.PORT || 4000;


ensureAuxTables()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to init DB', err);
    process.exit(1);
  });
