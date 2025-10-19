/**
 * Backend API server for MeeChain Auditor Dashboard
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database';
import { notifyAuditorTeam } from './notifications';
import { FlagRequest, ApiResponse, RefundFlag } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all refund logs
app.get('/api/logs', (req: Request, res: Response) => {
  try {
    const logs = db.refundLogs.getAll();
    const response: ApiResponse = {
      status: 'success',
      data: logs,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching logs:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to fetch logs',
    };
    res.status(500).json(response);
  }
});

// Get a specific refund log by ID
app.get('/api/logs/:refundId', (req: Request, res: Response) => {
  try {
    const { refundId } = req.params;
    const log = db.refundLogs.getById(refundId);

    if (!log) {
      const response: ApiResponse = {
        status: 'error',
        error: 'Refund log not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      status: 'success',
      data: log,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching log:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to fetch log',
    };
    res.status(500).json(response);
  }
});

// Search refund logs
app.get('/api/logs/search/:query', (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const logs = db.refundLogs.search(query);
    const response: ApiResponse = {
      status: 'success',
      data: logs,
    };
    res.json(response);
  } catch (error) {
    console.error('Error searching logs:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to search logs',
    };
    res.status(500).json(response);
  }
});

// Filter refund logs by date range
app.get('/api/logs/filter/date', (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const response: ApiResponse = {
        status: 'error',
        error: 'startDate and endDate query parameters are required',
      };
      return res.status(400).json(response);
    }

    const logs = db.refundLogs.filterByDateRange(
      startDate as string,
      endDate as string
    );
    const response: ApiResponse = {
      status: 'success',
      data: logs,
    };
    res.json(response);
  } catch (error) {
    console.error('Error filtering logs:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to filter logs',
    };
    res.status(500).json(response);
  }
});

// Flag a refund log
app.post('/api/logs/flag', async (req: Request, res: Response) => {
  try {
    const { refundId, reason, flaggedBy }: FlagRequest = req.body;

    // Validate request
    if (!refundId || !reason || !flaggedBy) {
      const response: ApiResponse = {
        status: 'error',
        error: 'refundId, reason, and flaggedBy are required',
      };
      return res.status(400).json(response);
    }

    // Check if refund log exists
    const log = db.refundLogs.getById(refundId);
    if (!log) {
      const response: ApiResponse = {
        status: 'error',
        error: 'Refund log not found',
      };
      return res.status(404).json(response);
    }

    // Create flag
    const flag: RefundFlag = {
      id: `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      refundId,
      reason,
      flaggedBy,
      flaggedAt: new Date().toISOString(),
    };

    // Save flag to database
    db.refundFlags.add(flag);

    // Send notification
    await notifyAuditorTeam(refundId, reason, flaggedBy);

    const response: ApiResponse = {
      status: 'flagged',
      data: flag,
      message: 'Refund log flagged successfully',
    };
    res.json(response);
  } catch (error) {
    console.error('Error flagging log:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to flag log',
    };
    res.status(500).json(response);
  }
});

// Get all flags
app.get('/api/flags', (req: Request, res: Response) => {
  try {
    const flags = db.refundFlags.getAll();
    const response: ApiResponse = {
      status: 'success',
      data: flags,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching flags:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to fetch flags',
    };
    res.status(500).json(response);
  }
});

// Get flags for a specific refund
app.get('/api/flags/:refundId', (req: Request, res: Response) => {
  try {
    const { refundId } = req.params;
    const flags = db.refundFlags.getByRefundId(refundId);
    const response: ApiResponse = {
      status: 'success',
      data: flags,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching flags:', error);
    const response: ApiResponse = {
      status: 'error',
      error: 'Failed to fetch flags',
    };
    res.status(500).json(response);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MeeChain Auditor API Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/logs`);
  console.log(`   GET  /api/logs/:refundId`);
  console.log(`   GET  /api/logs/search/:query`);
  console.log(`   GET  /api/logs/filter/date?startDate=...&endDate=...`);
  console.log(`   POST /api/logs/flag`);
  console.log(`   GET  /api/flags`);
  console.log(`   GET  /api/flags/:refundId`);
});

export default app;
