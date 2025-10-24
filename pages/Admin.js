import React, { useState, useEffect } from 'react';
import { MeeBot } from '../components/MeeBot'; // use named export
const DeployViewer = () => {
    const [network, setNetwork] = useState(null);
    useEffect(() => {
        // mock fetch
        const mockNetwork = {
            name: 'Polygon',
            chainId: 137,
            badgeContract: '0xBadgePoly123',
            questContract: '0xQuestPoly456',
            fallbackContract: '0xFallbackPoly789'
        };
        setNetwork(mockNetwork);
    }, []);
    return (React.createElement("div", null,
        React.createElement("h2", null, "\uD83D\uDE80 MeeChain Deploy Viewer"),
        network && (React.createElement("div", null,
            React.createElement("p", null,
                React.createElement("strong", null, "Network:"),
                " ",
                network.name),
            React.createElement("p", null,
                React.createElement("strong", null, "Badge Contract:"),
                " ",
                network.badgeContract),
            React.createElement("p", null,
                React.createElement("strong", null, "Quest Contract:"),
                " ",
                network.questContract),
            React.createElement("p", null,
                React.createElement("strong", null, "Fallback Contract:"),
                " ",
                network.fallbackContract))),
        React.createElement("div", { className: "meebot-sprite", onClick: () => MeeBot.setSprite('happy') },
            React.createElement("button", null, "Trigger MeeBot Happy Sprite"))));
};
export default DeployViewer;
//# sourceMappingURL=Admin.js.map