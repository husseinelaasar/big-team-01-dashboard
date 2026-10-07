global.window = { addEventListener: () => {} };
global.document = {
  getElementById: (id) => ({ value: 'ALL' }),
  querySelectorAll: () => []
};

const fs = require('fs');
const s = fs.readFileSync('D:\\Lens\\Dashboard\\dashboard.js', 'utf8');
eval(s);

// build data model
window.__model = buildDataModel();

// test upgMap
const todayUpg = (window.__model && (window.__model.individuals || window.__model.reps)) || REPS_DATA;
console.log('todayUpg count:', todayUpg.length);

function normName(n) { return String(n || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
const upgMap = {};
todayUpg.forEach(r => { upgMap[normName(r.name)] = r; });

const ydUpgMap = {};
(window.YESTERDAY_DATA.upgrade || []).forEach(r => { ydUpgMap[normName(r.name)] = r; });

console.log('Sample reps in Performance Comparison:');
['EGSS-mahmoud04', 'EGSS-abdelrhmanshehata', 'EGSS-ashraqatal', 'EGSS-negma'].forEach(name => {
  const nk = normName(name);
  const td = upgMap[nk] || {};
  const yd = ydUpgMap[nk] || {};
  
  const tdBase = Number(td.upgradeBase) || 0;
  const tdM2 = Number(td.upgradeM2) || 0;
  const tdRate = tdBase > 0 ? (tdM2 / tdBase) * 100 : 0;
  
  const ydBase = Number(yd.upgradeBase) || 0;
  const ydM2 = Number(yd.upgradeM2) || 0;
  const ydRate = ydBase > 0 ? (ydM2 / ydBase) * 100 : 0;
  
  console.log(`${name.padEnd(25)} | Today: Base=${tdBase}, M2=${tdM2}, Rate=${tdRate.toFixed(1)}% | YD: Base=${ydBase}, M2=${ydM2}, Rate=${ydRate.toFixed(1)}% | Delta=${(tdRate - ydRate).toFixed(1)}%`);
});
