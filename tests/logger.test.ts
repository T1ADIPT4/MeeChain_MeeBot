/**
 * Tests for Logger File Writing
 * Verifies that error and fallback logs are written to disk
 */

import { logEvent, clearLogs } from '../src/utils/logger'
import * as fs from 'fs'
import * as path from 'path'

describe('Logger File Writing', () => {
  const logsDir = path.join(process.cwd(), 'tests', 'logs')
  const dateStr = new Date().toISOString().split('T')[0]
  const fallbackLogPath = path.join(logsDir, `fallback-${dateStr}.log`)
  const errorLogPath = path.join(logsDir, `error-${dateStr}.log`)

  beforeEach(() => {
    clearLogs()
  })

  describe('Fallback Log Writing', () => {
    test('should write fallback logs to file', () => {
      // Log a fallback event
      logEvent('badge-fallback-minted', {
        userId: 'test-user',
        questId: 'test-quest',
        network: 'ethereum',
        tx: '0xtest123'
      })

      // Check if file exists and contains the log
      expect(fs.existsSync(fallbackLogPath)).toBe(true)
      
      const logContent = fs.readFileSync(fallbackLogPath, 'utf-8')
      expect(logContent).toContain('badge-fallback-minted')
      expect(logContent).toContain('test-user')
      expect(logContent).toContain('0xtest123')
    })

    test('should write fallback-mint-success logs to file', () => {
      logEvent('badge-fallback-mint-success', {
        userId: 'user-002',
        questId: 'quest-002',
        network: 'polygon',
        tx: '0xabc123'
      })

      expect(fs.existsSync(fallbackLogPath)).toBe(true)
      
      const logContent = fs.readFileSync(fallbackLogPath, 'utf-8')
      expect(logContent).toContain('badge-fallback-mint-success')
      expect(logContent).toContain('polygon')
    })
  })

  describe('Error Log Writing', () => {
    test('should write error level logs to file', () => {
      logEvent('test-error', {
        message: 'Test error message',
        code: 500
      }, 'error')

      expect(fs.existsSync(errorLogPath)).toBe(true)
      
      const logContent = fs.readFileSync(errorLogPath, 'utf-8')
      expect(logContent).toContain('test-error')
      expect(logContent).toContain('ERROR')
      expect(logContent).toContain('Test error message')
    })

    test('should write failed events to file', () => {
      logEvent('badge-mint-failed', {
        userId: 'user-fail',
        error: 'Minting failed'
      })

      expect(fs.existsSync(errorLogPath)).toBe(true)
      
      const logContent = fs.readFileSync(errorLogPath, 'utf-8')
      expect(logContent).toContain('badge-mint-failed')
      expect(logContent).toContain('Minting failed')
    })

    test('should write verification-failed events to file', () => {
      logEvent('quest-verification-failed', {
        userId: 'user-123',
        questId: 'quest-001'
      })

      expect(fs.existsSync(errorLogPath)).toBe(true)
      
      const logContent = fs.readFileSync(errorLogPath, 'utf-8')
      expect(logContent).toContain('quest-verification-failed')
    })
  })

  describe('Selective Logging', () => {
    test('should not write info level logs to file', () => {
      // Clear any existing logs
      const initialFallbackExists = fs.existsSync(fallbackLogPath)
      const initialErrorExists = fs.existsSync(errorLogPath)
      let initialFallbackSize = 0
      let initialErrorSize = 0
      
      if (initialFallbackExists) {
        initialFallbackSize = fs.statSync(fallbackLogPath).size
      }
      if (initialErrorExists) {
        initialErrorSize = fs.statSync(errorLogPath).size
      }

      // Log a regular info event (not fallback or error)
      logEvent('user-progress-updated', {
        userId: 'test-user',
        progress: 50
      }, 'info')

      // File sizes should not change
      if (initialFallbackExists) {
        expect(fs.statSync(fallbackLogPath).size).toBe(initialFallbackSize)
      }
      if (initialErrorExists) {
        expect(fs.statSync(errorLogPath).size).toBe(initialErrorSize)
      }
    })
  })

  describe('Log Format', () => {
    test('should format logs with timestamp and level', () => {
      logEvent('badge-fallback-minted', {
        userId: 'format-test',
        questId: 'format-quest'
      })

      const logContent = fs.readFileSync(fallbackLogPath, 'utf-8')
      
      // Check for timestamp in ISO format
      expect(logContent).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
      
      // Check for log level
      expect(logContent).toContain('[INFO]')
      
      // Check for event type
      expect(logContent).toContain('badge-fallback-minted')
      
      // Check for JSON formatted context
      expect(logContent).toContain('"userId": "format-test"')
    })
  })
})
