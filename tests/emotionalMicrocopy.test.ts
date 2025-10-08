/**
 * Test suite for Emotional Microcopy System
 * Tests emotional journey mapping, contextual microcopy, and time-based adjustments
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  EmotionalState,
  MicrocopyConfig,
  DEVELOPER_EMOTIONAL_JOURNEY,
  EMOTIONAL_MICROCOPY,
  getContextualMicrocopy,
  getTimeBasedEmotionalAdjustment
} from '../src/utils/emotionalMicrocopy'

describe('Emotional Microcopy System', () => {
  describe('DEVELOPER_EMOTIONAL_JOURNEY', () => {
    it('should have emotional states for steps 1-7', () => {
      expect(DEVELOPER_EMOTIONAL_JOURNEY[1]).toBeDefined()
      expect(DEVELOPER_EMOTIONAL_JOURNEY[7]).toBeDefined()
      expect(Object.keys(DEVELOPER_EMOTIONAL_JOURNEY).length).toBe(7)
    })

    it('should have valid emotional state structure for each step', () => {
      Object.values(DEVELOPER_EMOTIONAL_JOURNEY).forEach((state: EmotionalState) => {
        expect(state).toHaveProperty('mood')
        expect(state).toHaveProperty('energy')
        expect(state).toHaveProperty('confidence')
        
        // Validate mood values
        expect(['curious', 'uncertain', 'excited', 'proud', 'confident', 'overwhelmed', 'accomplished'])
          .toContain(state.mood)
        
        // Validate energy values
        expect(['low', 'medium', 'high']).toContain(state.energy)
        
        // Validate confidence values
        expect(['low', 'medium', 'high']).toContain(state.confidence)
      })
    })

    it('should show emotional progression through journey', () => {
      expect(DEVELOPER_EMOTIONAL_JOURNEY[1].mood).toBe('curious')
      expect(DEVELOPER_EMOTIONAL_JOURNEY[2].mood).toBe('uncertain')
      expect(DEVELOPER_EMOTIONAL_JOURNEY[7].mood).toBe('accomplished')
      
      // Energy should increase towards the end
      expect(DEVELOPER_EMOTIONAL_JOURNEY[2].energy).toBe('low')
      expect(DEVELOPER_EMOTIONAL_JOURNEY[7].energy).toBe('high')
      
      // Confidence should increase
      expect(DEVELOPER_EMOTIONAL_JOURNEY[2].confidence).toBe('low')
      expect(DEVELOPER_EMOTIONAL_JOURNEY[7].confidence).toBe('high')
    })
  })

  describe('EMOTIONAL_MICROCOPY', () => {
    describe('onboarding context', () => {
      it('should have all emotional states covered', () => {
        const onboarding = EMOTIONAL_MICROCOPY.onboarding
        expect(onboarding).toHaveProperty('curious')
        expect(onboarding).toHaveProperty('uncertain')
        expect(onboarding).toHaveProperty('excited')
        expect(onboarding).toHaveProperty('confident')
        expect(onboarding).toHaveProperty('proud')
        expect(onboarding).toHaveProperty('accomplished')
      })

      it('should have valid microcopy structure for each state', () => {
        Object.values(EMOTIONAL_MICROCOPY.onboarding).forEach((config: MicrocopyConfig) => {
          expect(config).toHaveProperty('primary')
          expect(config).toHaveProperty('secondary')
          expect(config).toHaveProperty('encouragement')
          expect(config).toHaveProperty('callToAction')
          
          // All should be non-empty strings
          expect(config.primary.length).toBeGreaterThan(0)
          expect(config.secondary.length).toBeGreaterThan(0)
          expect(config.encouragement.length).toBeGreaterThan(0)
          expect(config.callToAction.length).toBeGreaterThan(0)
        })
      })

      it('should have Thai language content', () => {
        const curious = EMOTIONAL_MICROCOPY.onboarding.curious
        expect(curious.primary).toContain('ยินดีต้อนรับ')
        expect(curious.encouragement).toContain('ความอยากรู้')
      })

      it('should have empathetic content for uncertain state', () => {
        const uncertain = EMOTIONAL_MICROCOPY.onboarding.uncertain
        expect(uncertain.primary).toContain('เราเข้าใจ')
        expect(uncertain.secondary).toContain('ไม่ได้อยู่คนเดียว')
      })

      it('should have celebration field for appropriate states', () => {
        expect(EMOTIONAL_MICROCOPY.onboarding.excited.celebration).toBeDefined()
        expect(EMOTIONAL_MICROCOPY.onboarding.proud.celebration).toBeDefined()
        expect(EMOTIONAL_MICROCOPY.onboarding.accomplished.celebration).toBeDefined()
      })
    })

    describe('development context', () => {
      it('should have all development steps covered', () => {
        const development = EMOTIONAL_MICROCOPY.development
        expect(development).toHaveProperty('welcome')
        expect(development).toHaveProperty('exploration')
        expect(development).toHaveProperty('setup')
        expect(development).toHaveProperty('understanding')
        expect(development).toHaveProperty('teamJoining')
        expect(development).toHaveProperty('firstDeploy')
        expect(development).toHaveProperty('realMission')
      })

      it('should have valid microcopy structure for each step', () => {
        Object.values(EMOTIONAL_MICROCOPY.development).forEach((config: MicrocopyConfig) => {
          expect(config).toHaveProperty('primary')
          expect(config).toHaveProperty('secondary')
          expect(config).toHaveProperty('encouragement')
          expect(config).toHaveProperty('callToAction')
          
          // All should be non-empty strings
          expect(config.primary.length).toBeGreaterThan(0)
          expect(config.secondary.length).toBeGreaterThan(0)
          expect(config.encouragement.length).toBeGreaterThan(0)
          expect(config.callToAction.length).toBeGreaterThan(0)
        })
      })

      it('should have supportive content for setup step', () => {
        const setup = EMOTIONAL_MICROCOPY.development.setup
        expect(setup.primary).toContain('error')
        expect(setup.encouragement).toContain('ประสบการณ์')
      })

      it('should have celebration content for deploy step', () => {
        const firstDeploy = EMOTIONAL_MICROCOPY.development.firstDeploy
        expect(firstDeploy.celebration).toBeDefined()
        expect(firstDeploy.celebration).toContain('DEPLOY SUCCESSFUL')
      })

      it('should have all steps with guidance field', () => {
        Object.values(EMOTIONAL_MICROCOPY.development).forEach((config: MicrocopyConfig) => {
          expect(config.guidance).toBeDefined()
          expect(config.guidance!.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('getContextualMicrocopy', () => {
    it('should return microcopy for onboarding context with step number', () => {
      const microcopy = getContextualMicrocopy('onboarding', 1)
      expect(microcopy).toBeDefined()
      expect(microcopy.primary).toBeDefined()
      // Step 1 has curious mood
      expect(microcopy).toEqual(EMOTIONAL_MICROCOPY.onboarding.curious)
    })

    it('should return microcopy for development context with subContext', () => {
      const microcopy = getContextualMicrocopy('development', 1, 'welcome')
      expect(microcopy).toBeDefined()
      expect(microcopy).toEqual(EMOTIONAL_MICROCOPY.development.welcome)
    })

    it('should map step numbers to correct emotional states', () => {
      const step2 = getContextualMicrocopy('onboarding', 2)
      expect(step2).toEqual(EMOTIONAL_MICROCOPY.onboarding.uncertain)
      
      const step7 = getContextualMicrocopy('onboarding', 7)
      expect(step7).toEqual(EMOTIONAL_MICROCOPY.onboarding.accomplished)
    })

    it('should return fallback for invalid step', () => {
      const microcopy = getContextualMicrocopy('onboarding', 99)
      expect(microcopy).toBeDefined()
      expect(microcopy.primary).toBeDefined()
      // Should fallback to curious
      expect(microcopy).toEqual(EMOTIONAL_MICROCOPY.onboarding.curious)
    })

    it('should prioritize subContext over step mapping', () => {
      // Step 1 normally maps to 'curious', but we override with 'excited'
      const microcopy = getContextualMicrocopy('onboarding', 1, 'excited')
      expect(microcopy).toEqual(EMOTIONAL_MICROCOPY.onboarding.excited)
    })

    it('should return default fallback for missing context', () => {
      const microcopy = getContextualMicrocopy('development', 1, 'nonexistent')
      expect(microcopy).toBeDefined()
      expect(microcopy.primary).toContain('ยินดีต้อนรับ')
      expect(microcopy.callToAction).toContain('มาเริ่มกันเลย')
    })

    it('should have all required fields in returned config', () => {
      const microcopy = getContextualMicrocopy('onboarding', 3)
      expect(microcopy).toHaveProperty('primary')
      expect(microcopy).toHaveProperty('secondary')
      expect(microcopy).toHaveProperty('encouragement')
      expect(microcopy).toHaveProperty('callToAction')
    })
  })

  describe('getTimeBasedEmotionalAdjustment', () => {
    it('should return time-based adjustment object', () => {
      const adjustment = getTimeBasedEmotionalAdjustment()
      expect(adjustment).toBeDefined()
      expect(adjustment).toHaveProperty('encouragement')
      expect(adjustment).toHaveProperty('guidance')
    })

    it('should return appropriate content based on time', () => {
      const adjustment = getTimeBasedEmotionalAdjustment()
      expect(adjustment.encouragement).toBeDefined()
      expect(adjustment.guidance).toBeDefined()
      expect(adjustment.encouragement!.length).toBeGreaterThan(0)
      expect(adjustment.guidance!.length).toBeGreaterThan(0)
    })

    it('should have greeting in Thai', () => {
      const adjustment = getTimeBasedEmotionalAdjustment()
      // Should contain at least one of the time-based greetings
      const hasGreeting = 
        adjustment.encouragement!.includes('สวัสดี') ||
        adjustment.encouragement!.includes('ขอบคุณ')
      expect(hasGreeting).toBe(true)
    })

    it('should return partial MicrocopyConfig structure', () => {
      const adjustment = getTimeBasedEmotionalAdjustment()
      // Should only have encouragement and guidance, not full config
      expect(adjustment.primary).toBeUndefined()
      expect(adjustment.secondary).toBeUndefined()
      expect(adjustment.callToAction).toBeUndefined()
    })
  })

  describe('Integration Tests', () => {
    it('should support complete developer journey flow', () => {
      // Simulate a developer going through the entire journey
      for (let step = 1; step <= 7; step++) {
        const microcopy = getContextualMicrocopy('onboarding', step)
        expect(microcopy).toBeDefined()
        expect(microcopy.primary.length).toBeGreaterThan(0)
      }
    })

    it('should combine step-based and time-based content', () => {
      const stepMicrocopy = getContextualMicrocopy('onboarding', 5)
      const timeAdjustment = getTimeBasedEmotionalAdjustment()
      
      // Can be combined to create personalized experience
      const combined = {
        ...stepMicrocopy,
        ...timeAdjustment
      }
      
      expect(combined.primary).toBeDefined()
      expect(combined.encouragement).toBeDefined()
      expect(combined.guidance).toBeDefined()
    })

    it('should support all development steps with microcopy', () => {
      const developmentSteps = ['welcome', 'exploration', 'setup', 'understanding', 'teamJoining', 'firstDeploy', 'realMission']
      
      developmentSteps.forEach(step => {
        const microcopy = getContextualMicrocopy('development', 1, step)
        expect(microcopy).toBeDefined()
        expect(microcopy.primary.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Content Quality', () => {
    it('should have empathetic tone in all microcopy', () => {
      // Check that content shows empathy and support
      const uncertain = EMOTIONAL_MICROCOPY.onboarding.uncertain
      expect(uncertain.secondary).toContain('ไม่ได้อยู่คนเดียว')
      
      const setup = EMOTIONAL_MICROCOPY.development.setup
      expect(setup.primary).toContain('อย่าตกใจ')
    })

    it('should have actionable CTAs', () => {
      Object.values(EMOTIONAL_MICROCOPY.onboarding).forEach((config: MicrocopyConfig) => {
        // CTAs should be actionable (contain verbs or invitation)
        expect(config.callToAction.length).toBeGreaterThan(0)
      })
    })

    it('should have celebratory content for achievements', () => {
      const proud = EMOTIONAL_MICROCOPY.onboarding.proud
      expect(proud.celebration).toContain('🎉')
      
      const accomplished = EMOTIONAL_MICROCOPY.onboarding.accomplished
      expect(accomplished.celebration).toContain('🏆')
    })

    it('should maintain consistent Thai language usage', () => {
      // All content should be in Thai
      const allConfigs = [
        ...Object.values(EMOTIONAL_MICROCOPY.onboarding),
        ...Object.values(EMOTIONAL_MICROCOPY.development)
      ]
      
      allConfigs.forEach((config: MicrocopyConfig) => {
        // Thai characters should be present
        expect(/[\u0E00-\u0E7F]/.test(config.primary)).toBe(true)
      })
    })
  })
})
