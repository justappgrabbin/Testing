# ⬡ Trident — Self-Building GNN App (Expo / React Native)

A mobile-first app with a Graph Neural Network that learns, grows, and persists across sessions.
Generate apps/games/agents via AI, pick and extract ZIPs, paste code to run instantly.

---

## Quick Start

```bash
# 1. Install deps
npm install

# 2. Start Expo
npx expo start

# 3. Open on device
#    → Scan QR with Expo Go (iOS/Android)
#    → Press 'i' for iOS Simulator
#    → Press 'a' for Android Emulator
```

---

## API Key Setup

1. Launch the app
2. Tap the **Agent** tab → **⚙ Settings**
3. Enter your Anthropic API key (`sk-ant-api03-…`)
4. Tap **Save Key** — it's stored in AsyncStorage, never leaves the device except to call `api.anthropic.com`

> **Note:** For production distribution, proxy the API through your own backend instead of bundling the key.

---

## Features

| Tab | What it does |
|-----|-------------|
| ⚡ Builder | Prompt → AI generates HTML app/game/agent. Preview in WebView, view/copy code, or paste your own code to run. Refine via chat. |
| 🖼 Gallery | Browsable grid of all generated items. Live WebView thumbnails. Tap to see full preview or copy code. |
| 📁 Files | Pick any file. ZIPs are fully extracted with fflate. HTML files inside ZIPs can be sent directly to the Builder to run. AI can analyze any file. |
| 🤖 Agent | Add goals, trigger evolution cycles (AI plans GNN improvements), view learning history. GNN persists via AsyncStorage. |

---

## Architecture

```
App.js                        ← Root: state + tab routing
src/
  api/claude.js               ← Anthropic API (direct, no CORS in RN)
  engine/TridentGNN.js        ← GNN: nodes, edges, weights, AsyncStorage
  components/
    BottomNav.js              ← Thumb-friendly tab bar with safe area
    GNNPanel.js               ← Live stats chip row
  screens/
    BuilderScreen.js          ← Generate | Preview | Code | Paste + Chat
    GalleryScreen.js          ← FlatList grid + detail modal
    FilesScreen.js            ← expo-document-picker + fflate ZIP extraction
    AgentScreen.js            ← Goals + Evolution + Settings
```

---

## Key Dependencies

| Package | Why |
|---------|-----|
| `react-native-webview` | Renders generated HTML (replaces iframes) |
| `expo-document-picker` | Native file picker (any type, including ZIPs) |
| `expo-file-system` | Reads picked files as base64 for ZIP extraction |
| `fflate` | Pure-JS ZIP extraction — works in React Native |
| `expo-clipboard` | Copy code to clipboard |
| `@react-native-async-storage/async-storage` | GNN persistence across sessions |
| `react-native-safe-area-context` | Handles notch / home indicator |

---

## Building for Production

```bash
# EAS Build (recommended)
npm install -g eas-cli
eas build --platform ios      # or android
eas submit                    # App Store / Play Store
```

For production: move the Anthropic API call to your own backend and pass requests through it. Do not ship the raw API key in the app bundle.
