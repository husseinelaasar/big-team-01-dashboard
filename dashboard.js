/* =========================================================================
   Big Team 01 Executive Performance Dashboard — Engine v3.0
   =========================================================================
   DATA SOURCES & AUDIT TRAILS:
   1. Live CRM Portal (https://crm.51talk.com/admin/main.php)
      - Cash Revenue: "Renewal performance(USD)"
      - Contracts Count: "Number of students who choose renewal"
   2. SS Lens Dashboard (Today's File: POOL_Detail16)
      - Upgrade M2 renewals: Column E == "Upgrade M2", Column I == 1
      - Normal Renewals: Exp Non-0, Exp 0-cr, period, outside pool, FOE
      - Upgrade Base: Total potential upgrade pool count
   3. User Target Table (Sep 2026 Cash Targets — Big Team 01 Total: $225,600)
   4. 51Talk Data Center SOP Compliance (lp.51talkjr.com/#/data-center)
   ========================================================================= */

const DATA_SOURCES = {
  crmRenewalPerf: 'CRM: crm.51talk.com -> Column: "Renewal performance(USD)"',
  crmContracts: 'CRM: crm.51talk.com -> Column: "Number of students who choose renewal"',
  poolDetail16: 'SS Lens Dashboard -> POOL_Detail16 (Col E: Upgrade M2, Col I: Is This Month Renew)',
  userTargets: 'Official October 2026 Target Allocation Table',
  sopData: '51Talk Data Center (lp.51talkjr.com/#/data-center/business/SA-SSdata)'
};

// Verified TL & Unified Team Configuration
const TL_MAPPING = {
  "EGSS01": { tl: "EGSS-ashraqatal", leaderName: "Ashraqatal", fullName: "ME-EGSS01 (Ashraqatal)", color: "#6366f1", bg: "rgba(99, 102, 241, 0.15)", border: "rgba(99, 102, 241, 0.4)", text: "#818cf8", badgeClass: "team-badge-01" },
  "EGSS05": { tl: "EGSS-ibrahimismaiel", leaderName: "Ibrahim Abd El Shakour", fullName: "ME-EGSS05 (Ibrahim Abd El Shakour)", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.4)", text: "#22d3ee", badgeClass: "team-badge-05" },
  "EGSS10": { tl: "EGSS-abdelrhmanshehata", leaderName: "Abdelrhman Shehata", fullName: "ME-EGSS10 (Abdelrhman Shehata)", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", text: "#34d399", badgeClass: "team-badge-10" },
  "EGSS13": { tl: "EGSS-mohamedha", leaderName: "Mohamedha", fullName: "ME-EGSS13 (Mohamedha)", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", text: "#fbbf24", badgeClass: "team-badge-13" },
  "EGSS30": { tl: "EGSS-AdhmGadAllah", leaderName: "Adhm GadAllah", fullName: "ME-EGSS30 (Adhm GadAllah)", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)", border: "rgba(244, 63, 94, 0.4)", text: "#fb7185", badgeClass: "team-badge-30" }
};

function getTeamConfig(teamKey) {
  if (!teamKey) return { color: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.3)", text: "#cbd5e1", fullName: "Unknown", tl: "Unknown", badgeClass: "" };
  const cleanKey = String(teamKey).toUpperCase().replace(/^ME-/, "").trim();
  if (TL_MAPPING[cleanKey]) return TL_MAPPING[cleanKey];
  if (cleanKey.indexOf("01") !== -1) return TL_MAPPING["EGSS01"];
  if (cleanKey.indexOf("05") !== -1) return TL_MAPPING["EGSS05"];
  if (cleanKey.indexOf("10") !== -1) return TL_MAPPING["EGSS10"];
  if (cleanKey.indexOf("13") !== -1) return TL_MAPPING["EGSS13"];
  if (cleanKey.indexOf("30") !== -1) return TL_MAPPING["EGSS30"];
  return { color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.4)", text: "#38bdf8", fullName: teamKey, tl: "Sector", badgeClass: "" };
}

function renderTeamBadge(teamKey) {
  const cfg = getTeamConfig(teamKey);
  const displayLabel = String(teamKey).startsWith("ME-") ? teamKey : ("ME-" + teamKey);
  return "<span class=\"team-badge " + cfg.badgeClass + "\" style=\"background: " + cfg.bg + "; color: " + cfg.text + "; border: 1px solid " + cfg.border + ";\"><span style=\"width: 6px; height: 6px; border-radius: 50%; background: " + cfg.color + "; display: inline-block;\"></span>" + displayLabel + "</span>";
}

// October 2026 Official Cash & Contracts Target Plan (Senior Management)
const NEW_TARGETS = {
  // ME-EGSS01 (5 Reps) — Total Cash: $88,000 | Contracts: 63
  "EGSS-ashraqatal": 20000,
  "EGSS-negma": 20000,
  "EGSS-mahmoud04": 18000,
  "EGSS-juliamonir01": 18000,
  "EGSS-nohayoussry": 12000,

  // ME-EGSS05 (6 Reps) — Total Cash: $90,800 | Contracts: 72
  "EGSS-ehabzaky01": 18000,
  "EGSS-Ibrahimismaiel": 18000,
  "EGSS-ibrahimismaiel": 18000,
  "EGSS-KhaledGonam": 18000,
  "EGSS-khaledgonam": 18000,
  "EGSS-samira01": 12800,
  "EGSS-AbdelrahmanNASEF": 12000,
  "EGSS-abdelrahmannasef": 12000,
  "EGSS-OmarMoneb": 12000,
  "EGSS-omarmoneb": 12000,

  // ME-EGSS10 (3 Reps) — Total Cash: $45,250 | Contracts: 43
  "EGSS-Mahmoudkhamis": 20000,
  "EGSS-mahmoudkhamis": 20000,
  "EGSS-AhmedShoukry": 16450,
  "EGSS-ahmedshoukry": 16450,
  "EGSS-abdelrhmanshehata": 8800,

  // ME-EGSS13 (4 Reps) — Total Cash: $48,800 | Contracts: 40
  "EGSS-marwaahmed": 12800,
  "EGSS-mohamedha": 12000,
  "EGSS-hayamhassan": 12000,
  "EGSS-Amrsafwat": 12000,
  "EGSS-amrsafwat": 12000,

  // ME-EGSS30 (3 Reps) — Total Cash: $33,100 | Contracts: 34
  "EGSS-AdhmGadAllah": 12800,
  "EGSS-adhmgadallah": 12800,
  "EGSS-titooooo": 11500,
  "EGSS-alihesham01": 8800
};

// October 2026 Official Contracts Target Plan
const NEW_CONTRACTS_TARGETS = {
  // ME-EGSS01 (5 Reps) — 63 Contracts
  "EGSS-ashraqatal": 12,
  "EGSS-negma": 11,
  "EGSS-mahmoud04": 18,
  "EGSS-juliamonir01": 13,
  "EGSS-nohayoussry": 9,

  // ME-EGSS05 (6 Reps) — 72 Contracts
  "EGSS-ehabzaky01": 10,
  "EGSS-Ibrahimismaiel": 12,
  "EGSS-ibrahimismaiel": 12,
  "EGSS-KhaledGonam": 13,
  "EGSS-khaledgonam": 13,
  "EGSS-samira01": 14,
  "EGSS-AbdelrahmanNASEF": 12,
  "EGSS-abdelrahmannasef": 12,
  "EGSS-OmarMoneb": 11,
  "EGSS-omarmoneb": 11,

  // ME-EGSS10 (3 Reps) — 43 Contracts
  "EGSS-Mahmoudkhamis": 17,
  "EGSS-mahmoudkhamis": 17,
  "EGSS-AhmedShoukry": 16,
  "EGSS-ahmedshoukry": 16,
  "EGSS-abdelrhmanshehata": 10,

  // ME-EGSS13 (4 Reps) — 40 Contracts
  "EGSS-marwaahmed": 13,
  "EGSS-mohamedha": 9,
  "EGSS-hayamhassan": 5,
  "EGSS-Amrsafwat": 13,
  "EGSS-amrsafwat": 13,

  // ME-EGSS30 (3 Reps) — 34 Contracts
  "EGSS-AdhmGadAllah": 14,
  "EGSS-adhmgadallah": 14,
  "EGSS-titooooo": 11,
  "EGSS-alihesham01": 9
};

// Reconciled Small Team Totals (Sum of Active Members, Leaver Refunds Charged to Sector)
const OFFICIAL_TEAMS_DATA = {
  "EGSS01": { gross: 4960, refund: 0, cash: 4960, target: 88000, contracts: 5, targetContracts: 63, officialAch: 5.6 },
  "EGSS05": { gross: 5175, refund: 0, cash: 5175, target: 90800, contracts: 5, targetContracts: 72, officialAch: 5.7 },
  "EGSS10": { gross: 2092, refund: 0, cash: 2092, target: 45250, contracts: 2, targetContracts: 43, officialAch: 4.6 },
  "EGSS13": { gross: 3620, refund: 0, cash: 3620, target: 48800, contracts: 2, targetContracts: 40, officialAch: 7.4 },
  "EGSS30": { gross: 1740, refund: 0, cash: 1740, target: 33100, contracts: 2, targetContracts: 34, officialAch: 5.3 }
};

const REPS_DATA = [
  { name: "EGSS-nohayoussry", team: "EGSS01", cash: 1600, refund: 0, target: 12000, contracts: 2, contractsTarget: 9, officialAch: 13.3, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-ashraqatal", team: "EGSS01", cash: 0, refund: 0, target: 20000, contracts: 0, contractsTarget: 12, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-negma", team: "EGSS01", cash: 0, refund: 0, target: 20000, contracts: 0, contractsTarget: 11, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-juliamonir01", team: "EGSS01", cash: 1020, refund: 0, target: 18000, contracts: 1, contractsTarget: 13, officialAch: 5.7, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-mahmoud04", team: "EGSS01", cash: 2340, refund: 0, target: 18000, contracts: 2, contractsTarget: 18, officialAch: 13.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-abdelrahmannasef", team: "EGSS05", cash: 0, refund: 0, target: 12000, contracts: 0, contractsTarget: 12, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-ehabzaky01", team: "EGSS05", cash: 0, refund: 0, target: 18000, contracts: 0, contractsTarget: 10, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-ibrahimismaiel", team: "EGSS05", cash: 365, refund: 0, target: 18000, contracts: 0, contractsTarget: 12, officialAch: 2.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-khaledgonam", team: "EGSS05", cash: 2040, refund: 0, target: 18000, contracts: 2, contractsTarget: 13, officialAch: 11.3, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-omarmoneb", team: "EGSS05", cash: 1750, refund: 0, target: 12000, contracts: 2, contractsTarget: 11, officialAch: 14.6, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-samira01", team: "EGSS05", cash: 1020, refund: 0, target: 12800, contracts: 1, contractsTarget: 14, officialAch: 8.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-abdelrhmanshehata", team: "EGSS10", cash: 632, refund: 0, target: 8800, contracts: 1, contractsTarget: 10, officialAch: 7.2, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-ahmedshoukry", team: "EGSS10", cash: 0, refund: 0, target: 16450, contracts: 0, contractsTarget: 16, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-mahmoudkhamis", team: "EGSS10", cash: 1460, refund: 0, target: 20000, contracts: 1, contractsTarget: 17, officialAch: 7.3, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-amrsafwat", team: "EGSS13", cash: 1460, refund: 0, target: 12000, contracts: 1, contractsTarget: 13, officialAch: 12.2, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-hayamhassan", team: "EGSS13", cash: 0, refund: 0, target: 12000, contracts: 0, contractsTarget: 5, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-marwaahmed", team: "EGSS13", cash: 0, refund: 0, target: 12800, contracts: 0, contractsTarget: 13, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-mohamedha", team: "EGSS13", cash: 2160, refund: 0, target: 12000, contracts: 1, contractsTarget: 9, officialAch: 18.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-adhmgadallah", team: "EGSS30", cash: 0, refund: 0, target: 12800, contracts: 0, contractsTarget: 14, officialAch: 0.0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-alihesham01", team: "EGSS30", cash: 1020, refund: 0, target: 8800, contracts: 1, contractsTarget: 9, officialAch: 11.6, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-titooooo", team: "EGSS30", cash: 720, refund: 0, target: 11500, contracts: 1, contractsTarget: 11, officialAch: 6.3, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
];

// SOP Process Compliance Data (51Talk Data Center)
const SOP_DATA = {
  "ME-EGSS01": { R1: 91, R2: 88, R3: 85, R4: 80, R5: 55, R6: 78, EC: 72, U1: 82, U2: 75 },
  "ME-EGSS05": { R1: 95, R2: 92, R3: 88, R4: 85, R5: 62, R6: 82, EC: 78, U1: 88, U2: 80 },
  "ME-EGSS10": { R1: 89, R2: 86, R3: 82, R4: 78, R5: 48, R6: 75, EC: 65, U1: 79, U2: 70 },
  "ME-EGSS13": { R1: 93, R2: 90, R3: 87, R4: 83, R5: 69, R6: 80, EC: 75, U1: 85, U2: 78 },
  "ME-EGSS30": { R1: 87, R2: 84, R3: 80, R4: 76, R5: 45, R6: 72, EC: 60, U1: 76, U2: 68 }
};

const SOP_ROUNDS = [
  { key: 'R1', label: 'R1 Leads Coverage', target: 95 },
  { key: 'R2', label: 'R2 Timely Callback', target: 90 },
  { key: 'R3', label: 'R3 Demo Class Reserved', target: 85 },
  { key: 'R4', label: 'R4 Class Consumption', target: 80 },
  { key: 'R5', label: 'R5 Outside Pool Recovery', target: 70 },
  { key: 'R6', label: 'R6 Pipeline Follow-up', target: 75 },
  { key: 'EC', label: 'English Club Attendance', target: 70 },
  { key: 'U1', label: 'R1 M2 Upgrade Pitch', target: 85 },
  { key: 'U2', label: 'R2 M2 Upgrade Close', target: 80 }
];

// Verified POOL22 Column G (Upgrade M2 Effective Coverage %)
const POOL22_M2_COVERAGE = {
  "EGSS-ashraqatal": 0.0,
  "EGSS-juliamonir01": 0.0,
  "EGSS-mahmoud04": 0.0,
  "EGSS-negma": 0.0,
  "EGSS-nohayoussry": 0.0,
  "EGSS-AbdelrahmanNASEF": 0.0,
  "EGSS-ehabzaky01": 0.0,
  "EGSS-Ibrahimismaiel": 0.0,
  "EGSS-KhaledGonam": 0.0,
  "EGSS-OmarMoneb": 0.0,
  "EGSS-samira01": 0.0,
  "EGSS-abdelrhmanshehata": 0.0,
  "EGSS-AhmedShoukry": 0.0,
  "EGSS-Mahmoudkhamis": 0.0,
  "EGSS-Amrsafwat": 0.0,
  "EGSS-hayamhassan": 0.0,
  "EGSS-marwaahmed": 0.0,
  "EGSS-mohamedha": 0.0,
  "EGSS-AdhmGadAllah": 0.0,
  "EGSS-alihesham01": 0.0,
  "EGSS-titooooo": 0.0
};

// Official Cumulative Expected Pacing Benchmark Curve (October Day 1 to 31)
const OFFICIAL_PACING_CURVE = {
  1: 5,   2: 8,   3: 11,  4: 14,  5: 17,
  6: 20,  7: 23,  8: 24,  9: 25,  10: 26,
  11: 29, 12: 32, 13: 35, 14: 38, 15: 40,
  16: 41, 17: 43, 18: 46, 19: 49, 20: 51,
  21: 54, 22: 56, 23: 57, 24: 58, 25: 60,
  26: 64, 27: 76, 28: 83, 29: 90, 30: 96,
  31: 102
};

const DAILY_RECOMMENDATIONS = [
  { type: 'critical', icon: '🔴', title: 'Sector BEHIND Pace', detail: 'Ach 0% vs Day 5 target 17%. Gap: 17pp. Need $-676/day to close.', time: '20261005_163454' },
  { type: 'action', icon: '📋', title: 'Bottom 5 Reps Need Support', detail: '. Schedule targeted coaching sessions today.', time: '20261005_163454' },
  { type: 'success', icon: '⭐', title: 'Top 3 Stars Today', detail: '. Recognize in team channel!', time: '20261005_163454' },
];

// =========================================================================
// 51Talk SS Commission Scheme Intelligence Engine
// =========================================================================
const SS_COMMISSION_TIERS = [
  { min: 22000, max: Infinity, rate: 0.040, label: '4.0%', name: 'Tier 7' },
  { min: 18000, max: 22000,    rate: 0.035, label: '3.5%', name: 'Tier 6' },
  { min: 12000, max: 18000,    rate: 0.030, label: '3.0%', name: 'Tier 5' },
  { min: 8000,  max: 12000,    rate: 0.025, label: '2.5%', name: 'Tier 4' },
  { min: 6000,  max: 8000,     rate: 0.020, label: '2.0%', name: 'Tier 3' },
  { min: 4000,  max: 6000,     rate: 0.015, label: '1.5%', name: 'Tier 2' },
  { min: 0,     max: 4000,     rate: 0.005, label: '0.5%', name: 'Tier 1' }
];

function calculateSSCommission(netCash, teamAch, teamTarget, teamCash, repAch) {
  const cash = Math.max(0, netCash || 0);
  
  let currentTierIndex = -1;
  for (let i = 0; i < SS_COMMISSION_TIERS.length; i++) {
    const t = SS_COMMISSION_TIERS[i];
    if (cash >= t.min) {
      currentTierIndex = i;
      break;
    }
  }
  if (currentTierIndex === -1) currentTierIndex = SS_COMMISSION_TIERS.length - 1;
  const currentTier = SS_COMMISSION_TIERS[currentTierIndex];
  
  // Dual-Condition Small Team Booster (+0.5% Extra Earning):
  // Rule: Only unlocked when BOTH the Small Team achieves >= 100% AND the individual rep achieves >= 100%
  const teamQualified = (teamAch !== undefined && teamAch !== null && teamAch >= 100);
  const repQualified = (repAch !== undefined && repAch !== null && repAch >= 100);
  const hasTeamBonus = teamQualified && repQualified;
  const teamBonusRate = hasTeamBonus ? 0.005 : 0.0;
  
  const baseRate = currentTier.rate;
  const effectiveRate = baseRate + teamBonusRate;
  const basePayout = Math.round(cash * baseRate * 100) / 100;
  const bonusPayout = Math.round(cash * teamBonusRate * 100) / 100;
  const totalPayout = Math.round((basePayout + bonusPayout) * 100) / 100;
  
  let nextTier = null;
  let remainingToNext = 0;
  let expectedNextEarning = 0;
  let nextRatePct = '';
  
  if (currentTierIndex > 0) {
    nextTier = SS_COMMISSION_TIERS[currentTierIndex - 1];
    remainingToNext = Math.max(0, nextTier.min - cash);
    const nextEffectiveRate = nextTier.rate + teamBonusRate;
    expectedNextEarning = Math.round(nextTier.min * nextEffectiveRate * 100) / 100;
    nextRatePct = (nextTier.rate * 100).toFixed(1) + '%' + (hasTeamBonus ? ' + 0.5% Bonus' : '');
  }
  
  const teamGapTo100 = (teamTarget && teamCash && teamCash < teamTarget) ? (teamTarget - teamCash) : 0;
  
  return {
    netCash: cash,
    rawCash: netCash,
    currentTier,
    tierName: currentTier.name,
    baseRate,
    baseRatePct: (baseRate * 100).toFixed(1) + '%',
    hasTeamBonus,
    teamBonusRate,
    effectiveRate,
    effectiveRatePct: (effectiveRate * 100).toFixed(1) + '%',
    basePayout,
    bonusPayout,
    totalPayout,
    nextTier,
    remainingToNext,
    expectedNextEarning,
    nextRatePct,
    teamAch: teamAch !== undefined ? Math.round(teamAch * 10) / 10 : 0,
    teamGapTo100
  };
}

// Build Unified Data Intelligence Model
function buildDataModel() {
  const daysPassed = 5; // Current MTD Day (Oct 3, 2026)
  const daysInMonth = 31;
  const daysLeft = daysInMonth - daysPassed;
  const expectedPace = OFFICIAL_PACING_CURVE[daysPassed] || 11;

  const teams = {};
  const teamKeys = ["EGSS01", "EGSS05", "EGSS10", "EGSS13", "EGSS30"];

  teamKeys.forEach(tk => {
    const tl = TL_MAPPING[tk];
    teams[tk] = {
      key: tk,
      label: tl.fullName,
      tl: tl.tl,
      color: tl.color,
      cash: 0,
      target: 0,
      contracts: 0,
      contractsTarget: 0,
      upgradeM2: 0,
      normalRenewals: 0,
      upgradeBase: 0,
      poolRenewals: 0,
      members: []
    };
  });

  const individuals = REPS_DATA.map(raw => {
    const target = raw.target || NEW_TARGETS[raw.name] || 0;
    const contractsTarget = raw.contractsTarget || NEW_CONTRACTS_TARGETS[raw.name] || 0;
    const calcAch = target > 0 ? (Math.round((raw.cash / target) * 1000) / 10) : 0;
    const ach = (raw.officialAch !== undefined && raw.officialAch !== null && raw.officialAch > 0) ? raw.officialAch : calcAch;
    const gap = Math.max(0, target - raw.cash);
    const dailyNeeded = daysLeft > 0 ? (gap / daysLeft) : 0;
    const upgradeRate = raw.upgradeBase > 0 ? ((raw.upgradeM2 / raw.upgradeBase) * 100) : 0;
    const coverRate = POOL22_M2_COVERAGE[raw.name] !== undefined ? POOL22_M2_COVERAGE[raw.name] : 0;
    const tlInfo = TL_MAPPING[raw.team];

    const rep = {
      ...raw,
      target,
      contractsTarget,
      achievement: ach,
      gap,
      dailyNeeded,
      upgradeRate,
      coverRate,
      upgrade20Target: Math.ceil(raw.upgradeBase * 0.20),
      upgrade20Needed: Math.max(0, Math.ceil(raw.upgradeBase * 0.20) - raw.upgradeM2),
      isTL: raw.name.toLowerCase() === tlInfo.tl.toLowerCase(),
      teamLabel: tlInfo.fullName,
      teamColor: tlInfo.color,
      status: getStatus(ach),
      statusColor: getStatusColor(ach)
    };

    // Aggregate to team
    const t = teams[raw.team];
    t.upgradeM2 += rep.upgradeM2;
    t.normalRenewals += rep.normalRenewals;
    t.upgradeBase += rep.upgradeBase;
    t.poolRenewals += rep.poolRenewals;
    t.members.push(rep);

    return rep;
  });

  // Calculate team achievements and run-rates
  // RULE: Small team net cash is strictly the sum of active team members' net cash.
  // Active member refunds are displayed next to their names in the roster.
  // Refunds not tied to an active team member are charged ONLY to Big Team 01 (Sector Total).
  teamKeys.forEach(tk => {
    const t = teams[tk];
    t.cash = t.members.reduce((s, m) => s + m.cash, 0);
    t.target = t.members.reduce((s, m) => s + m.target, 0);
    t.refund = t.members.reduce((s, m) => s + (m.refund || 0), 0);
    t.gross = t.members.reduce((s, m) => s + (m.cash + (m.refund || 0)), 0);
    t.contracts = t.members.reduce((s, m) => s + m.contracts, 0);
    t.contractsTarget = t.members.reduce((s, m) => s + (m.contractsTarget || 0), 0);
    t.achievement = t.target > 0 ? ((t.cash / t.target) * 100) : 0;
    t.gap = Math.max(0, t.target - t.cash);
    t.projected = Math.round((t.cash / daysPassed) * daysInMonth);
    t.dailyNeeded = Math.round(t.gap / daysLeft);
    t.upgradeRate = t.upgradeBase > 0 ? ((t.upgradeM2 / t.upgradeBase) * 100) : 0;
    t.upgrade20Target = Math.ceil(t.upgradeBase * 0.20);
    t.upgrade20Needed = Math.max(0, t.upgrade20Target - t.upgradeM2);
    const off = (typeof OFFICIAL_TEAMS_DATA !== 'undefined' && OFFICIAL_TEAMS_DATA[tk]) ? OFFICIAL_TEAMS_DATA[tk] : null;
    t.officialAch = (off && off.officialAch !== undefined) ? off.officialAch : (t.target > 0 ? ((t.cash / t.target) * 100) : 0);
  });

  // Calculate Commission for each individual rep
  individuals.forEach(rep => {
    const t = teams[rep.team];
    const teamAch = t ? (t.officialAch !== undefined ? t.officialAch : t.achievement) : 0;
    rep.commission = calculateSSCommission(rep.cash, teamAch, t ? t.target : 0, t ? t.cash : 0, rep.achievement);
  });

  // Reconciled Sector Totals (Official October 2026 Cash Targets Plan)
  const totalCash = 17587; // from Individual Sheet Col G (or 指标看板 Col C)
  const totalTarget = 305950; // Official October Cash Target Plan ($305,950 across 21 reps)
  const sectorAchPct = Math.round((totalCash / totalTarget) * 1000) / 10; // 5.3%
  const totalContracts = 16; // from 指标看板 Col D
  const totalContractsTarget = 252; // Official October Contracts Target Plan (252 contracts)
  const totalUpgradeM2 = 0;
  const totalNormalRenewals = 16; // from Student_Detail32
  const totalUpgradeBase = 0; // Awaiting official October Upgrade Base from SCRM
  const totalUpgrade20Target = 0;
  const totalUpgrade20Needed = 0;

  return {
    teams,
    individuals,
    summary: {
      totalCash,
      totalTarget,
      totalContracts,
      totalContractsTarget,
      totalUpgradeM2,
      totalNormalRenewals,
      totalUpgradeBase,
      totalUpgrade20Target,
      totalUpgrade20Needed,
      achievement: sectorAchPct,
      projectedCash: daysPassed > 0 ? Math.round((totalCash / daysPassed) * daysInMonth) : 0,
      totalGap: Math.max(0, totalTarget - totalCash),
      dailyNeeded: (daysLeft > 0 && totalTarget > 0) ? Math.round((totalTarget - totalCash) / daysLeft) : 0,
      upgradeRate: totalUpgradeBase > 0 ? ((totalUpgradeM2 / totalUpgradeBase) * 100) : 0,
      activeReps: individuals.length,
      zeroReps: individuals.filter(r => r.cash === 0).length,
      targetPacePct: expectedPace,
      pacingGapPct: Math.round((sectorAchPct - expectedPace) * 10) / 10,
      daysPassed,
      daysLeft,
      daysInMonth
    }
  };
}

function getStatus(ach) {
  if (ach >= 80) return 'On Track';
  if (ach >= 50) return 'At Risk';
  if (ach > 0) return 'Behind';
  return 'Zero Sales';
}

function getStatusColor(ach) {
  if (ach >= 80) return '#10b981';
  if (ach >= 50) return '#f59e0b';
  if (ach > 0) return '#f43f5e';
  return '#64748b';
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtPct(n) {
  return n.toFixed(1) + '%';
}

// Animated Number Counter
function animateCounter(element, targetValue, prefix, suffix, duration) {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();
  duration = duration || 1200;
  prefix = prefix || '';
  suffix = suffix || '';
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (targetValue - start) * eased);
    element.textContent = prefix + current.toLocaleString('en-US') + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// =========================================================================
// RENDERERS
// =========================================================================

function renderKPIs(model) {
  const s = model.summary;

  // Total Cash — animated counter
  animateCounter(document.getElementById('totalCash'), Math.round(s.totalCash), '$', '', 1400);
  document.getElementById('cashTarget').textContent = `Target: ${fmt(s.totalTarget)} | Projected: ${fmt(s.projectedCash)}`;
  document.getElementById('cashBar').style.width = Math.min(100, s.achievement) + '%';
  document.getElementById('cashPct').textContent = `${fmtPct(s.achievement)} Achieved`;

  // Total Contracts — animated counter
  animateCounter(document.getElementById('totalContracts'), s.totalContracts, '', '', 1200);
  const targetContractsTotal = s.totalContractsTarget || 252;
  document.getElementById('contractsSub').textContent = `Target: ${targetContractsTotal} Contracts | Normal: ${s.totalNormalRenewals} | Upgrade M2: ${s.totalUpgradeM2}`;
  document.getElementById('contractsBar').style.width = Math.min(100, (s.totalContracts / targetContractsTotal) * 100) + '%';
  document.getElementById('contractsPct').textContent = `${((s.totalContracts / targetContractsTotal) * 100).toFixed(1)}% Achieved | Avg: ${fmt(s.totalCash / s.totalContracts)} / contract`;

  // Pacing
  document.getElementById('achPct').textContent = fmtPct(s.achievement);
  document.getElementById('achSub').textContent = `Gap: ${fmt(s.totalGap)} | Need: ${fmt(s.dailyNeeded)}/day`;
  document.getElementById('achBar').style.width = Math.min(100, s.achievement) + '%';
  document.getElementById('achDays').textContent = `Day ${s.daysPassed} of ${s.daysInMonth} | Expected Pace: ${s.targetPacePct}% (${s.daysLeft} Days Left)`;

  // Reps
  document.getElementById('totalReps').textContent = `${s.activeReps} Reps`;
  document.getElementById('baseLeads').textContent = `${s.totalUpgradeM2} Upgrades / ${s.totalUpgradeBase > 0 ? s.totalUpgradeBase : 'Pending SCRM'} Base | 20% Goal: ${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)`;
  document.getElementById('repsBar').style.width = Math.min(100, ((s.activeReps - s.zeroReps) / s.activeReps) * 100) + '%';
  document.getElementById('repsPct').textContent = `${fmtPct(s.upgradeRate)} M2 Upgrade Conversion`;
}

function renderTeamBars(model) {
  const container = document.getElementById('teamBarsContainer');
  if (!container) return;
  container.innerHTML = '';

  const MAX_SCALE = 103; // Official pacing curve ends at 103%
  const daysPassed = model.summary.daysPassed || 3;
  const pacePct = model.summary.targetPacePct || 11;
  const posToday = Math.min(100, Math.max(0, (pacePct / MAX_SCALE) * 100));
  const pos100 = (100 / MAX_SCALE) * 100; // 97.087%

  // Big Team 01 metrics
  const expCashBigTeam = Math.round(model.summary.totalTarget * (pacePct / 100));
  const diffBigTeamCash = model.summary.totalCash - expCashBigTeam;
  const diffBigTeamPct = Math.round((model.summary.achievement - pacePct) * 10) / 10;
  const bigTeamWidthPct = Math.min(100, Math.max(0, (model.summary.achievement / MAX_SCALE) * 100));

  let bigTeamBadge = '';
  if (model.summary.totalTarget === 0) {
    bigTeamBadge = '<span style="background: rgba(148, 163, 184, 0.2); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">⚪ Target Pending</span>';
  } else if (model.summary.achievement >= pacePct) {
    bigTeamBadge = `<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🟢 Ahead of Pace (+${diffBigTeamPct}%)</span>`;
  } else if (model.summary.achievement >= pacePct - 8) {
    bigTeamBadge = `<span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🟡 Near Pace (${diffBigTeamPct}%)</span>`;
  } else {
    bigTeamBadge = `<span style="background: rgba(244, 63, 94, 0.2); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🔴 Behind Pace (${diffBigTeamPct}%)</span>`;
  }

  // Key milestones from the official 30-day table
  const baseMilestones = [
    { day: 1, pct: 5 },
    { day: 3, pct: 11 },
    { day: 7, pct: 23 },
    { day: 10, pct: 26 },
    { day: 14, pct: 38 },
    { day: 17, pct: 43 },
    { day: 21, pct: 54 },
    { day: 25, pct: 60 },
    { day: 27, pct: 76 },
    { day: 31, pct: 102, isGoal: true }
  ];

  // Dynamically assign isToday to the current active day
  const rulerMilestones = baseMilestones.map(m => ({
    ...m,
    isToday: m.day === daysPassed
  }));
  if (!rulerMilestones.some(m => m.day === daysPassed)) {
    rulerMilestones.push({ day: daysPassed, pct: pacePct, isToday: true });
    rulerMilestones.sort((a, b) => a.day - b.day);
  }

  function getScalePos(pct) {
    return Math.min(100, Math.max(0, (pct / MAX_SCALE) * 100));
  }

  // Outer Relative Wrapper
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';

  // Continuous Vertical Target Guideline passing down through all tracks
  const lineRatio = pacePct / MAX_SCALE;
  const guideLine = document.createElement('div');
  guideLine.style.position = 'absolute';
  guideLine.style.left = `calc(20px + (100% - 40px) * ${lineRatio})`;
  guideLine.style.top = '96px';
  guideLine.style.bottom = '8px';
  guideLine.style.width = '0';
  guideLine.style.borderLeft = '2px dashed #38bdf8';
  guideLine.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.85)';
  guideLine.style.zIndex = '8';
  guideLine.style.pointerEvents = 'none';
  guideLine.style.opacity = '0.9';
  wrapper.appendChild(guideLine);

  // 1. TOP BENCHMARK RULER (5% to 103%)
  const rulerCard = document.createElement('div');
  rulerCard.className = 'pacing-scale-header';
  rulerCard.style.background = 'rgba(15, 23, 42, 0.8)';
  rulerCard.style.border = '1px solid rgba(56, 189, 248, 0.35)';
  rulerCard.style.borderRadius = 'var(--radius-md)';
  rulerCard.style.padding = '18px 20px 24px 20px';
  rulerCard.style.marginBottom = '20px';
  rulerCard.style.position = 'relative';
  rulerCard.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.35)';

  // Build ticks HTML
  let ticksHtml = '';
  rulerMilestones.forEach(m => {
    const pos = getScalePos(m.pct);
    if (m.isToday) {
      ticksHtml += `
        <!-- Floating Pin Above Today -->
        <div style="position: absolute; left: ${pos}%; top: -36px; transform: translateX(-50%); z-index: 15; text-align: center; white-space: nowrap;">
          <div style="background: linear-gradient(135deg, #0284c7, #38bdf8); color: #fff; font-size: 0.78rem; font-weight: 900; padding: 4px 12px; border-radius: 6px; box-shadow: 0 0 16px rgba(56, 189, 248, 0.9); border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 0 6px #fff;"></span>
            <span>📍 Day ${m.day} Target: <strong>${m.pct}%</strong></span>
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #38bdf8; margin: 0 auto;"></div>
        </div>
        <!-- Tick Line on Track -->
        <div style="position: absolute; left: ${pos}%; top: -5px; width: 3px; height: 18px; background: #38bdf8; border-radius: 2px; box-shadow: 0 0 10px #38bdf8; z-index: 12;" title="Day ${m.day}: ${m.pct}% (Today's Benchmark)"></div>
        <!-- Label Below Track -->
        <div style="position: absolute; left: ${pos}%; top: 16px; transform: translateX(-50%); font-size: 0.74rem; font-weight: 900; color: #38bdf8; text-align: center; white-space: nowrap;">
          D${m.day}<br><span style="font-size: 0.78rem;">${m.pct}%</span>
        </div>
      `;
    } else {
      const isTarget100 = m.pct === 100;
      const clr = m.isGoal ? '#10b981' : (isTarget100 ? '#fff' : 'rgba(255,255,255,0.65)');
      const borderClr = m.isGoal ? '#10b981' : 'rgba(255,255,255,0.35)';
      ticksHtml += `
        <div style="position: absolute; left: ${pos}%; top: -1px; width: 2px; height: 10px; background: ${borderClr};" title="Day ${m.day}: ${m.pct}%"></div>
        <div style="position: absolute; left: ${pos}%; top: 16px; transform: translateX(-50%); font-size: 0.66rem; color: ${clr}; text-align: center; white-space: nowrap;">
          D${m.day}<br><span style="font-weight: 700; font-family: var(--font-mono);">${m.pct}%</span>
        </div>
      `;
    }
  });

  // Target 100% tick marker on ruler
  ticksHtml += `
    <div style="position: absolute; left: ${pos100}%; top: -4px; width: 2.5px; height: 16px; background: #fff; border-radius: 1px; box-shadow: 0 0 8px rgba(255,255,255,0.8);" title="Full Target (100%)"></div>
    <div style="position: absolute; left: ${pos100}%; top: 16px; transform: translateX(-50%); font-size: 0.66rem; color: #fff; font-weight: 800; text-align: center; white-space: nowrap;">
      Target<br><span style="font-weight: 900; font-family: var(--font-mono);">100%</span>
    </div>
  `;

  rulerCard.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 7px; border-radius: var(--radius-sm); display: flex;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </span>
        <div>
          <h3 style="font-size: 1rem; font-weight: 800; color: #fff; margin: 0;">
            Official Cumulative Target Pacing Curve (5% to 103%)
          </h3>
          <span style="font-size: 0.78rem; color: var(--text-secondary);">
            Official cumulative benchmark measuring daily target velocity across Big Team 01, small teams, and individual sales reps
          </span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; font-size: 0.82rem;">
        <span style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); padding: 5px 14px; border-radius: 20px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
          <span>🎯 Day ${daysPassed} Target:</span>
          <strong style="color: #fff;">${pacePct}%</strong>
          <span style="color: var(--text-muted);">|</span>
          <strong style="color: #38bdf8;">${fmt(expCashBigTeam)}</strong>
        </span>
      </div>
    </div>

    <!-- The Ruler Scale Track -->
    <div style="position: relative; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; margin-top: 42px; margin-bottom: 30px;">
      <!-- Subtle Gradient Fill up to today -->
      <div style="height: 100%; width: ${posToday}%; background: linear-gradient(90deg, rgba(56,189,248,0.2), rgba(56,189,248,0.55)); border-radius: 4px;"></div>
      ${ticksHtml}
    </div>
  `;
  wrapper.appendChild(rulerCard);

  // 2. MASTER BENCHMARK ROW: ⭐ Big Team 01 (Sector Total)
  const bigTeamRow = document.createElement('div');
  bigTeamRow.style.marginBottom = '18px';
  bigTeamRow.style.background = 'linear-gradient(90deg, rgba(99, 102, 241, 0.14), rgba(15, 23, 42, 0.7))';
  bigTeamRow.style.border = '1.5px solid rgba(99, 102, 241, 0.45)';
  bigTeamRow.style.padding = '14px 20px';
  bigTeamRow.style.borderRadius = 'var(--radius-md)';
  bigTeamRow.style.boxShadow = '0 4px 18px rgba(99, 102, 241, 0.2)';
  bigTeamRow.style.position = 'relative';

  bigTeamRow.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.15rem;">⭐</span>
        <span style="color: #818cf8; font-weight: 900; font-size: 1.1rem; letter-spacing: 0.3px;">Big Team 01 — Sector Total</span>
        <span style="color: var(--text-muted); font-size: 0.82rem;">(Senior Manager: Saber Hussien)</span>
        ${bigTeamBadge}
      </div>
      <div style="font-family: var(--font-mono); font-size: 1rem;">
        <span style="color: #fff; font-weight: 900;">${fmt(model.summary.totalCash)}</span>
        <span style="color: var(--text-muted);"> / ${model.summary.totalTarget > 0 ? fmt(model.summary.totalTarget) : 'Target Pending'}</span>
        <span style="color: ${getStatusColor(model.summary.achievement)}; font-weight: 900; margin-left: 8px;">(${fmtPct(model.summary.achievement)})</span>
      </div>
    </div>

    <!-- Progress Track (Exact 103% scale) -->
    <div style="position: relative; height: 18px; background: rgba(255,255,255,0.07); border-radius: 9px; overflow: visible; margin-bottom: 8px;">
      <!-- Filled Bar -->
      <div style="height: 100%; width: ${bigTeamWidthPct}%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 9px; transition: width 0.8s ease; box-shadow: 0 0 12px rgba(99, 102, 241, 0.55);"></div>
      <!-- 100% Target Marker -->
      <div style="position: absolute; top: -4px; left: ${pos100}%; width: 2px; height: 26px; background: rgba(255,255,255,0.85); border-radius: 1px;" title="Full Target (100%): ${model.summary.totalTarget > 0 ? fmt(model.summary.totalTarget) : 'Target Pending'}"></div>
      <!-- Day Benchmark Marker Line -->
      <div style="position: absolute; top: -6px; left: ${posToday}%; width: 2px; height: 30px; background: #38bdf8; border-left: 2px dashed #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.9); z-index: 5;" title="Day ${daysPassed} Benchmark (${pacePct}%)"></div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
      <span>
        🎯 <strong>Day ${daysPassed} Target (${pacePct}%):</strong> 
        <strong style="color: #38bdf8;">${fmt(expCashBigTeam)}</strong>
        (${model.summary.totalTarget > 0 ? (diffBigTeamCash >= 0 ? '<span style="color:#10b981; font-weight:700;">+' + fmt(diffBigTeamCash) + ' Surplus</span>' : '<span style="color:#f43f5e; font-weight:700;">-' + fmt(Math.abs(diffBigTeamCash)) + ' Deficit</span>') : '<span style="color:#94a3b8;">Awaiting Target</span>'})
      </span>
      <span>Orders: <strong>${model.summary.totalContracts}</strong> (M2: ${model.summary.totalUpgradeM2}) | MTD Projected: <strong style="color: #38bdf8;">${fmt(model.summary.projectedCash)}</strong> | Daily Run-Rate Needed: <strong>${fmt(model.summary.dailyNeeded)}/day</strong></span>
    </div>
  `;
  wrapper.appendChild(bigTeamRow);

  // 3. THE 5 SMALL TEAMS (Ranked by Cash % Descending)
  const sortedTeams = Object.values(model.teams).sort((a, b) => b.achievement - a.achievement);

  sortedTeams.forEach((t, idx) => {
    // Fill width relative to MAX_SCALE (103%)
    const cashWidthPct = Math.min(100, Math.max(0, (t.achievement / MAX_SCALE) * 100));
    const expCashAtPace = Math.round(t.target * (pacePct / 100));
    const paceDiffPct = Math.round((t.achievement - pacePct) * 10) / 10;
    const paceDiffCash = t.cash - expCashAtPace;

    let paceBadge = '';
    if (t.target === 0) {
      paceBadge = '<span style="background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">⚪ Target Pending</span>';
    } else if (t.achievement >= pacePct) {
      paceBadge = `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🟢 Ahead of Pace (+${paceDiffPct}%)</span>`;
    } else if (t.achievement >= pacePct - 8) {
      paceBadge = `<span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🟡 Near Pace (${paceDiffPct}%)</span>`;
    } else {
      paceBadge = `<span style="background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">🔴 Behind Pace (${paceDiffPct}%)</span>`;
    }

    const row = document.createElement('div');
    row.style.marginBottom = '16px';
    row.style.background = 'rgba(255,255,255,0.02)';
    row.style.padding = '14px 20px';
    row.style.borderRadius = 'var(--radius-md)';
    row.style.border = '1px solid var(--border-glass)';
    row.style.position = 'relative';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 800; font-size: 1rem;">#${idx + 1}</span>
          <span style="color: ${t.color}; font-weight: 800; font-size: 1.05rem;">${t.label}</span>
          <span style="color: var(--text-muted); font-size: 0.8rem;">(TL: ${t.tl})</span>
          ${paceBadge}
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.95rem;">
          <span style="color: #fff; font-weight: 800;">${fmt(t.cash)}</span>
          <span style="color: var(--text-muted);"> / ${t.target > 0 ? fmt(t.target) : 'Target Pending'}</span>
          <span style="color: ${getStatusColor(t.achievement)}; font-weight: 800; margin-left: 8px;">(${fmtPct(t.achievement)})</span>
        </div>
      </div>

      <div style="position: relative; height: 16px; background: rgba(255,255,255,0.06); border-radius: 8px; overflow: visible; margin-bottom: 8px;">
        <!-- Filled progress bar matching achievement on 103% scale -->
        <div style="height: 100%; width: ${cashWidthPct}%; background: ${t.color}; border-radius: 8px; transition: width 0.8s ease; box-shadow: 0 0 10px ${t.color}45;"></div>
        <!-- 100% Target Line Marker at 97.1% -->
        <div style="position: absolute; top: -4px; left: ${pos100}%; width: 2px; height: 24px; background: rgba(255,255,255,0.8); border-radius: 1px;" title="Full Target (100%): ${t.target > 0 ? fmt(t.target) : 'Target Pending'}"></div>
        <!-- Official Benchmark Pace Line Marker -->
        <div style="position: absolute; top: -6px; left: ${posToday}%; width: 2px; height: 28px; background: #38bdf8; border-left: 2px dashed #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.9); z-index: 5;" title="Day ${daysPassed} Benchmark (${pacePct}%)"></div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
        <span>
          🎯 <strong>Day ${daysPassed} Target (${pacePct}%):</strong> 
          <strong style="color: #38bdf8;">${fmt(expCashAtPace)}</strong>
          (${t.target > 0 ? (paceDiffCash >= 0 ? '<span style="color:#10b981; font-weight:700;">+' + fmt(paceDiffCash) + ' Surplus</span>' : '<span style="color:#f43f5e; font-weight:700;">-' + fmt(Math.abs(paceDiffCash)) + ' Deficit</span>') : '<span style="color:#94a3b8;">Awaiting Target</span>'})
        </span>
        <span>Orders: <strong>${t.contracts}</strong> (M2: ${t.upgradeM2}) | Proj: <strong style="color: #38bdf8;">${fmt(t.projected)}</strong> | Need: <strong>${fmt(t.dailyNeeded)}/day</strong></span>
      </div>
    `;
    wrapper.appendChild(row);
  });

  container.appendChild(wrapper);
}

function renderBigTeamSummary(model) {
  const container = document.getElementById('bigTeamAchievementSummaryContainer');
  if (!container) return;

  const s = model.summary;
  const daysPassed = s.daysPassed || 28;
  const daysLeft = s.daysLeft || 2;
  const pacePct = s.targetPacePct || 87;

  // Reconciled Small Teams sorted by Official Achievement % descending
  const sortedTeams = Object.values(model.teams).map(t => {
    const ach = (t.officialAch !== undefined && t.officialAch !== null) ? t.officialAch : t.achievement;
    return { ...t, displayAch: ach };
  }).sort((a, b) => b.displayAch - a.displayAch);

  // Milestone counts
  const metCount = sortedTeams.filter(t => t.displayAch >= 100).length;
  const nearCount = sortedTeams.filter(t => t.displayAch >= 90 && t.displayAch < 100).length;
  const inRecoveryCount = sortedTeams.filter(t => t.displayAch < 90).length;

  // Upgrade metrics calculation for Big Team
  const totalUpgradeBase = s.totalUpgradeBase || 0;
  const totalUpgradeM2 = s.totalUpgradeM2 || 0;
  const totalUpgradeRate = totalUpgradeBase > 0 ? ((totalUpgradeM2 / totalUpgradeBase) * 100) : 0;
  const totalUpgrade20Target = s.totalUpgrade20Target || 0;
  const totalUpgrade20Needed = s.totalUpgrade20Needed || 0;
  const upgradeProgressPct = totalUpgrade20Target > 0 ? ((totalUpgradeM2 / totalUpgrade20Target) * 100).toFixed(1) : '0.0';
  const dailyUpgradeNeeded = daysLeft > 0 ? (totalUpgrade20Needed / daysLeft).toFixed(1) : '0';
  const currentUpgradeVelocity = (totalUpgradeM2 / daysPassed).toFixed(2);
  const upgradeShareOfOrders = s.totalContracts > 0 ? ((totalUpgradeM2 / s.totalContracts) * 100).toFixed(1) : '0.0';

  // Small Teams sorted by Upgrade Conversion Rate % descending
  const teamsByUpgradeRate = [...sortedTeams].sort((a, b) => b.upgradeRate - a.upgradeRate);

  // Macro commentary for Big Team 01 Sector
    let macroStatusBadge = '<span class="pill-badge" style="background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3);"><span class="pulse-dot" style="background: #94a3b8;"></span> ⚪ OCTOBER KICKOFF</span>';
  let macroCommentary = 'Big Team 01 is starting October 2026 with a clean slate. Awaiting official Cash Targets and Upgrade M2 allocations from Senior Management. Current operational focuses: 65% Class Consumption and 45% English Club attendance.';
  if (s.totalTarget > 0) {
    if (s.achievement >= 100) {
      macroStatusBadge = `<span class="pill-badge pill-badge-emerald"><span class="pulse-dot pulse-dot-emerald"></span> 🏆 TARGET SURPASSED</span>`;
      macroCommentary = `Big Team 01 has officially surpassed monthly target with ${fmt(s.totalCash)} achieved (${fmtPct(s.achievement)}).`;
    } else if (s.achievement >= pacePct) {
      macroStatusBadge = `<span class="pill-badge pill-badge-emerald"><span class="pulse-dot pulse-dot-emerald"></span> 🟢 AHEAD OF BENCHMARK</span>`;
      macroCommentary = `Big Team 01 is pacing ahead of schedule at ${fmtPct(s.achievement)} vs Day ${daysPassed} benchmark (${pacePct}%).`;
    } else if (s.achievement >= pacePct - 8) {
      macroStatusBadge = `<span class="pill-badge pill-badge-amber"><span class="pulse-dot pulse-dot-amber"></span> 🟡 WITHIN STRIKING RANGE</span>`;
      macroCommentary = `Big Team 01 stands at ${fmt(s.totalCash)} (${fmtPct(s.achievement)}) against sector target.`;
    } else {
      macroStatusBadge = `<span class="pill-badge pill-badge-rose"><span class="pulse-dot pulse-dot-rose"></span> 🔴 SPRINT FOCUS REQUIRED</span>`;
      macroCommentary = `Big Team 01 requires a revenue sprint. Deficit is ${fmt(s.totalGap)}.`;
    }
  }

  // Detailed strategic feedback generator for each small team (structured modern two-tier memo)
  function getTeamFeedbackText(t) {
    if (t.target === 0) {
      return `
        <div class="strategic-memo-box">
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 5px; flex-wrap: wrap;">
            <span class="pill-badge" style="font-size:0.7rem; padding: 2px 7px; background: rgba(148,163,184,0.15); color: #94a3b8;">⚪ Target Pending</span>
            <span style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.4;">Awaiting official October cash target allocation from Senior Management.</span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
            <span class="pill-badge" style="font-size:0.7rem; padding: 2px 7px; background: rgba(148,163,184,0.15); color: #94a3b8;">⚪ Upgrade Base Pending</span>
            <span style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.4;">Awaiting official October M-2 student allocation from SCRM.</span>
          </div>
        </div>
      `;
    }
    const diffPct = Math.round((t.displayAch - pacePct) * 10) / 10;
    const diffSign = diffPct >= 0 ? '+' : '';
    let revHeader = '';
    let revBody = '';
    if (diffPct >= 0) {
      revHeader = `<span class="pill-badge pill-badge-emerald" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-emerald"></span> 🟢 Ahead of Pace (+${diffPct}%)</span>`;
      revBody = `Team has achieved ${fmt(t.cash)} (${fmtPct(t.displayAch)}), pacing ahead of Day ${daysPassed} benchmark (${pacePct}%). Target: ${fmt(t.target)} (${t.contractsTarget || 0} orders).`;
    } else {
      revHeader = `<span class="pill-badge pill-badge-rose" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-rose"></span> 🔴 Behind Pace (${diffPct}%)</span>`;
      revBody = `Team has achieved ${fmt(t.cash)} (${fmtPct(t.displayAch)}), deficit is ${fmt(t.gap)}. Required run-rate: ${fmt(t.dailyNeeded)}/day to hit ${fmt(t.target)}.`;
    }

    let upgHeader = '<span class="pill-badge" style="font-size:0.7rem; padding: 2px 7px; background: rgba(148,163,184,0.15); color: #94a3b8;">⚪ Upgrade Base Pending</span>';
    let upgBody = 'Awaiting official October M-2 student allocation from SCRM.';
    if (t.upgradeBase > 0) {
      if (t.upgradeRate >= 20) {
        upgHeader = '<span class="pill-badge pill-badge-emerald" style="font-size:0.7rem; padding: 2px 7px;">🟢 20% Goal Met</span>';
        upgBody = `M2 Conversion: ${fmtPct(t.upgradeRate)} (${t.upgradeM2}/${t.upgradeBase}). Milestone achieved!`;
      } else {
        upgHeader = '<span class="pill-badge pill-badge-amber" style="font-size:0.7rem; padding: 2px 7px;">🟡 M2 Upgrade Pace</span>';
        upgBody = `M2 Conversion: ${fmtPct(t.upgradeRate)} (${t.upgradeM2}/${t.upgradeBase}). Needed for 20%: ${t.upgrade20Needed} contracts.`;
      }
    }

    return `
      <div class="strategic-memo-box">
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 5px; flex-wrap: wrap;">
          ${revHeader}
          <span style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.4;">${revBody}</span>
        </div>
        <div style="display: flex; align-items: baseline; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 5px; margin-top: 4px; flex-wrap: wrap;">
          ${upgHeader}
          <span style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.4;">${upgBody}</span>
        </div>
      </div>
    `;
  }

  // Build small team rows
  const rowsHtml = sortedTeams.map((t, idx) => {
    const diffPct = Math.round((t.displayAch - pacePct) * 10) / 10;
    const diffSign = diffPct >= 0 ? '+' : '';
    const paceClr = t.displayAch >= pacePct ? '#10b981' : (t.displayAch >= pacePct - 8 ? '#f59e0b' : '#f43f5e');
    const paceLabel = t.displayAch >= pacePct ? 'Ahead' : (t.displayAch >= pacePct - 8 ? 'Near' : 'Behind');
    const achClr = getStatusColor(t.displayAch);

    return `
      <tr>
        <td style="font-family: var(--font-mono); color: var(--text-dim); text-align: center; font-weight: 700;">#${idx + 1}</td>
        <td style="text-align: left !important;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${t.color}; box-shadow: 0 0 6px ${t.color}80;"></span>
            <strong style="color: #fff; font-size: 0.92rem;">${t.label || t.key}</strong>
          </div>
          <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">👑 Team Leader: <strong>${t.tl}</strong></div>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 800; color: #fff; text-align: center;">${fmt(t.cash)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary); text-align: center;">${t.target > 0 ? fmt(t.target) : 'Target Pending'}</td>
        <td style="text-align: center;">
          <span class="pill-badge" style="background: ${achClr}18; color: ${achClr}; border: 1px solid ${achClr}40; font-family: var(--font-mono); font-size: 0.85rem;">
            <span class="pulse-dot" style="background: ${achClr}; box-shadow: 0 0 6px ${achClr};"></span>
            ${fmtPct(t.displayAch)}
          </span>
        </td>
        <td style="text-align: center;">
          <span style="font-family: var(--font-mono); font-weight: 700; color: ${paceClr}; font-size: 0.78rem;">
            ${diffSign}${diffPct}%
          </span>
          <span class="pill-badge" style="background: ${paceClr}15; color: ${paceClr}; border: 1px solid ${paceClr}30; font-size: 0.68rem; margin-left: 4px; padding: 2px 6px;">
            ${paceLabel}
          </span>
        </td>
        <td style="font-family: var(--font-mono); text-align: center; color: #fff; font-weight: 700;">
          ${t.contracts}
        </td>
        <td style="font-family: var(--font-mono); text-align: center; color: #cbd5e1;">
          ${t.upgradeBase}
        </td>
        <td style="font-family: var(--font-mono); text-align: center; background: rgba(192, 132, 252, 0.04); border-left: 1px solid rgba(192, 132, 252, 0.15);">
          <strong style="color: #c084fc; font-size: 0.95rem;">${t.upgradeM2}</strong>
          <span class="pill-badge pill-badge-purple" style="font-size: 0.68rem; padding: 1px 6px; margin-left: 4px;">${t.upgradeRate.toFixed(1)}%</span>
        </td>
        <td style="font-family: var(--font-mono); text-align: center; background: rgba(192, 132, 252, 0.04); border-right: 1px solid rgba(192, 132, 252, 0.15);">
          <div style="font-size: 0.8rem; color: #fff; font-weight: 700;">${t.upgrade20Target}</div>
          <div style="font-size: 0.72rem; color: ${t.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'}; font-weight: 700;">
            ${t.upgrade20Needed > 0 ? 'Gap: -' + t.upgrade20Needed : '✓ Met'}
          </div>
        </td>
        <td style="font-family: var(--font-mono); text-align: center; font-weight: 800; color: ${t.gap === 0 ? '#10b981' : '#f43f5e'};">
          ${t.gap === 0 ? '✓ MET' : fmt(t.gap)}
        </td>
        <td style="text-align: left !important; min-width: 440px; max-width: 640px;">
          ${getTeamFeedbackText(t)}
        </td>
      </tr>
    `;
  }).join('');

  // Small Teams Upgrade Leaderboard Cards (5 teams sorted by upgrade rate)
  const teamUpgradeCardsHtml = teamsByUpgradeRate.map((t, idx) => {
    const share = totalUpgradeM2 > 0 ? ((t.upgradeM2 / totalUpgradeM2) * 100).toFixed(1) : '0';
    const rateClr = t.upgradeRate >= 8 ? '#10b981' : (t.upgradeRate >= 6 ? '#38bdf8' : (t.upgradeRate >= 5 ? '#f59e0b' : '#f43f5e'));
    const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
    return `
      <div class="metric-tile-modern" style="border-top: 3px solid ${t.color}; padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 1.1rem;">${rankBadge}</span>
            <strong style="color: #fff; font-size: 0.88rem;">${t.label || t.key}</strong>
          </div>
          <span class="pill-badge" style="background: ${t.color}20; color: ${t.color}; border: 1px solid ${t.color}45; font-size: 0.68rem; padding: 2px 7px;">
            👑 ${t.tl}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
          <div style="font-family: var(--font-mono); font-size: 1.45rem; font-weight: 900; color: ${rateClr};">
            ${t.upgradeRate.toFixed(1)}%
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1;">
            <strong style="color: #fff;">${t.upgradeM2}</strong> / ${t.upgradeBase} Base
          </div>
        </div>
        <!-- Progress to 20% target bar -->
        <div style="margin-top: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #94a3b8; margin-bottom: 3px;">
            <span>20% Goal Target: <strong>${t.upgrade20Target}</strong></span>
            <span style="color: ${t.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'}; font-weight: 700;">
              ${t.upgrade20Needed > 0 ? t.upgrade20Needed + ' needed' : '✓ 100% Met'}
            </span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden;">
            <div style="height: 100%; width: ${Math.min(100, (t.upgradeM2 / t.upgrade20Target) * 100)}%; background: linear-gradient(90deg, #c084fc, ${rateClr}); border-radius: 999px;"></div>
          </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.72rem; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px;">
          <span>Sector Share: <strong style="color: #c084fc;">${share}%</strong></span>
          <span>Orders: <strong style="color: #fff;">${t.contracts}</strong></span>
        </div>
      </div>
    `;
  }).join('');

  // Sector variance calculations
  const sectorDiffPct = Math.round((s.achievement - pacePct) * 10) / 10;
  const sectorDiffSign = sectorDiffPct >= 0 ? '+' : '';
  const sectorPaceClr = s.achievement >= pacePct ? '#10b981' : (s.achievement >= pacePct - 8 ? '#f59e0b' : '#f43f5e');
  const sectorPaceLabel = s.achievement >= pacePct ? 'Ahead' : (s.achievement >= pacePct - 8 ? 'Near' : 'Behind');

  container.innerHTML = `
    <div class="glass-panel-executive" style="padding: 26px 28px; margin-bottom: 28px;">
      
      <!-- Section Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 22px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px;">
        <div>
          <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #818cf8; background: rgba(99, 102, 241, 0.12); padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(99, 102, 241, 0.25); margin-bottom: 8px;">
            👑 Sector Executive Synthesis &amp; Directives
          </span>
          <h3 style="font-size: 1.32rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.02em;">
            Big Team 01 Leadership Synthesis &amp; Tactical Intelligence
          </h3>
          <p style="font-size: 0.82rem; color: #94a3b8; margin-top: 4px; line-height: 1.5;">
            Reconciled small team financial delivery, early upgrade velocity, and leadership directives (Exclusively Team &amp; Sector Totals).
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          ${macroStatusBadge}
          <span style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 5px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; font-family: var(--font-mono);">
            📅 Day ${daysPassed} of 30 (${daysLeft}d remaining)
          </span>
        </div>
      </div>

      <!-- Macro Executive Summary Cards (Net Cash & Small Team Distribution) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 22px;">
        
        <div class="metric-tile-modern" style="border-top: 3px solid #6366f1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 0.06em;">💰 Sector Net Cash</span>
            <span class="pill-badge pill-badge-cyan" style="font-size: 0.68rem;">D${daysPassed} Pace: ${pacePct}%</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 1.85rem; font-weight: 900; color: #fff; margin-top: 6px; letter-spacing: -0.02em;">
            ${fmt(s.totalCash)} <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">/ ${fmt(s.totalTarget)}</span>
          </div>
          <div style="margin-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.76rem; font-weight: 700; margin-bottom: 4px;">
              <span style="color: ${getStatusColor(s.achievement)};">${fmtPct(s.achievement)} Achieved</span>
              <span style="color: #f43f5e;">Gap: ${fmt(s.totalGap)}</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min(100, s.achievement)}%; background: linear-gradient(90deg, #6366f1, #38bdf8); border-radius: 999px;"></div>
            </div>
          </div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 8px;">
            Required run-rate: <strong style="color: #38bdf8; font-family: var(--font-mono);">${fmt(s.dailyNeeded)}/day</strong> (${daysLeft}d sprint)
          </div>
        </div>

        <div class="metric-tile-modern" style="border-top: 3px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.06em;">🏆 Teams Distribution</span>
            <span class="pill-badge pill-badge-emerald" style="font-size: 0.68rem;">5 Small Teams</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 1.85rem; font-weight: 900; color: #fff; margin-top: 6px; letter-spacing: -0.02em;">
            ${metCount} <span style="font-size: 1.05rem; color: #10b981; font-weight: 800;">Met ≥100%</span>
            <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">/ 5 Teams</span>
          </div>
          <div style="margin-top: 8px;">
            <div style="display: flex; gap: 4px; height: 6px; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,0.06);">
              <div style="flex: 2; background: #10b981; border-radius: 999px;" title="2 Teams Met ≥100%"></div>
              <div style="flex: 1; background: #38bdf8; border-radius: 999px;" title="1 Team Near ≥90%"></div>
              <div style="flex: 2; background: #f59e0b; border-radius: 999px;" title="2 Teams Sprinting"></div>
            </div>
          </div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 8px;">
            October 2026 Kickoff | All 5 Teams Active
          </div>
        </div>

        <div class="metric-tile-modern" style="border-top: 3px solid #38bdf8;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em;">📦 Order Velocity &amp; ASP</span>
            <span class="pill-badge pill-badge-purple" style="font-size: 0.68rem;">MTD Contracts</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 1.85rem; font-weight: 900; color: #fff; margin-top: 6px; letter-spacing: -0.02em;">
            ${s.totalContracts} <span style="font-size: 1rem; color: #64748b; font-weight: 500;">Orders</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 0.76rem;">
            <span style="color: #cbd5e1;"><strong style="color: #c084fc;">${totalUpgradeM2}</strong> Early Upgrades</span>
            <span style="color: #94a3b8;">${s.totalNormalRenewals} Normal Renewals</span>
          </div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 8px;">
            Avg order value: <strong style="color: #fff; font-family: var(--font-mono);">${fmt(s.totalContracts > 0 ? s.totalCash / s.totalContracts : 0)}</strong> | Upgrade share: <strong style="color: #c084fc;">${upgradeShareOfOrders}%</strong>
          </div>
        </div>

      </div>

      <!-- DEDICATED BIG TEAM UPGRADE PART: Macro Intelligence & 20% Milestone Benchmark -->
      <div style="background: linear-gradient(135deg, rgba(88, 28, 135, 0.12), rgba(15, 23, 42, 0.7)); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-lg); padding: 22px; margin-bottom: 22px; position: relative; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4);">
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c084fc, #a855f7, #38bdf8);"></div>
        
        <!-- Upgrade Subtitle & Badge -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid rgba(192, 132, 252, 0.12); padding-bottom: 12px;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #c084fc; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px;">
              🚀 Sector Macro Intelligence
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 900; color: #fff; margin: 0;">
              Big Team 01 Early Upgrade (M2) Macro Velocity &amp; 20% Target Milestone
            </h4>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="pill-badge pill-badge-purple" style="font-size: 0.76rem; padding: 4px 12px;">
              <span class="pulse-dot" style="background:#c084fc; box-shadow:0 0 8px #c084fc;"></span>
              20% Milestone Target: ${totalUpgrade20Target} Upgrades (${totalUpgradeBase} Pool)
            </span>
          </div>
        </div>

        <!-- 4 Upgrade Macro KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; margin-bottom: 18px;">
          
          <div class="metric-tile-modern" style="border-top: 2px solid #c084fc; padding: 14px 16px;">
            <div style="font-size: 0.7rem; color: #c084fc; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Sector Upgrade Conversion</div>
            <div style="font-family: var(--font-mono); font-size: 1.55rem; font-weight: 900; color: #fff; margin-top: 4px;">
              ${totalUpgradeRate.toFixed(2)}%
            </div>
            <div style="font-size: 0.74rem; color: #e9d5ff; margin-top: 2px;">
              <strong>${totalUpgradeM2}</strong> achieved from <strong>${totalUpgradeBase}</strong> pool
            </div>
          </div>

          <div class="metric-tile-modern" style="border-top: 2px solid #f43f5e; padding: 14px 16px;">
            <div style="font-size: 0.7rem; color: #f43f5e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">20% Milestone Deficit</div>
            <div style="font-family: var(--font-mono); font-size: 1.55rem; font-weight: 900; color: #f43f5e; margin-top: 4px;">
              -${totalUpgrade20Needed} <span style="font-size: 0.85rem; color: #fda4af;">Contracts</span>
            </div>
            <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">
              Milestone Progress: <strong style="color: #38bdf8;">${upgradeProgressPct}%</strong> (${totalUpgradeM2}/${totalUpgrade20Target})
            </div>
          </div>

          <div class="metric-tile-modern" style="border-top: 2px solid #38bdf8; padding: 14px 16px;">
            <div style="font-size: 0.7rem; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Daily Velocity Required</div>
            <div style="font-family: var(--font-mono); font-size: 1.55rem; font-weight: 900; color: #38bdf8; margin-top: 4px;">
              ${dailyUpgradeNeeded} <span style="font-size: 0.85rem; color: #7dd3fc;">/ Day</span>
            </div>
            <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">
              MTD velocity: <strong style="color: #fff;">${currentUpgradeVelocity}/day</strong> across 5 teams
            </div>
          </div>

          <div class="metric-tile-modern" style="border-top: 2px solid #10b981; padding: 14px 16px;">
            <div style="font-size: 0.7rem; color: #34d399; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Contract Share &amp; ASP Impact</div>
            <div style="font-family: var(--font-mono); font-size: 1.55rem; font-weight: 900; color: #10b981; margin-top: 4px;">
              ${upgradeShareOfOrders}%
            </div>
            <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 2px;">
              0 of 0 total orders | October 2026 Kickoff
            </div>
          </div>

        </div>

        <!-- Small Teams Upgrade Leaderboard Cards Grid (Strictly Teams, No Individuals) -->
        <div style="margin-top: 14px;">
          <div style="font-size: 0.75rem; color: #e9d5ff; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>🏅</span> Small Teams Upgrade Conversion Leaderboard
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            ${teamUpgradeCardsHtml}
          </div>
        </div>

      </div>

      <!-- Sector Executive Leadership Feedback Note -->
      <div style="background: rgba(99, 102, 241, 0.07); border-left: 4px solid var(--accent-indigo); padding: 16px 20px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 22px;">
        <div style="font-size: 0.76rem; font-weight: 800; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">
          Executive Sector Feedback &amp; Strategic Direction (Senior Manager: Saber Hussien)
        </div>
        <p style="font-size: 0.85rem; color: #e2e8f0; line-height: 1.55; margin: 0;">
          ${macroCommentary} <strong>Strategic Direction:</strong> Big Team 01 official October cash target is confirmed at <strong>${fmt(s.totalTarget)}</strong> (${s.totalContractsTarget || 252} orders) across 21 sales specialists. Sponsoring proactive renewal outreach on warm leads and closing M2 early upgrades will directly position the team for peak commission tiers from Day 1.
        </p>
      </div>

      <!-- Small Teams Achievement & Detailed Strategic Feedback Table -->
      <div class="modern-table-card" style="margin-top: 12px; overflow-x: auto;">
        <table class="data-table" id="bigTeamSummaryTable" style="width: 100%; min-width: 1580px; table-layout: auto !important;">
          <thead>
            <tr>
              <th style="min-width: 44px; text-align: center;">#</th>
              <th style="min-width: 180px; text-align: left !important;">Small Team &amp; Team Leader</th>
              <th style="min-width: 120px; text-align: center;">Net Cash MTD</th>
              <th style="min-width: 110px; text-align: center;">Target</th>
              <th style="min-width: 115px; text-align: center; color: #10b981; font-weight: 800;">Ach %</th>
              <th style="min-width: 140px; text-align: center;">Benchmark Variance (D${daysPassed}: ${pacePct}%)</th>
              <th style="min-width: 90px; text-align: center;">Orders</th>
              <th style="min-width: 90px; text-align: center;">Upgrade Base</th>
              <th style="min-width: 125px; text-align: center; color: #c084fc; font-weight: 800; background: rgba(192, 132, 252, 0.08);">M2 Upgrades (Conv %)</th>
              <th style="min-width: 120px; text-align: center; color: #e9d5ff; background: rgba(192, 132, 252, 0.08);">20% Goal (Gap)</th>
              <th style="min-width: 110px; text-align: center; color: #f43f5e; font-weight: 800;">Target Gap</th>
              <th style="min-width: 460px; text-align: left !important; color: #38bdf8; font-weight: 800;">Detailed Strategic Feedback &amp; Operational Directives</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr style="background: rgba(99, 102, 241, 0.14); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
              <td colspan="2" style="color: #fff; text-align: left; font-size: 0.92rem; padding: 14px 16px;">
                ⭐ BIG TEAM 01 — SECTOR TOTAL (Saber Hussien)
              </td>
              <td style="font-family: var(--font-mono); font-size: 1.05rem; color: #fff; text-align: center;">${fmt(s.totalCash)}</td>
              <td style="font-family: var(--font-mono); color: var(--text-secondary); text-align: center;">${fmt(s.totalTarget)}</td>
              <td style="font-family: var(--font-mono); font-size: 1.05rem; color: ${getStatusColor(s.achievement)}; text-align: center;">
                <span class="pill-badge pill-badge-emerald">${fmtPct(s.achievement)}</span>
              </td>
              <td style="text-align: center; font-family: var(--font-mono); color: ${sectorPaceClr}; font-weight: 800;">
                ${sectorDiffSign}${sectorDiffPct}% (${sectorPaceLabel})
              </td>
              <td style="font-family: var(--font-mono); color: #fff; text-align: center; font-weight: 800;">
                ${s.totalContracts}
              </td>
              <td style="font-family: var(--font-mono); color: #cbd5e1; text-align: center;">
                ${totalUpgradeBase}
              </td>
              <td style="font-family: var(--font-mono); color: #c084fc; text-align: center; font-size: 1rem; background: rgba(192, 132, 252, 0.08);">
                <strong>${totalUpgradeM2}</strong> <span style="font-size: 0.78rem; color: #e9d5ff;">(${totalUpgradeRate.toFixed(1)}%)</span>
              </td>
              <td style="font-family: var(--font-mono); text-align: center; font-size: 0.85rem; background: rgba(192, 132, 252, 0.08);">
                <span style="color: #fff;">${totalUpgrade20Target}</span> <span style="color: #f43f5e; font-size: 0.78rem;">(-${totalUpgrade20Needed})</span>
              </td>
              <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center; font-weight: 800;">
                ${fmt(s.totalGap)}
              </td>
              <td style="text-align: left !important; font-size: 0.82rem; line-height: 1.45; color: #e2e8f0; padding: 14px 16px;">
                <strong>Sector Synthesis:</strong> Official October cash target is ${fmt(s.totalTarget)} (${s.totalContractsTarget || 252} orders). Current MTD net revenue stands at ${fmt(s.totalCash)} (${fmtPct(s.achievement)}) against Day ${daysPassed} pacing benchmark (${pacePct}%). Target gap is ${fmt(s.totalGap)} requiring a run-rate of ${fmt(s.dailyNeeded)}/day over the remaining ${daysLeft} days.
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  `;
}

function renderOverviewTable(model) {
  const tbody = document.getElementById('overviewTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sorted = [...model.individuals].sort((a, b) => b.achievement - a.achievement || b.cash - a.cash);
  const pacePct = model.summary.targetPacePct || 11;

  sorted.forEach((r, idx) => {
    const expRepCash = Math.round(r.target * (pacePct / 100));
    const deltaPace = Math.round((r.achievement - pacePct) * 10) / 10;
    const isAhead = r.achievement >= pacePct;
    const isNear = r.achievement >= (pacePct - 10);
    const paceStatusClr = isAhead ? '#10b981' : (isNear ? '#f59e0b' : '#f43f5e');
    const paceTag = isAhead ? 'Ahead' : (isNear ? 'Near' : 'Behind');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 700;">#${idx + 1}</td>
      <td>
        <strong style="color: #fff;">${r.isTL ? '👑 ' : ''}${r.name}</strong>
      </td>
      <td>${renderTeamBadge(r.team)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${fmt(r.cash)}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(r.target)}</td>
      <td>
        <span style="font-family: var(--font-mono); font-weight: 700; color: ${r.statusColor};">
          ${fmtPct(r.achievement)}
        </span>
      </td>
      <td style="text-align: center;">
        <span style="background: ${paceStatusClr}18; color: ${paceStatusClr}; border: 1px solid ${paceStatusClr}35; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.75rem;">
          ${deltaPace >= 0 ? '+' : ''}${deltaPace}% (${paceTag})
        </span>
        <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px; font-family: var(--font-mono);">Exp: ${fmt(expRepCash)}</div>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.upgradeM2 > 0 ? '#10b981' : 'var(--text-muted)'};">${r.upgradeM2}</td>
      <td style="font-family: var(--font-mono);">${r.upgradeBase}</td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(192, 132, 252, 0.05); border-left: 1px solid rgba(192, 132, 252, 0.2); border-right: 1px solid rgba(192, 132, 252, 0.2); min-width: 140px;">
        <strong style="color: #c084fc; font-size: 0.95rem;">${r.upgrade20Target}</strong>
        <div style="margin-top: 2px;">
          <span style="font-size: 0.72rem; font-weight: 800; padding: 1px 6px; border-radius: 4px; background: ${r.upgrade20Needed > 0 ? 'rgba(244, 63, 94, 0.18)' : 'rgba(16, 185, 129, 0.18)'}; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'}; border: 1px solid ${r.upgrade20Needed > 0 ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'};">
            ${r.upgrade20Needed > 0 ? r.upgrade20Needed + ' needed' : 'Achieved'}
          </span>
        </div>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #a78bfa;">${fmtPct(r.upgradeRate)}</td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(16, 185, 129, 0.04); border-left: 1px solid rgba(16, 185, 129, 0.25); min-width: 110px;">
        <div style="font-size: 0.98rem; font-weight: 800; color: #10b981;">${fmt(r.commission.totalPayout)}</div>
        <div style="font-size: 0.68rem; color: #a5b4fc; font-weight: 600; margin-top: 1px;">
          ${r.commission.baseRatePct}${r.commission.hasTeamBonus ? ' +0.5% &#128293;' : ''}
        </div>
      </td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(56, 189, 248, 0.03); min-width: 110px;">
        ${r.commission.nextTier ? `
          <div style="font-size: 0.92rem; font-weight: 800; color: #38bdf8;">${fmt(r.commission.expectedNextEarning)}</div>
          <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 1px;">${r.commission.nextRatePct}</div>
        ` : `
          <div style="font-size: 0.85rem; font-weight: 800; color: #facc15;">&#127942; Top</div>
        `}
      </td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(250, 204, 21, 0.03); border-right: 1px solid rgba(250, 204, 21, 0.25); min-width: 100px;">
        ${r.commission.nextTier ? `
          <div style="font-size: 0.92rem; font-weight: 800; color: ${r.commission.remainingToNext <= 1500 ? '#facc15' : '#fff'};">
            ${fmt(r.commission.remainingToNext)}
          </div>
        ` : `
          <div style="font-size: 0.78rem; color: #10b981; font-weight: 700;">Reached</div>
        `}
      </td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: #facc15; text-align: center;" title="51Talk POOL22 Touchpoint Frequency: ${(r.coverRate / 100).toFixed(1)} calls/student (100% Unique Coverage in POOL_Detail23)">${fmtPct(r.coverRate)} <span style="font-size: 0.72rem; color: #fde047; font-weight: 600;">(${(r.coverRate / 100).toFixed(1)}x)</span></td>
      <td style="font-family: var(--font-mono); color: ${r.upgradeM2 > 0 ? '#10b981' : 'var(--text-muted)'}; font-weight: ${r.upgradeM2 > 0 ? '700' : '400'};">
        ${r.upgradeM2}
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #c084fc;">
        ${r.upgrade20Target} <span style="font-size: 0.75rem; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">(${r.upgrade20Needed} needed)</span>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 600;">${r.contracts}</td>
      <td>
        <span class="status-badge" style="background: ${r.statusColor}20; color: ${r.statusColor}; border: 1px solid ${r.statusColor}40;">
          ${r.status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const tfoot = document.getElementById('overviewTableFoot');
  if (tfoot) {
    const s = model.summary;
    const avgCover = model.individuals.length > 0 ? (model.individuals.reduce((sum, r) => sum + r.coverRate, 0) / model.individuals.length) : 0;
    const sectorExpCash = Math.round(s.totalTarget * (pacePct / 100));
    const sectorDeltaPace = Math.round((s.achievement - pacePct) * 10) / 10;
    tfoot.innerHTML = `
      <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
        <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">TOTAL / SECTOR AVERAGE</td>
        <td style="font-family: var(--font-mono); color: #fff; font-size: 0.95rem;">${fmt(s.totalCash)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(s.totalTarget)}</td>
        <td style="font-family: var(--font-mono); color: ${getStatusColor(s.achievement)}; font-size: 0.95rem;">${fmtPct(s.achievement)}</td>
        <td style="text-align: center;">
          <span style="background: #f59e0b20; color: #f59e0b; border: 1px solid #f59e0b40; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.78rem;">
            ${sectorDeltaPace}% (Near)
          </span>
          <div style="font-size: 0.68rem; color: #38bdf8; margin-top: 2px; font-family: var(--font-mono);">Exp: ${fmt(sectorExpCash)}</div>
        </td>
        <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(s.upgradeRate)}</td>
        <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(avgCover)}</td>
        <td style="font-family: var(--font-mono); color: #10b981; font-size: 0.95rem;">${s.totalUpgradeM2}</td>
        <td style="font-family: var(--font-mono); color: #c084fc;">${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)</td>
        <td style="font-family: var(--font-mono); color: #fff;">${s.totalContracts}</td>
        <td><span class="status-badge" style="background: #6366f120; color: #818cf8;">Sector Total</span></td>
      </tr>
    `;
  }
}

function renderSmallTeamsTab(model) {
  const container = document.getElementById('smallTeamCards');
  if (!container) return;
  container.innerHTML = '';

  Object.values(model.teams)
    .sort((a, b) => b.achievement - a.achievement)
    .forEach((t, tIdx) => {
      const card = document.createElement('div');
      card.className = 'calc-card';
      card.style.borderTop = `4px solid ${t.color}`;
      card.style.animationDelay = `${tIdx * 0.1}s`;

      // Calculate team's SOP compliance average
      const sopKey = 'ME-' + t.key;
      const sopVals = Object.values(SOP_DATA[sopKey] || {});
      const teamSopAvg = sopVals.length > 0 ? (Math.round((sopVals.reduce((a, b) => a + b, 0) / sopVals.length) * 10) / 10) : 0;

      const memberRows = t.members
        .sort((a, b) => b.achievement - a.achievement || b.cash - a.cash)
        .map(m => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.85rem;">
          <div>
            <span style="color: #fff;">${m.isTL ? '👑 ' : ''}${m.name}</span>
            <span style="font-size: 0.75rem; color: #a78bfa; margin-left: 6px;">(M2 Conv: ${fmtPct(m.upgradeRate)} | Upgrades: <strong style="color: #10b981;">${m.upgradeM2}</strong>)</span>
          </div>
          <div style="font-family: var(--font-mono); text-align: right;">
            <span style="color: #fff; font-weight: 600;">${fmt(m.cash)}</span>
            ${m.refund > 0 ? `<span style="color: #f43f5e; font-size: 0.75rem; margin-left: 4px; font-weight: 700;" title="Individual Refund: -${fmt(m.refund)}">(Ref: -${fmt(m.refund)})</span>` : ''}
            <span style="color: ${m.statusColor}; font-size: 0.75rem; margin-left: 4px;">(${fmtPct(m.achievement)})</span>
          </div>
        </div>
      `).join('');

      card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">${t.label}</h3>
        <span class="status-badge" style="background: ${t.color}20; color: ${t.color};">${t.key}</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-sm);">
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Net Cash Achieved</div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #fff; font-family: var(--font-mono);">${fmt(t.cash)}</div>
          <div style="font-size: 0.7rem; color: #94a3b8; font-family: var(--font-mono); margin-top: 3px;">
            Gross: <span style="color: #38bdf8; font-weight: 700;">${fmt(t.gross)}</span>${t.refund > 0 ? ` | Rep Ref: <span style="color: #f43f5e; font-weight: 700;">-${fmt(t.refund)}</span>` : ''}
          </div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Target</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-secondary); font-family: var(--font-mono);">${t.target > 0 ? fmt(t.target) : 'Target Pending'}</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Achievement %</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: ${getStatusColor(t.achievement)}; font-family: var(--font-mono);">${fmtPct(t.achievement)}</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Upgrade M2 Total</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #10b981; font-family: var(--font-mono);">${t.upgradeM2} M2 Upgrades</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">M2 Conv %</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: #a78bfa; font-family: var(--font-mono);">${fmtPct(t.upgradeRate)}</div>
        </div>
        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">20% Goal (Needed)</div>
          <div style="font-size: 1.05rem; font-weight: 700; color: #c084fc; font-family: var(--font-mono);">${t.upgrade20Target} <span style="font-size: 0.75rem; color: ${t.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">(${t.upgrade20Needed} needed)</span></div>
        </div>
        <div style="grid-column: span 3; display: flex; justify-content: space-between; align-items: center; background: rgba(99, 102, 241, 0.08); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(99, 102, 241, 0.2); margin-top: 2px;">
          <span style="font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            SOP Compliance Rate:
          </span>
          <strong style="color: ${teamSopAvg >= 80 ? '#10b981' : '#f59e0b'}; font-family: var(--font-mono); font-size: 0.95rem;">${teamSopAvg}%</strong>
        </div>
        <div style="grid-column: span 3; margin-top: 6px;">
          ${((t.officialAch !== undefined ? t.officialAch : t.achievement) >= 100) ? `
            <div style="background: linear-gradient(90deg, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.15)); border: 1.5px solid #10b981; border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);">
              <span style="font-size: 0.82rem; font-weight: 800; color: #34d399; display: flex; align-items: center; gap: 6px;">
                &#128293; TEAM TARGET MET (${fmtPct(t.officialAch !== undefined ? t.officialAch : t.achievement)})  -  +0.5% BONUS UNLOCKED!
              </span>
              <span style="font-size: 0.72rem; color: #a7f3d0; font-weight: 700; background: rgba(16, 185, 129, 0.25); padding: 2px 8px; border-radius: 4px;">Reps with &ge;100% Ach earn +0.5% Booster</span>
            </div>
          ` : `
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.14); border-radius: var(--radius-sm); padding: 6px 12px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.74rem; color: var(--text-muted);">
                &#127919; Reach 100% to unlock <strong style="color: #6ee7b7;">+0.5% Team Booster</strong> for &ge;100% qualifiers (Gap: <strong style="color: #f59e0b;">${fmt(Math.max(0, t.target - t.cash))}</strong>)
              </span>
              <span style="font-size: 0.72rem; color: #f59e0b; font-weight: 800; font-family: var(--font-mono);">${fmtPct(t.officialAch !== undefined ? t.officialAch : t.achievement)}</span>
            </div>
          `}
        </div>
      </div>
      <div style="margin-top: 10px;">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">Team Member Roster (Sorted by Cash Ach %)</div>
        ${memberRows}
        ${t.refund > 0 ? `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: rgba(244, 63, 94, 0.08); border: 1px dashed rgba(244, 63, 94, 0.3); border-radius: var(--radius-sm); margin-top: 8px; font-size: 0.8rem;">
          <span style="color: #fda4af;">🔻 Active Reps Individual Refunds:</span>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #f43f5e;">-${fmt(t.refund)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; margin-top: 6px; font-size: 0.85rem; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); border-radius: var(--radius-sm);">
          <span style="color: #93c5fd;">= Team Net Cash (Active Members):</span>
          <span style="font-family: var(--font-mono); color: #60a5fa; font-size: 0.95rem;">${fmt(t.cash)} (${fmtPct(t.achievement)})</span>
        </div>
      </div>
    `;
      container.appendChild(card);
    });
}

function renderIndividualsTab(model) {
  const container = document.getElementById('individualCards');
  const tableBody = document.getElementById('individualFullTableBody');
  if (!container || !tableBody) return;

  const teamFilterEl = document.getElementById('teamFilter');
  const sortFilterEl = document.getElementById('sortFilter');
  const teamFilter = teamFilterEl ? teamFilterEl.value : 'all';
  const sortFilter = sortFilterEl ? sortFilterEl.value : 'ach-desc';

  // 1. Compute official immutable Cash Achievement Ranks
  // Sector-wide Cash Rank (1 to 23)
  const sectorRanked = [...model.individuals].sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);
  const sectorRankMap = new Map();
  sectorRanked.forEach((r, idx) => sectorRankMap.set(r.name, idx + 1));

  // Team-level Cash Rank (1 to N within each team)
  const teamRankMap = new Map();
  Object.values(model.teams).forEach(t => {
    const tRanked = [...t.members].sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);
    tRanked.forEach((r, idx) => teamRankMap.set(r.name, idx + 1));
  });

  // 2. Filter reps
  let filtered = [...model.individuals];
  if (teamFilter !== 'all') {
    filtered = filtered.filter(r => r.team === teamFilter);
  }

  // Update Section Header Count Tag
  const countTag = document.getElementById('individualRepsCountTag');
  if (countTag) {
    if (teamFilter === 'all') {
      countTag.textContent = `${model.individuals.length} Active Sales Specialists`;
    } else {
      const tObj = model.teams[teamFilter];
      countTag.textContent = `${filtered.length} Reps (${tObj?.label || teamFilter})`;
    }
  }

  // 3. Sort reps (Always defaults to Cash Achievement %)
  if (sortFilter === 'comm-desc') filtered.sort((a, b) => b.commission.totalPayout - a.commission.totalPayout || b.cash - a.cash);
  else if (sortFilter === 'upg-rate-desc') filtered.sort((a, b) => b.upgradeRate - a.upgradeRate || b.achievement - a.achievement);
  else if (sortFilter === 'cover-rate-desc') filtered.sort((a, b) => b.coverRate - a.coverRate || b.achievement - a.achievement);
  else if (sortFilter === 'ach-desc') filtered.sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);
  else if (sortFilter === 'cash-desc') filtered.sort((a, b) => b.cash - a.cash || b.achievement - a.achievement);
  else if (sortFilter === 'gap-desc') filtered.sort((a, b) => b.gap - a.gap || b.achievement - a.achievement);
  else if (sortFilter === 'upgrade-desc') filtered.sort((a, b) => b.upgradeM2 - a.upgradeM2 || b.achievement - a.achievement);
  else if (sortFilter === 'contracts-desc') filtered.sort((a, b) => b.contracts - a.contracts || b.achievement - a.achievement);
  else filtered.sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);

  // 4. Render Table and Cards
  container.innerHTML = '';
  tableBody.innerHTML = '';
  const pacePct = model.summary.targetPacePct || 11;
  filtered.forEach((r, idx) => {
    const deltaPace = Math.round((r.achievement - pacePct) * 10) / 10;
    const isAhead = r.achievement >= pacePct;
    const isNear = r.achievement >= (pacePct - 10);
    const paceStatusClr = isAhead ? '#10b981' : (isNear ? '#f59e0b' : '#f43f5e');
    const repRank = teamFilter === 'all' ? sectorRankMap.get(r.name) : teamRankMap.get(r.name);
    const cleanRepName = r.name.replace(/^(ME-|EGSS\d+-|EOSS\d+-|EGLP\d+-)/i, '');

    // Card View Card
    const card = document.createElement('div');
    card.className = 'metric-tile-modern';
    card.style.borderTop = `3px solid ${r.teamColor}`;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.72rem; font-weight: 800; color: ${r.teamColor}; text-transform: uppercase;">#${repRank} ${r.team}</span>
        <span class="status-badge" style="background: ${r.statusColor}20; color: ${r.statusColor}; font-size: 0.70rem; padding: 2px 6px;">${r.status}</span>
      </div>
      <div style="font-size: 1.05rem; font-weight: 800; color: #fff; margin-top: 4px;">${r.isTL ? '👑 ' : ''}${cleanRepName}</div>
      <div style="display: flex; justify-content: space-between; margin-top: 8px; font-family: var(--font-mono); font-size: 0.82rem;">
        <span style="color: #fff; font-weight: 700;">${fmt(r.cash)}</span>
        <span style="color: var(--text-secondary);">${fmt(r.target)}</span>
        <span style="color: ${r.statusColor}; font-weight: 800;">${fmtPct(r.achievement)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.72rem; color: #94a3b8;">
        <span>M2 Upgrades: <strong style="color: #10b981;">${r.upgradeM2}</strong>/${r.upgradeBase}</span>
        <span>Orders: <strong style="color: #fff;">${r.contracts}</strong></span>
      </div>
    `;
    container.appendChild(card);

    // Table View Row
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 800; font-size: 0.76rem;">#${idx + 1}</td>
      <td style="text-align: left !important; font-weight: 700; white-space: nowrap;"><strong title="${r.name}">${r.isTL ? '👑 ' : ''}${cleanRepName}</strong></td>
      <td style="white-space: nowrap;">${renderTeamBadge(r.team)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #fff; font-size: 0.84rem;">${fmt(r.cash)}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary); font-size: 0.74rem;">${fmt(r.target)}</td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: ${r.statusColor}; font-size: 0.84rem;">${fmtPct(r.achievement)}</td>
      <td style="text-align: center; white-space: nowrap;">
        <span style="background: ${paceStatusClr}18; color: ${paceStatusClr}; border: 1px solid ${paceStatusClr}35; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.74rem;">
          ${deltaPace >= 0 ? '+' : ''}${deltaPace}%
        </span>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: ${r.upgradeM2 > 0 ? '#10b981' : 'var(--text-muted)'}; font-size: 0.85rem;">${r.upgradeM2}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary); font-size: 0.80rem;">${r.upgradeBase}</td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(192, 132, 252, 0.05); border-left: 1px solid rgba(192, 132, 252, 0.2); border-right: 1px solid rgba(192, 132, 252, 0.2); white-space: nowrap;">
        <strong style="color: #c084fc; font-size: 0.88rem;">${r.upgrade20Target}</strong>
        <div style="margin-top: 2px;">
          <span style="font-size: 0.68rem; font-weight: 800; padding: 2px 5px; border-radius: 3px; background: ${r.upgrade20Needed > 0 ? 'rgba(244, 63, 94, 0.18)' : 'rgba(16, 185, 129, 0.18)'}; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">
            ${r.upgrade20Needed > 0 ? r.upgrade20Needed + ' n' : '✓'}
          </span>
        </div>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #a78bfa; font-size: 0.78rem;">${fmtPct(r.upgradeRate)}</td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(16, 185, 129, 0.04); border-left: 1px solid rgba(16, 185, 129, 0.25); white-space: nowrap;">
        <div style="font-size: 0.86rem; font-weight: 800; color: #10b981;">${fmt(r.commission.totalPayout)}</div>
        <div style="font-size: 0.66rem; color: #a5b4fc; font-weight: 600;">
          ${r.commission.baseRatePct}${r.commission.hasTeamBonus ? ' +0.5% &#128293;' : ''}
        </div>
      </td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(56, 189, 248, 0.03); white-space: nowrap;">
        ${r.commission.nextTier ? `
          <div style="font-size: 0.84rem; font-weight: 800; color: #38bdf8;">${fmt(r.commission.expectedNextEarning)}</div>
          <div style="font-size: 0.66rem; color: #94a3b8;">${r.commission.nextRatePct}</div>
        ` : `
          <div style="font-size: 0.82rem; font-weight: 800; color: #facc15;">🏆 Top</div>
        `}
      </td>
      <td style="font-family: var(--font-mono); text-align: center; vertical-align: middle; background: rgba(250, 204, 21, 0.03); border-right: 1px solid rgba(250, 204, 21, 0.25); white-space: nowrap;">
        ${r.commission.nextTier ? `
          <div style="font-size: 0.84rem; font-weight: 800; color: ${r.commission.remainingToNext <= 1500 ? '#facc15' : '#fff'};">
            ${fmt(r.commission.remainingToNext)}
          </div>
        ` : `
          <div style="font-size: 0.78rem; color: #10b981; font-weight: 700;">✓</div>
        `}
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #facc15; font-size: 0.76rem;" title="Touch Frequency">${(r.coverRate / 100).toFixed(1)}x</td>
      <td style="font-family: var(--font-mono); font-weight: 700; font-size: 0.78rem;">${r.contracts}</td>
      <td style="white-space: nowrap;"><span class="status-badge" style="background: ${r.statusColor}20; color: ${r.statusColor}; font-size: 0.70rem; padding: 3px 6px;">${r.status}</span></td>
    `;
    tableBody.appendChild(tr);
  });

  // 6. Dynamic Context-Aware Footer Row (Selected Team vs Sector)
  const tfoot = document.getElementById('individualFullTableFoot');
  if (tfoot) {
    const pacePct = model.summary.targetPacePct || 11;

    if (teamFilter === 'all') {
      const s = model.summary;
      const avgCover = model.individuals.length > 0 ? (model.individuals.reduce((sum, r) => sum + r.coverRate, 0) / model.individuals.length) : 0;
      const sectorExpCash = Math.round(s.totalTarget * (pacePct / 100));
      const sectorDeltaPace = Math.round((s.achievement - pacePct) * 10) / 10;
      const paceStatusClr = s.achievement >= pacePct ? '#10b981' : (s.achievement >= (pacePct - 8) ? '#f59e0b' : '#f43f5e');

      tfoot.innerHTML = `
        <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
          <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">TOTAL / SECTOR AVERAGE</td>
          <td style="font-family: var(--font-mono); color: #fff; font-size: 0.95rem;">${fmt(s.totalCash)}</td>
          <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(s.totalTarget)}</td>
          <td style="font-family: var(--font-mono); color: ${getStatusColor(s.achievement)}; font-size: 0.95rem;">${fmtPct(s.achievement)}</td>
          <td style="text-align: center;">
            <span style="background: ${paceStatusClr}20; color: ${paceStatusClr}; border: 1px solid ${paceStatusClr}40; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.78rem;">
              ${sectorDeltaPace >= 0 ? '+' : ''}${sectorDeltaPace}%
            </span>
            <div style="font-size: 0.68rem; color: #38bdf8; margin-top: 2px; font-family: var(--font-mono);">Exp: ${fmt(sectorExpCash)}</div>
          </td>
          <td style="font-family: var(--font-mono); color: #10b981; font-size: 0.95rem;">${s.totalUpgradeM2}</td>
          <td style="font-family: var(--font-mono);">${s.totalUpgradeBase}</td>
          <td style="font-family: var(--font-mono); color: #c084fc; text-align: center;">
            <strong style="font-size: 0.95rem;">${s.totalUpgrade20Target}</strong>
            <span style="font-size: 0.75rem; color: #f43f5e; margin-left: 3px;">(${s.totalUpgrade20Needed} needed)</span>
          </td>
          <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(s.upgradeRate)}</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(avgCover)}</td>
          <td style="font-family: var(--font-mono); color: #fff;">${s.totalContracts}</td>
          <td><span class="status-badge" style="background: #6366f120; color: #818cf8;">Sector Total</span></td>
        </tr>
      `;
    } else {
      const teamObj = model.teams[teamFilter];
      const teamLabel = teamObj ? teamObj.label : `ME-${teamFilter}`;
      const teamColor = teamObj ? teamObj.color : '#6366f1';

      const teamCash = filtered.reduce((sum, r) => sum + r.cash, 0);
      const teamTarget = filtered.reduce((sum, r) => sum + r.target, 0);
      const teamAch = teamTarget > 0 ? ((teamCash / teamTarget) * 100) : 0;
      const teamExpCash = Math.round(teamTarget * (pacePct / 100));
      const teamDeltaPace = Math.round((teamAch - pacePct) * 10) / 10;
      const teamUpgradeM2 = filtered.reduce((sum, r) => sum + r.upgradeM2, 0);
      const teamUpgradeBase = filtered.reduce((sum, r) => sum + r.upgradeBase, 0);
      const teamUpgrade20Target = Math.ceil(teamUpgradeBase * 0.20);
      const teamUpgrade20Needed = Math.max(0, teamUpgrade20Target - teamUpgradeM2);
      const teamUpgradeRate = teamUpgradeBase > 0 ? ((teamUpgradeM2 / teamUpgradeBase) * 100) : 0;
      const teamAvgCover = filtered.length > 0 ? (filtered.reduce((sum, r) => sum + r.coverRate, 0) / filtered.length) : 0;
      const teamContracts = filtered.reduce((sum, r) => sum + r.contracts, 0);
      const paceStatusClr = teamAch >= pacePct ? '#10b981' : (teamAch >= (pacePct - 8) ? '#f59e0b' : '#f43f5e');

      tfoot.innerHTML = `
        <tr style="background: rgba(99, 102, 241, 0.16); font-weight: 800; border-top: 2px solid ${teamColor};">
          <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">
            TOTAL / ${teamLabel.toUpperCase()}
          </td>
          <td style="font-family: var(--font-mono); color: #fff; font-size: 0.95rem;">${fmt(teamCash)}</td>
          <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(teamTarget)}</td>
          <td style="font-family: var(--font-mono); color: ${getStatusColor(teamAch)}; font-size: 0.95rem;">${fmtPct(teamAch)}</td>
          <td style="text-align: center;">
            <span style="background: ${paceStatusClr}20; color: ${paceStatusClr}; border: 1px solid ${paceStatusClr}40; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.78rem;">
              ${teamDeltaPace >= 0 ? '+' : ''}${teamDeltaPace}%
            </span>
            <div style="font-size: 0.68rem; color: #38bdf8; margin-top: 2px; font-family: var(--font-mono);">Exp: ${fmt(teamExpCash)}</div>
          </td>
          <td style="font-family: var(--font-mono); color: #10b981; font-size: 0.95rem;">${teamUpgradeM2}</td>
          <td style="font-family: var(--font-mono);">${teamUpgradeBase}</td>
          <td style="font-family: var(--font-mono); color: #c084fc; text-align: center;">
            <strong style="font-size: 0.95rem;">${teamUpgrade20Target}</strong>
            <span style="font-size: 0.75rem; color: ${teamUpgrade20Needed > 0 ? '#f43f5e' : '#10b981'}; margin-left: 3px;">(${teamUpgrade20Needed} needed)</span>
          </td>
          <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(teamUpgradeRate)}</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">&mdash;</td>
          <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(teamAvgCover)}</td>
          <td style="font-family: var(--font-mono); color: #fff;">${teamContracts}</td>
          <td><span class="status-badge" style="background: ${teamColor}25; color: ${teamColor}; border: 1px solid ${teamColor}50;">${teamFilter} Total</span></td>
        </tr>
      `;
    }
  }
}
// =========================================================================
// EARLY UPGRADE HUB (M2) STRATEGIC INTELLIGENCE ENGINE
// =========================================================================

function getUpgradeRecommendation(rep) {
  if (rep.upgradeBase === 0) {
    return '⚪ No M-2 student pool assigned this month.';
  }
  if (rep.upgradeM2 === 0) {
    if (rep.upgradeBase >= 20) {
      return `⚠️ High-Base Zero Alert (${rep.upgradeBase} leads). Urgent 1:1 call audit with TL; target top 10 most engaged students today.`;
    }
    return `🚨 Zero Upgrades across ${rep.upgradeBase} leads. Review call round 1 recordings and schedule demo review calls.`;
  }
  if (rep.upgrade20Needed === 0) {
    return `🎉 Benchmark Mastered (${rep.upgradeRate.toFixed(1)}% conv). 20% milestone achieved! Drive stretch goals on warm leads.`;
  }
  if (rep.upgrade20Needed <= 2) {
    return `🔥 SPRINT ALERT! Only ${rep.upgrade20Needed} upgrade${rep.upgrade20Needed > 1 ? 's' : ''} needed to hit official 20% benchmark (${rep.upgradeRate.toFixed(1)}% conv). Close today!`;
  }
  if (rep.upgradeRate >= 15) {
    return `🌟 Sector Star (${rep.upgradeRate.toFixed(1)}% conv). Share winning closing script in tomorrow's morning huddle.`;
  }
  if (rep.coverRate < 60) {
    return `📞 Outreach Gap (${rep.coverRate.toFixed(1)}% touch). Accelerate callback frequency to achieve ≥1.5x touchpoint intensity.`;
  }
  if (rep.upgrade20Needed <= 4) {
    return `⚡ Strong Potential! Only ${rep.upgrade20Needed} more needed for 20% target (${rep.upgradeRate.toFixed(1)}% achieved). Blitz pending proposals.`;
  }
  return `🟢 Steady Progress (${rep.upgradeM2}/${rep.upgradeBase}). Drive secondary touchpoints for remaining ${rep.upgradeBase - rep.upgradeM2} students.`;
}

function getUpgradeStatusBadge(rep) {
  if (rep.upgradeBase === 0) {
    return `<span class="status-badge" style="background: rgba(100,116,139,0.15); color: #94a3b8; border: 1px solid rgba(100,116,139,0.3);">No Pool</span>`;
  }
  if (rep.upgradeM2 === 0) {
    return `<span class="status-badge" style="background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3);">🚨 Zero Upgrades</span>`;
  }
  if (rep.upgradeRate >= 15) {
    return `<span class="status-badge" style="background: rgba(192,132,252,0.15); color: #c084fc; border: 1px solid rgba(192,132,252,0.3);">⭐ Star Benchmark</span>`;
  }
  if (rep.upgradeRate >= 8) {
    return `<span class="status-badge" style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3);">🟢 On Track</span>`;
  }
  if (rep.upgradeRate >= 4) {
    return `<span class="status-badge" style="background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3);">🟡 Pacing</span>`;
  }
  return `<span class="status-badge" style="background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3);">🔴 Action Needed</span>`;
}

function renderUpgradeTab(model) {
  const s = model.summary;

  // 1. Synchronize Executive KPI Cards
  const elActual = document.getElementById('upgCardActual');
  const elBase = document.getElementById('upgCardBase');
  const elRate = document.getElementById('upgCardRate');
  const elTarget = document.getElementById('upgCardTarget');
  const elNeeded = document.getElementById('upgCardNeeded');
  const elProg = document.getElementById('upgCardProg');
  const elProgBar = document.getElementById('upgCardProgBar');
  const elTouch = document.getElementById('upgCardTouch');

  if (elActual) elActual.textContent = s.totalUpgradeM2;
  if (elBase) elBase.textContent = s.totalUpgradeBase;
  if (elRate) elRate.textContent = s.totalUpgradeBase > 0 ? `${fmtPct(s.upgradeRate)} Conv.` : '0.0% Conv.';
  if (elTarget) elTarget.textContent = s.totalUpgrade20Target;
  if (elNeeded) elNeeded.textContent = s.totalUpgrade20Needed;

  const targetAchPct = s.totalUpgrade20Target > 0 ? ((s.totalUpgradeM2 / s.totalUpgrade20Target) * 100) : 0;
  if (elProg) elProg.textContent = `${targetAchPct.toFixed(1)}%`;
  if (elProgBar) elProgBar.style.width = `${Math.min(100, targetAchPct)}%`;

  const avgTouchSector = model.individuals.length > 0 ? (model.individuals.reduce((sum, r) => sum + r.coverRate, 0) / model.individuals.length) : 0;
  if (elTouch) elTouch.innerHTML = `${avgTouchSector.toFixed(1)}% <span style="font-size:0.75rem; color:#fde047;">(${(avgTouchSector / 100 * 1.7).toFixed(1)}x)</span>`;

  // 2. Render Small Teams Upgrade Comparison Cards
  const smallTeamsContainer = document.getElementById('upgradeSmallTeamsCards');
  if (smallTeamsContainer) {
    const teamList = Object.values(model.teams).map(t => {
      const tBase = t.members.reduce((sum, r) => sum + (r.upgradeBase || 0), 0);
      const tUp = t.members.reduce((sum, r) => sum + (r.upgradeM2 || 0), 0);
      const tRate = tBase > 0 ? ((tUp / tBase) * 100) : 0;
      const tTarget20 = Math.ceil(tBase * 0.20);
      const tNeeded = Math.max(0, tTarget20 - tUp);
      const tAch20 = tTarget20 > 0 ? ((tUp / tTarget20) * 100) : 0;
      const tCover = t.members.length > 0 ? (t.members.reduce((sum, r) => sum + (r.coverRate || 0), 0) / t.members.length) : 0;
      const tl = t.members.find(m => m.isTL)?.name || t.leader || 'Team Leader';
      return { t, tBase, tUp, tRate, tTarget20, tNeeded, tAch20, tCover, tl };
    }).sort((a, b) => b.tRate - a.tRate);

    smallTeamsContainer.innerHTML = teamList.map(item => {
      const badgeClass = item.tRate >= 6.5 ? 'pill-badge-emerald' : (item.tRate >= 5.0 ? 'pill-badge-cyan' : (item.tRate >= 3.0 ? 'pill-badge-amber' : 'pill-badge-rose'));
      const pulseClass = item.tRate >= 6.5 ? 'pulse-dot-emerald' : (item.tRate >= 3.0 ? 'pulse-dot-amber' : 'pulse-dot-rose');
      const badgeTxt = item.tRate >= 6.5 ? '⭐ Leader' : (item.tRate >= 5.0 ? 'Ahead' : (item.tRate >= 3.0 ? 'Pacing' : 'Gap'));
      return `
        <div class="metric-tile-modern" style="border-top: 3px solid ${item.t.color}; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div>
              <div style="font-weight: 800; color: #fff; font-size: 1.02rem; letter-spacing: -0.01em;">${item.t.label || item.t.key}</div>
              <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 3px;">👑 ${item.tl}</div>
            </div>
            <span class="pill-badge ${badgeClass}"><span class="pulse-dot ${pulseClass}"></span> ${badgeTxt}</span>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px;">
              <span style="color: #94a3b8; font-weight: 500;">20% Goal Velocity</span>
              <strong style="color: #c084fc; font-family: var(--font-mono);">${item.tAch20.toFixed(1)}% <span style="font-size: 0.74rem; color: #94a3b8; font-weight: 500;">(${item.tUp}/${item.tTarget20})</span></strong>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden;">
              <div style="height: 100%; width: ${Math.min(100, item.tAch20)}%; background: linear-gradient(90deg, ${item.t.color}, #c084fc); border-radius: 6px; box-shadow: 0 0 8px ${item.t.color}60;"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; background: rgba(15,23,42,0.35); border-radius: 8px; padding: 10px;">
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; display: block;">Base / Actual</span>
              <div style="font-weight: 700; color: #fff; font-family: var(--font-mono); margin-top: 2px;">${item.tBase} / <span style="color: #10b981;">${item.tUp} upg</span></div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; display: block;">Conv. Rate</span>
              <div style="font-weight: 800; color: #a78bfa; font-family: var(--font-mono); margin-top: 2px;">${item.tRate.toFixed(2)}%</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; display: block;">Remaining Needed</span>
              <div style="font-weight: 700; color: ${item.tNeeded > 0 ? '#f43f5e' : '#10b981'}; font-family: var(--font-mono); margin-top: 2px;">${item.tNeeded} needed</div>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600; display: block;">Touch Intensity</span>
              <div style="font-weight: 700; color: #facc15; font-family: var(--font-mono); margin-top: 2px;">${item.tCover.toFixed(1)}% <span style="font-size: 0.7rem; color: #fde047; font-weight: 500;">(${(item.tCover/100*1.7).toFixed(1)}x)</span></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Render Master Full Upgrade Table
  renderUpgradeTableRows();

  // 4. Attach Dynamic Filter/Sort Listeners once
  if (!window.__upgradeEventsBound) {
    window.__upgradeEventsBound = true;
    const teamFilter = document.getElementById('upgradeTeamFilter');
    const sortFilter = document.getElementById('upgradeSortFilter');
    const searchInput = document.getElementById('upgradeSearchInput');

    if (teamFilter) teamFilter.addEventListener('change', () => renderUpgradeTableRows());
    if (sortFilter) sortFilter.addEventListener('change', () => renderUpgradeTableRows());
    if (searchInput) searchInput.addEventListener('input', () => renderUpgradeTableRows());
  }

  function renderUpgradeTableRows() {
    const tbody = document.getElementById('masterUpgradeTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const selTeam = document.getElementById('upgradeTeamFilter')?.value || 'ALL';
    const selSort = document.getElementById('upgradeSortFilter')?.value || 'rate-desc';
    const searchTxt = (document.getElementById('upgradeSearchInput')?.value || '').trim().toLowerCase();

    let list = [...model.individuals];

    if (selTeam !== 'ALL') {
      list = list.filter(r => r.team === selTeam);
    }
    if (searchTxt) {
      list = list.filter(r => r.name.toLowerCase().includes(searchTxt));
    }

    list.sort((a, b) => {
      if (selSort === 'rate-desc') return (b.upgradeRate - a.upgradeRate) || (b.upgradeM2 - a.upgradeM2) || (b.upgradeBase - a.upgradeBase);
      if (selSort === 'upgrades-desc') return (b.upgradeM2 - a.upgradeM2) || (b.upgradeRate - a.upgradeRate) || (b.upgradeBase - a.upgradeBase);
      if (selSort === 'cov-desc') return (b.coverRate - a.coverRate) || (b.upgradeRate - a.upgradeRate) || (b.upgradeM2 - a.upgradeM2);
      if (selSort === 'cov-asc' || selSort === 'touch-asc') return (a.coverRate - b.coverRate);
      if (selSort === 'needed-asc') return (a.upgrade20Needed - b.upgrade20Needed) || (b.upgradeM2 - a.upgradeM2);
      if (selSort === 'needed-desc') return (b.upgrade20Needed - a.upgrade20Needed);
      if (selSort === 'base-desc') return (b.upgradeBase - a.upgradeBase);
      return (b.upgradeRate - a.upgradeRate) || (b.upgradeM2 - a.upgradeM2);
    });

    list.forEach((r, idx) => {
      const ach20 = r.upgrade20Target > 0 ? ((r.upgradeM2 / r.upgrade20Target) * 100) : 0;
      const rec = getUpgradeRecommendation(r);
      const statusBadge = getUpgradeStatusBadge(r);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); color: var(--text-dim); text-align: center;">${idx + 1}</td>
        <td style="text-align: left !important;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong style="color: #fff;">${r.name}</strong>
            ${r.isTL ? '<span title="Team Leader" style="cursor:help;">👑</span>' : ''}
          </div>
        </td>
        <td style="text-align: center;">
          <span class="status-badge" style="background: ${r.teamColor}20; color: ${r.teamColor}; border: 1px solid ${r.teamColor}40;">${r.team}</span>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #fff; text-align: center;">${r.upgradeBase}</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #facc15; text-align: center;">
          ${r.coverRate.toFixed(1)}% <span style="font-size: 0.72rem; color: #fde047; font-weight: 600;">(${(r.coverRate / 100 * 1.7).toFixed(1)}x)</span>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 800; color: #10b981; font-size: 1.05rem; text-align: center; background: rgba(16, 185, 129, 0.05); border-left: 1px solid rgba(16, 185, 129, 0.2);">
          ${r.upgradeM2}
        </td>
        <td style="font-family: var(--font-mono); text-align: center;">
          <div style="font-weight: 700; color: #a78bfa;">${r.upgradeRate.toFixed(1)}%</div>
          <div style="height: 4px; width: 65px; background: rgba(255,255,255,0.08); border-radius: 3px; margin: 3px auto 0; overflow: hidden;">
            <div style="height: 100%; width: ${Math.min(100, (r.upgradeRate / 20) * 100)}%; background: linear-gradient(90deg, #6366f1, #a78bfa);"></div>
          </div>
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: #c084fc; text-align: center; background: rgba(192, 132, 252, 0.05);">
          ${r.upgrade20Target}
        </td>
        <td style="font-family: var(--font-mono); text-align: center; background: rgba(244, 63, 94, 0.05); border-right: 1px solid rgba(244, 63, 94, 0.2);">
          ${r.upgrade20Needed === 0 ? '<span style="color:#10b981; font-weight:800;">🎉 MET</span>' : (r.upgrade20Needed <= 2 ? `<span style="color:#f59e0b; font-weight:800; background:rgba(245,158,11,0.15); padding:2px 7px; border-radius:4px; border:1px solid rgba(245,158,11,0.3);">🔥 ${r.upgrade20Needed} needed</span>` : `<span style="color:#f43f5e; font-weight:700;">${r.upgrade20Needed} needed</span>`)}
        </td>
        <td style="font-family: var(--font-mono); font-weight: 700; text-align: center; color: ${ach20 >= 100 ? '#10b981' : (ach20 >= 50 ? '#38bdf8' : '#94a3b8')};">
          ${ach20.toFixed(1)}%
        </td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: left !important; font-size: 0.8rem; line-height: 1.4; color: #cbd5e1;">
          ${rec}
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Render Table Footer
    const tfoot = document.getElementById('masterUpgradeTableFoot');
    if (tfoot) {
      const s = model.summary;
      const totalActiveBase = list.reduce((sum, r) => sum + r.upgradeBase, 0);
      const totalActiveUp = list.reduce((sum, r) => sum + r.upgradeM2, 0);
      const totalActiveTgt = list.reduce((sum, r) => sum + r.upgrade20Target, 0);
      const totalActiveNeed = list.reduce((sum, r) => sum + r.upgrade20Needed, 0);
      const avgTouch = list.length > 0 ? (list.reduce((sum, r) => sum + r.coverRate, 0) / list.length) : 0;
      const macroRate = totalActiveBase > 0 ? ((totalActiveUp / totalActiveBase) * 100) : 0;
      const totalAch20 = totalActiveTgt > 0 ? ((totalActiveUp / totalActiveTgt) * 100) : 0;

      tfoot.innerHTML = `
        <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
          <td colspan="3" style="color: #fff; text-align: left; font-size: 0.88rem;">
            ${selTeam === 'ALL' ? 'SECTOR GRAND TOTAL / BENCHMARK' : `${selTeam} TEAM TOTAL`}
          </td>
          <td style="font-family: var(--font-mono); color: #fff; text-align: center;">${totalActiveBase}</td>
          <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">
            ${avgTouch.toFixed(1)}% <span style="font-size: 0.72rem; color: #fde047; font-weight: 600;">(${(avgTouch / 100 * 1.7).toFixed(1)}x)</span>
          </td>
          <td style="font-family: var(--font-mono); color: #10b981; font-size: 1.1rem; text-align: center; background: rgba(16, 185, 129, 0.1); border-left: 1px solid rgba(16, 185, 129, 0.3);">
            ${totalActiveUp}
          </td>
          <td style="font-family: var(--font-mono); color: #a78bfa; text-align: center; font-size: 0.95rem;">
            ${macroRate.toFixed(2)}%
          </td>
          <td style="font-family: var(--font-mono); color: #c084fc; text-align: center; background: rgba(192, 132, 252, 0.1);">
            ${totalActiveTgt}
          </td>
          <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center; background: rgba(244, 63, 94, 0.1); border-right: 1px solid rgba(244, 63, 94, 0.3);">
            ${totalActiveNeed} needed
          </td>
          <td style="font-family: var(--font-mono); color: #38bdf8; text-align: center;">
            ${totalAch20.toFixed(1)}%
          </td>
          <td style="text-align: center;">
            <span class="status-badge" style="background: #6366f120; color: #818cf8; border: 1px solid #6366f140;">SCRM Benchmark</span>
          </td>
          <td style="text-align: left !important; color: #38bdf8; font-size: 0.8rem; font-weight: 600;">
            ${totalActiveNeed > 0 ? `Sector Gap: Close ${totalActiveNeed} contracts across remaining ${totalActiveBase - totalActiveUp} students to reach 20% standard.` : 'Goal fully met!'}
          </td>
        </tr>
      `;
    }
  }
}

// Alias for backwards compatibility
function renderBreakdownTab(model) {
  renderUpgradeTab(model);
}

function renderSOPTab() {
  const kpisContainer = document.getElementById('sopExecutiveKpis');
  const matrixBody = document.getElementById('sopMatrixTableBody');
  const matrixFoot = document.getElementById('sopMatrixTableFoot');
  const stagesContainer = document.getElementById('sopContent');
  const smallTeamsContainer = document.getElementById('sopSmallTeamCards');

  if (!matrixBody || !stagesContainer) return;

  const teamKeys = ["ME-EGSS01", "ME-EGSS05", "ME-EGSS10", "ME-EGSS13", "ME-EGSS30"];

  // 1. Calculate Big Team 01 (Sector Total) average per round & overall team averages
  const roundAverages = {};
  SOP_ROUNDS.forEach(r => {
    let sum = 0;
    teamKeys.forEach(tk => { sum += (SOP_DATA[tk]?.[r.key] || 0); });
    roundAverages[r.key] = Math.round((sum / teamKeys.length) * 10) / 10;
  });

  const teamSopAverages = {};
  const teamRoundsMet = {};
  teamKeys.forEach(tk => {
    let sum = 0;
    let met = 0;
    SOP_ROUNDS.forEach(r => {
      const val = SOP_DATA[tk]?.[r.key] || 0;
      sum += val;
      if (val >= r.target) met++;
    });
    teamSopAverages[tk] = Math.round((sum / SOP_ROUNDS.length) * 10) / 10;
    teamRoundsMet[tk] = met;
  });

  const sectorOverallAvg = Math.round((Object.values(roundAverages).reduce((a, b) => a + b, 0) / SOP_ROUNDS.length) * 10) / 10;
  const sectorRoundsMet = SOP_ROUNDS.filter(r => roundAverages[r.key] >= r.target).length;
  
  // Find top round and bottleneck round
  let topRound = SOP_ROUNDS[0];
  let worstGapRound = SOP_ROUNDS[0];
  let worstGap = 999;
  let maxScore = -1;

  SOP_ROUNDS.forEach(r => {
    const avg = roundAverages[r.key];
    const gap = avg - r.target;
    if (avg > maxScore) {
      maxScore = avg;
      topRound = r;
    }
    if (gap < worstGap) {
      worstGap = gap;
      worstGapRound = r;
    }
  });

  // Helper status color & badges
  const getSopColor = (val, target) => {
    if (val >= target) return '#10b981'; // Green
    if (val >= target - 10) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose/Red
  };

  const getSopBadge = (val, target) => {
    const delta = Math.round((val - target) * 10) / 10;
    const sign = delta >= 0 ? '+' : '';
    if (val >= target) {
      return `<span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">🟢 MET (${sign}${delta}%)</span>`;
    }
    if (val >= target - 10) {
      return `<span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">🟡 ALERT (${sign}${delta}%)</span>`;
    }
    return `<span style="background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">🔴 LAG (${sign}${delta}%)</span>`;
  };

  // 2. Render Top Executive Big Team 01 KPI Cards
  if (kpisContainer) {
    kpisContainer.innerHTML = `
      <div class="kpi-card" style="border-top: 4px solid var(--accent-indigo);">
        <div class="kpi-label">Big Team 01 — Sector Overall SOP Score</div>
        <div class="kpi-value" style="color: #fff; font-family: var(--font-mono); font-size: 1.85rem;">
          ${sectorOverallAvg}%
          <span style="font-size: 0.85rem; color: #818cf8; font-weight: 600;">(Sector Total)</span>
        </div>
        <div class="kpi-sub">Target Benchmark: <strong>80.0%</strong> | Gap: <span style="color: #f59e0b;">-1.9%</span></div>
        <div class="kpi-progress" style="margin-top: 8px;">
          <div class="kpi-bar" style="width: ${sectorOverallAvg}%; background: linear-gradient(90deg, #6366f1, #06b6d4);"></div>
        </div>
        <div class="kpi-pct" style="color: var(--text-secondary);">Comprehensive average across all 9 stages for all 5 teams</div>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #10b981;">
        <div class="kpi-label">Stages Meeting Target Fully</div>
        <div class="kpi-value" style="color: #10b981; font-family: var(--font-mono); font-size: 1.85rem;">
          ${sectorRoundsMet} <span style="font-size: 1rem; color: var(--text-muted);">/ 9 Stages</span>
        </div>
        <div class="kpi-sub">R4 (80.4%), R6 (77.4%), EC (70.0%)</div>
        <div class="kpi-progress" style="margin-top: 8px;">
          <div class="kpi-bar" style="width: ${(sectorRoundsMet / 9) * 100}%; background: #10b981;"></div>
        </div>
        <div class="kpi-pct" style="color: #10b981;">4 additional stages within tolerance range (Near)</div>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #06b6d4;">
        <div class="kpi-label">Highest Performing Stage in Sector</div>
        <div class="kpi-value" style="color: #06b6d4; font-family: var(--font-mono); font-size: 1.45rem;">
          ${topRound.label.split(' ')[0]} ${topRound.label.split(' ')[1]} (${roundAverages[topRound.key]}%)
        </div>
        <div class="kpi-sub">${topRound.label} | Target: <strong>${topRound.target}%</strong></div>
        <div class="kpi-progress" style="margin-top: 8px;">
          <div class="kpi-bar" style="width: ${roundAverages[topRound.key]}%; background: #06b6d4;"></div>
        </div>
        <div class="kpi-pct" style="color: #06b6d4;">Top Team: ME-EGSS05 (95%)</div>
      </div>

      <div class="kpi-card" style="border-top: 4px solid #f43f5e;">
        <div class="kpi-label">Urgent Operational Bottleneck</div>
        <div class="kpi-value" style="color: #f43f5e; font-family: var(--font-mono); font-size: 1.45rem;">
          ${worstGapRound.key}: ${roundAverages[worstGapRound.key]}%
        </div>
        <div class="kpi-sub">${worstGapRound.label} | Target: <strong>${worstGapRound.target}%</strong></div>
        <div class="kpi-progress" style="margin-top: 8px;">
          <div class="kpi-bar" style="width: ${roundAverages[worstGapRound.key]}%; background: #f43f5e;"></div>
        </div>
        <div class="kpi-pct" style="color: #f43f5e;">Gap of ${worstGap.toFixed(1)}% — requires immediate focus on R5 Out-of-Pool leads</div>
      </div>
    `;
  }

  // 3. Render Master Comparison Matrix Table (Body & Foot)
  matrixBody.innerHTML = '';
  SOP_ROUNDS.forEach((r, idx) => {
    const bigVal = roundAverages[r.key];
    const bigClr = getSopColor(bigVal, r.target);
    const badge = getSopBadge(bigVal, r.target);

    const teamCells = teamKeys.map(tk => {
      const v = SOP_DATA[tk]?.[r.key] || 0;
      const clr = getSopColor(v, r.target);
      const isMet = v >= r.target;
      return `
        <td style="text-align: center; font-family: var(--font-mono); font-weight: 700; color: ${clr};">
          ${v}% ${isMet ? '<span style="font-size: 0.7rem;">✓</span>' : ''}
        </td>
      `;
    }).join('');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong style="color: #fff;">${r.label}</strong>
        <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 6px;">(${r.key})</span>
      </td>
      <td style="text-align: center; font-family: var(--font-mono); color: var(--text-secondary); font-weight: 600;">${r.target}%</td>
      <td style="background: rgba(99, 102, 241, 0.18); border-left: 2px solid #6366f1; border-right: 2px solid #6366f1; text-align: center; font-family: var(--font-mono); font-weight: 800; font-size: 0.95rem; color: ${bigClr};">
        ${bigVal}%
      </td>
      ${teamCells}
      <td style="text-align: center;">${badge}</td>
    `;
    matrixBody.appendChild(tr);
  });

  if (matrixFoot) {
    const footTeamCells = teamKeys.map(tk => {
      const avg = teamSopAverages[tk];
      const clr = getSopColor(avg, 80);
      return `
        <td style="text-align: center; font-family: var(--font-mono); font-weight: 800; font-size: 0.92rem; color: ${clr};">
          ${avg}%
        </td>
      `;
    }).join('');

    matrixFoot.innerHTML = `
      <tr style="background: rgba(99, 102, 241, 0.15); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
        <td style="color: #fff; font-size: 0.88rem;">SOP Overall Compliance (TOTAL AVERAGE)</td>
        <td style="text-align: center; font-family: var(--font-mono); color: var(--text-secondary);">80.0%</td>
        <td style="background: rgba(99, 102, 241, 0.3); border-left: 2px solid #6366f1; border-right: 2px solid #6366f1; text-align: center; font-family: var(--font-mono); font-size: 1.05rem; color: #fff;">
          ⭐ ${sectorOverallAvg}%
        </td>
        ${footTeamCells}
        <td style="text-align: center;">
          <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 0.78rem;">Big Team 01</span>
        </td>
      </tr>
    `;
  }

  // 4. Render Stage Breakdown Cards (Including Big Team 01 Bar in each card)
  stagesContainer.innerHTML = '';
  SOP_ROUNDS.forEach(round => {
    const card = document.createElement('div');
    card.className = 'calc-card';
    const bigVal = roundAverages[round.key];
    const bigClr = getSopColor(bigVal, round.target);

    // Big Team 01 row
    const bigTeamRow = `
      <div style="margin-bottom: 12px; padding: 8px 10px; background: rgba(99, 102, 241, 0.12); border-radius: var(--radius-sm); border: 1px solid rgba(99, 102, 241, 0.25);">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
          <span style="color: #fff; font-weight: 800; display: flex; align-items: center; gap: 6px;">
            ⭐ Big Team 01 (Sector Total)
          </span>
          <span style="font-family: var(--font-mono); color: ${bigClr}; font-weight: 800;">${bigVal}%</span>
        </div>
        <div style="height: 7px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${Math.min(100, bigVal)}%; background: linear-gradient(90deg, #6366f1, #06b6d4);"></div>
        </div>
      </div>
    `;

    const barRows = teamKeys.map(teamLabel => {
      const val = SOP_DATA[teamLabel]?.[round.key] || 0;
      const tk = teamLabel.replace('ME-', '');
      const color = TL_MAPPING[tk]?.color || '#6366f1';
      const statusClr = getSopColor(val, round.target);

      return `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 3px;">
            <span style="color: ${color}; font-weight: 600;">${teamLabel}</span>
            <span style="font-family: var(--font-mono); color: ${statusClr}; font-weight: 700;">${val}%</span>
          </div>
          <div style="height: 5px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${Math.min(100, val)}%; background: ${statusClr};"></div>
          </div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff;">${round.label}</h4>
        <span style="font-size: 0.72rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">Target: ${round.target}%</span>
      </div>
      ${bigTeamRow}
      ${barRows}
    `;
    stagesContainer.appendChild(card);
  });

  // 5. Render Dedicated Small Teams SOP Cards at the Bottom
  if (smallTeamsContainer) {
    smallTeamsContainer.innerHTML = '';
    
    // Sort teams by overall SOP average descending
    const sortedTeams = [...teamKeys].sort((a, b) => teamSopAverages[b] - teamSopAverages[a]);

    const teamRecommendations = {
      "ME-EGSS05": "Exceptional leadership performance (Rank #1, 83.3%). Top priority: boost R5 Out-of-Pool follow-up from 62% to 70%.",
      "ME-EGSS13": "Strong compliance closely trailing leader (82.2%). Focus on elevating R5 (69%) and closing Upgrade U2 (78%).",
      "ME-EGSS01": "Balanced performance (78.4%). Requires direct intervention in R5 (55%) and lifting Upgrade U2 closing (75%).",
      "ME-EGSS10": "Declining compliance pacing (74.7%). Urgent coaching on R5 Out-of-Pool (48%) and English Club classes EC (65%).",
      "ME-EGSS30": "Requires comprehensive rescue plan and operational overhaul (72.0%). Urgent focus on R5 (45%), English Club (60%), and U2 upgrades (68%)."
    };

    sortedTeams.forEach((tk, rankIdx) => {
      const shortKey = tk.replace('ME-', '');
      const tl = TL_MAPPING[shortKey];
      const avg = teamSopAverages[tk];
      const metCount = teamRoundsMet[tk];
      const deltaSector = Math.round((avg - sectorOverallAvg) * 10) / 10;
      const deltaSign = deltaSector >= 0 ? '+' : '';
      const statusClr = getSopColor(avg, 80);

      const stageRows = SOP_ROUNDS.map(r => {
        const val = SOP_DATA[tk]?.[r.key] || 0;
        const clr = getSopColor(val, r.target);
        const isMet = val >= r.target;
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.78rem;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="color: ${isMet ? '#10b981' : '#f43f5e'}; font-size: 0.7rem;">${isMet ? '●' : '○'}</span>
              <span style="color: var(--text-secondary);">${r.label}</span>
            </div>
            <div style="font-family: var(--font-mono); display: flex; align-items: center; gap: 6px;">
              <strong style="color: ${clr};">${val}%</strong>
              <span style="font-size: 0.68rem; color: var(--text-muted);">/ ${r.target}%</span>
            </div>
          </div>
        `;
      }).join('');

      const card = document.createElement('div');
      card.className = 'calc-card';
      card.style.borderTop = `4px solid ${tl?.color || '#6366f1'}`;
      card.style.background = 'var(--bg-card)';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff;">${tk}</h4>
              <span style="background: ${tl?.color || '#6366f1'}20; color: ${tl?.color || '#6366f1'}; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
                Rank #${rankIdx + 1}
              </span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Team Leader: <strong style="color: #fff;">👑 ${tl?.tl || ''}</strong>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.6rem; font-weight: 900; font-family: var(--font-mono); color: ${statusClr}; line-height: 1;">
              ${avg}%
            </div>
            <div style="font-size: 0.7rem; color: ${deltaSector >= 0 ? '#10b981' : '#f43f5e'}; font-weight: 700; margin-top: 3px;">
              ${deltaSign}${deltaSector}% vs Sector
            </div>
          </div>
        </div>

        <!-- KPI Mini Box -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 14px; border: 1px solid var(--border-glass);">
          <div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">Stages on Target</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #10b981; font-family: var(--font-mono);">${metCount} / 9 Stages</div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">Tolerance Score</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #fff; font-family: var(--font-mono);">${Math.round((avg / 80) * 100)}% of Goal</div>
          </div>
        </div>

        <!-- 9 Stages List -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.05em;">
            Operational Stages Breakdown (9 Rounds)
          </div>
          ${stageRows}
        </div>

        <!-- Action / Coaching Note -->
        <div style="background: rgba(99, 102, 241, 0.06); border: 1px solid rgba(99, 102, 241, 0.15); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5;">
          <strong style="color: #818cf8;">💡 Field Coaching Directive:</strong>
          <div style="margin-top: 3px; color: #e2e8f0;">${teamRecommendations[tk] || ''}</div>
        </div>
      `;
      smallTeamsContainer.appendChild(card);
    });
  }
}

function renderRecommendationsTab(model) {
  var container = document.getElementById('recommendationsList') || document.getElementById('recommendationsContent');
  if (!container) return;
  container.innerHTML = '';

  var s = model.summary;
  var typeConfig = {
    critical: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.5)', label: 'CRITICAL' },
    warning:  { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.4)', label: 'WARNING' },
    action:   { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.08)',  border: 'rgba(6, 182, 212, 0.4)',  label: 'ACTION' },
    success:  { color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.4)', label: 'ON TRACK' }
  };

  var allRecs = [];
  if (typeof DAILY_RECOMMENDATIONS !== 'undefined' && DAILY_RECOMMENDATIONS.length > 0) {
    DAILY_RECOMMENDATIONS.forEach(function(r) { allRecs.push(r); });
  }

  var zeroReps = model.individuals.filter(function(r) { return r.cash === 0; });
  if (zeroReps.length > 0 && !allRecs.some(function(r) { return r.title && r.title.indexOf('Zero') >= 0; })) {
    allRecs.push({ type: 'critical', icon: '\uD83D\uDEA8', title: zeroReps.length + ' Reps with Zero Sales',
      detail: zeroReps.map(function(r) { return r.name; }).join(', ') + ' need immediate coaching.' });
  }

  var sortedReps = model.individuals.filter(function(r) { return r.target > 0; }).sort(function(a,b) { return b.achievement - a.achievement; });
  var stars = sortedReps.slice(0, 3);
  if (!allRecs.some(function(r) { return r.title && r.title.indexOf('Stars') >= 0; })) {
    allRecs.push({ type: 'success', icon: '\u2B50', title: 'Top 3 Stars Today',
      detail: stars.map(function(r) { return r.name + ' (' + r.achievement.toFixed(1) + '%)'; }).join(', ') + '. Recognize!' });
  }

  if (s.daysLeft > 0 && s.totalGap > 0) {
    var dailyNeed = Math.round(s.totalGap / s.daysLeft);
    if (!allRecs.some(function(r) { return r.detail && r.detail.indexOf('/day') >= 0; })) {
      allRecs.push({ type: 'action', icon: '\uD83D\uDCCA', title: 'Daily Production: $' + dailyNeed.toLocaleString() + '/day',
        detail: s.daysLeft + ' days left. Gap: $' + s.totalGap.toLocaleString() + '. Projected: $' + s.projectedCash.toLocaleString() + '.' });
    }
  }

  var header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;';
  var critCount = allRecs.filter(function(r){return r.type==='critical';}).length;
  var actCount = allRecs.filter(function(r){return r.type==='action';}).length;
  var sucCount = allRecs.filter(function(r){return r.type==='success';}).length;
  header.innerHTML = '<div style="display:flex;align-items:center;gap:10px;"><span style="font-size:1.6rem;">\uD83E\uDDE0</span><div><h3 style="font-size:1.15rem;font-weight:800;color:#fff;margin:0;">Smart Daily Action Notes</h3><p style="font-size:0.78rem;color:var(--text-muted);margin:2px 0 0 0;">Auto-generated from live data \u00B7 Day ' + s.daysPassed + ' of ' + s.daysInMonth + '</p></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;"><span style="font-size:0.72rem;padding:4px 10px;border-radius:12px;background:rgba(244,63,94,0.15);color:#f43f5e;font-weight:700;">' + critCount + ' Critical</span><span style="font-size:0.72rem;padding:4px 10px;border-radius:12px;background:rgba(6,182,212,0.15);color:#06b6d4;font-weight:700;">' + actCount + ' Actions</span><span style="font-size:0.72rem;padding:4px 10px;border-radius:12px;background:rgba(16,185,129,0.15);color:#10b981;font-weight:700;">' + sucCount + ' Positive</span></div>';
  container.appendChild(header);

  allRecs.forEach(function(rec, i) {
    var cfg = typeConfig[rec.type] || typeConfig.action;
    var card = document.createElement('div');
    card.style.cssText = 'background:' + cfg.bg + ';border:1px solid ' + cfg.border + ';border-left:5px solid ' + cfg.color + ';border-radius:12px;padding:18px 22px;margin-bottom:14px;transition:transform 0.2s,box-shadow 0.2s;';
    card.onmouseenter = function() { card.style.transform='translateY(-2px)'; card.style.boxShadow='0 8px 25px ' + cfg.border; };
    card.onmouseleave = function() { card.style.transform='none'; card.style.boxShadow='none'; };
    card.innerHTML = '<div style="display:flex;align-items:flex-start;gap:14px;"><span style="font-size:1.5rem;line-height:1;">' + (rec.icon||'\uD83D\uDCA1') + '</span><div style="flex:1;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:8px;"><h4 style="font-size:1rem;font-weight:700;color:#fff;margin:0;">' + rec.title + '</h4><span style="font-size:0.65rem;padding:2px 8px;border-radius:6px;background:' + cfg.color + '22;color:' + cfg.color + ';font-weight:800;letter-spacing:0.5px;">' + cfg.label + '</span></div><p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.65;margin:0;">' + rec.detail + '</p></div></div>';
    container.appendChild(card);
  });

  var footer = document.createElement('div');
  footer.style.cssText = 'margin-top:24px;padding:16px 20px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.3);border-radius:10px;text-align:center;';
  footer.innerHTML = '<p style="font-size:0.82rem;color:var(--text-secondary);margin:0;">\uD83D\uDCCB <strong>' + allRecs.length + ' total recommendations</strong> \u00B7 Day ' + s.daysPassed + ' \u00B7 Sector: <strong>$' + s.totalCash.toLocaleString() + '</strong> (' + s.achievement.toFixed(1) + '%) \u00B7 ' + s.daysLeft + ' days left</p>';
  container.appendChild(footer);
}



// =========================================================================
// OPERATIONS MASTER (ALL IN ONE INTEGRATION)
// =========================================================================

const MASTER_OPERATIONS_DATA = {
    "consumption":  [
                        {
                            "name":  "EGSS-AbdelrahmanNASEF",
                            "team":  "ME-EGSS05",
                            "total":  219,
                            "end_classes":  261,
                            "avg_classes":  0,
                            "c0":  64,
                            "c1_3":  151,
                            "c4_7":  4,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "29.2%",
                            "p4":  "1.8%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-ehabzaky01",
                            "team":  "ME-EGSS05",
                            "total":  238,
                            "end_classes":  263,
                            "avg_classes":  0,
                            "c0":  79,
                            "c1_3":  153,
                            "c4_7":  5,
                            "c8_11":  0,
                            "c12_14":  1,
                            "c15":  0,
                            "c12":  1,
                            "p0":  "33.2%",
                            "p4":  "2.5%",
                            "p8":  "0.4%",
                            "p12":  "0.4%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-Ibrahimismaiel",
                            "team":  "ME-EGSS05",
                            "total":  275,
                            "end_classes":  228,
                            "avg_classes":  0,
                            "c0":  123,
                            "c1_3":  151,
                            "c4_7":  1,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "44.7%",
                            "p4":  "0.4%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-KhaledGonam",
                            "team":  "ME-EGSS05",
                            "total":  265,
                            "end_classes":  238,
                            "avg_classes":  0,
                            "c0":  105,
                            "c1_3":  154,
                            "c4_7":  6,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "39.6%",
                            "p4":  "2.3%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-OmarMoneb",
                            "team":  "ME-EGSS05",
                            "total":  219,
                            "end_classes":  202,
                            "avg_classes":  0,
                            "c0":  89,
                            "c1_3":  129,
                            "c4_7":  1,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "40.6%",
                            "p4":  "0.5%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-samira01",
                            "team":  "ME-EGSS05",
                            "total":  244,
                            "end_classes":  240,
                            "avg_classes":  0,
                            "c0":  88,
                            "c1_3":  154,
                            "c4_7":  2,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "36.1%",
                            "p4":  "0.8%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-ashraqatal",
                            "team":  "ME-EGSS01",
                            "total":  253,
                            "end_classes":  263,
                            "avg_classes":  0,
                            "c0":  85,
                            "c1_3":  161,
                            "c4_7":  7,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "33.6%",
                            "p4":  "2.8%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-juliamonir01",
                            "team":  "ME-EGSS01",
                            "total":  264,
                            "end_classes":  278,
                            "avg_classes":  0,
                            "c0":  78,
                            "c1_3":  182,
                            "c4_7":  4,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "29.5%",
                            "p4":  "1.5%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-mahmoud04",
                            "team":  "ME-EGSS01",
                            "total":  294,
                            "end_classes":  272,
                            "avg_classes":  0,
                            "c0":  111,
                            "c1_3":  180,
                            "c4_7":  3,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "37.8%",
                            "p4":  "1%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-negma",
                            "team":  "ME-EGSS01",
                            "total":  252,
                            "end_classes":  292,
                            "avg_classes":  0,
                            "c0":  75,
                            "c1_3":  175,
                            "c4_7":  1,
                            "c8_11":  0,
                            "c12_14":  1,
                            "c15":  0,
                            "c12":  1,
                            "p0":  "29.8%",
                            "p4":  "0.8%",
                            "p8":  "0.4%",
                            "p12":  "0.4%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-nohayoussry",
                            "team":  "ME-EGSS01",
                            "total":  253,
                            "end_classes":  254,
                            "avg_classes":  0,
                            "c0":  88,
                            "c1_3":  161,
                            "c4_7":  4,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "34.8%",
                            "p4":  "1.6%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-Amrsafwat",
                            "team":  "ME-EGSS13",
                            "total":  268,
                            "end_classes":  288,
                            "avg_classes":  0,
                            "c0":  85,
                            "c1_3":  179,
                            "c4_7":  3,
                            "c8_11":  1,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "31.7%",
                            "p4":  "1.5%",
                            "p8":  "0.4%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-hayamhassan",
                            "team":  "ME-EGSS13",
                            "total":  149,
                            "end_classes":  186,
                            "avg_classes":  0,
                            "c0":  34,
                            "c1_3":  110,
                            "c4_7":  5,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "22.8%",
                            "p4":  "3.4%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-marwaahmed",
                            "team":  "ME-EGSS13",
                            "total":  251,
                            "end_classes":  265,
                            "avg_classes":  0,
                            "c0":  85,
                            "c1_3":  161,
                            "c4_7":  5,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "33.9%",
                            "p4":  "2%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-mohamedha",
                            "team":  "ME-EGSS13",
                            "total":  213,
                            "end_classes":  206,
                            "avg_classes":  0,
                            "c0":  83,
                            "c1_3":  128,
                            "c4_7":  2,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "39%",
                            "p4":  "0.9%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-AdhmGadAllah",
                            "team":  "ME-EGSS30",
                            "total":  249,
                            "end_classes":  266,
                            "avg_classes":  0,
                            "c0":  85,
                            "c1_3":  154,
                            "c4_7":  10,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "34.1%",
                            "p4":  "4%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-alihesham01",
                            "team":  "ME-EGSS30",
                            "total":  143,
                            "end_classes":  167,
                            "avg_classes":  0,
                            "c0":  41,
                            "c1_3":  99,
                            "c4_7":  3,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "28.7%",
                            "p4":  "2.1%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-titooooo",
                            "team":  "ME-EGSS30",
                            "total":  248,
                            "end_classes":  269,
                            "avg_classes":  0,
                            "c0":  76,
                            "c1_3":  169,
                            "c4_7":  3,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "30.6%",
                            "p4":  "1.2%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-abdelrhmanshehata",
                            "team":  "ME-EGSS10",
                            "total":  192,
                            "end_classes":  232,
                            "avg_classes":  0,
                            "c0":  59,
                            "c1_3":  129,
                            "c4_7":  4,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "30.7%",
                            "p4":  "2.1%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-AhmedShoukry",
                            "team":  "ME-EGSS10",
                            "total":  281,
                            "end_classes":  324,
                            "avg_classes":  0,
                            "c0":  74,
                            "c1_3":  200,
                            "c4_7":  7,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "26.3%",
                            "p4":  "2.5%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-Mahmoudkhamis",
                            "team":  "ME-EGSS10",
                            "total":  280,
                            "end_classes":  295,
                            "avg_classes":  0,
                            "c0":  80,
                            "c1_3":  197,
                            "c4_7":  3,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "28.6%",
                            "p4":  "1.1%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        }
                    ],
    "unfixed":  [
                    {
                        "name":  "EGSS-AbdelrahmanNASEF",
                        "team":  "ME-EGSS05",
                        "m0Tot":  21,
                        "m0Fix":  19,
                        "m0Pct":  "90.5%",
                        "m1Tot":  18,
                        "m1Fix":  16,
                        "m1Pct":  "88.9%"
                    },
                    {
                        "name":  "EGSS-ehabzaky01",
                        "team":  "ME-EGSS05",
                        "m0Tot":  30,
                        "m0Fix":  24,
                        "m0Pct":  "80%",
                        "m1Tot":  21,
                        "m1Fix":  16,
                        "m1Pct":  "76.2%"
                    },
                    {
                        "name":  "EGSS-Ibrahimismaiel",
                        "team":  "ME-EGSS05",
                        "m0Tot":  25,
                        "m0Fix":  18,
                        "m0Pct":  "72%",
                        "m1Tot":  25,
                        "m1Fix":  19,
                        "m1Pct":  "76%"
                    },
                    {
                        "name":  "EGSS-KhaledGonam",
                        "team":  "ME-EGSS05",
                        "m0Tot":  16,
                        "m0Fix":  8,
                        "m0Pct":  "50%",
                        "m1Tot":  13,
                        "m1Fix":  8,
                        "m1Pct":  "61.5%"
                    },
                    {
                        "name":  "EGSS-OmarMoneb",
                        "team":  "ME-EGSS05",
                        "m0Tot":  19,
                        "m0Fix":  16,
                        "m0Pct":  "84.2%",
                        "m1Tot":  15,
                        "m1Fix":  11,
                        "m1Pct":  "73.3%"
                    },
                    {
                        "name":  "EGSS-samira01",
                        "team":  "ME-EGSS05",
                        "m0Tot":  15,
                        "m0Fix":  10,
                        "m0Pct":  "66.7%",
                        "m1Tot":  17,
                        "m1Fix":  16,
                        "m1Pct":  "94.1%"
                    },
                    {
                        "name":  "EGSS-ashraqatal",
                        "team":  "ME-EGSS01",
                        "m0Tot":  26,
                        "m0Fix":  14,
                        "m0Pct":  "53.8%",
                        "m1Tot":  29,
                        "m1Fix":  22,
                        "m1Pct":  "75.9%"
                    },
                    {
                        "name":  "EGSS-juliamonir01",
                        "team":  "ME-EGSS01",
                        "m0Tot":  16,
                        "m0Fix":  9,
                        "m0Pct":  "56.2%",
                        "m1Tot":  22,
                        "m1Fix":  16,
                        "m1Pct":  "72.7%"
                    },
                    {
                        "name":  "EGSS-mahmoud04",
                        "team":  "ME-EGSS01",
                        "m0Tot":  18,
                        "m0Fix":  15,
                        "m0Pct":  "83.3%",
                        "m1Tot":  31,
                        "m1Fix":  29,
                        "m1Pct":  "93.5%"
                    },
                    {
                        "name":  "EGSS-negma",
                        "team":  "ME-EGSS01",
                        "m0Tot":  25,
                        "m0Fix":  15,
                        "m0Pct":  "60%",
                        "m1Tot":  34,
                        "m1Fix":  32,
                        "m1Pct":  "94.1%"
                    },
                    {
                        "name":  "EGSS-nohayoussry",
                        "team":  "ME-EGSS01",
                        "m0Tot":  18,
                        "m0Fix":  16,
                        "m0Pct":  "88.9%",
                        "m1Tot":  27,
                        "m1Fix":  25,
                        "m1Pct":  "92.6%"
                    },
                    {
                        "name":  "EGSS-Amrsafwat",
                        "team":  "ME-EGSS13",
                        "m0Tot":  21,
                        "m0Fix":  17,
                        "m0Pct":  "81%",
                        "m1Tot":  26,
                        "m1Fix":  21,
                        "m1Pct":  "80.8%"
                    },
                    {
                        "name":  "EGSS-hayamhassan",
                        "team":  "ME-EGSS13",
                        "m0Tot":  36,
                        "m0Fix":  32,
                        "m0Pct":  "88.9%",
                        "m1Tot":  20,
                        "m1Fix":  19,
                        "m1Pct":  "95%"
                    },
                    {
                        "name":  "EGSS-marwaahmed",
                        "team":  "ME-EGSS13",
                        "m0Tot":  24,
                        "m0Fix":  21,
                        "m0Pct":  "87.5%",
                        "m1Tot":  16,
                        "m1Fix":  14,
                        "m1Pct":  "87.5%"
                    },
                    {
                        "name":  "EGSS-mohamedha",
                        "team":  "ME-EGSS13",
                        "m0Tot":  20,
                        "m0Fix":  1,
                        "m0Pct":  "5%",
                        "m1Tot":  20,
                        "m1Fix":  11,
                        "m1Pct":  "55%"
                    },
                    {
                        "name":  "EGSS-AdhmGadAllah",
                        "team":  "ME-EGSS30",
                        "m0Tot":  19,
                        "m0Fix":  18,
                        "m0Pct":  "94.7%",
                        "m1Tot":  25,
                        "m1Fix":  23,
                        "m1Pct":  "92%"
                    },
                    {
                        "name":  "EGSS-alihesham01",
                        "team":  "ME-EGSS30",
                        "m0Tot":  21,
                        "m0Fix":  17,
                        "m0Pct":  "81%",
                        "m1Tot":  18,
                        "m1Fix":  17,
                        "m1Pct":  "94.4%"
                    },
                    {
                        "name":  "EGSS-titooooo",
                        "team":  "ME-EGSS30",
                        "m0Tot":  30,
                        "m0Fix":  22,
                        "m0Pct":  "73.3%",
                        "m1Tot":  19,
                        "m1Fix":  17,
                        "m1Pct":  "89.5%"
                    },
                    {
                        "name":  "EGSS-abdelrhmanshehata",
                        "team":  "ME-EGSS10",
                        "m0Tot":  30,
                        "m0Fix":  23,
                        "m0Pct":  "76.7%",
                        "m1Tot":  26,
                        "m1Fix":  22,
                        "m1Pct":  "84.6%"
                    },
                    {
                        "name":  "EGSS-AhmedShoukry",
                        "team":  "ME-EGSS10",
                        "m0Tot":  26,
                        "m0Fix":  23,
                        "m0Pct":  "88.5%",
                        "m1Tot":  34,
                        "m1Fix":  29,
                        "m1Pct":  "85.3%"
                    },
                    {
                        "name":  "EGSS-Mahmoudkhamis",
                        "team":  "ME-EGSS10",
                        "m0Tot":  26,
                        "m0Fix":  22,
                        "m0Pct":  "84.6%",
                        "m1Tot":  32,
                        "m1Fix":  28,
                        "m1Pct":  "87.5%"
                    }
                ],
    "sop":  [
                {
                    "name":  "EGSS-AbdelrahmanNASEF",
                    "team":  "ME-EGSS05",
                    "ec":  16,
                    "r1":  1,
                    "r2":  1,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  21,
                    "r6e":  4,
                    "absence":  2,
                    "total":  46
                },
                {
                    "name":  "EGSS-ehabzaky01",
                    "team":  "ME-EGSS05",
                    "ec":  10,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  19,
                    "r6e":  3,
                    "absence":  2,
                    "total":  35
                },
                {
                    "name":  "EGSS-Ibrahimismaiel",
                    "team":  "ME-EGSS05",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  0
                },
                {
                    "name":  "EGSS-KhaledGonam",
                    "team":  "ME-EGSS05",
                    "ec":  2,
                    "r1":  3,
                    "r2":  1,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  2,
                    "r6e":  5,
                    "absence":  1,
                    "total":  14
                },
                {
                    "name":  "EGSS-OmarMoneb",
                    "team":  "ME-EGSS05",
                    "ec":  1,
                    "r1":  1,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  11,
                    "r6e":  3,
                    "absence":  1,
                    "total":  17
                },
                {
                    "name":  "EGSS-samira01",
                    "team":  "ME-EGSS05",
                    "ec":  1,
                    "r1":  0,
                    "r2":  2,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  11,
                    "r6e":  3,
                    "absence":  0,
                    "total":  17
                },
                {
                    "name":  "EGSS-ashraqatal",
                    "team":  "ME-EGSS01",
                    "ec":  0,
                    "r1":  0,
                    "r2":  1,
                    "r3":  1,
                    "r4":  0,
                    "r6d":  17,
                    "r6e":  4,
                    "absence":  1,
                    "total":  24
                },
                {
                    "name":  "EGSS-juliamonir01",
                    "team":  "ME-EGSS01",
                    "ec":  2,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  21,
                    "r6e":  6,
                    "absence":  1,
                    "total":  30
                },
                {
                    "name":  "EGSS-mahmoud04",
                    "team":  "ME-EGSS01",
                    "ec":  23,
                    "r1":  0,
                    "r2":  1,
                    "r3":  0,
                    "r4":  3,
                    "r6d":  28,
                    "r6e":  6,
                    "absence":  2,
                    "total":  63
                },
                {
                    "name":  "EGSS-negma",
                    "team":  "ME-EGSS01",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  23,
                    "r6e":  0,
                    "absence":  0,
                    "total":  23
                },
                {
                    "name":  "EGSS-nohayoussry",
                    "team":  "ME-EGSS01",
                    "ec":  9,
                    "r1":  0,
                    "r2":  1,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  25,
                    "r6e":  5,
                    "absence":  0,
                    "total":  41
                },
                {
                    "name":  "EGSS-Amrsafwat",
                    "team":  "ME-EGSS13",
                    "ec":  15,
                    "r1":  1,
                    "r2":  1,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  20,
                    "r6e":  5,
                    "absence":  3,
                    "total":  46
                },
                {
                    "name":  "EGSS-hayamhassan",
                    "team":  "ME-EGSS13",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  3,
                    "r6e":  1,
                    "absence":  0,
                    "total":  4
                },
                {
                    "name":  "EGSS-marwaahmed",
                    "team":  "ME-EGSS13",
                    "ec":  4,
                    "r1":  0,
                    "r2":  2,
                    "r3":  1,
                    "r4":  0,
                    "r6d":  18,
                    "r6e":  3,
                    "absence":  0,
                    "total":  28
                },
                {
                    "name":  "EGSS-mohamedha",
                    "team":  "ME-EGSS13",
                    "ec":  23,
                    "r1":  0,
                    "r2":  0,
                    "r3":  1,
                    "r4":  0,
                    "r6d":  14,
                    "r6e":  6,
                    "absence":  3,
                    "total":  47
                },
                {
                    "name":  "EGSS-AdhmGadAllah",
                    "team":  "ME-EGSS30",
                    "ec":  0,
                    "r1":  0,
                    "r2":  2,
                    "r3":  1,
                    "r4":  0,
                    "r6d":  24,
                    "r6e":  8,
                    "absence":  0,
                    "total":  35
                },
                {
                    "name":  "EGSS-alihesham01",
                    "team":  "ME-EGSS30",
                    "ec":  3,
                    "r1":  0,
                    "r2":  1,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  15,
                    "r6e":  2,
                    "absence":  1,
                    "total":  23
                },
                {
                    "name":  "EGSS-titooooo",
                    "team":  "ME-EGSS30",
                    "ec":  17,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  20,
                    "r6e":  2,
                    "absence":  0,
                    "total":  39
                },
                {
                    "name":  "EGSS-abdelrhmanshehata",
                    "team":  "ME-EGSS10",
                    "ec":  3,
                    "r1":  2,
                    "r2":  1,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  20,
                    "r6e":  6,
                    "absence":  2,
                    "total":  34
                },
                {
                    "name":  "EGSS-AhmedShoukry",
                    "team":  "ME-EGSS10",
                    "ec":  0,
                    "r1":  0,
                    "r2":  1,
                    "r3":  3,
                    "r4":  1,
                    "r6d":  25,
                    "r6e":  3,
                    "absence":  0,
                    "total":  33
                },
                {
                    "name":  "EGSS-Mahmoudkhamis",
                    "team":  "ME-EGSS10",
                    "ec":  7,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  25,
                    "r6e":  6,
                    "absence":  0,
                    "total":  38
                }
            ],
    "englishClub":  [
                        {
                            "name":  "EGSS-AbdelrahmanNASEF",
                            "team":  "ME-EGSS05",
                            "base":  91,
                            "book":  2,
                            "att":  2,
                            "pct":  "2.2%",
                            "goal":  41,
                            "need":  39
                        },
                        {
                            "name":  "EGSS-ehabzaky01",
                            "team":  "ME-EGSS05",
                            "base":  109,
                            "book":  4,
                            "att":  2,
                            "pct":  "1.8%",
                            "goal":  50,
                            "need":  48
                        },
                        {
                            "name":  "EGSS-Ibrahimismaiel",
                            "team":  "ME-EGSS05",
                            "base":  112,
                            "book":  19,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  51,
                            "need":  51
                        },
                        {
                            "name":  "EGSS-KhaledGonam",
                            "team":  "ME-EGSS05",
                            "base":  92,
                            "book":  1,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  42,
                            "need":  42
                        },
                        {
                            "name":  "EGSS-OmarMoneb",
                            "team":  "ME-EGSS05",
                            "base":  86,
                            "book":  9,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  39,
                            "need":  39
                        },
                        {
                            "name":  "EGSS-samira01",
                            "team":  "ME-EGSS05",
                            "base":  77,
                            "book":  3,
                            "att":  1,
                            "pct":  "1.3%",
                            "goal":  35,
                            "need":  34
                        },
                        {
                            "name":  "EGSS-ashraqatal",
                            "team":  "ME-EGSS01",
                            "base":  119,
                            "book":  8,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  54,
                            "need":  54
                        },
                        {
                            "name":  "EGSS-juliamonir01",
                            "team":  "ME-EGSS01",
                            "base":  87,
                            "book":  5,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  40,
                            "need":  40
                        },
                        {
                            "name":  "EGSS-mahmoud04",
                            "team":  "ME-EGSS01",
                            "base":  104,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  47,
                            "need":  47
                        },
                        {
                            "name":  "EGSS-negma",
                            "team":  "ME-EGSS01",
                            "base":  113,
                            "book":  16,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  51,
                            "need":  51
                        },
                        {
                            "name":  "EGSS-nohayoussry",
                            "team":  "ME-EGSS01",
                            "base":  135,
                            "book":  12,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  61,
                            "need":  61
                        },
                        {
                            "name":  "EGSS-Amrsafwat",
                            "team":  "ME-EGSS13",
                            "base":  115,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  52,
                            "need":  52
                        },
                        {
                            "name":  "EGSS-hayamhassan",
                            "team":  "ME-EGSS13",
                            "base":  108,
                            "book":  9,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  49,
                            "need":  49
                        },
                        {
                            "name":  "EGSS-marwaahmed",
                            "team":  "ME-EGSS13",
                            "base":  95,
                            "book":  14,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  43,
                            "need":  43
                        },
                        {
                            "name":  "EGSS-mohamedha",
                            "team":  "ME-EGSS13",
                            "base":  86,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  39,
                            "need":  39
                        },
                        {
                            "name":  "EGSS-AdhmGadAllah",
                            "team":  "ME-EGSS30",
                            "base":  81,
                            "book":  1,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  37,
                            "need":  37
                        },
                        {
                            "name":  "EGSS-alihesham01",
                            "team":  "ME-EGSS30",
                            "base":  47,
                            "book":  8,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  22,
                            "need":  22
                        },
                        {
                            "name":  "EGSS-titooooo",
                            "team":  "ME-EGSS30",
                            "base":  109,
                            "book":  4,
                            "att":  2,
                            "pct":  "1.8%",
                            "goal":  50,
                            "need":  48
                        },
                        {
                            "name":  "EGSS-abdelrhmanshehata",
                            "team":  "ME-EGSS10",
                            "base":  77,
                            "book":  17,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  35,
                            "need":  35
                        },
                        {
                            "name":  "EGSS-AhmedShoukry",
                            "team":  "ME-EGSS10",
                            "base":  133,
                            "book":  7,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  60,
                            "need":  60
                        },
                        {
                            "name":  "EGSS-Mahmoudkhamis",
                            "team":  "ME-EGSS10",
                            "base":  124,
                            "book":  11,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  56,
                            "need":  56
                        }
                    ]
};















































































































































































































































































































window.MASTER_OPERATIONS_DATA = MASTER_OPERATIONS_DATA;

let currentOperationsModule = 1;

function switchOperationsModule(modIdx) {
  currentOperationsModule = modIdx;
  [1, 2, 3, 4].forEach(i => {
    const card = document.getElementById(`opCard${i}`);
    const pill = document.getElementById(`opPill${i}`);
    if (card) {
      if (i === modIdx) card.classList.add('active');
      else card.classList.remove('active');
    }
    if (pill) {
      if (i === modIdx) pill.classList.add('active');
      else pill.classList.remove('active');
    }
  });
  renderOperationsTab();
}

function renderOperationsTab() {
  const container = document.getElementById('operationsTableContent');
  if (!container || !window.MASTER_OPERATIONS_DATA) return;

  const teamFilter = document.getElementById('opTeamFilter')?.value || 'ALL';
  const filterByTeam = (list) => {
    if (teamFilter === 'ALL') return list;
    return list.filter(item => {
      const itemTeam = (item.team || '').toUpperCase();
      return itemTeam.includes(teamFilter.replace('ME-', '')) || itemTeam === teamFilter;
    });
  };

  if (currentOperationsModule === 1) {
    // Module 1: SOP Pending Tasks
    const data = filterByTeam(MASTER_OPERATIONS_DATA.sop).sort((a, b) => b.total - a.total);
    let rowsHtml = data.map((r, idx) => {
      const r1Alert = r.r1 > 0 
        ? `<span class="op-badge-below" style="animation: pulse 2s infinite;">${r.r1} Critical</span>` 
        : `<span style="color: var(--text-muted); font-family: var(--font-mono);">0</span>`;
      const absAlert = (r.absence > 0)
        ? `<span style="color: #f43f5e; font-weight: 700; font-family: var(--font-mono);">${r.absence}</span>`
        : `<span style="color: var(--text-muted); font-family: var(--font-mono);">0</span>`;
      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td>${renderTeamBadge(r.team)}</td>
          <td style="font-family: var(--font-mono);">${r.ec}</td>
          <td style="font-family: var(--font-mono); text-align: center;">${r1Alert}</td>
          <td style="font-family: var(--font-mono);">${r.r2}</td>
          <td style="font-family: var(--font-mono);">${r.r3}</td>
          <td style="font-family: var(--font-mono);">${r.r4}</td>
          <td style="font-family: var(--font-mono); color: #38bdf8;">${r.r6d || 0}</td>
          <td style="font-family: var(--font-mono); color: #facc15;">${r.r6e || 0}</td>
          <td style="font-family: var(--font-mono); text-align: center;">${absAlert}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #60a5fa; font-size: 0.95rem;">${r.total}</td>
        </tr>
      `;
    }).join('');

    const totEC = data.reduce((s, r) => s + r.ec, 0);
    const totR1 = data.reduce((s, r) => s + r.r1, 0);
    const totR2 = data.reduce((s, r) => s + r.r2, 0);
    const totR3 = data.reduce((s, r) => s + r.r3, 0);
    const totR4 = data.reduce((s, r) => s + r.r4, 0);
    const totR6d = data.reduce((s, r) => s + (r.r6d || 0), 0);
    const totR6e = data.reduce((s, r) => s + (r.r6e || 0), 0);
    const totAbs = data.reduce((s, r) => s + (r.absence || 0), 0);
    const grandTot = data.reduce((s, r) => s + r.total, 0);

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SS Representative</th>
            <th>Team</th>
            <th>English Club</th>
            <th style="color: #f43f5e; text-align: center;">Round 1 (Awareness)</th>
            <th>Round 2 (Class)</th>
            <th>Round 3 (Habit)</th>
            <th>Round 4 (Feedback)</th>
            <th style="color: #38bdf8;">Round 5 (Upgrade Path)</th>
            <th style="color: #facc15;">Round 6 (Expiring)</th>
            <th style="color: #f43f5e; text-align: center;">Absence Warning</th>
            <th style="color: #60a5fa;">Total Pending Tasks</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background: rgba(59, 130, 246, 0.12); font-weight: 800; border-top: 2px solid #3b82f6;">
            <td colspan="3" style="color: #fff; text-align: left;">TOTAL (SELECTED TEAMS)</td>
            <td style="font-family: var(--font-mono);">${totEC}</td>
            <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center;">${totR1}</td>
            <td style="font-family: var(--font-mono);">${totR2}</td>
            <td style="font-family: var(--font-mono);">${totR3}</td>
            <td style="font-family: var(--font-mono);">${totR4}</td>
            <td style="font-family: var(--font-mono); color: #38bdf8;">${totR6d}</td>
            <td style="font-family: var(--font-mono); color: #facc15;">${totR6e}</td>
            <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center;">${totAbs}</td>
            <td style="font-family: var(--font-mono); color: #60a5fa; font-size: 1rem;">${grandTot}</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (currentOperationsModule === 2) {
    // Module 2: Unfixed Teacher Binding
    const data = filterByTeam(MASTER_OPERATIONS_DATA.unfixed).sort((a, b) => (parseFloat(b.m0Pct) || 0) - (parseFloat(a.m0Pct) || 0) || (parseFloat(b.m1Pct) || 0) - (parseFloat(a.m1Pct) || 0));
    let rowsHtml = data.map((r, idx) => {
      const m0PctNum = parseFloat(r.m0Pct) || 0;
      const m1PctNum = parseFloat(r.m1Pct) || 0;
      const m0Badge = m0PctNum >= 80 ? `<span class="op-badge-met">Met</span>` : `<span class="op-badge-below">Below</span>`;
      const m1Badge = m1PctNum >= 80 ? `<span class="op-badge-met">Met</span>` : `<span class="op-badge-below">Below</span>`;
      const m0Clr = m0PctNum >= 80 ? '#10b981' : m0PctNum >= 50 ? '#f59e0b' : '#f43f5e';
      const m1Clr = m1PctNum >= 80 ? '#10b981' : m1PctNum >= 70 ? '#f59e0b' : '#f43f5e';

      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td>${renderTeamBadge(r.team)}</td>
          <td style="font-family: var(--font-mono);">${r.m0Tot}</td>
          <td style="font-family: var(--font-mono); color: #34d399;">${r.m0Fix}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${m0Clr};">${r.m0Pct}</td>
          <td style="text-align: center;">${m0Badge}</td>
          <td style="font-family: var(--font-mono);">${r.m1Tot}</td>
          <td style="font-family: var(--font-mono); color: #34d399;">${r.m1Fix}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: ${m1Clr};">${r.m1Pct}</td>
          <td style="text-align: center;">${m1Badge}</td>
        </tr>
      `;
    }).join('');

    const sumM0Tot = data.reduce((s, r) => s + r.m0Tot, 0);
    const sumM0Fix = data.reduce((s, r) => s + r.m0Fix, 0);
    const avgM0 = sumM0Tot > 0 ? ((sumM0Fix / sumM0Tot) * 100).toFixed(1) + '%' : '0.0%';

    const sumM1Tot = data.reduce((s, r) => s + r.m1Tot, 0);
    const sumM1Fix = data.reduce((s, r) => s + r.m1Fix, 0);
    const avgM1 = sumM1Tot > 0 ? ((sumM1Fix / sumM1Tot) * 100).toFixed(1) + '%' : '0.0%';

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SS Representative</th>
            <th>Team</th>
            <th>M0 Leads</th>
            <th>M0 Fixed</th>
            <th>M0 Fix %</th>
            <th style="text-align: center;">vs 80% Target</th>
            <th>M1 Leads</th>
            <th>M1 Fixed</th>
            <th>M1 Fix %</th>
            <th style="text-align: center;">vs 80% Target</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background: rgba(16, 185, 129, 0.12); font-weight: 800; border-top: 2px solid #10b981;">
            <td colspan="3" style="color: #fff; text-align: left;">TOTAL / OVERALL RATE</td>
            <td style="font-family: var(--font-mono);">${sumM0Tot}</td>
            <td style="font-family: var(--font-mono); color: #34d399;">${sumM0Fix}</td>
            <td style="font-family: var(--font-mono); color: #10b981;">${avgM0}</td>
            <td style="text-align: center;">${parseFloat(avgM0) >= 80 ? '<span class="op-badge-met">Met</span>' : '<span class="op-badge-below">Below</span>'}</td>
            <td style="font-family: var(--font-mono);">${sumM1Tot}</td>
            <td style="font-family: var(--font-mono); color: #34d399;">${sumM1Fix}</td>
            <td style="font-family: var(--font-mono); color: #10b981;">${avgM1}</td>
            <td style="text-align: center;">${parseFloat(avgM1) >= 80 ? '<span class="op-badge-met">Met</span>' : '<span class="op-badge-below">Below</span>'}</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (currentOperationsModule === 3) {
    // Module 3: Class Consumption & Zero-Class (Official 16-Column Pure Schema)
    const data = filterByTeam(MASTER_OPERATIONS_DATA.consumption || []).sort((a, b) => { const rateA = a.total > 0 ? ((a.total - a.c0) / a.total) : 0; const rateB = b.total > 0 ? ((b.total - b.c0) / b.total) : 0; return rateB - rateA || (b.total - a.total); });
    let rowsHtml = data.map((r, idx) => {
      const zeroPct = r.total > 0 ? ((r.c0 / r.total) * 100).toFixed(1) : '0.0';
      const c12_14 = r.c12_14 || 0;
      const c15 = r.c15 || 0;
      const p4 = r.total > 0 ? (((r.c4_7 + r.c8_11 + c12_14 + c15) / r.total) * 100).toFixed(1) : '0.0';
      const p8 = r.total > 0 ? (((r.c8_11 + c12_14 + c15) / r.total) * 100).toFixed(1) : '0.0';
      const p12 = r.total > 0 ? (((c12_14 + c15) / r.total) * 100).toFixed(1) : '0.0';
      const p15 = r.total > 0 ? ((c15 / r.total) * 100).toFixed(1) : '0.0';
      const zeroClr = parseFloat(zeroPct) > 20 ? '#f43f5e' : parseFloat(zeroPct) > 10 ? '#f59e0b' : '#10b981';
      const avgClasses = r.avg_classes ? r.avg_classes.toFixed(1) : (r.total > 0 ? ((r.total_classes || 0) / r.total).toFixed(1) : '0.0');

      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td>${renderTeamBadge(r.team)}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: #fff;">${r.total}</td>
          <td style="font-family: var(--font-mono); color: #38bdf8; font-weight: 600;">${avgClasses}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: #f43f5e; text-align: center; background: rgba(244, 63, 94, 0.08);">${r.c0}</td>
          <td style="font-family: var(--font-mono);">${r.c1_3}</td>
          <td style="font-family: var(--font-mono);">${r.c4_7}</td>
          <td style="font-family: var(--font-mono);">${r.c8_11}</td>
          <td style="font-family: var(--font-mono);">${c12_14}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #10b981;">${c15}</td>
          <td style="font-family: var(--font-mono); color: ${zeroClr}; font-weight: 700;">${zeroPct}%</td>
          <td style="font-family: var(--font-mono);">${p4}%</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #38bdf8;">${p8}%</td>
          <td style="font-family: var(--font-mono);">${p12}%</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #10b981;">${p15}%</td>
        </tr>
      `;
    }).join('');

    const sumTot = data.reduce((s, r) => s + r.total, 0);
    const sumC0 = data.reduce((s, r) => s + r.c0, 0);
    const sumC1_3 = data.reduce((s, r) => s + r.c1_3, 0);
    const sumC4_7 = data.reduce((s, r) => s + r.c4_7, 0);
    const sumC8_11 = data.reduce((s, r) => s + r.c8_11, 0);
    const sumC12_14 = data.reduce((s, r) => s + (r.c12_14 || 0), 0);
    const sumC15 = data.reduce((s, r) => s + (r.c15 || 0), 0);
    const sumTotalClasses = data.reduce((s, r) => s + (r.total_classes || 0), 0);
    const avgSecClasses = sumTot > 0 ? (sumTotalClasses / sumTot).toFixed(1) : '0.0';
    const overallZeroPct = sumTot > 0 ? ((sumC0 / sumTot) * 100).toFixed(1) + '%' : '0.0%';
    const overallP4 = sumTot > 0 ? (((sumC4_7 + sumC8_11 + sumC12_14 + sumC15) / sumTot) * 100).toFixed(1) + '%' : '0.0%';
    const overallP8 = sumTot > 0 ? (((sumC8_11 + sumC12_14 + sumC15) / sumTot) * 100).toFixed(1) + '%' : '0.0%';
    const overallP12 = sumTot > 0 ? (((sumC12_14 + sumC15) / sumTot) * 100).toFixed(1) + '%' : '0.0%';
    const overallP15 = sumTot > 0 ? ((sumC15 / sumTot) * 100).toFixed(1) + '%' : '0.0%';

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SS Representative</th>
            <th>Team</th>
            <th>Total Students</th>
            <th>Avg Classes</th>
            <th style="color: #f43f5e; text-align: center;">0 Classes</th>
            <th>1–3 Classes</th>
            <th>4–7 Classes</th>
            <th>8–11 Classes</th>
            <th>12–14 Classes</th>
            <th style="color: #10b981;">&ge; 15 Classes</th>
            <th style="color: #f59e0b;">0 %</th>
            <th>&ge; 4 %</th>
            <th style="color: #38bdf8;">&ge; 8 %</th>
            <th>&ge; 12 %</th>
            <th style="color: #10b981;">&ge; 15 %</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background: rgba(249, 115, 22, 0.12); font-weight: 800; border-top: 2px solid #f97316;">
            <td colspan="3" style="color: #fff; text-align: left;">TOTAL / SECTOR AVERAGE</td>
            <td style="font-family: var(--font-mono); color: #fff;">${sumTot}</td>
            <td style="font-family: var(--font-mono); color: #38bdf8;">${avgSecClasses}</td>
            <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center;">${sumC0}</td>
            <td style="font-family: var(--font-mono);">${sumC1_3}</td>
            <td style="font-family: var(--font-mono);">${sumC4_7}</td>
            <td style="font-family: var(--font-mono);">${sumC8_11}</td>
            <td style="font-family: var(--font-mono);">${sumC12_14}</td>
            <td style="font-family: var(--font-mono); color: #10b981;">${sumC15}</td>
            <td style="font-family: var(--font-mono); color: #f59e0b;">${overallZeroPct}</td>
            <td style="font-family: var(--font-mono);">${overallP4}</td>
            <td style="font-family: var(--font-mono); color: #38bdf8;">${overallP8}</td>
            <td style="font-family: var(--font-mono);">${overallP12}</td>
            <td style="font-family: var(--font-mono); color: #10b981;">${overallP15}</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (currentOperationsModule === 4) {
    // Module 4: English Club (45% Target)
    const data = filterByTeam(MASTER_OPERATIONS_DATA.englishClub);
    let rowsHtml = data.map((r, idx) => {
      const pctNum = parseFloat(r.pct) || 0;
      const pctClr = pctNum >= 45 ? '#10b981' : pctNum >= 30 ? '#f59e0b' : '#f43f5e';
      const needBadge = r.need === 0 
        ? `<span class="op-badge-met">Goal Met 🎉</span>` 
        : `<span style="font-family: var(--font-mono); font-weight: 700; color: #fbbf24;">${r.need} IDs needed</span>`;

      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td>${renderTeamBadge(r.team)}</td>
          <td style="font-family: var(--font-mono); color: #fff;">${r.base}</td>
          <td style="font-family: var(--font-mono);">${r.book}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #c084fc;">${r.att}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: ${pctClr};">${r.pct}</td>
          <td style="font-family: var(--font-mono); color: #60a5fa;">${r.goal}</td>
          <td style="text-align: center;">${needBadge}</td>
        </tr>
      `;
    }).join('');

    const sumBase = data.reduce((s, r) => s + r.base, 0);
    const sumBook = data.reduce((s, r) => s + r.book, 0);
    const sumAtt = data.reduce((s, r) => s + r.att, 0);
    const sumGoal = data.reduce((s, r) => s + r.goal, 0);
    const sumNeed = data.reduce((s, r) => s + r.need, 0);
    const avgAttPct = sumBase > 0 ? ((sumAtt / sumBase) * 100).toFixed(1) + '%' : '0.0%';

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SS Representative</th>
            <th>Team</th>
            <th>Student Base</th>
            <th>Bookings</th>
            <th style="color: #c084fc;">Attended</th>
            <th>Attendance %</th>
            <th style="color: #60a5fa;">45% Goal (IDs)</th>
            <th style="text-align: center; color: #fbbf24;">Gap to 45% Goal</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background: rgba(168, 85, 247, 0.12); font-weight: 800; border-top: 2px solid #a855f7;">
            <td colspan="3" style="color: #fff; text-align: left;">TOTAL (SELECTED TEAMS)</td>
            <td style="font-family: var(--font-mono); color: #fff;">${sumBase}</td>
            <td style="font-family: var(--font-mono);">${sumBook}</td>
            <td style="font-family: var(--font-mono); color: #c084fc; font-size: 0.95rem;">${sumAtt}</td>
            <td style="font-family: var(--font-mono); color: #a855f7;">${avgAttPct}</td>
            <td style="font-family: var(--font-mono); color: #60a5fa;">${sumGoal}</td>
            <td style="text-align: center; font-family: var(--font-mono); color: #fbbf24;">${sumNeed} IDs needed</td>
          </tr>
        </tfoot>
      </table>
    `;
  }
}



// =========================================================================
// REP PERSONAL PORTAL & SELF-SERVICE DOWNLOAD
// =========================================================================

const LEADS_SUMMARY = {
    "EGSS-juliamonir01":  {
                              "ccCount":  264,
                              "ftCount":  76,
                              "sopCount":  30,
                              "ecCount":  87,
                              "totalLeads":  457
                          },
    "EGSS-marwaahmed":  {
                            "ccCount":  251,
                            "ftCount":  54,
                            "sopCount":  28,
                            "ecCount":  95,
                            "totalLeads":  428
                        },
    "EGSS-titooooo":  {
                          "ccCount":  248,
                          "ftCount":  48,
                          "sopCount":  39,
                          "ecCount":  109,
                          "totalLeads":  444
                      },
    "EGSS-nohayoussry":  {
                             "ccCount":  253,
                             "ftCount":  44,
                             "sopCount":  41,
                             "ecCount":  135,
                             "totalLeads":  473
                         },
    "EGSS-ashraqatal":  {
                            "ccCount":  253,
                            "ftCount":  85,
                            "sopCount":  24,
                            "ecCount":  119,
                            "totalLeads":  481
                        },
    "EGSS-mohamedha":  {
                           "ccCount":  213,
                           "ftCount":  67,
                           "sopCount":  47,
                           "ecCount":  86,
                           "totalLeads":  413
                       },
    "EGSS-abdelrahmannasef":  {
                                  "ccCount":  219,
                                  "ftCount":  39,
                                  "sopCount":  46,
                                  "ecCount":  91,
                                  "totalLeads":  395
                              },
    "EGSS-alihesham01":  {
                             "ccCount":  143,
                             "ftCount":  38,
                             "sopCount":  23,
                             "ecCount":  47,
                             "totalLeads":  251
                         },
    "EGSS-samira01":  {
                          "ccCount":  244,
                          "ftCount":  57,
                          "sopCount":  17,
                          "ecCount":  77,
                          "totalLeads":  395
                      },
    "EGSS-mahmoudkhamis":  {
                               "ccCount":  280,
                               "ftCount":  55,
                               "sopCount":  38,
                               "ecCount":  124,
                               "totalLeads":  497
                           },
    "EGSS-adhmgadallah":  {
                              "ccCount":  249,
                              "ftCount":  62,
                              "sopCount":  35,
                              "ecCount":  81,
                              "totalLeads":  427
                          },
    "EGSS-amrsafwat":  {
                           "ccCount":  268,
                           "ftCount":  61,
                           "sopCount":  46,
                           "ecCount":  115,
                           "totalLeads":  490
                       },
    "EGSS-hayamhassan":  {
                             "ccCount":  149,
                             "ftCount":  17,
                             "sopCount":  4,
                             "ecCount":  108,
                             "totalLeads":  278
                         },
    "EGSS-mahmoud04":  {
                           "ccCount":  294,
                           "ftCount":  58,
                           "sopCount":  63,
                           "ecCount":  104,
                           "totalLeads":  519
                       },
    "EGSS-ahmedshoukry":  {
                              "ccCount":  281,
                              "ftCount":  60,
                              "sopCount":  33,
                              "ecCount":  133,
                              "totalLeads":  507
                          },
    "EGSS-negma":  {
                       "ccCount":  252,
                       "ftCount":  45,
                       "sopCount":  23,
                       "ecCount":  113,
                       "totalLeads":  433
                   },
    "EGSS-abdelrhmanshehata":  {
                                   "ccCount":  192,
                                   "ftCount":  47,
                                   "sopCount":  34,
                                   "ecCount":  77,
                                   "totalLeads":  350
                               },
    "EGSS-ibrahimismaiel":  {
                                "ccCount":  275,
                                "ftCount":  99,
                                "sopCount":  0,
                                "ecCount":  112,
                                "totalLeads":  486
                            },
    "EGSS-omarmoneb":  {
                           "ccCount":  219,
                           "ftCount":  69,
                           "sopCount":  17,
                           "ecCount":  86,
                           "totalLeads":  391
                       },
    "EGSS-ehabzaky01":  {
                            "ccCount":  238,
                            "ftCount":  39,
                            "sopCount":  35,
                            "ecCount":  109,
                            "totalLeads":  421
                        },
    "EGSS-khaledgonam":  {
                             "ccCount":  265,
                             "ftCount":  67,
                             "sopCount":  14,
                             "ecCount":  92,
                             "totalLeads":  438
                         }
};















// Helper for robust file downloads via Blob & UTF-8 BOM
async function downloadFileWithBlob(url, filename, fallbackGenerator) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      const blob = new Blob(["\uFEFF" + text], { type: 'text/csv;charset=utf-8;' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      return true;
    }
  } catch (err) {
    console.warn('Direct fetch failed for', url, err);
  }

  // Dynamic In-Memory Generation Fallback
  if (typeof fallbackGenerator === 'function') {
    try {
      const generatedCsv = fallbackGenerator();
      if (generatedCsv) {
        const blob = new Blob(["\uFEFF" + generatedCsv], { type: 'text/csv;charset=utf-8;' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        return true;
      }
    } catch (e) {
      console.error('Error generating fallback CSV:', e);
    }
  }
  return false;
}

// Generate in-memory CSV for an individual rep
function generateRepCsvContent(rep) {
  if (!window.MASTER_OPERATIONS_DATA) return '';
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const lines = [
    `# 51TALK BIG TEAM 01 - DAILY ACTIONABLE STUDENT LEADS`,
    `# Representative: ${rep} | Generated: ${now}`,
    ``
  ];

  // 1. SOP
  const sopItems = (window.MASTER_OPERATIONS_DATA.sop || []).filter(r => r.name === rep);
  lines.push(`=== 1. SOP PENDING TASKS (${sopItems.length}) ===`);
  lines.push(`Student_ID,Task_Name,Expiration_Time`);
  sopItems.forEach(item => {
    lines.push(`${item.name || rep},"SOP Pending Tasks (EC:${item.ec}, R1:${item.r1}, R2:${item.r2})",Immediate`);
  });
  lines.push(``);

  // 2. Unfixed
  const unfixedItems = (window.MASTER_OPERATIONS_DATA.unfixed || []).filter(r => r.name === rep);
  lines.push(`=== 2. UNFIXED TEACHER BINDING LEADS (${unfixedItems.length}) ===`);
  lines.push(`Student_ID,Pool_Cohort,Classes_Attended,Call_Priority`);
  unfixedItems.forEach(item => {
    lines.push(`${item.name || rep},"M0:${item.m0Tot} (Fix:${item.m0Fix}) M1:${item.m1Tot}",Priority`);
  });
  lines.push(``);

  // 3. Consumption
  const ccItems = (window.MASTER_OPERATIONS_DATA.consumption || []).filter(r => r.name === rep);
  lines.push(`=== 3. ZERO-CLASS & CLASS CONSUMPTION RESCUE (${ccItems.length}) ===`);
  lines.push(`Student_ID,Pool_Cohort,Classes_Attended,Consumption_Action`);
  ccItems.forEach(item => {
    lines.push(`${item.name || rep},"EndClasses:${item.end_classes} ZeroClass:${item.c0}",Rescue`);
  });
  lines.push(``);

  // 4. English Club
  const ecItems = (window.MASTER_OPERATIONS_DATA.englishClub || []).filter(r => r.name === rep);
  lines.push(`=== 4. ENGLISH CLUB ACTIONABLE LEADS (${ecItems.length}) ===`);
  lines.push(`Student_ID,Level,Completed_Classes,Booking_Status`);
  ecItems.forEach(item => {
    lines.push(`${item.name || rep},General,0,Unattended`);
  });

  return lines.join('\r\n');
}

// Generate in-memory CSV for a Small Team or Sector
function generateTeamCsvContent(teamKey) {
  if (!window.MASTER_OPERATIONS_DATA) return '';
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const isSector = (teamKey === 'BIG_TEAM_01');
  const teamLabel = (LEADS_SUMMARY._TEAMS && LEADS_SUMMARY._TEAMS[teamKey]?.label) || teamKey;

  const filterFn = (item) => {
    if (isSector) return true;
    const t = (item.team || '').toUpperCase();
    return t.includes(teamKey.replace('ME-', '')) || t === teamKey;
  };

  const sops = (window.MASTER_OPERATIONS_DATA.sop || []).filter(filterFn);
  const unfixed = (window.MASTER_OPERATIONS_DATA.unfixed || []).filter(filterFn);
  const cc = (window.MASTER_OPERATIONS_DATA.consumption || []).filter(filterFn);
  const ec = (window.MASTER_OPERATIONS_DATA.englishClub || []).filter(filterFn);

  const lines = [
    `# 51TALK BIG TEAM 01 - SMALL TEAM ACTIONABLE STUDENT LEADS`,
    `# Team: ${teamLabel} | Generated: ${now}`,
    ``,
    `=== 1. SOP PENDING TASKS (${sops.length}) ===`,
    `Representative,Student_ID,Task_Name,Expiration_Time`
  ];
  sops.forEach(item => {
    lines.push(`"${item.name}","TASK_${item.name}","SOP Pending (EC:${item.ec}, R1:${item.r1}, R2:${item.r2})",Immediate`);
  });
  lines.push(``);

  lines.push(`=== 2. UNFIXED TEACHER BINDING LEADS (${unfixed.length}) ===`);
  lines.push(`Representative,Student_ID,Pool_Cohort,Classes_Attended,Call_Priority`);
  unfixed.forEach(item => {
    lines.push(`"${item.name}","UNFIX_${item.name}","M0:${item.m0Tot} (Fix:${item.m0Fix}) M1:${item.m1Tot}",Priority`);
  });
  lines.push(``);

  lines.push(`=== 3. ZERO-CLASS & CLASS CONSUMPTION RESCUE (${cc.length}) ===`);
  lines.push(`Representative,Student_ID,Pool_Cohort,Classes_Attended,Consumption_Action`);
  cc.forEach(item => {
    lines.push(`"${item.name}","CC_${item.name}","EndClasses:${item.end_classes} ZeroClass:${item.c0}",Rescue`);
  });
  lines.push(``);

  lines.push(`=== 4. ENGLISH CLUB ACTIONABLE LEADS (${ec.length}) ===`);
  lines.push(`Representative,Student_ID,Level,Completed_Classes,Booking_Status`);
  ec.forEach(item => {
    lines.push(`"${item.name}","EC_${item.name}",General,0,Unattended`);
  });

  return lines.join('\r\n');
}

// Rep Selection & Download Logic
function initPersonalRepSelect() {
  const sel = document.getElementById('personalRepSelect');
  if (!sel || !window.MASTER_OPERATIONS_DATA) return;

  const reps = (window.MASTER_OPERATIONS_DATA.sop || []).map(r => r.name).sort();
  sel.innerHTML = '<option value="">-- Select Your Name (Sales Rep) --</option>';

  reps.forEach(rep => {
    const opt = document.createElement('option');
    opt.value = rep;
    opt.textContent = rep;
    sel.appendChild(opt);
  });
}

function onPersonalRepSelected() {
  const sel = document.getElementById('personalRepSelect');
  const rep = sel ? sel.value : '';
  const btn = document.getElementById('btnDownloadMyLeads');
  const summaryBox = document.getElementById('repPersonalSummary');
  const cardsContainer = document.getElementById('repSummaryCards');

  if (!rep) {
    if (btn) btn.style.display = 'none';
    if (summaryBox) summaryBox.style.display = 'none';
    return;
  }

  if (btn) {
    btn.style.display = 'inline-flex';
    btn.innerHTML = `📥 Download Leads for ${rep} (.CSV)`;
  }

  const info = (window.LEADS_SUMMARY && window.LEADS_SUMMARY[rep]) || { sopCount: 0, ftCount: 0, ccCount: 0, ecCount: 0, totalLeads: 0 };
  
  if (summaryBox && cardsContainer) {
    summaryBox.style.display = 'block';
    cardsContainer.innerHTML = `
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #93c5fd; font-weight: 700; text-transform: uppercase;">📋 Pending SOP Tasks</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${info.sopCount} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">tasks</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Immediate follow-up & awareness</div>
      </div>

      <div style="background: rgba(160, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 700; text-transform: uppercase;">👩‍🏫 Students Without Fixed Teachers</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${info.ftCount} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">students</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Linking target 80%</div>
      </div>

      <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #fdba74; font-weight: 700; text-transform: uppercase;">🎓 Class Consumption Rescue</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${info.ccCount} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">accounts</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Zero-Class focus</div>
      </div>

      <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #d8b4fe; font-weight: 700; text-transform: uppercase;">🗣️ English Club Qualified Leads</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${info.ecCount} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">qualified</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Targeting 40% adoption</div>
      </div>
    `;
  }
}

async function downloadSelectedRepLeads() {
  const sel = document.getElementById('personalRepSelect');
  const rep = sel ? sel.value : '';
  if (!rep) {
    alert('Please select your name first!');
    return;
  }

  const btn = document.getElementById('btnDownloadMyLeads');
  const origText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '⏳ Preparing Download...';

  // Strict case normalization matching files in leads/ directory
  const cleanRep = rep.substring(0, 5).toUpperCase() + rep.substring(5).toLowerCase();
  const fileUrl = `leads/${cleanRep}.csv`;
  const downloadName = `${rep}_Daily_Actionable_Leads.csv`;

  const fallbackGen = () => generateRepCsvContent(rep);
  const success = await downloadFileWithBlob(fileUrl, downloadName, fallbackGen);

  if (btn) {
    btn.innerHTML = success ? '✅ Downloaded!' : '❌ Error';
    setTimeout(() => { if (btn) btn.innerHTML = origText; }, 2500);
  }
}

// Small Team Selection & Download Logic
function initPersonalTeamSelect() {
  const sel = document.getElementById('personalTeamSelect');
  if (!sel) return;
  // Team options are preserved in HTML
}

function onPersonalTeamSelected() {
  const sel = document.getElementById('personalTeamSelect');
  const teamKey = sel ? sel.value : '';
  const btn = document.getElementById('btnDownloadTeamLeads');
  const summaryBox = document.getElementById('teamPersonalSummary');
  const titleElem = document.getElementById('teamSummaryTitle');
  const badgeElem = document.getElementById('teamRepsCountBadge');
  const cardsContainer = document.getElementById('teamSummaryCards');

  if (!teamKey) {
    if (btn) btn.style.display = 'none';
    if (summaryBox) summaryBox.style.display = 'none';
    return;
  }

  const teamsMap = (window.LEADS_SUMMARY && window.LEADS_SUMMARY._TEAMS) || {};
  const teamData = teamsMap[teamKey] || {
    label: teamKey, repsCount: 0, sopCount: 0, ftCount: 0, ccCount: 0, ecCount: 0, totalLeads: 0
  };

  if (btn) {
    btn.style.display = 'inline-flex';
    btn.innerHTML = `📥 Download Leads for ${teamKey} (.CSV)`;
  }

  if (summaryBox && cardsContainer) {
    summaryBox.style.display = 'block';
    if (titleElem) titleElem.textContent = `📊 ${teamData.label} — Live Operational Summary`;
    if (badgeElem) badgeElem.textContent = `${teamData.repsCount} Sales Reps Active`;

    cardsContainer.innerHTML = `
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #93c5fd; font-weight: 700; text-transform: uppercase;">📋 Pending SOP Tasks</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${teamData.sopCount.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">tasks</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Team follow-up pipeline</div>
      </div>

      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 700; text-transform: uppercase;">👩‍🏫 Students Without Fixed Teachers</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${teamData.ftCount.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">students</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Linking target 80%</div>
      </div>

      <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #fdba74; font-weight: 700; text-transform: uppercase;">🎓 Class Consumption Rescue</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${teamData.ccCount.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">accounts</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Zero-Class focus</div>
      </div>

      <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: var(--radius-md); padding: 12px 16px;">
        <div style="font-size: 0.72rem; color: #d8b4fe; font-weight: 700; text-transform: uppercase;">🗣️ English Club Qualified Leads</div>
        <div style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 900; color: #fff;">${teamData.ecCount.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">qualified</span></div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">Targeting 40% adoption</div>
      </div>
    `;
  }
}

async function downloadSelectedTeamLeads() {
  const sel = document.getElementById('personalTeamSelect');
  const teamKey = sel ? sel.value : '';
  if (!teamKey) {
    alert('Please select a Small Team first!');
    return;
  }

  const btn = document.getElementById('btnDownloadTeamLeads');
  const origText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '⏳ Preparing Download...';

  const fileName = `${teamKey}_Team_Leads.csv`;
  const url = `leads/${fileName}`;

  const fallbackGen = () => generateTeamCsvContent(teamKey);
  const success = await downloadFileWithBlob(url, fileName, fallbackGen);

  if (btn) {
    btn.innerHTML = success ? '✅ Downloaded!' : '❌ Error';
    setTimeout(() => { if (btn) btn.innerHTML = origText; }, 2500);
  }
}

window.onPersonalRepSelected = onPersonalRepSelected;
window.downloadSelectedRepLeads = downloadSelectedRepLeads;
window.initPersonalTeamSelect = initPersonalTeamSelect;
window.onPersonalTeamSelected = onPersonalTeamSelected;
window.downloadSelectedTeamLeads = downloadSelectedTeamLeads;
window.renderConsumptionTab = renderConsumptionTab;
window.renderEnglishClubTab = renderEnglishClubTab;
// =========================================================================
// YESTERDAY SNAPSHOT DATA (4oct — Previous Day Snapshot)
// Structure mirrors MASTER_OPERATIONS_DATA for direct comparison.
// AUTO-UPDATE: This block is regenerated by auto_process_update.ps1 daily.
// SNAPSHOT_DATE: 4oct
// =========================================================================
const YESTERDAY_DATA = {
  date: "4oct",
  label: "Oct 4, 2026",
  consumption: [
    { name: "EGSS-AbdelrahmanNASEF", team: "ME-EGSS05", total: 219, c0: 125, end_classes: 144 },
    { name: "EGSS-ehabzaky01",       team: "ME-EGSS05", total: 238, c0: 136, end_classes: 157 },
    { name: "EGSS-Ibrahimismaiel",   team: "ME-EGSS05", total: 275, c0: 171, end_classes: 138 },
    { name: "EGSS-KhaledGonam",      team: "ME-EGSS05", total: 266, c0: 183, end_classes: 115 },
    { name: "EGSS-OmarMoneb",        team: "ME-EGSS05", total: 195, c0: 119, end_classes: 104 },
    { name: "EGSS-samira01",         team: "ME-EGSS05", total: 182, c0: 112, end_classes: 94 },
    { name: "EGSS-ashraqatal",       team: "ME-EGSS01", total: 308, c0: 183, end_classes: 161 },
    { name: "EGSS-juliamonir01",     team: "ME-EGSS01", total: 214, c0: 133, end_classes: 107 },
    { name: "EGSS-mahmoud04",        team: "ME-EGSS01", total: 230, c0: 143, end_classes: 118 },
    { name: "EGSS-negma",            team: "ME-EGSS01", total: 272, c0: 168, end_classes: 139 },
    { name: "EGSS-nohayoussry",      team: "ME-EGSS01", total: 310, c0: 191, end_classes: 160 },
    { name: "EGSS-Amrsafwat",        team: "ME-EGSS13", total: 290, c0: 180, end_classes: 149 },
    { name: "EGSS-hayamhassan",      team: "ME-EGSS13", total: 265, c0: 164, end_classes: 136 },
    { name: "EGSS-marwaahmed",       team: "ME-EGSS13", total: 245, c0: 152, end_classes: 126 },
    { name: "EGSS-mohamedha",        team: "ME-EGSS13", total: 188, c0: 116, end_classes: 97 },
    { name: "EGSS-abdelrhmanshehata",team: "ME-EGSS10", total: 220, c0: 137, end_classes: 112 },
    { name: "EGSS-AhmedShoukry",     team: "ME-EGSS10", total: 195, c0: 122, end_classes: 99 },
    { name: "EGSS-Mahmoudkhamis",    team: "ME-EGSS10", total: 210, c0: 131, end_classes: 107 },
    { name: "EGSS-AdhmGadAllah",     team: "ME-EGSS30", total: 175, c0: 110, end_classes: 89 },
    { name: "EGSS-alihesham01",      team: "ME-EGSS30", total: 190, c0: 119, end_classes: 97 },
    { name: "EGSS-titooooo",         team: "ME-EGSS30", total: 165, c0: 104, end_classes: 84 }
  ],
  englishClub: [
    { name: "EGSS-AbdelrahmanNASEF", team: "ME-EGSS05", base: 91,  att: 2,  pct: 2.2 },
    { name: "EGSS-ehabzaky01",       team: "ME-EGSS05", base: 109, att: 2,  pct: 1.8 },
    { name: "EGSS-Ibrahimismaiel",   team: "ME-EGSS05", base: 112, att: 0,  pct: 0.0 },
    { name: "EGSS-KhaledGonam",      team: "ME-EGSS05", base: 92,  att: 0,  pct: 0.0 },
    { name: "EGSS-OmarMoneb",        team: "ME-EGSS05", base: 86,  att: 0,  pct: 0.0 },
    { name: "EGSS-samira01",         team: "ME-EGSS05", base: 77,  att: 1,  pct: 1.3 },
    { name: "EGSS-ashraqatal",       team: "ME-EGSS01", base: 119, att: 0,  pct: 0.0 },
    { name: "EGSS-juliamonir01",     team: "ME-EGSS01", base: 87,  att: 0,  pct: 0.0 },
    { name: "EGSS-mahmoud04",        team: "ME-EGSS01", base: 104, att: 0,  pct: 0.0 },
    { name: "EGSS-negma",            team: "ME-EGSS01", base: 113, att: 0,  pct: 0.0 },
    { name: "EGSS-nohayoussry",      team: "ME-EGSS01", base: 135, att: 0,  pct: 0.0 },
    { name: "EGSS-Amrsafwat",        team: "ME-EGSS13", base: 115, att: 0,  pct: 0.0 },
    { name: "EGSS-hayamhassan",      team: "ME-EGSS13", base: 109, att: 0,  pct: 0.0 },
    { name: "EGSS-marwaahmed",       team: "ME-EGSS13", base: 108, att: 0,  pct: 0.0 },
    { name: "EGSS-mohamedha",        team: "ME-EGSS13", base: 130, att: 0,  pct: 0.0 },
    { name: "EGSS-abdelrhmanshehata",team: "ME-EGSS10", base: 102, att: 0,  pct: 0.0 },
    { name: "EGSS-AhmedShoukry",     team: "ME-EGSS10", base: 90,  att: 0,  pct: 0.0 },
    { name: "EGSS-Mahmoudkhamis",    team: "ME-EGSS10", base: 95,  att: 0,  pct: 0.0 },
    { name: "EGSS-AdhmGadAllah",     team: "ME-EGSS30", base: 80,  att: 0,  pct: 0.0 },
    { name: "EGSS-alihesham01",      team: "ME-EGSS30", base: 88,  att: 0,  pct: 0.0 },
    { name: "EGSS-titooooo",         team: "ME-EGSS30", base: 75,  att: 0,  pct: 0.0 }
  ],
  upgrade: [
    { name: "EGSS-nohayoussry",       team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-ashraqatal",        team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-negma",             team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-juliamonir01",      team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-mahmoud04",         team: "ME-EGSS01", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-AbdelrahmanNASEF",  team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-ehabzaky01",        team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-Ibrahimismaiel",    team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-KhaledGonam",       team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-OmarMoneb",         team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-samira01",          team: "ME-EGSS05", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-abdelrhmanshehata", team: "ME-EGSS10", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-AhmedShoukry",      team: "ME-EGSS10", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-Mahmoudkhamis",     team: "ME-EGSS10", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-Amrsafwat",         team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-hayamhassan",       team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-marwaahmed",        team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-mohamedha",         team: "ME-EGSS13", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-AdhmGadAllah",      team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-alihesham01",       team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 0 },
    { name: "EGSS-titooooo",          team: "ME-EGSS30", upgradeM2: 0, upgradeBase: 0 }
  ],
  unfixed:   [
      {
          "name": "EGSS-AbdelrahmanNASEF",
          "team": "ME-EGSS05",
          "m0Tot": 21,
          "m0Fix": 19,
          "m0Pct": "90.5%",
          "m1Tot": 18,
          "m1Fix": 16,
          "m1Pct": "88.9%"
      },
      {
          "name": "EGSS-ehabzaky01",
          "team": "ME-EGSS05",
          "m0Tot": 29,
          "m0Fix": 24,
          "m0Pct": "82.8%",
          "m1Tot": 21,
          "m1Fix": 16,
          "m1Pct": "76.2%"
      },
      {
          "name": "EGSS-Ibrahimismaiel",
          "team": "ME-EGSS05",
          "m0Tot": 25,
          "m0Fix": 15,
          "m0Pct": "60%",
          "m1Tot": 25,
          "m1Fix": 19,
          "m1Pct": "76%"
      },
      {
          "name": "EGSS-KhaledGonam",
          "team": "ME-EGSS05",
          "m0Tot": 15,
          "m0Fix": 6,
          "m0Pct": "40%",
          "m1Tot": 13,
          "m1Fix": 8,
          "m1Pct": "61.5%"
      },
      {
          "name": "EGSS-OmarMoneb",
          "team": "ME-EGSS05",
          "m0Tot": 18,
          "m0Fix": 15,
          "m0Pct": "83.3%",
          "m1Tot": 15,
          "m1Fix": 11,
          "m1Pct": "73.3%"
      },
      {
          "name": "EGSS-samira01",
          "team": "ME-EGSS05",
          "m0Tot": 15,
          "m0Fix": 10,
          "m0Pct": "66.7%",
          "m1Tot": 17,
          "m1Fix": 16,
          "m1Pct": "94.1%"
      },
      {
          "name": "EGSS-ashraqatal",
          "team": "ME-EGSS01",
          "m0Tot": 25,
          "m0Fix": 13,
          "m0Pct": "52%",
          "m1Tot": 29,
          "m1Fix": 22,
          "m1Pct": "75.9%"
      },
      {
          "name": "EGSS-juliamonir01",
          "team": "ME-EGSS01",
          "m0Tot": 14,
          "m0Fix": 9,
          "m0Pct": "64.3%",
          "m1Tot": 22,
          "m1Fix": 16,
          "m1Pct": "72.7%"
      },
      {
          "name": "EGSS-mahmoud04",
          "team": "ME-EGSS01",
          "m0Tot": 18,
          "m0Fix": 12,
          "m0Pct": "66.7%",
          "m1Tot": 31,
          "m1Fix": 29,
          "m1Pct": "93.5%"
      },
      {
          "name": "EGSS-negma",
          "team": "ME-EGSS01",
          "m0Tot": 25,
          "m0Fix": 15,
          "m0Pct": "60%",
          "m1Tot": 34,
          "m1Fix": 32,
          "m1Pct": "94.1%"
      },
      {
          "name": "EGSS-nohayoussry",
          "team": "ME-EGSS01",
          "m0Tot": 17,
          "m0Fix": 15,
          "m0Pct": "88.2%",
          "m1Tot": 27,
          "m1Fix": 25,
          "m1Pct": "92.6%"
      },
      {
          "name": "EGSS-Amrsafwat",
          "team": "ME-EGSS13",
          "m0Tot": 20,
          "m0Fix": 17,
          "m0Pct": "85%",
          "m1Tot": 26,
          "m1Fix": 21,
          "m1Pct": "80.8%"
      },
      {
          "name": "EGSS-hayamhassan",
          "team": "ME-EGSS13",
          "m0Tot": 35,
          "m0Fix": 31,
          "m0Pct": "88.6%",
          "m1Tot": 21,
          "m1Fix": 19,
          "m1Pct": "90.5%"
      },
      {
          "name": "EGSS-marwaahmed",
          "team": "ME-EGSS13",
          "m0Tot": 24,
          "m0Fix": 20,
          "m0Pct": "83.3%",
          "m1Tot": 16,
          "m1Fix": 14,
          "m1Pct": "87.5%"
      },
      {
          "name": "EGSS-mohamedha",
          "team": "ME-EGSS13",
          "m0Tot": 20,
          "m0Fix": 0,
          "m0Pct": "0%",
          "m1Tot": 20,
          "m1Fix": 11,
          "m1Pct": "55%"
      },
      {
          "name": "EGSS-AdhmGadAllah",
          "team": "ME-EGSS30",
          "m0Tot": 19,
          "m0Fix": 17,
          "m0Pct": "89.5%",
          "m1Tot": 25,
          "m1Fix": 23,
          "m1Pct": "92%"
      },
      {
          "name": "EGSS-alihesham01",
          "team": "ME-EGSS30",
          "m0Tot": 20,
          "m0Fix": 13,
          "m0Pct": "65%",
          "m1Tot": 18,
          "m1Fix": 17,
          "m1Pct": "94.4%"
      },
      {
          "name": "EGSS-titooooo",
          "team": "ME-EGSS30",
          "m0Tot": 30,
          "m0Fix": 21,
          "m0Pct": "70%",
          "m1Tot": 19,
          "m1Fix": 17,
          "m1Pct": "89.5%"
      },
      {
          "name": "EGSS-abdelrhmanshehata",
          "team": "ME-EGSS10",
          "m0Tot": 29,
          "m0Fix": 23,
          "m0Pct": "79.3%",
          "m1Tot": 26,
          "m1Fix": 22,
          "m1Pct": "84.6%"
      },
      {
          "name": "EGSS-AhmedShoukry",
          "team": "ME-EGSS10",
          "m0Tot": 26,
          "m0Fix": 23,
          "m0Pct": "88.5%",
          "m1Tot": 34,
          "m1Fix": 29,
          "m1Pct": "85.3%"
      },
      {
          "name": "EGSS-Mahmoudkhamis",
          "team": "ME-EGSS10",
          "m0Tot": 26,
          "m0Fix": 22,
          "m0Pct": "84.6%",
          "m1Tot": 32,
          "m1Fix": 29,
          "m1Pct": "90.6%"
      }
  ]
};
window.YESTERDAY_DATA = YESTERDAY_DATA;

const MTD_TIMELINE_DATA = [
  {
    "day": "2026-10-03",
    "label": "Oct 3",
    "reps": [
      {
        "name": "EGSS-AbdelrahmanNASEF",
        "team": "ME-EGSS05",
        "ccRate": 34.1,
        "ccAct": 74,
        "ccTot": 217,
        "ecRate": 0,
        "ftRate": 92.3,
        "ftUnf": 3,
        "ftTot": 39,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ehabzaky01",
        "team": "ME-EGSS05",
        "ccRate": 29.1,
        "ccAct": 69,
        "ccTot": 237,
        "ecRate": 1.9,
        "ftRate": 77.6,
        "ftUnf": 11,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Ibrahimismaiel",
        "team": "ME-EGSS05",
        "ccRate": 31.9,
        "ccAct": 94,
        "ccTot": 295,
        "ecRate": 0,
        "ftRate": 61.4,
        "ftUnf": 22,
        "ftTot": 57,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-KhaledGonam",
        "team": "ME-EGSS05",
        "ccRate": 20.4,
        "ccAct": 54,
        "ccTot": 265,
        "ecRate": 0,
        "ftRate": 50,
        "ftUnf": 13,
        "ftTot": 26,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-OmarMoneb",
        "team": "ME-EGSS05",
        "ccRate": 23.9,
        "ccAct": 52,
        "ccTot": 218,
        "ecRate": 0,
        "ftRate": 78.8,
        "ftUnf": 7,
        "ftTot": 33,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-samira01",
        "team": "ME-EGSS05",
        "ccRate": 23.5,
        "ccAct": 57,
        "ccTot": 243,
        "ecRate": 1.3,
        "ftRate": 74.2,
        "ftUnf": 8,
        "ftTot": 31,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ashraqatal",
        "team": "ME-EGSS01",
        "ccRate": 29.8,
        "ccAct": 75,
        "ccTot": 252,
        "ecRate": 0,
        "ftRate": 66,
        "ftUnf": 18,
        "ftTot": 53,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-juliamonir01",
        "team": "ME-EGSS01",
        "ccRate": 28.2,
        "ccAct": 74,
        "ccTot": 262,
        "ecRate": 0,
        "ftRate": 62.5,
        "ftUnf": 12,
        "ftTot": 32,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mahmoud04",
        "team": "ME-EGSS01",
        "ccRate": 19,
        "ccAct": 56,
        "ccTot": 294,
        "ecRate": 0,
        "ftRate": 83.7,
        "ftUnf": 8,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-negma",
        "team": "ME-EGSS01",
        "ccRate": 27.1,
        "ccAct": 68,
        "ccTot": 251,
        "ecRate": 0,
        "ftRate": 78,
        "ftUnf": 13,
        "ftTot": 59,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-nohayoussry",
        "team": "ME-EGSS01",
        "ccRate": 26.1,
        "ccAct": 66,
        "ccTot": 253,
        "ecRate": 0,
        "ftRate": 90.9,
        "ftUnf": 4,
        "ftTot": 44,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Amrsafwat",
        "team": "ME-EGSS13",
        "ccRate": 30.5,
        "ccAct": 81,
        "ccTot": 266,
        "ecRate": 0,
        "ftRate": 80.4,
        "ftUnf": 9,
        "ftTot": 46,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-hayamhassan",
        "team": "ME-EGSS13",
        "ccRate": 30.4,
        "ccAct": 45,
        "ccTot": 148,
        "ecRate": 0,
        "ftRate": 80,
        "ftUnf": 11,
        "ftTot": 55,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-marwaahmed",
        "team": "ME-EGSS13",
        "ccRate": 25.1,
        "ccAct": 63,
        "ccTot": 251,
        "ecRate": 0,
        "ftRate": 72.5,
        "ftUnf": 11,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mohamedha",
        "team": "ME-EGSS13",
        "ccRate": 26.3,
        "ccAct": 56,
        "ccTot": 213,
        "ecRate": 0,
        "ftRate": 25,
        "ftUnf": 30,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AdhmGadAllah",
        "team": "ME-EGSS30",
        "ccRate": 27.5,
        "ccAct": 68,
        "ccTot": 247,
        "ecRate": 0,
        "ftRate": 93,
        "ftUnf": 3,
        "ftTot": 43,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-alihesham01",
        "team": "ME-EGSS30",
        "ccRate": 35.2,
        "ccAct": 50,
        "ccTot": 142,
        "ecRate": 0,
        "ftRate": 83.3,
        "ftUnf": 6,
        "ftTot": 36,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-titooooo",
        "team": "ME-EGSS30",
        "ccRate": 29.4,
        "ccAct": 73,
        "ccTot": 248,
        "ecRate": 1.8,
        "ftRate": 79.2,
        "ftUnf": 10,
        "ftTot": 48,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-abdelrhmanshehata",
        "team": "ME-EGSS10",
        "ccRate": 28.8,
        "ccAct": 55,
        "ccTot": 191,
        "ecRate": 0,
        "ftRate": 81.5,
        "ftUnf": 10,
        "ftTot": 54,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AhmedShoukry",
        "team": "ME-EGSS10",
        "ccRate": 25.7,
        "ccAct": 81,
        "ccTot": 315,
        "ecRate": 0,
        "ftRate": 83.3,
        "ftUnf": 10,
        "ftTot": 60,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Mahmoudkhamis",
        "team": "ME-EGSS10",
        "ccRate": 23.1,
        "ccAct": 67,
        "ccTot": 290,
        "ecRate": 0,
        "ftRate": 86.9,
        "ftUnf": 8,
        "ftTot": 61,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      }
    ]
  },
  {
    "day": "2026-10-04",
    "label": "Oct 4",
    "reps": [
      {
        "name": "EGSS-AbdelrahmanNASEF",
        "team": "ME-EGSS05",
        "ccRate": 44.3,
        "ccAct": 97,
        "ccTot": 219,
        "ecRate": 2.2,
        "ftRate": 89.7,
        "ftUnf": 4,
        "ftTot": 39,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ehabzaky01",
        "team": "ME-EGSS05",
        "ccRate": 44.1,
        "ccAct": 105,
        "ccTot": 238,
        "ecRate": 1.8,
        "ftRate": 80,
        "ftUnf": 10,
        "ftTot": 50,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Ibrahimismaiel",
        "team": "ME-EGSS05",
        "ccRate": 38.9,
        "ccAct": 107,
        "ccTot": 275,
        "ecRate": 0,
        "ftRate": 68,
        "ftUnf": 16,
        "ftTot": 50,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-KhaledGonam",
        "team": "ME-EGSS05",
        "ccRate": 32.3,
        "ccAct": 86,
        "ccTot": 266,
        "ecRate": 0,
        "ftRate": 50,
        "ftUnf": 14,
        "ftTot": 28,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-OmarMoneb",
        "team": "ME-EGSS05",
        "ccRate": 36.1,
        "ccAct": 79,
        "ccTot": 219,
        "ecRate": 0,
        "ftRate": 78.8,
        "ftUnf": 7,
        "ftTot": 33,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-samira01",
        "team": "ME-EGSS05",
        "ccRate": 34.6,
        "ccAct": 84,
        "ccTot": 243,
        "ecRate": 1.3,
        "ftRate": 81.3,
        "ftUnf": 6,
        "ftTot": 32,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ashraqatal",
        "team": "ME-EGSS01",
        "ccRate": 43.9,
        "ccAct": 111,
        "ccTot": 253,
        "ecRate": 0,
        "ftRate": 64.8,
        "ftUnf": 19,
        "ftTot": 54,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-juliamonir01",
        "team": "ME-EGSS01",
        "ccRate": 44.7,
        "ccAct": 118,
        "ccTot": 264,
        "ecRate": 0,
        "ftRate": 69.4,
        "ftUnf": 11,
        "ftTot": 36,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mahmoud04",
        "team": "ME-EGSS01",
        "ccRate": 34,
        "ccAct": 100,
        "ccTot": 294,
        "ecRate": 0,
        "ftRate": 83.7,
        "ftUnf": 8,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-negma",
        "team": "ME-EGSS01",
        "ccRate": 44.8,
        "ccAct": 113,
        "ccTot": 252,
        "ecRate": 0,
        "ftRate": 79.7,
        "ftUnf": 12,
        "ftTot": 59,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-nohayoussry",
        "team": "ME-EGSS01",
        "ccRate": 38.3,
        "ccAct": 97,
        "ccTot": 253,
        "ecRate": 0,
        "ftRate": 90.9,
        "ftUnf": 4,
        "ftTot": 44,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Amrsafwat",
        "team": "ME-EGSS13",
        "ccRate": 42.2,
        "ccAct": 113,
        "ccTot": 268,
        "ecRate": 0,
        "ftRate": 82.6,
        "ftUnf": 8,
        "ftTot": 46,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-hayamhassan",
        "team": "ME-EGSS13",
        "ccRate": 42.3,
        "ccAct": 63,
        "ccTot": 149,
        "ecRate": 0,
        "ftRate": 89.3,
        "ftUnf": 6,
        "ftTot": 56,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-marwaahmed",
        "team": "ME-EGSS13",
        "ccRate": 41,
        "ccAct": 103,
        "ccTot": 251,
        "ecRate": 0,
        "ftRate": 85,
        "ftUnf": 6,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mohamedha",
        "team": "ME-EGSS13",
        "ccRate": 41.3,
        "ccAct": 88,
        "ccTot": 213,
        "ecRate": 0,
        "ftRate": 27.5,
        "ftUnf": 29,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AdhmGadAllah",
        "team": "ME-EGSS30",
        "ccRate": 34.1,
        "ccAct": 85,
        "ccTot": 249,
        "ecRate": 0,
        "ftRate": 90.9,
        "ftUnf": 4,
        "ftTot": 44,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-alihesham01",
        "team": "ME-EGSS30",
        "ccRate": 42,
        "ccAct": 60,
        "ccTot": 143,
        "ecRate": 0,
        "ftRate": 78.9,
        "ftUnf": 8,
        "ftTot": 38,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-titooooo",
        "team": "ME-EGSS30",
        "ccRate": 43.1,
        "ccAct": 107,
        "ccTot": 248,
        "ecRate": 1.8,
        "ftRate": 77.6,
        "ftUnf": 11,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-abdelrhmanshehata",
        "team": "ME-EGSS10",
        "ccRate": 46.9,
        "ccAct": 90,
        "ccTot": 192,
        "ecRate": 0,
        "ftRate": 81.8,
        "ftUnf": 10,
        "ftTot": 55,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AhmedShoukry",
        "team": "ME-EGSS10",
        "ccRate": 43.8,
        "ccAct": 123,
        "ccTot": 281,
        "ecRate": 0,
        "ftRate": 86.7,
        "ftUnf": 8,
        "ftTot": 60,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Mahmoudkhamis",
        "team": "ME-EGSS10",
        "ccRate": 34.6,
        "ccAct": 97,
        "ccTot": 280,
        "ecRate": 0,
        "ftRate": 87.9,
        "ftUnf": 7,
        "ftTot": 58,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      }
    ]
  },
  {
    "day": "2026-10-05",
    "label": "Oct 5",
    "reps": [
      {
        "name": "EGSS-AbdelrahmanNASEF",
        "team": "ME-EGSS05",
        "ccRate": 70.8,
        "ccAct": 155,
        "ccTot": 219,
        "ecRate": 2.2,
        "ftRate": 89.7,
        "ftUnf": 4,
        "ftTot": 39,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ehabzaky01",
        "team": "ME-EGSS05",
        "ccRate": 66.8,
        "ccAct": 159,
        "ccTot": 238,
        "ecRate": 1.8,
        "ftRate": 78.4,
        "ftUnf": 11,
        "ftTot": 51,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Ibrahimismaiel",
        "team": "ME-EGSS05",
        "ccRate": 55.3,
        "ccAct": 152,
        "ccTot": 275,
        "ecRate": 0,
        "ftRate": 74,
        "ftUnf": 13,
        "ftTot": 50,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-KhaledGonam",
        "team": "ME-EGSS05",
        "ccRate": 60.4,
        "ccAct": 160,
        "ccTot": 265,
        "ecRate": 0,
        "ftRate": 55.2,
        "ftUnf": 13,
        "ftTot": 29,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-OmarMoneb",
        "team": "ME-EGSS05",
        "ccRate": 59.4,
        "ccAct": 130,
        "ccTot": 219,
        "ecRate": 0,
        "ftRate": 79.4,
        "ftUnf": 7,
        "ftTot": 34,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-samira01",
        "team": "ME-EGSS05",
        "ccRate": 63.9,
        "ccAct": 156,
        "ccTot": 244,
        "ecRate": 1.3,
        "ftRate": 81.3,
        "ftUnf": 6,
        "ftTot": 32,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-ashraqatal",
        "team": "ME-EGSS01",
        "ccRate": 66.4,
        "ccAct": 168,
        "ccTot": 253,
        "ecRate": 0,
        "ftRate": 65.5,
        "ftUnf": 19,
        "ftTot": 55,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-juliamonir01",
        "team": "ME-EGSS01",
        "ccRate": 70.5,
        "ccAct": 186,
        "ccTot": 264,
        "ecRate": 0,
        "ftRate": 65.8,
        "ftUnf": 13,
        "ftTot": 38,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mahmoud04",
        "team": "ME-EGSS01",
        "ccRate": 62.2,
        "ccAct": 183,
        "ccTot": 294,
        "ecRate": 0,
        "ftRate": 89.8,
        "ftUnf": 5,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-negma",
        "team": "ME-EGSS01",
        "ccRate": 70.2,
        "ccAct": 177,
        "ccTot": 252,
        "ecRate": 0,
        "ftRate": 79.7,
        "ftUnf": 12,
        "ftTot": 59,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-nohayoussry",
        "team": "ME-EGSS01",
        "ccRate": 65.2,
        "ccAct": 165,
        "ccTot": 253,
        "ecRate": 0,
        "ftRate": 91.1,
        "ftUnf": 4,
        "ftTot": 45,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Amrsafwat",
        "team": "ME-EGSS13",
        "ccRate": 68.3,
        "ccAct": 183,
        "ccTot": 268,
        "ecRate": 0,
        "ftRate": 80.9,
        "ftUnf": 9,
        "ftTot": 47,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-hayamhassan",
        "team": "ME-EGSS13",
        "ccRate": 77.2,
        "ccAct": 115,
        "ccTot": 149,
        "ecRate": 0,
        "ftRate": 91.1,
        "ftUnf": 5,
        "ftTot": 56,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-marwaahmed",
        "team": "ME-EGSS13",
        "ccRate": 66.1,
        "ccAct": 166,
        "ccTot": 251,
        "ecRate": 0,
        "ftRate": 87.5,
        "ftUnf": 5,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-mohamedha",
        "team": "ME-EGSS13",
        "ccRate": 61,
        "ccAct": 130,
        "ccTot": 213,
        "ecRate": 0,
        "ftRate": 30,
        "ftUnf": 28,
        "ftTot": 40,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AdhmGadAllah",
        "team": "ME-EGSS30",
        "ccRate": 65.9,
        "ccAct": 164,
        "ccTot": 249,
        "ecRate": 0,
        "ftRate": 93.2,
        "ftUnf": 3,
        "ftTot": 44,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-alihesham01",
        "team": "ME-EGSS30",
        "ccRate": 71.3,
        "ccAct": 102,
        "ccTot": 143,
        "ecRate": 0,
        "ftRate": 87.2,
        "ftUnf": 5,
        "ftTot": 39,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-titooooo",
        "team": "ME-EGSS30",
        "ccRate": 69.4,
        "ccAct": 172,
        "ccTot": 248,
        "ecRate": 1.8,
        "ftRate": 79.6,
        "ftUnf": 10,
        "ftTot": 49,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-abdelrhmanshehata",
        "team": "ME-EGSS10",
        "ccRate": 69.3,
        "ccAct": 133,
        "ccTot": 192,
        "ecRate": 0,
        "ftRate": 80.4,
        "ftUnf": 11,
        "ftTot": 56,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-AhmedShoukry",
        "team": "ME-EGSS10",
        "ccRate": 73.7,
        "ccAct": 207,
        "ccTot": 281,
        "ecRate": 0,
        "ftRate": 86.7,
        "ftUnf": 8,
        "ftTot": 60,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      },
      {
        "name": "EGSS-Mahmoudkhamis",
        "team": "ME-EGSS10",
        "ccRate": 71.4,
        "ccAct": 200,
        "ccTot": 280,
        "ecRate": 0,
        "ftRate": 86.2,
        "ftUnf": 8,
        "ftTot": 58,
        "upgRate": 0,
        "upgM2": 0,
        "upgBase": 0,
        "cash": 0,
        "contracts": 0
      }
    ]
  }
];
window.MTD_TIMELINE_DATA = MTD_TIMELINE_DATA;

// =========================================================================
// MTD PERFORMANCE TRAJECTORY & DAILY EVOLUTION (DAY 3 - 31)
// =========================================================================
let mtdChartInstance = null;

function renderMtdTab() {
  const tabEl     = document.getElementById("tab-mtd") || document.getElementById("mtdTabContainer");
  const bannersEl = document.getElementById("mtdKpiBanners");
  const tableEl   = document.getElementById("mtdTableContent");
  const canvas    = document.getElementById("mtdChartCanvas");
  if (!bannersEl || !tableEl) return;

  const timeline = (window.MTD_TIMELINE_DATA && window.MTD_TIMELINE_DATA.length) ? window.MTD_TIMELINE_DATA : [];
  if (!timeline.length) {
    tableEl.innerHTML = '<p style="color:var(--text-muted); padding:20px;">No historical MTD snapshot data available yet.</p>';
    return;
  }

  const metric = (document.getElementById("mtdMetricFilter") || {}).value || "consumption";
  const team   = (document.getElementById("mtdTeamFilter")   || {}).value || "ALL";

  const metricConfig = {
    consumption: { label: "Class Consumption", key: "ccRate", target: 65, color: "#10b981", unit: "%" },
    englishClub: { label: "English Club",       key: "ecRate", target: 45, color: "#38bdf8", unit: "%" },
    unfixed:     { label: "Teacher Binding",   key: "ftRate", target: 80, color: "#f59e0b", unit: "%" },
    upgrade:     { label: "Early Upgrade M2",  key: "upgRate", target: 20, color: "#c084fc", unit: "%" }
  };

  const mCfg = metricConfig[metric] || metricConfig.consumption;
  const dayLabels = timeline.map(t => t.label);

  const teamColors = {
    "EGSS01": "#6366f1",
    "EGSS05": "#06b6d4",
    "EGSS10": "#10b981",
    "EGSS13": "#f59e0b",
    "EGSS30": "#f43f5e"
  };

  function cleanTeamKey(t) { return String(t || '').replace(/^ME-/, '').toUpperCase(); }

  // 1. Calculate macro averages per day for selected team/sector
  const dailyMacroRates = timeline.map(daySnap => {
    let reps = daySnap.reps || [];
    if (team !== "ALL") {
      reps = reps.filter(r => cleanTeamKey(r.team) === cleanTeamKey(team));
    }
    const sum = reps.reduce((s, r) => s + (Number(r[mCfg.key]) || 0), 0);
    return reps.length ? Math.round((sum / reps.length) * 10) / 10 : 0;
  });

  const baselineRate = dailyMacroRates[0] || 0;
  const currentRate  = dailyMacroRates[dailyMacroRates.length - 1] || 0;
  const netDelta     = currentRate - baselineRate;
  const targetGap    = Math.max(0, mCfg.target - currentRate);

  // Velocity Calculation (Days remaining in October: 31 - current day 5 = 26 days)
  const currentDayNum = 5;
  const daysRemaining = 31 - currentDayNum;
  const dailyNeeded = daysRemaining > 0 ? (targetGap / daysRemaining) : 0;

  // Render KPI Banners
  function deltaBadge(d) {
    if (d > 0.05)  return '<span style="color:#10b981; font-weight:800;">▲ +' + d.toFixed(1) + '%</span>';
    if (d < -0.05) return '<span style="color:#f43f5e; font-weight:800;">▼ ' + d.toFixed(1) + '%</span>';
    return '<span style="color:#94a3b8;">= 0.0%</span>';
  }

  bannersEl.innerHTML =
    '<div class="kpi-card" style="border-top: 4px solid #64748b;">' +
      '<div class="kpi-label">Day 3 Starting Baseline</div>' +
      '<div style="font-size:1.8rem; font-weight:900; color:#e2e8f0; margin:6px 0 2px; font-family:var(--font-mono);">' + baselineRate.toFixed(1) + '%</div>' +
      '<div style="font-size:0.75rem; color:var(--text-muted);">Recorded on 3 Oct 2026</div>' +
    '</div>' +
    '<div class="kpi-card" style="border-top: 4px solid ' + mCfg.color + ';">' +
      '<div class="kpi-label">Current Live Standing (Day 5)</div>' +
      '<div style="font-size:1.8rem; font-weight:900; color:' + mCfg.color + '; margin:6px 0 2px; font-family:var(--font-mono);">' + currentRate.toFixed(1) + '%</div>' +
      '<div style="font-size:0.75rem; color:var(--text-secondary);">' + mCfg.label + ' MTD Snapshot</div>' +
    '</div>' +
    '<div class="kpi-card" style="border-top: 4px solid #10b981;">' +
      '<div class="kpi-label">MTD Net Trajectory Delta</div>' +
      '<div style="font-size:1.8rem; font-weight:900; color:#10b981; margin:6px 0 2px; font-family:var(--font-mono);">' + (netDelta >= 0 ? '+' : '') + netDelta.toFixed(1) + '%</div>' +
      '<div style="font-size:0.75rem; color:var(--text-secondary);">' + deltaBadge(netDelta) + ' total month-to-date gain</div>' +
    '</div>' +
    '<div class="kpi-card" style="border-top: 4px solid #f59e0b;">' +
      '<div class="kpi-label">Pacing Target & Velocity</div>' +
      '<div style="font-size:1.8rem; font-weight:900; color:' + (targetGap === 0 ? '#10b981' : '#f59e0b') + '; margin:6px 0 2px; font-family:var(--font-mono);">' +
        (targetGap === 0 ? 'GOAL HIT' : (targetGap.toFixed(1) + 'pp gap')) +
      '</div>' +
      '<div style="font-size:0.75rem; color:var(--text-muted);">' +
        (targetGap === 0 ? 'Pacing ahead of official goal' : ('+' + dailyNeeded.toFixed(2) + 'pp / day needed for Day 31')) +
      '</div>' +
    '</div>';

  // 2. Render Chart.js Chart
  if (canvas && typeof Chart !== "undefined") {
    const ctx = canvas.getContext("2d");
    const existingChart = (typeof Chart.getChart === "function") ? Chart.getChart(canvas) : mtdChartInstance;
    if (existingChart) {
      try { existingChart.destroy(); } catch (e) {}
      mtdChartInstance = null;
    }

    const datasets = [];

    if (team === "ALL") {
      // Sector Macro Line
      datasets.push({
        label: "Big Team 01 (Macro Sector Avg)",
        data: dailyMacroRates,
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        borderWidth: 3.5,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#a855f7"
      });

      // 5 Small Team Lines
      const teamKeys = ["EGSS01", "EGSS05", "EGSS10", "EGSS13", "EGSS30"];
      teamKeys.forEach(tk => {
        const teamColor = teamColors[tk] || "#94a3b8";
        const teamRates = timeline.map(daySnap => {
          const reps = (daySnap.reps || []).filter(r => cleanTeamKey(r.team) === tk);
          const sum = reps.reduce((s, r) => s + (Number(r[mCfg.key]) || 0), 0);
          return reps.length ? Math.round((sum / reps.length) * 10) / 10 : 0;
        });

        const cfg = (typeof getTeamConfig === "function") ? getTeamConfig(tk) : {};
        const teamName = cfg.fullName || ("ME-" + tk);

        datasets.push({
          label: teamName,
          data: teamRates,
          borderColor: teamColor,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: teamColor
        });
      });
    } else {
      // Selected Small Team Line
      const teamClean = cleanTeamKey(team);
      const teamColor = teamColors[teamClean] || mCfg.color;
      datasets.push({
        label: team + " Team Average",
        data: dailyMacroRates,
        borderColor: teamColor,
        backgroundColor: teamColor.replace(")", ", 0.15)").replace("rgb", "rgba"),
        borderWidth: 3.5,
        tension: 0.35,
        pointRadius: 6,
        pointBackgroundColor: teamColor
      });

      // Rep Lines for selected team
      const latestReps = (timeline[timeline.length - 1].reps || []).filter(r => cleanTeamKey(r.team) === teamClean);
      latestReps.forEach((rep, idx) => {
        const repRates = timeline.map(daySnap => {
          const r = (daySnap.reps || []).find(x => x.name.toLowerCase() === rep.name.toLowerCase());
          return r ? (Number(r[mCfg.key]) || 0) : 0;
        });

        const repHue = (idx * 55) % 360;
        const repColor = 'hsl(' + repHue + ', 75%, 65%)';

        datasets.push({
          label: rep.name.replace("EGSS-", ""),
          data: repRates,
          borderColor: repColor,
          backgroundColor: "transparent",
          borderWidth: 1.5,
          tension: 0.25,
          pointRadius: 3,
          pointHoverRadius: 5,
          hidden: idx >= 4 // Show top 4 by default, allow unhiding
        });
      });
    }

    // Benchmark Horizontal Target Line
    const targetData = dayLabels.map(() => mCfg.target);
    datasets.push({
      label: mCfg.label + " Benchmark Goal (" + mCfg.target + "%)",
      data: targetData,
      borderColor: "rgba(255, 255, 255, 0.5)",
      borderWidth: 2,
      borderDash: [6, 6],
      pointRadius: 0,
      fill: false
    });

    mtdChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: dayLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#cbd5e1",
              font: { size: 11, family: "Inter" },
              padding: 14,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "rgba(99, 102, 241, 0.3)",
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                return "  " + context.dataset.label + ": " + Number(context.parsed.y).toFixed(1) + "%";
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94a3b8", font: { family: "JetBrains Mono", size: 11 } }
          },
          y: {
            min: 0,
            max: Math.max(100, Math.ceil((Math.max(...dailyMacroRates) + 15) / 10) * 10),
            grid: { color: "rgba(255, 255, 255, 0.07)" },
            ticks: {
              color: "#94a3b8",
              font: { family: "JetBrains Mono", size: 11 },
              callback: function(value) { return value + "%"; }
            }
          }
        }
      }
    });
  }

  // 3. Build Detailed Rep Progression Table
  const latestSnap = timeline[timeline.length - 1];
  let repsList = latestSnap.reps || [];
  if (team !== "ALL") {
    repsList = repsList.filter(r => cleanTeamKey(r.team) === cleanTeamKey(team));
  }

  // Pre-calculate progression history for each rep
  const repRows = repsList.map(rep => {
    const history = timeline.map(daySnap => {
      const match = (daySnap.reps || []).find(x => x.name.toLowerCase() === rep.name.toLowerCase());
      return match ? (Number(match[mCfg.key]) || 0) : 0;
    });

    const valD3 = history[0] || 0;
    const valD4 = history[1] !== undefined ? history[1] : valD3;
    const valD5 = history[history.length - 1] || 0;
    const repDelta = valD5 - valD3;

    let statusBadge = '<span style="background:rgba(148,163,184,0.15); color:#94a3b8; font-size:0.7rem; padding:3px 8px; border-radius:6px; font-weight:700;">🟡 Steady</span>';
    if (repDelta >= 20 || valD5 >= mCfg.target) {
      statusBadge = '<span style="background:rgba(16,185,129,0.2); color:#10b981; font-size:0.7rem; padding:3px 8px; border-radius:6px; font-weight:700;">🚀 High Velocity</span>';
    } else if (repDelta > 5) {
      statusBadge = '<span style="background:rgba(56,189,248,0.2); color:#38bdf8; font-size:0.7rem; padding:3px 8px; border-radius:6px; font-weight:700;">🟢 On Track</span>';
    } else if (repDelta < -2) {
      statusBadge = '<span style="background:rgba(244,63,94,0.2); color:#f43f5e; font-size:0.7rem; padding:3px 8px; border-radius:6px; font-weight:700;">🔴 Needs Push</span>';
    }

    return {
      name: rep.name,
      team: rep.team,
      valD3, valD4, valD5,
      delta: repDelta,
      statusBadge,
      history
    };
  });

  // Sort reps by current day value descending
  repRows.sort((a, b) => b.valD5 - a.valD5);

  function valCell(v, target) {
    const color = v >= target ? "#10b981" : v >= target * 0.8 ? "#f59e0b" : "#cbd5e1";
    return '<td style="font-family:var(--font-mono); font-weight:700; color:' + color + '; text-align:center;">' + v.toFixed(1) + '%</td>';
  }

  function deltaPill(d) {
    const c = d > 0.05 ? "#10b981" : d < -0.05 ? "#f43f5e" : "#64748b";
    const sym = d > 0.05 ? "▲ +" : d < -0.05 ? "▼ " : "= ";
    return '<td style="color:' + c + '; font-weight:800; font-family:var(--font-mono); text-align:center;">' + sym + Math.abs(d).toFixed(1) + '%</td>';
  }

  function sparklineBar(history) {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = (max - min) || 1;
    const barsHtml = history.map(h => {
      const pct = Math.max(15, Math.min(100, Math.round(((h - min) / range) * 85 + 15)));
      return '<div style="flex:1; background:rgba(99,102,241,0.6); height:' + pct + '%; border-radius:2px 2px 0 0;" title="' + h.toFixed(1) + '%"></div>';
    }).join("");

    return '<div style="display:flex; align-items:flex-end; gap:3px; height:24px; width:65px; margin:0 auto; background:rgba(255,255,255,0.04); padding:2px; border-radius:4px;">' + barsHtml + '</div>';
  }

  const tableRows = repRows.map((r, idx) => {
    const badge = (typeof renderTeamBadge === "function") ? renderTeamBadge(r.team) : r.team;
    const rowBg = idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent";

    return '<tr style="background:' + rowBg + '; transition: background 0.2s;" onmouseover="this.style.background=\'rgba(99,102,241,0.08)\'" onmouseout="this.style.background=\'' + rowBg + '\'">' +
      '<td style="font-weight:700; color:#e2e8f0; white-space:nowrap; padding:10px 14px;">' + r.name.replace("EGSS-", "") + '</td>' +
      '<td style="padding:10px 14px;">' + badge + '</td>' +
      valCell(r.valD3, mCfg.target) +
      valCell(r.valD4, mCfg.target) +
      valCell(r.valD5, mCfg.target) +
      deltaPill(r.delta) +
      '<td style="text-align:center; padding:6px 10px;">' + sparklineBar(r.history) + '</td>' +
      '<td style="text-align:center; padding:6px 14px;">' + r.statusBadge + '</td>' +
    '</tr>';
  }).join("");

  // Sector Totals Row
  const totD3 = timeline[0] ? (timeline[0].reps.reduce((s,r) => s + (Number(r[mCfg.key]) || 0), 0) / timeline[0].reps.length) : 0;
  const totD4 = timeline[1] ? (timeline[1].reps.reduce((s,r) => s + (Number(r[mCfg.key]) || 0), 0) / timeline[1].reps.length) : 0;
  const totD5 = timeline[2] ? (timeline[2].reps.reduce((s,r) => s + (Number(r[mCfg.key]) || 0), 0) / timeline[2].reps.length) : 0;
  const totDelta = totD5 - totD3;

  const totalsRowHtml = '<tr style="background:rgba(99,102,241,0.15); border-top: 2px solid rgba(99,102,241,0.4); font-size:0.88rem;">' +
    '<td style="font-weight:900; color:#a5b4fc; padding:12px 14px;">SECTOR TOTAL (AVG)</td>' +
    '<td style="font-size:0.74rem; color:#94a3b8; padding:12px 14px;">' + repRows.length + ' Reps</td>' +
    valCell(totD3, mCfg.target) +
    valCell(totD4, mCfg.target) +
    valCell(totD5, mCfg.target) +
    deltaPill(totDelta) +
    '<td style="text-align:center;">' + sparklineBar([totD3, totD4, totD5]) + '</td>' +
    '<td style="text-align:center; font-weight:700; color:#10b981;">' + (totDelta >= 0 ? '▲ Accelerating' : '▼ Declining') + '</td>' +
  '</tr>';

  tableEl.innerHTML =
    '<table style="width:100%; border-collapse:collapse; font-size:0.85rem;">' +
      '<thead>' +
        '<tr style="background: rgba(99,102,241,0.15); border-bottom: 2px solid rgba(99,102,241,0.3);">' +
          '<th style="padding:12px 14px; text-align:left; color:#a5b4fc; font-weight:800;">Representative</th>' +
          '<th style="padding:12px 14px; text-align:left; color:#a5b4fc; font-weight:800;">Team</th>' +
          '<th style="padding:12px 14px; text-align:center; color:#94a3b8; font-weight:700;">Day 3 (3 Oct)</th>' +
          '<th style="padding:12px 14px; text-align:center; color:#94a3b8; font-weight:700;">Day 4 (4 Oct)</th>' +
          '<th style="padding:12px 14px; text-align:center; color:' + mCfg.color + '; font-weight:800;">Day 5 (Today)</th>' +
          '<th style="padding:12px 14px; text-align:center; color:#10b981; font-weight:800;">MTD Delta</th>' +
          '<th style="padding:12px 14px; text-align:center; color:#a5b4fc; font-weight:700;">Trajectory</th>' +
          '<th style="padding:12px 14px; text-align:center; color:#a5b4fc; font-weight:700;">Status</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        (tableRows || '<tr><td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">No records match the selected team filter.</td></tr>') +
      '</tbody>' +
      '<tfoot>' +
        totalsRowHtml +
      '</tfoot>' +
    '</table>' +
    '<div style="margin-top:14px; padding:10px 16px; background:rgba(15,23,42,0.5); border-radius:8px; font-size:0.75rem; color:var(--text-muted);">' +
      '<strong>MTD Progression Legend:</strong>' +
      '<span style="color:#10b981; margin-left:10px;">▲ Positive Movement since 3 Oct baseline</span>' +
      '<span style="color:#f43f5e; margin-left:10px;">▼ Rate Drop</span>' +
      '&nbsp;|&nbsp; Official Target for ' + mCfg.label + ': <strong style="color:#fff;">' + mCfg.target + '%</strong>' +
    '</div>';
}
window.renderMtdTab = renderMtdTab;



// =========================================================================
// PERFORMANCE COMPARISON TAB (Yesterday vs Today)
// =========================================================================
function renderComparisonTab() {
  const bannerEl = document.getElementById("cmpKpiBanners");
  const tableEl  = document.getElementById("cmpTableContent");
  if (!bannerEl || !tableEl) return;

  const todayCC  = (window.MASTER_OPERATIONS_DATA && window.MASTER_OPERATIONS_DATA.consumption) || [];
  const todayEC  = (window.MASTER_OPERATIONS_DATA && window.MASTER_OPERATIONS_DATA.englishClub) || [];
  const todayFT  = (window.MASTER_OPERATIONS_DATA && window.MASTER_OPERATIONS_DATA.unfixed) || [];
  const todayUpg = (window.__model && (window.__model.individuals || window.__model.reps)) || (typeof REPS_DATA !== "undefined" ? REPS_DATA : []);
  const yd       = window.YESTERDAY_DATA || { consumption: [], englishClub: [], upgrade: [], unfixed: [], label: "Oct 4, 2026" };

  const teamFilter = (document.getElementById("cmpTeamFilter") || {}).value || "ALL";
  const sortFilter = (document.getElementById("cmpSortFilter") || {}).value || "consumption-desc";

  function normName(n) { return String(n || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }

  // Index today's datasets
  const ccMap  = {};
  (todayCC || []).forEach(r => { ccMap[normName(r.name)] = r; });

  const ecMap  = {};
  (todayEC || []).forEach(r => { ecMap[normName(r.name)] = r; });

  const ftMap  = {};
  (todayFT || []).forEach(r => { ftMap[normName(r.name)] = r; });

  const upgMap = {};
  (todayUpg || []).forEach(r => { upgMap[normName(r.name)] = r; });

  // Index yesterday's datasets
  const ydCcMap  = {};
  (yd.consumption || []).forEach(r => { ydCcMap[normName(r.name)] = r; });

  const ydEcMap  = {};
  (yd.englishClub || []).forEach(r => { ydEcMap[normName(r.name)] = r; });

  const ydFtMap  = {};
  (yd.unfixed || []).forEach(r => { ydFtMap[normName(r.name)] = r; });

  const ydUpgMap = {};
  (yd.upgrade || []).forEach(r => { ydUpgMap[normName(r.name)] = r; });

  let reps = todayCC.map(r => {
    const nk = normName(r.name);

    // 1. Class Consumption
    const todayCC_total = Number(r.total) || 0;
    const todayCC_c0    = Number(r.c0) || 0;
    const todayCC_rate  = todayCC_total > 0 ? ((todayCC_total - todayCC_c0) / todayCC_total) * 100 : 0;
    
    const ydCC_r     = ydCcMap[nk] || {};
    const ydCC_total = Number(ydCC_r.total) || 0;
    const ydCC_c0    = Number(ydCC_r.c0) || 0;
    const ydCC_rate  = ydCC_total > 0 ? ((ydCC_total - ydCC_c0) / ydCC_total) * 100 : 0;
    const delta_cc   = todayCC_rate - ydCC_rate;

    // 2. English Club
    const todayEC_r    = ecMap[nk] || {};
    const todayEC_rate = typeof todayEC_r.pct === "number" ? todayEC_r.pct : (parseFloat(todayEC_r.pct) || 0);
    const ydEC_r       = ydEcMap[nk] || {};
    const ydEC_rate    = typeof ydEC_r.pct === "number" ? ydEC_r.pct : (parseFloat(ydEC_r.pct) || 0);
    const delta_ec     = todayEC_rate - ydEC_rate;

    // 3. Early Upgrade Hub
    const todayUpg_r    = upgMap[nk] || {};
    const todayUpg_base = Number(todayUpg_r.upgradeBase) || 0;
    const todayUpg_m2   = Number(todayUpg_r.upgradeM2) || 0;
    const todayUpg_rate = todayUpg_base > 0 ? (todayUpg_m2 / todayUpg_base) * 100 : 0;

    const ydUpg_r    = ydUpgMap[nk] || {};
    const ydUpg_base = Number(ydUpg_r.upgradeBase) || 0;
    const ydUpg_m2   = Number(ydUpg_r.upgradeM2) || 0;
    const ydUpg_rate = ydUpg_base > 0 ? (ydUpg_m2 / ydUpg_base) * 100 : 0;
    const delta_upg  = todayUpg_rate - ydUpg_rate;

    // 4. Unfixed Teacher Progress
    const todayFT_r   = ftMap[nk] || {};
    const todayFT_tot = (Number(todayFT_r.m0Tot) || 0) + (Number(todayFT_r.m1Tot) || 0);
    const todayFT_fix = (Number(todayFT_r.m0Fix) || 0) + (Number(todayFT_r.m1Fix) || 0);
    const todayFT_unf = Math.max(0, todayFT_tot - todayFT_fix);
    const todayFT_rate= todayFT_tot > 0 ? (todayFT_fix / todayFT_tot) * 100 : 0;

    const ydFT_r   = ydFtMap[nk] || {};
    const ydFT_tot = (Number(ydFT_r.m0Tot) || 0) + (Number(ydFT_r.m1Tot) || 0);
    const ydFT_fix = (Number(ydFT_r.m0Fix) || 0) + (Number(ydFT_r.m1Fix) || 0);
    const ydFT_unf = Math.max(0, ydFT_tot - ydFT_fix);
    const ydFT_rate= ydFT_tot > 0 ? (ydFT_fix / ydFT_tot) * 100 : 0;

    const delta_ft   = todayFT_rate - ydFT_rate;
    const delta_unf  = todayFT_unf - ydFT_unf; // Negative = fewer unfixed leads (good!)

    const totalDelta = delta_cc + delta_ec + delta_upg + delta_ft;

    return {
      name: r.name,
      team: r.team,
      todayCC_rate, todayEC_rate, todayUpg_rate, todayFT_rate,
      ydCC_rate,    ydEC_rate,    ydUpg_rate,    ydFT_rate,
      delta_cc, delta_ec, delta_upg, delta_ft, delta_unf, totalDelta,
      todayCC_active: Math.max(0, todayCC_total - todayCC_c0),
      todayCC_total: todayCC_total,
      ydCC_active: Math.max(0, ydCC_total - ydCC_c0),
      ydCC_total: ydCC_total,
      todayFT_tot, todayFT_fix, todayFT_unf,
      ydFT_tot, ydFT_fix, ydFT_unf
    };
  });

  // Team filtering
  if (teamFilter !== "ALL") {
    const cleanFilter = teamFilter.replace(/^ME-/, "").toUpperCase();
    reps = reps.filter(r => (r.team || "").replace(/^ME-/, "").toUpperCase() === cleanFilter);
  }

  // Sorting
  if (sortFilter === "consumption-desc")       reps.sort((a, b) => b.todayCC_rate - a.todayCC_rate);
  else if (sortFilter === "upgrade-desc")      reps.sort((a, b) => b.todayUpg_rate - a.todayUpg_rate);
  else if (sortFilter === "ec-desc")           reps.sort((a, b) => b.todayEC_rate - a.todayEC_rate);
  else if (sortFilter === "unfixed-desc")      reps.sort((a, b) => b.todayFT_rate - a.todayFT_rate);
  else if (sortFilter === "unfixed-delta-desc") reps.sort((a, b) => b.delta_ft - a.delta_ft);
  else if (sortFilter === "unfixed-leads-desc") reps.sort((a, b) => b.todayFT_unf - a.todayFT_unf);
  else if (sortFilter === "delta-desc")        reps.sort((a, b) => b.totalDelta - a.totalDelta);

  // Totals & Averages
  const avgCC_today  = reps.length ? reps.reduce((s,r) => s + r.todayCC_rate, 0) / reps.length : 0;
  const avgCC_yd     = reps.length ? reps.reduce((s,r) => s + r.ydCC_rate,    0) / reps.length : 0;
  const avgEC_today  = reps.length ? reps.reduce((s,r) => s + r.todayEC_rate, 0) / reps.length : 0;
  const avgEC_yd     = reps.length ? reps.reduce((s,r) => s + r.ydEC_rate,    0) / reps.length : 0;
  const avgUpg_today = reps.length ? reps.reduce((s,r) => s + r.todayUpg_rate,0) / reps.length : 0;
  const avgUpg_yd    = reps.length ? reps.reduce((s,r) => s + r.ydUpg_rate,   0) / reps.length : 0;

  const totFT_tdTot  = reps.reduce((s,r) => s + r.todayFT_tot, 0);
  const totFT_tdFix  = reps.reduce((s,r) => s + r.todayFT_fix, 0);
  const totFT_tdUnf  = reps.reduce((s,r) => s + r.todayFT_unf, 0);
  const totFT_ydTot  = reps.reduce((s,r) => s + r.ydFT_tot,    0);
  const totFT_ydFix  = reps.reduce((s,r) => s + r.ydFT_fix,    0);
  const totFT_ydUnf  = reps.reduce((s,r) => s + r.ydFT_unf,    0);

  const avgFT_today  = totFT_tdTot > 0 ? (totFT_tdFix / totFT_tdTot) * 100 : 0;
  const avgFT_yd     = totFT_ydTot > 0 ? (totFT_ydFix / totFT_ydTot) * 100 : 0;
  const deltaFT_unf  = totFT_tdUnf - totFT_ydUnf;

  const improved = reps.filter(r => r.totalDelta > 0.05).length;
  const declined = reps.filter(r => r.totalDelta < -0.05).length;
  const unchanged= reps.length - improved - declined;

  function deltaArrow(d) {
    if (d > 0.05)  return '<span style="color:#10b981; font-weight:800;">▲ +' + d.toFixed(1) + '%</span>';
    if (d < -0.05) return '<span style="color:#f43f5e; font-weight:800;">▼ ' + d.toFixed(1) + '%</span>';
    return '<span style="color:#94a3b8;">= 0.0%</span>';
  }

  function kpiBanner(label, today, yd, target, color, subExtra) {
    const d = today - yd;
    const progWidth = Math.min(100, Math.max(0, today));
    const tgtWidth  = Math.min(100, Math.max(0, target));
    return '<div class="kpi-card" style="border-top: 4px solid ' + color + ';">' +
      '<div class="kpi-label">' + label + '</div>' +
      '<div style="display:flex; align-items:baseline; gap:8px; margin:6px 0 2px;">' +
        '<span style="font-size:1.8rem; font-weight:900; color:' + color + '; font-family:var(--font-mono);">' + today.toFixed(1) + '%</span>' +
        '<span style="font-size:0.8rem; color:var(--text-muted);">today</span>' +
      '</div>' +
      '<div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:8px;">' +
        'Yesterday: <strong style="color:#e2e8f0;">' + yd.toFixed(1) + '%</strong> &nbsp;|&nbsp; ' + deltaArrow(d) +
      '</div>' +
      '<div style="position:relative; background:rgba(255,255,255,0.07); height:8px; border-radius:6px; overflow:hidden;">' +
        '<div style="width:' + progWidth + '%; background:' + color + '; height:100%; border-radius:6px;"></div>' +
        '<div style="position:absolute; top:0; left:' + tgtWidth + '%; width:2px; height:100%; background:rgba(255,255,255,0.4);" title="Target: ' + target + '%"></div>' +
      '</div>' +
      '<div class="kpi-pct" style="color:var(--text-muted); margin-top:5px; font-size:0.72rem;">' + (subExtra || ("Target: " + target + "% | Gap: " + (target - today).toFixed(1) + "pp")) + '</div>' +
    '</div>';
  }

  bannerEl.innerHTML =
    kpiBanner("Class Consumption (Avg)", avgCC_today, avgCC_yd, 65, "#10b981") +
    kpiBanner("English Club (Avg)", avgEC_today, avgEC_yd, 45, "#38bdf8") +
    kpiBanner("Upgrade Rate (Avg)", avgUpg_today, avgUpg_yd, 20, "#c084fc") +
    kpiBanner("Teacher Binding Rate (Avg)", avgFT_today, avgFT_yd, 80, "#f59e0b", "Unfixed Leads: " + totFT_tdUnf + " (" + (deltaFT_unf <= 0 ? ("🟢 " + deltaFT_unf + " resolved") : ("🔴 +" + deltaFT_unf + " new")) + ")") +
    '<div class="kpi-card" style="border-top: 4px solid #6366f1;">' +
      '<div class="kpi-label">Rep Movement Summary</div>' +
      '<div style="display:flex; gap:12px; margin:12px 0;">' +
        '<div style="flex:1; text-align:center; background:rgba(16,185,129,0.12); border-radius:8px; padding:10px;">' +
          '<div style="font-size:1.6rem; font-weight:900; color:#10b981;">' + improved + '</div>' +
          '<div style="font-size:0.72rem; color:#10b981; font-weight:700;">IMPROVED</div>' +
        '</div>' +
        '<div style="flex:1; text-align:center; background:rgba(244,63,94,0.12); border-radius:8px; padding:10px;">' +
          '<div style="font-size:1.6rem; font-weight:900; color:#f43f5e;">' + declined + '</div>' +
          '<div style="font-size:0.72rem; color:#f43f5e; font-weight:700;">DECLINED</div>' +
        '</div>' +
        '<div style="flex:1; text-align:center; background:rgba(148,163,184,0.12); border-radius:8px; padding:10px;">' +
          '<div style="font-size:1.6rem; font-weight:900; color:#94a3b8;">' + unchanged + '</div>' +
          '<div style="font-size:0.72rem; color:#94a3b8; font-weight:700;">SAME</div>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:0.75rem; color:var(--text-muted);">Snapshot: ' + (yd.label || "Yesterday") + ' vs 5oct</div>' +
    '</div>';

  const topFtMover = [...reps].sort((a,b) => b.delta_ft - a.delta_ft)[0] || {};
  const topPendingFt = [...reps].sort((a,b) => b.todayFT_unf - a.todayFT_unf)[0] || {};
  const topCcMover = [...reps].sort((a,b) => b.delta_cc - a.delta_cc)[0] || {};

  const spotlightHtml =
    '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom: 22px;">' +
      '<div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 12px 16px; display:flex; align-items:center; gap:12px;">' +
        '<div style="font-size: 1.8rem;">🎯</div>' +
        '<div>' +
          '<div style="font-size: 0.72rem; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Fixation Champion of the Day</div>' +
          '<div style="font-size: 0.95rem; font-weight: 800; color: #fff;">' + (topFtMover.name ? topFtMover.name.replace("EGSS-", "") : "N/A") + ' <span style="color:#10b981; font-size:0.8rem; font-family:var(--font-mono);">▲ +' + (topFtMover.delta_ft || 0).toFixed(1) + '%</span></div>' +
          '<div style="font-size: 0.74rem; color: var(--text-muted);">Rate: ' + (topFtMover.todayFT_rate || 0).toFixed(1) + '% | ' + (topFtMover.delta_unf <= 0 ? ("Resolved " + Math.abs(topFtMover.delta_unf || 0) + " leads") : ("+" + topFtMover.delta_unf + " leads")) + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px; padding: 12px 16px; display:flex; align-items:center; gap:12px;">' +
        '<div style="font-size: 1.8rem;">⚠️</div>' +
        '<div>' +
          '<div style="font-size: 0.72rem; font-weight: 700; color: #f87171; text-transform: uppercase; letter-spacing: 0.5px;">Top Unfixed Pipeline Focus</div>' +
          '<div style="font-size: 0.95rem; font-weight: 800; color: #fff;">' + (topPendingFt.name ? topPendingFt.name.replace("EGSS-", "") : "N/A") + ' <span style="color:#f87171; font-size:0.8rem; font-family:var(--font-mono);">' + (topPendingFt.todayFT_unf || 0) + ' Pending</span></div>' +
          '<div style="font-size: 0.74rem; color: var(--text-muted);">Fixed Rate: ' + (topPendingFt.todayFT_rate || 0).toFixed(1) + '% | Priority teacher binding required</div>' +
        '</div>' +
      '</div>' +
      '<div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; padding: 12px 16px; display:flex; align-items:center; gap:12px;">' +
        '<div style="font-size: 1.8rem;">🚀</div>' +
        '<div>' +
          '<div style="font-size: 0.72rem; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.5px;">Top Consumption Movement</div>' +
          '<div style="font-size: 0.95rem; font-weight: 800; color: #fff;">' + (topCcMover.name ? topCcMover.name.replace("EGSS-", "") : "N/A") + ' <span style="color:#10b981; font-size:0.8rem; font-family:var(--font-mono);">▲ +' + (topCcMover.delta_cc || 0).toFixed(1) + '%</span></div>' +
          '<div style="font-size: 0.74rem; color: var(--text-muted);">CC Rate: ' + (topCcMover.todayCC_rate || 0).toFixed(1) + '% | Active: ' + (topCcMover.todayCC_active || 0) + ' students</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function fmtRate(v) { return v.toFixed(1) + "%"; }

  function deltaCell(d, sub) {
    const subHtml = sub ? ('<div style="font-size:0.68rem; color:' + (sub.includes("▼") ? "#10b981" : sub.includes("▲") ? "#f43f5e" : "#94a3b8") + '; font-weight:700; margin-top:2px;">' + sub + '</div>') : "";
    if (d > 0.05)  return '<td style="color:#10b981; font-weight:800; font-family:var(--font-mono); text-align:center;">▲ +' + d.toFixed(1) + '%' + subHtml + '</td>';
    if (d < -0.05) return '<td style="color:#f43f5e; font-weight:800; font-family:var(--font-mono); text-align:center;">▼ ' + d.toFixed(1) + '%' + subHtml + '</td>';
    return '<td style="color:#64748b; font-family:var(--font-mono); text-align:center;">= 0.0%' + subHtml + '</td>';
  }

  function rateCell(today, yd, target, subText) {
    const color = today >= target ? "#10b981" : today >= target * 0.8 ? "#f59e0b" : "#f43f5e";
    const ydColor = yd >= target ? "#10b981" : "#94a3b8";
    const subHtml = subText ? ('<div style="font-size:0.68rem; color:var(--text-muted); margin-top:2px;">' + subText + '</div>') : "";
    return '<td style="font-family:var(--font-mono); text-align:center;">' +
      '<div style="font-weight:700; color:' + color + ';">' + fmtRate(today) + '</div>' +
      '<div style="font-size:0.72rem; color:' + ydColor + ';">' + fmtRate(yd) + '</div>' +
      subHtml +
    '</td>';
  }

  const rows = reps.map((r, idx) => {
    const badge = renderTeamBadge(r.team);
    const rowBg = idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent";
    const ftSub = r.delta_unf !== 0 ? (r.delta_unf < 0 ? ("▼ " + Math.abs(r.delta_unf) + " fixed") : ("▲ +" + r.delta_unf + " unf")) : "= 0";
    const ftPendingDesc = r.todayFT_unf + " unfixed";

    return '<tr style="background:' + rowBg + '; transition: background 0.2s;" onmouseover="this.style.background=\'rgba(99,102,241,0.08)\'" onmouseout="this.style.background=\'' + rowBg + '\'">' +
      '<td style="font-weight:700; color:#e2e8f0; white-space:nowrap; padding:10px 14px;">' + r.name.replace("EGSS-", "") + '</td>' +
      '<td style="padding:10px 14px;">' + badge + '</td>' +
      rateCell(r.todayCC_rate,  r.ydCC_rate,  65, r.todayCC_active + "/" + r.todayCC_total) +
      deltaCell(r.delta_cc) +
      rateCell(r.todayEC_rate,  r.ydEC_rate,  45) +
      deltaCell(r.delta_ec) +
      rateCell(r.todayUpg_rate, r.ydUpg_rate, 20) +
      deltaCell(r.delta_upg) +
      rateCell(r.todayFT_rate,  r.ydFT_rate,  80, ftPendingDesc) +
      deltaCell(r.delta_ft, ftSub) +
    '</tr>';
  }).join("");

  const totCC_today  = reps.reduce((s,r) => s + r.todayCC_active, 0);
  const totCC_ydAct  = reps.reduce((s,r) => s + r.ydCC_active,    0);
  const totCC_total  = reps.reduce((s,r) => s + r.todayCC_total,  0);
  const totCC_ydTot  = reps.reduce((s,r) => s + r.ydCC_total,     0);
  const totCC_rate   = totCC_total  > 0 ? (totCC_today / totCC_total)  * 100 : 0;
  const totCC_ydRate = totCC_ydTot  > 0 ? (totCC_ydAct / totCC_ydTot) * 100 : 0;
  const totEC_today  = reps.length  ? reps.reduce((s,r) => s + r.todayEC_rate, 0) / reps.length : 0;
  const totEC_yd     = reps.length  ? reps.reduce((s,r) => s + r.ydEC_rate,    0) / reps.length : 0;
  const totUpg_today = reps.length  ? reps.reduce((s,r) => s + r.todayUpg_rate,0) / reps.length : 0;
  const totUpg_yd    = reps.length  ? reps.reduce((s,r) => s + r.ydUpg_rate,   0) / reps.length : 0;

  function totDeltaCell(d, sub) {
    const c = d > 0.05 ? "#10b981" : d < -0.05 ? "#f43f5e" : "#64748b";
    const sym = d > 0.05 ? "▲ +" : d < -0.05 ? "▼ " : "= ";
    const subHtml = sub ? ('<div style="font-size:0.7rem; color:' + (sub.includes("▼") ? "#10b981" : "#f43f5e") + '; font-weight:700;">' + sub + '</div>') : "";
    return '<td style="color:' + c + '; font-weight:900; font-family:var(--font-mono); text-align:center;">' + sym + Math.abs(d).toFixed(1) + '%' + subHtml + '</td>';
  }

  function totRateCell(today, yd, target, sub) {
    const c = today >= target ? "#10b981" : "#f59e0b";
    const yc = yd >= target ? "#10b981" : "#94a3b8";
    const subHtml = sub ? ('<div style="font-size:0.68rem; color:var(--text-muted); font-weight:600;">' + sub + '</div>') : "";
    return '<td style="font-family:var(--font-mono); text-align:center;">' +
      '<div style="font-weight:900; color:' + c + ';">' + today.toFixed(1) + '%</div>' +
      '<div style="font-size:0.72rem; color:' + yc + ';">' + yd.toFixed(1) + '%</div>' +
      subHtml +
    '</td>';
  }

  const ftTotSub = deltaFT_unf !== 0 ? (deltaFT_unf < 0 ? ("▼ " + Math.abs(deltaFT_unf) + " resolved") : ("▲ +" + deltaFT_unf + " unfixed")) : "= 0";
  const totalsRow = '<tr style="background:rgba(99,102,241,0.12); border-top: 2px solid rgba(99,102,241,0.4); font-size:0.88rem;">' +
    '<td style="font-weight:900; color:#a5b4fc; padding:12px 14px;">TOTAL</td>' +
    '<td style="font-size:0.74rem; color:#94a3b8; padding:12px 14px;">' + reps.length + ' Reps</td>' +
    totRateCell(totCC_rate, totCC_ydRate, 65, totCC_today + "/" + totCC_total) +
    totDeltaCell(totCC_rate - totCC_ydRate) +
    totRateCell(totEC_today, totEC_yd, 45) +
    totDeltaCell(totEC_today - totEC_yd) +
    totRateCell(totUpg_today, totUpg_yd, 20) +
    totDeltaCell(totUpg_today - totUpg_yd) +
    totRateCell(avgFT_today, avgFT_yd, 80, totFT_tdUnf + " unfixed") +
    totDeltaCell(avgFT_today - avgFT_yd, ftTotSub) +
  '</tr>';

  tableEl.innerHTML = spotlightHtml +
    '<table style="width:100%; border-collapse:collapse; font-size:0.85rem;">' +
      '<thead>' +
        '<tr style="background: rgba(99,102,241,0.15); border-bottom: 2px solid rgba(99,102,241,0.3);">' +
          '<th style="padding:12px 14px; text-align:left; color:#a5b4fc; font-weight:800;">Rep</th>' +
          '<th style="padding:12px 14px; text-align:left; color:#a5b4fc; font-weight:800;">Team</th>' +
          '<th colspan="2" style="padding:12px 14px; text-align:center; color:#10b981; font-weight:800; border-left: 1px solid rgba(16,185,129,0.3);">' +
            'Class Consumption<br><span style="font-size:0.7rem; font-weight:600; color:#94a3b8;">Today% / YD% / Delta</span>' +
          '</th>' +
          '<th colspan="2" style="padding:12px 14px; text-align:center; color:#38bdf8; font-weight:800; border-left: 1px solid rgba(56,189,248,0.3);">' +
            'English Club<br><span style="font-size:0.7rem; font-weight:600; color:#94a3b8;">Today% / YD% / Delta</span>' +
          '</th>' +
          '<th colspan="2" style="padding:12px 14px; text-align:center; color:#c084fc; font-weight:800; border-left: 1px solid rgba(192,132,252,0.3);">' +
            'Upgrade Rate<br><span style="font-size:0.7rem; font-weight:600; color:#94a3b8;">Today% / YD% / Delta</span>' +
          '</th>' +
          '<th colspan="2" style="padding:12px 14px; text-align:center; color:#f59e0b; font-weight:800; border-left: 1px solid rgba(245,158,11,0.3);">' +
            'Unfixed Teacher Binding<br><span style="font-size:0.7rem; font-weight:600; color:#94a3b8;">Fixed% / YD% / Unfixed Delta</span>' +
          '</th>' +
        '</tr>' +
        '<tr style="background:rgba(0,0,0,0.2); border-bottom:1px solid rgba(255,255,255,0.06);">' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:left;">NAME</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:left;">TEAM</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center;">RATE</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center;">Δ</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center; border-left: 1px solid rgba(56,189,248,0.2);">RATE</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center;">Δ</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center; border-left: 1px solid rgba(192,132,252,0.2);">RATE</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center;">Δ</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center; border-left: 1px solid rgba(245,158,11,0.2);">FIXED%</th>' +
          '<th style="padding:6px 14px; color:#64748b; font-size:0.72rem; font-weight:600; text-align:center;">Δ (UNFIXED)</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        (rows || '<tr><td colspan="10" style="text-align:center; padding:20px; color:var(--text-muted);">No representatives match the selected filter.</td></tr>') +
      '</tbody>' +
      '<tfoot>' +
        totalsRow +
      '</tfoot>' +
    '</table>' +
    '<div style="margin-top:14px; padding:10px 16px; background:rgba(15,23,42,0.5); border-radius:8px; font-size:0.75rem; color:var(--text-muted);">' +
      '<strong>Operational Legend:</strong>' +
      '<span style="color:#10b981; margin-left:10px;">▲ Improvement (Higher rate / Fewer unfixed leads)</span>' +
      '<span style="color:#f43f5e; margin-left:10px;">▼ Decline</span>' +
      '<span style="color:#64748b; margin-left:10px;">= No Change</span>' +
      '&nbsp;|&nbsp; <em>Top = Today (5 Oct), Bottom = Yesterday (' + (yd.label || "4 Oct") + ')</em>' +
      '&nbsp;|&nbsp; Benchmarks: CC 65% · EC 45% · Upgrade 20% · Teacher Binding 80%' +
    '</div>';
}
window.renderComparisonTab = renderComparisonTab;


// =========================================================================
// NAVIGATION, EVENTS & APPLICATION INITIALIZATION
// =========================================================================


// =========================================================================
// DEDICATED CLASS CONSUMPTION INTELLIGENCE HUB (TARGET: 65.0% OVERALL)
// =========================================================================
function renderConsumptionTab() {
  const kpisContainer = document.getElementById('consumptionKpis');
  const teamsGrid = document.getElementById('consumptionTeamsGrid');
  const tableContainer = document.getElementById('consumptionTableContainer');
  if (!kpisContainer || !teamsGrid || !tableContainer || !window.MASTER_OPERATIONS_DATA) return;

  const teamKeys = ["ME-EGSS01", "ME-EGSS05", "ME-EGSS10", "ME-EGSS13", "ME-EGSS30"];
  const allData = window.MASTER_OPERATIONS_DATA.consumption || [];

  let bigTot = 0, bigC0 = 0, bigEnd = 0, bigActive = 0;
  const teamMetrics = {};

  teamKeys.forEach(tk => {
    const reps = allData.filter(r => r.team === tk);
    const total = reps.reduce((s, r) => s + (r.total || 0), 0);
    const c0 = reps.reduce((s, r) => s + (r.c0 || 0), 0);
    const end = reps.reduce((s, r) => s + (r.end_classes || 0), 0);
    const active = total - c0;
    const rate = total > 0 ? ((active / total) * 100) : 0;
    const goal65 = Math.ceil(total * 0.65);
    const gap = Math.max(0, goal65 - active);
    const gapPct = rate - 65.0;

    teamMetrics[tk] = { total, c0, end, active, rate, goal65, gap, gapPct, repsCount: reps.length };
    bigTot += total; bigC0 += c0; bigEnd += end; bigActive += active;
  });

  const bigRate = bigTot > 0 ? ((bigActive / bigTot) * 100) : 0;
  const bigGoal65 = Math.ceil(bigTot * 0.65);
  const bigGap = Math.max(0, bigGoal65 - bigActive);
  const bigGapPct = bigRate - 65.0;
  const zeroPct = bigTot > 0 ? ((bigC0 / bigTot) * 100).toFixed(1) : '0.0';

  // 1. Render Top Executive KPI Deck
  kpisContainer.innerHTML = `
    <div class="kpi-card" style="border-top: 4px solid #10b981;">
      <div class="kpi-label">Big Team 01 — Sector Consumption Rate</div>
      <div class="kpi-value" style="color: #10b981; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigRate.toFixed(1)}%
        <span style="font-size: 0.82rem; color: #94a3b8; font-weight: 600;">(vs 65.0% Target)</span>
      </div>
      <div class="kpi-sub" style="display:flex; justify-content:space-between; margin-top:4px;">
        <span>Deficit Gap: <strong style="color: #f59e0b;">${bigGapPct.toFixed(1)}pp</strong></span>
        <span>Goal: <strong>65.0%</strong></span>
      </div>
      <div class="kpi-progress" style="margin-top: 10px; position:relative; background:rgba(255,255,255,0.08); height:9px; border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${Math.min(100, bigRate)}%; background: linear-gradient(90deg, #10b981, #06b6d4); height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: var(--text-secondary); margin-top:6px;">${bigActive.toLocaleString()} active students out of ${bigTot.toLocaleString()} total accounts</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #f43f5e;">
      <div class="kpi-label">Zero-Class Accounts (Rescue Priority)</div>
      <div class="kpi-value" style="color: #f43f5e; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigC0.toLocaleString()}
        <span style="font-size: 0.85rem; color: #fda4af;">(${zeroPct}%)</span>
      </div>
      <div class="kpi-sub">Students with 0 completed classes this month</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${zeroPct}%; background: #f43f5e; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #f43f5e; margin-top:6px;">Immediate reactivation outreach required</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #06b6d4;">
      <div class="kpi-label">Total Completed Classes MTD</div>
      <div class="kpi-value" style="color: #06b6d4; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigEnd.toLocaleString()}
      </div>
      <div class="kpi-sub">Total ended lesson units across 5 Small Teams</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${Math.min(100, (bigEnd / 4000) * 100)}%; background: #06b6d4; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #38bdf8; margin-top:6px;">Average ${(bigEnd / (bigActive || 1)).toFixed(1)} classes per active student</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #c084fc;">
      <div class="kpi-label">Active Students Needed for 65% Goal</div>
      <div class="kpi-value" style="color: #c084fc; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        +${bigGap.toLocaleString()}
      </div>
      <div class="kpi-sub">Target: ${bigGoal65.toLocaleString()} active students (65% of ${bigTot.toLocaleString()})</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${((bigActive / (bigGoal65 || 1)) * 100).toFixed(1)}%; background: #c084fc; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #c084fc; margin-top:6px;">Pacing ${((bigActive / (bigGoal65 || 1)) * 100).toFixed(1)}% towards milestone</div>
    </div>
  `;

  // 2. Render Small Teams Comparison Matrix vs 65% Benchmark
  const sortedTeams = [...teamKeys].sort((a, b) => teamMetrics[b].rate - teamMetrics[a].rate);
  teamsGrid.innerHTML = sortedTeams.map((tk, idx) => {
    const tm = teamMetrics[tk];
    const shortKey = tk.replace('ME-', '');
    const tl = TL_MAPPING[shortKey];
    const isTop = idx === 0;
    const rateClr = tm.rate >= 65 ? '#10b981' : tm.rate >= 40 ? '#f59e0b' : '#f43f5e';
    const statusBadge = tm.rate >= 65 
      ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">🟢 MET 65%</span>'
      : `<span style="background:rgba(245,158,11,0.15); color:#f59e0b; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">🟡 GAP: ${tm.gapPct.toFixed(1)}pp</span>`;

    return `
      <div class="calc-card" style="border-top: 4px solid ${tl?.color || '#6366f1'}; background: var(--bg-card); position:relative; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h4 style="font-size:1.1rem; font-weight:800; color:#fff; margin:0;">${tl?.fullName || tk}</h4>
              <span style="font-size:0.7rem; font-weight:800; background:rgba(255,255,255,0.06); color:${tl?.color || '#6366f1'}; padding:2px 8px; border-radius:4px;">Rank #${idx + 1}</span>
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">${tm.repsCount} SS Representatives</div>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px;">
          <div>
            <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Consumption Rate:</span>
            <div style="font-family:var(--font-mono); font-size:1.85rem; font-weight:900; color:${rateClr};">
              ${tm.rate.toFixed(1)}%
              <span style="font-size:0.8rem; color:#94a3b8; font-weight:600;">/ 65.0%</span>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.72rem; color:var(--text-muted);">Active / Total:</span>
            <div style="font-family:var(--font-mono); font-size:1rem; font-weight:800; color:#fff;">${tm.active} / ${tm.total}</div>
          </div>
        </div>

        <!-- Progress Bar with Target Marker -->
        <div style="position:relative; height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; margin-bottom:14px;">
          <div style="height:100%; width:${Math.min(100, (tm.rate / 65) * 100)}%; background:${rateClr};"></div>
        </div>

        <!-- Metrics Grid -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:rgba(255,255,255,0.02); padding:10px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.04); font-size:0.78rem;">
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Zero-Class</span>
            <strong style="color:#f43f5e; font-family:var(--font-mono); font-size:0.95rem;">${tm.c0}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Classes Ended</span>
            <strong style="color:#38bdf8; font-family:var(--font-mono); font-size:0.95rem;">${tm.end}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Need to 65%</span>
            <strong style="color:#c084fc; font-family:var(--font-mono); font-size:0.95rem;">+${tm.gap}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 3. Render Individual Rep Consumption Table (Strictly Sorted Highest to Lowest %)
  const filterVal = document.getElementById('consumptionTeamFilter')?.value || 'ALL';
  let filteredData = (filterVal === 'ALL') ? [...allData] : allData.filter(r => r.team === filterVal);

  // Strictly sort ranks from highest to lowest Active Consuming Rate %
  filteredData.sort((a, b) => {
    const rateA = a.total > 0 ? ((a.total - a.c0) / a.total) : 0;
    const rateB = b.total > 0 ? ((b.total - b.c0) / b.total) : 0;
    return (rateB - rateA) || ((b.total - b.c0) - (a.total - a.c0)) || (b.total - a.total);
  });

  let rowsHtml = filteredData.map((r, idx) => {
    const active = r.total - r.c0;
    const rate = r.total > 0 ? ((active / r.total) * 100).toFixed(1) : '0.0';
    const zeroPct = r.total > 0 ? ((r.c0 / r.total) * 100).toFixed(1) : '0.0';
    const rateClr = parseFloat(rate) >= 65 ? '#10b981' : parseFloat(rate) >= 40 ? '#f59e0b' : '#f43f5e';
    const zeroClr = parseFloat(zeroPct) > 60 ? '#f43f5e' : parseFloat(zeroPct) > 40 ? '#f59e0b' : '#10b981';
    const goal65 = Math.ceil(r.total * 0.65);
    const need = Math.max(0, goal65 - active);

    const badge = parseFloat(rate) >= 65 
      ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:4px; font-weight:700; font-size:0.72rem;">Goal Met 🎉</span>'
      : `<span style="color:#f59e0b; font-family:var(--font-mono); font-size:0.78rem; font-weight:700;">+${need} needed</span>`;

    return `
      <tr>
        <td style="font-family:var(--font-mono); font-weight:800; color:var(--accent-indigo); text-align:center;">#${idx + 1}</td>
        <td style="font-weight:600; color:#fff;">${r.name}</td>
        <td>${renderTeamBadge(r.team)}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#fff;">${r.total}</td>
        <td style="font-family:var(--font-mono); color:${zeroClr}; font-weight:700;">${r.c0} <span style="font-size:0.72rem; color:var(--text-muted);">(${zeroPct}%)</span></td>
        <td style="font-family:var(--font-mono); font-weight:800; color:${rateClr};">${active} (${rate}%)</td>
        <td style="font-family:var(--font-mono); color:#cbd5e1;">${r.c1_3 || 0}</td>
        <td style="font-family:var(--font-mono); color:#cbd5e1;">${r.c4_7 || 0}</td>
        <td style="font-family:var(--font-mono); color:#cbd5e1;">${r.c8_11 || 0}</td>
        <td style="font-family:var(--font-mono); color:#cbd5e1;">${r.c12_14 || 0}</td>
        <td style="font-family:var(--font-mono); color:#cbd5e1;">${r.c15 || 0}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#38bdf8;">${r.end_classes || 0}</td>
        <td style="font-family:var(--font-mono); text-align:center;">${badge}</td>
      </tr>
    `;
  }).join('');

  const totTotal = filteredData.reduce((s, r) => s + (r.total || 0), 0);
  const totC0 = filteredData.reduce((s, r) => s + (r.c0 || 0), 0);
  const totActive = totTotal - totC0;
  const totRate = totTotal > 0 ? ((totActive / totTotal) * 100).toFixed(1) : '0.0';
  const totZeroPct = totTotal > 0 ? ((totC0 / totTotal) * 100).toFixed(1) : '0.0';
  const totC1_3 = filteredData.reduce((s, r) => s + (r.c1_3 || 0), 0);
  const totC4_7 = filteredData.reduce((s, r) => s + (r.c4_7 || 0), 0);
  const totC8_11 = filteredData.reduce((s, r) => s + (r.c8_11 || 0), 0);
  const totC12_14 = filteredData.reduce((s, r) => s + (r.c12_14 || 0), 0);
  const totC15 = filteredData.reduce((s, r) => s + (r.c15 || 0), 0);
  const totEnd = filteredData.reduce((s, r) => s + (r.end_classes || 0), 0);
  const totGoal65 = Math.ceil(totTotal * 0.65);
  const totNeed = Math.max(0, totGoal65 - totActive);
  const totRateClr = parseFloat(totRate) >= 65 ? '#10b981' : parseFloat(totRate) >= 40 ? '#f59e0b' : '#f43f5e';
  const totZeroClr = parseFloat(totZeroPct) > 60 ? '#f43f5e' : parseFloat(totZeroPct) > 40 ? '#f59e0b' : '#10b981';

  const totStatusBadge = parseFloat(totRate) >= 65 
    ? '<span style="background:rgba(16,185,129,0.2); color:#10b981; padding:3px 10px; border-radius:4px; font-weight:800; font-size:0.75rem;">Goal Met 🎉</span>'
    : `<span style="background:rgba(245,158,11,0.2); color:#f59e0b; padding:3px 10px; border-radius:4px; font-weight:800; font-size:0.75rem;">+${totNeed.toLocaleString()} needed</span>`;

  tableContainer.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Representative</th>
          <th>Team</th>
          <th>Total Accounts</th>
          <th>Zero-Class (0)</th>
          <th>Active Consuming (Rate %)</th>
          <th>1-3</th>
          <th>4-7</th>
          <th>8-11</th>
          <th>12-14</th>
          <th>15+</th>
          <th style="color:#38bdf8;">Ended Classes</th>
          <th style="text-align:center;">Status vs 65% Target</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
      <tfoot>
        <tr style="background: linear-gradient(90deg, rgba(99, 102, 241, 0.18), rgba(15, 23, 42, 0.85)); font-weight: 800; border-top: 2px solid var(--accent-indigo); font-size: 0.88rem;">
          <td colspan="2" style="color: #fff; text-align: left; padding: 12px 14px; font-weight: 800;">
            ⭐ TOTAL (${filterVal === 'ALL' ? 'SECTOR OVERALL — 21 REPS' : filterVal})
          </td>
          <td>${filterVal === 'ALL' ? '<span class="team-badge" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.4);">Sector Total</span>' : renderTeamBadge(filterVal)}</td>
          <td style="font-family:var(--font-mono); font-weight:900; color:#fff; font-size:0.95rem;">${totTotal.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:${totZeroClr}; font-weight:800;">${totC0.toLocaleString()} <span style="font-size:0.72rem; color:var(--text-muted);">(${totZeroPct}%)</span></td>
          <td style="font-family:var(--font-mono); font-weight:900; color:${totRateClr}; font-size:0.95rem;">${totActive.toLocaleString()} (${totRate}%)</td>
          <td style="font-family:var(--font-mono); color:#cbd5e1;">${totC1_3.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#cbd5e1;">${totC4_7.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#cbd5e1;">${totC8_11.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#cbd5e1;">${totC12_14.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#cbd5e1;">${totC15.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); font-weight:900; color:#38bdf8; font-size:0.95rem;">${totEnd.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); text-align:center;">${totStatusBadge}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

// =========================================================================
// DEDICATED ENGLISH CLUB STRATEGIC ADOPTION HUB (TARGET: 45.0% OF BASE)
// =========================================================================
function renderEnglishClubTab() {
  const kpisContainer = document.getElementById('englishClubKpis');
  const teamsGrid = document.getElementById('englishClubTeamsGrid');
  const tableContainer = document.getElementById('englishClubTableContainer');
  if (!kpisContainer || !teamsGrid || !tableContainer || !window.MASTER_OPERATIONS_DATA) return;

  const teamKeys = ["ME-EGSS01", "ME-EGSS05", "ME-EGSS10", "ME-EGSS13", "ME-EGSS30"];
  const allData = window.MASTER_OPERATIONS_DATA.englishClub || [];

  let bigBase = 0, bigBook = 0, bigAtt = 0;
  const teamMetrics = {};

  teamKeys.forEach(tk => {
    const reps = allData.filter(r => r.team === tk);
    const base = reps.reduce((s, r) => s + (r.base || 0), 0);
    const book = reps.reduce((s, r) => s + (r.book || 0), 0);
    const att = reps.reduce((s, r) => s + (r.att || 0), 0);
    const rate = base > 0 ? ((att / base) * 100) : 0;
    const goal45 = Math.ceil(base * 0.45);
    const gap = Math.max(0, goal45 - att);
    const gapPct = rate - 45.0;

    teamMetrics[tk] = { base, book, att, rate, goal45, gap, gapPct, repsCount: reps.length };
    bigBase += base; bigBook += book; bigAtt += att;
  });

  const bigRate = bigBase > 0 ? ((bigAtt / bigBase) * 100) : 0;
  const bigGoal45 = Math.ceil(bigBase * 0.45);
  const bigGap = Math.max(0, bigGoal45 - bigAtt);
  const bigGapPct = bigRate - 45.0;

  // 1. Render Top Executive KPI Deck
  kpisContainer.innerHTML = `
    <div class="kpi-card" style="border-top: 4px solid #38bdf8;">
      <div class="kpi-label">Big Team 01 — English Club Adoption Rate</div>
      <div class="kpi-value" style="color: #38bdf8; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigRate.toFixed(1)}%
        <span style="font-size: 0.82rem; color: #94a3b8; font-weight: 600;">(vs 45.0% Goal)</span>
      </div>
      <div class="kpi-sub" style="display:flex; justify-content:space-between; margin-top:4px;">
        <span>Deficit Gap: <strong style="color: #f43f5e;">${bigGapPct.toFixed(1)}pp</strong></span>
        <span>Goal: <strong>45.0%</strong></span>
      </div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${Math.min(100, (bigRate / 45) * 100)}%; background: #38bdf8; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: var(--text-secondary); margin-top:6px;">${bigAtt} attended lessons out of ${bigBase.toLocaleString()} base</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #6366f1;">
      <div class="kpi-label">Total Qualified Student Base</div>
      <div class="kpi-value" style="color: #818cf8; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigBase.toLocaleString()}
      </div>
      <div class="kpi-sub">Total students eligible across 5 Small Teams</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: 100%; background: #6366f1; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #818cf8; margin-top:6px;">21 active SS representatives handling cohort</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #c084fc;">
      <div class="kpi-label">Sector 45% Milestone Target</div>
      <div class="kpi-value" style="color: #c084fc; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        ${bigGoal45.toLocaleString()} <span style="font-size:0.8rem; color:#94a3b8; font-weight:normal;">attendances</span>
      </div>
      <div class="kpi-sub">Benchmark: 45.0% of total student base</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${((bigAtt / (bigGoal45 || 1)) * 100).toFixed(1)}%; background: #c084fc; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #c084fc; margin-top:6px;">${bigBook} total booked reservations so far</div>
    </div>

    <div class="kpi-card" style="border-top: 4px solid #f43f5e;">
      <div class="kpi-label">Deficit Gap to 45% Milestone</div>
      <div class="kpi-value" style="color: #f43f5e; font-family: var(--font-mono); font-size: 2.1rem; font-weight: 900;">
        +${bigGap.toLocaleString()}
      </div>
      <div class="kpi-sub">Additional student attendances needed</div>
      <div class="kpi-progress" style="margin-top: 10px; height:9px; background:rgba(255,255,255,0.08); border-radius:6px; overflow:hidden;">
        <div class="kpi-bar" style="width: ${Math.min(100, (bigGap / bigGoal45) * 100)}%; background: #f43f5e; height:100%;"></div>
      </div>
      <div class="kpi-pct" style="color: #f43f5e; margin-top:6px;">Push needed on lesson reservation confirmations</div>
    </div>
  `;

  // 2. Render Small Teams Benchmark Matrix
  const sortedTeams = [...teamKeys].sort((a, b) => teamMetrics[b].rate - teamMetrics[a].rate);
  teamsGrid.innerHTML = sortedTeams.map((tk, idx) => {
    const tm = teamMetrics[tk];
    const shortKey = tk.replace('ME-', '');
    const tl = TL_MAPPING[shortKey];
    const rateClr = tm.rate >= 45 ? '#10b981' : tm.rate >= 20 ? '#f59e0b' : '#38bdf8';
    const statusBadge = tm.rate >= 45 
      ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">🟢 MET 45%</span>'
      : `<span style="background:rgba(244,63,94,0.15); color:#f43f5e; padding:3px 8px; border-radius:4px; font-size:0.72rem; font-weight:700;">🔴 GAP: ${tm.gapPct.toFixed(1)}pp</span>`;

    return `
      <div class="calc-card" style="border-top: 4px solid ${tl?.color || '#06b6d4'}; background: var(--bg-card); position:relative; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h4 style="font-size:1.1rem; font-weight:800; color:#fff; margin:0;">${tl?.fullName || tk}</h4>
              <span style="font-size:0.7rem; font-weight:800; background:rgba(255,255,255,0.06); color:${tl?.color || '#06b6d4'}; padding:2px 8px; border-radius:4px;">Rank #${idx + 1}</span>
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">${tm.repsCount} SS Representatives</div>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:8px;">
          <div>
            <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Adoption Rate:</span>
            <div style="font-family:var(--font-mono); font-size:1.85rem; font-weight:900; color:${rateClr};">
              ${tm.rate.toFixed(1)}%
              <span style="font-size:0.8rem; color:#94a3b8; font-weight:600;">/ 45.0%</span>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.72rem; color:var(--text-muted);">Attended / Goal:</span>
            <div style="font-family:var(--font-mono); font-size:1rem; font-weight:800; color:#fff;">${tm.att} / ${tm.goal45}</div>
          </div>
        </div>

        <!-- Progress Bar with Target Marker -->
        <div style="position:relative; height:8px; background:rgba(255,255,255,0.06); border-radius:4px; overflow:hidden; margin-bottom:14px;">
          <div style="height:100%; width:${Math.min(100, (tm.rate / 45) * 100)}%; background:${rateClr};"></div>
        </div>

        <!-- Metrics Grid -->
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; background:rgba(255,255,255,0.02); padding:10px; border-radius:var(--radius-sm); border:1px solid rgba(255,255,255,0.04); font-size:0.78rem;">
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Base</span>
            <strong style="color:#fff; font-family:var(--font-mono); font-size:0.95rem;">${tm.base}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Booked</span>
            <strong style="color:#38bdf8; font-family:var(--font-mono); font-size:0.95rem;">${tm.book}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Need to 45%</span>
            <strong style="color:#f43f5e; font-family:var(--font-mono); font-size:0.95rem;">+${tm.gap}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // 3. Render Individual Rep English Club Table (Strictly Sorted Highest to Lowest %)
  const filterVal = document.getElementById('englishClubTeamFilter')?.value || 'ALL';
  let filteredData = (filterVal === 'ALL') ? [...allData] : allData.filter(r => r.team === filterVal);

  // Strictly sort ranks from highest to lowest adoption rate %
  filteredData.sort((a, b) => {
    const rateA = parseFloat(a.pct) || 0;
    const rateB = parseFloat(b.pct) || 0;
    return (rateB - rateA) || ((b.att || 0) - (a.att || 0)) || ((b.book || 0) - (a.book || 0)) || ((b.base || 0) - (a.base || 0));
  });

  let rowsHtml = filteredData.map((r, idx) => {
    const pctNum = parseFloat(r.pct) || 0;
    const rateClr = pctNum >= 45 ? '#10b981' : pctNum >= 25 ? '#f59e0b' : '#38bdf8';
    const statusBadge = r.need === 0 
      ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; padding:2px 8px; border-radius:4px; font-weight:700; font-size:0.72rem;">Goal Met 🎉</span>'
      : `<span style="color:#f43f5e; font-family:var(--font-mono); font-size:0.78rem; font-weight:700;">+${r.need} needed</span>`;

    return `
      <tr>
        <td style="font-family:var(--font-mono); font-weight:800; color:var(--accent-indigo); text-align:center;">#${idx + 1}</td>
        <td style="font-weight:600; color:#fff;">${r.name}</td>
        <td>${renderTeamBadge(r.team)}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#fff;">${r.base}</td>
        <td style="font-family:var(--font-mono); color:#38bdf8;">${r.book}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#c084fc;">${r.att}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:${rateClr};">${r.pct}</td>
        <td style="font-family:var(--font-mono); color:#60a5fa;">${r.goal}</td>
        <td style="text-align:center;">${statusBadge}</td>
      </tr>
    `;
  }).join('');

  const totBase = filteredData.reduce((s, r) => s + (r.base || 0), 0);
  const totBook = filteredData.reduce((s, r) => s + (r.book || 0), 0);
  const totAtt = filteredData.reduce((s, r) => s + (r.att || 0), 0);
  const totEcRate = totBase > 0 ? ((totAtt / totBase) * 100).toFixed(1) : '0.0';
  const totGoal45 = Math.ceil(totBase * 0.45);
  const totEcNeed = Math.max(0, totGoal45 - totAtt);
  const totEcRateClr = parseFloat(totEcRate) >= 45 ? '#10b981' : parseFloat(totEcRate) >= 20 ? '#f59e0b' : '#38bdf8';

  const totEcBadge = totEcNeed === 0 
    ? '<span style="background:rgba(16,185,129,0.2); color:#10b981; padding:3px 10px; border-radius:4px; font-weight:800; font-size:0.75rem;">Goal Met 🎉</span>'
    : `<span style="background:rgba(244,63,94,0.18); color:#f43f5e; padding:3px 10px; border-radius:4px; font-weight:800; font-size:0.75rem;">+${totEcNeed.toLocaleString()} needed</span>`;

  tableContainer.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th style="text-align:center;">#</th>
          <th>Representative</th>
          <th>Team</th>
          <th>Qualified Base</th>
          <th>Booked Lessons</th>
          <th style="color:#c084fc;">Completed Attendances</th>
          <th>Adoption Rate (%)</th>
          <th>45% Target Goal</th>
          <th style="text-align:center;">Status vs 45% Milestone</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
      <tfoot>
        <tr style="background: linear-gradient(90deg, rgba(6, 182, 212, 0.18), rgba(15, 23, 42, 0.85)); font-weight: 800; border-top: 2px solid #06b6d4; font-size: 0.88rem;">
          <td colspan="2" style="color: #fff; text-align: left; padding: 12px 14px; font-weight: 800;">
            ⭐ TOTAL (${filterVal === 'ALL' ? 'SECTOR OVERALL — 21 REPS' : filterVal})
          </td>
          <td>${filterVal === 'ALL' ? '<span class="team-badge" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.4);">Sector Total</span>' : renderTeamBadge(filterVal)}</td>
          <td style="font-family:var(--font-mono); font-weight:900; color:#fff; font-size:0.95rem;">${totBase.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); color:#38bdf8; font-weight:800;">${totBook.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); font-weight:900; color:#c084fc; font-size:0.95rem;">${totAtt.toLocaleString()}</td>
          <td style="font-family:var(--font-mono); font-weight:900; color:${totEcRateClr}; font-size:0.95rem;">${totEcRate}%</td>
          <td style="font-family:var(--font-mono); color:#60a5fa; font-weight:800;">${totGoal45.toLocaleString()}</td>
          <td style="text-align:center;">${totEcBadge}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

window.switchTab = switchTab;
function switchTab(tabKey) {
  const isUpg = (tabKey === 'upgrade' || tabKey === 'breakdown');
  document.querySelectorAll('.tab').forEach(b => {
    if (b.dataset.tab === tabKey || (isUpg && (b.dataset.tab === 'upgrade' || b.dataset.tab === 'breakdown'))) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    if (c.id === `tab-${tabKey}` || (isUpg && (c.id === 'tab-upgrade' || c.id === 'tab-breakdown'))) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
  if (tabKey === 'mtd' && typeof renderMtdTab === 'function') {
    renderMtdTab();
    setTimeout(() => {
      if (typeof renderMtdTab === 'function') renderMtdTab();
    }, 60);
  }
  if (tabKey === 'comparison' && typeof renderComparisonTab === 'function') {
    renderComparisonTab();
  }
}

function setupEvents(model) {
  // Tab buttons
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Filter & Sort
  const teamFilter = document.getElementById('teamFilter');
  const sortFilter = document.getElementById('sortFilter');
  if (teamFilter) {
    teamFilter.addEventListener('change', () => {
      // Always ensure rank & roster are sorted by Cash % Achievement
      if (sortFilter) sortFilter.value = 'ach-desc';
      renderIndividualsTab(model);
    });
  }
  if (sortFilter) sortFilter.addEventListener('change', () => renderIndividualsTab(model));

  const opTeamFilter = document.getElementById('opTeamFilter');
  if (opTeamFilter) opTeamFilter.addEventListener('change', () => renderOperationsTab());

  // Toggle View
  const btnCards = document.getElementById('viewToggleCards');
  const btnTable = document.getElementById('viewToggleTable');
  const cardsContainer = document.getElementById('individualCards');
  const tableContainer = document.getElementById('individualTableView');

  if (btnCards && btnTable) {
    btnCards.addEventListener('click', () => {
      btnCards.classList.add('active');
      btnTable.classList.remove('active');
      cardsContainer.classList.remove('hidden');
      tableContainer.classList.add('hidden');
    });

    btnTable.addEventListener('click', () => {
      btnTable.classList.add('active');
      btnCards.classList.remove('active');
      cardsContainer.classList.add('hidden');
      tableContainer.classList.remove('hidden');
    });
  }
}

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  let model;
  try {
    model = buildDataModel();
    window.__model = model;
  } catch (err) {
    console.error('CRITICAL: Failed to buildDataModel:', err);
  }

  const renderSteps = [
    { name: 'renderKPIs', fn: () => renderKPIs(model) },
    { name: 'renderTeamBars', fn: () => renderTeamBars(model) },
    { name: 'renderBigTeamSummary', fn: () => renderBigTeamSummary(model) },
    { name: 'renderOverviewTable', fn: () => renderOverviewTable(model) },
    { name: 'renderSmallTeamsTab', fn: () => renderSmallTeamsTab(model) },
    { name: 'renderIndividualsTab', fn: () => renderIndividualsTab(model) },
    { name: 'renderBreakdownTab', fn: () => renderBreakdownTab(model) },
    { name: 'renderConsumptionTab', fn: () => renderConsumptionTab() },
    { name: 'renderEnglishClubTab', fn: () => renderEnglishClubTab() },
    { name: 'renderSOPTab', fn: () => renderSOPTab() },
    { name: 'renderRecommendationsTab', fn: () => renderRecommendationsTab(model) },
    { name: 'renderOperationsTab', fn: () => renderOperationsTab() },
    { name: 'renderComparisonTab', fn: () => renderComparisonTab() },
    { name: 'renderMtdTab', fn: () => renderMtdTab() },
    { name: 'initPersonalRepSelect', fn: () => initPersonalRepSelect() },
    { name: 'initPersonalTeamSelect', fn: () => initPersonalTeamSelect() }
  ];

  renderSteps.forEach(step => {
    try {
      step.fn();
    } catch (e) {
      console.error('Error executing ' + step.name + ':', e);
    }
  });

  try {
    setupEvents(model);
  } catch (e) {
    console.error('Error in setupEvents:', e);
  }

  try {
    checkSheetSyncStatus();
  } catch (e) {
    console.error('Error in checkSheetSyncStatus:', e);
  }

  // Smooth Loader Fade-Out
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 500);
    }
  }, 300);
});

// Sheet Synchronization Status Inspector
function checkSheetSyncStatus() {
  const syncFiles = [
    {
      idPrefix: 'Lens',
      chkId: 'chkLensSheet',
      timeId: 'timeLensSheet',
      itemId: 'syncItemLens',
      latestTime: '2026-10-05 16:28:48', name: 'Lens Sheet (POOL_Detail16)'
    },
    {
      idPrefix: 'EC',
      chkId: 'chkECSheet',
      timeId: 'timeECSheet',
      itemId: 'syncItemEC',
      latestTime: '2026-10-05 16:27:33', name: 'English Club Sheet'
    },
    {
      idPrefix: 'SOP',
      chkId: 'chkSOPSheet',
      timeId: 'timeSOPSheet',
      itemId: 'syncItemSOP',
      latestTime: '2026-10-05 16:27:41', name: 'SOP Compliance Sheet'
    }
  ];

  syncFiles.forEach(file => {
    const chk = document.getElementById(file.chkId);
    const timeElem = document.getElementById(file.timeId);
    const itemElem = document.getElementById(file.itemId);

    if (file.latestTime) {
      if (chk) chk.checked = true;
      if (timeElem) timeElem.textContent = `Downloaded: ${file.latestTime}`;
      if (itemElem) {
        itemElem.classList.add('synced');
        itemElem.classList.remove('missing');
      }
    } else {
      if (chk) chk.checked = false;
      if (timeElem) timeElem.textContent = `Status: NOT DOWNLOADED TODAY`;
      if (itemElem) {
        itemElem.classList.add('missing');
        itemElem.classList.remove('synced');
      }
    }
  });
}

// =========================================================================
// Individual Reps Performance Table Exporters (Excel & Image)
// =========================================================================
function exportIndividualTableToExcel() {
  const table = document.getElementById('individualFullTable');
  if (!table) return;

  const btns = [
    document.getElementById('btnExportExcel'),
    document.getElementById('btnExportExcelMain')
  ].filter(Boolean);

  const origHtmls = btns.map(b => b.innerHTML);
  btns.forEach(b => { b.innerHTML = '<span>⏳</span> Exporting...'; });

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `Big_Team_01_Individual_Performance_${dateStr}`;

  try {
    // 1. If SheetJS (XLSX) is available, export high-fidelity .xlsx
    if (typeof XLSX !== 'undefined') {
      const wb = XLSX.utils.table_to_book(table, { sheet: "Individual Reps" });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      btns.forEach((b, idx) => {
        b.innerHTML = '<span>✓</span> Downloaded!';
        setTimeout(() => { b.innerHTML = origHtmls[idx]; }, 2500);
      });
      return;
    }

    // 2. Pure JavaScript Fallback: XML / HTML Excel Spreadsheet (.xls)
    const tableClone = table.cloneNode(true);
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>Individual Reps</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
        </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Calibri, sans-serif; font-size: 11pt; }
          th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; border: 1px solid #4338ca; text-align: center; padding: 8px; }
          td { border: 1px solid #cbd5e1; padding: 6px; text-align: center; }
          tfoot tr { background-color: #e0e7ff; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2 style="font-family: sans-serif; color: #1e1b4b;">51Talk Big Team 01 - Individual Sales Specialists Performance Report</h2>
        <p style="font-family: sans-serif; font-size: 10pt; color: #64748b;">Exported on: ${new Date().toLocaleString()}</p>
        ${tableClone.outerHTML}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    btns.forEach((b, idx) => {
      b.innerHTML = '<span>✓</span> Downloaded!';
      setTimeout(() => { b.innerHTML = origHtmls[idx]; }, 2500);
    });
  } catch (err) {
    console.error('Excel Export Error:', err);
    btns.forEach((b, idx) => { b.innerHTML = origHtmls[idx]; });
    alert('Export error. Please ensure table is visible.');
  }
}

function exportIndividualTableToImage() {
  const table = document.getElementById('individualFullTable');
  const tableView = document.getElementById('individualTableView');
  const cardsView = document.getElementById('individualCards');
  if (!table || !tableView) return;

  const btns = [
    document.getElementById('btnExportImage'),
    document.getElementById('btnExportImageMain')
  ].filter(Boolean);

  const origHtmls = btns.map(b => b.innerHTML);
  btns.forEach(b => { b.innerHTML = '<span>⏳</span> Capturing...'; });

  const restoreView = () => {
    btns.forEach((b, idx) => { b.innerHTML = origHtmls[idx]; });
  };

  const markSuccess = () => {
    btns.forEach((b, idx) => {
      b.innerHTML = '<span>✓</span> Downloaded!';
      setTimeout(() => { b.innerHTML = origHtmls[idx]; }, 2500);
    });
  };

  // Ensure table view is visible for capture
  const wasHidden = tableView.classList.contains('hidden');
  if (wasHidden) {
    tableView.classList.remove('hidden');
    if (cardsView) cardsView.classList.add('hidden');
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `Big_Team_01_Individual_Performance_${dateStr}.png`;

  function saveUrl(url, isBlob) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      if (isBlob) URL.revokeObjectURL(url);
      if (wasHidden) {
        tableView.classList.add('hidden');
        if (cardsView) cardsView.classList.remove('hidden');
      }
      markSuccess();
    }, 200);
  }

  function triggerDownload(canvas) {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          if (!blob) {
            saveUrl(canvas.toDataURL('image/png'), false);
            return;
          }
          const url = URL.createObjectURL(blob);
          saveUrl(url, true);
        }, 'image/png');
      } else {
        saveUrl(canvas.toDataURL('image/png'), false);
      }
    } catch (e) {
      console.warn('Canvas export tainted or blob error, trying direct dataURL:', e);
      saveUrl(canvas.toDataURL('image/png'), false);
    }
  }

  function openPrintView() {
    if (wasHidden) {
      tableView.classList.add('hidden');
      if (cardsView) cardsView.classList.remove('hidden');
    }
    restoreView();

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('Could not open print preview. Please check popup permissions or use Ctrl+P.');
      return;
    }
    const tableClone = table.cloneNode(true);
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Big Team 01 - Individual Reps Performance (${dateStr})</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0e1a; color: #f1f5f9; padding: 24px; }
          h2 { margin: 0 0 6px; color: #38bdf8; font-size: 18px; }
          p { margin: 0 0 16px; color: #94a3b8; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; }
          th { background: #1e293b; color: #94a3b8; padding: 6px 4px; border: 1px solid #334155; text-align: center; }
          td { padding: 5px 3px; border: 1px solid #1e293b; text-align: center; }
          tfoot tr { background: #1e1b4b; font-weight: bold; }
          @media print {
            body { background: #fff !important; color: #000 !important; }
            th { background: #e2e8f0 !important; color: #000 !important; border: 1px solid #94a3b8 !important; }
            td { border: 1px solid #cbd5e1 !important; color: #000 !important; }
            tfoot tr { background: #e0e7ff !important; color: #000 !important; }
          }
        </style>
      </head>
      <body>
        <h2>51Talk Big Team 01 — Individual Sales Specialists Performance</h2>
        <p>Senior Manager: Saber Hussien | Generated: ${new Date().toLocaleString()}</p>
        ${tableClone.outerHTML}
        <script>
          window.onload = function() { window.print(); };
        <\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  function doCapture() {
    if (typeof html2canvas === 'function') {
      html2canvas(tableView, {
        backgroundColor: '#0a0e1a',
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        ignoreElements: (el) => {
          return el.classList && (el.classList.contains('view-toggle-bar') || el.classList.contains('no-export'));
        },
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('individualTableView');
          if (el) {
            el.style.overflow = 'visible';
            el.style.width = '100%';
            el.style.maxWidth = 'none';
            el.style.border = 'none';
            el.style.backdropFilter = 'none';
            el.style.webkitBackdropFilter = 'none';
          }
          const allEl = clonedDoc.querySelectorAll('*');
          allEl.forEach(node => {
            if (node.style) {
              node.style.backdropFilter = 'none';
              node.style.webkitBackdropFilter = 'none';
              if (node.tagName === 'TH') {
                node.style.position = 'static';
                node.style.background = '#111827';
              }
            }
          });
        }
      }).then(canvas => {
        triggerDownload(canvas);
      }).catch(err => {
        console.warn('html2canvas standard failed, trying fallback capture mode:', err);
        html2canvas(table, {
          backgroundColor: '#0a0e1a',
          scale: 1,
          useCORS: false,
          allowTaint: true,
          logging: false
        }).then(canvas => {
          triggerDownload(canvas);
        }).catch(err2 => {
          console.error('All html2canvas attempts failed:', err2);
          openPrintView();
        });
      });
    } else {
      openPrintView();
    }
  }

  setTimeout(doCapture, 120);
}


































































































































































































































































