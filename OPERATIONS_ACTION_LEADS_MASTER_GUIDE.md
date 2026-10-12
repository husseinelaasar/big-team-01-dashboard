# 51Talk Big Team 01 - Master Operations Action Leads System Guide
**Version:** 5.0 (Executive Edition)  
**Author:** Automated Operational Intelligence & Pair Programming Assistant  
**Target Audience:** Senior Manager (Saber Hussien), Team Leaders, and All Sales Representatives (EGSS)  
**Workbook Location:** `D:\Lens\Dashboard\Operations_Action_Leads_Master.xlsx`  
**Desktop Shortcut:** `C:\Users\husse\Desktop\Operations_Action_Leads_Master.xlsx`  

---

## 1. Executive Summary & Purpose

The **Master Operations Action Leads System** is a closed-loop, automated lead tracking and execution platform designed exclusively for **51Talk Big Team 01**. It eliminates manual lead assignments, synchronizes customer states across all source reports (SOP Tasks, Student-Detail records, and SS Lens Dashboards), and enforces operational discipline through:

1. **Deduplicated Multi-Source Lead Pipeline:** 1,779 unique actionable student leads compiled and prioritized into 5 distinct operational tiers.
2. **Dedicated Individual Subsheets:** 22 individual representative tabs grouped by Small Team (Team 01, Team 05, Team 10, Team 13, Team 30).
3. **Native Interactive Checkboxes:** Real mouse-clickable Excel 365 checkboxes in Column J that toggle checkmarks on click.
4. **Rep Feedback & Call Logging:** Dedicated Column K (`Rep Feedback`) allowing representatives to record parent responses, call notes, and next actions.
5. **Dynamic Executive Performance Monitor:** Real-time summary dashboard in `Completed_Archive` with interactive **Expand/Collapse Outlining (`[+]` / `[-]`)** for inspecting individual tier breakdowns per representative.
6. **Zero-Loss Permanent Archiving:** Automated rollover engine that harvests completed leads into the archive, records timestamps, and keeps active subsheets clean and agile.
7. **One-Click Automated Broadcasting:** Full daily cycle execution with executive card broadcasts and direct Excel workbook delivery to DingTalk groups.

---

## 2. Workbook Architecture (24 Sheets)

The workbook is structured into three functional tiers:

### Tier 1: Master Overview (`All_Team_Master`)
* Contains all **1,779 active actionable leads** for all 22 representatives.
* Used by the Senior Manager and Operations Specialists to view team-wide distribution and run ad-hoc filters.
* Styled in Obsidian Dark Slate (`#0F172A`) with freeze panes locked at cell `E6`.

### Tier 2: 22 Representative Operational Subsheets
Each sales representative possesses their own dedicated tab named in the format:  
`[Team Name] - [Rep Username]` (e.g. `Team 01 - ashraqatal`, `Team 05 - ehabzaky01`).

| Team | Small Team Color Theme | Assigned Representatives |
| :--- | :--- | :--- |
| **Team 01** | Modern Electric Indigo (`#4F46E5`) | `ashraqatal`, `hussienmo`, `juliamonir01`, `mahmoud04`, `negma`, `nohayoussry` |
| **Team 05** | Modern Emerald Green (`#059669`) | `abdelrahmannasef`, `ehabzaky01`, `ibrahimismaiel`, `khaledgonam`, `omarmoneb`, `samira01` |
| **Team 10** | Modern Royal Violet (`#7C3AED`) | `abdelrhmanshehata`, `ahmedshoukry`, `mahmoudkhamis` |
| **Team 13** | Modern Warm Amber (`#D97706`) | `amrsafwat`, `hayamhassan`, `marwaahmed`, `mohamedha` |
| **Team 30** | Modern Arctic Cyan (`#0891B2`) | `adhmgadallah`, `alihesham01`, `titooooo` |

### Tier 3: Completed Archive & Executive Monitor (`Completed_Archive`)
* **Top Section (Rows 1–2):** Executive Title Banner and Grand KPI ribbon tracking team-wide completion in real time.
* **Middle Section (Rows 4–138):** Dynamic Performance Monitor Table featuring expandable accordion outlining per representative.
* **Bottom Section (Rows 141+):** Permanent historical archive of all harvested completed tasks and representative feedback.

---

## 3. Data Dictionary: The 13 Standardized Columns

Every operational sheet features 13 carefully proportioned, non-overlapping columns:

| Col | Header Name | Alignment | Min Width | Description & Usage |
| :---: | :--- | :---: | :---: | :--- |
| **A** | **Priority Tier** | Center | 16.0 | Operational priority (`P1: SOP R1`, `P2: Due Today`, `P3: Unfixed`, `P4: 0-Classes`, `P5: Outside 0pts`). |
| **B** | **Team** | Center | 12.0 | Team identifier (`Team 01`, `Team 05`, `Team 10`, `Team 13`, `Team 30`). |
| **C** | **Representative** | Left | 18.0 | Clean rep username (stripped of `EGSS-` prefix). |
| **D** | **Student ID** | Center | 15.0 | Unique 51Talk Student Identification Number. |
| **E** | **Pool Category** | Left | 18.0 | 100% English pool status (`Outside Pool`, `In-Contract`, `FOE Non-0`, `Exp Non-0`, `Upgrade M2`). |
| **F** | **Operational Action** | Left | 44.0 | Clear directive (e.g. `SOP: Awareness building`, `Fix Teacher: 0`, `0-Cons: Urge Booking`). |
| **G** | **Points** | Center | 11.0 | Customer wallet points balance. |
| **H** | **Consumption (This \| Last)** | Center | 30.0 | Explicit class consumption: `This: X \| Last: Y` (e.g. `This: 4 \| Last: 17`). |
| **I** | **Due / Pay Date & Time** | Center | 25.0 | Unified ISO Date & Time: `YYYY-MM-DD HH:mm` (e.g. `2026-10-12 18:55`). |
| **J** | **Status (Click Box)** | Center | 18.0 | **Interactive Clickable Checkbox** (Excel 365 Control). Toggles `True` (Checked) / `False` (Unchecked). |
| **K** | **Rep Feedback** | Left | 30.0 | **Representative notes area** for call outcomes, objection logging, and parent commitments. |
| **L** | **Renewals** | Center | 12.0 | Number of contract renewals previously completed. |
| **M** | **Coverage** | Center | 14.0 | Coverage classification (`Covered` vs `Uncovered`). |

---

## 4. Visual Ergonomics & Modern UI Design System

* **Typography:** Pure `Segoe UI` across all tables, headers, and KPI banners.
* **Spacing:** Header rows set to **28pt**; data rows set to **22pt** (ample breathing room).
* **Gridlines:** Standard harsh Excel gridlines are hidden (`DisplayGridlines = false`) and replaced by subtle borders (`#E2E8F0`).
* **Zebra Striping:** Alternating rows of Pure White (`#FFFFFF`) and Soft Slate 50 (`#F8FAFC`).
* **High-Contrast Urgency Rows:**
  * **Due Today:** Solid Crimson Red background (`#DC2626`) with bold pure white text.
  * **SOP Round 1:** Solid Radiant Warm Yellow background (`#FDE047`) with bold jet black text.
* **Window Settings:** Zoom locked at **85%** and Freeze Panes locked at **E6** across all sheets.

---

## 5. Dynamic Performance Monitor in `Completed_Archive`

### Overview of Outlining & Grouping
The monitor in `Completed_Archive` provides a unified view of all 22 representatives. Each representative row features native Excel **Outline Grouping (`[+]` / `[-]`)**:

1. **Collapsed State (Default):**  
   Only the **Representative Summary Row** is shown. It displays:
   * Representative Name & Team
   * Clickable Hyperlink to their tab (`Go to Team 01 - ashraqatal ->`)
   * Total Assigned Leads
   * Completed Tasks (Checked + Archived)
   * Pending Tasks
   * Completion Rate %
   * Real-time Performance Status Tag (`PENDING`, `IN PROGRESS`, `ON TRACK`, `COMPLETED`)

2. **Expanded State (`[+]` clicked):**  
   Clicking the `[+]` button on the left margin opens **5 sub-rows** directly under the representative:
   * `  [P1] SOP Round 1` (Awareness building / First call)
   * `  [P2] Due Today` (Urgent tasks expiring today)
   * `  [P3] Unfixed Teacher` (Fix teacher binding)
   * `  [P4] 0-Classes Urge` (Urge class booking)
   * `  [P5] Outside Pool 0pts` (Renewal urge)

3. **Master Level Buttons:**  
   At the top left of Excel:
   * Click `[1]` to collapse all 22 representatives into summary view.
   * Click `[2]` to expand all 22 representatives into full detail view.

---

## 6. Daily Automation Lifecycle & Execution Pipeline

The entire system is orchestrated through one-click automated pipelines:

```
[UPDATE_AND_SEND_LEADS.bat]
         │
         ▼
[run_master_daily_leads_cycle.ps1]
   ├── Step 1: run_daily_leads_rollover.ps1
   │     • Scans all rep subsheets for Checked [☑] boxes in Col J
   │     • Copies completed records + Col K Feedback to Completed_Archive (Row 144+)
   │     • Deletes completed rows from rep subsheets
   │
   ├── Step 2: compile_unified_master.ps1 & build_unified_master_excel_pro.ps1
   │     • Ingests latest files from Dashboard_Input_Files
   │     • Normalizes dates into YYYY-MM-DD HH:mm and consumption into This: X | Last: Y
   │     • Rebuilds Master and 22 Rep tabs with fresh active leads
   │     • Rebuilds Dynamic Performance Monitor in Completed_Archive
   │
   └── Step 3: send_daily_leads_dingtalk.js
         • Generates executive DingTalk Markdown KPI card
         • Uploads and attaches Operations_Action_Leads_Master.xlsx
         • Posts directly to Big Team Champs DingTalk Group
```

---

## 7. Standard Operating Procedure (SOP) for Sales Reps

1. Open your assigned subsheet tab in [Operations_Action_Leads_Master.xlsx](file:///D:/Lens/Dashboard/Operations_Action_Leads_Master.xlsx).
2. Prioritize calls starting from top to bottom:
   * **Red Rows (Due Today):** Must be called immediately before expiry.
   * **Yellow Rows (SOP Round 1):** First call awareness building.
   * **Unfixed Teacher & 0-Classes:** Book classes and fix regular teacher bindings.
3. Once a task is completed:
   * Click the checkbox in **Column J (Status)** to mark it `TRUE`.
   * Type the call outcome in **Column K (Rep Feedback)** (e.g. *"Called parent, agreed to renew 120 lessons on Thursday"*).
4. Save the workbook. Your completed task will automatically update the manager's real-time dashboard and be archived during the nightly rollover.
