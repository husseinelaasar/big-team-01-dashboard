const fs = require('fs');
const path = require('path');

const dashJsPath = 'D:\\Lens\\Dashboard\\dashboard.js';
let content = fs.readFileSync(dashJsPath, 'utf8');

// 1. New REPS_DATA block
const newRepsData = `const REPS_DATA = [
  { name: "EGSS-nohayoussry", team: "EGSS01", cash: 1600, refund: 0, target: 12000, contracts: 2, officialAch: 13.3, upgradeM2: 0, normalRenewals: 2, upgradeBase: 28, poolRenewals: 2 },
  { name: "EGSS-ashraqatal", team: "EGSS01", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 29, poolRenewals: 0 },
  { name: "EGSS-negma", team: "EGSS01", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 35, poolRenewals: 0 },
  { name: "EGSS-juliamonir01", team: "EGSS01", cash: 1020, refund: 0, target: 18000, contracts: 1, officialAch: 5.7, upgradeM2: 0, normalRenewals: 1, upgradeBase: 22, poolRenewals: 1 },
  { name: "EGSS-mahmoud04", team: "EGSS01", cash: 4160, refund: 0, target: 18000, contracts: 3, officialAch: 23.1, upgradeM2: 2, normalRenewals: 1, upgradeBase: 31, poolRenewals: 3 },
  { name: "EGSS-abdelrahmannasef", team: "EGSS05", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 19, poolRenewals: 0 },
  { name: "EGSS-ehabzaky01", team: "EGSS05", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 21, poolRenewals: 0 },
  { name: "EGSS-ibrahimismaiel", team: "EGSS05", cash: 365, refund: 0, target: 18000, contracts: 0, officialAch: 2, upgradeM2: 0, normalRenewals: 0, upgradeBase: 27, poolRenewals: 0 },
  { name: "EGSS-khaledgonam", team: "EGSS05", cash: 2040, refund: 0, target: 18000, contracts: 2, officialAch: 11.3, upgradeM2: 0, normalRenewals: 2, upgradeBase: 13, poolRenewals: 2 },
  { name: "EGSS-omarmoneb", team: "EGSS05", cash: 1750, refund: 0, target: 12000, contracts: 2, officialAch: 14.6, upgradeM2: 0, normalRenewals: 2, upgradeBase: 16, poolRenewals: 2 },
  { name: "EGSS-samira01", team: "EGSS05", cash: 1020, refund: 0, target: 12800, contracts: 1, officialAch: 8, upgradeM2: 0, normalRenewals: 1, upgradeBase: 17, poolRenewals: 1 },
  { name: "EGSS-abdelrhmanshehata", team: "EGSS10", cash: 632, refund: 0, target: 8800, contracts: 1, officialAch: 7.2, upgradeM2: 1, normalRenewals: 0, upgradeBase: 27, poolRenewals: 1 },
  { name: "EGSS-ahmedshoukry", team: "EGSS10", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 34, poolRenewals: 0 },
  { name: "EGSS-mahmoudkhamis", team: "EGSS10", cash: 1460, refund: 0, target: 20000, contracts: 1, officialAch: 7.3, upgradeM2: 0, normalRenewals: 1, upgradeBase: 32, poolRenewals: 1 },
  { name: "EGSS-amrsafwat", team: "EGSS13", cash: 1460, refund: 0, target: 12000, contracts: 1, officialAch: 12.2, upgradeM2: 0, normalRenewals: 1, upgradeBase: 26, poolRenewals: 1 },
  { name: "EGSS-hayamhassan", team: "EGSS13", cash: 0, refund: 0, target: 0, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 21, poolRenewals: 0 },
  { name: "EGSS-marwaahmed", team: "EGSS13", cash: 1020, refund: 0, target: 12800, contracts: 1, officialAch: 8, upgradeM2: 0, normalRenewals: 1, upgradeBase: 16, poolRenewals: 1 },
  { name: "EGSS-mohamedha", team: "EGSS13", cash: 3980, refund: 0, target: 12000, contracts: 2, officialAch: 33.2, upgradeM2: 0, normalRenewals: 2, upgradeBase: 20, poolRenewals: 2 },
  { name: "EGSS-adhmgadallah", team: "EGSS30", cash: 1020, refund: 0, target: 12800, contracts: 1, officialAch: 8, upgradeM2: 0, normalRenewals: 1, upgradeBase: 26, poolRenewals: 1 },
  { name: "EGSS-alihesham01", team: "EGSS30", cash: 1020, refund: 0, target: 8800, contracts: 1, officialAch: 11.6, upgradeM2: 0, normalRenewals: 1, upgradeBase: 18, poolRenewals: 1 },
  { name: "EGSS-titooooo", team: "EGSS30", cash: 1600, refund: 0, target: 11500, contracts: 2, officialAch: 13.9, upgradeM2: 0, normalRenewals: 2, upgradeBase: 19, poolRenewals: 2 },
];`;

content = content.replace(/const REPS_DATA = \[[\s\S]*?\];/, newRepsData);

// 2. New POOL22_M2_COVERAGE block
const newCoverageData = `const POOL22_M2_COVERAGE = {
  "EGSS-nohayoussry": 4.8,
  "EGSS-ashraqatal": 5.9,
  "EGSS-negma": 37.9,
  "EGSS-juliamonir01": 22.2,
  "EGSS-mahmoud04": 28.0,
  "EGSS-abdelrahmannasef": 6.2,
  "EGSS-ehabzaky01": 38.5,
  "EGSS-ibrahimismaiel": 57.9,
  "EGSS-khaledgonam": 71.4,
  "EGSS-omarmoneb": 63.6,
  "EGSS-samira01": 58.3,
  "EGSS-abdelrhmanshehata": 37.5,
  "EGSS-ahmedshoukry": 17.9,
  "EGSS-mahmoudkhamis": 27.3,
  "EGSS-amrsafwat": 14.3,
  "EGSS-hayamhassan": 68.8,
  "EGSS-marwaahmed": 21.4,
  "EGSS-mohamedha": 0.0,
  "EGSS-adhmgadallah": 34.8,
  "EGSS-alihesham01": 46.2,
  "EGSS-titooooo": 14.3,
};`;

content = content.replace(/const POOL22_M2_COVERAGE = \{[\s\S]*?\};/, newCoverageData);

// 3. Update totalUpgradeM2, totalUpgradeBase, totalUpgrade20Target, totalUpgrade20Needed in buildModel
const oldScalars = `  const totalUpgradeM2 = 0;
  const totalNormalRenewals = 21; // from Student_Detail32
  const totalUpgradeBase = 0; // Awaiting official October Upgrade Base from SCRM
  const totalUpgrade20Target = 0;
  const totalUpgrade20Needed = 0;`;

const newScalars = `  const totalUpgradeM2 = individuals.reduce((sum, r) => sum + (r.upgradeM2 || 0), 0) || 3;
  const totalNormalRenewals = Math.max(0, totalContracts - totalUpgradeM2); // 18 from Student_Detail32
  const totalUpgradeBase = individuals.reduce((sum, r) => sum + (r.upgradeBase || 0), 0) || 497;
  const totalUpgrade20Target = Math.ceil(totalUpgradeBase * 0.20); // 100
  const totalUpgrade20Needed = Math.max(0, totalUpgrade20Target - totalUpgradeM2); // 97`;

if (content.includes(oldScalars)) {
  content = content.replace(oldScalars, newScalars);
  console.log('Scalars replaced successfully!');
} else {
  console.warn('Old scalars block not found verbatim, checking regex...');
  content = content.replace(/const totalUpgradeM2 = \d+;[\s\S]*?const totalUpgrade20Needed = \d+;/, newScalars);
}

// 4. Update MASTER_OPERATIONS_DATA.upgrades
const newMasterUpgrades = `  upgrade: [
    { name: "EGSS-nohayoussry",       team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 28 },
    { name: "EGSS-ashraqatal",        team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 29 },
    { name: "EGSS-negma",             team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 35 },
    { name: "EGSS-juliamonir01",      team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 22 },
    { name: "EGSS-mahmoud04",         team: "ME-EGSS01", upgradeM2: 2, upgradeBase: 31 },
    { name: "EGSS-AbdelrahmanNASEF",  team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 19 },
    { name: "EGSS-ehabzaky01",        team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 21 },
    { name: "EGSS-Ibrahimismaiel",    team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 27 },
    { name: "EGSS-KhaledGonam",       team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 13 },
    { name: "EGSS-OmarMoneb",         team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 16 },
    { name: "EGSS-samira01",          team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 17 },
    { name: "EGSS-abdelrhmanshehata", team: "ME-EGSS10", upgradeM2: 1, upgradeBase: 27 },
    { name: "EGSS-AhmedShoukry",      team: "ME-EGSS10", upgradeM2: 0, upgradeBase: 34 },
    { name: "EGSS-Mahmoudkhamis",     team: "ME-EGSS10", upgradeM2: 0, upgradeBase: 32 },
    { name: "EGSS-Amrsafwat",         team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 26 },
    { name: "EGSS-hayamhassan",       team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 21 },
    { name: "EGSS-marwaahmed",        team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 16 },
    { name: "EGSS-mohamedha",         team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 20 },
    { name: "EGSS-AdhmGadAllah",      team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 26 },
    { name: "EGSS-alihesham01",       team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 18 },
    { name: "EGSS-titooooo",          team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 19 }
  ],`;

content = content.replace(/upgrade:\s*\[[\s\S]*?\](?=\s*,\s*unfixed:)/, newMasterUpgrades);

fs.writeFileSync(dashJsPath, content, 'utf8');
console.log('Successfully updated dashboard.js!');
