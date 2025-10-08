/**
 * Fallback Loader for MeeChain
 * Provides fallback data loading when primary data sources fail
 */

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export interface FootballNFT {
  id: string
  name: string
  image: string
  position: string
  skill: number
  rarity: string
  team: string
}

/**
 * Load football NFT data from fallback source
 * @returns Array of FootballNFT objects
 */
export async function loadFootballData(): Promise<FootballNFT[]> {
  try {
    const fallbackPath = join(__dirname, '../assets/fallback/football-nfts.json')
    const fileContent = await readFile(fallbackPath, 'utf-8')
    return JSON.parse(fileContent) as FootballNFT[]
  } catch (error) {
    console.error('Fallback data missing', error)
    return []
  }
}
