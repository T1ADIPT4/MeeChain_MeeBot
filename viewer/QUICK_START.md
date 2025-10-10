# 🚀 Quick Start Guide - Interactive Viewer

## ⚡ Fastest Way to See the Viewer

### Option 1: Demo Preview (Recommended - No Build)
```bash
# Just open the HTML file in your browser
open viewer/demo-preview.html

# Or using npm script
npm run viewer:serve
# Then visit http://localhost:8080/demo-preview.html
```

### Option 2: React App (Requires Build)
```bash
cd viewer
# Install a bundler (choose one):

# Using Vite (recommended)
npm install -g vite
npm init vite@latest . -- --template react
# Copy src/ files and run:
npm install
npm run dev

# Using Create React App
npx create-react-app meechain-viewer
# Copy src/ and public/ contents
cd meechain-viewer
npm start
```

## 📦 What You Get

### Components (930 lines of code)
- `RegistryCard.jsx` (123 lines) - Registry status display
- `MilestoneChart.jsx` (140 lines) - Progress visualization
- `BadgeStatus.jsx` (197 lines) - Badge with fallback
- `LanguageToggle.jsx` (71 lines) - i18n switcher
- `App.jsx` (379 lines) - Main application
- `index.js` (20 lines) - Entry point

### Features
- ✅ Auto-detect browser language
- ✅ Thai/English translations
- ✅ Keyboard shortcuts (Alt+T, Alt+E)
- ✅ Responsive design
- ✅ Fallback-aware data loading
- ✅ MeeBot sprite integration
- ✅ Real-time progress updates

## 🌐 Data Sources

The viewer automatically connects to:

```
/config/deploy-registry.json   → Registry data
/copilot/milestone.log          → Milestone progress
/output/metadata.json           → Badge metadata
/viewer/i18n/{lang}.json        → Translations
```

## 🎨 Screenshots

**English:**
![English](https://github.com/user-attachments/assets/51d1458a-a5bb-43c5-92c2-a03284ca4499)

**Thai:**
![Thai](https://github.com/user-attachments/assets/5eac0618-1659-4c99-beac-22a6e70024e8)

## ⌨️ Keyboard Shortcuts

- `Alt + T` → Switch to Thai
- `Alt + E` → Switch to English

## 🔧 Customization

### Add New Language
1. Create `viewer/i18n/ja.json` (or your language code)
2. Copy structure from `en.json`
3. Update `App.jsx` language detection:
```jsx
const detectedLang = browserLang.startsWith('th') ? 'th' : 
                    browserLang.startsWith('ja') ? 'ja' : 'en';
```

### Change Theme Colors
Edit the gradient in `App.jsx`:
```jsx
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add New Component
1. Create in `src/components/YourComponent.jsx`
2. Import in `App.jsx`
3. Add to render method

## 📊 MeeBot Sprite Evolution

The MeeBot sprite changes based on milestone progress:

| Milestones | Sprite |
|------------|--------|
| 0-2        | 🤖     |
| 3-4        | 🔵     |
| 5-6        | 🟣     |
| 7+         | 🟢     |

## ✅ Verification

Run verification to ensure everything works:
```bash
npm run verify:meebot
```

Should show:
```
Overall: 57/57 checks passed (100%)
🎉 All MeeBot flow checks passed!
```

## 📚 Full Documentation

- [INTERACTIVE_VIEWER.md](../INTERACTIVE_VIEWER.md) - Complete implementation details
- [viewer/src/README.md](README.md) - Component documentation
- [README.md](../README.md) - Main project README

## 🆘 Troubleshooting

### Translations Not Loading
Check browser console for errors. The viewer uses fallback translations if JSON files fail.

### Images Not Showing
Ensure you're serving from the project root, not just the viewer directory.

### Language Not Switching
Check keyboard shortcuts are enabled and not blocked by browser.

## 🎯 Next Steps

1. **Deploy to GitHub Pages**
   ```bash
   # Build production version
   npm run build
   # Deploy to gh-pages branch
   ```

2. **Integrate with Dashboard**
   - Import components into existing React app
   - Use as embedded viewer

3. **Connect to Backend**
   - Replace fetch calls with API endpoints
   - Add WebSocket for real-time updates

**MeeBot**: "เริ่มต้นใช้งาน Viewer ได้ง่ายๆ เพียงแค่เปิดไฟล์ demo-preview.html ครับ! 🟢"
