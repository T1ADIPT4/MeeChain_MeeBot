/**
 * Tests for Milestone Integration
 * Tests milestone tracking, parsing, and MeeBot sprite feedback
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { MeeBot } from '../components/MeeBot'
import {
  readMilestoneLog,
  getLatestMilestone,
  parseMilestoneEntry,
  getCompletedMilestones,
  isMilestoneCompleted,
  getMilestoneProgress,
  appendToMilestoneLog,
  parseMilestoneFromCommit,
  getMilestoneMessageFromCommit
} from '../utils/milestoneReader'
import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

const TEST_LOG_PATH = join(process.cwd(), 'milestone.test.log')

describe('Milestone Tracking', () => {
  beforeEach(() => {
    // Clean up test log before each test
    if (existsSync(TEST_LOG_PATH)) {
      unlinkSync(TEST_LOG_PATH)
    }
  })

  afterEach(() => {
    // Clean up test log after each test
    if (existsSync(TEST_LOG_PATH)) {
      unlinkSync(TEST_LOG_PATH)
    }
  })

  test('should read empty milestone log', () => {
    const logs = readMilestoneLog(TEST_LOG_PATH)
    expect(logs).toEqual([])
  })

  test('should read milestone log with entries', () => {
    const content = '🟢 M1 complete: Deploy dashboard online!\n🟣 M2 complete: Minting pipeline ready!'
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    const logs = readMilestoneLog(TEST_LOG_PATH)
    expect(logs.length).toBe(2)
    expect(logs[0]).toContain('M1')
    expect(logs[1]).toContain('M2')
  })

  test('should get latest milestone', () => {
    const content = '🟢 M1 complete: Deploy dashboard online!\n🟣 M2 complete: Minting pipeline ready!'
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    const latest = getLatestMilestone(TEST_LOG_PATH)
    expect(latest).toContain('M2')
  })

  test('should return null for empty log', () => {
    const latest = getLatestMilestone(TEST_LOG_PATH)
    expect(latest).toBeNull()
  })
})

describe('Milestone Entry Parsing', () => {
  beforeEach(() => {
    if (existsSync(TEST_LOG_PATH)) {
      unlinkSync(TEST_LOG_PATH)
    }
  })

  test('should parse valid milestone entry', () => {
    const entry = '🟢 M1 complete: Deploy dashboard online!'
    const parsed = parseMilestoneEntry(entry)
    
    expect(parsed).not.toBeNull()
    expect(parsed?.milestoneId).toBe('M1')
    expect(parsed?.color).toBe('🟢')
    expect(parsed?.message).toBe('Deploy dashboard online!')
  })

  test('should parse all milestone types', () => {
    const entries = [
      '🟢 M1 complete: Deploy dashboard online!',
      '🟣 M2 complete: Minting pipeline ready!',
      '🟠 M3 complete: Milestone linked!',
      '🔵 M4 complete: Fallback validated!',
      '🟡 M5 complete: Production ready!'
    ]
    
    entries.forEach((entry, index) => {
      const parsed = parseMilestoneEntry(entry)
      expect(parsed).not.toBeNull()
      expect(parsed?.milestoneId).toBe(`M${index + 1}`)
    })
  })

  test('should return null for invalid entry', () => {
    const invalid = 'This is not a milestone entry'
    const parsed = parseMilestoneEntry(invalid)
    expect(parsed).toBeNull()
  })
})

describe('Milestone Completion Tracking', () => {
  beforeEach(() => {
    if (existsSync(TEST_LOG_PATH)) {
      unlinkSync(TEST_LOG_PATH)
    }
  })

  test('should get completed milestones', () => {
    const content = '🟢 M1 complete: Deploy dashboard online!\n🟣 M2 complete: Minting pipeline ready!'
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    const completed = getCompletedMilestones(TEST_LOG_PATH)
    expect(completed.length).toBe(2)
    expect(completed[0].milestoneId).toBe('M1')
    expect(completed[1].milestoneId).toBe('M2')
  })

  test('should check if milestone is completed', () => {
    const content = '🟢 M1 complete: Deploy dashboard online!'
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    expect(isMilestoneCompleted('M1', TEST_LOG_PATH)).toBe(true)
    expect(isMilestoneCompleted('M2', TEST_LOG_PATH)).toBe(false)
  })

  test('should calculate milestone progress', () => {
    const content = '🟢 M1 complete: Deploy dashboard online!\n🟣 M2 complete: Minting pipeline ready!'
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    const progress = getMilestoneProgress(TEST_LOG_PATH)
    expect(progress.completed).toBe(2)
    expect(progress.total).toBe(5)
    expect(progress.percentage).toBe(40)
  })

  test('should handle 100% completion', () => {
    const content = [
      '🟢 M1 complete: Deploy dashboard online!',
      '🟣 M2 complete: Minting pipeline ready!',
      '🟠 M3 complete: Milestone linked!',
      '🔵 M4 complete: Fallback validated!',
      '🟡 M5 complete: Production ready!'
    ].join('\n')
    writeFileSync(TEST_LOG_PATH, content, 'utf-8')
    
    const progress = getMilestoneProgress(TEST_LOG_PATH)
    expect(progress.completed).toBe(5)
    expect(progress.percentage).toBe(100)
  })
})

describe('Milestone Log Appending', () => {
  beforeEach(() => {
    if (existsSync(TEST_LOG_PATH)) {
      unlinkSync(TEST_LOG_PATH)
    }
  })

  test('should append milestone to log', () => {
    appendToMilestoneLog('M1', 'Deploy dashboard online!', TEST_LOG_PATH)
    
    const logs = readMilestoneLog(TEST_LOG_PATH)
    expect(logs.length).toBe(1)
    expect(logs[0]).toContain('M1')
    expect(logs[0]).toContain('🟢')
  })

  test('should append multiple milestones', () => {
    appendToMilestoneLog('M1', 'Deploy dashboard online!', TEST_LOG_PATH)
    appendToMilestoneLog('M2', 'Minting pipeline ready!', TEST_LOG_PATH)
    
    const logs = readMilestoneLog(TEST_LOG_PATH)
    expect(logs.length).toBe(2)
  })

  test('should use correct color for each milestone', () => {
    const colors = ['🟢', '🟣', '🟠', '🔵', '🟡']
    
    for (let i = 1; i <= 5; i++) {
      appendToMilestoneLog(`M${i}`, `Test message ${i}`, TEST_LOG_PATH)
    }
    
    const logs = readMilestoneLog(TEST_LOG_PATH)
    logs.forEach((log, index) => {
      expect(log).toContain(colors[index])
    })
  })
})

describe('Commit Message Parsing', () => {
  test('should parse milestone from commit', () => {
    const commit = 'M1: Add deploy dashboard'
    const milestone = parseMilestoneFromCommit(commit)
    expect(milestone).toBe('M1')
  })

  test('should parse all milestone IDs', () => {
    for (let i = 1; i <= 5; i++) {
      const commit = `M${i}: Test commit`
      const milestone = parseMilestoneFromCommit(commit)
      expect(milestone).toBe(`M${i}`)
    }
  })

  test('should return null for non-milestone commit', () => {
    const commit = 'fix: Regular bug fix'
    const milestone = parseMilestoneFromCommit(commit)
    expect(milestone).toBeNull()
  })

  test('should extract message from commit', () => {
    const commit = 'M1: Add deploy dashboard with fallback'
    const message = getMilestoneMessageFromCommit(commit)
    expect(message).toBe('Add deploy dashboard with fallback')
  })
})

describe('MeeBot Milestone Feedback', () => {
  test('should trigger sprite feedback for M1', () => {
    MeeBot.milestoneFeedback('M1')
    expect(MeeBot.getCurrentSprite()).toBe('happy')
    expect(MeeBot.getLastMessage()).toBe('Deploy dashboard online!')
  })

  test('should trigger sprite feedback for M2', () => {
    MeeBot.milestoneFeedback('M2')
    expect(MeeBot.getCurrentSprite()).toBe('excited')
    expect(MeeBot.getLastMessage()).toBe('Minting pipeline ready!')
  })

  test('should trigger sprite feedback for M3', () => {
    MeeBot.milestoneFeedback('M3')
    expect(MeeBot.getCurrentSprite()).toBe('proud')
    expect(MeeBot.getLastMessage()).toBe('Milestone linked!')
  })

  test('should trigger sprite feedback for M4', () => {
    MeeBot.milestoneFeedback('M4')
    expect(MeeBot.getCurrentSprite()).toBe('confident')
    expect(MeeBot.getLastMessage()).toBe('Fallback validated!')
  })

  test('should trigger sprite feedback for M5', () => {
    MeeBot.milestoneFeedback('M5')
    expect(MeeBot.getCurrentSprite()).toBe('celebration')
    expect(MeeBot.getLastMessage()).toBe('Production ready!')
  })

  test('should use custom message if provided', () => {
    MeeBot.milestoneFeedback('M1', 'Custom milestone message')
    expect(MeeBot.getCurrentSprite()).toBe('happy')
    expect(MeeBot.getLastMessage()).toBe('Custom milestone message')
  })

  test('should handle unknown milestone gracefully', () => {
    MeeBot.milestoneFeedback('M99', 'Unknown milestone')
    expect(MeeBot.getCurrentSprite()).toBe('neutral')
    expect(MeeBot.getLastMessage()).toBe('Unknown milestone')
  })
})
