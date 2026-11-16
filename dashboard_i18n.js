/**
 * Big Team 01 — Tri-lingual Internationalization Engine (i18n)
 * Supported Languages: English (en), Arabic (ar), Chinese (zh)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'bt01_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  const TRANSLATIONS = {
    en: {
      dir: 'ltr',
      font: "'Inter', system-ui, sans-serif",
      title: "Big Team 01 — Executive Dashboard",
      subtitle: "Senior Manager: Hussein El A'sar | Month: November 2026 (MTD Day 16/30)",
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
        totalTarget: "Total Target",
        cashAchieved: "Total Cash Achieved",
        benchmark: "Benchmark Pace (Day 16: 41%)",
        cashGap: "Cash Gap to 100%",
        dailyRunRate: "Daily Run Rate Needed",
        contracts: "Total Contracts Closed",
        upgradeM2: "Upgrade M2 Renewals"
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
      }
    },
    ar: {
      dir: 'rtl',
      font: "'Cairo', 'Inter', system-ui, sans-serif",
      title: "قطاع Big Team 01 — لوحة القيادة التنفيذية",
      subtitle: "مدير أول: حسين الأعصر | شهر: نوفمبر 2026 (اليوم 16/30 MTD)",
      cmdBtn: "ابحث أو اسأل الذكاء الاصطناعي...",
      darkMode: "الوضع الداكن",
      lightMode: "الوضع الفاتح",
      shareBtn: "مشاركة الرابط",
      rateCardBtn: "حاسبة الباقات المعتمدة",
      verifiedBadge: "موثق من CRM ولينز",
      dataDate: "1-16 نوفمبر 2026 (اليوم 16)",
      tabs: {
        overview: "النظرة التنفيذية العامة",
        dailyplan: "خطة العمل اليومية",
        teams: "الفرق الصغيرة (5)",
        individuals: "المستشارين الأفراد (18)",
        consumption: "استهلاك الحصص (82%)",
        upgrade: "مركز التجديد المبكر (20%)",
        leads: "العملاء غير المتابعين (5,196)",
        englishclub: "النادي الإنجليزي (45%)",
        sop: "الامتثال لـ SOP",
        operations: "مصفوفة العمليات"
      },
      kpis: {
        totalTarget: "الهدف الإجمالي",
        cashAchieved: "المحقق الفعلي",
        benchmark: "بنشمارك اليوم (اليوم 16: 41%)",
        cashGap: "الفجوة المالية للهدف",
        dailyRunRate: "المعدل اليومي المطلوب",
        contracts: "إجمالي العقود المغلقة",
        upgradeM2: "تجديدات الترقية M2"
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
      }
    },
    zh: {
      dir: 'ltr',
      font: "'Outfit', 'Inter', system-ui, sans-serif",
      title: "大一组 (Big Team 01) — 核心管理层执行看板",
      subtitle: "高级经理: 侯赛因·埃拉萨 (Hussein El A'sar) | 周期: 2026年11月 (第16天/共30天)",
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
        totalTarget: "部门总目标",
        cashAchieved: "累计达成业绩",
        benchmark: "当前基准线 (第16天: 41%)",
        cashGap: "全月目标差额",
        dailyRunRate: "每日所需业绩速度",
        contracts: "累计成单订单数",
        upgradeM2: "提续 M2 转化单数"
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
      }
    }
  };

  function setLanguage(lang) {
    if (!['en', 'ar', 'zh'].includes(lang)) lang = 'en';
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    const t = TRANSLATIONS[lang];
    window.__currentLang = lang;

    // Update document dir & lang attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;

    // Update Language Toggle Buttons
    ['en', 'ar', 'zh'].forEach(l => {
      const btn = document.getElementById('btnLang' + l.toUpperCase());
      if (btn) {
        if (l === lang) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });

    // 1. Navbar elements
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

    // 2. Tabs
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
        // preserve badge if any
        const badge = tabBtn.querySelector('span');
        const svg = tabBtn.querySelector('svg');
        tabBtn.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
            node.textContent = ' ' + tabLabel + ' ';
          }
        });
      }
    });

    // 3. Tactical Action Pills
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

    // 4. Notify Toki assistant to update its UI & language mode
    if (typeof window.setTokiLanguage === 'function') {
      window.setTokiLanguage(lang);
    }
  }

  // Export
  window.setDashboardLanguage = setLanguage;
  window.getDashboardLanguage = () => currentLang;
  window.__translations = TRANSLATIONS;

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
  });

})();
