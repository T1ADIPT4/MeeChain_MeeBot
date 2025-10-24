/**
 * Dashboard Integration Demo
 * Demonstrates the integration of dashboard and admin pages with deploy-registry
 */
import { getContractAddress } from '../utils/registry.js';
import { getUserBadges, getFallbackLogs, mintBadge as adminMintBadge } from '../utils/mockData.js';
import { getAvailableNetworks } from '../src/config/registryLoader.js';
import { logEvent } from '../src/utils/logger.js';
console.log('🎯 Dashboard & Admin Integration Demo\n');
/**
 * Example 1: Registry Utility
 */
function example1_RegistryUtility() {
    console.log('=== Example 1: Registry Utility ===\n');
    const polygonBadge = getContractAddress('polygon', 'badge');
    const ethereumQuest = getContractAddress('ethereum', 'quest');
    const arbitrumFallback = getContractAddress('arbitrum', 'fallback');
    console.log('Contract Addresses:');
    console.log(`  Polygon Badge: ${polygonBadge}`);
    console.log(`  Ethereum Quest: ${ethereumQuest}`);
    console.log(`  Arbitrum Fallback: ${arbitrumFallback}\n`);
}
/**
 * Example 2: Badge List Data
 */
function example2_BadgeListData() {
    console.log('=== Example 2: Badge List Data ===\n');
    const userId = 'user-001';
    const badges = getUserBadges(userId);
    console.log(`Badges for ${userId}:`);
    badges.forEach((badge, i) => {
        const chain = badge.chain || 'ethereum';
        const contract = getContractAddress(chain, 'badge');
        console.log(`  ${i + 1}. ${badge.badgeId}`);
        console.log(`     Quest: ${badge.questId}`);
        console.log(`     Chain: ${chain}`);
        console.log(`     Contract: ${contract}`);
        console.log(`     TX: ${badge.txHash || 'N/A'}`);
        console.log('');
    });
}
/**
 * Example 3: Fallback Log Data
 */
function example3_FallbackLogData() {
    console.log('=== Example 3: Fallback Log Data ===\n');
    // Simulate some fallback minting events
    logEvent('badge-fallback-minted', {
        userId: 'user-123',
        questId: 'quest-001',
        network: 'ethereum',
        tx: '0xfallback123...'
    });
    logEvent('badge-fallback-mint-success', {
        userId: 'user-456',
        questId: 'quest-002',
        network: 'polygon',
        tx: '0xfallback456...'
    });
    const logs = getFallbackLogs();
    console.log('Fallback Logs:');
    logs.forEach((log, i) => {
        const chain = log.chain || 'optimism';
        const fallbackContract = getContractAddress(chain, 'fallback');
        console.log(`  ${i + 1}. User: ${log.userId} – Quest: ${log.questId}`);
        console.log(`     Fallback: ✅`);
        console.log(`     Chain: ${chain}`);
        console.log(`     Contract: ${fallbackContract}`);
        console.log(`     TX: ${log.txHash || 'N/A'}`);
        console.log('');
    });
}
/**
 * Example 4: Admin Override
 */
function example4_AdminOverride() {
    console.log('=== Example 4: Admin Override ===\n');
    const userId = 'user-999';
    const questId = 'quest-special';
    const chain = 'arbitrum';
    const badgeContract = getContractAddress(chain, 'badge');
    console.log(`Admin Override Configuration:`);
    console.log(`  User: ${userId}`);
    console.log(`  Quest: ${questId}`);
    console.log(`  Chain: ${chain}`);
    console.log(`  Badge Contract: ${badgeContract}\n`);
    console.log('Triggering manual mint...');
    adminMintBadge(userId, questId, badgeContract);
    console.log('✅ Admin override completed\n');
}
/**
 * Example 5: Available Networks
 */
function example5_AvailableNetworks() {
    console.log('=== Example 5: Available Networks ===\n');
    const networks = getAvailableNetworks();
    console.log('Supported Networks:');
    networks.forEach(network => {
        console.log(`  - ${network}`);
        console.log(`    Badge: ${getContractAddress(network, 'badge')}`);
        console.log(`    Quest: ${getContractAddress(network, 'quest')}`);
        console.log(`    Fallback: ${getContractAddress(network, 'fallback')}`);
    });
    console.log('');
}
/**
 * Example 6: Dashboard Integration Pattern
 */
function example6_DashboardPattern() {
    console.log('=== Example 6: Dashboard Integration Pattern ===\n');
    console.log('Dashboard Page would display:');
    console.log('  1. Badge List (with chain provenance)');
    console.log('  2. Fallback Log (with contract addresses)');
    console.log('  3. All integrated with deploy-registry.json\n');
    console.log('Admin Page would provide:');
    console.log('  1. Manual badge minting');
    console.log('  2. Network selection dropdown');
    console.log('  3. Contract address display');
    console.log('  4. Override functionality\n');
    console.log('✅ Ready for production use!');
}
// Run all examples
example1_RegistryUtility();
example2_BadgeListData();
example3_FallbackLogData();
example4_AdminOverride();
example5_AvailableNetworks();
example6_DashboardPattern();
console.log('\n🎉 Dashboard & Admin Integration Demo Complete!');
console.log('\nNext Steps:');
console.log('  - Integrate pages into your React/Next.js app');
console.log('  - Connect to real user authentication');
console.log('  - Add database/blockchain data fetching');
console.log('  - Customize styling to match your design system');
//# sourceMappingURL=dashboard-integration-demo.js.map