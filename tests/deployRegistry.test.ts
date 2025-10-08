/**
 * Deploy Registry Integration Tests
 * Tests for multi-chain contract deployment registry
 */

import {
  loadRegistry,
  getNetworkConfig,
  getBadgeContract,
  getQuestContract,
  getFallbackContract,
  getAvailableNetworks,
  getRegistryVersion,
  clearRegistryCache,
} from '../src/config/registryLoader'
import { mintBadge, fallbackMintBadge, setPrimaryNetwork, setFallbackNetwork, getPrimaryNetwork, getFallbackNetwork } from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'

describe('Deploy Registry System', () => {
  beforeEach(() => {
    clearLogs()
    clearRegistryCache()
  })

  describe('Registry Loading', () => {
    test('should load registry successfully', () => {
      const registry = loadRegistry()
      expect(registry).toBeDefined()
      expect(registry.version).toBe('1.0.0')
      expect(registry.networks).toBeDefined()
    })

    test('should cache registry after first load', () => {
      const registry1 = loadRegistry()
      const registry2 = loadRegistry()
      expect(registry1).toBe(registry2)
    })

    test('should get registry version', () => {
      const version = getRegistryVersion()
      expect(version).toBe('1.0.0')
    })

    test('should list available networks', () => {
      const networks = getAvailableNetworks()
      expect(networks).toContain('ethereum')
      expect(networks).toContain('polygon')
      expect(networks).toContain('arbitrum')
      expect(networks.length).toBe(3)
    })
  })

  describe('Network Configuration', () => {
    test('should get Ethereum network config', () => {
      const config = getNetworkConfig('ethereum')
      expect(config.chainId).toBe(1)
      expect(config.badgeContract).toBe('0xBadgeEth123')
      expect(config.questContract).toBe('0xQuestEth456')
      expect(config.fallbackContract).toBe('0xFallbackEth789')
    })

    test('should get Polygon network config', () => {
      const config = getNetworkConfig('polygon')
      expect(config.chainId).toBe(137)
      expect(config.badgeContract).toBe('0xBadgePoly123')
      expect(config.questContract).toBe('0xQuestPoly456')
      expect(config.fallbackContract).toBe('0xFallbackPoly789')
    })

    test('should get Arbitrum network config', () => {
      const config = getNetworkConfig('arbitrum')
      expect(config.chainId).toBe(42161)
      expect(config.badgeContract).toBe('0xBadgeArb123')
      expect(config.questContract).toBe('0xQuestArb456')
      expect(config.fallbackContract).toBe('0xFallbackArb789')
    })

    test('should throw error for unknown network', () => {
      expect(() => {
        // @ts-expect-error Testing invalid network
        getNetworkConfig('unknown')
      }).toThrow('Network unknown not found in deploy registry')
    })
  })

  describe('Contract Address Getters', () => {
    test('should get badge contract for Ethereum', () => {
      const address = getBadgeContract('ethereum')
      expect(address).toBe('0xBadgeEth123')
    })

    test('should get quest contract for Polygon', () => {
      const address = getQuestContract('polygon')
      expect(address).toBe('0xQuestPoly456')
    })

    test('should get fallback contract for Arbitrum', () => {
      const address = getFallbackContract('arbitrum')
      expect(address).toBe('0xFallbackArb789')
    })
  })

  describe('Badge Minting with Registry', () => {
    test('should mint badge with default network (polygon)', async () => {
      const userId = 'test-user-registry-1'
      const questId = 'quest-001'

      const tx = await mintBadge(userId, questId)

      expect(tx.network).toBe('polygon')
      expect(tx.contractAddress).toBe('0xBadgePoly123')
      expect(tx.chain).toBe('primary')
    })

    test('should mint badge with explicit network', async () => {
      const userId = 'test-user-registry-2'
      const questId = 'quest-001'

      const tx = await mintBadge(userId, questId, 'ethereum')

      expect(tx.network).toBe('ethereum')
      expect(tx.contractAddress).toBe('0xBadgeEth123')
      expect(tx.chain).toBe('primary')
    })

    test('should fallback mint with default network (ethereum)', async () => {
      const userId = 'test-user-registry-3'
      const questId = 'quest-001'

      const tx = await fallbackMintBadge(userId, questId)

      expect(tx.network).toBe('ethereum')
      expect(tx.contractAddress).toBe('0xFallbackEth789')
      expect(tx.chain).toBe('fallback')
    })

    test('should fallback mint with explicit network', async () => {
      const userId = 'test-user-registry-4'
      const questId = 'quest-001'

      const tx = await fallbackMintBadge(userId, questId, 'arbitrum')

      expect(tx.network).toBe('arbitrum')
      expect(tx.contractAddress).toBe('0xFallbackArb789')
      expect(tx.chain).toBe('fallback')
    })
  })

  describe('Network Configuration Setters', () => {
    test('should set and get primary network', () => {
      setPrimaryNetwork('arbitrum')
      expect(getPrimaryNetwork()).toBe('arbitrum')

      // Reset to default
      setPrimaryNetwork('polygon')
    })

    test('should set and get fallback network', () => {
      setFallbackNetwork('polygon')
      expect(getFallbackNetwork()).toBe('polygon')

      // Reset to default
      setFallbackNetwork('ethereum')
    })

    test('should use custom primary network for minting', async () => {
      setPrimaryNetwork('arbitrum')
      
      const tx = await mintBadge('user-1', 'quest-1')
      
      expect(tx.network).toBe('arbitrum')
      expect(tx.contractAddress).toBe('0xBadgeArb123')

      // Reset to default
      setPrimaryNetwork('polygon')
    })

    test('should use custom fallback network for minting', async () => {
      setFallbackNetwork('polygon')
      
      const tx = await fallbackMintBadge('user-1', 'quest-1')
      
      expect(tx.network).toBe('polygon')
      expect(tx.contractAddress).toBe('0xFallbackPoly789')

      // Reset to default
      setFallbackNetwork('ethereum')
    })
  })
})
