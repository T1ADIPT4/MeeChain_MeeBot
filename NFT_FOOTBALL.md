# NFT Football Scaffolding - MeeChain

## 📁 โครงสร้างไฟล์

```
src/
├── pages/
│   └── NFTFootball.ts          # หน้า NFT Football พร้อม MeeBot integration
├── components/
│   ├── FootballCard.ts         # Component สำหรับแสดง NFT Football card
│   └── MeeBot.ts              # MeeBot sprite และ TTS integration
├── hooks/
│   └── useFootballData.ts     # Hook สำหรับโหลดข้อมูล NFT Football
├── utils/
│   └── fallbackLoader.ts      # Fallback-aware data loader
└── assets/
    └── fallback/
        └── football-nfts.json  # ข้อมูล fallback สำหรับ NFT Football
```

## ⚽ จุดเด่นของโครงสร้าง

### 1. **Modular Architecture**
- แยก logic ชัดเจนเป็น pages, components, hooks, utils
- ง่ายต่อการบำรุงรักษาและขยายระบบ
- สามารถนำ component กลับมาใช้ใหม่ได้

### 2. **Fallback-Aware**
- รองรับกรณี API ล้มเหลวหรือไม่ตอบสนอง
- โหลดข้อมูลจาก fallback JSON อัตโนมัติ
- ไม่มีการสูญเสียฟังก์ชันการทำงาน

### 3. **MeeBot Integration**
- MeeBot sprite เปลี่ยนตามสถานะ (loading, happy, excited, confused, sad)
- TTS (Text-to-Speech) สำหรับข้อความภาษาไทย
- สร้าง UX ที่มีอารมณ์ร่วมและตอบสนองทันที

### 4. **Quest System Ready**
- ติดตามความคืบหน้าของผู้ใช้อัตโนมัติ
- รองรับ quest เช่น "ดู NFT Football ครบ 5 ใบ"
- เชื่อมต่อกับ QuestManager สำเร็จแล้ว

## 🚀 การใช้งาน

### แสดงหน้า NFT Football ทั้งหมด

```typescript
import { renderNFTFootballPage } from './pages/NFTFootball'

const result = await renderNFTFootballPage({
  userId: 'user-001',
  enableQuestTracking: true
})

if (result.success) {
  console.log(`Loaded ${result.data.length} NFT Football cards`)
  console.log(`MeeBot says: ${result.meeBotState.message}`)
}
```

### แสดง NFT Football เฉพาะใบ

```typescript
import { displayFootballCard } from './pages/NFTFootball'

const result = await displayFootballCard('nft-football-001', {
  userId: 'user-001',
  enableQuestTracking: true
})

if (result.success) {
  console.log(result.data.renderText())
}
```

### ใช้งาน Hook แยกต่างหาก

```typescript
import { useFootballData } from './hooks/useFootballData'

const { data, loading, error } = await useFootballData('/api/football-nfts')

if (!loading && !error) {
  console.log(`Loaded ${data.length} NFT Football cards`)
}
```

### ใช้งาน FootballCard Component

```typescript
import { FootballCard, createFootballCards } from './components/FootballCard'
import { loadFootballData } from './utils/fallbackLoader'

const nfts = await loadFootballData()
const cards = createFootballCards(nfts)

cards.forEach(card => {
  console.log(card.renderText())  // แสดงในรูปแบบ text
  // หรือ
  console.log(card.renderHTML())  // แสดงในรูปแบบ HTML
})
```

### ใช้งาน MeeBot

```typescript
import { MeeBot } from './components/MeeBot'

MeeBot.setSprite('excited')
MeeBot.speak('ยินดีต้อนรับสู่ NFT Football!')

console.log(MeeBot.getSprite())        // 'excited'
console.log(MeeBot.getLastMessage())   // 'ยินดีต้อนรับสู่ NFT Football!'
```

## 🧪 การทดสอบ

### รัน Example Demo

```bash
npm run nft-football
```

ผลลัพธ์:
- ✅ แสดง NFT Football ทั้งหมด (5 cards)
- ✅ แสดง NFT Football เฉพาะใบ
- ✅ แสดงการเชื่อมต่อกับ Quest System
- ✅ แสดงการทำงานของ Fallback System

### รัน Test Suite ทั้งหมด

```bash
npm test
```

## 📊 ตัวอย่าง NFT Football Data

```json
{
  "id": "nft-football-001",
  "name": "Legendary Striker",
  "image": "/images/football/striker-001.png",
  "position": "Forward",
  "skill": 95,
  "rarity": "Legendary",
  "team": "MeeChain FC"
}
```

## 🎯 Quest Integration Example

```typescript
import { updateUserProgress } from './verifiers/questVerifier'

// ดู NFT Football 5 ใบเพื่อทำ quest สำเร็จ
await renderNFTFootballPage({
  userId: 'user-001',
  enableQuestTracking: true
})

// ระบบจะอัปเดต progress อัตโนมัติ:
// quest-nft-football-001 → nft-football-viewed: 5
```

## 🔄 Fallback Flow

```
1. พยายามโหลดจาก API endpoint
   ↓
2. API ล้มเหลว?
   ↓ Yes
3. โหลดจาก fallback JSON
   ↓
4. แสดงข้อมูลสำเร็จ ✅
```

## ✨ Features Checklist

- [x] Modular architecture (pages, components, hooks, utils)
- [x] Fallback-aware data loading
- [x] MeeBot sprite integration
- [x] TTS integration
- [x] Quest system integration
- [x] FootballCard component with text/HTML rendering
- [x] TypeScript type safety
- [x] Error handling
- [x] User progress tracking
- [x] Example demonstrations
- [x] Documentation

## 🔮 ต่อยอด

### เพิ่ม Quest ใหม่

แก้ไข `src/verifiers/questVerifier.ts`:

```typescript
const questDatabase: Record<string, Quest> = {
  'quest-nft-football-001': {
    id: 'quest-nft-football-001',
    name: 'Football Collector',
    conditions: [
      { type: 'nft-football-viewed', required: 5, completed: 0 },
      { type: 'nft-football-detailed-view', required: 3, completed: 0 },
    ],
  },
}
```

### เพิ่ม NFT Football ใหม่

แก้ไข `src/assets/fallback/football-nfts.json`:

```json
{
  "id": "nft-football-006",
  "name": "Super Winger",
  "image": "/images/football/winger-001.png",
  "position": "Winger",
  "skill": 90,
  "rarity": "Epic",
  "team": "MeeChain FC"
}
```

### เชื่อมต่อกับ API จริง

แก้ไข `src/hooks/useFootballData.ts`:

```typescript
// เปลี่ยนจาก mock เป็น fetch จริง
const res = await fetch(apiEndpoint)
const json = await res.json()
data = json
```

## 📝 License

MIT - MeeChain Team
