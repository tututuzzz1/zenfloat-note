# ZenFloat Note

A minimalist floating note-taking Chrome extension using the Document Picture-in-Picture API.

![Version](https://img.shields.io/badge/version-1.0.18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **🪟 True Floating Window**: Uses Document Picture-in-Picture API to create a persistent floating window that stays on top across all tabs
- **📝 Real-time Editing**: Contenteditable area with live character count
- **💾 Auto-save**: Automatic saving with persistent storage (chrome.storage.local)
- **🎨 Theme Toggle**: Switch between light theme (white background, black text) and dark theme (black background, white text)
- **📦 Fold/Unfold**: Collapse window to a horizontal bar to save screen space
- **📤 Export**: Save notes as Markdown (.md) files using File System Access API
- **🎯 Minimalist Design**: Industrial design inspired by Ricoh GR camera - high contrast black/white/gray color scheme

## Installation

### From Source

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `zenfloat-note` directory
5. Click the extension icon to launch

### From Release

1. Download the latest `zenfloat-note-v1.0.18.zip` from [Releases](https://github.com/tututuzzz1/zenfloat-note/releases)
2. Unzip the file
3. Follow steps 2-5 from "From Source" above

## Usage

1. **Launch**: Click the extension icon in Chrome toolbar
2. **Start Float**: Click "CLICK TO START FLOAT" button in the launcher page
3. **Take Notes**: Start typing in the floating window
4. **Toggle Theme**: Click the second button (theme icon) to switch between light and dark themes
5. **Fold/Unfold**: Click the first button to collapse/expand the window
6. **Export**: Click the third button (download icon) to save notes as a Markdown file

## Keyboard Shortcuts

- The floating window supports standard text editing shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, etc.)

## Technical Details

### Architecture

```
Extension Icon Click
    ↓
Launcher Page (launcher.html)
    ↓
Document PiP Window (pip.html)
    ↓
Injected Scripts (pip.js + style.css)
```

### Key Technologies

- **Manifest V3**: Modern Chrome extension architecture
- **Document Picture-in-Picture API**: Creates true floating windows
- **File System Access API**: Enables direct file saving
- **Chrome Storage API**: Persistent note storage
- **CSS Variables**: Dynamic theme switching

### File Structure

```
zenfloat-note/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Service worker
├── launcher.html          # Launcher page UI
├── launcher.js            # Launcher logic
├── pip.html               # Floating window structure
├── pip.js                 # Core note-taking logic
├── style.css              # Minimalist industrial design
├── popup.html             # (Legacy, not used)
└── popup.js               # (Legacy, not used)
```

## Browser Compatibility

- **Chrome**: Version 116+ (Document Picture-in-Picture API support required)
- **Edge**: Version 116+ (Chromium-based)
- **Other browsers**: Not supported (requires Document PiP API)

## Permissions

- `storage`: Save notes persistently
- `activeTab`: Access current tab information (reserved for future features)
- `tabs`: Tab management (reserved for future features)
- `scripting`: Inject scripts into pages (reserved for future features)

## Privacy

- All notes are stored locally in your browser using `chrome.storage.local`
- No data is sent to external servers
- No tracking or analytics
- Theme preferences are stored in `localStorage`

## Development

### Prerequisites

- Chrome 116+ or Edge 116+
- Basic knowledge of Chrome Extension development

### Local Development

1. Clone the repository
2. Make changes to the source files
3. Reload the extension in `chrome://extensions/`
4. Test the changes

### Version History

- **v1.0.18** (Current): Theme toggle feature, removed link capture
- **v1.0.17**: Attempted to fix link capture via Service Worker
- **v1.0.16**: Implemented postMessage communication for storage
- **v1.0.15**: Stable launcher-based injection approach
- **v1.0.1-v1.0.14**: Various iterations and bug fixes

## Known Limitations

- Floating window requires the launcher page to remain open (in background) for storage operations
- File System Access API may not work in all contexts
- Document PiP API is only available in Chromium-based browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

[@tututuzzz1](https://github.com/tututuzzz1)

## Acknowledgments

- Inspired by the minimalist design philosophy of Ricoh GR cameras
- Built with the Document Picture-in-Picture API
- Uses modern Chrome Extension Manifest V3

---

**Note**: This extension requires Chrome 116+ or Edge 116+ with Document Picture-in-Picture API support.
