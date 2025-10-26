/**
 * Tests for Auditor Dashboard API
 */

import { db } from '../server/database';
import { RefundLog, RefundFlag } from '../server/types';

describe('Auditor Dashboard Database', () => {
  describe('Refund Logs', () => {
    it('should return all refund logs', () => {
      const logs = db.refundLogs.getAll();
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should return a specific log by ID', () => {
      const log = db.refundLogs.getById('ref_abc123');
      expect(log).toBeDefined();
      expect(log?.refundId).toBe('ref_abc123');
      expect(log?.userAddress).toBeTruthy();
      expect(log?.status).toBeTruthy();
    });

    it('should return undefined for non-existent log ID', () => {
      const log = db.refundLogs.getById('non_existent_id');
      expect(log).toBeUndefined();
    });

    it('should search logs by address', () => {
      const logs = db.refundLogs.search('0x883A');
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should search logs by refund ID', () => {
      const logs = db.refundLogs.search('ref_abc');
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should search logs by transaction hash', () => {
      const logs = db.refundLogs.search('0xabc123');
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
    });

    it('should filter logs by date range', () => {
      const startDate = '2025-10-18T00:00:00.000Z';
      const endDate = '2025-10-19T23:59:59.000Z';
      const logs = db.refundLogs.filterByDateRange(startDate, endDate);
      expect(logs).toBeDefined();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should add a new refund log', () => {
      const newLog: RefundLog = {
        refundId: 'test_ref_001',
        userAddress: '0xTestAddress123',
        txHash: '0xTestHash123',
        amount: '0.01',
        reason: 'Test reason',
        status: 'success',
        verifiedAt: new Date().toISOString(),
        signatureValid: true,
        executedBy: 'TestBot',
        notes: 'Test notes',
        createdAt: new Date().toISOString(),
      };

      const addedLog = db.refundLogs.add(newLog);
      expect(addedLog).toEqual(newLog);

      const retrievedLog = db.refundLogs.getById('test_ref_001');
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog?.refundId).toBe('test_ref_001');
    });
  });

  describe('Refund Flags', () => {
    it('should return all flags', () => {
      const flags = db.refundFlags.getAll();
      expect(flags).toBeDefined();
      expect(Array.isArray(flags)).toBe(true);
    });

    it('should add a new flag', () => {
      const newFlag: RefundFlag = {
        id: 'flag_test_001',
        refundId: 'ref_abc123',
        reason: 'Suspicious transaction',
        flaggedBy: '0xFlaggedByAddress',
        flaggedAt: new Date().toISOString(),
      };

      const addedFlag = db.refundFlags.add(newFlag);
      expect(addedFlag).toEqual(newFlag);

      const flags = db.refundFlags.getByRefundId('ref_abc123');
      expect(flags).toBeDefined();
      expect(Array.isArray(flags)).toBe(true);
      expect(flags.length).toBeGreaterThan(0);
    });

    it('should get flags by refund ID', () => {
      const flags = db.refundFlags.getByRefundId('ref_abc123');
      expect(flags).toBeDefined();
      expect(Array.isArray(flags)).toBe(true);
    });

    it('should return empty array for refund with no flags', () => {
      const flags = db.refundFlags.getByRefundId('non_existent_refund');
      expect(flags).toBeDefined();
      expect(Array.isArray(flags)).toBe(true);
      expect(flags.length).toBe(0);
    });
  });

  describe('Data Integrity', () => {
    it('should have valid refund log structure', () => {
      const logs = db.refundLogs.getAll();
      const log = logs[0];

      expect(log).toHaveProperty('refundId');
      expect(log).toHaveProperty('userAddress');
      expect(log).toHaveProperty('status');
      expect(log).toHaveProperty('amount');
      expect(log).toHaveProperty('reason');
      expect(log).toHaveProperty('verifiedAt');
      expect(log).toHaveProperty('signatureValid');
      expect(log).toHaveProperty('executedBy');
      expect(log).toHaveProperty('notes');
      expect(log).toHaveProperty('createdAt');
    });

    it('should have valid flag structure', () => {
      const newFlag: RefundFlag = {
        id: 'flag_test_002',
        refundId: 'ref_xyz789',
        reason: 'Test flag',
        flaggedBy: '0xTestAddress',
        flaggedAt: new Date().toISOString(),
      };

      db.refundFlags.add(newFlag);
      const flags = db.refundFlags.getByRefundId('ref_xyz789');
      const flag = flags.find(f => f.id === 'flag_test_002');

      expect(flag).toHaveProperty('id');
      expect(flag).toHaveProperty('refundId');
      expect(flag).toHaveProperty('reason');
      expect(flag).toHaveProperty('flaggedBy');
      expect(flag).toHaveProperty('flaggedAt');
    });
  });
});
