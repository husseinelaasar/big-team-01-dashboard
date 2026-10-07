# 🏆 51Talk Operations & Sales Executive Dashboard
## Complete Turn-Key Setup & Deployment Guide for Managers

> **Audience**: 51Talk Senior Managers, Area Managers & Team Leaders  
> **Purpose**: Deploy an automated, executive-grade web dashboard & actionable lead-distribution system for your Big Team with zero server costs.  
> **Platform**: 100% Client-Side Web Application (Runs offline in Chrome/Edge or 24/7 on free GitHub Pages).

---

## 🎯 1. What This Dashboard Provides for Your Team

Once set up, your management portal automatically calculates and visualizes:
1. **Executive Revenue & Contracts Cockpit**:
   - Real-time Net Cash Revenue, Gross Billing, and Active Refunds.
   - Dynamic pacing vs official Corporate Benchmark (Day 1 to 31 BM curve).
   - Remaining cash gap required to achieve **Today's BM Target** and **Month-End Target**.
2. **Small Team Leaderboards**:
   - Team ranking strictly by **Cash % Achievement**.
   - Team leader quotas, member counts, and color-coded visual identity.
3. **Individual Sales Specialists (SS) Roster**:
   - Exact performance per rep: Net Cash, Contracts, Target %, Upgrades closed, and Status Badges.
   - Small Team Protection: Leaver refunds charged only to Sector Total, protecting reps' small team quotas.
4. **Four Core Operational Pillars**:
   - **Class Consumption (65% Goal)**: Active students, ended classes, and 0-class rescue priority accounts.
   - **Early Upgrade Hub (20% Goal)**: M1 & M2 allocated student pool, actual upgrades closed, conversion %, and touch intensity.
   - **English Club (45% Attendance Goal)**: Booked sessions vs attended.
   - **SOP Compliance**: Pending customer service tasks (Rounds 1–6, absence warnings).
5. **Actionable Rep Lead Generation (One-Click CSVs)**:
   - Automatically generates personalized `.csv` action lists for **every single Sales Specialist**.
   - Generates dedicated **Upgrade Base Lead Sheets** so reps can download their exact student IDs and upgrade status with 1 click!

---

## 📥 2. The 4 Daily Input Files (Standard 51Talk Exports)

You only need to download 4 standard files from **lp.51talkjr.com** (Data Center) and **crm.51talk.com**:

| # | File Type | Standard Export File Name | What the Dashboard Extracts |
| :-: | :--- | :--- | :--- |
| **1** | **SS Cash & Orders** | `SS Lens Dashboard_Area_Big Team_Small Team_SS_*.xlsx` | Rep cash, refunds, net cash, contracts, team totals. |
| **2** | **Upgrade Base (M1 & M2)** | `M1 & M2 Data Base ID.xlsx` *(or SCRM export)* | Student IDs, assigned SS rep, team, and M-2 upgrade flags. |
| **3** | **SOP Compliance** | `海外NEW_SOP_*.xlsx` *(or All in one Master)* | Round 1 to 6 pending SOP tasks, student contact deadlines. |
| **4** | **English Club** | `中东English Club数据看板_*.xlsx` | Student attendance, booked sessions, attendance %. |

> 💡 **Convenient Setup**: Save all downloaded files into a folder named `Dashboard_Input_Files` inside your dashboard directory.

---

## ⚙️ 3. Quick Customization: How to Configure It for Your Team (10 Minutes)

You only need to configure your team information in **2 files**:

### Step A: Configure Your Active Reps & Targets in `update_dashboard.ps1`
Open `update_dashboard.ps1` in Notepad or VS Code and update your roster:

```powershell
# 1. Define Your Small Teams & Active Representatives Roster
$activeReps = @(
    # Small Team 01
    @{ name = "EGSS-rep1"; team = "EGSS01" },
    @{ name = "EGSS-rep2"; team = "EGSS01" },
    @{ name = "EGSS-rep3"; team = "EGSS01" },

    # Small Team 02
    @{ name = "EGSS-rep4"; team = "EGSS02" },
    @{ name = "EGSS-rep5"; team = "EGSS02" }
    # Add all your active reps here...
)

# 2. Set Fallback Cash Targets for Each Rep (in USD)
$fallbackTargets = @{
    "egss-rep1" = 20000;
    "egss-rep2" = 18000;
    "egss-rep3" = 12000;
    "egss-rep4" = 18000;
    "egss-rep5" = 12000;
}

# 3. (Optional) Set Upgrade Base Leads Allocation per Rep
$officialUpgradeBaseMap = @{
    "egss-rep1" = 30;
    "egss-rep2" = 25;
    "egss-rep3" = 20;
}
```

---

### Step B: Configure Manager Name & Team Visuals in `dashboard.js`
Open `dashboard.js` and edit the top configuration section:

```javascript
// 1. Your Team Leadership & Unified Color Configuration
const TL_MAPPING = {
  "EGSS01": { 
    tl: "EGSS-rep1", 
    leaderName: "Leader One", 
    fullName: "ME-EGSS01 (Leader One)", 
    color: "#6366f1", // Indigo
    badgeClass: "team-badge-01" 
  },
  "EGSS02": { 
    tl: "EGSS-rep4", 
    leaderName: "Leader Two", 
    fullName: "ME-EGSS02 (Leader Two)", 
    color: "#06b6d4", // Cyan
    badgeClass: "team-badge-02" 
  }
};

// 2. Set Monthly Contracts Targets
const NEW_CONTRACTS_TARGETS = {
  "EGSS-rep1": 15,
  "EGSS-rep2": 12,
  "EGSS-rep3": 10,
  "EGSS-rep4": 12,
  "EGSS-rep5": 10
};
```

And in `index.html`:
* Search for `Senior Manager:` and replace with your name:
  ```html
  Senior Manager: <strong>Your Name</strong> | Month: <strong>October 2026</strong>
  ```
* Search for `Big Team 01` and change to your sector (e.g., `Big Team 02`).

---

## ⚡ 4. How to Run the Update (Daily 30-Second Routine)

Once customized, your daily update takes literally **1 click**:

1. **Download** your fresh daily reports from CRM / Data Center.
2. **Move/Paste** them into `Dashboard_Input_Files` (or keep them in your `Downloads` folder).
3. **Double-Click** `UPDATE.bat` (or execute in PowerShell):
   ```powershell
   powershell -ExecutionPolicy Bypass -File update_dashboard.ps1
   ```
4. **Done!** The script finishes in **~2 seconds**:
   - Extracts all sales, cash, refunds, and contracts.
   - Ingests all upgrade student records and M2 achievements.
   - Calculates 65% consumption, 45% English Club, and SOP tasks.
   - Generates individual `.csv` actionable lead sheets for every rep in `leads/`.
   - Generates individual Upgrade Base sheets in `leads/upgrade_base/`.
   - Auto-commits and deploys to **GitHub Pages** (if Git is installed), or updates your local HTML page!

---

## 🌐 5. Free 24/7 Cloud Hosting via GitHub Pages (Optional but Recommended)

To let all your team leaders and reps view the dashboard on their phones and laptops anytime:
1. Create a free account at [github.com](https://github.com).
2. Create a new repository named `big-team-dashboard` (make it Public or Private).
3. Push your dashboard folder to GitHub:
   ```bash
   git init
   git remote add origin https://github.com/<your-username>/big-team-dashboard.git
   git add .
   git commit -m "Initial commit"
   git push -u origin master
   ```
4. Go to **Settings** $\rightarrow$ **Pages** $\rightarrow$ Under **Branch**, select `master` and click **Save**.
5. Your dashboard will be live at:
   `https://<your-username>.github.io/big-team-dashboard/`

### 🔗 Deep-Linking Feature:
You can share direct links to specific pages with your team:
* Early Upgrade Hub: `https://<your-url>/#upgrade`
* Class Consumption Hub: `https://<your-url>/#consumption`
* Individual Reps Leaderboard: `https://<your-url>/#individuals`
* Small Teams Overview: `https://<your-url>/#teams`

---

## 📁 6. Standard Folder Structure

```
Dashboard/
├── index.html                       # Master Dashboard single-page application
├── dashboard.js                     # Core application intelligence engine
├── styles.css                       # Responsive dark-mode glassmorphism design system
├── update_dashboard.ps1             # 1-click update engine (PowerShell)
├── UPDATE.bat                       # Double-click launcher
├── Dashboard_Input_Files/           # Place your 4 daily Excel files here
├── attachments/                     # Master multi-sheet workbooks for management download
│   └── M1 & M2 Data Base ID.xlsx    # Master Upgrade Base Excel
├── leads/                           # Individual & Team Lead CSVs
│   ├── BIG_TEAM_Team_Leads.csv      # Consolidated sector lead tasks
│   ├── ME-EGSS*_Team_Leads.csv      # Team lead tasks
│   ├── EGSS-*.csv                   # Individual rep action tasks
│   └── upgrade_base/                # Official Upgrade Base Download Hub
│       ├── M1_M2_Upgrade_Base_Master.csv
│       ├── ME-EGSS*_Upgrade_Base.csv
│       └── EGSS-*_Upgrade_Base.csv  # Individual rep upgrade base sheets
├── OCTOBER_BM_PACE.md               # 31-day Benchmark pacing curve
├── OCTOBER_2026_TARGETS_AND_QUOTAS.md # Targets, BM gaps, and pacing analysis
└── README.md                        # Project architecture manual
```

---

## 💡 7. Best Practice Advice for New Managers

1. **Morning Briefing Directives**:
   - Check the **Top Executive KPI Bar**: immediately see how much cash is remaining to hit today's BM target.
   - Check the **Upgrade Hub**: see which reps have 0 conversions and share their student pool CSV with them.
2. **Protect Small Teams**:
   - Keep the leaver refunds charged to Sector Total so that team leader morale remains high.
3. **Empower Reps**:
   - Share the direct link `/#upgrade` in your team chat. Every rep can select their name from the dropdown and download their assigned student leads in CSV format to start calling immediately.

---
*Created for 51Talk Management Excellence — October 2026.*
