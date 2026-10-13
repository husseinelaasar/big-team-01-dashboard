# -*- coding: utf-8 -*-
import os
import sys
import json
import subprocess
from datetime import datetime

# Enforce UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

# Receiver: Strictly Saber Hussien (Personal 1-on-1 Chat)
RECEIVER_OPEN_DINGTALK_ID = "DMmZ0gsytpviSWm51piSq3GstTd6V9Voffs"

# Resolve Paths
json_candidates = [
    r"D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\unified_master_records.json",
    r"D:\Lens\Dashboard\scratch\unified_master_records.json"
]
json_path = next((p for p in json_candidates if os.path.exists(p)), json_candidates[0])

excel_candidates = [
    r"D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\October Daily Tasks.xlsx",
    r"D:\Lens\Dashboard\October Daily Tasks.xlsx",
    r"C:\Users\husse\Desktop\October Daily Tasks.xlsx",
    r"D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\Operations_Action_Leads_Master.xlsx",
    r"D:\Lens\Dashboard\Operations_Action_Leads_Master.xlsx"
]
excel_path = next((p for p in excel_candidates if os.path.exists(p)), excel_candidates[0])

# Resolve direct Node and dws.js to bypass Windows CMD batch file newline truncation
node_candidates = [
    r"C:\Program Files\nodejs\node.exe",
    r"C:\Program Files (x86)\nodejs\node.exe",
    "node"
]
node_bin = next((p for p in node_candidates if os.path.exists(p)), "node")

dws_js = r"C:\Users\husse\AppData\Roaming\npm\node_modules\dingtalk-workspace-cli\bin\dws.js"
dws_cmd = r"C:\Users\husse\AppData\Roaming\npm\dws.cmd"

if os.path.exists(node_bin) and os.path.exists(dws_js):
    runner_cmd = [node_bin, dws_js]
elif os.path.exists(dws_cmd):
    runner_cmd = [dws_cmd]
else:
    runner_cmd = ["dws"]

print("==========================================================", flush=True)
print(" 51Talk Big Team 01 - Hourly Employee Progress Monitor", flush=True)
print(f" Target Recipient: Saber Hussien (EGSS-Hussienmo)", flush=True)
print("==========================================================", flush=True)

# Standard Teams Definition
teams = ["Team 01", "Team 05", "Team 10", "Team 13", "Team 30"]
rep_stats = {t: [] for t in teams}

# Method 1: Scan Excel (Completed_Archive and individual rep sheets)
excel_loaded = False
if excel_path and os.path.exists(excel_path):
    try:
        import openpyxl
        wb_live = openpyxl.load_workbook(excel_path, data_only=True)
        if "Completed_Archive" in wb_live.sheetnames:
            ws_arch = wb_live["Completed_Archive"]
            for r in range(6, 138):
                c1 = str(ws_arch.cell(row=r, column=1).value or "").strip()
                if c1.isdigit():
                    tm = str(ws_arch.cell(row=r, column=2).value or "").strip()
                    rep = str(ws_arch.cell(row=r, column=3).value or "").strip()
                    tot_v = ws_arch.cell(row=r, column=5).value or 0
                    cov_v = ws_arch.cell(row=r, column=6).value or 0
                    tot = int(tot_v) if isinstance(tot_v, (int, float)) else 0
                    cov = int(cov_v) if isinstance(cov_v, (int, float)) else 0
                    
                    # Direct check on rep sheet in case openpyxl hasn't recalculated formulas
                    sname = f"{tm} - {rep}"
                    if sname in wb_live.sheetnames:
                        ws_rep = wb_live[sname]
                        sh_tot = 0
                        sh_cov = 0
                        for row_idx in range(6, ws_rep.max_row + 1):
                            tier_v = str(ws_rep.cell(row=row_idx, column=1).value or "").strip()
                            if tier_v:
                                sh_tot += 1
                                val_j = str(ws_rep.cell(row=row_idx, column=10).value or "").strip().lower()
                                if val_j.startswith("done") or val_j.startswith("no answer") or val_j == "true":
                                    sh_cov += 1
                        tot = max(tot, sh_tot)
                        cov = max(cov, sh_cov)
                    
                    pct = round((cov / tot) * 100, 1) if tot > 0 else 0.0
                    if tm in rep_stats:
                        rep_stats[tm].append({
                            "rep": rep,
                            "total": tot,
                            "completed": cov,
                            "pct": pct
                        })
            excel_loaded = True
            print(f"[OK] Successfully loaded rep metrics from Excel: {excel_path}", flush=True)
    except Exception as e:
        print(f"[WARN] Error reading Excel ({excel_path}): {e}", flush=True)

# Method 2: Fallback to unified_master_records.json if Excel not loaded
if not excel_loaded and os.path.exists(json_path):
    try:
        with open(json_path, 'r', encoding='utf-8-sig') as f:
            records = json.load(f)
        rep_map = {}
        for r in records:
            tm = r.get("Team", "Team 01")
            ag = r.get("Agent", "")
            if not ag:
                continue
            if ag not in rep_map:
                rep_map[ag] = {"team": tm, "total": 0, "completed": 0}
            rep_map[ag]["total"] += 1
            st = str(r.get("Status", "")).strip().lower()
            if st.startswith("done") or st.startswith("no answer") or st == "true":
                rep_map[ag]["completed"] += 1
        
        for ag, d in rep_map.items():
            tm = d["team"]
            pct = round((d["completed"] / d["total"]) * 100, 1) if d["total"] > 0 else 0.0
            if tm in rep_stats:
                rep_stats[tm].append({
                    "rep": ag,
                    "total": d["total"],
                    "completed": d["completed"],
                    "pct": pct
                })
        print(f"[OK] Successfully loaded rep metrics from JSON: {json_path}", flush=True)
    except Exception as e:
        print(f"[ERROR] Error reading JSON: {e}", flush=True)
        sys.exit(1)

current_time_str = datetime.now().strftime("%Y-%m-%d %H:%M")

team_blocks = []
for tm in teams:
    reps_list = rep_stats.get(tm, [])
    if reps_list:
        lines = [f"👥 {tm}:"]
        for item in reps_list:
            pct_val = item['pct']
            pct_str = f"{int(pct_val)}%" if pct_val.is_integer() else f"{pct_val}%"
            lines.append(f"• {item['rep']}: {pct_str} ({item['completed']}/{item['total']})")
        team_blocks.append("\n".join(lines))

progress_body = "\n\n".join(team_blocks)

raw_report = f"""⏱️ نسبة التطور لكل موظف - Big Team 01
📅 التوقيت: {current_time_str}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
{progress_body}
━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

# Sanitize any hidden zero-width unicode characters that trigger DingTalk CLI security validator
full_text_report = raw_report.replace('\u200d', '').replace('\u200c', '').replace('\u200b', '').replace('\ufeff', '')

print("\n--- Previewing Generated Hourly Report ---", flush=True)
print(full_text_report, flush=True)
print("------------------------------------------\n", flush=True)

print("Broadcasting Hourly Progress Report to Saber Hussien...", flush=True)
try:
    cmd = runner_cmd + [
        "chat", "+messages-send",
        "--as", "user",
        "--open-dingtalk-id", RECEIVER_OPEN_DINGTALK_ID,
        "--text", full_text_report,
        "--ai-tag=false",
        "-y"
    ]
    res = subprocess.run(cmd, input="y\n", capture_output=True, text=True, encoding='utf-8')
    if res.returncode == 0:
        print("[SUCCESS] Hourly progress report delivered to Saber Hussien successfully!", flush=True)
    else:
        print(f"[STATUS] ReturnCode: {res.returncode}", flush=True)
        if res.stdout:
            print(f"[STDOUT] {res.stdout.strip()}", flush=True)
        if res.stderr:
            print(f"[STDERR] {res.stderr.strip()}", flush=True)
except Exception as e:
    print(f"[ERROR] Exception: {e}", flush=True)

print("==========================================================", flush=True)
