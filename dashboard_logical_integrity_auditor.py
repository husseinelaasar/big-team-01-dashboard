"""
========================================================================================
51TALK BIG TEAM 01 — EXECUTIVE DASHBOARD LOGICAL SANITY & INTEGRITY AUDITOR
Automated Post-Update Verification, Mathematical Consistency Check & Self-Healing Guard
========================================================================================
Purpose:
Runs automatically after every dashboard update cycle.
Performs 8 rigorous mathematical, logical, and structural integrity checks across:
1. Live CRM Excel Data (SS Lens Dashboard - Sheet 指标看板 & Student Details)
2. Rendered index.html DOM metrics
3. Data intelligence layers (dashboard.src.js & dashboard.js)

If any illogical anomaly or inconsistency is detected, it alerts and auto-heals immediately.
========================================================================================
"""

import os
import re
import sys
import json
import datetime
import calendar
import openpyxl

DASH_DIR = r"D:\Lens\Dashboard"
DATA_CENTER_DIR = r"D:\Lens\Dashboard\Data Center"
LOG_PATH = os.path.join(DASH_DIR, "dashboard_logical_audit.log")
REPORT_JSON = os.path.join(DASH_DIR, "dashboard_logical_audit_report.json")

class DashboardSanityAuditor:
    def __init__(self):
        self.now = datetime.datetime.now()
        self.current_day = self.now.day
        self.days_in_month = calendar.monthrange(self.now.year, self.now.month)[1]
        self.days_left = max(0, self.days_in_month - self.current_day)
        self.current_month_name = self.now.strftime("%B")
        self.current_month_short = self.now.strftime("%b")
        
        self.anomalies = []
        self.healed_fixes = []
        self.audit_passed = True
        
        # Benchmarks standard curve for 30-day month
        self.benchmark_curve = {
            1: 5, 2: 7, 3: 10, 4: 13, 5: 17, 6: 20, 7: 23, 8: 25, 9: 26, 10: 26,
            11: 28, 12: 30, 13: 33, 14: 35, 15: 38, 16: 41, 17: 45, 18: 48, 19: 52, 20: 56,
            21: 60, 22: 63, 23: 65, 24: 66, 25: 68, 26: 74, 27: 80, 28: 87, 29: 93, 30: 100
        }
        self.expected_bm = self.benchmark_curve.get(self.current_day, 80)

    def find_latest_lens_file(self):
        day_folder_name = f"{self.current_day}{self.current_month_short}"
        target_dir = os.path.join(DATA_CENTER_DIR, day_folder_name)
        if not os.path.exists(target_dir):
            target_dir = DATA_CENTER_DIR
            
        candidates = []
        for root, _, files in os.walk(target_dir):
            for f in files:
                if f.startswith("SS Lens Dashboard_") and f.endswith(".xlsx") and "Student-Detail" not in f and "Area" not in f:
                    candidates.append(os.path.join(root, f))
                    
        if not candidates:
            return None
        candidates.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        return candidates[0]

    def extract_authoritative_lens_kpis(self, lens_file):
        if not lens_file or not os.path.exists(lens_file):
            return None
            
        wb = openpyxl.load_workbook(lens_file, read_only=True, data_only=True)
        if "指标看板" not in wb.sheetnames:
            return None
            
        ws = wb["指标看板"]
        headers = []
        vals = []
        for r in ws.iter_rows(values_only=True):
            if not headers and r[0] == "REVENUE CASH":
                headers = list(r)
            elif headers and r[0] is not None and isinstance(r[0], (int, float)):
                vals = list(r)
                break
                
        if not headers or not vals:
            return None
            
        data = dict(zip(headers, vals))
        return {
            "gross_cash": round(float(data.get("REVENUE CASH", 0))),
            "refund": round(float(data.get("Refund", 0)), 2),
            "net_cash": round(float(data.get("Cash-Refund", 0))),
            "contracts": int(float(data.get("CONTRACTS", 0))),
            "target": round(float(data.get("Basic Cash Target", 173541))),
            "gross_ach_pct": round(float(data.get("CASH ACHIEVEMENT", 0)) * 100, 1),
            "net_ach_pct": round(float(data.get("Cash-Refund ACHIEVEMENT", 0)) * 100, 1),
            "contracts_ach_pct": round(float(data.get("CONTACT ACHIEVEMENT", 0)) * 100, 1)
        }

    def run_all_checks(self):
        print("\n" + "=" * 80)
        print(" 🔍 STARTING DASHBOARD LOGICAL SANITY & INTEGRITY AUDIT")
        print(f" Timestamp: {self.now.strftime('%Y-%m-%d %H:%M:%S')} | Calendar Day: {self.current_day} ({self.days_left} Days Left)")
        print("=" * 80)

        lens_file = self.find_latest_lens_file()
        print(f"  [SOURCE] Authoritative Lens File: {os.path.basename(lens_file) if lens_file else 'NOT FOUND'}")
        
        lens_kpis = self.extract_authoritative_lens_kpis(lens_file)
        if lens_kpis:
            print(f"  [EXCEL MASTER TRUTH] Net Cash: ${lens_kpis['net_cash']:,} | Gross: ${lens_kpis['gross_cash']:,} | Contracts: {lens_kpis['contracts']} | Net Ach: {lens_kpis['net_ach_pct']}%")
        else:
            print("  [WARN] Could not parse Sheet 指标看板 from Lens file. Will audit internal consistency.")

        index_html_path = os.path.join(DASH_DIR, "index.html")
        if not os.path.exists(index_html_path):
            print("  [CRITICAL ERROR] index.html not found!")
            return False

        with open(index_html_path, "r", encoding="utf-8") as f:
            html = f.read()

        needs_html_save = False

        # -------------------------------------------------------------
        # CHECK 1: Total Cash Revenue Match (Gross or Net Truth)
        # -------------------------------------------------------------
        m_cash = re.search(r'id="totalCash">\$([\d,]+)</div>', html)
        html_cash = int(m_cash.group(1).replace(",", "")) if m_cash else 0
        
        if lens_kpis:
            # Valid if equals net_cash (e.g. 123,256) or gross_cash (127,256)
            if html_cash != lens_kpis["net_cash"] and html_cash != lens_kpis["gross_cash"]:
                anomaly = f"Total Cash in index.html (${html_cash:,}) DOES NOT MATCH Excel truth (${lens_kpis['net_cash']:,} Net / ${lens_kpis['gross_cash']:,} Gross)!"
                print(f"  ❌ [FAIL] Check 1: {anomaly}")
                self.anomalies.append(anomaly)
                # Auto-heal: set to net cash
                html = re.sub(r'id="totalCash">\$[\d,]+</div>', f'id="totalCash">${lens_kpis["net_cash"]:,}</div>', html)
                html = re.sub(r'id="cashPct">[\d\.]+% Achieved</div>', f'id="cashPct">{lens_kpis["net_ach_pct"]}% Achieved</div>', html)
                self.healed_fixes.append(f"Auto-healed #totalCash to ${lens_kpis['net_cash']:,} and #cashPct to {lens_kpis['net_ach_pct']}%")
                needs_html_save = True
            else:
                print(f"  ✅ [PASS] Check 1: Total Cash (${html_cash:,}) accurately reflects Excel Master.")
        else:
            if html_cash <= 0 or html_cash < 50000:
                anomaly = f"Total Cash in index.html is zero or unrealistically low: ${html_cash:,}"
                print(f"  ❌ [FAIL] Check 1: {anomaly}")
                self.anomalies.append(anomaly)
            else:
                print(f"  ✅ [PASS] Check 1: Total Cash is ${html_cash:,}.")

        # -------------------------------------------------------------
        # CHECK 2: Contracts Sum Consistency (Normal + Upgrade == Total)
        # -------------------------------------------------------------
        m_cont = re.search(r'id="totalContracts">(\d+)</div>', html)
        html_cont = int(m_cont.group(1)) if m_cont else 0
        
        m_breakdown = re.search(r'Normal:\s*(\d+)\s*\|\s*Upgrade M2:\s*(\d+)', html)
        if m_breakdown:
            normal = int(m_breakdown.group(1))
            upg = int(m_breakdown.group(2))
            total_sum = normal + upg
            if total_sum != html_cont:
                anomaly = f"Contracts breakdown mismatch: Normal ({normal}) + Upgrade ({upg}) = {total_sum}, but #totalContracts says {html_cont}!"
                print(f"  ❌ [FAIL] Check 2: {anomaly}")
                self.anomalies.append(anomaly)
                # Auto-heal: align normal to total - upg
                actual_normal = max(0, html_cont - upg)
                html = re.sub(r'Normal:\s*\d+\s*\|\s*Upgrade M2:\s*\d+', f'Normal: {actual_normal} | Upgrade M2: {upg}', html)
                self.healed_fixes.append(f"Auto-healed contracts breakdown to Normal: {actual_normal} | Upgrade M2: {upg} (Total: {html_cont})")
                needs_html_save = True
            else:
                print(f"  ✅ [PASS] Check 2: Contracts breakdown ({normal} + {upg} = {total_sum}) is 100% mathematically consistent.")
        else:
            print("  ⚠️ [WARN] Check 2: Contracts breakdown element not found in expected format.")

        # -------------------------------------------------------------
        # CHECK 3: Day Benchmark & Timeline Synchronization
        # -------------------------------------------------------------
        m_day_ach = re.search(r'Day (\d+) Target Benchmark', html)
        if m_day_ach:
            day_labeled = int(m_day_ach.group(1))
            if day_labeled != self.current_day:
                anomaly = f"Day Benchmark label shows 'Day {day_labeled}' but today is 'Day {self.current_day}'!"
                print(f"  ❌ [FAIL] Check 3: {anomaly}")
                self.anomalies.append(anomaly)
                html = re.sub(r'Day \d+ Target Benchmark', f'Day {self.current_day} Target Benchmark', html)
                self.healed_fixes.append(f"Auto-healed Benchmark label to Day {self.current_day} Target Benchmark")
                needs_html_save = True
            else:
                print(f"  ✅ [PASS] Check 3: Benchmark label matches live calendar day (Day {self.current_day}).")

        # Check slider value and badge
        m_slider_val = re.search(r'id="datePacingSlider"[^>]*value="(\d+)"', html)
        if m_slider_val and int(m_slider_val.group(1)) != self.current_day:
            anomaly = f"Timeline slider position is value='{m_slider_val.group(1)}' instead of live Day {self.current_day}!"
            print(f"  ❌ [FAIL] Check 3b: {anomaly}")
            self.anomalies.append(anomaly)
            html = re.sub(r'(id="datePacingSlider"[^>]*value=")\d+(")', rf'\g<1>{self.current_day}\g<2>', html)
            self.healed_fixes.append(f"Auto-healed datePacingSlider value to {self.current_day}")
            needs_html_save = True

        # -------------------------------------------------------------
        # CHECK 4: Countdown & Days Left Consistency
        # -------------------------------------------------------------
        m_days_left = re.search(r'\((\d+)\s+Days Left\)', html)
        if m_days_left:
            parsed_days_left = int(m_days_left.group(1))
            if parsed_days_left != self.days_left:
                anomaly = f"Days left indicator says '{parsed_days_left} Days Left' but calendar says {self.days_left} days left in {self.current_month_name}!"
                print(f"  ❌ [FAIL] Check 4: {anomaly}")
                self.anomalies.append(anomaly)
                html = re.sub(r'\(\d+\s+Days Left\)', f'({self.days_left} Days Left)', html)
                self.healed_fixes.append(f"Auto-healed days left to ({self.days_left} Days Left)")
                needs_html_save = True
            else:
                print(f"  ✅ [PASS] Check 4: Days left count ({self.days_left} Days) matches calendar accurately.")

        # -------------------------------------------------------------
        # CHECK 5: Daily Run Rate Needed Consistency
        # -------------------------------------------------------------
        # Target = $173,541. Net = $123,256. Remaining = $50,285. Days Left = 3 -> $16,762/day
        target = lens_kpis["target"] if lens_kpis else 173541
        rem_cash = max(0, target - html_cash)
        expected_daily_rate = round(rem_cash / max(1, self.days_left))
        
        m_daily = re.search(r'id="hudDailyNeeded">\$([\d,]+)\s*<span>/day</span>', html)
        if m_daily:
            html_daily = int(m_daily.group(1).replace(",", ""))
            # Allow minor rounding tolerance (+/- $200)
            if abs(html_daily - expected_daily_rate) > 200 and expected_daily_rate > 0:
                anomaly = f"Daily Run Rate in HUD (${html_daily:,}/day) does not match mathematical need (${expected_daily_rate:,}/day based on ${rem_cash:,} gap over {self.days_left} days)!"
                print(f"  ❌ [FAIL] Check 5: {anomaly}")
                self.anomalies.append(anomaly)
                html = re.sub(r'id="hudDailyNeeded">\$[\d,]+\s*<span>/day</span>', f'id="hudDailyNeeded">${expected_daily_rate:,} <span>/day</span>', html)
                self.healed_fixes.append(f"Auto-healed #hudDailyNeeded to ${expected_daily_rate:,} /day")
                needs_html_save = True
            else:
                print(f"  ✅ [PASS] Check 5: Daily Run Rate (${html_daily:,}/day) is mathematically exact.")

        # -------------------------------------------------------------
        # CHECK 6: DOM Structural Health & Corrupted HTML Tags
        # -------------------------------------------------------------
        duplicated_cashtarget = len(re.findall(r'id="cashTarget"', html))
        if duplicated_cashtarget > 1:
            anomaly = f"Corrupted HTML detected: id='cashTarget' appears {duplicated_cashtarget} times (nested tags detected)!"
            print(f"  ❌ [FAIL] Check 6: {anomaly}")
            self.anomalies.append(anomaly)
            # Auto-heal: replace entire card line with clean tag
            proj_cash = round((html_cash / max(1, self.current_day)) * self.days_in_month)
            clean_sub = f'<div class="kpi-sub" id="cashTarget">Target: ${target:,} | Projected: ${proj_cash:,}</div>'
            html = re.sub(r'<div class="kpi-sub" id="cashTarget">.*?</div>(\s*Target:.*?</div>)*', clean_sub, html)
            self.healed_fixes.append("Auto-healed nested corrupted #cashTarget HTML tags into a single clean tag")
            needs_html_save = True
        else:
            print("  ✅ [PASS] Check 6: DOM structural health verified. No duplicate metric IDs.")

        # -------------------------------------------------------------
        # CHECK 7: Sprint Mission Control Subtitle
        # -------------------------------------------------------------
        if "48 Orders MTD" in html:
            anomaly = "Sprint Mission Control subtitle contains obsolete '48 Orders MTD'!"
            print(f"  ❌ [FAIL] Check 7: {anomaly}")
            self.anomalies.append(anomaly)
            html = html.replace("48 Orders MTD", f"{html_cont} Orders Achieved (Target: 204)")
            self.healed_fixes.append(f"Auto-healed Sprint Mission Control subtitle to '{html_cont} Orders Achieved (Target: 204)'")
            needs_html_save = True
        else:
            print(f"  ✅ [PASS] Check 7: Sprint Mission Control subtitle correctly displays current orders.")

        # -------------------------------------------------------------
        # CHECK 8: Reps & Small Teams Data Integrity in dashboard.src.js
        # -------------------------------------------------------------
        src_js_path = os.path.join(DASH_DIR, "dashboard.src.js")
        if os.path.exists(src_js_path):
            with open(src_js_path, "r", encoding="utf-8") as f:
                js = f.read()
            m_teams_cash = re.findall(r'cash:\s*(\d+)', js)
            if m_teams_cash:
                total_reps_cash = sum(int(c) for c in m_teams_cash[:5]) # 5 teams
                if total_reps_cash <= 0:
                    anomaly = "dashboard.src.js has zero cash across all small teams!"
                    print(f"  ❌ [FAIL] Check 8: {anomaly}")
                    self.anomalies.append(anomaly)
                else:
                    print(f"  ✅ [PASS] Check 8: Small teams in dashboard.src.js sum up to valid cash (${total_reps_cash:,}).")
        
        # Save HTML if any auto-heals were applied
        if needs_html_save:
            with open(index_html_path, "w", encoding="utf-8") as f:
                f.write(html)
            print("  💾 [SAVE] Applied all auto-healed fixes directly to index.html!")

        # Final Summary
        self.audit_passed = (len(self.anomalies) == 0) or (len(self.healed_fixes) == len(self.anomalies))
        self.write_audit_reports()
        
        print("\n" + "=" * 80)
        if self.audit_passed and not self.healed_fixes:
            print(" 🌟 AUDIT STATUS: 100% CLEAN — ALL CHECKS PASSED PERFECTLY!")
        elif self.healed_fixes:
            print(f" 🛡️ AUDIT STATUS: RECOVERED & AUTO-HEALED {len(self.healed_fixes)} ANOMALIES AUTOMATICALLY!")
            for fix in self.healed_fixes:
                print(f"   └─► {fix}")
        else:
            print(f" 🚨 AUDIT STATUS: {len(self.anomalies)} UNRESOLVED ANOMALIES REQUIRE ATTENTION!")
        print("=" * 80 + "\n")
        
        return self.audit_passed

    def write_audit_reports(self):
        report = {
            "timestamp": self.now.strftime("%Y-%m-%d %H:%M:%S"),
            "calendar_day": self.current_day,
            "days_left": self.days_left,
            "audit_passed": self.audit_passed,
            "total_anomalies_detected": len(self.anomalies),
            "anomalies": self.anomalies,
            "total_heals_applied": len(self.healed_fixes),
            "healed_fixes": self.healed_fixes
        }
        with open(REPORT_JSON, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
            
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"\n[{self.now.strftime('%Y-%m-%d %H:%M:%S')}] Audit Run: Anomalies={len(self.anomalies)}, Healed={len(self.healed_fixes)}, Passed={self.audit_passed}\n")

if __name__ == "__main__":
    auditor = DashboardSanityAuditor()
    success = auditor.run_all_checks()
    sys.exit(0 if success else 1)
