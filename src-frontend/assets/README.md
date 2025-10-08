# Assets Directory

This directory is for static assets used in the MeeChain MeeBot React application.

## Recommended Structure

```
assets/
├── images/          # Image files (PNG, JPG, SVG)
│   ├── logo.png
│   ├── meebot-sprite.png
│   └── icons/
├── sprites/         # Sprite sheets for MeeBot animations
│   ├── meebot-neutral.png
│   ├── meebot-happy.png
│   └── meebot-confused.png
├── fonts/           # Custom fonts (if needed)
└── data/            # Static JSON data files
```

## Usage in Components

### Importing Images

```tsx
import logo from '../assets/images/logo.png'

function MyComponent() {
  return <img src={logo} alt="MeeChain Logo" />
}
```

### Importing SVG as Components

```tsx
import { ReactComponent as MeeBotIcon } from '../assets/images/icons/meebot.svg'

function MyComponent() {
  return <MeeBotIcon className="icon" />
}
```

## Optimization Tips

- Use SVG for icons and logos when possible
- Optimize images before adding them (use tools like ImageOptim, TinyPNG)
- Consider using WebP format for better compression
- For sprite sheets, use CSS sprites or sprite atlas for better performance
