// pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { MeeBot } from '../components/MeeBot';
export default function DashboardPage() {
    const [badges, setBadges] = useState([]);
    const [networks, setNetworks] = useState([]);
    const [fallbackLogs, setFallbackLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNetwork, setSelectedNetwork] = useState('all');
    useEffect(() => {
        loadDashboardData();
    }, []);
    async function loadDashboardData() {
        setLoading(true);
        MeeBot.setSprite('loading');
        try {
            // Load registry data
            const registryModule = await import('../src/config/registryLoader');
            const registry = registryModule.loadRegistry();
            // Parse networks
            const networkList = Object.entries(registry.networks).map(([name, config]) => ({
                name,
                chainId: config.chainId,
                badgeContract: config.badgeContract,
                questContract: config.questContract,
                fallbackContract: config.fallbackContract,
            }));
            setNetworks(networkList);
            // Load logs to get badge minting history
            const loggerModule = await import('../src/utils/logger');
            const logs = loggerModule.getLogs();
            // Extract badge minting logs
            const badgeLogs = logs.filter(log => log.eventType === 'badge-minted' || log.eventType === 'badge-fallback-minted');
            const badgeList = badgeLogs.map(log => ({
                questId: log.context.questId || 'unknown',
                badgeId: log.context.badgeId || 'unknown',
                timestamp: log.timestamp,
                network: log.context.network || 'unknown',
                chain: log.eventType === 'badge-fallback-minted' ? 'fallback' : 'primary',
                txHash: log.context.tx || 'unknown',
                contractAddress: log.context.contractAddress || 'unknown',
            }));
            setBadges(badgeList);
            // Extract fallback logs
            const fallbackLogList = logs
                .filter(log => log.eventType === 'badge-fallback-minted' || log.eventType === 'badge-mint-failed')
                .map(log => ({
                timestamp: log.timestamp,
                userId: log.context.userId || 'unknown',
                questId: log.context.questId || 'unknown',
                reason: log.eventType === 'badge-mint-failed' ? 'Primary chain failed' : 'Fallback used',
                network: log.context.network || 'unknown',
                success: log.eventType === 'badge-fallback-minted',
            }));
            setFallbackLogs(fallbackLogList);
            MeeBot.setSprite('neutral');
            MeeBot.speak('ยินดีต้อนรับสู่แดชบอร์ด MeeChain! ตรวจสอบ badge และ fallback log ของคุณได้ที่นี่');
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
            MeeBot.setSprite('confused');
            MeeBot.speak('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
        finally {
            setLoading(false);
        }
    }
    const filteredBadges = selectedNetwork === 'all'
        ? badges
        : badges.filter(b => b.network === selectedNetwork);
    if (loading) {
        return (React.createElement("div", { className: "dashboard-container" },
            React.createElement("p", null, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E41\u0E14\u0E0A\u0E1A\u0E2D\u0E23\u0E4C\u0E14...")));
    }
    return (React.createElement("div", { className: "dashboard-container" },
        React.createElement("h1", null, "\uD83D\uDCCA MeeChain Dashboard"),
        React.createElement("section", { className: "network-section" },
            React.createElement("h2", null, "\uD83C\uDF10 Networks"),
            React.createElement("div", { className: "network-grid" }, networks.map(network => (React.createElement("div", { key: network.name, className: "network-card" },
                React.createElement("h3", null, network.name.toUpperCase()),
                React.createElement("p", null,
                    "Chain ID: ",
                    network.chainId),
                React.createElement("p", null,
                    "Badge: ",
                    network.badgeContract),
                React.createElement("p", null,
                    "Quest: ",
                    network.questContract),
                React.createElement("p", null,
                    "Fallback: ",
                    network.fallbackContract)))))),
        React.createElement("section", { className: "badge-section" },
            React.createElement("h2", null, "\uD83C\uDFC6 Your Badges"),
            React.createElement("div", { className: "filter-controls" },
                React.createElement("label", null, "Filter by network: "),
                React.createElement("select", { value: selectedNetwork, onChange: (e) => setSelectedNetwork(e.target.value) },
                    React.createElement("option", { value: "all" }, "All Networks"),
                    networks.map(n => (React.createElement("option", { key: n.name, value: n.name }, n.name))))),
            filteredBadges.length === 0 ? (React.createElement("p", null, "No badges found. Complete quests to earn badges!")) : (React.createElement("div", { className: "badge-list" }, filteredBadges.map((badge, idx) => (React.createElement("div", { key: idx, className: "badge-item" },
                React.createElement("h4", null, badge.badgeId),
                React.createElement("p", null,
                    "Quest: ",
                    badge.questId),
                React.createElement("p", null,
                    "Network: ",
                    badge.network),
                React.createElement("p", null,
                    "Chain: ",
                    badge.chain === 'fallback' ? '⚠️ Fallback' : '✅ Primary'),
                React.createElement("p", null,
                    "TX: ",
                    badge.txHash.substring(0, 10),
                    "..."),
                React.createElement("p", null,
                    "Time: ",
                    new Date(badge.timestamp).toLocaleString()))))))),
        React.createElement("section", { className: "fallback-section" },
            React.createElement("h2", null, "\u26A0\uFE0F Fallback Log & Provenance"),
            fallbackLogs.length === 0 ? (React.createElement("p", null, "No fallback events recorded.")) : (React.createElement("div", { className: "fallback-log" }, fallbackLogs.map((log, idx) => (React.createElement("div", { key: idx, className: `log-item ${log.success ? 'success' : 'failed'}` },
                React.createElement("p", null,
                    "\uD83D\uDD52 ",
                    new Date(log.timestamp).toLocaleString()),
                React.createElement("p", null,
                    "User: ",
                    log.userId),
                React.createElement("p", null,
                    "Quest: ",
                    log.questId),
                React.createElement("p", null,
                    "Reason: ",
                    log.reason),
                React.createElement("p", null,
                    "Network: ",
                    log.network),
                React.createElement("p", null,
                    "Status: ",
                    log.success ? '✅ Success' : '❌ Failed')))))))));
}
//# sourceMappingURL=Dashboard.js.map