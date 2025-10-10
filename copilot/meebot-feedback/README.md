# MeeBot Feedback Dictionary (i18n)

## 📚 Overview

This directory contains the internationalization (i18n) dictionary system for MeeBot feedback messages. The system supports multiple languages and provides a consistent way to display feedback across the MeeChain MeeBot application.

## 🗂️ Files

- **`th.js`** - Thai language dictionary (ภาษาไทย)
- **`en.js`** - English language dictionary
- **`demo.js`** - Demonstration script for testing dictionaries
- **`integration-example.js`** - Example of integrating dictionaries with MeeBot component

## 🚀 Quick Start

### Import Dictionary

```javascript
import feedbackTH from './meebot-feedback/th.js';
import feedbackEN from './meebot-feedback/en.js';

// Get a message
console.log(feedbackTH.M1); // "เริ่มต้นระบบสำเร็จแล้ว"
console.log(feedbackEN.M1); // "System initialization complete"
```

### Use in MeeBot Component

```javascript
import feedbackTH from './meebot-feedback/th.js';

class MeeBot {
  constructor() {
    this.dict = feedbackTH; // Set default language
  }

  milestoneFeedback(milestone) {
    const message = this.dict[milestone] || this.dict.fallback;
    console.log(message);
  }
}

const meebot = new MeeBot();
meebot.milestoneFeedback('M1'); // "เริ่มต้นระบบสำเร็จแล้ว"
```

## 📖 Dictionary Keys

### Milestones
- `M1` - System initialization
- `M2` - Metadata creation
- `M3` - Fallback viewer verification
- `M4` - Badge upload
- `M5` - MeeBot sprite display
- `M6` - Answer verification
- `M7` - Milestone auto-save
- `M8` - NFT badge minting
- `M9` - Dashboard deployment

### Quest Feedback
- `quest_success` - Quest completed successfully
- `quest_failed` - Quest not completed
- `quest_fallback` - Quest completed using fallback

### TTS Feedback
- `tts_enabled` - TTS enabled
- `tts_disabled` - TTS disabled

### General Messages
- `fallback` - Default fallback message
- `metadata_ready` - Metadata generator ready
- `ipfs_ready` - IPFS uploader ready
- `milestone_success` - Generic milestone success
- `badge_uploaded` - Badge upload success
- `system_ready` - System ready

### Sprite Feedback
- `sprite_happy` - Happy sprite
- `sprite_sad` - Sad sprite
- `sprite_confused` - Confused sprite
- `sprite_thinking` - Thinking sprite
- `sprite_neutral` - Neutral sprite
- `sprite_helpful` - Helpful sprite

## 🧪 Testing

### Run Demo
```bash
node copilot/meebot-feedback/demo.js
```

This will display all messages in both Thai and English.

### Run Integration Example
```bash
node copilot/meebot-feedback/integration-example.js
```

This demonstrates how to use the dictionary with a MeeBot class.

## 🌍 Language Support

Currently supported languages:
- 🇹🇭 Thai (`th.js`)
- 🇬🇧 English (`en.js`)

### Adding a New Language

1. Create a new file (e.g., `ja.js` for Japanese)
2. Copy the structure from `en.js`
3. Translate all messages
4. Export as default:

```javascript
export default {
  M1: "システム初期化完了",
  M2: "メタデータ作成成功",
  // ... rest of translations
};
```

## 🔧 Integration with Viewer

The viewer system (`viewer/viewer.js`) uses JSON format for i18n:

```javascript
// viewer/i18n/th.json
{
  "milestone_complete": "คุณผ่าน milestone แล้ว",
  "badge_uploaded": "อัปโหลด badge สำเร็จ"
}
```

Load and use:
```javascript
const i18n = await fetch('./i18n/th.json').then(r => r.json());
console.log(i18n.milestone_complete);
```

## 📊 Usage Statistics

The dictionary system is used in:
- ✅ MeeBot component (`components/MeeBot.tsx`)
- ✅ Viewer system (`viewer/viewer.js`)
- ✅ Milestone integration (`copilot/implement-ipfs-uploader/meebot-milestone-example.js`)
- ✅ Settings page (`pages/Settings.tsx`)
- ✅ Support page (`pages/Support.tsx`)

## 🎯 Best Practices

1. **Always provide fallback**: Use `dict[key] || dict.fallback`
2. **Keep messages concise**: MeeBot feedback should be short and clear
3. **Use emojis consistently**: Maintain visual consistency across languages
4. **Test both languages**: Always verify messages in both Thai and English
5. **Document new keys**: Add new keys to this README when adding them

## 🤖 MeeBot Integration

Example of using dictionary in MeeBot component:

```javascript
import feedbackTH from '../copilot/meebot-feedback/th.js';
import feedbackEN from '../copilot/meebot-feedback/en.js';

class MeeBotClass {
  constructor() {
    this.currentLang = 'th';
    this.dict = feedbackTH;
  }

  setLanguage(lang) {
    this.currentLang = lang;
    this.dict = lang === 'th' ? feedbackTH : feedbackEN;
  }

  milestoneFeedback(milestone) {
    const message = this.dict[milestone] || this.dict.fallback;
    this.speak(message);
  }
}
```

## 📝 Contributing

When adding new messages:

1. Add the key to both `th.js` and `en.js`
2. Ensure Thai text includes proper Thai characters
3. Test with `demo.js`
4. Update this README with the new key

---

**MeeBot**: "ระบบพร้อมสื่อสารหลายภาษาแล้วครับครู!" 🇹🇭🌐🟢
