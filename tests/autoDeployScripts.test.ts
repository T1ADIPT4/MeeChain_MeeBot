/**
 * Automated Deploy Scripts Tests
 * Tests for deploy.ts, updateRegistry.ts, and validateRegistry.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { deployContract, updateRegistryFile } from '../scripts/deploy'
import { updateRegistry } from '../scripts/updateRegistry'
import { validateRegistry, isValidAddress, validateNetworkConfig } from '../scripts/validateRegistry'
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
      expect(address.length).toBeGreaterThan(10)
    })

    test('should generate different addresses for different contracts', async () => {
      const badge = await deployContract('Badge', 'ethereum')
      const quest = await deployContract('Quest', 'ethereum')
      
      expect(badge).not.toBe(quest)
    })
  })

  describe('updateRegistryFile', () => {
    test('should update badge contract address', () => {
      const testAddress = '0xTestBadge999'
      
      updateRegistryFile('polygon', 'Badge', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.polygon.badgeContract).toBe(testAddress)
    })

    test('should update quest contract address', () => {
      const testAddress = '0xTestQuest888'
      
      updateRegistryFile('ethereum', 'Quest', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.ethereum.questContract).toBe(testAddress)
    })

    test('should update fallback contract address', () => {
      const testAddress = '0xTestFallback777'
      
      updateRegistryFile('arbitrum', 'Fallback', testAddress)
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.arbitrum.fallbackContract).toBe(testAddress)
    })

    test('should update lastUpdated timestamp', () => {
      const before = Date.now()
      
      updateRegistryFile('polygon', 'Badge', '0xTest123')
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      const updated = new Date(registry.lastUpdated).getTime()
      
      expect(updated).toBeGreaterThanOrEqual(before)
    })
  })

  describe('updateRegistry', () => {
    test('should update single contract', () => {
      const testAddress = '0xNewBadge123'
      
      updateRegistry({
        network: 'polygon',
        badgeContract: testAddress
      })
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.polygon.badgeContract).toBe(testAddress)
    })

    test('should update multiple contracts', () => {
      updateRegistry({
        network: 'ethereum',
        badgeContract: '0xBadge456',
        questContract: '0xQuest789'
      })
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.ethereum.badgeContract).toBe('0xBadge456')
      expect(registry.networks.ethereum.questContract).toBe('0xQuest789')
    })

    test('should create new network if not exists', () => {
      updateRegistry({
        network: 'optimism' as any,
        chainId: 10,
        badgeContract: '0xOptimismBadge'
      })
      clearRegistryCache()
      
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      expect(registry.networks.optimism).toBeDefined()
      expect(registry.networks.optimism.chainId).toBe(10)
      expect(registry.networks.optimism.badgeContract).toBe('0xOptimismBadge')
    })
  })

  describe('isValidAddress', () => {
    test('should validate correct addresses', () => {
      expect(isValidAddress('0x1234567890abcdef')).toBe(true)
      expect(isValidAddress('0xABCDEF123456')).toBe(true)
      expect(isValidAddress('0xTest123')).toBe(true)
    })

    test('should reject invalid addresses', () => {
      expect(isValidAddress('1234567890')).toBe(false)
      expect(isValidAddress('0x')).toBe(false)
      expect(isValidAddress('')).toBe(false)
      expect(isValidAddress('not-an-address')).toBe(false)
    })
  })

  describe('validateRegistry', () => {
    test('should validate correct registry', () => {
      const result = validateRegistry()
      
      expect(result.valid).toBe(true)
      expect(result.networkCount).toBeGreaterThan(0)
      expect(result.networks).toContain('ethereum')
      expect(result.networks).toContain('polygon')
      expect(result.networks).toContain('arbitrum')
    })

    test('should detect missing version', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      delete (registry as any).version
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing version field')
    })

    test('should detect invalid lastUpdated', () => {
      const registry: DeployRegistry = JSON.parse(readFileSync(registryPath, 'utf-8'))
      registry.lastUpdated = 'invalid-date'
      writeFileSync(registryPath, JSON.stringify(registry))
      clearRegistryCache()
      
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Invalid lastUpdated'))).toBe(true)
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
      expect(result.errors.some(e => e.includes('Invalid badgeContract address format'))).toBe(true)
    })
  })

  describe('validateNetworkConfig', () => {
    test('should validate correct network config', () => {
      const errors: string[] = []
      const warnings: string[] = []
      
      validateNetworkConfig(
        'test-network',
        {
          chainId: 1,
          badgeContract: '0xBadge123',
          questContract: '0xQuest456',
          fallbackContract: '0xFallback789'
        },
        errors,
        warnings
      )
      
      expect(errors).toHaveLength(0)
      expect(warnings).toHaveLength(0)
    })

    test('should detect invalid chain ID', () => {
      const errors: string[] = []
      const warnings: string[] = []
      
      validateNetworkConfig(
        'test-network',
        {
          chainId: 0,
          badgeContract: '0xBadge123',
          questContract: '0xQuest456',
          fallbackContract: '0xFallback789'
        },
        errors,
        warnings
      )
      
      expect(errors).toContain('test-network: Invalid or missing chainId')
    })

    test('should warn on duplicate addresses', () => {
      const errors: string[] = []
      const warnings: string[] = []
      
      validateNetworkConfig(
        'test-network',
        {
          chainId: 1,
          badgeContract: '0xSame123',
          questContract: '0xSame123',
          fallbackContract: '0xFallback789'
        },
        errors,
        warnings
      )
      
      expect(warnings.some(w => w.includes('Duplicate contract addresses'))).toBe(true)
    })
  })

  describe('Integration workflow', () => {
    test('should deploy, update, and validate successfully', async () => {
      // Deploy
      const address = await deployContract('Badge', 'polygon')
      expect(address).toMatch(/^0x/)
      
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
