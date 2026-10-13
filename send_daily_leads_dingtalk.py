# -*- coding: utf-8 -*-
import os
import sys
import json
import subprocess
from datetime import datetime

# Enforce UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

# Target DingTalk Chat Groups
CHAT_GROUPS = {
    "mega": "cidx9ITXJyqktd2CvhI8op0Ig==",       # Big Team Champs - Mega (26 members)
    "updates": "cidYhX/JCJvNbl0xGGtuL8qdg==",    # Big Team 01 updates (5 members)
    "leaders": "cidhasF9F02Sb+TdRuVHmBVRg=="     # Big Team Leaders Only (5 members)
}

target_key = sys.argv[1].lower() if len(sys.argv) > 1 else "mega"
target_chat_id = CHAT_GROUPS.get(target_key, CHAT_GROUPS["mega"])

# Resolve Paths
json_path = r"D:\Lens\Dashboard\scratch\unified_master_records.json"
excel_path = r"D:\Lens\Dashboard\October Daily Tasks.xlsx"
online_url = "https://alidocs.dingtalk.com/i/nodes/7dx2rn0JbYKPbR97sNa40jbqVMGjLRb3"

url_file = r"D:\Lens\Dashboard\latest_online_sheet_url.txt"
if os.path.exists(url_file):
    try:
        with open(url_file, 'r', encoding='utf-8-sig') as uf:
            u_content = uf.read().strip()
            if u_content.startswith("http"):
                online_url = u_content
    except Exception:
        pass

node_exe = r"C:\Program Files\nodejs\node.exe"
dws_js = r"C:\Users\husse\AppData\Roaming\npm\node_modules\dingtalk-workspace-cli\bin\dws.js"

print("==========================================================", flush=True)
print(" 51Talk Big Team 01 - DingTalk Daily Leads Automated Broadcast Engine", flush=True)
print("==========================================================", flush=True)

if not os.path.exists(json_path):
    print(f"[ERROR] Master records JSON not found at: {json_path}", flush=True)
    sys.exit(1)

with open(json_path, 'r', encoding='utf-8-sig') as f:
    records = json.load(f)

total_leads = len(records)
p1_count = sum(1 for r in records if "Round 1" in r.get("TierName", "") or "P1" in r.get("TierName", ""))
p2_count = sum(1 for r in records if "Due Today" in r.get("TierName", "") or "P2" in r.get("TierName", ""))
p3_count = sum(1 for r in records if "Unfixed" in r.get("TierName", "") or "P3" in r.get("TierName", ""))
p4_count = sum(1 for r in records if "0-Classes" in r.get("TierName", "") or "0-Cons" in r.get("Action", "") or "P4" in r.get("TierName", ""))
p5_count = sum(1 for r in records if "Outside" in r.get("TierName", "") or "P5" in r.get("TierName", ""))

carried_over_count = sum(1 for r in records if "Carried Over" in r.get("BacklogStatus", ""))
fresh_count = sum(1 for r in records if "Fresh Lead" in r.get("BacklogStatus", ""))

# Breakdown by Rep
rep_counts = {}
for r in records:
    ag = r.get("Agent", "Unknown").replace("EGSS-", "")
    rep_counts[ag] = rep_counts.get(ag, 0) + 1

sorted_reps = sorted(rep_counts.items(), key=lambda x: x[1], reverse=True)
today_str = datetime.now().strftime("%Y-%m-%d")

# Build 2-column Rep Table Markdown
rep_table_rows = []
for i in range(0, len(sorted_reps), 2):
    r1 = sorted_reps[i]
    col1 = f"**{r1[0]}**: `{r1[1]}`"
    if i + 1 < len(sorted_reps):
        r2 = sorted_reps[i + 1]
        col2 = f"**{r2[0]}**: `{r2[1]}`"
    else:
        col2 = "-"
    rep_table_rows.append(f"| {col1} | {col2} |")

reps_table_md = "\n".join(rep_table_rows)

markdown_text = f"""### 🚀 **51Talk Big Team 01 - Operations Action Leads (اليوم الثاني)**
> 📅 **التاريخ:** {today_str} | **الفريق:** Big Team 01 Exclusive | **الشرائح المعتمدة:** M0 / M1 / M2 🎯

---

### 📊 **ملخص مهام اليوم الثاني (Day 2 Breakdown):**
* 🔴 **Priority 1 (SOP Round 1):** `{p1_count}` عميل (متابعة عاجلة)
* ⏰ **Priority 2 (Due Today Tasks):** `{p2_count}` عميل (مهام تنتهي اليوم)
* 👨‍🏫 **Priority 3 (Unfixed Teachers - M0, M1, M2):** `{p3_count}` عميل (تثبيت المعلمين)
* 📉 **Priority 4 (0 Class Consumption - M0, M1, M2):** `{p4_count}` عميل (تحفيز الحضور)
* 🔄 **Priority 5 (Outside Pool & 0 Pts):** `{p5_count}` عميل (استعادة الرصيد)

📌 **إجمالي مهام العمل النشطة لليوم:** **`{total_leads}` عميل**
*(يشمل `{carried_over_count}` عميل مرحل من الأمس مع تنويه خاص + `{fresh_count}` عميل جديد)*

---

### 🌐 **النسخة الأونلاين المباشرة على دينج توك:**
👉 [**اضغط هنا لفتح ومتابعة شيت مهام اليوم: October Daily Tasks - {today_str}**]({online_url})
*(يمكنك العمل ومتابعة التحديثات مباشرة أونلاين من الموبايل أو الكمبيوتر)*

---

### 👥 **توزيع المهام لكل موظف (Reps Action Load):**
| Rep 1 & Leads | Rep 2 & Leads |
|:---|:---|
{reps_table_md}

---

### 📝 **تعليمات العمل والمتابعة:**
1. تم إرفاق ملف الإكسيل المحدث أعلاه، ويحتوي على شيت منفصل لكل موظف بكامل تفاصيل عملائه.
2. عمود المتابعة المعتمد هو **Column J (Status)** — يرجى اختيار **Done ✓** عند الإتمام، أو **No Answer** في حال عدم الرد، وكتابة الملاحظات في عمود **Rep Feedback (Col K)**.
3. العملاء المرحلون من الأمس موضح بجانبهم التنويه في عمود **Backlog Status (Col N)**.
"""

# Sanitize zero-width characters
for zw in ['\u200d', '\u200c', '\u200b', '\ufeff']:
    markdown_text = markdown_text.replace(zw, '')

print(f"Target Group Key: {target_key} -> Chat ID: {target_chat_id}", flush=True)
print(f"Excel File Path:  {excel_path}", flush=True)
print(f"Online Sheet URL: {online_url}", flush=True)
print(f"Total Filtered Leads: {total_leads} (Carried Over: {carried_over_count}, Fresh: {fresh_count})", flush=True)

# 1. Send Markdown Action Card using node.exe directly
print("\n1. Broadcasting Filtered Markdown Action Card to DingTalk...", flush=True)
try:
    cmd_msg = [
        node_exe, dws_js, "chat", "+messages-send",
        "--as", "user",
        "--chat-id", target_chat_id,
        "--markdown", markdown_text,
        "-y"
    ]
    res_msg = subprocess.run(cmd_msg, capture_output=True, text=True, encoding='utf-8')
    if res_msg.returncode == 0:
        print("  [SUCCESS] Markdown Action Card delivered successfully!", flush=True)
    else:
        print(f"  [STATUS] DingTalk Markdown output: {res_msg.stdout or res_msg.stderr}", flush=True)
except Exception as e:
    print(f"  [ERROR] Markdown broadcast exception: {e}", flush=True)

# 2. Send Excel File Attachment using node.exe directly
if os.path.exists(excel_path):
    print(f"\n2. Uploading & Broadcasting Excel Workbook ({os.path.basename(excel_path)})...", flush=True)
    try:
        cmd_file = [
            node_exe, dws_js, "chat", "+messages-send",
            "--as", "user",
            "--chat-id", target_chat_id,
            "--msg-type", "file",
            "--file", f"./{os.path.basename(excel_path)}",
            "-y"
        ]
        res_file = subprocess.run(cmd_file, cwd=os.path.dirname(excel_path), capture_output=True, text=True, encoding='utf-8')
        if res_file.returncode == 0:
            print("  [SUCCESS] Excel Workbook delivered successfully!", flush=True)
        else:
            print(f"  [STATUS] DingTalk File upload output: {res_file.stdout or res_file.stderr}", flush=True)
    except Exception as e:
        print(f"  [ERROR] Excel upload exception: {e}", flush=True)
else:
    print(f"\n[WARNING] Excel file not found at: {excel_path}", flush=True)

print("\n==========================================================", flush=True)
print(" DINGTALK BROADCAST COMPLETE - ZERO MANUAL EFFORT", flush=True)
print("==========================================================", flush=True)
