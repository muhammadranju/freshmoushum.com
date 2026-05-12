const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.model.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('e:/2025/Fresh MouShum - 2/lib/server/app/modules');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/import\s*\{([^}]*)\}\s*from\s*'mongoose';/, (match, p1) => {
    if (!p1.includes('models')) {
      return `import { ${p1.trim()}, models } from 'mongoose';`;
    }
    return match;
  });

  content = content.replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=\s*model</g, 'export const $1 = models.$1 || model<');

  fs.writeFileSync(file, content);
  console.log('Updated: ' + file);
});
