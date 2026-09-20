import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_chat_id = "cidLlcC1A6WaUrp05On2usklddRK6whaApxtxzqsgJ1Ccw="
work_dir = r"d:\Lens\All in one master"
dws_bin = r"C:\Users\husse\AppData\Roaming\npm\dws.cmd"
if not os.path.exists(dws_bin):
    dws_bin = "dws"

print("=== SENDING STANDALONE REPORTS TO DINGTALK USER: EGSS-HussienMO ===", flush=True)
print(f"Target Open Conversation ID: {target_chat_id}\n", flush=True)

markdown_text = """### 📊 **STANDALONE LEADS REPORTS DELIVERED**

Dear **Hussien**,

Here are your requested separate standalone Excel report files for **Class Consumption** and **Unfixed Teacher** sheets compiled from the latest Operations Master:

---

### 1️⃣ **Class Consumption Leads Report**
- **File:** `Class_Consumption_Leads_Report.xlsx`
- **Contents:**
  - `3- Class Consumption`: Small Team & Rep Level Breakdown (0 classes, 1-3 classes, 4-7 classes, 8-11 classes, 12+ classes)
  - `Class_Consumption_Leads_Detail`: **3,024** Individual student leads with Cohort, Attended Classes, and Recommended Action
- **Saved Paths:**
  - `D:\\Lens\\All in one master\\Class_Consumption_Leads_Report.xlsx`
  - `C:\\Users\\husse\\Desktop\\Class_Consumption_Leads_Report.xlsx`

---

### 2️⃣ **Unfixed Teacher Leads Report**
- **File:** `Unfixed_Teacher_Leads_Report.xlsx`
- **Contents:**
  - `2- Unfixed Teacher`: Small Team & Rep Level Summary (M0 & M1 Total Students, Fixed Count & Binding %)
  - `Unfixed_Teacher_Leads_Detail`: **1,314** Individual student leads needing fixed teacher assignment
- **Saved Paths:**
  - `D:\\Lens\\All in one master\\Unfixed_Teacher_Leads_Report.xlsx`
  - `C:\\Users\\husse\\Desktop\\Unfixed_Teacher_Leads_Report.xlsx`

---
✨ *Both standalone workbooks preserve full original styling, formulas, column structures, and conditional formatting.*
"""

# 1. Send Markdown Overview
print("1. Sending Markdown message...", flush=True)
cmd_msg = [
    dws_bin, "chat", "+messages-send",
    "--as", "user",
    "--chat-id", target_chat_id,
    "--markdown", markdown_text,
    "-y"
]
res_msg = subprocess.run(cmd_msg, cwd=work_dir, capture_output=True, text=True, encoding='utf-8', shell=True)
print("Markdown Message Status:", "SUCCESS" if res_msg.returncode == 0 else f"FAILED ({res_msg.returncode})", flush=True)
if res_msg.stdout:
    print("STDOUT:", res_msg.stdout.strip(), flush=True)
if res_msg.stderr:
    print("STDERR:", res_msg.stderr.strip(), flush=True)

# 2. Send File 1: Class_Consumption_Leads_Report.xlsx
print("\n2. Sending Class_Consumption_Leads_Report.xlsx...", flush=True)
cmd_f1 = [
    dws_bin, "chat", "+messages-send",
    "--as", "user",
    "--chat-id", target_chat_id,
    "--msg-type", "file",
    "--file", "Class_Consumption_Leads_Report.xlsx",
    "-y"
]
res_f1 = subprocess.run(cmd_f1, cwd=work_dir, capture_output=True, text=True, encoding='utf-8', shell=True)
print("File 1 Status:", "SUCCESS" if res_f1.returncode == 0 else f"FAILED ({res_f1.returncode})", flush=True)
if res_f1.stdout:
    print("STDOUT:", res_f1.stdout.strip(), flush=True)
if res_f1.stderr:
    print("STDERR:", res_f1.stderr.strip(), flush=True)

# 3. Send File 2: Unfixed_Teacher_Leads_Report.xlsx
print("\n3. Sending Unfixed_Teacher_Leads_Report.xlsx...", flush=True)
cmd_f2 = [
    dws_bin, "chat", "+messages-send",
    "--as", "user",
    "--chat-id", target_chat_id,
    "--msg-type", "file",
    "--file", "Unfixed_Teacher_Leads_Report.xlsx",
    "-y"
]
res_f2 = subprocess.run(cmd_f2, cwd=work_dir, capture_output=True, text=True, encoding='utf-8', shell=True)
print("File 2 Status:", "SUCCESS" if res_f2.returncode == 0 else f"FAILED ({res_f2.returncode})", flush=True)
if res_f2.stdout:
    print("STDOUT:", res_f2.stdout.strip(), flush=True)
if res_f2.stderr:
    print("STDERR:", res_f2.stderr.strip(), flush=True)

print("\n=== SCRIPT COMPLETE ===", flush=True)
