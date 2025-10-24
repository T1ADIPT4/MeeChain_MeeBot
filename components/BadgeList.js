/**
 * BadgeList Component
 * Displays user badges with chain provenance information
 */
import React from 'react';
import { getContractAddress } from '../utils/registry';
import { getUserBadges } from '../utils/mockData';
export function BadgeList({ userId }) {
    const badges = getUserBadges(userId);
    return (React.createElement("div", { className: "badge-list" },
        React.createElement("h2", null, "\uD83C\uDF96\uFE0F Badges"),
        badges.length === 0 ? (React.createElement("p", null, "No badges yet. Complete quests to earn badges!")) : (React.createElement("ul", null, badges.map((b, i) => {
            const chain = b.chain || 'ethereum';
            const contract = getContractAddress(chain, 'badge');
            return (React.createElement("li", { key: i, className: "badge-item" },
                React.createElement("div", { className: "badge-info" },
                    React.createElement("strong", null, b.badgeId),
                    " \u2013 ",
                    b.questId),
                React.createElement("div", { className: "badge-provenance" },
                    React.createElement("span", { className: "chain-label" },
                        "Chain: ",
                        chain),
                    React.createElement("span", { className: "contract-label" },
                        "Contract: ",
                        contract),
                    b.txHash && React.createElement("span", { className: "tx-label" },
                        "TX: ",
                        b.txHash),
                    b.timestamp && (React.createElement("span", { className: "timestamp-label" },
                        "Date: ",
                        b.timestamp.toLocaleDateString())))));
        })))));
}
//# sourceMappingURL=BadgeList.js.map