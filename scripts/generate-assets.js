#!/usr/bin/env node

/**
 * Asset Generation Script
 * 
 * This script helps generate PNG assets from SVG files.
 * 
 * To use:
 * 1. Install dependencies: npm install --save-dev sharp
 * 2. Run: node scripts/generate-assets.js
 * 
 * Or use an online tool:
 * - https://convertio.co/svg-png/
 * - https://cloudconvert.com/svg-to-png
 * 
 * Required PNG sizes:
 * - icon-192.png: 192x192
 * - icon-512.png: 512x512
 * - apple-touch-icon.png: 180x180
 * - og-image.png: 1200x630
 * - logo.png: 400x100 (or larger, maintain aspect ratio)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Asset Generation Helper');
console.log('======================\n');

const assets = [
  {
    name: 'icon-192.png',
    source: 'icon.svg',
    size: { width: 192, height: 192 },
    description: 'PWA icon (192x192)'
  },
  {
    name: 'icon-512.png',
    source: 'icon.svg',
    size: { width: 512, height: 512 },
    description: 'PWA icon (512x512)'
  },
  {
    name: 'apple-touch-icon.png',
    source: 'icon.svg',
    size: { width: 180, height: 180 },
    description: 'Apple touch icon (180x180)'
  },
  {
    name: 'og-image.png',
    source: 'og-image.svg',
    size: { width: 1200, height: 630 },
    description: 'Open Graph image (1200x630)'
  },
  {
    name: 'logo.png',
    source: 'logo.svg',
    size: { width: 400, height: 100 },
    description: 'Logo (400x100)'
  }
];

console.log('Required assets:\n');
assets.forEach(asset => {
  const exists = fs.existsSync(path.join(__dirname, '..', 'public', asset.name));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${asset.name} (${asset.size.width}x${asset.size.height}) - ${asset.description}`);
});

console.log('\nTo generate PNGs from SVG:');
console.log('1. Use an online converter: https://convertio.co/svg-png/');
console.log('2. Or install sharp and run this script with conversion logic');
console.log('3. Or use ImageMagick: convert -resize 192x192 icon.svg icon-192.png\n');

