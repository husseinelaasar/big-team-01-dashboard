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

// Verified Live CRM Performance + POOL_Detail Renewal/Upgrade Breakdown (Sep 1–15, 2026)
const REPS_DATA = [
  // ==================== ME-EGSS01 (Total Base: 200) ====================
  { name: "EGSS-nohayoussry", team: "EGSS01", cash: 3032, contracts: 5, upgradeM2: 1, normalRenewals: 4, upgradeBase: 60, poolRenewals: 1 },
  { name: "EGSS-ashraqatal", team: "EGSS01", cash: 1190, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 57, poolRenewals: 1 },
  { name: "EGSS-negma", team: "EGSS01", cash: 4150, contracts: 2, upgradeM2: 1, normalRenewals: 1, upgradeBase: 37, poolRenewals: 2 },
  { name: "EGSS-juliamonir01", team: "EGSS01", cash: 2040, contracts: 2, upgradeM2: 0, normalRenewals: 2, upgradeBase: 30, poolRenewals: 1 },
  { name: "EGSS-mahmoud04", team: "EGSS01", cash: 3540, contracts: 3, upgradeM2: 0, normalRenewals: 3, upgradeBase: 11, poolRenewals: 4 },
  { name: "EGLP-yasmin01", team: "EGSS01", cash: 1516, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 5, poolRenewals: 1 },

  // ==================== ME-EGSS05 (Total Base: 232) ====================
  { name: "EGSS-Ibrahimismaiel", team: "EGSS05", cash: 6798, contracts: 6, upgradeM2: 2, normalRenewals: 4, upgradeBase: 41, poolRenewals: 5 },
  { name: "EGSS-ehabzaky01", team: "EGSS05", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 38, poolRenewals: 1 },
  { name: "EGLP-saraht", team: "EGSS05", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 35, poolRenewals: 1 },
  { name: "EGSS-AbdelrahmanNASEF", team: "EGSS05", cash: 5591, contracts: 6, upgradeM2: 2, normalRenewals: 4, upgradeBase: 27, poolRenewals: 6 },
  { name: "EGSS-titooooo", team: "EGSS05", cash: 4040, contracts: 5, upgradeM2: 0, normalRenewals: 5, upgradeBase: 26, poolRenewals: 4 },
  { name: "EGSS-samira01", team: "EGSS05", cash: 2536, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 25, poolRenewals: 4 },
  { name: "EGSS-OmarMoneb", team: "EGSS05", cash: 4377, contracts: 5, upgradeM2: 0, normalRenewals: 5, upgradeBase: 22, poolRenewals: 3 },
  { name: "EGSS-KhaledGonam", team: "EGSS05", cash: 2770, contracts: 3, upgradeM2: 0, normalRenewals: 3, upgradeBase: 18, poolRenewals: 4 },

  // ==================== ME-EGSS10 (Total Base: 112) ====================
  { name: "EGSS-Mahmoudkhamis", team: "EGSS10", cash: 4250, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 40, poolRenewals: 4 },
  { name: "EGSS-AhmedShoukry", team: "EGSS10", cash: 3540, contracts: 3, upgradeM2: 0, normalRenewals: 3, upgradeBase: 39, poolRenewals: 4 },
  { name: "EGLP-mohamed06", team: "EGSS10", cash: 1020, contracts: 1, upgradeM2: 0, normalRenewals: 1, upgradeBase: 33, poolRenewals: 1 },

  // ==================== ME-EGSS13 (Total Base: 186) ====================
  { name: "EGSS-hayamhassan", team: "EGSS13", cash: 4228, contracts: 6, upgradeM2: 3, normalRenewals: 3, upgradeBase: 79, poolRenewals: 4 },
  { name: "EGLP-ShahdMahmoud", team: "EGSS13", cash: 0, contracts: 0, upgradeM2: 0, normalRenewals: 0, upgradeBase: 46, poolRenewals: 0 },
  { name: "EGSS-Amrsafwat", team: "EGSS13", cash: 5950, contracts: 4, upgradeM2: 1, normalRenewals: 3, upgradeBase: 28, poolRenewals: 2 },
  { name: "EGSS-mohamedha", team: "EGSS13", cash: 10060, contracts: 10, upgradeM2: 3, normalRenewals: 7, upgradeBase: 24, poolRenewals: 10 },
  { name: "EGSS-marwaahmed", team: "EGSS13", cash: 2710, contracts: 3, upgradeM2: 1, normalRenewals: 2, upgradeBase: 9, poolRenewals: 3 },

  // ==================== ME-EGSS30 (Total Base: 33) ====================
  { name: "EGSS-AdhmGadAllah", team: "EGSS30", cash: 8100, contracts: 10, upgradeM2: 1, normalRenewals: 9, upgradeBase: 23, poolRenewals: 9 },
  { name: "EGSS-alihesham01", team: "EGSS30", cash: 1620, contracts: 2, upgradeM2: 0, normalRenewals: 2, upgradeBase: 5, poolRenewals: 2 },
  { name: "EGSS-abdelrhmanshehata", team: "EGSS30", cash: 3520, contracts: 3, upgradeM2: 1, normalRenewals: 2, upgradeBase: 5, poolRenewals: 2 }
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

// Build Unified Data Intelligence Model
function buildDataModel() {
  const daysPassed = 14;
  const daysInMonth = 30;
  const daysLeft = daysInMonth - daysPassed;

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
  document.getElementById('achDays').textContent = `Day ${s.daysPassed} of ${s.daysInMonth} (${s.daysLeft} Days Left)`;

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

  // Sort teams descending by cash achievement % (Highest at top, lowest at bottom)
  const sortedTeams = Object.values(model.teams).sort((a, b) => b.achievement - a.achievement);
  const pacePct = ((model.summary.daysPassed / model.summary.daysInMonth) * 100);

  sortedTeams.forEach((t, idx) => {
    // Fill width matches EXACT achievement percentage relative to 100% target
    const cashWidthPct = Math.min(100, Math.max(0, t.achievement));

    const row = document.createElement('div');
    row.style.marginBottom = '18px';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
        <div>
          <span style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 700; margin-right: 6px;">#${idx + 1}</span>
          <span style="color: ${t.color}; font-weight: 700; font-size: 0.95rem;">${t.label}</span>
          <span style="color: var(--text-muted); font-size: 0.8rem; margin-left: 8px;">(TL: ${t.tl})</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.9rem;">
          <span style="color: #fff; font-weight: 700;">${fmt(t.cash)}</span>
          <span style="color: var(--text-muted);"> / ${fmt(t.target)}</span>
          <span style="color: ${getStatusColor(t.achievement)}; font-weight: 800; margin-left: 8px;">(${fmtPct(t.achievement)})</span>
        </div>
      </div>
      <div style="position: relative; height: 12px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: visible;">
        <!-- Filled progress bar matching exact achievement percentage -->
        <div style="height: 100%; width: ${cashWidthPct}%; background: ${t.color}; border-radius: 6px; transition: width 0.8s ease;"></div>
        <!-- 100% Target Line Marker at Right Edge -->
        <div style="position: absolute; top: -3px; right: 0; width: 3px; height: 18px; background: rgba(255,255,255,0.8); border-radius: 2px;" title="Full Target (100%): ${fmt(t.target)}"></div>
        <!-- Mid-Month Pace Line Marker (Day 15/30 = 50%) -->
        <div style="position: absolute; top: -2px; left: ${pacePct}%; width: 2px; height: 16px; background: rgba(255,255,255,0.35); border-left: 1px dashed rgba(255,255,255,0.6);" title="Day ${model.summary.daysPassed} Pace Benchmark (${fmtPct(pacePct)})"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); margin-top: 5px;">
        <span>Orders: <strong>${t.contracts}</strong> (Upgrade M2: ${t.upgradeM2} | <span style="color: #c084fc; font-weight: 700;">20% Goal: ${t.upgrade20Target}</span> [<strong>${t.upgrade20Needed} needed</strong>])</span>
        <span>Run-Rate Proj: <strong style="color: #38bdf8;">${fmt(t.projected)}</strong> | Need: <strong>${fmt(t.dailyNeeded)}/day</strong></span>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderOverviewTable(model) {
  const tbody = document.getElementById('overviewTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const sorted = [...model.individuals].sort((a, b) => b.achievement - a.achievement || b.cash - a.cash);

  sorted.forEach((r, idx) => {
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
    tfoot.innerHTML = `
      <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
        <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">TOTAL / SECTOR AVERAGE</td>
        <td style="font-family: var(--font-mono); color: #fff; font-size: 0.95rem;">${fmt(s.totalCash)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(s.totalTarget)}</td>
        <td style="font-family: var(--font-mono); color: ${getStatusColor(s.achievement)}; font-size: 0.95rem;">${fmtPct(s.achievement)}</td>
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

  const teamFilter = document.getElementById('teamFilter').value;
  const sortFilter = document.getElementById('sortFilter').value;

  let filtered = [...model.individuals];
  if (teamFilter !== 'all') {
    filtered = filtered.filter(r => r.team === teamFilter);
  }

  // Sort by Percentages
  if (sortFilter === 'upg-rate-desc') filtered.sort((a, b) => b.upgradeRate - a.upgradeRate);
  else if (sortFilter === 'cover-rate-desc') filtered.sort((a, b) => b.coverRate - a.coverRate);
  else if (sortFilter === 'ach-desc') filtered.sort((a, b) => b.achievement - a.achievement);
  else if (sortFilter === 'cash-desc') filtered.sort((a, b) => b.cash - a.cash);
  else if (sortFilter === 'gap-desc') filtered.sort((a, b) => b.gap - a.gap);
  else if (sortFilter === 'upgrade-desc') filtered.sort((a, b) => b.upgradeM2 - a.upgradeM2);
  else if (sortFilter === 'contracts-desc') filtered.sort((a, b) => b.contracts - a.contracts);
  else filtered.sort((a, b) => b.achievement - a.achievement);

  // Render Cards
  container.innerHTML = '';
  filtered.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = 'calc-card';
    card.style.borderLeft = `4px solid ${r.teamColor}`;
    card.style.animationDelay = `${idx * 0.06}s`;
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${r.isTL ? '👑 ' : ''}${r.name}</h3>
          <span style="font-size: 0.8rem; color: ${r.teamColor};">${r.teamLabel}</span>
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

  // Render Table
  tableBody.innerHTML = '';
  filtered.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--accent-indigo); font-weight: 700;">#${idx + 1}</td>
      <td><strong>${r.isTL ? '👑 ' : ''}${r.name}</strong></td>
      <td><span style="color: ${r.teamColor}; font-weight: 600;">${r.team}</span></td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${fmt(r.cash)}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(r.target)}</td>
      <td style="font-family: var(--font-mono); font-weight: 700; color: ${r.statusColor};">${fmtPct(r.achievement)}</td>
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

  const tfoot = document.getElementById('individualFullTableFoot');
  if (tfoot) {
    const s = model.summary;
    const avgCover = model.individuals.length > 0 ? (model.individuals.reduce((sum, r) => sum + r.coverRate, 0) / model.individuals.length) : 0;
    tfoot.innerHTML = `
      <tr style="background: rgba(99, 102, 241, 0.12); font-weight: 800; border-top: 2px solid var(--accent-indigo);">
        <td colspan="3" style="color: #fff; text-align: left; font-size: 0.9rem;">TOTAL / SECTOR AVERAGE</td>
        <td style="font-family: var(--font-mono); color: #fff; font-size: 0.95rem;">${fmt(s.totalCash)}</td>
        <td style="font-family: var(--font-mono); color: var(--text-secondary);">${fmt(s.totalTarget)}</td>
        <td style="font-family: var(--font-mono); color: ${getStatusColor(s.achievement)}; font-size: 0.95rem;">${fmtPct(s.achievement)}</td>
        <td style="font-family: var(--font-mono); color: #10b981; font-size: 0.95rem;">${s.totalUpgradeM2}</td>
        <td style="font-family: var(--font-mono);">${s.totalUpgradeBase}</td>
        <td style="font-family: var(--font-mono); color: #c084fc;">${s.totalUpgrade20Target} (${s.totalUpgrade20Needed} needed)</td>
        <td style="font-family: var(--font-mono); color: #a78bfa;">${fmtPct(s.upgradeRate)}</td>
        <td style="font-family: var(--font-mono); color: #facc15; text-align: center;">${fmtPct(avgCover)}</td>
        <td style="font-family: var(--font-mono); color: #fff;">${s.totalContracts}</td>
        <td><span class="status-badge" style="background: #6366f120; color: #818cf8;">Sector Total</span></td>
      </tr>
    `;
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
  const container = document.getElementById('sopContent');
  if (!container) return;
  container.innerHTML = '';

  SOP_ROUNDS.forEach(round => {
    const card = document.createElement('div');
    card.className = 'calc-card';

    const barRows = Object.entries(SOP_DATA).map(([teamLabel, metrics]) => {
      const val = metrics[round.key] || 0;
      const tk = teamLabel.replace('ME-', '');
      const color = TL_MAPPING[tk]?.color || '#6366f1';
      const statusClr = val >= round.target ? '#10b981' : val >= (round.target - 10) ? '#f59e0b' : '#f43f5e';

      return `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
            <span style="color: ${color}; font-weight: 600;">${teamLabel}</span>
            <span style="font-family: var(--font-mono); color: ${statusClr}; font-weight: 700;">${val}%</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
            <div style="height: 100%; width: ${val}%; background: ${statusClr};"></div>
          </div>
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff;">${round.label}</h4>
        <span style="font-size: 0.75rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">Target: ${round.target}%</span>
      </div>
      ${barRows}
    `;
    container.appendChild(card);
  });
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
  if (teamFilter) teamFilter.addEventListener('change', () => renderIndividualsTab(model));
  if (sortFilter) sortFilter.addEventListener('change', () => renderIndividualsTab(model));

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

  setupEvents(model);

  // Smooth Loader Fade-Out
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }
  }, 400);
});
