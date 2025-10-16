/**
 * Automated Deploy Scripts Tests
 * Tests for deploy.ts, updateRegistry.ts, and validateRegistry.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { deployContract, updateRegistryFile } from '../scripts/deploy'
import { updateRegistry } from '../scripts/updateRegistry'
import { validateRegistry, isValidAddress } from '../scripts/validateRegistry'
import { clearRegistryCache } from '../src/config/registryLoader'
import type { DeployRegistry } from '../src/config/registryTypes'

describe('Automated Deploy Scripts', () => {
  const registryPath = join(process.cwd(), 'config/deploy-registry.json')
  let originalRegistry: string

  beforeEach(() => {
    // Backup original registry
    originalRegistry = readFileSync(registryPath, 'utf-8')
    clearRegistryCache()
  })

  afterEach(() => {
    // Restore original registry
    writeFileSync(registryPath, originalRegistry)
    clearRegistryCache()
  })

  describe('deployContract', () => {
    test('should deploy contract and return address', async () => {
      const address = await deployContract('Badge', 'polygon')
      
      expect(address).toBeDefined()
      expect(address).toMatch(/^0x/)
      expect(address.length).toBe(42)
    })

    test('should generate different addresses for different contracts', async () => {
      const badge = await deployContract('Badge', 'ethereum')
      const quest = await deployContract('Quest', 'ethereum')
      
      expect(badge).not.toBe(quest)
    })
  })

  describe('updateRegistryFile', () => {
    test('should update badge contract address', () => {
      const testAddress = '0x1111111111111111111111111111111111111111'
      
      updateRegistryFile('polygon', 'Badge', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.polygon.badgeContract).toBe(testAddress)
    })

    test('should update quest contract address', () => {
      const testAddress = '0x2222222222222222222222222222222222222222'
      
      updateRegistryFile('ethereum', 'Quest', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.ethereum.questContract).toBe(testAddress)
    })

    test('should update fallback contract address', () => {
      const testAddress = '0x3333333333333333333333333333333333333333'
      
      updateRegistryFile('arbitrum', 'Fallback', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.arbitrum.fallbackContract).toBe(testAddress)
    })

    test('should update lastUpdated timestamp', () => {
      const before = Date.now()
      
      updateRegistryFile('polygon', 'Badge', '0x4444444444444444444444444444444444444444')
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      const updated = new Date(registry.lastUpdated).getTime()
      
      expect(updated).toBeGreaterThanOrEqual(before)
    })
  })

  describe('updateRegistry', () => {
    test('should update single contract', () => {
      const testAddress = '0x5555555555555555555555555555555555555555'
      
      updateRegistry('polygon', {
        badgeContract: testAddress
      })
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.polygon.badgeContract).toBe(testAddress)
    })

    test('should update multiple contracts', () => {
      updateRegistry('ethereum', {
        badgeContract: '0x1111111111111111111111111111111111111111',
        questContract: '0x2222222222222222222222222222222222222222'
      })
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.ethereum.badgeContract).toBe('0x1111111111111111111111111111111111111111')
      expect(registry.networks.ethereum.questContract).toBe('0x2222222222222222222222222222222222222222')
    })

    test('should not create new network if not exists', () => {
      expect(() => {
        updateRegistry('optimism' as any, {
          badgeContract: '0xOptimismBadge'
        })
      }).toThrow()
    })
  })

  describe('isValidAddress', () => {
    test('should validate correct addresses', () => {
      expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
      expect(isValidAddress('0xABCDEF1234567890ABCDEF1234567890abcdef')).toBe(true)
    })

    test('should reject invalid addresses', () => {
      expect(isValidAddress('1234567890')).toBe(false)
      expect(isValidAddress('0x')).toBe(false)
      expect(isValidAddress('')).toBe(false)
      expect(isValidAddress('not-an-address')).toBe(false)
      expect(isValidAddress('0xTest123')).toBe(false)
    })
  })

  describe('validateRegistry', () => {
    test('should validate correct registry', () => {
      const result = validateRegistry()
      
      expect(result.valid).toBe(true)
    })

    test('should detect missing version', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      delete (registry as any).version
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message === 'Missing version field')).toBe(true)
    })

    test('should detect invalid lastUpdated', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      registry.lastUpdated = 'invalid-date'
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('Invalid date format (should be ISO 8601)'))).toBe(true)
    })

    test('should warn on missing contracts', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      registry.networks.polygon.badgeContract = ''
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.warnings.some(w => w.includes('Missing badgeContract'))).toBe(true)
    })

    test('should detect invalid contract addresses', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      registry.networks.ethereum.badgeContract = 'invalid-address'
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('Invalid address format (should start with 0x)'))).toBe(true)
    })
  })

  describe('Integration workflow', () => {
    test('should deploy, update, and validate successfully', async () => {
      // Deploy
      const address = await deployContract('Badge', 'polygon')
      expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/)
      
      // Update registry
      updateRegistryFile('polygon', 'Badge', address)
      clearRegistryCache()
      
      // Validate
      const result = validateRegistry()
      expect(result.valid).toBe(true)
      
      // Verify the address is in the registry
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.polygon.badgeContract).toBe(address)
    })
  })
})
