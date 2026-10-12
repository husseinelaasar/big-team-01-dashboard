import os
import sys
import json
import subprocess
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# Target DingTalk Group: Default to "Big Team Champs - Mega" or allow override
# Group IDs:
# Big Team Champs - Mega (26 members): cidx9ITXJyqktd2CvhI8op0Ig==
# Big Team 01 updates (5 members): cidYhX/JCJvNbl0xGGtuL8qdg==
# Big Team Leaders Only (5 members): cidhasF9F02Sb+TdRuVHmBVRg==

CHAT_GROUPS = {
    "mega": "cidx9ITXJyqktd2CvhI8op0Ig==",       # Big Team Champs - Mega
    "updates": "cidYhX/JCJvNbl0xGGtuL8qdg==",    # Big Team 01 updates
    "leaders": "cidhasF9F02Sb+TdRuVHmBVRg=="     # Big Team Leaders Only
}

target_key = sys.argv[1] if len(sys.argv) > 1 else "mega"
target_chat_id = CHAT_GROUPS.get(target_key, CHAT_GROUPS["mega"])

json_path = r"D:\Lens\Dashboard\scratch\unified_master_records.json"
if not os.path.exists(json_path):
    json_path = r"D:\Lens\Dashboard\scratch\master_records.json"
excel_path = r"D:\Lens\Dashboard\Operations_Action_Leads_Master.xlsx"
dws_bin = r"C:\Users\husse\AppData\Roaming\npm\dws.cmd"
if not os.path.exists(dws_bin):
    dws_bin = "dws"

print("==========================================================", flush=True)
print(" DingTalk Daily Leads Automated Broadcast Engine", flush=True)
print("==========================================================", flush=True)

if not os.path.exists(json_path):
    print(f"[ERROR] JSON file not found at: {json_path}")
    sys.exit(1)

with open(json_path, 'r', encoding='utf-8') as f:
    records = json.load(f)

total_leads = len(records)
p1_count = sum(1 for r in records if "Round 1" in r.get("TierName", ""))
p2_count = sum(1 for r in records if "Due Today" in r.get("TierName", ""))
p3_count = sum(1 for r in records if "Unfixed" in r.get("TierName", ""))
p4_count = sum(1 for r in records if "Class Consumption" in r.get("TierName", ""))
p5_count = sum(1 for r in records if "Outside Pool" in r.get("TierName", ""))

# Breakdown by Rep
rep_counts = {}
for r in records:
    ag = r.get("Agent", "Unknown").replace("EGSS-", "")
    rep_counts[ag] = rep_counts.get(ag, 0) + 1

sorted_reps = sorted(rep_counts.items(), key=lambda x: x[1], reverse=True)

today_str = datetime.now().strftime("%Y-%m-%d")

# Build Executive Markdown Message
rep_table_rows = []
for i in range(0, len(sorted_reps), 2):
    r1 = sorted_reps[i]
    col1 = f"**{r1[0]}**: {r1[1]}"
    if i + 1 < len(sorted_reps):
        r2 = sorted_reps[i + 1]
        col2 = f"**{r2[0]}**: {r2[1]}"
    else:
        col2 = "-"
    rep_table_rows.append(f"| {col1} | {col2} |")

reps_table_md = "\n".join(rep_table_rows)

markdown_text = f"""### 🎯 **51Talk Big Team 01 - Operations Action Leads**
> 📅 **التاريخ:** {today_str} | **الحالة:** تم التحديث والترحيل الآلي بنجاح 🚀

---

### 📊 **ملخص المهام حسب الأولوية (Priority Breakdown):**
* 🔴 **Priority 1 (SOP Round 1):** `{p1_count}` عميل (مطلوب المتابعة العاجلة)
* 🟠 **Priority 2 (Due Today Tasks):** `{p2_count}` عميل (مهام تنتهي اليوم)
* 🟡 **Priority 3 (Unfixed Teachers):** `{p3_count}` عميل (تثبيت المعلمين)
* 🔵 **Priority 4 (0 Class Consumption):** `{p4_count}` عميل (تحفيز الحصص)
* 🟣 **Priority 5 (Outside Pool & 0 Pts):** `{p5_count}` عميل (استعادة الرصيد)

🔥 **إجمالي العملاء المخصصين اليوم:** **`{total_leads}` عميل**

---

### 👥 **توزيع المهام لكل موظف (Reps Action Load):**
| Rep 1 & Leads | Rep 2 & Leads |
|:---|:---|
{reps_table_md}

---

### 📌 **تعليمات العمل:**
1. تم إرفاق الملف الكامل أدناه بصيغة Excel يحتوي على شيت مخصص لكل موظف.
2. ضع علامة **`[x]`** في العمود المخصص أمام كل مهمة فور إتمامها.
3. السكريبت الآلي سيقوم بحصد وتوثيق المهام المكتملة في شيت الأرشيف وترحيل المتبقي يومياً.
"""

print(f"Target Group ID: {target_chat_id}", flush=True)

# 1. Send Markdown Message
print("\n1. Sending Markdown Action Card to DingTalk...", flush=True)
cmd_msg = [
    dws_bin, "chat", "+messages-send",
    "--as", "user",
    "--chat-id", target_chat_id,
    "--markdown", markdown_text,
    "-y"
]
res_msg = subprocess.run(cmd_msg, capture_output=True, text=True, encoding='utf-8', shell=True)
print("Markdown Status:", "SUCCESS" if res_msg.returncode == 0 else f"FAILED ({res_msg.returncode})", flush=True)
if res_msg.stdout:
    print("STDOUT:", res_msg.stdout.strip()[:300], flush=True)

# 2. Send Excel File Attachment
if os.path.exists(excel_path):
    print(f"\n2. Sending Excel File: {excel_path}...", flush=True)
    cmd_file = [
        dws_bin, "chat", "+messages-send",
        "--as", "user",
        "--chat-id", target_chat_id,
        "--msg-type", "file",
        "--file", excel_path,
        "-y"
    ]
    res_file = subprocess.run(cmd_file, capture_output=True, text=True, encoding='utf-8', shell=True)
    print("File Status:", "SUCCESS" if res_file.returncode == 0 else f"FAILED ({res_file.returncode})", flush=True)
    if res_file.stdout:
        print("STDOUT:", res_file.stdout.strip()[:300], flush=True)
else:
    print(f"[WARNING] Excel file not found at: {excel_path}")

print("\n=== DINGTALK BROADCAST COMPLETE ===", flush=True)
