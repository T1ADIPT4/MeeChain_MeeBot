/**
 * Jest test suite for MeeChain Quest System
 * Tests fallback-aware quest verification and badge minting
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { handleQuestCompletion, getQuestStatus } from './QuestManager.js';
import { 
  verifyQuestConditions, 
  updateUserProgress, 
  getUserProgress 
} from './verifiers/questVerifier.js';
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from './minting/badgeMinter.js';
import { clearLogs, getLogs, getLogsByType, getLogsByLevel } from './utils/logger.js';

describe('Quest Verification', () => {
  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should not verify when conditions are not met', async () => {
    const userId = 'test-user-1';
    const questId = 'quest-001';
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(false);
  });

  test('should verify when all conditions are met', async () => {
    const userId = 'test-user-2';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(true);
  });
});

describe('Quest Completion', () => {
  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should complete quest with primary minting', async () => {
    const userId = 'test-user-3';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.tx).toBeDefined();
    expect(result.fallback).not.toBe(true);
    
    const mintLogs = getLogsByType('badge-minted');
    expect(mintLogs.length).toBe(1);
  });

  test('should complete quest with fallback minting when primary fails', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const userId = 'test-user-4';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.fallback).toBe(true);
    expect(result.tx).toBeDefined();
    
    const fallbackLogs = getLogsByType('badge-fallback-minted');
    expect(fallbackLogs.length).toBe(1);
    
    const failLogs = getLogsByType('badge-mint-failed');
    expect(failLogs.length).toBe(1);
  });

  test('should fail when conditions not met', async () => {
    const userId = 'test-user-5';
    const questId = 'quest-002';
    
    updateUserProgress(userId, questId, 'nft-minted', 1);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Quest conditions not met');
  });

  test('should fail when both primary and fallback fail', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(false);
    
    const userId = 'test-user-6';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Both primary and fallback minting failed');
    
    const errorLogs = getLogsByLevel('error');
    expect(errorLogs.length).toBeGreaterThan(0);
  });
});

describe('User Progress Tracking', () => {
  beforeEach(() => {
    clearLogs();
  });

  test('should track user progress correctly', () => {
    const userId = 'test-user-7';
    const questId = 'quest-002';
    
    updateUserProgress(userId, questId, 'nft-minted', 2);
    updateUserProgress(userId, questId, 'nft-minted', 1);
    updateUserProgress(userId, questId, 'nft-traded', 1);
    
    const progress = getUserProgress(userId, questId);
    
    expect(progress['nft-minted']).toBe(3);
    expect(progress['nft-traded']).toBe(1);
  });

  test('should verify quest after progress is complete', async () => {
    const userId = 'test-user-7b';
    const questId = 'quest-002';
    
    updateUserProgress(userId, questId, 'nft-minted', 3);
    updateUserProgress(userId, questId, 'nft-traded', 1);
    
    const verified = await verifyQuestConditions(userId, questId);
    expect(verified).toBe(true);
  });
});

describe('Quest Status Check', () => {
  beforeEach(() => {
    clearLogs();
  });

  test('should show correct status for incomplete quest', async () => {
    const userId = 'test-user-8';
    const questId = 'quest-001';
    
    const status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions not yet met');
  });

  test('should show ready status when conditions met', async () => {
    const userId = 'test-user-8b';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions met - ready to complete');
  });
});

describe('Logging System', () => {
  beforeEach(() => {
    clearLogs();
  });

  test('should clear logs', () => {
    const initialLogCount = getLogs().length;
    expect(initialLogCount).toBe(0);
  });

  test('should create logs for user progress', () => {
    const userId = 'test-user-9';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    
    const logs = getLogs();
    expect(logs.length).toBeGreaterThan(0);
    
    const progressLogs = getLogsByType('user-progress-updated');
    expect(progressLogs.length).toBe(1);
    expect(progressLogs[0].context.userId).toBe(userId);
    expect(progressLogs[0].context.questId).toBe(questId);
  });
});

describe('Multiple Quest Completions', () => {
  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
  });

  test('should handle multiple completions', async () => {
    const userIds = ['user-10a', 'user-10b', 'user-10c'];
    const questId = 'quest-001';
    const results = [];
    
    for (const userId of userIds) {
      updateUserProgress(userId, questId, 'login', 1);
      updateUserProgress(userId, questId, 'profile-setup', 1);
      
      const result = await handleQuestCompletion(userId, questId);
      results.push(result);
    }
    
    const successfulCompletions = results.filter(r => r.success).length;
    expect(successfulCompletions).toBe(3);
    
    const mintLogs = getLogsByType('badge-minted');
    expect(mintLogs.length).toBe(3);
  });
});
