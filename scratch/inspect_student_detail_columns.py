import os
import glob
import zipfile
import xml.etree.ElementTree as ET

files = glob.glob(r"D:\Lens\Dashboard\Dashboard_Input_Files\*Student-Detail*.xlsx")
if not files:
    print("No Student-Detail file found.")
    exit(1)

path = files[0]
print(f"Reading: {os.path.basename(path)}")

with zipfile.ZipFile(path, 'r') as z:
    # shared strings
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            if t is not None and t.text:
                ss.append(t.text)
            else:
                txts = [elem.text for elem in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if elem.text]
                ss.append("".join(txts))
                
    # sheet1
    tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
    
    headers = {}
    for c in rows[0].findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
        r = c.get('r')
        col = ''.join([ch for ch in r if ch.isalpha()])
        t = c.get('t')
        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        val = v.text if v is not None else ''
        if t == 's' and val:
            val = ss[int(val)]
        headers[col] = val
        
    print("Headers:", headers)
    
    # Check outside pool statistics
    outside_zero_pts = 0
    outside_zero_cons = 0
    outside_both_zero = 0
    total_outside = 0
    
    sample_rows = []
    
    for row in rows[1:]:
        cells = {}
        for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            r = c.get('r')
            col = ''.join([ch for ch in r if ch.isalpha()])
            t = c.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if t == 's' and val:
                val = ss[int(val)]
            cells[col] = val
            
        pool = cells.get('E', '')
        pool_detail = cells.get('F', '')
        pts = float(cells.get('L', 0) or 0)
        this_cons = float(cells.get('N', 0) or 0)
        last_cons = float(cells.get('M', 0) or 0)
        
        is_outside = ('outside' in pool.lower() or 'outside' in pool_detail.lower())
        if is_outside:
            total_outside += 1
            if pts == 0:
                outside_zero_pts += 1
            if this_cons == 0:
                outside_zero_cons += 1
            if pts == 0 and this_cons == 0:
                outside_both_zero += 1
                if len(sample_rows) < 5:
                    sample_rows.append(cells)
                    
    print(f"\nTotal Outside Pool Students: {total_outside}")
    print(f"Outside Pool & Points == 0: {outside_zero_pts}")
    print(f"Outside Pool & This Month Cons == 0: {outside_zero_cons}")
    print(f"Outside Pool & (Points == 0 AND Cons == 0): {outside_both_zero}")
    
    print("\nSample row of outside zero:")
    if sample_rows:
        for k, v in sample_rows[0].items():
            print(f"  Col {k} ({headers.get(k)}): {v}")
