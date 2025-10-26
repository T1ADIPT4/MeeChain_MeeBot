/**
 * Database Logger for MeeBot Web3 Backend
 * Logs transaction history and status
 */

import { TransactionLog } from '../types/index.js';
import * as admin from 'firebase-admin';

// In-memory storage as fallback (can be replaced with actual database)
const logs: TransactionLog[] = [];

/**
 * Initialize Firebase Admin (if available)
 */
let db: admin.firestore.Firestore | null = null;

export function initializeDatabase() {
  try {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    db = admin.firestore();
    console.log('✅ Firebase database initialized');
  } catch (error) {
    console.warn('⚠️  Firebase not initialized, using in-memory storage');
  }
}

/**
 * Insert a new transaction log
 */
export async function insertLog(log: TransactionLog): Promise<void> {
  // Store in memory
  logs.push(log);
  
  // Store in Firebase if available
  if (db) {
    try {
      await db.collection('meechain_transactions').add({
        ...log,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }
  
  console.log(`📝 Log inserted: ${log.action} for ${log.user} - ${log.status}`);
}

/**
 * Update transaction status by txHash
 */
export async function updateLogStatus(
  txHash: string,
  status: 'pending' | 'success' | 'failed'
): Promise<void> {
  // Update in memory
  const log = logs.find(l => l.txHash === txHash);
  if (log) {
    log.status = status;
  }
  
  // Update in Firebase if available
  if (db) {
    try {
      const snapshot = await db
        .collection('meechain_transactions')
        .where('txHash', '==', txHash)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({
          status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating Firebase:', error);
    }
  }
  
  console.log(`📝 Log updated: ${txHash} -> ${status}`);
}

/**
 * Get transaction logs for a user
 */
export async function getUserLogs(userAddress: string): Promise<TransactionLog[]> {
  // Get from memory
  const memoryLogs = logs.filter(
    l => l.user.toLowerCase() === userAddress.toLowerCase()
  );
  
  // Get from Firebase if available
  if (db) {
    try {
      const snapshot = await db
        .collection('meechain_transactions')
        .where('user', '==', userAddress)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();
      
      return snapshot.docs.map(doc => doc.data() as TransactionLog);
    } catch (error) {
      console.error('Error fetching from Firebase:', error);
    }
  }
  
  return memoryLogs;
}

/**
 * Get all logs (for admin)
 */
export function getAllLogs(): TransactionLog[] {
  return logs;
}
