const fs = require('fs');

const path = 'd:/Lens/Dashboard/OCTOBER_2026_TARGETS_AND_QUOTAS.md';
let content = fs.readFileSync(path, 'utf8');

// Replace Day 6 with Day 7 in header
content = content.replace(
  /## 📌 1\. Executive Summary & Macro Quotas \(Day \d+ of 31\)[\s\S]*?(?=### 🧭 Detailed Strategic Feedback)/,
  `## 📌 1. Executive Summary & Macro Quotas (Day 7 of 31)

| Metric | Target Quota | Current MTD (Oct 7) | Variance / Gap | Pacing Benchmark (Day 7: 23%) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Net Cash Revenue** | **$305,950** | **$27,307** | **-$278,643** (8.9% Achieved) | Benchmark: $70,369 (-$43,062 Deficit / -14.1% Gap) |
| **Total Contracts (Orders)** | **252 Orders** | **25 Orders** | **-227 Orders** (9.9% Achieved) | Avg: $1,092 / contract |
| **Required Daily Velocity** | **$11,610 / day** | $3,901 / day | 24 Days Remaining | Target Month-End Finish: 102% |
| **Active Sales Specialists** | **21 Reps** | 21 Active | 0 Unassigned | 100% Rep Allocation |
| **Upgrade Base (Pool Leads)** | **497 Leads** | 497 Allocated | Authoritative M1 & M2 Sheet | 100% Rep Lead Allocation |
| **Upgrade 20% Milestone Goal** | **100 Upgrades** | **10 Upgrades** | **-90 Upgrades** (10.0% to Goal) | **2.01% Conversion Rate** (10 / 497) |
| **M2 Contact / Cover Rate** | **≥60.0% Touch** | **24.4% Avg Touch** | **-35.6% Touch Gap** | POOL22 Effective Frequency |

---

## 👥 2. Small Teams Target Allocation & Today's BM Pacing Matrix (Day 7 of 31)

> **Official Benchmark for Day 7**: **23.0%** ($70,369 Sector Quota) | **Days Remaining**: 24 Days

| Rank | Small Team | Team Leader | Color Code | Active Reps | Cash Target | Current Cash | Cash Ach % | Day 7 BM Target (23%) | **Cash Remaining to Achieve Today's BM** | Total Month Deficit | Req. Daily Run-Rate | Pace Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **#1** | **ME-EGSS13** | Mohamedha | \`#f59e0b\` (Amber) | 4 Reps | **$48,800** | $6,460 | **13.2%** | $11,224 | **$4,764 needed** | $42,340 | $1,764 / day | 🟡 Near Pace (-9.8%) |
| **#2** | **ME-EGSS30** | Adhm GadAllah | \`#f43f5e\` (Rose) | 3 Reps | **$33,100** | $3,640 | **11.0%** | $7,613 | **$3,973 needed** | $29,460 | $1,228 / day | 🔴 Behind Pace (-12.0%) |
| **#3** | **ME-EGSS05** | Ibrahim Abd El Shakour | \`#06b6d4\` (Cyan) | 6 Reps | **$90,800** | $7,535 | **8.3%** | $20,884 | **$13,349 needed** | $83,265 | $3,469 / day | 🔴 Behind Pace (-14.7%) |
| **#4** | **ME-EGSS01** | Ashraqatal | \`#6366f1\` (Indigo) | 5 Reps | **$88,000** | $6,780 | **7.7%** | $20,240 | **$13,460 needed** | $81,220 | $3,384 / day | 🔴 Behind Pace (-15.3%) |
| **#5** | **ME-EGSS10** | Abdelrhman Shehata | \`#10b981\` (Emerald) | 3 Reps | **$45,250** | $2,892 | **6.4%** | $10,408 | **$7,516 needed** | $42,358 | $1,765 / day | 🔴 Behind Pace (-16.6%) |
| **TOTAL** | **Big Team 01** | **Saber Hussien** | \`#38bdf8\` (Sky) | **21 Reps** | **$305,950** | **$27,307** | **8.9%** | **$70,369** | **$43,062 needed** | **$278,643** | **$11,610 / day** | 🔴 **Behind Pace (-14.1%)** |

`
);

fs.writeFileSync(path, content, 'utf8');
console.log('[OK] Updated OCTOBER_2026_TARGETS_AND_QUOTAS.md successfully');
