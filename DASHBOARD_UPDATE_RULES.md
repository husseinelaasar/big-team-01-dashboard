# 🚨 DASHBOARD_UPDATE_RULES.md
## Executive Dashboard Standard Operating Procedure (SOP) & Update Rules

> [!CAUTION]
> **NON-NEGOTIABLE RULE:**
> Under no circumstances should cached, outdated records, legacy target constants, or prior figures be used. Whenever any dashboard update is requested, fresh data must be parsed directly from the designated input workbooks. No update confirmation or presentation of results may be given until automated self-verification confirms that the newly parsed files are complete, team ranks are sorted strictly by Net Cash Achievement % (High to Low), and the live dashboard is synchronized.

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
* **Execution Workflow:**
  1. **Step 1:** Searches `Dashboard_Input_Files` (and downloads folder) for the freshest Excel export files.
  2. **Step 2:** Executes [`auto_process_update.ps1`](file:///d:/Lens/Dashboard/auto_process_update.ps1) via Windows PowerShell.
     * Extracts sales cash, orders, and individual targets from `Individual_Rankings`.
     * Extracts official team metrics directly from `Small_Team`.
     * Extracts Upgrade M2 metrics from `POOL_Detail16` and M2 coverage from `POOL22`.
     * Updates `dashboard.js` data matrices (`REPS_DATA`, `OFFICIAL_TEAMS_DATA`, `POOL22_M2_COVERAGE`, `daysPassed`).
     * Dynamically updates `index.html` headers, download timestamps, and Day benchmark pins.
  3. **Step 3:** Executes [`generate_rep_leads_fast.ps1`](file:///d:/Lens/Dashboard/generate_rep_leads_fast.ps1) to extract 25 personalized rep leads CSV files into `leads/` and refresh `LEADS_SUMMARY`.
  4. **Step 4:** Stages, commits, and pushes changes to GitHub (`git commit -m "Auto Update..." && git push origin master`).
  5. **Step 5:** Displays the completion summary with live URL verification links.

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
   * **Fields:** Official Target, Official Net Cash, Official Orders, and Official Net Cash Achievement %.
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

### 🟡 4. Early Upgrade Conversion and Coverage Rates (Upgrade M2)
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

### 📈 5. Official 30-Day Cumulative Target Pacing Curve & Dynamic Day Pacing
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

### 📋 6. Operations Master & Sales Rep Self-Service Leads Portal SOP
1. **Operational Master Source:**
   * Primary: `D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx` (Fallback: `D:\Lens\All in one Master.xlsx`).
   * Modules:
     1. **SS Pending SOP Tasks:** Urgent pending follow-ups and expirations.
     2. **Unfixed Teachers Binding:** Students without dedicated teachers past class thresholds.
     3. **Zero-Class & Consumption Rescue:** High-risk non-consuming students with large balances.
     4. **English Club 40% Target:** Eligible students for English Club bookings.
2. **Rep-Specific Leads Generation:**
   * Fast PowerShell COM script (`generate_rep_leads_fast.ps1`) generates 25 clean CSV files into `d:\Lens\Dashboard\leads/{rep}.csv`.
   * Covers all 25 active sales representatives across the 5 teams (`ME-EGSS01`, `ME-EGSS05`, `ME-EGSS10`, `ME-EGSS13`, `ME-EGSS30`).
3. **Direct Client-Side Self-Service Download:**
   * Interactive dropdown in the `Operations Master` tab allows reps to select their name and download their personalized task CSV instantly via static GitHub Pages.

---

### 🌐 7. Production Deployment & Hourly Automated Schedule
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

### 🚫 8. Strict Security & SM Scheme Isolation
* **Security Boundary:** All calculations, cards, formulas, or links related to the Senior Manager Commission Scheme (`sm-scheme.*`) or SM Portal are strictly isolated and excluded from the public executive dashboard (`index.html`), scripts, and GitHub repositories.
* The public dashboard remains 100% operational and team-facing.
