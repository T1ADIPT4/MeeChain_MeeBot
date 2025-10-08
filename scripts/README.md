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
