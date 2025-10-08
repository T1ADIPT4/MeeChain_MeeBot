import React from 'react'
import AppRoutes from './routes'
import Navigation from './components/Navigation'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
