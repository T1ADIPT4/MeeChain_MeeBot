/**
 * Badge Metadata Generator
 * Generates NFT metadata for badges in standard format
 */

export interface BadgeMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

/**
 * Generate badge metadata for NFT
 */
export function generateBadgeMetadata(
  badgeId: string,
  badgeName: string,
  badgeDescription: string,
  contributorAddress: string,
  imageIPFSHash: string
): BadgeMetadata {
  return {
    name: badgeName,
    description: badgeDescription,
    image: `ipfs://${imageIPFSHash}`,
    external_url: `https://meechain.sg/contributor/${contributorAddress}`,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: badgeId
      },
      {
        trait_type: 'Contributor',
        value: contributorAddress
      },
      {
        trait_type: 'Issued Date',
        value: new Date().toISOString()
      },
      {
        trait_type: 'Platform',
        value: 'MeeChain Singapore'
      },
      {
        trait_type: 'Soulbound',
        value: 'Yes'
      }
    ]
  }
}

/**
 * Generate Watchdog badge metadata
 */
export function generateWatchdogMetadata(
  contributorAddress: string,
  flagCount: number
): BadgeMetadata {
  return {
    name: '🛡️ Watchdog Badge',
    description: 'Awarded for vigilance in flagging invalid refund logs and protecting the MeeChain ecosystem',
    image: 'ipfs://QmWatchdogBadgeHash/watchdog.png', // Replace with actual IPFS hash
    external_url: `https://meechain.sg/contributor/${contributorAddress}`,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: 'watchdog'
      },
      {
        trait_type: 'Contributor',
        value: contributorAddress
      },
      {
        trait_type: 'Valid Flags',
        value: flagCount
      },
      {
        trait_type: 'Issued Date',
        value: new Date().toISOString()
      },
      {
        trait_type: 'Tier',
        value: 'Guardian'
      },
      {
        trait_type: 'Soulbound',
        value: 'Yes'
      }
    ]
  }
}

/**
 * Generate Auditor badge metadata
 */
export function generateAuditorMetadata(
  contributorAddress: string,
  auditCount: number
): BadgeMetadata {
  return {
    name: '🔍 Auditor Badge',
    description: 'Awarded for thorough review and verification of refund transactions',
    image: 'ipfs://QmAuditorBadgeHash/auditor.png', // Replace with actual IPFS hash
    external_url: `https://meechain.sg/contributor/${contributorAddress}`,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: 'auditor'
      },
      {
        trait_type: 'Contributor',
        value: contributorAddress
      },
      {
        trait_type: 'Audits Completed',
        value: auditCount
      },
      {
        trait_type: 'Issued Date',
        value: new Date().toISOString()
      },
      {
        trait_type: 'Tier',
        value: 'Expert'
      },
      {
        trait_type: 'Soulbound',
        value: 'Yes'
      }
    ]
  }
}

/**
 * Generate Proposer badge metadata
 */
export function generateProposerMetadata(
  contributorAddress: string,
  proposalCount: number
): BadgeMetadata {
  return {
    name: '📝 Proposer Badge',
    description: 'Awarded for active participation in DAO governance through proposal creation',
    image: 'ipfs://QmProposerBadgeHash/proposer.png', // Replace with actual IPFS hash
    external_url: `https://meechain.sg/contributor/${contributorAddress}`,
    attributes: [
      {
        trait_type: 'Badge Type',
        value: 'proposer'
      },
      {
        trait_type: 'Contributor',
        value: contributorAddress
      },
      {
        trait_type: 'Proposals Created',
        value: proposalCount
      },
      {
        trait_type: 'Issued Date',
        value: new Date().toISOString()
      },
      {
        trait_type: 'Tier',
        value: 'Leader'
      },
      {
        trait_type: 'Soulbound',
        value: 'Yes'
      }
    ]
  }
}

/**
 * Convert metadata to JSON string
 */
export function metadataToJSON(metadata: BadgeMetadata): string {
  return JSON.stringify(metadata, null, 2)
}

/**
 * Upload metadata to IPFS (mock implementation)
 * In production, this would use a real IPFS service
 */
export async function uploadMetadataToIPFS(metadata: BadgeMetadata): Promise<string> {
  // Mock IPFS upload - replace with actual IPFS integration
  const json = metadataToJSON(metadata)
  const hash = `Qm${Math.random().toString(36).substring(2, 15)}`
  
  console.log(`[BadgeMetadata] Uploading to IPFS...`)
  console.log(json)
  console.log(`[BadgeMetadata] IPFS Hash: ${hash}`)
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return hash
}
