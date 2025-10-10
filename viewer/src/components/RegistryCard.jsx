import React from 'react';

/**
 * RegistryCard Component
 * Displays deployment registry information (URL, Version, Hash, Status)
 */
export default function RegistryCard({ registry, t }) {
  if (!registry) {
    return (
      <div className="registry-card loading">
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="registry-card">
      <h3>🔍 {t('registry_status', 'Registry Status')}</h3>
      <div className="registry-details">
        <div className="detail-row">
          <span className="label">{t('registry_name', 'Name')}:</span>
          <span className="value">{registry.name || 'MeeChain Registry'}</span>
        </div>
        <div className="detail-row">
          <span className="label">{t('registry_url', 'URL')}:</span>
          <span className="value url">{registry.url || 'https://demo.registry.io'}</span>
        </div>
        <div className="detail-row">
          <span className="label">{t('registry_version', 'Version')}:</span>
          <span className="value">{registry.version || '0.0.0'}</span>
        </div>
        <div className="detail-row">
          <span className="label">{t('registry_hash', 'Hash')}:</span>
          <span className="value hash">{registry.hash || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="label">{t('status', 'Status')}:</span>
          <span className={`status-badge ${registry.status || 'inactive'}`}>
            {registry.status === 'active' ? '🟢' : '🔴'} {registry.status || 'inactive'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .registry-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .registry-card h3 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 20px;
        }

        .registry-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
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

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
          text-align: right;
          max-width: 60%;
          overflow-wrap: break-word;
        }

        .value.url {
          color: #667eea;
          text-decoration: none;
        }

        .value.hash {
          font-family: monospace;
          font-size: 12px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #999;
        }
      `}</style>
    </div>
  );
}
