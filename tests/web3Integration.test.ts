/**
 * Web3.js Integration Test Suite
 * Tests the Web3 utilities and contract integration functions
 */

import { describe, it, expect } from '@jest/globals';
import { toWei, fromWei } from '../utils/web3Config';

describe('Web3 Configuration Utilities', () => {
  describe('toWei', () => {
    it('should convert BNB to Wei correctly', () => {
      expect(toWei('1')).toBe('1000000000000000000');
      expect(toWei('1.5')).toBe('1500000000000000000');
      expect(toWei('0.5')).toBe('500000000000000000');
      expect(toWei(2)).toBe('2000000000000000000');
    });

    it('should handle small amounts', () => {
      expect(toWei('0.1')).toBe('100000000000000000');
      expect(toWei('0.01')).toBe('10000000000000000');
      expect(toWei('0.001')).toBe('1000000000000000');
    });

    it('should handle large amounts', () => {
      expect(toWei('1000')).toBe('1000000000000000000000');
      expect(toWei('1000000')).toBe('1000000000000000000000000');
    });
  });

  describe('fromWei', () => {
    it('should convert Wei to BNB correctly', () => {
      expect(fromWei('1000000000000000000')).toBe('1');
      expect(fromWei('1500000000000000000')).toBe('1.5');
      expect(fromWei('500000000000000000')).toBe('0.5');
    });

    it('should handle small amounts', () => {
      expect(fromWei('100000000000000000')).toBe('0.1');
      expect(fromWei('10000000000000000')).toBe('0.01');
      expect(fromWei('1000000000000000')).toBe('0.001');
    });

    it('should handle large amounts', () => {
      expect(fromWei('1000000000000000000000')).toBe('1000');
      expect(fromWei('1000000000000000000000000')).toBe('1000000');
    });

    it('should handle zero', () => {
      expect(fromWei('0')).toBe('0');
      expect(toWei('0')).toBe('0');
    });
  });

  describe('Round-trip conversion', () => {
    it('should preserve values through round-trip conversion', () => {
      const amounts = ['0.1', '1', '1.5', '100', '1000'];
      
      amounts.forEach(amount => {
        const wei = toWei(amount);
        const bnb = fromWei(wei);
        expect(bnb).toBe(amount);
      });
    });
  });
});

describe('MeeChainSupply Contract Integration', () => {
  describe('Contract Address', () => {
    it('should have a valid contract address format', () => {
      const { MEECHAIN_SUPPLY_ADDRESS } = require('../utils/meeChainSupplyContract');
      
      // Check if it starts with 0x
      expect(MEECHAIN_SUPPLY_ADDRESS).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('Contract ABI', () => {
    it('should contain all required functions', () => {
      const { MEECHAIN_SUPPLY_ABI } = require('../utils/meeChainSupplyContract');
      
      const functionNames = MEECHAIN_SUPPLY_ABI
        .filter((item: any) => item.type === 'function')
        .map((item: any) => item.name);
      
      expect(functionNames).toContain('confirmReplay');
      expect(functionNames).toContain('triggerSupply');
      expect(functionNames).toContain('refund');
      expect(functionNames).toContain('replayConfirmed');
      expect(functionNames).toContain('pendingSupply');
      expect(functionNames).toContain('meeBot');
    });

    it('should contain all required events', () => {
      const { MEECHAIN_SUPPLY_ABI } = require('../utils/meeChainSupplyContract');
      
      const eventNames = MEECHAIN_SUPPLY_ABI
        .filter((item: any) => item.type === 'event')
        .map((item: any) => item.name);
      
      expect(eventNames).toContain('ReplayConfirmed');
      expect(eventNames).toContain('SupplyTriggered');
      expect(eventNames).toContain('RefundIssued');
    });

    it('should have correct function signatures', () => {
      const { MEECHAIN_SUPPLY_ABI } = require('../utils/meeChainSupplyContract');
      
      // Check confirmReplay function
      const confirmReplay = MEECHAIN_SUPPLY_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'confirmReplay'
      );
      
      expect(confirmReplay).toBeDefined();
      expect(confirmReplay.inputs).toHaveLength(2);
      expect(confirmReplay.inputs[0].type).toBe('address');
      expect(confirmReplay.inputs[1].type).toBe('uint256');
      expect(confirmReplay.stateMutability).toBe('nonpayable');
      
      // Check triggerSupply function
      const triggerSupply = MEECHAIN_SUPPLY_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'triggerSupply'
      );
      
      expect(triggerSupply).toBeDefined();
      expect(triggerSupply.inputs).toHaveLength(1);
      expect(triggerSupply.inputs[0].type).toBe('address');
      
      // Check refund function
      const refund = MEECHAIN_SUPPLY_ABI.find(
        (item: any) => item.type === 'function' && item.name === 'refund'
      );
      
      expect(refund).toBeDefined();
      expect(refund.inputs).toHaveLength(1);
      expect(refund.inputs[0].type).toBe('address');
    });
  });

  describe('Function exports', () => {
    it('should export all required functions', () => {
      const contractModule = require('../utils/meeChainSupplyContract');
      
      expect(contractModule.initMeeChainSupplyContract).toBeDefined();
      expect(contractModule.confirmReplay).toBeDefined();
      expect(contractModule.triggerSupply).toBeDefined();
      expect(contractModule.refund).toBeDefined();
      expect(contractModule.isReplayConfirmed).toBeDefined();
      expect(contractModule.getPendingSupply).toBeDefined();
      expect(contractModule.getMeeBotAddress).toBeDefined();
      expect(contractModule.listenToReplayConfirmed).toBeDefined();
      expect(contractModule.listenToSupplyTriggered).toBeDefined();
      expect(contractModule.listenToRefundIssued).toBeDefined();
    });

    it('should export all required functions from web3Config', () => {
      const web3Module = require('../utils/web3Config');
      
      expect(web3Module.initWeb3).toBeDefined();
      expect(web3Module.initWeb3WithProvider).toBeDefined();
      expect(web3Module.toWei).toBeDefined();
      expect(web3Module.fromWei).toBeDefined();
      expect(web3Module.getTransactionReceipt).toBeDefined();
      expect(web3Module.waitForTransaction).toBeDefined();
    });
  });
});

describe('Web3 Integration Documentation', () => {
  it('should have integration guide documentation', () => {
    const fs = require('fs');
    const path = require('path');
    
    const guidePath = path.join(__dirname, '..', 'WEB3_INTEGRATION_GUIDE.md');
    expect(fs.existsSync(guidePath)).toBe(true);
  });

  it('should have demo file', () => {
    const fs = require('fs');
    const path = require('path');
    
    const demoPath = path.join(__dirname, '..', 'examples', 'web3-integration-demo.ts');
    expect(fs.existsSync(demoPath)).toBe(true);
  });
});
