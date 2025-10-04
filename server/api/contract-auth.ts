import { Request, Response } from 'express';
import { getDeployConfig, saveDeployConfig } from '../utils/deploy-config.js';

export async function checkAuthorizations(req: Request, res: Response) {
  try {
    const registry = getDeployConfig();

    const { authorizations = {}, contracts } = registry;
    
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!authorizations['questManagerCanMintTokens']) {
      issues.push('QuestManager cannot mint MEE tokens - rewards will fail');
    }
    
    if (!authorizations['questManagerCanMintBadges']) {
      issues.push('QuestManager cannot mint badges - quest rewards will fail');
    }
    
    if (!authorizations['questManagerCanMintFootballNFTs']) {
      warnings.push('QuestManager cannot mint FootballNFTs - some quest rewards unavailable');
    }
    
    if (!authorizations['badgeUpgradeCanBurnTokens']) {
      issues.push('BadgeUpgrade cannot burn tokens - upgrades will fail');
    }
    
    if (!authorizations['badgeUpgradeCanUpgradeBadges']) {
      issues.push('BadgeUpgrade cannot upgrade badges - upgrade system non-functional');
    }

    const requiredContracts = [
      'MeeToken',
      'MeeBadgeNFT',
      'QuestManager',
      'BadgeNFTUpgrade',
      'MembershipNFT',
      'FootballNFT'
    ];

    const contractKeys = contracts as Record<string, string>;
    const missingContracts = requiredContracts.filter(name => !contractKeys[name]);
    
    if (missingContracts.length > 0) {
      issues.push(`Missing contract addresses: ${missingContracts.join(', ')}`);
    }

    const isReady = issues.length === 0;

    res.json({
      success: true,
      data: {
        isReady,
        contracts: {
          deployed: Object.keys(contracts).length,
          required: requiredContracts.length,
          missing: missingContracts
        },
        authorizations: {
          ...authorizations,
          total: Object.keys(authorizations || {}).length,
          enabled: Object.values(authorizations || {}).filter(v => v).length
        },
        issues,
        warnings,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Authorization check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check authorizations'
    });
  }
}

export async function updateAuthorizations(req: Request, res: Response) {
  try {
    const { authType, enabled } = req.body;
    
    if (typeof authType !== 'string' || typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: authType (string) and enabled (boolean) required'
      });
    }

    const registry = getDeployConfig();
    
    if (!registry.authorizations) {
      registry.authorizations = {};
    }
    
    registry.authorizations[authType] = enabled;
    saveDeployConfig(registry);

    res.json({
      success: true,
      data: {
        updated: authType,
        value: enabled,
        authorizations: registry.authorizations
      }
    });
  } catch (error) {
    console.error('Update authorization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update authorization'
    });
  }
}
