# Auditor Dashboard - Figma Mockup Guide

## 🎨 Design System

### Color Palette

```
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Background: #f5f7fa
White: #ffffff
Border: #e2e8f0

Text Colors:
- Primary: #1e293b
- Secondary: #475569
- Muted: #64748b
- Light: #94a3b8

Status Colors:
- Success: #dcfce7 / #166534
- Failed: #fee2e2 / #991b1b
- Flagged: #fef3c7 / #92400e

Action Colors:
- Primary Button: #667eea
- Info: #dbeafe / #1e40af
- Success: #dcfce7 / #166534
- Warning: #fef3c7 / #92400e
```

### Typography

```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Monospace: 'Monaco', 'Courier New', monospace

Font Sizes:
- Heading 1: 28px / 1.75rem (Dashboard title)
- Heading 2: 20px / 1.25rem (Panel titles)
- Heading 3: 14px / 0.875rem (Section titles)
- Body: 14px / 0.875rem
- Small: 12px / 0.75rem (Labels, timestamps)

Font Weights:
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
```

### Spacing

```
Unit: 8px base

Common Spacings:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 12px (0.75rem)
- lg: 16px (1rem)
- xl: 24px (1.5rem)
- 2xl: 32px (2rem)
- 3xl: 48px (3rem)
```

### Border Radius

```
- Small: 8px
- Medium: 12px
- Large: 16px
- Pill: 9999px (fully rounded)
```

### Shadows

```
- Light: 0 2px 8px rgba(0,0,0,0.05)
- Medium: 0 4px 12px rgba(0,0,0,0.1)
- Heavy: -4px 0 24px rgba(0,0,0,0.15)
```

## 📐 Layout Structure

### Figma Frame Setup

```
Main Frame: "AuditorDashboard"
Size: 1440 x 900 (Desktop)
Background: #f5f7fa
```

### Component Hierarchy

```
AuditorDashboard (1440 x 900)
│
├── Header (1440 x 80)
│   ├── Logo Container (left, 60px)
│   │   └── Logo Icon "🛡️"
│   ├── Title Container (center-left)
│   │   └── Text: "Auditor Dashboard"
│   └── Actions Container (right)
│       ├── Button: "📊 Export CSV"
│       └── Button: "🏅 View Badges"
│
├── Content Area (1120 x 820)
│   │
│   ├── Filter Bar (1120 x 80)
│   │   ├── Search Field (200px)
│   │   ├── Status Dropdown (200px)
│   │   └── Date Range (320px)
│   │       ├── Start Date Input (150px)
│   │       └── End Date Input (150px)
│   │
│   └── Refund Log Table (1120 x 740)
│       ├── Table Header (sticky)
│       │   ├── Column: "Requester" (200px)
│       │   ├── Column: "Status" (120px)
│       │   ├── Column: "Confirmation Time" (180px)
│       │   ├── Column: "Refund Tx" (200px)
│       │   ├── Column: "Amount" (120px)
│       │   ├── Column: "Chain" (100px)
│       │   └── Column: "Flag" (60px)
│       │
│       └── Table Body (scrollable)
│           └── Table Rows (repeated)
│
└── Sidebar (320 x 820)
    └── Contributor Panel
        ├── Profile Section (80px height)
        │   ├── Avatar (48px circle)
        │   └── User Info
        │
        ├── Reputation Section (180px height)
        │   ├── Score Display (gradient bg, 120px)
        │   └── Stats Grid (2 columns)
        │
        ├── Badges Section (flexible height)
        │   ├── Section Title
        │   └── Badge List (repeated)
        │       └── Badge Item (56px height each)
        │
        └── Progress Section (flexible height)
            ├── Section Title
            └── Progress Items (repeated)
```

### Overlay Components

```
LogDetailPanel (500 x 100vh, slides from right)
│
├── Panel Header (80px)
│   ├── Title: "📋 Transaction Details"
│   └── Close Button (×)
│
├── Panel Content (scrollable)
│   ├── Transaction Info Section
│   │   ├── Status Badge
│   │   ├── Requester
│   │   ├── Refund Tx
│   │   ├── Amount
│   │   ├── Chain
│   │   └── Time
│   │
│   ├── Flag Info Section (if flagged)
│   │   ├── Flagged By
│   │   ├── Reason
│   │   └── Flagged At
│   │
│   └── Flag Form (if showing)
│       ├── Textarea (reason input)
│       └── Action Buttons
│
└── Panel Actions (footer)
    ├── Button: "🚩 Flag Transaction"
    ├── Button: "🔍 View on Explorer"
    └── Button: "✓ Complete Review"
```

## 🖼️ Component Specifications

### 1. Header Component

```
Frame: Header
Size: 1440 x 80
Background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Padding: 24px 32px

Elements:
├── Logo Icon (emoji "🛡️", 32px)
├── Title Text
│   └── "Auditor Dashboard"
│   └── Font: 28px Bold, White
└── Button Group (horizontal, gap 16px)
    ├── Export Button
    │   └── Size: 40px height, padding 10px 20px
    │   └── Background: White, Color: #667eea
    │   └── Border Radius: 8px
    │   └── Text: "📊 Export CSV"
    └── Badges Button
        └── Same styling
        └── Text: "🏅 View Badges"
```

### 2. Filter Bar Component

```
Frame: FilterBar
Size: 1120 x 80
Background: White
Border Radius: 12px
Box Shadow: 0 2px 8px rgba(0,0,0,0.05)
Padding: 24px

Layout: Auto-layout horizontal, gap 16px

Elements:
├── Search Field
│   └── Input
│   └── Size: 200px x 40px
│   └── Border: 1px solid #e2e8f0
│   └── Border Radius: 8px
│   └── Placeholder: "Address / TxHash"
│
├── Status Dropdown
│   └── Select
│   └── Size: 200px x 40px
│   └── Options: All, Success, Failed, Flagged
│
└── Date Range Group
    ├── Start Date Input (150px x 40px)
    └── End Date Input (150px x 40px)
```

### 3. Refund Log Table

```
Frame: RefundLogTable
Size: 1120 x 740
Background: White
Border Radius: 12px
Box Shadow: 0 2px 8px rgba(0,0,0,0.05)

Components:
├── Table Header
│   └── Height: 48px
│   └── Background: #f8fafc
│   └── Font: 12px Bold, Uppercase, #64748b
│   └── Padding: 16px 24px
│
└── Table Rows
    └── Height: 64px each
    └── Border Bottom: 1px solid #f1f5f9
    └── Hover: Background #f8fafc
    └── Selected: Background #ede9fe
    └── Padding: 16px 24px

Status Badge Variations:
├── Success: ✅ + "success"
├── Failed: ❌ + "failed"
└── Flagged: 🚩 + "flagged"
```

### 4. Contributor Panel

```
Frame: ContributorPanel
Size: 320 x 820
Background: White
Border Left: 1px solid #e2e8f0
Padding: 24px

Sections:

A) Profile Header (Auto height)
   ├── Avatar Circle
   │   └── Size: 48px x 48px
   │   └── Background: gradient
   │   └── Icon: "🛡️"
   ├── Address Text
   │   └── Font: 14px Monospace, #1e293b
   └── Role Label
       └── Font: 12px Uppercase, #64748b

B) Reputation Score (180px height)
   ├── Score Card (120px)
   │   └── Background: gradient
   │   └── Color: White
   │   └── Border Radius: 12px
   │   └── Center aligned
   │   └── Label: "Total Score"
   │   └── Value: Large number (48px)
   │
   └── Stats Grid (2x2)
       ├── Flags Card
       └── Reviews Card

C) Badges Section (flexible)
   ├── Title: "🏅 Badges (X)"
   └── Badge List
       └── Badge Item (56px each)
           ├── Icon (24px emoji)
           ├── Name (14px Bold)
           └── Description (12px, #64748b)

D) Progress Section (flexible)
   ├── Title: "📊 Badge Progress"
   └── Progress Items
       ├── Progress Label + Value
       └── Progress Bar (4px height)
```

### 5. Log Detail Panel (Sliding)

```
Frame: LogDetailPanel
Size: 500 x 100vh
Position: Fixed right
Background: White
Box Shadow: -4px 0 24px rgba(0,0,0,0.15)
Animation: Slide in from right (0.3s ease-out)

Header (80px):
├── Background: gradient
├── Color: White
├── Title: "📋 Transaction Details"
└── Close Button (32px circle)

Content (scrollable):
├── Info Section (repeated)
│   ├── Section Title (12px Bold Uppercase)
│   └── Info Rows
│       ├── Label (14px Semibold, #475569)
│       └── Value (14px Monospace, #1e293b)
│
└── Flag Form (if active)
    ├── Background: #fef3c7
    ├── Border Radius: 8px
    ├── Padding: 16px
    ├── Textarea (4 rows)
    └── Button Group

Footer (fixed bottom):
├── Padding: 24px
├── Border Top: 1px solid #e2e8f0
└── Button Stack (vertical, gap 16px)
    ├── Flag Button (Warning style)
    ├── Explorer Button (Info style)
    └── Review Button (Success style)
```

## 🎯 Component States

### Button States

```
Default:
- Background: [color]
- Border: none
- Shadow: none

Hover:
- Transform: translateY(-1px)
- Shadow: 0 4px 12px rgba(color, 0.3)

Active:
- Transform: translateY(0)
- Shadow: inset 0 2px 4px rgba(0,0,0,0.1)

Disabled:
- Opacity: 0.5
- Cursor: not-allowed
```

### Table Row States

```
Default:
- Background: White
- Border: Bottom only

Hover:
- Background: #f8fafc
- Cursor: pointer

Selected:
- Background: #ede9fe
- Border: 2px solid #667eea

Focus:
- Outline: 2px solid #667eea
- Outline Offset: 2px
```

### Input States

```
Default:
- Border: 1px solid #e2e8f0
- Background: White

Focus:
- Border: 1px solid #667eea
- Box Shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)

Error:
- Border: 1px solid #991b1b
- Box Shadow: 0 0 0 3px rgba(153, 27, 27, 0.1)
```

## 📱 Responsive Breakpoints

```
Desktop Large: 1440px+
Desktop: 1024px - 1439px
Tablet: 768px - 1023px
Mobile: 320px - 767px

Responsive Adjustments:
- Tablet: Sidebar collapses to overlay
- Mobile: Table switches to card view
```

## 🎨 Icon Library

```
Emojis Used:
🛡️ - Shield (Auditor/Security)
🚩 - Flag (Warning/Report)
✅ - Success
❌ - Failed
📊 - Export/Analytics
🏅 - Badges
📋 - Clipboard/Details
🔍 - Search/Inspect
✓ - Checkmark (Complete)
👤 - User/Profile
🏆 - Trophy (Reputation)
📜 - Scroll (Auditor OG)
👁️ - Eye (Eagle Eye)
⭐ - Star (Master)
```

## 🔄 Animations

```
Slide In (Panel):
- From: translateX(100%)
- To: translateX(0)
- Duration: 0.3s
- Easing: ease-out

Fade In:
- From: opacity 0
- To: opacity 1
- Duration: 0.2s
- Easing: ease-in-out

Button Hover:
- Transform: translateY(-1px)
- Duration: 0.2s
- Easing: ease-out

Progress Bar Fill:
- Width: 0% → actual%
- Duration: 0.3s
- Easing: ease-in-out
```

## 🛠️ Implementation Notes

### For Designers

1. Create a component library in Figma with all base components
2. Use Auto Layout for responsive behavior
3. Create variants for button states
4. Use color styles for consistency
5. Create text styles for typography
6. Use grids (8px base) for alignment

### For Developers

1. All measurements are in the CSS files
2. Colors match the design system
3. Use existing components as reference
4. Animations are CSS transitions
5. Responsive breakpoints in media queries

## 📦 Figma File Structure

```
Pages:
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Components
│
├── 🖼️ Desktop Views
│   ├── Dashboard - Default
│   ├── Dashboard - With Detail Panel
│   ├── Dashboard - Filtered
│   └── Dashboard - Empty State
│
├── 📱 Mobile Views
│   ├── Dashboard Mobile
│   ├── Detail View Mobile
│   └── Filter Sheet Mobile
│
└── 🔄 Interactions
    ├── Flag Submission Flow
    ├── Badge Unlock Animation
    └── Filter Interaction
```

## 🎓 Best Practices

1. **Consistency**: Use the design system for all new components
2. **Accessibility**: Ensure proper contrast ratios (WCAG AA)
3. **Spacing**: Always use multiples of 8px
4. **Typography**: Limit to 3-4 font sizes per page
5. **Colors**: Use semantic colors (success, warning, error)
6. **Icons**: Keep icon sizes consistent (16px, 24px, 32px)
7. **Shadows**: Use shadows to establish hierarchy
8. **States**: Always design hover, active, disabled states

---

**Ready for Figma!** 🎨

Use this guide to create a pixel-perfect design in Figma that matches the implemented React components.
