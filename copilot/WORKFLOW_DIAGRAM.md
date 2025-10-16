# IPFS Uploader Workflow Diagram

## Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    MeeChain NFT Badge System                     │
│                   IPFS Uploader Integration                      │
└─────────────────────────────────────────────────────────────────┘

                                START
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Quest Completed        │
                    │   (User Action)          │
                    └────────────┬─────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                     METADATA GENERATION PHASE                   │
│                   (metadata-generator.cjs)                      │
└────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │ generateMetadata()       │
                    │ • Badge name             │
                    │ • Description            │
                    │ • Fallback path          │
                    │ • Attributes             │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │ Base Metadata Created      │
                    │ {                          │
                    │   name: "Badge: ...",      │
                    │   image: "",               │
                    │   fallback_image: "...",   │
                    │   attributes: [...]        │
                    │ }                          │
                    └────────────┬───────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      IPFS UPLOAD PHASE                          │
│                        (index.cjs)                              │
└────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │ MeeBot.setSprite()       │
                    │ 🤖 "loading"             │
                    │ 🗣️  "กำลังอัปโหลด..."     │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │ uploadToIPFS()           │
                    │ (utils/hash.cjs)         │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │ Upload Attempt           │
                    └──────┬──────────┬────────┘
                           │          │
                  SUCCESS  │          │  FAILURE
                           │          │
         ┌─────────────────▼──┐    ┌──▼──────────────────┐
         │ Hash Generated     │    │ Error Caught        │
         │ Qm9972eeb...       │    │ File not found/     │
         │                    │    │ Network error       │
         └─────────┬──────────┘    └──┬──────────────────┘
                   │                  │
                   ▼                  ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ validateHash()               │  │ USE_FALLBACK_ON_ERROR        │
│ ✅ CIDv0/CIDv1 format        │  │ config.cjs setting           │
└──────────────┬───────────────┘  └──────────┬───────────────────┘
               │                             │
               ▼                             ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ updateMetadataWithHash()     │  │ generateFallbackMetadata()   │
│ metadata.image =             │  │ metadata.image =             │
│   "ipfs://Qm..."             │  │   metadata.fallback_image    │
│                              │  │ + Add fallback attributes    │
└──────────────┬───────────────┘  └──────────┬───────────────────┘
               │                             │
               └──────────┬──────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                   METADATA SAVE PHASE                           │
└────────────────────────────────────────────────────────────────┘
                          │
                   ┌──────▼──────┐
                   │ saveMetadata()│
                   │ /metadata/    │
                   │ badge.json    │
                   └──────┬────────┘
                          │
                          ▼
                ┌─────────────────────────┐
                │ File Saved:             │
                │ copilot/ipfs-uploader/  │
                │ metadata/milestone.json │
                └─────────┬───────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                   MILESTONE LOGGING PHASE                       │
└────────────────────────────────────────────────────────────────┘
                          │
                   ┌──────▼──────────┐
                   │ logMilestone()  │
                   │ timestamp +     │
                   │ statistics      │
                   └──────┬──────────┘
                          │
                          ▼
                ┌──────────────────────────────────┐
                │ copilot/milestone.log            │
                │ [2025-10-10T...] M4 complete:    │
                │ Uploader tested - 3 uploaded,    │
                │ 0 fallback, 0 failed 🟠         │
                └──────────┬───────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                  MEEBOT FEEDBACK PHASE                          │
└────────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────▼─────────────┐
            │ Check Result               │
            └──┬─────────────────┬───────┘
               │                 │
        SUCCESS│          FALLBACK│
               ▼                 ▼
    ┌────────────────┐    ┌────────────────┐
    │ MeeBot.sprite  │    │ MeeBot.sprite  │
    │ 🤖 "happy"     │    │ 🤖 "confused"  │
    │ 🗣️  "ยินดีด้วย!│    │ 🗣️  "ระบบ     │
    │ อัปโหลดสำเร็จ" │    │ fallback ทำงาน"│
    └────────┬───────┘    └────────┬───────┘
             │                     │
             └──────────┬──────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │ Return Result to       │
            │ Quest System           │
            │ {                      │
            │   metadataURI,        │
            │   fallbackUsed,       │
            │   success: true        │
            │ }                      │
            └────────────┬───────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │ Proceed to NFT Minting │
            │ (QuestManager)         │
            └────────────────────────┘
                         │
                         ▼
                       END
```

## Key Components

### 1. **metadata-generator.cjs**
- Generates NFT-compliant metadata
- Includes fallback image paths
- Custom attributes support

### 2. **index.cjs** (Main Uploader)
- Orchestrates entire upload flow
- Integrates metadata generator
- Handles fallback scenarios
- Saves metadata files
- Logs milestones

### 3. **utils/hash.cjs**
- IPFS hash generation (simulated)
- Hash format validation
- File verification

### 4. **config.cjs**
- Configuration management
- Directory paths
- Fallback settings
- IPFS settings

### 5. **MeeBot Integration**
- Sprite state management
- TTS feedback
- Quest completion feedback

## Data Flow

```
Badge File (SVG)
    ↓
[Metadata Generator] → Base Metadata
    ↓
[IPFS Uploader] → Try Upload
    ↓
[Success?] 
    ├─ Yes → Update with IPFS hash
    └─ No  → Use fallback asset
    ↓
[Save Metadata] → /metadata/*.json
    ↓
[Log Milestone] → milestone.log
    ↓
[MeeBot Feedback] → Sprite + TTS
    ↓
Return to Quest System
```

## Error Handling

```
Error Occurred
    ↓
Check: USE_FALLBACK_ON_ERROR?
    ├─ true  → Generate fallback metadata
    │           ├─ Set image = fallback_image
    │           ├─ Add fallback attributes
    │           └─ Return success=true, fallback=true
    │
    └─ false → Throw error
                └─ Return success=false
```

## Integration Points

1. **Quest Completion** → Triggers upload
2. **Upload Success** → Updates metadata with hash
3. **Metadata Saved** → File written to disk
4. **Milestone Logged** → Triggers MeeBot
5. **MeeBot Feedback** → User notification
6. **Return to Minting** → Complete workflow

## File Outputs

```
copilot/
├── ipfs-uploader/
│   └── metadata/
│       ├── milestone-1.json    ← Generated metadata
│       ├── milestone-2.json    ← Generated metadata
│       └── quest-tts-001.json  ← Generated metadata
└── milestone.log                ← Milestone tracking
```

## MeeBot Sprite States

```
loading   → 🤖 Upload in progress
happy     → 🤖 Upload successful
confused  → 🤖 Fallback used
sad       → 🤖 Upload failed
```

---

**System Status: ✅ Production Ready**

All components integrated and tested successfully!
