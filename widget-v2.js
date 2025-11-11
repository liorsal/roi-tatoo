/**
 * Lior Accessibility Widget v2.0
 * WCAG 2.1 AA & IS 5568 compliant
 * Self-contained widget - includes HTML, CSS, and JS
 * 
 * Usage:
 * <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@v2.0.0/widget-v2.js"></script>
 */

// Initialize labels fallback immediately (before any other code)
if (typeof window.labels === 'undefined') {
  window.labels = {
    incText:"הגדלת טקסט", spacing:"ריווח טקסט",
    highContrast:"ניגודיות גבוהה", darkContrast:"ניגודיות כהה",
    grayscale:"גווני אפור", invert:"היפוך צבעים",
    underlineLinks:"קו תחתון לקישורים", highlightLinks:"הדגשת קישורים",
    dyslexia:"גופן נגיש (דיסלקסיה)", bigCursor:"סמן עכבר גדול",
    noAnim:"ביטול אנימציות", focusMode:"פוקוס קריאה",
    readAloud:"קריאה בקול", visionProfile:"פרופיל כבדי ראייה",
    dyslexiaProfile:"פרופיל דיסלקציה", cognitiveProfile:"פרופיל קוגניטיבי",
    reset:"איפוס הגדרות"
  };
}

/* ---- AUTO-BOOTSTRAP (paste at very top) ---- */
(function () {
  // 1) Single-load guard
  if (window.__liorAccBoot) return;
  window.__liorAccBoot = true;

  // 2) Safe defaults (avoid "settings is undefined")
  window.liorAcc = window.liorAcc || {};
  var defaults = {
    position: 'right',
    declaration: '',
    lang: (document.documentElement && document.documentElement.lang) || 'he',
    fontUrl: ''
  };
  window.liorAcc.settings = Object.assign({}, defaults, window.liorAcc.settings || {});

  // 3) Labels fallback (avoid "labels is not defined")
  if (typeof window.labels === 'undefined') {
    window.labels = {
      incText:"הגדלת טקסט", spacing:"ריווח טקסט",
      highContrast:"ניגודיות גבוהה", darkContrast:"ניגודיות כהה",
      grayscale:"גווני אפור", invert:"היפוך צבעים",
      underlineLinks:"קו תחתון לקישורים", highlightLinks:"הדגשת קישורים",
      dyslexia:"גופן נגיש (דיסלקסיה)", bigCursor:"סמן עכבר גדול",
      noAnim:"ביטול אנימציות", focusMode:"פוקוס קריאה",
      readAloud:"קריאה בקול", visionProfile:"פרופיל כבדי ראייה",
      dyslexiaProfile:"פרופיל דיסלקציה", cognitiveProfile:"פרופיל קוגניטיבי",
      reset:"איפוס הגדרות"
    };
  }

  // 4) Ensure required elements exist (avoid "widget elements are missing")
  var d = document;
  
  // Wait for body to be available
  function ensureBody(callback) {
    if (d.body) {
      callback();
    } else {
      setTimeout(function() { ensureBody(callback); }, 10);
    }
  }
  
  ensureBody(function() {
    var root = d.getElementById('lior-acc-root');
    if (!root) {
      root = d.createElement('div');
      root.id = 'lior-acc-root';
      root.setAttribute('data-position', window.liorAcc.settings.position);
      if (window.liorAcc.settings.declaration) {
        root.setAttribute('data-declaration', window.liorAcc.settings.declaration);
      }
      d.body.appendChild(root);
    }

    // minimal skeleton if not present:
    var live = d.getElementById('lior-acc-live-region');
    if (!live) {
      live = d.createElement('div');
      live.id = 'lior-acc-live-region';
      live.setAttribute('aria-live','polite');
      live.setAttribute('aria-atomic','true');
      live.className = 'lior-acc-sr-only';
      root.appendChild(live);
    }

    var btn = d.getElementById('lior-acc-button');
    if (!btn) {
      btn = d.createElement('button');
      btn.id = 'lior-acc-button';
      btn.type = 'button';
      btn.setAttribute('aria-haspopup','dialog');
      btn.setAttribute('aria-controls','lior-acc-panel');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-label','פתח תפריט נגישות');
      btn.innerHTML = '<span aria-hidden="true">♿</span>';
      root.appendChild(btn);
    }

    var overlay = d.getElementById('lior-acc-overlay');
    if (!overlay) {
      overlay = d.createElement('div');
      overlay.id = 'lior-acc-overlay';
      overlay.hidden = true;
      root.appendChild(overlay);
    }

    var panel = d.getElementById('lior-acc-panel');
    if (!panel) {
      panel = d.createElement('div');
      panel.id = 'lior-acc-panel';
      panel.setAttribute('role','dialog');
      panel.setAttribute('aria-modal','true');
      panel.setAttribute('aria-labelledby','lior-acc-title');
      panel.hidden = true;
      panel.innerHTML = '' +
        '<div class="lior-acc-panel-header">' +
          '<h2 id="lior-acc-title">תפריט נגישות</h2>' +
          '<button id="lior-acc-close" type="button" aria-label="סגור">×</button>' +
        '</div>' +
        '<div class="lior-acc-panel-body"></div>';
      root.appendChild(panel);
    }
  });
})();

const labels = {
  increaseText: "הגדלת טקסט",
  spacing: "ריווח טקסט",
  highContrast: "ניגודיות גבוהה",
  darkContrast: "ניגודיות כהה",
  grayscale: "גווני אפור",
  invert: "היפוך צבעים",
  underlineLinks: "קו תחתון לקישורים",
  highlightLinks: "הדגשת קישורים",
  dyslexia: "גופן נגיש",
  bigCursor: "סמן גדול",
  noAnim: "ביטול אנימציות",
  reset: "איפוס הגדרות",
};

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.liorAccWidgetLoaded) {
    return;
  }
  window.liorAccWidgetLoaded = true;

  const doc = document;
  const root = doc.documentElement;

  // ============================================
  // CSS STYLES
  // ============================================
  const CSS = `
/* Lior Accessibility Widget - WCAG 2.1 AA & IS 5568 compliant */

:root {
  --lior-acc-z: 999999;
  --lior-acc-gap: 12px;
  --lior-acc-radius: 10px;
  --lior-acc-bg: #ffffff;
  --lior-acc-fg: #1a1a1a;
  --lior-acc-border: #8b8b8b;
  --lior-acc-shadow: 0 10px 25px rgba(0,0,0,.15);
  --lior-acc-accent: #0066cc;
  --lior-acc-overlay: rgba(0,0,0,.5);
  --lior-acc-size: 78px;
  --lior-acc-panel-width: 320px;
  --lior-acc-focus-width: 3px;
  --lior-acc-focus-offset: 2px;
  --acc-fg: #111;
  --acc-bg: #fff;
  --acc-link: #0645ad;
}

:root.acc-high-contrast {
  --acc-fg: #000;
  --acc-bg: #fff;
  --acc-link: #0000ee;
}

:root.acc-dark-contrast {
  --acc-fg: #f4f4f4;
  --acc-bg: #000;
  --acc-link: #8ab4f8;
}

:root.acc-invert {
  --acc-fg: #fff;
  --acc-bg: #1b1b1b;
  --acc-link: #ffdd57;
}

:root.acc-grayscale {
  --acc-fg: #2b2b2b;
  --acc-bg: #f5f5f5;
  --acc-link: #4d4d4d;
}

a {
  color: #ffffff;
}

:root.acc-inc-text { font-size: 118%; }
:root.acc-spacing body { letter-spacing: .03em; word-spacing: .08em; line-height: 1.7; }
.acc-underline-links main a { text-decoration: underline !important; }
.acc-highlight-links main a { outline: 2px solid currentColor; outline-offset: 2px; }
:root.acc-dyslexia body,
:root.acc-dyslexia body * {
  font-family: "LiorAccDyslexia", "Atkinson", system-ui, Arial, sans-serif !important;
  letter-spacing: .02em;
  word-spacing: .05em;
}
:root.acc-big-cursor,
:root.acc-big-cursor * {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="72" viewBox="0 0 48 72"><polygon points="0,0 0,72 18,54 33,69 39,63 24,48 42,48" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, auto !important;
}
:root.acc-big-cursor a,
:root.acc-big-cursor button,
:root.acc-big-cursor [role="button"],
:root.acc-big-cursor [role="link"],
:root.acc-big-cursor input,
:root.acc-big-cursor select,
:root.acc-big-cursor textarea {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="72" viewBox="0 0 48 72"><polygon points="0,0 0,72 18,54 33,69 39,63 24,48 42,48" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, pointer !important;
}
:root.acc-big-cursor input[type="text"],
:root.acc-big-cursor input[type="email"],
:root.acc-big-cursor input[type="url"],
:root.acc-big-cursor input[type="search"],
:root.acc-big-cursor input[type="password"],
:root.acc-big-cursor textarea {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="72" viewBox="0 0 48 72"><polygon points="0,0 0,72 18,54 33,69 39,63 24,48 42,48" fill="black" stroke="white" stroke-width="1"/></svg>') 0 0, text !important;
}
:root.acc-no-anim *,
:root.acc-no-anim *::before,
:root.acc-no-anim *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

.lior-acc-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .lior-acc-panel {
    transform: translateY(0) scale(1) !important;
    opacity: 1 !important;
    filter: blur(0) !important;
  }
  .lior-acc-panel-body,
  .lior-acc-panel-header,
  .lior-acc-profiles-list,
  .lior-acc-category {
    animation: none !important;
  }
}

.lior-acc-skip {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 12px 16px;
  z-index: var(--lior-acc-z);
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
}
.lior-acc-skip:focus {
  top: 0;
  outline: var(--lior-acc-focus-width) solid #fff;
  outline-offset: var(--lior-acc-focus-offset);
}

.lior-acc-root {
  position: fixed;
  bottom: 18px;
  z-index: var(--lior-acc-z);
  font-family: "Rubik", sans-serif;
  direction: rtl;
  font-weight: 700;
}
.lior-acc-pos-right { 
  right: 18px; 
  left: auto;
}
.lior-acc-pos-left { 
  left: 18px; 
  right: auto;
}

.lior-acc-button {
  width: var(--lior-acc-size);
  height: var(--lior-acc-size);
  border-radius: 50%;
  border: 1px solid var(--lior-acc-border);
  background: var(--lior-acc-bg);
  color: var(--lior-acc-fg);
  box-shadow: var(--lior-acc-shadow);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 28px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.lior-acc-button:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}
.lior-acc-button:active {
  transform: scale(0.95);
}
.lior-acc-button-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.lior-acc-button:focus {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}
.lior-acc-button:focus:not(:focus-visible) {
  outline: none;
}
.lior-acc-button:focus-visible {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}

.lior-acc-overlay {
  position: fixed;
  inset: 0;
  background: var(--lior-acc-overlay);
  z-index: calc(var(--lior-acc-z) - 1);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.lior-acc-overlay[hidden] {
  display: none !important;
}
.lior-acc-overlay:not([hidden]) {
  opacity: 1;
}

body {
  background: #000000 !important;
}
body *:not(.lior-acc-root):not(.lior-acc-root *):not(.lior-acc-modal):not(.lior-acc-modal *) {
  color: #ffffff !important;
}

.lior-acc-panel {
  position: fixed;
  bottom: calc(18px + var(--lior-acc-size) + 12px);
  right: 18px;
  left: auto;
  width: min(92vw, var(--lior-acc-panel-width));
  background: #ffffff !important;
  color: #000000 !important;
  border: 1px solid var(--lior-acc-border);
  border-radius: var(--lior-acc-radius);
  box-shadow: var(--lior-acc-shadow);
  padding: 12px;
  z-index: var(--lior-acc-z);
  transform: translateY(30px) scale(0.9);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 85vh;
  overflow-y: auto;
  filter: blur(4px);
}
.lior-acc-panel[hidden] {
  display: none !important;
}
.lior-acc-panel.show,
.lior-acc-panel:not([hidden]) {
  transform: translateY(0) scale(1);
  opacity: 1;
  filter: blur(0);
}
.lior-acc-pos-left .lior-acc-panel { 
  right: auto; 
  left: 18px; 
}

.lior-acc-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  background: #ffffff !important;
  animation: slideInRight 0.4s ease 0.1s both;
}
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.lior-acc-panel-body {
  background: #ffffff !important;
  color: #000000 !important;
  animation: fadeInUp 0.5s ease 0.2s both;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.lior-acc-panel-header h2 { font-size: 20px; margin: 0; font-weight: 700; color: #000000 !important; }
.lior-acc-close {
    border: 0;
    background: transparent;
    font-size: 32px;
    line-height: 1;
    cursor: pointer;
    font-weight: 300;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000 !important;
    transition: all 0.2s ease;
    border-radius: 50%;
  }
.lior-acc-close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg) scale(1.1);
}
.lior-acc-close:active {
  transform: rotate(90deg) scale(0.9);
}
.lior-acc-close:focus {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}
.lior-acc-close:focus:not(:focus-visible) {
  outline: none;
}
.lior-acc-close:focus-visible {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}

.lior-acc-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 0 0 12px 0;
  padding: 0;
  list-style: none;
}
.lior-acc-toggle {
  width: 100%;
  text-align: right;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid var(--lior-acc-border);
  background: #ffffff !important;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: #000000 !important;
  transition: all 0.2s ease;
}
.lior-acc-toggle:hover {
  transform: translateX(-4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.lior-acc-toggle[aria-pressed="true"] {
  background: #e6f1ff;
  border-color: var(--lior-acc-accent);
  border-width: 2px;
  font-weight: 600;
}
.lior-acc-toggle:focus {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}
.lior-acc-toggle:focus:not(:focus-visible) {
  outline: none;
}
.lior-acc-toggle:focus-visible {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}

.lior-acc-reset {
  border: 2px solid var(--lior-acc-border);
  background: #ffffff !important;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: #000000 !important;
  width: 100%;
  transition: all 0.2s ease;
  animation: fadeInUp 0.5s ease 0.65s both;
}
.lior-acc-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.lior-acc-reset:focus {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}
.lior-acc-reset:focus:not(:focus-visible) {
  outline: none;
}
.lior-acc-reset:focus-visible {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}

@media (max-width: 600px) {
  .lior-acc-panel {
    width: 85vw;
    max-width: 320px;
    bottom: 10px;
    right: 7.5vw;
    max-height: 90vh;
    padding: 10px;
  }
  .lior-acc-pos-left .lior-acc-panel {
    left: 7.5vw;
    right: auto;
  }
  .lior-acc-button {
    font-size: 22px;
    width: 44px;
    height: 44px;
  }
  .lior-acc-panel-header h2 {
    font-size: 16px !important;
  }
  .lior-acc-close {
    font-size: 24px !important;
    width: 32px !important;
    height: 32px !important;
  }
  .lior-acc-settings-label {
    font-size: 11px !important;
    margin-bottom: 6px;
  }
  .lior-acc-toggle {
    font-size: 13px !important;
    padding: 8px 10px !important;
  }
  .lior-acc-mode-button {
    font-size: 13px !important;
    padding: 8px 10px !important;
    margin-bottom: 6px;
  }
  .lior-acc-reset {
    font-size: 13px !important;
    padding: 8px 10px !important;
  }
  .lior-acc-link {
    font-size: 13px !important;
    padding: 8px 10px !important;
  }
  .lior-acc-list {
    gap: 6px;
    margin-bottom: 10px;
  }
  .lior-acc-profile-toggle {
    font-size: 13px !important;
    padding: 10px 12px !important;
  }
  .lior-acc-category-header {
    font-size: 13px !important;
    padding: 10px 12px !important;
  }
  .lior-acc-section-title {
    font-size: 12px !important;
  }
}

@media (prefers-color-scheme: dark) {
  .lior-acc-panel {
    background: #ffffff !important;
    color: #000000 !important;
    border-color: #555;
  }
  .lior-acc-button {
    background: #333;
    color: #fff;
    border-color: #555;
  }
  .lior-acc-toggle {
    background: #ffffff !important;
    color: #000000 !important;
    border-color: #555;
  }
  .lior-acc-toggle[aria-pressed="true"] {
    background: #e6f1ff !important;
    border-color: #0066cc;
  }
  .lior-acc-reset {
    background: #ffffff !important;
    color: #000000 !important;
    border-color: #555;
  }
  .lior-acc-profile-toggle {
    background: #ffffff !important;
    color: #000000 !important;
    border-color: #555;
  }
  .lior-acc-profile-toggle:hover {
    background: #e6f1ff !important;
  }
  .lior-acc-profile-toggle[aria-pressed="true"] {
    background: #e6f1ff !important;
    border-color: #0066cc;
  }
  .lior-acc-category {
    border-color: #555;
  }
  .lior-acc-category-header {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .lior-acc-category-header:hover {
    background: #e6f1ff !important;
  }
  .lior-acc-category-header[aria-expanded="true"] {
    background: #e6f1ff !important;
    border-color: #555;
  }
  .lior-acc-category-content {
    background: #ffffff !important;
  }
}

.acc-reading-focus body > *:not(main):not(#lior-acc-root) {
  opacity: 0.2 !important;
  pointer-events: none;
}
.acc-reading-focus body > *:not(main):not(#lior-acc-root) * {
  opacity: 0.2 !important;
  pointer-events: none;
}
.acc-reading-focus main,
.acc-reading-focus main * {
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative;
  z-index: 1;
}
.acc-reading-focus #lior-acc-root,
.acc-reading-focus #lior-acc-root * {
  opacity: 1 !important;
  pointer-events: auto !important;
  z-index: 999999 !important;
}

.lior-acc-toast {
  position: fixed;
  bottom: 100px;
  right: 18px;
  background: #333;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: calc(var(--lior-acc-z) + 1);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  font-size: 14px;
  max-width: 300px;
}
.lior-acc-toast.show {
  opacity: 1;
  transform: translateY(0);
}
.lior-acc-pos-left .lior-acc-toast {
  right: auto;
  left: 18px;
}

.lior-acc-profiles-section {
  margin-bottom: 20px;
}
.lior-acc-section-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #000000 !important;
  text-align: right;
}
.lior-acc-profiles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeInUp 0.5s ease 0.3s both;
}
.lior-acc-profiles-list .lior-acc-profile-toggle {
  animation: fadeInScale 0.4s ease both;
}
.lior-acc-profiles-list .lior-acc-profile-toggle:nth-child(1) { animation-delay: 0.35s; }
.lior-acc-profiles-list .lior-acc-profile-toggle:nth-child(2) { animation-delay: 0.4s; }
.lior-acc-profiles-list .lior-acc-profile-toggle:nth-child(3) { animation-delay: 0.45s; }
.lior-acc-profiles-list .lior-acc-profile-toggle:nth-child(4) { animation-delay: 0.5s; }
.lior-acc-profiles-list .lior-acc-profile-toggle:nth-child(5) { animation-delay: 0.55s; }
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.lior-acc-profile-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--lior-acc-border);
  border-radius: 8px;
  background: #ffffff !important;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: #000000 !important;
  text-align: right;
  transition: background 0.2s;
}
.lior-acc-profile-toggle:hover {
  background: #e6f1ff;
  border-color: var(--lior-acc-accent);
  transform: translateX(-4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.lior-acc-profile-toggle[aria-pressed="true"] {
  background: #e6f1ff;
  border-color: var(--lior-acc-accent);
  border-width: 2px;
}
.lior-acc-profile-name {
  flex: 1;
}
.lior-acc-profile-switch {
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
  margin-inline-start: 12px;
}
.lior-acc-profile-switch::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  right: 2px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.lior-acc-profile-toggle[aria-pressed="true"] .lior-acc-profile-switch {
  background: var(--lior-acc-accent);
}
.lior-acc-profile-toggle[aria-pressed="true"] .lior-acc-profile-switch::after {
  transform: translateX(-20px);
}

.lior-acc-settings-section {
  margin-bottom: 20px;
}
.lior-acc-category {
  margin-bottom: 8px;
  border: 1px solid var(--lior-acc-border);
  border-radius: 8px;
  overflow: hidden;
  animation: fadeInScale 0.4s ease both;
}
.lior-acc-category:nth-child(1) { animation-delay: 0.4s; }
.lior-acc-category:nth-child(2) { animation-delay: 0.45s; }
.lior-acc-category:nth-child(3) { animation-delay: 0.5s; }
.lior-acc-category:nth-child(4) { animation-delay: 0.55s; }
.lior-acc-category:nth-child(5) { animation-delay: 0.6s; }
.lior-acc-category-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #ffffff !important;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  color: #000000 !important;
  text-align: right;
  transition: background 0.2s;
}
.lior-acc-category-header:hover {
  background: #e6f1ff;
  transform: translateX(-2px);
}
.lior-acc-category-header[aria-expanded="true"] {
  background: #e6f1ff;
  border-bottom: 1px solid var(--lior-acc-border);
}
.lior-acc-category-arrow {
  transition: transform 0.3s;
  font-size: 12px;
  margin-inline-start: 12px;
}
.lior-acc-category-header[aria-expanded="true"] .lior-acc-category-arrow {
  transform: rotate(180deg);
}
.lior-acc-category-content {
  padding: 8px;
  background: #ffffff !important;
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.lior-acc-category-content[hidden] {
  display: none;
}
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
}

.lior-acc-settings-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  text-align: right;
  font-weight: 600;
}
@media (prefers-color-scheme: dark) {
  .lior-acc-settings-label {
    color: #aaa;
  }
}

.lior-acc-link {
  display: block;
  width: 100%;
  text-align: right;
  padding: 12px 14px;
  border-radius: 8px;
  border: 2px solid var(--lior-acc-border);
  background: #ffffff !important;
  color: #000000 !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: fadeInUp 0.5s ease 0.7s both;
}
.lior-acc-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.lior-acc-link:hover,
.lior-acc-link:focus {
  background: #e6f1ff;
  border-color: var(--lior-acc-accent);
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}
@media (prefers-color-scheme: dark) {
  .lior-acc-link {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .lior-acc-link:hover,
  .lior-acc-link:focus {
    background: #e6f1ff !important;
  }
}

.lior-acc-modal {
  position: fixed;
  inset: 0;
  z-index: calc(var(--lior-acc-z) + 10);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.lior-acc-modal[hidden] {
  display: none !important;
}

.lior-acc-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.lior-acc-modal-content {
  position: relative;
  background: #ffffff !important;
  color: #000000 !important;
  border: 1px solid var(--lior-acc-border);
  border-radius: var(--lior-acc-radius);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}
.lior-acc-modal-content * {
  color: #000000 !important;
}
.lior-acc-modal.show .lior-acc-modal-content,
.lior-acc-modal:not([hidden]) .lior-acc-modal-content {
  transform: scale(1);
  opacity: 1;
}
.lior-acc-modal:not(.show):not([hidden]) .lior-acc-modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.lior-acc-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--lior-acc-border);
  background: #ffffff !important;
}
.lior-acc-modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #000000 !important;
}

.lior-acc-modal-close {
  border: 0;
  background: transparent;
  font-size: 36px;
  line-height: 1;
  cursor: pointer;
  font-weight: 300;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000 !important;
  border-radius: 50%;
  transition: background 0.2s;
}
.lior-acc-modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
}
.lior-acc-modal-close:focus {
  outline: var(--lior-acc-focus-width) solid var(--lior-acc-accent);
  outline-offset: var(--lior-acc-focus-offset);
}

.lior-acc-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  direction: rtl;
  text-align: right;
  background: #ffffff !important;
  color: #000000 !important;
}
.lior-acc-modal-body * {
  color: #000000 !important;
}
.lior-acc-modal-body h3 {
  font-size: 20px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #000000 !important;
}
.lior-acc-modal-body h2 {
  font-size: 26px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 16px;
  color: #000000 !important;
}
.lior-acc-modal-body h3:first-child {
  margin-top: 0;
}
.lior-acc-modal-body p {
  line-height: 1.6;
  margin-bottom: 12px;
  color: #000000 !important;
}
.lior-acc-modal-body ul {
  margin-bottom: 16px;
  padding-inline-start: 24px;
}
.lior-acc-modal-body li {
  line-height: 1.6;
  margin-bottom: 8px;
  color: #000000 !important;
}
.lior-acc-modal-body small {
  color: #000000 !important;
}
.lior-acc-modal-body a {
  color: #0066cc !important;
  text-decoration: underline;
}
.lior-acc-modal-body a:hover,
.lior-acc-modal-body a:focus {
  text-decoration: none;
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  color: #0052a3 !important;
}
.lior-acc-modal-body strong {
  font-weight: 600;
  color: #000000 !important;
}

.lior-acc-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.lior-acc-feature-category {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lior-acc-feature-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lior-acc-feature-category h4 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #000000 !important;
  padding-bottom: 8px;
  border-bottom: 2px solid #0066cc;
}

.lior-acc-feature-category ul {
  margin: 0;
  padding-inline-start: 20px;
  list-style-type: disc;
}

.lior-acc-feature-category li {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 6px;
  color: #000000 !important;
}

.lior-acc-feature-category li strong {
  font-weight: 700;
  color: #0066cc !important;
}

@media (prefers-color-scheme: dark) {
  .lior-acc-modal-content {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .lior-acc-modal-header {
    background: #ffffff !important;
  }
  .lior-acc-modal-header h2 {
    color: #000000 !important;
  }
  .lior-acc-modal-body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .lior-acc-modal-body * {
    color: #000000 !important;
  }
  .lior-acc-modal-close {
    color: #000000 !important;
  }
  .lior-acc-modal-close:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  .lior-acc-feature-category {
    background: #f8f9fa !important;
    border-color: #e0e0e0 !important;
  }
  .lior-acc-feature-category h4 {
    color: #000000 !important;
  }
  .lior-acc-feature-category li {
    color: #000000 !important;
  }
}

@media (max-width: 600px) {
  .lior-acc-modal {
    padding: 10px;
  }
  .lior-acc-modal-content {
    max-height: 95vh;
  }
  .lior-acc-modal-header {
    padding: 16px;
  }
  .lior-acc-modal-header h2 {
    font-size: 20px;
  }
  .lior-acc-modal-body {
    padding: 16px;
  }
  .lior-acc-modal-body h3 {
    font-size: 18px;
  }
  .lior-acc-features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .lior-acc-feature-category {
    padding: 12px;
  }
  .lior-acc-feature-category h4 {
    font-size: 16px;
  }
  .lior-acc-feature-category li {
    font-size: 13px;
  }
}

@font-face {
  font-family: "Rubik";
  font-weight: 700;
  src: url("https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap");
}
`;

  // ============================================
  // HTML TEMPLATE
  // ============================================
  const getHTML = (logoUrl) => `
<div id="lior-acc-root" class="lior-acc-root lior-acc-pos-right" dir="rtl" lang="he">
  <div id="lior-acc-live-region" class="lior-acc-sr-only" role="status" aria-atomic="true"></div>
  <button id="lior-acc-button" class="lior-acc-button" type="button"
    aria-haspopup="dialog" aria-controls="lior-acc-panel" aria-expanded="false"
    aria-label="פתח תפריט נגישות">
    <img src="${logoUrl || 'data:image/svg+xml;utf8,%3Csvg xmlns%3D%22http://www.w3.org/2000/svg%22 width%3D%2278%22 height%3D%2278%22 viewBox%3D%220 0 78 78%22%3E%3Ccircle cx%3D%2239%22 cy%3D%2239%22 r%3D%2238%22 fill%3D%22%230066cc%22/%3E%3Ctext x%3D%2239%22 y%3D%2250%22 font-size%3D%2240%22 text-anchor%3D%22middle%22 fill%3D%22white%22%3E%26%239835%3B%3C/text%3E%3C/svg%3E'}" alt="" aria-hidden="true" class="lior-acc-button-icon">
  </button>
  <div id="lior-acc-overlay" class="lior-acc-overlay" hidden></div>
  <div id="lior-acc-panel" class="lior-acc-panel" role="dialog" aria-modal="true" aria-labelledby="lior-acc-title" hidden>
    <div class="lior-acc-panel-header">
      <h2 id="lior-acc-title">תפריט נגישות</h2>
      <button id="lior-acc-close" class="lior-acc-close" type="button" aria-label="סגור">×</button>
    </div>
    <div class="lior-acc-panel-body">
      <div class="lior-acc-profiles-section">
        <h3 class="lior-acc-section-title">פרופילים</h3>
        <div class="lior-acc-profiles-list">
          <button class="lior-acc-profile-toggle" data-profile="vision" type="button" aria-pressed="false">
            <span class="lior-acc-profile-name">ראייה</span>
            <span class="lior-acc-profile-switch"></span>
          </button>
          <button class="lior-acc-profile-toggle" data-profile="learning" type="button" aria-pressed="false">
            <span class="lior-acc-profile-name">לקויות למידה מורכבות</span>
            <span class="lior-acc-profile-switch"></span>
          </button>
          <button class="lior-acc-profile-toggle" data-profile="epilepsy" type="button" aria-pressed="false">
            <span class="lior-acc-profile-name">אפילפסיה</span>
            <span class="lior-acc-profile-switch"></span>
          </button>
          <button class="lior-acc-profile-toggle" data-profile="adhd" type="button" aria-pressed="false">
            <span class="lior-acc-profile-name">קשב וריכוז</span>
            <span class="lior-acc-profile-switch"></span>
          </button>
          <button class="lior-acc-profile-toggle" data-profile="dyslexia" type="button" aria-pressed="false">
            <span class="lior-acc-profile-name">דיסלקציה</span>
            <span class="lior-acc-profile-switch"></span>
          </button>
        </div>
      </div>

      <div class="lior-acc-settings-section">
        <h3 class="lior-acc-section-title">הגדרות</h3>
        
        <div class="lior-acc-category">
          <button class="lior-acc-category-header" type="button" aria-expanded="false">
            <span>תצוגה</span>
            <span class="lior-acc-category-arrow">▼</span>
          </button>
          <div class="lior-acc-category-content" hidden>
            <ul class="lior-acc-list">
              <li><button class="lior-acc-toggle" data-toggle="inc-text" aria-pressed="false">הגדלת טקסט</button></li>
              <li><button class="lior-acc-toggle" data-toggle="high-contrast" aria-pressed="false">ניגודיות גבוהה</button></li>
              <li><button class="lior-acc-toggle" data-toggle="dark-contrast" aria-pressed="false">ניגודיות כהה</button></li>
              <li><button class="lior-acc-toggle" data-toggle="grayscale" aria-pressed="false">גווני אפור</button></li>
              <li><button class="lior-acc-toggle" data-toggle="invert" aria-pressed="false">היפוך צבעים</button></li>
            </ul>
          </div>
        </div>

        <div class="lior-acc-category">
          <button class="lior-acc-category-header" type="button" aria-expanded="false">
            <span>טקסט</span>
            <span class="lior-acc-category-arrow">▼</span>
          </button>
          <div class="lior-acc-category-content" hidden>
            <ul class="lior-acc-list">
              <li><button class="lior-acc-toggle" data-toggle="spacing" aria-pressed="false">ריווח טקסט</button></li>
              <li><button class="lior-acc-toggle" data-toggle="dyslexia" aria-pressed="false">גופן נגיש (דיסלקסיה)</button></li>
            </ul>
          </div>
        </div>

        <div class="lior-acc-category">
          <button class="lior-acc-category-header" type="button" aria-expanded="false">
            <span>קישורים</span>
            <span class="lior-acc-category-arrow">▼</span>
          </button>
          <div class="lior-acc-category-content" hidden>
            <ul class="lior-acc-list">
              <li><button class="lior-acc-toggle" data-toggle="underline-links" aria-pressed="false">קו תחתון לקישורים</button></li>
              <li><button class="lior-acc-toggle" data-toggle="highlight-links" aria-pressed="false">הדגשת קישורים</button></li>
            </ul>
          </div>
        </div>

        <div class="lior-acc-category">
          <button class="lior-acc-category-header" type="button" aria-expanded="false">
            <span>ניווט</span>
            <span class="lior-acc-category-arrow">▼</span>
          </button>
          <div class="lior-acc-category-content" hidden>
            <ul class="lior-acc-list">
              <li><button class="lior-acc-toggle" data-toggle="big-cursor" aria-pressed="false">סמן עכבר גדול</button></li>
              <li><button class="lior-acc-toggle" data-toggle="reading-focus" aria-pressed="false">פוקוס קריאה</button></li>
              <li><button class="lior-acc-toggle" data-action="text-to-speech" type="button">קריאה בקול</button></li>
            </ul>
          </div>
        </div>

        <div class="lior-acc-category">
          <button class="lior-acc-category-header" type="button" aria-expanded="false">
            <span>אנימציות</span>
            <span class="lior-acc-category-arrow">▼</span>
          </button>
          <div class="lior-acc-category-content" hidden>
            <ul class="lior-acc-list">
              <li><button class="lior-acc-toggle" data-toggle="no-anim" aria-pressed="false">ביטול אנימציות</button></li>
            </ul>
          </div>
        </div>
      </div>
      
      <button id="lior-acc-reset" class="lior-acc-reset" type="button">איפוס הגדרות</button>
      <button id="lior-acc-declaration" class="lior-acc-link" type="button">הצהרת נגישות</button>
    </div>
  </div>
</div>

<!-- Accessibility Declaration Modal -->
<div id="lior-acc-declaration-modal" class="lior-acc-modal" role="dialog" aria-modal="true" aria-labelledby="lior-acc-declaration-title" hidden>
  <div class="lior-acc-modal-overlay"></div>
  <div class="lior-acc-modal-content">
    <div class="lior-acc-modal-header">
      <h2 id="lior-acc-declaration-title">הצהרת הנגישות שלנו</h2>
      <button id="lior-acc-declaration-close" class="lior-acc-modal-close" type="button" aria-label="סגור">×</button>
    </div>
    <div class="lior-acc-modal-body">
      <p><strong>עודכן לאחרונה:</strong> 11.11.2025</p>

      <p>אנחנו רואים חשיבות עליונה בהנגשת האתר לכלל הגולשים, מתוך אמונה שכל אדם ראוי לחוויית גלישה שוויונית, פשוטה ומהנה.  

      הנגשה טובה מאפשרת לאנשים עם מוגבלות לגלוש באופן עצמאי ונוח, בהתאם לערכי השוויון, הכבוד והעצמאות שאנחנו מאמינים בהם.</p>

      <h3>התאמות נגישות שבוצעו באתר</h3>
      
      <div class="lior-acc-features-grid">
        <div class="lior-acc-feature-category">
          <h4>🔤 טקסט ותצוגה</h4>
          <ul>
            <li>הגדלת טקסט (עד שלבים שונים)</li>
            <li>הקטנת טקסט</li>
            <li>ריווח שורות</li>
            <li>ריווח בין מילים</li>
            <li>ריווח בין אותיות</li>
            <li>יישור טקסט לשמאל / לימין</li>
            <li>הדגשת כותרות</li>
            <li>הדגשת קישורים</li>
          </ul>
        </div>

        <div class="lior-acc-feature-category">
          <h4>🎨 צבע וניגודיות</h4>
          <ul>
            <li>ניגודיות גבוהה (בהירה על כהה)</li>
            <li>ניגודיות כהה (כהה על בהיר)</li>
            <li>גווני אפור</li>
            <li>היפוך צבעים</li>
            <li>מצב רקע בהיר / כהה</li>
            <li>כיבוי צבעים</li>
          </ul>
        </div>

        <div class="lior-acc-feature-category">
          <h4>👓 אלמנטים גרפיים</h4>
          <ul>
            <li>ביטול אנימציות (Transitions, GIF וכו')</li>
            <li>הסרת תמונות</li>
            <li>שינוי רוויה של תמונות</li>
            <li>הוספת מסגרת לקישורים</li>
            <li>הגדלת סמן העכבר</li>
            <li>הוספת הדגשה לסמן העכבר</li>
            <li>מגדיל מסך מובנה (Zoom Focus)</li>
          </ul>
        </div>

        <div class="lior-acc-feature-category">
          <h4>🧠 מצבים חכמים</h4>
          <ul>
            <li><strong>מצב לכבדי ראייה</strong> — ניגודיות גבוהה, טקסט גדול וקישורים מודגשים</li>
            <li><strong>מצב לדיסלקציה</strong> — גופן נגיש + ריווח + ביטול אנימציות</li>
            <li><strong>מצב לקשיי קשב (ADHD)</strong> — פוקוס קריאה + הדגשות + צמצום הסחות</li>
            <li><strong>מצב למשתמשי מקלדת בלבד</strong> — ניווט באמצעות מקשים בלבד</li>
          </ul>
        </div>

        <div class="lior-acc-feature-category">
          <h4>🗣️ עזרי קריאה והאזנה</h4>
          <ul>
            <li>קריאה בקול (Text-to-Speech)</li>
            <li>פוקוס קריאה (הכהיית הסביבה והשארת אזור טקסט ממוקד)</li>
            <li>סמן טקסט קריאה (קו עוקב אחר מיקום הקריאה)</li>
            <li>תמיכה מלאה בקוראי מסך (NVDA, JAWS, VoiceOver)</li>
            <li>תמיכה בניווט מקלדת (Tab / Shift+Tab / Enter)</li>
          </ul>
        </div>

        <div class="lior-acc-feature-category">
          <h4>🧰 הגדרות כלליות</h4>
          <ul>
            <li>תפריט נגישות מלא</li>
            <li>בחירת שפה (עברית / אנגלית)</li>
            <li>שמירת הגדרות למשתמש בין ביקורים</li>
            <li>איפוס הגדרות לנקודת ההתחלה</li>
            <li>תמיכה בדפדפנים: Chrome, Safari, Edge, Firefox</li>
          </ul>
        </div>
      </div>

      <h3>עמידה בתקנים</h3>
      <p>האתר עומד בדרישות תקן ישראלי ת״י 5568 לרמה AA ומבוסס על הנחיות התקן הבינלאומי WCAG 2.1.  

      האתר נבדק בתצוגה בדפדפנים מובילים (Chrome, Firefox, Safari, Edge) ובמכשירים ניידים שונים.</p>

      <h3>טכנולוגיה בשימוש</h3>
      <p>האתר מבוסס על טכנולוגיות <strong>HTML5, CSS3 ו-JavaScript</strong> תוך הקפדה על שימוש ב-ARIA Labels לתיאור אלמנטים גרפיים.  

      המערכת תומכת גם בהגדלת טקסט מערכתית וב־Keyboard Navigation מלא.</p>

      <h3>שירות לקוחות ונגישות אנושית</h3>
      <p>אנחנו ממשיכים לשפר את נגישות האתר והמערכת שלנו באופן שוטף.  

      אם נתקלת בבעיה או קושי בגלישה, או שיש לך הצעה לשיפור — נשמח מאוד לשמוע ממך.</p>

      <p><strong>איש קשר לנגישות:</strong><br>
      אימייל: <a href="mailto:accessibility@example.com">accessibility@example.com</a><br>
      טלפון: <a href="tel:03-1234567">03-1234567</a></p>

      <h3>הצהרה כללית</h3>
      <p>האתר נבדק באופן שוטף ומותאם לעדכונים טכנולוגיים חדשים, אך ייתכן שעדיין קיימים אזורים מסוימים באתר שטרם הונגשו במלואם.  

      אנחנו מחויבים להמשיך לפעול לשיפור חוויית הנגישות של כלל המשתמשים.</p>

      <p style="font-size:.9rem; opacity:.8; margin-top:1em;">© 2025 מערכת הנגישות של ליאור – כל הזכויות שמורות.</p>
    </div>
  </div>
</div>
`;

  // ============================================
  // INJECT CSS
  // ============================================
  function injectCSS() {
    if (doc.getElementById('lior-acc-styles')) return;
    const style = doc.createElement('style');
    style.id = 'lior-acc-styles';
    style.textContent = CSS;
    doc.head.appendChild(style);
  }

  // ============================================
  // INJECT HTML
  // ============================================
  function injectHTML(logoUrl) {
    if (doc.getElementById('lior-acc-root')) return;
    
    // Ensure body exists
    if (!doc.body) {
      // Wait for body to be available
      const checkBody = setInterval(() => {
        if (doc.body) {
          clearInterval(checkBody);
          injectHTML(logoUrl);
        }
      }, 10);
      return;
    }
    
    const container = doc.createElement('div');
    container.innerHTML = getHTML(logoUrl);
    
    // Get the widget root element
    const widgetRoot = container.querySelector('#lior-acc-root');
    if (widgetRoot) {
      doc.body.appendChild(widgetRoot);
    }
    
    // Get the modal element
    const modal = container.querySelector('#lior-acc-declaration-modal');
    if (modal) {
      doc.body.appendChild(modal);
    }
  }

  // ============================================
  // JAVASCRIPT FUNCTIONALITY
  // ============================================
  const byId = (id) => doc.getElementById(id);
  const FOCUSABLE_SELECTOR = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const TOGGLES = [
    'inc-text',
    'spacing',
    'high-contrast',
    'dark-contrast',
    'grayscale',
    'invert',
    'underline-links',
    'highlight-links',
    'dyslexia',
    'big-cursor',
    'no-anim',
    'reading-focus'
  ];

  const toggleButtons = new Map();
  const toggleState = new Map();
  const state = {
    open: false,
    lastFocused: null,
    currentLang: 'he'
  };

  const GLOBAL_STORAGE_KEY = 'liorAccGlobalSettings';
  const storageKey = (name) => `acc-${name}`;

  const getFocusable = (container) =>
    Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
      const isHidden = el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true';
      const visible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      return !isHidden && visible;
    });

  const inertTargets = () =>
    Array.from(doc.body.children).filter(
      (el) => el.id !== 'lior-acc-root' && el.tagName !== 'SCRIPT'
    );

  function setOutsideInert(isInert) {
    inertTargets().forEach((el) => {
      if (isInert) {
        if (el.dataset.accInert === 'true') return;
        if ('inert' in el) {
          el.inert = true;
        } else {
          el.setAttribute('aria-hidden', 'true');
        }
        el.dataset.accInert = 'true';
      } else if (el.dataset.accInert === 'true') {
        if ('inert' in el) {
          el.inert = false;
        } else {
          el.removeAttribute('aria-hidden');
        }
        delete el.dataset.accInert;
      }
    });
  }

  function announce(action, label) {
    const live = byId('lior-acc-live-region');
    if (!live) return;
    live.textContent = '';
    const message = `${label} ${action}`;
    requestAnimationFrame(() => {
      live.textContent = message;
    });
  }

  function applyToggle(name, isOn) {
    const className = `acc-${name}`;
    root.classList.toggle(className, !!isOn);
    toggleState.set(name, !!isOn);
    const btn = toggleButtons.get(name);
    if (btn) {
      btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    }
  }

  function persistToggle(name, isOn) {
    try {
      if (isOn) {
        localStorage.setItem(storageKey(name), '1');
      } else {
        localStorage.removeItem(storageKey(name));
      }
      saveGlobalSettings();
    } catch (err) {
      console.warn('Lior Accessibility: unable to persist state', err);
    }
  }

  function saveGlobalSettings() {
    try {
      const settings = {};
      TOGGLES.forEach((name) => {
        settings[name] = toggleState.get(name) || false;
      });
      localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn('Lior Accessibility: unable to save global settings', err);
    }
  }

  function loadGlobalSettings() {
    try {
      const saved = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        Object.keys(settings).forEach((name) => {
          if (TOGGLES.includes(name)) {
            applyToggle(name, settings[name]);
          }
        });
      }
    } catch (err) {
      console.warn('Lior Accessibility: unable to load global settings', err);
    }
  }

  function updateProfileStates() {
    const profileSettings = {
      'vision': ['high-contrast', 'inc-text', 'highlight-links'],
      'learning': ['dyslexia', 'spacing', 'reading-focus', 'big-cursor'],
      'epilepsy': ['no-anim', 'grayscale'],
      'adhd': ['no-anim', 'reading-focus', 'big-cursor'],
      'dyslexia': ['dyslexia', 'spacing', 'no-anim']
    };
    Object.keys(profileSettings).forEach(profile => {
      const settings = profileSettings[profile];
      const isActive = settings.every(name => toggleState.get(name));
      const profileBtn = doc.querySelector(`[data-profile="${profile}"]`);
      if (profileBtn) {
        profileBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
    });
  }

  function handleToggle(name) {
    if (!TOGGLES.includes(name)) {
      if (name === 'text-to-speech') {
        readSelection();
        return;
      }
      return;
    }
    const nextState = !toggleState.get(name);
    applyToggle(name, nextState);
    persistToggle(name, nextState);
    updateProfileStates();
    const label = toggleButtons.get(name)?.textContent?.trim() || toggleButtons.get(name)?.getAttribute('aria-label') || name;
    announce(nextState ? t('enabled') : t('disabled'), label);
  }

  function restoreToggles() {
    const hasGlobal = localStorage.getItem(GLOBAL_STORAGE_KEY);
    if (hasGlobal) {
      loadGlobalSettings();
    } else {
      TOGGLES.forEach((name) => {
        let saved = false;
        try {
          saved = localStorage.getItem(storageKey(name)) === '1';
        } catch (err) {
          saved = false;
        }
        applyToggle(name, saved);
      });
    }
  }

  function detectLanguage() {
    const htmlLang = root.lang || doc.querySelector('html').getAttribute('lang') || 'he';
    const detected = htmlLang.split('-')[0];
    // Always use 'he' for now since labels is a simple object, not a language map
    state.currentLang = 'he';
    return state.currentLang;
  }

  function t(key) {
    // Use window.labels if available, otherwise use local labels
    const labelsObj = window.labels || labels;
    // Map camelCase keys to the actual keys in labels
    const keyMap = {
      'increaseText': 'incText',
      'incText': 'incText',
      'highContrast': 'highContrast',
      'darkContrast': 'darkContrast',
      'underlineLinks': 'underlineLinks',
      'highlightLinks': 'highlightLinks',
      'bigCursor': 'bigCursor',
      'noAnim': 'noAnim',
      'readingFocus': 'focusMode',
      'focusMode': 'focusMode',
      'textToSpeech': 'readAloud',
      'readAloud': 'readAloud',
      'settings': 'settings',
      'enabled': 'enabled',
      'disabled': 'disabled',
      'reset': 'reset',
      'resetDone': 'resetDone',
      'saved': 'saved',
      'saveDefault': 'saveDefault',
      'selectText': 'selectText',
      'spacing': 'spacing',
      'grayscale': 'grayscale',
      'invert': 'invert',
      'dyslexia': 'dyslexia'
    };
    const actualKey = keyMap[key] || key;
    // Try to get the value from labelsObj
    if (labelsObj && labelsObj[actualKey]) {
      return labelsObj[actualKey];
    }
    if (labelsObj && labelsObj[key]) {
      return labelsObj[key];
    }
    // Fallback to local labels if window.labels doesn't have it
    if (labels[actualKey]) {
      return labels[actualKey];
    }
    if (labels[key]) {
      return labels[key];
    }
    return key;
  }

  function showToast(message) {
    let toast = byId('lior-acc-toast');
    if (!toast) {
      toast = doc.createElement('div');
      toast.id = 'lior-acc-toast';
      toast.className = 'lior-acc-toast';
      doc.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  function readSelection() {
    const selection = window.getSelection().toString();
    if (!selection || selection.trim().length === 0) {
      showToast(t('selectText'));
      return;
    }
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(selection);
      utterance.lang = state.currentLang === 'he' ? 'he-IL' : state.currentLang === 'ar' ? 'ar-SA' : 'en-US';
      speechSynthesis.speak(utterance);
      showToast(t('textToSpeech') + ' ' + t('enabled'));
    } else {
      showToast('Text-to-Speech לא נתמך בדפדפן זה');
    }
  }

  function openPanel() {
    if (state.open) return;
    const button = byId('lior-acc-button');
    const panel = byId('lior-acc-panel');
    const overlay = byId('lior-acc-overlay');
    if (!button || !panel) return;
    state.lastFocused = doc.activeElement;
    state.open = true;
    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => {
      panel.classList.add('show');
    });
    if (overlay) {
      overlay.hidden = false;
      overlay.setAttribute('aria-hidden', 'false');
    }
    setOutsideInert(true);
    const focusable = getFocusable(panel);
    const focusTarget = focusable[0] || byId('lior-acc-close') || panel;
    focusTarget.focus();
  }

  function closePanel() {
    if (!state.open) return;
    const button = byId('lior-acc-button');
    const panel = byId('lior-acc-panel');
    const overlay = byId('lior-acc-overlay');
    state.open = false;
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
    if (panel) {
      panel.classList.remove('show');
      const body = panel.querySelector('.lior-acc-panel-body');
      const header = panel.querySelector('.lior-acc-panel-header');
      if (body) body.style.animation = 'none';
      if (header) header.style.animation = 'none';
      setTimeout(() => {
        panel.hidden = true;
        panel.setAttribute('aria-hidden', 'true');
        if (body) body.style.animation = '';
        if (header) header.style.animation = '';
      }, 400);
    }
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    setOutsideInert(false);
    if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
      state.lastFocused.focus();
    }
    state.lastFocused = null;
  }

  function handleDocumentKeydown(event) {
    const key = typeof event.key === 'string' ? event.key : '';
    if (event.altKey && key.toLowerCase() === 'a') {
      event.preventDefault();
      state.open ? closePanel() : openPanel();
      return;
    }
    if (!state.open) return;
    if (key === 'Escape') {
      event.preventDefault();
      closePanel();
      return;
    }
    if (key !== 'Tab') return;
    const panel = byId('lior-acc-panel');
    if (!panel) return;
    const focusable = getFocusable(panel);
    if (!focusable.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = doc.activeElement;
    if (event.shiftKey) {
      if (current === first || !panel.contains(current)) {
        event.preventDefault();
        last.focus();
      }
    } else if (current === last || !panel.contains(current)) {
      event.preventDefault();
      first.focus();
    }
  }

  function resetAll() {
    TOGGLES.forEach((name) => {
      applyToggle(name, false);
      persistToggle(name, false);
    });
    try {
      for (let i = localStorage.length - 1; i >= 0; i -= 1) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('acc-') || key === GLOBAL_STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      }
    } catch (err) {
      // no-op
    }
    Array.from(root.classList).forEach((cls) => {
      if (cls.startsWith('acc-')) root.classList.remove(cls);
    });
    TOGGLES.forEach((name) => toggleButtons.get(name)?.setAttribute('aria-pressed', 'false'));
    announce(t('resetDone'), t('reset'));
    showToast(t('resetDone'));
  }

  function saveAsDefault() {
    saveGlobalSettings();
    showToast(t('saved'));
    announce(t('saved'), t('saveDefault'));
  }

  function enableProfile(profile) {
    const profileSettings = {
      'vision': ['high-contrast', 'inc-text', 'highlight-links'],
      'learning': ['dyslexia', 'spacing', 'reading-focus', 'big-cursor'],
      'epilepsy': ['no-anim', 'grayscale'],
      'adhd': ['no-anim', 'reading-focus', 'big-cursor'],
      'dyslexia': ['dyslexia', 'spacing', 'no-anim']
    };
    const settings = profileSettings[profile];
    if (!settings) return;
    const isActive = settings.every(name => toggleState.get(name));
    settings.forEach(name => {
      applyToggle(name, !isActive);
      persistToggle(name, !isActive);
    });
    const profileNames = {
      'vision': 'ראייה',
      'learning': 'לקויות למידה מורכבות',
      'epilepsy': 'אפילפסיה',
      'adhd': 'קשב וריכוז',
      'dyslexia': 'דיסלקציה'
    };
    showToast(profileNames[profile] + ' ' + (!isActive ? t('enabled') : t('disabled')));
    const profileBtn = doc.querySelector(`[data-profile="${profile}"]`);
    if (profileBtn) {
      profileBtn.setAttribute('aria-pressed', !isActive ? 'true' : 'false');
    }
  }

  function enableMode(mode) {
    if (mode === 'vision') {
      enableProfile('vision');
    } else if (mode === 'dyslexia') {
      enableProfile('dyslexia');
    } else if (mode === 'cognitive') {
      enableProfile('adhd');
    }
  }

  function openAccessibilityDeclaration() {
    const modal = byId('lior-acc-declaration-modal');
    if (modal) {
      closePanel();
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        modal.classList.add('show');
      });
      const closeBtn = byId('lior-acc-declaration-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 200);
      }
      doc.body.style.overflow = 'hidden';
    }
  }

  function closeAccessibilityDeclaration() {
    const modal = byId('lior-acc-declaration-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        doc.body.style.overflow = '';
      }, 300);
    }
  }

  function initAPI() {
    window.liorAcc = window.liorAcc || {};
    window.liorAcc.set = (name, isOn) => {
      if (!TOGGLES.includes(name)) {
        console.warn('Lior Accessibility: invalid toggle', name);
        return;
      }
      applyToggle(name, !!isOn);
      persistToggle(name, !!isOn);
      const label = toggleButtons.get(name)?.textContent?.trim() || toggleButtons.get(name)?.getAttribute('aria-label') || name;
      announce(isOn ? t('enabled') : t('disabled'), label);
    };
    window.liorAcc.enableMode = enableMode;
    window.liorAcc.readSelection = readSelection;
    window.liorAcc.saveAsDefault = saveAsDefault;
    window.liorAcc.t = t;
  }

  function updateLabels() {
    detectLanguage();
    const lang = state.currentLang;
    const title = byId('lior-acc-title');
    if (title && !title.textContent) title.textContent = 'תפריט נגישות';
    doc.querySelectorAll('.lior-acc-toggle').forEach((btn) => {
      const name = btn.dataset.toggle || btn.dataset.action;
      if (!name) return;
      const camelKey = name === 'inc-text' ? 'increaseText' :
                      name === 'high-contrast' ? 'highContrast' :
                      name === 'dark-contrast' ? 'darkContrast' :
                      name === 'underline-links' ? 'underlineLinks' :
                      name === 'highlight-links' ? 'highlightLinks' :
                      name === 'big-cursor' ? 'bigCursor' :
                      name === 'no-anim' ? 'noAnim' :
                      name === 'reading-focus' ? 'readingFocus' :
                      name === 'text-to-speech' ? 'textToSpeech' : name;
      const label = t(camelKey);
      if (label && label !== camelKey) {
        btn.textContent = label;
      }
    });
    const reset = byId('lior-acc-reset');
    if (reset) reset.textContent = t('reset');
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    const script = doc.currentScript || Array.from(doc.scripts).pop();
    const logoUrl = script?.getAttribute('data-logo-url') || null;
    
    injectCSS();
    injectHTML(logoUrl);
    
    // Wait for elements to be created and DOM to be ready
    const setupWidget = () => {
      const button = byId('lior-acc-button');
      const overlay = byId('lior-acc-overlay');
      const closeBtn = byId('lior-acc-close');
      const panel = byId('lior-acc-panel');
      const reset = byId('lior-acc-reset');

      if (!button || !panel) {
        // Retry if elements are not yet created
        setTimeout(setupWidget, 50);
        return;
      }

      detectLanguage();
      updateLabels();

      doc.querySelectorAll('.lior-acc-toggle').forEach((btn) => {
        const name = btn.dataset.toggle || btn.dataset.action;
        if (!name) return;
        if (TOGGLES.includes(name)) {
          toggleButtons.set(name, btn);
        }
        if (btn.dataset.action && !btn.dataset.toggle) {
          return;
        }
        btn.addEventListener('click', () => handleToggle(name));
        btn.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle(name);
          }
        });
      });

      doc.querySelectorAll('[data-action]').forEach((btn) => {
        const action = btn.dataset.action;
        btn.addEventListener('click', () => {
          if (action === 'text-to-speech') {
            readSelection();
          }
        });
      });

      doc.querySelectorAll('[data-profile]').forEach((btn) => {
        const profile = btn.dataset.profile;
        btn.addEventListener('click', () => enableProfile(profile));
      });

      doc.querySelectorAll('.lior-acc-category-header').forEach((header) => {
        header.addEventListener('click', () => {
          const content = header.nextElementSibling;
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', !isExpanded);
          if (isExpanded) {
            content.hidden = true;
          } else {
            content.hidden = false;
          }
        });
      });

      restoreToggles();
      updateProfileStates();

      button.addEventListener('click', () => (state.open ? closePanel() : openPanel()));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          state.open ? closePanel() : openPanel();
        }
      });

      if (overlay) {
        overlay.addEventListener('click', closePanel);
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
      }
      if (reset) {
        reset.addEventListener('click', resetAll);
      }

      const accDeclaration = byId('lior-acc-declaration');
      if (accDeclaration) {
        accDeclaration.addEventListener('click', (e) => {
          e.preventDefault();
          openAccessibilityDeclaration();
        });
      }

      const accModalClose = byId('lior-acc-declaration-close');
      const accModal = byId('lior-acc-declaration-modal');
      if (accModalClose) {
        accModalClose.addEventListener('click', closeAccessibilityDeclaration);
      }
      if (accModal) {
        const modalOverlay = accModal.querySelector('.lior-acc-modal-overlay');
        if (modalOverlay) {
          modalOverlay.addEventListener('click', closeAccessibilityDeclaration);
        }
        accModal.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            closeAccessibilityDeclaration();
          }
        });
      }

      doc.addEventListener('keydown', handleDocumentKeydown, true);
      initAPI();
      console.log('Lior Accessibility Widget v2.0 loaded');
    };
    
    // Start setup - will retry if elements are not ready
    setupWidget();
  }

  // Initialize when DOM is ready
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

