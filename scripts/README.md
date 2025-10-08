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
