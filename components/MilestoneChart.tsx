/**
 * MilestoneChart Component
 * Interactive milestone progress display with MeeBot sprite feedback
 * Supports Thai/English language switching
 */

import React, { useState, useEffect } from 'react'
import { MeeBotSprite } from './MeeBotSprite'

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

interface Milestone {
  id: string // M1, M2, etc.
  done: boolean
  msg: string
  timestamp?: string
}

interface MilestoneChartProps {
  language?: 'th' | 'en'
  showSprites?: boolean
}

export function MilestoneChart({ language = 'th', showSprites = true }: MilestoneChartProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const dict = language === 'th' ? thDict : enDict

  useEffect(() => {
    loadMilestones()
  }, [])

  const loadMilestones = async () => {
    try {
      // Try to load from milestone.log
      const response = await fetch('/copilot/milestone.log')
      if (response.ok) {
        const text = await response.text()
        const parsedMilestones = parseMilestoneLog(text)
        setMilestones(parsedMilestones)
      } else {
        // Use default milestones if file not found
        setMilestones(getDefaultMilestones())
      }
    } catch (error) {
      console.warn('Failed to load milestones, using defaults:', error)
      setMilestones(getDefaultMilestones())
    } finally {
      setLoading(false)
    }
  }

  const parseMilestoneLog = (logContent: string): Milestone[] => {
    const lines = logContent.split('\n')
    const milestoneMap = new Map<string, Milestone>()

    lines.forEach(line => {
      const milestoneMatch = line.match(/\[(.*?)\]\s+(M\d+):\s+(.+)/)
      if (milestoneMatch) {
        const [, timestamp, id, message] = milestoneMatch
        milestoneMap.set(id, {
          id,
          done: true,
          msg: message.trim(),
          timestamp
        })
      }
      
      // Check for status
      const statusMatch = line.match(/Status:\s+(✅|⏳)/)
      if (statusMatch) {
        const lastMilestone = Array.from(milestoneMap.values()).pop()
        if (lastMilestone) {
          lastMilestone.done = statusMatch[1] === '✅'
        }
      }
    })

    // Fill in missing milestones as incomplete
    const allMilestones: Milestone[] = []
    for (let i = 1; i <= 9; i++) {
      const id = `M${i}`
      if (milestoneMap.has(id)) {
        allMilestones.push(milestoneMap.get(id)!)
      } else {
        allMilestones.push({
          id,
          done: false,
          msg: dict[id as keyof typeof dict] as string || `Milestone ${i}`
        })
      }
    }

    return allMilestones
  }

  const getDefaultMilestones = (): Milestone[] => {
    return Array.from({ length: 9 }, (_, i) => {
      const id = `M${i + 1}`
      return {
        id,
        done: false,
        msg: dict[id as keyof typeof dict] as string || `Milestone ${i + 1}`
      }
    })
  }

  const completedCount = milestones.filter(m => m.done).length
  const totalCount = milestones.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <div className="milestone-chart loading">
        <p>⏳ {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</p>
      </div>
    )
  }

  return (
    <div className="milestone-chart">
      <h2>🎯 {language === 'th' ? 'ความคืบหน้า Milestone' : 'Milestone Progress'}</h2>
      
      <div className="progress-summary">
        <div className="progress-stats">
          <span className="stats-text">
            {completedCount} / {totalCount} {language === 'th' ? 'สำเร็จแล้ว' : 'Completed'}
          </span>
          <span className="stats-percentage">{progressPercentage.toFixed(0)}%</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="milestone-list">
        {milestones.map(milestone => (
          <div key={milestone.id} className={`milestone-item ${milestone.done ? 'done' : 'pending'}`}>
            <div className="milestone-header">
              <span className="milestone-id">{milestone.id}</span>
              <span className="milestone-status">
                {milestone.done ? '✅' : '⏳'}
              </span>
            </div>
            
            {showSprites && (
              <MeeBotSprite
                milestoneId={milestone.id}
                status={milestone.done ? 'celebrate' : 'idle'}
                message={milestone.msg}
                language={language}
              />
            )}
            
            {!showSprites && (
              <div className="milestone-message">
                <p>{milestone.msg}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .milestone-chart {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .milestone-chart h2 {
          margin: 0 0 24px 0;
          color: #1f2937;
          font-size: 24px;
          font-weight: 700;
        }

        .progress-summary {
          margin-bottom: 32px;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stats-text {
          font-size: 16px;
          color: #6b7280;
          font-weight: 500;
        }

        .stats-percentage {
          font-size: 20px;
          font-weight: 700;
          color: #8b5cf6;
        }

        .progress-bar {
          height: 12px;
          background: #f3f4f6;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
          border-radius: 6px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .milestone-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .milestone-item {
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .milestone-item.done {
          background: #f0fdf4;
          border-color: #86efac;
        }

        .milestone-item.pending {
          background: #fafafa;
          border-color: #e5e7eb;
          opacity: 0.7;
        }

        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .milestone-id {
          font-size: 18px;
          font-weight: 700;
          color: #374151;
        }

        .milestone-status {
          font-size: 24px;
        }

        .milestone-message {
          padding: 12px;
          background: white;
          border-radius: 8px;
        }

        .milestone-message p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export default MilestoneChart
