const fs = require('fs');

const mdPath = 'D:\\Lens\\Dashboard\\OCTOBER_2026_TARGETS_AND_QUOTAS.md';
let content = fs.readFileSync(mdPath, 'utf8');

// 1. Update Section 1 Macro Quotas Table
const oldMacroTable = `| Metric | Target Quota | Current MTD (Oct 6) | Variance / Gap | Pacing Benchmark (Day 6: 20%) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Net Cash Revenue** | **$305,950** | **$24,147** | **-$281,803** (7.9% Achieved) | Benchmark: $61,190 (-$37,043 Deficit / -12.1% Gap) |
| **Total Contracts (Orders)** | **252 Orders** | **21 Orders** | **-231 Orders** (8.3% Achieved) | Avg: $1,150 / contract |
| **Required Daily Velocity** | **$11,272 / day** | $4,025 / day | 25 Days Remaining | Target Month-End Finish: 102% |
| **Active Sales Specialists** | **21 Reps** | 21 Active | 0 Unassigned | 100% Rep Allocation |`;

const newMacroTable = `| Metric | Target Quota | Current MTD (Oct 6) | Variance / Gap | Pacing Benchmark (Day 6: 20%) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Net Cash Revenue** | **$305,950** | **$24,147** | **-$281,803** (7.9% Achieved) | Benchmark: $61,190 (-$37,043 Deficit / -12.1% Gap) |
| **Total Contracts (Orders)** | **252 Orders** | **21 Orders** | **-231 Orders** (8.3% Achieved) | Avg: $1,150 / contract |
| **Required Daily Velocity** | **$11,272 / day** | $4,025 / day | 25 Days Remaining | Target Month-End Finish: 102% |
| **Active Sales Specialists** | **21 Reps** | 21 Active | 0 Unassigned | 100% Rep Allocation |
| **Upgrade Base (Pool Leads)** | **497 Leads** | 497 Allocated | SCRM Authoritative | 100% Rep Lead Allocation |
| **Upgrade 20% Milestone Goal** | **100 Upgrades** | **3 Upgrades** | **-97 Upgrades** (3.0% to Goal) | **0.60% Conversion Rate** (3 / 497) |
| **M2 Contact / Cover Rate** | **≥60.0% Touch** | **24.4% Avg Touch** | **-35.6% Touch Gap** | POOL22 Effective Frequency |`;

content = content.replace(oldMacroTable, newMacroTable);

// 2. Update Section 5 Status of Operational Inputs
content = content.replace(
  /\| \*\*4\. Upgrade Base Allocation\*\* \| ⏳ \*\*PENDING FROM USER \/ SCRM\*\* \| Needed to calculate individual and team \*\*Upgrade Conversion Rate %\*\* \(`upgradeM2 \/ upgradeBase`\) and the \*\*20% conversion milestone\*\. \|/,
  '| **4. Upgrade Base Allocation** | ✅ **CONFIRMED & LIVE (497 Leads)** | Authoritative SCRM pivot table uploaded. Dynamic Upgrade Conversion Rate % and 20% milestone goals active across all teams and reps. |'
);

// 3. Append Section 7
const section7 = `

---

## 🚀 7. Official October Early Upgrade Base (M2), 20% Conversion Milestone & Coverage Matrix

> **Source**: Authoritative SCRM Pivot Table (\`ME-EGSS01\` to \`ME-EGSS30\`) & \`Student_Detail32\` / \`Student_Detail26\`  
> **Total Pool Leads**: **497 Upgrade Leads** across 21 active Sales Specialists  
> **20% Milestone Target**: **100 Upgrades** ($\\lceil 497 \\times 0.20 \\rceil$) | **Current Achieved**: **3 Upgrades** (**0.60% Conversion Rate**)  
> **Remaining Deficit to 20% Milestone**: **97 Upgrades** | **Required Velocity**: **3.9 Upgrades / Day** (over remaining 25 days)  
> **Average Outreach / Cover Rate**: **24.4% Contact Intensity**  

### 📊 A. Small Teams Upgrade Performance & 20% Milestone Summary

| Rank | Small Team | Team Leader | Color Code | Upgrade Base Leads | Current M2 Upgrades | Upgrade Conv % | 20% Goal Target | Remaining to 20% | 20% Goal Progress % | Avg Cover Rate % | Sector Lead Share | Status / Velocity |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | **ME-EGSS01** | Ashraqatal | \`#6366f1\` | **145** | **2** | **1.38%** | **29** | **27 needed** | 6.9% | 19.8% | 29.2% | 🟢 Top Volume (Mahmoud04) |
| **#2** | **ME-EGSS10** | Abdelrhman Shehata | \`#10b981\` | **93** | **1** | **1.08%** | **19** | **18 needed** | 5.3% | 27.6% | 18.7% | 🟢 Active Conversion |
| **#3** | **ME-EGSS05** | Ibrahim Abd El Shakour | \`#06b6d4\` | **113** | **0** | **0.00%** | **23** | **23 needed** | 0.0% | 49.3% | 22.7% | 🟡 High Touch (49.3%), 0 Deals |
| **#4** | **ME-EGSS13** | Mohamedha | \`#f59e0b\` | **83** | **0** | **0.00%** | **17** | **17 needed** | 0.0% | 26.1% | 16.7% | 🔴 Low Touch (26.1%), 0 Deals |
| **#5** | **ME-EGSS30** | Adhm GadAllah | \`#f43f5e\` | **63** | **0** | **0.00%** | **13** | **13 needed** | 0.0% | 31.8% | 12.7% | 🔴 0 Deals, 13 to Milestone |
| **TOTAL** | **Big Team 01** | **Saber Hussien** | \`#38bdf8\` | **497** | **3** | **0.60%** | **100** | **97 needed** | **3.0%** | **24.4%** | **100.0%** | 🔴 **Early Pacing Deficit** |

---

### 📋 B. Individual Sales Specialist Upgrade Base, Conversion & Cover Rate Roster (21 Reps)

| # | Representative | Team | Upgrade Base | Current Upgrades | Conv Rate % | 20% Goal Target | Remaining to 20% | 20% Progress | M2 Cover % (POOL22) | Status Badge | Operational Action Directive |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | \`EGSS-mahmoud04\` | EGSS01 | **31** | **2** | **6.45%** | **7** | **5 needed** | 28.6% | 28.0% (0.3x) | 🟢 Pacing Star | Sector upgrade leader (2 closed). Needs 5 more to hit 20% benchmark. Blitz top 10 engaged students today. |
| **2** | \`EGSS-abdelrhmanshehata\` 👑 | EGSS10 | **27** | **1** | **3.70%** | **6** | **5 needed** | 16.7% | 37.5% (0.4x) | 🟢 On Track | Leading by example as TL. 1 upgrade secured; 5 needed to hit 20%. Maintain callback intensity. |
| **3** | \`EGSS-negma\` | EGSS01 | **35** | **0** | **0.00%** | **7** | **7 needed** | 0.0% | 37.9% (0.4x) | ⚠️ High-Base Alert | Largest base in sector (35 leads). 37.9% touch rate. Urgent 1:1 deal review with TL Ashraqatal. |
| **4** | \`EGSS-ahmedshoukry\` | EGSS10 | **34** | **0** | **0.00%** | **7** | **7 needed** | 0.0% | 17.9% (0.2x) | ⚠️ High-Base Alert | 34 pool leads but only 17.9% touch. Accelerate outreach frequency to unlock conversion potential. |
| **5** | \`EGSS-mahmoudkhamis\` | EGSS10 | **32** | **0** | **0.00%** | **7** | **7 needed** | 0.0% | 27.3% (0.3x) | ⚠️ High-Base Alert | 32 pool leads. Needs 7 upgrades for 20%. Conduct deep review of call recordings for objections. |
| **6** | \`EGSS-ashraqatal\` 👑 | EGSS01 | **29** | **0** | **0.00%** | **6** | **6 needed** | 0.0% | 5.9% (0.1x) | 🚨 Severe Outreach Gap | 29 leads with only 5.9% touch! TL must immediately activate phone campaigns and lead by example. |
| **7** | \`EGSS-nohayoussry\` | EGSS01 | **28** | **0** | **0.00%** | **6** | **6 needed** | 0.0% | 4.8% (0.0x) | 🚨 Severe Outreach Gap | 28 leads with 4.8% touch. Uncontacted leads are going cold. Require minimum 10 upgrade calls today. |
| **8** | \`EGSS-ibrahimismaiel\` 👑 | EGSS05 | **27** | **0** | **0.00%** | **6** | **6 needed** | 0.0% | 57.9% (0.6x) | 🟡 Good Touch, 0 Close | 57.9% contact rate across 27 leads. Pitching is happening but closing is lagging. Refine closing scripts. |
| **9** | \`EGSS-amrsafwat\` | EGSS13 | **26** | **0** | **0.00%** | **6** | **6 needed** | 0.0% | 14.3% (0.1x) | ⚠️ High-Base Alert | 26 leads with 14.3% touch. Needs 6 upgrades to hit 20%. Double dial outreach on top potential accounts. |
| **10** | \`EGSS-adhmgadallah\` 👑 | EGSS30 | **26** | **0** | **0.00%** | **6** | **6 needed** | 0.0% | 34.8% (0.3x) | ⚠️ High-Base Alert | 26 leads, 34.8% touch. Team Leader must convert first deal to ignite team velocity. |
| **11** | \`EGSS-juliamonir01\` | EGSS01 | **22** | **0** | **0.00%** | **5** | **5 needed** | 0.0% | 22.2% (0.2x) | 🔴 Action Needed | 22 leads, 22.2% touch. Target 5 upgrades for 20%. Prioritize students with expiring packages. |
| **12** | \`EGSS-ehabzaky01\` | EGSS05 | **21** | **0** | **0.00%** | **5** | **5 needed** | 0.0% | 38.5% (0.4x) | 🔴 Action Needed | 21 leads, 38.5% touch. 5 upgrades needed. Excellent teacher binding (86.8%); leverage teacher advocacy! |
| **13** | \`EGSS-hayamhassan\` | EGSS13 | **21** | **0** | **0.00%** | **5** | **5 needed** | 0.0% | 68.8% (0.7x) | 🟡 High Outreach Champion | 68.8% touch rate (highest in team). Conversion is imminent; schedule manager 3-way closing calls. |
| **14** | \`EGSS-mohamedha\` 👑 | EGSS13 | **20** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 0.0% (0.0x) | 🚨 Zero Touch Alert | Revenue leader ($3,980) has 0% touch on 20 M2 leads! Unlocking this base yields easy additional orders. |
| **15** | \`EGSS-abdelrahmannasef\` | EGSS05 | **19** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 6.2% (0.1x) | 🚨 Severe Outreach Gap | 19 leads with only 6.2% touch. Mandatory outreach push needed today. |
| **16** | \`EGSS-titooooo\` | EGSS30 | **19** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 14.3% (0.1x) | 🔴 Action Needed | 19 leads, 14.3% touch. Needs 4 upgrades to reach 20%. Re-engage students with high completed class counts. |
| **17** | \`EGSS-alihesham01\` | EGSS30 | **18** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 46.2% (0.5x) | 🔴 Action Needed | 18 leads, 46.2% touch. Needs 4 upgrades. Good engagement; pitch multi-level upgrade packages. |
| **18** | \`EGSS-samira01\` | EGSS05 | **17** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 58.3% (0.6x) | 🔴 Action Needed | 17 leads, 58.3% touch. Strong touch intensity; review discount offerings to close 4 deals. |
| **19** | \`EGSS-omarmoneb\` | EGSS05 | **16** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 63.6% (0.6x) | 🔴 Action Needed | 16 leads, 63.6% touch. 4 upgrades needed. Very high contact frequency; focus on urgency creation. |
| **20** | \`EGSS-marwaahmed\` | EGSS13 | **16** | **0** | **0.00%** | **4** | **4 needed** | 0.0% | 21.4% (0.2x) | 🔴 Action Needed | 16 leads, 21.4% touch. Needs 4 upgrades. Push personalized study plans to activate parents. |
| **21** | \`EGSS-khaledgonam\` | EGSS05 | **13** | **0** | **0.00%** | **3** | **3 needed** | 0.0% | 71.4% (0.7x) | ⚡ Close to Milestone | Sector's highest touch rate (71.4%)! Smallest base (13). Only 3 deals needed to reach 100% of 20% goal! |

---

### 💡 C. Managerial Levers & Sprint Directives for Senior Manager Saber Hussien

1. **The 237-Lead Concentration (Top 8 Reps Hold 47.7% of the Pool)**:
   * **Negma (35)**, **Ahmed Shoukry (34)**, **Mahmoud Khamis (32)**, **Mahmoud04 (31)**, **Ashraqatal (29)**, **Noha Youssry (28)**, **Ibrahim Ismaiel (27)**, and **Adhm GadAllah (26)** hold **237 leads** out of 497.
   * If these 8 reps reach their individual 20% goals, the sector immediately banks **51 upgrades** (more than half of the 100-upgrade monthly quota)!
2. **Eliminate the 7 "Outreach Blind Spots" (<15% Touch Intensity)**:
   * Mohamedha (0.0%), Noha Youssry (4.8%), Ashraqatal (5.9%), Abdelrahman Nasef (6.2%), Titooooo (14.3%), Amr Safwat (14.3%) have unworked M2 pools.
   * Mandate **minimum 8 outbound M2 discovery calls per day** for these reps until contact rate reaches $\\ge 50\\%$.
3. **Closing Support for High-Touch Reps (Touch > 55% but 0 Deals)**:
   * Khaled Gonam (71.4%), Hayam Hassan (68.8%), Omar Moneb (63.6%), Samira01 (58.3%), and Ibrahim Ismaiel (57.9%) have established high rapport with parents but have not pulled the trigger on closes.
   * Schedule **Senior Manager / TL 3-way closing calls** for their top 3 warmest leads tomorrow.
4. **Daily Pacing Requirement**:
   * With 25 calendar days remaining, the sector must maintain a steady velocity of **3.9 upgrades / day** (~4 contracts daily) to hit the 100-contract milestone (20% conversion).
`;

if (!content.includes('## 🚀 7. Official October Early Upgrade Base')) {
  // Insert before the footer
  const footerMarker = '*Verified & Synchronized for 51Talk Big Team 01 Operations — October 2026.*';
  if (content.includes(footerMarker)) {
    content = content.replace(footerMarker, section7 + '\n\n' + footerMarker);
  } else {
    content += section7;
  }
}

fs.writeFileSync(mdPath, content, 'utf8');
console.log('OCTOBER_2026_TARGETS_AND_QUOTAS.md updated successfully with Section 7!');
