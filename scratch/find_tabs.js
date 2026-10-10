const fs = require('fs');
const content = fs.readFileSync('D:/Lens/Dashboard/index.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('id="tab-') || l.includes('data-tab=')) {
    console.log(`Line ${i + 1}: ${l.trim()}`);
  }
});
