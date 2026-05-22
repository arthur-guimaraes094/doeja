const { chromium } = require('playwright-chromium');
const path = require('path');
const fs = require('fs');

async function main() {
  const outDir = r => path.join(__dirname, '..', r);
  
  console.log("Launching browser for screenshots...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const url = "http://localhost:3001";
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for animations and fonts
  
  const outFolder = "C:\\Users\\x990351\\.gemini\\antigravity-ide\\brain\\b698d0b8-b30e-466f-b335-5ccad3f63495";
  const organicPath = path.join(outFolder, "organic_mode_screenshot.png");
  const retroPath = path.join(outFolder, "retro_mode_screenshot.png");
  
  console.log("Saving Organic Mode screenshot...");
  await page.screenshot({ path: organicPath });
  console.log(`Saved to ${organicPath}`);
  
  // Find theme toggle button and click
  const toggleBtn = page.locator("#theme-toggle");
  if ((await toggleBtn.count()) > 0) {
    console.log("Clicking theme toggle button...");
    await toggleBtn.click();
    await page.waitForTimeout(2000); // Wait for transition
    
    console.log("Saving Retro Mode screenshot...");
    await page.screenshot({ path: retroPath });
    console.log(`Saved to ${retroPath}`);
  } else {
    console.log("Theme toggle button not found!");
  }
  
  await browser.close();
}

main().catch(console.error);
