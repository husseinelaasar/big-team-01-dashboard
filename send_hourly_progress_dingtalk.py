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

online_url_file = r"D:\Lens\Dashboard\latest_online_sheet_url.txt"
online_url = "https://alidocs.dingtalk.com/i/nodes/dxXB52LJqnjXBmGdiZ7rdGZD8qjMp697"
if os.path.exists(online_url_file):
    try:
        with open(online_url_file, 'r', encoding='utf-8-sig') as f:
            u = f.read().strip()
            if u.startswith("http"):
                online_url = u
    except Exception:
        pass

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
print(" 51Talk Big Team 01 - Hourly Performance Monitor (Private Engine)", flush=True)
print(f" Target Recipient: Saber Hussien (EGSS-Hussienmo)", flush=True)
print("==========================================================", flush=True)

if not os.path.exists(json_path):
    print(f"[ERROR] Records JSON not found: {json_path}", flush=True)
    sys.exit(1)

with open(json_path, 'r', encoding='utf-8-sig') as f:
    records = json.load(f)

total_leads = len(records)
p1_count = sum(1 for r in records if "Round 1" in r.get("TierName", "") or "P1" in r.get("TierName", ""))
p2_count = sum(1 for r in records if "Due Today" in r.get("TierName", "") or "P2" in r.get("TierName", ""))
p3_count = sum(1 for r in records if "Unfixed" in r.get("TierName", "") or "P3" in r.get("TierName", ""))
p4_count = sum(1 for r in records if "0-Classes" in r.get("TierName", "") or "0-Cons" in r.get("Action", "") or "P4" in r.get("TierName", ""))
p5_count = sum(1 for r in records if "Outside" in r.get("TierName", "") or "P5" in r.get("TierName", ""))

# Teams definition
teams = ["Team 01", "Team 05", "Team 10", "Team 13", "Team 30"]
team_stats = {t: {"total": 0, "completed": 0, "pending": 0} for t in teams}

for r in records:
    tm = r.get("Team", "Team 01")
    if tm not in team_stats:
        team_stats[tm] = {"total": 0, "completed": 0, "pending": 0}
    team_stats[tm]["total"] += 1

# Scan for completed tasks (from Excel Completed_Archive)
excel_candidates = [
    r"D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\October Daily Tasks.xlsx",
    r"D:\Lens\Dashboard\October Daily Tasks.xlsx",
    r"C:\Users\husse\Desktop\October Daily Tasks.xlsx",
    r"D:\Lens\Dashboard\Dashboard_Input_Files\October Daily Tracker\Operations_Action_Leads_Master.xlsx",
    r"D:\Lens\Dashboard\Operations_Action_Leads_Master.xlsx"
]
excel_path = next((p for p in excel_candidates if os.path.exists(p)), excel_candidates[0])
if not os.path.exists(excel_path):
    excel_path = r"D:\Lens\Dashboard\Operations_Action_Leads_Master.xlsx"

total_completed = 0

total_no_answer = 0
total_covered = 0
total_done = 0

if os.path.exists(excel_path):
    try:
        import openpyxl
        wb_live = openpyxl.load_workbook(excel_path, data_only=True)
        if "Completed_Archive" in wb_live.sheetnames:
            ws_arch = wb_live["Completed_Archive"]
            # Row 138 Grand Total: Col 5 (Total), Col 6 (Covered), Col 7 (No Answer), Col 8 (Pending)
            val_cov = ws_arch.cell(row=138, column=6).value
            val_noans = ws_arch.cell(row=138, column=7).value
            if isinstance(val_cov, (int, float)):
                total_covered = int(val_cov)
            if isinstance(val_noans, (int, float)):
                total_no_answer = int(val_noans)
            total_done = max(0, total_covered - total_no_answer)
            total_completed = total_covered
            
            # Rep summary rows for small teams
            for r in range(6, 138):
                c1 = str(ws_arch.cell(row=r, column=1).value or "").strip()
                if c1.isdigit():
                    tm = str(ws_arch.cell(row=r, column=2).value or "").strip()
                    cov_r = ws_arch.cell(row=r, column=6).value or 0
                    if tm in team_stats:
                        team_stats[tm]["completed"] += int(cov_r) if isinstance(cov_r, (int, float)) else 0
    except Exception as e:
        print(f"[INFO] Archive inspect exception: {e}", flush=True)

# Calculate pending and rates
for tm in teams:
    team_stats[tm]["pending"] = team_stats[tm]["total"] - team_stats[tm]["completed"]

total_pending = max(0, total_leads - total_completed)
completion_rate = round((total_completed / total_leads) * 100, 1) if total_leads > 0 else 0.0
current_time_str = datetime.now().strftime("%Y-%m-%d %H:%M")

team_lines = []
for tm in teams:
    st = team_stats[tm]
    pct = round((st["completed"] / st["total"]) * 100, 1) if st["total"] > 0 else 0.0
    team_lines.append(f"• {tm}: الإجمالي {st['total']} | المنجز {st['completed']} | المتبقي {st['pending']} ({pct}%)")

team_text = "\n".join(team_lines)

raw_report = f"""⏱️ 51Talk Big Team 01 - التقرير المرحلي الدوري (Hourly Progress)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 المستلم: Saber Hussien (تقرير تنفيذي خاص)
📅 التوقيت: {current_time_str} | النطاق: Big Team 01 (22 SS Agents)

📊 ملخص الإنجاز اللحظي (Executive KPIs):
• 🎯 إجمالي مهام اليوم المستهدفة: {total_leads} عميل
• ✅ المهام المنجزة والمؤرشفة: {total_completed} عميل ({completion_rate}%)
• ⏳ المهام الجاري متابعتها: {total_pending} عميل

🏢 موقف إنجاز الفرق (Team Completion Breakdown):
{team_text}

📌 تفاصيل الأولويات التشغيلية:
• 🔴 P1 (SOP Round 1): {p1_count} عميل
• ⏰ P2 (Due Today Tasks): {p2_count} عميل
• 🎓 P3 (Unfixed Teachers - M0, M1, M2): {p3_count} عميل
• 📉 P4 (0-Class Consumption - M0, M1, M2): {p4_count} عميل
• 🔄 P5 (Outside Pool & 0 Pts): {p5_count} عميل

🌐 رابط متابعة الشيت أونلاين على دينج توك:
👉 {online_url}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(يتم تحديث التقرير الدوري آلياً كل ساعة لحساب Saber Hussien حصرياً)"""

# Sanitize any hidden zero-width unicode characters that trigger DingTalk CLI security validator
full_text_report = raw_report.replace('\u200d', '').replace('\u200c', '').replace('\u200b', '').replace('\ufeff', '')

print(f"Total Leads: {total_leads} | Completed: {total_completed} | Pending: {total_pending} ({completion_rate}%)", flush=True)
print("\nBroadcasting Full Expanded Report to Saber Hussien...", flush=True)

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
        print("[SUCCESS] Full text hourly progress report delivered to Saber Hussien successfully!", flush=True)
    else:
        print(f"[STATUS] ReturnCode: {res.returncode}", flush=True)
        if res.stdout:
            print(f"[STDOUT] {res.stdout.strip()}", flush=True)
        if res.stderr:
            print(f"[STDERR] {res.stderr.strip()}", flush=True)
except Exception as e:
    print(f"[ERROR] Exception: {e}", flush=True)

print("==========================================================", flush=True)
