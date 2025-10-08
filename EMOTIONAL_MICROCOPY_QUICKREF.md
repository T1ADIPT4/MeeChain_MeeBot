# Emotional Microcopy Quick Reference

## Import

```typescript
import { 
  getContextualMicrocopy, 
  getTimeBasedEmotionalAdjustment,
  DEVELOPER_EMOTIONAL_JOURNEY,
  EMOTIONAL_MICROCOPY
} from './src/utils/emotionalMicrocopy'
```

## Onboarding Journey (7 Steps)

| Step | Emotional State | Energy | Confidence | Use Case |
|------|----------------|--------|-----------|----------|
| 1 | Curious | Medium | Medium | First login, initial exploration |
| 2 | Uncertain | Low | Low | Facing first challenges |
| 3 | Excited | Medium | Medium | Making progress |
| 4 | Confident | Medium | High | Building competence |
| 5 | Excited | High | High | Major breakthrough |
| 6 | Proud | High | High | First achievement |
| 7 | Accomplished | High | High | Journey complete |

## Quick Usage

### Basic Onboarding

```typescript
// Step 1: Welcome new user
const welcome = getContextualMicrocopy('onboarding', 1)
console.log(welcome.primary) // "ยินดีต้อนรับสู่การผจญภัยใหม่!"

// Step 2: Support uncertain user
const support = getContextualMicrocopy('onboarding', 2)
console.log(support.primary) // "เราเข้าใจความรู้สึกของคุณ"
console.log(support.guidance) // "ฉันจะอยู่ข้าง ๆ คุณตลอดทาง ไม่ต้องเร่งรีบ"

// Step 7: Celebrate completion
const complete = getContextualMicrocopy('onboarding', 7)
console.log(complete.celebration) // "🏆 คุณคือ MeeChain Hero แล้ว!"
```

### Development Workflow

```typescript
// Welcome screen
const welcome = getContextualMicrocopy('development', 1, 'welcome')

// Setup phase
const setup = getContextualMicrocopy('development', 1, 'setup')

// First deploy
const deploy = getContextualMicrocopy('development', 1, 'firstDeploy')
console.log(deploy.celebration) // "🎉 DEPLOY SUCCESSFUL! คุณทำได้แล้ว Hero!"
```

### Time-Based Personalization

```typescript
const baseMsg = getContextualMicrocopy('onboarding', 3)
const timeMsg = getTimeBasedEmotionalAdjustment()

const personalized = {
  ...baseMsg,
  ...timeMsg // Overrides encouragement & guidance with time-appropriate content
}

// Morning (6-12): "สวัสดีตอนเช้า! พลังงานเต็มร้อยสำหรับวันใหม่ ☀️"
// Afternoon (12-18): "สวัสดีตอนบ่าย! ผลงานดี ๆ กำลังรอคุณอยู่ 🌤️"
// Evening (18-22): "สวัสดีตอนเย็น! เวลาสำหรับการสร้างสรรค์ 🌆"
// Night (22-6): "สวัสดีเจ้านกฮูก! ขอบคุณที่ยังตื่นเพื่อการเรียนรู้ 🦉"
```

## Development Steps Reference

| Step | Key | Primary Message | Celebration |
|------|-----|----------------|-------------|
| 1 | welcome | ยินดีต้อนรับสู่ MeeChain, ฮีโร่ของระบบ! | 🌟 ยินดีต้อนรับสู่การผจญภัย MeeChain! |
| 2 | exploration | นี่คือแผนที่ภารกิจของคุณ | 🗺️ คุณกำลังทำความเข้าใจระบบได้ดีมาก! |
| 3 | setup | ถ้าเจอ error อย่าตกใจนะครับ | 🛠️ Setup เสร็จแล้ว! คุณผ่านด่านยากที่สุดมาแล้ว! |
| 4 | understanding | คุณกำลังเข้าใจระบบมากขึ้นแล้ว! | 🧠 คุณเข้าใจระบบได้ดีมาก! |
| 5 | teamJoining | นี่คือทีมของคุณ ทุกคนรอคุณอยู่ | 🤝 ยินดีด้วย! ตอนนี้คุณเป็นส่วนหนึ่งของทีมแล้ว |
| 6 | firstDeploy | Deploy สำเร็จ! คุณคือฮีโร่ของวันนี้ 🎉 | 🎉 DEPLOY SUCCESSFUL! คุณทำได้แล้ว Hero! |
| 7 | realMission | ภารกิจต่อไปรออยู่ พร้อมลุยไหมครับ? | 🏆 Welcome to the Heroes League! |

## React Component Example

```tsx
function OnboardingCard({ step }: { step: number }) {
  const msg = getContextualMicrocopy('onboarding', step)
  const time = getTimeBasedEmotionalAdjustment()
  const content = { ...msg, ...time }
  
  return (
    <div className="card">
      <h2>{content.primary}</h2>
      <p>{content.secondary}</p>
      <blockquote>{content.encouragement}</blockquote>
      <button>{content.callToAction}</button>
      {content.celebration && <div className="badge">{content.celebration}</div>}
      {content.guidance && <aside>{content.guidance}</aside>}
    </div>
  )
}
```

## MeeBot Integration Example

```typescript
function updateMeeBotForStep(step: number) {
  const msg = getContextualMicrocopy('onboarding', step)
  
  // Map emotional states to MeeBot sprites
  const state = DEVELOPER_EMOTIONAL_JOURNEY[step]
  
  switch (state.mood) {
    case 'curious':
      MeeBot.setSprite('curious')
      MeeBot.speak(msg.encouragement)
      break
    case 'uncertain':
      MeeBot.setSprite('supportive')
      MeeBot.speak(msg.guidance || msg.encouragement)
      break
    case 'excited':
      MeeBot.setSprite('energetic')
      MeeBot.speak(msg.celebration || msg.primary)
      break
    case 'proud':
    case 'accomplished':
      MeeBot.setSprite('celebrating')
      MeeBot.speak(msg.celebration || msg.primary)
      break
    default:
      MeeBot.setSprite('friendly')
      MeeBot.speak(msg.primary)
  }
}
```

## Testing

```bash
# Run emotional microcopy tests
npm test -- tests/emotionalMicrocopy.test.ts

# Run interactive demo
npm run demo:emotional-microcopy
```

## Tips

1. **Match emotion to context**: Use uncertain state when users face errors, proud when they succeed
2. **Combine time-based**: Always combine base microcopy with time adjustments for personalization
3. **Use all fields**: Don't just show primary - encouragement and guidance add warmth
4. **Show celebrations**: Celebrate wins with the celebration field to reinforce positive moments
5. **Test different times**: Test your UI at different times of day to see time-based adjustments

## Full Documentation

See [EMOTIONAL_MICROCOPY.md](./EMOTIONAL_MICROCOPY.md) for complete documentation.
