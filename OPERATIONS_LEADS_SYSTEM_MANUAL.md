# 51Talk Big Team 01 - Master Daily Operations Leads System Manual
**Senior Manager:** Saber Hussien (`EGSS-Hussienmo`)  
**Scope:** Big Team 01 Exclusive (5 Small Teams | 22 SS Representatives)  
**Effective Date:** October 2026 (Live Cycle Active)  
**Official Workbook Name:** `October Daily Tasks.xlsx`

---

## 1. System Architecture & Master Locations

| Component | Path / Location | Purpose |
|:---|:---|:---|
| **Master Input Folder** | `D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker` | Official input folder where all daily QuickBI & Lens files are placed |
| **Master Output Workbook** | `D:\Lens\Dashboard\October Daily Tasks.xlsx` | 24-tab executive workbook (22 Reps + All Team + Completed Archive) |
| **Master Folder Mirror** | `D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\October Daily Tasks.xlsx` | Permanent mirrored archive inside October Daily Tracker |
| **Desktop Workbook Mirror** | `C:\Users\husse\Desktop\October Daily Tasks.xlsx` | 1-Click access on Senior Manager desktop |
| **Desktop Daily Launcher** | `C:\Users\husse\Desktop\Run Master\UPDATE_AND_SEND_LEADS.bat` | 1-Click launcher running the full daily rollover & broadcast cycle |
| **Desktop Hourly Launcher** | `C:\Users\husse\Desktop\Run Master\CHECK_HOURLY_PROGRESS.bat` | Instant manual trigger for private hourly progress report |
| **Windows Scheduled Task** | `51Talk_Hourly_Progress` (Hourly / Repeat 1 Hour) | Background automated task pushing hourly updates to Saber Hussien |
| **Online DingTalk Sheet** | [👉 Open Alidocs Sheet](https://alidocs.dingtalk.com/i/nodes/dxXB52LJqnjXBmGdiZ7rdGZD8qjMp697) | Synchronized online spreadsheet with interactive status dropdowns |
| **DingTalk Team Group** | Group: `Big Team Champs - Mega` (`cidx9ITXJyqktd2CvhI8op0Ig==`) | Official broadcast group for all 22 SS reps + leaders + manager |
| **Private Executive Stream** | User: `EGSS-Hussienmo` (`DMmZ0gsytpviSWm51piSq3GstTd6V9Voffs`) | Private hourly progress updates sent exclusively to Saber Hussien |

---

## 2. Business Rules & Lead Tiers

```mermaid
graph TD
    A["Raw Input Files (October Daily Tracker)"] --> B{"Big Team 01 Filter"}
    B -->|Ignore| X["Outside Teams / Other SS Reps"]
    B -->|Retain| C["22 Active Big Team 01 SS Reps"]
    C --> D{"Priority Tier Allocation"}
    D --> E["P1: SOP Round 1 (Urgent First Call)"]
    D --> F["P2: Due Today Tasks (Expiring Today)"]
    D --> G["P3: Unfixed Teachers (M0, M1, M2 ONLY)"]
    D --> H["P4: 0-Class Consumption (M0, M1, M2 ONLY)"]
    D --> I["P5: Outside Pool 0-Pts (Recovery)"]
```

### Strict Cohort Ingestion Rules
1. **Unfixed Teachers (P3):** Strictly restricted to cohorts **`M0`**, **`M1`**, and **`M2`**. All older `M3+` unfixed leads are explicitly excluded to keep reps laser-focused on active students.
2. **0-Class Consumption (P4):** Strictly restricted to cohorts **`M0`**, **`M1`**, and **`M2`**:
   * **`M0` Students:** New joiners enrolled in October with 0 classes consumed this month (`This month Class consumption = 0`). Total: **36 leads**.
   * **`M1` Students:** Total: **20 leads**.
   * **`M2` Students:** Total: **48 leads**.
   * **Combined Zero-Class Total:** Exactly **104 leads** across Big Team 01.
3. **Big Team 01 SS Rep Roster (22 Agents across 5 Small Teams):**
   * **Team 01 (6 reps):** `ashraqatal`, `hussienmo`, `juliamonir01`, `mahmoud04`, `negma`, `nohayoussry`
   * **Team 05 (6 reps):** `abdelrahmannasef`, `ehabzaky01`, `ibrahimismaiel`, `khaledgonam`, `omarmoneb`, `samira01`
   * **Team 10 (3 reps):** `abdelrhmanshehata`, `ahmedshoukry`, `mahmoudkhamis`
   * **Team 13 (4 reps):** `amrsafwat`, `hayamhassan`, `marwaahmed`, `mohamedha`
   * **Team 30 (3 reps):** `adhmgadallah`, `alihesham01`, `titooooo`

---

## 3. Interactive Column J Status (DingTalk & Excel)

* **No More `FALSE` text:** Column J defaults to **`Pending`** with an amber/orange tag (`#faad14`).
* **1-Click Completion:** Reps tap the cell on DingTalk web or mobile and select **`Done ✓`** (vibrant green `#52c41a`).
* **Automated Rollover:** The morning rollover engine (`run_daily_leads_rollover.ps1`) automatically scans for `Done ✓` / `Done` / `[x]`, archives them to `Completed_Archive`, and keeps pending tasks active.
* **Pure English & Screen Fitting:**
  * 100% Zero Chinese text across all headers, dropdown options, and action labels.
  * Columns A:M compressed to 157.5 width units at 75% zoom, ensuring complete on-screen visibility without horizontal scrolling.

---

## 4. Daily Automated Execution Cycle

```mermaid
sequenceDiagram
    autonumber
    actor SM as Saber Hussien
    participant BAT as UPDATE_AND_SEND_LEADS.bat
    participant ROLL as run_daily_leads_rollover.ps1
    participant COMP as compile_unified_master.ps1
    participant BUILD as build_unified_master_excel_pro.ps1
    participant SYNC as sync_online_leads_sheet.ps1
    participant SEND as send_daily_leads_dingtalk.py

    SM->>BAT: Double Click BAT on Desktop
    BAT->>ROLL: Step 1: Harvest & Archive Completed Tasks
    ROLL-->>BAT: Completed Tasks Archived
    BAT->>COMP: Step 2: Ingest Fresh October Tracker Files
    COMP-->>BAT: 535 Clean Filtered Leads Compiled
    BAT->>BUILD: Step 3: Rebuild 24-Tab Excel (October Daily Tasks.xlsx)
    BUILD-->>BAT: Master Excel Saved & Mirrored
    BAT->>SYNC: Step 4: Import to DingTalk & Set Native Dropdowns
    SYNC-->>BAT: Online Sheet Updated (No FALSE text)
    BAT->>SEND: Step 5: Broadcast to Big Team Champs Mega Group
    SEND-->>SM: Summary Card & October Daily Tasks.xlsx Delivered
```

---

## 5. Private Hourly Progress Monitor (`EGSS-Hussienmo`)

* **Engine Script:** `D:\Lens\Dashboard\send_hourly_progress_dingtalk.py`
* **Direct Desktop Trigger:** `C:\Users\husse\Desktop\Run Master\CHECK_HOURLY_PROGRESS.bat`
* **Windows Task Scheduler:** `51Talk_Hourly_Progress` (runs hourly in background)
* **Recipient:** Strictly 1-on-1 private chat to Saber Hussien (`DMmZ0gsytpviSWm51piSq3GstTd6V9Voffs`).
* **Delivered Content:**
  * Executive KPIs: Total target leads (`535`), archived & completed leads (`137`), pending (`398`), completion rate (`25.6%`).
  * Team-by-team breakdown: Teams 01, 05, 10, 13, 30.
  * Operational priority breakdown: P1 (19), P2 (155), P3 (165), P4 (104), P5 (151).
  * Direct clickable link to the live online sheet.

---

## 6. Technical Protocols & Bug Resolution History

### A. Title-Only Display Bug Resolution (Full Report Visibility)
* **Root Cause 1 (CMD Batch Newline Truncation):** Invoking `dws.cmd` directly caused Windows Command Prompt to treat newline characters (`\n`) as command terminators, dropping all lines after line 1.  
  * **Fix:** Direct execution via `node.exe` and `dws.js` (`C:\Program Files\nodejs\node.exe` + `dingtalk-workspace-cli/bin/dws.js`).
* **Root Cause 2 (AI Card Badge Truncation):** Default `--ai-tag=true` forced DingTalk to render messages as collapsed AI cards displaying only the title badge.  
  * **Fix:** Explicitly passing `--ai-tag=false` and `--text` to deliver fully expanded native text bubbles.
* **Root Cause 3 (Unicode Security Rejection `code 3`):** Compound emojis (e.g. `👨‍🏫`) contained hidden Zero-Width Joiner (`U+200D`) characters that triggered DingTalk's security validator (`content contains dangerous Unicode characters`).  
  * **Fix:** Sanitizing all zero-width characters (`\u200d`, `\u200c`, `\u200b`, `\ufeff`) prior to transmission.

### B. Official Workbook Naming Standard
* **Approved Name:** **`October Daily Tasks.xlsx`**
* **Active Locations:**
  1. `D:\Lens\Dashboard\October Daily Tasks.xlsx`
  2. `D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\October Daily Tasks.xlsx`
  3. `C:\Users\husse\Desktop\October Daily Tasks.xlsx`
* **Broadcast Target:** `Big Team Champs - Mega` (`cidx9ITXJyqktd2CvhI8op0Ig==`).

### D. Drive In-Place File Formula Synchronization (`October Daily Tasks.xlsx`)
* **Incident Analysis:**
  * When employees (such as `juliamonir01`) marked tasks as `"Done"` and added notes in their individual subsheets, the summary monitor `Completed_Archive` continued showing `0` Completed and `0` Pending.
  * **Root Cause 1 (Data Type Mismatch):** The workbook formulas in `Completed_Archive` checked for boolean `TRUE` (`COUNTIFS(..., TRUE)`), whereas reps entered or selected the text value `"Done"`. In Excel, `COUNTIFS(..., TRUE)` ignores string values.
  * **Root Cause 2 (Pending Calculation):** Pending tasks checked for boolean `FALSE` (`COUNTIFS(..., FALSE)`), returning `0` instead of calculating `=E - F` (`Total Assigned - Completed Tasks`).
  * **Root Cause 3 (Drive File vs. Alidocs Node):** The file shared with the team was a DingTalk Drive `.xlsx` file (`7dx2rn0JbYKPbR97sNa40jbqVMGjLRb3`). Previous formula patches had targeted the online sheet node rather than the active shared Drive file.
* **Resolution Without Resending Any New File:**
  1. Downloaded the active live file from DingTalk Drive (`node: 7dx2rn0JbYKPbR97sNa40jbqVMGjLRb3`) preserving all employee updates (such as Julia's 10 completed leads and 6 feedbacks, Ashraqat's 20, Mahmoud's 14, etc.).
  2. Injected robust formulas into `Completed_Archive`:
     * Child Completed: `=(COUNTIFS('...'!A$start:A$end, "$tier", '...'!J$start:J$end, "Done*") + COUNTIFS('...'!A$start:A$end, "$tier", '...'!J$start:J$end, TRUE))`
     * Child & Parent Pending: `=E - F`
     * Parent Completed: `=SUM(F$childStart:F$childEnd) + COUNTIF($C$144:$C$10000, C$pRow)`
     * Grand Total (Row 138): `=SUM(...)` of parent rows
     * Banner Ribbon (Row 2): Evaluates to `TOTAL ASSIGNED: 535 | COMPLETED: 85 | PENDING: 450 | BIG TEAM COMPLETION RATE: 15.9%`
  3. Performed full native Excel COM compilation (`CalculateFullRebuild()`) so all cached display values and formulas are 100% synchronized.
  4. Uploaded the repaired workbook directly back to the SAME DingTalk Drive node (`7dx2rn0JbYKPbR97sNa40jbqVMGjLRb3`) with zero new group messages and zero disruption to the team link.

### E. Multi-Status Workflow & Backlog Rollover Architecture (`Done`, `Pending`, `No Answer`)
* **3-Option Status Dropdown & Distinct Color Coding (Column J):**
  1. **`Done`** (🟢 Green): Background `#D1E7DD` / Text `#0F5132` — task completed and fully settled.
  2. **`Pending`** (🟡 Amber): Background `#FFF3CD` / Text `#856404` — task pending action.
  3. **`No Answer`** (🔵 Sky Blue): Background `#CFE2FF` / Text `#084298` — customer attempted but did not answer.
* **Accumulated Backlog Tracking (Column 14 / Col N):**
  * Added **`Backlog Status`** to every rep subsheet:
    * `Fresh Lead (Day 1)` for new daily leads.
    * `Carried Over (No Answer)` for leads rolled over from unanswering clients.
    * `Carried Over (Pending)` for unhandled leads carried over from previous cycles.
* **Day 2 Rollover Engine Rule (`run_daily_leads_rollover.ps1`):**
  * `Done` leads are harvested and permanently archived in `Completed_Archive`.
  * `No Answer` AND `Pending` leads automatically roll over to Day 2's active action plan, their `Backlog Status` is marked as carried over, and Column J is reset to `Pending` so reps re-engage them.
* **Executive Performance Tracking (`Completed_Archive`):**
  * **Operational Coverage:** Reps are fully credited for coverage: `Covered Tasks = Done + No Answer`.
  * **Dedicated Breakdown:** Column 7 explicitly reports the exact count of `No Answer Tasks`.
  * **Pending Deduction:** `Pending Tasks = Total Assigned - Covered Tasks`.
  * **Dynamic Ribbon Banner:** Displays `TOTAL ASSIGNED | COVERED (DONE | NO ANSWER) | PENDING | BIG TEAM COVERAGE RATE`.

### F. Day 2 Rollover Execution & Audit (October 13, 2026)
* **Day 1 Final Harvest Summary:**
  * Total Assigned Leads (Day 1): `535`
  * Fully Completed (`Done`): `273` leads (archived with `252` feedback notes and audit timestamps).
  * `No Answer`: `81` leads (carried over to Day 2).
  * `Pending`: `181` leads (carried over to Day 2).
* **Day 2 Live Active Plan Composition:**
  * Historical Harvest: `273` completed records permanently stored in `Completed_Archive` (Rows 144 to 416).
  * Carried Over Backlog: `262` leads (`81 No Answer` + `181 Pending`) labeled with `Carried Over (No Answer - Day 1)` and `Carried Over (Pending - Day 1)` in Column 14.
  * Brand New Fresh Leads: `200` unique leads ingested from October 13 files labeled `Fresh Lead (Day 2)`.
  * Total Day 2 Active Leads: **`462` leads** across Big Team 01 (Deduplicated against completed students).
  * Status Initialization: All Day 2 active rows initialized to `Pending` with interactive dropdowns and colors.
  * Cloud Overwrite: Overwritten in-place on DingTalk Drive node `7dx2rn0JbYKPbR97sNa40jbqVMGjLRb3` (`October Daily Tasks.xlsx`).




