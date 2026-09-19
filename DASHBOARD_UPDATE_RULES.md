# 🚨 DASHBOARD_UPDATE_RULES.md
## Executive Dashboard Standard Operating Procedure (SOP) & Update Rules

> [!CAUTION]
> **NON-NEGOTIABLE RULE:**
> Under no circumstances should cached, outdated records, legacy target constants, or prior figures be used. Whenever any dashboard update is requested, fresh data must be parsed directly from the designated input workbooks. No update confirmation or presentation of results may be given until automated self-verification confirms that:
> 1. Freshly parsed files are verified and complete across all active reps and teams.
> 2. Small Teams are ranked strictly descending by **Net Cash Achievement % (High to Low)**.
> 3. Individual active rep refunds are explicitly displayed next to their names, while leaver/unassigned refunds are charged **ONLY** to Big Team 01 (Sector Total) and **NEVER** deducted from Small Teams.
> 4. Early Upgrade M2 Touch Frequency / Call Intensity metrics (POOL22) are mathematically clarified alongside the 100% unique student coverage.
> 5. The live dashboard is fully synchronized and verified.

---

### 📁 1. Dedicated Input Files Directory (`Dashboard_Input_Files`)
To eliminate path confusion, browser download delays, and manual file-hunting errors, a dedicated input directory is established:

* **Primary Dedicated Directory:**  
  `D:\Lens\Dashboard\Dashboard_Input_Files`
* **Supported Daily Input Files:**
  1. **SS Lens Dashboard:** `SS Lens Dashboard*.xlsx` or `ME Lens Dashboard*.xlsx` (Contains `Individual_Rankings`, `Small_Team`, `POOL_Detail16`, `POOL22`, `POOL_Detail23`).
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
     * Associates individual refunds with active sales reps to display next to their names.
     * Computes small team totals strictly from active team members' net cash (protecting small teams from unassigned/leaver refunds).
     * Extracts Upgrade M2 metrics from `POOL_Detail16` and M2 Touch Frequency from `POOL22`.
     * Updates `dashboard.js` data matrices (`REPS_DATA`, `POOL22_M2_COVERAGE`, `daysPassed`).
     * Dynamically updates `index.html` headers, download timestamps, and Day benchmark pins.
  2. **Step 2:** Executes [`generate_rep_leads_fast.ps1`](file:///d:/Lens/Dashboard/generate_rep_leads_fast.ps1):
     * Reads all 4 raw detail sheets from `All in one Master.xlsx`.
     * Generates 24 clean, personalized rep CSV files in `leads/{rep}.csv`.
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
   * **Gross Cash:** Column C (`Revenue Cash` / Col 2).
   * **Refund Amount:** Column D (`Refund` / Col 3).
   * **Net Cash Revenue:** Column E (`Cash-Refund` / Col 4). Individual clawbacks and refunds are factored into the rep's net cash.
   * **Contracts:** Column F (`CONTRACTS` / Col 5).
   * **Basic Cash Target:** Column H (`Basic Cash Target` / Col 7).
3. **Small Teams Ranking & Sort Order (CRITICAL):**
   * **Mandatory Sort Order:** Small Teams MUST ALWAYS be sorted descending by **`Net Cash Achievement %` (High to Low)**:
     * **Rank #1:** Highest Achievement % (at the top of the chart and overview cards).
     * **Rank #5:** Lowest Achievement % (at the bottom).
   * *Reference Benchmark Standings (Day 19):*
     * **Rank #1:** `ME-EGSS30` (**82.9%** — $13,240 / $15,980)
     * **Rank #2:** `ME-EGSS13` (**59.0%** — $27,762 / $47,060)
     * **Rank #3:** `ME-EGSS05` (**50.0%** — $38,284 / $76,590)
     * **Rank #4:** `ME-EGSS01` (**30.6%** — $15,552 / $50,760)
     * **Rank #5:** `ME-EGSS10` (**30.2%** — $10,650 / $35,210)
4. **Leaderboard & Individual Rankings Sorting:**
   * **Default Order:** Strictly sorted descending by `Cash Achievement % (High to Low)`.
   * **Immutable Cash Rank Assignment:** The **RANK** column (`#1`, `#2`, `#3`...) is permanently anchored to `Cash Achievement %`.
5. **Context-Aware Table Totals Row (`tfoot`):**
   * When **"All Small Teams (5)"** is selected: Footer displays Big Team 01 Sector totals (`TOTAL / SECTOR AVERAGE`).
   * When a specific **Small Team** is selected: Footer displays **ONLY the aggregate performance metrics of that specific team**.

---

### 💵 4. Active Rep Refund Attribution & Small Team Protection Rule

> [!IMPORTANT]
> **EXPLICIT REFUND ATTRIBUTION RULES:**
> 1. **Active Rep Refunds:** If an active sales representative has a refund registered under their name in `Individual_Rankings`, that refund is factored into their individual net cash, and the exact refund amount is **clearly displayed in red next to their name** in the team roster:
>    $$\text{e.g. } \mathbf{Ashraqat: -\$380} \quad \mathbf{\color{red}{(Ref: -\$1,660)}}$$
> 2. **Small Team Protection (No Leaver Deductions):** If a refund in the financial ledger is NOT under the name of any current active team member (e.g. historical leaver refunds, unassigned accounts, or company clawbacks), **it is NEVER deducted from the Small Team's sales**. The Small Team's total net cash is strictly the sum of its active team members' net cash.
> 3. **Big Team 01 Absorption:** All unassigned, leaver, or company-level refunds are charged **ONLY to Big Team 01 (Sector Total)** ($101,862 net), ensuring complete macro-financial reconciliation without penalizing individual small teams.

#### Official Day 19 Reconciled Standings (All 5 Small Teams + Sector Total):

| Small Team | Team Leader | Active Members Net Cash | Individual Rep Refunds (Shown next to name) | Team Target | Team Net Ach % | Rank |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **ME-EGSS30** | AdhmGadAllah | **$13,240** | **$0** *(No active member had a refund)* | $15,980 | **82.9%** | **#1** 🥇 |
| **ME-EGSS13** | Mohamedha | **$27,762** | **-$1,750** *(Hayam: Gross $5,412 - $1,750 = $3,662)* | $47,060 | **59.0%** | **#2** 🥈 |
| **ME-EGSS05** | Ibrahimismaiel | **$38,284** | **-$2,068** *(Ibrahim: Gross $7,975 - $2,068 = $5,907)* | $76,590 | **50.0%** | **#3** 🥉 |
| **ME-EGSS01** | Ashraqatal | **$15,552** | **-$1,660** *(Ashraqat: Gross $1,280 - $1,660 = -$380)* | $50,760 | **30.6%** | **#4** |
| **ME-EGSS10** | Mohamed06 | **$10,650** | **$0** *(No active member had a refund)* | $35,210 | **30.2%** | **#5** |
| **BIG TEAM 01** | **Saber Hussien** | **$101,862** | **-$9,736** *(Active -$5,478 + Leavers/HQ -$4,258)* | **$225,600** | **45.2%** | **Sector Total** |

#### Proof of Calculation for Team 30 ($13,240 / 82.9%):
* Member 1: `adhmgadallah`: **$8,100** (Refund: $0)
* Member 2: `abdelrhmanshehata`: **$3,320** (Refund: $0)
* Member 3: `alihesham01`: **$1,820** (Refund: $0)
$$\text{Team 30 Net Sales} = \$8,100 + \$3,320 + \$1,820 = \mathbf{\$13,240}$$
$$\text{Team 30 Achievement} = \frac{\$13,240}{\$15,980} \times 100 = \mathbf{82.9\% \quad (\#1 \text{ Rank})}$$
*(The -$1,750 refund on Team 30 in 51Talk's sheet belonged to a former employee who is no longer active; therefore, it is NOT charged to Team 30, but absorbed solely into Big Team 01).*

---

### 🟡 5. Early Upgrade Conversion & M2 Cover Rate Bug Resolution

> [!NOTE]
> **WHY DID M2 COVER RATE APPEAR WRONG (860.8%, 1033.3%, 1237.3%)?**
> In standard sales dashboards, a "Coverage Rate" represents the percentage of unique leads contacted (which is naturally capped between 0% and 100%). Seeing percentages over 1,000% looked like a calculation bug.
> 
> **The Exact Technical Explanation from 51Talk Data Center:**
> 1. In 51Talk's export sheet `POOL22`, the column is titled `有效覆盖率` (Effective Coverage).
> 2. In 51Talk's call-center reporting logic, `有效覆盖率` is **NOT** unique student coverage; it is **Touchpoint Call Frequency / Contact Intensity (تكرار وكثافة الاتصال)**:
>    $$\text{51Talk 有效覆盖率 (POOL22)} = \frac{\text{Total Outbound Calls Made (有效外呼量)}}{\text{Total Student Base (资源量)}} \times 100\%$$
>    * A value of **1,237.3%** means the rep made an average of **12.4 calls per student** in that pool during the month!
>    * A value of **860.8%** means **8.6 calls per student**.
> 3. **True Unique Coverage Rate (`POOL_Detail23`):**
>    * Verification of all 10,002 student records in `POOL_Detail23` confirms that **100.0% of students in Upgrade M2 received at least 1 contact attempt** (`Unique Student Reach = 100%`).
> 4. **UI Presentation Solution:**
>    * The column header is clarified as: **`M2 Touch Intensity / Freq % (POOL22)`**.
>    * Cells display both the 51Talk frequency percentage and the call multiplier: e.g. **`1237.3% (12.4x)`**, with a tooltip explaining that unique student coverage is 100% and the metric reflects call intensity.

#### Upgrade M2 Key Metrics:
1. **Upgrade Student Base (`Upgrade Base`):**
   * **Official Source:** Pivot Table (`M-2 Cumulative Upgrade Students`) in `POOL_Detail16`.
   * **Big Team 01 Sector Total:** **763 students** (EGSS05: 232, EGSS01: 200, EGSS13: 186, EGSS10: 112, EGSS30: 33).
2. **Early Upgrade Conversion Rate (`Upgrade M2 Conversion Rate`):**
   $$\text{Upgrade M2 Conversion Rate \%} = \frac{\text{Upgrade M2 Contracts}}{\text{Upgrade Base}} \times 100$$
   * **Source:** Sheet **`POOL_Detail16`** / **`POOL15`**.
3. **20% Upgrade Target Contracts & Needed Gap:**
   $$\text{20\% Target Contracts} = \lceil \text{Upgrade Base} \times 0.20 \rceil$$
   $$\text{20\% Upgrade Needed} = \max(0, \text{20\% Target Contracts} - \text{Upgrade M2 Achieved})$$

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
   * **Detail Sheet Integration:** The personal CSV includes SOP pending tasks plus actionable Class Interruption Warnings.
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
3. **Automated Cache-Busting Protocol:**
   * **Versioned Asset Query Strings:** `index.html` must always reference scripts and stylesheets using timestamped version tags (e.g. `<script src="dashboard.js?v=20260919_1425"></script>` and `<link rel="stylesheet" href="styles.css?v=20260919_1425">`). This prevents browser disk caching and GitHub Pages CDN edge cache delays, ensuring updates reflect instantly.
   * **Anti-Caching HTTP Meta Directives:** Embedded directly in `<head>` (`Cache-Control: no-cache, no-store, must-revalidate`, `Pragma: no-cache`, `Expires: 0`).
   * **Client Verification:** Users can immediately view fresh figures via `Ctrl + F5` or `Shift + F5` in any browser.

---

### 🚫 9. Strict Security & SM Scheme Isolation
* **Security Boundary:** All calculations, cards, formulas, or links related to the Senior Manager Commission Scheme (`sm-scheme.*`) or SM Portal are strictly isolated and excluded from the public executive dashboard (`index.html`), scripts, and GitHub repositories.
* The public dashboard remains 100% operational and team-facing.
