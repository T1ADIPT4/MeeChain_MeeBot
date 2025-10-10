# MeeChain Badge Viewer (i18n-ready)

## 📚 Overview

This is the internationalization-ready badge viewer for MeeChain MeeBot. It displays badges and milestone information with support for multiple languages.

## 🗂️ Files

- **`index.html`** - Main viewer page with styling
- **`viewer.js`** - Viewer logic with i18n support
- **`i18n/th.json`** - Thai translations
- **`i18n/en.json`** - English translations

## 🚀 Quick Start

### Open the Viewer

Simply open `index.html` in a web browser:

```bash
# Using Python
python3 -m http.server 8000
# Then visit: http://localhost:8000/viewer/

# Using Node.js
npx http-server -p 8000
# Then visit: http://localhost:8000/viewer/
```

### Language Detection

The viewer automatically detects the browser language:
- Thai browsers → Thai interface
- English/Other → English interface

### Manual Language Switch

Use the language switcher buttons in the viewer:
- 🇹🇭 ไทย button for Thai
- 🇬🇧 English button for English

Or use keyboard shortcuts:
- `Alt + T` for Thai
- `Alt + E` for English

## 🌍 i18n Support

### Translation Files

**Thai (`i18n/th.json`):**
```json
{
  "milestone_complete": "คุณผ่าน milestone แล้ว",
  "badge_uploaded": "อัปโหลด badge สำเร็จ",
  "metadata_ready": "สร้าง metadata สำเร็จ"
}
```

**English (`i18n/en.json`):**
```json
{
  "milestone_complete": "Milestone completed",
  "badge_uploaded": "Badge uploaded successfully",
  "metadata_ready": "Metadata generated"
}
```

### Using Translations in JavaScript

```javascript
// Load translations
await loadI18n('th'); // or 'en'

// Get translated text
const text = t('milestone_complete');
console.log(text); // "คุณผ่าน milestone แล้ว"

// Switch language
await switchLanguage('en');
```

## 📖 Available Translation Keys

| Key | Thai | English |
|-----|------|---------|
| `milestone_complete` | คุณผ่าน milestone แล้ว | Milestone completed |
| `badge_uploaded` | อัปโหลด badge สำเร็จ | Badge uploaded successfully |
| `metadata_ready` | สร้าง metadata สำเร็จ | Metadata generated |
| `fallback_message` | ยังไม่มี milestone ที่บันทึก | No milestone found |
| `viewer_title` | MeeChain Badge Viewer | MeeChain Badge Viewer |
| `quest_id` | รหัสเควส | Quest ID |
| `badge_id` | รหัส Badge | Badge ID |
| `status` | สถานะ | Status |
| `using_fallback` | 🟠 ใช้ระบบ Fallback | 🟠 Using Fallback Asset |
| `system_ready` | ระบบพร้อมใช้งาน | System Ready |
| `loading` | กำลังโหลด... | Loading... |
| `error` | เกิดข้อผิดพลาด | Error |
| `no_badge_found` | ไม่พบ badge | No badge found |
| `milestone_status` | สถานะ Milestone | Milestone Status |
| `file_name` | ชื่อไฟล์ | File Name |
| `file_size` | ขนาดไฟล์ | File Size |
| `mime_type` | ประเภทไฟล์ | MIME Type |

## 🎨 Features

### Auto Language Detection
```javascript
const browserLang = navigator.language || navigator.userLanguage;
const defaultLang = browserLang.startsWith('th') ? 'th' : 'en';
```

### Fallback Support
If translations fail to load, the viewer falls back to embedded English translations.

### Dynamic UI Updates
When switching languages, all UI elements update automatically:
```javascript
function updateUI() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
}
```

### Keyboard Shortcuts
- **Alt + T**: Switch to Thai
- **Alt + E**: Switch to English

## 🔧 Integration with MeeBot

The viewer reads milestone data from `../copilot/milestone.log`:

```javascript
async function loadMilestoneData() {
  const response = await fetch('../copilot/milestone.log');
  const logContent = await response.text();
  const milestones = logContent.split('\n').filter(line => line.trim());
  
  return {
    milestone: milestones[milestones.length - 1],
    milestoneCount: milestones.length
  };
}
```

## 📊 Milestone Integration

The viewer displays:
- ✅ Latest milestone from `milestone.log`
- ✅ Badge images from fallback directory
- ✅ Quest and badge information
- ✅ File metadata (name, size, type)

## 🎯 Usage Example

```javascript
// Initialize viewer
await initViewer();

// Display a badge
displayBadge('quest-001', 'badge-001', {
  milestone: 'M1 complete: System initialized',
  imageUrl: './assets/milestone-1.svg'
});

// Switch to Thai
await switchLanguage('th');
```

## 🧪 Testing

### Manual Testing
1. Open `index.html` in a browser
2. Check that content loads
3. Click language switcher buttons
4. Verify all text updates correctly
5. Test keyboard shortcuts (Alt+T, Alt+E)

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🌟 Styling

The viewer includes:
- Responsive design for mobile and desktop
- Smooth animations (fade-in, bounce)
- Purple gradient background
- Card-based layout
- Interactive buttons with hover effects

## 🔄 Adding New Languages

1. Create new JSON file in `i18n/` (e.g., `ja.json`)
2. Copy structure from `en.json`
3. Translate all values
4. Update language detection in `viewer.js`:

```javascript
const defaultLang = browserLang.startsWith('th') ? 'th' : 
                   browserLang.startsWith('ja') ? 'ja' : 'en';
```

5. Add language button to `index.html`:

```html
<button onclick="switchLanguage('ja')">🇯🇵 日本語</button>
```

## 📝 Contributing

When adding new UI elements:

1. Add translation keys to both `th.json` and `en.json`
2. Use `data-i18n` attribute in HTML:
   ```html
   <span data-i18n="your_key">Default text</span>
   ```
3. Or use `t()` function in JavaScript:
   ```javascript
   element.textContent = t('your_key');
   ```

## 🚀 Deployment

The viewer is a static site and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Just ensure the `i18n/` directory is included!

---

**MeeBot**: "Viewer พร้อมแสดงผลหลายภาษาแล้วครับ!" 🌐🎨✨
