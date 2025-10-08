import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

const Navigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🤖 MeeChain MeeBot</h1>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/mint" className={isActive('/mint')}>
              Mint Badge
            </Link>
          </li>
          <li>
            <Link to="/nft-football" className={isActive('/nft-football')}>
              NFT Football
            </Link>
          </li>
          <li>
            <Link to="/settings" className={isActive('/settings')}>
              Settings
            </Link>
          </li>
          <li>
            <Link to="/support" className={isActive('/support')}>
              Support
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
