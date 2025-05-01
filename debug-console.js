/*!
 * DebugConsole.js
 * A docked, resizable debug panel for web development.
 * https://github.com/yourname/debug-console
 */

(function () {
  const STORAGE_KEYS = {
    MINIMIZED: "debugConsole:isMinimized",
    HEIGHT: "debugConsole:height"
  };

  function initDebugPanel() {
    if (document.getElementById("debugWrapper")) return;

    const isMinimized = localStorage.getItem(STORAGE_KEYS.MINIMIZED) === "true";
    const savedHeight = localStorage.getItem(STORAGE_KEYS.HEIGHT);

    const wrapper = document.createElement("div");
    wrapper.id = "debugWrapper";
    Object.assign(wrapper.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      height: isMinimized ? "32px" : (savedHeight || "250px"),
      background: "#1e1e1e",
      color: "#f1f1f1",
      fontFamily: "monospace",
      fontSize: "12px",
      zIndex: 10000,
      borderTop: "1px solid #444",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 -2px 10px rgba(0,0,0,0.5)"
    });

    // Resizer
    const resizer = document.createElement("div");
    Object.assign(resizer.style, {
      height: "5px",
      cursor: "ns-resize",
      background: "#222"
    });

    resizer.onmousedown = function (e) {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = parseInt(getComputedStyle(wrapper).height, 10);

      function onMove(e) {
        const newHeight = startHeight + (startY - e.clientY);
        wrapper.style.height = `${newHeight}px`;
        localStorage.setItem(STORAGE_KEYS.HEIGHT, `${newHeight}px`);
      }

      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    // Header
    const handle = document.createElement("div");
    Object.assign(handle.style, {
      background: "#333",
      padding: "6px 10px",
      fontWeight: "bold",
      userSelect: "none",
      borderBottom: "1px solid #555",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    });

    const title = document.createElement("div");
    title.textContent = "🛠 Debug Console";

    const buttons = document.createElement("div");
    Object.assign(buttons.style, { display: "flex", gap: "10px" });

    const iconBtn = (emoji, title, action) => {
      const btn = document.createElement("span");
      btn.innerText = emoji;
      btn.title = title;
      btn.style.cursor = "pointer";
      btn.onclick = action;
      return btn;
    };

    const logArea = document.createElement("div");
    logArea.id = "debugArea";
    Object.assign(logArea.style, {
      padding: "10px",
      flexGrow: "1",
      overflowY: "auto",
      whiteSpace: "pre-wrap",
      display: isMinimized ? "none" : "block"
    });

    const minimizeBtn = iconBtn("🗕", "Minimize", () => {
      const minimized = logArea.style.display !== "none";
      logArea.style.display = minimized ? "none" : "block";
      wrapper.style.height = minimized ? "32px" : (localStorage.getItem(STORAGE_KEYS.HEIGHT) || "250px");
      minimizeBtn.innerText = minimized ? "🗖" : "🗕";
      localStorage.setItem(STORAGE_KEYS.MINIMIZED, minimized);
    });

    const clearBtn = iconBtn("🗑️", "Clear logs", () => (logArea.innerHTML = ""));
    const closeBtn = iconBtn("❌", "Close console", () => {
      localStorage.removeItem(STORAGE_KEYS.MINIMIZED);
      localStorage.removeItem(STORAGE_KEYS.HEIGHT);
      wrapper.remove();
    });

    const copyBtn = iconBtn("📋", "Copy logs", () => {
      const logs = Array.from(logArea.querySelectorAll("div")).map(entry => {
        const header = entry.querySelector("div span:nth-child(2)")?.textContent || "[UNKNOWN]";
        const body = entry.querySelector("pre")?.textContent || "";
        return `${header}\n${body}`;
      }).join("\n\n");

      navigator.clipboard?.writeText(logs).then(() => {
        copyBtn.innerText = "✅";
        setTimeout(() => (copyBtn.innerText = "📋"), 1000);
      }).catch(() => {
        const temp = document.createElement("textarea");
        temp.value = logs;
        document.body.appendChild(temp);
        temp.select();
        try {
          document.execCommand("copy");
        } catch {}
        document.body.removeChild(temp);
        copyBtn.innerText = "✅";
        setTimeout(() => (copyBtn.innerText = "📋"), 1000);
      });
    });

    buttons.append(copyBtn, clearBtn, minimizeBtn, closeBtn);
    handle.append(title, buttons);
    wrapper.append(resizer, handle, logArea);
    document.body.appendChild(wrapper);
  }

  function logData(data, level = "info") {
    initDebugPanel();
    const logArea = document.getElementById("debugArea");

    const entry = document.createElement("div");
    entry.style.marginBottom = "8px";
    entry.style.borderBottom = "1px solid #444";

    const levelColors = {
      info: "#ccc",
      warn: "#ffcc00",
      error: "#ff5555",
      debug: "#66ccff"
    };

    const time = new Date().toLocaleTimeString();
    const color = levelColors[level] || "#ccc";

    const header = document.createElement("div");
    header.style.color = color;
    header.style.fontWeight = "bold";
    header.style.cursor = "pointer";
    header.style.padding = "4px 0";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "6px";

    const icon = document.createElement("span");
    icon.textContent = "▼";

    const labelText = `[${time}] ${level.toUpperCase()}`;
    const text = document.createElement("span");
    text.textContent = labelText;

    const body = document.createElement("pre");
    body.style.margin = "0 0 8px 0";
    body.style.color = "#aaa";
    body.style.display = "block";
    body.textContent = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);

    header.onclick = () => {
      const isShown = body.style.display !== "none";
      body.style.display = isShown ? "none" : "block";
      icon.textContent = isShown ? "▶" : "▼";
    };

    header.append(icon, text);
    entry.append(header, body);
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
  }

  // Public API
  window.DebugConsole = {
    log: data => logData(data, "info"),
    info: data => logData(data, "debug"),
    error: data => logData(data, "error")
 };

  // Shorter developer-friendly aliases
  window.logData = DebugConsole.log;
  window.logInfo = DebugConsole.info;
  window.logError = DebugConsole.error;
})();
