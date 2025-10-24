/**
 * FallbackLog Component
 * Displays fallback minting logs with chain provenance
 */
import React from 'react';
import { getContractAddress } from '../utils/registry';
import { getFallbackLogs } from '../utils/mockData';
export function FallbackLog() {
    const logs = getFallbackLogs();
    return (React.createElement("div", { className: "fallback-log" },
        React.createElement("h2", null, "\uD83D\uDD01 Fallback Log"),
        logs.length === 0 ? (React.createElement("p", null, "No fallback minting events recorded.")) : (React.createElement("ul", null, logs.map((log, i) => {
            const chain = log.chain || 'optimism';
            const fallbackContract = getContractAddress(chain, 'fallback');
            return (React.createElement("li", { key: i, className: "log-item" },
                React.createElement("div", { className: "log-info" },
                    React.createElement("strong", null, log.userId),
                    " \u2013 ",
                    log.questId),
                React.createElement("div", { className: "log-details" },
                    React.createElement("span", { className: "fallback-status" }, "Fallback: \u2705"),
                    React.createElement("span", { className: "chain-label" },
                        "Chain: ",
                        chain),
                    React.createElement("span", { className: "contract-label" },
                        "Contract: ",
                        fallbackContract),
                    log.txHash && React.createElement("span", { className: "tx-label" },
                        "TX: ",
                        log.txHash),
                    React.createElement("span", { className: "timestamp-label" },
                        "Time: ",
                        log.timestamp.toLocaleString()))));
        })))));
}
//# sourceMappingURL=FallbackLog.js.map