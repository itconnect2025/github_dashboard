import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './models/database';
import healthRouter from './routes/health';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase();

// Routes
app.use('/api/health', healthRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'DevStats API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      config: '/api/config',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DevStats API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
