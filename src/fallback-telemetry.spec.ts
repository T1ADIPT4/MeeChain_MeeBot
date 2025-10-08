/**
 * Jest test suite for Fallback Telemetry
 * Tests logging and telemetry tracking for fallback usage
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { handleQuestCompletion } from './QuestManager.js';
import { updateUserProgress } from './verifiers/questVerifier.js';
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from './minting/badgeMinter.js';
import { 
  clearLogs, 
  getFallbackTelemetry,
  getFallbackLogs 
} from './utils/logger.js';

describe('Fallback Telemetry', () => {
  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should track fallback usage statistics', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    // Complete multiple quests using fallback
    const quests = [
      { userId: 'telemetry-user-1', questId: 'quest-001' },
      { userId: 'telemetry-user-2', questId: 'quest-002' },
      { userId: 'telemetry-user-3', questId: 'quest-003' },
    ];
    
    // Quest 001
    updateUserProgress(quests[0].userId, quests[0].questId, 'login', 1);
    updateUserProgress(quests[0].userId, quests[0].questId, 'profile-setup', 1);
    await handleQuestCompletion(quests[0].userId, quests[0].questId);
    
    // Quest 002
    updateUserProgress(quests[1].userId, quests[1].questId, 'nft-minted', 3);
    updateUserProgress(quests[1].userId, quests[1].questId, 'nft-traded', 1);
    await handleQuestCompletion(quests[1].userId, quests[1].questId);
    
    // Quest 003
    updateUserProgress(quests[2].userId, quests[2].questId, 'tts-enabled', 1);
    updateUserProgress(quests[2].userId, quests[2].questId, 'tts-used', 5);
    await handleQuestCompletion(quests[2].userId, quests[2].questId);
    
    const telemetry = getFallbackTelemetry();
    
    expect(telemetry.totalFallbackAttempts).toBe(3);
    expect(telemetry.totalFallbackSuccesses).toBe(3);
    expect(telemetry.totalFallbackFailures).toBe(0);
    expect(telemetry.totalPrimaryFailures).toBe(3);
    expect(telemetry.fallbackSuccessRate).toBe(100);
    expect(telemetry.questsUsingFallback).toHaveLength(3);
  });

  test('should track fallback failures', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(false);
    
    // Try to complete quest with both systems down
    updateUserProgress('telemetry-user-4', 'quest-001', 'login', 1);
    updateUserProgress('telemetry-user-4', 'quest-001', 'profile-setup', 1);
    await handleQuestCompletion('telemetry-user-4', 'quest-001');
    
    const telemetry = getFallbackTelemetry();
    
    expect(telemetry.totalFallbackAttempts).toBe(1);
    expect(telemetry.totalFallbackSuccesses).toBe(0);
    expect(telemetry.totalPrimaryFailures).toBe(1);
    expect(telemetry.fallbackSuccessRate).toBe(0);
  });

  test('should provide detailed fallback logs', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    updateUserProgress('telemetry-user-5', 'quest-001', 'login', 1);
    updateUserProgress('telemetry-user-5', 'quest-001', 'profile-setup', 1);
    await handleQuestCompletion('telemetry-user-5', 'quest-001');
    
    const fallbackLogs = getFallbackLogs();
    
    expect(fallbackLogs.length).toBe(2); // attempt + success
    
    const attemptLog = fallbackLogs.find(log => log.status === 'attempt');
    const successLog = fallbackLogs.find(log => log.status === 'success');
    
    expect(attemptLog).toBeDefined();
    expect(attemptLog?.userId).toBe('telemetry-user-5');
    expect(attemptLog?.questId).toBe('quest-001');
    
    expect(successLog).toBeDefined();
    expect(successLog?.userId).toBe('telemetry-user-5');
    expect(successLog?.questId).toBe('quest-001');
    expect(successLog?.tx).toBeDefined();
  });

  test('should track mixed primary and fallback usage', async () => {
    // First quest: primary success
    setPrimaryMintingStatus(true);
    updateUserProgress('telemetry-user-6', 'quest-001', 'login', 1);
    updateUserProgress('telemetry-user-6', 'quest-001', 'profile-setup', 1);
    await handleQuestCompletion('telemetry-user-6', 'quest-001');
    
    // Second quest: fallback success
    setPrimaryMintingStatus(false);
    updateUserProgress('telemetry-user-7', 'quest-002', 'nft-minted', 3);
    updateUserProgress('telemetry-user-7', 'quest-002', 'nft-traded', 1);
    await handleQuestCompletion('telemetry-user-7', 'quest-002');
    
    // Third quest: fallback success
    updateUserProgress('telemetry-user-8', 'quest-003', 'tts-enabled', 1);
    updateUserProgress('telemetry-user-8', 'quest-003', 'tts-used', 5);
    await handleQuestCompletion('telemetry-user-8', 'quest-003');
    
    const telemetry = getFallbackTelemetry();
    
    expect(telemetry.totalFallbackAttempts).toBe(2);
    expect(telemetry.totalFallbackSuccesses).toBe(2);
    expect(telemetry.totalPrimaryFailures).toBe(2);
    expect(telemetry.fallbackSuccessRate).toBe(100);
  });

  test('should identify unique quests using fallback', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    // Multiple users completing same quest via fallback
    updateUserProgress('telemetry-user-9', 'quest-001', 'login', 1);
    updateUserProgress('telemetry-user-9', 'quest-001', 'profile-setup', 1);
    await handleQuestCompletion('telemetry-user-9', 'quest-001');
    
    updateUserProgress('telemetry-user-10', 'quest-001', 'login', 1);
    updateUserProgress('telemetry-user-10', 'quest-001', 'profile-setup', 1);
    await handleQuestCompletion('telemetry-user-10', 'quest-001');
    
    const telemetry = getFallbackTelemetry();
    
    expect(telemetry.totalFallbackAttempts).toBe(2);
    expect(telemetry.totalFallbackSuccesses).toBe(2);
    expect(telemetry.questsUsingFallback).toEqual(['quest-001']);
  });

  test('should handle no fallback usage scenario', () => {
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
    
    const telemetry = getFallbackTelemetry();
    
    expect(telemetry.totalFallbackAttempts).toBe(0);
    expect(telemetry.totalFallbackSuccesses).toBe(0);
    expect(telemetry.totalFallbackFailures).toBe(0);
    expect(telemetry.totalPrimaryFailures).toBe(0);
    expect(telemetry.fallbackSuccessRate).toBe(0);
    expect(telemetry.questsUsingFallback).toHaveLength(0);
  });

  test('should provide timestamp information in fallback logs', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const beforeTime = new Date();
    
    updateUserProgress('telemetry-user-11', 'quest-004', 'football-nft-minted', 1);
    updateUserProgress('telemetry-user-11', 'quest-004', 'football-vote-cast', 3);
    await handleQuestCompletion('telemetry-user-11', 'quest-004');
    
    const afterTime = new Date();
    
    const fallbackLogs = getFallbackLogs();
    
    expect(fallbackLogs.length).toBeGreaterThan(0);
    
    fallbackLogs.forEach(log => {
      expect(log.timestamp).toBeInstanceOf(Date);
      expect(log.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(log.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });
});
