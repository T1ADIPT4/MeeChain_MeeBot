import { getUserPermissions, UserRole } from '../viewer/src/types/transaction';

describe('Transaction Types and Permissions', () => {
  describe('getUserPermissions', () => {
    it('should give User role no permissions', () => {
      const permissions = getUserPermissions('User');
      expect(permissions.role).toBe('User');
      expect(permissions.canSupply).toBe(false);
      expect(permissions.canRefund).toBe(false);
      expect(permissions.canViewLogs).toBe(false);
      expect(permissions.canTriggerActions).toBe(false);
    });

    it('should give Supplier role supply and trigger permissions', () => {
      const permissions = getUserPermissions('Supplier');
      expect(permissions.role).toBe('Supplier');
      expect(permissions.canSupply).toBe(true);
      expect(permissions.canRefund).toBe(false);
      expect(permissions.canViewLogs).toBe(true);
      expect(permissions.canTriggerActions).toBe(true);
    });

    it('should give RecoveryAgent role refund permissions', () => {
      const permissions = getUserPermissions('RecoveryAgent');
      expect(permissions.role).toBe('RecoveryAgent');
      expect(permissions.canSupply).toBe(false);
      expect(permissions.canRefund).toBe(true);
      expect(permissions.canViewLogs).toBe(true);
      expect(permissions.canTriggerActions).toBe(true);
    });

    it('should give Auditor role view-only permissions', () => {
      const permissions = getUserPermissions('Auditor');
      expect(permissions.role).toBe('Auditor');
      expect(permissions.canSupply).toBe(false);
      expect(permissions.canRefund).toBe(false);
      expect(permissions.canViewLogs).toBe(true);
      expect(permissions.canTriggerActions).toBe(false);
    });
  });
});
