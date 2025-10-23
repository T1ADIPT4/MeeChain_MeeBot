/**
 * Tests for Badge Metadata Generator
 */

import {
  generateBadgeMetadata,
  generateWatchdogMetadata,
  generateAuditorMetadata,
  generateProposerMetadata,
  metadataToJSON,
  uploadMetadataToIPFS
} from '../src/utils/badgeMetadataGenerator'

describe('Badge Metadata Generator', () => {
  const testAddress = '0x1234567890123456789012345678901234567890'

  describe('generateBadgeMetadata', () => {
    it('should generate valid badge metadata', () => {
      const metadata = generateBadgeMetadata(
        'test-badge',
        'Test Badge',
        'A test badge for testing',
        testAddress,
        'QmTestImageHash'
      )

      expect(metadata.name).toBe('Test Badge')
      expect(metadata.description).toBe('A test badge for testing')
      expect(metadata.image).toBe('ipfs://QmTestImageHash')
      expect(metadata.external_url).toBe(`https://meechain.sg/contributor/${testAddress}`)
      expect(metadata.attributes).toBeDefined()
      expect(metadata.attributes.length).toBeGreaterThan(0)
    })

    it('should include required attributes', () => {
      const metadata = generateBadgeMetadata(
        'test-badge',
        'Test Badge',
        'Description',
        testAddress,
        'QmHash'
      )

      const attributeTypes = metadata.attributes.map(a => a.trait_type)
      expect(attributeTypes).toContain('Badge Type')
      expect(attributeTypes).toContain('Contributor')
      expect(attributeTypes).toContain('Issued Date')
      expect(attributeTypes).toContain('Platform')
      expect(attributeTypes).toContain('Soulbound')
    })

    it('should mark badges as Soulbound', () => {
      const metadata = generateBadgeMetadata(
        'test',
        'Test',
        'Desc',
        testAddress,
        'Hash'
      )

      const soulboundAttr = metadata.attributes.find(
        a => a.trait_type === 'Soulbound'
      )
      expect(soulboundAttr?.value).toBe('Yes')
    })
  })

  describe('generateWatchdogMetadata', () => {
    it('should generate Watchdog badge metadata with flag count', () => {
      const metadata = generateWatchdogMetadata(testAddress, 10)

      expect(metadata.name).toBe('🛡️ Watchdog Badge')
      expect(metadata.description).toContain('flagging invalid refund logs')
      
      const flagsAttr = metadata.attributes.find(
        a => a.trait_type === 'Valid Flags'
      )
      expect(flagsAttr?.value).toBe(10)
      
      const tierAttr = metadata.attributes.find(
        a => a.trait_type === 'Tier'
      )
      expect(tierAttr?.value).toBe('Guardian')
    })
  })

  describe('generateAuditorMetadata', () => {
    it('should generate Auditor badge metadata with audit count', () => {
      const metadata = generateAuditorMetadata(testAddress, 15)

      expect(metadata.name).toBe('🔍 Auditor Badge')
      expect(metadata.description).toContain('review and verification')
      
      const auditsAttr = metadata.attributes.find(
        a => a.trait_type === 'Audits Completed'
      )
      expect(auditsAttr?.value).toBe(15)
      
      const tierAttr = metadata.attributes.find(
        a => a.trait_type === 'Tier'
      )
      expect(tierAttr?.value).toBe('Expert')
    })
  })

  describe('generateProposerMetadata', () => {
    it('should generate Proposer badge metadata with proposal count', () => {
      const metadata = generateProposerMetadata(testAddress, 5)

      expect(metadata.name).toBe('📝 Proposer Badge')
      expect(metadata.description).toContain('DAO governance')
      
      const proposalsAttr = metadata.attributes.find(
        a => a.trait_type === 'Proposals Created'
      )
      expect(proposalsAttr?.value).toBe(5)
      
      const tierAttr = metadata.attributes.find(
        a => a.trait_type === 'Tier'
      )
      expect(tierAttr?.value).toBe('Leader')
    })
  })

  describe('metadataToJSON', () => {
    it('should convert metadata to JSON string', () => {
      const metadata = generateBadgeMetadata(
        'test',
        'Test Badge',
        'Description',
        testAddress,
        'Hash'
      )

      const json = metadataToJSON(metadata)
      expect(typeof json).toBe('string')
      
      const parsed = JSON.parse(json)
      expect(parsed.name).toBe('Test Badge')
      expect(parsed.attributes).toBeDefined()
    })

    it('should produce properly formatted JSON', () => {
      const metadata = generateWatchdogMetadata(testAddress, 5)
      const json = metadataToJSON(metadata)
      
      // Should be valid JSON
      expect(() => JSON.parse(json)).not.toThrow()
      
      // Should be pretty-printed (contains newlines and spaces)
      expect(json).toContain('\n')
      expect(json).toContain('  ')
    })
  })

  describe('uploadMetadataToIPFS', () => {
    it('should upload metadata and return IPFS hash', async () => {
      const metadata = generateBadgeMetadata(
        'test',
        'Test',
        'Desc',
        testAddress,
        'Hash'
      )

      const hash = await uploadMetadataToIPFS(metadata)
      
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash.startsWith('Qm')).toBe(true)
    })

    it('should handle different badge types', async () => {
      const watchdogMetadata = generateWatchdogMetadata(testAddress, 5)
      const hash1 = await uploadMetadataToIPFS(watchdogMetadata)
      
      const auditorMetadata = generateAuditorMetadata(testAddress, 10)
      const hash2 = await uploadMetadataToIPFS(auditorMetadata)
      
      expect(hash1).toBeDefined()
      expect(hash2).toBeDefined()
      // Different metadata should produce different hashes
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('Metadata structure validation', () => {
    it('should have consistent structure across all badge types', () => {
      const badges = [
        generateWatchdogMetadata(testAddress, 5),
        generateAuditorMetadata(testAddress, 10),
        generateProposerMetadata(testAddress, 3)
      ]

      badges.forEach(metadata => {
        expect(metadata).toHaveProperty('name')
        expect(metadata).toHaveProperty('description')
        expect(metadata).toHaveProperty('image')
        expect(metadata).toHaveProperty('external_url')
        expect(metadata).toHaveProperty('attributes')
        expect(Array.isArray(metadata.attributes)).toBe(true)
      })
    })

    it('should include contributor address in all badges', () => {
      const badges = [
        generateWatchdogMetadata(testAddress, 5),
        generateAuditorMetadata(testAddress, 10),
        generateProposerMetadata(testAddress, 3)
      ]

      badges.forEach(metadata => {
        const contributorAttr = metadata.attributes.find(
          a => a.trait_type === 'Contributor'
        )
        expect(contributorAttr?.value).toBe(testAddress)
      })
    })
  })
})
