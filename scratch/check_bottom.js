const fs = require('fs');
const content = fs.readFileSync('D:/Lens/Dashboard/index.html', 'utf8');
const lines = content.split('\n');
console.log('Lines 1250 to 1300:');
lines.slice(1250, 1300).forEach((l, i) => {
  if (l.trim()) console.log(1251 + i, l.trim());
});
console.log('Lines 1300 to 1482 non-empty:');
lines.slice(1300).forEach((l, i) => {
  if (l.trim()) console.log(1301 + i, l.trim());
});
