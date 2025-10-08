# Custom React Hooks

This directory contains custom React hooks for the MeeChain MeeBot application.

## Available Hooks

### useMeeBotSpeech

A custom hook for MeeBot Text-to-Speech functionality.

**Usage:**

```tsx
import { useMeeBotSpeech } from './hooks/useMeeBotSpeech'

function MyComponent() {
  const { speak, speaking } = useMeeBotSpeech()
  
  const handleClick = () => {
    speak('สวัสดีครับ! ยินดีต้อนรับสู่ MeeChain')
  }
  
  return (
    <button onClick={handleClick} disabled={speaking}>
      {speaking ? 'Speaking...' : 'Speak'}
    </button>
  )
}
```

## Adding New Hooks

When creating new hooks:

1. Follow the `use[HookName]` naming convention
2. Add TypeScript types for all parameters and return values
3. Include JSDoc comments with examples
4. Update this README with documentation
