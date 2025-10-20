import { Router, Request, Response } from 'express';
import { getDatabase } from '../models/database';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req: Request, res: Response) => {
  try {
    // Check database connection
    const db = getDatabase();
    const result = db.prepare('SELECT 1 as ok').get() as { ok: number };

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: result.ok === 1 ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
