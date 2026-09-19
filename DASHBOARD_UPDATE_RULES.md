# 🚨 DASHBOARD_UPDATE_RULES.md
## Executive Dashboard Standard Operating Procedure (SOP) & Update Rules

> [!CAUTION]
> **NON-NEGOTIABLE RULE:**
> Under no circumstances should cached, outdated records, legacy target constants, or prior figures be used. Whenever any dashboard update is requested, fresh data must be parsed directly from the designated input workbooks. No update confirmation or presentation of results may be given until automated self-verification confirms that the newly parsed files are complete, team ranks are sorted strictly by Net Cash Achievement % (High to Low), all team refunds/clawbacks are mathematically reconciled, and the live dashboard is synchronized.

---

### 📁 1. Dedicated Input Files Directory (`Dashboard_Input_Files`)
To eliminate path confusion, browser download delays, and manual file-hunting errors, a dedicated input directory is established:

* **Primary Dedicated Directory:**  
  `D:\Lens\Dashboard\Dashboard_Input_Files`
* **Supported Daily Input Files:**
  1. **SS Lens Dashboard:** `SS Lens Dashboard*.xlsx` or `ME Lens Dashboard*.xlsx` (Contains `Individual_Rankings`, `Small_Team`, `POOL_Detail16`, `POOL22`).
  2. **Operations Master:** `All in one Master.xlsx` (Contains SOP tasks, unfixed teachers, zero-class, English Club leads).
  3. **English Club Export:** `English Club*.xlsx`
  4. **NEW SOP Export:** `NEW_SOP*.xlsx`
* **Multi-Tier Search Priority:**
  All automated update scripts (`RUN_AUTO_UPDATE.bat`, `auto_process_update.ps1`, `auto_download_and_process.ps1`, `generate_rep_leads_fast.ps1`, `extract_full_master.ps1`) scan sources in the following strict priority:
  1. **Tier 1 (Highest Priority):** `D:\Lens\Dashboard\Dashboard_Input_Files\`
  2. **Tier 2:** `C:\Users\husse\Downloads\` (Standard Chrome / Edge download folder)
  3. **Tier 3:** `D:\Lens\` (Legacy root directory)

---

### ⚡ 2. One-Click Automated Update Protocol (`RUN_AUTO_UPDATE.bat`)
A universal, one-click Windows launcher is provided for instant updates without manual scripting:

* **Launcher Path:** `D:\Lens\Dashboard\RUN_AUTO_UPDATE.bat`
* **Execution Workflow (4 Steps):**
  1. **Step 1:** Executes [`auto_process_update.ps1`](file:///d:/Lens/Dashboard/auto_process_update.ps1):
     * Extracts sales cash (Gross, Refund, Net), orders, and individual targets from `Individual_Rankings`.
     * Extracts official team metrics (Gross, Refund, Net, Target, Orders, Achievement %) directly from `Small_Team`.
     * Extracts Upgrade M2 metrics from `POOL_Detail16` and M2 coverage from `POOL22`.
     * Updates `dashboard.js` data matrices (`REPS_DATA`, `OFFICIAL_TEAMS_DATA`, `POOL22_M2_COVERAGE`, `daysPassed`).
     * Dynamically updates `index.html` headers, download timestamps, and Day benchmark pins.
  2. **Step 2:** Executes [`generate_rep_leads_fast.ps1`](file:///d:/Lens/Dashboard/generate_rep_leads_fast.ps1):
     * Reads all 4 raw detail sheets from `All in one Master.xlsx`.
     * Generates 24/25 clean, personalized rep CSV files in `leads/{rep}.csv`.
     * Generates `leads_summary.json` for the personal portal mini-cockpit cards.
  3. **Step 3:** Executes [`extract_full_master.ps1`](file:///d:/Lens/Dashboard/extract_full_master.ps1):
     * Extracts the 4 operational summary sheets (`1- Pending SOP`, `2- Unfixed Teacher`, `3- Class Consumption`, `4- English Club`).
     * Injects `MASTER_OPERATIONS_DATA` and `LEADS_SUMMARY` directly into `dashboard.js`.
  4. **Step 4:** Stages, commits, and pushes changes to GitHub (`git commit -m "Auto Update..." && git push origin master`).

---

### 📊 3. Sales Cash Revenue, Contracts, Target Updates & Small Team Sorting
1. **Designated Source Sheets:**
   * **Individual Sales Reps:** Sheet **`Individual_Rankings`**
   * **Official Small Teams:** Sheet **`Small_Team`**
2. **Rep Data Extraction (`Individual_Rankings`):**
   * **Rep Name:** Column B (`Sales Representative`).
   * **Net Cash Revenue:** Column E (`Cash-Refund` / Col 4). Clawbacks and refunds are factored in directly.
   * **Contracts:** Column F (`CONTRACTS` / Col 5).
   * **Basic Cash Target:** Column H (`Basic Cash Target` / Col 7).
   * **Direct Target Property:** Targets MUST be embedded directly within each rep object in `REPS_DATA` (`target: <amount>`), eliminating reliance on external dictionary lookups that can fail due to casing mismatches.
3. **Official Small Teams Data (`Small_Team`):**
   * Extracted directly into `OFFICIAL_TEAMS_DATA` in `dashboard.js`.
   * **Fields:** Official Target, Official Gross Cash, Official Refund, Official Net Cash, Official Orders, and Official Net Cash Achievement %.
   * Guarantees 100% reconciliation with 51Talk executive reporting.
4. **Achievement Calculation:**
   $$\text{Cash Achievement \%} = \frac{\text{Cash-Refund}}{\text{Basic Cash Target}} \times 100$$
5. **Small Teams Ranking & Sort Order (CRITICAL):**
   * **Mandatory Sort Order:** Small Teams MUST ALWAYS be sorted descending by **`Net Cash Achievement %` (High to Low)**:
     * **Rank #1:** Highest Achievement % (at the top of the chart and overview cards).
     * **Rank #5:** Lowest Achievement % (at the bottom).
   * *Reference Benchmark (Day 19):*
     * Rank #1: `ME-EGSS30` (71.9% - $11,490 / $15,980)
     * Rank #2: `ME-EGSS13` (58.3% - $27,444 / $47,060)
     * Rank #3: `ME-EGSS05` (52.4% - $40,104 / $76,590)
     * Rank #4: `ME-EGSS01` (28.0% - $14,238 / $50,760)
     * Rank #5: `ME-EGSS10` (24.4% - $8,587 / $35,210)
6. **Visual Bar Calibration:**
   * Progress bar fill length corresponds strictly to achievement percentage calibrated on the 103% target curve axis, featuring the 100% target marker line and the dynamic daily pacing benchmark line.
7. **Leaderboard & Individual Rankings Sorting:**
   * **Default Order:** Strictly sorted descending by `Cash Achievement % (High to Low)`. Ties broken by total net cash, then contracts.
   * **Immutable Cash Rank Assignment:** The **RANK** column (`#1`, `#2`, `#3`...) is permanently anchored to `Cash Achievement %`. Sorting by other columns preserves each rep's true Cash Rank badge.
   * **Team Filter Sort Reset:** Selecting any small team automatically resets sorting to `Cash Achievement % (High to Low)`.
8. **Context-Aware Table Totals Row (`tfoot`):**
   * When **"All Small Teams (5)"** is selected: Footer displays Big Team 01 Sector totals (`TOTAL / SECTOR AVERAGE`).
   * When a specific **Small Team** is selected (e.g., `ME-EGSS01`): Footer displays **ONLY the aggregate performance metrics of that specific team**.

---

### 💵 4. Gross vs. Net Cash & Team-Level Refunds Reconciliation Protocol

> [!IMPORTANT]
> **Why do Team Totals in `Small_Team` differ from the raw sum of Active Team Members?**
> In 51Talk's official Data Center financial ledger, **Refunds and Clawbacks** are charged at the **Small Team level** (`Small_Team` sheet), which can include historical clawbacks, leaver deductions, or centralized company refund adjustments.
>
> $$\text{Net Cash (Cash-Refund)} = \text{Gross Cash (Revenue Cash)} - \text{Refunds / Clawbacks}$$

#### Team Card Mathematical Reconciliation:
To guarantee complete transparency and eliminate confusion between individual reps' sum and the official team achievement:
1. **Team Card Header:** Displays **Net Cash Achieved** (the basis for official achievement %), and directly beneath it displays:
   $$\text{Gross: \$Gross} \quad | \quad \text{Ref: -\$Refund}$$
2. **Team Member Roster:** Below the individual member rows, a dedicated deduction row is rendered:
   * `🔻 Team Refund / Clawbacks (51Talk Data Center): -$Refund`
   * `= Official Net Team Cash: $Net Cash (Achievement %)`

#### Official Day 19 Reconciliation Table (All 5 Teams):

| Small Team | Team Leader | Gross Revenue (Sum of Reps) | Refunds / Clawbacks | Official Net Cash | Cash Target | Net Ach % | Gross Ach % |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **ME-EGSS30** | AdhmGadAllah | **$13,240** | **-$1,750** | **$11,490** | $15,980 | **71.9%** | 82.9% |
| **ME-EGSS13** | Mohamedha | **$29,512** | **-$2,068** | **$27,444** | $47,060 | **58.3%** | 62.7% |
| **ME-EGSS05** | Ibrahimismaiel | **$40,984** | **-$880** | **$40,104** | $76,590 | **52.4%** | 53.5% |
| **ME-EGSS01** | Ashraqatal | **$17,212** | **-$2,974** | **$14,238** | $50,760 | **28.0%** | 33.9% |
| **ME-EGSS10** | Mohamed06 | **$10,650** | **-$2,063** | **$8,587** | $35,210 | **24.4%** | 30.2% |
| **BIG TEAM 01** | **Saber Hussien** | **$111,598** | **-$9,736** | **$101,862** | **$225,600** | **45.2%** | **49.5%** |

*Example (Team 30):*  
* Member 1: `adhmgadallah`: $8,100  
* Member 2: `abdelrhmanshehata`: $3,320  
* Member 3: `alihesham01`: $1,820  
$$\text{Sum of Reps} = \$8,100 + \$3,320 + \$1,820 = \$13,240 \quad (\text{Gross})$$
$$\text{Team 30 Net Total} = \$13,240 - \$1,750 = \$11,490 \quad (71.9\% \text{ Ach})$$

---

### 🟡 5. Early Upgrade Conversion and Coverage Rates (Upgrade M2)
1. **Upgrade Student Base (`Upgrade Base`):**
   * **Official Source:** Pivot Table (`M-2 Cumulative Upgrade Students`) in `POOL_Detail16`.
   * **Big Team 01 Sector Total:** **763 students** (EGSS05: 232, EGSS01: 200, EGSS13: 186, EGSS10: 112, EGSS30: 33).
2. **Early Upgrade Conversion Rate (`Upgrade M2 Conversion Rate`):**
   $$\text{Upgrade M2 Conversion Rate \%} = \frac{\text{Upgrade M2 Contracts}}{\text{Upgrade Base}} \times 100$$
   * **Source:** Sheet **`POOL_Detail16`** / **`POOL15`**.
3. **Early Upgrade Coverage Rate (`M2 Cover Rate`):**
   * Dedicated column adjacent to M2 Conversion Rate.
   * **Visual Styling:** Yellow font color only (`#facc15`), transparent background (NO yellow fill/background).
   * **Source:** Sheet **`POOL22`** (Column G / mapped per rep).
4. **20% Upgrade Target Contracts & Needed Gap:**
   $$\text{20\% Target Contracts} = \lceil \text{Upgrade Base} \times 0.20 \rceil$$
   $$\text{20\% Upgrade Needed} = \max(0, \text{20\% Target Contracts} - \text{Upgrade M2 Achieved})$$
   * Displayed for all individual reps, small teams, and sector totals.

---

### 📈 6. Official 30-Day Cumulative Target Pacing Curve & Dynamic Day Pacing
Linear pacing is strictly superseded by the official non-linear cumulative target pacing schedule:

| Day of Month | Expected Cumulative Pace % | Day of Month | Expected Cumulative Pace % |
|:---:|:---:|:---:|:---:|
| **Day 1** | 5% | **Day 16** | **46%** *(Mid-Month Benchmark)* |
| **Day 2** | 10% | **Day 17** | 49% |
| **Day 3** | 11% | **Day 18** | 50% |
| **Day 4** | 12% | **Day 19** | **51%** *(e.g. $115,056)* |
| **Day 5** | 14% | **Day 20** | 54% |
| **Day 6** | 16% | **Day 21** | 57% |
| **Day 7** | 19% | **Day 22** | 59% |
| **Day 8** | 22% | **Day 23** | 62% |
| **Day 9** | 26% | **Day 24** | 66% |
| **Day 10** | 29% | **Day 25** | 65% |
| **Day 11** | 31% | **Day 26** | 68% |
| **Day 12** | 32% | **Day 27** | 80% |
| **Day 13** | 36% | **Day 28** | 87% |
| **Day 14** | 40% | **Day 29** | 94% |
| **Day 15** | 43% | **Day 30** | **103%** *(Excellence Stretch Goal)* |

#### Dynamic Pacing Logic:
1. **Dynamic Day Calculation:**
   * Script determines the active Day index automatically from file metadata or current date.
   * Updates `daysPassed = Day` in `dashboard.js`.
   * Sets benchmark pace percentage and required milestone revenue:
     $$\text{Benchmark Cash} = \text{Total Sector Target} \times \text{Pace \%}$$
2. **Floating Indicator Pin & Vertical Guideline:**
   * Animated badge displays `Day X: Y% - $Benchmark` with dynamic positioning:
     $$\text{Track Position} = \text{calc}\left(20\text{px} + (100\% - 40\text{px}) \times \frac{\text{Pace \%}}{103}\right)$$
   * Continuous dashed guideline drops through all progress bar rows.
3. **Pacing Status Badges:**
   * `🟢 Ahead of Pace` (Actual % $\ge$ Expected %)
   * `🟡 Within Pace` (Actual % within 8% of Expected %)
   * `🔴 Behind Pace` (Actual % < Expected % - 8%)
   * Dollar variance (+Surplus / -Deficit) dynamically rendered for every team and rep.

---

### 📋 7. Operations Master (All 24 Reps & 4 Modules) & Self-Service Leads SOP
1. **Operational Master Source:**
   * Primary: `D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx` (Fallback: `D:\Lens\All in one Master.xlsx`).
2. **Four Core Operational Modules:**
   * **Module 1: SS Pending SOP Tasks:**
     - Displays all 8 official lifecycle task columns:
       1. English Club Booking (`ec`)
       2. Round 1 Awareness (`r1`)
       3. Round 2 Class Attendance (`r2`)
       4. Round 3 Habit Cultivation (`r3`)
       5. Round 4 Learning Progress Feedback (`r4`)
       6. Round 5 Upgrade Path Duration (`r6d`)
       7. Round 6 Expiring Inside/Outside Pool (`r6e`)
       8. SS Absence Warning (`absence`)
     - Mathematically reconciled total:
       $$\text{Total Pending Tasks} = \text{EC} + \text{R1} + \text{R2} + \text{R3} + \text{R4} + \text{R5} + \text{R6} + \text{Absence}$$
   * **Module 2: Unfixed Teachers Binding:**
     - Covers M0, M1, M2 cohorts with an 80% binding target.
   * **Module 3: Class Consumption & Zero-Class Rescue:**
     - High-risk zero-consuming students (0 classes MTD with remaining points).
   * **Module 4: English Club (40% Target):**
     - Target 40% active student adoption with student base, bookings, attendances, and gap.
3. **Rep-Specific Leads CSV Generation (`leads/{rep}.csv`):**
   * Fast PowerShell COM script (`generate_rep_leads_fast.ps1`) generates individual clean CSV files covering all active reps across all 5 teams.
   * **Detail Sheet Integration:** The personal CSV includes SOP pending tasks plus actionable Class Interruption Warnings (e.g., for Shahd: 56 SOP tasks + 9 Class Interruption alerts = 65 total tasks in Section 1).
4. **Self-Service Personal Mini-Cockpit:**
   * Interactive dropdown in the `Operations Master` tab enables any sales rep to view their personalized 4-card cockpit (matching `leads_summary.json` 100%) and download their actionable lead CSV file instantly.

---

### 🌐 8. Production Deployment & Hourly Automated Schedule
1. **Official Live Production URL:**
   * `https://husseinelaasar.github.io/big-team-01-dashboard/`
   * Hosted cloud-native on GitHub Pages. Fully responsive on Desktop, Mobile, and DingTalk in-app browser.
2. **Automated Hourly Cron Schedule:**
   * **Timing:** Runs every hour at **10 minutes past the hour (XX:10)**.
   * **Windows Task:** `51Talk_Dashboard_Hourly_Update`
   * **Script:** [`hourly_update_and_publish.ps1`](file:///d:/Lens/Dashboard/hourly_update_and_publish.ps1)
   * **Log:** [`hourly_update.log`](file:///d:/Lens/Dashboard/hourly_update.log)
3. **Browser Cache Busting:**
   * Inform users to perform a hard refresh (`Ctrl + F5` or `Shift + Reload`) if local browser caching displays older figures.

---

### 🚫 9. Strict Security & SM Scheme Isolation
* **Security Boundary:** All calculations, cards, formulas, or links related to the Senior Manager Commission Scheme (`sm-scheme.*`) or SM Portal are strictly isolated and excluded from the public executive dashboard (`index.html`), scripts, and GitHub repositories.
* The public dashboard remains 100% operational and team-facing.
