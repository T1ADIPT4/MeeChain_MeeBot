// components/MeeBot.tsx

/**
 * MeeBot component for sprite and TTS integration
 * This is a placeholder implementation that will be replaced with actual MeeBot sprite rendering
 */

class MeeBotClass {
  private currentSprite: string = 'neutral'
  private lastMessage: string = ''

  setSprite(emotion: string): void {
    this.currentSprite = emotion
    console.log(`🤖 MeeBot: Setting sprite to "${emotion}"`)
  }

  speak(message: string): void {
    this.lastMessage = message
    console.log(`🔊 MeeBot speaks: "${message}"`)
  }

  getCurrentSprite(): string {
    return this.currentSprite
  }

  getLastMessage(): string {
    return this.lastMessage
  }
}

export const MeeBot = new MeeBotClass()
