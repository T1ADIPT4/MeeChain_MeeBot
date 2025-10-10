import React from 'react';

/**
 * BadgeStatus Component
 * Displays badge information with fallback-aware asset display
 */
export default function BadgeStatus({ badge, t }) {
  if (!badge) {
    return (
      <div className="badge-status empty">
        <p>{t('no_badge_found', 'No badge found')}</p>
      </div>
    );
  }

  const isFallback = badge.isFallback || false;

  return (
    <div className="badge-status">
      <h3>🟢 {t('badge_status', 'Badge Status')}</h3>
      
      {isFallback && (
        <div className="fallback-warning">
          ⚠️ {t('using_fallback', 'Using Fallback Asset')}
        </div>
      )}

      <div className="badge-image-container">
        {badge.imageUrl ? (
          <img 
            src={badge.imageUrl} 
            alt={badge.name || 'Badge'}
            className="badge-image"
            onError={(e) => {
              e.target.src = '/assets/fallback/badge-placeholder.svg';
            }}
          />
        ) : (
          <div className="badge-placeholder">
            🏆
          </div>
        )}
      </div>

      <div className="badge-details">
        <div className="detail-row">
          <span className="label">{t('quest_id', 'Quest ID')}:</span>
          <span className="value">{badge.questId || 'N/A'}</span>
        </div>
        {badge.badgeId && (
          <div className="detail-row">
            <span className="label">{t('badge_id', 'Badge ID')}:</span>
            <span className="value">{badge.badgeId}</span>
          </div>
        )}
        {badge.name && (
          <div className="detail-row">
            <span className="label">{t('badge_name', 'Name')}:</span>
            <span className="value">{badge.name}</span>
          </div>
        )}
        {badge.description && (
          <div className="detail-row description">
            <span className="label">{t('description', 'Description')}:</span>
            <span className="value">{badge.description}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="label">{t('status', 'Status')}:</span>
          <span className={`status-badge ${badge.status || 'pending'}`}>
            {badge.status === 'minted' ? '✅' : '⏳'} {badge.status || 'pending'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .badge-status {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .badge-status h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 20px;
        }

        .fallback-warning {
          background: #fff3cd;
          border: 2px solid #ffc107;
          color: #856404;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          text-align: center;
          font-weight: 600;
        }

        .badge-image-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }

        .badge-image {
          max-width: 200px;
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .badge-image:hover {
          transform: scale(1.05);
        }

        .badge-placeholder {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .badge-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row.description {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
          text-align: right;
        }

        .detail-row.description .value {
          text-align: left;
          font-size: 14px;
          line-height: 1.5;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
        }

        .status-badge.minted {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
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
