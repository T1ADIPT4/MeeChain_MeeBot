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
 * MeeBot Web3 Backend API Server
 * Handles Web3 interactions for MeeChain Supply system
 */

import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleTrigger } from './routes/trigger.js';
import { initializeWeb3 } from './utils/web3Config.js';
import { initializeDatabase } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateEnvironment(): void {
  const required = [
    'RPC_URL',
    'CONTRACT_ADDRESS',
    'MEEBOT_WALLET_ADDRESS',
    'PRIVATE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}

// Initialize application
function initializeApp(): Express {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      service: 'MeeBot Web3 Backend'
    });
  });
  
  // Main trigger endpoint
  app.post('/api/meechain/trigger', handleTrigger);
  
  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      error: `${req.method} ${req.path} does not exist`
    });
  });
  
  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  });
  
  return app;
}

// Main function
async function main(): Promise<void> {
  try {
    console.log('\n🚀 Starting MeeBot Web3 Backend...\n');
    
    // Validate environment
    validateEnvironment();
    console.log('✅ Environment variables validated');
    
    // Initialize Web3
    initializeWeb3({
      rpcUrl: process.env.RPC_URL!,
      contractAddress: process.env.CONTRACT_ADDRESS!,
      meeBotWalletAddress: process.env.MEEBOT_WALLET_ADDRESS!,
      privateKey: process.env.PRIVATE_KEY!
    });
    
    // Initialize database
    initializeDatabase();
    
    // Create Express app
    const app = initializeApp();
    
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Trigger endpoint: http://localhost:${PORT}/api/meechain/trigger`);
      console.log('\n🎯 Ready to handle requests!\n');
    });
    
  } catch (error: any) {
    console.error('\n❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { initializeApp };
