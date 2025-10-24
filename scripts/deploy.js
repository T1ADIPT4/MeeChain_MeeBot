#!/usr/bin/env ts-node
/**
 * Deploy Script for MeeChain
 * Deploys smart contracts and records their addresses in deploy-registry.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
/**
 * Simulate contract deployment
 * In real deployment, this would interact with blockchain
 */
async function deployContract(contractType, network) {
    console.log(`📦 Deploying ${contractType} contract to ${network}...`);
    // Simulate deployment time
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Generate a mock contract address
    const timestamp = Date.now().toString(16);
    const mockAddress = `0x${contractType.substring(0, 4)}${network.substring(0, 4)}${timestamp}`;
    console.log(`✅ Deployed ${contractType} at ${mockAddress}`);
    return mockAddress;
}
/**
 * Update the deploy registry with new contract address
 */
function updateRegistryFile(network, contractType, address) {
    const registryPath = join(process.cwd(), 'config/deploy-registry.json');
    try {
        // Read current registry
        const registryData = readFileSync(registryPath, 'utf-8');
        const registry = JSON.parse(registryData);
        // Ensure network exists
        if (!registry.networks[network]) {
            console.log(`⚠️  Network ${network} not found in registry, creating...`);
            registry.networks[network] = {
                chainId: getChainId(network),
                badgeContract: '',
                questContract: '',
                fallbackContract: ''
            };
        }
        // Update contract address
        const contractKey = `${contractType.toLowerCase()}Contract`;
        registry.networks[network][contractKey] = address;
        // Update metadata
        registry.lastUpdated = new Date().toISOString();
        // Write back to file
        writeFileSync(registryPath, JSON.stringify(registry, null, 2));
        console.log(`✅ Registry updated: ${network}.${contractKey} = ${address}`);
    }
    catch (error) {
        console.error(`❌ Failed to update registry:`, error);
        throw error;
    }
}
/**
 * Get chain ID for a network
 */
function getChainId(network) {
    const chainIds = {
        ethereum: 1,
        polygon: 137,
        arbitrum: 42161
    };
    return chainIds[network];
}
/**
 * Main deploy function
 */
async function deploy(options) {
    const { contractType, network, address, simulate = true } = options;
    console.log(`\n🚀 Starting deployment...`);
    console.log(`   Contract Type: ${contractType}`);
    console.log(`   Network: ${network}`);
    console.log(`   Mode: ${simulate ? 'Simulation' : 'Live'}`);
    console.log(``);
    // Deploy contract (or use provided address)
    let contractAddress;
    if (address) {
        console.log(`📍 Using provided address: ${address}`);
        contractAddress = address;
    }
    else if (simulate) {
        contractAddress = await deployContract(contractType, network);
    }
    else {
        throw new Error('Live deployment not implemented. Provide --address or use --simulate');
    }
    // Update registry
    updateRegistryFile(network, contractType, contractAddress);
    console.log(`\n✨ Deployment complete!`);
    console.log(`   ${contractType} Contract: ${contractAddress}`);
    console.log(`   Network: ${network}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Run: npm run registry:validate`);
    console.log(`   2. Verify the contract on block explorer`);
    console.log(`   3. Test the integration`);
}
/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help')) {
        console.log(`
Usage: ts-node scripts/deploy.ts <ContractType> [options]

Contract Types:
  Badge       Deploy Badge contract
  Quest       Deploy Quest contract
  Fallback    Deploy Fallback contract

Options:
  --network <name>    Network to deploy to (ethereum|polygon|arbitrum)
  --address <addr>    Use existing contract address instead of deploying
  --simulate          Simulate deployment (default: true)
  --help              Show this help message

Examples:
  ts-node scripts/deploy.ts Badge --network polygon
  ts-node scripts/deploy.ts Quest --network ethereum --address 0x123...
  npm run deploy:badge -- --network arbitrum
`);
        process.exit(0);
    }
    const contractType = args[0];
    if (!['Badge', 'Quest', 'Fallback'].includes(contractType)) {
        throw new Error(`Invalid contract type: ${contractType}`);
    }
    const networkIndex = args.indexOf('--network');
    const network = (networkIndex >= 0 ? args[networkIndex + 1] : 'polygon');
    const addressIndex = args.indexOf('--address');
    const address = addressIndex >= 0 ? args[addressIndex + 1] : undefined;
    const simulate = !args.includes('--no-simulate');
    return { contractType, network, address, simulate };
}
// Run if called directly
const isMainModule = process.argv[1] && process.argv[1].endsWith('deploy.ts');
if (isMainModule) {
    try {
        const options = parseArgs();
        deploy(options).catch(error => {
            console.error('❌ Deployment failed:', error);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
export { deploy, deployContract, updateRegistryFile };
//# sourceMappingURL=deploy.js.map