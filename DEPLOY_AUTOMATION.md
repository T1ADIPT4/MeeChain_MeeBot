# Deploy Registry Automation Documentation

## 📋 Overview

copilot/add-docs-deploy-guide
The **Deploy Registry Automation** system provides a comprehensive, automated workflow for deploying, managing, and tracking smart contracts across multiple blockchain networks in the MeeChain MeeBot ecosystem.

This system integrates:
- **Automated deployment scripts** for Badge, Quest, and Fallback contracts
- **Registry management** with automatic updates and validation
- **Log export utilities** for audit trails and analytics
- **Dashboard integration** for real-time monitoring
- **Admin panel** for manual contract management

## 🎯 Features

### Core Features
- ✅ **Multi-Chain Deployment**: Deploy contracts to Ethereum, Polygon, Arbitrum, and more
- ✅ **Automated Registry Updates**: Automatically update `deploy-registry.json` after deployments
- ✅ **Validation System**: Built-in validation for contract addresses and network configurations
- ✅ **Log Export**: Export deployment logs in JSON/CSV formats with provenance tracking
- ✅ **Fallback Awareness**: Separate fallback contract addresses for resilient badge minting
- ✅ **Dashboard Integration**: Real-time visibility into deployed contracts
- ✅ **Admin Panel**: Manual contract management and log export capabilities

### Advanced Features
- 🔄 **Batch Updates**: Update multiple networks simultaneously
- 📊 **Deployment Analytics**: Track deployment history and success rates
- 🛡️ **Error Handling**: Comprehensive error checking and recovery
- 📦 **Modular Design**: Reusable utilities for custom deployment workflows
- 🔐 **Provenance Tracking**: Full audit trail of deployment history
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
copilot/add-css-for-fallback-viewer

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

copilot/add-docs-deploy-guide
Deploy individual contracts to specific networks:

```bash
# Deploy Badge contract to Polygon
npm run deploy:badge -- --network polygon

# Deploy Quest contract to Ethereum
npm run deploy:quest -- --network ethereum

# Deploy Fallback contract to Arbitrum
npm run deploy:fallback -- --network arbitrum
```

Using the script directly:

```bash
# Deploy with custom address
ts-node scripts/deploy.ts Badge --network polygon --address 0x123...

# Simulate deployment (default mode)
ts-node scripts/deploy.ts Quest --network ethereum --simulate
```

### 2. Validate Registry

Ensure all deployed contracts are valid and accessible:

```bash
npm run registry:validate
```

This checks:
- ✅ All networks have required contract addresses
- ✅ Contract addresses are properly formatted
- ✅ No duplicate addresses across networks
- ✅ Registry version and timestamp are valid

### 3. Export Logs

Export deployment logs and registry data for analysis:

```typescript
import { exportLogsToJSON, exportLogsToCSV, exportRegistryWithProvenance } from './scripts/exportLogs'

// Export logs as JSON
const jsonPath = exportLogsToJSON('deployment-logs.json')

// Export logs as CSV
const csvPath = exportLogsToCSV('deployment-logs.csv')

// Export registry with full provenance
const provenancePath = exportRegistryWithProvenance('registry-audit.json')
```

Or use the Admin panel UI to export logs interactively.

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
copilot/add-css-for-fallback-viewer

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

#### `deploy.ts`

Main deployment script with automatic registry updates.

```typescript
import { deploy, deployContract, updateRegistryFile } from './scripts/deploy'

// Deploy a contract
await deploy({
  contractType: 'Badge',
  network: 'polygon',
  simulate: true
})

// Deploy contract only (no registry update)
const address = await deployContract('Quest', 'ethereum')

// Update registry manually
updateRegistryFile('polygon', 'Badge', '0x123...')
```

#### `utils/deployer.ts`

Utilities for batch deployments.

```typescript
import { deployAllContracts, deployToMultipleNetworks } from './scripts/utils/deployer'

// Deploy all contracts to one network
const results = await deployAllContracts('polygon')

// Deploy to multiple networks
const networks = ['ethereum', 'polygon', 'arbitrum']
const resultMap = await deployToMultipleNetworks(networks)
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

#### `updateRegistry.ts`
#### `updateRegistry(network, contracts)`

Update registry with new contract addresses.

```typescript
import { updateRegistry, batchUpdateRegistry, backupRegistry } from './scripts/updateRegistry'

// Update single contract
updateRegistry('polygon', {
  badgeContract: '0xNewBadge123'
})

// Batch update
batchUpdateRegistry([
  { network: 'ethereum', badgeContract: '0x...' },
  { network: 'polygon', questContract: '0x...' }
])

// Backup before changes
const backupPath = backupRegistry()
```

#### `validateRegistry.ts`

Validate registry integrity.

```typescript
import { validateRegistry } from './scripts/validateRegistry'

const validation = validateRegistry()

if (validation.valid) {
  console.log('✅ Registry is valid')
} else {
  console.log('❌ Errors:', validation.errors)
  console.log('⚠️  Warnings:', validation.warnings)
}
```

### Log Export

#### `exportLogs.ts`

Export logs and registry data.

```typescript
import { 
  exportLogsToJSON, 
  exportLogsToCSV, 
  exportRegistryWithProvenance,
  exportLogs 
} from './scripts/exportLogs'

// Export as JSON
exportLogsToJSON('logs.json')

// Export as CSV
exportLogsToCSV('logs.csv')

// Export registry with deployment history
exportRegistryWithProvenance('audit.json')

// Flexible export
exportLogs({
  format: 'json',
  outputPath: 'custom-logs.json',
  includeRegistry: true
})
```

## 🌐 Dashboard Integration

The deployment registry integrates seamlessly with the Dashboard UI.

### Viewing Deployed Contracts

```typescript
// pages/Dashboard.tsx
import { loadRegistry, getAvailableNetworks } from './src/config/registryLoader'

function ContractDisplay() {
  const registry = loadRegistry()
  const networks = getAvailableNetworks()
  
  return (
    <div>
      {networks.map(network => {
        const config = registry.networks[network]
        return (
          <div key={network}>
            <h3>{network}</h3>
            <p>Badge: {config.badgeContract}</p>
            <p>Quest: {config.questContract}</p>
            <p>Fallback: {config.fallbackContract}</p>
          </div>
        )
      })}
    </div>
  )
}
```

### Badge Display with Network Info

```typescript
import { getNetworkConfig } from './src/config/registryLoader'

function BadgeCard({ badge }) {
  const network = badge.network || 'polygon'
  const config = getNetworkConfig(network)
  
  return (
    <div className="badge-card">
      <h4>{badge.questId}</h4>
      <p>Network: {network}</p>
      <p>Chain ID: {config.chainId}</p>
      <p>Contract: {badge.contractAddress}</p>
    </div>
  )
}
```

## ⚙️ Admin Panel Integration

The Admin panel provides manual contract management capabilities.

### Manual Registry Updates

```typescript
// pages/Admin.tsx
import { updateRegistry } from './scripts/updateRegistry'

function AdminPanel() {
  const handleUpdateContract = (network, contractType, address) => {
    updateRegistry(network, {
      [`${contractType}Contract`]: address
    })
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleUpdateContract('polygon', 'badge', '0x...')
    }}>
      {/* Form fields */}
    </form>
  )
}
```

### Export Logs from Admin

```typescript
import { exportLogsToJSON, exportLogsToCSV } from './scripts/exportLogs'

function LogExporter() {
  const [format, setFormat] = useState('json')
  
  const handleExport = () => {
    if (format === 'json') {
      exportLogsToJSON()
    } else {
      exportLogsToCSV()
    }
  }
  
  return (
    <div>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>
      <button onClick={handleExport}>Export Logs</button>
    </div>
  )
}
```

## 📊 Data Flow

### Deployment Workflow

```
1. Developer runs deployment script
   ↓
2. Script deploys contract to blockchain
   ↓
3. Contract address is returned
   ↓
4. Registry is automatically updated
   ↓
5. Validation runs to ensure integrity
   ↓
6. Dashboard UI reflects new contracts
   ↓
7. Badge minting uses new addresses
```

### Badge Minting with Registry

```
User completes quest
   ↓
Quest verification passes
   ↓
Badge minting initiated
   ↓
Registry provides contract address for selected network
   ↓
Badge minted on blockchain
   ↓
Transaction logged with network + contract info
   ↓
Badge displayed in Dashboard with provenance
```

## 🧪 Testing

### Running Tests

```bash
# Run all deployment automation tests
npm test tests/autoDeployScripts.test.ts

# Run specific test suites
npm test tests/deployRegistry.test.ts
npm test tests/deployAutomation.test.ts
```

### Test Coverage

The test suite includes:
- ✅ Contract deployment simulation
- ✅ Registry file updates
- ✅ Validation logic
- ✅ Log export functionality
- ✅ Multi-network workflows
- ✅ Error handling and recovery
- ✅ Address validation
- ✅ Batch operations

### Example Test

```typescript
import { deployContract, updateRegistryFile } from './scripts/deploy'
import { validateRegistry } from './scripts/validateRegistry'

test('should deploy contract and update registry', async () => {
  // Deploy contract
  const address = await deployContract('Badge', 'polygon')
  expect(address).toMatch(/^0x/)
  
  // Update registry
  updateRegistryFile('polygon', 'Badge', address)
  
  // Validate
  const validation = validateRegistry()
  expect(validation.valid).toBe(true)
})
```

## 🔐 Security Best Practices

### 1. Validate All Addresses

Always validate contract addresses before updating the registry:

```typescript
import { isValidAddress } from './scripts/utils/deployer'

if (!isValidAddress(contractAddress)) {
  throw new Error('Invalid contract address')
}
```

### 2. Backup Before Changes

Create backups before making registry changes:

```typescript
import { backupRegistry } from './scripts/updateRegistry'

const backupPath = backupRegistry()
console.log(`Backup created: ${backupPath}`)
```

### 3. Use Validation

Always validate the registry after updates:

```bash
npm run registry:validate
```

### 4. Audit Trail

Export logs regularly for audit purposes:

```typescript
exportRegistryWithProvenance(`audit-${Date.now()}.json`)
```

### 5. Access Control

Limit who can run deployment scripts in production:
- Use environment variables for sensitive data
- Implement multi-signature approval for deployments
- Review all registry changes before committing

## 🛡️ Error Handling

### Deployment Failures

```typescript
try {
  await deploy({
    contractType: 'Badge',
    network: 'polygon'
  })
} catch (error) {
  console.error('Deployment failed:', error)
  // Rollback or retry logic
}
```

### Registry Validation Errors

```typescript
const validation = validateRegistry()

if (!validation.valid) {
  validation.errors.forEach(error => {
    console.error(`❌ ${error}`)
  })
  
  // Fix errors before proceeding
  process.exit(1)
}
```

### Network Connectivity Issues

```typescript
import { getNetworkConfig } from './src/config/registryLoader'

try {
  const config = getNetworkConfig('polygon')
  // Use config for deployment
} catch (error) {
  console.error('Network not found in registry')
  // Fallback to default network
}
```
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

1. Deploy contracts to the new network
2. Update `deploy-registry.json`:

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

3. Update TypeScript types in `src/config/registryTypes.ts`:

2. Update `SupportedNetwork` type in `src/config/registryTypes.ts`:
```typescript
export type SupportedNetwork = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism'
```

4. Clear registry cache in tests:

```typescript
import { clearRegistryCache } from './src/config/registryLoader'
clearRegistryCache()
3. Run validation:
```bash
npm run validate-registry
```

### Adding New Contract Types

1. Update `NetworkConfig` interface:

```typescript
export interface NetworkConfig {
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
  rewardContract?: string  // New type
}
```

2. Add deployment support:

```typescript
// In deploy.ts
type ContractType = 'Badge' | 'Quest' | 'Fallback' | 'Reward'
```

3. Update registry getter functions:

```typescript
export function getRewardContract(network: SupportedNetwork): string {
  const config = getNetworkConfig(network)
  if (!config.rewardContract) {
    throw new Error(`Reward contract not defined for ${network}`)
  }
  return config.rewardContract
}
```

### Custom Deployment Workflows

Create custom workflows using the provided utilities:

```typescript
import { deployContract } from './scripts/deploy'
import { updateRegistry } from './scripts/updateRegistry'
import { validateRegistry } from './scripts/validateRegistry'

async function customDeployWorkflow() {
  // Deploy to testnet first
  const testnetAddress = await deployContract('Badge', 'polygon-mumbai')
  
  // Test the contract
  await testContract(testnetAddress)
  
  // Deploy to mainnet
  const mainnetAddress = await deployContract('Badge', 'polygon')
  
  // Update registry
  updateRegistry('polygon', {
    badgeContract: mainnetAddress
  })
  
  // Validate
  const validation = validateRegistry()
  if (!validation.valid) {
    throw new Error('Validation failed')
  }
}
```
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
