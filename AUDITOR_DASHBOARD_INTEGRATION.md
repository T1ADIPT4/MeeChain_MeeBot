# Auditor Dashboard Integration Guide

## 🎨 Overview

The Auditor Dashboard is a React component that provides a comprehensive interface for managing refund logs and integrating with DAO governance. This guide shows you how to integrate it into your application.

## 📋 Prerequisites

- React 18+
- API server running on port 3001 (or configured via environment variable)
- Modern browser with ES6+ support

## 🚀 Quick Start

### 1. Start the API Server

```bash
# Terminal 1 - Start the API server
npm run api:start
```

The API will be available at `http://localhost:3001`

### 2. Integrate Dashboard into Your React App

#### Option A: Direct Integration

Add the dashboard to your main App component:

```tsx
import React from 'react'
import AuditorDashboard from './src/pages/auditor/AuditorDashboard'

function App() {
  return (
    <div className="App">
      <AuditorDashboard />
    </div>
  )
}

export default App
```

#### Option B: React Router Integration

Add the dashboard as a route:

```tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuditorDashboard from './src/pages/auditor/AuditorDashboard'
import HomePage from './src/pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auditor" element={<AuditorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```bash
REACT_APP_API_URL=http://localhost:3001
```

Or set it in your hosting environment:

```bash
# For production
REACT_APP_API_URL=https://api.meechain.xyz
```

### 4. Run Your Application

```bash
# Terminal 2 - Start the React app
npm run dev
```

Visit `http://localhost:5173/auditor` (or your configured port)

## 🎯 Features Walkthrough

### Statistics Overview

The dashboard displays key metrics at the top:
- **Total Refunds**: All refund logs in the system
- **Pending**: Refunds awaiting verification
- **Verified**: Refunds that have been approved
- **Flagged**: Refunds marked for review

### Refund Log Table

Each row shows:
- **Status**: Visual indicator with emoji (✅ verified, ⏳ pending, etc.)
- **Refund ID**: Unique identifier
- **User Address**: Wallet address (truncated)
- **Amount**: Refund amount in MEE
- **Reason**: Why the refund was requested
- **Verified At**: Timestamp of verification
- **Actions**: Buttons for various operations

### Action Buttons

#### 📝 Proposal
- Generates a DAO proposal template
- Automatically formatted for Snapshot
- Copies to clipboard
- Includes all relevant transaction details

#### 🚩 Flag
- Opens a modal to flag suspicious refunds
- Requires auditor address and reason
- Flags appear as warnings in the table

#### 🔗 View TX
- Links directly to BscScan
- Opens transaction in new tab
- Useful for verification

### Export CSV

The **Export CSV** button:
- Downloads all refund logs
- Includes all fields
- Suitable for audit trails
- Can be shared with DAO members

## 🔧 Customization

### Styling

The dashboard uses inline styles for portability. To customize:

```tsx
// Modify color scheme
const theme = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
}

// Apply to components
<div style={{ background: theme.primary }}>
  {/* Your content */}
</div>
```

### API Configuration

To use a different API endpoint:

```tsx
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api.com'
```

### Adding Custom Fields

To add custom fields to the refund logs:

1. Update the interface in `AuditorDashboard.tsx`:
```tsx
interface RefundLog {
  // Existing fields...
  customField?: string
}
```

2. Update the table to display it:
```tsx
<td style={{ padding: '16px' }}>
  {log.customField || 'N/A'}
</td>
```

## 📊 Component Props (Future Enhancement)

The dashboard currently doesn't accept props, but you can extend it:

```tsx
interface AuditorDashboardProps {
  apiUrl?: string
  onRefundClick?: (refundId: string) => void
  theme?: ThemeConfig
  permissions?: {
    canFlag: boolean
    canExport: boolean
    canCreateProposal: boolean
  }
}

export const AuditorDashboard: React.FC<AuditorDashboardProps> = (props) => {
  // Implementation
}
```

## 🔐 Security Considerations

### Authentication

Add authentication to protect the dashboard:

```tsx
import { useAuth } from './hooks/useAuth'

export const AuditorDashboard: React.FC = () => {
  const { user, isAuditor } = useAuth()
  
  if (!isAuditor) {
    return <div>Access Denied</div>
  }
  
  // Rest of component
}
```

### API Security

Protect your API endpoints:

```javascript
// Add authentication middleware
app.use('/api/logs', authenticateAuditor, logsRouter)

// Validate user has auditor role
function authenticateAuditor(req, res, next) {
  const token = req.headers.authorization
  // Verify token and role
  if (isValidAuditor(token)) {
    next()
  } else {
    res.status(403).json({ error: 'Forbidden' })
  }
}
```

## 🧪 Testing the Integration

### Manual Testing

1. Start API server: `npm run api:start`
2. Start React app: `npm run dev`
3. Navigate to dashboard
4. Test each feature:
   - View refund logs
   - Export CSV
   - Flag a refund
   - Create a proposal
   - View transaction on BscScan

### Automated Testing

Create tests for the dashboard:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuditorDashboard from './AuditorDashboard'

describe('AuditorDashboard', () => {
  it('renders refund logs', async () => {
    render(<AuditorDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText(/Total Refunds/i)).toBeInTheDocument()
    })
  })
  
  it('exports CSV when button clicked', async () => {
    render(<AuditorDashboard />)
    
    const exportButton = screen.getByText(/Export CSV/i)
    fireEvent.click(exportButton)
    
    // Assert CSV download triggered
  })
})
```

## 📱 Mobile Responsiveness

The dashboard is responsive by default. For better mobile experience:

```css
/* Add to your CSS file */
@media (max-width: 768px) {
  .auditor-dashboard-table {
    display: block;
    overflow-x: auto;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
}
```

## 🌐 Internationalization (i18n)

To add multi-language support:

```tsx
import { useTranslation } from 'react-i18next'

export const AuditorDashboard: React.FC = () => {
  const { t } = useTranslation()
  
  return (
    <h1>{t('dashboard.title')}</h1>
  )
}
```

Translation file (`en.json`):
```json
{
  "dashboard": {
    "title": "MeeChain Auditor Dashboard",
    "exportCsv": "Export CSV",
    "refresh": "Refresh"
  }
}
```

## 🔄 Real-time Updates

Add real-time updates with polling:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    fetchLogs()
    fetchFlags()
  }, 30000) // Update every 30 seconds
  
  return () => clearInterval(interval)
}, [])
```

Or use WebSockets:

```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001/ws')
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data)
    if (update.type === 'NEW_REFUND') {
      fetchLogs()
    }
  }
  
  return () => ws.close()
}, [])
```

## 🎓 Best Practices

### Performance

1. **Pagination**: For large datasets, implement pagination
2. **Memoization**: Use `React.memo` for expensive components
3. **Lazy Loading**: Load data as needed

### User Experience

1. **Loading States**: Always show loading indicators
2. **Error Handling**: Display user-friendly error messages
3. **Confirmation Dialogs**: Confirm destructive actions
4. **Toast Notifications**: Show success/error notifications

### Code Organization

1. **Separate API Logic**: Extract API calls to a service file
2. **Custom Hooks**: Create hooks for data fetching
3. **Component Splitting**: Break down large components
4. **Type Safety**: Use TypeScript interfaces consistently

## 📚 Example Service File

```tsx
// services/refundService.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

export class RefundService {
  static async fetchLogs() {
    const response = await fetch(`${API_BASE_URL}/api/logs`)
    if (!response.ok) throw new Error('Failed to fetch logs')
    return response.json()
  }
  
  static async flagLog(refundId: string, reason: string, flaggedBy: string) {
    const response = await fetch(`${API_BASE_URL}/api/logs/flag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refundId, reason, flaggedBy })
    })
    if (!response.ok) throw new Error('Failed to flag log')
    return response.json()
  }
  
  static async exportCSV() {
    const response = await fetch(`${API_BASE_URL}/api/logs/export-csv`)
    if (!response.ok) throw new Error('Failed to export CSV')
    return response.blob()
  }
}
```

## 🚀 Deployment

### Production Build

```bash
# Build the React app
npm run build

# Serve with a static server
npx serve -s dist
```

### Environment Variables

```bash
# Production
REACT_APP_API_URL=https://api.meechain.xyz

# Staging
REACT_APP_API_URL=https://staging-api.meechain.xyz

# Development
REACT_APP_API_URL=http://localhost:3001
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 📞 Support

For issues or questions:
- GitHub Issues: [Repository](https://github.com/T1ADIPT4/MeeChain_MeeBot/issues)
- API Documentation: See `API_DOCUMENTATION.md`
- General Guide: See `README.md`

## ✅ Checklist

Before deploying:
- [ ] API server is running
- [ ] Environment variables are set
- [ ] Dashboard loads without errors
- [ ] All features tested
- [ ] CSV export works
- [ ] Flag system functional
- [ ] Proposal generation works
- [ ] BscScan links are correct
- [ ] Error handling implemented
- [ ] Loading states visible
- [ ] Responsive on mobile
- [ ] Security measures in place

---

Happy auditing! 🎉
