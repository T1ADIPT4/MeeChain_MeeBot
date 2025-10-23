/**
 * Mock API Layer for Development
 * Simulates backend API endpoints for the governance loop
 */

import * as contributorReputationService from '../services/contributorReputationService';
import * as refundLogService from '../services/refundLogService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * POST /api/logs/flag - Create a new refund flag
 */
export async function createFlag(body: {
  refundId: string;
  requester: string;
  transaction: string;
  reason: string;
  flaggedBy: string;
  signatureVerified?: boolean;
}): Promise<ApiResponse> {
  try {
    const flag = refundLogService.createFlag(
      body.refundId,
      body.requester,
      body.transaction,
      body.reason,
      body.flaggedBy,
      body.signatureVerified || false
    );
    
    return {
      success: true,
      data: flag
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * POST /api/logs/flag/confirm - Confirm (approve/reject) a refund flag
 */
export async function confirmFlag(body: {
  refundId: string;
  approved: boolean;
  confirmedBy: string;
  notes?: string;
}): Promise<ApiResponse> {
  try {
    const flag = refundLogService.confirmFlag(
      body.refundId,
      body.approved,
      body.confirmedBy,
      body.notes
    );
    
    if (!flag) {
      return {
        success: false,
        error: 'Flag not found'
      };
    }
    
    return {
      success: true,
      data: flag
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET /api/logs - Get all refund flags
 */
export async function getAllFlags(filters?: {
  status?: string;
  flaggedBy?: string;
}): Promise<ApiResponse> {
  try {
    let flags = refundLogService.getAllFlags();
    
    if (filters?.status) {
      flags = refundLogService.getFlagsByStatus(filters.status as any);
    }
    
    if (filters?.flaggedBy) {
      flags = refundLogService.getFlagsByFlagger(filters.flaggedBy);
    }
    
    return {
      success: true,
      data: flags
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET /api/logs/:refundId - Get a specific refund flag
 */
export async function getFlag(refundId: string): Promise<ApiResponse> {
  try {
    const flag = refundLogService.getFlag(refundId);
    
    if (!flag) {
      return {
        success: false,
        error: 'Flag not found'
      };
    }
    
    return {
      success: true,
      data: flag
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET /api/logs/export-csv - Export flags to CSV
 */
export async function exportCSV(): Promise<string> {
  return refundLogService.exportToCSV();
}

/**
 * GET /api/contributors - Get all contributors
 */
export async function getAllContributors(): Promise<ApiResponse> {
  try {
    const contributors = contributorReputationService.getAllContributors();
    
    return {
      success: true,
      data: contributors
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET /api/contributors/:address - Get specific contributor
 */
export async function getContributor(address: string): Promise<ApiResponse> {
  try {
    const contributor = contributorReputationService.getContributor(address);
    
    if (!contributor) {
      return {
        success: false,
        error: 'Contributor not found'
      };
    }
    
    return {
      success: true,
      data: contributor
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET /api/badges - Get all badge definitions
 */
export async function getAllBadges(): Promise<ApiResponse> {
  try {
    const badges = contributorReputationService.getAllBadges();
    
    return {
      success: true,
      data: badges
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
