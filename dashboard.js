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
  userTargets: 'Official September 2026 Target Allocation Table',
  sopData: '51Talk Data Center (lp.51talkjr.com/#/data-center/business/SA-SSdata)'
};

// Verified TL & Team Configuration
const TL_MAPPING = {
  "EGSS01": { tl: "EGSS-ashraqatal", fullName: "ME-EGSS01 (Ashraqatal)", color: "#6366f1" },
  "EGSS05": { tl: "EGSS-Ibrahimismaiel", fullName: "ME-EGSS05 (Ibrahimismaiel)", color: "#06b6d4" },
  "EGSS10": { tl: "EGLP-mohamed06", fullName: "ME-EGSS10 (Mohamed06)", color: "#10b981" },
  "EGSS13": { tl: "EGSS-mohamedha", fullName: "ME-EGSS13 (Mohamedha)", color: "#f59e0b" },
  "EGSS30": { tl: "EGSS-AdhmGadAllah", fullName: "ME-EGSS30 (AdhmGadAllah)", color: "#f43f5e" }
};

// September 2026 Cash Targets (Total: $225,600)
const NEW_TARGETS = {
  // ME-EGSS01 (Total: $50,760)
  "EGLP-yasmin01": 5580,
  "EGSS-ashraqatal": 10880,
  "EGSS-juliamonir01": 8050,
  "EGSS-mahmoud04": 10420,
  "EGSS-negma": 7790,
  "EGSS-nohayoussry": 8040,

  // ME-EGSS05 (Total: $76,590)
  "EGLP-saraht": 7340,
  "EGSS-AbdelrahmanNASEF": 9710,
  "EGSS-Ibrahimismaiel": 10170,
  "EGSS-KhaledGonam": 10360,
  "EGSS-OmarMoneb": 9550,
  "EGSS-ehabzaky01": 10350,
  "EGSS-samira01": 10190,
  "EGSS-titooooo": 8920, // Verified in EGSS05

  // ME-EGSS10 (Total: $35,210)
  "EGLP-mohamed06": 7120,
  "EGSS-AhmedShoukry": 16450,
  "EGSS-Mahmoudkhamis": 11640,

  // ME-EGSS13 (Total: $47,060)
  "EGLP-ShahdMahmoud": 6320,
  "EGSS-Amrsafwat": 12240, // Verified in EGSS13
  "EGSS-mohamedha": 9300,
  "EGSS-hayamhassan": 10560,
  "EGSS-marwaahmed": 8640,

  // ME-EGSS30 (Total: $15,980)
  "EGSS-AdhmGadAllah": 8480,
  "EGSS-abdelrhmanshehata": 3690,
  "EGSS-alihesham01": 3810
};

// Reconciled Small Team Totals (Sum of Active Members, Leaver Refunds Charged to Sector)
const OFFICIAL_TEAMS_DATA = {
  "EGSS30": { gross: 21707, refund: 0, cash: 21707, target: 15980, contracts: 27, officialAch: 135.8 },
  "EGSS13": { gross: 51649, refund: 0, cash: 51649, target: 47060, contracts: 52, officialAch: 109.8 },
  "EGSS05": { gross: 78408, refund: 0, cash: 78408, target: 76590, contracts: 85, officialAch: 102.4 },
  "EGSS01": { gross: 39559, refund: 1660, cash: 37899, target: 50760, contracts: 40, officialAch: 74.7 },
  "EGSS10": { gross: 20335, refund: 0, cash: 20335, target: 35210, contracts: 22, officialAch: 57.8 },
};

const REPS_DATA = [
  { name: "EGSS-nohayoussry", team: "EGSS01", cash: 7332, refund: 0, target: 8040, contracts: 9, officialAch: 91.2, upgradeM2: 3, normalRenewals: 0, upgradeBase: 56, poolRenewals: 3 },
  { name: "EGSS-ashraqatal", team: "EGSS01", cash: 1780, refund: 1660, target: 10880, contracts: 3, officialAch: 16.4, upgradeM2: 2, normalRenewals: 0, upgradeBase: 47, poolRenewals: 2 },
  { name: "EGSS-negma", team: "EGSS01", cash: 8140, refund: 0, target: 7790, contracts: 5, officialAch: 104.5, upgradeM2: 3, normalRenewals: 0, upgradeBase: 51, poolRenewals: 3 },
  { name: "EGSS-juliamonir01", team: "EGSS01", cash: 8140, refund: 0, target: 8050, contracts: 9, officialAch: 101.1, upgradeM2: 0, normalRenewals: 0, upgradeBase: 23, poolRenewals: 0 },
  { name: "EGSS-mahmoud04", team: "EGSS01", cash: 12507, refund: 0, target: 10420, contracts: 14, officialAch: 120, upgradeM2: 5, normalRenewals: 0, upgradeBase: 22, poolRenewals: 5 },
  { name: "EGLP-yasmin01", team: "EGSS01", cash: 0, refund: 0, target: 5580, contracts: 0, officialAch: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-abdelrahmannasef", team: "EGSS05", cash: 12318, refund: 0, target: 9710, contracts: 13, officialAch: 126.9, upgradeM2: 2, normalRenewals: 0, upgradeBase: 28, poolRenewals: 2 },
  { name: "EGSS-titooooo", team: "EGSS05", cash: 9800, refund: 0, target: 8920, contracts: 9, officialAch: 109.9, upgradeM2: 1, normalRenewals: 0, upgradeBase: 32, poolRenewals: 1 },
  { name: "EGSS-omarmoneb", team: "EGSS05", cash: 8580, refund: 0, target: 9550, contracts: 10, officialAch: 89.8, upgradeM2: 0, normalRenewals: 0, upgradeBase: 22, poolRenewals: 0 },
  { name: "EGSS-khaledgonam", team: "EGSS05", cash: 12301, refund: 0, target: 10360, contracts: 13, officialAch: 118.7, upgradeM2: 2, normalRenewals: 0, upgradeBase: 27, poolRenewals: 2 },
  { name: "EGSS-ibrahimismaiel", team: "EGSS05", cash: 16068, refund: 0, target: 10170, contracts: 18, officialAch: 158, upgradeM2: 5, normalRenewals: 0, upgradeBase: 44, poolRenewals: 5 },
  { name: "EGSS-samira01", team: "EGSS05", cash: 9911, refund: 0, target: 10190, contracts: 13, officialAch: 97.3, upgradeM2: 4, normalRenewals: 0, upgradeBase: 28, poolRenewals: 4 },
  { name: "EGLP-saraht", team: "EGSS05", cash: 1020, refund: 0, target: 7340, contracts: 1, officialAch: 13.9, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-ehabzaky01", team: "EGSS05", cash: 8410, refund: 0, target: 10350, contracts: 8, officialAch: 81.3, upgradeM2: 4, normalRenewals: 0, upgradeBase: 40, poolRenewals: 4 },
  { name: "EGSS-mahmoudkhamis", team: "EGSS10", cash: 9129, refund: 0, target: 11640, contracts: 10, officialAch: 78.4, upgradeM2: 3, normalRenewals: 0, upgradeBase: 52, poolRenewals: 3 },
  { name: "EGSS-ahmedshoukry", team: "EGSS10", cash: 8709, refund: 0, target: 16450, contracts: 9, officialAch: 52.9, upgradeM2: 1, normalRenewals: 0, upgradeBase: 52, poolRenewals: 1 },
  { name: "EGLP-mohamed06", team: "EGSS10", cash: 2497, refund: 0, target: 7120, contracts: 3, officialAch: 35.1, upgradeM2: 0, normalRenewals: 0, upgradeBase: 0, poolRenewals: 0 },
  { name: "EGSS-mohamedha", team: "EGSS13", cash: 10940, refund: 0, target: 9300, contracts: 11, officialAch: 117.6, upgradeM2: 4, normalRenewals: 0, upgradeBase: 26, poolRenewals: 4 },
  { name: "EGSS-amrsafwat", team: "EGSS13", cash: 14350, refund: 0, target: 12240, contracts: 13, officialAch: 117.2, upgradeM2: 3, normalRenewals: 0, upgradeBase: 29, poolRenewals: 3 },
  { name: "EGSS-hayamhassan", team: "EGSS13", cash: 9032, refund: 0, target: 10560, contracts: 11, officialAch: 85.5, upgradeM2: 8, normalRenewals: 0, upgradeBase: 83, poolRenewals: 8 },
  { name: "EGSS-marwaahmed", team: "EGSS13", cash: 12987, refund: 0, target: 8640, contracts: 12, officialAch: 150.3, upgradeM2: 1, normalRenewals: 0, upgradeBase: 9, poolRenewals: 1 },
  { name: "EGLP-shahdmahmoud", team: "EGSS13", cash: 4340, refund: 0, target: 6320, contracts: 5, officialAch: 68.7, upgradeM2: 1, normalRenewals: 0, upgradeBase: 46, poolRenewals: 1 },
  { name: "EGSS-adhmgadallah", team: "EGSS30", cash: 11100, refund: 0, target: 8480, contracts: 15, officialAch: 130.9, upgradeM2: 5, normalRenewals: 0, upgradeBase: 24, poolRenewals: 5 },
  { name: "EGSS-abdelrhmanshehata", team: "EGSS30", cash: 4240, refund: 0, target: 3690, contracts: 5, officialAch: 114.9, upgradeM2: 1, normalRenewals: 0, upgradeBase: 15, poolRenewals: 1 },
  { name: "EGSS-alihesham01", team: "EGSS30", cash: 6367, refund: 0, target: 3810, contracts: 7, officialAch: 167.1, upgradeM2: 0, normalRenewals: 0, upgradeBase: 5, poolRenewals: 0 },
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
  "EGSS-nohayoussry": 61.7,
  "EGSS-ashraqatal": 48.8,
  "EGSS-negma": 77.8,
  "EGSS-juliamonir01": 59.1,
  "EGSS-mahmoud04": 83.3,
  "EGLP-yasmin01": 0,
  "EGSS-abdelrahmannasef": 68,
  "EGSS-titooooo": 76.7,
  "EGSS-omarmoneb": 65,
  "EGSS-khaledgonam": 86.4,
  "EGSS-ibrahimismaiel": 89.7,
  "EGSS-samira01": 86.4,
  "EGLP-saraht": 0,
  "EGSS-ehabzaky01": 73.7,
  "EGSS-mahmoudkhamis": 58.8,
  "EGSS-ahmedshoukry": 70.8,
  "EGLP-mohamed06": 0,
  "EGSS-mohamedha": 59.1,
  "EGSS-amrsafwat": 79.2,
  "EGSS-hayamhassan": 86.1,
  "EGSS-marwaahmed": 100,
  "EGLP-shahdmahmoud": 82.9,
  "EGSS-adhmgadallah": 73.9,
  "EGSS-abdelrhmanshehata": 93.3,
  "EGSS-alihesham01": 100,
};

// Official Cumulative Expected Pacing Benchmark Curve (Day 1 to 30)
const OFFICIAL_PACING_CURVE = {
  1: 5,   2: 10,  3: 11,  4: 12,  5: 14,
  6: 16,  7: 19,  8: 22,  9: 26,  10: 29,
  11: 31, 12: 32, 13: 36, 14: 40, 15: 43,
  16: 46, 17: 49, 18: 50, 19: 51, 20: 54,
  21: 57, 22: 59, 23: 62, 24: 66, 25: 65,
  26: 68, 27: 80, 28: 87, 29: 94, 30: 103
};

const DAILY_RECOMMENDATIONS = [
  { type: 'critical', icon: '🔴', title: 'Sector BEHIND Pace', detail: 'Ach 89.78% vs Day 30 target 103%. Gap: 13.2pp. Need $0/day to close.', time: '20260930_141012' },
  { type: 'critical', icon: '🚨', title: '1 Reps with Zero/Negative Cash', detail: 'Urgent: EGLP-yasmin01. Immediate 1:1 coaching required.', time: '20260930_141012' },
  { type: 'action', icon: '📋', title: 'Bottom 5 Reps Need Support', detail: 'EGLP-yasmin01 (0%), EGLP-saraht (13.9%), EGSS-ashraqatal (16.4%), EGLP-mohamed06 (35.1%), EGSS-ahmedshoukry (52.9%). Schedule targeted coaching sessions today.', time: '20260930_141012' },
  { type: 'success', icon: '⭐', title: 'Top 3 Stars Today', detail: 'EGSS-marwaahmed (150.3%), EGSS-ibrahimismaiel (158%), EGSS-alihesham01 (167.1%). Recognize in team channel!', time: '20260930_141012' },
  { type: 'action', icon: '🎯', title: 'Upgrade M2: Need 95 more renewals', detail: 'Current: 59/767 (7.7%). 20% target = 154. Focus on high-base reps.', time: '20260930_141012' },
  { type: 'action', icon: '🏁', title: 'End-of-Month Sprint Mode', detail: 'Projected: $202552 (89.8%). 0 days left. Daily need: $0. Push all pending deals!', time: '20260930_141012' },
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
  const daysPassed = 30; // Current MTD Day (Sep 19, 2026)
  const daysInMonth = 30;
  const daysLeft = daysInMonth - daysPassed;
  const expectedPace = OFFICIAL_PACING_CURVE[daysPassed] || 51;

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
      upgradeM2: 0,
      normalRenewals: 0,
      upgradeBase: 0,
      poolRenewals: 0,
      members: []
    };
  });

  const individuals = REPS_DATA.map(raw => {
    const target = raw.target || NEW_TARGETS[raw.name] || 0;
    const ach = (raw.officialAch !== undefined && raw.officialAch !== null) ? raw.officialAch : (target > 0 ? ((raw.cash / target) * 100) : 0);
    const gap = Math.max(0, target - raw.cash);
    const dailyNeeded = daysLeft > 0 ? (gap / daysLeft) : 0;
    const upgradeRate = raw.upgradeBase > 0 ? ((raw.upgradeM2 / raw.upgradeBase) * 100) : 0;
    const coverRate = POOL22_M2_COVERAGE[raw.name] !== undefined ? POOL22_M2_COVERAGE[raw.name] : 0;
    const tlInfo = TL_MAPPING[raw.team];

    const rep = {
      ...raw,
      target,
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

  // Reconciled Sector Totals (Official Data Center Reconciliation & POOL_Detail16)
  const totalCash = 202552; // from Individual Sheet Col G (or æŒ‡æ ‡çœ‹æ¿ Col C)
  const sectorAchPct = 89.78; // from Individual Sheet Col M (or æŒ‡æ ‡çœ‹æ¿ Col I)
  const totalTarget = 225600; // from æŒ‡æ ‡çœ‹æ¿ Col F
  const totalContracts = 227; // from æŒ‡æ ‡çœ‹æ¿ Col D
  const totalUpgradeM2 = 59; // from Student_Detail32
  const totalNormalRenewals = 168; // from Student_Detail32
  const totalUpgradeBase = 767; // from Student_Detail32
  const totalUpgrade20Target = 153;
  const totalUpgrade20Needed = 107;

  return {
    teams,
    individuals,
    summary: {
      totalCash,
      totalTarget,
      totalContracts,
      totalUpgradeM2,
      totalNormalRenewals,
      totalUpgradeBase,
      totalUpgrade20Target,
      totalUpgrade20Needed,
      achievement: typeof sectorAchPct !== 'undefined' ? sectorAchPct : ((totalCash / totalTarget) * 100),
      projectedCash: Math.round((totalCash / daysPassed) * daysInMonth),
      totalGap: totalTarget - totalCash,
      dailyNeeded: Math.round((totalTarget - totalCash) / daysLeft),
      upgradeRate: ((totalUpgradeM2 / totalUpgradeBase) * 100),
      activeReps: individuals.length,
      zeroReps: individuals.filter(r => r.cash === 0).length,
      targetPacePct: expectedPace,
      pacingGapPct: Math.round(((typeof sectorAchPct !== 'undefined' ? sectorAchPct : ((totalCash / totalTarget) * 100)) - expectedPace) * 10) / 10,
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
  document.getElementById('contractsSub').textContent = `Normal: ${s.totalNormalRenewals} | Upgrade M2: ${s.totalUpgradeM2}`;
  document.getElementById('contractsBar').style.width = Math.min(100, (s.totalContracts / 180) * 100) + '%';
  document.getElementById('contractsPct').textContent = `Avg: ${fmt(s.totalCash / s.totalContracts)} / contract`;

  // Pacing
  document.getElementById('achPct').textContent = fmtPct(s.achievement);
  document.getElementById('achSub').textContent = `Gap: ${fmt(s.totalGap)} | Need: ${fmt(s.dailyNeeded)}/day`;
  document.getElementById('achBar').style.width = Math.min(100, s.achievement) + '%';
  document.getElementById('achDays').textContent = `Day ${s.daysPassed} of ${s.daysInMonth} | Expected Pace: ${s.targetPacePct}% (${s.daysLeft} Days Left)`;

  // Reps
  document.getElementById('totalReps').textContent = `${s.activeReps} Reps`;
  document.getElementById('baseLeads').textContent = `${s.totalUpgradeM2} Upgrades / ${s.totalUpgradeBase} Base | 20% Goal: ${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)`;
  document.getElementById('repsBar').style.width = Math.min(100, ((s.activeReps - s.zeroReps) / s.activeReps) * 100) + '%';
  document.getElementById('repsPct').textContent = `${fmtPct(s.upgradeRate)} M2 Upgrade Conversion`;
}

function renderTeamBars(model) {
  const container = document.getElementById('teamBarsContainer');
  if (!container) return;
  container.innerHTML = '';

  const MAX_SCALE = 103; // Official pacing curve ends at 103%
  const daysPassed = model.summary.daysPassed || 16;
  const pacePct = model.summary.targetPacePct || 46;
  const posToday = Math.min(100, Math.max(0, (pacePct / MAX_SCALE) * 100));
  const pos100 = (100 / MAX_SCALE) * 100; // 97.087%

  // Big Team 01 metrics
  const expCashBigTeam = Math.round(model.summary.totalTarget * (pacePct / 100));
  const diffBigTeamCash = model.summary.totalCash - expCashBigTeam;
  const diffBigTeamPct = Math.round((model.summary.achievement - pacePct) * 10) / 10;
  const bigTeamWidthPct = Math.min(100, Math.max(0, (model.summary.achievement / MAX_SCALE) * 100));

  let bigTeamBadge = '';
  if (model.summary.achievement >= pacePct) {
    bigTeamBadge = `<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🟢 Ahead of Pace (+${diffBigTeamPct}%)</span>`;
  } else if (model.summary.achievement >= pacePct - 8) {
    bigTeamBadge = `<span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🟡 Near Pace (${diffBigTeamPct}%)</span>`;
  } else {
    bigTeamBadge = `<span style="background: rgba(244, 63, 94, 0.2); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.4); padding: 2px 10px; border-radius: 4px; font-weight: 800; font-size: 0.78rem;">🔴 Behind Pace (${diffBigTeamPct}%)</span>`;
  }

  // Key milestones from the official 30-day table
  const baseMilestones = [
    { day: 1, pct: 5 },
    { day: 5, pct: 14 },
    { day: 10, pct: 29 },
    { day: 14, pct: 40 },
    { day: 15, pct: 43 },
    { day: 16, pct: 46 },
    { day: 19, pct: 51 },
    { day: 20, pct: 54 },
    { day: 21, pct: 57 },
    { day: 25, pct: 65 },
    { day: 26, pct: 68 },
    { day: 27, pct: 80 },
    { day: 28, pct: 87 },
    { day: 29, pct: 94 },
    { day: 30, pct: 103, isGoal: true }
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
        <span style="color: var(--text-muted);"> / ${fmt(model.summary.totalTarget)}</span>
        <span style="color: ${getStatusColor(model.summary.achievement)}; font-weight: 900; margin-left: 8px;">(${fmtPct(model.summary.achievement)})</span>
      </div>
    </div>

    <!-- Progress Track (Exact 103% scale) -->
    <div style="position: relative; height: 18px; background: rgba(255,255,255,0.07); border-radius: 9px; overflow: visible; margin-bottom: 8px;">
      <!-- Filled Bar -->
      <div style="height: 100%; width: ${bigTeamWidthPct}%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 9px; transition: width 0.8s ease; box-shadow: 0 0 12px rgba(99, 102, 241, 0.55);"></div>
      <!-- 100% Target Marker -->
      <div style="position: absolute; top: -4px; left: ${pos100}%; width: 2px; height: 26px; background: rgba(255,255,255,0.85); border-radius: 1px;" title="Full Target (100%): ${fmt(model.summary.totalTarget)}"></div>
      <!-- Day 16 (46%) Benchmark Marker Line -->
      <div style="position: absolute; top: -6px; left: ${posToday}%; width: 2px; height: 30px; background: #38bdf8; border-left: 2px dashed #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.9); z-index: 5;" title="Day ${daysPassed} Benchmark (${pacePct}%)"></div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
      <span>
        🎯 <strong>Day ${daysPassed} Target (${pacePct}%):</strong> 
        <strong style="color: #38bdf8;">${fmt(expCashBigTeam)}</strong>
        (${diffBigTeamCash >= 0 ? '<span style="color:#10b981; font-weight:700;">+' + fmt(diffBigTeamCash) + ' Surplus</span>' : '<span style="color:#f43f5e; font-weight:700;">-' + fmt(Math.abs(diffBigTeamCash)) + ' Deficit</span>'})
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
    if (t.achievement >= pacePct) {
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
          <span style="color: var(--text-muted);"> / ${fmt(t.target)}</span>
          <span style="color: ${getStatusColor(t.achievement)}; font-weight: 800; margin-left: 8px;">(${fmtPct(t.achievement)})</span>
        </div>
      </div>

      <div style="position: relative; height: 16px; background: rgba(255,255,255,0.06); border-radius: 8px; overflow: visible; margin-bottom: 8px;">
        <!-- Filled progress bar matching achievement on 103% scale -->
        <div style="height: 100%; width: ${cashWidthPct}%; background: ${t.color}; border-radius: 8px; transition: width 0.8s ease; box-shadow: 0 0 10px ${t.color}45;"></div>
        <!-- 100% Target Line Marker at 97.1% -->
        <div style="position: absolute; top: -4px; left: ${pos100}%; width: 2px; height: 24px; background: rgba(255,255,255,0.8); border-radius: 1px;" title="Full Target (100%): ${fmt(t.target)}"></div>
        <!-- Official Benchmark Pace Line Marker (Day 16 = 46%) -->
        <div style="position: absolute; top: -6px; left: ${posToday}%; width: 2px; height: 28px; background: #38bdf8; border-left: 2px dashed #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.9); z-index: 5;" title="Day ${daysPassed} Benchmark (${pacePct}%)"></div>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); flex-wrap: wrap; gap: 8px; position: relative; z-index: 2;">
        <span>
          🎯 <strong>Day ${daysPassed} Target (${pacePct}%):</strong> 
          <strong style="color: #38bdf8;">${fmt(expCashAtPace)}</strong>
          (${paceDiffCash >= 0 ? '<span style="color:#10b981; font-weight:700;">+' + fmt(paceDiffCash) + ' Surplus</span>' : '<span style="color:#f43f5e; font-weight:700;">-' + fmt(Math.abs(paceDiffCash)) + ' Deficit</span>'})
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
  const totalUpgradeBase = s.totalUpgradeBase || 765;
  const totalUpgradeM2 = s.totalUpgradeM2 || 46;
  const totalUpgradeRate = totalUpgradeBase > 0 ? ((totalUpgradeM2 / totalUpgradeBase) * 100) : 0;
  const totalUpgrade20Target = s.totalUpgrade20Target || 153;
  const totalUpgrade20Needed = s.totalUpgrade20Needed || 107;
  const upgradeProgressPct = totalUpgrade20Target > 0 ? ((totalUpgradeM2 / totalUpgrade20Target) * 100).toFixed(1) : '0.0';
  const dailyUpgradeNeeded = daysLeft > 0 ? (totalUpgrade20Needed / daysLeft).toFixed(1) : '0';
  const currentUpgradeVelocity = (totalUpgradeM2 / daysPassed).toFixed(2);
  const upgradeShareOfOrders = s.totalContracts > 0 ? ((totalUpgradeM2 / s.totalContracts) * 100).toFixed(1) : '0.0';

  // Small Teams sorted by Upgrade Conversion Rate % descending
  const teamsByUpgradeRate = [...sortedTeams].sort((a, b) => b.upgradeRate - a.upgradeRate);

  // Macro commentary for Big Team 01 Sector
  let macroStatusBadge = '';
  let macroCommentary = '';
  if (s.achievement >= 100) {
    macroStatusBadge = `<span class="pill-badge pill-badge-emerald"><span class="pulse-dot pulse-dot-emerald"></span> 🏆 TARGET SURPASSED</span>`;
    macroCommentary = `Big Team 01 has officially surpassed the $225,600 monthly target with ${fmt(s.totalCash)} achieved (${fmtPct(s.achievement)}). Outstanding performance across small teams with strong revenue surplus.`;
  } else if (s.achievement >= pacePct) {
    macroStatusBadge = `<span class="pill-badge pill-badge-emerald"><span class="pulse-dot pulse-dot-emerald"></span> 🟢 AHEAD OF BENCHMARK</span>`;
    macroCommentary = `Big Team 01 is pacing ahead of schedule at ${fmtPct(s.achievement)} vs Day ${daysPassed} benchmark (${pacePct}%). Sector momentum is strong with positive revenue variance.`;
  } else if (s.achievement >= pacePct - 8) {
    macroStatusBadge = `<span class="pill-badge pill-badge-amber"><span class="pulse-dot pulse-dot-amber"></span> 🟡 WITHIN STRIKING RANGE</span>`;
    macroCommentary = `Big Team 01 stands at ${fmt(s.totalCash)} (${fmtPct(s.achievement)}) against the $225,600 sector target (Day ${daysPassed} Benchmark: ${pacePct}%). Remaining gap is ${fmt(s.totalGap)} across the final ${daysLeft} days (${fmt(s.dailyNeeded)}/day). Two small teams (ME-EGSS30 and ME-EGSS13) have fully cleared 100%, and ME-EGSS05 is within striking distance at 94.4%. High conversion of warm renewals will maximize month-end completion.`;
  } else {
    macroStatusBadge = `<span class="pill-badge pill-badge-rose"><span class="pulse-dot pulse-dot-rose"></span> 🔴 SPRINT FOCUS REQUIRED</span>`;
    macroCommentary = `Big Team 01 requires an intensive final ${daysLeft}-day revenue sprint. Remaining deficit is ${fmt(s.totalGap)} (${fmt(s.dailyNeeded)}/day needed). Sponsoring closing blitzes across high-base pools is essential to recover pace.`;
  }

  // Detailed strategic feedback generator for each small team (structured modern two-tier memo)
  function getTeamFeedbackText(t) {
    const diffPct = Math.round((t.displayAch - pacePct) * 10) / 10;
    const diffSign = diffPct >= 0 ? '+' : '';
    let revHeader = '';
    let revBody = '';
    if (t.displayAch >= 100) {
      const surplus = t.cash - t.target;
      revHeader = `<span class="pill-badge pill-badge-emerald" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-emerald"></span> 100% Met (${fmtPct(t.displayAch)})</span>`;
      revBody = `Revenue surplus of <strong style="color:#10b981;">+${fmt(surplus)}</strong> (${diffSign}${diffPct}% vs D${daysPassed} pace). Unlocks team booster bonus (+0.5%). Maintain closing cadence to expand sector margin.`;
    } else if (t.displayAch >= 90) {
      revHeader = `<span class="pill-badge pill-badge-cyan" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-emerald"></span> Near 100% (${fmtPct(t.displayAch)})</span>`;
      revBody = `Within striking distance of target (only <strong style="color:#38bdf8;">${fmt(t.dailyNeeded)}/day</strong> needed over remaining ${daysLeft} days). Anchored by ${t.contracts} contracts; closing warm renewals will clear 100% threshold.`;
    } else if (t.displayAch >= 70) {
      revHeader = `<span class="pill-badge pill-badge-amber" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-amber"></span> Steady Run-Rate (${fmtPct(t.displayAch)})</span>`;
      revBody = `Requires <strong style="color:#f59e0b;">${fmt(t.dailyNeeded)}/day</strong> run-rate. Priority focus on unblocking pending proposals, accelerating touchpoints on high-base accounts, and driving demo class conversions.`;
    } else {
      revHeader = `<span class="pill-badge pill-badge-rose" style="font-size:0.7rem; padding: 2px 7px;"><span class="pulse-dot pulse-dot-rose"></span> Final Sprint Focus (${fmtPct(t.displayAch)})</span>`;
      revBody = `Requires immediate intervention (<strong style="color:#f43f5e;">${fmt(t.dailyNeeded)}/day</strong>). Priority on uncontacted leads rescue, inactive student re-engagement, and structured 1:1 coaching with the Team Leader.`;
    }

    const upgContribution = totalUpgradeM2 > 0 ? ((t.upgradeM2 / totalUpgradeM2) * 100).toFixed(1) : '0';
    let upgHeader = '';
    let upgBody = '';
    if (t.upgradeRate >= 8) {
      upgHeader = `<span class="pill-badge pill-badge-purple" style="font-size:0.7rem; padding: 2px 7px;">🚀 Upgrade Leader (${t.upgradeRate.toFixed(1)}%)</span>`;
      upgBody = `Top producer in Big Team 01 (contributes <strong>${upgContribution}%</strong> of sector upgrades). 20% milestone target is ${t.upgrade20Target} (${t.upgrade20Needed} needed). Harvest remaining 60-90 day renewal candidates into long-term upgrades.`;
    } else if (t.upgradeRate >= 6.5) {
      upgHeader = `<span class="pill-badge pill-badge-cyan" style="font-size:0.7rem; padding: 2px 7px;">⚡ High Velocity (${t.upgradeRate.toFixed(1)}%)</span>`;
      upgBody = `Strong conversion momentum (contributes <strong>${upgContribution}%</strong> of sector upgrades). Only ${t.upgrade20Needed} contracts to 20% target (${t.upgrade20Target}). Closing warm upgrades will lock in team bonus.`;
    } else if (t.upgradeRate >= 5.0) {
      upgHeader = `<span class="pill-badge pill-badge-amber" style="font-size:0.7rem; padding: 2px 7px;">🔄 Steady Volume (${t.upgradeRate.toFixed(1)}%)</span>`;
      upgBody = `Consistent conversion across ${t.upgradeBase} base (${t.upgrade20Needed} to 20% target of ${t.upgrade20Target}). Prioritize calling students who consumed 8+ classes this month with bundled discount proposals.`;
    } else {
      upgHeader = `<span class="pill-badge pill-badge-rose" style="font-size:0.7rem; padding: 2px 7px;">🎯 Untapped Reserve (${t.upgradeRate.toFixed(1)}%)</span>`;
      upgBody = `Holds the largest pool in Big Team 01 (${t.upgradeBase} leads, 29.5% of sector total), but lowest conversion (${t.upgrade20Needed} to 20% goal). A targeted upgrade phone blitz represents the highest upside to propel sector completion.`;
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
        <td style="font-family: var(--font-mono); color: var(--text-secondary); text-align: center;">${fmt(t.target)}</td>
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
            Near target: <strong style="color: #38bdf8;">ME-EGSS05 (94.4%)</strong> | Sprint: <strong style="color: #f59e0b;">ME-EGSS01, 10</strong>
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
              46 of 201 total orders | Secures multi-month retention
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
          ${macroCommentary} <strong>Early Upgrade Acceleration Directive:</strong> Big Team 01 has achieved 46 M2 upgrades (${fmtPct(s.upgradeRate)} conversion rate) against the 20% milestone target of 153 contracts (107 remaining). Small Teams 13 (8.29%) and 05 (6.85%) are delivering high upgrade productivity, while Team 10 represents the single largest untapped reservoir (226 leads, 1.77% conversion). Sponsoring a dedicated upgrade phone blitz on warm renewals and 60-90 day remaining students will directly propel team net cash past 100% and unlock commission boosters.
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
                <strong>Sector Synthesis:</strong> Overall Big Team 01 performance is anchored by strong overachievement in Team 30 &amp; Team 13, and near-target volume in Team 05. On Early Upgrades, Big Team 01 has achieved 46 M2 contracts (6.01% conversion rate) towards the 20% milestone target of 153 contracts (107 remaining). Sponsoring a decisive closing blitz across Teams 05, 01, and 10 over the final 48 hours is the primary operational priority to maximize monthly realization.
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
  const pacePct = model.summary.targetPacePct || 46;

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
      <td><span style="color: ${r.teamColor}; font-weight: 600;">${r.team}</span></td>
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
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-secondary); font-family: var(--font-mono);">${fmt(t.target)}</div>
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
  const pacePct = model.summary.targetPacePct || 46;
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
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 800; font-size: 0.76rem;">#${repRank}</td>
      <td style="text-align: left !important; font-weight: 700; white-space: nowrap;"><strong title="${r.name}">${r.isTL ? '👑 ' : ''}${cleanRepName}</strong></td>
      <td style="white-space: nowrap;"><span style="color: ${r.teamColor}; font-weight: 700; font-size: 0.74rem;">${r.team}</span></td>
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
    const pacePct = model.summary.targetPacePct || 46;

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
  if (elRate) elRate.textContent = `${fmtPct(s.upgradeRate)} Conv. Rate`;
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
                            "name":  "SS Representative",
                            "team":  "",
                            "total":  0,
                            "end_classes":  0,
                            "avg_classes":  0,
                            "c0":  0,
                            "c1_3":  0,
                            "c4_7":  0,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "0%",
                            "p4":  "0%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-adhmgadallah",
                            "team":  "ME-EGSS30",
                            "total":  257,
                            "end_classes":  2749,
                            "avg_classes":  0,
                            "c0":  24,
                            "c1_3":  13,
                            "c4_7":  35,
                            "c8_11":  58,
                            "c12_14":  60,
                            "c15":  67,
                            "c12":  127,
                            "p0":  "9.3%",
                            "p4":  "85.6%",
                            "p8":  "72%",
                            "p12":  "49.4%",
                            "p15":  "26.1%"
                        },
                        {
                            "name":  "EGSS-alihesham01",
                            "team":  "ME-EGSS30",
                            "total":  133,
                            "end_classes":  1522,
                            "avg_classes":  0,
                            "c0":  9,
                            "c1_3":  6,
                            "c4_7":  16,
                            "c8_11":  25,
                            "c12_14":  45,
                            "c15":  32,
                            "c12":  77,
                            "p0":  "6.8%",
                            "p4":  "88.7%",
                            "p8":  "76.7%",
                            "p12":  "57.9%",
                            "p15":  "24.1%"
                        },
                        {
                            "name":  "EGSS-abdelrhmanshehata",
                            "team":  "ME-EGSS30",
                            "total":  191,
                            "end_classes":  2214,
                            "avg_classes":  0,
                            "c0":  14,
                            "c1_3":  10,
                            "c4_7":  19,
                            "c8_11":  48,
                            "c12_14":  39,
                            "c15":  61,
                            "c12":  100,
                            "p0":  "7.3%",
                            "p4":  "87.4%",
                            "p8":  "77.5%",
                            "p12":  "52.4%",
                            "p15":  "31.9%"
                        },
                        {
                            "name":  "EGSS-ehabzaky01",
                            "team":  "ME-EGSS05",
                            "total":  235,
                            "end_classes":  2247,
                            "avg_classes":  0,
                            "c0":  28,
                            "c1_3":  19,
                            "c4_7":  35,
                            "c8_11":  53,
                            "c12_14":  54,
                            "c15":  46,
                            "c12":  100,
                            "p0":  "11.9%",
                            "p4":  "80%",
                            "p8":  "65.1%",
                            "p12":  "42.6%",
                            "p15":  "19.6%"
                        },
                        {
                            "name":  "EGSS-ibrahimismaiel",
                            "team":  "ME-EGSS05",
                            "total":  295,
                            "end_classes":  2543,
                            "avg_classes":  0,
                            "c0":  44,
                            "c1_3":  24,
                            "c4_7":  44,
                            "c8_11":  96,
                            "c12_14":  45,
                            "c15":  42,
                            "c12":  87,
                            "p0":  "14.9%",
                            "p4":  "76.9%",
                            "p8":  "62%",
                            "p12":  "29.5%",
                            "p15":  "14.2%"
                        },
                        {
                            "name":  "EGSS-titooooo",
                            "team":  "ME-EGSS05",
                            "total":  237,
                            "end_classes":  2520,
                            "avg_classes":  0,
                            "c0":  19,
                            "c1_3":  12,
                            "c4_7":  24,
                            "c8_11":  73,
                            "c12_14":  51,
                            "c15":  58,
                            "c12":  109,
                            "p0":  "8%",
                            "p4":  "86.9%",
                            "p8":  "76.8%",
                            "p12":  "46%",
                            "p15":  "24.5%"
                        },
                        {
                            "name":  "EGSS-abdelrahmannasef",
                            "team":  "ME-EGSS05",
                            "total":  219,
                            "end_classes":  2270,
                            "avg_classes":  0,
                            "c0":  24,
                            "c1_3":  12,
                            "c4_7":  22,
                            "c8_11":  56,
                            "c12_14":  54,
                            "c15":  51,
                            "c12":  105,
                            "p0":  "11%",
                            "p4":  "83.6%",
                            "p8":  "73.5%",
                            "p12":  "47.9%",
                            "p15":  "23.3%"
                        },
                        {
                            "name":  "EGSS-omarmoneb",
                            "team":  "ME-EGSS05",
                            "total":  213,
                            "end_classes":  1994,
                            "avg_classes":  0,
                            "c0":  24,
                            "c1_3":  12,
                            "c4_7":  41,
                            "c8_11":  46,
                            "c12_14":  57,
                            "c15":  33,
                            "c12":  90,
                            "p0":  "11.3%",
                            "p4":  "83.1%",
                            "p8":  "63.8%",
                            "p12":  "42.3%",
                            "p15":  "15.5%"
                        },
                        {
                            "name":  "EGLP-saraht",
                            "team":  "ME-EGSS05",
                            "total":  0,
                            "end_classes":  0,
                            "avg_classes":  0,
                            "c0":  0,
                            "c1_3":  0,
                            "c4_7":  0,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "0%",
                            "p4":  "0%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-samira01",
                            "team":  "ME-EGSS05",
                            "total":  257,
                            "end_classes":  2721,
                            "avg_classes":  0,
                            "c0":  19,
                            "c1_3":  22,
                            "c4_7":  35,
                            "c8_11":  49,
                            "c12_14":  74,
                            "c15":  58,
                            "c12":  132,
                            "p0":  "7.4%",
                            "p4":  "84%",
                            "p8":  "70.4%",
                            "p12":  "51.4%",
                            "p15":  "22.6%"
                        },
                        {
                            "name":  "EGSS-khaledgonam",
                            "team":  "ME-EGSS05",
                            "total":  279,
                            "end_classes":  2594,
                            "avg_classes":  0,
                            "c0":  35,
                            "c1_3":  24,
                            "c4_7":  45,
                            "c8_11":  71,
                            "c12_14":  52,
                            "c15":  52,
                            "c12":  104,
                            "p0":  "12.5%",
                            "p4":  "78.9%",
                            "p8":  "62.7%",
                            "p12":  "37.3%",
                            "p15":  "18.6%"
                        },
                        {
                            "name":  "EGSS-ahmedshoukry",
                            "team":  "ME-EGSS10",
                            "total":  347,
                            "end_classes":  3781,
                            "avg_classes":  0,
                            "c0":  23,
                            "c1_3":  18,
                            "c4_7":  43,
                            "c8_11":  90,
                            "c12_14":  84,
                            "c15":  89,
                            "c12":  173,
                            "p0":  "6.6%",
                            "p4":  "88.2%",
                            "p8":  "75.8%",
                            "p12":  "49.9%",
                            "p15":  "25.6%"
                        },
                        {
                            "name":  "EGSS-mahmoudkhamis",
                            "team":  "ME-EGSS10",
                            "total":  322,
                            "end_classes":  3527,
                            "avg_classes":  0,
                            "c0":  20,
                            "c1_3":  16,
                            "c4_7":  38,
                            "c8_11":  90,
                            "c12_14":  77,
                            "c15":  81,
                            "c12":  158,
                            "p0":  "6.2%",
                            "p4":  "88.8%",
                            "p8":  "77%",
                            "p12":  "49.1%",
                            "p15":  "25.2%"
                        },
                        {
                            "name":  "EGLP-mohamed06",
                            "team":  "ME-EGSS10",
                            "total":  0,
                            "end_classes":  0,
                            "avg_classes":  0,
                            "c0":  0,
                            "c1_3":  0,
                            "c4_7":  0,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "0%",
                            "p4":  "0%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-mohamedha",
                            "team":  "ME-EGSS13",
                            "total":  200,
                            "end_classes":  1900,
                            "avg_classes":  0,
                            "c0":  28,
                            "c1_3":  10,
                            "c4_7":  30,
                            "c8_11":  57,
                            "c12_14":  40,
                            "c15":  35,
                            "c12":  75,
                            "p0":  "14%",
                            "p4":  "81%",
                            "p8":  "66%",
                            "p12":  "37.5%",
                            "p15":  "17.5%"
                        },
                        {
                            "name":  "EGSS-hayamhassan",
                            "team":  "ME-EGSS13",
                            "total":  115,
                            "end_classes":  1390,
                            "avg_classes":  0,
                            "c0":  4,
                            "c1_3":  3,
                            "c4_7":  12,
                            "c8_11":  25,
                            "c12_14":  39,
                            "c15":  32,
                            "c12":  71,
                            "p0":  "3.5%",
                            "p4":  "93.9%",
                            "p8":  "83.5%",
                            "p12":  "61.7%",
                            "p15":  "27.8%"
                        },
                        {
                            "name":  "EGSS-marwaahmed",
                            "team":  "ME-EGSS13",
                            "total":  248,
                            "end_classes":  2509,
                            "avg_classes":  0,
                            "c0":  26,
                            "c1_3":  15,
                            "c4_7":  41,
                            "c8_11":  55,
                            "c12_14":  59,
                            "c15":  52,
                            "c12":  111,
                            "p0":  "10.5%",
                            "p4":  "83.5%",
                            "p8":  "66.9%",
                            "p12":  "44.8%",
                            "p15":  "21%"
                        },
                        {
                            "name":  "EGLP-shahdmahmoud",
                            "team":  "ME-EGSS13",
                            "total":  107,
                            "end_classes":  1143,
                            "avg_classes":  0,
                            "c0":  10,
                            "c1_3":  8,
                            "c4_7":  14,
                            "c8_11":  19,
                            "c12_14":  29,
                            "c15":  27,
                            "c12":  56,
                            "p0":  "9.3%",
                            "p4":  "83.2%",
                            "p8":  "70.1%",
                            "p12":  "52.3%",
                            "p15":  "25.2%"
                        },
                        {
                            "name":  "EGSS-amrsafwat",
                            "team":  "ME-EGSS13",
                            "total":  283,
                            "end_classes":  2922,
                            "avg_classes":  0,
                            "c0":  27,
                            "c1_3":  14,
                            "c4_7":  32,
                            "c8_11":  77,
                            "c12_14":  75,
                            "c15":  58,
                            "c12":  133,
                            "p0":  "9.5%",
                            "p4":  "85.5%",
                            "p8":  "74.2%",
                            "p12":  "47%",
                            "p15":  "20.5%"
                        },
                        {
                            "name":  "EGSS-mahmoud04",
                            "team":  "ME-EGSS01",
                            "total":  313,
                            "end_classes":  3110,
                            "avg_classes":  0,
                            "c0":  41,
                            "c1_3":  21,
                            "c4_7":  43,
                            "c8_11":  77,
                            "c12_14":  62,
                            "c15":  69,
                            "c12":  131,
                            "p0":  "13.1%",
                            "p4":  "80.2%",
                            "p8":  "66.5%",
                            "p12":  "41.9%",
                            "p15":  "22%"
                        },
                        {
                            "name":  "EGSS-nohayoussry",
                            "team":  "ME-EGSS01",
                            "total":  243,
                            "end_classes":  2549,
                            "avg_classes":  0,
                            "c0":  21,
                            "c1_3":  20,
                            "c4_7":  30,
                            "c8_11":  60,
                            "c12_14":  55,
                            "c15":  57,
                            "c12":  112,
                            "p0":  "8.6%",
                            "p4":  "83.1%",
                            "p8":  "70.8%",
                            "p12":  "46.1%",
                            "p15":  "23.5%"
                        },
                        {
                            "name":  "EGSS-juliamonir01",
                            "team":  "ME-EGSS01",
                            "total":  262,
                            "end_classes":  2724,
                            "avg_classes":  0,
                            "c0":  16,
                            "c1_3":  25,
                            "c4_7":  27,
                            "c8_11":  63,
                            "c12_14":  76,
                            "c15":  55,
                            "c12":  131,
                            "p0":  "6.1%",
                            "p4":  "84.4%",
                            "p8":  "74%",
                            "p12":  "50%",
                            "p15":  "21%"
                        },
                        {
                            "name":  "EGLP-yasmin01",
                            "team":  "ME-EGSS01",
                            "total":  0,
                            "end_classes":  0,
                            "avg_classes":  0,
                            "c0":  0,
                            "c1_3":  0,
                            "c4_7":  0,
                            "c8_11":  0,
                            "c12_14":  0,
                            "c15":  0,
                            "c12":  0,
                            "p0":  "0%",
                            "p4":  "0%",
                            "p8":  "0%",
                            "p12":  "0%",
                            "p15":  "0%"
                        },
                        {
                            "name":  "EGSS-ashraqatal",
                            "team":  "ME-EGSS01",
                            "total":  250,
                            "end_classes":  2658,
                            "avg_classes":  0,
                            "c0":  21,
                            "c1_3":  21,
                            "c4_7":  27,
                            "c8_11":  56,
                            "c12_14":  65,
                            "c15":  60,
                            "c12":  125,
                            "p0":  "8.4%",
                            "p4":  "83.2%",
                            "p8":  "72.4%",
                            "p12":  "50%",
                            "p15":  "24%"
                        },
                        {
                            "name":  "EGSS-negma",
                            "team":  "ME-EGSS01",
                            "total":  239,
                            "end_classes":  2732,
                            "avg_classes":  0,
                            "c0":  20,
                            "c1_3":  10,
                            "c4_7":  29,
                            "c8_11":  55,
                            "c12_14":  52,
                            "c15":  73,
                            "c12":  125,
                            "p0":  "8.4%",
                            "p4":  "87.4%",
                            "p8":  "75.3%",
                            "p12":  "52.3%",
                            "p15":  "30.5%"
                        }
                    ],
    "unfixed":  [
                    {
                        "name":  "EGSS-adhmgadallah",
                        "team":  "ME-EGSS30",
                        "m0Tot":  18,
                        "m0Fix":  16,
                        "m0Pct":  "88.9%",
                        "m1Tot":  26,
                        "m1Fix":  22,
                        "m1Pct":  "84.6%"
                    },
                    {
                        "name":  "EGSS-alihesham01",
                        "team":  "ME-EGSS30",
                        "m0Tot":  17,
                        "m0Fix":  11,
                        "m0Pct":  "64.7%",
                        "m1Tot":  17,
                        "m1Fix":  17,
                        "m1Pct":  "100%"
                    },
                    {
                        "name":  "EGSS-abdelrhmanshehata",
                        "team":  "ME-EGSS30",
                        "m0Tot":  24,
                        "m0Fix":  18,
                        "m0Pct":  "75%",
                        "m1Tot":  26,
                        "m1Fix":  22,
                        "m1Pct":  "84.6%"
                    },
                    {
                        "name":  "EGSS-ehabzaky01",
                        "team":  "ME-EGSS05",
                        "m0Tot":  25,
                        "m0Fix":  20,
                        "m0Pct":  "80%",
                        "m1Tot":  21,
                        "m1Fix":  16,
                        "m1Pct":  "76.2%"
                    },
                    {
                        "name":  "EGSS-ibrahimismaiel",
                        "team":  "ME-EGSS05",
                        "m0Tot":  22,
                        "m0Fix":  15,
                        "m0Pct":  "68.2%",
                        "m1Tot":  32,
                        "m1Fix":  19,
                        "m1Pct":  "59.4%"
                    },
                    {
                        "name":  "EGSS-titooooo",
                        "team":  "ME-EGSS05",
                        "m0Tot":  27,
                        "m0Fix":  19,
                        "m0Pct":  "70.4%",
                        "m1Tot":  19,
                        "m1Fix":  17,
                        "m1Pct":  "89.5%"
                    },
                    {
                        "name":  "EGSS-abdelrahmannasef",
                        "team":  "ME-EGSS05",
                        "m0Tot":  18,
                        "m0Fix":  17,
                        "m0Pct":  "94.4%",
                        "m1Tot":  19,
                        "m1Fix":  17,
                        "m1Pct":  "89.5%"
                    },
                    {
                        "name":  "EGSS-omarmoneb",
                        "team":  "ME-EGSS05",
                        "m0Tot":  17,
                        "m0Fix":  14,
                        "m0Pct":  "82.4%",
                        "m1Tot":  15,
                        "m1Fix":  11,
                        "m1Pct":  "73.3%"
                    },
                    {
                        "name":  "EGLP-saraht",
                        "team":  "ME-EGSS05",
                        "m0Tot":  0,
                        "m0Fix":  0,
                        "m0Pct":  "0%",
                        "m1Tot":  0,
                        "m1Fix":  0,
                        "m1Pct":  "0%"
                    },
                    {
                        "name":  "EGSS-samira01",
                        "team":  "ME-EGSS05",
                        "m0Tot":  13,
                        "m0Fix":  7,
                        "m0Pct":  "53.8%",
                        "m1Tot":  17,
                        "m1Fix":  16,
                        "m1Pct":  "94.1%"
                    },
                    {
                        "name":  "EGSS-khaledgonam",
                        "team":  "ME-EGSS05",
                        "m0Tot":  12,
                        "m0Fix":  6,
                        "m0Pct":  "50%",
                        "m1Tot":  13,
                        "m1Fix":  6,
                        "m1Pct":  "46.2%"
                    },
                    {
                        "name":  "EGSS-ahmedshoukry",
                        "team":  "ME-EGSS10",
                        "m0Tot":  26,
                        "m0Fix":  21,
                        "m0Pct":  "80.8%",
                        "m1Tot":  34,
                        "m1Fix":  30,
                        "m1Pct":  "88.2%"
                    },
                    {
                        "name":  "EGSS-mahmoudkhamis",
                        "team":  "ME-EGSS10",
                        "m0Tot":  23,
                        "m0Fix":  22,
                        "m0Pct":  "95.7%",
                        "m1Tot":  35,
                        "m1Fix":  32,
                        "m1Pct":  "91.4%"
                    },
                    {
                        "name":  "EGLP-mohamed06",
                        "team":  "ME-EGSS10",
                        "m0Tot":  0,
                        "m0Fix":  0,
                        "m0Pct":  "0%",
                        "m1Tot":  0,
                        "m1Fix":  0,
                        "m1Pct":  "0%"
                    },
                    {
                        "name":  "EGSS-mohamedha",
                        "team":  "ME-EGSS13",
                        "m0Tot":  14,
                        "m0Fix":  0,
                        "m0Pct":  "0%",
                        "m1Tot":  19,
                        "m1Fix":  9,
                        "m1Pct":  "47.4%"
                    },
                    {
                        "name":  "EGSS-hayamhassan",
                        "team":  "ME-EGSS13",
                        "m0Tot":  28,
                        "m0Fix":  21,
                        "m0Pct":  "75%",
                        "m1Tot":  19,
                        "m1Fix":  19,
                        "m1Pct":  "100%"
                    },
                    {
                        "name":  "EGSS-marwaahmed",
                        "team":  "ME-EGSS13",
                        "m0Tot":  20,
                        "m0Fix":  14,
                        "m0Pct":  "70%",
                        "m1Tot":  16,
                        "m1Fix":  14,
                        "m1Pct":  "87.5%"
                    },
                    {
                        "name":  "EGLP-shahdmahmoud",
                        "team":  "ME-EGSS13",
                        "m0Tot":  32,
                        "m0Fix":  18,
                        "m0Pct":  "56.2%",
                        "m1Tot":  22,
                        "m1Fix":  18,
                        "m1Pct":  "81.8%"
                    },
                    {
                        "name":  "EGSS-amrsafwat",
                        "team":  "ME-EGSS13",
                        "m0Tot":  18,
                        "m0Fix":  15,
                        "m0Pct":  "83.3%",
                        "m1Tot":  26,
                        "m1Fix":  21,
                        "m1Pct":  "80.8%"
                    },
                    {
                        "name":  "EGSS-mahmoud04",
                        "team":  "ME-EGSS01",
                        "m0Tot":  16,
                        "m0Fix":  12,
                        "m0Pct":  "75%",
                        "m1Tot":  31,
                        "m1Fix":  29,
                        "m1Pct":  "93.5%"
                    },
                    {
                        "name":  "EGSS-nohayoussry",
                        "team":  "ME-EGSS01",
                        "m0Tot":  16,
                        "m0Fix":  13,
                        "m0Pct":  "81.2%",
                        "m1Tot":  27,
                        "m1Fix":  25,
                        "m1Pct":  "92.6%"
                    },
                    {
                        "name":  "EGSS-juliamonir01",
                        "team":  "ME-EGSS01",
                        "m0Tot":  11,
                        "m0Fix":  4,
                        "m0Pct":  "36.4%",
                        "m1Tot":  20,
                        "m1Fix":  15,
                        "m1Pct":  "75%"
                    },
                    {
                        "name":  "EGLP-yasmin01",
                        "team":  "ME-EGSS01",
                        "m0Tot":  0,
                        "m0Fix":  0,
                        "m0Pct":  "0%",
                        "m1Tot":  0,
                        "m1Fix":  0,
                        "m1Pct":  "0%"
                    },
                    {
                        "name":  "EGSS-ashraqatal",
                        "team":  "ME-EGSS01",
                        "m0Tot":  23,
                        "m0Fix":  11,
                        "m0Pct":  "47.8%",
                        "m1Tot":  31,
                        "m1Fix":  24,
                        "m1Pct":  "77.4%"
                    },
                    {
                        "name":  "EGSS-negma",
                        "team":  "ME-EGSS01",
                        "m0Tot":  23,
                        "m0Fix":  13,
                        "m0Pct":  "56.5%",
                        "m1Tot":  32,
                        "m1Fix":  29,
                        "m1Pct":  "90.6%"
                    }
                ],
    "sop":  [
                {
                    "name":  "EGSS-adhmgadallah",
                    "team":  "ME-EGSS30",
                    "ec":  0,
                    "r1":  0,
                    "r2":  2,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  2
                },
                {
                    "name":  "EGSS-alihesham01",
                    "team":  "ME-EGSS30",
                    "ec":  0,
                    "r1":  0,
                    "r2":  2,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  2
                },
                {
                    "name":  "EGSS-abdelrhmanshehata",
                    "team":  "ME-EGSS30",
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
                    "name":  "EGSS-ehabzaky01",
                    "team":  "ME-EGSS05",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  1
                },
                {
                    "name":  "EGSS-ibrahimismaiel",
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
                    "name":  "EGSS-titooooo",
                    "team":  "ME-EGSS05",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  1,
                    "r6e":  0,
                    "absence":  0,
                    "total":  1
                },
                {
                    "name":  "EGSS-abdelrahmannasef",
                    "team":  "ME-EGSS05",
                    "ec":  0,
                    "r1":  0,
                    "r2":  1,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  1,
                    "total":  2
                },
                {
                    "name":  "EGSS-omarmoneb",
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
                    "name":  "EGLP-saraht",
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
                    "name":  "EGSS-samira01",
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
                    "name":  "EGSS-khaledgonam",
                    "team":  "ME-EGSS05",
                    "ec":  0,
                    "r1":  1,
                    "r2":  1,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  4,
                    "total":  7
                },
                {
                    "name":  "EGSS-ahmedshoukry",
                    "team":  "ME-EGSS10",
                    "ec":  0,
                    "r1":  0,
                    "r2":  0,
                    "r3":  0,
                    "r4":  2,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  2
                },
                {
                    "name":  "EGSS-mahmoudkhamis",
                    "team":  "ME-EGSS10",
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
                    "name":  "EGLP-mohamed06",
                    "team":  "ME-EGSS10",
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
                    "name":  "EGSS-mohamedha",
                    "team":  "ME-EGSS13",
                    "ec":  0,
                    "r1":  1,
                    "r2":  0,
                    "r3":  0,
                    "r4":  1,
                    "r6d":  3,
                    "r6e":  0,
                    "absence":  1,
                    "total":  6
                },
                {
                    "name":  "EGSS-hayamhassan",
                    "team":  "ME-EGSS13",
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
                    "name":  "EGSS-marwaahmed",
                    "team":  "ME-EGSS13",
                    "ec":  1,
                    "r1":  1,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  1,
                    "r6e":  0,
                    "absence":  0,
                    "total":  3
                },
                {
                    "name":  "EGLP-shahdmahmoud",
                    "team":  "ME-EGSS13",
                    "ec":  0,
                    "r1":  3,
                    "r2":  0,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  2,
                    "r6e":  0,
                    "absence":  0,
                    "total":  5
                },
                {
                    "name":  "EGSS-amrsafwat",
                    "team":  "ME-EGSS13",
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
                    "name":  "EGSS-mahmoud04",
                    "team":  "ME-EGSS01",
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
                    "name":  "EGSS-nohayoussry",
                    "team":  "ME-EGSS01",
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
                    "name":  "EGSS-juliamonir01",
                    "team":  "ME-EGSS01",
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
                    "name":  "EGLP-yasmin01",
                    "team":  "ME-EGSS01",
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
                    "name":  "EGSS-ashraqatal",
                    "team":  "ME-EGSS01",
                    "ec":  1,
                    "r1":  2,
                    "r2":  1,
                    "r3":  2,
                    "r4":  0,
                    "r6d":  2,
                    "r6e":  0,
                    "absence":  4,
                    "total":  12
                },
                {
                    "name":  "EGSS-negma",
                    "team":  "ME-EGSS01",
                    "ec":  0,
                    "r1":  0,
                    "r2":  1,
                    "r3":  0,
                    "r4":  0,
                    "r6d":  0,
                    "r6e":  0,
                    "absence":  0,
                    "total":  1
                }
            ],
    "englishClub":  [
                        {
                            "name":  "EGSS-adhmgadallah",
                            "team":  "ME-EGSS30",
                            "base":  64,
                            "book":  24,
                            "att":  19,
                            "pct":  "29.7%",
                            "goal":  26,
                            "need":  7
                        },
                        {
                            "name":  "EGSS-alihesham01",
                            "team":  "ME-EGSS30",
                            "base":  29,
                            "book":  27,
                            "att":  23,
                            "pct":  "79.3%",
                            "goal":  12,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-abdelrhmanshehata",
                            "team":  "ME-EGSS30",
                            "base":  56,
                            "book":  30,
                            "att":  25,
                            "pct":  "44.6%",
                            "goal":  22,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-ehabzaky01",
                            "team":  "ME-EGSS05",
                            "base":  87,
                            "book":  68,
                            "att":  34,
                            "pct":  "39.1%",
                            "goal":  35,
                            "need":  1
                        },
                        {
                            "name":  "EGSS-ibrahimismaiel",
                            "team":  "ME-EGSS05",
                            "base":  99,
                            "book":  52,
                            "att":  30,
                            "pct":  "30.3%",
                            "goal":  40,
                            "need":  10
                        },
                        {
                            "name":  "EGSS-titooooo",
                            "team":  "ME-EGSS05",
                            "base":  85,
                            "book":  35,
                            "att":  22,
                            "pct":  "25.9%",
                            "goal":  34,
                            "need":  12
                        },
                        {
                            "name":  "EGSS-abdelrahmannasef",
                            "team":  "ME-EGSS05",
                            "base":  73,
                            "book":  31,
                            "att":  30,
                            "pct":  "41.1%",
                            "goal":  29,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-omarmoneb",
                            "team":  "ME-EGSS05",
                            "base":  67,
                            "book":  49,
                            "att":  15,
                            "pct":  "22.4%",
                            "goal":  27,
                            "need":  12
                        },
                        {
                            "name":  "EGLP-saraht",
                            "team":  "ME-EGSS05",
                            "base":  0,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  0,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-samira01",
                            "team":  "ME-EGSS05",
                            "base":  65,
                            "book":  45,
                            "att":  27,
                            "pct":  "41.5%",
                            "goal":  26,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-khaledgonam",
                            "team":  "ME-EGSS05",
                            "base":  81,
                            "book":  25,
                            "att":  16,
                            "pct":  "19.8%",
                            "goal":  32,
                            "need":  16
                        },
                        {
                            "name":  "EGSS-ahmedshoukry",
                            "team":  "ME-EGSS10",
                            "base":  127,
                            "book":  57,
                            "att":  44,
                            "pct":  "34.6%",
                            "goal":  51,
                            "need":  7
                        },
                        {
                            "name":  "EGSS-mahmoudkhamis",
                            "team":  "ME-EGSS10",
                            "base":  108,
                            "book":  63,
                            "att":  45,
                            "pct":  "41.7%",
                            "goal":  43,
                            "need":  0
                        },
                        {
                            "name":  "EGLP-mohamed06",
                            "team":  "ME-EGSS10",
                            "base":  0,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  0,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-mohamedha",
                            "team":  "ME-EGSS13",
                            "base":  67,
                            "book":  11,
                            "att":  8,
                            "pct":  "11.9%",
                            "goal":  27,
                            "need":  19
                        },
                        {
                            "name":  "EGSS-hayamhassan",
                            "team":  "ME-EGSS13",
                            "base":  86,
                            "book":  51,
                            "att":  32,
                            "pct":  "37.2%",
                            "goal":  34,
                            "need":  2
                        },
                        {
                            "name":  "EGSS-marwaahmed",
                            "team":  "ME-EGSS13",
                            "base":  80,
                            "book":  37,
                            "att":  23,
                            "pct":  "28.7%",
                            "goal":  32,
                            "need":  9
                        },
                        {
                            "name":  "EGLP-shahdmahmoud",
                            "team":  "ME-EGSS13",
                            "base":  68,
                            "book":  41,
                            "att":  26,
                            "pct":  "38.2%",
                            "goal":  27,
                            "need":  1
                        },
                        {
                            "name":  "EGSS-amrsafwat",
                            "team":  "ME-EGSS13",
                            "base":  95,
                            "book":  66,
                            "att":  44,
                            "pct":  "46.3%",
                            "goal":  38,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-mahmoud04",
                            "team":  "ME-EGSS01",
                            "base":  83,
                            "book":  20,
                            "att":  12,
                            "pct":  "14.5%",
                            "goal":  33,
                            "need":  21
                        },
                        {
                            "name":  "EGSS-nohayoussry",
                            "team":  "ME-EGSS01",
                            "base":  110,
                            "book":  59,
                            "att":  44,
                            "pct":  "40%",
                            "goal":  44,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-juliamonir01",
                            "team":  "ME-EGSS01",
                            "base":  76,
                            "book":  38,
                            "att":  30,
                            "pct":  "39.5%",
                            "goal":  30,
                            "need":  0
                        },
                        {
                            "name":  "EGLP-yasmin01",
                            "team":  "ME-EGSS01",
                            "base":  0,
                            "book":  0,
                            "att":  0,
                            "pct":  "0%",
                            "goal":  0,
                            "need":  0
                        },
                        {
                            "name":  "EGSS-ashraqatal",
                            "team":  "ME-EGSS01",
                            "base":  100,
                            "book":  43,
                            "att":  22,
                            "pct":  "22%",
                            "goal":  40,
                            "need":  18
                        },
                        {
                            "name":  "EGSS-negma",
                            "team":  "ME-EGSS01",
                            "base":  96,
                            "book":  56,
                            "att":  39,
                            "pct":  "40.6%",
                            "goal":  38,
                            "need":  0
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
    const data = filterByTeam(MASTER_OPERATIONS_DATA.sop);
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
          <td><span class="team-badge" style="font-size: 0.72rem;">${r.team}</span></td>
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
    const data = filterByTeam(MASTER_OPERATIONS_DATA.unfixed);
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
          <td><span class="team-badge" style="font-size: 0.72rem;">${r.team}</span></td>
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
    const data = filterByTeam(MASTER_OPERATIONS_DATA.consumption || []);
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
          <td><span class="team-badge" style="font-size: 0.72rem;">${r.team}</span></td>
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
    // Module 4: English Club (40% Target)
    const data = filterByTeam(MASTER_OPERATIONS_DATA.englishClub);
    let rowsHtml = data.map((r, idx) => {
      const pctNum = parseFloat(r.pct) || 0;
      const pctClr = pctNum >= 40 ? '#10b981' : pctNum >= 25 ? '#f59e0b' : '#f43f5e';
      const needBadge = r.need === 0 
        ? `<span class="op-badge-met">Goal Met 🎉</span>` 
        : `<span style="font-family: var(--font-mono); font-weight: 700; color: #fbbf24;">${r.need} IDs needed</span>`;

      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td><span class="team-badge" style="font-size: 0.72rem;">${r.team}</span></td>
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
            <th style="color: #60a5fa;">40% Goal (IDs)</th>
            <th style="text-align: center; color: #fbbf24;">Gap to 40% Goal</th>
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
                              "ccCount":  0,
                              "ftCount":  79,
                              "sopCount":  47,
                              "ecCount":  76,
                              "totalLeads":  202
                          },
    "EGSS-marwaahmed":  {
                            "ccCount":  0,
                            "ftCount":  56,
                            "sopCount":  75,
                            "ecCount":  80,
                            "totalLeads":  211
                        },
    "EGLP-shahdmahmoud":  {
                              "ccCount":  0,
                              "ftCount":  38,
                              "sopCount":  64,
                              "ecCount":  68,
                              "totalLeads":  170
                          },
    "EGSS-negma":  {
                       "ccCount":  0,
                       "ftCount":  50,
                       "sopCount":  10,
                       "ecCount":  96,
                       "totalLeads":  156
                   },
    "EGSS-mahmoud04":  {
                           "ccCount":  0,
                           "ftCount":  76,
                           "sopCount":  113,
                           "ecCount":  85,
                           "totalLeads":  274
                       },
    "EGSS-mohamedha":  {
                           "ccCount":  0,
                           "ftCount":  66,
                           "sopCount":  105,
                           "ecCount":  68,
                           "totalLeads":  239
                       },
    "EGSS-titooooo":  {
                          "ccCount":  0,
                          "ftCount":  47,
                          "sopCount":  76,
                          "ecCount":  76,
                          "totalLeads":  199
                      },
    "EGSS-abdelrahmannasef":  {
                                  "ccCount":  0,
                                  "ftCount":  46,
                                  "sopCount":  77,
                                  "ecCount":  73,
                                  "totalLeads":  196
                              },
    "EGSS-nohayoussry":  {
                             "ccCount":  0,
                             "ftCount":  42,
                             "sopCount":  70,
                             "ecCount":  109,
                             "totalLeads":  221
                         },
    "EGSS-samira01":  {
                          "ccCount":  0,
                          "ftCount":  48,
                          "sopCount":  15,
                          "ecCount":  58,
                          "totalLeads":  121
                      },
    "EGSS-alihesham01":  {
                             "ccCount":  0,
                             "ftCount":  25,
                             "sopCount":  9,
                             "ecCount":  26,
                             "totalLeads":  60
                         },
    "EGSS-adhmgadallah":  {
                              "ccCount":  0,
                              "ftCount":  57,
                              "sopCount":  24,
                              "ecCount":  62,
                              "totalLeads":  143
                          },
    "EGSS-omarmoneb":  {
                           "ccCount":  0,
                           "ftCount":  71,
                           "sopCount":  10,
                           "ecCount":  67,
                           "totalLeads":  148
                       },
    "EGLP-mohamed06":  {
                           "ccCount":  0,
                           "ftCount":  60,
                           "sopCount":  20,
                           "ecCount":  64,
                           "totalLeads":  144
                       },
    "EGSS-hayamhassan":  {
                             "ccCount":  0,
                             "ftCount":  11,
                             "sopCount":  13,
                             "ecCount":  84,
                             "totalLeads":  108
                         },
    "EGSS-ahmedshoukry":  {
                              "ccCount":  0,
                              "ftCount":  64,
                              "sopCount":  25,
                              "ecCount":  101,
                              "totalLeads":  190
                          },
    "EGSS-ashraqatal":  {
                            "ccCount":  0,
                            "ftCount":  86,
                            "sopCount":  59,
                            "ecCount":  101,
                            "totalLeads":  246
                        },
    "EGSS-abdelrhmanshehata":  {
                                   "ccCount":  0,
                                   "ftCount":  24,
                                   "sopCount":  2,
                                   "ecCount":  26,
                                   "totalLeads":  52
                               },
    "EGSS-amrsafwat":  {
                           "ccCount":  0,
                           "ftCount":  69,
                           "sopCount":  27,
                           "ecCount":  98,
                           "totalLeads":  194
                       },
    "EGSS-ibrahimismaiel":  {
                                "ccCount":  0,
                                "ftCount":  90,
                                "sopCount":  8,
                                "ecCount":  82,
                                "totalLeads":  180
                            },
    "EGSS-mahmoudkhamis":  {
                               "ccCount":  0,
                               "ftCount":  36,
                               "sopCount":  22,
                               "ecCount":  90,
                               "totalLeads":  148
                           },
    "EGSS-ehabzaky01":  {
                            "ccCount":  0,
                            "ftCount":  35,
                            "sopCount":  52,
                            "ecCount":  80,
                            "totalLeads":  167
                        },
    "EGSS-khaledgonam":  {
                             "ccCount":  0,
                             "ftCount":  68,
                             "sopCount":  77,
                             "ecCount":  74,
                             "totalLeads":  219
                         },
    "EGLP-saraht":  {
                        "ccCount":  0,
                        "ftCount":  66,
                        "sopCount":  50,
                        "ecCount":  70,
                        "totalLeads":  186
                    }
};















function initPersonalRepSelect() {
  const sel = document.getElementById('personalRepSelect');
  if (!sel || !window.MASTER_OPERATIONS_DATA) return;

  const reps = MASTER_OPERATIONS_DATA.sop.map(r => r.name).sort();
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

  const info = LEADS_SUMMARY[rep] || { sopCount: 0, ftCount: 0, ccCount: 0, ecCount: 0, totalLeads: 0 };
  
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

function downloadSelectedRepLeads() {
  const sel = document.getElementById('personalRepSelect');
  const rep = sel ? sel.value : '';
  if (!rep) {
    alert('Please select your name first!');
    return;
  }

  const link = document.createElement('a');
  link.href = `leads/${rep}.csv`;
  link.download = `${rep}_Daily_Actionable_Leads.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================================================================
// NAVIGATION, EVENTS & APPLICATION INITIALIZATION
// =========================================================================

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
    { name: 'renderSOPTab', fn: () => renderSOPTab() },
    { name: 'renderRecommendationsTab', fn: () => renderRecommendationsTab(model) },
    { name: 'renderOperationsTab', fn: () => renderOperationsTab() },
    { name: 'initPersonalRepSelect', fn: () => initPersonalRepSelect() }
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
      latestTime: '2026-09-30 12:15:39', name: 'Lens Sheet (POOL_Detail16)'
    },
    {
      idPrefix: 'EC',
      chkId: 'chkECSheet',
      timeId: 'timeECSheet',
      itemId: 'syncItemEC',
      latestTime: '2026-09-30 13:11:06', name: 'English Club Sheet'
    },
    {
      idPrefix: 'SOP',
      chkId: 'chkSOPSheet',
      timeId: 'timeSOPSheet',
      itemId: 'syncItemSOP',
      latestTime: '2026-09-30 12:08:26', name: 'SOP Compliance Sheet'
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

































































































































