# Emotional Microcopy System

A comprehensive emotional journey mapping system for MeeChain that provides contextual, empathetic microcopy based on developer emotional states throughout their journey.

## 🎯 Overview

The Emotional Microcopy System helps create a more human, supportive experience by:
- Mapping developer emotional states across their journey
- Providing contextual, empathetic messaging
- Adapting content based on time of day
- Supporting both onboarding and development contexts

## 📦 Installation

The module is located at `src/utils/emotionalMicrocopy.ts` and is automatically included when building the project.

```bash
npm run build
```

## 🚀 Quick Start

```typescript
import { 
  getContextualMicrocopy, 
  getTimeBasedEmotionalAdjustment 
} from './utils/emotionalMicrocopy'

// Get microcopy for onboarding step 1 (curious state)
const microcopy = getContextualMicrocopy('onboarding', 1)
console.log(microcopy.primary)      // "ยินดีต้อนรับสู่การผจญภัยใหม่!"
console.log(microcopy.encouragement) // "ความอยากรู้ของคุณจะนำไปสู่สิ่งยิ่งใหญ่"

// Get time-based adjustments
const timeAdjust = getTimeBasedEmotionalAdjustment()
console.log(timeAdjust.encouragement) // Changes based on time of day
```

## 📚 Core Concepts

### Emotional States

The system defines 7 emotional states developers experience:
- `curious` - Initial exploration
- `uncertain` - Facing challenges
- `excited` - Gaining momentum
- `confident` - Building mastery
- `proud` - Achieving milestones
- `overwhelmed` - Feeling challenged
- `accomplished` - Completing journey

Each state includes:
- **mood**: Current emotional tone
- **energy**: Energy level (low/medium/high)
- **confidence**: Confidence level (low/medium/high)

### Developer Journey Mapping

7-step journey with emotional progression:

```typescript
DEVELOPER_EMOTIONAL_JOURNEY = {
  1: { mood: 'curious', energy: 'medium', confidence: 'medium' },
  2: { mood: 'uncertain', energy: 'low', confidence: 'low' },
  3: { mood: 'excited', energy: 'medium', confidence: 'medium' },
  4: { mood: 'confident', energy: 'medium', confidence: 'high' },
  5: { mood: 'excited', energy: 'high', confidence: 'high' },
  6: { mood: 'proud', energy: 'high', confidence: 'high' },
  7: { mood: 'accomplished', energy: 'high', confidence: 'high' }
}
```

### Microcopy Config

Each microcopy includes:
- **primary**: Main headline message
- **secondary**: Supporting context
- **encouragement**: Motivational message
- **callToAction**: Action button text
- **celebration** (optional): Celebratory message for achievements
- **guidance** (optional): Helpful tips or guidance

## 🔌 API Reference

### `getContextualMicrocopy(context, step, subContext?)`

Get contextual microcopy based on journey context and step.

**Parameters:**
- `context`: `'onboarding'` | `'development'`
- `step`: Journey step number (1-7)
- `subContext` (optional): Specific context key (e.g., 'welcome', 'setup')

**Returns:** `MicrocopyConfig`

**Examples:**

```typescript
// Onboarding with step mapping
const step1 = getContextualMicrocopy('onboarding', 1)
// Returns curious state microcopy

// Development with specific context
const welcome = getContextualMicrocopy('development', 1, 'welcome')
// Returns welcome step microcopy

// Override with specific state
const excited = getContextualMicrocopy('onboarding', 1, 'excited')
// Returns excited state microcopy regardless of step
```

### `getTimeBasedEmotionalAdjustment()`

Get time-based microcopy adjustments.

**Returns:** `Partial<MicrocopyConfig>` with `encouragement` and `guidance`

**Time Periods:**
- **Morning (6-12)**: Fresh start, learning focus
- **Afternoon (12-18)**: Productivity, skill development
- **Evening (18-22)**: Creativity focus
- **Night (22-6)**: Deep focus work

**Example:**

```typescript
const timeAdjust = getTimeBasedEmotionalAdjustment()
// Returns different content based on current hour:
// Morning: "สวัสดีตอนเช้า! พลังงานเต็มร้อยสำหรับวันใหม่ ☀️"
// Evening: "สวัสดีตอนเย็น! เวลาสำหรับการสร้างสรรค์ 🌆"
```

## 💡 Usage Examples

### React Component Integration

```tsx
import { getContextualMicrocopy, getTimeBasedEmotionalAdjustment } from './utils/emotionalMicrocopy'

function OnboardingStep({ stepNumber }) {
  const microcopy = getContextualMicrocopy('onboarding', stepNumber)
  const timeAdjust = getTimeBasedEmotionalAdjustment()
  
  // Combine for personalized experience
  const personalized = { ...microcopy, ...timeAdjust }
  
  return (
    <div className="onboarding-step">
      <h1>{personalized.primary}</h1>
      <p className="secondary">{personalized.secondary}</p>
      <p className="encouragement">{personalized.encouragement}</p>
      <button className="cta">{personalized.callToAction}</button>
      {personalized.celebration && (
        <div className="celebration">{personalized.celebration}</div>
      )}
      {personalized.guidance && (
        <aside className="guidance">{personalized.guidance}</aside>
      )}
    </div>
  )
}
```

### MeeBot Integration

```typescript
import { MeeBot } from './components/MeeBot'
import { getContextualMicrocopy } from './utils/emotionalMicrocopy'

function handleDevelopmentStep(step: string) {
  const microcopy = getContextualMicrocopy('development', 1, step)
  
  switch (step) {
    case 'setup':
      MeeBot.setSprite('supportive')
      MeeBot.speak(microcopy.guidance || microcopy.encouragement)
      break
    
    case 'firstDeploy':
      MeeBot.setSprite('celebrating')
      MeeBot.speak(microcopy.celebration || microcopy.primary)
      break
    
    case 'welcome':
      MeeBot.setSprite('welcoming')
      MeeBot.speak(microcopy.primary)
      break
  }
}
```

### Progressive Journey

```typescript
import { getContextualMicrocopy } from './utils/emotionalMicrocopy'

// Track user progress through onboarding
function updateOnboardingUI(currentStep: number) {
  const microcopy = getContextualMicrocopy('onboarding', currentStep)
  
  // Update UI with appropriate emotional tone
  document.getElementById('headline').textContent = microcopy.primary
  document.getElementById('description').textContent = microcopy.secondary
  document.getElementById('encouragement').textContent = microcopy.encouragement
  document.getElementById('cta-button').textContent = microcopy.callToAction
  
  // Show celebration for achievements
  if (microcopy.celebration && currentStep >= 5) {
    showCelebration(microcopy.celebration)
  }
}
```

## 📖 Contexts & Content

### Onboarding Context

Maps to emotional states:
- **curious**: Welcoming, encouraging exploration
- **uncertain**: Empathetic, supportive
- **excited**: Energetic, celebratory
- **confident**: Affirming, empowering
- **proud**: Celebrating, acknowledging achievement
- **accomplished**: Recognizing completion, inspiring next steps

### Development Context

Maps to specific development steps:
- **welcome**: First login experience
- **exploration**: System exploration
- **setup**: Clone & setup phase
- **understanding**: Learning the system
- **teamJoining**: Joining the team
- **firstDeploy**: First successful deployment
- **realMission**: Starting real work

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run emotional microcopy tests only
npm test -- tests/emotionalMicrocopy.test.ts
```

The test suite includes:
- 31 comprehensive tests
- Emotional journey mapping validation
- Microcopy structure verification
- Content quality checks
- Integration scenarios
- Thai language validation

## 🎨 Demo

Run the interactive demo:

```bash
npm run demo:emotional-microcopy
```

The demo showcases:
- All 7 emotional journey steps
- Onboarding context examples
- Development context examples
- Time-based adjustments
- React integration patterns
- MeeBot integration patterns

## 🌍 Localization

All content is in Thai (ภาษาไทย) to provide a native, culturally-appropriate experience for Thai developers. The system is designed to be easily extended for other languages.

## 🎯 Best Practices

### 1. Match Emotional States to Context

```typescript
// Good: Match the emotional state to user's situation
if (userJustFailed) {
  const microcopy = getContextualMicrocopy('onboarding', 2) // uncertain
} else if (userJustSucceeded) {
  const microcopy = getContextualMicrocopy('onboarding', 6) // proud
}
```

### 2. Combine Time-Based Adjustments

```typescript
// Good: Personalize with time-based content
const base = getContextualMicrocopy('development', 1, 'setup')
const timeAdjust = getTimeBasedEmotionalAdjustment()
const personalized = { ...base, ...timeAdjust }
```

### 3. Use Appropriate Fields

```typescript
const microcopy = getContextualMicrocopy('development', 1, 'firstDeploy')

// Always show primary and secondary
showHeadline(microcopy.primary)
showDescription(microcopy.secondary)

// Conditionally show celebrations
if (microcopy.celebration) {
  showCelebration(microcopy.celebration)
}

// Show guidance when helpful
if (userNeedsHelp && microcopy.guidance) {
  showTooltip(microcopy.guidance)
}
```

## 🔗 Related Documentation

- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest system documentation
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [SETTINGS_SUPPORT.md](./SETTINGS_SUPPORT.md) - Settings & support features

## 📝 License

MIT License - Part of the MeeChain MeeBot project
