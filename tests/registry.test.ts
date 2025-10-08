/**
 * Tests for Registry Utility
 * Tests the simplified registry access functions for UI components
 */

import { getContractAddress } from '../utils/registry'
import { clearRegistryCache } from '../src/config/registryLoader'

describe('Registry Utility', () => {
  beforeEach(() => {
    clearRegistryCache()
  })

  describe('getContractAddress', () => {
    test('should get badge contract for polygon', () => {
      const address = getContractAddress('polygon', 'badge')
      expect(address).toBe('0xBadgePoly123')
    })

    test('should get quest contract for ethereum', () => {
      const address = getContractAddress('ethereum', 'quest')
      expect(address).toBe('0xQuestEth456')
    })

    test('should get fallback contract for arbitrum', () => {
      const address = getContractAddress('arbitrum', 'fallback')
      expect(address).toBe('0xFallbackArb789')
    })

    test('should return N/A for invalid network', () => {
      const address = getContractAddress('invalid-network', 'badge')
      expect(address).toBe('N/A')
    })

    test('should get correct contracts for all supported networks', () => {
      const networks = ['ethereum', 'polygon', 'arbitrum']
      const types: ('badge' | 'quest' | 'fallback')[] = ['badge', 'quest', 'fallback']

      networks.forEach(network => {
        types.forEach(type => {
          const address = getContractAddress(network, type)
          expect(address).toBeTruthy()
          expect(address).not.toBe('N/A')
          expect(address).toMatch(/^0x/)
        })
      })
    })
  })
})
