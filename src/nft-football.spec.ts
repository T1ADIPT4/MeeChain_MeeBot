/**
 * Jest test suite for NFT Football Quest
 * Tests voting system with verifier and fallback support
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

describe('NFT Football Quest', () => {
  const questId = 'quest-004'; // NFT Football quest

  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should require NFT minting and 3 votes', async () => {
    const userId = 'football-user-1';
    
    // Only mint NFT, don't vote
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(false); // Should fail because vote count is 0
  });

  test('should verify when all football conditions are met', async () => {
    const userId = 'football-user-2';
    
    // Mint NFT
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    // Cast 3 votes
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(true);
  });

  test('should complete football quest with primary chain', async () => {
    const userId = 'football-user-3';
    
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.tx).toBeDefined();
    expect(result.fallback).not.toBe(true);
    
    const mintLogs = getLogsByType('badge-minted');
    expect(mintLogs.length).toBe(1);
  });

  test('should complete football quest with fallback when primary fails', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const userId = 'football-user-4';
    
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.fallback).toBe(true);
    expect(result.tx).toBeDefined();
    
    const fallbackLogs = getLogsByType('badge-fallback-minted');
    expect(fallbackLogs.length).toBe(1);
    
    const failLogs = getLogsByType('badge-mint-failed');
    expect(failLogs.length).toBe(1);
  });

  test('should track football votes incrementally', () => {
    const userId = 'football-user-5';
    
    // Mint NFT
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    
    // Cast votes incrementally (simulating voting on different matches)
    updateUserProgress(userId, questId, 'football-vote-cast', 1); // Vote 1
    updateUserProgress(userId, questId, 'football-vote-cast', 1); // Vote 2
    updateUserProgress(userId, questId, 'football-vote-cast', 1); // Vote 3
    
    const progress = getUserProgress(userId, questId);
    
    expect(progress['football-nft-minted']).toBe(1);
    expect(progress['football-vote-cast']).toBe(3);
  });

  test('should not allow quest completion without NFT', async () => {
    const userId = 'football-user-6';
    
    // Only cast votes, no NFT
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Quest conditions not met');
  });

  test('should not allow quest completion without enough votes', async () => {
    const userId = 'football-user-7';
    
    // Mint NFT but only 2 votes
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    updateUserProgress(userId, questId, 'football-vote-cast', 2);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Quest conditions not met');
  });

  test('should show quest status correctly for football', async () => {
    const userId = 'football-user-8';
    
    // Check initial status
    let status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions not yet met');
    
    // Mint NFT
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    
    status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions not yet met');
    
    // Cast votes
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions met - ready to complete');
  });

  test('should fail football quest when both chains fail', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(false);
    
    const userId = 'football-user-9';
    
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Both primary and fallback minting failed');
    
    const errorLogs = getLogsByLevel('error');
    expect(errorLogs.length).toBeGreaterThan(0);
  });

  test('should log fallback usage for football quest', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const userId = 'football-user-10';
    
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    updateUserProgress(userId, questId, 'football-vote-cast', 3);
    
    await handleQuestCompletion(userId, questId);
    
    // Check that fallback was logged
    const fallbackStartLogs = getLogsByType('badge-fallback-mint-start');
    expect(fallbackStartLogs.length).toBe(1);
    
    const fallbackSuccessLogs = getLogsByType('badge-fallback-mint-success');
    expect(fallbackSuccessLogs.length).toBe(1);
    
    const fallbackMintedLogs = getLogsByType('badge-fallback-minted');
    expect(fallbackMintedLogs.length).toBe(1);
    
    // Verify the log contains telemetry data
    expect(fallbackMintedLogs[0].context.userId).toBe(userId);
    expect(fallbackMintedLogs[0].context.questId).toBe(questId);
    expect(fallbackMintedLogs[0].context.tx).toBeDefined();
  });

  test('should handle multiple users completing football quest', async () => {
    const userIds = ['football-multi-1', 'football-multi-2', 'football-multi-3'];
    const results = [];
    
    for (const userId of userIds) {
      updateUserProgress(userId, questId, 'football-nft-minted', 1);
      updateUserProgress(userId, questId, 'football-vote-cast', 3);
      
      const result = await handleQuestCompletion(userId, questId);
      results.push(result);
    }
    
    const successfulCompletions = results.filter(r => r.success).length;
    expect(successfulCompletions).toBe(3);
    
    const mintLogs = getLogsByType('badge-minted');
    expect(mintLogs.length).toBe(3);
  });

  test('should verify voting system with different vote patterns', () => {
    const userId = 'football-user-11';
    
    // Mint NFT
    updateUserProgress(userId, questId, 'football-nft-minted', 1);
    
    // Cast votes in batch
    updateUserProgress(userId, questId, 'football-vote-cast', 2);
    updateUserProgress(userId, questId, 'football-vote-cast', 1);
    
    const progress = getUserProgress(userId, questId);
    expect(progress['football-vote-cast']).toBe(3);
  });
});
