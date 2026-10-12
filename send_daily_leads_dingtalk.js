const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHAT_GROUPS = {
  mega: 'cidx9ITXJyqktd2CvhI8op0Ig==',    // Big Team Champs - Mega (26 members)
  updates: 'cidYhX/JCJvNbl0xGGtuL8qdg==', // Big Team 01 updates
  leaders: 'cidhasF9F02Sb+TdRuVHmBVRg=='  // Big Team Leaders Only
};

const targetKey = process.argv[2] || 'mega';
const targetChatId = CHAT_GROUPS[targetKey] || CHAT_GROUPS.mega;

const jsonPath = 'D:\\Lens\\Dashboard\\scratch\\unified_master_records.json';
const excelPath = 'D:\\Lens\\Dashboard\\Operations_Action_Leads_Master.xlsx';
const dwsBin = 'C:\\Users\\husse\\AppData\\Roaming\\npm\\dws.cmd';

console.log('==========================================================');
console.log(' DingTalk Daily Leads Automated Broadcast Engine (Node.js)');
console.log('==========================================================');

if (!fs.existsSync(jsonPath)) {
  console.error(`[ERROR] JSON not found at: ${jsonPath}`);
  process.exit(1);
}

const records = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const totalLeads = records.length;

const p1 = records.filter(r => r.TierName.includes('Round 1')).length;
const p2 = records.filter(r => r.TierName.includes('Due Today')).length;
const p3 = records.filter(r => r.TierName.includes('Unfixed')).length;
const p4 = records.filter(r => r.TierName.includes('0 Class Consumption')).length;
const p5 = records.filter(r => r.TierName.includes('Outside Pool')).length;

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
  const col1 = `**${r1[0]}**: ${r1[1]}`;
  const r2 = sortedReps[i + 1];
  const col2 = r2 ? `**${r2[0]}**: ${r2[1]}` : '-';
  repTableRows.push(`| ${col1} | ${col2} |`);
}

const markdownText = `### 🎯 **51Talk Big Team 01 - Operations Action Leads**
> 📅 **التاريخ:** ${todayStr} | **الحالة:** تم التحديث والترحيل الآلي بنجاح 🚀

---

### 📊 **ملخص المهام حسب الأولوية:**
* 🔴 **Priority 1 (SOP Round 1):** \`${p1}\` عميل (متابعة عاجلة)
* 🟠 **Priority 2 (Due Today Tasks):** \`${p2}\` عميل (مهام تنتهي اليوم)
* 🟡 **Priority 3 (Unfixed Teachers):** \`${p3}\` عميل (تثبيت المعلمين)
* 🔵 **Priority 4 (0 Class Consumption):** \`${p4}\` عميل (تحفيز الحصص)
* 🟣 **Priority 5 (Outside Pool & 0 Pts):** \`${p5}\` عميل (استعادة الرصيد)

🔥 **إجمالي العملاء المخصصين اليوم:** **\`${totalLeads}\` عميل**

---

### 👥 **توزيع المهام لكل موظف (Reps Action Load):**
| Rep 1 & Leads | Rep 2 & Leads |
|:---|:---|
${repTableRows.join('\n')}

---

### 📌 **تعليمات العمل:**
1. تم إرفاق الملف الماستر أدناه بصيغة Excel، ويحتوي على شيت منفصل لكل موظف برقم فريقه.
2. عمود المتابعة الموحد هو **Column J (Status)**؛ قم بالنقر وتغيير المربع إلى **[ ☑ ]** فور إتمام المهمة.
3. يقوم النظام آلياً بحصد وتوثيق المهام المنتهية في شيت الأرشيف وترحيل المهام المتبقية كل صباح.
`;

console.log(`Target Chat ID: ${targetChatId}`);

// Save markdown text to temp file to prevent CLI escaping issues
const tmpMdPath = 'D:\\Lens\\Dashboard\\scratch\\dingtalk_msg.md';
fs.writeFileSync(tmpMdPath, markdownText, 'utf8');

// 1. Send Markdown Message
console.log('\n1. Sending Markdown Action Card to DingTalk...');
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
}

console.log('\n=== DINGTALK BROADCAST COMPLETE ===');
