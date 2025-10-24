import React, { useState } from 'react';
import { ethers } from 'ethers';
import T2P_ABI from '../abis/T2P.json';
import MEE_ABI from '../abis/MeeChainToken.json';
import { T2P_ADDRESS, MEE_ADDRESS, EXCHANGE_RATE } from '../config/contracts';

export const SwapT2PtoMEE: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatus('❌ กรุณาใส่จำนวนที่ถูกต้องครับ');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('🔄 กำลังเชื่อมต่อกระเป๋าเงิน...');

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setStatus('❌ ยังไม่ได้เชื่อมต่อกระเป๋าเงินเลยครับ ลองใหม่อีกครั้งนะครับ 🙏');
        setIsLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const t2pContract = new ethers.Contract(T2P_ADDRESS, T2P_ABI, signer);
      const meeContract = new ethers.Contract(MEE_ADDRESS, MEE_ABI, signer);

      const t2pAmount = ethers.parseUnits(amount, 18);
      const meeAmount = t2pAmount / EXCHANGE_RATE;

      setStatus('🔄 กำลังตรวจสอบยอด T2P...');

      // Check T2P balance
      const t2pBalance = await t2pContract.balanceOf(userAddress);
      if (t2pBalance < t2pAmount) {
        setStatus('❌ ยอด T2P ไม่เพียงพอครับ');
        setIsLoading(false);
        return;
      }

      setStatus('🔄 กำลังขออนุมัติการโอน T2P...');

      // Approve T2P transfer
      const approveTx = await t2pContract.approve(MEE_ADDRESS, t2pAmount);
      await approveTx.wait();

      setStatus('🔄 กำลังโอน T2P และรับ MEE...');

      // Transfer T2P (this would need a swap contract in production)
      // For now, this is a simplified version
      const transferTx = await t2pContract.transfer(MEE_ADDRESS, t2pAmount);
      await transferTx.wait();

      // Mint MEE (owner only - in production this would be handled by a swap contract)
      try {
        const mintTx = await meeContract.mint(userAddress, meeAmount);
        await mintTx.wait();
        setStatus('✅ แลกสำเร็จแล้วครับ! คุณได้รับ ' + ethers.formatUnits(meeAmount, 18) + ' MEE');
      } catch (mintError) {
        setStatus('⚠️ โอน T2P สำเร็จแล้ว แต่ต้องรอแอดมินแจก MEE ให้นะครับ');
      }

      setAmount('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 4001) {
        setStatus('❌ คุณปฏิเสธการทำรายการครับ');
      } else {
        setStatus('❌ เกิดข้อผิดพลาดในการแลกครับ');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMEE = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    try {
      const t2pAmount = ethers.parseUnits(amount, 18);
      const meeAmount = t2pAmount / EXCHANGE_RATE;
      return ethers.formatUnits(meeAmount, 18);
    } catch {
      return '0';
    }
  };

  return (
    <div className="swap-panel" style={{
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '20px auto'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        🔄 แลก T2P → MEE
      </h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', textAlign: 'center' }}>
        อัตราแลกเปลี่ยน: 10 T2P = 1 MEE
      </p>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
          จำนวน T2P ที่ต้องการแลก
        </label>
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        />
      </div>

      {amount && parseFloat(amount) > 0 && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#e3f2fd',
          borderRadius: '6px'
        }}>
          <p style={{ fontSize: '14px', color: '#333' }}>
            คุณจะได้รับ: <span style={{ fontWeight: 'bold', color: '#2196f3' }}>{calculateMEE()} MEE</span>
          </p>
        </div>
      )}

      <button
        onClick={handleSwap}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '6px',
          fontWeight: '600',
          color: 'white',
          border: 'none',
          cursor: (isLoading || !amount || parseFloat(amount) <= 0) ? 'not-allowed' : 'pointer',
          backgroundColor: (isLoading || !amount || parseFloat(amount) <= 0) ? '#999' : '#2196f3',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'กำลังดำเนินการ...' : 'แลกเลยครับ'}
      </button>

      {status && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: status.includes('✅') ? '#e8f5e9' :
                          status.includes('❌') ? '#ffebee' :
                          status.includes('⚠️') ? '#fff3e0' : '#e3f2fd',
          color: status.includes('✅') ? '#2e7d32' :
                 status.includes('❌') ? '#c62828' :
                 status.includes('⚠️') ? '#ef6c00' : '#1976d2'
        }}>
          <p style={{ fontSize: '14px', margin: 0 }}>{status}</p>
        </div>
      )}
    </div>
  );
};

export default SwapT2PtoMEE;
