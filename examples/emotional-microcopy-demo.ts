/**
 * Demo: Emotional Journey Microcopy System
 * Demonstrates how to use the emotional microcopy system for contextual, empathetic messaging
 */

import {
  DEVELOPER_EMOTIONAL_JOURNEY,
  EMOTIONAL_MICROCOPY,
  getContextualMicrocopy,
  getTimeBasedEmotionalAdjustment
} from '../src/utils/emotionalMicrocopy.js'

console.log('='.repeat(70))
console.log('Emotional Journey Microcopy System - Demo')
console.log('='.repeat(70))
console.log('')

// Example 1: Developer Emotional Journey Mapping
console.log('Example 1: Developer Emotional Journey (Steps 1-7)')
console.log('='.repeat(70))
for (let step = 1; step <= 7; step++) {
  const state = DEVELOPER_EMOTIONAL_JOURNEY[step]
  console.log(`Step ${step}: ${state.mood.toUpperCase()}`)
  console.log(`  Energy: ${state.energy} | Confidence: ${state.confidence}`)
}
console.log('')

// Example 2: Onboarding Microcopy
console.log('Example 2: Onboarding Context Microcopy')
console.log('='.repeat(70))

console.log('\n🚀 Step 1: Curious Developer (First Login)')
const step1 = getContextualMicrocopy('onboarding', 1)
console.log(`Primary: ${step1.primary}`)
console.log(`Secondary: ${step1.secondary}`)
console.log(`Encouragement: ${step1.encouragement}`)
console.log(`CTA: ${step1.callToAction}`)
if (step1.guidance) console.log(`Guidance: ${step1.guidance}`)

console.log('\n😰 Step 2: Uncertain Developer (Exploring System)')
const step2 = getContextualMicrocopy('onboarding', 2)
console.log(`Primary: ${step2.primary}`)
console.log(`Secondary: ${step2.secondary}`)
console.log(`Encouragement: ${step2.encouragement}`)
console.log(`CTA: ${step2.callToAction}`)
if (step2.guidance) console.log(`Guidance: ${step2.guidance}`)

console.log('\n🎉 Step 7: Accomplished Developer (Journey Complete)')
const step7 = getContextualMicrocopy('onboarding', 7)
console.log(`Primary: ${step7.primary}`)
console.log(`Secondary: ${step7.secondary}`)
console.log(`Encouragement: ${step7.encouragement}`)
console.log(`CTA: ${step7.callToAction}`)
if (step7.celebration) console.log(`Celebration: ${step7.celebration}`)
if (step7.guidance) console.log(`Guidance: ${step7.guidance}`)

console.log('')

// Example 3: Development Context Microcopy
console.log('Example 3: Development Context - Specific Steps')
console.log('='.repeat(70))

console.log('\n🌟 Welcome Step')
const welcome = getContextualMicrocopy('development', 1, 'welcome')
console.log(`Primary: ${welcome.primary}`)
console.log(`Secondary: ${welcome.secondary}`)
console.log(`Encouragement: ${welcome.encouragement}`)
console.log(`CTA: ${welcome.callToAction}`)
if (welcome.celebration) console.log(`Celebration: ${welcome.celebration}`)

console.log('\n🛠️ Setup Step')
const setup = getContextualMicrocopy('development', 1, 'setup')
console.log(`Primary: ${setup.primary}`)
console.log(`Secondary: ${setup.secondary}`)
console.log(`Encouragement: ${setup.encouragement}`)
console.log(`CTA: ${setup.callToAction}`)
if (setup.guidance) console.log(`Guidance: ${setup.guidance}`)
if (setup.celebration) console.log(`Celebration: ${setup.celebration}`)

console.log('\n🎉 First Deploy Step')
const deploy = getContextualMicrocopy('development', 1, 'firstDeploy')
console.log(`Primary: ${deploy.primary}`)
console.log(`Secondary: ${deploy.secondary}`)
console.log(`Encouragement: ${deploy.encouragement}`)
console.log(`CTA: ${deploy.callToAction}`)
if (deploy.celebration) console.log(`Celebration: ${deploy.celebration}`)
if (deploy.guidance) console.log(`Guidance: ${deploy.guidance}`)

console.log('')

// Example 4: Time-Based Adjustments
console.log('Example 4: Time-Based Emotional Adjustments')
console.log('='.repeat(70))
const timeAdjustment = getTimeBasedEmotionalAdjustment()
const currentHour = new Date().getHours()
console.log(`Current Hour: ${currentHour}:00`)
console.log(`Time-Based Encouragement: ${timeAdjustment.encouragement}`)
console.log(`Time-Based Guidance: ${timeAdjustment.guidance}`)
console.log('')

// Example 5: Combined Microcopy (Step + Time)
console.log('Example 5: Combined Microcopy (Step-Based + Time-Based)')
console.log('='.repeat(70))
const baseMicrocopy = getContextualMicrocopy('onboarding', 3)
const combined = {
  ...baseMicrocopy,
  ...timeAdjustment
}
console.log('\n🔥 Excited Developer with Time-Based Personalization')
console.log(`Primary: ${combined.primary}`)
console.log(`Secondary: ${combined.secondary}`)
console.log(`Encouragement: ${combined.encouragement}`)
console.log(`CTA: ${combined.callToAction}`)
console.log(`Guidance: ${combined.guidance}`)
if (combined.celebration) console.log(`Celebration: ${combined.celebration}`)
console.log('')

// Example 6: All Development Steps
console.log('Example 6: Complete Development Journey')
console.log('='.repeat(70))
const developmentSteps = [
  'welcome',
  'exploration',
  'setup',
  'understanding',
  'teamJoining',
  'firstDeploy',
  'realMission'
]

developmentSteps.forEach((stepName, index) => {
  const micro = getContextualMicrocopy('development', 1, stepName)
  console.log(`\nStep ${index + 1}: ${stepName.toUpperCase()}`)
  console.log(`  Primary: ${micro.primary}`)
  console.log(`  CTA: ${micro.callToAction}`)
})
console.log('')

// Example 7: Emotional States Overview
console.log('Example 7: All Emotional States in Onboarding')
console.log('='.repeat(70))
const emotionalStates = Object.keys(EMOTIONAL_MICROCOPY.onboarding)
emotionalStates.forEach(state => {
  const micro = EMOTIONAL_MICROCOPY.onboarding[state]
  console.log(`\n${state.toUpperCase()}:`)
  console.log(`  "${micro.primary}"`)
  if (micro.celebration) console.log(`  Celebration: ${micro.celebration}`)
})
console.log('')

// Example 8: Usage in React Component (Pseudocode)
console.log('Example 8: Integration Pattern for React Components')
console.log('='.repeat(70))
console.log(`
// In your React component:
import { getContextualMicrocopy, getTimeBasedEmotionalAdjustment } from './utils/emotionalMicrocopy'

function OnboardingStep({ stepNumber }) {
  const microcopy = getContextualMicrocopy('onboarding', stepNumber)
  const timeAdjustment = getTimeBasedEmotionalAdjustment()
  
  const personalizedMicrocopy = {
    ...microcopy,
    ...timeAdjustment
  }
  
  return (
    <div>
      <h1>{personalizedMicrocopy.primary}</h1>
      <p>{personalizedMicrocopy.secondary}</p>
      <p className="encouragement">{personalizedMicrocopy.encouragement}</p>
      <button>{personalizedMicrocopy.callToAction}</button>
      {personalizedMicrocopy.celebration && (
        <div className="celebration">{personalizedMicrocopy.celebration}</div>
      )}
      {personalizedMicrocopy.guidance && (
        <div className="guidance">{personalizedMicrocopy.guidance}</div>
      )}
    </div>
  )
}
`)
console.log('')

// Example 9: MeeBot Integration
console.log('Example 9: MeeBot Integration Pattern')
console.log('='.repeat(70))
console.log(`
// Integrate with MeeBot for emotional feedback:
import { MeeBot } from './components/MeeBot'
import { getContextualMicrocopy } from './utils/emotionalMicrocopy'

function handleStepComplete(stepNumber) {
  const microcopy = getContextualMicrocopy('development', stepNumber, 'firstDeploy')
  
  // Set MeeBot's emotional state
  if (stepNumber === 6) { // First deploy
    MeeBot.setSprite('happy')
    MeeBot.speak(microcopy.celebration || microcopy.primary)
  } else if (stepNumber === 2) { // Uncertain phase
    MeeBot.setSprite('supportive')
    MeeBot.speak(microcopy.encouragement)
  }
}
`)
console.log('')

console.log('='.repeat(70))
console.log('✅ Demo Complete!')
console.log('📚 See tests/emotionalMicrocopy.test.ts for more examples')
console.log('📖 Documentation: All interfaces and functions are fully typed')
console.log('='.repeat(70))
