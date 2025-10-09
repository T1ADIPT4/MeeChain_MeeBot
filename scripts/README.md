# Automated Deploy Scripts

This directory contains automated deployment and registry management scripts for MeeChain contracts.

## 📜 Scripts

### 🚀 deploy.ts

Deploy smart contracts and automatically update the registry.

**Usage:**
```bash
# Deploy Badge contract to polygon (default)
npm run deploy:badge

# Deploy to specific network
npm run deploy:badge -- --network ethereum

# Deploy Quest contract
npm run deploy:quest -- --network arbitrum

# Deploy Fallback contract
npm run deploy:fallback -- --network polygon

# Use existing contract address
npm run deploy:badge -- --network polygon --address 0x123...
```

**Options:**
- `--network <name>` - Network to deploy to (ethereum|polygon|arbitrum)
- `--address <addr>` - Use existing contract address instead of deploying
- `--simulate` - Simulate deployment (default: true)
- `--help` - Show help message

**What it does:**
1. Deploys the contract (or uses provided address)
2. Automatically updates `config/deploy-registry.json`
3. Updates the `lastUpdated` timestamp
4. Provides next steps for verification

---

### 📝 updateRegistry.ts

Update the registry with new contract addresses without deploying.

**Usage:**
```bash
# Update single contract
npm run registry:update -- --network polygon --badge 0x123...

# Update multiple contracts
npm run registry:update -- --network ethereum --badge 0x123... --quest 0x456...

# Update with custom chain ID
npm run registry:update -- --network optimism --chain-id 10 --badge 0x789...

# Batch update
npm run registry:update -- --batch '[{"network":"ethereum","badgeContract":"0x123"}]'
```

**Options:**
- `--network <name>` - Network to update (required)
- `--badge <address>` - Badge contract address
- `--quest <address>` - Quest contract address
- `--fallback <address>` - Fallback contract address
- `--chain-id <id>` - Chain ID
- `--batch <json>` - Batch update from JSON array
- `--help` - Show help message

**What it does:**
1. Updates contract addresses in `config/deploy-registry.json`
2. Creates new network entries if they don't exist
3. Updates the `lastUpdated` timestamp
4. Reports all changes made

---

### ✅ validateRegistry.ts

Validate the integrity and correctness of the deployment registry.

**Usage:**
```bash
# Validate registry
npm run registry:validate

# Strict mode (warnings as errors)
npm run registry:validate -- --strict

# Quiet output
npm run registry:validate -- --quiet
```

**Options:**
- `--strict` - Treat warnings as errors
- `--verbose` - Display detailed results (default: true)
- `--help` - Show help message

**What it validates:**
- ✅ Version format (semver)
- ✅ Last updated timestamp
- ✅ Network configurations
- ✅ Chain IDs
- ✅ Contract address formats
- ✅ Duplicate addresses
- ✅ Duplicate chain IDs

**Exit codes:**
- `0` - Validation passed
- `1` - Validation failed

---

## 🔄 Complete Workflow

### New Network Deployment

```bash
# 1. Deploy Badge contract
npm run deploy:badge -- --network polygon

# 2. Deploy Quest contract
npm run deploy:quest -- --network polygon

# 3. Deploy Fallback contract
npm run deploy:fallback -- --network polygon

# 4. Validate everything
npm run registry:validate

# 5. Run tests to ensure integration works
npm test
```

### Update Existing Network

```bash
# Update specific contract
npm run registry:update -- --network ethereum --badge 0xNewAddress...

# Validate the update
npm run registry:validate

# Test the changes
npm test
```

### Batch Deploy Multiple Networks

```bash
# Deploy to multiple networks
for network in ethereum polygon arbitrum; do
  npm run deploy:badge -- --network $network
  npm run deploy:quest -- --network $network
  npm run deploy:fallback -- --network $network
done

# Validate all deployments
npm run registry:validate
```

---

## 🎯 Integration with UI

After running deployment scripts, the UI components automatically pick up the new contracts:

### Dashboard (`/dashboard`)
- Shows badges with chain provenance
- Displays contract addresses from registry
- Includes fallback logs with chain information

### Admin Panel (`/admin`)
- Network selection dropdown
- Manual badge minting
- Contract address display

### Analytics (`/analytics`)
- Badge distribution by chain
- Fallback usage statistics
- Network health monitoring
- Success rate tracking

---

## 🧪 Testing

All scripts include comprehensive tests:

```bash
# Run all tests including script tests
npm test

# Run only script tests
npm test tests/autoDeployScripts.test.ts

# Run specific test suite
npm test -- -t "deployContract"
```

**Test coverage:**
- ✅ Contract deployment simulation
- ✅ Registry file updates
- ✅ Address validation
- ✅ Network configuration validation
- ✅ Integration workflow
- ✅ Error handling

---

## 📚 Demo

Run the comprehensive demo to see all features in action:

```bash
npm run demo:auto-deploy
```

This demonstrates:
- Registry validation
- Contract deployment
- Registry updates
- Badge minting integration
- Dashboard integration
- Complete workflow

---

## 🔒 Safety Features

### Automatic Backups
The scripts never delete data - they only add or update. Always test in development first.

### Validation Before Use
Use `npm run registry:validate` before deploying to production to catch issues early.

### Atomic Updates
Registry updates are atomic - either all changes succeed or none are applied.

### Git Integration
All changes are tracked in git. You can always rollback:
```bash
git checkout config/deploy-registry.json
```

---

## 📖 Examples

### Example 1: Deploy to Polygon
```bash
$ npm run deploy:badge -- --network polygon

🚀 Starting deployment...
   Contract Type: Badge
   Network: polygon
   Mode: Simulation

📦 Deploying Badge contract to polygon...
✅ Deployed Badge at 0xBadgpoly199c61432d1
✅ Registry updated: polygon.badgeContract = 0xBadgpoly199c61432d1

✨ Deployment complete!
```

### Example 2: Update Existing Address
```bash
$ npm run registry:update -- --network ethereum --badge 0xMyBadgeContract

🔄 Updating registry...

✅ Registry updated successfully
   Network: ethereum
   - badgeContract: 0xMyBadgeContract
   Last Updated: 2025-10-08T23:00:00.000Z

✨ Update complete!
```

### Example 3: Validate Registry
```bash
$ npm run registry:validate

🔍 Registry Validation Results

Networks: 3
  ethereum, polygon, arbitrum

✅ Registry is valid
```

---

## 🚨 Troubleshooting

### "Invalid address format"
Make sure addresses start with `0x` and contain valid hex characters.

### "Network not found"
The network doesn't exist in the registry. The script will create it if you provide a `chainId`.

### "Registry validation failed"
Run `npm run registry:validate -- --strict` to see detailed errors and warnings.

### TypeScript errors
Make sure to run `npm run build` after making changes to see TypeScript errors.

---

## 🎨 Future Enhancements

Planned features:
- [ ] Rollback on failed deployment
- [ ] Registry versioning (v1, v2, etc.)
- [ ] Multi-signature deployment approval
- [ ] Automated testing post-deployment
- [ ] Contract verification on Etherscan
- [ ] Deployment to testnet before mainnet
- [ ] Gas estimation and optimization
- [ ] Deployment report generation

---

## 📄 Related Documentation

- [DEPLOY_REGISTRY.md](../DEPLOY_REGISTRY.md) - Registry overview
- [INTEGRATION.md](../INTEGRATION.md) - Integration guide
- [package.json](../package.json) - Available scripts

---

## 📞 Support

For issues or questions:
1. Check existing tests for examples
2. Run the demo: `npm run demo:auto-deploy`
3. Read the documentation
4. Open an issue on GitHub
=======
# Scripts Directory

This directory contains automated deployment and registry management scripts for the MeeChain MeeBot system.

## 📁 Structure

```
scripts/
├── deploy.ts              - Main deployment orchestration
├── updateRegistry.ts      - Registry update utilities
├── validateRegistry.ts    - Registry validation
├── validateRegistryCLI.ts - CLI wrapper for validation
├── exportLogs.ts          - Log export functionality
└── utils/
    └── deployer.ts        - Contract deployment utilities
```

## 🚀 Available Commands

### Deploy Contracts

Deploy contracts to a specific network:

```bash
npm run deploy <network>
```

Examples:
```bash
npm run deploy ethereum
npm run deploy polygon
npm run deploy arbitrum
```

This command will:
1. Create a backup of the current registry
2. Deploy Badge, Quest, and Fallback contracts
3. Verify all deployed contracts
4. Update the registry with new addresses
5. Validate the updated registry

### Validate Registry

Check if the deploy-registry.json is valid:

```bash
npm run validate-registry
```

This validates:
- File format and JSON syntax
- Required fields (version, networks, lastUpdated)
- Contract address formats (must start with 0x)
- Chain IDs (must be positive numbers)
- Network configurations

### Export Logs

Export system logs (currently requires custom implementation):

```bash
npm run export-logs
```

## 📝 Module Documentation

### deploy.ts

Main deployment orchestration script.

**Functions:**
- `deployToNetwork(network)` - Deploy all contracts to a network
- `main()` - CLI entry point

**Usage:**
```typescript
import { deployToNetwork } from './scripts/deploy.js'
await deployToNetwork('polygon')
```

### updateRegistry.ts

Registry update utilities.

**Functions:**
- `updateRegistry(network, contracts)` - Update registry with new addresses
- `backupRegistry()` - Create a timestamped backup
- `restoreRegistry(backupPath)` - Restore from backup

**Usage:**
```typescript
import { updateRegistry, backupRegistry } from './scripts/updateRegistry.js'

const backupPath = backupRegistry()
updateRegistry('ethereum', {
  badgeContract: '0x123...',
  questContract: '0x456...',
})
```

### validateRegistry.ts

Registry validation utilities.

**Functions:**
- `validateRegistry()` - Validate and return results
- `validateRegistryOrExit()` - Validate and exit on error

**Usage:**
```typescript
import { validateRegistry } from './scripts/validateRegistry.js'

const result = validateRegistry()
if (!result.valid) {
  console.error('Validation failed:', result.errors)
}
```

### exportLogs.ts

Log export functionality.

**Functions:**
- `exportLogsToJSON(path?)` - Export to JSON
- `exportLogsToCSV(path?)` - Export to CSV
- `exportRegistryWithProvenance(path?)` - Export with provenance data

**Usage:**
```typescript
import { exportLogsToJSON, exportRegistryWithProvenance } from './scripts/exportLogs.js'

const jsonPath = exportLogsToJSON('my-logs.json')
const provPath = exportRegistryWithProvenance()
```

### utils/deployer.ts

Contract deployment utilities.

**Functions:**
- `deployContract(type, network)` - Deploy single contract
- `deployAllContracts(network)` - Deploy all contracts
- `verifyContract(address, network)` - Verify deployment

**Usage:**
```typescript
import { deployContract, verifyContract } from './scripts/utils/deployer.js'

const result = await deployContract('Badge', 'polygon')
const isValid = await verifyContract(result.address, 'polygon')
```

## 🔧 Configuration

Scripts use the following configuration files:

- `config/deploy-registry.json` - Main registry (auto-updated)
- `config/address.json` - Deployment tracking
- Backup files: `config/deploy-registry.backup.{timestamp}.json`

## 🧪 Testing

All scripts are covered by comprehensive tests in `tests/deployAutomation.test.ts`.

Run tests:
```bash
npm test
```

## 🔐 Security

- Always creates backups before modifications
- Validates all inputs and outputs
- Prevents deployment to unknown networks
- Verifies contract addresses before registry updates

## 📚 Examples

See working examples in:
- `examples/deploy-automation-demo.ts` - Full workflow demo
- `tests/deployAutomation.test.ts` - Test scenarios

## 🛠️ Development

To add a new script:

1. Create the script in `scripts/`
2. Add TypeScript types
3. Export necessary functions
4. Add CLI wrapper if needed
5. Add npm script in `package.json`
6. Add tests in `tests/`
7. Update this README

## 📄 License

MIT License - See LICENSE file for details
