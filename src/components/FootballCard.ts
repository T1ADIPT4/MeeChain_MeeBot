/**
 * Football Card Component for MeeChain
 * Represents a single NFT Football card with display logic
 */

import { FootballNFT } from '../utils/fallbackLoader.js'

export class FootballCard {
  constructor(private nft: FootballNFT) {}

  /**
   * Get the NFT data
   */
  getData(): FootballNFT {
    return this.nft
  }

  /**
   * Render card as text representation (for console/CLI)
   */
  renderText(): string {
    return `
╔════════════════════════════════════╗
║ ${this.nft.name.padEnd(34, ' ')} ║
╠════════════════════════════════════╣
║ Position: ${this.nft.position.padEnd(23, ' ')} ║
║ Skill:    ${String(this.nft.skill).padEnd(23, ' ')} ║
║ Rarity:   ${this.nft.rarity.padEnd(23, ' ')} ║
║ Team:     ${this.nft.team.padEnd(23, ' ')} ║
╚════════════════════════════════════╝
    `.trim()
  }

  /**
   * Render card as HTML (for web display)
   */
  renderHTML(): string {
    return `
<div class="card football-card" data-id="${this.nft.id}">
  <img src="${this.nft.image}" alt="${this.nft.name}" width="200" height="200" />
  <h3>${this.nft.name}</h3>
  <p class="position">${this.nft.position}</p>
  <p class="skill">Skill: ${this.nft.skill}</p>
  <p class="rarity">${this.nft.rarity}</p>
  <p class="team">${this.nft.team}</p>
</div>
    `.trim()
  }

  /**
   * Get JSON representation
   */
  toJSON(): FootballNFT {
    return this.nft
  }
}

/**
 * Factory function to create multiple FootballCard instances
 * @param nfts - Array of FootballNFT objects
 * @returns Array of FootballCard instances
 */
export function createFootballCards(nfts: FootballNFT[]): FootballCard[] {
  return nfts.map(nft => new FootballCard(nft))
}
