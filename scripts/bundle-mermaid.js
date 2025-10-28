#!/usr/bin/env node
/**
 * Bundle Mermaid.js into a self-contained ESM module for WordPress
 *
 * This script uses esbuild to create a single-file ESM bundle of Mermaid.js
 * that can be used with WordPress script modules (Interactivity API).
 *
 * Output: assets/js/mermaid.esm.min.mjs
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Ensure assets/js directory exists
const outputDir = path.join(__dirname, '..', 'assets', 'js');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'mermaid.esm.min.mjs');

console.log('Building self-contained Mermaid ESM bundle...');
console.log(`Output: ${outputPath}`);

esbuild.build({
  // Entry point - mermaid package main entry
  entryPoints: ['node_modules/mermaid/dist/mermaid.esm.min.mjs'],

  // Output configuration
  bundle: true,
  format: 'esm',
  outfile: outputPath,

  // Minification and optimization
  minify: true,
  sourcemap: false,
  treeShaking: true,

  // Target modern browsers (WordPress 6.1+ requirement)
  target: ['es2020', 'chrome90', 'firefox88', 'safari14'],

  // Platform configuration
  platform: 'browser',

  // Handle all dependencies as bundled (no externals)
  external: [],

  // Ensure all imports are resolved
  mainFields: ['module', 'main'],

  // Log level
  logLevel: 'info',
}).then(() => {
  console.log('\nBundle created successfully!');

  // Get file size
  const stats = fs.statSync(outputPath);
  const fileSizeInKB = (stats.size / 1024).toFixed(2);
  console.log(`File size: ${fileSizeInKB} KB`);

  // Verify the bundle exports mermaid
  console.log('\nVerifying bundle exports...');
  const content = fs.readFileSync(outputPath, 'utf8');

  if (content.includes('export{') || content.includes('export {') || content.includes('export default')) {
    console.log('✓ Bundle contains ES module exports');
  } else {
    console.warn('⚠ Warning: Could not verify ES module exports in bundle');
  }

  console.log('\nBundle is ready to use!');
  console.log('Import it in your code with: import mermaid from "mermaid-esm";');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
