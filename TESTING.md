# Testing Guide - MeeChain Quest System

## Overview

The MeeChain Quest System now uses **Jest** as the primary testing framework, providing comprehensive test coverage with 40+ tests across multiple quest types and scenarios.

## Running Tests

### All Tests
```bash
npm test
```
Runs all Jest test suites (40+ tests).

### TTS Badge Tests Only
```bash
npm run copilot-test-tts-badge
# or
npm run test:tts-badge
```
Runs only the TTS Badge quest test suite (8 tests).

### Legacy Tests
```bash
npm run test:legacy
```
Runs the original TypeScript test suite (10 tests) without Jest.

## Test Suites

### 1. Quest System Tests (`quest-system.spec.ts`)
**10 tests covering:**
- Quest verification (conditions met/not met)
- Quest completion with primary minting
- Quest completion with fallback minting
- Quest completion failures
- User progress tracking
- Quest status checks
- Logging system
- Multiple quest completions

### 2. TTS Badge Quest Tests (`tts-badge.spec.ts`)
**8 tests covering:**
- TTS quest requirements (enable + 5 uses)
- Quest verification with TTS conditions
- Primary chain completion
- Fallback completion when primary fails
- Incremental TTS usage tracking
- Quest status for TTS badge
- Both chains failing scenario
- Fallback usage logging

### 3. NFT Football Quest Tests (`nft-football.spec.ts`)
**13 tests covering:**
- Football quest requirements (NFT mint + 3 votes)
- Quest verification for voting system
- Primary chain completion
- Fallback completion when primary fails
- Incremental vote tracking
- Quest completion without NFT (should fail)
- Quest completion without enough votes (should fail)
- Quest status tracking
- Both chains failing scenario
- Fallback usage logging
- Multiple users completing quest
- Different vote patterns

### 4. Fallback Telemetry Tests (`fallback-telemetry.spec.ts`)
**9 tests covering:**
- Fallback usage statistics tracking
- Fallback failure tracking
- Detailed fallback logs
- Mixed primary and fallback usage
- Unique quests using fallback
- No fallback usage scenario
- Timestamp information in logs

## Quest Types

The system includes 4 quest types:

### quest-001: First Steps
**Conditions:**
- Login: 1 time
- Profile setup: 1 time

### quest-002: NFT Collector
**Conditions:**
- NFT minted: 3 times
- NFT traded: 1 time

### quest-003: TTS Badge
**Conditions:**
- TTS enabled: 1 time
- TTS used: 5 times

### quest-004: NFT Football
**Conditions:**
- Football NFT minted: 1 time
- Football vote cast: 3 times

## Fallback Telemetry API

### Get Telemetry Statistics
```typescript
import { getFallbackTelemetry } from './utils/logger.js'

const stats = getFallbackTelemetry()
console.log(stats)
// {
//   totalFallbackAttempts: 10,
//   totalFallbackSuccesses: 9,
//   totalFallbackFailures: 1,
//   totalPrimaryFailures: 10,
//   fallbackSuccessRate: 90,
//   questsUsingFallback: ['quest-001', 'quest-003']
// }
```

### Get Detailed Fallback Logs
```typescript
import { getFallbackLogs } from './utils/logger.js'

const logs = getFallbackLogs()
console.log(logs)
// [
//   {
//     timestamp: Date,
//     userId: 'user-001',
//     questId: 'quest-001',
//     status: 'attempt',
//   },
//   {
//     timestamp: Date,
//     userId: 'user-001',
//     questId: 'quest-001',
//     status: 'success',
//     tx: '0x...'
//   }
// ]
```

## Test Configuration

Jest is configured in `jest.config.js` with:
- **Preset**: `ts-jest/presets/default-esm` for ESM TypeScript support
- **Test Environment**: Node.js
- **Test Match**: `src/**/*.spec.ts` and `src/**/*.test.ts`
- **Coverage**: Collected from all `src/**/*.ts` files (excluding test files)

## Writing New Tests

### Example Test Structure
```typescript
import { describe, test, expect, beforeEach } from '@jest/globals';
import { handleQuestCompletion } from './QuestManager.js';
import { updateUserProgress } from './verifiers/questVerifier.js';
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from './minting/badgeMinter.js';
import { clearLogs } from './utils/logger.js';

describe('My Quest Tests', () => {
  beforeEach(() => {
    clearLogs();
    setPrimaryMintingStatus(true);
    setFallbackMintingStatus(true);
  });

  test('should complete quest successfully', async () => {
    const userId = 'test-user';
    const questId = 'quest-001';
    
    updateUserProgress(userId, questId, 'login', 1);
    updateUserProgress(userId, questId, 'profile-setup', 1);
    
    const result = await handleQuestCompletion(userId, questId);
    
    expect(result.success).toBe(true);
    expect(result.tx).toBeDefined();
  });
});
```

## Continuous Integration

The Jest tests can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run tests
  run: npm test

- name: Run TTS tests
  run: npm run copilot-test-tts-badge
```

## Test Coverage

To generate test coverage reports:

```bash
npx jest --coverage
```

This will show coverage statistics for all source files.

## Troubleshooting

### Tests Not Found
Make sure your test files end with `.spec.ts` or `.test.ts` and are located in the `src/` directory.

### Import Errors
Ensure all imports end with `.js` extension (TypeScript ESM requirement):
```typescript
import { handleQuestCompletion } from './QuestManager.js'  // ✅ Correct
import { handleQuestCompletion } from './QuestManager'     // ❌ Wrong
```

### ESM Issues
The project uses ECMAScript modules. Make sure:
- `package.json` has `"type": "module"`
- `jest.config.js` is configured for ESM
- All imports use `.js` extensions

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Quest System Overview](./QUEST_SYSTEM.md)
- [Integration Guide](./INTEGRATION.md)
