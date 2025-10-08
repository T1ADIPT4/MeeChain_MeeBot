import React from 'react'
import './MeeBot.css'

interface MeeBotProps {
  emotion?: 'neutral' | 'happy' | 'confused'
}

const MeeBot: React.FC<MeeBotProps> = ({ emotion = 'neutral' }) => {
  const getEmoji = () => {
    switch (emotion) {
      case 'happy':
        return '😊'
      case 'confused':
        return '😕'
      default:
        return '🤖'
    }
  }

  return (
    <div className={`meebot meebot-${emotion}`}>
      <div className="meebot-sprite">
        {getEmoji()}
      </div>
      <div className="meebot-label">MeeBot</div>
    </div>
  )
}

export default MeeBot
