const fs = require('fs');
const vm = require('vm');

global.window = { addEventListener: () => {} };
global.document = {
  getElementById: () => ({ textContent: '', innerHTML: '', style: {} }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

const code = fs.readFileSync('D:\\Lens\\Dashboard\\dashboard.js', 'utf8');
vm.runInThisContext(code);

const model = buildDataModel();
console.log('=== SECTOR SUMMARY ===');
console.log('Total Cash:', model.summary.totalCash);
console.log('Total Target:', model.summary.totalTarget);
console.log('Total Contracts:', model.summary.totalContracts);
console.log('Total Upgrade M2:', model.summary.totalUpgradeM2);
console.log('Total Normal Renewals:', model.summary.totalNormalRenewals);
console.log('Total Upgrade Base:', model.summary.totalUpgradeBase);
console.log('Total Upgrade 20% Target:', model.summary.totalUpgrade20Target);
console.log('Total Upgrade 20% Needed:', model.summary.totalUpgrade20Needed);
console.log('Sector Upgrade Rate %:', model.summary.upgradeRate.toFixed(2) + '%');

console.log('\n=== SMALL TEAMS UPGRADE SUMMARY ===');
Object.keys(model.teams).forEach(k => {
  const t = model.teams[k];
  console.log(`${k} | Base: ${String(t.upgradeBase).padStart(3)} | M2 Upgrades: ${t.upgradeM2} | Conv Rate: ${t.upgradeRate.toFixed(2)}% | 20% Target: ${String(t.upgrade20Target).padStart(2)} | Needed: ${String(t.upgrade20Needed).padStart(2)}`);
});

console.log('\n=== INDIVIDUAL REPS (Top by Conv Rate) ===');
model.individuals
  .sort((a, b) => b.upgradeRate - a.upgradeRate || b.upgradeBase - a.upgradeBase)
  .forEach(r => {
    console.log(`${r.name.padEnd(25)} | Team: ${r.team} | Base: ${String(r.upgradeBase).padStart(2)} | M2: ${r.upgradeM2} | Conv: ${r.upgradeRate.toFixed(1).padStart(5)}% | 20% Tgt: ${String(r.upgrade20Target).padStart(2)} | Needed: ${String(r.upgrade20Needed).padStart(2)} | Cover: ${String(r.coverRate).padStart(5)}%`);
  });
