
# MeeChain AA-first API Spec (Faucet, Earnings, User Tier)

---

## 💧 1. Faucet API

### เป้าหมาย
ให้ผู้ใช้ขอเหรียญทดลองจากระบบภายในแอป โดยมีการจำกัดเวลาและตรวจสอบสิทธิ์

### ขอเหรียญทดลอง

**POST** `/faucet/request`

**Request:**
```json
{
  "userId": "user_123",
  "chain": "goerli",
  "walletAddress": "0xAbC123...",
  "token": "ETH"
}
```

**Response:**
```json
{
  "status": "success",
  "amount": "0.01",
  "token": "ETH",
  "nextAvailable": "2025-08-28T00:00:00Z"
}
```

---

### ตรวจสอบสิทธิ์ขอเหรียญ

**GET** `/faucet/status?userId=user_123`

**Response:**
```json
{
  "eligible": true,
  "lastRequest": "2025-08-27T09:00:00Z",
  "nextAvailable": "2025-08-28T09:00:00Z"
}
```

---

## 💰 2. Earnings API

### เป้าหมาย
ติดตามรายได้ของผู้ใช้จากกิจกรรมต่างๆ เช่น ภารกิจ, เชิญเพื่อน, การใช้งาน DApp

### ดูรายได้รวม

**GET** `/earnings/summary?userId=user_123`

**Response:**
```json
{
  "total": { "USDC": "0.15", "MeeToken": "5" },
  "today": { "USDC": "0.05", "MeeToken": "2" }
}
```

---

### ดูรายการกิจกรรมที่มีรายได้

**GET** `/earnings/history?userId=user_123`

**Response:**
```json
[
  {
    "date": "2025-08-27",
    "activity": "เชื่อม DApp ครั้งแรก",
    "amount": "0.05",
    "token": "USDC",
    "status": "completed"
  },
  {
    "date": "2025-08-26",
    "activity": "เชิญเพื่อน",
    "amount": "0.10",
    "token": "USDC",
    "status": "completed"
  }
]
```

---

### โอนรายได้เข้ากระเป๋าหลัก

**POST** `/earnings/transfer`

**Request:**
```json
{
  "userId": "user_123",
  "walletAddress": "0xAbC123...",
  "token": "USDC",
  "amount": "0.15"
}
```

**Response:**
```json
{
  "status": "success",
  "txHash": "0xTx456..."
}
```

---

## 🏆 3. User Tier API

### เป้าหมาย
กำหนดระดับผู้ใช้ตามกิจกรรม พร้อมปลดล็อกสิทธิพิเศษ

### ดูระดับผู้ใช้ปัจจุบัน

**GET** `/user-tier/status?userId=user_123`

**Response:**
```json
{
  "tier": "Explorer",
  "nextTier": "Pro",
  "progress": { "missionsCompleted": 3, "required": 5 },
  "rewardsUnlocked": [ "เครดิต gas ฟรี", "Badge NFT" ]
}
```

---

### ดูสิทธิพิเศษของแต่ละระดับ

**GET** `/user-tier/benefits`

**Response:**
```json
[
  { "tier": "Beginner", "benefits": ["เหรียญทดลอง", "ภารกิจพื้นฐาน"] },
  { "tier": "Explorer", "benefits": ["เครดิต gas ฟรี", "Badge NFT"] },
  { "tier": "Pro", "benefits": ["Swap ข้ามเชนฟรี", "NFT พิเศษ"] }
]
```

---

### อัปเดตระดับผู้ใช้ (โดยระบบ)

**POST** `/user-tier/update`

**Request:**
```json
{
  "userId": "user_123",
  "newTier": "Pro"
}
```

**Response:**
```json
{
  "status": "updated",
  "tier": "Pro",
  "rewardsGranted": ["Swap ข้ามเชนฟรี", "NFT พิเศษ"]
}
```

---

## 🔗 การเชื่อมต่อกับระบบอื่น

| ระบบ        | เชื่อมกับ API                           |
|-------------|----------------------------------------|
| ภารกิจ      | `/earnings/history`, `/user-tier/status` |
| Smart Wallet| `/faucet/request`, `/earnings/transfer` |
| DApp        | `/earnings/summary` (แสดงรางวัลในแอป)  |
| แจ้งเตือน   | `/user-tier/update` (ปลดล็อกระดับใหม่) |

---

## 🛠️ Implementation Status

| Endpoint | Status | Description |
|----------|--------|-------------|
| `POST /faucet/request` | ✅ Ready | Request testnet tokens with rate limiting |
| `GET /faucet/status` | ✅ Ready | Check faucet eligibility |
| `GET /earnings/summary` | ✅ Ready | Get user earnings summary |
| `GET /earnings/history` | ✅ Ready | Get user activity history |
| `POST /earnings/transfer` | ✅ Ready | Transfer earnings to wallet |
| `GET /user-tier/status` | ✅ Ready | Get current user tier |
| `GET /user-tier/benefits` | ✅ Ready | List tier benefits |
| `POST /user-tier/update` | ✅ Ready | Update user tier |

---

## 🔐 Authentication

All endpoints require valid user authentication:
```
Authorization: Bearer <jwt_token>
```

## 📊 Error Handling

Standard HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `429` - Rate Limited
- `500` - Internal Server Error

Example error response:
```json
{
  "error": "RATE_LIMITED",
  "message": "Faucet request too frequent. Try again in 24 hours.",
  "nextAvailable": "2025-08-28T09:00:00Z"
}
```
