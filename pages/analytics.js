/**
 * Analytics Page
 * Displays fallback usage statistics and badge distribution across chains
 */
import React from 'react';
import { getAvailableNetworks, getNetworkConfig } from '../src/config/registryLoader';
import { getUserBadges, getFallbackLogs } from '../utils/mockData';
/**
 * Calculate analytics data from badges and fallback logs
 */
function calculateAnalytics() {
    // Get all badges from all users (mock implementation for demo)
    const allBadges = [];
    // In a real app, you'd query from database
    // For demo, we'll use getUserBadges with mock users
    const mockUserIds = ['user-001', 'user-002', 'user-003', 'user-004', 'user-005'];
    mockUserIds.forEach(userId => {
        const userBadges = getUserBadges(userId);
        allBadges.push(...userBadges);
    });
    const fallbackLogs = getFallbackLogs();
    const networks = getAvailableNetworks();
    // Badge distribution by chain
    const badgesByChain = {};
    allBadges.forEach((badge) => {
        const chain = badge.chain || 'polygon';
        badgesByChain[chain] = (badgesByChain[chain] || 0) + 1;
    });
    // Fallback usage by chain
    const fallbackByChain = {};
    fallbackLogs.forEach(log => {
        const chain = log.chain || 'ethereum';
        fallbackByChain[chain] = (fallbackByChain[chain] || 0) + 1;
    });
    // Success rates
    const totalMints = allBadges.length;
    const totalFallbacks = fallbackLogs.length;
    const successRate = totalMints > 0 ? ((totalMints - totalFallbacks) / totalMints * 100).toFixed(2) : '100.00';
    const fallbackRate = totalMints > 0 ? (totalFallbacks / totalMints * 100).toFixed(2) : '0.00';
    return {
        badgesByChain,
        fallbackByChain,
        totalMints,
        totalFallbacks,
        successRate,
        fallbackRate,
        networks
    };
}
export function Analytics() {
    const analytics = calculateAnalytics();
    return (React.createElement("div", { className: "analytics" },
        React.createElement("h1", null, "\uD83D\uDCC8 Analytics Dashboard"),
        React.createElement("div", { className: "analytics-content" },
            React.createElement("section", { className: "overview-section" },
                React.createElement("h2", null, "\uD83D\uDCCA Overview"),
                React.createElement("div", { className: "stats-grid" },
                    React.createElement("div", { className: "stat-card" },
                        React.createElement("div", { className: "stat-label" }, "Total Badges Minted"),
                        React.createElement("div", { className: "stat-value" }, analytics.totalMints)),
                    React.createElement("div", { className: "stat-card" },
                        React.createElement("div", { className: "stat-label" }, "Fallback Events"),
                        React.createElement("div", { className: "stat-value" }, analytics.totalFallbacks)),
                    React.createElement("div", { className: "stat-card" },
                        React.createElement("div", { className: "stat-label" }, "Primary Success Rate"),
                        React.createElement("div", { className: "stat-value success" },
                            analytics.successRate,
                            "%")),
                    React.createElement("div", { className: "stat-card" },
                        React.createElement("div", { className: "stat-label" }, "Fallback Usage Rate"),
                        React.createElement("div", { className: "stat-value warning" },
                            analytics.fallbackRate,
                            "%")))),
            React.createElement("section", { className: "distribution-section" },
                React.createElement("h2", null, "\uD83C\uDF96\uFE0F Badge Distribution by Chain"),
                React.createElement("div", { className: "chart-container" }, Object.entries(analytics.badgesByChain).map(([chain, count]) => {
                    const percentage = analytics.totalMints > 0
                        ? (count / analytics.totalMints * 100).toFixed(1)
                        : '0';
                    return (React.createElement("div", { key: chain, className: "chart-bar" },
                        React.createElement("div", { className: "chart-label" },
                            React.createElement("span", { className: "chain-name" }, chain),
                            React.createElement("span", { className: "chain-count" },
                                count,
                                " badges (",
                                percentage,
                                "%)")),
                        React.createElement("div", { className: "chart-bar-container" },
                            React.createElement("div", { className: "chart-bar-fill", style: { width: `${percentage}%` } }))));
                }))),
            React.createElement("section", { className: "fallback-section" },
                React.createElement("h2", null, "\uD83D\uDD01 Fallback Usage by Chain"),
                analytics.totalFallbacks === 0 ? (React.createElement("p", { className: "no-data" }, "No fallback events recorded yet. Great stability! \uD83C\uDF89")) : (React.createElement("div", { className: "chart-container" }, Object.entries(analytics.fallbackByChain).map(([chain, count]) => {
                    const percentage = analytics.totalFallbacks > 0
                        ? (count / analytics.totalFallbacks * 100).toFixed(1)
                        : '0';
                    return (React.createElement("div", { key: chain, className: "chart-bar" },
                        React.createElement("div", { className: "chart-label" },
                            React.createElement("span", { className: "chain-name" }, chain),
                            React.createElement("span", { className: "chain-count" },
                                count,
                                " fallbacks (",
                                percentage,
                                "%)")),
                        React.createElement("div", { className: "chart-bar-container" },
                            React.createElement("div", { className: "chart-bar-fill fallback", style: { width: `${percentage}%` } }))));
                })))),
            React.createElement("section", { className: "network-section" },
                React.createElement("h2", null, "\uD83C\uDF10 Network Registry Status"),
                React.createElement("div", { className: "network-grid" }, analytics.networks.map(network => {
                    const config = getNetworkConfig(network);
                    const badgeCount = analytics.badgesByChain[network] || 0;
                    const fallbackCount = analytics.fallbackByChain[network] || 0;
                    return (React.createElement("div", { key: network, className: "network-card" },
                        React.createElement("h3", null, network),
                        React.createElement("div", { className: "network-details" },
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Chain ID:"),
                                React.createElement("span", { className: "detail-value" }, config.chainId)),
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Badges Minted:"),
                                React.createElement("span", { className: "detail-value" }, badgeCount)),
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Fallback Events:"),
                                React.createElement("span", { className: "detail-value" }, fallbackCount)),
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Badge Contract:"),
                                React.createElement("span", { className: "detail-value contract" }, config.badgeContract)),
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Quest Contract:"),
                                React.createElement("span", { className: "detail-value contract" }, config.questContract)),
                            React.createElement("div", { className: "detail-row" },
                                React.createElement("span", { className: "detail-label" }, "Fallback Contract:"),
                                React.createElement("span", { className: "detail-value contract" }, config.fallbackContract)))));
                })))),
        React.createElement("style", null, `
        .analytics {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .analytics h1 {
          color: white;
          text-align: center;
          margin-bottom: 30px;
          font-size: 36px;
        }

        .analytics-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        section {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        section h2 {
          color: #1f2937;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 24px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          padding: 20px;
          color: white;
          text-align: center;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
        }

        .stat-value.success {
          color: #10b981;
        }

        .stat-value.warning {
          color: #f59e0b;
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .chart-bar {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .chart-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #4b5563;
        }

        .chain-name {
          font-weight: 600;
          text-transform: capitalize;
        }

        .chain-count {
          color: #6b7280;
        }

        .chart-bar-container {
          height: 30px;
          background: #f3f4f6;
          border-radius: 6px;
          overflow: hidden;
        }

        .chart-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          padding-left: 10px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .chart-bar-fill.fallback {
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
        }

        .no-data {
          text-align: center;
          color: #6b7280;
          padding: 20px;
          font-style: italic;
        }

        .network-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .network-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .network-card h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
          text-transform: capitalize;
          font-size: 20px;
        }

        .network-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          color: #4b5563;
          font-size: 13px;
        }

        .detail-value {
          color: #1f2937;
          font-size: 13px;
          text-align: right;
          max-width: 60%;
        }

        .detail-value.contract {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          word-break: break-all;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .network-grid {
            grid-template-columns: 1fr;
          }

          .analytics h1 {
            font-size: 28px;
          }

          section h2 {
            font-size: 20px;
          }

          .stat-value {
            font-size: 24px;
          }
        }
      `)));
}
//# sourceMappingURL=analytics.js.map