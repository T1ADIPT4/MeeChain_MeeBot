# 🎖️ MeeChain Contributor System - New Features

## Quick Start

### Running the Application

```bash
cd viewer
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Viewing the New Components

The application now has **three tabs**:

1. **🏠 Main Dashboard** - Original dashboard with profile, swap, and leaderboard
2. **🛡️ Auditor Dashboard** - NEW! Flag review panel and contributor leaderboard
3. **🏆 Contributors** - NEW! Standalone contributor leaderboard

### Test Mode

To view **only** the Auditor Dashboard (for testing/demo):

Edit `viewer/src/main.tsx`:
```typescript
const useTestDashboard = true; // Change to true
```

## 🎯 New Features

### 1. Badge Unlock Animation
- **Location**: `viewer/components/BadgeUnlockAnimation.tsx`
- **Purpose**: Celebrate when users earn badges
- **Features**:
  - Smooth scale and fade animations
  - 8-particle burst effect
  - Gradient background
  - Auto-dismiss with callback

**Demo**: Click the "🎉 Trigger Badge Animation" button in Auditor Dashboard

### 2. Contributor Leaderboard
- **Location**: `viewer/components/ContributorLeaderboard.tsx`
- **Purpose**: Display ranked contributors by reputation
- **Features**:
  - Top 3 highlighted with medals (🥇🥈🥉)
  - Badge display with emojis
  - Action count tracking
  - Hover effects
  - Badge legend

**Badges**:
- 🛡️ **Watchdog** - 10+ points (5 flag submissions)
- ✅ **Validator** - 50+ points (20 flag reviews)
- 🏰 **Guardian** - 100+ points (sustained protection)
- 👑 **Champion** - 200+ points (community leader)

### 3. Flag Review Panel
- **Location**: `viewer/components/FlagReviewPanel.tsx`
- **Purpose**: DAO reviewers approve/reject flagged transactions
- **Features**:
  - Approve/Reject toggle buttons
  - Required reason/notes field
  - Form validation
  - Loading states
  - Success confirmation
  - Automatic reputation updates

**Reputation Points**:
- Approve flag: **+5 points**
- Reject flag: **+1 point**

### 4. Contributor Reputation Service
- **Location**: `viewer/services/contributorReputationService.ts`
- **Purpose**: Manage reputation scores and badge awards
- **Features**:
  - Track contributor actions
  - Calculate scores
  - Award badges at thresholds
  - Generate leaderboards
  - Rank tracking

**Action Points**:
- `flag_submit`: +2 points
- `flag_confirm`: +5 points
- `flag_reject`: +1 point
- `review_complete`: +10 points

## 🎮 Demo Workflow

### Scenario: DAO Reviewer Approves a Flag

1. Navigate to **🛡️ Auditor Dashboard** tab
2. See the pending flag: `REFUND-2024-001`
3. Click **✅ อนุมัติ** (Approve) button
4. Enter review notes in Thai or English
5. Click **📤 ส่งผลการตรวจสอบ** (Submit Review)
6. Watch the badge unlock animation appear! 🎉
7. See the leaderboard update in real-time
8. Review success confirmation displayed

### Testing Badge Animation

1. Go to Auditor Dashboard
2. Scroll to **🎮 Demo Controls** section
3. Click **🎉 Trigger Badge Animation**
4. Watch the animation with particle effects
5. Click anywhere to dismiss

## 📁 Project Structure

```
viewer/
├── components/
│   ├── BadgeUnlockAnimation.tsx      # Badge animation modal
│   ├── ContributorLeaderboard.tsx    # Leaderboard component
│   ├── FlagReviewPanel.tsx           # Flag review UI
│   └── AuditorDashboard.tsx          # Combined dashboard
├── services/
│   └── contributorReputationService.ts # Reputation logic
└── src/
    ├── components/                    # Copies for src imports
    ├── services/                      # Copies for src imports
    ├── App.tsx                        # Main app with tabs
    ├── main.tsx                       # Entry point
    └── TestAuditorDashboard.tsx       # Isolated test view
```

## 🔧 Configuration

### Adjusting Badge Thresholds

Edit `contributorReputationService.ts`:

```typescript
const BADGE_THRESHOLDS = {
  'Watchdog': { minScore: 10, description: 'Your description' },
  'Validator': { minScore: 50, description: 'Your description' },
  'Guardian': { minScore: 100, description: 'Your description' },
  'Champion': { minScore: 200, description: 'Your description' },
};
```

### Adjusting Action Points

Edit `contributorReputationService.ts`:

```typescript
const ACTION_POINTS = {
  'flag_submit': 2,
  'flag_confirm': 5,
  'flag_reject': 1,
  'review_complete': 10,
};
```

## 🚀 Production Considerations

Currently, the system uses **in-memory storage** for demo purposes. For production:

### Required Changes:

1. **Backend API Integration**
   - Create `/api/logs/flag/confirm` endpoint
   - Create `/api/contributors` endpoint
   - Implement database storage

2. **Blockchain Integration**
   - Store reputation on-chain
   - Mint badges as NFTs or soulbound tokens
   - Verify transactions on-chain

3. **Real-time Updates**
   - WebSocket for live leaderboard updates
   - Notifications for badge unlocks
   - Activity feed for contributors

4. **Authentication**
   - Verify reviewer permissions
   - Implement multi-sig for approvals
   - Role-based access control

## 📚 Full Documentation

See `CONTRIBUTOR_SYSTEM.md` for comprehensive documentation including:
- Detailed component APIs
- Integration examples
- Testing procedures
- Future enhancement ideas
- Troubleshooting

## 🎨 Styling

All components use **inline styles** for:
- Maximum portability
- No CSS conflicts
- Easy customization
- Framework-agnostic design

**Color Scheme**:
- Primary: Purple gradient (#667eea → #764ba2)
- Success: Green (#48bb78)
- Error: Red (#f56565)
- Background: Light gray (#f7fafc)

## 🧪 Testing

### Manual Testing Checklist:

- [ ] Badge animation displays correctly
- [ ] Leaderboard sorts by score
- [ ] Top 3 have gradient backgrounds
- [ ] Medals show for top 3
- [ ] Badges display with correct emojis
- [ ] Flag review requires reason
- [ ] Approve button toggles state
- [ ] Reject button toggles state
- [ ] Submit validation works
- [ ] Success message displays
- [ ] Reputation updates after review
- [ ] Badge unlock triggers at thresholds

### Build Testing:

```bash
npm run build    # Should complete without errors
npm run lint     # Check for lint issues (pre-existing OK)
```

## 🐛 Known Issues

1. **Original App Context Issue**: The main dashboard tab may have issues with MeeBotProvider context due to mixed import paths. Use Test Mode or the Auditor/Contributors tabs for full functionality.

2. **In-Memory Storage**: Data resets on page refresh. Implement backend for persistence.

3. **Mock Data**: Contributors are pre-populated with mock data for demo purposes.

## 🙏 Credits

Built for **MeeChain Singapore** to create a transparent, community-driven governance system with proper incentive mechanisms for contributors and auditors.

---

**Happy Contributing! 🎖️**
