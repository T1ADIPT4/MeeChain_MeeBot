# Deploy Registry Automation Documentation

## 📋 Overview

The **Deploy Registry Automation System** is a comprehensive toolkit for managing smart contract deployments across multiple blockchain networks. It automatically updates the `deploy-registry.json`, validates configurations, and integrates seamlessly with the MeeChain MeeBot dashboard and admin panels.

## 🎯 Features

- ✅ **Automated Contract Deployment**: Simulates and tracks contract deployments
- ✅ **Registry Auto-Update**: Automatically updates `deploy-registry.json` after deployments
- ✅ **Multi-Chain Support**: Supports Ethereum, Polygon, Arbitrum, and more
- ✅ **Fallback-Aware**: Separate tracking for primary and fallback contracts
- ✅ **Validation System**: Ensures registry integrity and correctness
- ✅ **Log Export**: Export logs to JSON/CSV with provenance data
- ✅ **Dashboard Integration**: View deployments and fallback logs in the dashboard
- ✅ **Admin Panel**: Manage contracts and export logs through the admin interface

## 📁 File Structure

```
scripts/
  deploy.ts                ← Main deployment orchestration script
  updateRegistry.ts        ← Automatic registry update utilities
  validateRegistry.ts      ← Registry validation and checks
  exportLogs.ts            ← Log export functionality (JSON/CSV)
  utils/
    deployer.ts            ← Contract deployment utilities

config/
  deploy-registry.json     ← Main registry file (auto-updated)
  address.json             ← Deployed address tracking

pages/
  Dashboard.tsx            ← View badges, networks, and fallback logs
  Admin.tsx                ← Manage contracts and export logs
```

## 🚀 Usage

### 1. Deploy Contracts

Deploy contracts to a specific network:

```bash
npm run deploy <network>
```

Example:
```bash
npm run deploy arbitrum
```

This will:
1. Backup the current registry
2. Deploy Badge, Quest, and Fallback contracts
3. Verify the deployed contracts
4. Update `deploy-registry.json`
5. Validate the updated registry

### 2. Validate Registry

Check if the registry is valid:

```bash
npm run validate-registry
```

This validates:
- File existence and JSON syntax
- Required fields (version, networks, lastUpdated)
- Contract address formats
- Chain IDs
- Network configurations

### 3. Export Logs

Export system logs with various options:

```bash
npm run export-logs
```

Exports include:
- All logged events
- Registry information
- Provenance data
- Network statistics

### 4. Run Demo

See the automation system in action:

```bash
npm run demo:deploy-automation
```

This demonstrates:
- Registry inspection
- Validation
- Simulated deployment
- Badge minting with registry
- Log export
- Multi-chain workflow

## 🔧 API Reference

### Deployment Scripts

#### `deployContract(contractType, network)`

Deploy a single contract to a network.

```typescript
import { deployContract } from './scripts/utils/deployer.js'

const result = await deployContract('Badge', 'polygon')
// Returns: { address, network, contractType, txHash, timestamp }
```

#### `deployAllContracts(network)`

Deploy all contracts (Badge, Quest, Fallback) to a network.

```typescript
import { deployAllContracts } from './scripts/utils/deployer.js'

const contracts = await deployAllContracts('arbitrum')
// Returns: { badgeContract, questContract, fallbackContract }
```

#### `verifyContract(address, network)`

Verify a deployed contract.

```typescript
import { verifyContract } from './scripts/utils/deployer.js'

const isValid = await verifyContract('0x123...', 'ethereum')
// Returns: boolean
```

### Registry Management

#### `updateRegistry(network, contracts)`

Update registry with new contract addresses.

```typescript
import { updateRegistry } from './scripts/updateRegistry.js'

updateRegistry('polygon', {
  badgeContract: '0xNewBadge123',
  questContract: '0xNewQuest456',
})
```

#### `backupRegistry()`

Create a backup of the current registry.

```typescript
import { backupRegistry } from './scripts/updateRegistry.js'

const backupPath = backupRegistry()
// Creates: config/deploy-registry.backup.{timestamp}.json
```

#### `validateRegistry()`

Validate the registry and return results.

```typescript
import { validateRegistry } from './scripts/validateRegistry.js'

const result = validateRegistry()
// Returns: { valid: boolean, errors: [], warnings: [] }
```

### Log Export

#### `exportLogsToJSON(outputPath?)`

Export logs to JSON format.

```typescript
import { exportLogsToJSON } from './scripts/exportLogs.js'

const filepath = exportLogsToJSON('my-logs.json')
```

#### `exportLogsToCSV(outputPath?)`

Export logs to CSV format.

```typescript
import { exportLogsToCSV } from './scripts/exportLogs.js'

const filepath = exportLogsToCSV('my-logs.csv')
```

#### `exportRegistryWithProvenance(outputPath?)`

Export registry with deployment provenance.

```typescript
import { exportRegistryWithProvenance } from './scripts/exportLogs.js'

const filepath = exportRegistryWithProvenance()
```

## 🌐 Dashboard Integration

The **Dashboard** page (`pages/Dashboard.tsx`) provides:

### Network Information
- View all configured networks
- Display contract addresses by network
- Show chain IDs

### Badge Display
- List all earned badges
- Filter by network
- Show primary vs fallback chain indicators
- Display transaction hashes

### Fallback Log & Provenance
- View fallback events
- Track primary chain failures
- Show fallback success/failure status
- Timestamp tracking

## ⚙️ Admin Panel Integration

The **Admin** page (`pages/Admin.tsx`) provides:

### Badge Minting Controls
- Select target network
- Trigger test badge minting
- View minting results

### Contract Management
- View contract addresses per network
- Update contract addresses manually
- Multi-network overview

### Log Export
- Choose export format (JSON/CSV)
- Download logs with one click
- Include registry and provenance data

### Deployment Logs
- View recent deployments
- Track deployment status
- Filter by network

## 📊 Data Flow

```
User Action
    ↓
Deploy Script (scripts/deploy.ts)
    ↓
Contract Deployment (scripts/utils/deployer.ts)
    ↓
Contract Verification
    ↓
Registry Update (scripts/updateRegistry.ts)
    ↓
Validation (scripts/validateRegistry.ts)
    ↓
Success! → Logged Events
    ↓
Available in Dashboard & Admin
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:
- Contract deployment simulation
- Registry updates and validation
- Log export functionality
- Integration workflows
- Multi-chain operations

## 🔐 Security Best Practices

1. **Always backup** before making changes
2. **Validate** after every update
3. **Review** contract addresses before deployment
4. **Test** on testnets before mainnet
5. **Version control** your registry changes

## 🛡️ Error Handling

The system includes comprehensive error handling:

- Invalid network names → Clear error messages
- Missing registry fields → Validation errors
- Invalid addresses → Format validation
- Deployment failures → Rollback support
- File I/O errors → Graceful degradation

## 📈 Extending the System

### Adding a New Network

1. Update `deploy-registry.json`:
```json
{
  "networks": {
    "optimism": {
      "chainId": 10,
      "badgeContract": "0x...",
      "questContract": "0x...",
      "fallbackContract": "0x..."
    }
  }
}
```

2. Update `SupportedNetwork` type in `src/config/registryTypes.ts`:
```typescript
export type SupportedNetwork = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism'
```

3. Run validation:
```bash
npm run validate-registry
```

### Adding New Contract Types

1. Update `NetworkConfig` interface
2. Add getter functions in `registryLoader.ts`
3. Update deployment scripts
4. Run tests

## 🎓 Examples

See working examples in:
- `examples/deploy-automation-demo.ts` - Full automation demo
- `examples/deploy-registry-demo.ts` - Registry usage patterns
- `tests/deployAutomation.test.ts` - Test scenarios

## 📝 Changelog

### Version 1.0.0
- Initial release
- Multi-chain deployment support
- Automated registry updates
- Validation system
- Dashboard and Admin integration
- Log export functionality

## 🔗 Related Documentation

- [DEPLOY_REGISTRY.md](./DEPLOY_REGISTRY.md) - Registry structure and usage
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest verification system

## 📄 License

MIT License - See LICENSE file for details
