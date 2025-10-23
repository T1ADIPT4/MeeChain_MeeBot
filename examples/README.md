# MeeChain Examples

This directory contains example implementations and demos for various MeeChain features.

## Governance Loop Demo

### Simple Demo (Standalone)

Run the simple demonstration of the DAO governance loop:

```bash
node examples/governance-loop-demo-simple.js
```

This demo shows:
- Creating refund flags
- DAO reviewing and confirming flags
- Contributor reputation updates
- Badge evaluation
- CSV export for Snapshot proposals
- API endpoints overview

### TypeScript Demo (Full Implementation)

For a complete implementation using the actual services:

```bash
npm run build
# Then use the compiled demo (requires proper module setup)
```

## Dashboard Integration Examples

See `dashboard-integration-example.tsx` for three different patterns to integrate the Auditor Dashboard:

1. **Separate Route/Page** - Add auditor dashboard as a dedicated page
2. **Inline Integration** - Embed dashboard within existing app
3. **Role-Based Access** - Show dashboard only to authorized users

### Quick Integration

```tsx
import AuditorDashboard from './components/AuditorDashboard';

function App() {
  return (
    <div>
      <AuditorDashboard />
    </div>
  );
}
```

## Available Examples

- `governance-loop-demo-simple.js` - Standalone demo of governance flow
- `governance-loop-demo.ts` - TypeScript implementation using services
- `dashboard-integration-example.tsx` - React integration patterns

## Testing

All service functionality is tested in the `tests/` directory:

```bash
# Run governance-related tests
npm test tests/contributorReputationService.test.ts
npm test tests/refundLogService.test.ts
```

## Documentation

For complete documentation, see:
- `GOVERNANCE_LOOP_IMPLEMENTATION.md` - Full implementation guide
- `QUICK_REFERENCE.md` - Quick reference for developers
