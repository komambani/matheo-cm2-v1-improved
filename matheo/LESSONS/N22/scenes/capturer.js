const puppeteer = require('puppeteer-core');
const path = require('path');

const FPS = 25;
const DUREE = 195; // secondes
const TOTAL_FRAMES = Math.round(DUREE * FPS);
const OUT_DIR = path.join(__dirname, '..', 'renders', 'frames');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'moteur.html'));
  await page.waitForFunction('typeof window.renderAt === "function"');

  console.log(`Rendu de ${TOTAL_FRAMES} images (${DUREE}s à ${FPS}fps)...`);
  const t0 = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const tVirtuel = i / FPS;
    await page.evaluate((t) => { window.renderAt(t); }, tVirtuel);
    const nom = String(i).padStart(5, '0') + '.png';
    await page.screenshot({ path: path.join(OUT_DIR, nom) });
    if (i % 250 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`  frame ${i}/${TOTAL_FRAMES} (t=${tVirtuel.toFixed(1)}s) - ${elapsed.toFixed(0)}s écoulées`);
    }
  }

  await browser.close();
  console.log(`TERMINE en ${((Date.now()-t0)/1000).toFixed(0)}s`);
})().catch(e => { console.error('ERREUR:', e.message, e.stack); process.exit(1); });
