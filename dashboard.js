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

// Verified Live CRM Performance + POOL_Detail Renewal/Upgrade Breakdown (Sep 1–16, 2026 - Data Center Live)
const REPS_DATA = [
  // ==================== ME-EGSS01 (Total Base: 200) ====================
  { name: "EGSS-nohayoussry", team: "EGSS01", cash: 3832, contracts: 6, upgradeM2: 1, normalRenewals: 5, upgradeBase: 60, poolRenewals: 1 },
  { name: "EGSS-ashraqatal", team: "EGSS01", cash: -380, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 57, poolRenewals: 1 },
  { name: "EGSS-negma", team: "EGSS01", cash: 4160, contracts: 2, upgradeM2: 1, normalRenewals: 1, upgradeBase: 37, poolRenewals: 2 },
  { name: "EGSS-juliamonir01", team: "EGSS01", cash: 2040, contracts: 2, upgradeM2: 0, normalRenewals: 2, upgradeBase: 30, poolRenewals: 1 },
  { name: "EGSS-mahmoud04", team: "EGSS01", cash: 2540, contracts: 3, upgradeM2: 0, normalRenewals: 3, upgradeBase: 11, poolRenewals: 4 },
  { name: "EGLP-yasmin01", team: "EGSS01", cash: 0, contracts: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 5, poolRenewals: 0 },

  // ==================== ME-EGSS05 (Total Base: 232) ====================
  { name: "EGSS-AbdelrahmanNASEF", team: "EGSS05", cash: 7341, contracts: 9, upgradeM2: 2, normalRenewals: 7, upgradeBase: 27, poolRenewals: 6 },
  { name: "EGSS-titooooo", team: "EGSS05", cash: 4840, contracts: 5, upgradeM2: 0, normalRenewals: 5, upgradeBase: 26, poolRenewals: 4 },
  { name: "EGSS-OmarMoneb", team: "EGSS05", cash: 4580, contracts: 5, upgradeM2: 0, normalRenewals: 5, upgradeBase: 22, poolRenewals: 3 },
  { name: "EGSS-KhaledGonam", team: "EGSS05", cash: 3930, contracts: 5, upgradeM2: 0, normalRenewals: 5, upgradeBase: 18, poolRenewals: 4 },
  { name: "EGSS-Ibrahimismaiel", team: "EGSS05", cash: 3727, contracts: 6, upgradeM2: 2, normalRenewals: 4, upgradeBase: 41, poolRenewals: 5 },
  { name: "EGSS-samira01", team: "EGSS05", cash: 2536, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 25, poolRenewals: 4 },
  { name: "EGLP-saraht", team: "EGSS05", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 35, poolRenewals: 1 },
  { name: "EGSS-ehabzaky01", team: "EGSS05", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 38, poolRenewals: 1 },

  // ==================== ME-EGSS10 (Total Base: 112) ====================
  { name: "EGSS-Mahmoudkhamis", team: "EGSS10", cash: 4050, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 40, poolRenewals: 4 },
  { name: "EGSS-AhmedShoukry", team: "EGSS10", cash: 3540, contracts: 4, upgradeM2: 0, normalRenewals: 4, upgradeBase: 39, poolRenewals: 4 },
  { name: "EGLP-mohamed06", team: "EGSS10", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 33, poolRenewals: 1 },

  // ==================== ME-EGSS13 (Total Base: 186) ====================
  { name: "EGSS-mohamedha", team: "EGSS13", cash: 10060, contracts: 10, upgradeM2: 3, normalRenewals: 7, upgradeBase: 24, poolRenewals: 10 },
  { name: "EGSS-Amrsafwat", team: "EGSS13", cash: 5960, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 28, poolRenewals: 2 },
  { name: "EGSS-hayamhassan", team: "EGSS13", cash: 3662, contracts: 8, upgradeM2: 3, normalRenewals: 5, upgradeBase: 79, poolRenewals: 4 },
  { name: "EGSS-marwaahmed", team: "EGSS13", cash: 2700, contracts: 3, upgradeM2: 1, normalRenewals: 2, upgradeBase: 9, poolRenewals: 3 },
  { name: "EGLP-ShahdMahmoud", team: "EGSS13", cash: 0, contracts: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 46, poolRenewals: 0 },

  // ==================== ME-EGSS30 (Total Base: 33) ====================
  { name: "EGSS-AdhmGadAllah", team: "EGSS30", cash: 8100, contracts: 10, upgradeM2: 1, normalRenewals: 9, upgradeBase: 23, poolRenewals: 9 },
  { name: "EGSS-abdelrhmanshehata", team: "EGSS30", cash: 3320, contracts: 3, upgradeM2: 1, normalRenewals: 2, upgradeBase: 5, poolRenewals: 2 },
  { name: "EGSS-alihesham01", team: "EGSS30", cash: 1820, contracts: 2, upgradeM2: 0, normalRenewals: 2, upgradeBase: 5, poolRenewals: 2 }
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
  "EGSS-hayamhassan": 59.7,
  "EGSS-alihesham01": 100.0,
  "EGSS-samira01": 81.0,
  "EGSS-abdelrhmanshehata": 83.3,
  "EGLP-ShahdMahmoud": 51.2,
  "EGLP-saraht": 61.3,
  "EGSS-marwaahmed": 87.5,
  "EGSS-OmarMoneb": 50.0,
  "EGSS-negma": 57.8,
  "EGSS-Mahmoudkhamis": 36.6,
  "EGSS-juliamonir01": 50.0,
  "EGSS-AbdelrahmanNASEF": 60.0,
  "EGSS-Ibrahimismaiel": 72.4,
  "EGSS-nohayoussry": 40.4,
  "EGSS-AdhmGadAllah": 65.2,
  "EGSS-titooooo": 70.8,
  "EGSS-ehabzaky01": 45.7,
  "EGSS-ashraqatal": 34.1,
  "EGSS-AhmedShoukry": 61.1,
  "EGSS-Amrsafwat": 58.3,
  "EGSS-mahmoud04": 66.7,
  "EGSS-KhaledGonam": 78.6,
  "EGSS-mohamedha": 31.8,
  "EGLP-mohamed06": 16.1,
  "EGLP-yasmin01": 0.0
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

// Build Unified Data Intelligence Model
function buildDataModel() {
  const daysPassed = 16; // Current MTD Day (Sep 16, 2026)
  const daysInMonth = 30;
  const daysLeft = daysInMonth - daysPassed;
  const expectedPace = OFFICIAL_PACING_CURVE[daysPassed] || 46;

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
    const target = NEW_TARGETS[raw.name] || 0;
    const ach = target > 0 ? ((raw.cash / target) * 100) : 0;
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
    t.cash += rep.cash;
    t.target += rep.target;
    t.contracts += rep.contracts;
    t.upgradeM2 += rep.upgradeM2;
    t.normalRenewals += rep.normalRenewals;
    t.upgradeBase += rep.upgradeBase;
    t.poolRenewals += rep.poolRenewals;
    t.members.push(rep);

    return rep;
  });

  // Calculate team achievements and run-rates
  teamKeys.forEach(tk => {
    const t = teams[tk];
    t.achievement = t.target > 0 ? ((t.cash / t.target) * 100) : 0;
    t.gap = Math.max(0, t.target - t.cash);
    t.projected = Math.round((t.cash / daysPassed) * daysInMonth);
    t.dailyNeeded = Math.round(t.gap / daysLeft);
    t.upgradeRate = t.upgradeBase > 0 ? ((t.upgradeM2 / t.upgradeBase) * 100) : 0;
    t.upgrade20Target = Math.ceil(t.upgradeBase * 0.20);
    t.upgrade20Needed = Math.max(0, t.upgrade20Target - t.upgradeM2);
  });

  const totalCash = individuals.reduce((sum, r) => sum + r.cash, 0);
  const totalTarget = individuals.reduce((sum, r) => sum + r.target, 0);
  const totalContracts = individuals.reduce((sum, r) => sum + r.contracts, 0);
  const totalUpgradeM2 = individuals.reduce((sum, r) => sum + r.upgradeM2, 0);
  const totalNormalRenewals = individuals.reduce((sum, r) => sum + r.normalRenewals, 0);
  const totalUpgradeBase = individuals.reduce((sum, r) => sum + r.upgradeBase, 0);
  const totalUpgrade20Target = Math.ceil(totalUpgradeBase * 0.20);
  const totalUpgrade20Needed = Math.max(0, totalUpgrade20Target - totalUpgradeM2);

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
      achievement: ((totalCash / totalTarget) * 100),
      projectedCash: Math.round((totalCash / daysPassed) * daysInMonth),
      totalGap: totalTarget - totalCash,
      dailyNeeded: Math.round((totalTarget - totalCash) / daysLeft),
      upgradeRate: ((totalUpgradeM2 / totalUpgradeBase) * 100),
      activeReps: individuals.length,
      zeroReps: individuals.filter(r => r.cash === 0).length,
      targetPacePct: expectedPace,
      pacingGapPct: Math.round((((totalCash / totalTarget) * 100) - expectedPace) * 10) / 10,
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
  const rulerMilestones = [
    { day: 1, pct: 5 },
    { day: 5, pct: 14 },
    { day: 10, pct: 29 },
    { day: 14, pct: 40 },
    { day: 15, pct: 43 },
    { day: 16, pct: 46, isToday: true },
    { day: 20, pct: 54 },
    { day: 25, pct: 65 },
    { day: 27, pct: 80 },
    { day: 28, pct: 87 },
    { day: 29, pct: 94 },
    { day: 30, pct: 103, isGoal: true }
  ];

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
      <td style="font-family: var(--font-mono); font-weight: 700; color: #a78bfa;">${fmtPct(r.upgradeRate)}</td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: #facc15; text-align: center;">${fmtPct(r.coverRate)}</td>
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
          <div style="font-family: var(--font-mono);">
            <span style="color: #fff; font-weight: 600;">${fmt(m.cash)}</span>
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
          <div style="font-size: 0.72rem; color: var(--text-muted);">Cash Achieved</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: #fff; font-family: var(--font-mono);">${fmt(t.cash)}</div>
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
      </div>
      <div style="margin-top: 10px;">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; font-weight: 600;">Team Member Roster (Sorted by Cash Ach %)</div>
        ${memberRows}
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
  if (sortFilter === 'upg-rate-desc') filtered.sort((a, b) => b.upgradeRate - a.upgradeRate || b.achievement - a.achievement);
  else if (sortFilter === 'cover-rate-desc') filtered.sort((a, b) => b.coverRate - a.coverRate || b.achievement - a.achievement);
  else if (sortFilter === 'ach-desc') filtered.sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);
  else if (sortFilter === 'cash-desc') filtered.sort((a, b) => b.cash - a.cash || b.achievement - a.achievement);
  else if (sortFilter === 'gap-desc') filtered.sort((a, b) => b.gap - a.gap || b.achievement - a.achievement);
  else if (sortFilter === 'upgrade-desc') filtered.sort((a, b) => b.upgradeM2 - a.upgradeM2 || b.achievement - a.achievement);
  else if (sortFilter === 'contracts-desc') filtered.sort((a, b) => b.contracts - a.contracts || b.achievement - a.achievement);
  else filtered.sort((a, b) => b.achievement - a.achievement || b.cash - a.cash || b.contracts - a.contracts);

  // 4. Render Cards
  container.innerHTML = '';
  filtered.forEach((r, idx) => {
    const repRank = teamFilter === 'all' ? sectorRankMap.get(r.name) : teamRankMap.get(r.name);
    const card = document.createElement('div');
    card.className = 'calc-card';
    card.style.borderLeft = `4px solid ${r.teamColor}`;
    card.style.animationDelay = `${idx * 0.06}s`;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 800; font-size: 0.95rem;">#${repRank}</span>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0;">${r.isTL ? '👑 ' : ''}${r.name}</h3>
          </div>
          <span style="font-size: 0.8rem; color: ${r.teamColor}; margin-top: 2px; display: inline-block;">${r.teamLabel}</span>
        </div>
        <span class="status-badge" style="background: ${r.statusColor}20; color: ${r.statusColor}; border: 1px solid ${r.statusColor}40;">
          ${r.status}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; font-size: 0.85rem;">
        <div><span style="color: var(--text-muted);">Cash:</span> <strong style="color: #fff; font-family: var(--font-mono);">${fmt(r.cash)}</strong></div>
        <div><span style="color: var(--text-muted);">Target:</span> <span style="color: var(--text-secondary); font-family: var(--font-mono);">${fmt(r.target)}</span></div>
        <div><span style="color: var(--text-muted);">Ach:</span> <strong style="color: ${r.statusColor}; font-family: var(--font-mono);">${fmtPct(r.achievement)}</strong></div>
        <div><span style="color: var(--text-muted);">M2 Conv %:</span> <strong style="color: #a78bfa; font-family: var(--font-mono);">${fmtPct(r.upgradeRate)}</strong></div>
      </div>

      <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: var(--radius-sm); font-size: 0.8rem; border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">Pace (Day 16: 46%):</span>
          <strong style="color: ${r.achievement >= 46 ? '#10b981' : (r.achievement >= 38 ? '#f59e0b' : '#f43f5e')}; font-family: var(--font-mono); font-weight: 800;">
            ${(r.achievement - 46) >= 0 ? '+' : ''}${(r.achievement - 46).toFixed(1)}% (${r.achievement >= 46 ? 'Ahead' : (r.achievement >= 38 ? 'Near' : 'Behind')})
          </strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">Upgrade M2:</span>
          <strong style="color: #10b981;">${r.upgradeM2}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">Upgrade Base:</span>
          <span style="color: var(--text-secondary);">${r.upgradeBase} leads</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">20% Upgrade Goal:</span>
          <strong style="color: #c084fc;">${r.upgrade20Target} <span style="font-size: 0.75rem; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">(${r.upgrade20Needed} needed)</span></strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">M2 Cover Rate % (POOL22):</span>
          <strong style="color: #facc15; font-family: var(--font-mono); font-weight: 800;">${fmtPct(r.coverRate)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Total Contracts:</span>
          <strong style="color: #fff;">${r.contracts}</strong>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // 5. Render Table
  tableBody.innerHTML = '';
  filtered.forEach((r, idx) => {
    const pacePct = model.summary.targetPacePct || 46;
    const expRepCash = Math.round(r.target * (pacePct / 100));
    const deltaPace = Math.round((r.achievement - pacePct) * 10) / 10;
    const isAhead = r.achievement >= pacePct;
    const isNear = r.achievement >= (pacePct - 10);
    const paceStatusClr = isAhead ? '#10b981' : (isNear ? '#f59e0b' : '#f43f5e');
    const repRank = teamFilter === 'all' ? sectorRankMap.get(r.name) : teamRankMap.get(r.name);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 800;">#${repRank}</td>
      <td><strong>${r.isTL ? '👑 ' : ''}${r.name}</strong></td>
      <td><span style="color: ${r.teamColor}; font-weight: 600;">${r.team}</span></td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${fmt(r.cash)}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(r.target)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.statusColor};">${fmtPct(r.achievement)}</td>
      <td style="text-align: center;">
        <span style="background: ${paceStatusClr}18; color: ${paceStatusClr}; border: 1px solid ${paceStatusClr}35; padding: 2px 7px; border-radius: 4px; font-weight: 800; font-family: var(--font-mono); font-size: 0.75rem;">
          ${deltaPace >= 0 ? '+' : ''}${deltaPace}%
        </span>
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px; font-family: var(--font-mono);">Exp: ${fmt(expRepCash)}</div>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.upgradeM2 > 0 ? '#10b981' : 'var(--text-muted)'};">${r.upgradeM2}</td>
      <td style="font-family: var(--font-mono);">${r.upgradeBase}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #c084fc;">${r.upgrade20Target} <span style="font-size: 0.75rem; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">(${r.upgrade20Needed} needed)</span></td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #a78bfa;">${fmtPct(r.upgradeRate)}</td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: #facc15; text-align: center;">${fmtPct(r.coverRate)}</td>
      <td style="font-family: var(--font-mono); font-weight: 600;">${r.contracts}</td>
      <td><span class="status-badge" style="background: ${r.statusColor}20; color: ${r.statusColor};">${r.status}</span></td>
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
          <td style="font-family: var(--font-mono); color: #c084fc;">${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)</td>
          <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(s.upgradeRate)}</td>
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
          <td style="font-family: var(--font-mono); color: #c084fc;">${teamUpgrade20Target} (${teamUpgrade20Needed} needed)</td>
          <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(teamUpgradeRate)}</td>
          <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(teamAvgCover)}</td>
          <td style="font-family: var(--font-mono); color: #fff;">${teamContracts}</td>
          <td><span class="status-badge" style="background: ${teamColor}25; color: ${teamColor}; border: 1px solid ${teamColor}50;">${teamFilter} Total</span></td>
        </tr>
      `;
    }
  }
}

function renderBreakdownTab(model) {
  // Top Upgrade Producers
  const leadersContainer = document.getElementById('upgradeLeadersList');
  if (leadersContainer) {
    const topUpgraders = [...model.individuals]
      .filter(r => r.upgradeM2 > 0)
      .sort((a, b) => b.upgradeRate - a.upgradeRate || b.upgradeM2 - a.upgradeM2);

    leadersContainer.innerHTML = topUpgraders.map((r, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
        <div>
          <span style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 700; margin-right: 6px;">#${idx + 1}</span>
          <strong style="color: #fff;">${r.name}</strong>
          <span style="color: ${r.teamColor}; font-size: 0.75rem; margin-left: 6px;">(${r.team})</span>
        </div>
        <div style="font-family: var(--font-mono);">
          <span style="color: #10b981; font-weight: 800; font-size: 1rem;">${fmtPct(r.upgradeRate)} M2 Conv. %</span>
          <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 4px;">(${r.upgradeM2}/${r.upgradeBase})</span>
        </div>
      </div>
    `).join('');
  }

  // Detailed Table
  const tbody = document.getElementById('upgradeDetailTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sorted = [...model.individuals].sort((a, b) => b.upgradeRate - a.upgradeRate || b.coverRate - a.coverRate);

  sorted.forEach((r, idx) => {
    const share = model.summary.totalUpgradeM2 > 0 ? ((r.upgradeM2 / model.summary.totalUpgradeM2) * 100) : 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 700;">#${idx + 1}</td>
      <td><span style="color: ${r.teamColor}; font-weight: 600;">${r.team}</span></td>
      <td><strong>${r.name}</strong></td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: ${r.upgradeM2 > 0 ? '#10b981' : 'var(--text-muted)'};">${r.upgradeM2}</td>
      <td style="font-family: var(--font-mono);">${r.upgradeBase}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #c084fc;">${r.upgrade20Target} <span style="font-size: 0.75rem; color: ${r.upgrade20Needed > 0 ? '#f43f5e' : '#10b981'};">(${r.upgrade20Needed} needed)</span></td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.upgradeRate > 3 ? '#10b981' : 'var(--text-secondary)'};">${fmtPct(r.upgradeRate)}</td>
      <td style="font-family: var(--font-mono); font-weight: 800; color: #facc15; text-align: center;">${fmtPct(r.coverRate)}</td>
      <td style="font-family: var(--font-mono); font-weight: 600; color: #fff;">${r.contracts}</td>
      <td style="font-family: var(--font-mono); color: #38bdf8;">${r.normalRenewals}</td>
      <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(share)}</td>
    `;
    tbody.appendChild(tr);
  });

  const tfoot = document.getElementById('upgradeDetailTableFoot');
  if (tfoot) {
    const s = model.summary;
    const avgCover = model.individuals.length > 0 ? (model.individuals.reduce((sum, r) => sum + r.coverRate, 0) / model.individuals.length) : 0;
    tfoot.innerHTML = `
      <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
        <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">TOTAL / SECTOR AVERAGE</td>
        <td style="font-family: var(--font-mono); color: #10b981; font-size: 0.95rem;">${s.totalUpgradeM2}</td>
        <td style="font-family: var(--font-mono);">${s.totalUpgradeBase}</td>
        <td style="font-family: var(--font-mono); color: #c084fc;">${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)</td>
        <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(s.upgradeRate)}</td>
        <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(avgCover)}</td>
        <td style="font-family: var(--font-mono); color: #fff;">${s.totalContracts}</td>
        <td style="font-family: var(--font-mono); color: #38bdf8;">${s.totalNormalRenewals}</td>
        <td style="font-family: var(--font-mono); color: #a78bfa;">100.0%</td>
      </tr>
    `;
  }
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
  const container = document.getElementById('recommendationsContent');
  if (!container) return;
  container.innerHTML = '';

  const s = model.summary;
  const zeroReps = model.individuals.filter(r => r.cash === 0);

  const recs = [
    {
      title: "Immediate Intervention: Zero-Sales Reps",
      type: "critical",
      color: "#f43f5e",
      text: `There are currently <strong>${zeroReps.length} sales specialists</strong> with $0 revenue at Day 14 (${zeroReps.map(r => r.name).join(', ')}). Immediate manager check-in required. Assign hot renewal leads and pair with top producers.`
    },
    {
      title: "M2 Upgrade Conversion Acceleration",
      type: "opportunity",
      color: "#10b981",
      text: `Currently <strong>21 M2 upgrades</strong> have closed out of <strong>763 pool base leads (2.75%)</strong>. Reaching 3.5% (27 upgrades) unlocks higher conversion efficiency and team performance bonuses.`
    },
    {
      title: "Run-Rate Pacing to Secure 80% Qualifying Target Gate",
      type: "strategic",
      color: "#06b6d4",
      text: `Current pace projects Big Team 01 to reach <strong>$194,670 (86.3% of target)</strong>. This safely clears the 80% qualifying cutoff ($180,480). Boosting daily production to $9,132/day will push total volume to full target ($225,600).`
    },
    {
      title: "Team 13 & Team 30 Momentum Capture",
      type: "highlight",
      color: "#f59e0b",
      text: `Team 13 (Mohamedha at $10,080 / 108% ach) and Team 30 (AdhmGadAllah at $7,860 / 92.7% ach) are leading conversion efficiency. Leverage their follow-up cadences as best practice models for Team 01 and Team 10.`
    }
  ];

  recs.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'calc-card';
    card.style.borderLeft = `4px solid ${rec.color}`;
    card.innerHTML = `
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 8px;">${rec.title}</h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${rec.text}</p>
    `;
    container.appendChild(card);
  });
}

// =========================================================================
// TAB SWITCHING & INTERACTION
// =========================================================================

function switchTab(tabKey) {
  document.querySelectorAll('.tab').forEach(b => {
    if (b.dataset.tab === tabKey) b.classList.add('active');
    else b.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(c => {
    if (c.id === `tab-${tabKey}`) c.classList.add('active');
    else c.classList.remove('active');
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
  const model = buildDataModel();
  window.__model = model;

  renderKPIs(model);
  renderTeamBars(model);
  renderOverviewTable(model);
  renderSmallTeamsTab(model);
  renderIndividualsTab(model);
  renderBreakdownTab(model);
  renderSOPTab();
  renderRecommendationsTab(model);
  renderOperationsTab();
  initPersonalRepSelect();

  setupEvents(model);
  checkSheetSyncStatus();

  // Smooth Loader Fade-Out
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }
  }, 400);
});

// Sheet Synchronization Status Inspector
function checkSheetSyncStatus() {
  const syncFiles = [
    {
      idPrefix: 'Lens',
      chkId: 'chkLensSheet',
      timeId: 'timeLensSheet',
      itemId: 'syncItemLens',
      latestTime: '2026-09-16 19:32:59', name: 'Lens Sheet (POOL_Detail16)'
    },
    {
      idPrefix: 'EC',
      chkId: 'chkECSheet',
      timeId: 'timeECSheet',
      itemId: 'syncItemEC',
      latestTime: '2026-09-16 14:39:11', name: 'English Club Sheet'
    },
    {
      idPrefix: 'SOP',
      chkId: 'chkSOPSheet',
      timeId: 'timeSOPSheet',
      itemId: 'syncItemSOP',
      latestTime: '2026-09-16 14:23:13', name: 'SOP Compliance Sheet'
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
// OPERATIONS MASTER (ALL IN ONE INTEGRATION TRIAL)
// =========================================================================

const MASTER_OPERATIONS_DATA = {
  "consumption": [
    {
      "name": "EGSS-adhmgadallah",
      "total": 227,
      "c0": 49,
      "c1_3": 150,
      "c4_7": 28,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-alihesham01",
      "total": 104,
      "c0": 17,
      "c1_3": 70,
      "c4_7": 16,
      "c8_11": 1,
      "c12": 0,
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-abdelrhmanshehata",
      "total": 112,
      "c0": 20,
      "c1_3": 60,
      "c4_7": 32,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-ehabzaky01",
      "total": 219,
      "c0": 56,
      "c1_3": 136,
      "c4_7": 27,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-ibrahimismaiel",
      "total": 241,
      "c0": 62,
      "c1_3": 153,
      "c4_7": 26,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-titooooo",
      "total": 229,
      "c0": 44,
      "c1_3": 154,
      "c4_7": 31,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-abdelrahmannasef",
      "total": 224,
      "c0": 44,
      "c1_3": 154,
      "c4_7": 25,
      "c8_11": 1,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-omarmoneb",
      "total": 214,
      "c0": 49,
      "c1_3": 147,
      "c4_7": 18,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGLP-saraht",
      "total": 188,
      "c0": 48,
      "c1_3": 126,
      "c4_7": 14,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-samira01",
      "total": 213,
      "c0": 50,
      "c1_3": 130,
      "c4_7": 33,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-khaledgonam",
      "total": 271,
      "c0": 73,
      "c1_3": 165,
      "c4_7": 30,
      "c8_11": 2,
      "c12": 1,
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-ahmedshoukry",
      "total": 285,
      "c0": 57,
      "c1_3": 187,
      "c4_7": 41,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS10"
    },
    {
      "name": "EGSS-mahmoudkhamis",
      "total": 221,
      "c0": 44,
      "c1_3": 141,
      "c4_7": 36,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS10"
    },
    {
      "name": "EGLP-mohamed06",
      "total": 188,
      "c0": 33,
      "c1_3": 126,
      "c4_7": 29,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS10"
    },
    {
      "name": "EGSS-mohamedha",
      "total": 207,
      "c0": 59,
      "c1_3": 124,
      "c4_7": 24,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-hayamhassan",
      "total": 102,
      "c0": 13,
      "c1_3": 74,
      "c4_7": 15,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-marwaahmed",
      "total": 251,
      "c0": 55,
      "c1_3": 166,
      "c4_7": 28,
      "c8_11": 2,
      "c12": 0,
      "team": "ME-EGSS13"
    },
    {
      "name": "EGLP-shahdmahmoud",
      "total": 107,
      "c0": 20,
      "c1_3": 69,
      "c4_7": 18,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-amrsafwat",
      "total": 285,
      "c0": 56,
      "c1_3": 189,
      "c4_7": 38,
      "c8_11": 2,
      "c12": 0,
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-mahmoud04",
      "total": 300,
      "c0": 80,
      "c1_3": 190,
      "c4_7": 30,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-nohayoussry",
      "total": 211,
      "c0": 40,
      "c1_3": 137,
      "c4_7": 33,
      "c8_11": 1,
      "c12": 0,
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-juliamonir01",
      "total": 240,
      "c0": 44,
      "c1_3": 173,
      "c4_7": 23,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS01"
    },
    {
      "name": "EGLP-yasmin01",
      "total": 108,
      "c0": 18,
      "c1_3": 75,
      "c4_7": 15,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-ashraqatal",
      "total": 232,
      "c0": 54,
      "c1_3": 153,
      "c4_7": 25,
      "c8_11": 0,
      "c12": 0,
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-negma",
      "total": 218,
      "c0": 38,
      "c1_3": 137,
      "c4_7": 42,
      "c8_11": 1,
      "c12": 0,
      "team": "ME-EGSS01"
    }
  ],
  "unfixed": [
    {
      "name": "EGSS-adhmgadallah",
      "m0Tot": 3,
      "m0Fix": 2,
      "m0Pct": "66.7%",
      "m1Tot": 21,
      "m1Fix": 19,
      "m1Pct": "90.5%",
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-alihesham01",
      "m0Tot": 1,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 14,
      "m1Fix": 13,
      "m1Pct": "92.9%",
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-abdelrhmanshehata",
      "m0Tot": 5,
      "m0Fix": 3,
      "m0Pct": "60.0%",
      "m1Tot": 14,
      "m1Fix": 12,
      "m1Pct": "85.7%",
      "team": "ME-EGSS30"
    },
    {
      "name": "EGSS-ehabzaky01",
      "m0Tot": 6,
      "m0Fix": 2,
      "m0Pct": "33.3%",
      "m1Tot": 14,
      "m1Fix": 14,
      "m1Pct": "100.0%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-ibrahimismaiel",
      "m0Tot": 6,
      "m0Fix": 3,
      "m0Pct": "50.0%",
      "m1Tot": 24,
      "m1Fix": 16,
      "m1Pct": "66.7%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-titooooo",
      "m0Tot": 5,
      "m0Fix": 1,
      "m0Pct": "20.0%",
      "m1Tot": 18,
      "m1Fix": 16,
      "m1Pct": "88.9%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-abdelrahmannasef",
      "m0Tot": 6,
      "m0Fix": 3,
      "m0Pct": "50.0%",
      "m1Tot": 20,
      "m1Fix": 16,
      "m1Pct": "80.0%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-omarmoneb",
      "m0Tot": 3,
      "m0Fix": 2,
      "m0Pct": "66.7%",
      "m1Tot": 16,
      "m1Fix": 11,
      "m1Pct": "68.8%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGLP-saraht",
      "m0Tot": 7,
      "m0Fix": 7,
      "m0Pct": "100.0%",
      "m1Tot": 28,
      "m1Fix": 15,
      "m1Pct": "53.6%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-samira01",
      "m0Tot": 2,
      "m0Fix": 1,
      "m0Pct": "50.0%",
      "m1Tot": 16,
      "m1Fix": 15,
      "m1Pct": "93.8%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-khaledgonam",
      "m0Tot": 0,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 12,
      "m1Fix": 5,
      "m1Pct": "41.7%",
      "team": "ME-EGSS05"
    },
    {
      "name": "EGSS-ahmedshoukry",
      "m0Tot": 3,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 25,
      "m1Fix": 22,
      "m1Pct": "88.0%",
      "team": "ME-EGSS10"
    },
    {
      "name": "EGSS-mahmoudkhamis",
      "m0Tot": 7,
      "m0Fix": 5,
      "m0Pct": "71.4%",
      "m1Tot": 27,
      "m1Fix": 24,
      "m1Pct": "88.9%",
      "team": "ME-EGSS10"
    },
    {
      "name": "EGLP-mohamed06",
      "m0Tot": 6,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 24,
      "m1Fix": 20,
      "m1Pct": "83.3%",
      "team": "ME-EGSS10"
    },
    {
      "name": "EGSS-mohamedha",
      "m0Tot": 3,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 20,
      "m1Fix": 8,
      "m1Pct": "40.0%",
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-hayamhassan",
      "m0Tot": 4,
      "m0Fix": 2,
      "m0Pct": "50.0%",
      "m1Tot": 19,
      "m1Fix": 19,
      "m1Pct": "100.0%",
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-marwaahmed",
      "m0Tot": 4,
      "m0Fix": 2,
      "m0Pct": "50.0%",
      "m1Tot": 16,
      "m1Fix": 14,
      "m1Pct": "87.5%",
      "team": "ME-EGSS13"
    },
    {
      "name": "EGLP-shahdmahmoud",
      "m0Tot": 6,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 23,
      "m1Fix": 16,
      "m1Pct": "69.6%",
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-amrsafwat",
      "m0Tot": 1,
      "m0Fix": 1,
      "m0Pct": "100.0%",
      "m1Tot": 26,
      "m1Fix": 19,
      "m1Pct": "73.1%",
      "team": "ME-EGSS13"
    },
    {
      "name": "EGSS-mahmoud04",
      "m0Tot": 5,
      "m0Fix": 4,
      "m0Pct": "80.0%",
      "m1Tot": 27,
      "m1Fix": 23,
      "m1Pct": "85.2%",
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-nohayoussry",
      "m0Tot": 3,
      "m0Fix": 1,
      "m0Pct": "33.3%",
      "m1Tot": 23,
      "m1Fix": 20,
      "m1Pct": "87.0%",
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-juliamonir01",
      "m0Tot": 0,
      "m0Fix": 0,
      "m0Pct": "0.0%",
      "m1Tot": 9,
      "m1Fix": 4,
      "m1Pct": "44.4%",
      "team": "ME-EGSS01"
    },
    {
      "name": "EGLP-yasmin01",
      "m0Tot": 5,
      "m0Fix": 1,
      "m0Pct": "20.0%",
      "m1Tot": 33,
      "m1Fix": 28,
      "m1Pct": "84.8%",
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-ashraqatal",
      "m0Tot": 6,
      "m0Fix": 2,
      "m0Pct": "33.3%",
      "m1Tot": 22,
      "m1Fix": 16,
      "m1Pct": "72.7%",
      "team": "ME-EGSS01"
    },
    {
      "name": "EGSS-negma",
      "m0Tot": 5,
      "m0Fix": 2,
      "m0Pct": "40.0%",
      "m1Tot": 28,
      "m1Fix": 24,
      "m1Pct": "85.7%",
      "team": "ME-EGSS01"
    }
  ],
  "sop": [
    {
      "name": "EGSS-adhmgadallah",
      "team": "ME-EGSS30",
      "ec": 1,
      "r1": 3,
      "r2": 0,
      "r3": 0,
      "r4": 2,
      "r6d": 4,
      "r6e": 11,
      "total": 23
    },
    {
      "name": "EGSS-alihesham01",
      "team": "ME-EGSS30",
      "ec": 1,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 0,
      "r6e": 0,
      "total": 1
    },
    {
      "name": "EGSS-abdelrhmanshehata",
      "team": "ME-EGSS30",
      "ec": 0,
      "r1": 1,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 0,
      "r6e": 0,
      "total": 1
    },
    {
      "name": "EGSS-ehabzaky01",
      "team": "ME-EGSS05",
      "ec": 0,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 12,
      "r6e": 4,
      "total": 20
    },
    {
      "name": "EGSS-ibrahimismaiel",
      "team": "ME-EGSS05",
      "ec": 3,
      "r1": 0,
      "r2": 2,
      "r3": 0,
      "r4": 1,
      "r6d": 2,
      "r6e": 2,
      "total": 12
    },
    {
      "name": "EGSS-titooooo",
      "team": "ME-EGSS05",
      "ec": 8,
      "r1": 0,
      "r2": 1,
      "r3": 1,
      "r4": 1,
      "r6d": 23,
      "r6e": 3,
      "total": 46
    },
    {
      "name": "EGSS-abdelrahmannasef",
      "team": "ME-EGSS05",
      "ec": 1,
      "r1": 1,
      "r2": 0,
      "r3": 0,
      "r4": 1,
      "r6d": 19,
      "r6e": 11,
      "total": 43
    },
    {
      "name": "EGSS-omarmoneb",
      "team": "ME-EGSS05",
      "ec": 6,
      "r1": 1,
      "r2": 1,
      "r3": 1,
      "r4": 1,
      "r6d": 3,
      "r6e": 3,
      "total": 19
    },
    {
      "name": "EGLP-saraht",
      "team": "ME-EGSS05",
      "ec": 6,
      "r1": 0,
      "r2": 2,
      "r3": 4,
      "r4": 1,
      "r6d": 7,
      "r6e": 5,
      "total": 30
    },
    {
      "name": "EGSS-samira01",
      "team": "ME-EGSS05",
      "ec": 0,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 1,
      "r6e": 2,
      "total": 3
    },
    {
      "name": "EGSS-khaledgonam",
      "team": "ME-EGSS05",
      "ec": 5,
      "r1": 2,
      "r2": 0,
      "r3": 0,
      "r4": 3,
      "r6d": 5,
      "r6e": 15,
      "total": 45
    },
    {
      "name": "EGSS-ahmedshoukry",
      "team": "ME-EGSS10",
      "ec": 0,
      "r1": 1,
      "r2": 0,
      "r3": 1,
      "r4": 0,
      "r6d": 4,
      "r6e": 1,
      "total": 7
    },
    {
      "name": "EGSS-mahmoudkhamis",
      "team": "ME-EGSS10",
      "ec": 4,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 7,
      "r6e": 0,
      "total": 11
    },
    {
      "name": "EGLP-mohamed06",
      "team": "ME-EGSS10",
      "ec": 0,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 3,
      "r6d": 20,
      "r6e": 2,
      "total": 26
    },
    {
      "name": "EGSS-mohamedha",
      "team": "ME-EGSS13",
      "ec": 6,
      "r1": 1,
      "r2": 1,
      "r3": 1,
      "r4": 0,
      "r6d": 20,
      "r6e": 9,
      "total": 42
    },
    {
      "name": "EGSS-hayamhassan",
      "team": "ME-EGSS13",
      "ec": 1,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 1,
      "r6d": 10,
      "r6e": 0,
      "total": 14
    },
    {
      "name": "EGSS-marwaahmed",
      "team": "ME-EGSS13",
      "ec": 0,
      "r1": 2,
      "r2": 1,
      "r3": 0,
      "r4": 0,
      "r6d": 4,
      "r6e": 1,
      "total": 11
    },
    {
      "name": "EGLP-shahdmahmoud",
      "team": "ME-EGSS13",
      "ec": 10,
      "r1": 1,
      "r2": 0,
      "r3": 0,
      "r4": 2,
      "r6d": 29,
      "r6e": 1,
      "total": 45
    },
    {
      "name": "EGSS-amrsafwat",
      "team": "ME-EGSS13",
      "ec": 4,
      "r1": 0,
      "r2": 0,
      "r3": 1,
      "r4": 4,
      "r6d": 15,
      "r6e": 11,
      "total": 37
    },
    {
      "name": "EGSS-mahmoud04",
      "team": "ME-EGSS01",
      "ec": 12,
      "r1": 0,
      "r2": 1,
      "r3": 2,
      "r4": 1,
      "r6d": 18,
      "r6e": 14,
      "total": 55
    },
    {
      "name": "EGSS-nohayoussry",
      "team": "ME-EGSS01",
      "ec": 9,
      "r1": 0,
      "r2": 0,
      "r3": 1,
      "r4": 2,
      "r6d": 28,
      "r6e": 4,
      "total": 52
    },
    {
      "name": "EGSS-juliamonir01",
      "team": "ME-EGSS01",
      "ec": 9,
      "r1": 1,
      "r2": 0,
      "r3": 1,
      "r4": 0,
      "r6d": 9,
      "r6e": 6,
      "total": 27
    },
    {
      "name": "EGLP-yasmin01",
      "team": "ME-EGSS01",
      "ec": 0,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 0,
      "r6e": 0,
      "total": 0
    },
    {
      "name": "EGSS-ashraqatal",
      "team": "ME-EGSS01",
      "ec": 5,
      "r1": 1,
      "r2": 2,
      "r3": 5,
      "r4": 6,
      "r6d": 8,
      "r6e": 7,
      "total": 50
    },
    {
      "name": "EGSS-negma",
      "team": "ME-EGSS01",
      "ec": 0,
      "r1": 0,
      "r2": 0,
      "r3": 0,
      "r4": 0,
      "r6d": 0,
      "r6e": 1,
      "total": 1
    }
  ],
  "englishClub": [
    {
      "name": "EGSS-adhmgadallah",
      "team": "ME-EGSS30",
      "base": 71,
      "book": 2,
      "att": 2,
      "pct": "2.8%",
      "goal": 28,
      "need": 26
    },
    {
      "name": "EGSS-alihesham01",
      "team": "ME-EGSS30",
      "base": 32,
      "book": 13,
      "att": 10,
      "pct": "31.3%",
      "goal": 13,
      "need": 3
    },
    {
      "name": "EGSS-abdelrhmanshehata",
      "team": "ME-EGSS30",
      "base": 36,
      "book": 25,
      "att": 17,
      "pct": "47.2%",
      "goal": 14,
      "need": 0
    },
    {
      "name": "EGSS-ehabzaky01",
      "team": "ME-EGSS05",
      "base": 93,
      "book": 49,
      "att": 17,
      "pct": "18.3%",
      "goal": 37,
      "need": 20
    },
    {
      "name": "EGSS-ibrahimismaiel",
      "team": "ME-EGSS05",
      "base": 92,
      "book": 41,
      "att": 23,
      "pct": "25.0%",
      "goal": 37,
      "need": 14
    },
    {
      "name": "EGSS-titooooo",
      "team": "ME-EGSS05",
      "base": 85,
      "book": 26,
      "att": 11,
      "pct": "12.9%",
      "goal": 34,
      "need": 23
    },
    {
      "name": "EGSS-abdelrahmannasef",
      "team": "ME-EGSS05",
      "base": 84,
      "book": 20,
      "att": 18,
      "pct": "21.4%",
      "goal": 34,
      "need": 16
    },
    {
      "name": "EGSS-omarmoneb",
      "team": "ME-EGSS05",
      "base": 76,
      "book": 28,
      "att": 7,
      "pct": "9.2%",
      "goal": 30,
      "need": 23
    },
    {
      "name": "EGLP-saraht",
      "team": "ME-EGSS05",
      "base": 80,
      "book": 17,
      "att": 8,
      "pct": "10.0%",
      "goal": 32,
      "need": 24
    },
    {
      "name": "EGSS-samira01",
      "team": "ME-EGSS05",
      "base": 65,
      "book": 18,
      "att": 11,
      "pct": "16.9%",
      "goal": 26,
      "need": 15
    },
    {
      "name": "EGSS-khaledgonam",
      "team": "ME-EGSS05",
      "base": 79,
      "book": 5,
      "att": 3,
      "pct": "3.8%",
      "goal": 32,
      "need": 29
    },
    {
      "name": "EGSS-ahmedshoukry",
      "team": "ME-EGSS10",
      "base": 109,
      "book": 44,
      "att": 29,
      "pct": "26.6%",
      "goal": 44,
      "need": 15
    },
    {
      "name": "EGSS-mahmoudkhamis",
      "team": "ME-EGSS10",
      "base": 101,
      "book": 48,
      "att": 16,
      "pct": "15.8%",
      "goal": 40,
      "need": 24
    },
    {
      "name": "EGLP-mohamed06",
      "team": "ME-EGSS10",
      "base": 77,
      "book": 17,
      "att": 15,
      "pct": "19.5%",
      "goal": 31,
      "need": 16
    },
    {
      "name": "EGSS-mohamedha",
      "team": "ME-EGSS13",
      "base": 74,
      "book": 11,
      "att": 8,
      "pct": "10.8%",
      "goal": 30,
      "need": 22
    },
    {
      "name": "EGSS-hayamhassan",
      "team": "ME-EGSS13",
      "base": 91,
      "book": 38,
      "att": 21,
      "pct": "23.1%",
      "goal": 36,
      "need": 15
    },
    {
      "name": "EGSS-marwaahmed",
      "team": "ME-EGSS13",
      "base": 89,
      "book": 43,
      "att": 15,
      "pct": "16.9%",
      "goal": 36,
      "need": 21
    },
    {
      "name": "EGLP-shahdmahmoud",
      "team": "ME-EGSS13",
      "base": 78,
      "book": 27,
      "att": 11,
      "pct": "14.1%",
      "goal": 31,
      "need": 20
    },
    {
      "name": "EGSS-amrsafwat",
      "team": "ME-EGSS13",
      "base": 108,
      "book": 47,
      "att": 27,
      "pct": "25.0%",
      "goal": 43,
      "need": 16
    },
    {
      "name": "EGSS-mahmoud04",
      "team": "ME-EGSS01",
      "base": 99,
      "book": 12,
      "att": 7,
      "pct": "7.1%",
      "goal": 40,
      "need": 33
    },
    {
      "name": "EGSS-nohayoussry",
      "team": "ME-EGSS01",
      "base": 118,
      "book": 42,
      "att": 29,
      "pct": "24.6%",
      "goal": 47,
      "need": 18
    },
    {
      "name": "EGSS-juliamonir01",
      "team": "ME-EGSS01",
      "base": 79,
      "book": 21,
      "att": 15,
      "pct": "19.0%",
      "goal": 32,
      "need": 17
    },
    {
      "name": "EGLP-yasmin01",
      "team": "ME-EGSS01",
      "base": 0,
      "book": 0,
      "att": 0,
      "pct": "0.0%",
      "goal": 0,
      "need": 0
    },
    {
      "name": "EGSS-ashraqatal",
      "team": "ME-EGSS01",
      "base": 115,
      "book": 44,
      "att": 19,
      "pct": "16.5%",
      "goal": 46,
      "need": 27
    },
    {
      "name": "EGSS-negma",
      "team": "ME-EGSS01",
      "base": 112,
      "book": 36,
      "att": 16,
      "pct": "14.3%",
      "goal": 45,
      "need": 29
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
          <td style="font-family: var(--font-mono);">${r.r6e}</td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #60a5fa; font-size: 0.95rem;">${r.total}</td>
        </tr>
      `;
    }).join('');

    const totEC = data.reduce((s, r) => s + r.ec, 0);
    const totR1 = data.reduce((s, r) => s + r.r1, 0);
    const totR2 = data.reduce((s, r) => s + r.r2, 0);
    const totR3 = data.reduce((s, r) => s + r.r3, 0);
    const totR4 = data.reduce((s, r) => s + r.r4, 0);
    const totR6e = data.reduce((s, r) => s + r.r6e, 0);
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
            <th>Round 6 (Expiring)</th>
            <th style="color: #60a5fa;">Total Pending</th>
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
            <td style="font-family: var(--font-mono);">${totR6e}</td>
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
    // Module 3: Class Consumption & Zero-Class
    const data = filterByTeam(MASTER_OPERATIONS_DATA.consumption);
    let rowsHtml = data.map((r, idx) => {
      const zeroPct = r.total > 0 ? ((r.c0 / r.total) * 100).toFixed(1) : '0.0';
      const zeroClr = parseFloat(zeroPct) > 25 ? '#f43f5e' : parseFloat(zeroPct) > 15 ? '#f59e0b' : '#10b981';

      return `
        <tr>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
          <td style="font-weight: 600; color: #fff;">${r.name}</td>
          <td><span class="team-badge" style="font-size: 0.72rem;">${r.team}</span></td>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${r.total}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; color: #f43f5e; text-align: center; background: rgba(244, 63, 94, 0.08);">${r.c0}</td>
          <td style="font-family: var(--font-mono); color: ${zeroClr}; font-weight: 700;">${zeroPct}%</td>
          <td style="font-family: var(--font-mono);">${r.c1_3}</td>
          <td style="font-family: var(--font-mono);">${r.c4_7}</td>
          <td style="font-family: var(--font-mono);">${r.c8_11}</td>
          <td style="font-family: var(--font-mono); color: #34d399;">${r.c12}</td>
        </tr>
      `;
    }).join('');

    const sumTot = data.reduce((s, r) => s + r.total, 0);
    const sumC0 = data.reduce((s, r) => s + r.c0, 0);
    const sumC1_3 = data.reduce((s, r) => s + r.c1_3, 0);
    const sumC4_7 = data.reduce((s, r) => s + r.c4_7, 0);
    const sumC8_11 = data.reduce((s, r) => s + r.c8_11, 0);
    const sumC12 = data.reduce((s, r) => s + r.c12, 0);
    const overallZeroPct = sumTot > 0 ? ((sumC0 / sumTot) * 100).toFixed(1) + '%' : '0.0%';

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SS Representative</th>
            <th>Team</th>
            <th>Total Students</th>
            <th style="color: #f43f5e; text-align: center;">0 Classes (Alert)</th>
            <th style="color: #f59e0b;">Zero Class %</th>
            <th>1–3 Classes</th>
            <th>4–7 Classes</th>
            <th>8–11 Classes</th>
            <th style="color: #34d399;">12+ Classes</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background: rgba(249, 115, 22, 0.12); font-weight: 800; border-top: 2px solid #f97316;">
            <td colspan="3" style="color: #fff; text-align: left;">TOTAL / SECTOR AVERAGE</td>
            <td style="font-family: var(--font-mono); color: #fff;">${sumTot}</td>
            <td style="font-family: var(--font-mono); color: #f43f5e; text-align: center;">${sumC0}</td>
            <td style="font-family: var(--font-mono); color: #f59e0b;">${overallZeroPct}</td>
            <td style="font-family: var(--font-mono);">${sumC1_3}</td>
            <td style="font-family: var(--font-mono);">${sumC4_7}</td>
            <td style="font-family: var(--font-mono);">${sumC8_11}</td>
            <td style="font-family: var(--font-mono); color: #34d399;">${sumC12}</td>
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
                              "ccCount":  240,
                              "ftCount":  75,
                              "sopCount":  42,
                              "ecCount":  79,
                              "totalLeads":  436
                          },
    "EGSS-marwaahmed":  {
                            "ccCount":  249,
                            "ftCount":  56,
                            "sopCount":  62,
                            "ecCount":  89,
                            "totalLeads":  456
                        },
    "EGLP-shahdmahmoud":  {
                              "ccCount":  107,
                              "ftCount":  34,
                              "sopCount":  65,
                              "ecCount":  78,
                              "totalLeads":  284
                          },
    "EGSS-negma":  {
                       "ccCount":  217,
                       "ftCount":  42,
                       "sopCount":  1,
                       "ecCount":  112,
                       "totalLeads":  372
                   },
    "EGSS-mahmoud04":  {
                           "ccCount":  300,
                           "ftCount":  73,
                           "sopCount":  111,
                           "ecCount":  99,
                           "totalLeads":  583
                       },
    "EGSS-mohamedha":  {
                           "ccCount":  207,
                           "ftCount":  74,
                           "sopCount":  89,
                           "ecCount":  74,
                           "totalLeads":  444
                       },
    "EGLP-yasmin01":  {
                          "ccCount":  108,
                          "ftCount":  25,
                          "sopCount":  0,
                          "ecCount":  0,
                          "totalLeads":  133
                      },
    "EGSS-abdelrahmannasef":  {
                                  "ccCount":  223,
                                  "ftCount":  47,
                                  "sopCount":  85,
                                  "ecCount":  84,
                                  "totalLeads":  439
                              },
    "EGSS-nohayoussry":  {
                             "ccCount":  210,
                             "ftCount":  41,
                             "sopCount":  84,
                             "ecCount":  118,
                             "totalLeads":  453
                         },
    "EGSS-samira01":  {
                          "ccCount":  213,
                          "ftCount":  51,
                          "sopCount":  3,
                          "ecCount":  65,
                          "totalLeads":  332
                      },
    "EGSS-alihesham01":  {
                             "ccCount":  103,
                             "ftCount":  22,
                             "sopCount":  1,
                             "ecCount":  32,
                             "totalLeads":  158
                         },
    "EGSS-adhmgadallah":  {
                              "ccCount":  227,
                              "ftCount":  62,
                              "sopCount":  25,
                              "ecCount":  71,
                              "totalLeads":  385
                          },
    "EGSS-omarmoneb":  {
                           "ccCount":  214,
                           "ftCount":  68,
                           "sopCount":  26,
                           "ecCount":  76,
                           "totalLeads":  384
                       },
    "EGLP-mohamed06":  {
                           "ccCount":  188,
                           "ftCount":  63,
                           "sopCount":  32,
                           "ecCount":  77,
                           "totalLeads":  360
                       },
    "EGSS-hayamhassan":  {
                             "ccCount":  102,
                             "ftCount":  14,
                             "sopCount":  16,
                             "ecCount":  91,
                             "totalLeads":  223
                         },
    "EGSS-ahmedshoukry":  {
                              "ccCount":  285,
                              "ftCount":  66,
                              "sopCount":  30,
                              "ecCount":  109,
                              "totalLeads":  490
                          },
    "EGSS-ashraqatal":  {
                            "ccCount":  232,
                            "ftCount":  79,
                            "sopCount":  80,
                            "ecCount":  115,
                            "totalLeads":  506
                        },
    "EGSS-titooooo":  {
                          "ccCount":  229,
                          "ftCount":  45,
                          "sopCount":  72,
                          "ecCount":  85,
                          "totalLeads":  431
                      },
    "EGSS-abdelrhmanshehata":  {
                                   "ccCount":  112,
                                   "ftCount":  24,
                                   "sopCount":  1,
                                   "ecCount":  36,
                                   "totalLeads":  173
                               },
    "EGSS-amrsafwat":  {
                           "ccCount":  283,
                           "ftCount":  75,
                           "sopCount":  41,
                           "ecCount":  108,
                           "totalLeads":  507
                       },
    "EGSS-ibrahimismaiel":  {
                                "ccCount":  241,
                                "ftCount":  88,
                                "sopCount":  13,
                                "ecCount":  92,
                                "totalLeads":  434
                            },
    "EGSS-mahmoudkhamis":  {
                               "ccCount":  221,
                               "ftCount":  52,
                               "sopCount":  11,
                               "ecCount":  101,
                               "totalLeads":  385
                           },
    "EGSS-ehabzaky01":  {
                            "ccCount":  219,
                            "ftCount":  42,
                            "sopCount":  47,
                            "ecCount":  93,
                            "totalLeads":  401
                        },
    "EGSS-khaledgonam":  {
                             "ccCount":  268,
                             "ftCount":  78,
                             "sopCount":  81,
                             "ecCount":  79,
                             "totalLeads":  506
                         },
    "EGLP-saraht":  {
                        "ccCount":  188,
                        "ftCount":  64,
                        "sopCount":  41,
                        "ecCount":  80,
                        "totalLeads":  373
                    }
}
;

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





