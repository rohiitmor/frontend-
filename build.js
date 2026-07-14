const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = ['index.html', 'catalog.html', 'cart.html', 'admin.html', 'styles.css', 'script.js'];

const distDir = path.join(root, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

for (const file of files) {
  const src = path.join(root, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

console.log('Build completed successfully.');
