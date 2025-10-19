/**
 * MeeChain Singapore API Server
 * Export Log and DAO Governance Integration
 */

import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import logsRouter from './routes/logs.js'
import { initializeSampleData } from './models/RefundLog.js'

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MeeChain Singapore API'
  })
})

// API Routes
app.use('/api/logs', logsRouter)

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MeeChain Singapore API',
    version: '1.0.0',
    description: 'Export Log and DAO Governance Integration',
    endpoints: {
      health: '/health',
      logs: {
        getAll: 'GET /api/logs',
        getById: 'GET /api/logs/:refundId',
        create: 'POST /api/logs',
        update: 'PUT /api/logs/:refundId',
        exportCSV: 'GET /api/logs/export-csv',
        flag: 'POST /api/logs/flag',
        getAllFlags: 'GET /api/logs/flags/all',
        getFlagsByRefund: 'GET /api/logs/:refundId/flags'
      }
    }
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  })
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
})

// Initialize sample data
initializeSampleData()

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MeeChain Singapore API Server`)
  console.log(`📡 Listening on http://localhost:${PORT}`)
  console.log(`📊 Sample data initialized`)
  console.log(``)
  console.log(`Available endpoints:`)
  console.log(`  - GET  /health`)
  console.log(`  - GET  /api/logs`)
  console.log(`  - GET  /api/logs/export-csv`)
  console.log(`  - POST /api/logs/flag`)
  console.log(`  - GET  /api/logs/flags/all`)
})

export default app
