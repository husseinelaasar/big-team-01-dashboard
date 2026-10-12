import os
import sys
import json
import csv
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

node_exe = r"C:\Program Files\nodejs\node.exe"
dws_js = r"C:\Users\husse\AppData\Roaming\npm\node_modules\dingtalk-workspace-cli\bin\dws.js"
doc_id = "dxXB52LJqnjXBmGdiZ7rdGZD8qjMp697"

# 1. Load records to get rep tabs and row counts
json_path = r"D:\Lens\Dashboard\scratch\unified_master_records.json"
with open(json_path, 'r', encoding='utf-8-sig') as f:
    records = json.load(f)

# Group by tab: e.g. "Team 01 - ashraqatal"
agent_groups = {}
for r in records:
    tab_name = f"{r.get('Team', '')} - {r.get('Agent', '')}".strip()
    if tab_name not in agent_groups:
        agent_groups[tab_name] = []
    agent_groups[tab_name].append(r)

sorted_tabs = sorted(agent_groups.keys(), key=lambda x: (x.split('-')[0].strip(), x.split('-')[1].strip()))

case_tiers = [
    ("P1: SOP R1", "  [P1] SOP Round 1", "Awareness building (First call)"),
    ("P2: Due Today", "  [P2] Due Today", "Urgent tasks expiring today"),
    ("P3: Unfixed", "  [P3] Unfixed Teacher", "Fix teacher binding"),
    ("P4: 0-Classes", "  [P4] 0-Classes Urge", "Urge class booking"),
    ("P5: Outside 0pts", "  [P5] Outside Pool 0pts", "High-priority renewal urge")
]

rows_data = []
cur_row = 5
parent_rows = []

for rep_idx, tab_key in enumerate(sorted_tabs, start=1):
    cur_row += 1
    p_row = cur_row
    parent_rows.append(p_row)
    
    team_part = tab_key.split('-')[0].strip()
    agent_part = tab_key.split('-')[1].strip()
    
    child_start = p_row + 1
    child_end   = p_row + 5
    
    tab_rec_count = len(agent_groups[tab_key])
    sub_start = 6
    sub_end = sub_start + tab_rec_count - 1
    
    link_formula = f'=HYPERLINK("#\'{tab_key}\'!A1", "Go to {tab_key} ->")'
    p_tot_form   = f'=SUM(E{child_start}:E{child_end})'
    p_comp_form  = f'=SUM(F{child_start}:F{child_end}) + COUNTIF($C$144:$C$10000, C{p_row})'
    p_pend_form  = f'=E{p_row}-F{p_row}'
    p_rate_form  = f'=IF(E{p_row}>0, F{p_row}/E{p_row}, 0)'
    p_stat_form  = f'=IF(H{p_row}>=1, "COMPLETED", IF(H{p_row}>=0.5, "ON TRACK", IF(F{p_row}>0, "IN PROGRESS", "PENDING")))'
    
    rows_data.append([
        str(rep_idx),
        team_part,
        agent_part,
        link_formula,
        p_tot_form,
        p_comp_form,
        p_pend_form,
        p_rate_form,
        p_stat_form
    ])
    
    # 5 Child Detail Rows:
    for code, label, desc in case_tiers:
        cur_row += 1
        c_row = cur_row
        
        c_tot_form  = f'=COUNTIF(\'{tab_key}\'!A{sub_start}:A{sub_end}, "{code}")'
        c_comp_form = f'=COUNTIFS(\'{tab_key}\'!A{sub_start}:A{sub_end}, "{code}", \'{tab_key}\'!J{sub_start}:J{sub_end}, "Done*")'
        c_pend_form = f'=E{c_row}-F{c_row}'
        c_rate_form = f'=IF(E{c_row}>0, F{c_row}/E{c_row}, 0)'
        c_stat_form = f'=IF(H{c_row}>=1, "COMPLETED", IF(F{c_row}>0, "IN PROGRESS", "PENDING"))'
        
        rows_data.append([
            label,
            team_part,
            agent_part,
            desc,
            c_tot_form,
            c_comp_form,
            c_pend_form,
            c_rate_form,
            c_stat_form
        ])

# Grand Total Row (Row 138)
cur_row += 1
gt_row = cur_row
gt_tot_form  = "=" + "+".join(f"E{pr}" for pr in parent_rows)
gt_comp_form = "=" + "+".join(f"F{pr}" for pr in parent_rows)
gt_pend_form = f'=E{gt_row}-F{gt_row}'
gt_rate_form = f'=IF(E{gt_row}>0, F{gt_row}/E{gt_row}, 0)'
gt_stat_form = f'=IF(H{gt_row}>=1, "ALL COMPLETED", "ACTIVE CYCLE")'

rows_data.append([
    "ALL",
    "BIG TEAM 01",
    "22 Representatives",
    "-",
    gt_tot_form,
    gt_comp_form,
    gt_pend_form,
    gt_rate_form,
    gt_stat_form
])

csv_path = r"D:\Lens\Dashboard\scratch\completed_archive_dynamic_formulas.csv"
with open(csv_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
    for r in rows_data:
        writer.writerow(r)

print(f"Generated {len(rows_data)} rows with Python csv.writer (Rows 6 to {gt_row}).")

# Put into sheet s24 starting at cell A6
put_cmd = [
    node_exe, dws_js, "sheet", "csv-put",
    "--node", doc_id,
    "--sheet-id", "s24",
    "--start-cell", "A6",
    "--csv", "@" + csv_path,
    "--allow-overwrite",
    "-y"
]
res_put = subprocess.run(put_cmd, capture_output=True, text=True, encoding='utf-8')
print("Table csv-put status:", res_put.stdout)

# Row 2 Top Banner
banner_csv = r"D:\Lens\Dashboard\scratch\top_banner_formula.csv"
banner_formula = f'="TOTAL ASSIGNED: " & E{gt_row} & "   |   COMPLETED: " & F{gt_row} & "   |   PENDING: " & G{gt_row} & "   |   BIG TEAM COMPLETION RATE: " & TEXT(H{gt_row}, "0.0%") & "   |   [Real-Time Dynamic Tracking]"'
with open(banner_csv, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([banner_formula])

put_banner = [
    node_exe, dws_js, "sheet", "csv-put",
    "--node", doc_id,
    "--sheet-id", "s24",
    "--start-cell", "A2",
    "--csv", "@" + banner_csv,
    "--allow-overwrite",
    "-y"
]
res_banner = subprocess.run(put_banner, capture_output=True, text=True, encoding='utf-8')
print("Banner csv-put status:", res_banner.stdout)
