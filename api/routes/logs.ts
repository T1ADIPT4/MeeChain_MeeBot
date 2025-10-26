/**
 * API Routes for Refund Log Management
 * MeeChain Singapore - DAO Governance Integration
 */

import { Router, Request, Response } from 'express'
import { Parser } from 'json2csv'
import {
  getAllRefundLogs,
  getRefundLogById,
  addRefundLog,
  updateRefundLog,
  getAllRefundFlags,
  getFlagsByRefundId,
  addRefundFlag,
  RefundLog,
  RefundFlag
} from '../models/RefundLog.js'

const router = Router()

/**
 * GET /api/logs/export-csv
 * Export all refund logs as CSV
 */
router.get('/export-csv', async (req: Request, res: Response) => {
  try {
    const logs = getAllRefundLogs()

    const fields = [
      'refundId',
      'userAddress',
      'txHash',
      'amount',
      'status',
      'verifiedAt',
      'refundTxHash',
      'reason',
      'executedBy',
      'createdAt',
      'updatedAt'
    ]

    const parser = new Parser({ fields })
    const csv = parser.parse(logs)

    res.header('Content-Type', 'text/csv')
    res.attachment('meechain_refund_logs.csv')
    res.send(csv)
  } catch (error) {
    console.error('Error exporting CSV:', error)
    res.status(500).json({ 
      error: 'Failed to export CSV',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/logs
 * Get all refund logs as JSON
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const logs = getAllRefundLogs()
    res.json({
      success: true,
      count: logs.length,
      data: logs
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ 
      error: 'Failed to fetch logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/logs/:refundId
 * Get a specific refund log by ID
 */
router.get('/:refundId', async (req: Request, res: Response) => {
  try {
    const { refundId } = req.params
    const log = getRefundLogById(refundId)
    
    if (!log) {
      return res.status(404).json({
        error: 'Refund log not found',
        refundId
      })
    }
    
    // Get associated flags
    const flags = getFlagsByRefundId(refundId)
    
    res.json({
      success: true,
      data: {
        ...log,
        flags
      }
    })
  } catch (error) {
    console.error('Error fetching log:', error)
    res.status(500).json({ 
      error: 'Failed to fetch log',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/logs
 * Create a new refund log
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const logData: RefundLog = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const newLog = addRefundLog(logData)
    
    res.status(201).json({
      success: true,
      data: newLog
    })
  } catch (error) {
    console.error('Error creating log:', error)
    res.status(500).json({ 
      error: 'Failed to create log',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * PUT /api/logs/:refundId
 * Update a refund log
 */
router.put('/:refundId', async (req: Request, res: Response) => {
  try {
    const { refundId } = req.params
    const updates = req.body
    
    const updatedLog = updateRefundLog(refundId, updates)
    
    if (!updatedLog) {
      return res.status(404).json({
        error: 'Refund log not found',
        refundId
      })
    }
    
    res.json({
      success: true,
      data: updatedLog
    })
  } catch (error) {
    console.error('Error updating log:', error)
    res.status(500).json({ 
      error: 'Failed to update log',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * POST /api/logs/flag
 * Flag a refund log for review (Dispute Flagging)
 */
router.post('/flag', async (req: Request, res: Response) => {
  try {
    const { refundId, reason, flaggedBy } = req.body
    
    if (!refundId || !reason || !flaggedBy) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['refundId', 'reason', 'flaggedBy']
      })
    }
    
    const flagData: RefundFlag = {
      refundId,
      reason,
      flaggedBy,
      flaggedAt: new Date().toISOString(),
      status: 'open'
    }
    
    const newFlag = addRefundFlag(flagData)
    
    res.status(201).json({
      success: true,
      status: 'flagged',
      data: newFlag
    })
  } catch (error) {
    console.error('Error flagging log:', error)
    res.status(500).json({ 
      error: 'Failed to flag log',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/logs/flags/all
 * Get all flags across all refund logs
 */
router.get('/flags/all', async (req: Request, res: Response) => {
  try {
    const flags = getAllRefundFlags()
    res.json({
      success: true,
      count: flags.length,
      data: flags
    })
  } catch (error) {
    console.error('Error fetching flags:', error)
    res.status(500).json({ 
      error: 'Failed to fetch flags',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * GET /api/logs/:refundId/flags
 * Get all flags for a specific refund log
 */
router.get('/:refundId/flags', async (req: Request, res: Response) => {
  try {
    const { refundId } = req.params
    const flags = getFlagsByRefundId(refundId)
    
    res.json({
      success: true,
      count: flags.length,
      data: flags
    })
  } catch (error) {
    console.error('Error fetching flags:', error)
    res.status(500).json({ 
      error: 'Failed to fetch flags',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
