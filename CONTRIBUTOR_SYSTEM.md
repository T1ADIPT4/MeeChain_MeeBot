# MeeChain Contributor System Documentation

## Overview

This document describes the Badge Animation, Contributor Leaderboard, and DAO Reviewer system implemented for MeeChain Singapore. The system provides gamification and governance features to incentivize community participation.

## 🏅 Components

### 1. BadgeUnlockAnimation Component

**Location:** `viewer/components/BadgeUnlockAnimation.tsx`

**Purpose:** Provides a celebratory animation when users earn new badges.

**Features:**
- Smooth scale and fade-in animation using Framer Motion
- Particle burst effect with 8 particles radiating outward
- Gradient background with shadow effects
- Auto-dismiss with callback support

**Usage:**
```tsx
import BadgeUnlockAnimation from './components/BadgeUnlockAnimation';

<BadgeUnlockAnimation 
  badgeName="Watchdog" 
  onComplete={() => console.log('Animation complete')}
/>
```

**Props:**
- `badgeName: string` - The name of the badge earned
- `onComplete?: () => void` - Optional callback when animation completes

**Animation Details:**
- Initial scale: 0.5, opacity: 0
- Final scale: 1, opacity: 1
- Duration: 0.6 seconds
- Badge icon scales: 0.8 → 1.2 → 1
- Text fades in after 0.4s delay
- 8 particles burst outward in a circle

---

### 2. ContributorLeaderboard Component

**Location:** `viewer/components/ContributorLeaderboard.tsx`

**Purpose:** Displays ranked list of contributors based on reputation scores.

**Features:**
- Top 3 contributors highlighted with gradient background
- Medal icons (🥇🥈🥉) for top performers
- Badge display with emoji representations
- Action count display
- Hover effects for interactivity
- Badge legend at bottom

**Data Structure:**
```typescript
interface ContributorData {
  address: string;
  name?: string;
  score: number;
  badges: string[];
  actions: ReputationAction[];
}
```

**Badge Emoji Mapping:**
- 🛡️ Watchdog - 10+ points
- ✅ Validator - 50+ points
- 🏰 Guardian - 100+ points
- 👑 Champion - 200+ points

---

### 3. FlagReviewPanel Component

**Location:** `viewer/components/FlagReviewPanel.tsx`

**Purpose:** Allows DAO reviewers to approve or reject flagged transactions.

**Features:**
- Approve/Reject toggle buttons
- Reason/notes textarea
- Form validation
- Loading states
- Success confirmation
- Reputation point display
- Automatic reputation recording

**Usage:**
```tsx
import FlagReviewPanel from './components/FlagReviewPanel';

<FlagReviewPanel
  refundId="REFUND-2024-001"
  currentUserAddress="0x1234..."
  onReviewComplete={(approved) => console.log('Review:', approved)}
/>
```

**Props:**
- `refundId: string` - The ID of the flagged transaction
- `currentUserAddress?: string` - Address of the reviewer
- `onReviewComplete?: (approved: boolean) => void` - Callback when review submitted

**Points Awarded:**
- Approve: +5 reputation points
- Reject: +1 reputation point

---

### 4. Contributor Reputation Service

**Location:** `viewer/services/contributorReputationService.ts`

**Purpose:** Manages reputation scores, badge awards, and contributor tracking.

**Key Functions:**

#### `recordAction(address, actionType, refundId?)`
Records a contributor action and updates their score.

**Action Types & Points:**
- `flag_submit`: 2 points
- `flag_confirm`: 5 points
- `flag_reject`: 1 point
- `review_complete`: 10 points

**Returns:**
```typescript
{
  contributor: ContributorData,
  newBadges: string[]
}
```

#### `getAllContributors()`
Returns all contributors sorted by score (highest first).

#### `getTopContributors(limit)`
Returns top N contributors.

#### `getContributorRank(address)`
Returns the rank of a specific contributor (1-indexed).

#### `getBadgeInfo(badgeName)`
Returns threshold and description for a specific badge.

**Badge Thresholds:**
```typescript
{
  'Watchdog': { minScore: 10, description: 'แจ้งเตือน flag 5 ครั้ง' },
  'Validator': { minScore: 50, description: 'ตรวจสอบ flag 20 ครั้ง' },
  'Guardian': { minScore: 100, description: 'ช่วยปกป้องระบบอย่างต่อเนื่อง' },
  'Champion': { minScore: 200, description: 'ผู้นำชุมชน' }
}
```

---

### 5. AuditorDashboard Component

**Location:** `viewer/src/components/AuditorDashboard.tsx`

**Purpose:** Comprehensive dashboard combining review panel and leaderboard.

**Features:**
- Two-column layout
- Flag review section
- Contributor leaderboard
- Demo controls for testing
- Badge animation integration
- Overlay modal for badge unlock

**Sections:**
1. **Pending Reviews** - FlagReviewPanel for active flags
2. **Contributor Leaderboard** - Rankings and badges
3. **Demo Controls** - Testing badge animations

---

## 🔗 Integration Guide

### Adding to Existing App

1. **Import Required Components:**
```tsx
import AuditorDashboard from './components/AuditorDashboard';
import ContributorLeaderboard from './components/ContributorLeaderboard';
import BadgeUnlockAnimation from './components/BadgeUnlockAnimation';
```

2. **Use in Your App:**
```tsx
function App() {
  return (
    <div>
      <AuditorDashboard />
      {/* or individual components */}
      <ContributorLeaderboard />
    </div>
  );
}
```

3. **Trigger Badge Animation:**
```tsx
const { newBadges } = recordAction(userAddress, 'flag_confirm', refundId);
if (newBadges.length > 0) {
  setShowBadgeAnimation(true);
  setNewBadgeName(newBadges[0]);
}
```

---

## 🎯 Workflow Example

### User Submits a Flag:
1. User flags suspicious transaction
2. System calls `recordAction(address, 'flag_submit', refundId)`
3. User gains +2 points
4. System checks for badge threshold
5. If badge earned, show `BadgeUnlockAnimation`

### DAO Reviewer Confirms Flag:
1. Reviewer opens `FlagReviewPanel`
2. Reviewer adds notes and clicks "อนุมัติ"
3. System calls `recordAction(address, 'flag_confirm', refundId)`
4. Reviewer gains +5 points
5. System checks for badge threshold
6. Update visible in `ContributorLeaderboard`

---

## 🎨 Styling

All components use inline styles for maximum portability. Key design elements:

**Colors:**
- Primary gradient: `#667eea` → `#764ba2`
- Success: `#48bb78`
- Error: `#f56565`
- Background: `#f7fafc`
- Text: `#1a202c` / `#2d3748`

**Effects:**
- Border radius: 0.5rem - 1rem
- Box shadows: `0 4px 6px rgba(0,0,0,0.1)`
- Transitions: 0.2s for hover effects
- Gradients for top performers

---

## 📊 Data Flow

```
User Action
    ↓
recordAction(address, actionType, refundId)
    ↓
Update Contributor Score
    ↓
Check Badge Thresholds
    ↓
Award New Badges (if any)
    ↓
Trigger BadgeUnlockAnimation
    ↓
Update ContributorLeaderboard
```

---

## 🚀 Future Enhancements

### Suggested Improvements:
1. **NFT Integration:** Mint badges as soulbound tokens
2. **Blockchain Storage:** Store reputation data on-chain
3. **Profile Pages:** Detailed contributor profiles with history
4. **Achievement System:** More granular achievements
5. **Rank-Up Animations:** Special effects when climbing leaderboard
6. **API Integration:** Real backend for flag confirmation
7. **Real-time Updates:** WebSocket for live leaderboard updates
8. **Notification System:** Alert users of new badges
9. **Reputation Decay:** Time-based score adjustments
10. **Dispute Resolution:** Appeal system for rejected flags

---

## 🧪 Testing

### Manual Testing Steps:

1. **Badge Animation:**
   - Navigate to Auditor Dashboard
   - Click "🎉 Trigger Badge Animation" button
   - Verify smooth animation and particle effects

2. **Contributor Leaderboard:**
   - Check that contributors are sorted by score
   - Verify top 3 have gradient backgrounds
   - Hover over entries to see effects
   - Check badge emojis display correctly

3. **Flag Review Panel:**
   - Select approve or reject
   - Enter review notes
   - Submit review
   - Verify success message
   - Check reputation points updated

### Unit Testing (Future):
```typescript
describe('contributorReputationService', () => {
  it('should award correct points for actions', () => {
    const result = recordAction('0x123', 'flag_confirm');
    expect(result.contributor.score).toBe(5);
  });
  
  it('should award badge at threshold', () => {
    // Test badge unlock logic
  });
});
```

---

## 📦 Dependencies

- **framer-motion**: ^11.0.0 - For badge animations
- **react**: ^19.1.1 - UI framework
- **typescript**: ~5.9.3 - Type safety

---

## 🔧 Configuration

### Adjusting Badge Thresholds:
Edit `BADGE_THRESHOLDS` in `contributorReputationService.ts`:

```typescript
const BADGE_THRESHOLDS = {
  'Watchdog': { minScore: 10, description: 'Your description' },
  // Add more badges...
};
```

### Adjusting Action Points:
Edit `ACTION_POINTS` in `contributorReputationService.ts`:

```typescript
const ACTION_POINTS = {
  'flag_submit': 2,
  'flag_confirm': 5,
  // Adjust as needed...
};
```

---

## 📝 Notes

- Currently uses in-memory storage for demo purposes
- Production should use persistent database or blockchain
- Mock data initialized on component mount for demonstration
- All Thai text can be localized using i18n system
- Components are designed to be framework-agnostic with minimal dependencies

---

## 🎖️ Credits

Implemented for MeeChain Singapore to create a transparent, community-driven governance system with proper incentive mechanisms for contributors and auditors.
