const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const APP_DIR = path.join(PROJECT_ROOT, 'app');
const TEMP_DIR = path.join(PROJECT_ROOT, 'temp_assets');

const SVG_PATH = path.join(PUBLIC_DIR, 'logo.svg');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runEdgeHeadless(htmlPath, outputPath, width, height, transparent = false) {
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  let flags = `--headless --disable-gpu --window-size=${width},${height} --hide-scrollbars`;
  
  if (transparent) {
    flags += ' --default-background-color=00000000';
  }
  
  const cmd = `"${EDGE_PATH}" ${flags} --screenshot="${outputPath}" "${fileUrl}"`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  console.log('Starting asset generation...');
  
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`SVG Logo not found at ${SVG_PATH}`);
    process.exit(1);
  }
  
  // Read logo.svg content
  let svgContent = fs.readFileSync(SVG_PATH, 'utf8');
  
  // Override SVG width/height dynamically in HTML for responsive scaling
  svgContent = svgContent.replace(/<svg([^>]*)(width="[^"]*")([^>]*)(height="[^"]*")/, '<svg$1 width="100%"$3 height="100%"');
  
  ensureDir(TEMP_DIR);
  ensureDir(APP_DIR);
  
  // 1. Icon (512x512)
  const iconHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 512px;
        height: 512px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .logo-wrapper {
        width: 440px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      svg {
        width: 100% !important;
        height: 100% !important;
      }
    </style>
  </head>
  <body>
    <div class="logo-wrapper">
      ${svgContent}
    </div>
  </body>
  </html>
  `;
  const iconHtmlPath = path.join(TEMP_DIR, 'icon.html');
  fs.writeFileSync(iconHtmlPath, iconHtml);
  const iconOutputPath = path.join(APP_DIR, 'icon.png');
  runEdgeHeadless(iconHtmlPath, iconOutputPath, 512, 512, true);
  console.log('Generated icon.png successfully.');

  // 2. Apple Touch Icon (180x180)
  const appleHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 180px;
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .logo-wrapper {
        width: 150px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      svg {
        width: 100% !important;
        height: 100% !important;
      }
    </style>
  </head>
  <body>
    <div class="logo-wrapper">
      ${svgContent}
    </div>
  </body>
  </html>
  `;
  const appleHtmlPath = path.join(TEMP_DIR, 'apple-icon.html');
  fs.writeFileSync(appleHtmlPath, appleHtml);
  const appleOutputPath = path.join(APP_DIR, 'apple-icon.png');
  runEdgeHeadless(appleHtmlPath, appleOutputPath, 180, 180, true);
  console.log('Generated apple-icon.png successfully.');

  // 3. OpenGraph Image (1200x630)
  const ogHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600&display=swap" rel="stylesheet">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #f4f7f0;
        width: 1200px;
        height: 630px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .logo-box {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 50px 100px;
        border-radius: 32px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04);
        border: 1.5px solid rgba(77, 102, 23, 0.08);
      }
      .logo-wrapper {
        width: 450px;
        height: 210px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      svg {
        width: 100% !important;
        height: 100% !important;
      }
      .tagline {
        margin-top: 40px;
        font-size: 32px;
        color: #4d6617;
        font-weight: 600;
        letter-spacing: -0.5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo-box">
        <div class="logo-wrapper">
          ${svgContent}
        </div>
      </div>
      <div class="tagline">Conectando doadores de alimentos a ONGs</div>
    </div>
  </body>
  </html>
  `;
  const ogHtmlPath = path.join(TEMP_DIR, 'og.html');
  fs.writeFileSync(ogHtmlPath, ogHtml);
  const ogOutputPath = path.join(APP_DIR, 'opengraph-image.png');
  runEdgeHeadless(ogHtmlPath, ogOutputPath, 1200, 630, false);
  console.log('Generated opengraph-image.png successfully.');

  // 4. Twitter Image (Copy of OpenGraph Image)
  const twitterOutputPath = path.join(APP_DIR, 'twitter-image.png');
  fs.copyFileSync(ogOutputPath, twitterOutputPath);
  console.log('Copied opengraph-image.png to twitter-image.png.');

  // Cleanup
  console.log('Cleaning up temporary files...');
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log('Asset generation complete!');
}

main();
