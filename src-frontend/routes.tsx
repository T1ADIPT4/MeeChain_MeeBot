import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MintBadgePage from './pages/MintBadgePage'
import NFTFootballPage from './pages/NFTFootballPage'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'
import HomePage from './pages/HomePage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mint" element={<MintBadgePage />} />
      <Route path="/nft-football" element={<NFTFootballPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  )
}

export default AppRoutes
