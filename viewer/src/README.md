# MeeChain Interactive Viewer

🌐 **React-based Interactive Viewer** for MeeChain Registry, Milestones, and Badges with Thai-English i18n support.

## 🧱 Structure

```
viewer/
├── public/
│   └── index.html          # React app entry HTML
├── src/
│   ├── components/
│   │   ├── RegistryCard.jsx      # Display Registry status
│   │   ├── MilestoneChart.jsx    # Milestone progress chart
│   │   ├── BadgeStatus.jsx       # Badge display with fallback
│   │   └── LanguageToggle.jsx    # i18n language switcher
│   ├── i18n/
│   │   ├── th.json              # Thai translations
│   │   └── en.json              # English translations
│   ├── App.jsx                  # Main application component
│   └── index.js                 # React entry point
├── index.html                    # Standalone viewer (no build)
└── viewer.js                     # Standalone viewer script
```

## 🌐 Features

### 🔍 Registry Card
- Displays deployment registry information
- Shows URL, Version, Hash, and Status
- Real-time status indicators (🟢/🔴)

### 🎯 Milestone Chart
- Visual progress bar for milestones (M1-M9)
- Lists completed milestones
- Shows completion percentage
- MeeBot sprite changes based on progress

### 🟢 Badge Status
- Displays badge metadata
- Shows badge image with fallback support
- Fallback-aware asset loading
- Quest ID and Badge ID display

### 🌍 Language Toggle
- Switch between Thai (🇹🇭) and English (🇬🇧)
- Auto-detect browser language
- Keyboard shortcuts: Alt+T (Thai) | Alt+E (English)
- Dynamic UI updates

## 🚀 Usage

### Option 1: Standalone Viewer (No Build Required)

Simply open `viewer/index.html` in a browser. This uses the vanilla JS viewer with i18n support.

### Option 2: React Interactive Viewer

The React version requires a bundler like Vite, Webpack, or Create React App.

#### Using Vite (Recommended)

```bash
cd viewer
npm install
npm run dev
```

#### Using Create React App

```bash
npx create-react-app meechain-viewer
# Copy src/ and public/ contents
cd meechain-viewer
npm start
```

## 📊 Data Sources

The viewer automatically loads data from:

- **Registry**: `/config/deploy-registry.json`
- **Milestones**: `/copilot/milestone.log`
- **Badge Metadata**: `/output/metadata.json`
- **Translations**: `/viewer/i18n/{lang}.json`

## 🎨 UI Components

### RegistryCard
```jsx
<RegistryCard registry={registryData} t={translationFunction} />
```

### MilestoneChart
```jsx
<MilestoneChart milestones={milestoneArray} t={translationFunction} />
```

### BadgeStatus
```jsx
<BadgeStatus badge={badgeData} t={translationFunction} />
```

### LanguageToggle
```jsx
<LanguageToggle 
  currentLang={lang} 
  onLanguageChange={handleChange}
  t={translationFunction}
/>
```

## 🧪 Testing

### Manual Testing
1. Open the viewer in a browser
2. Verify all components load correctly
3. Test language switching (Alt+T, Alt+E)
4. Check responsive design on mobile
5. Verify milestone progress updates
6. Test fallback badge display

### Browser Compatibility
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🌍 i18n Support

### Adding New Translations

1. Create new JSON file: `i18n/{lang}.json`
2. Copy structure from `en.json`
3. Translate all values
4. Update language detection in `App.jsx`

### Translation Keys

```json
{
  "registry_status": "Registry Status",
  "milestone_progress": "Milestone Progress",
  "badge_status": "Badge Status",
  "loading": "Loading...",
  "error": "Error",
  ...
}
```

## 🎯 Milestone Integration

The viewer displays milestones from `copilot/milestone.log`:

```
M1: Uploader Init
Status: ✅ Complete
MeeBot: 🟢 "Uploader scaffolded!"
```

MeeBot sprite updates based on completed milestones:
- 0-2 milestones: 🤖
- 3-4 milestones: 🔵
- 5-6 milestones: 🟣
- 7+ milestones: 🟢

## 🔐 Fallback Handling

The viewer implements comprehensive fallback support:

1. **Translation Fallback**: Embedded English translations if JSON fails
2. **Data Fallback**: Default values if API calls fail
3. **Image Fallback**: Placeholder badge if image not found
4. **Registry Fallback**: Demo registry data if file not available

## 📱 Responsive Design

The viewer is fully responsive:

- Desktop: 1200px max-width container
- Tablet: Optimized layout
- Mobile: Touch-friendly buttons, stacked cards

## ⌨️ Keyboard Shortcuts

- **Alt + T**: Switch to Thai
- **Alt + E**: Switch to English

## 🛠️ Development

### Component Guidelines

1. All components accept `t` function for translations
2. Use inline styles with `<style jsx>` for scoped CSS
3. Implement loading and error states
4. Support both light/dark themes (future)

### Adding New Components

1. Create component in `src/components/`
2. Export as default function
3. Import in `App.jsx`
4. Add to main render

## 📈 Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Dark mode support
- [ ] Export badge as image
- [ ] Share badge on social media
- [ ] Analytics dashboard integration
- [ ] Multi-chain network switching

## 🎉 Credits

Built for MeeChain MeeBot - Fallback-aware quest verification and badge minting system.

**MeeBot**: "พร้อมแสดงผลแบบ interactive แล้วครับครู! Viewer นี้จะทำให้ผู้เรียนเห็นความคืบหน้าและ badge ได้อย่างชัดเจน สนุก และปลอดภัย!" 🟢📊
