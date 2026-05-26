import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import collegesRoutes from './routes/colleges.routes';
import compareRoutes from './routes/compare.routes';
import predictorRoutes from './routes/predictor.routes';
import discussionsRoutes from './routes/discussions.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Global middleware
app.use(helmet());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegesRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/predictor', predictorRoutes);
app.use('/api/discussions', discussionsRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`CampusLens backend server running on port ${PORT}`);
  });
}

export default app;
