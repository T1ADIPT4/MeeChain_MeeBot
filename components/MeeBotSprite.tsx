/**
 * MeeBotSprite Component
 * Displays MeeBot sprite based on milestone completion status
 * Supports Thai/English language feedback
 */

import React from 'react'

// Language dictionaries - embedded to avoid import issues
const thDict = {
  M1: "เริ่มต้นระบบสำเร็จแล้ว",
  M2: "สร้าง metadata สำเร็จ",
  M3: "ตรวจสอบ fallback viewer แล้ว",
  M4: "อัปโหลด badge สำเร็จ",
  M5: "MeeBot แสดง sprite แล้ว",
  M6: "ตรวจสอบความถูกต้องของคำตอบ (98%)",
  M7: "บันทึก milestone อัตโนมัติสำเร็จ",
  M8: "Mint NFT badge สำเร็จ",
  M9: "Deploy และเชื่อมกับ dashboard สำเร็จ",
  fallback: "ยังไม่มี milestone ที่บันทึก กรุณารันคำสั่งสร้าง metadata ก่อนครับ"
}

const enDict = {
  M1: "System initialization complete",
  M2: "Metadata created successfully",
  M3: "Fallback viewer verified",
  M4: "Badge uploaded successfully",
  M5: "MeeBot sprite displayed",
  M6: "Answer verification complete (98% accuracy)",
  M7: "Milestone auto-save successful",
  M8: "NFT badge minted successfully",
  M9: "Deployed and connected to dashboard",
  fallback: "No milestone found. Please run the metadata generator first."
}

interface MeeBotSpriteProps {
  milestoneId: string // e.g., 'M1', 'M2', etc.
  status: 'celebrate' | 'idle' | 'loading' | 'error'
  message?: string
  language?: 'th' | 'en'
}

const spriteEmojis = {
  celebrate: '🟢',
  idle: '🤖',
  loading: '🟣',
  error: '🔴'
}

const milestoneSprites = {
  M1: '🟢', // Green - Setup complete
  M2: '🟣', // Purple - Metadata ready
  M3: '🔵', // Blue - Fallback validated
  M4: '🟠', // Orange - Badge uploaded
  M5: '🟡', // Yellow - MeeBot sprite displayed
  M6: '🟢', // Green - Answer verification
  M7: '🟣', // Purple - Auto milestone logging
  M8: '🔵', // Blue - NFT minted
  M9: '🟠'  // Orange - Deployed to dashboard
}

export function MeeBotSprite({
  milestoneId,
  status,
  message,
  language = 'th'
}: MeeBotSpriteProps) {
  const dict = language === 'th' ? thDict : enDict
  const sprite = milestoneSprites[milestoneId as keyof typeof milestoneSprites] || spriteEmojis[status]
  const feedbackMessage = message || dict[milestoneId as keyof typeof dict] || dict.fallback

  return (
    <div className="meebot-sprite">
      <div className="sprite-container">
        <div className={`sprite ${status}`}>
          <span className="sprite-emoji">{sprite}</span>
        </div>
        <div className="sprite-message">
          <p>{feedbackMessage}</p>
        </div>
      </div>
      
      <style jsx>{`
        .meebot-sprite {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: ${status === 'celebrate' ? '#f0fdf4' : 
                       status === 'error' ? '#fef2f2' : 
                       status === 'loading' ? '#faf5ff' : '#f9fafb'};
          border-radius: 12px;
          border: 2px solid ${status === 'celebrate' ? '#86efac' : 
                             status === 'error' ? '#fca5a5' : 
                             status === 'loading' ? '#d8b4fe' : '#e5e7eb'};
          transition: all 0.3s ease;
        }

        .meebot-sprite:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .sprite-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sprite {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sprite.celebrate {
          animation: bounce 0.6s ease infinite;
        }

        .sprite.loading {
          animation: pulse 1.5s ease infinite;
        }

        .sprite-emoji {
          font-size: 28px;
          line-height: 1;
        }

        .sprite-message {
          flex: 1;
        }

        .sprite-message p {
          margin: 0;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default MeeBotSprite
