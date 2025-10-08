# Integration Guide: MeeChain Quest System

This guide shows how to integrate the fallback-aware Quest System into your MeeChain application.

## 🔌 Integration Scenarios

### 1. React Component Integration

```tsx
// components/QuestCompletion.tsx
import React, { useState } from 'react'
import { handleQuestCompletion } from '../src/QuestManager'
import { updateUserProgress } from '../src/verifiers/questVerifier'

interface Props {
  userId: string
  questId: string
}

export const QuestCompletion: React.FC<Props> = ({ userId, questId }) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [meeBotEmotion, setMeeBotEmotion] = useState('neutral')
  const [ttsMessage, setTtsMessage] = useState('')

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      const completionResult = await handleQuestCompletion(userId, questId)
      setResult(completionResult)

      if (completionResult.success) {
        if (completionResult.fallback) {
          setMeeBotEmotion('confused')
          setTtsMessage('ระบบ fallback ทำงานแล้วนะครับ')
        } else {
          setMeeBotEmotion('happy')
          setTtsMessage('เควสสำเร็จ! ได้รับ badge แล้ว')
        }
      } else {
        setMeeBotEmotion('sad')
        setTtsMessage('เควสยังไม่สำเร็จนะครับ')
      }
    } catch (error) {
      console.error(error)
      setMeeBotEmotion('error')
      setTtsMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quest-completion">
      <MeeBotSprite emotion={meeBotEmotion} />
      <button onClick={handleComplete} disabled={loading}>
        {loading ? 'Processing...' : 'Complete Quest'}
      </button>
      {ttsMessage && <TTSPlayer message={ttsMessage} />}
      {result && (
        <div className="result">
          {result.success ? (
            <div className="success">
              ✅ Badge Minted!
              <br />
              TX: {result.tx?.txHash}
              {result.fallback && <span> (via fallback)</span>}
            </div>
          ) : (
            <div className="error">
              ❌ {result.reason}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### 2. Quest Progress Tracking Hook

```tsx
// hooks/useQuestProgress.ts
import { useState, useEffect } from 'react'
import { getUserProgress, updateUserProgress } from '../src/verifiers/questVerifier'

export function useQuestProgress(userId: string, questId: string) {
  const [progress, setProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    const currentProgress = getUserProgress(userId, questId)
    setProgress(currentProgress)
  }, [userId, questId])

  const incrementProgress = (conditionType: string, amount: number = 1) => {
    updateUserProgress(userId, questId, conditionType, amount)
    const newProgress = getUserProgress(userId, questId)
    setProgress(newProgress)
  }

  return { progress, incrementProgress }
}

// Usage in component:
const { progress, incrementProgress } = useQuestProgress(userId, questId)

// Track user actions
<button onClick={() => incrementProgress('login', 1)}>
  Login
</button>
```

### 3. Event Log Viewer Component

```tsx
// components/QuestLogViewer.tsx
import React, { useState, useEffect } from 'react'
import { getLogs, getLogsByType, LogEvent } from '../src/utils/logger'

export const QuestLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEvent[]>([])
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const interval = setInterval(() => {
      const allLogs = filter === 'all' 
        ? getLogs() 
        : getLogsByType(filter)
      setLogs(allLogs)
    }, 1000)

    return () => clearInterval(interval)
  }, [filter])

  return (
    <div className="log-viewer">
      <h3>Quest Event Logs</h3>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Events</option>
        <option value="badge-minted">Badge Minted</option>
        <option value="badge-mint-failed">Mint Failures</option>
        <option value="badge-fallback-minted">Fallback Mints</option>
      </select>
      
      <div className="log-list">
        {logs.map((log, i) => (
          <div key={i} className={`log-entry ${log.level}`}>
            <span className="timestamp">
              {log.timestamp.toLocaleTimeString()}
            </span>
            <span className="event-type">{log.eventType}</span>
            <pre>{JSON.stringify(log.context, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. Admin Dashboard Integration

```tsx
// components/AdminQuestMonitor.tsx
import React, { useState } from 'react'
import { 
  setPrimaryMintingStatus, 
  setFallbackMintingStatus 
} from '../src/minting/badgeMinter'
import { getLogs, getLogsByLevel } from '../src/utils/logger'

export const AdminQuestMonitor: React.FC = () => {
  const [primaryEnabled, setPrimaryEnabled] = useState(true)
  const [fallbackEnabled, setFallbackEnabled] = useState(true)

  const togglePrimary = () => {
    const newStatus = !primaryEnabled
    setPrimaryMintingStatus(newStatus)
    setPrimaryEnabled(newStatus)
  }

  const toggleFallback = () => {
    const newStatus = !fallbackEnabled
    setFallbackMintingStatus(newStatus)
    setFallbackEnabled(newStatus)
  }

  const errorLogs = getLogsByLevel('error')
  const warnLogs = getLogsByLevel('warn')

  return (
    <div className="admin-monitor">
      <h2>Quest System Monitor</h2>
      
      <div className="chain-controls">
        <button onClick={togglePrimary}>
          Primary Chain: {primaryEnabled ? '✅ ON' : '❌ OFF'}
        </button>
        <button onClick={toggleFallback}>
          Fallback Chain: {fallbackEnabled ? '✅ ON' : '❌ OFF'}
        </button>
      </div>

      <div className="stats">
        <div className="stat-card error">
          <h3>Errors</h3>
          <div className="count">{errorLogs.length}</div>
        </div>
        <div className="stat-card warning">
          <h3>Warnings</h3>
          <div className="count">{warnLogs.length}</div>
        </div>
      </div>
    </div>
  )
}
```

### 5. Blockchain Integration (Web3)

```typescript
// minting/web3BadgeMinter.ts
import { ethers } from 'ethers'
import { logEvent } from '../utils/logger'
import { getBadgeContract, getFallbackContract, type SupportedNetwork } from '../config/registryLoader'

const BADGE_CONTRACT_ABI = [/* your ABI */]
const PRIMARY_CHAIN_RPC = 'https://rpc.meechain.io'
const FALLBACK_CHAIN_RPC = 'https://fallback.meechain.io'

// Default networks
const DEFAULT_PRIMARY_NETWORK: SupportedNetwork = 'polygon'
const DEFAULT_FALLBACK_NETWORK: SupportedNetwork = 'ethereum'

export async function mintBadgeOnChain(
  userId: string,
  questId: string,
  chainUrl: string,
  contractAddress: string
): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(chainUrl)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(
      contractAddress,
      BADGE_CONTRACT_ABI,
      signer
    )

    const tx = await contract.mintQuestBadge(userId, questId)
    await tx.wait()
    
    logEvent('blockchain-mint-success', {
      userId,
      questId,
      txHash: tx.hash,
      chain: chainUrl,
      contractAddress
    })

    return tx.hash
  } catch (error) {
    logEvent('blockchain-mint-error', {
      userId,
      questId,
      error: String(error),
      chain: chainUrl,
      contractAddress
    }, 'error')
    throw error
  }
}

// Replace the mock implementations in badgeMinter.ts:
export async function mintBadge(userId: string, questId: string, network?: SupportedNetwork) {
  const targetNetwork = network || DEFAULT_PRIMARY_NETWORK
  const contractAddress = getBadgeContract(targetNetwork)
  return mintBadgeOnChain(userId, questId, PRIMARY_CHAIN_RPC, contractAddress)
}

export async function fallbackMintBadge(userId: string, questId: string, network?: SupportedNetwork) {
  const targetNetwork = network || DEFAULT_FALLBACK_NETWORK
  const contractAddress = getFallbackContract(targetNetwork)
  return mintBadgeOnChain(userId, questId, FALLBACK_CHAIN_RPC, contractAddress)
}
```

### 6. Firebase/Database Integration

```typescript
// verifiers/databaseQuestVerifier.ts
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { logEvent } from '../utils/logger'

const db = getFirestore()

export async function verifyQuestConditionsFromDB(
  userId: string,
  questId: string
): Promise<boolean> {
  try {
    const questRef = doc(db, 'quests', questId)
    const questSnap = await getDoc(questRef)
    
    if (!questSnap.exists()) {
      logEvent('quest-not-found-db', { userId, questId }, 'warn')
      return false
    }

    const quest = questSnap.data()
    const userProgressRef = doc(db, 'userProgress', `${userId}-${questId}`)
    const progressSnap = await getDoc(userProgressRef)
    const userProgress = progressSnap.exists() ? progressSnap.data() : {}

    // Verify all conditions
    for (const condition of quest.conditions) {
      const completed = userProgress[condition.type] || 0
      if (completed < condition.required) {
        logEvent('quest-condition-not-met-db', {
          userId,
          questId,
          condition: condition.type,
          required: condition.required,
          completed
        })
        return false
      }
    }

    return true
  } catch (error) {
    logEvent('quest-verification-db-error', {
      userId,
      questId,
      error: String(error)
    }, 'error')
    return false
  }
}
```

## 🎨 CSS Styling Examples

```css
/* components/QuestCompletion.css */
.quest-completion {
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quest-completion button {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.quest-completion button:hover {
  transform: scale(1.05);
}

.quest-completion button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
}

.result.success {
  background: rgba(76, 175, 80, 0.2);
  border: 2px solid #4caf50;
}

.result.error {
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid #f44336;
}

/* Log Viewer */
.log-viewer {
  font-family: monospace;
  max-height: 400px;
  overflow-y: auto;
}

.log-entry {
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
  border-left: 4px solid;
}

.log-entry.info {
  border-left-color: #2196f3;
  background: #e3f2fd;
}

.log-entry.warn {
  border-left-color: #ff9800;
  background: #fff3e0;
}

.log-entry.error {
  border-left-color: #f44336;
  background: #ffebee;
}
```

## 🔐 Environment Variables

```bash
# .env
# Note: Contract addresses are now centrally managed in config/deploy-registry.json
# These are only needed for runtime configuration if you want to override defaults
PRIMARY_CHAIN_RPC=https://rpc.meechain.io
FALLBACK_CHAIN_RPC=https://fallback.meechain.io
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
```

**Note**: Contract addresses are now managed via the Deploy Registry (`config/deploy-registry.json`). See [DEPLOY_REGISTRY.md](./DEPLOY_REGISTRY.md) for details.

## 📱 Mobile/Responsive Considerations

```tsx
// Use this hook for responsive MeeBot sprites
import { useState, useEffect } from 'react'

export function useResponsiveMeeBot() {
  const [size, setSize] = useState('large')

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSize('small')
      } else if (window.innerWidth < 1024) {
        setSize('medium')
      } else {
        setSize('large')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
```

## 🧪 Testing Integration

```typescript
// __tests__/questIntegration.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals'
import { handleQuestCompletion } from '../src/QuestManager'
import { updateUserProgress } from '../src/verifiers/questVerifier'
import { setPrimaryMintingStatus } from '../src/minting/badgeMinter'
import { clearLogs } from '../src/utils/logger'

describe('Quest Integration Tests', () => {
  beforeEach(() => {
    clearLogs()
    setPrimaryMintingStatus(true)
  })

  it('should complete quest successfully', async () => {
    const userId = 'test-user-1'
    const questId = 'quest-001'

    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)

    const result = await handleQuestCompletion(userId, questId)

    expect(result.success).toBe(true)
    expect(result.tx).toBeDefined()
    expect(result.fallback).toBeUndefined()
  })

  it('should use fallback when primary fails', async () => {
    setPrimaryMintingStatus(false)
    
    const userId = 'test-user-2'
    const questId = 'quest-001'

    updateUserProgress(userId, questId, 'login', 1)
    updateUserProgress(userId, questId, 'profile-setup', 1)

    const result = await handleQuestCompletion(userId, questId)

    expect(result.success).toBe(true)
    expect(result.fallback).toBe(true)
  })
})
```

## 📊 Monitoring & Analytics

```typescript
// analytics/questAnalytics.ts
import { getLogs, getLogsByType } from '../src/utils/logger'

export function getQuestAnalytics() {
  const allLogs = getLogs()
  const mintSuccesses = getLogsByType('badge-minted').length
  const mintFailures = getLogsByType('badge-mint-failed').length
  const fallbackMints = getLogsByType('badge-fallback-minted').length
  
  return {
    totalEvents: allLogs.length,
    mintSuccesses,
    mintFailures,
    fallbackMints,
    primarySuccessRate: mintSuccesses / (mintSuccesses + mintFailures),
    fallbackUsageRate: fallbackMints / (mintSuccesses + fallbackMints)
  }
}
```

## 🚀 Next Steps

1. Replace mock implementations with actual blockchain calls
2. Connect to your Firebase/database
3. Integrate with existing MeeBot sprite system
4. Add TTS API integration (Gemini API)
5. Implement user authentication
6. Add rate limiting for quest completion
7. Set up monitoring dashboards

---

For questions or issues, please refer to [QUEST_SYSTEM.md](./QUEST_SYSTEM.md)
