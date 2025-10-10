import React from 'react';

/**
 * MilestoneChart Component
 * Displays milestone progress with a visual progress bar
 */
export default function MilestoneChart({ milestones, t }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="milestone-chart empty">
        <p>{t('no_milestones', 'No milestones found')}</p>
      </div>
    );
  }

  const totalMilestones = 9; // M1-M9
  const completedCount = milestones.length;
  const progressPercentage = (completedCount / totalMilestones) * 100;

  return (
    <div className="milestone-chart">
      <h3>🎯 {t('milestone_progress', 'Milestone Progress')}</h3>
      
      <div className="progress-header">
        <span className="progress-text">
          {completedCount} / {totalMilestones} {t('milestones_completed', 'Milestones Completed')}
        </span>
        <span className="progress-percentage">{progressPercentage.toFixed(0)}%</span>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-label">{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>

      <div className="milestone-list">
        {milestones.map((milestone, index) => (
          <div key={index} className="milestone-item">
            <span className="milestone-icon">✅</span>
            <span className="milestone-text">{milestone}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .milestone-chart {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .milestone-chart h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 20px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #666;
        }

        .progress-percentage {
          font-weight: 700;
          color: #667eea;
        }

        .progress-bar-container {
          height: 32px;
          background: #f0f0f0;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          transition: width 0.6s ease;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          min-width: 60px;
        }

        .progress-label {
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .milestone-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 300px;
          overflow-y: auto;
        }

        .milestone-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 14px;
        }

        .milestone-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .milestone-text {
          color: #333;
          line-height: 1.4;
        }

        .empty {
          text-align: center;
          padding: 40px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
