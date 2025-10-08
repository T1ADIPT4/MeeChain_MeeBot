/**
 * Automated Deploy-Registry System Tests
 * Tests for deployment scripts and registry automation
 */

import { deployContract, deployAllContracts, verifyContract } from '../scripts/utils/deployer'
import { updateRegistry, backupRegistry } from '../scripts/updateRegistry'
import { validateRegistry } from '../scripts/validateRegistry'
import { exportLogsToJSON, exportLogsToCSV, exportRegistryWithProvenance } from '../scripts/exportLogs'
import { clearRegistryCache, loadRegistry } from '../src/config/registryLoader'
import { clearLogs } from '../src/utils/logger'
import fs from 'fs'
import path from 'path'

describe('Automated Deploy-Registry System', () => {
  beforeEach(() => {
    clearLogs()
    clearRegistryCache()
  })

  describe('Contract Deployment', () => {
    test('should deploy a single contract', async () => {
      const result = await deployContract('Badge', 'polygon')
      
      expect(result).toBeDefined()
      expect(result.address).toMatch(/^0x/)
      expect(result.network).toBe('polygon')
      expect(result.contractType).toBe('Badge')
      expect(result.txHash).toMatch(/^0x/)
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    test('should deploy all contracts for a network', async () => {
      const contracts = await deployAllContracts('arbitrum')
      
      expect(contracts.badgeContract).toMatch(/^0x/)
      expect(contracts.questContract).toMatch(/^0x/)
      expect(contracts.fallbackContract).toMatch(/^0x/)
    })

    test('should verify deployed contract', async () => {
      const result = await deployContract('Quest', 'ethereum')
      const isValid = await verifyContract(result.address, 'ethereum')
      
      expect(isValid).toBe(true)
    })

    test('should reject invalid contract address', async () => {
      const isValid = await verifyContract('invalid-address', 'ethereum')
      
      expect(isValid).toBe(false)
    })
  })

  describe('Registry Updates', () => {
    let originalRegistry: any

    beforeEach(() => {
      // Save original registry
      originalRegistry = JSON.parse(
        fs.readFileSync(
          path.resolve(process.cwd(), 'config/deploy-registry.json'),
          'utf-8'
        )
      )
    })

    afterEach(() => {
      // Restore original registry
      fs.writeFileSync(
        path.resolve(process.cwd(), 'config/deploy-registry.json'),
        JSON.stringify(originalRegistry, null, 2) + '\n'
      )
    })

    test('should update registry with new contract addresses', () => {
      const timestampBefore = Date.now()
      
      const newContracts = {
        badgeContract: '0xNewBadge123',
        questContract: '0xNewQuest456',
      }
      
      updateRegistry('polygon', newContracts)
      
      clearRegistryCache()
      const registry = loadRegistry()
      
      expect(registry.networks.polygon.badgeContract).toBe('0xNewBadge123')
      expect(registry.networks.polygon.questContract).toBe('0xNewQuest456')
      expect(new Date(registry.lastUpdated).getTime()).toBeGreaterThanOrEqual(timestampBefore)
    })

    test('should create registry backup', () => {
      const backupPath = backupRegistry()
      
      expect(fs.existsSync(backupPath)).toBe(true)
      expect(backupPath).toContain('deploy-registry.backup')
      
      // Cleanup
      fs.unlinkSync(backupPath)
    })

    test('should throw error for unknown network', () => {
      expect(() => {
        // @ts-expect-error Testing invalid network
        updateRegistry('unknown', { badgeContract: '0x123' })
      }).toThrow('Network unknown not found in registry')
    })
  })

  describe('Registry Validation', () => {
    test('should validate correct registry', () => {
      const result = validateRegistry()
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should detect missing version field', () => {
      const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
      const originalRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
      
      // Remove version field
      const invalidRegistry = { ...originalRegistry }
      delete invalidRegistry.version
      fs.writeFileSync(registryPath, JSON.stringify(invalidRegistry, null, 2))
      
      clearRegistryCache()
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.field === 'version')).toBe(true)
      
      // Restore
      fs.writeFileSync(registryPath, JSON.stringify(originalRegistry, null, 2) + '\n')
    })

    test('should detect invalid contract address format', () => {
      const registryPath = path.resolve(process.cwd(), 'config/deploy-registry.json')
      const originalRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))
      
      // Set invalid address
      const invalidRegistry = JSON.parse(JSON.stringify(originalRegistry))
      invalidRegistry.networks.ethereum.badgeContract = 'invalid-address'
      fs.writeFileSync(registryPath, JSON.stringify(invalidRegistry, null, 2))
      
      clearRegistryCache()
      const result = validateRegistry()
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.field === 'badgeContract' && e.network === 'ethereum')).toBe(true)
      
      // Restore
      fs.writeFileSync(registryPath, JSON.stringify(originalRegistry, null, 2) + '\n')
    })
  })

  describe('Log Export Functionality', () => {
    afterEach(() => {
      // Cleanup exported files
      const files = fs.readdirSync(process.cwd())
      files.forEach(file => {
        if (file.startsWith('logs-export-') || file.startsWith('registry-provenance-')) {
          fs.unlinkSync(path.join(process.cwd(), file))
        }
      })
    })

    test('should export logs to JSON', () => {
      const filepath = exportLogsToJSON()
      
      expect(fs.existsSync(filepath)).toBe(true)
      
      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
      expect(data.exportedAt).toBeDefined()
      expect(data.registry).toBeDefined()
      expect(data.logs).toBeInstanceOf(Array)
    })

    test('should export logs to CSV', () => {
      const filepath = exportLogsToCSV()
      
      expect(fs.existsSync(filepath)).toBe(true)
      
      const data = fs.readFileSync(filepath, 'utf-8')
      expect(data).toContain('timestamp,eventType,level,context')
    })

    test('should export registry with provenance', () => {
      const filepath = exportRegistryWithProvenance()
      
      expect(fs.existsSync(filepath)).toBe(true)
      
      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
      expect(data.registry).toBeDefined()
      expect(data.provenance).toBeDefined()
      expect(data.statistics).toBeDefined()
      expect(data.statistics.totalNetworks).toBe(3)
    })
  })

  describe('Integration: Full Deployment Flow', () => {
    let originalRegistry: any

    beforeEach(() => {
      originalRegistry = JSON.parse(
        fs.readFileSync(
          path.resolve(process.cwd(), 'config/deploy-registry.json'),
          'utf-8'
        )
      )
    })

    afterEach(() => {
      fs.writeFileSync(
        path.resolve(process.cwd(), 'config/deploy-registry.json'),
        JSON.stringify(originalRegistry, null, 2) + '\n'
      )
    })

    test('should complete full deployment and update flow', async () => {
      // 1. Backup registry
      const backupPath = backupRegistry()
      expect(fs.existsSync(backupPath)).toBe(true)
      
      // 2. Deploy contracts
      const contracts = await deployAllContracts('ethereum')
      expect(contracts.badgeContract).toMatch(/^0x/)
      expect(contracts.questContract).toMatch(/^0x/)
      expect(contracts.fallbackContract).toMatch(/^0x/)
      
      // 3. Verify contracts
      const badgeValid = await verifyContract(contracts.badgeContract, 'ethereum')
      expect(badgeValid).toBe(true)
      
      // 4. Update registry
      updateRegistry('ethereum', contracts)
      
      // 5. Validate registry
      clearRegistryCache()
      const validation = validateRegistry()
      expect(validation.valid).toBe(true)
      
      // 6. Verify updated values
      const registry = loadRegistry()
      expect(registry.networks.ethereum.badgeContract).toBe(contracts.badgeContract)
      expect(registry.networks.ethereum.questContract).toBe(contracts.questContract)
      expect(registry.networks.ethereum.fallbackContract).toBe(contracts.fallbackContract)
      
      // Cleanup
      fs.unlinkSync(backupPath)
    })
  })
})
