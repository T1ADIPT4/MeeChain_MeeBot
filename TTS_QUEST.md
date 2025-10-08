# TTS Quest System - MeeChain

## 🔊 แนวคิด: เปิด TTS = เคลียร์เควส

ระบบ TTS Quest ออกแบบมาเพื่อให้ผู้ใช้ได้รับ badge เมื่อเปิดใช้งาน Text-to-Speech (TTS) ในหน้า Settings โดยใช้กลไกที่ผสานกับระบบ quest verification และ badge minting อย่างสมบูรณ์แบบ

> ผู้ใช้เปิด TTS ในหน้า Settings → ระบบตรวจสอบว่าเป็นเงื่อนไขเควส → ถ้าเปิดสำเร็จ → mint badge → ถ้า mint ล้มเหลว → fallback mint → MeeBot แสดง sprite และ TTS feedback

## ✨ คุณสมบัติเด่น

| คุณสมบัติ | ประโยชน์ |
|----------|-----------|
| **Quest แบบ UX-driven** | ผู้ใช้ไม่ต้องทำอะไรซับซ้อน แค่เปิด TTS |
| **Fallback-aware** | ถ้า mint badge ปกติล้มเหลว ยังมี fallback |
| **MeeBot + TTS feedback** | สร้างอารมณ์ร่วมและความสนุก |
| **Modular logic** | แยก verifier, minting, และ interaction ชัดเจน |
| **พร้อมต่อยอด** | สามารถเพิ่ม quest อื่น ๆ ที่เชื่อมกับ Settings ได้ |

## 📁 โครงสร้างไฟล์

```
src/
├── quests/
│   └── TTSQuestVerifier.ts    # ตรวจสอบว่าผู้ใช้เปิด TTS หรือไม่
├── pages/
│   └── Settings.ts             # จัดการการเปิด/ปิด TTS และ trigger quest
├── components/
│   └── MeeBot.ts               # MeeBot interface สำหรับ sprite และ TTS
└── verifiers/
    └── questVerifier.ts        # มี quest database ที่รวม TTS quest
```

## 🛠️ API Reference

### TTSQuestVerifier

#### `verifyTTSQuest(settings: UserSettings): Promise<boolean>`

ตรวจสอบว่าผู้ใช้เปิด TTS หรือไม่

**Parameters:**
- `settings.ttsEnabled: boolean` - สถานะการเปิด TTS

**Returns:** `true` ถ้า TTS เปิดอยู่, `false` ถ้าไม่เปิด

**Example:**
```typescript
import { verifyTTSQuest } from './quests/TTSQuestVerifier'

const settings = { ttsEnabled: true }
const verified = await verifyTTSQuest(settings)
console.log(verified) // true
```

### Settings Page

#### `handleTTSQuest(userId: string, settings: UserSettings): Promise<void>`

จัดการกระบวนการตรวจสอบและมอบ badge สำหรับ TTS quest

**Parameters:**
- `userId: string` - User ID
- `settings: UserSettings` - User settings object

**Behavior:**
- ถ้า TTS ไม่เปิด → MeeBot แสดง neutral sprite และพูดว่า "เปิด TTS ก่อนนะครับ ถึงจะรับ badge ได้"
- ถ้า TTS เปิด → อัพเดท progress → mint badge → MeeBot celebrate
- ถ้า primary minting ล้มเหลว → ใช้ fallback → MeeBot confused
- ถ้าทั้งคู่ล้มเหลว → MeeBot sad

**Example:**
```typescript
import { handleTTSQuest } from './pages/Settings'

const userId = 'user-123'
const settings = { ttsEnabled: true }

await handleTTSQuest(userId, settings)
// MeeBot: "เยี่ยมมาก! คุณได้รับ badge สำหรับการเปิด TTS แล้ว"
```

#### `updateTTSSetting(userId: string, currentSettings: UserSettings, newValue: boolean): Promise<void>`

อัพเดทการตั้งค่า TTS และ trigger quest ถ้าเปิดใหม่

**Parameters:**
- `userId: string` - User ID
- `currentSettings: UserSettings` - การตั้งค่าปัจจุบัน
- `newValue: boolean` - ค่าใหม่ที่ต้องการตั้ง

**Behavior:**
- อัพเดทการตั้งค่า TTS
- ถ้า TTS เพิ่งถูกเปิด (จาก false → true) → trigger `handleTTSQuest`
- ถ้า TTS เปิดอยู่แล้ว → ไม่ trigger quest

**Example:**
```typescript
import { updateTTSSetting } from './pages/Settings'

const userId = 'user-123'
const currentSettings = { ttsEnabled: false }

// เปิด TTS (จะ trigger quest)
await updateTTSSetting(userId, currentSettings, true)
```

### MeeBot Component

#### `MeeBot.setSprite(sprite: MeeBotSprite): void`

เปลี่ยน sprite ของ MeeBot

**Sprite Types:**
- `'neutral'` - สีหน้าปกติ
- `'happy'` - ยิ้มแย้ม
- `'celebrate'` - ฉลอง
- `'confused'` - งุนงง
- `'sad'` - เศร้า

**Example:**
```typescript
import { MeeBot } from './components/MeeBot'

MeeBot.setSprite('celebrate')
// 🤖 MeeBot: Setting sprite to "celebrate"
```

#### `MeeBot.speak(message: string): void`

ให้ MeeBot พูดข้อความผ่าน TTS

**Example:**
```typescript
MeeBot.speak('เยี่ยมมาก! คุณได้รับ badge สำหรับการเปิด TTS แล้ว')
// 🔊 TTS: "เยี่ยมมาก! คุณได้รับ badge สำหรับการเปิด TTS แล้ว"
```

## 📖 Usage Examples

### Example 1: Basic TTS Quest

```typescript
import { updateTTSSetting } from './pages/Settings'

const userId = 'user-001'
const settings = { ttsEnabled: false }

// ผู้ใช้เปิด TTS
await updateTTSSetting(userId, settings, true)

// Output:
// ✅ Settings updated
// ✅ TTS quest verified
// ✅ Badge minted
// 🤖 MeeBot: "celebrate"
// 🔊 TTS: "เยี่ยมมาก! คุณได้รับ badge สำหรับการเปิด TTS แล้ว"
```

### Example 2: TTS Quest with Fallback

```typescript
import { handleTTSQuest } from './pages/Settings'
import { setPrimaryMintingStatus } from './minting/badgeMinter'

// จำลองสถานการณ์ที่ primary chain ล้มเหลว
setPrimaryMintingStatus(false)

const userId = 'user-002'
const settings = { ttsEnabled: true }

await handleTTSQuest(userId, settings)

// Output:
// ⚠️ Primary minting failed
// ✅ Fallback minting success
// 🤖 MeeBot: "confused"
// 🔊 TTS: "ระบบ fallback ทำงานแล้วครับ คุณยังได้รับ badge อยู่นะ"
```

### Example 3: TTS Not Enabled

```typescript
import { handleTTSQuest } from './pages/Settings'

const userId = 'user-003'
const settings = { ttsEnabled: false }

await handleTTSQuest(userId, settings)

// Output:
// 🤖 MeeBot: "neutral"
// 🔊 TTS: "เปิด TTS ก่อนนะครับ ถึงจะรับ badge ได้"
```

### Example 4: React Component Integration

```tsx
// components/SettingsToggle.tsx
import React, { useState } from 'react'
import { updateTTSSetting } from '../src/pages/Settings'
import { MeeBot } from '../src/components/MeeBot'

interface Props {
  userId: string
}

export const TTSToggle: React.FC<Props> = ({ userId }) => {
  const [ttsEnabled, setTtsEnabled] = useState(false)

  const handleToggle = async (newValue: boolean) => {
    await updateTTSSetting(
      userId, 
      { ttsEnabled }, 
      newValue
    )
    setTtsEnabled(newValue)
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={ttsEnabled}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        เปิดเสียง TTS
      </label>
    </div>
  )
}
```

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Coverage

ระบบมีการทดสอบครอบคลุม 5 test cases:

1. **Test 11**: TTS Quest verification - ทดสอบ `verifyTTSQuest` function
2. **Test 12**: TTS Quest with successful badge minting - ทดสอบ primary minting
3. **Test 13**: TTS Quest with fallback badge minting - ทดสอบ fallback mechanism
4. **Test 14**: TTS Quest setting update integration - ทดสอบการเชื่อมกับ Settings
5. **Test 15**: TTS Quest should not trigger when already enabled - ทดสอบว่าไม่ trigger ซ้ำ

### Example Test

```typescript
// Test: TTS Quest verification
const disabledSettings = { ttsEnabled: false }
const disabledResult = await verifyTTSQuest(disabledSettings)
assert(disabledResult === false, 'Should return false when TTS is disabled')

const enabledSettings = { ttsEnabled: true }
const enabledResult = await verifyTTSQuest(enabledSettings)
assert(enabledResult === true, 'Should return true when TTS is enabled')
```

## 🎨 ต่อยอดระบบ

### เพิ่ม Quest ใหม่ที่เชื่อมกับ Settings

คุณสามารถสร้าง quest อื่น ๆ ที่คล้ายกับ TTS Quest ได้ เช่น:

**Notification Quest**
```typescript
// quests/NotificationQuestVerifier.ts
export async function verifyNotificationQuest(settings: UserSettings): Promise<boolean> {
  return settings.notificationsEnabled === true
}
```

**Theme Quest**
```typescript
// quests/ThemeQuestVerifier.ts
export async function verifyThemeQuest(settings: UserSettings): Promise<boolean> {
  return settings.theme === 'dark'
}
```

### เชื่อมกับระบบ NFT Football

```typescript
// pages/NFTFootball.ts
import { handleQuestCompletion } from '../QuestManager'
import { updateUserProgress } from '../verifiers/questVerifier'

export async function mintFootballNFT(userId: string) {
  // Mint NFT
  const nftId = await mintNFT(userId, 'football-player')
  
  // Update quest progress
  updateUserProgress(userId, 'quest-002', 'nft-minted', 1)
  
  // Check if quest is complete
  const result = await handleQuestCompletion(userId, 'quest-002')
  
  if (result.success) {
    MeeBot.setSprite('celebrate')
    MeeBot.speak('คุณรวบรวม NFT ครบแล้ว! ได้รับ special badge')
  }
}
```

## 📝 Best Practices

1. **ใช้ Logging**: ระบบมี event logging อยู่แล้ว ใช้เพื่อ debug และ audit
2. **Handle Errors**: ใช้ try-catch และมี fallback mechanism
3. **User Feedback**: แสดงผลผ่าน MeeBot sprite และ TTS เสมอ
4. **Don't Spam**: ตรวจสอบว่า quest ไม่ trigger ซ้ำโดยไม่จำเป็น
5. **Modular Design**: แยก logic ออกเป็นส่วน ๆ เพื่อความยืดหยุ่น

## 🔗 Related Documentation

- [Quest System Overview](QUEST_SYSTEM.md)
- [Integration Guide](INTEGRATION.md)
- [Architecture](ARCHITECTURE.md)

## 📄 License

MIT
