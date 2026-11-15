# 🛠️ توثيق التحديثات الهيكلية واستبعاد الموظفين وتطوير تقرير استهلاك الحصص
## Master Operational Update: Remaining Points Integration & Complete Rep Exclusion Architecture

**القطاع:** 51Talk Middle East — Big Team 01  
**Senior Manager:** Saber Hussien  
**تاريخ التوثيق والاعتماد:** 14 نوفمبر 2026 (`2026-11-14`)  
**الحالة:** **مطبق ومفعل بنجاح 100% (Production Standard)** ✅  
**الملفات البرمجية والتنفيذية المعنية:**
* `D:\Lens\All in one master\master_builder.py` (المحرك الرئيسي لتوليد الإكسيل الموحد)
* `C:\Users\husse\Desktop\AI\01_projects\all_in_one_master\master_builder.py` (النسخة البرمجية المتزامنة)
* `C:\Users\husse\Desktop\AI\01_projects\crm_automation\02_master_builders\master_builder.py` (نسخة الأتمتة الموحدة)
* `D:\Lens\Dashboard\update_dashboard.ps1` (سكريبت تحديث الداشبورد التنفيذي)
* `C:\Users\husse\Desktop\AI\01_projects\big_team_dashboard\update_dashboard.ps1` (نسخة الداشبورد المتزامنة)
* `D:\Lens\Data\student_exclusions.json` (قاعدة بيانات الاستبعادات والقائمة السوداء الرسمية)
* `D:\Lens\All in one Master.xlsx` (ملف الماستر الشامل لجميع الموديولات)
* `D:\Lens\Dashboard\Dashboard_Input_Files\Class_Consumption_Leads_Report.xlsx` (التقرير الفرعي المعتمد)

---

## 1. ملخص أهداف التحديث (Executive Summary)

تم تطبيق تحديثين محوريين بناءً على المتطلبات التشغيلية المباشرة لقطاع **Big Team 01**:

1. **إدراج رصيد النقاط المتبقية (`Remaining Points`) للعملاء:**  
   إضافة خانة مخصصة توضح رصيد الحصص المتبقي لكل طالب مباشرة بعد خانة الحصص المكتملة (`Classes Attended`) في تقرير استهلاك الحصص التفصيلي (`Class_Consumption_Leads_Detail`)، وذلك لتمكين مسؤولي المبيعات (SS Reps) والمديرين من اتخاذ قرارات الحجز والإنقاذ اللحظية بناءً على الرصيد الفعلي للطالب.

2. **الاستبعاد الكلي والنهائي للموظف `EGSS-ehabzaky01`:**  
   رفع اسم الموظف من هيكل فريق `ME-EGSS05`، وحظر قراءة أو احتساب أي بيانات أو مهام أو ليدز تخصه عبر كافة أقسام التقرير الماستر، مع إعادة موازنة قوام الفريق ليصبح 6 موظفين بدلاً من 7، وإجمالي موظفي القطاع 18 موظفاً بدلاً من 19.

---

## 2. التفاصيل الفنية للتحديث الأول: إضافة عامود `Remaining Points`

### أ. مصدر البيانات الحية (Data Lineage & Sourcing)
* **الملف المصدر:** ملف مركز البيانات الخام اليومي: `SS Lens Dashboard_20261114_1142.xlsx`.
* **الشيت المعتمد:** صفحة الـ Pool الرسمية **`Student_Detail19`**.
* **العامود المستخرج:** عامود **`current point`** (رصيد الحصص الفعلي المتاح للطالب).
* **آلية الربط البرمجي:**
  * تم تطوير دالة `detect_lens_sheets` لتحديد صفحة الـ Pool التي تتضمن حقل `current point` بأولوية قصوى.
  * تم بناء قاموس هيدروليكي في الذاكرة `STUDENT_REMAINING_POINTS_MAP` يربط كل `student id` برصيده الصحيح كرقم صحيح (`Integer`).
  * حققت عملية الربط تطابقاً بنسبة **100%** لجميع الطلاب النشطين البالغ عددهم **4,098 طالباً** بعد تطبيق الاستبعادات.

### ب. هيكل الأعمدة الجديد لشيت `Class_Consumption_Leads_Detail` (12 عاموداً)

```mermaid
flowchart LR
    A["A: Small Team Code"] --> B["B: SS Representative"]
    B --> C["C: Student ID"]
    C --> D["D: Pool Cohort"]
    D --> E["E: Cohort Month"]
    E --> F["F: Classes Attended"]
    F --> G["G: Remaining Points (جديد)"]
    G --> H["H: Booked Unattended"]
    H --> I["I: Current Tier"]
    I --> J["J: Next Target Tier"]
    J --> K["K: Classes Needed"]
    K --> L["L: Consumption Action"]
```

| ترتيب العامود | اسم العامود (Header) | نوع البيانات | التنسيق البصري |
| :---: | :--- | :---: | :--- |
| **A (1)** | Small Team Code | نصي | محاذاة وسط + لون الفريق المعتمد |
| **B (2)** | SS Representative | نصي | محاذاة يسار |
| **C (3)** | Student ID | معرّف رقمي | محاذاة وسط |
| **D (4)** | Pool Cohort | نصي (M0/M1/M2/M3+) | محاذاة وسط |
| **E (5)** | Cohort Month | تاريخ التكتل | محاذاة وسط |
| **F (6)** | Classes Attended | رقمي (عدد الحصص) | محاذاة وسط + تمييز الحالات الصفرية |
| **G (7)** | **Remaining Points** ⬅️ | **رقمي (الرصيد المتبقي)** | **خط عريض (Bold) + محاذاة وسط + تنسيق `#,#0`** |
| **H (8)** | Booked Unattended | رقمي (محجوز غير مكتمل) | محاذاة وسط |
| **I (9)** | Current Tier | الفئة الحالية (0% - >=15%) | محاذاة وسط |
| **J (10)** | Next Target Tier | الفئة المستهدفة التالية | محاذاة وسط |
| **K (11)** | Classes Needed for Next Tier | عدد الحصص المطلوبة | محاذاة وسط + خط عريض |
| **L (12)** | Consumption Action | الإجراء التشغيلي الموصى به | محاذاة يسار + شارات الطوارئ والأداء |

### ج. موازنة الكروت ثلاثية الأبعاد (3D KPI Cards Deck)
تم تعديل عرض الكروت العلوية لتمتد على **12 عاموداً** بتوازن هندسي كامل (3 أعمدة لكل كارت):
* **Card 1 (Cols A - C):** `📋 TOTAL ACTIVE STUDENTS` (إجمالي الطلاب النشطين).
* **Card 2 (Cols D - F):** `🚨 ZERO CONSUMPTION LEADS` (ليدز الاستهلاك الصفري).
* **Card 3 (Cols G - I):** `🎯 LEADS NEEDING PROMOTION` (ليدز الترقية بين الفئات).
* **Card 4 (Cols J - L):** `🏆 TOP TIER ACHIEVED (>=15)` (فئة الامتياز الأعلى).

---

## 3. التفاصيل الفنية للتحديث الثاني: الاستبعاد الشامل للموظف `EGSS-ehabzaky01`

### أ. تحديث قائمة الفريق (Roster Definition)
تم تعديل مصفوفة الفرق في `OCTOBER_TEAMS` ليصبح فريق **ME-EGSS05** مكوناً من 6 موظفين بدلاً من 7:

```python
OCTOBER_TEAMS = [
    {
        "code": "ME-EGSS05",
        "name": "▶ ME-EGSS05小组 (Team 05 — 6 Reps)",
        "reps": [
            "EGSS-samira01", 
            "EGSS-AbdelrahmanNASEF", 
            "EGSS-Ibrahimismaiel", 
            "EGSS-KhaledGonam", 
            "EGSS-OmarMoneb", 
            "EGSS-alihesham01"
        ]
    },
    ...
]
```

### ب. إدراج القائمة السوداء الدائمة (Permanent Blacklist)
تم تعديل ملف `D:\Lens\Data\student_exclusions.json` ليشمل قسم `blocked_reps`:
```json
{
  "_comment": "51Talk Big Team 01 - Excluded Students & Out-of-Scope Rep Blacklist",
  "last_updated": "2026-11-14T15:15:00+02:00",
  "blocked_reps": [
    "egss-ehabzaky01"
  ],
  "blocked_rep_prefixes": [
    "jocc-", "sa-", "ph-", "tl-", "lp-", "eglp-"
  ]
}
```

### ج. فلاتر الاستبعاد الصارم في محرك السحب (Multi-Layer Enforcement)
تم دمج فحص `BLOCKED_REPS` عبر 5 نقاط ارتكاز محورية داخل الكود:
1. **فلترة مهام المتابعة (`SOP Pending Tasks`):** استبعاد أي مهمة يظهر فيها اسم الموظف.
2. **سجل الطلاب المعتمد (`MASTER_STUDENT_REGISTRY`):** منع قيد أي طالب تحت اسم الموظف.
3. **بيانات المعلم غير المثبت (`Unfixed Teacher`):** استبعاد ليدز وملخصات الموظف.
4. **بيانات استهلاك الحصص (`Class Consumption`):** استبعاد ليدز وملخصات الموظف.
5. **بيانات النادي الإنجليزي (`English Club`):** استبعاد ليدز وملخصات الموظف وسجلاته المتبقية.

---

## 4. نتائج التدقيق وفحص الجودة بعد التنفيذ (Verification & Quality Audit)

### أ. فحص خلو الملف التام من الموظف المستبعد:
تم إجراء مسح خلوي شامل لكل خلية في كافة شيتات ملف `All in one Master.xlsx` وأظهرت النتيجة:
* **Sheet `1- Pending SOP`:** **0** سجلات (مستبعد بنسبة 100%).
* **Sheet `2- Unfixed Teacher`:** **0** سجلات (مستبعد بنسبة 100%).
* **Sheet `3- Class Consumption`:** **0** سجلات (مستبعد بنسبة 100%).
* **Sheet `4- English Club`:** **0** سجلات (مستبعد بنسبة 100%).
* **Sheet `SOP_Pending_Leads_Detail`:** **0** سجلات (مستبعد بنسبة 100%).
* **Sheet `Unfixed_Teacher_Leads_Detail`:** **0** سجلات (انخفض من 42 إلى 0).
* **Sheet `Class_Consumption_Leads_Detail`:** **0** سجلات (انخفض من 249 إلى 0).
* **Sheet `English_Club_Leads_Detail`:** **0** سجلات (انخفض من 107 إلى 0).
* **الإجمالي:** **Zero Occurrences (صفر وجود قطعي في كافة أرجاء المصنف)** ✅.

### ب. فحص دقة أرقام النقاط المتبقية (`Remaining Points Audit`):
عينة من السجلات الأولى بعد التحديث من داخل الملف المعتمد:

| Student ID | SS Representative | Classes Attended | **Remaining Points** | Booked Unattended | Classes Needed | Action |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| `58349110` | EGSS-ashraqatal | 0 | **175** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `58582663` | EGSS-ashraqatal | 0 | **15** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `59068598` | EGSS-ashraqatal | 0 | **67** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `59361395` | EGSS-ashraqatal | 0 | **63** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `59364080` | EGSS-ashraqatal | 0 | **30** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `59509105` | EGSS-ashraqatal | 0 | **24** | 0 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |
| `59731674` | EGSS-ashraqatal | 0 | **58** | 9 | 4 | 🚨 Zero Consumption — Urgent 1st Class Booking |

---

## 5. حالة ومواقع الملفات المحدثة في بيئة العمل

| اسم الملف | المسار المعتمد | الحالة | ملاحظات |
| :--- | :--- | :---: | :--- |
| **All in one Master.xlsx** | `D:\Lens\All in one Master.xlsx` | ✅ محدث | الملف التنفيذي المباشر |
| **All in one Master.xlsx** | `C:\Users\husse\Desktop\All in one Master.xlsx` | ✅ محدث | نسخة سطح المكتب المباشرة للمدير |
| **Class_Consumption_Leads_Report.xlsx** | `D:\Lens\Dashboard\Dashboard_Input_Files\` | ✅ محدث | يتضمن العامود الجديد وشيت التفاصيل |
| **Class_Consumption_Leads_Report.xlsx** | `C:\Users\husse\Desktop\` | ✅ محدث | نسخة سطح المكتب المباشرة للمدير |
| **update_dashboard.ps1** | `D:\Lens\Dashboard\update_dashboard.ps1` | ✅ مؤمن | متوافق مع العامود 12 للإجراءات |
| **student_exclusions.json** | `D:\Lens\Data\student_exclusions.json` | ✅ محمي | يتضمن حظر الموظف والطلاب الخارجيين |

---
**اعتماد الإدارة والعمليات:** تم اعتماد هذا التوثيق ليكون المرجع الفني المعياري لكافة عمليات التحديث اليومية التلقائية.

---

## 🔄 ملحق التحديث — 15 نوفمبر 2026 (2026-11-15): إعادة تفعيل الموظف EGSS-ehabzaky01
* **الحالة:** تم إلغاء الاستبعاد وإعادة إدراج الموظف رسمياً ضمن قوام فريق **ME-EGSS05** (7 موظفين) وقطاع **Big Team 01** (19 موظفاً).
* **الإجراءات المنفذة:**
  1. إزالة المعرف egss-ehabzaky01 من قائمة locked_reps في student_exclusions.json.
  2. استعادة اسمه ضمن OCTOBER_TEAMS في كافة نسخ master_builder.py.
  3. إلغاء فلاتر الحظر البرمجية الخاصة به، واستعادة احتساب سجلاته وليداته في الموديولات الأربعة كاملة مع الحفاظ على عامود Remaining Points الجديد.
  4. إعادة بناء ملفات الإكسيل بنجاح بحسب داتا 15 نوفمبر الطازجة (15Nov).
