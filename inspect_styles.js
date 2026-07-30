const fs = require('fs');

const content = fs.readFileSync('styles.css', 'utf16le'); // Try UTF-16 LE

const targets = [
  'section-cinematic',
  'section-veil',
  'section-ambient-warm',
  'environmental-fog',
  'cinematic-canvas-wrapper',
  'hero'
];

targets.forEach(target => {
  console.log(`=== Matches for ${target} ===`);
  const regex = new RegExp(`[^\\}]*${target}[^\\{]*\\{[^\\}]*\\}`, 'gi');
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(match[0].trim());
    console.log('---');
  }
});
