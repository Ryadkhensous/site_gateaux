const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'client-web');
const clientDist = path.join(clientDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

console.log('===> [Vercel Root Build] Preparing client-web...');

// 1. Install dependencies for client-web if node_modules doesn't exist or in CI
console.log('===> [1/3] Installing client-web dependencies...');
execSync('npm install --include=dev', { cwd: clientDir, stdio: 'inherit' });

// 2. Build client-web
console.log('===> [2/3] Building client-web production bundle...');
execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

// 3. Copy client-web/dist to root /dist for Vercel
console.log('===> [3/3] Copying dist bundle to root directory for Vercel deployment...');
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(clientDist, rootDist, { recursive: true });

console.log('===> [Vercel Root Build] Successfully completed! dist ready for Vercel.');

