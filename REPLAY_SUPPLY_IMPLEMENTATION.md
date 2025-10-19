# 🧩 MeeBot Replay & Supply Flow Implementation

## Overview

This implementation provides a secure, role-based coin replay and supply flow for MeeChain. The system follows a clear separation of concerns with MeeBot acting as an intermediary to verify transactions before triggering supply operations.

## Features

### 1. Transaction Flow
```mermaid
flowchart TD
    A[🪙 User transfers coins to Wallet] --> B[MeeBot checks transaction]
    B --> C{Replay successful?}
    C -->|✅ Success| D[Show "Supply Coins" button]
    C -->|❌ Failed| E[Show status "Waiting for confirmation"]
    D --> F[MeeBot calls supply()]
    F --> G[Show status "Supply successful"]
    E --> H[Show "Refund" button if role:RecoveryAgent]
```

### 2. Role-Based Access Control

| Role | Permissions | UI Elements |
|------|-------------|-------------|
| `User` | View status only | Status display, no action buttons |
| `Supplier` | Can trigger supply | "Supply Coins" button (after replay) |
| `RecoveryAgent` | Can refund coins | "Refund" button (when replay fails) |
| `Auditor` | View logs & timestamps | Full audit log access |

### 3. MeeBot Personality Integration

The system includes context-aware MeeBot messages in Thai:

- **Replay Success**: 
  > "🎉 เหรียญของคุณพร้อมซัพพลายแล้ว! กดเลยเพื่อปล่อยพลัง MeeChain Singapore"

- **Replay Failed**: 
  > "😕 ดูเหมือน replay ยังไม่สำเร็จนะครับ รออีกสักครู่หรือกด 'ดึงเหรียญกลับ' ถ้าคุณมีสิทธิ์"

- **Supply Success**:
  > "✅ ซัพพลายสำเร็จ! เหรียญถูกส่งไปยังปลายทางแล้ว"

## Architecture

### File Structure

```
viewer/
├── src/
│   ├── types/
│   │   └── transaction.ts           # Transaction types & role permissions
│   ├── services/
│   │   └── blockchainService.ts     # Blockchain operations
│   ├── context/
│   │   └── MeeBotContext.tsx        # MeeBot state management
│   └── App.tsx                      # Main app with navigation
└── components/
    ├── CoinStatus.tsx               # Main transaction UI
    ├── CoinStatus.css               # Styling for CoinStatus
    ├── CoinStatusDemo.tsx           # Demo with role switcher
    ├── CoinStatusDemo.css           # Demo styling
    └── MeeBotSprite.tsx             # MeeBot visual feedback
```

### Key Components

#### 1. Transaction Types (`transaction.ts`)
Defines core types and permissions:
- `TransactionStatus`: pending | replayed | supplied | failed | refunded
- `UserRole`: User | Supplier | RecoveryAgent | Auditor
- `getUserPermissions()`: Returns role-based permissions

#### 2. Blockchain Service (`blockchainService.ts`)
Provides transaction operations:
- `replayTransaction()`: Verify transaction on blockchain
- `supplyCoins()`: Supply coins to destination
- `refundCoins()`: Refund coins to user
- `getTransactionStatus()`: Monitor transaction status

#### 3. MeeBot Context (`MeeBotContext.tsx`)
Manages MeeBot state and feedback:
- Enhanced mood states: neutral, thinking, celebrate, confused, warning, success
- `setReplayFeedback()`: Updates MeeBot based on transaction status
- Thai language personality messages

#### 4. CoinStatus Component (`CoinStatus.tsx`)
Main UI component showing:
- Transaction details (address, amount, timestamp)
- Replay status with visual indicators
- Role-based action buttons
- MeeBot personality feedback
- Audit log (for authorized roles)
- User permissions display

#### 5. CoinStatusDemo Component (`CoinStatusDemo.tsx`)
Interactive demo featuring:
- Role selector (User, Supplier, RecoveryAgent, Auditor)
- Role descriptions
- Live demonstration of permissions
- Usage instructions

## UI Components

### Coin Status Display

| Field | Description |
|-------|-------------|
| Address | Wallet address (e.g., `0x883AD20a...`) |
| Replay Status | ✅ Success / ❌ Failed with badge |
| Timestamp | ISO format with Thai locale (e.g., `18 ต.ค. 2025 เวลา 13:29 UTC`) |
| Amount | Token amount (e.g., `0.0083595 BNB`) |
| Supply Destination | Target contract address |
| Triggered By | Actor who triggered the action (MeeBot, RecoveryAgent) |

### Action Buttons

Buttons are shown based on transaction status and user role:

1. **Replay Transaction** (🔄)
   - Shown when status is `pending`
   - Available to: Supplier, RecoveryAgent

2. **Supply Coins** (🚀)
   - Shown when status is `replayed`
   - Available to: Supplier only

3. **Refund** (↩️)
   - Shown when status is `failed`
   - Available to: RecoveryAgent only

## Usage

### Integration in App

The feature is integrated into the main app with navigation:

```tsx
import CoinStatusDemo from '../components/CoinStatusDemo';

// In App component
<nav>
  <button onClick={() => setActiveView('coinstatus')}>
    Coin Status
  </button>
</nav>

{activeView === 'coinstatus' && <CoinStatusDemo />}
```

### Using CoinStatus Component Directly

```tsx
import CoinStatus from './components/CoinStatus';

// Basic usage
<CoinStatus txHash="0x123..." userRole="Supplier" />

// With different roles
<CoinStatus txHash="0x123..." userRole="User" />
<CoinStatus txHash="0x123..." userRole="RecoveryAgent" />
<CoinStatus txHash="0x123..." userRole="Auditor" />
```

## Testing

Run the tests:

```bash
npm test tests/replaySupply.test.ts
```

Tests cover:
- User role permissions (no actions)
- Supplier role permissions (supply + trigger)
- RecoveryAgent role permissions (refund + trigger)
- Auditor role permissions (view only)

## Security Considerations

1. **Role-Based Access**: All actions are gated by role permissions
2. **Status Validation**: Supply only allowed after successful replay
3. **Audit Trail**: All actions are logged with timestamps and actors
4. **Fail-Safe**: Recovery mechanism for failed replays

## Future Enhancements

- [ ] Real blockchain integration (currently using mock data)
- [ ] WebSocket for real-time transaction updates
- [ ] Multi-signature support for high-value transactions
- [ ] Transaction history and analytics
- [ ] Email/SMS notifications for transaction events
- [ ] Advanced error recovery mechanisms
- [ ] Multi-language support (currently Thai/English)

## API Reference

### Transaction Interface

```typescript
interface Transaction {
  id: string;
  address: string;
  amount: string;
  token: string;
  timestamp: Date;
  status: TransactionStatus;
  replayAttempts: number;
  supplyDestination?: string;
  triggerBy?: string;
  txHash?: string;
  error?: string;
}
```

### UserPermissions Interface

```typescript
interface UserPermissions {
  role: UserRole;
  canSupply: boolean;
  canRefund: boolean;
  canViewLogs: boolean;
  canTriggerActions: boolean;
}
```

## Troubleshooting

### Common Issues

1. **Replay fails repeatedly**
   - Check transaction hash is valid
   - Ensure network connectivity
   - Verify transaction is confirmed on blockchain

2. **Supply button not showing**
   - Confirm user has `Supplier` role
   - Check transaction status is `replayed`
   - Verify permissions are loaded correctly

3. **MeeBot messages not updating**
   - Check MeeBotContext is properly wrapped
   - Verify setReplayFeedback is called with correct status

## Contributing

When extending this feature:
1. Follow the role-based access pattern
2. Update transaction types in `transaction.ts`
3. Add corresponding tests
4. Update this documentation
5. Ensure Thai language messages are culturally appropriate

## License

MIT License - Part of MeeChain_MeeBot project
