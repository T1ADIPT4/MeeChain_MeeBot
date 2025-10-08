# Tests Directory

This directory contains the test suite for the MeeChain MeeBot quest system.

## Test Files

### `ttsQuest.test.ts`

Comprehensive test suite for the TTS Quest badge system. Tests include:

#### TTS Quest Verification (3 tests)
- Verification fails when TTS is not enabled
- Verification passes when TTS is enabled
- User progress tracking works correctly

#### TTS Quest Badge Minting (4 tests)
- Badge mints successfully when conditions are met
- Minting fails when conditions are not met
- Fallback minting works when primary fails
- Both primary and fallback failure is handled

#### TTS Quest Status (2 tests)
- Correct status when conditions are not met
- Correct status when conditions are met

#### TTS Quest Definition (1 test)
- Quest structure is correct

#### Logging System Integration (1 test)
- All TTS quest events are logged correctly

#### Edge Cases (3 tests)
- Multiple TTS enable attempts
- Invalid quest ID handling
- Empty progress for new users

## Running Tests

### Run all tests
```bash
npm test
```

### Run TTS quest tests only
```bash
npm run copilot-test-tts-badge
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

## Test Results

All 14 tests are currently passing:
- ✅ TTS Quest Verification: 3/3 passing
- ✅ TTS Quest Badge Minting: 4/4 passing
- ✅ TTS Quest Status: 2/2 passing
- ✅ TTS Quest Definition: 1/1 passing
- ✅ Logging System Integration: 1/1 passing
- ✅ Edge Cases: 3/3 passing

## Test Configuration

Tests are configured using Jest with ts-jest for TypeScript support. Configuration is in `jest.config.cjs`.

## Writing New Tests

When adding new tests:

1. Create a new test file with `.test.ts` extension
2. Import the modules you want to test
3. Use `describe` blocks to group related tests
4. Use `test` or `it` for individual test cases
5. Use `beforeEach` for test setup
6. Clean up logs and state between tests

Example:

```typescript
import { handleQuestCompletion } from '../src/QuestManager'
import { clearLogs } from '../src/utils/logger'

describe('My Quest Tests', () => {
  beforeEach(() => {
    clearLogs()
  })

  test('should complete quest successfully', async () => {
    const result = await handleQuestCompletion('user-1', 'quest-1')
    expect(result.success).toBe(true)
  })
})
```

## Related Documentation

- [QUEST_SYSTEM.md](../QUEST_SYSTEM.md) - Quest system documentation
- [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) - Implementation details
- [INTEGRATION.md](../INTEGRATION.md) - Integration guide
