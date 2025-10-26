/**
 * Contributors API
 * Endpoints for contributor profile data
 */

import { 
  getContributorProfile, 
  getAllContributors, 
  getLeaderboard,
  getBadgeDefinitions,
  recordAction,
  recordAuditLog,
  linkSBTToken,
  type ContributorProfile,
  type ContributorAction,
  type Badge
} from '../services/contributorReputationService.js'

/**
 * GET /api/contributors/:address
 * Get contributor profile by address
 */
export function getContributor(address: string): ContributorProfile {
  return getContributorProfile(address)
}

/**
 * GET /api/contributors
 * Get all contributors
 */
export function getContributors(): ContributorProfile[] {
  return getAllContributors()
}

/**
 * GET /api/contributors/leaderboard
 * Get top contributors
 */
export function getContributorLeaderboard(limit: number = 10): ContributorProfile[] {
  return getLeaderboard(limit)
}

/**
 * GET /api/badges
 * Get all badge definitions
 */
export function getBadges(): Badge[] {
  return getBadgeDefinitions()
}

/**
 * POST /api/contributors/:address/actions
 * Record a contributor action
 */
export async function recordContributorAction(
  address: string,
  action: ContributorAction
): Promise<{ 
  success: boolean
  newScore: number
  badgesUnlocked: Badge[]
}> {
  return await recordAction(address, action)
}

/**
 * POST /api/contributors/:address/audit-log
 * Record an audit log entry
 */
export function recordContributorAuditLog(
  address: string,
  refundId: string,
  status: string,
  action: string
): { success: boolean } {
  recordAuditLog(address, refundId, status, action)
  return { success: true }
}

/**
 * POST /api/contributors/:address/sbt-token
 * Link an SBT token to contributor profile
 */
export function linkContributorSBTToken(
  address: string,
  tokenId: number,
  name: string,
  contractAddress: string,
  metadataURI: string
): { success: boolean } {
  linkSBTToken(address, tokenId, name, contractAddress, metadataURI)
  return { success: true }
}

/**
 * Mock Express-like route handler setup
 * In production, integrate with your actual backend framework
 */
export function setupContributorRoutes(app: any): void {
  // GET routes
  app.get('/api/contributors/:address', (req: any, res: any) => {
    const profile = getContributor(req.params.address)
    res.json(profile)
  })

  app.get('/api/contributors', (req: any, res: any) => {
    const contributors = getContributors()
    res.json(contributors)
  })

  app.get('/api/contributors/leaderboard', (req: any, res: any) => {
    const limit = parseInt(req.query.limit) || 10
    const leaderboard = getContributorLeaderboard(limit)
    res.json(leaderboard)
  })

  app.get('/api/badges', (req: any, res: any) => {
    const badges = getBadges()
    res.json(badges)
  })

  // POST routes
  app.post('/api/contributors/:address/actions', async (req: any, res: any) => {
    const result = await recordContributorAction(req.params.address, req.body)
    res.json(result)
  })

  app.post('/api/contributors/:address/audit-log', (req: any, res: any) => {
    const { refundId, status, action } = req.body
    const result = recordContributorAuditLog(req.params.address, refundId, status, action)
    res.json(result)
  })

  app.post('/api/contributors/:address/sbt-token', (req: any, res: any) => {
    const { tokenId, name, contractAddress, metadataURI } = req.body
    const result = linkContributorSBTToken(
      req.params.address,
      tokenId,
      name,
      contractAddress,
      metadataURI
    )
    res.json(result)
  })
}
