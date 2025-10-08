# MeeChain Quest System

Fallback-aware quest verification and badge minting system for MeeChain - modular, resilient, and easily auditable.

## 🧩 Architecture

### Modular Breakdown

| Module | File | Responsibility | Fallback-aware? |
|--------|------|----------------|-----------------|
| **Quest Verifier** | `src/verifiers/questVerifier.ts` | ตรวจสอบเงื่อนไขเควส | ✅ ส่ง false ถ้าไม่ผ่าน |
| **Badge Minter** | `src/minting/badgeMinter.ts` | mint badge ปกติ + fallback | ✅ fallbackMintBadge() |
| **Logger** | `src/utils/logger.ts` | log event ทุกขั้นตอน | ✅ ตรวจสอบย้อนหลังได้ |
| **Quest Manager** | `src/QuestManager.ts` | Main orchestrator | ✅ Full fallback flow |

## ✅ Key Features

- **แยก logic ชัดเจน**: verification, minting, fallback, logging
- **มี fallback ที่เชื่อถือได้**: ถ้า mint ปกติล้มเหลว จะเรียก fallbackMintBadge ทันที
- **ตรวจสอบย้อนหลังง่าย**: ทุกขั้นตอนมี log พร้อม context
- **พร้อมต่อยอด**: สามารถเพิ่ม MeeBot reaction หรือ TTS feedback ได้ง่าย

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Run Example

```bash
npm run example
```

## 📖 Usage Examples

### Basic Quest Completion

```typescript
import { handleQuestCompletion } from './QuestManager'
import { updateUserProgress } from './verifiers/questVerifier'

// Update user progress
updateUserProgress('user-001', 'quest-001', 'login', 1)
updateUserProgress('user-001', 'quest-001', 'profile-setup', 1)

// Complete the quest
const result = await handleQuestCompletion('user-001', 'quest-001')

if (result.success) {
  console.log('Badge minted:', result.tx?.txHash)
}
```

### With MeeBot Integration

```typescript
import { handleQuestCompletion } from './QuestManager'

const result = await handleQuestCompletion(userId, questId)

if (result.success) {
  if (result.fallback) {
    MeeBot.setSprite('confused')
    TTS.speak('ระบบ fallback ทำงานแล้วนะครับ')
  } else {
    MeeBot.setSprite('happy')
    TTS.speak('เควสสำเร็จ! ได้รับ badge แล้ว')
  }
} else {
  MeeBot.setSprite('sad')
  TTS.speak('เควสยังไม่สำเร็จนะครับ')
}
```

### Checking Quest Status

```typescript
import { getQuestStatus } from './QuestManager'

const status = await getQuestStatus('user-001', 'quest-001')
console.log(status)
// Output: "Quest conditions met - ready to complete"
```

### Viewing Logs

```typescript
import { getLogs, getLogsByType } from './utils/logger'

// Get all logs
const allLogs = getLogs()

// Get specific event logs
const mintLogs = getLogsByType('badge-minted')
const failureLogs = getLogsByType('badge-mint-failed')
```

## 🔄 Fallback Flow

```
User completes quest
       ↓
Verify conditions ──→ Failed ──→ Return error
       ↓ Passed
Try primary mint
       ↓
    Success? ──→ Yes ──→ Return success
       ↓ No
Try fallback mint
       ↓
    Success? ──→ Yes ──→ Return success (with fallback flag)
       ↓ No
   Return error
```

## 🧪 Testing

The system includes several test scenarios in `src/example.ts`:

1. **Successful Completion** - Normal flow with primary minting
2. **Fallback Minting** - Primary fails, fallback succeeds
3. **Conditions Not Met** - Quest verification fails
4. **Log Viewing** - Audit trail inspection

## 🛠️ API Reference

### QuestManager

#### `handleQuestCompletion(userId: string, questId: string): Promise<QuestCompletionResult>`

Main function to handle quest completion with full fallback support.

**Returns:**
```typescript
{
  success: boolean
  reason?: string
  tx?: BadgeTransaction
  fallback?: boolean
}
```

#### `getQuestStatus(userId: string, questId: string): Promise<string>`

Check if user has met quest conditions.

### Quest Verifier

#### `verifyQuestConditions(userId: string, questId: string): Promise<boolean>`

Verify if all quest conditions are met.

#### `updateUserProgress(userId: string, questId: string, conditionType: string, increment?: number): void`

Update user's progress for a specific condition.

### Badge Minter

#### `mintBadge(userId: string, questId: string): Promise<BadgeTransaction>`

Mint badge on primary chain.

#### `fallbackMintBadge(userId: string, questId: string): Promise<BadgeTransaction>`

Mint badge on fallback chain (used when primary fails).

### Logger

#### `logEvent(eventType: string, context?: Record<string, any>, level?: LogLevel): void`

Log an event with context.

#### `getLogs(): LogEvent[]`

Get all logged events.

## 🎨 Extending the System

### Adding New Quest Types

Edit `src/verifiers/questVerifier.ts` to add new quest definitions:

```typescript
const questDatabase: Record<string, Quest> = {
  'quest-003': {
    id: 'quest-003',
    name: 'Social Butterfly',
    conditions: [
      { type: 'friend-added', required: 5, completed: 0 },
      { type: 'message-sent', required: 10, completed: 0 },
    ],
  },
}
```

### Custom Logging Backends

Replace the in-memory storage in `src/utils/logger.ts` with your preferred logging service (e.g., Firebase, AWS CloudWatch).

### Blockchain Integration

Replace the mock implementations in `src/minting/badgeMinter.ts` with actual smart contract calls using ethers.js or web3.js.

## 📝 License

MIT
