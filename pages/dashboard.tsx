/**
 * Dashboard Page
 * Main dashboard showing badges and fallback logs integrated with deploy-registry
 */

import React from 'react'
import { BadgeList } from '../components/BadgeList'
import { FallbackLog } from '../components/FallbackLog'

export function Dashboard() {
  // In production, this would come from user context/auth
  const currentUserId = 'user-001'

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <div className="dashboard-content">
        <section className="badges-section">
          <BadgeList userId={currentUserId} />
        </section>
        
        <section className="fallback-section">
          <FallbackLog />
        </section>
      </div>
      
      <style>{`
        .dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard h1 {
          margin-bottom: 30px;
        }
        
        .dashboard-content {
          display: grid;
          gap: 30px;
        }
        
        .badges-section, .fallback-section {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
        
        .badge-list ul, .fallback-log ul {
          list-style: none;
          padding: 0;
        }
        
        .badge-item, .log-item {
          background: white;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .badge-info, .log-info {
          margin-bottom: 8px;
        }
        
        .badge-provenance, .log-details {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 0.9em;
          color: #666;
        }
        
        .chain-label {
          color: #2563eb;
          font-weight: 500;
        }
        
        .contract-label {
          color: #059669;
          font-family: monospace;
        }
        
        .tx-label {
          color: #7c3aed;
          font-family: monospace;
        }
        
        .timestamp-label {
          color: #64748b;
        }
        
        .fallback-status {
          color: #dc2626;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
