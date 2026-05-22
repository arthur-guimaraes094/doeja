const { chromium } = require('playwright-chromium');

async function main() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const url = "http://localhost:3001";
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch (err) {
    console.error("Failed to load page:", err);
    await browser.close();
    return;
  }
  
  console.log("Extracting computed styles...");
  const data = await page.evaluate(() => {
    const body = document.querySelector('body');
    const header = document.querySelector('header');
    const logo = document.querySelector('header span');
    const link = document.querySelector('header nav a');
    const button = document.querySelector('header button');
    const daisy = document.querySelector('#svg-daisy');
    const daisyWrapper = document.querySelector('.illustration-wrapper');
    
    const styles = (el) => {
      if (!el) return null;
      const comp = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        className: el.className,
        fontFamily: comp.fontFamily,
        fontSize: comp.fontSize,
        fontWeight: comp.fontWeight,
        height: comp.height,
        width: comp.width,
        padding: comp.padding,
        margin: comp.margin,
        display: comp.display
      };
    };
    
    return {
      body: styles(body),
      header: styles(header),
      logo: styles(logo),
      link: styles(link),
      button: styles(button),
      daisy: styles(daisy),
      daisyWrapper: styles(daisyWrapper),
      windowWidth: window.innerWidth,
      documentScrollWidth: document.documentElement.scrollWidth
    };
  });
  
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

main().catch(console.error);
