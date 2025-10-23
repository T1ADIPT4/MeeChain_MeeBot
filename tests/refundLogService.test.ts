/**
 * Tests for Refund Log Service
 */

import {
  createFlag,
  confirmFlag,
  getFlag,
  getAllFlags,
  getFlagsByStatus,
  getFlagsByFlagger,
  exportToCSV,
  clearAllFlags
} from '../src/services/refundLogService';
import { clearAllContributors } from '../src/services/contributorReputationService';

describe('Refund Log Service', () => {
  beforeEach(() => {
    clearAllFlags();
    clearAllContributors();
  });

  describe('createFlag', () => {
    it('should create a new refund flag', () => {
      const flag = createFlag(
        'ref_001',
        '0xRequester',
        '0xTransaction123',
        'Replay failed',
        '0xFlagger',
        true
      );

      expect(flag.refundId).toBe('ref_001');
      expect(flag.requester).toBe('0xRequester');
      expect(flag.transaction).toBe('0xTransaction123');
      expect(flag.reason).toBe('Replay failed');
      expect(flag.status).toBe('pending');
      expect(flag.flaggedBy).toBe('0xFlagger');
      expect(flag.signatureVerified).toBe(true);
    });

    it('should set default signature verified to false', () => {
      const flag = createFlag(
        'ref_002',
        '0xRequester',
        '0xTransaction123',
        'Invalid signature',
        '0xFlagger'
      );

      expect(flag.signatureVerified).toBe(false);
    });
  });

  describe('confirmFlag', () => {
    it('should approve a pending flag', () => {
      createFlag(
        'ref_001',
        '0xRequester',
        '0xTransaction123',
        'Replay failed',
        '0xFlagger',
        true
      );

      const result = confirmFlag('ref_001', true, '0xDAOReviewer', 'Valid flag confirmed');

      expect(result).not.toBeNull();
      expect(result?.status).toBe('approved');
      expect(result?.confirmedBy).toBe('0xDAOReviewer');
      expect(result?.notes).toBe('Valid flag confirmed');
      expect(result?.confirmedAt).toBeDefined();
    });

    it('should reject a pending flag', () => {
      createFlag(
        'ref_001',
        '0xRequester',
        '0xTransaction123',
        'Invalid reason',
        '0xFlagger'
      );

      const result = confirmFlag('ref_001', false, '0xDAOReviewer', 'Not a valid flag');

      expect(result).not.toBeNull();
      expect(result?.status).toBe('rejected');
      expect(result?.confirmedBy).toBe('0xDAOReviewer');
      expect(result?.notes).toBe('Not a valid flag');
    });

    it('should return null for non-existent flag', () => {
      const result = confirmFlag('nonexistent', true, '0xDAOReviewer');
      expect(result).toBeNull();
    });
  });

  describe('getFlag', () => {
    it('should return flag by ID', () => {
      createFlag('ref_001', '0xRequester', '0xTx123', 'Reason', '0xFlagger');
      
      const result = getFlag('ref_001');
      expect(result).not.toBeNull();
      expect(result?.refundId).toBe('ref_001');
    });

    it('should return null for non-existent flag', () => {
      const result = getFlag('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getAllFlags', () => {
    it('should return empty array when no flags', () => {
      const result = getAllFlags();
      expect(result).toEqual([]);
    });

    it('should return all flags', () => {
      createFlag('ref_001', '0xReq1', '0xTx1', 'Reason1', '0xFlagger1');
      createFlag('ref_002', '0xReq2', '0xTx2', 'Reason2', '0xFlagger2');
      createFlag('ref_003', '0xReq3', '0xTx3', 'Reason3', '0xFlagger3');

      const result = getAllFlags();
      expect(result.length).toBe(3);
    });
  });

  describe('getFlagsByStatus', () => {
    it('should filter flags by status', () => {
      createFlag('ref_001', '0xReq1', '0xTx1', 'Reason1', '0xFlagger1');
      createFlag('ref_002', '0xReq2', '0xTx2', 'Reason2', '0xFlagger2');
      confirmFlag('ref_001', true, '0xDAO');

      const pending = getFlagsByStatus('pending');
      const approved = getFlagsByStatus('approved');

      expect(pending.length).toBe(1);
      expect(approved.length).toBe(1);
      expect(pending[0].refundId).toBe('ref_002');
      expect(approved[0].refundId).toBe('ref_001');
    });
  });

  describe('getFlagsByFlagger', () => {
    it('should filter flags by flagger address', () => {
      createFlag('ref_001', '0xReq1', '0xTx1', 'Reason1', '0xFlagger1');
      createFlag('ref_002', '0xReq2', '0xTx2', 'Reason2', '0xFlagger1');
      createFlag('ref_003', '0xReq3', '0xTx3', 'Reason3', '0xFlagger2');

      const flagger1Flags = getFlagsByFlagger('0xFlagger1');
      const flagger2Flags = getFlagsByFlagger('0xFlagger2');

      expect(flagger1Flags.length).toBe(2);
      expect(flagger2Flags.length).toBe(1);
    });
  });

  describe('exportToCSV', () => {
    it('should export flags to CSV format', () => {
      createFlag('ref_001', '0xRequester', '0xTransaction123', 'Test reason', '0xFlagger', true);
      confirmFlag('ref_001', true, '0xDAO', 'Approved');

      const csv = exportToCSV();

      expect(csv).toContain('Refund ID');
      expect(csv).toContain('ref_001');
      expect(csv).toContain('0xRequester');
      expect(csv).toContain('0xTransaction123');
      expect(csv).toContain('Test reason');
      expect(csv).toContain('approved');
      expect(csv).toContain('Yes'); // signature verified
    });

    it('should handle empty flags list', () => {
      const csv = exportToCSV();
      expect(csv).toContain('Refund ID');
      expect(csv.split('\n').length).toBe(1); // Only header
    });
  });
});
