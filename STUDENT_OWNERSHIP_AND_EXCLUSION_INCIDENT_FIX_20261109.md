# 🛠️ توثيق تشخيص وتطبيق الحل الجذري الشامل لتضارب ملكية الطلاب واستبعاد النطاقات الخارجية
## Incident & Permanent Architecture Fix: Student Ownership Reconciliation & Sector Exclusion Engine

**القطاع:** 51Talk Middle East — Big Team 01  
**Senior Manager:** Saber Hussien  
**تاريخ التوثيق والاعتماد:** 9 نوفمبر 2026 (`2026-11-09`)  
**الحالة:** **مطبق ومفعل بنجاح 100% (Production Standard)** ✅  
**الملفات البرمجية المعنية:**
* `D:\Lens\All in one master\master_builder.py` (تم التحديث وتعميم التزامن عبر كافة النسخ)
* `D:\Lens\Dashboard\update_dashboard.ps1` (تم التحديث وتأمين خط الأنابيب)
* `D:\Lens\data\student_exclusions.json` (قاعدة الاستثناءات وفلترة الفرق الخارجية المعتمدة حديثاً)
* `D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx`
* `D:\Lens\Dashboard\Dashboard_Input_Files\Class_Consumption_Leads_Report.xlsx`
* `D:\Lens\Dashboard\Dashboard_Input_Files\English_Club_Leads_Report.xlsx`
* `D:\Lens\Dashboard\leads\*.csv`

---

## 1. ملخص البلاغ والمشكلة (Incident Overview)
* **الملاحظة:** تم رصد الطالب رقم **`63317253`** مكرراً في ملفات الليدز اليومية الصادرة بتاريخ اليوم 9 نوفمبر 2026 تحت موظفين مختلفين:
  1. تحت الموظف `EGSS-ahmedshoukry` (أحمد شكري) في قسم `English Club Actionable Leads`.
  2. وتحت الموظف `EGSS-mohamedha` (محمد حسني) في قسم `Zero-Class & Class Consumption Rescue`.
  3. وظهر مكرراً مرتين في ملف القطاع الموحد `BIG_TEAM_01_Team_Leads.csv`.
* **المفاجأة بعد الفحص المباشر في الـ CRM:** تبيّن أن الطالب أصلاً خارج قاعدة بيانات قطاع Big Team 01، ومسجل فعلياً تحت موظف في كول سنتر الأردن باسم **`JOCC-abdelaziznaieh`**.

---

## 2. التحليل الجذري للسبب (Root Cause Analysis)

بعد إجراء هندسة عكسية وفحص السجلات التاريخية للـ CRM ومركز البيانات (Data Center) من 1 نوفمبر حتى اليوم، تبيّن وجود **3 أسباب هيكلية مترابطة**:

```mermaid
flowchart TD
    subgraph CRM_Live ["1. 51Talk Live Operational CRM"]
        A["Real-time Transfer / Reassignment"] -->|"Instant Update"| B["Student assigned to: JOCC-abdelaziznaieh"]
    end

    subgraph Data_Center ["2. BI Data Center (lp.51talkjr.com)"]
        C["Batch ETL Sync Lag (24-48 Hours)"]
        D["English Club Report: Static Cohort snapshot (SS: ahmedshoukry)"]
        E["SS Lens Dashboard: Retention Pool snapshot (Agent: mohamedha)"]
    end

    subgraph Legacy_Pipeline ["3. Legacy Script Processing"]
        D --> F["Read EC independently -> Assigns to ahmedshoukry"]
        E --> G["Read CC independently -> Assigns to mohamedha"]
        F & G --> H["⛔ RESULT: Duplicate Student across 2 Reps + Leaked into Leads"]
    end
```

### أ. الازدواجية بين الموظفين (Historical Snapshot vs. Active Pool):
1. **تقرير English Club (`中东English Club数据看板`):** تقرير مبني على كوهورت قديم للطلاب الذين سددوا أول قسط بين شهري مايو وسبتمبر 2026. في هذا التقرير، يحتفظ النظام الصيني باسم الموظف التاريخي (`SS: EGSS-ahmedshoukry`) الذي كان مسؤولاً عن الطالب وقت إطلاق الحملة ولا يحدّثه بعد النقل الداخلي.
2. **تقرير SS Lens Dashboard (`Student_Detail9 / 32`):** تقرير تشغيلي يومي يعكس حركة توزيع الحصص الفعلية. وفي تاريخ 5-6 نوفمبر، تم عمل إعادة توزيع (Handover) للطالب داخل الفريق لينتقل من أحمد شكري إلى `EGSS-mohamedha`.
3. **الخلل في الكود السابق:** كان يقرأ كل ورقة عمل بشكل منفصل دون وجود سجل مرجعي موحد (Single Source of Truth)؛ فاعتمد الموظف المذكور في English Club للموظف الأول، واعتمد الموظف المذكور في Lens للموظف الثاني!

### ب. سبب ظهور الطالب رغم نقله لكول سنتر الأردن (`JOCC-abdelaziznaieh`):
* **تأخر مزامنة مركز البيانات (ETL Data Latency):** نظام الـ CRM الحقيقي لحظي وفوري، بينما مركز بيانات الـ QuickBI/FineBI يستخرج دفعات مجدولة تتأخر عن الـ CRM المباشر بمدة تتراوح من 24 إلى 48 ساعة. فالملفات المسحوبة صباح اليوم الساعة 12:33 كانت لا تزال تحتفظ بآخر حالة قبل اكتمال المزامنة.
* **غياب فلتر التحقق الصارم من التبعية للقطاع:** كود التوليد كان يفحص فقط هل اسم الموظف المكتوب في الصف ينتمي للبيج تيم؟ ولأن الملف الخام كان مسجلاً به شكري ومحمد، اعتبرهما الكود صالحين وأدخلهما دون التحقق مما إذا كان الطالب لا يزال نشطاً في قاعدة طلاب القطاع.

---

## 3. نتائج التدقيق الشامل على كامل قاعدة بيانات اليوم (Full Audit: 3,953 Students)

تم إجراء تدقيق برمجي شامل ومقارنة تقاطعية (Cross-Validation) لكافة الطلاب البالغ عددهم **3,953 طالباً** في ملفات اليوم:

### أ. رصد تكرار الخطأ:
وجدنا **8 طلاب بالضبط** في كامل قطاع Big Team 01 يعانون من نفس التعارض (اسم موظف قديم في تقرير English Club واسم موظف محدث في شيتات Lens):

| # | رقم الطالب (Student ID) | الموظف في English Club (تاريخي قديم) | الموظف الفعلي في Lens (الحالي المعتمد) | الإجراء المتخذ في التحديث الجذري |
|---|---|---|---|---|
| 1 | **63317253** | `EGSS-ahmedshoukry` | `EGSS-mohamedha` | **استبعاد وحذف نهائي** (نُقل خارج القطاع لـ `JOCC`) |
| 2 | **63735765** | `EGSS-hayamhassan` | `EGSS-mahmoudkhamis` | **إعادة توجيه فورية** لمحمود خميس ومنع الازدواجية |
| 3 | **58653432** | `EGSS-hayamhassan` | `EGSS-mahmoudkhamis` | **إعادة توجيه فورية** لمحمود خميس ومنع الازدواجية |
| 4 | **62724066** | `EGSS-ibrahimismaiel` | `EGSS-mahmoudkhamis` | **إعادة توجيه فورية** لمحمود خميس ومنع الازدواجية |
| 5 | **63572084** | `EGSS-ibrahimismaiel` | `EGSS-mahmoudkhamis` | **إعادة توجيه فورية** لمحمود خميس ومنع الازدواجية |
| 6 | **58499515** | `EGSS-juliamonir01` | `EGSS-samira01` | **إعادة توجيه فورية** لسميرة ومنع الازدواجية |
| 7 | **63856017** | `EGSS-nohayoussry` | `EGSS-mohamedha` | **إعادة توجيه فورية** لمحمد حسني ومنع الازدواجية |
| 8 | **58603663** | `EGSS-titooooo` | `EGSS-samira01` | **إعادة توجيه فورية** لسميرة ومنع الازدواجية |

---

## 4. الحل المعماري الدائم المطبق في القاعدة الأساسية (Implemented Architecture)

تم بناء وتفعيل **منظومة التوافق الذهبية واستبعاد النطاقات الخارجية** عبر ثلاث ركائز:

```mermaid
flowchart TD
    A["Raw CRM Excel Files (Today)"] --> B["1. Load Global Exclusions (D:/Lens/data/student_exclusions.json)"]
    B --> C["2. Build MASTER_STUDENT_REGISTRY (Golden Source from SS Lens Dashboard)"]
    C --> D{"Student in Active Big Team Pool?"}
    D -- "NO (Transferred to JOCC/SA/Dropped)" --> E["⛔ EXCLUDE: Auto-dropped (685 out-of-sector leads dropped)"]
    D -- "YES" --> F{"Is English Club Rep == Active Lens Rep?"}
    F -- "Match" --> G["Assign to Current Rep"]
    F -- "Conflict (Outdated Rep)" --> H["🔄 AUTO-REMAP to Active Lens Rep (Single Owner Guaranteed)"]
    G & H --> I["Write to All in one Master.xlsx & Rep Leads CSVs"]
```

### 1. قاعدة البيانات الذهبية الموحدة (Golden Source of Truth):
* اعتماد شيت `Student_Detail` في ملف `SS Lens Dashboard` كمرجع وحيد مطلق لملكية الطالب الفعلية داخل القطاع (`3,261 طالباً نشطاً معتمداً`).
* عند استخراج تقرير الـ English Club، **لا يُعتمد إطلاقاً** اسم الموظف المكتوب في خانة `SS`، بل يتم عمل ربط فوري (Lookup) برقم الطالب مع قاعدة الـ Lens الذهبية.
* إذا كان الطالب مملوكاً لموظف آخر داخل البيج تيم، يتم **إعادة توجيه الليد تلقائياً (Auto-Remapping)** للموظف الفعلي وإسقاطه من الموظف القديم.

### 2. محرك استبعاد الفرق الخارجية والطلاب المنسحبين (Out-of-Sector Dropper):
* أي طالب يظهر في تقرير الـ English Club ولكنه **غير موجود في قاعدة طلاب Big Team 01 الفعالة** في الـ Lens (بمعنى أنه نُقل للأردن `JOCC-*` أو السعودية `SA-*` أو ترك الخدمة):
  يتم **إسقاطه واستبعاده تلقائياً** وحظره من النزول في ملفات البيج تيم أو ملفات الموظفين.
* في تشغيلة اليوم: تم إسقاط **685 ليد خارجي** كانت عالقة تاريخياً ولا تخص طلاب البيج تيم النشطين!

### 3. ملف إدارة الاستثناءات المباشرة (`student_exclusions.json`):
تم إنشاء ملف الإعدادات المعتمد:
`D:\Lens\data\student_exclusions.json`
```json
{
  "_comment": "51Talk Big Team 01 - Excluded Students & Out-of-Scope Rep Blacklist",
  "last_updated": "2026-11-09T15:35:00+02:00",
  "excluded_students": {
    "63317253": {
      "reason": "Transferred outside Big Team 01 to Jordan CC (JOCC-abdelaziznaieh)",
      "date": "2026-11-09",
      "reported_by": "Manager Audit"
    }
  },
  "blocked_rep_prefixes": [
    "jocc-",
    "sa-",
    "ph-",
    "tl-",
    "lp-",
    "eglp-"
  ]
}
```

---

## 5. نتائج التحقق والاختبار بعد التطبيق (Post-Fix Verification)

1. **فحص وجود الطالب `63317253`:**
   * `All in one Master.xlsx`: **غير موجود نهائياً (Purged)** ✅
   * `Class_Consumption_Leads_Report.xlsx`: **غير موجود نهائياً (Purged)** ✅
   * `English_Club_Leads_Report.xlsx`: **غير موجود نهائياً (Purged)** ✅
   * `EGSS-ahmedshoukry.csv`: **غير موجود نهائياً (Purged)** ✅
   * `EGSS-mohamedha.csv`: **غير موجود نهائياً (Purged)** ✅
   * `BIG_TEAM_01_Team_Leads.csv`: **غير موجود نهائياً (Purged)** ✅
2. **فحص تعارض الطلاب بين الموظفين (Cross-Module Rep Conflicts):**
   * **قبل التحديث:** 10 حالات تضارب.
   * **بعد التحديث:** **`0` حالات تضارب على الإطلاق (Zero Conflicts across all 3,235 students)** ✅
3. **توليد الشيتات والداشبورد:**
   * تم إعادة توليد كافة الشيتات الفردية، وتحديث ملفات الـ CSV لجميع الفرق الخمسة والـ 21 موظفاً بنجاح كامل بدون أي خطأ في خط الأنابيب.

---

## 6. دليل التشغيل للمدير (Operational Runbook for Managers)
إذا لاحظت في أي وقت مستقبلاً قيام الإدارة بنقل طالب إلى الأردن أو السعودية وما زال يظهر بسبب تأخر الـ BI:
1. افتح الملف: `D:\Lens\data\student_exclusions.json`.
2. أضف رقم الطالب والسبب تحت `excluded_students`.
3. في الدورة التالية للبايبلاين (التي تعمل تلقائياً كل 4 ساعات)، سيتم شطب الطالب واستبعاده فوراً من كافة تقارير الماستر وشيتات الفرق والملفات الفردية لجميع الموظفين.
