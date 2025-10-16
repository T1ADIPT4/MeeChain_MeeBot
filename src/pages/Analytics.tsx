import React from 'react';
import './Analytics.css';

export default function Analytics() {
  return (
    <div>
      <h2>Analytics</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <p>567</p>
        </div>
        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p>10,987</p>
        </div>
        <div className="metric-card">
          <h3>Contracts Deployed</h3>
          <p>42</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>User Growth Over Time</h3>
        <div className="chart-placeholder">[Chart Placeholder]</div>
      </div>

      <div className="chart-container">
        <h3>Transaction Volume</h3>
        <div className="chart-placeholder">[Chart Placeholder]</div>
      </div>

      <div className="contract-addresses">
          <h3>Contract Addresses</h3>
          <ul>
              <li><strong>Registry Contract:</strong> 0xabc...def</li>
              <li><strong>Badge Contract:</strong> 0x123...456</li>
          </ul>
      </div>
    </div>
  );
}
