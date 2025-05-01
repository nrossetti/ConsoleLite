# ConsoleLite 🛠

A lightweight, docked debug console for web development.  
Resizable, collapsible, and clipboard-friendly — no dev tools needed.

---

## 🔧 Features

- 📄 Log strings or objects with timestamps and levels  
- 🗂️ Collapsible log entries  
- 📋 One-click copy to clipboard  
- 🗑️ Clear all logs  
- 🗕 Minimize and expand panel  
- ↕️ Drag-to-resize (docked at bottom)  
- 💾 Remembers size + state via localStorage  

---

## 🚀 Installation

### CDN

```html
<script src="https://cdn.statically.io/gh/nrossetti/ConsoleLite/main/debug-console.js"></script>
```

### Manual

Download [`debug-console.js`](https://github.com/nrossetti/ConsoleLite/blob/main/debug-console.js) and include:

```html
<script src="debug-console.js"></script>
```

---

## 📦 Usage

Call from anywhere in your JS:

```js
logData("Hello world");
logInfo({ user: "nick", items: [1, 2, 3] });
logError("Something went wrong");
```

Or use the full API:

```js
DebugConsole.log("info level log");
DebugConsole.info({ debug: true });
DebugConsole.error("fatal error");
```

### 🧭 Controls

- **📋 Copy** – Copy all logs to clipboard
- **🗑️ Clear** – Clear all log entries
- **🗕 Minimize** – Collapse the panel (remembers state)
- **❌ Close** – Hides the console (use hotkey to reopen)

### ⌨️ Hotkey

Press **Ctrl + `** (backtick) to toggle the console open or closed.  
If closed manually, this shortcut will bring it back.

---

## License

MIT
