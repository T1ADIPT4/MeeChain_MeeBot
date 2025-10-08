import React, { useState } from 'react'
import MeeBot from '../components/MeeBot'
import StatusMessage from '../components/StatusMessage'
import './MintBadgePage.css'

const MintBadgePage: React.FC = () => {
  const [userId, setUserId] = useState('')
  const [questId, setQuestId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [meeBotEmotion, setMeeBotEmotion] = useState<'neutral' | 'happy' | 'confused'>('neutral')
  const [statusMessage, setStatusMessage] = useState('')

  const handleMintBadge = async () => {
    if (!userId || !questId) {
      setStatusMessage('⚠️ Please enter both User ID and Quest ID')
      setMeeBotEmotion('confused')
      return
    }

    setLoading(true)
    setMeeBotEmotion('neutral')
    setStatusMessage('Processing badge minting...')

    try {
      // Simulate minting process (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful result
      const mockResult = {
        success: true,
        tx: { txHash: '0x' + Math.random().toString(16).slice(2, 15) },
        fallback: false
      }

      setResult(mockResult)
      setMeeBotEmotion('happy')
      setStatusMessage('✅ Badge minted successfully!')
    } catch (error) {
      setResult({ success: false, error: String(error) })
      setMeeBotEmotion('confused')
      setStatusMessage('❌ Minting failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container mint-page">
      <header className="page-header">
        <h1>🏆 Mint Quest Badge</h1>
        <p className="subtitle">Complete quests and earn your badges on the blockchain</p>
      </header>

      <div className="mint-content">
        <div className="mint-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              id="userId"
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="questId">Quest ID</label>
            <input
              id="questId"
              type="text"
              placeholder="Enter quest ID"
              value={questId}
              onChange={(e) => setQuestId(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            onClick={handleMintBadge} 
            disabled={loading}
            className="mint-button"
          >
            {loading ? 'Minting...' : 'Mint Badge'}
          </button>
        </div>

        <div className="mint-feedback">
          <MeeBot emotion={meeBotEmotion} />
          {statusMessage && <StatusMessage message={statusMessage} />}
          
          {result && (
            <div className={`result ${result.success ? 'success' : 'error'}`}>
              {result.success ? (
                <>
                  <h3>✅ Success!</h3>
                  <p>Transaction Hash: {result.tx?.txHash}</p>
                  {result.fallback && <p className="fallback-notice">⚠️ Minted on fallback chain</p>}
                </>
              ) : (
                <>
                  <h3>❌ Failed</h3>
                  <p>{result.error}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MintBadgePage
