import React, { useState } from 'react'
import MeeBot from '../components/MeeBot'
import StatusMessage from '../components/StatusMessage'
import { fallbackAwareMint } from '../utils/fallbackAwareMint'
import { useMeeBotSpeech } from '../hooks/useMeeBotSpeech'
import './MintBadgePage.css'

const MintBadgePage: React.FC = () => {
  const [userId, setUserId] = useState('')
  const [questId, setQuestId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [meeBotEmotion, setMeeBotEmotion] = useState<'neutral' | 'happy' | 'confused'>('neutral')
  const [statusMessage, setStatusMessage] = useState('')
  const { speak } = useMeeBotSpeech()

  const handleMintBadge = async () => {
    if (!userId || !questId) {
      setStatusMessage('⚠️ Please enter both User ID and Quest ID')
      setMeeBotEmotion('confused')
      speak('กรุณากรอก User ID และ Quest ID ให้ครบถ้วนครับ')
      return
    }

    setLoading(true)
    setMeeBotEmotion('neutral')
    setStatusMessage('Processing badge minting...')
    speak('กำลังดำเนินการ mint badge ให้คุณครับ')

    try {
      const mintResult = await fallbackAwareMint(userId, questId)
      
      setResult(mintResult)
      
      if (mintResult.success) {
        setMeeBotEmotion('happy')
        setStatusMessage(mintResult.message)
        
        if (mintResult.usedFallback) {
          speak('ระบบ fallback ทำงานสำเร็จครับ Badge ของคุณพร้อมแล้ว')
        } else {
          speak('ยินดีด้วยครับ! Mint badge สำเร็จแล้วครับ')
        }
      } else {
        setMeeBotEmotion('confused')
        setStatusMessage(mintResult.message)
        speak('ขออภัยครับ การ mint ล้มเหลว กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      setResult({ success: false, error: String(error) })
      setMeeBotEmotion('confused')
      setStatusMessage('❌ Minting failed. Please try again.')
      speak('เกิดข้อผิดพลาดครับ กรุณาลองใหม่อีกครั้ง')
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
                  {result.usedFallback && <p className="fallback-notice">⚠️ Minted on fallback chain</p>}
                </>
              ) : (
                <>
                  <h3>❌ Failed</h3>
                  <p>{result.message || result.error}</p>
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
