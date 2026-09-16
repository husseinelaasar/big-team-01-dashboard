# 🚨 DASHBOARD_UPDATE_RULES.md
## Executive Dashboard Standard Operating Procedure (SOP) & Update Rules

> [!CAUTION]
> **NON-NEGOTIABLE RULE:**
> Under no circumstances should cached, outdated records or prior figures be used. Whenever any dashboard update is requested, a fresh download must be pulled directly from the official Data Center. No update confirmation or presentation of results may be given until automated self-verification confirms that the newly downloaded file is complete and up to date.

---

### 🌐 Primary Data Source
* **Official Data Center URL:** `https://lp.51talkjr.com/#/data-center/business/SA-SSdata` (**ME Lens Dashboard** tab).
* This source is automatically designated as the official primary data stream whenever login verification or two-factor authentication blocks direct access to the legacy CRM (`crm.51talk.com`).

---

### 📊 1. Sales Cash Revenue, Contracts, and Target Updates
1. **Designated Source Sheet:** **`Individual_Rankings`**
2. **Cash Revenue Extraction:** Extract net sales revenue exclusively from column **`Cash-Refund`** (Column E).
3. **Total Contracts Count:** Extract total executed contracts from **Column F (`CONTRACTS`)**.
4. **Updated Target Override:** Delete and invalidate any legacy target figures previously referenced. Exclusively adopt the updated target from **Column H (`Basic Cash Target`)**.
5. **Achievement Calculation:** Calculate financial `Cash Achievement %` dynamically for each sales representative and team from freshly extracted data:
   $$\text{Cash Achievement \%} = \frac{\text{Cash-Refund}}{\text{Basic Cash Target}} \times 100$$
6. **Small Teams Chart & Cards Display:**
   * **Mandatory Sort Order:** Sort teams descending by `Cash Achievement %` from highest at the top (Rank #1) to lowest at the bottom (Rank #5).
   * **Visual Bar Calibration:** Progress bar fill length must strictly correspond to the team's achievement percentage calibrated on the 103% target curve axis, featuring a 100% full target marker line and the official daily benchmark dashed line.
7. **Leaderboard & Individual Rankings Sorting:**
   * **Mandatory Sort Order:** The individual matrix and leaderboard preview must strictly sort descending by **`Cash Achievement %` (High to Low)**, from top performer (Rank #1: 108.2%) downward.
8. **Small Team Member Roster Sorting:**
   * **Mandatory Sort Order:** Sort team members within each small team card descending by `Cash Achievement %`.
   * **Member Upgrade Metric:** Display executed early upgrade contracts `Upgrades: Y M2` next to each rep's name, and feature total team upgrades in a dedicated stat box on the card.
9. **Table Totals Row (`tfoot`):**
   * **Universal Rule:** Every table across the dashboard must include a dedicated summary footer row showing total sums (`TOTAL`) and sector-wide weighted averages (`SECTOR AVERAGE`).

---

### 🟡 2. Early Upgrade Conversion and Coverage Rates (Upgrade M2)
1. **Upgrade Student Base (`Upgrade Base`):**
   * **Official Source:** Original Pivot Table (`M-2 Cumulative Upgrade Students`).
   * **Big Team 01 Sector Total:** **763 students** (Breakdown: EGSS05: 232, EGSS01: 200, EGSS13: 186, EGSS10: 112, EGSS30: 33).
2. **Early Upgrade Conversion Rate (`Upgrade M2 Conversion Rate`):**
   * **Approved Formula:**
     $$\text{Upgrade M2 Conversion Rate \%} = \frac{\text{Upgrade M2 Contracts}}{\text{Upgrade Base}} \times 100$$
   * **Source:** Sheet **`POOL15`** (Column G).
3. **Early Upgrade Coverage Rate (`M2 Cover Rate`):**
   * **Dedicated Column:** Displayed as a dedicated column adjacent to M2 Conversion Rate labeled **`M2 Cover Rate`**.
   * **Visual Styling:** Styled with **yellow font color only (#facc15)** with zero background color (Text font color yellow only; NO yellow background).
   * **Source:** Sheet **`POOL22`** (Column G).
4. **20% Upgrade Target Contracts & Needed Gap:**
   * **Mandatory Formula:**
     $$\text{20\% Target Contracts} = \lceil \text{Upgrade Base} \times 0.20 \rceil$$
     $$\text{20\% Upgrade Needed} = \max(0, \text{20\% Target Contracts} - \text{Upgrade M2 Achieved})$$
   * **Universal Application:** Displayed across all tables and cards for individual reps, small teams, and Big Team 01 sector total (Sector: 153 target contracts, 135 needed contracts).

---

### 🚫 3. Strict Exclusion of Senior Manager Commission Scheme (SM Scheme Isolation)
* **Complete Removal & Security Boundary:** Completely purge, delete, and exclude any calculators, cards, formulas, or links related to the Senior Manager Commission Scheme (`sm-scheme.*`) or SM Portal from the public executive dashboard (`index.html`), scripts, and navigation.
* The public dashboard must remain strictly operational and performance-focused without exposing executive manager bonus tiers or compensation rules.

---

### 🔐 4. Mandatory Pre-Publish Verification Checkpoints
1. **Fresh Download Verification:** Confirm that a completely new export workbook has been downloaded, parsed, and logged with a fresh timestamp.
2. **Data State Reset:** Clear all previous state arrays in `dashboard.js` before calculating aggregations to eliminate data crossover.
3. **Totals Reconciliation:** Reconcile aggregate sector metrics (Net Cash Revenue, Contracts, Target) against the live Data Center screen prior to committing and announcing any update.

---

### 🌐 5. Live Production Deployment & Hourly Automated Schedule
1. **Official Live Production URL:**
   * `https://husseinelaasar.github.io/big-team-01-dashboard/`
   * Hosted cloud-native on GitHub Pages, responsive across Desktop, Mobile, and DingTalk in-app browser.
   * **Security Isolation:** Sensitive manager commission assets (`sm-scheme.*`) are strictly excluded via `.gitignore`.

2. **Automated Hourly Cron Schedule:**
   * **Execution Timing:** Scheduled every hour at **10 minutes past the hour (XX:10)** to synchronize with 51Talk Data Center hourly data refreshes (`lp.51talkjr.com`).
   * **System Scheduled Task:** `51Talk_Dashboard_Hourly_Update`
   * **Execution Script:** [`hourly_update_and_publish.ps1`](file:///d:/Lens/Dashboard/hourly_update_and_publish.ps1)
   * **Operational Log:** [`hourly_update.log`](file:///d:/Lens/Dashboard/hourly_update.log)
   * **Automated Cycle per Hour (XX:10):**
     1. Trigger fresh download via Chrome DevTools Protocol (CDP).
     2. Verify completeness of `Individual_Rankings`, `POOL15`, and `POOL22`.
     3. Update JavaScript data matrices in `dashboard.js` with fresh timestamp.
     4. Execute automated `git commit & push` to deploy live to GitHub Pages without manual intervention.

---

### 💵 6. Net Cash Standards & Leavers Policy (Cash-Refund & Adjustments)
1. **Net Cash Standard (`Cash-Refund`):**
   * Net revenue is extracted exclusively from Column E (`Cash-Refund`) of `Individual_Rankings`, never from gross revenue (`Revenue Cash`).
   * Clawbacks and customer refunds are charged directly against the responsible representative's MTD tally, allowing negative net cash balances where refunds exceed current sales (e.g., `EGSS-ashraqatal: -$380`).
2. **Inactive Reps & Leavers Handling:**
   * Representatives who have left the organization are removed from active small team member rosters and cards (e.g., `EGSS-ahmedabdulhamid`, `EGSS-ahmedhalawa`, `EGSS-rokayar`, `EGSS-suhailajamal`).
   * Their historical sales and refunds remain aggregated in sector totals to ensure 100% reconciliation with live Data Center totals.

---

### 📋 7. Operations Master & Sales Rep Self-Service Leads Portal SOP
1. **Operational Master Source:**
   * **Source Workbook:** `D:\Lens\All in one Master.xlsx`
   * **Four Core Operational Modules:**
     1. **SS Pending SOP Tasks:** Mandatory student follow-up actions and deadline expirations.
     2. **Unfixed Teachers Binding:** Students without dedicated fixed teachers past threshold classes to safeguard retention.
     3. **Zero-Class & Consumption Rescue:** High-risk non-consuming students (Zero-Class MTD and large unused credit balances).
     4. **English Club 40% Target:** Active students eligible for English Club booking to boost engagement velocity.

2. **Rep-Specific Leads File Generation:**
   * Generates 25 individual clean CSV files in `d:\Lens\Dashboard\leads/{rep}.csv`.
   * Covers all **25 active sales representatives** across the 5 teams (`ME-EGSS01`, `ME-EGSS05`, `ME-EGSS10`, `ME-EGSS13`, `ME-EGSS30`).
   * **Internal CSV 4-Section Architecture:**
     * `=== 1. SOP PENDING TASKS ===` (Student ID, Task Name, Expiration Timestamp).
     * `=== 2. UNFIXED TEACHER BINDING LEADS ===` (Student ID, Class Count, Last Class Timestamp).
     * `=== 3. ZERO-CLASS & CLASS CONSUMPTION RESCUE ===` (Student ID, Monthly Classes, Paid Classes, Remaining Points, Priority Level).
     * `=== 4. ENGLISH CLUB ACTIONABLE LEADS ===` (Student ID, Completed Classes, Target).

3. **Dashboard Self-Service Portal & Direct Download:**
   * **Interactive Dropdown:** Rep selector dropdown (`#personalRepSelect`) in the `Operations Master` tab.
   * **Personal Mini-Cockpit:** Dynamically displays 4 colorful KPI summary cards for the selected rep's active tasks.
   * **Direct Client-Side Download:** One-click download button (`downloadSelectedRepLeads()`) delivers the rep's personalized CSV instantly from static GitHub Pages without requiring a backend server.

4. **Privacy & Data Isolation Protocol:**
   * Absolute isolation: Rep leads CSV files and Operations Master code contain only assigned student IDs and operational tasks. No manager bonus formulas or sensitive compensation data are present.

5. **Workbook Refresh Cycle:**
   * Whenever a new `All in one Master.xlsx` workbook is delivered:
     1. Execute fast Excel COM generation script (`generate_rep_leads_fast.ps1`).
     2. Update `LEADS_SUMMARY` metrics in `dashboard.js`.
     3. Stage, commit, and push (`git commit & push`) to deploy fresh leads to GitHub Pages.

---

### 📊 8. SOP Compliance Standards, Sector Totals & Small Teams Scorecards
1. **SOP Data Source:**
   * Official Data Center: `https://lp.51talkjr.com/#/data-center/business/SA-SSdata`.
   * Covers all 9 operational student lifecycle stages:
     - **R1 Leads Coverage:** Target 95%
     - **R2 Timely Callback:** Target 90%
     - **R3 Demo Class Reserved:** Target 85%
     - **R4 Class Consumption:** Target 80%
     - **R5 Outside Pool Recovery:** Target 70%
     - **R6 Sales Pipeline Active:** Target 75%
     - **EC English Club Engagement:** Target 70%
     - **U1 Upgrade Pitch Delivery:** Target 85%
     - **U2 Upgrade Agreement Closed:** Target 80%

2. **Big Team 01 Sector Overall Averages:**
   * Weighted average calculated across all 5 teams for each lifecycle round.
   * Displayed prominently across:
     1. **Top KPI Scorecards:** Sector Overall SOP Score (78.1%), Met Stages (3/9), Top Stage (R1 91%), and Primary Bottleneck (R5 55.8%).
     2. **Master Comparison Heatmap Matrix:** Dedicated highlighted column (`⭐ Big Team 01`).
     3. **Stage Breakdown Cards:** Sector total bar leading each stage comparison.
     4. **Summary Footer:** Sector average compliance benchmark.

3. **Small Teams SOP Scorecards (Bottom Section):**
   * Five dedicated performance cards ranked descending by overall SOP compliance:
     - **Rank #1:** `ME-EGSS05 (Ibrahimismaiel): 83.3%`
     - **Rank #2:** `ME-EGSS13 (Mohamedha): 82.2%`
     - **Rank #3:** `ME-EGSS01 (Ashraqatal): 78.4%`
     - **Rank #4:** `ME-EGSS10 (Mohamed06): 74.7%`
     - **Rank #5:** `ME-EGSS30 (AdhmGadAllah): 72.0%`
   * Each card details team rank, Team Leader name, met stages count out of 9, sector average delta, full 9-round breakdown, and strategic Team Leader recommendations.

4. **Cross-Tab Integration:**
   * Overall `SOP Compliance Rate %` integrated into team overview cards in `Small Teams (5)` tab.

---

### 📈 9. Official 30-Day Cumulative Target Pacing Curve & Top Visual Ruler
Linear pacing is strictly superseded by the official non-linear cumulative target pacing schedule representing true month-long business dynamics:

| Day of Month | Expected Cumulative Pace % | Day of Month | Expected Cumulative Pace % |
|:---:|:---:|:---:|:---:|
| **Day 1** | 5% | **Day 16** | **46%** *(Mid-Month Benchmark)* |
| **Day 2** | 10% | **Day 17** | 49% |
| **Day 3** | 11% | **Day 18** | 50% |
| **Day 4** | 12% | **Day 19** | 51% |
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

#### Visual Pacing System Implementation:
1. **Full-Width Pacing Ruler Header (5% to 103%):**
   * Positioned directly above the teams progress chart in the Executive Overview tab.
   * Spans the full horizontal track width from Day 1 (5%) up to Day 30 (103%), providing a clear visual scale of cumulative monthly milestone targets.
   * Milestone notches marked along the ruler: `D1 (5%)`, `D5 (14%)`, `D10 (29%)`, `D14 (40%)`, `D15 (43%)`, `D16 (46%)`, `D20 (54%)`, `D25 (65%)`, `D27 (80%)`, `D28 (87%)`, `D29 (94%)`, `100% Target`, and `D30 (103% Goal)`.

2. **Floating Today Indicator Pin:**
   * An illuminated cyan badge positioned above today's milestone mark (`Day 16: 46%`) showing expected sector cash revenue ($103,776).
   * Features a downward caret directly pointing to the vertical benchmark axis.

3. **Continuous Vertical Benchmark Guideline:**
   * A luminous cyan dashed vertical line drops down continuously from the Day 16 pin on the ruler through all progress bar tracks.
   * Mathematically aligned to sub-pixel precision across every row via:
     $$\text{Track Position} = \text{calc}\left(20\text{px} + (100\% - 40\text{px}) \times \frac{46}{103}\right)$$
   * Instantly highlights teams ahead of target pace (Team 30 at 82.9%, Team 13 at 47.6%) vs. teams lagging behind pace (Team 05, Team 10, Team 01).

4. **Big Team 01 Sector Master Row (Row #0):**
   * Placed immediately beneath the ruler on the identical 103% scale to compare overall sector revenue velocity ($85,418 / $225,600, 37.9%) against the 46% target benchmark alongside the five small teams.

5. **Pacing Status Badges & Dollar Variance:**
   * Every team row and individual rep entry displays real-time pacing classification:
     * `🟢 Ahead of Pace` (Actual % $\ge$ Expected %)
     * `🟡 Within Pace` (Actual % within 8% of Expected %)
     * `🔴 Behind Pace` (Actual % < Expected % - 8%)
   * Exact dollar variance (+Surplus / -Deficit) relative to today's benchmark cash quota is computed and displayed for every team and rep.
