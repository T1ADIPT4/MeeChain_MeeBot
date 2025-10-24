#!/usr/bin/env ts-node
/**
 * Update Registry Script for MeeChain
 * Programmatically updates deploy-registry.json with new contract addresses
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
/**
 * Update the deploy registry with new configuration
 */
function updateRegistry(options) {
    const registryPath = join(process.cwd(), 'config/deploy-registry.json');
    try {
        // Read current registry
        const registryData = readFileSync(registryPath, 'utf-8');
        const registry = JSON.parse(registryData);
        const { network, badgeContract, questContract, fallbackContract, chainId } = options;
        // Get or create network config
        let networkConfig = registry.networks[network];
        if (!networkConfig) {
            console.log(`⚠️  Network ${network} not found, creating new entry...`);
            networkConfig = {
                chainId: chainId || getDefaultChainId(network),
                badgeContract: '',
                questContract: '',
                fallbackContract: ''
            };
            registry.networks[network] = networkConfig;
        }
        // Track changes
        const changes = [];
        // Update contracts if provided
        if (badgeContract) {
            networkConfig.badgeContract = badgeContract;
            changes.push(`badgeContract: ${badgeContract}`);
        }
        if (questContract) {
            networkConfig.questContract = questContract;
            changes.push(`questContract: ${questContract}`);
        }
        if (fallbackContract) {
            networkConfig.fallbackContract = fallbackContract;
            changes.push(`fallbackContract: ${fallbackContract}`);
        }
        if (chainId !== undefined) {
            networkConfig.chainId = chainId;
            changes.push(`chainId: ${chainId}`);
        }
        // Update metadata
        registry.lastUpdated = new Date().toISOString();
        // Write back to file
        writeFileSync(registryPath, JSON.stringify(registry, null, 2));
        console.log(`✅ Registry updated successfully`);
        console.log(`   Network: ${network}`);
        changes.forEach(change => console.log(`   - ${change}`));
        console.log(`   Last Updated: ${registry.lastUpdated}`);
    }
    catch (error) {
        console.error(`❌ Failed to update registry:`, error);
        throw error;
    }
}
/**
 * Get default chain ID for known networks
 */
function getDefaultChainId(network) {
    const chainIds = {
        ethereum: 1,
        polygon: 137,
        arbitrum: 42161,
        optimism: 10,
        base: 8453,
        avalanche: 43114
    };
    return chainIds[network] || 0;
}
/**
 * Batch update multiple networks
 */
function batchUpdateRegistry(updates) {
    console.log(`\n🔄 Batch updating ${updates.length} network(s)...\n`);
    updates.forEach((options, index) => {
        console.log(`[${index + 1}/${updates.length}]`);
        updateRegistry(options);
        console.log('');
    });
    console.log(`✨ Batch update complete!`);
}
/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help')) {
        console.log(`
Usage: ts-node scripts/updateRegistry.ts [options]

Options:
  --network <name>          Network to update (required)
  --badge <address>         Badge contract address
  --quest <address>         Quest contract address
  --fallback <address>      Fallback contract address
  --chain-id <id>           Chain ID
  --batch <json>            Batch update from JSON array
  --help                    Show this help message

Examples:
  # Update single contract
  ts-node scripts/updateRegistry.ts --network polygon --badge 0x123...

  # Update multiple contracts
  ts-node scripts/updateRegistry.ts --network ethereum --badge 0x123... --quest 0x456...

  # Update with custom chain ID
  ts-node scripts/updateRegistry.ts --network optimism --chain-id 10 --badge 0x789...

  # Batch update
  npm run registry:update -- --batch '[{"network":"ethereum","badgeContract":"0x123"}]'
`);
        process.exit(0);
    }
    // Check for batch mode
    const batchIndex = args.indexOf('--batch');
    if (batchIndex >= 0) {
        const batchJson = args[batchIndex + 1];
        return JSON.parse(batchJson);
    }
    // Single update mode
    const networkIndex = args.indexOf('--network');
    if (networkIndex < 0) {
        throw new Error('--network is required');
    }
    const network = args[networkIndex + 1];
    const badgeIndex = args.indexOf('--badge');
    const badgeContract = badgeIndex >= 0 ? args[badgeIndex + 1] : undefined;
    const questIndex = args.indexOf('--quest');
    const questContract = questIndex >= 0 ? args[questIndex + 1] : undefined;
    const fallbackIndex = args.indexOf('--fallback');
    const fallbackContract = fallbackIndex >= 0 ? args[fallbackIndex + 1] : undefined;
    const chainIdIndex = args.indexOf('--chain-id');
    const chainId = chainIdIndex >= 0 ? parseInt(args[chainIdIndex + 1]) : undefined;
    return { network, badgeContract, questContract, fallbackContract, chainId };
}
// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('updateRegistry.ts');
if (isMainModule) {
    try {
        const options = parseArgs();
        if (Array.isArray(options)) {
            batchUpdateRegistry(options);
        }
        else {
            console.log(`\n🔄 Updating registry...\n`);
            updateRegistry(options);
            console.log(`\n✨ Update complete!`);
        }
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
export { updateRegistry, batchUpdateRegistry };
//# sourceMappingURL=updateRegistry.js.map