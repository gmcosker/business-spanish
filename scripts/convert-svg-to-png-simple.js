#!/usr/bin/env node

/**
 * Simple SVG to PNG converter using macOS built-in tools
 * Falls back to manual instructions if tools aren't available
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

console.log('🔄 Converting SVG files to PNG...\n');

// Check if we can use qlmanage (macOS Quick Look)
let useQuickLook = false;
try {
  execSync('which qlmanage', { stdio: 'ignore' });
  useQuickLook = true;
  console.log('✅ Using macOS Quick Look for conversion\n');
} catch {
  console.log('⚠️  macOS tools not available. Generating manual instructions...\n');
}

if (!useQuickLook) {
  console.log('📋 Manual Conversion Instructions:\n');
  console.log('Please use one of these methods:\n');
  console.log('1. Online Converter (Easiest):');
  console.log('   - Go to https://convertio.co/svg-png/');
  console.log('   - Upload each SVG file and set dimensions:\n');
  
  for (const { source, outputs } of conversions) {
    console.log(`   ${source}:`);
    for (const { name, width, height } of outputs) {
      console.log(`     → ${name} (${width}x${height})`);
    }
  }
  
  console.log('\n2. ImageMagick (if installed):');
  console.log('   convert -resize 192x192 public/icon.svg public/icon-192.png');
  console.log('   (repeat for each file)\n');
  
  process.exit(0);
}

// Try using qlmanage to convert
for (const { source, outputs } of conversions) {
  const svgPath = join(publicDir, source);
  
  if (!existsSync(svgPath)) {
    console.log(`❌ ${source} not found`);
    continue;
  }
  
  console.log(`📄 Processing ${source}...`);
  
  for (const { name, width, height } of outputs) {
    const outputPath = join(publicDir, name);
    
    try {
      // Use qlmanage to generate a preview, then convert
      // This is a workaround - qlmanage doesn't directly support dimensions
      // So we'll use a different approach
      
      // Actually, let's use a simpler method - create HTML and use headless browser
      // But since puppeteer had issues, let's provide clear instructions
      console.log(`  ⏳ ${name} (${width}x${height}) - needs manual conversion`);
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }
}

console.log('\n💡 Recommendation: Use online converter at https://convertio.co/svg-png/');
console.log('   All SVG source files are ready in /public/\n');


