/**
 * MeeBot Component Interface for MeeChain
 * Provides sprite and TTS feedback functionality
 */

export type MeeBotSprite = 'neutral' | 'happy' | 'celebrate' | 'confused' | 'sad'

export interface MeeBotInterface {
  setSprite: (sprite: MeeBotSprite) => void
  speak: (message: string) => void
}

/**
 * Mock MeeBot implementation (replace with actual React component in production)
 */
export const MeeBot: MeeBotInterface = {
  setSprite: (sprite: MeeBotSprite) => {
    console.log(`🤖 MeeBot: Setting sprite to "${sprite}"`)
  },
  speak: (message: string) => {
    console.log(`🔊 TTS: "${message}"`)
  },
}
