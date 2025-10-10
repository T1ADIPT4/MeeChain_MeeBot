/**
 * MeeBot i18n Integration Example
 * Shows how to integrate the dictionary system with the MeeBot component
 */

import feedbackTH from '../meebot-feedback/th.js';
import feedbackEN from '../meebot-feedback/en.js';

/**
 * Get dictionary for specified language
 * @param {string} lang - Language code ('th' or 'en')
 * @returns {Object} Dictionary object
 */
export function getDictionary(lang = 'th') {
  return lang === 'th' ? feedbackTH : feedbackEN;
}

/**
 * Get translated message for a milestone
 * @param {string} milestone - Milestone key (e.g., 'M1', 'M2')
 * @param {string} lang - Language code ('th' or 'en')
 * @returns {string} Translated message
 */
export function getMilestoneMessage(milestone, lang = 'th') {
  const dict = getDictionary(lang);
  return dict[milestone] || dict.fallback;
}

/**
 * Example: Enhanced MeeBot with i18n support
 */
class MeeBotI18n {
  constructor(defaultLang = 'th') {
    this.currentLang = defaultLang;
    this.currentSprite = 'neutral';
    this.lastMessage = '';
  }

  /**
   * Set current language
   * @param {string} lang - Language code ('th' or 'en')
   */
  setLanguage(lang) {
    this.currentLang = lang;
    console.log(`🌍 Language changed to: ${lang}`);
  }

  /**
   * Get current dictionary
   * @returns {Object} Current language dictionary
   */
  getDict() {
    return getDictionary(this.currentLang);
  }

  /**
   * Set MeeBot sprite
   * @param {string} emotion - Sprite emotion
   */
  setSprite(emotion) {
    this.currentSprite = emotion;
    console.log(`🤖 MeeBot sprite: ${emotion}`);
  }

  /**
   * Make MeeBot speak using dictionary
   * @param {string} key - Dictionary key
   */
  speak(key) {
    const dict = this.getDict();
    this.lastMessage = dict[key] || key;
    console.log(`🔊 MeeBot: ${this.lastMessage}`);
  }

  /**
   * Milestone feedback with i18n
   * @param {string} milestone - Milestone key (M1, M2, etc.)
   */
  milestoneFeedback(milestone) {
    this.setSprite('happy');
    const message = getMilestoneMessage(milestone, this.currentLang);
    this.lastMessage = message;
    console.log(`🟣 ${milestone}: ${message}`);
  }

  /**
   * Quest feedback with i18n
   * @param {boolean} success - Quest success status
   * @param {boolean} fallback - Whether fallback was used
   */
  questFeedback(success, fallback = false) {
    const dict = this.getDict();
    
    if (!success) {
      this.setSprite('sad');
      this.lastMessage = dict.quest_failed;
    } else if (fallback) {
      this.setSprite('confused');
      this.lastMessage = dict.quest_fallback;
    } else {
      this.setSprite('happy');
      this.lastMessage = dict.quest_success;
    }
    
    console.log(`🔊 ${this.lastMessage}`);
  }

  /**
   * TTS feedback with i18n
   * @param {boolean} enabled - TTS enabled status
   */
  ttsFeedback(enabled) {
    const dict = this.getDict();
    
    if (enabled) {
      this.setSprite('happy');
      this.lastMessage = dict.tts_enabled;
    } else {
      this.setSprite('neutral');
      this.lastMessage = dict.tts_disabled;
    }
    
    console.log(`🔊 ${this.lastMessage}`);
  }

  /**
   * Get last message
   * @returns {string} Last message
   */
  getLastMessage() {
    return this.lastMessage;
  }

  /**
   * Get current sprite
   * @returns {string} Current sprite
   */
  getCurrentSprite() {
    return this.currentSprite;
  }
}

// Demo usage
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║      MeeBot i18n Integration Demo                       ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Create MeeBot instance with Thai language
const meebotTH = new MeeBotI18n('th');
console.log('🇹🇭 Thai MeeBot:');
console.log('─────────────────────────────────────────────────────────────');
meebotTH.milestoneFeedback('M1');
meebotTH.milestoneFeedback('M2');
meebotTH.questFeedback(true, false);
meebotTH.ttsFeedback(true);

console.log('\n🇬🇧 English MeeBot:');
console.log('─────────────────────────────────────────────────────────────');
const meebotEN = new MeeBotI18n('en');
meebotEN.milestoneFeedback('M1');
meebotEN.milestoneFeedback('M2');
meebotEN.questFeedback(true, false);
meebotEN.ttsFeedback(true);

console.log('\n🔄 Language switching:');
console.log('─────────────────────────────────────────────────────────────');
const meebot = new MeeBotI18n('th');
meebot.milestoneFeedback('M3');
meebot.setLanguage('en');
meebot.milestoneFeedback('M3');

console.log('\n✅ i18n integration working perfectly!\n');

export { MeeBotI18n };
