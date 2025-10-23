/**
 * MeeBot Web3 Backend API Integration Demo
 * Demonstrates how to integrate with the API from various platforms
 */

console.log('\n🎯 MeeBot Web3 Backend API Integration Demo\n');
console.log('='.repeat(80));

// ============================================================================
// 1. BASIC USAGE
// ============================================================================

console.log('\n📋 1. Basic Usage\n');

console.log('Start the API server:');
console.log('  $ npm run api:dev');
console.log('');

console.log('The server will be available at:');
console.log('  http://localhost:3000');
console.log('');

// ============================================================================
// 2. CURL EXAMPLES
// ============================================================================

console.log('='.repeat(80));
console.log('\n📡 2. cURL Examples\n');

console.log('Health Check:');
console.log('  $ curl http://localhost:3000/health');
console.log('');

console.log('Confirm Replay:');
console.log(`  $ curl -X POST http://localhost:3000/api/meechain/trigger \\
    -H "Content-Type: application/json" \\
    -d '{
      "userAddress": "0x1234567890123456789012345678901234567890",
      "action": "replay",
      "amountBNB": "0.01"
    }'`);
console.log('');

console.log('Trigger Supply:');
console.log(`  $ curl -X POST http://localhost:3000/api/meechain/trigger \\
    -H "Content-Type: application/json" \\
    -d '{
      "userAddress": "0x1234567890123456789012345678901234567890",
      "action": "supply"
    }'`);
console.log('');

console.log('Process Refund:');
console.log(`  $ curl -X POST http://localhost:3000/api/meechain/trigger \\
    -H "Content-Type: application/json" \\
    -d '{
      "userAddress": "0x1234567890123456789012345678901234567890",
      "action": "refund"
    }'`);
console.log('');

// ============================================================================
// 3. JAVASCRIPT/TYPESCRIPT CLIENT
// ============================================================================

console.log('='.repeat(80));
console.log('\n💻 3. JavaScript/TypeScript Client\n');

console.log(`import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Type definitions
interface TriggerRequest {
  userAddress: string;
  action: 'replay' | 'supply' | 'refund';
  amountBNB?: string;
}

interface TriggerResponse {
  success: boolean;
  message: string;
  txHash?: string;
  error?: string;
}

// API client class
class MeeChainAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async health(): Promise<any> {
    const response = await axios.get(\`\${this.baseUrl}/health\`);
    return response.data;
  }

  async confirmReplay(
    userAddress: string,
    amountBNB: string
  ): Promise<TriggerResponse> {
    const response = await axios.post(
      \`\${this.baseUrl}/api/meechain/trigger\`,
      {
        userAddress,
        action: 'replay',
        amountBNB
      }
    );
    return response.data;
  }

  async triggerSupply(userAddress: string): Promise<TriggerResponse> {
    const response = await axios.post(
      \`\${this.baseUrl}/api/meechain/trigger\`,
      {
        userAddress,
        action: 'supply'
      }
    );
    return response.data;
  }

  async refund(userAddress: string): Promise<TriggerResponse> {
    const response = await axios.post(
      \`\${this.baseUrl}/api/meechain/trigger\`,
      {
        userAddress,
        action: 'refund'
      }
    );
    return response.data;
  }
}

// Usage example
async function main() {
  const api = new MeeChainAPI();

  try {
    // Check health
    const health = await api.health();
    console.log('Server status:', health.status);

    // Confirm replay
    const replay = await api.confirmReplay(
      '0x1234567890123456789012345678901234567890',
      '0.01'
    );
    console.log('Replay confirmed:', replay.txHash);

    // Trigger supply
    const supply = await api.triggerSupply(
      '0x1234567890123456789012345678901234567890'
    );
    console.log('Supply triggered:', supply.txHash);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data?.error);
    } else {
      console.error('Error:', error);
    }
  }
}

main();
`);

// ============================================================================
// 4. REACT INTEGRATION
// ============================================================================

console.log('='.repeat(80));
console.log('\n⚛️  4. React Integration\n');

console.log(`import React, { useState } from 'react';
import axios from 'axios';

function MeeChainSupply() {
  const [userAddress, setUserAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const confirmReplay = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/meechain/trigger',
        {
          userAddress,
          action: 'replay',
          amountBNB: amount
        }
      );
      
      setTxHash(response.data.txHash);
      alert(\`✅ Replay confirmed! TX: \${response.data.txHash}\`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const triggerSupply = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/meechain/trigger',
        {
          userAddress,
          action: 'supply'
        }
      );
      
      setTxHash(response.data.txHash);
      alert(\`✅ Supply triggered! TX: \${response.data.txHash}\`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meechain-supply">
      <h2>MeeChain Supply</h2>
      
      <input
        type="text"
        placeholder="User Address (0x...)"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Amount (BNB)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <button onClick={confirmReplay} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Replay'}
      </button>
      
      <button onClick={triggerSupply} disabled={loading}>
        {loading ? 'Processing...' : 'Trigger Supply'}
      </button>
      
      {error && <div className="error">{error}</div>}
      {txHash && <div className="success">TX: {txHash}</div>}
    </div>
  );
}

export default MeeChainSupply;
`);

// ============================================================================
// 5. NODE-RED FLOW
// ============================================================================

console.log('='.repeat(80));
console.log('\n🔄 5. Node-RED Flow Integration\n');

console.log(`// Custom Node-RED node for MeeChain trigger
module.exports = function(RED) {
  function MeeChainTriggerNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', async function(msg) {
      const axios = require('axios');
      
      try {
        const response = await axios.post(
          'http://localhost:3000/api/meechain/trigger',
          {
            userAddress: msg.payload.userAddress,
            action: msg.payload.action,
            amountBNB: msg.payload.amountBNB
          }
        );
        
        msg.payload = response.data;
        node.status({ fill: 'green', shape: 'dot', text: 'success' });
        node.send(msg);
      } catch (error) {
        node.status({ fill: 'red', shape: 'ring', text: 'error' });
        node.error(error.response?.data?.error || error.message);
      }
    });
  }
  
  RED.nodes.registerType('meechain-trigger', MeeChainTriggerNode);
};

// Flow example:
[
  {
    "id": "inject1",
    "type": "inject",
    "payload": "{
      \\"userAddress\\": \\"0x1234567890123456789012345678901234567890\\",
      \\"action\\": \\"replay\\",
      \\"amountBNB\\": \\"0.01\\"
    }",
    "wires": [["meechain1"]]
  },
  {
    "id": "meechain1",
    "type": "meechain-trigger",
    "wires": [["debug1"]]
  },
  {
    "id": "debug1",
    "type": "debug"
  }
]
`);

// ============================================================================
// 6. PYTHON CLIENT
// ============================================================================

console.log('='.repeat(80));
console.log('\n🐍 6. Python Client\n');

console.log(`import requests
import json

class MeeChainAPI:
    def __init__(self, base_url='http://localhost:3000'):
        self.base_url = base_url
    
    def health(self):
        response = requests.get(f'{self.base_url}/health')
        return response.json()
    
    def confirm_replay(self, user_address, amount_bnb):
        response = requests.post(
            f'{self.base_url}/api/meechain/trigger',
            json={
                'userAddress': user_address,
                'action': 'replay',
                'amountBNB': amount_bnb
            }
        )
        return response.json()
    
    def trigger_supply(self, user_address):
        response = requests.post(
            f'{self.base_url}/api/meechain/trigger',
            json={
                'userAddress': user_address,
                'action': 'supply'
            }
        )
        return response.json()
    
    def refund(self, user_address):
        response = requests.post(
            f'{self.base_url}/api/meechain/trigger',
            json={
                'userAddress': user_address,
                'action': 'refund'
            }
        )
        return response.json()

# Usage
if __name__ == '__main__':
    api = MeeChainAPI()
    
    # Check health
    health = api.health()
    print(f"Server status: {health['status']}")
    
    # Confirm replay
    result = api.confirm_replay(
        '0x1234567890123456789012345678901234567890',
        '0.01'
    )
    print(f"Replay confirmed: {result['txHash']}")
`);

// ============================================================================
// 7. WEBHOOK INTEGRATION
// ============================================================================

console.log('='.repeat(80));
console.log('\n🪝 7. Webhook Integration\n');

console.log(`// Example: Trigger supply when webhook receives notification
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/webhook/replay-verified', async (req, res) => {
  const { userAddress, amount } = req.body;
  
  try {
    // Confirm replay on MeeChain
    const response = await axios.post(
      'http://localhost:3000/api/meechain/trigger',
      {
        userAddress,
        action: 'replay',
        amountBNB: amount
      }
    );
    
    res.json({
      success: true,
      txHash: response.data.txHash
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(4000, () => {
  console.log('Webhook server running on port 4000');
});
`);

// ============================================================================
// 8. COMPLETE WORKFLOW EXAMPLE
// ============================================================================

console.log('='.repeat(80));
console.log('\n🔄 8. Complete Workflow Example\n');

console.log(`// Complete flow from frontend to blockchain
import axios from 'axios';

async function completeSupplyFlow(userAddress: string, amountBNB: string) {
  const API_URL = 'http://localhost:3000/api/meechain/trigger';
  
  try {
    // Step 1: User initiates replay
    console.log('Step 1: User initiates replay verification...');
    
    // Step 2: Confirm replay (off-chain verification done by MeeBot)
    console.log('Step 2: Confirming replay on-chain...');
    const replayResponse = await axios.post(API_URL, {
      userAddress,
      action: 'replay',
      amountBNB
    });
    
    console.log(\`✅ Replay confirmed: \${replayResponse.data.txHash}\`);
    
    // Step 3: Wait for user to claim
    console.log('Step 3: Waiting for user to claim tokens...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 4: Trigger supply
    console.log('Step 4: Triggering token supply...');
    const supplyResponse = await axios.post(API_URL, {
      userAddress,
      action: 'supply'
    });
    
    console.log(\`✅ Supply triggered: \${supplyResponse.data.txHash}\`);
    console.log('✅ Workflow completed successfully!');
    
    return {
      replayTx: replayResponse.data.txHash,
      supplyTx: supplyResponse.data.txHash
    };
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    
    // Step 5: If failed, trigger refund
    console.log('Step 5: Triggering refund...');
    const refundResponse = await axios.post(API_URL, {
      userAddress,
      action: 'refund'
    });
    
    console.log(\`✅ Refund issued: \${refundResponse.data.txHash}\`);
    throw error;
  }
}

// Run the workflow
completeSupplyFlow(
  '0x1234567890123456789012345678901234567890',
  '0.01'
).then(result => {
  console.log('Success:', result);
}).catch(error => {
  console.error('Failed:', error);
});
`);

// ============================================================================
// FOOTER
// ============================================================================

console.log('='.repeat(80));
console.log('\n📚 Additional Resources:\n');
console.log('- API Documentation: api/README.md');
console.log('- Type Definitions: api/types/index.ts');
console.log('- Contract ABI: api/abi/MeeChainSupply.json');
console.log('- Tests: tests/meebotAPI.test.ts');
console.log('');
console.log('🚀 Start the server:');
console.log('  $ npm run api:dev');
console.log('');
console.log('='.repeat(80));
console.log('');
