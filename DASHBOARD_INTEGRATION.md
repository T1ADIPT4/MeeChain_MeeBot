# Dashboard & Admin Integration

This document describes the integration of the Dashboard and Admin pages with the `deploy-registry.json` multi-chain contract registry.

## 🎯 Overview

The dashboard and admin pages provide UI components for:
- **Badge List**: Displaying user badges with chain provenance
- **Fallback Log**: Showing fallback minting events
- **Admin Override**: Manual badge minting with network selection

All components are integrated with `deploy-registry.json` to automatically fetch and display the correct contract addresses for each network.

## 📁 File Structure

```
components/
  ├── BadgeList.tsx       # Badge display with chain provenance
  └── FallbackLog.tsx     # Fallback minting log display

pages/
  ├── dashboard.tsx       # Main dashboard page
  └── admin.tsx           # Admin override page

utils/
  ├── registry.ts         # Registry utility for components
  └── mockData.ts         # Mock data and helper functions

tests/
  ├── registry.test.ts    # Registry utility tests
  └── mockData.test.ts    # Mock data tests

examples/
  └── dashboard-integration-demo.ts  # Integration demo
```

## 🔧 Components

### BadgeList Component

Displays user badges with chain provenance information.

```tsx
import { BadgeList } from '../components/BadgeList'

<BadgeList userId="user-001" />
```

**Features:**
- Shows badge ID, quest ID
- Displays chain/network used
- Shows contract address from registry
- Includes transaction hash and timestamp

### FallbackLog Component

Displays fallback minting events with chain information.

```tsx
import { FallbackLog } from '../components/FallbackLog'

<FallbackLog />
```

**Features:**
- Shows user and quest information
- Indicates fallback was used
- Displays fallback contract address
- Shows transaction details

### Dashboard Page

Main dashboard combining badges and fallback logs.

```tsx
import { Dashboard } from '../pages/dashboard'

<Dashboard />
```

**Features:**
- Badge list section
- Fallback log section
- Styled layout
- Registry-aware display

### Admin Page

Admin interface for manual badge minting.

```tsx
import { Admin } from '../pages/admin'

<Admin />
```

**Features:**
- User ID and Quest ID input
- Network selection dropdown
- Contract address preview
- Manual mint trigger

## 🛠️ Utilities

### Registry Utility

Simplified interface for accessing `deploy-registry.json` in UI components.

```typescript
import { getContractAddress } from '../utils/registry'

const contract = getContractAddress('polygon', 'badge')
// Returns: "0xBadgePoly123"
```

**Parameters:**
- `chain`: Network name (ethereum, polygon, arbitrum)
- `type`: Contract type (badge, quest, fallback)

**Returns:** Contract address string or 'N/A' if not found

### Mock Data Utilities

Provides sample data and helper functions.

```typescript
import { getUserBadges, getFallbackLogs, mintBadge } from '../utils/mockData'

// Get user badges
const badges = getUserBadges('user-001')

// Get fallback logs
const logs = getFallbackLogs()

// Admin override mint
mintBadge('user-001', 'quest-001', '0xContract123')
```

## 📊 Data Flow

### Badge Display Flow

```
User Request
    ↓
getUserBadges(userId)
    ↓
BadgeList Component
    ↓
getContractAddress(chain, 'badge')
    ↓
deploy-registry.json
    ↓
Display: Badge with Chain & Contract
```

### Fallback Log Flow

```
Fallback Minting Event
    ↓
Logger (badge-fallback-minted)
    ↓
getFallbackLogs()
    ↓
FallbackLog Component
    ↓
getContractAddress(chain, 'fallback')
    ↓
Display: Log with Contract Address
```

### Admin Override Flow

```
Admin Input (User, Quest, Chain)
    ↓
getContractAddress(selectedChain, 'badge')
    ↓
Display Contract Preview
    ↓
triggerOverrideBadge()
    ↓
mintBadge(userId, questId, contract)
```

## 🧪 Testing

Run all tests including dashboard integration tests:

```bash
npm test
```

Run just the new tests:

```bash
npm test tests/registry.test.ts
npm test tests/mockData.test.ts
```

## 🚀 Demo

Run the dashboard integration demo:

```bash
npm run demo:dashboard
```

This demonstrates:
1. Registry utility usage
2. Badge list data
3. Fallback log data
4. Admin override functionality
5. Available networks
6. Integration patterns

## 🎨 Customization

### Styling

All components include inline styles that can be easily customized. To use external CSS:

1. Remove inline `<style>` tags
2. Create corresponding CSS files
3. Import CSS in your components

### Data Sources

Current implementation uses mock data. To integrate with real data:

1. **getUserBadges**: Query from database or blockchain
2. **getFallbackLogs**: Use real logger data or database
3. **mintBadge**: Call actual minting functions

Example:

```typescript
// In production
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  // Query from your database
  const badges = await db.badges.findByUserId(userId)
  return badges
}
```

### Network Support

To add new networks (e.g., Optimism):

1. Update `config/deploy-registry.json`
2. Update `SupportedNetwork` type in `src/config/registryTypes.ts`
3. Components automatically support new networks

## 📖 Integration Examples

### Next.js Integration

```tsx
// pages/dashboard.tsx
import { Dashboard } from '../components/Dashboard'

export default function DashboardPage() {
  return <Dashboard />
}
```

### React Integration

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/dashboard'
import { Admin } from './pages/admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## 🔐 Security Considerations

1. **Admin Page**: Implement proper authentication
2. **Badge Minting**: Add authorization checks
3. **Input Validation**: Validate user inputs
4. **Contract Calls**: Use proper error handling

## 🎯 Next Steps

- [ ] Connect to real user authentication system
- [ ] Integrate with database for badge storage
- [ ] Add blockchain transaction verification
- [ ] Implement pagination for large datasets
- [ ] Add export functionality for logs
- [ ] Create MeeBot sprite variations per chain
- [ ] Add real-time updates for new badges

## 📚 Related Documentation

- [DEPLOY_REGISTRY.md](./DEPLOY_REGISTRY.md) - Deploy registry documentation
- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest system overview
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
