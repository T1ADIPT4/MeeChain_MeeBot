/**
 * Football Data Hook for MeeChain
 * Hook for loading NFT Football data with fallback support
 */

import { loadFootballData, FootballNFT } from '../utils/fallbackLoader.js'

export interface UseFootballDataResult {
  data: FootballNFT[]
  loading: boolean
  error: Error | null
}

/**
 * Hook to fetch and manage football NFT data
 * Automatically falls back to local data if API fetch fails
 * @param apiEndpoint - Optional API endpoint to fetch data from
 * @returns Object containing data, loading state, and error
 */
export async function useFootballData(
  apiEndpoint: string = '/api/football-nfts'
): Promise<UseFootballDataResult> {
  let data: FootballNFT[] = []
  let loading = true
  let error: Error | null = null

  try {
    // In a real implementation, this would use fetch or axios
    // For now, we simulate an API call that might fail
    const shouldUseFallback = !apiEndpoint.startsWith('http')
    
    if (shouldUseFallback) {
      console.warn('Primary fetch simulation - using fallback')
      throw new Error('API endpoint not configured')
    }

    // Simulated API call
    // const res = await fetch(apiEndpoint)
    // const json = await res.json()
    // data = json
    
  } catch (fetchError) {
    console.warn('Primary fetch failed, using fallback', fetchError)
    try {
      data = await loadFootballData()
    } catch (fallbackError) {
      error = fallbackError as Error
      console.error('Fallback also failed', fallbackError)
    }
  } finally {
    loading = false
  }

  return { data, loading, error }
}
