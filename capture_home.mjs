import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/evaceylan/.gemini/antigravity/brain/6f6f72bd-feaa-4b1e-9d99-bbfe76674441';

async function captureHome() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Clear local storage and reload to be on Home Screen
  await page.evaluate(() => {
    localStorage.clear();
    window.location.hash = '';
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const shotPath = path.join(ARTIFACT_DIR, 'screen_1_home.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log(`Saved Home Screen: ${shotPath}`);

  await browser.close();
}

captureHome().catch(err => {
  console.error("Error capturing home screen:", err);
  process.exit(1);
});
