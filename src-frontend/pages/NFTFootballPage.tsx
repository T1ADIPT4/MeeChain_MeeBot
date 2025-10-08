import React from 'react'
import './NFTFootballPage.css'

const NFTFootballPage: React.FC = () => {
  const mockNFTs = [
    { id: 1, name: 'Golden Boot', rarity: 'Legendary', image: '⚽' },
    { id: 2, name: 'Team Captain', rarity: 'Epic', image: '🎖️' },
    { id: 3, name: 'First Goal', rarity: 'Rare', image: '🥅' },
    { id: 4, name: 'Hat Trick Hero', rarity: 'Epic', image: '🏆' },
    { id: 5, name: 'Clean Sheet', rarity: 'Rare', image: '🛡️' },
    { id: 6, name: 'MVP Award', rarity: 'Legendary', image: '👑' },
  ]

  return (
    <div className="page-container nft-page">
      <header className="page-header">
        <h1>⚽ NFT Football Collection</h1>
        <p className="subtitle">Exclusive football-themed NFTs for your achievements</p>
      </header>

      <div className="nft-grid">
        {mockNFTs.map((nft) => (
          <div key={nft.id} className={`nft-card rarity-${nft.rarity.toLowerCase()}`}>
            <div className="nft-image">{nft.image}</div>
            <div className="nft-info">
              <h3>{nft.name}</h3>
              <span className="nft-rarity">{nft.rarity}</span>
            </div>
            <button className="mint-nft-button">Mint NFT</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NFTFootballPage
