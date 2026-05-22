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

  // Periodic blinking interaction for cute veggies and flower
  setupVeggieBlink('svg-eggplant', '.eye');
  setupVeggieBlink('svg-tomato', '.eye');
  setupVeggieBlink('svg-daisy', '.eye');

  function setupVeggieBlink(svgId, eyeSelector) {
    setInterval(() => {
      const svg = document.getElementById(svgId);
      if (!svg) return;
      const eyes = svg.querySelectorAll(eyeSelector);
      eyes.forEach(eye => {
        const originalRy = eye.getAttribute('ry');
        eye.setAttribute('ry', '0.5'); // blink
        setTimeout(() => {
          eye.setAttribute('ry', originalRy);
        }, 150);
      });
    }, 3000 + Math.random() * 4000);
  }
});
