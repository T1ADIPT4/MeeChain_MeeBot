/**
 * MeeBot Integration for MeeChain
 * Provides MeeBot sprite and TTS functionality
 */

export type MeeBotSprite = 'idle' | 'happy' | 'excited' | 'confused' | 'sad' | 'loading'

export class MeeBot {
  private static currentSprite: MeeBotSprite = 'idle'
  private static currentMessage: string = ''

  /**
   * Set MeeBot sprite/emotion
   * @param sprite - The sprite/emotion to display
   */
  static setSprite(sprite: MeeBotSprite): void {
    this.currentSprite = sprite
    console.log(`🤖 MeeBot: Setting sprite to "${sprite}"`)
  }

  /**
   * Get current sprite
   */
  static getSprite(): MeeBotSprite {
    return this.currentSprite
  }

  /**
   * Make MeeBot speak using TTS
   * @param message - The message to speak
   */
  static speak(message: string): void {
    this.currentMessage = message
    console.log(`🔊 TTS: "${message}"`)
  }

  /**
   * Get the last spoken message
   */
  static getLastMessage(): string {
    return this.currentMessage
  }

  /**
   * Reset MeeBot to idle state
   */
  static reset(): void {
    this.currentSprite = 'idle'
    this.currentMessage = ''
  }
}
