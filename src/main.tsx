import React from 'react'
import ReactDOM from 'react-dom/client'

// This is a placeholder for your dashboard component
// We will need to create this file and component.
// For now, let's just render a simple message.

function Dashboard() {
  return <h1>MeeChain Dashboard</h1>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>,
)
