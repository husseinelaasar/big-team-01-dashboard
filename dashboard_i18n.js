/**
 * Big Team 01 — Tri-lingual Internationalization Engine (i18n)
 * Supported Languages: English (en), Arabic (ar), Chinese (zh)
 * 100% Native Corporate Standards | Complete DOM Synchronization
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bt01_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const TRANSLATIONS = {
    en: {
      dir: 'ltr',
      font: "'Inter', system-ui, sans-serif",
      title: "Big Team 01 — Executive Performance Dashboard",
      cmdBtn: "Ask AI / Filter...",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      shareBtn: "Share Dashboard",
      rateCardBtn: "Rate Card Calculator",
      verifiedBadge: "CRM & Lens Verified",
      dataDate: "Nov 1-16, 2026 (Day 16)",
      tabs: {
        overview: "Executive Overview",
        dailyplan: "Daily Action Plan",
        teams: "Small Teams (5)",
        individuals: "Individual Reps (18)",
        consumption: "Class Consumption (82%)",
        upgrade: "Early Upgrade Hub (20%)",
        leads: "Uncovered Leads (5,196)",
        englishclub: "English Club (45%)",
        sop: "SOP Compliance",
        operations: "Operations Matrix"
      },
      kpis: {
        cashLabel: "Total Cash Revenue (MTD)",
        contractsLabel: "Total Contracts (Orders)",
        achLabel: "Day 16 Target Benchmark",
        repsLabel: "Active Reps & M2 Conversion",
        targetPrefix: "Target: ",
        projectedPrefix: " | Projected: ",
        achPrefix: "Day 16 Benchmark: 41% | Target: ",
        achDays: "Day 16 of 30 | Expected Target Pace: 41% (14 Days Left)",
        m2Conversion: "3.4% M2 Upgrade Conversion (15/438)"
      },
      sections: {
        teamsTitle: "Small Teams & Big Team 01 — Cash Achievement vs Target",
        teamsSub: "Comparison of revenue velocity across all teams and Big Team 01 against the official pacing curve (5% to 103%)",
        teamsTableTitle: "Small Team Performance Breakdown",
        teamsTableSub: "Complete pod overview: Cash, Targets, Gaps, Average Deal Sizes, and Pod Leaders",
        indTitle: "Individual Performance Deep Dive",
        indSub: "Comprehensive telemetry for all 18 Sales Specialists: Revenue, Quota Attainment, Upgrade Base, and Pacing Status",
        consumptionTitle: "Individual Sales Rep Class Consumption Performance (18 Reps)",
        consumptionSub: "Distribution of student class usage: 0 classes (Risk), 1-3, 4-7, 8-11, and 12+ classes against 82% benchmark",
        upgradeTitle: "Early Upgrade Acceleration Hub (20% Target Milestone)",
        upgradeSub: "Focus list of renewal-eligible students with fewer than 10 classes remaining",
        sopTitle: "Small Teams SOP Scorecards | Team Performance",
        sopSub: "Operational compliance across R1-R6 rounds and English Club attendance",
        ecTitle: "English Club Attendance & Conversion Radar",
        ecSub: "Tracking booked vs attended students for Saturday English Club sessions"
      },
      dock: {
        overview: "Overview",
        teams: "Teams",
        reps: "Reps",
        consumption: "Consumption",
        upgrade: "Upgrade",
        leads: "Leads",
        rateCard: "Rate Card",
        top: "Top"
      },
      pills: {
        all: "All Specialists",
        behind: "Behind Benchmark",
        zero: "Zero Cash Reps",
        nodeal: "0-1 Deal Closed",
        pending: "Pending Upgrade",
        calls: "Call Cover < 70%",
        ach100: "100%+ Achieved"
      },
      headers: {
        rank: "#",
        repName: "Sales Specialist",
        team: "Small Team",
        cash: "Cash ($)",
        target: "Target ($)",
        ach: "Ach %",
        pace: "Pace Status",
        nextDayBm: "🚀 Next Day BM (D17: 43%)",
        m2: "M2",
        renewals: "Renewal",
        base: "Base",
        calls: "Call Cover %",
        zeroClasses: "0-Classes",
        status: "Status"
      },
      toki: {
        bubbleText: "👋 Hello, I'm Toki!",
        bubbleSub: "AI Copilot • Ask me",
        modalTitle: "Toki AI Copilot",
        modalSub: "Big Team 01 Voice Assistant",
        inputPlaceholder: "Ask Toki a question...",
        soundwaveLabel: "Toki is speaking..."
      }
    },
    ar: {
      dir: 'rtl',
      font: "'Cairo', 'Inter', system-ui, sans-serif",
      title: "قطاع Big Team 01 — لوحة القيادة التنفيذية والأداء المالي",
      cmdBtn: "اسأل الذكاء الاصطناعي / فلترة...",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      shareBtn: "مشاركة الرابط",
      rateCardBtn: "حاسبة الباقات المعتمدة",
      verifiedBadge: "موثق من CRM ولينز",
      dataDate: "1-16 نوفمبر 2026 (اليوم 16)",
      tabs: {
        overview: "الرؤية التنفيذية العامة",
        dailyplan: "خطة العمل اليومية",
        teams: "الفرق المصغرة (5)",
        individuals: "المستشارين الأفراد (18)",
        consumption: "استهلاك الحصص (82%)",
        upgrade: "مركز التجديد المبكر (20%)",
        leads: "العملاء غير المغطين (5,196)",
        englishclub: "النادي الإنجليزي (45%)",
        sop: "الامتثال لـ SOP",
        operations: "مصفوفة العمليات"
      },
      kpis: {
        cashLabel: "إجمالي الكاش المحقق (MTD)",
        contractsLabel: "إجمالي العقود المغلقة",
        achLabel: "بنشمارك اليوم 16 المستهدف",
        repsLabel: "المستشارين النشطين وترقيات M2",
        targetPrefix: "الهدف: ",
        projectedPrefix: " | المتوقع: ",
        achPrefix: "بنشمارك اليوم 16: 41% | الهدف: ",
        achDays: "اليوم 16 من 30 | وتيرة الهدف المتوقعة: 41% (متبقي 14 يوماً)",
        m2Conversion: "3.4% نسبة تحويل التجديد المبكر M2 (15 من 438)"
      },
      sections: {
        teamsTitle: "وتيرة الفرق المصغرة وقطاع Big Team 01 — الإنجاز مقابل الهدف",
        teamsSub: "مقارنة سرعة تحقيق الإيرادات عبر الفرق الخمسة مقابل منحنى الوتيرة الرسمي (5% إلى 103%)",
        teamsTableTitle: "تفاصيل أداء الفرق المصغرة الخمسة",
        teamsTableSub: "نظرة شاملة على الفرق: الكاش، الأهداف، الفجوات، متوسط الصفقات، وقادة الفرق",
        indTitle: "التحليل التفصيلي لأداء مستشاري المبيعات",
        indSub: "بيانات تفصيلية لكافة الـ 18 مستشار مبيعات: الإيراد المحقق، نسبة الإنجاز، محفظة التجديد، والموقف من الوتيرة",
        consumptionTitle: "أداء استهلاك الحصص لمستشاري المبيعات (18 مستشاراً)",
        consumptionSub: "توزيع استهلاك حصص الطلاب: 0 حصص (فئة الخطر)، 1-3، 4-7، 8-11، و 12+ حصة مقابل مستهدف 82%",
        upgradeTitle: "مركز تسريع التجديد المبكر (مرحلة الـ 20% المستهدفة)",
        upgradeSub: "قائمة الطلاب المؤهلين للتجديد ممن يملكون أقل من 10 حصص متبقية",
        sopTitle: "بطاقات الامتثال لمسارات الـ SOP | أداء الفرق",
        sopSub: "التزام العمليات التشغيلية عبر جولات R1-R6 ونسبة حضور النادي الإنجليزي",
        ecTitle: "متابعة حضور وتحويل النادي الإنجليزي (English Club)",
        ecSub: "تتبع حضور الطلاب لجلسات النادي الإنجليزي يوم السبت ومعدل الحجز"
      },
      dock: {
        overview: "نظرة عامة",
        teams: "الفرق",
        reps: "المستشارين",
        consumption: "الاستهلاك",
        upgrade: "الترقية",
        leads: "العملاء",
        rateCard: "الأسعار",
        top: "للأعلى"
      },
      pills: {
        all: "جميع المستشارين",
        behind: "متأخرون عن البنشمارك",
        zero: "صفر كاش",
        nodeal: "0-1 صفقة مغلقة",
        pending: "ترقيات معلقة",
        calls: "تغطية مكالمات < 70%",
        ach100: "محقق 100% فأكثر"
      },
      headers: {
        rank: "#",
        repName: "مستشار المبيعات",
        team: "الفريق المصغر",
        cash: "المحقق ($)",
        target: "الهدف ($)",
        ach: "نسبة الإنجاز",
        pace: "الوتيرة",
        nextDayBm: "🚀 بنشمارك الغد (يوم 17: 43%)",
        m2: "M2",
        renewals: "تجديد",
        base: "قاعدة التجديد",
        calls: "تغطية الاتصال",
        zeroClasses: "صفر حصص",
        status: "الحالة"
      },
      toki: {
        bubbleText: "👋 مرحباً، أنا توكي!",
        bubbleSub: "مساعدك الذكي • اسألني",
        modalTitle: "توكي المساعد الذكي",
        modalSub: "المساعد الصوتي والبياني لقطاع Big Team 01",
        inputPlaceholder: "اسأل توكي أي سؤال عن المبيعات أو البنشمارك أو الأسعار...",
        soundwaveLabel: "توكي يتحدث الآن..."
      }
    },
    zh: {
      dir: 'ltr',
      font: "'Outfit', 'Inter', system-ui, sans-serif",
      title: "大一组 (Big Team 01) — 核心管理层执行看板",
      cmdBtn: "智能搜索 / 问答...",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      shareBtn: "分享看板链接",
      rateCardBtn: "官方课包价格计算器",
      verifiedBadge: "CRM与Lens双重核验",
      dataDate: "2026年11月1-16日 (第16天)",
      tabs: {
        overview: "管理层执行总览",
        dailyplan: "每日智能行动计划",
        teams: "小组战报 (5组)",
        individuals: "销售个人龙虎榜 (18人)",
        consumption: "课时消耗达标率 (82%)",
        upgrade: "提续加速中心 (20%)",
        leads: "未覆盖学员名单 (5,196人)",
        englishclub: "英语俱乐部 (45%)",
        sop: "SOP合规追踪",
        operations: "综合运营矩阵"
      },
      kpis: {
        cashLabel: "累计达成业绩 (MTD)",
        contractsLabel: "累计成单订单数",
        achLabel: "第16天官方基准线",
        repsLabel: "活跃销售与提续转化",
        targetPrefix: "目标: ",
        projectedPrefix: " | 月末预估: ",
        achPrefix: "第16天基准: 41% | 目标: ",
        achDays: "第16天/共30天 | 预期基准达成率: 41% (剩余14天)",
        m2Conversion: "3.4% 提续转化率 (15/438)"
      },
      sections: {
        teamsTitle: "各小组与大一组总业绩达成对比",
        teamsSub: "5个业务小组业绩入账速度与官方基准曲线 (5% 至 103%) 全面比对",
        teamsTableTitle: "5个业务小组深度战报",
        teamsTableSub: "小组全面指标：业绩、目标、缺口、平均客单价与组长名单",
        indTitle: "销售个人核心数据深度剖析",
        indSub: "18位销售顾问全景业务数据：业绩、成单、提续池与基准达标状态",
        consumptionTitle: "销售个人课时消耗达标表现 (18人)",
        consumptionSub: "学员课时消耗分布：0课时(高危预警)、1-3节、4-7节、8-11节及12节以上",
        upgradeTitle: "在读提续加速转化中心 (20% 里程碑目标)",
        upgradeSub: "剩余课时不足10节的高意向待提续学员专项名单",
        sopTitle: "SOP流程规范合规看板 | 小组战报",
        sopSub: "R1-R6 各轮次合规率追踪与周六英语俱乐部出勤达标分析",
        ecTitle: "英语俱乐部出勤与转化雷达",
        ecSub: "追踪周六英语俱乐部学员预约与实际出勤转化"
      },
      dock: {
        overview: "总览",
        teams: "小组",
        reps: "销售",
        consumption: "课时",
        upgrade: "提续",
        leads: "名单",
        rateCard: "价格",
        top: "顶部"
      },
      pills: {
        all: "全部销售顾问",
        behind: "落后基准线",
        zero: "零业绩销售",
        nodeal: "仅成交0-1单",
        pending: "待转化提续",
        calls: "通话率 < 70%",
        ach100: "达成率 100%+"
      },
      headers: {
        rank: "#",
        repName: "销售顾问",
        team: "所属小组",
        cash: "业绩 ($)",
        target: "目标 ($)",
        ach: "达成率",
        pace: "进度状态",
        nextDayBm: "🚀 明日基准 (D17: 43%)",
        m2: "M2提续",
        renewals: "总续费单",
        base: "在读池",
        calls: "通话覆盖率",
        zeroClasses: "0课时学员",
        status: "达标状态"
      },
      toki: {
        bubbleText: "👋 您好，我是 Toki！",
        bubbleSub: "专属 AI 副驾 • 欢迎提问",
        modalTitle: "Toki AI 智能副驾",
        modalSub: "大一组专属语音与数据分析助手",
        inputPlaceholder: "向 Toki 询问销售战报、基准线或课包价格...",
        soundwaveLabel: "Toki 正在播报..."
      }
    }
  };

  function setLanguage(lang) {
    if (!['en', 'ar', 'zh'].includes(lang)) lang = 'en';
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    const t = TRANSLATIONS[lang];
    window.__currentLang = lang;

    // 1. Update Document HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.title = t.title;

    // 2. Update Language Toggle Buttons (Active State)
    ['en', 'ar', 'zh'].forEach(l => {
      const btn = document.getElementById('btnLang' + l.toUpperCase());
      if (btn) {
        if (l === lang) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    // 3. Navbar elements
    const cmdText = document.querySelector('#navCommandBtn .cmd-text');
    if (cmdText) cmdText.textContent = t.cmdBtn;

    const shareText = document.getElementById('navShareBtnText');
    if (shareText) shareText.textContent = t.shareBtn;

    const calcBtn = document.querySelector('.nav-calc-btn span');
    if (calcBtn) calcBtn.textContent = t.rateCardBtn;

    const sourceBadge = document.querySelector('.nav-source-badge');
    if (sourceBadge && sourceBadge.lastChild) {
      sourceBadge.lastChild.textContent = ' ' + t.verifiedBadge;
    }

    // 4. Main Tabs
    const tabMap = {
      overview: t.tabs.overview,
      dailyplan: t.tabs.dailyplan,
      teams: t.tabs.teams,
      individuals: t.tabs.individuals,
      consumption: t.tabs.consumption,
      upgrade: t.tabs.upgrade,
      leads: t.tabs.leads,
      englishclub: t.tabs.englishclub,
      sop: t.tabs.sop,
      operations: t.tabs.operations
    };

    Object.entries(tabMap).forEach(([tabKey, tabLabel]) => {
      const tabBtn = document.querySelector(`.tab[data-tab="${tabKey}"]`);
      if (tabBtn) {
        tabBtn.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            node.textContent = ' ' + tabLabel + ' ';
          }
        });
      }
    });

    // 5. Tactical Action Filter Pills
    const pillMap = {
      all: t.pills.all,
      behind: t.pills.behind,
      zero: t.pills.zero,
      nodeal: t.pills.nodeal,
      pending: t.pills.pending,
      calls: t.pills.calls,
      ach100: t.pills.ach100
    };
    Object.entries(pillMap).forEach(([filterKey, filterLabel]) => {
      const pill = document.querySelector(`.tactical-pill[data-filter="${filterKey}"]`);
      if (pill) {
        const countSpan = pill.querySelector('.pill-count');
        const iconSpan = pill.querySelector('.pill-icon');
        const count = countSpan ? countSpan.textContent : '';
        const icon = iconSpan ? iconSpan.textContent : '';
        pill.innerHTML = `${icon ? `<span class="pill-icon">${icon}</span>` : ''} ${filterLabel} ${count ? `<span class="pill-count">${count}</span>` : ''}`;
      }
    });

    // 6. Executive KPI Labels
    const kpiCash = document.querySelector('.kpi-card.kpi-cash .kpi-label');
    if (kpiCash) kpiCash.textContent = t.kpis.cashLabel;

    const kpiContracts = document.querySelector('.kpi-card.kpi-contracts .kpi-label');
    if (kpiContracts) kpiContracts.textContent = t.kpis.contractsLabel;

    const kpiAch = document.querySelector('.kpi-card.kpi-ach .kpi-label');
    if (kpiAch) kpiAch.textContent = t.kpis.achLabel;

    const kpiReps = document.querySelector('.kpi-card.kpi-base .kpi-label');
    if (kpiReps) kpiReps.textContent = t.kpis.repsLabel;

    const achDays = document.getElementById('achDays');
    if (achDays) achDays.textContent = t.kpis.achDays;

    // 7. Section Titles & Descriptions
    const secHeaders = document.querySelectorAll('.section-header');
    if (secHeaders && secHeaders.length > 0) {
      if (secHeaders[0]) {
        const h2 = secHeaders[0].querySelector('h2');
        const p = secHeaders[0].querySelector('p');
        if (h2) h2.textContent = t.sections.teamsTitle;
        if (p) p.textContent = t.sections.teamsSub;
      }
      if (secHeaders[1]) {
        const h2 = secHeaders[1].querySelector('h2');
        const p = secHeaders[1].querySelector('p');
        if (h2) h2.textContent = t.sections.teamsTableTitle;
        if (p) p.textContent = t.sections.teamsTableSub;
      }
    }

    // 8. Floating Cyber Control Dock
    const dockMap = [
      { sel: '.cyber-dock .dock-btn:nth-child(1) span', text: t.dock.overview },
      { sel: '.cyber-dock .dock-btn:nth-child(2) span', text: t.dock.teams },
      { sel: '.cyber-dock .dock-btn:nth-child(3) span', text: t.dock.reps },
      { sel: '.cyber-dock .dock-btn:nth-child(4) span', text: t.dock.consumption },
      { sel: '.cyber-dock .dock-btn:nth-child(5) span', text: t.dock.upgrade },
      { sel: '.cyber-dock .dock-btn:nth-child(6) span', text: t.dock.leads },
      { sel: '.cyber-dock .dock-calc-highlight span', text: t.dock.rateCard }
    ];
    dockMap.forEach(item => {
      const el = document.querySelector(item.sel);
      if (el) el.textContent = item.text;
    });

    // 9. Synchronize Toki Assistant UI
    const tokiBubbleText = document.getElementById('tokiFloatBubbleText');
    if (tokiBubbleText) tokiBubbleText.textContent = t.toki.bubbleText;

    const tokiBubbleSub = document.getElementById('tokiFloatBubbleSub');
    if (tokiBubbleSub) tokiBubbleSub.textContent = t.toki.bubbleSub;

    const tokiModalTitle = document.getElementById('tokiModalTitle');
    if (tokiModalTitle) tokiModalTitle.textContent = t.toki.modalTitle;

    const tokiModalSub = document.getElementById('tokiModalSub');
    if (tokiModalSub) tokiModalSub.innerHTML = `<span class="toki-status-dot"></span> ${t.toki.modalSub}`;

    const tokiInput = document.getElementById('tokiTextInput');
    if (tokiInput) tokiInput.placeholder = t.toki.inputPlaceholder;

    const tokiSoundwaveLabel = document.getElementById('tokiSoundwaveLabel');
    if (tokiSoundwaveLabel) tokiSoundwaveLabel.textContent = t.toki.soundwaveLabel;

    if (typeof window.setTokiLanguage === 'function') {
      window.setTokiLanguage(lang);
    }
  }

  // Export globally
  window.setDashboardLanguage = setLanguage;
  window.getDashboardLanguage = () => currentLang;
  window.__translations = TRANSLATIONS;

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLanguage(currentLang));
  } else {
    setLanguage(currentLang);
  }

})();
