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

### `logger.test.ts`

Tests for the logger file writing system. Tests include:

#### Fallback Log Writing (2 tests)
- Fallback logs are written to file
- Fallback mint success logs are written to file

#### Error Log Writing (3 tests)
- Error level logs are written to file
- Failed events are written to file
- Verification failed events are written to file

#### Selective Logging (1 test)
- Info level logs are not written to file (memory only)

#### Log Format (1 test)
- Logs are formatted correctly with timestamp and level

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

All 73 tests are currently passing:
- ✅ TTS Quest Tests: 14/14 passing
- ✅ Logger File Writing Tests: 7/7 passing
- ✅ Mock Data Tests: passing
- ✅ Registry Tests: passing
- ✅ Deploy Registry Tests: passing
- ✅ Auto Deploy Scripts Tests: passing

## Fallback Logs

Error and fallback logs are automatically written to `tests/logs/`:
- `fallback-YYYY-MM-DD.log` - Contains fallback minting events
- `error-YYYY-MM-DD.log` - Contains error and failed events

Check these logs when investigating issues with quest verification or badge minting.

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
