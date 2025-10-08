# Frontend Utilities

This directory contains utility functions for the MeeChain MeeBot React application.

## Available Utilities

### fallbackAwareMint

Fallback-aware badge minting utility that wraps the backend Quest Manager with a frontend-friendly interface.

**Usage:**

```tsx
import { fallbackAwareMint } from './utils/fallbackAwareMint'

async function handleMint() {
  const result = await fallbackAwareMint('user-001', 'quest-001')
  
  if (result.success) {
    console.log(result.message)
    console.log('Transaction:', result.tx?.txHash)
    if (result.usedFallback) {
      console.log('Used fallback chain')
    }
  } else {
    console.error(result.message)
  }
}
```

### checkQuestStatus

Check if a user has completed a specific quest.

**Usage:**

```tsx
import { checkQuestStatus } from './utils/fallbackAwareMint'

const isCompleted = await checkQuestStatus('user-001', 'quest-001')
```

## Adding New Utilities

When creating new utilities:

1. Keep functions pure and testable
2. Add TypeScript types for all parameters and return values
3. Include JSDoc comments with usage examples
4. Export utilities from appropriate files
5. Update this README with documentation
