# 📖 دليل معالجة خطأ الإذن في حفظ ملفات الإكسل (Permission Denied Troubleshooting Guide)

**تاريخ التوثيق:** `2026-10-11`  
**كود الخطأ:** `[Errno 13] Permission denied`  
**الملف المعني بالرسالة:** `D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx`  

---

## 🔍 1. نص الخطأ المرصود (Observed Error)
```text
⚠️ Error saving to D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx: [Errno 13] Permission denied: 'D:\\Lens\\Dashboard\\Dashboard_Input_Files\\All in one Master.xlsx'
```

---

## 🔬 2. معنى المشكلة والسبب الجذري (What It Means & Root Cause)

### 📌 المعنى باختصار:
الملف المطلوب الكتابة فوقه كان **مفتوحاً وقيد الاستخدام في برنامج Microsoft Excel** (أو مقفولاً بواسطة عملية نظام أخرى مثل المزامنة) في نفس اللحظة التي حاول فيها سكريبت البايثون حفظ النسخة المحدثة.

### ⚙️ التفسير التقني في بيئة Windows:
1. **قفل الملف الحصري (Exclusive File Lock):**  
   عند فتح أي ملف بصيغة `.xlsx` داخل برنامج **Microsoft Excel** على نظام ويندوز، يفرض النظام قفلاً يمنع أي تطبيق آخر (مثل بايثون) من إعادة تسمية، استبدال، أو الكتابة فوق (`Overwrite`) ذلك الملف لضمان عدم تلف البيانات أثناء تصفحها.
2. **استجابة بايثون:**  
   عندما تحاول مكتبة `openpyxl` تنفيذ `wb.save(filepath)` على مسار مقفول، يقوم ويندوز برفض العملية ويطلق بايثون استثناء:
   `[Errno 13] Permission denied`.

---

## 🛡️ 3. تقييم الأثر على البيانات (Impact Analysis)

### ✅ لم يحدث أي فقدان للبيانات أو توقف للسكريبت:
بفضل بنية الأمان البرمجية (`try...except`) في [master_builder.py](file:///d:/Lens/All%20in%20one%20master/master_builder.py)، السكريبت **لم يتوقف ولم ينهار**، واستمر في حفظ وتوليد الملفات بنجاح في باقي المسارات:

| المسار المستهدف (Target Path) | حالة الحفظ في تلك اللحظة | الملاحظات |
| :--- | :---: | :--- |
| `D:\Lens\All in one Master.xlsx` | ✅ **ناجح (Saved)** | تم توليد وحفظ أحدث نسخة (456 KB) |
| `d:\Lens\All in one master\All in one Master.xlsx` | ✅ **ناجح (Saved)** | نسخة مجلد العمل الأساسي |
| `C:\Users\husse\Desktop\All in one Master.xlsx` | ✅ **ناجح (Saved)** | نسخة سطح المكتب المباشرة للمدير |
| `C:\Users\husse\OneDrive\Desktop\All in one Master.xlsx` | ✅ **ناجح (Saved)** | نسخة السحابة للمزامنة |
| `D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx` | ⚠️ **تم تجاوزه لوجود القفل** | تم تحديثه لاحقاً بعد إغلاق الملف |

### 📊 تأكيد اكتمال وصحة البيانات المستخرجة في نفس التشغيل:
- **Unfixed Teacher Detail Leads:** `1,146` طالب غير مثبت (تمت معالجة خلل الأصفار بالكامل).
- **Class Consumption Leads:** `5,048` طالب.
- **English Club Eligible Leads:** `2,098` طالب.
- **SOP Pending Tasks:** `1,485` مهمة.

---

## 💡 4. الحلول والإجراءات الوقائية (Solutions & Best Practices)

### أ. الإجراء التشغيلي اليومي (Best Practice):
- **إغلاق ملفات الإكسل:** قبل تشغيل خط الأنابيب اليومي (`master_builder.py` أو `run_complete_pipeline.py`)، يُفضل التأكد من إغلاق أي نافذة إكسل مفتوحة لملف `All in one Master.xlsx` أو تقارير الـ Sub-sheets.

### ب. الحل في حالة ظهور الرسالة مستقبلاً:
1. إغلاق مصنف الإكسل في شريط المهام.
2. يتم نسخ وتحديث الملف تلقائياً فور فك القفل دون الحاجة لإعادة سحب البيانات كاملة:
   ```powershell
   Copy-Item "D:\Lens\All in one Master.xlsx" "D:\Lens\Dashboard\Dashboard_Input_Files\All in one Master.xlsx" -Force
   ```
3. تم تطبيق هذا الإجراء وأصبح الملف الآن محدثاً ومطابقاً بنسبة 100% في جميع المسارات الـ 5.
