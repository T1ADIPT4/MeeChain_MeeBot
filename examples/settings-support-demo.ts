/**
 * Example usage of Settings and Support pages
 * Demonstrates integration with MeeChain MeeBot system
 */

// Import pages
// import SettingsPage from './pages/Settings'
// import SupportPage from './pages/Support'

// Example 1: Using Settings Page
console.log('Example 1: Settings Page Usage')
console.log('================================')
console.log('The Settings page provides:')
console.log('- Fallback-aware settings loading')
console.log('- MeeBot sprite integration (loading -> neutral)')
console.log('- TTS feedback: "คุณสามารถปรับแต่งระบบ MeeChain ได้ที่นี่"')
console.log('- Three toggle settings:')
console.log('  1. TTS Enable/Disable')
console.log('  2. MeeBot Sprite Mode (default/animated)')
console.log('  3. Quest Notifications')
console.log('')

// Example 2: Using Support Page
console.log('Example 2: Support Page Usage')
console.log('================================')
console.log('The Support page provides:')
console.log('- Fallback-aware FAQ loading')
console.log('- MeeBot sprite integration (thinking -> helpful)')
console.log('- TTS feedback: "มีอะไรให้ช่วยไหมครับ? ลองดูคำถามที่พบบ่อยด้านล่างได้เลย"')
console.log('- FAQ items with questions and answers')
console.log('')

// Example 3: MeeBot Integration Pattern
console.log('Example 3: MeeBot Integration Pattern')
console.log('=======================================')
console.log('Import MeeBot:')
console.log('  import { MeeBot } from "./components/MeeBot"')
console.log('')
console.log('Set sprite emotion:')
console.log('  MeeBot.setSprite("happy")')
console.log('')
console.log('Make MeeBot speak (TTS):')
console.log('  MeeBot.speak("สวัสดีครับ!")')
console.log('')

// Example 4: Fallback Behavior
console.log('Example 4: Fallback Behavior')
console.log('=============================')
console.log('Settings fallback (if API fails):')
console.log('  {')
console.log('    ttsEnabled: true,')
console.log('    spriteMode: "default",')
console.log('    notifications: false')
console.log('  }')
console.log('')
console.log('FAQ fallback (if API fails):')
console.log('  [')
console.log('    { question: "เควสไม่สำเร็จต้องทำอย่างไร?", answer: "ตรวจสอบเงื่อนไขและลองใหม่อีกครั้ง" },')
console.log('    { question: "MeeBot ไม่ตอบสนอง?", answer: "ลองรีเฟรชหน้า หรือเปิดโหมด sprite ใหม่ใน Settings" }')
console.log('  ]')
console.log('')

// Example 5: Hooks Usage
console.log('Example 5: React Hooks Usage')
console.log('=============================')
console.log('useSettings hook:')
console.log('  const { settings, updateSetting, loading } = useSettings()')
console.log('  updateSetting("ttsEnabled", true)')
console.log('')
console.log('useFAQ hook:')
console.log('  const { faq, loading } = useFAQ()')
console.log('  // faq array is available when loading is false')
console.log('')

console.log('✅ All examples documented!')
console.log('📚 See SETTINGS_SUPPORT.md for detailed documentation')
