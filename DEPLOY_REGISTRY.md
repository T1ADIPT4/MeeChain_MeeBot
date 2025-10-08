# Deploy Registry Documentation

## 📋 Overview

The Deploy Registry (`deploy-registry.json`) is the central configuration file for managing **smart contract addresses across multiple blockchain networks** in the MeeChain MeeBot system. It enables fallback-aware badge minting, quest verification, and multi-chain asset management.

## 🎯 Purpose

- **Centralized Contract Management**: Store all deployed contract addresses in one place
- **Multi-Chain Support**: Manage contracts across Ethereum, Polygon, Arbitrum, and more
- **Fallback-Aware**: Separate primary and fallback contract addresses for resilience
- **Version Control**: Track deployment versions and update timestamps
- **Easy Integration**: Simple API for accessing contract addresses in your code

## 📁 File Structure

### Location
```
config/deploy-registry.json
```

### Schema
```json
{
  "version": "1.0.0",
  "networks": {
    "ethereum": {
      "chainId": 1,
      "badgeContract": "0xBadgeEth123",
      "questContract": "0xQuestEth456",
      "fallbackContract": "0xFallbackEth789"
    },
    "polygon": {
      "chainId": 137,
      "badgeContract": "0xBadgePoly123",
      "questContract": "0xQuestPoly456",
      "fallbackContract": "0xFallbackPoly789"
    },
    "arbitrum": {
      "chainId": 42161,
      "badgeContract": "0xBadgeArb123",
      "questContract": "0xQuestArb456",
      "fallbackContract": "0xFallbackArb789"
    }
  },
  "lastUpdated": "2025-10-09T03:00:00Z"
}
```

## 🔧 TypeScript Types

```typescript
interface NetworkConfig {
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
}

interface DeployRegistry {
  version: string
  networks: {
    [networkName: string]: NetworkConfig
  }
  lastUpdated: string
}

type SupportedNetwork = 'ethereum' | 'polygon' | 'arbitrum'
```

## 🚀 Usage

### 1. Load the Registry

```typescript
import { loadRegistry } from './src/config/registryLoader'

const registry = loadRegistry()
console.log(`Version: ${registry.version}`)
console.log(`Networks: ${Object.keys(registry.networks)}`)
```

### 2. Get Network Configuration

```typescript
import { getNetworkConfig } from './src/config/registryLoader'

const config = getNetworkConfig('polygon')
console.log(`Chain ID: ${config.chainId}`)
console.log(`Badge Contract: ${config.badgeContract}`)
```

### 3. Get Specific Contract Addresses

```typescript
import { getBadgeContract, getQuestContract, getFallbackContract } from './src/config/registryLoader'

const polygonBadge = getBadgeContract('polygon')
const ethereumQuest = getQuestContract('ethereum')
const arbitrumFallback = getFallbackContract('arbitrum')
```

### 4. Badge Minting with Registry

```typescript
import { mintBadge, fallbackMintBadge } from './src/minting/badgeMinter'

// Mint on default network (Polygon)
const tx1 = await mintBadge('user-001', 'quest-001')
console.log(`Minted on ${tx1.network} at ${tx1.contractAddress}`)

// Mint on specific network
const tx2 = await mintBadge('user-002', 'quest-002', 'ethereum')
console.log(`Minted on ${tx2.network} at ${tx2.contractAddress}`)

// Fallback minting
const tx3 = await fallbackMintBadge('user-003', 'quest-003')
console.log(`Fallback minted on ${tx3.network} at ${tx3.contractAddress}`)
```

### 5. Configure Networks

```typescript
import { setPrimaryNetwork, setFallbackNetwork } from './src/minting/badgeMinter'

// Set Arbitrum as primary network
setPrimaryNetwork('arbitrum')

// Set Polygon as fallback network
setFallbackNetwork('polygon')
```

## 🔌 Integration Examples

### QuestManager Integration

```typescript
import { handleQuestCompletion } from './QuestManager'
import { getQuestContract } from './config/registryLoader'

const chain = 'polygon'
const questContract = getQuestContract(chain)

// Use quest contract for verification
const result = await handleQuestCompletion('user-id', 'quest-id')
if (result.success) {
  console.log(`Badge minted! Network: ${result.tx?.network}`)
  console.log(`Contract: ${result.tx?.contractAddress}`)
}
```

### RewardTracker Integration

```typescript
import { getNetworkConfig } from './config/registryLoader'

function displayBadgeOrigin(badge: Badge) {
  const network = badge.network || 'polygon'
  const config = getNetworkConfig(network)
  
  console.log(`Badge Origin:`)
  console.log(`  Network: ${network}`)
  console.log(`  Chain ID: ${config.chainId}`)
  console.log(`  Contract: ${badge.contractAddress}`)
}
```

### Admin Panel Integration

```typescript
import { getAvailableNetworks, getBadgeContract } from './config/registryLoader'

function AdminContractPanel() {
  const networks = getAvailableNetworks()
  
  return (
    <div>
      <h2>Deployed Contracts</h2>
      {networks.map(network => (
        <div key={network}>
          <h3>{network}</h3>
          <p>Badge: {getBadgeContract(network)}</p>
        </div>
      ))}
    </div>
  )
}
```

## 🛠️ API Reference

### Registry Loader Functions

#### `loadRegistry(): DeployRegistry`
Load the complete deployment registry from file. Result is cached.

#### `getNetworkConfig(network: SupportedNetwork): NetworkConfig`
Get full configuration for a specific network.

#### `getBadgeContract(network: SupportedNetwork): string`
Get badge contract address for a network.

#### `getQuestContract(network: SupportedNetwork): string`
Get quest contract address for a network.

#### `getFallbackContract(network: SupportedNetwork): string`
Get fallback contract address for a network.

#### `getAvailableNetworks(): string[]`
Get list of all available networks.

#### `getRegistryVersion(): string`
Get the registry version.

#### `clearRegistryCache(): void`
Clear the cached registry (useful for testing).

### Badge Minter Functions

#### `mintBadge(userId: string, questId: string, network?: SupportedNetwork): Promise<BadgeTransaction>`
Mint a badge on the primary chain. Optionally specify network.

#### `fallbackMintBadge(userId: string, questId: string, network?: SupportedNetwork): Promise<BadgeTransaction>`
Mint a badge on the fallback chain. Optionally specify network.

#### `setPrimaryNetwork(network: SupportedNetwork): void`
Set the default primary network for minting.

#### `setFallbackNetwork(network: SupportedNetwork): void`
Set the default fallback network for minting.

#### `getPrimaryNetwork(): SupportedNetwork`
Get the current primary network.

#### `getFallbackNetwork(): SupportedNetwork`
Get the current fallback network.

## 📊 Badge Transaction Object

When minting badges, the transaction object now includes registry information:

```typescript
interface BadgeTransaction {
  txHash: string
  userId: string
  questId: string
  badgeId: string
  timestamp: Date
  chain: 'primary' | 'fallback'
  contractAddress?: string  // From registry
  network?: SupportedNetwork // From registry
}
```

## 🧪 Testing

The deploy registry system includes comprehensive tests. Run:

```bash
npm test tests/deployRegistry.test.ts
```

Test coverage includes:
- ✅ Registry loading and caching
- ✅ Network configuration retrieval
- ✅ Contract address getters
- ✅ Badge minting with registry integration
- ✅ Network configuration setters
- ✅ Error handling for invalid networks

## 🎨 Extending the System

### Adding a New Network

1. Edit `config/deploy-registry.json`:
```json
{
  "version": "1.1.0",
  "networks": {
    "ethereum": { ... },
    "polygon": { ... },
    "arbitrum": { ... },
    "optimism": {
      "chainId": 10,
      "badgeContract": "0xBadgeOp123",
      "questContract": "0xQuestOp456",
      "fallbackContract": "0xFallbackOp789"
    }
  },
  "lastUpdated": "2025-10-10T00:00:00Z"
}
```

2. Update `SupportedNetwork` type in `src/config/registryTypes.ts`:
```typescript
export type SupportedNetwork = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism'
```

3. Clear the registry cache in tests:
```typescript
import { clearRegistryCache } from './config/registryLoader'
clearRegistryCache()
```

### Adding New Contract Types

1. Update `NetworkConfig` interface:
```typescript
export interface NetworkConfig {
  chainId: number
  badgeContract: string
  questContract: string
  fallbackContract: string
  rewardContract?: string  // New contract type
}
```

2. Add getter function:
```typescript
export function getRewardContract(network: SupportedNetwork): string {
  const config = getNetworkConfig(network)
  if (!config.rewardContract) {
    throw new Error(`Reward contract not defined for ${network}`)
  }
  return config.rewardContract
}
```

## 📝 Best Practices

1. **Always use the registry** instead of hardcoding contract addresses
2. **Version your deployments** by updating the version field
3. **Update timestamps** when modifying the registry
4. **Clear cache in tests** to avoid stale data
5. **Use TypeScript types** for type safety
6. **Handle errors** for unknown networks
7. **Document changes** when adding new networks or contracts

## 🔄 Fallback Flow with Registry

```
User completes quest
       ↓
Verify conditions ──→ Failed ──→ Return error
       ↓ Passed
Try primary mint (using getBadgeContract(primaryNetwork))
       ↓
    Success? ──→ Yes ──→ Return success with network info
       ↓ No
Try fallback mint (using getFallbackContract(fallbackNetwork))
       ↓
    Success? ──→ Yes ──→ Return success with fallback flag + network info
       ↓ No
   Return error
```

## 📚 Examples

Run the comprehensive example:

```bash
npm run demo:deploy-registry
```

This demonstrates:
- Loading and inspecting the registry
- Getting network configurations
- Retrieving contract addresses
- Minting with default and specific networks
- Fallback minting
- Configuring custom networks
- QuestManager integration patterns

## 🔗 Related Documentation

- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest system overview
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## 📄 License

MIT License - See LICENSE file for details
