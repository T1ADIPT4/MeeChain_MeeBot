import React, { useState } from 'react';
import CoinStatus from './CoinStatus';
import { UserRole } from '../src/types/transaction';
import './CoinStatusDemo.css';

export default function CoinStatusDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('User');
  const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  const roles: UserRole[] = ['User', 'Supplier', 'RecoveryAgent', 'Auditor'];

  return (
    <div className="coin-status-demo">
      <div className="demo-header">
        <h1>🪙 MeeBot Replay & Supply Flow Demo</h1>
        <p>ทดลองใช้งานระบบ Replay & Supply แบบปลอดภัย</p>
      </div>

      <div className="role-selector">
        <h3>เลือก Role เพื่อทดสอบ:</h3>
        <div className="role-buttons">
          {roles.map((role) => (
            <button
              key={role}
              className={`role-btn ${selectedRole === role ? 'active' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {role === 'User' && '👤'}
              {role === 'Supplier' && '🚀'}
              {role === 'RecoveryAgent' && '🛡️'}
              {role === 'Auditor' && '📊'}
              {' '}{role}
            </button>
          ))}
        </div>
      </div>

      <div className="role-description">
        {selectedRole === 'User' && (
          <div className="description-card">
            <h4>👤 User</h4>
            <p>ผู้ใช้ทั่วไป - สามารถดูสถานะธุรกรรมเท่านั้น ไม่มีสิทธิ์ trigger การดำเนินการใดๆ</p>
          </div>
        )}
        {selectedRole === 'Supplier' && (
          <div className="description-card">
            <h4>🚀 Supplier</h4>
            <p>ผู้ดูแลซัพพลาย - สามารถกดปุ่ม "ซัพพลายเหรียญ" เมื่อ replay สำเร็จแล้ว</p>
          </div>
        )}
        {selectedRole === 'RecoveryAgent' && (
          <div className="description-card">
            <h4>🛡️ RecoveryAgent</h4>
            <p>เจ้าหน้าที่กู้คืน - สามารถกดปุ่ม "ดึงเหรียญกลับ" เมื่อ replay ล้มเหลว</p>
          </div>
        )}
        {selectedRole === 'Auditor' && (
          <div className="description-card">
            <h4>📊 Auditor</h4>
            <p>ผู้ตรวจสอบ - สามารถดู logs และ timestamp ทุกขั้นตอน แต่ไม่สามารถ trigger การดำเนินการ</p>
          </div>
        )}
      </div>

      <CoinStatus txHash={mockTxHash} userRole={selectedRole} />

      <div className="demo-info">
        <h3>📖 วิธีใช้งาน:</h3>
        <ol>
          <li>เลือก Role ที่ต้องการทดสอบด้านบน</li>
          <li>ดูว่าแต่ละ Role มีปุ่มและสิทธิ์อะไรบ้าง</li>
          <li>กดปุ่ม "🔄 Replay Transaction" เพื่อเริ่มกระบวนการ (สำหรับ Supplier/RecoveryAgent)</li>
          <li>เมื่อ replay สำเร็จ จะมีปุ่ม "🚀 ซัพพลายเหรียญ" ให้กด (สำหรับ Supplier)</li>
          <li>สังเกต MeeBot จะแสดงข้อความตามสถานะของธุรกรรม</li>
        </ol>
      </div>
    </div>
  );
}
