const fs = require('fs');

let html = fs.readFileSync('D:\\Lens\\Dashboard\\index.html', 'utf8');

// Update baseLeads and repsPct
html = html.replace(
  /<div class="kpi-sub" id="baseLeads">[^<]*<\/div>/,
  '<div class="kpi-sub" id="baseLeads">3 M2 Upgrades / 497 Pool Base | 20% Goal: 100 (97 needed)</div>'
);

html = html.replace(
  /<div class="kpi-pct" id="repsPct">[^<]*<\/div>/,
  '<div class="kpi-pct" id="repsPct">0.6% M2 Upgrade Conversion (3/497)</div>'
);

// Update Day 6 Benchmarks
html = html.replace(
  /<div class="kpi-sub" id="achSub">[^<]*<\/div>/,
  '<div class="kpi-sub" id="achSub">Day 6 Benchmark: 20% | Target: $305,950</div>'
);

html = html.replace(
  /<div class="kpi-pct" id="achDays"[^>]*>[^<]*<\/div>/,
  '<div class="kpi-pct" id="achDays" style="color: #38bdf8; font-weight: 600;">Day 6 of 31 | Expected Target Pace: 20% (25 Days Left)</div>'
);

// Bump cache buster
const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
html = html.replace(/dashboard\.js\?v=[^"']*/g, `dashboard.js?v=${timestamp}`);
html = html.replace(/styles\.css\?v=[^"']*/g, `styles.css?v=${timestamp}`);

fs.writeFileSync('D:\\Lens\\Dashboard\\index.html', html, 'utf8');
console.log('index.html updated successfully with cache buster:', timestamp);
