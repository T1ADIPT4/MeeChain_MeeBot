# Settings and Support Pages Documentation

This documentation describes the newly scaffolded Settings and Support pages for the MeeChain MeeBot system.

## 📁 Project Structure

```
MeeChain_MeeBot/
├── pages/
│   ├── Settings.tsx         # Settings page with MeeBot integration
│   └── Support.tsx          # Support/FAQ page with MeeBot integration
├── components/
│   ├── SettingToggle.tsx    # Reusable toggle component for settings
│   └── MeeBot.tsx           # MeeBot sprite and TTS integration stub
├── hooks/
│   ├── useSettings.ts       # Hook for settings state management
│   └── useFAQ.ts           # Hook for FAQ data management
└── utils/
    ├── settingsLoader.ts    # Fallback-aware settings loader
    └── fallbackFAQ.ts       # Fallback-aware FAQ loader
```

## ⚙️ Settings Page

### Features
- **Fallback-aware settings loading**: If the API fails, uses default settings
- **MeeBot integration**: Shows different sprites based on loading state
- **TTS feedback**: MeeBot speaks to guide the user
- **Toggle settings**:
  - TTS Enable/Disable
  - MeeBot Sprite Mode (default/animated)
  - Quest Notifications

### Usage

```tsx
import SettingsPage from './pages/Settings'

// In your app
<SettingsPage />
```

### How It Works

1. **Loading State**: When loading settings, MeeBot shows 'loading' sprite
2. **Ready State**: Once loaded, MeeBot switches to 'neutral' sprite and speaks
3. **Settings Update**: Each toggle updates settings both locally and on server
4. **Fallback**: If server fails, uses default settings:
   ```typescript
   {
     ttsEnabled: true,
     spriteMode: 'default',
     notifications: false
   }
   ```

## 🆘 Support Page

### Features
- **Fallback-aware FAQ loading**: If API fails, uses default FAQ items
- **MeeBot integration**: Shows 'thinking' sprite while loading, 'helpful' when ready
- **TTS guidance**: MeeBot speaks to help users
- **FAQ Display**: Shows questions and answers in a clean format

### Usage

```tsx
import SupportPage from './pages/Support'

// In your app
<SupportPage />
```

### How It Works

1. **Loading State**: MeeBot shows 'thinking' sprite while fetching FAQ
2. **Ready State**: MeeBot switches to 'helpful' sprite and speaks
3. **Fallback FAQ**: If server fails, shows default FAQ:
   - "เควสไม่สำเร็จต้องทำอย่างไร?" → "ตรวจสอบเงื่อนไขและลองใหม่อีกครั้ง"
   - "MeeBot ไม่ตอบสนอง?" → "ลองรีเฟรชหน้า หรือเปิดโหมด sprite ใหม่ใน Settings"

## 🔧 Hooks

### useSettings

Manages settings state with automatic loading and saving.

```typescript
const { settings, updateSetting, loading } = useSettings()

// Update a setting
updateSetting('ttsEnabled', true)
```

### useFAQ

Manages FAQ data with automatic loading.

```typescript
const { faq, loading } = useFAQ()

// FAQ items are available in the faq array
```

## 🛠️ Utility Functions

### settingsLoader

```typescript
// Load settings (with fallback)
const settings = await loadSettings()

// Save settings (with error handling)
await saveSettings(settings)
```

### fallbackFAQ

```typescript
// Load FAQ (with fallback)
const faqItems = await loadFAQ()
```

## 🤖 MeeBot Integration

The MeeBot component is a placeholder implementation that demonstrates the integration pattern:

```typescript
import { MeeBot } from './components/MeeBot'

// Set sprite emotion
MeeBot.setSprite('happy')     // or 'loading', 'neutral', 'thinking', 'helpful', etc.

// Make MeeBot speak (TTS)
MeeBot.speak('สวัสดีครับ!')
```

### Available MeeBot States
- `loading` - Shows when loading data
- `neutral` - Default state
- `thinking` - Shows when processing
- `helpful` - Shows when providing help
- `happy` - Shows on success
- `confused` - Shows on fallback usage
- `sad` - Shows on failure

## 🎨 Styling

Add CSS for the components:

```css
/* Settings page */
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

/* Support page */
.faq-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.faq-item h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.faq-item p {
  color: #666;
}
```

## 🔌 API Integration

### Required API Endpoints

1. **GET /api/settings** - Fetch user settings
   ```json
   {
     "ttsEnabled": true,
     "spriteMode": "default",
     "notifications": false
   }
   ```

2. **POST /api/settings** - Save user settings
   - Request body: Settings object
   - Response: Success confirmation

3. **GET /api/faq** - Fetch FAQ items
   ```json
   [
     {
       "question": "...",
       "answer": "..."
     }
   ]
   ```

## 🧪 Testing

All components are built with fallback support and work even when APIs are unavailable:

1. **Build**: `npm run build`
2. **Test**: `npm run test`

## 📝 Future Enhancements

1. Replace MeeBot stub with actual sprite rendering
2. Integrate real TTS API (e.g., Gemini)
3. Add settings persistence to local storage
4. Add more FAQ categories
5. Add search functionality to FAQ
6. Connect settings to quest system for badges
7. Add analytics tracking

## 🎯 Integration with Quest System

Settings can be connected to the existing quest system:

```typescript
// Example: Award badge for enabling TTS
if (settings.ttsEnabled && !previousSettings.ttsEnabled) {
  await handleQuestCompletion(userId, 'enable-tts-quest')
}
```

## 📚 Related Documentation

- [QUEST_SYSTEM.md](./QUEST_SYSTEM.md) - Quest system documentation
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [README.md](./README.md) - Main project README
