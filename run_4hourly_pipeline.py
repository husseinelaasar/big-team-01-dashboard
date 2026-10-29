# -*- coding: utf-8 -*-
r"""
51Talk Big Team 01 - Automated 4-Hourly Master Pipeline Runner
==============================================================
Sector: Big Team 01 | Senior Manager: Saber Hussien

Executes automatically every 4 hours:
  1. Live CRM Download & Clean-Sweep (5 raw workbooks via Google Chrome + Auto-Login)
  2. Master Workbook & Leads Rebuild (All in one Master.xlsx + 4 Sub-reports)
  3. Executive Web Dashboard & Leads Ingestion (update_dashboard.ps1 -> dashboard.js, CSVs, Git)
  4. DingTalk Mega Group Rich Performance Broadcast (send_clean.js)
"""

import os
import sys
import time
import datetime
import subprocess
from pathlib import Path

# Enforce UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(r"C:\Users\husse\Desktop\AI")
WORKFLOWS_DIR = BASE_DIR / "03_workflows"
LOG_FILE = Path(r"D:\Lens\Dashboard\4hourly_pipeline.log")
LOG_FILE_LEGACY = Path(r"D:\Lens\Dashboard\2hourly_pipeline.log")

PYTHON_EXE = r"C:\Users\husse\AppData\Local\Google\Cloud SDK\google-cloud-sdk\platform\bundledpython\python.exe"
if not os.path.exists(PYTHON_EXE):
    PYTHON_EXE = sys.executable

NODE_EXE = r"C:\Program Files\nodejs\node.exe"
if not os.path.exists(NODE_EXE):
    NODE_EXE = "node"

def log(msg: str):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{now_str}] {msg}"
    print(entry)
    for target_log in [LOG_FILE, LOG_FILE_LEGACY]:
        try:
            target_log.parent.mkdir(parents=True, exist_ok=True)
            with open(target_log, "a", encoding="utf-8") as f:
                f.write(entry + "\n")
        except Exception:
            pass

def run_pipeline():
    start_ts = time.time()
    log("=" * 75)
    log(">>> STARTING 4-HOURLY AUTOMATED MASTER PIPELINE EXECUTION <<<")
    log("=" * 75)

    # -------------------------------------------------------------------------
    # STEP 1: Live CRM Auto-Download & Clean-Sweep
    # -------------------------------------------------------------------------
    log("\n[STEP 1/4] Running Live CRM Automated Downloader via Google Chrome...")
    downloader_script = WORKFLOWS_DIR / "auto_crm_downloader.py"
    if not downloader_script.exists():
        downloader_script = BASE_DIR / "01_projects" / "crm_automation" / "01_crm_downloaders" / "auto_crm_downloader.py"

    try:
        proc1 = subprocess.run([PYTHON_EXE, str(downloader_script)], cwd=str(downloader_script.parent), capture_output=True, text=True, encoding='utf-8')
        if proc1.stdout:
            for line in proc1.stdout.strip().splitlines()[-15:]:
                log(f"   [CRM] {line}")
        if proc1.returncode != 0:
            log(f"   ⛔ [PIPELINE HALTED AT STEP 1] Downloader returned exit code {proc1.returncode}. Execution stopped to protect Master from incomplete files.")
            if proc1.stderr:
                log(f"   [CRM STDERR] {proc1.stderr[:300]}")
            return
        else:
            log("   ✅ [STEP 1 COMPLETE] 5 Raw CRM Reference Files captured & cleaned successfully.")
    except Exception as e:
        log(f"   ❌ [STEP 1 FAILED] Exception during CRM download: {e}")

    # -------------------------------------------------------------------------
    # STEP 2: Rebuild All in One Master Workbook & Standalone Sub-Reports
    # -------------------------------------------------------------------------
    log("\n[STEP 2/4] Rebuilding All in One Master Workbook & Sub-Reports...")
    builder_script = Path(r"D:\Lens\All in one master\master_builder.py")
    if not builder_script.exists():
        builder_script = BASE_DIR / "01_projects" / "all_in_one_master" / "master_builder.py"

    try:
        proc2 = subprocess.run([PYTHON_EXE, str(builder_script)], cwd=str(builder_script.parent), capture_output=True, text=True, encoding='utf-8')
        if proc2.stdout:
            for line in proc2.stdout.strip().splitlines()[-15:]:
                log(f"   [MASTER] {line}")
        if proc2.returncode != 0:
            log(f"   ⛔ [PIPELINE HALTED AT STEP 2] Master builder returned exit code {proc2.returncode}. Execution stopped to prevent publishing broken dashboard.")
            if proc2.stderr:
                log(f"   [MASTER STDERR] {proc2.stderr[:300]}")
            return
        else:
            log("   ✅ [STEP 2 COMPLETE] All in One Master & Sub-Reports rebuilt successfully.")
    except Exception as e:
        log(f"   ❌ [STEP 2 FAILED] Exception during Master rebuild: {e}")

    # -------------------------------------------------------------------------
    # STEP 3: Update Executive Web Dashboard & Ingest Leads
    # -------------------------------------------------------------------------
    log("\n[STEP 3/4] Updating Executive Web Dashboard & Ingesting Leads...")
    dash_script = Path(r"D:\Lens\Dashboard\update_dashboard.ps1")
    if dash_script.exists():
        try:
            proc3 = subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(dash_script)], capture_output=True, text=True, encoding='utf-8')
            if proc3.stdout:
                for line in proc3.stdout.strip().splitlines()[-10:]:
                    log(f"   [DASH] {line}")
            if proc3.returncode != 0:
                log(f"   ⚠️ [DASH ERROR] Dashboard update returned exit code {proc3.returncode}")
            else:
                log("   ✅ [STEP 3 COMPLETE] Web Dashboard & Leads updated successfully.")
        except Exception as e:
            log(f"   ❌ [STEP 3 FAILED] Exception during Dashboard update: {e}")
    else:
        log(f"   ⚠️ [STEP 3 SKIPPED] Script not found: {dash_script}")

    # -------------------------------------------------------------------------
    # STEP 4: Dispatch Refreshed Performance Card to DingTalk Mega Group
    # -------------------------------------------------------------------------
    log("\n[STEP 4/4] Dispatching Refreshed Rich Report to Mega Group on DingTalk...")
    dispatcher_script = Path(r"D:\Lens\All in one master\send_clean.js")
    if not dispatcher_script.exists():
        dispatcher_script = BASE_DIR / "01_projects" / "crm_automation" / "03_dingtalk_dispatchers" / "send_clean.js"

    if dispatcher_script.exists():
        try:
            proc4 = subprocess.run([NODE_EXE, str(dispatcher_script)], cwd=str(dispatcher_script.parent), capture_output=True, text=True, encoding='utf-8')
            if proc4.stdout:
                for line in proc4.stdout.strip().splitlines()[-5:]:
                    log(f"   [DINGTALK] {line}")
            if proc4.returncode != 0:
                log(f"   ⚠️ [DINGTALK NOTICE] Dispatcher returned exit code {proc4.returncode}")
            else:
                log("   ✅ [STEP 4 COMPLETE] Refreshed Report successfully broadcasted to DingTalk.")
        except Exception as e:
            log(f"   ⚠️ [STEP 4 NOTICE] DingTalk dispatch notice: {e}")
    else:
        log(f"   ⚠️ [STEP 4 SKIPPED] Script not found: {dispatcher_script}")

    elapsed = int(time.time() - start_ts)
    log("\n" + "=" * 75)
    log(f"🏁 4-HOURLY MASTER PIPELINE COMPLETED IN {elapsed}s")
    log("=" * 75 + "\n")

if __name__ == "__main__":
    run_pipeline()
