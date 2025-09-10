
import { Request, Response } from 'express';

interface EarningRecord {
  id: string;
  userId: string;
  date: string;
  activity: string;
  amount: string;
  token: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

interface UserEarnings {
  [token: string]: string;
}

// Mock data storage (replace with database in production)
const userEarnings = new Map<string, UserEarnings>();
const earningsHistory = new Map<string, EarningRecord[]>();

// Initialize mock data
const initializeMockData = () => {
  // Sample user earnings
  userEarnings.set('user_123', {
    'USDC': '0.15',
    'MeeToken': '5.0',
    'ETH': '0.002'
  });

  // Sample earnings history
  earningsHistory.set('user_123', [
    {
      id: '1',
      userId: 'user_123',
      date: '2025-01-07',
      activity: 'เชื่อม DApp ครั้งแรก',
      amount: '0.05',
      token: 'USDC',
      status: 'completed',
      txHash: '0x123...'
    },
    {
      id: '2',
      userId: 'user_123',
      date: '2025-01-06',
      activity: 'เชิญเพื่อน',
      amount: '0.10',
      token: 'USDC',
      status: 'completed',
      txHash: '0x456...'
    },
    {
      id: '3',
      userId: 'user_123',
      date: '2025-01-07',
      activity: 'ทำภารกิจรายวัน',
      amount: '2.0',
      token: 'MeeToken',
      status: 'completed'
    },
    {
      id: '4',
      userId: 'user_123',
      date: '2025-01-05',
      activity: 'Swap tokens',
      amount: '0.001',
      token: 'ETH',
      status: 'completed',
      txHash: '0x789...'
    }
  ]);
};

initializeMockData();

export const getEarningsSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId parameter is required'
      });
    }

    const totalEarnings = userEarnings.get(userId as string) || {};
    const history = earningsHistory.get(userId as string) || [];
    
    // Calculate today's earnings
    const today = new Date().toISOString().split('T')[0];
    const todayEarnings: UserEarnings = {};
    
    history
      .filter(record => record.date === today && record.status === 'completed')
      .forEach(record => {
        const current = parseFloat(todayEarnings[record.token] || '0');
        todayEarnings[record.token] = (current + parseFloat(record.amount)).toString();
      });

    res.json({
      total: totalEarnings,
      today: todayEarnings,
      summary: {
        totalActivities: history.length,
        completedToday: history.filter(r => r.date === today && r.status === 'completed').length
      }
    });

  } catch (error) {
    console.error('Earnings summary error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get earnings summary'
    });
  }
};

export const getEarningsHistory = async (req: Request, res: Response) => {
  try {
    const { userId, limit = '20', offset = '0' } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId parameter is required'
      });
    }

    const history = earningsHistory.get(userId as string) || [];
    const startIndex = parseInt(offset as string);
    const limitNum = parseInt(limit as string);
    
    // Sort by date descending
    const sortedHistory = history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const paginatedHistory = sortedHistory.slice(startIndex, startIndex + limitNum);

    res.json({
      data: paginatedHistory,
      pagination: {
        total: history.length,
        offset: startIndex,
        limit: limitNum,
        hasMore: startIndex + limitNum < history.length
      }
    });

  } catch (error) {
    console.error('Earnings history error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get earnings history'
    });
  }
};

export const transferEarnings = async (req: Request, res: Response) => {
  try {
    const { userId, walletAddress, token, amount } = req.body;

    if (!userId || !walletAddress || !token || !amount) {
      return res.status(400).json({
        error: 'MISSING_FIELDS',
        message: 'userId, walletAddress, token, and amount are required'
      });
    }

    const userBalance = userEarnings.get(userId) || {};
    const availableBalance = parseFloat(userBalance[token] || '0');
    const transferAmount = parseFloat(amount);

    if (transferAmount <= 0) {
      return res.status(400).json({
        error: 'INVALID_AMOUNT',
        message: 'Transfer amount must be greater than 0'
      });
    }

    if (availableBalance < transferAmount) {
      return res.status(400).json({
        error: 'INSUFFICIENT_BALANCE',
        message: `Insufficient ${token} balance. Available: ${availableBalance}`
      });
    }

    // TODO: Implement actual blockchain transaction here
    // This would integrate with your smart contract

    // Mock transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;

    // Update user balance
    userBalance[token] = (availableBalance - transferAmount).toString();
    userEarnings.set(userId, userBalance);

    // Add to history
    const history = earningsHistory.get(userId) || [];
    history.unshift({
      id: Date.now().toString(),
      userId,
      date: new Date().toISOString().split('T')[0],
      activity: `โอนเข้ากระเป๋า ${walletAddress.substring(0, 6)}...`,
      amount: amount.toString(),
      token,
      status: 'completed',
      txHash
    });
    earningsHistory.set(userId, history);

    res.json({
      status: 'success',
      txHash,
      newBalance: userBalance[token],
      message: `${amount} ${token} transferred to ${walletAddress}`
    });

  } catch (error) {
    console.error('Transfer earnings error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to transfer earnings'
    });
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string || 'user_123'; // Mock user ID

    if (!userId) {
      return res.status(400).json({
        error: 'MISSING_USER_ID',
        message: 'userId parameter is required'
      });
    }

    const totalEarnings = userEarnings.get(userId) || {};
    const history = earningsHistory.get(userId) || [];
    
    // Calculate today's earnings
    const today = new Date().toISOString().split('T')[0];
    const todayEarnings: UserEarnings = {};
    
    history
      .filter(record => record.date === today && record.status === 'completed')
      .forEach(record => {
        const current = parseFloat(todayEarnings[record.token] || '0');
        todayEarnings[record.token] = (current + parseFloat(record.amount)).toString();
      });

    res.json({
      total: totalEarnings,
      today: todayEarnings,
      history: history.slice(0, 10), // Last 10 activities
      summary: {
        totalActivities: history.length,
        completedToday: history.filter(r => r.date === today && r.status === 'completed').length
      }
    });

  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to get earnings'
    });
  }
};
