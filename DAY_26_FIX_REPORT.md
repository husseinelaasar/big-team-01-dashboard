# Dashboard Fix Report — Day 26 (Sep 26, 2026)
**Commit:** d94bf43 | **Time:** 14:39 UTC+3

## Incident: All Cash Figures Zeroed on Live Dashboard

### Root Cause
The hourly updater (hourly_update_and_publish.ps1) ran auto_process_update.ps1 at 14:10:02.
It tried to read Individual_Rankings from SS Lens Dashboard_20260926_1237.xlsx — an ops-only
export that lacks this sheet. With no fallback or guard, all 5 teams and 25 reps were set to
cash: 0, then auto-committed to GitHub Pages.

### Fixes Applied
1. Restored verified OFFICIAL_TEAMS_DATA and REPS_DATA from commit 08d11e5
2. Dynamicized pacing ruler to follow daysPassed (Day 26: 68%)
3. Added multi-file fallback search + hard safety guard to both auto_process_update.ps1 and run_master_update.ps1
4. Updated index.html Day 21 -> Day 26

### Verification
- node --check dashboard.js passes
- Live deployment confirmed via HTTP fetch
- auto_process_update.ps1 test: correctly triggers SAFETY GUARD when sheet missing
