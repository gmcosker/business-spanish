#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const conversions = [
  {
    source: 'icon.svg',
    outputs: [
      { name: 'icon-192.png', width: 192, height: 192 },
      { name: 'icon-512.png', width: 512, height: 512 },
      { name: 'apple-touch-icon.png', width: 180, height: 180 },
    ]
  },
  {
    source: 'og-image.svg',
    outputs: [
      { name: 'og-image.png', width: 1200, height: 630 },
    ]
  },
  {
    source: 'logo.svg',
    outputs: [
      { name: 'logo.png', width: 400, height: 100 },
    ]
  }
];

console.log('🔄 Converting SVG files to PNG using Playwright...\n');

// Read all SVG files
const svgFiles = {};
for (const { source } of conversions) {
  const svgPath = join(publicDir, source);
  if (existsSync(svgPath)) {
    svgFiles[source] = readFileSync(svgPath, 'utf-8');
    console.log(`📄 Read ${source}`);
  } else {
    console.error(`❌ ${source} not found`);
  }
}

// Launch browser and convert
(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    console.log('✅ Browser launched\n');

    for (const { source, outputs } of conversions) {
      if (!svgFiles[source]) continue;

      const svgContent = svgFiles[source];
      const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

      for (const { name, width, height } of outputs) {
        try {
          const page = await browser.newPage();
          await page.setViewport({ width, height });
          await page.goto(dataUrl, { waitUntil: 'load', timeout: 10000 });
          
          // Wait a bit for SVG to render
          await page.waitForTimeout(500);
          
          const screenshot = await page.screenshot({
            type: 'png',
            clip: { x: 0, y: 0, width, height }
          });
          
          const outputPath = join(publicDir, name);
          writeFileSync(outputPath, screenshot);
          
          console.log(`  ✅ Generated ${name} (${width}x${height})`);
          await page.close();
        } catch (error) {
          console.error(`  ❌ Error generating ${name}:`, error.message);
        }
      }
    }

    console.log('\n✨ Conversion complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Alternative: Use online converter at https://convertio.co/svg-png/');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();


