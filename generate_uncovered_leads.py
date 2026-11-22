import openpyxl
import json
import csv
import os
import glob
from datetime import datetime

print("=========================================================================")
print(" 51Talk Big Team 01 — Uncovered Leads Data Engine")
print(" Strict November Call Connection & Completed Touch Purge Protocol")
print("=========================================================================")

dash_dir = r"D:\Lens\Dashboard"
leads_dir = os.path.join(dash_dir, "leads")
uncovered_sub_dir = os.path.join(leads_dir, "uncovered_leads")
os.makedirs(uncovered_sub_dir, exist_ok=True)

# 19 Active Reps Mapping
active_reps_map = {
    # ME-EGSS01 (4 Reps)
    "egss-ashraqatal": "ME-EGSS01",
    "egss-juliamonir01": "ME-EGSS01",
    "egss-nohayoussry": "ME-EGSS01",
    "egss-mahmoud04": "ME-EGSS01",
    
    # ME-EGSS05 (7 Reps)
    "egss-samira01": "ME-EGSS05",
    "egss-abdelrahmannasef": "ME-EGSS05",
    "egss-ehabzaky01": "ME-EGSS05",
    "egss-ibrahimismaiel": "ME-EGSS05",
    "egss-khaledgonam": "ME-EGSS05",
    "egss-omarmoneb": "ME-EGSS05",
    "egss-alihesham01": "ME-EGSS05",
    
    # ME-EGSS10 (3 Reps)
    "egss-abdelrhmanshehata": "ME-EGSS10",
    "egss-hayamhassan": "ME-EGSS10",
    "egss-titooooo": "ME-EGSS10",
    
    # ME-EGSS13 (3 Reps)
    "egss-marwaahmed": "ME-EGSS13",
    "egss-amrsafwat": "ME-EGSS13",
    "egss-mohamedha": "ME-EGSS13",
    
    # ME-EGSS30 (2 Reps)
    "egss-ahmedshoukry": "ME-EGSS30",
    "egss-mahmoudkhamis": "ME-EGSS30"
}

# -------------------------------------------------------------------------
# STEP 1: Harvest ALL November 2026 Call Connections across all sources
# -------------------------------------------------------------------------
nov_call_connected_students = {}

# 1A. Telephony Call Report files
cr_files = glob.glob(r"D:\Lens\**\*Call Report*.xlsx", recursive=True)
for crf in cr_files:
    if "Archived" in crf or "node_modules" in crf: continue
    try:
        wb_cr = openpyxl.load_workbook(crf, read_only=True)
        for sname in wb_cr.sheetnames:
            if "总表" in sname or "明细" in sname:
                ws_cr = wb_cr[sname]
                for i, row in enumerate(ws_cr.iter_rows(values_only=True)):
                    if i == 0 or len(row) < 10: continue
                    sid = str(row[2]).strip() if row[2] else ""
                    status = str(row[5]) if row[5] else ""
                    add_t = str(row[7]) if row[7] else ""
                    dur = row[9] if row[9] else 0
                    try: dur_val = float(dur)
                    except: dur_val = 0
                    if add_t.startswith("202611") or add_t.startswith("2026-11"):
                        if dur_val > 0 or status == "双方接听" or "接听" in status:
                            if "未接通" not in status and "取消" not in status:
                                if sid and sid not in nov_call_connected_students:
                                    nov_call_connected_students[sid] = {
                                        'source': 'Telephony Call Report (Connected)',
                                        'time': add_t
                                    }
    except Exception as e:
        print("  Notice reading call report:", e)

# 1B. CRM Latest Calls JSON
crm_json_path = os.path.join(leads_dir, "crm_latest_calls.json")
if os.path.exists(crm_json_path):
    try:
        with open(crm_json_path, 'r', encoding='utf-8') as f:
            crm_calls = json.load(f)
        for sid, d in crm_calls.items():
            if not isinstance(d, dict): continue
            for c in d.get('all_calls', []):
                t = (c.get('time') or '')
                dur = (c.get('duration') or '')
                if t.startswith('2026/11') or t.startswith('2026-11'):
                    parts = dur.split('/')
                    connected = True
                    if len(parts) == 2 and parts[1].strip() in ["00:00", "0:00"]:
                        connected = False
                    if connected:
                        sid_str = str(sid).strip()
                        if sid_str not in nov_call_connected_students:
                            nov_call_connected_students[sid_str] = {
                                'source': 'CRM Live Calls (Connected)',
                                'time': t
                            }
    except Exception as e:
        print("  Notice reading CRM calls JSON:", e)

# 1C. SOP Completed Touchpoints in November
sop_files = glob.glob(r"D:\Lens\Dashboard\Data Center\**\*SOP*.xlsx", recursive=True) + glob.glob(r"D:\Lens\Dashboard\Data Center\**\*Lens*.xlsx", recursive=True)
for sf in sop_files:
    if "Archived" in sf or "node_modules" in sf: continue
    try:
        wb_s = openpyxl.load_workbook(sf, read_only=True)
        for sname in ["明细表", "Unnamed_7uwaifkp"]:
            if sname in wb_s.sheetnames:
                ws_s = wb_s[sname]
                for i, row in enumerate(ws_s.iter_rows(values_only=True)):
                    if i == 0 or len(row) < 9: continue
                    sid = str(row[2]).strip() if row[2] else ""
                    status = str(row[5]) if row[5] else ""
                    done_t = str(row[8]) if row[8] else ""
                    if "完成" in status or "completed" in status.lower():
                        if done_t.startswith("202611") or done_t.startswith("2026-11"):
                            if sid and sid not in nov_call_connected_students:
                                nov_call_connected_students[sid] = {
                                    'source': 'SOP Touchpoint Completed',
                                    'time': done_t
                                }
    except Exception as e:
        pass

print(f"[STEP 1] Harvested {len(nov_call_connected_students)} students with verified Nov 2026 call connections / completed touches.")

# -------------------------------------------------------------------------
# STEP 2: Find and Read Latest Student-Detail File
# -------------------------------------------------------------------------
candidate_files = glob.glob(r"D:\Lens\Dashboard\Data Center\**\*Student-Detail*.xlsx", recursive=True)
if not candidate_files:
    candidate_files = glob.glob(r"D:\Lens\**\*Student-Detail*.xlsx", recursive=True)

candidate_files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
student_detail_path = candidate_files[0] if candidate_files else None

if not student_detail_path or not os.path.exists(student_detail_path):
    print("FATAL: Student-Detail file not found!")
    exit(1)

print(f"[STEP 2] Using latest Student-Detail: {student_detail_path}")
wb_detail = openpyxl.load_workbook(student_detail_path, read_only=True)
ws_detail = wb_detail['Student_Detail'] if 'Student_Detail' in wb_detail.sheetnames else wb_detail.worksheets[0]

uncovered_leads = []
purged_count = 0
total_lens_uncovered = 0

for i, row in enumerate(ws_detail.iter_rows(values_only=True)):
    if i == 0 or row[0] == 'Total' or len(row) < 14: continue
    
    agent_raw = str(row[2]).strip() if row[2] else ""
    rep_key = agent_raw.lower()
    if rep_key not in active_reps_map:
        continue
        
    cov = str(row[8]).strip()
    if cov != '0':
        continue # already covered in Lens
        
    sid = str(row[3]).strip() if row[3] else ""
    if not sid:
        continue
        
    total_lens_uncovered += 1
    
    # CRITICAL USER RULE:
    # "اريد منك ان تمسح تمام اي عميل من هذه القائمه في حاله وجود call connection خلال هذا،الشهر"
    if sid in nov_call_connected_students:
        purged_count += 1
        continue # PURGED COMPLETELY!
        
    team_name = active_reps_map[rep_key]
    pool_name = str(row[4]).strip() if row[4] else "Unknown"
    pool_detail = str(row[5]).strip() if row[5] else "Unknown"
    first_pay = str(row[6]).strip() if row[6] else "-"
    
    last_cls = float(row[12]) if row[12] is not None else 0.0
    this_cls = float(row[13]) if row[13] is not None else 0.0
    attended_classes = max(last_cls, this_cls)
    
    tier = "0 Classes (Dormant)"
    if attended_classes >= 15: tier = ">=15 Classes (VIP)"
    elif attended_classes >= 12: tier = ">=12 Classes (High)"
    elif attended_classes >= 8: tier = ">=8 Classes (Medium-High)"
    elif attended_classes >= 4: tier = ">=4 Classes (Medium)"
    elif attended_classes > 0: tier = "1-3 Classes (Low)"
    
    action = "REACTIVATION - Dormant Student Win-Back"
    if attended_classes >= 12: action = "URGENT VIP - High Consumer Uncontacted"
    elif attended_classes >= 8: action = "HIGH PRIORITY - Serious Student Retention"
    elif attended_classes >= 4: action = "PRIORITY - Active Student Upgrade Pitch"
    elif attended_classes > 0: action = "STANDARD - Re-engagement & Habit Building"
    
    uncovered_leads.append({
        'StudentId': sid,
        'Rep': agent_raw,
        'Team': team_name,
        'BigTeam': "MEKSA-EGSS01",
        'Pool': pool_name,
        'PoolDetail': pool_detail,
        'AttendedClasses': attended_classes,
        'BookedUnattended': 0.0,
        'AttendanceTier': tier,
        'LastConnectionTime': "1970-01-01 00:00:00",
        'ConnectionDisplay': "No Connection This Month",
        'ConnectionSource': "Zero Nov Call Connections",
        'LastPaidDate': first_pay,
        'RecommendedAction': action,
        'IsCovered': 0
    })

print(f"[STEP 2 DONE] Total Lens Uncovered: {total_lens_uncovered}")
print(f"  Purged due to having a verified Nov call connection: {purged_count}")
print(f"  FINAL TRUE UNCOVERED LEADS: {len(uncovered_leads)}")

# -------------------------------------------------------------------------
# STEP 3: Priority Ranking and Sorting
# -------------------------------------------------------------------------
uncovered_leads.sort(key=lambda x: (-x['AttendedClasses'], x['StudentId']))

for idx, item in enumerate(uncovered_leads):
    item['PriorityRank'] = idx + 1

# -------------------------------------------------------------------------
# STEP 4: Export CSVs (Master, 5 Teams, 19 Reps)
# -------------------------------------------------------------------------
fieldnames = [
    "PriorityRank", "StudentId", "Rep", "Team", "BigTeam", "Pool", "PoolDetail",
    "AttendedClasses", "BookedUnattended", "AttendanceTier", "LastConnectionTime",
    "ConnectionDisplay", "ConnectionSource", "LastPaidDate", "RecommendedAction", "IsCovered"
]

def write_csv(filepath, rows):
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)

# Master CSV
write_csv(os.path.join(leads_dir, "Master_Uncovered_Leads.csv"), uncovered_leads)
write_csv(os.path.join(uncovered_sub_dir, "Master_Uncovered_Leads.csv"), uncovered_leads)

# Team CSVs
team_groups = {}
for l in uncovered_leads:
    team_groups.setdefault(l['Team'], []).append(l)

for team_name, rows in team_groups.items():
    write_csv(os.path.join(leads_dir, f"{team_name}_Uncovered_Leads.csv"), rows)
    write_csv(os.path.join(uncovered_sub_dir, f"{team_name}_Uncovered_Leads.csv"), rows)

# Rep CSVs
rep_groups = {}
for l in uncovered_leads:
    rep_groups.setdefault(l['Rep'], []).append(l)

for rep_name, rows in rep_groups.items():
    write_csv(os.path.join(leads_dir, f"{rep_name}_Uncovered_Leads.csv"), rows)
    write_csv(os.path.join(uncovered_sub_dir, f"{rep_name}_Uncovered_Leads.csv"), rows)

# -------------------------------------------------------------------------
# STEP 5: Generate Web JSON & JS Datasets
# -------------------------------------------------------------------------
high_tier = len([l for l in uncovered_leads if l['AttendedClasses'] >= 8])
med_tier = len([l for l in uncovered_leads if 4 <= l['AttendedClasses'] < 8])
low_tier = len([l for l in uncovered_leads if 0 < l['AttendedClasses'] < 4])
dormant = len([l for l in uncovered_leads if l['AttendedClasses'] == 0])

summary_stats = {
    "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "auditDate": "2026-11-22",
    "totalUncovered": len(uncovered_leads),
    "highTierCount": high_tier,
    "mediumTierCount": med_tier,
    "lowTierCount": low_tier,
    "dormantCount": dormant,
    "uncontactedCount": len(uncovered_leads),
    "teamBreakdown": {},
    "repBreakdown": {}
}

for team_name, rows in team_groups.items():
    summary_stats["teamBreakdown"][team_name] = {
        "total": len(rows),
        "high": len([r for r in rows if r['AttendedClasses'] >= 8]),
        "med": len([r for r in rows if 4 <= r['AttendedClasses'] < 8]),
        "uncontacted": len(rows)
    }

for rep_name, rows in rep_groups.items():
    summary_stats["repBreakdown"][rep_name] = {
        "team": rows[0]['Team'],
        "total": len(rows),
        "high": len([r for r in rows if r['AttendedClasses'] >= 8]),
        "med": len([r for r in rows if 4 <= r['AttendedClasses'] < 8]),
        "uncontacted": len(rows)
    }

web_payload = {
    "meta": summary_stats,
    "leads": uncovered_leads
}

# Export JSON
json_path = os.path.join(leads_dir, "uncovered_leads_data.json")
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(web_payload, f, ensure_ascii=False, indent=2)

# Export JS
js_path = os.path.join(leads_dir, "uncovered_leads_data.js")
with open(js_path, 'w', encoding='utf-8') as f:
    f.write("window.UNCOVERED_LEADS_DATA = ")
    json.dump(web_payload, f, ensure_ascii=False)
    f.write(";\n")

print(f"[STEP 5 DONE] Finished! Total Uncovered Leads: {len(uncovered_leads)}")
