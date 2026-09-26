import os, sys, zipfile, csv
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

excel_path = r'D:\Lens\Dashboard\Dashboard_Input_Files\SS Lens Dashboard_20260926_1237.xlsx'
output_dir = r'D:\Lens\Dashboard\leads\high_potential'
os.makedirs(output_dir, exist_ok=True)

print(f"Reading {excel_path}...")

with zipfile.ZipFile(excel_path, 'r') as z:
    # 1. Read shared strings
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        ns = {'d': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        for si in root.findall('d:si', ns):
            t = si.find('d:t', ns)
            if t is not None:
                ss.append(t.text or '')
            else:
                ss.append(''.join([t_el.text or '' for t_el in si.findall('.//d:t', ns)]))

    # 2. Find Student_Detail13 sheet
    wb_root = ET.fromstring(z.read('xl/workbook.xml'))
    ns = {'d': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    rId = None
    for s in wb_root.find('d:sheets', ns).findall('d:sheet', ns):
        if s.attrib.get('name') == 'Student_Detail13':
            rId = s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
            break

    rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    ns_rel = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}
    target_file = None
    for rel in rels_root.findall('r:Relationship', ns_rel):
        if rel.attrib.get('Id') == rId:
            target_file = 'xl/' + rel.attrib.get('Target').lstrip('/')
            break

    sheet_root = ET.fromstring(z.read(target_file))
    sheet_data = sheet_root.find('d:sheetData', ns)

    rows_iter = iter(sheet_data.findall('d:row', ns))
    header_row = next(rows_iter)
    
    # Read headers
    headers = []
    for c in header_row.findall('d:c', ns):
        t = c.attrib.get('t')
        v = c.find('d:v', ns)
        val = v.text if v is not None else ''
        if t == 's' and val.isdigit():
            val = ss[int(val)]
        headers.append(val)
    
    print("Headers:", headers)

    col_agent = headers.index('Agent') if 'Agent' in headers else 0
    col_team = headers.index('TEAM') if 'TEAM' in headers else 1
    col_sid = headers.index('Student id') if 'Student id' in headers else 3
    col_classes = headers.index('end classes num') if 'end classes num' in headers else 5
    col_unattended = headers.index('booked‑unattended Class Num') if 'booked‑unattended Class Num' in headers else 6

    students_by_rep = {}
    total_students = 0
    high_pot_students = 0

    for r in rows_iter:
        max_idx = max(col_agent, col_team, col_sid, col_classes, col_unattended)
        row_vals = [''] * (max_idx + 10)
        for c in r.findall('d:c', ns):
            cell_ref = c.attrib.get('r', '')
            col_letters = ''.join([ch for ch in cell_ref if ch.isalpha()])
            col_idx = 0
            for char in col_letters:
                col_idx = col_idx * 26 + (ord(char.upper()) - ord('A') + 1)
            col_idx -= 1
            
            t = c.attrib.get('t')
            v = c.find('d:v', ns)
            val = v.text if v is not None else ''
            if t == 's' and val.isdigit():
                val = ss[int(val)]
            if col_idx < len(row_vals):
                row_vals[col_idx] = val

        agent = row_vals[col_agent].strip()
        if not agent or agent.lower() == 'total':
            continue

        team = row_vals[col_team].strip()
        student_id = row_vals[col_sid].strip()
        
        try:
            classes_done = float(row_vals[col_classes])
        except:
            classes_done = 0.0

        try:
            unattended = float(row_vals[col_unattended])
        except:
            unattended = 0.0

        total_students += 1

        # Students who attended MORE THAN ONE class (> 1)
        if classes_done > 1:
            high_pot_students += 1
            if agent not in students_by_rep:
                students_by_rep[agent] = []
            students_by_rep[agent].append({
                'agent': agent,
                'team': team,
                'student_id': student_id,
                'classes_completed': int(classes_done),
                'unattended_booked': int(unattended),
                'priority_score': int(classes_done * 2 - unattended)
            })

print(f"Total students parsed: {total_students}")
print(f"High-Potential students (>1 class): {high_pot_students} across {len(students_by_rep)} reps")

# Export master file and per-rep files
master_csv = os.path.join(output_dir, 'MASTER_HIGH_POTENTIAL_STUDENTS.csv')
with open(master_csv, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(['Agent', 'Team', 'Student ID', 'Classes Completed (Month)', 'Booked Unattended', 'Priority Score'])
    for rep, stds in sorted(students_by_rep.items()):
        stds.sort(key=lambda x: x['classes_completed'], reverse=True)
        for s in stds:
            writer.writerow([s['agent'], s['team'], s['student_id'], s['classes_completed'], s['unattended_booked'], s['priority_score']])

print(f"Master file saved: {master_csv}")

# Export per-rep CSVs
for rep, stds in students_by_rep.items():
    rep_csv = os.path.join(output_dir, f"{rep}_target_students.csv")
    stds.sort(key=lambda x: x['classes_completed'], reverse=True)
    with open(rep_csv, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(['# High Potential Target Students (>1 class attended) - 51Talk Big Team 01'])
        writer.writerow([f'# Representative: {rep} | Total High Potential: {len(stds)}'])
        writer.writerow(['Student ID', 'Classes Completed', 'Booked Unattended', 'Priority Score'])
        for s in stds:
            writer.writerow([s['student_id'], s['classes_completed'], s['unattended_booked'], s['priority_score']])

print("All per-rep target student lists generated successfully!")
