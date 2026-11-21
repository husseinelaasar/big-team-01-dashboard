"""
51Talk Live CRM Automated SOP Extractor (Production Standard)
=============================================================
Extracts the complete SOP details (5,000+ student task rows) and round
summaries directly from the freshly exported Full Master Workbook
('SS Lens Dashboard_*.xlsx') into '海外NEW_SOP_<timestamp>.xlsx'.

CRITICAL REQUIREMENT (User Directive 2026-11-19):
- Unmerge all merged cells in 'Unnamed_7uwaifkp' and propagate values
  across all cells in each merged range.
- Column mapping:
    Col A (index 0): org_name 小组
    Col B (index 1): useraccount 员工 (Rep Name)
    Col C (index 2): stu_id 学员id (Student ID)
    Col D (index 3): sop_code SOP代码
    Col E (index 4): sop_name SOP名称 (SOP Task Type)
    Col F (index 5): sop_status SOP状态 (SOP Status)
    Col G (index 6): expire_time 到期时间 (Expiry / Validity Date)
    Col H (index 7): add_time 生成时间 (Addition Date)
    Col I (index 8): done_time 完成时间
- Generates '海外NEW_SOP_<timestamp>.xlsx' with unmerged '明细表'.
"""

import sys
import os
import re
import datetime
import openpyxl

def extract_sop(master_path: str, output_dir: str) -> str:
    if not os.path.exists(master_path):
        raise FileNotFoundError(f"Master file not found: {master_path}")

    print(f"   [SOP Extractor] Reading Master Workbook: {os.path.basename(master_path)}...")
    wb_master = openpyxl.load_workbook(master_path, data_only=True)

    sop_details_sheet = None
    sop_summary_sheet = None

    # Locate SOP Details and Summary sheets inside Master
    for sname in wb_master.sheetnames:
        if sname == 'Unnamed_7uwaifkp' or '7uwaifkp' in sname:
            sop_details_sheet = wb_master[sname]
        elif sname == 'Unnamed_zd1qadkn' or 'zd1qadkn' in sname:
            sop_summary_sheet = wb_master[sname]

    if not sop_details_sheet:
        for sname in wb_master.sheetnames:
            ws = wb_master[sname]
            first_row = [str(c or '').lower() for c in next(ws.iter_rows(max_row=1, values_only=True), [])]
            if any('sop_code' in c or 'sop代码' in c for c in first_row):
                sop_details_sheet = ws
                break

    if not sop_details_sheet:
        raise ValueError("Could not find SOP details sheet ('Unnamed_7uwaifkp') inside Master Workbook!")

    print(f"   [SOP Extractor] Found SOP Details in '{sop_details_sheet.title}' ({sop_details_sheet.max_row} rows).")

    # CRITICAL: Unmerge all merged cells and propagate values
    merged_ranges = list(sop_details_sheet.merged_cells.ranges)
    if merged_ranges:
        print(f"   [SOP Extractor] Unmerging {len(merged_ranges)} merged cell ranges and propagating values...")
        for rng in merged_ranges:
            top_left_val = sop_details_sheet.cell(row=rng.min_row, column=rng.min_col).value
            sop_details_sheet.unmerge_cells(str(rng))
            for r in range(rng.min_row, rng.max_row + 1):
                for c in range(rng.min_col, rng.max_col + 1):
                    sop_details_sheet.cell(row=r, column=c, value=top_left_val)

    wb_new = openpyxl.Workbook()

    # Sheet 1: Summary
    ws1 = wb_new.active
    ws1.title = "未命名_hi75tuqg"
    if sop_summary_sheet:
        for row in sop_summary_sheet.iter_rows(values_only=True):
            ws1.append(list(row))

    # Sheet 2: Completion Mix
    ws2 = wb_new.create_sheet(title="未命名_lahz2maq")
    if 'SOP_Completion_Mix' in wb_master.sheetnames:
        for row in wb_master['SOP_Completion_Mix'].iter_rows(values_only=True):
            ws2.append(list(row))

    # Sheet 3: 明细表 (Official production sheet name expected by Master Builder)
    ws3 = wb_new.create_sheet(title="明细表")
    for row in sop_details_sheet.iter_rows(values_only=True):
        ws3.append(list(row))

    # Extract timestamp from filename
    base_name = os.path.basename(master_path)
    m = re.search(r'(\d{8}_\d{4})', base_name)
    ts = m.group(1) if m else datetime.datetime.now().strftime('%Y%m%d_%H%M')

    out_name = f"海外NEW_SOP_{ts}.xlsx"
    out_path = os.path.join(output_dir, out_name)

    wb_new.save(out_path)

    # Sync modification timestamp with source master file
    try:
        src_mtime = os.path.getmtime(master_path)
        os.utime(out_path, (src_mtime, src_mtime))
    except Exception:
        pass

    size_kb = os.path.getsize(out_path) / 1024
    print(f"   [SOP Extractor] Successfully created: {out_name} ({size_kb:.1f} KB, {ws3.max_row} rows fully unmerged)")
    return out_path

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python extract_sop_from_master.py <master_path> <output_dir>")
        sys.exit(1)

    master = sys.argv[1]
    out_dir = sys.argv[2]
    extract_sop(master, out_dir)
