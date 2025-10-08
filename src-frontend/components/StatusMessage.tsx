import React from 'react'
import './StatusMessage.css'

interface StatusMessageProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type = 'info' }) => {
  return (
    <div className={`status-message status-${type}`}>
      {message}
    </div>
  )
}

export default StatusMessage
