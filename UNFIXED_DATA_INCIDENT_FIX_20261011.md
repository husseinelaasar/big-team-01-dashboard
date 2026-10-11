# 🛠️ توثيق تشخيص وحل خلل بيانات الـ Unfixed Leads
**تاريخ التحديث:** `2026-10-11`  
**الملفات المعنية:**  
- `d:\Lens\All in one master\master_builder.py`
- `D:\Lens\All in one Master.xlsx`
- `D:\Lens\Unfixed_Teacher_Leads_Report.xlsx`
- `C:\Users\husse\Desktop\Unfixed_Teacher_Leads_Report.xlsx`

---

## 🔍 1. وصف المشكلة (Incident Description)
عند استخراج تقرير اليوم (`2026-10-11`)، ظهرت شاشة **FIXED TEACHER DASHBOARD** بجميع مؤشراتها وأرقامها بقيمة صفر (`0`):
- `TOTAL UNFIXED LEADS: 0`
- `M0 FIX %: 0.0%`
- `M1 FIX %: 0.0%`
- `M2 FIX %: 0.0%`
- `M3+ FIX %: 0.0%`
- جميع ممثلي المبيعات (21 Reps) وفرق العمل (5 Teams) أظهروا أصفاراً في كافة أعمدة التثبيت (Fixed / Unfixed / Totals).
- شيت التفاصيل `Unfixed_Teacher_Leads_Detail` كان فارغاً (يحتوي فقط على صفوف العناوين دون أي طالب).

---

## 🔬 2. التحليل الجذري للسبب (Root Cause Analysis)

بعد فحص ملف المدخلات اليومي `SS Lens Dashboard_20261011_1347.xlsx` ومقارنته بالملفات السابقة، تبيّن وجود **3 أسباب مترابطة**:

### أ. تغيّر ترتيب وترقيم أوراق العمل في تصدير 51Talk QuickBI (Sheet Index Shift)
- في تصديرات الأيام السابقة (مثل `2026-10-10`)، كان ملف الـ Lens يحتوي على 32 ورقة عمل، وكان جدول تفاصيل تثبيت المعلمين في الشيت رقم 6 باسم: `Student_Detail6`.
- في تصدير اليوم (`2026-10-11`)، تم تصدير 26 ورقة عمل فقط (بدون شيت ملخص الـ Area)، مما أدى إلى **إزاحة ترقيم الشيتات بمقدار درجة واحدة**:
  - أصبح شيت تفاصيل تثبيت المعلمين هو `Student_Detail5` بدلاً من `Student_Detail6`.
  - أصبح شيت تفاصيل استهلاك الحصص (Class Consumption) هو `Student_Detail11` بدلاً من `Student_Detail13`.
- كود `master_builder.py` كان يبحث بأسماء ثابتة جامدة (`Hardcoded Sheet Names`):
  ```python
  ft_sheet = next((s for s in ['Student_Detail6', 'Fixed_Teacher_in_Detail', 'Fixed_Teacher'] if s in xl_v.sheet_names), None)
  ```
  ولأن `Student_Detail6` غير موجود، نتج عنه `ft_sheet = None`، مما أوقف قراءة أي بيانات لـ Unfixed Leads تماماً!

### ب. خطأ تراكمي في استهلاك الحصص (Cascading Failure in Class Consumption)
- بسبب غياب `Student_Detail13`، بحث كود استهلاك الحصص عن أي شيت باسم `Student_Detail` لا يساوي `Student_Detail6`:
  ```python
  target_sheet = next((s for s in xl_v.sheet_names if 'Student_Detail' in s and s not in ('Student_Detail6', 'Student_Detail32')), None)
  ```
- فالتقط خطأً شيت `Student_Detail5` (الذي هو في الحقيقة شيت التثبيت وليس شيت استهلاك الحصص)! وبالتالي لم يجد عمود الحصص `end classes num` وأعطى صفر حصص لجميع الطلاب.

### ج. جمود شهر الكوهورت وحسابات M0/M1/M2/M3+ (Static Cohort Reference)
- كان كود تحديد الكوهورت `resolve_student_cohort` مثبتاً حساباته على شهر سبتمبر 2026 (`9 - m`):
  ```python
  diff = (2026 - y) * 12 + (9 - m)
  ```
- مع دخول شهر أكتوبر (`2026-10`)، يجب أن تكون الحسابات ديناميكية بحسب الشهر الحالي الفعلي:
  - `diff <= 0`: شريحة **M0** (الطلاب الجدد لشهر أكتوبر 2026).
  - `diff == 1`: شريحة **M1** (طلاب شهر سبتمبر 2026).
  - `diff == 2`: شريحة **M2** (طلاب شهر أغسطس 2026).
  - `diff >= 3`: شريحة **M3+** (طلاب شهر يوليو 2026 وما قبله).

---

## 💡 3. الحل المعماري الدائم المطبق (Implemented Permanent Fix)

تم تعديل كود `master_builder.py` بالتحسينات التالية:

### 1. الكشف الذكي الديناميكي عن أوراق العمل (Signature Header Column Detection)
بدلاً من الاعتماد على أرقام الشيتات الهشة (`Student_Detail5` أو `6` أو `11` أو `13`)، تمت إضافة دالة ذكية `detect_lens_sheets(filepath)` تفحص السطر الأول من كل ورقة عمل بالـ Headers الفريدة:
- **شيت التثبيت (FT Sheet):** أي ورقة تحتوي على عمود `unfixed` مع `agent` أو `team`.
- **شيت استهلاك الحصص (CC Sheet):** أي ورقة تحتوي على `end classes` أو `booked` مع `agent` أو `team`.
- **شيت البادوك وتواريخ الدفع (Pool Sheet):** أي ورقة تحتوي على `first 1v1` أو `pay time` أو `paid date`.
- تعمل الدالة بسرعة فائقة (أقل من 0.1 ثانية) باستخدام `openpyxl(read_only=True)`.

### 2. استرجاع تواريخ الدفع الأولى تلقائياً (Historical Pool Date Fallback)
إذا تم تصدير ملف Lens بدون شيت البادوك (مثل تصدير اليوم)، يقوم النظام تلقائياً بالرجوع إلى أحدث ملف Lens كامل سابق (مثل ملف الأمس `Student_Detail25`) وملف `English Club _Details`، مما ضمن مطابقة **6,174 طالباً** بنسبة نجاح **99.7%**!

### 3. حسابات كوهورت ديناميكية مرتبطة بالتقويم الفعلي
تحديث دالة `resolve_student_cohort` لتعتمد تلقائياً على `datetime.date.today().year` و `datetime.date.today().month` لحساب M0/M1/M2/M3+ بدقة في أي شهر من شهور السنة دون الحاجة لأي تعديل يدوي.

---

## 📊 4. النتائج بعد تطبيق الإصلاح وإعادة التشغيل (Audit Results)

تمت إعادة بناء جميع التقارير بنجاح، وجاءت الأرقام الفعلية لتحديث اليوم كالتالي:

| المؤشر / الشيت | القيمة قبل الإصلاح | القيمة بعد الإصلاح | الحالة |
| :--- | :---: | :---: | :---: |
| **إجمالي الطلاب المفحوصين** | 0 | **5,268** | ✅ مكتمل |
| **إجمالي الـ Unfixed Leads** | 0 | **1,146** | ✅ مصحح بالكامل |
| **غير المثبتين - شريحة M0** | 0 | **31** طالب | ✅ مصحح |
| **غير المثبتين - شريحة M1** | 0 | **65** طالب | ✅ مصحح |
| **غير المثبتين - شريحة M2** | 0 | **68** طالب | ✅ مصحح |
| **غير المثبتين - شريحة M3+** | 0 | **982** طالب | ✅ مصحح |
| **سجلات شيت التفاصيل** | 0 | **1,146** صف تفصيلي | ✅ مصحح |
| **استهلاك الحصص (Class Consumption)** | 0 | **5,048** طالب (متوسط 3.07 حصة) | ✅ مصحح |

### 📁 الملفات التي تم تحديثها وحفظها:
1. `D:\Lens\All in one Master.xlsx` (456 KB)
2. `D:\Lens\Unfixed_Teacher_Leads_Report.xlsx`
3. `C:\Users\husse\Desktop\All in one Master.xlsx`
4. `C:\Users\husse\Desktop\Unfixed_Teacher_Leads_Report.xlsx`
5. `C:\Users\husse\OneDrive\Desktop\Unfixed_Teacher_Leads_Report.xlsx`
6. `D:\Lens\Dashboard\Unfixed_Teacher_Leads_Report.xlsx`
