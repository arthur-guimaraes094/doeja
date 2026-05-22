const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const port = 3001;
    console.log(`Fetching HTML from http://localhost:${port}...`);
    const html = await fetchUrl(`http://localhost:${port}`);
    
    const cssRegex = /<link[^>]*href="([^"]+\.css)"[^>]*>/g;
    let match;
    const cssFiles = [];
    while ((match = cssRegex.exec(html)) !== null) {
      cssFiles.push(match[1]);
    }
    
    if (cssFiles.length === 0) {
      console.log("No CSS files linked!");
      return;
    }
    
    const cssUrl = `http://localhost:${port}${cssFiles[0]}`;
    console.log(`Fetching CSS from ${cssUrl}...`);
    const css = await fetchUrl(cssUrl);
    console.log("CSS file size:", css.length, "bytes");
    
    const outPath = path.join(__dirname, 'compiled_styles.css');
    fs.writeFileSync(outPath, css);
    console.log("Saved compiled CSS to:", outPath);
    
    // Analyze
    console.log("\n--- CSS Content Analysis ---");
    const checks = [
      { name: "font-family usages", regex: /font-family:[^;]+/g },
      { name: "fredoka variable references", regex: /--font-fredoka-next/g },
      { name: "theme-organic definitions", regex: /\.theme-organic/g },
      { name: "ill-svg class definitions", regex: /\.ill-svg/g },
      { name: "button base resets (inside @layer base or similar)", regex: /button,\s*input/g },
    ];
    
    for (const check of checks) {
      const matches = css.match(check.regex);
      console.log(`${check.name}: found ${matches ? matches.length : 0} times`);
    }
    
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
