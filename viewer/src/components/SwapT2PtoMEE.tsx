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
    <div className="swap-panel p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">🔄 แลก T2P → MEE</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        อัตราแลกเปลี่ยน: 10 T2P = 1 MEE
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          จำนวน T2P ที่ต้องการแลก
        </label>
        <input
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {amount && parseFloat(amount) > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            คุณจะได้รับ: <span className="font-bold text-blue-600">{calculateMEE()} MEE</span>
          </p>
        </div>
      )}

      <button
        onClick={handleSwap}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
          isLoading || !amount || parseFloat(amount) <= 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'กำลังดำเนินการ...' : 'แลกเลยครับ'}
      </button>

      {status && (
        <div className={`mt-4 p-3 rounded-md ${
          status.includes('✅') ? 'bg-green-50 text-green-700' :
          status.includes('❌') ? 'bg-red-50 text-red-700' :
          status.includes('⚠️') ? 'bg-yellow-50 text-yellow-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          <p className="text-sm">{status}</p>
        </div>
      )}
    </div>
  );
};
