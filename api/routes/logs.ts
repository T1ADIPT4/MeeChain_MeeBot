/**
 * API Routes for Refund Log Management
 * MeeChain Singapore - DAO Governance Integration
 */

import express from 'express';
import { verifyRole } from '../middleware/auth';
import { getLogs } from '../controllers/logs';

const router = express.Router();

router.get('/', verifyRole(['auditor', 'admin']), getLogs);

export default router;
