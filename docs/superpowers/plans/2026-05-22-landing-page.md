# Landing Page DoeJÁ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the landing page of the DoeJÁ project with active Theme switching (Organic & Retro) and custom inline SVGs.

**Architecture:** Use CSS custom properties (variables) on the `<body>` element to switch between the Soft/Organic styling and the Bold/Retro styling. Custom inline SVGs will render responsive cartoon illustrations that animate via CSS transitions and keyframes.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Google Fonts.

---

### Task 1: Initialize Project Structure & Base HTML Skeleton

**Files:**
- Create: `index.html`
- Test: Manual browser preview

- [ ] **Step 1: Create index.html with base layout and fonts imports**

Write:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DoeJÁ - Conectando doadores de alimentos a ONGs</title>
  <!-- Google Fonts for Friendly Rounded & Retro Styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Lilita+One&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="index.css">
</head>
<body class="theme-organic">
  <!-- Theme Toggler (Floating Control) -->
  <button id="theme-toggle" class="theme-toggle-btn" aria-label="Alternar Tema">
    <span class="toggle-icon">🎨</span>
    <span class="toggle-text">Estilo: Orgânico</span>
  </button>

  <!-- Top Navigation Header -->
  <header class="main-header">
    <div class="nav-container">
      <div class="logo">
        <svg class="header-logo-svg" width="40" height="40" viewBox="0 0 200 200"></svg>
        <span class="logo-text">DoeJÁ</span>
      </div>
      <nav class="nav-menu">
        <a href="#" class="nav-link">Doações</a>
        <a href="#" class="nav-link">ONG's</a>
        <a href="#" class="nav-link">Seja um parceiro!</a>
      </nav>
      <button class="login-btn">Login</button>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="hero-section">
    <div class="hero-container">
      
      <!-- Left Illustration: Daisy -->
      <div class="illustration-wrapper left-ill">
        <svg id="svg-daisy" class="ill-svg" viewBox="0 0 200 200"></svg>
      </div>

      <!-- Center Box: Main Text and Logo -->
      <div class="center-content">
        <h1 class="hero-title">
          Seu gesto pode mudar histórias<br>
          <span class="highlight-doe">Doe</span><span class="highlight-ja">JÁ</span> e leve mais do que alimento, leve cuidado e esperança.
        </h1>
        <div class="center-logo-wrapper">
          <svg id="svg-hands" class="hands-svg" viewBox="0 0 200 200"></svg>
        </div>
      </div>

      <!-- Right Illustration: Celebrating Woman -->
      <div class="illustration-wrapper right-ill">
        <svg id="svg-woman" class="ill-svg" viewBox="0 0 300 300"></svg>
      </div>

    </div>
  </main>

  <!-- Bottom Elements and Footer -->
  <footer class="main-footer">
    <div class="footer-decorations">
      <div class="decor-eggplant">
        <svg id="svg-eggplant" viewBox="0 0 100 120" width="80" height="96"></svg>
      </div>
      <div class="decor-tomato">
        <svg id="svg-tomato" viewBox="0 0 120 120" width="96" height="96"></svg>
      </div>
    </div>
  </footer>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit initial skeleton**

Run:
```bash
git add index.html
git commit -m "feat: initialize skeleton index.html structure"
```

---

### Task 2: Create CSS Stylesheet with CSS Variables for Theme Swapping

**Files:**
- Create: `index.css`
- Test: Verify page loaded style skeleton properly

- [ ] **Step 1: Implement variables and resets in index.css**

Write:
```css
/* Resets and Base CSS */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Theme A: Organic & Warm variables */
body.theme-organic {
  --bg-color: #FDEDE4;
  --header-bg: #A3C767;
  --footer-bg: #A3C767;
  --accent-color: #F2911B;
  --accent-hover: #D77A0F;
  --text-primary: #2D3A1A;
  --text-white: #FFFFFF;
  --nav-link-color: #2D3A1A;
  --nav-link-hover: #1e2911;
  --font-family: 'Fredoka', sans-serif;
  --border-style: none;
  --box-shadow-hero: 0 8px 30px rgba(45, 58, 26, 0.08);
  --box-shadow-btn: 0 4px 14px rgba(242, 145, 27, 0.4);
  --border-radius-btn: 25px;
  --stroke-color: transparent;
  --stroke-width: 0px;
}

/* Theme C: Retro Poster variables */
body.theme-retro {
  --bg-color: #FFF5D6;
  --header-bg: #82B342;
  --footer-bg: #82B342;
  --accent-color: #E27D00;
  --accent-hover: #C66800;
  --text-primary: #000000;
  --text-white: #FFFFFF;
  --nav-link-color: #000000;
  --nav-link-hover: #000000;
  --font-family: 'Lilita One', 'Fredoka', sans-serif;
  --border-style: 3px solid #000000;
  --box-shadow-hero: 6px 6px 0px #000000;
  --box-shadow-btn: 4px 4px 0px #000000;
  --border-radius-btn: 0px;
  --stroke-color: #000000;
  --stroke-width: 3px;
}

/* Base Styles using variables */
body {
  background-color: var(--bg-color);
  font-family: var(--font-family);
  color: var(--text-primary);
}

/* Header & Navigation */
.main-header {
  background-color: var(--header-bg);
  border-bottom: var(--border-style);
  padding: 15px 0;
  position: relative;
  z-index: 10;
}

.nav-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  color: var(--nav-link-color);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--text-primary);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.login-btn {
  background-color: var(--accent-color);
  color: var(--text-white);
  border: var(--border-style);
  border-radius: var(--border-radius-btn);
  padding: 10px 24px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--box-shadow-btn);
}

.login-btn:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
}

.login-btn:active {
  transform: translateY(0);
}

/* Hero Section */
.hero-section {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

.hero-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.center-content {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 30px;
}

.hero-title {
  font-size: 32px;
  line-height: 1.4;
  color: var(--text-primary);
  font-weight: bold;
}

.highlight-doe {
  color: #1a6b32; /* Organic green */
}
body.theme-retro .highlight-doe {
  color: #000000; /* Retro font override is black with outline */
  -webkit-text-stroke: 1px #82B342;
}

.highlight-ja {
  color: var(--accent-color);
}

.center-logo-wrapper {
  margin-top: 15px;
}

.hands-svg {
  width: 180px;
  height: 180px;
}

.illustration-wrapper {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ill-svg {
  width: 100%;
  height: auto;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  position: fixed;
  top: 85px;
  right: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--accent-color);
  color: var(--text-white);
  border: var(--border-style);
  border-radius: var(--border-radius-btn);
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--box-shadow-btn);
}

.theme-toggle-btn:hover {
  background-color: var(--accent-hover);
}

/* Footer & Vegetables */
.main-footer {
  background-color: var(--footer-bg);
  border-top: var(--border-style);
  height: 80px;
  position: relative;
  margin-top: auto;
}

.footer-decorations {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  pointer-events: none;
}

.decor-eggplant {
  position: absolute;
  bottom: 10px;
  left: 5%;
  pointer-events: auto;
}

.decor-tomato {
  position: absolute;
  bottom: 10px;
  right: 5%;
  pointer-events: auto;
}

/* Responsive Rules (Adapt & Stack) */
@media (max-width: 1024px) {
  .illustration-wrapper {
    width: 180px;
  }
  .hero-title {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    padding: 30px 0;
  }
  .illustration-wrapper {
    width: 160px;
  }
  .left-ill {
    order: 2;
  }
  .center-content {
    order: 1;
    width: 100%;
  }
  .right-ill {
    order: 3;
  }
  .nav-menu {
    display: none; /* Simplifies menu on small mobile screens */
  }
  .theme-toggle-btn {
    top: auto;
    bottom: 90px;
    right: 15px;
  }
}
```

- [ ] **Step 2: Commit index.css**

Run:
```bash
git add index.css
git commit -m "feat: create base index.css stylesheet with theme systems"
```

---

### Task 3: Implement Theme Toggler & Character Interactions in main.js

**Files:**
- Create: `main.js`
- Test: Verify clicking button toggles theme between `theme-organic` and `theme-retro`

- [ ] **Step 1: Create main.js with toggling logic**

Write:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem('doeja-theme') || 'theme-organic';
  body.className = savedTheme;
  updateToggleButtonText(savedTheme);

  // Toggle Action
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('theme-organic')) {
      body.className = 'theme-retro';
      localStorage.setItem('doeja-theme', 'theme-retro');
      updateToggleButtonText('theme-retro');
    } else {
      body.className = 'theme-organic';
      localStorage.setItem('doeja-theme', 'theme-organic');
      updateToggleButtonText('theme-organic');
    }
  });

  function updateToggleButtonText(theme) {
    const textNode = themeToggleBtn.querySelector('.toggle-text');
    if (theme === 'theme-organic') {
      textNode.textContent = 'Estilo: Orgânico';
    } else {
      textNode.textContent = 'Estilo: Retro Pôster';
    }
  }

  // Periodic blinking interaction for cute veggies
  setupVeggieBlink('svg-eggplant', '.eye');
  setupVeggieBlink('svg-tomato', '.eye');

  function setupVeggieBlink(svgId, eyeSelector) {
    setInterval(() => {
      const svg = document.getElementById(svgId);
      if (!svg) return;
      const eyes = svg.querySelectorAll(eyeSelector);
      eyes.forEach(eye => {
        const originalY = eye.getAttribute('ry');
        eye.setAttribute('ry', '1'); // blink
        setTimeout(() => {
          eye.setAttribute('ry', originalY);
        }, 150);
      });
    }, 4000 + Math.random() * 3000);
  }
});
```

- [ ] **Step 2: Commit main.js**

Run:
```bash
git add main.js
git commit -m "feat: implement theme toggle logic and veggie blink in main.js"
```

---

### Task 4: Code Custom Vector SVGs & Animations

**Files:**
- Modify: `index.html`
- Modify: `index.css`
- Test: Verify illustrations render completely in high fidelity and animate smoothly

- [ ] **Step 1: Replace SVG markup inside index.html**

We will write complete detailed inline SVGs inside `index.html` matching the illustrations:
- **Header logo**
- **Daisy flower**
- **4 Hands holding wrists**
- **Celebrating woman**
- **Eggplant**
- **Tomato**

Let's modify `index.html` replacement chunk to insert beautiful custom inline SVGs (we will use precise SVG coordinates for beautiful results).

- [ ] **Step 2: Add CSS animations in index.css**

Add to `index.css`:
```css
/* Animation classes for SVG characters */
.theme-organic #svg-daisy {
  animation: sway 5s ease-in-out infinite alternate;
  transform-origin: bottom center;
}

.theme-organic #svg-woman {
  animation: float-woman 6s ease-in-out infinite;
}

.theme-organic .woman-arm {
  animation: wave-arm 3s ease-in-out infinite alternate;
  transform-origin: 220px 120px;
}

.theme-organic #svg-tomato {
  animation: bounce-veggie 4s ease-in-out infinite;
}

.theme-organic #svg-eggplant {
  animation: bounce-veggie 4.5s ease-in-out infinite alternate;
}

.hands-svg {
  cursor: pointer;
  transition: transform 0.3s ease;
}
.hands-svg:hover {
  transform: rotate(5deg) scale(1.05);
}

/* Keyframes animations */
@keyframes sway {
  0% { transform: rotate(-4deg); }
  100% { transform: rotate(4deg); }
}

@keyframes float-woman {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes wave-arm {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(15deg); }
}

@keyframes bounce-veggie {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
```

- [ ] **Step 3: Commit vector SVGs and animations**

Run:
```bash
git add index.html index.css
git commit -m "feat: code custom vector SVGs and animations for characters"
```
