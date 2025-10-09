# Analytics Dashboard Documentation

The Analytics Dashboard (`/analytics`) provides comprehensive insights into badge distribution, fallback usage, and network health across all supported chains.

## 📊 Features

### Overview Statistics
- **Total Badges Minted** - Cumulative count across all chains
- **Fallback Events** - Number of times fallback minting was used
- **Primary Success Rate** - Percentage of badges minted on primary chain
- **Fallback Usage Rate** - Percentage of badges requiring fallback

### Badge Distribution
Visual charts showing:
- Badge count per chain
- Percentage distribution
- Interactive bar charts

### Fallback Usage Analysis
- Fallback events by chain
- Success rate per network
- Trend visualization

### Network Health
For each network:
- Chain ID
- Badges minted count
- Fallback events count
- Contract addresses (Badge, Quest, Fallback)

## 🎯 Use Cases

### 1. Monitor Network Performance
Identify which networks are most reliable:
```
If Polygon has 95% success rate but Ethereum has 70%,
consider using Polygon as primary network.
```

### 2. Capacity Planning
Track badge distribution to plan scaling:
```
If 80% of badges are on one chain,
consider load balancing across networks.
```

### 3. Incident Response
Quickly identify issues:
```
If fallback rate suddenly spikes on a network,
investigate the primary chain for issues.
```

### 4. Compliance & Reporting
Generate reports for stakeholders:
```
Export data for monthly reports showing
multi-chain adoption and reliability.
```

## 📈 Metrics Explained

### Primary Success Rate
```
(Total Mints - Fallback Events) / Total Mints * 100
```
Higher is better. >95% is excellent.

### Fallback Usage Rate
```
Fallback Events / Total Mints * 100
```
Lower is better. <5% is excellent.

### Badge Distribution
Shows which chains are most popular for badge minting.
Helps identify preferred networks by users.

## 🔍 Reading the Charts

### Badge Distribution Chart
- **Bar width** = Percentage of total badges
- **Label** = Chain name + badge count + percentage
- **Color** = Gradient purple (matches brand)

### Fallback Usage Chart  
- **Bar width** = Percentage of fallback events
- **Label** = Chain name + fallback count + percentage
- **Color** = Gradient orange (indicates warning/attention)

### Network Cards
Each card shows:
- **Network name** (capitalized)
- **Chain ID** (blockchain identifier)
- **Badges Minted** (on this network)
- **Fallback Events** (for this network)
- **Contract Addresses** (all three types)

## 💡 Best Practices

### 1. Regular Monitoring
Check analytics daily to catch issues early.

### 2. Set Thresholds
Alert when:
- Fallback rate > 10%
- Success rate < 90%
- One network > 90% of traffic

### 3. Compare Networks
Look for unusual patterns:
- Why is one network used more?
- Is fallback rate higher on weekends?
- Do certain quests prefer certain chains?

### 4. Historical Tracking
Export data regularly to track trends over time.

## 🚀 Integration

### Accessing from Code
```typescript
import { Analytics } from '../pages/analytics'

// Render in your app
<Analytics />
```

### Custom Analytics
Extend the component:
```typescript
// Get analytics data
const analytics = calculateAnalytics()

// Use in custom dashboard
<MyDashboard 
  badgeCount={analytics.totalMints}
  fallbackRate={analytics.fallbackRate}
/>
```

### Export Data
Future feature: Export to CSV/JSON
```typescript
// Coming soon
const data = exportAnalyticsData()
downloadCSV(data)
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop** - Multi-column grid layout
- **Tablet** - 2-column layout
- **Mobile** - Single column, full width

## 🎨 Customization

### Change Colors
Edit the `<style>` section in `pages/analytics.tsx`:
```css
.chart-bar-fill {
  background: linear-gradient(90deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
}
```

### Add Metrics
Extend `calculateAnalytics()`:
```typescript
function calculateAnalytics() {
  // ... existing code
  
  // Add new metric
  const averagePerChain = totalMints / networks.length
  
  return {
    // ... existing return
    averagePerChain
  }
}
```

### Custom Charts
Replace bar charts with:
- Pie charts
- Line graphs
- Doughnut charts
- etc.

## 🔗 Related Pages

- **Dashboard** (`/dashboard`) - User-facing badge display
- **Admin** (`/admin`) - Manual badge minting
- **Settings** (`/settings`) - User preferences

## 📊 Sample Data

For testing/demo purposes, the analytics uses:
- Mock user IDs: `user-001` through `user-005`
- Random badge distribution
- Simulated fallback events

In production, connect to:
- Database queries
- Blockchain events
- Real-time data streams

## 🎯 Future Enhancements

Planned features:
- [ ] Export to CSV/JSON
- [ ] Date range filtering
- [ ] Real-time updates (WebSocket)
- [ ] Chart type selection
- [ ] Comparison mode (week-over-week)
- [ ] Alert configuration
- [ ] Custom metrics
- [ ] Email reports

## 📖 Examples

### Example 1: High Fallback Rate
```
Scenario: Polygon showing 25% fallback rate

Action:
1. Check Polygon network status
2. Review recent deployments
3. Test badge minting manually
4. Switch primary network if needed
```

### Example 2: Unbalanced Distribution
```
Scenario: 95% badges on Ethereum, 5% on others

Action:
1. Review gas costs (Ethereum expensive?)
2. Check user preferences
3. Consider incentivizing other chains
4. Update default network in config
```

### Example 3: Network Addition
```
Scenario: Added Optimism network

Monitor:
1. Badges minted on new network
2. Fallback rate (should be low initially)
3. User adoption over time
4. Performance vs existing networks
```

## 🛠️ Maintenance

### Data Cleanup
Periodically archive old data:
```typescript
// Archive badges older than 90 days
archiveOldBadges(90)
```

### Cache Management
Clear cache after registry updates:
```typescript
import { clearRegistryCache } from '../src/config/registryLoader'
clearRegistryCache()
```

### Performance
For large datasets:
- Implement pagination
- Use aggregated data
- Cache analytics calculations
- Lazy load charts

## 📞 Support

For analytics-related questions:
1. Check this documentation
2. Review `pages/analytics.tsx` code
3. Run `npm run demo:auto-deploy` to see data flow
4. Open an issue on GitHub

---

**Note:** The analytics page requires the deploy registry to be properly configured. Run `npm run registry:validate` to ensure everything is set up correctly.
