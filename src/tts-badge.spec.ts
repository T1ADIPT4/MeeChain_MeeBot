/**
 * Jest test suite for TTS Badge Quest
 * Tests TTS-specific quest verification with fallback support
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

describe('TTS Badge Quest', () => {
  const questId = 'quest-003'; // TTS Badge quest

  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should require TTS enabled and 5 uses', async () => {
    const userId = 'tts-user-1';
    
    // Only enable TTS, don't use it
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(false); // Should fail because tts-used is 0
  });

  test('should verify when all TTS conditions are met', async () => {
    const userId = 'tts-user-2';
    
    // Enable TTS
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    // Use TTS 5 times
    updateUserProgress(userId, questId, 'tts-used', 5);
    
    const result = await verifyQuestConditions(userId, questId);
    expect(result).toBe(true);
  });

  test('should complete TTS quest with primary chain', async () => {
    const userId = 'tts-user-3';
    
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    updateUserProgress(userId, questId, 'tts-used', 5);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.tx).toBeDefined();
    expect(result.fallback).not.toBe(true);
    
    const mintLogs = getLogsByType('badge-minted');
    expect(mintLogs.length).toBe(1);
  });

  test('should complete TTS quest with fallback when primary fails', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const userId = 'tts-user-4';
    
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    updateUserProgress(userId, questId, 'tts-used', 5);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.fallback).toBe(true);
    expect(result.tx).toBeDefined();
    
    const fallbackLogs = getLogsByType('badge-fallback-minted');
    expect(fallbackLogs.length).toBe(1);
    
    const failLogs = getLogsByType('badge-mint-failed');
    expect(failLogs.length).toBe(1);
  });

  test('should track TTS usage incrementally', () => {
    const userId = 'tts-user-5';
    
    // Enable TTS once
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    
    // Use TTS incrementally
    updateUserProgress(userId, questId, 'tts-used', 1);
    updateUserProgress(userId, questId, 'tts-used', 1);
    updateUserProgress(userId, questId, 'tts-used', 1);
    updateUserProgress(userId, questId, 'tts-used', 1);
    updateUserProgress(userId, questId, 'tts-used', 1);
    
    const progress = getUserProgress(userId, questId);
    
    expect(progress['tts-enabled']).toBe(1);
    expect(progress['tts-used']).toBe(5);
  });

  test('should show quest status correctly for TTS badge', async () => {
    const userId = 'tts-user-6';
    
    // Check initial status
    let status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions not yet met');
    
    // Partially complete
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    updateUserProgress(userId, questId, 'tts-used', 3);
    
    status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions not yet met');
    
    // Fully complete
    updateUserProgress(userId, questId, 'tts-used', 2);
    
    status = await getQuestStatus(userId, questId);
    expect(status).toBe('Quest conditions met - ready to complete');
  });

  test('should fail TTS quest when both chains fail', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(false);
    
    const userId = 'tts-user-7';
    
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    updateUserProgress(userId, questId, 'tts-used', 5);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(false);
    expect(result.reason).toBe('Both primary and fallback minting failed');
    
    const errorLogs = getLogsByLevel('error');
    expect(errorLogs.length).toBeGreaterThan(0);
  });

  test('should log fallback usage for TTS quest', async () => {
    setPrimaryMintingStatus(false);
    setFallbackMintingStatus(true);
    
    const userId = 'tts-user-8';
    
    updateUserProgress(userId, questId, 'tts-enabled', 1);
    updateUserProgress(userId, questId, 'tts-used', 5);
    
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
});
