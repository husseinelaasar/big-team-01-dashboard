const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHAT_GROUPS = {
  mega: 'cidx9ITXJyqktd2CvhI8op0Ig==',    // Big Team Champs - Mega (26 members)
  updates: 'cidYhX/JCJvNbl0xGGtuL8qdg==', // Big Team 01 updates (5 members)
  leaders: 'cidhasF9F02Sb+TdRuVHmBVRg=='  // Big Team Leaders Only (5 members)
};

const targetKey = (process.argv[2] || 'mega').toLowerCase();
const targetChatId = CHAT_GROUPS[targetKey] || CHAT_GROUPS.mega;

// Priority search paths: October Daily Tracker master folder first
const jsonCandidates = [
  'D:\\Lens\\Dashboard\\Dashboard_Input_Files\\October Daily Tracker\\unified_master_records.json',
  'D:\\Lens\\Dashboard\\scratch\\unified_master_records.json'
];
const jsonPath = jsonCandidates.find(p => fs.existsSync(p)) || jsonCandidates[0];

const excelCandidates = [
  'D:\\Lens\\Dashboard\\Dashboard_Input_Files\\October Daily Tracker\\Operations_Action_Leads_Master.xlsx',
  'D:\\Lens\\Dashboard\\Operations_Action_Leads_Master.xlsx',
  'C:\\Users\\husse\\Desktop\\Operations_Action_Leads_Master.xlsx'
];
const excelPath = excelCandidates.find(p => fs.existsSync(p)) || excelCandidates[0];

const dwsCandidates = [
  'C:\\Users\\husse\\AppData\\Roaming\\npm\\dws.cmd',
  'dws'
];
const dwsBin = dwsCandidates.find(p => fs.existsSync(p)) || 'dws';

console.log('==========================================================');
console.log(' 51Talk Big Team 01 - DingTalk Daily Leads Automated Broadcast (Node.js)');
console.log('==========================================================');

if (!fs.existsSync(jsonPath)) {
  console.error(`[ERROR] JSON not found at: ${jsonPath}`);
  process.exit(1);
}

const records = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const totalLeads = records.length;

const p1 = records.filter(r => (r.TierName || '').includes('Round 1') || (r.TierName || '').includes('P1')).length;
const p2 = records.filter(r => (r.TierName || '').includes('Due Today') || (r.TierName || '').includes('P2')).length;
const p3 = records.filter(r => (r.TierName || '').includes('Unfixed') || (r.TierName || '').includes('P3')).length;
const p4 = records.filter(r => (r.TierName || '').includes('0-Classes') || (r.TierName || '').includes('Class Consumption') || (r.TierName || '').includes('P4')).length;
const p5 = records.filter(r => (r.TierName || '').includes('Outside') || (r.TierName || '').includes('P5')).length;

// Reps Breakdown
const repCounts = {};
records.forEach(r => {
  const ag = (r.Agent || 'Unknown').replace('EGSS-', '');
  repCounts[ag] = (repCounts[ag] || 0) + 1;
});

const sortedReps = Object.entries(repCounts).sort((a, b) => b[1] - a[1]);
const todayStr = new Date().toISOString().split('T')[0];

const repTableRows = [];
for (let i = 0; i < sortedReps.length; i += 2) {
  const r1 = sortedReps[i];
  const col1 = `**${r1[0]}**: \`${r1[1]}\``;
  const r2 = sortedReps[i + 1];
  const col2 = r2 ? `**${r2[0]}**: \`${r2[1]}\`` : '-';
  repTableRows.push(`| ${col1} | ${col2} |`);
}

const markdownText = `### 🎯 **51Talk Big Team 01 - Operations Action Leads**
> 📅 **التاريخ:** ${todayStr} | **الفريق:** Big Team 01 Exclusive | **الشرائح المستهدفة:** M0 / M1 / M2 🚀

---

### 📊 **ملخص المهام المفلترة حسب الأولوية (Priority Breakdown):**
* ⚡ **Priority 1 (SOP Round 1):** \`${p1}\` عميل (متابعة عاجلة)
* ⏳ **Priority 2 (Due Today Tasks):** \`${p2}\` عميل (مهام تنتهي اليوم)
* 🔒 **Priority 3 (Unfixed Teachers - M0, M1, M2):** \`${p3}\` عميل (تثبيت المعلمين للشرائح النشطة)
* 📚 **Priority 4 (0 Class Consumption - M0, M1, M2):** \`${p4}\` عميل (تحفيز الحصص للشرائح النشطة)
* 🔄 **Priority 5 (Outside Pool & 0 Pts):** \`${p5}\` عميل (استعادة الرصيد)

📌 **إجمالي مهام العمل اليومية (Big Team 01):** **\`${totalLeads}\` عميل** *(تم استبعاد شرائح M3+ القديمة وغير التابعين للفريق)*

---

### 👥 **توزيع المهام لكل موظف (Reps Action Load):**
| Rep 1 & Leads | Rep 2 & Leads |
|:---|:---|
${repTableRows.join('\n')}

---

### 📋 **تعليمات العمل:**
1. تم إرفاق الملف المحدث أعلاه بصيغة Excel ويحتوي على شيت منفصل لكل موظف بالمهام الخاصة به حصراً.
2. عمود المتابعة الموحد هو **Column J (Status)**، قم بالنقر وتغيير المربع إلى **[ ☑ ]** فور إتمام المهمة.
3. يقوم النظام آلياً بأرشفة وترحيل المهام المنتهية إلى شيت الأرشيف كل صباح.
`;

console.log(`Target Group Key: ${targetKey} -> Chat ID: ${targetChatId}`);
console.log(`Excel Workbook:   ${excelPath}`);
console.log(`Total Leads:      ${totalLeads} (P1:${p1}, P2:${p2}, P3:${p3}, P4:${p4}, P5:${p5})`);

// Save markdown text to temp file
const tmpMdPath = 'D:\\Lens\\Dashboard\\scratch\\dingtalk_msg.md';
fs.writeFileSync(tmpMdPath, markdownText, 'utf8');

// 1. Send Markdown Message
console.log('\n1. Sending Filtered Markdown Action Card to DingTalk...');
try {
  const out1 = execSync(`"${dwsBin}" chat +messages-send --as user --chat-id "${targetChatId}" --markdown "${markdownText.replace(/"/g, '\\"')}" -y`, {
    encoding: 'utf8'
  });
  console.log('Markdown Message Sent Successfully!');
} catch (e) {
  console.error('Markdown Message Send Status:', e.message);
}

// 2. Send Excel File Attachment
if (fs.existsSync(excelPath)) {
  console.log(`\n2. Sending Excel File Attachment: ${excelPath}...`);
  try {
    const out2 = execSync(`"${dwsBin}" chat +messages-send --as user --chat-id "${targetChatId}" --msg-type file --file "${excelPath}" -y`, {
      encoding: 'utf8'
    });
    console.log('Excel File Attachment Sent Successfully!');
  } catch (e) {
    console.error('File Send Status:', e.message);
  }
} else {
  console.warn(`[WARNING] Excel file not found at: ${excelPath}`);
}

console.log('\n=== DINGTALK BROADCAST COMPLETE ===');
