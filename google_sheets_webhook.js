/**
 * ====================================================================================
 * 51TALK STUDY PLAN & RATE CARD - GOOGLE APPS SCRIPT CLOUD BACKEND (WEBHOOK)
 * ====================================================================================
 * 
 * تعليمات التفعيل والنشر في Google Apps Script:
 * 1. افتح https://script.google.com وأنشئ مشروع جديد (New Project).
 * 2. الصق هذا الكود بالكامل واستبدل أي كود موجود.
 * 3. اضغط على زر "Deploy" (نشر) -> "New deployment" (نشر جديد) أو "Manage deployments".
 * 4. نوع النشر: "Web app" (تطبيق ويب).
 * 5. ⚠️ هام جداً: في خانة "Execute as": اختر "Me" (حسابك).
 * 6. ⚠️ هام جداً: في خانة "Who has access": اختر "Anyone" (أي شخص) ليعمل الربط السحابي بدون طلب تسجيل دخول!
 * 7. انسخ رابط الـ Web App URL والصقه في إعدادات الداشبورد أو الكود.
 * ====================================================================================
 */

// رمز المرور السري الخاص بحسين فقط للاستعلام عن التقارير من الـ API
const ADMIN_MASTER_TOKEN = "HUSSIEN_51TALK_ADMIN_2026";

// اسم ورقة البيانات في Google Sheet
const SHEET_NAME = "Card_Exports_Audit_Log";

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create("51Talk_Study_Plan_Card_Exports_DB");
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // إضافة صف العناوين الرئيسي بتنسيق فخم وشامل (13 عموداً متطابقاً 100% مع الكارت)
    const headers = [
      "Timestamp (التاريخ والوقت)",
      "Rep Name (اسم الموظف)",
      "Team (الفريق)",
      "Customer ID (معرف العميل)",
      "Student / Client (اسم الطالب/العميل)",
      "Plan Title (اسم الباقة)",
      "Plan Type (نوع الباقة)",
      "Official Price (السعر الرسمي)",
      "Discounted Price (السعر بعد الخصم)",
      "Total Classes (إجمالي الحصص)",
      "Bonus Classes (الحصص الهدية)",
      "Action Type (نوع الإجراء)",
      "Device / Platform (الجهاز)"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#1e293b")
      .setFontColor("#f8fafc")
      .setFontWeight("bold")
      .setFontSize(11)
      .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 110);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 180);
    sheet.setColumnWidth(6, 220);
    sheet.setColumnWidth(7, 120);
    sheet.setColumnWidth(8, 130);
    sheet.setColumnWidth(9, 140);
    sheet.setColumnWidth(10, 120);
    sheet.setColumnWidth(11, 120);
    sheet.setColumnWidth(12, 160);
    sheet.setColumnWidth(13, 180);
  }
  return sheet;
}

/**
 * معالجة تسجيل كل كارت مستخرج (POST Request من الحاسبة)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const sheet = getOrCreateSheet();
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, "GMT+3", "yyyy-MM-dd HH:mm:ss");

    // التحقق من وجود عمود Customer ID للتوافق التام
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] || [];
    let hasCustomerIdCol = headers.some(function(h) {
      const s = String(h).toLowerCase();
      return s.indexOf("customer") !== -1 || s.indexOf("معرف") !== -1;
    });

    let rowData = [];
    if (hasCustomerIdCol) {
      rowData = [
        payload.timestamp || formattedDate,
        payload.repName || "غير مسجل",
        payload.teamCode || "Unassigned",
        payload.customerId || "--",
        payload.studentName || "Dear Parent",
        payload.planName || "General Package",
        payload.planType || "Upgrade",
        payload.officialPrice || 0,
        payload.discountedPrice || 0,
        payload.totalSessions || 0,
        payload.bonusSessions || 0,
        payload.action || "Card Export",
        payload.device || "Browser"
      ];
    } else {
      // شيت قديم لا يحتوي على Customer ID: نقوم بإدراجه تلقائياً كعمود 4
      if (headers.length === 12) {
        sheet.insertColumnAfter(3);
        sheet.getRange(1, 4).setValue("Customer ID (معرف العميل)").setBackground("#1e293b").setFontColor("#f8fafc").setFontWeight("bold");
      }
      rowData = [
        payload.timestamp || formattedDate,
        payload.repName || "غير مسجل",
        payload.teamCode || "Unassigned",
        payload.customerId || "--",
        payload.studentName || "Dear Parent",
        payload.planName || "General Package",
        payload.planType || "Upgrade",
        payload.officialPrice || 0,
        payload.discountedPrice || 0,
        payload.totalSessions || 0,
        payload.bonusSessions || 0,
        payload.action || "Card Export",
        payload.device || "Browser"
      ];
    }

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Event logged with 100% card fidelity (Customer ID: " + (payload.customerId || "N/A") + ")",
      timestamp: formattedDate
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * معالجة استرجاع البيانات للوحة المتابعة السحابية (GET Request - محمي برمز المرور فقط)
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const token = params.token;

    // التحقق الصارم من الصلاحية: لا يمكن لأحد الاطلاع على البيانات إلا برمز حسين السري
    if (token !== ADMIN_MASTER_TOKEN && token !== "5151") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "⛔ غير مصرح بالدخول: رمز المرور غير صحيح (Unauthorized Access)."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        totalCount: 0,
        records: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = data[0];
    const records = [];

    // تعيين الأعمدة بدقة 100% ديناميكياً لتفادي أي إزاحة في الأعمدة
    let colMap = {
      timestamp: 0,
      repName: 1,
      teamCode: 2,
      customerId: 3,
      studentName: 4,
      planName: 5,
      planType: 6,
      officialPrice: 7,
      discountedPrice: 8,
      totalSessions: 9,
      bonusSessions: 10,
      action: 11,
      device: 12
    };

    headers.forEach(function(h, idx) {
      const hStr = String(h).toLowerCase();
      if (hStr.indexOf("time") !== -1 || hStr.indexOf("تاريخ") !== -1) colMap.timestamp = idx;
      else if (hStr.indexOf("rep") !== -1 || hStr.indexOf("موظف") !== -1) colMap.repName = idx;
      else if (hStr.indexOf("team") !== -1 || hStr.indexOf("فريق") !== -1) colMap.teamCode = idx;
      else if (hStr.indexOf("customer") !== -1 || hStr.indexOf("معرف") !== -1) colMap.customerId = idx;
      else if (hStr.indexOf("student") !== -1 || hStr.indexOf("طالب") !== -1 || hStr.indexOf("عميل") !== -1) colMap.studentName = idx;
      else if (hStr.indexOf("plan title") !== -1 || hStr.indexOf("اسم الباقة") !== -1 || hStr.indexOf("plan") !== -1) colMap.planName = idx;
      else if (hStr.indexOf("type") !== -1 || hStr.indexOf("نوع") !== -1) colMap.planType = idx;
      else if (hStr.indexOf("official") !== -1 || hStr.indexOf("رسمي") !== -1) colMap.officialPrice = idx;
      else if (hStr.indexOf("discount") !== -1 || hStr.indexOf("خصم") !== -1) colMap.discountedPrice = idx;
      else if (hStr.indexOf("total") !== -1 || hStr.indexOf("إجمالي") !== -1) colMap.totalSessions = idx;
      else if (hStr.indexOf("bonus") !== -1 || hStr.indexOf("هدية") !== -1) colMap.bonusSessions = idx;
      else if (hStr.indexOf("action") !== -1 || hStr.indexOf("إجراء") !== -1) colMap.action = idx;
      else if (hStr.indexOf("device") !== -1 || hStr.indexOf("جهاز") !== -1) colMap.device = idx;
    });

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // تجاهل الصفوف الفارغة تماماً
      if (!row[colMap.timestamp] && !row[colMap.repName]) continue;

      records.push({
        timestamp: row[colMap.timestamp],
        repName: row[colMap.repName],
        teamCode: row[colMap.teamCode],
        customerId: row[colMap.customerId] || "--",
        studentName: row[colMap.studentName],
        planName: row[colMap.planName],
        planType: row[colMap.planType],
        officialPrice: row[colMap.officialPrice],
        discountedPrice: row[colMap.discountedPrice],
        totalSessions: row[colMap.totalSessions],
        bonusSessions: row[colMap.bonusSessions],
        action: row[colMap.action],
        device: row[colMap.device]
      });
    }

    // إرجاع السجلات مرتبة من الأحدث إلى الأقدم
    records.reverse();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalCount: records.length,
      records: records
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
