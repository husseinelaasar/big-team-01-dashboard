const fs = require('fs');
const config = JSON.parse(fs.readFileSync('scratch/julia_config.json', 'utf8'));

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خطة عمل جوليا اليومية - أفضل 10 عملاء | 51Talk</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #141c2e;
      --card-border: #1e293b;
      --accent: #2563eb;
      --accent-glow: rgba(37, 99, 235, 0.25);
      --success: #10b981;
      --warning: #f59e0b;
      --purple: #8b5cf6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Cairo', sans-serif; }
    body {
      background: var(--bg);
      color: var(--text-main);
      padding: 24px;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    
    /* Header Banner */
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
      border: 1px solid #3b82f640;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .header::after {
      content: '🌟';
      position: absolute;
      top: -10px;
      left: 20px;
      font-size: 80px;
      opacity: 0.12;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .header p {
      color: #cbd5e1;
      font-size: 15px;
    }
    .progress-box {
      margin-top: 18px;
      background: rgba(0,0,0,0.3);
      padding: 12px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .progress-bar {
      flex: 1;
      height: 10px;
      background: #334155;
      border-radius: 5px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      transition: width 0.3s ease;
    }
    .progress-text { font-size: 14px; font-weight: 700; color: #38bdf8; min-width: 140px; }

    /* Tips Box */
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .tip-card {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 12px;
      padding: 14px 18px;
    }
    .tip-card h3 { font-size: 14px; color: #34d399; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
    .tip-card p { font-size: 13px; color: #e2e8f0; }

    /* Cards */
    .lead-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 22px;
      margin-bottom: 18px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .lead-card:hover {
      border-color: #3b82f6;
      transform: translateY(-2px);
    }
    .lead-card.done {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 14px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 12px;
    }
    .student-badge {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .index-num {
      width: 32px;
      height: 32px;
      background: #2563eb;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 14px;
    }
    .student-id {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #f8fafc;
    }
    .tag {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
    }
    .tag-upgrade { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid #059669; }
    .tag-champion { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid #2563eb; }
    .tag-renew { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid #d97706; }

    .stats-row {
      display: flex;
      gap: 18px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .stat-pill {
      background: #0f172a;
      padding: 4px 12px;
      border-radius: 8px;
      border: 1px solid #334155;
    }
    .stat-pill strong { color: #38bdf8; }

    .hook-box {
      background: #1e293b80;
      border-right: 4px solid #38bdf8;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 14px;
      color: #e2e8f0;
    }
    .hook-box strong { color: #38bdf8; }

    .script-box {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 14px;
      border-radius: 10px;
      font-size: 14px;
      color: #f1f5f9;
      position: relative;
      margin-bottom: 14px;
      line-height: 1.8;
    }
    .script-label {
      font-size: 12px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 8px;
    }
    .copy-btn {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #334155;
      color: #fff;
      border: none;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .copy-btn:hover { background: #2563eb; }

    .goal-box {
      font-size: 13px;
      color: #cbd5e1;
      margin-bottom: 14px;
      background: rgba(245, 158, 11, 0.08);
      padding: 10px 14px;
      border-radius: 6px;
      border-right: 4px solid #f59e0b;
    }
    .goal-box strong { color: #f59e0b; }

    /* Actions */
    .card-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      background: #0f172a;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #1e293b;
    }
    .status-select {
      background: #1e293b;
      color: #fff;
      border: 1px solid #475569;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .notes-input {
      flex: 1;
      min-width: 220px;
      background: #1e293b;
      color: #fff;
      border: 1px solid #475569;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: #fff;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .toast.show { opacity: 1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 خطة العمل اليومية المركزة - أفضل 10 عملاء لجوليا</h1>
      <p>كل هؤلاء الطلاب منجزين بين 12 إلى 21 حصة وملتزمين جداً. مكالماتك اليوم ليست بيعاً مباشراً بل احتفال، هدايا English Club، ومساعدة أولياء الأمور في حماية مدرسيهم المفضلين!</p>
      
      <div class="progress-box">
        <div class="progress-text" id="progressLabel">0 من 10 مكالمات منجزة</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progressBar"></div>
        </div>
      </div>
    </div>

    <div class="tips-grid">
      <div class="tip-card">
        <h3>💡 ابدئي بالطالب 63854359 أو 63495185</h3>
        <p>مخلصين 20 و 21 حصة! أولياء أمورهم سيكونون في غاية الامتنان والشكر لمكالمتك، وهذا سيعطيكِ شحنة طاقة وثقة لباقي اليوم.</p>
      </div>
      <div class="tip-card">
        <h3>🎯 التركيز على الـ Upgrade Base (M2)</h3>
        <p>7 من أصل 10 طلاب في قاعدة الترقية لشهر أكتوبر؛ أي إغلاق معهم يرفع أرقامك في تقرير الفريق فوراً.</p>
      </div>
      <div class="tip-card">
        <h3>🎁 هديتك الذهبية: الـ English Club</h3>
        <p>لا تتحدثي عن تجديد قبل أن تقدمي هدية النادي الإنجليزي المجاني وتهنئي ولي الأمر بتفوق ابنه.</p>
      </div>
    </div>

    <div id="leadsContainer">
`;

let cardHtml = '';
config.items.forEach((item) => {
  let tagClass = 'tag-upgrade';
  if (item.category.includes('بطل')) tagClass = 'tag-champion';
  else if (item.category.includes('تجديد')) tagClass = 'tag-renew';

  const escapedScript = item.script.replace(/\\/g, '\\\\').replace(/"/g, '&quot;');

  cardHtml += `
      <div class="lead-card" id="card-${item.id}" data-id="${item.id}">
        <div class="card-top">
          <div class="student-badge">
            <div class="index-num">${item.id}</div>
            <div class="student-id">Student ID: ${item.studentId}</div>
            <button class="copy-btn" style="position:static; padding:4px 10px;" onclick="copyText('${item.studentId}', 'تم نسخ رقم الطالب')">📋 نسخ ID</button>
            <span class="tag ${tagClass}">${item.category}</span>
          </div>
          <div class="stats-row">
            <div class="stat-pill">الحصص المنجزة: <strong>${item.completed}</strong></div>
            <div class="stat-pill">الحصص المحجوزة: <strong>${item.booked}</strong></div>
          </div>
        </div>

        <div class="hook-box">
          <strong>🎯 المدخل الإيجابي للمكالمة:</strong> ${item.hook}
        </div>

        <div class="script-box">
          <div class="script-label">📞 ماذا تقولين لولي الأمر بالضبط (الكلام المقترح):</div>
          <button class="copy-btn" onclick="copyText('${item.script.replace(/'/g, "\\'")}', 'تم نسخ نص المكالمة')">نسخ النص</button>
          "${item.script}"
        </div>

        <div class="goal-box">
          <strong>🎯 الهدف ونقطة الإغلاق:</strong> ${item.goal}
        </div>

        <div class="card-actions">
          <label style="font-size:13px; font-weight:700;">حالة المكالمة:</label>
          <select class="status-select" onchange="updateStatus(${item.id}, this.value)" id="status-${item.id}">
            <option value="لم يتم الاتصال">لم يتم الاتصال</option>
            <option value="تم الرد - مهتم">تم الرد - مهتم</option>
            <option value="تم الرد - غير متاح الآن">تم الرد - غير متاح الآن</option>
            <option value="تم حجز الحصص/EC">تم حجز الحصص/EC</option>
            <option value="تم إغلاق الترقية بنجاح!">تم إغلاق الترقية بنجاح! 🎉</option>
            <option value="لم يرد">لم يرد</option>
          </select>
          <input type="text" class="notes-input" placeholder="اكتبي ملاحظاتك عن المكالمة هنا..." id="notes-${item.id}" oninput="saveNotes(${item.id}, this.value)">
        </div>
      </div>
`;
});

const footerHtml = `
    </div>
  </div>

  <div class="toast" id="toast">تم النسخ بنجاح!</div>

  <script>
    function copyText(text, msg) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(msg || 'تم النسخ بنجاح!');
      }).catch(() => {
        // Fallback
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast(msg || 'تم النسخ بنجاح!');
      });
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.innerText = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2000);
    }

    function updateStatus(id, val) {
      localStorage.setItem('julia_status_' + id, val);
      const card = document.getElementById('card-' + id);
      if (val !== 'لم يتم الاتصال') {
        card.classList.add('done');
      } else {
        card.classList.remove('done');
      }
      updateProgress();
    }

    function saveNotes(id, val) {
      localStorage.setItem('julia_notes_' + id, val);
    }

    function updateProgress() {
      let count = 0;
      for (let i = 1; i <= 10; i++) {
        const val = localStorage.getItem('julia_status_' + i) || 'لم يتم الاتصال';
        if (val !== 'لم يتم الاتصال') count++;
      }
      const pct = (count / 10) * 100;
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('progressLabel').innerText = count + ' من 10 مكالمات تم التعامل معها';
    }

    window.onload = function() {
      for (let i = 1; i <= 10; i++) {
        const st = localStorage.getItem('julia_status_' + i);
        if (st) {
          const sel = document.getElementById('status-' + i);
          if (sel) sel.value = st;
          if (st !== 'لم يتم الاتصال') {
            document.getElementById('card-' + i).classList.add('done');
          }
        }
        const note = localStorage.getItem('julia_notes_' + i);
        if (note) {
          const inp = document.getElementById('notes-' + i);
          if (inp) inp.value = note;
        }
      }
      updateProgress();
    };
  </script>
</body>
</html>
`;

fs.writeFileSync('Julia_Top10_Action_Plan.html', html + cardHtml + footerHtml, 'utf8');
console.log('Saved Julia_Top10_Action_Plan.html successfully!');
