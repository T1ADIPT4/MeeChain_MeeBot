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
    // In production, this would trigger actual TTS via Gemini or other TTS service
  }

  getCurrentSprite(): string {
    return this.currentSprite
  }

  getLastMessage(): string {
    return this.lastMessage
  }

  /**
   * Provide TTS feedback for quest completion
   * @param questId - The quest that was completed
   * @param success - Whether the quest was successful
   * @param fallback - Whether fallback minting was used
   */
  questFeedback(questId: string, success: boolean, fallback?: boolean): void {
    if (!success) {
      this.setSprite('sad')
      this.speak('เควสยังไม่สำเร็จนะครับ ลองทำต่อดูนะ')
      return
    }

    if (fallback) {
      this.setSprite('confused')
      this.speak('ระบบ fallback ทำงานแล้วนะครับ แต่คุณก็ได้ badge แล้ว!')
    } else {
      this.setSprite('happy')
      this.speak('เควสสำเร็จ! ได้รับ badge แล้ว ยินดีด้วยครับ!')
    }
  }

  /**
   * Provide TTS feedback for TTS quest specifically
   * @param enabled - Whether TTS was enabled or disabled
   */
  ttsFeedback(enabled: boolean): void {
    if (enabled) {
      this.setSprite('happy')
      this.speak('เปิด TTS แล้วครับ! ตอนนี้ MeeBot สามารถพูดคุยกับคุณได้แล้ว')
    } else {
      this.setSprite('neutral')
      this.speak('ปิด TTS แล้วครับ')
    }
  }

  /**
   * Provide sprite feedback for milestone completion
   * @param milestoneId - The milestone ID (M1, M2, M3, M4, M5)
   * @param message - Optional custom message
   */
  milestoneFeedback(milestoneId: string, message?: string): void {
    const milestoneConfig: Record<string, { sprite: string; defaultMessage: string }> = {
      'M1': { sprite: 'happy', defaultMessage: 'Deploy dashboard online!' },
      'M2': { sprite: 'excited', defaultMessage: 'Minting pipeline ready!' },
      'M3': { sprite: 'proud', defaultMessage: 'Milestone linked!' },
      'M4': { sprite: 'confident', defaultMessage: 'Fallback validated!' },
      'M5': { sprite: 'celebration', defaultMessage: 'Production ready!' }
    }

    const config = milestoneConfig[milestoneId]
    if (config) {
      this.setSprite(config.sprite)
      this.speak(message || config.defaultMessage)
    } else {
      console.warn(`Unknown milestone ID: ${milestoneId}`)
      this.setSprite('neutral')
      this.speak(message || 'Milestone completed!')
    }
  }
}

export const MeeBot = new MeeBotClass()
