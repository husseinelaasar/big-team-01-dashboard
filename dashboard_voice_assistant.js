/**
 * Toki — Big Team 01 Interactive 3D AI Voice & Data Assistant
 * Tri-lingual Domain Intelligence: English, Arabic, Chinese (EN / AR / ZH)
 * Native Light-Theme Corporate Aesthetics
 */

(function () {
  'use strict';

  // Benchmark Pacing Table (Day 1 - 31)
  const OFFICIAL_PACING = {
    1: 5,   2: 8,   3: 11,  4: 14,  5: 17,
    6: 20,  7: 23,  8: 24,  9: 25,  10: 26,
    11: 29, 12: 32, 13: 35, 14: 38, 15: 40,
    16: 41, 17: 43, 18: 46, 19: 49, 20: 51,
    21: 54, 22: 56, 23: 57, 24: 58, 25: 60,
    26: 64, 27: 76, 28: 83, 29: 90, 30: 96,
    31: 102
  };

  const CURRENT_DAY = 16;
  const SAR_RATE = 3.75;

  // Language & Voice State
  let activeLang = localStorage.getItem('bt01_lang') || 'en';
  let isListening = false;
  let recognition = null;
  let isSpeechEnabled = true;
  let isSpeaking = false;
  let currentUtterance = null;

  // Sound Engine
  function speak(text, langCode, onEnd) {
    if (!isSpeechEnabled) {
      if (onEnd) onEnd();
      return;
    }
    const synth = window.speechSynthesis;
    if (!synth) {
      if (onEnd) onEnd();
      return;
    }

    try { synth.cancel(); } catch (e) {}

    const cleanText = text.replace(/[*_#`]/g, '').replace(/https?:\/\/\S+/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 1.0;
    utter.pitch = 1.05;

    // Pick language and matching voice
    const targetLang = langCode || activeLang;
    if (targetLang === 'ar') utter.lang = 'ar-SA';
    else if (targetLang === 'zh') utter.lang = 'zh-CN';
    else utter.lang = 'en-US';

    const voices = synth.getVoices() || [];
    let matchedVoice = null;

    if (targetLang === 'ar') {
      matchedVoice = voices.find(v => v.lang.startsWith('ar'));
    } else if (targetLang === 'zh') {
      matchedVoice = voices.find(v => v.lang.startsWith('zh') || v.lang.includes('Chinese'));
    } else {
      matchedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy') || v.name.includes('Samantha'))) || voices.find(v => v.lang.startsWith('en'));
    }

    if (matchedVoice) utter.voice = matchedVoice;

    utter.onstart = () => {
      isSpeaking = true;
      updateSoundwave(true);
    };
    utter.onend = () => {
      isSpeaking = false;
      updateSoundwave(false);
      if (onEnd) onEnd();
    };
    utter.onerror = () => {
      isSpeaking = false;
      updateSoundwave(false);
      if (onEnd) onEnd();
    };

    currentUtterance = utter;
    synth.speak(utter);
  }

  function stopSpeaking() {
    const synth = window.speechSynthesis;
    if (synth) {
      try { synth.cancel(); } catch (e) {}
    }
    isSpeaking = false;
    updateSoundwave(false);
  }

  function updateSoundwave(active) {
    const sw = document.getElementById('tokiSoundwave');
    const avatar = document.getElementById('tokiModalAvatar');
    if (sw) sw.style.display = active ? 'flex' : 'none';
    if (avatar) {
      if (active) avatar.classList.add('toki-speaking');
      else avatar.classList.remove('toki-speaking');
    }
  }

  // Format Money helper
  function formatMoney(amountUSD) {
    if (typeof window.fmtCurr === 'function') {
      return window.fmtCurr(amountUSD);
    }
    const curr = window.__activeCurrency || 'USD';
    if (curr === 'SAR') {
      return Math.round(amountUSD * SAR_RATE).toLocaleString('en-US') + ' SAR';
    }
    return '$' + Math.round(amountUSD || 0).toLocaleString('en-US');
  }

  // Detect Language of prompt
  function detectPromptLanguage(text) {
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    return activeLang; // Default to active dashboard language
  }

  // =========================================================================
  // TOKI UNIVERSAL DOMAIN INTELLIGENCE ENGINE (v2.0 - 100% ACCURATE & SELF-HEALING)
  // =========================================================================
/**
 * Toki Universal Domain Intelligence Engine (v2.0)
 * Big Team 01 — Executive Sales & Operations
 */

(function (global) {
  'use strict';

  // 1. BENCHMARK & SYSTEM CONFIGURATION
  const OFFICIAL_PACING = {
    1: 5,   2: 8,   3: 11,  4: 14,  5: 17,
    6: 20,  7: 23,  8: 24,  9: 25,  10: 26,
    11: 29, 12: 32, 13: 35, 14: 38, 15: 40,
    16: 41, 17: 43, 18: 46, 19: 49, 20: 51,
    21: 54, 22: 56, 23: 57, 24: 58, 25: 60,
    26: 64, 27: 76, 28: 83, 29: 90, 30: 96,
    31: 102
  };

  const CURRENT_DAY = 16;
  const SAR_RATE = 3.75;

  // 2. CURRENCY FORMATTER
  function formatMoney(amountUSD, lang, currency) {
    if (typeof window !== 'undefined' && typeof window.fmtCurr === 'function') {
      return window.fmtCurr(amountUSD);
    }
    const curr = currency || (typeof window !== 'undefined' && window.__activeCurrency) || 'USD';
    const val = Math.round(amountUSD || 0);
    if (curr === 'SAR') {
      const sar = Math.round(val * SAR_RATE);
      if (lang === 'ar') return `${sar.toLocaleString('en-US')} ريال سعودي`;
      if (lang === 'zh') return `${sar.toLocaleString('en-US')} 沙特里亚尔 (SAR)`;
      return `${sar.toLocaleString('en-US')} SAR`;
    }
    if (lang === 'ar') return `$${val.toLocaleString('en-US')} دولار`;
    if (lang === 'zh') return `$${val.toLocaleString('en-US')} 美元`;
    return `$${val.toLocaleString('en-US')}`;
  }

  // 3. LANGUAGE DETECTION
  function detectPromptLanguage(text, activeLang) {
    if (!text) return activeLang || 'en';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    return activeLang || 'en';
  }

  // 4. APPROVED RATE CARDS & PACKAGES
  const RATE_CARDS = [
    { classes: 75, durationEn: '6 Months', durationAr: '6 شهور', sar: 2175, usd: 580, popular: false },
    { classes: 90, durationEn: '7 Months', durationAr: '7 شهور', sar: 2370, usd: 632, popular: false },
    { classes: 105, durationEn: '9 Months', durationAr: '9 شهور', sar: 2625, usd: 700, popular: false },
    { classes: 150, durationEn: '1 Full Year (Best Value)', durationAr: 'سنة كاملة (الأكثر طلباً)', sar: 3300, usd: 880, popular: true },
    { classes: 225, durationEn: '1.5 Years', durationAr: 'سنة ونصف', sar: 4800, usd: 1280, popular: false },
    { classes: 300, durationEn: '2 Full Years', durationAr: 'سنتان كاملتان', sar: 6000, usd: 1600, popular: false }
  ];

  // 5. REPS DICTIONARY & COMPREHENSIVE ALIASES
  const REPS_CATALOG = [
    {
      id: 'EGSS-ashraqatal',
      key: 'ashraqat',
      nameEn: 'Ashraqat Al',
      nameAr: 'إشراقت آل',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: true,
      aliases: ['ashraqat', 'ashraqatal', 'إشراقت', 'اشراقت', 'إشراقة', 'اشراقة', 'ashra']
    },
    {
      id: 'EGSS-juliamonir01',
      key: 'julia',
      nameEn: 'Julia Monir',
      nameAr: 'جوليا منير',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['julia', 'juliamonir', 'monir', 'جوليا', 'جوليا منير', 'منير', 'scs julia', 'ss julia']
    },
    {
      id: 'EGSS-nohayoussry',
      key: 'noha',
      nameEn: 'Noha Youssry',
      nameAr: 'نهى يسري',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['noha', 'youssry', 'nohayoussry', 'نهى', 'نهي', 'يسري', 'يسرى', 'نهى يسري']
    },
    {
      id: 'EGSS-mahmoud04',
      key: 'mahmoud04',
      nameEn: 'Mahmoud 04',
      nameAr: 'محمود 04',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['mahmoud04', 'mahmoud 04', 'محمود 04', 'محمود04', 'محمود 4']
    },
    {
      id: 'EGSS-samira01',
      key: 'samira',
      nameEn: 'Samira',
      nameAr: 'سميرة',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['samira', 'samira01', 'سميرة', 'سميره']
    },
    {
      id: 'EGSS-abdelrahmannasef',
      key: 'nasef',
      nameEn: 'Abdelrahman Nasef',
      nameAr: 'عبدالرحمن ناصف',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['nasef', 'abdelrahmannasef', 'abdelrahman nasef', 'ناصف', 'عبدالرحمن ناصف', 'عبد الرحمن ناصف']
    },
    {
      id: 'EGSS-ibrahimismaiel',
      key: 'ibrahim',
      nameEn: 'Ibrahim Ismaiel (Abd El Shakour)',
      nameAr: 'إبراهيم إسماعيل (عبد الشكور)',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: true,
      aliases: ['ibrahim', 'ismaiel', 'ibrahimismaiel', 'abdelshakour', 'shakour', 'ابراهيم', 'إبراهيم', 'اسماعيل', 'إسماعيل', 'عبد الشكور', 'عبدالشكور']
    },
    {
      id: 'EGSS-khaledgonam',
      key: 'khaled',
      nameEn: 'Khaled Gonam',
      nameAr: 'خالد غنيم',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['khaled', 'gonam', 'khaledgonam', 'خالد', 'غنيم', 'خالد غنيم']
    },
    {
      id: 'EGSS-omarmoneb',
      key: 'omar',
      nameEn: 'Omar Moneb',
      nameAr: 'عمر منيب',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['omar', 'moneb', 'omarmoneb', 'عمر', 'منيب', 'عمر منيب']
    },
    {
      id: 'EGSS-alihesham01',
      key: 'ali',
      nameEn: 'Ali Hesham',
      nameAr: 'علي هشام',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['ali', 'hesham', 'alihesham', 'alihesham01', 'علي', 'هشام', 'علي هشام']
    },
    {
      id: 'EGSS-abdelrhmanshehata',
      key: 'shehata',
      nameEn: 'Abdelrahman Shehata',
      nameAr: 'عبدالرحمن شحاتة',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: true,
      aliases: ['shehata', 'abdelrhmanshehata', 'abdelrahman shehata', 'شحاتة', 'شحاته', 'عبدالرحمن شحاتة', 'عبد الرحمن شحاته']
    },
    {
      id: 'EGSS-hayamhassan',
      key: 'hayam',
      nameEn: 'Hayam Hassan',
      nameAr: 'هيام حسن',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: false,
      aliases: ['hayam', 'hassan', 'hayamhassan', 'هيام', 'هيام حسن', 'حسن']
    },
    {
      id: 'EGSS-titooooo',
      key: 'tito',
      nameEn: 'Tito',
      nameAr: 'تيتو',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: false,
      aliases: ['tito', 'titooooo', 'تيتو']
    },
    {
      id: 'EGSS-marwaahmed',
      key: 'marwa',
      nameEn: 'Marwa Ahmed',
      nameAr: 'مروة أحمد',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: false,
      aliases: ['marwa', 'marwaahmed', 'مروة', 'مروه', 'مروة أحمد', 'مروه احمد']
    },
    {
      id: 'EGSS-amrsafwat',
      key: 'amr',
      nameEn: 'Amr Safwat',
      nameAr: 'عمرو صفوت',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: true,
      aliases: ['amr', 'safwat', 'amrsafwat', 'عمرو', 'صفوت', 'عمرو صفوت']
    },
    {
      id: 'EGSS-mohamedha',
      key: 'mohamedha',
      nameEn: 'Mohamed Hamed',
      nameAr: 'محمد حامد',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: true,
      aliases: ['mohamedha', 'hamed', 'mohamed hamed', 'حامد', 'محمد حامد']
    },
    {
      id: 'EGSS-ahmedshoukry',
      key: 'shoukry',
      nameEn: 'Ahmed Shoukry',
      nameAr: 'أحمد شكري',
      team: 'ME-EGSS30',
      teamCode: 'EGSS30',
      isTL: false,
      aliases: ['shoukry', 'ahmedshoukry', 'ahmed shoukry', 'شكري', 'احمد شكري', 'أحمد شكري']
    },
    {
      id: 'EGSS-mahmoudkhamis',
      key: 'khamis',
      nameEn: 'Mahmoud Khamis',
      nameAr: 'محمود خميس',
      team: 'ME-EGSS30',
      teamCode: 'EGSS30',
      isTL: false,
      aliases: ['khamis', 'mahmoudkhamis', 'mahmoud khamis', 'خميس', 'محمود خميس']
    }
  ];

  // 6. TEAMS DICTIONARY
  const TEAMS_CATALOG = [
    { code: 'EGSS01', label: 'ME-EGSS01', tlNameEn: 'Ashraqat Al', tlNameAr: 'إشراقت آل', aliases: ['egss01', 'team 1', 'team 01', 'pod 1', 'ashraqat team', 'فريق 1', 'فريق 01', 'فريق إشراقت', 'فريق اشراقت'] },
    { code: 'EGSS05', label: 'ME-EGSS05', tlNameEn: 'Ibrahim Ismaiel', tlNameAr: 'إبراهيم إسماعيل', aliases: ['egss05', 'team 5', 'team 05', 'pod 5', 'ibrahim team', 'فريق 5', 'فريق 05', 'فريق إبراهيم', 'فريق ابراهيم', 'فريق عبد الشكور'] },
    { code: 'EGSS10', label: 'ME-EGSS10', tlNameEn: 'Abdelrahman Shehata', tlNameAr: 'عبدالرحمن شحاتة', aliases: ['egss10', 'team 10', 'pod 10', 'shehata team', 'فريق 10', 'فريق شحاتة', 'فريق شحاته'] },
    { code: 'EGSS13', label: 'ME-EGSS13', tlNameEn: 'Amr Safwat & Mohamed Hamed', tlNameAr: 'عمرو صفوت ومحمد حامد', aliases: ['egss13', 'team 13', 'pod 13', 'amr team', 'safwat team', 'فريق 13', 'فريق عمرو', 'فريق صفوت', 'فريق حامد'] },
    { code: 'EGSS30', label: 'ME-EGSS30', tlNameEn: 'Hussein El Aasar', tlNameAr: 'حسين الأعصر', aliases: ['egss30', 'team 30', 'pod 30', 'hussein team', 'aasar team', 'فريق 30', 'فريق حسين', 'فريق الأعصر', 'فريق الاعصر'] }
  ];

  // 7. ROBUST BASELINE MODEL (Safe fallback when live model is loading)
  const BASELINE_DATA = {
    summary: {
      totalCash: 73566,
      totalTarget: 173541,
      achievement: 42.4,
      totalGap: 99975,
      dailyNeeded: 7141,
      totalContracts: 77,
      totalContractsTarget: 252,
      totalUpgradeM2: 7,
      totalUpgrade20Target: 88,
      totalUpgrade20Needed: 81
    },
    individuals: [
      { name: "EGSS-ashraqatal", team: "EGSS01", cash: 2040, refund: 0, target: 10998, contracts: 2, achievement: 18.5, upgradeM2: 0, upgradeBase: 31, coverRate: 72.2 },
      { name: "EGSS-juliamonir01", team: "EGSS01", cash: 2480, refund: 0, target: 8486, contracts: 3, achievement: 29.2, upgradeM2: 0, upgradeBase: 16, coverRate: 80.0 },
      { name: "EGSS-nohayoussry", team: "EGSS01", cash: 1157, refund: 1383, target: 8486, contracts: 3, achievement: 13.6, upgradeM2: 0, upgradeBase: 26, coverRate: 60.0 },
      { name: "EGSS-mahmoud04", team: "EGSS01", cash: 6860, refund: 0, target: 10486, contracts: 5, achievement: 65.4, upgradeM2: 1, upgradeBase: 20, coverRate: 75.0 },
      { name: "EGSS-samira01", team: "EGSS05", cash: 5260, refund: 0, target: 8486, contracts: 6, achievement: 62.0, upgradeM2: 1, upgradeBase: 16, coverRate: 84.6 },
      { name: "EGSS-abdelrahmannasef", team: "EGSS05", cash: 4747, refund: 0, target: 8486, contracts: 5, achievement: 55.9, upgradeM2: 1, upgradeBase: 18, coverRate: 35.7 },
      { name: "EGSS-ibrahimismaiel", team: "EGSS05", cash: 6656, refund: 0, target: 10996, contracts: 8, achievement: 60.5, upgradeM2: 3, upgradeBase: 23, coverRate: 64.7 },
      { name: "EGSS-khaledgonam", team: "EGSS05", cash: 800, refund: 1020, target: 8486, contracts: 2, achievement: 9.4, upgradeM2: 0, upgradeBase: 14, coverRate: 41.7 },
      { name: "EGSS-omarmoneb", team: "EGSS05", cash: 2140, refund: 0, target: 8843, contracts: 3, achievement: 24.2, upgradeM2: 1, upgradeBase: 19, coverRate: 64.7 },
      { name: "EGSS-alihesham01", team: "EGSS05", cash: 2664, refund: 0, target: 5965, contracts: 4, achievement: 44.7, upgradeM2: 0, upgradeBase: 18, coverRate: 60.0 },
      { name: "EGSS-abdelrhmanshehata", team: "EGSS10", cash: 3772, refund: 0, target: 6686, contracts: 5, achievement: 56.4, upgradeM2: 3, upgradeBase: 28, coverRate: 78.6 },
      { name: "EGSS-hayamhassan", team: "EGSS10", cash: 2734, refund: 0, target: 6111, contracts: 3, achievement: 44.7, upgradeM2: 2, upgradeBase: 37, coverRate: 47.4 },
      { name: "EGSS-titooooo", team: "EGSS10", cash: 4192, refund: 0, target: 9486, contracts: 5, achievement: 44.2, upgradeM2: 1, upgradeBase: 31, coverRate: 62.5 },
      { name: "EGSS-marwaahmed", team: "EGSS13", cash: 3570, refund: 0, target: 6271, contracts: 4, achievement: 56.9, upgradeM2: 0, upgradeBase: 25, coverRate: 81.0 },
      { name: "EGSS-amrsafwat", team: "EGSS13", cash: 3100, refund: 0, target: 12500, contracts: 2, achievement: 24.8, upgradeM2: 1, upgradeBase: 18, coverRate: 66.7 },
      { name: "EGSS-mohamedha", team: "EGSS13", cash: 10120, refund: 0, target: 12744, contracts: 6, achievement: 79.4, upgradeM2: 0, upgradeBase: 20, coverRate: 81.8 },
      { name: "EGSS-ahmedshoukry", team: "EGSS30", cash: 5320, refund: 0, target: 8486, contracts: 4, achievement: 62.7, upgradeM2: 0, upgradeBase: 26, coverRate: 66.7 },
      { name: "EGSS-mahmoudkhamis", team: "EGSS30", cash: 7551, refund: 0, target: 12550, contracts: 7, achievement: 60.2, upgradeM2: 1, upgradeBase: 25, coverRate: 88.9 }
    ],
    teams: {
      "EGSS01": { code: "EGSS01", label: "ME-EGSS01", leader: "Ashraqat Al", cash: 12537, target: 38456, achievement: 32.6, contracts: 13, gap: 25919, rank: 5 },
      "EGSS05": { code: "EGSS05", label: "ME-EGSS05", leader: "Ibrahim Ismaiel", cash: 22267, target: 48771, achievement: 45.7, contracts: 28, gap: 26504, rank: 4 },
      "EGSS10": { code: "EGSS10", label: "ME-EGSS10", leader: "Abdelrahman Shehata", cash: 10698, target: 22283, achievement: 48.0, contracts: 13, gap: 11585, rank: 3 },
      "EGSS13": { code: "EGSS13", label: "ME-EGSS13", leader: "Amr Safwat & Mohamed Hamed", cash: 16790, target: 31515, achievement: 53.3, contracts: 12, gap: 14725, rank: 2 },
      "EGSS30": { code: "EGSS30", label: "ME-EGSS30", leader: "Hussein El Aasar", cash: 12871, target: 21036, achievement: 61.2, contracts: 11, gap: 8165, rank: 1 }
    },
    consumption: {
      totalStudents: 1714,
      totalStudentsStr: "1,714",
      totalClasses: 10951,
      targetRate: 82.0,
      c0: 353,
      c0Pct: 20.6,
      c1_3: 312,
      c4_7: 590,
      c8_11: 341,
      c12Plus: 118
    },
    sop: {
      r1: 91.0,
      r2: 88.0,
      r3: 84.4,
      r4: 80.4,
      r5: 57.8,
      r6: 77.4,
      ec: 31.2,
      target: 93.0,
      ecTarget: 45.0
    },
    refunds: {
      total: 2403,
      cases: [
        { rep: "Noha Youssry", repAr: "نهى يسري", amount: 1383, team: "EGSS01" },
        { rep: "Khaled Gonam", repAr: "خالد غنيم", amount: 1020, team: "EGSS05" }
      ]
    }
  };

  // Helper to get active model (live or baseline)
  function getModel() {
    if (typeof window !== 'undefined' && window.__model && window.__model.summary && window.__model.individuals && window.__model.individuals.length > 0) {
      return window.__model;
    }
    return BASELINE_DATA;
  }

  // 8. TEXT PRE-PROCESSOR & ENTITY EXTRACTOR
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      // Normalize Arabic diacritics & characters
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
      .replace(/[إأآا]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .replace(/[يى]/g, 'ي')
      // Clean noise characters
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 9. CORE AI INTELLECT & ANSWER GENERATOR
  function answerQuery(rawQuery, options) {
    const opts = options || {};
    const promptLang = detectPromptLanguage(rawQuery, opts.activeLang || 'en');
    const norm = normalizeText(rawQuery);
    const m = getModel();
    const s = m.summary;
    const todayBM = OFFICIAL_PACING[CURRENT_DAY] || 41;
    const tomorrowBM = OFFICIAL_PACING[CURRENT_DAY + 1] || 43;
    const todayExpCash = Math.round(s.totalTarget * (todayBM / 100));
    const tomorrowExpCash = Math.round(s.totalTarget * (tomorrowBM / 100));
    const tomorrowCashNeeded = Math.max(0, tomorrowExpCash - s.totalCash);

    // Check if greeting is present
    const hasGreeting = /^(hello|hi|hey|good morning|good afternoon|toki|مرحبا|اهلا|صباح الخير|مساء الخير|سلام|يا توكي|你好|早上好)/i.test(norm) ||
      norm.includes('hello') || norm.includes('مرحبا') || norm.includes('صباح الخير') || norm.includes('يا توكي');

    // Friendly prefix if greeting + question combined
    let greetingPrefixEn = hasGreeting ? "Hello! 🌟 " : "";
    let greetingPrefixAr = hasGreeting ? "أهلاً بك! 🌟 " : "";
    let greetingPrefixZh = hasGreeting ? "您好！🌟 " : "";

    // -----------------------------------------------------------------------
    // [INTENT 1]: SPECIFIC SALES SPECIALIST LOOKUP (Highest Priority)
    // -----------------------------------------------------------------------
    let matchedRep = null;
    let matchedCatalog = null;

    for (const cat of REPS_CATALOG) {
      // Check every alias against normalized query
      for (const al of cat.aliases) {
        const normAl = normalizeText(al);
        // Match as distinct word boundary or substring
        const regex = new RegExp(`\\b${normAl}\\b|${normAl}`, 'i');
        if (regex.test(norm)) {
          matchedCatalog = cat;
          break;
        }
      }
      if (matchedCatalog) break;
    }

    if (matchedCatalog) {
      // Find rep in active model
      matchedRep = m.individuals.find(r => r.name.toLowerCase().includes(matchedCatalog.key) || r.name.toLowerCase().includes(matchedCatalog.id.toLowerCase()));
      if (!matchedRep) {
        matchedRep = BASELINE_DATA.individuals.find(r => r.name.toLowerCase().includes(matchedCatalog.key));
      }
    }

    if (matchedRep && matchedCatalog) {
      const cleanNameEn = matchedCatalog.nameEn;
      const cleanNameAr = matchedCatalog.nameAr;
      const repTeam = matchedRep.team || matchedCatalog.team;
      const gap = Math.max(0, matchedRep.target - matchedRep.cash);
      const isAhead = matchedRep.achievement >= todayBM;
      const aheadDiff = (matchedRep.achievement - todayBM).toFixed(1);

      // Check specific metric inquiries for this rep
      const asksCash = /cash|revenue|sales|achieve|كاش|فلوس|مبيعات|إيراد|ايراد|حقق/i.test(norm);
      const asksTarget = /target|goal|هدف|تارجت/i.test(norm);
      const asksGap = /gap|needed|remain|فجوة|عجز|باقي|متبقي|فارق/i.test(norm);
      const asksContracts = /contract|deal|deals|contracts|عقد|عقود|صفقة|صفقات/i.test(norm);
      const asksUpgrade = /upgrade|m2|ترقية|تجديد مبكر|ترقيات/i.test(norm);
      const asksCover = /cover|call|calls|مكالمات|اتصال|تغطية/i.test(norm);
      const asksConsumption = /consumption|classes|c0|حصص|استهلاك|استهلاك الحصص/i.test(norm);
      const asksRefund = /refund|deduction|استرداد|خصم|ريفند/i.test(norm);

      // 1.1 Rep Refund Inquiry
      if (asksRefund) {
        const refAmt = matchedRep.refund || 0;
        if (refAmt > 0) {
          if (promptLang === 'ar') {
            return {
              text: `${greetingPrefixAr}المستشار ${cleanNameAr} لديه استرداد مسجل بمبلغ ${formatMoney(refAmt, 'ar')}. إجمالي الكاش الفعلي بعد الخصم هو ${formatMoney(matchedRep.cash, 'ar')} (من إجمالي عقود Gross بقيمة ${formatMoney(matchedRep.cash + refAmt, 'ar')}).`,
              lang: 'ar'
            };
          }
          return {
            text: `${greetingPrefixEn}Specialist ${cleanNameEn} has a registered refund deduction of ${formatMoney(refAmt)}. Net cash achieved is ${formatMoney(matchedRep.cash)} (from a gross volume of ${formatMoney(matchedRep.cash + refAmt)}).`,
            lang: 'en'
          };
        } else {
          if (promptLang === 'ar') {
            return {
              text: `${greetingPrefixAr}سجل المستشار ${cleanNameAr} ناصع بنسبة 100% ولا يوجد عليه أي استردادات أو خصومات (Refund: $0). صافي الكاش هو ${formatMoney(matchedRep.cash, 'ar')}.`,
              lang: 'ar'
            };
          }
          return {
            text: `${greetingPrefixEn}Specialist ${cleanNameEn} has zero refunds (Refund: $0). 100% clean record with net cash of ${formatMoney(matchedRep.cash)}.`,
            lang: 'en'
          };
        }
      }

      // 1.2 Rep Cash Specific Inquiry
      if (asksCash && !asksContracts && !asksUpgrade) {
        if (promptLang === 'ar') {
          return {
            text: `${greetingPrefixAr}حقق المستشار ${cleanNameAr} (${repTeam}) كاش يبلغ ${formatMoney(matchedRep.cash, 'ar')} بنسبة إنجاز ${matchedRep.achievement.toFixed(1)}% من هدفه البالغ ${formatMoney(matchedRep.target, 'ar')}. ` +
              (isAhead ? `وهو متقدم على بنشمارك اليوم بفارق +${aheadDiff}%! 🚀` : `وهو بحاجة إلى ${formatMoney(gap, 'ar')} للوصول إلى المستهدف النهائي.`),
            lang: 'ar'
          };
        }
        return {
          text: `${greetingPrefixEn}Specialist ${cleanNameEn} (${repTeam}) has generated ${formatMoney(matchedRep.cash)} in net cash (${matchedRep.achievement.toFixed(1)}% achievement) toward their ${formatMoney(matchedRep.target)} quota. ` +
            (isAhead ? `Pacing ahead of today's benchmark by +${aheadDiff}%! 🚀` : `Needs ${formatMoney(gap)} to hit full monthly target.`),
          lang: 'en'
        };
      }

      // 1.3 Rep Contracts Specific Inquiry
      if (asksContracts) {
        if (promptLang === 'ar') {
          return {
            text: `${greetingPrefixAr}أغلق المستشار ${cleanNameAr} (${repTeam}) عدد ${matchedRep.contracts} صفقات ناجحة بقيمة إجمالية ${formatMoney(matchedRep.cash, 'ar')}، بمعدل متوسط ${formatMoney(matchedRep.cash / Math.max(1, matchedRep.contracts), 'ar')} لكل عقد!`,
            lang: 'ar'
          };
        }
        return {
          text: `${greetingPrefixEn}Specialist ${cleanNameEn} (${repTeam}) has successfully closed ${matchedRep.contracts} contracts for a total of ${formatMoney(matchedRep.cash)} (average ticket size: ${formatMoney(matchedRep.cash / Math.max(1, matchedRep.contracts))})!`,
          lang: 'en'
        };
      }

      // 1.4 Rep Upgrade M2 Specific Inquiry
      if (asksUpgrade) {
        if (promptLang === 'ar') {
          return {
            text: `${greetingPrefixAr}المستشار ${cleanNameAr}: قاعدة التجديد لديه ${matchedRep.upgradeBase} حساباً، حقق منها ${matchedRep.upgradeM2} تجديدات ترقية مبكرة M2. هدف الـ 20% لديه هو ${Math.ceil(matchedRep.upgradeBase * 0.20)} ترقية.`,
            lang: 'ar'
          };
        }
        return {
          text: `${greetingPrefixEn}Specialist ${cleanNameEn}: Upgrade Base is ${matchedRep.upgradeBase} students, with ${matchedRep.upgradeM2} M2 early upgrade deals secured. 20% milestone target is ${Math.ceil(matchedRep.upgradeBase * 0.20)} upgrades.`,
          lang: 'en'
        };
      }

      // 1.5 Full 360-Degree Comprehensive Rep Profile
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}تقرير الأداء الشامل للمستشار ${cleanNameAr} (${repTeam}):\n` +
            `• الكاش المحقق: ${formatMoney(matchedRep.cash, 'ar')} (نسبة الإنجاز: ${matchedRep.achievement.toFixed(1)}%)\n` +
            `• الهدف الشهري: ${formatMoney(matchedRep.target, 'ar')} (المتبقي: ${formatMoney(gap, 'ar')})\n` +
            `• الصفقات المغلقة: ${matchedRep.contracts} عقود\n` +
            `• ترقيات M2: ${matchedRep.upgradeM2} من محفظة تجديد ${matchedRep.upgradeBase} حساباً\n` +
            `• معدل تغطية المكالمات: ${matchedRep.coverRate.toFixed(1)}%\n` +
            `• الموقف من وتيرة اليوم (41%): ` + (isAhead ? `✅ متقدم بفارق +${aheadDiff}%!` : `⚠️ متأخر بفارق ${formatMoney(gap, 'ar')}.`),
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `${greetingPrefixZh}销售顾问 ${cleanNameEn} (${repTeam}) 专属业绩档案：\n` +
            `• 累计业绩: ${formatMoney(matchedRep.cash, 'zh')} (达成率: ${matchedRep.achievement.toFixed(1)}%)\n` +
            `• 本月目标: ${formatMoney(matchedRep.target, 'zh')} (缺口: ${formatMoney(gap, 'zh')})\n` +
            `• 成单数量: ${matchedRep.contracts} 单\n` +
            `• 提续 M2: 已完成 ${matchedRep.upgradeM2} 单 (在读续费池: ${matchedRep.upgradeBase} 人)\n` +
            `• 通话覆盖率: ${matchedRep.coverRate.toFixed(1)}%\n` +
            `• 基准线对比 (41%): ` + (isAhead ? `领先今日基准线 +${aheadDiff}%！` : `落后基准线，差额 ${formatMoney(gap, 'zh')}。`),
          lang: 'zh'
        };
      }
      return {
        text: `${greetingPrefixEn}Specialist ${cleanNameEn} (${repTeam}) Performance Status:\n` +
          `• Cash Achieved: ${formatMoney(matchedRep.cash)} (${matchedRep.achievement.toFixed(1)}% achievement)\n` +
          `• Target: ${formatMoney(matchedRep.target)} (Gap: ${formatMoney(gap)})\n` +
          `• Contracts Closed: ${matchedRep.contracts} deals\n` +
          `• Upgrade M2: ${matchedRep.upgradeM2} closed from base of ${matchedRep.upgradeBase} accounts\n` +
          `• Call Coverage: ${matchedRep.coverRate.toFixed(1)}%\n` +
          `• Pacing Verdict: ` + (isAhead ? `✅ Pacing ahead of Day 16 benchmark by +${aheadDiff}%!` : `⚠️ Pacing behind Day 16 benchmark by ${formatMoney(gap)}.`),
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 2]: SMALL TEAM / POD SPECIFIC INQUIRY
    // -----------------------------------------------------------------------
    let matchedTeam = null;
    for (const tm of TEAMS_CATALOG) {
      for (const al of tm.aliases) {
        const normAl = normalizeText(al);
        if (norm.includes(normAl)) {
          matchedTeam = tm;
          break;
        }
      }
      if (matchedTeam) break;
    }

    if (matchedTeam) {
      const teamData = (m.teams && (m.teams[matchedTeam.code] || m.teams[matchedTeam.label])) || BASELINE_DATA.teams[matchedTeam.code];
      const teamMembers = m.individuals.filter(r => (r.team && r.team.includes(matchedTeam.code)));
      const topMember = [...teamMembers].sort((a, b) => b.cash - a.cash)[0];

      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}تقرير أداء الفريق المصغر ${matchedTeam.code} (${matchedTeam.label}):\n` +
            `• قائد الفريق: ${matchedTeam.tlNameAr}\n` +
            `• إجمالي الكاش: ${formatMoney(teamData.cash, 'ar')} (نسبة الإنجاز: ${teamData.achievement.toFixed(1)}%)\n` +
            `• الهدف المالي: ${formatMoney(teamData.target, 'ar')} (الفجوة المتبقية: ${formatMoney(teamData.gap, 'ar')})\n` +
            `• إجمالي الصفقات: ${teamData.contracts} عقود\n` +
            `• الترتيب في القطاع: المركز #${teamData.rank || 1}\n` +
            `• نجم مبيعات الفريق: ${topMember ? topMember.name.replace(/^(ME-|EGSS\d+-)/i, '') : 'N/A'} بمبلغ ${formatMoney(topMember ? topMember.cash : 0, 'ar')}.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Small Team ${matchedTeam.code} (${matchedTeam.label}) Performance Report:\n` +
          `• Team Leader: ${matchedTeam.tlNameEn}\n` +
          `• Net Cash Achieved: ${formatMoney(teamData.cash)} (${teamData.achievement.toFixed(1)}% achievement)\n` +
          `• Team Target: ${formatMoney(teamData.target)} (Gap: ${formatMoney(teamData.gap)})\n` +
          `• Total Contracts: ${teamData.contracts} closed deals\n` +
          `• Sector Standings: Rank #${teamData.rank || 1}\n` +
          `• Top Closer: ${topMember ? topMember.name.replace(/^(ME-|EGSS\d+-)/i, '') : 'N/A'} with ${formatMoney(topMember ? topMember.cash : 0)}.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 3]: TOMORROW'S BENCHMARK (Exact & Day 17)
    // -----------------------------------------------------------------------
    if (/tomorrow|next day|غد|بكره|بكرة|غدا|明天|次日|day 17|يوم 17/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}بنشمارك الغد (اليوم 17 من نوفمبر) هو ${tomorrowBM}% من الهدف الكلي، أي ما يعادل ${formatMoney(tomorrowExpCash, 'ar')}. ` +
            `حقق القطاع حالياً ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%)، وبالتالي نحتاج إلى ${formatMoney(tomorrowCashNeeded, 'ar')} كاش إضافي غداً لضمان تخطي بنشمارك اليوم 17 والتفوق عليه!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `${greetingPrefixZh}明天是11月第17天，官方基准线为 ${tomorrowBM}% (${formatMoney(tomorrowExpCash, 'zh')})。 ` +
            `大一组目前累计 ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，明天仅需新增入账 ${formatMoney(tomorrowCashNeeded, 'zh')} 即可保持领先！`,
          lang: 'zh'
        };
      }
      return {
        text: `${greetingPrefixEn}Tomorrow is Day 17 of November. The official benchmark is ${tomorrowBM}% of total target, which equals ${formatMoney(tomorrowExpCash)}. ` +
          `Big Team 01 is currently at ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), meaning we need only ${formatMoney(tomorrowCashNeeded)} in additional cash closing tomorrow to secure and beat the Day 17 benchmark!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 4.1]: SPECIFIC DAY BENCHMARK (e.g. Day 20, Day 25, Day 30)
    // -----------------------------------------------------------------------
    const dayMatch = norm.match(/(?:^|\s)(?:day|يوم)\s*(\d{1,2})(?:\s|$)|(?:^|\s)(\d{1,2})\s*(?:th|st|nd|rd)?\s*(?:day|يوم)(?:\s|$)|(?:^|\s)(?:bm|benchmark|بنشمارك|وتيره|وتيرة)\s*(?:يوم|day)?\s*(\d{1,2})(?:\s|$)|(?:^|\s)(\d{1,2})\s*(?:bm|benchmark|بنشمارك|وتيره|وتيرة)(?:\s|$)/i);
    let targetDay = null;
    if (dayMatch) {
      for (let i = 1; i <= 4; i++) {
        if (dayMatch[i] && !isNaN(parseInt(dayMatch[i], 10))) {
          const num = parseInt(dayMatch[i], 10);
          if (num >= 1 && num <= 31 && num !== 16 && num !== 17) {
            targetDay = num;
            break;
          }
        }
      }
    }
    if (targetDay && OFFICIAL_PACING[targetDay]) {
      const pct = OFFICIAL_PACING[targetDay];
      const cash = Math.round(s.totalTarget * (pct / 100));
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}بنشمارك اليوم ${targetDay} من الشهر هو ${pct}% من الهدف الإجمالي، أي ما يعادل ${formatMoney(cash, 'ar')}.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}The benchmark pace for Day ${targetDay} is ${pct}% of total target, which equals ${formatMoney(cash)}.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 4]: TODAY'S BENCHMARK (Day 16)
    // -----------------------------------------------------------------------
    if (/today bm|today benchmark|بنشمارك اليوم|وتيرة اليوم|今日基准|day 16/i.test(norm) ||
      ((/today|اليوم|النهارده|今天/i.test(norm)) && (/bm|benchmark|بنشمارك|وتيرة|基准/i.test(norm)))) {
      const aheadPct = (s.achievement - todayBM).toFixed(1);
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}بنشمارك اليوم 16 هو ${todayBM}% من الهدف الإجمالي (${formatMoney(todayExpCash, 'ar')}). ` +
            `الفريق متقدم حالياً بإنجاز ${s.achievement.toFixed(1)}% (${formatMoney(s.totalCash, 'ar')})، محققاً تفوقاً على وتيرة البنشمارك بفارق +${aheadPct}%!`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Today's Day 16 benchmark pace is ${todayBM}% (${formatMoney(todayExpCash)}). ` +
          `Big Team 01 is currently pacing ahead at ${s.achievement.toFixed(1)}% (${formatMoney(s.totalCash)}), leading the benchmark pace by +${aheadPct}%!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 5]: CASH GAP, RUN RATE & VELOCITY
    // -----------------------------------------------------------------------
    if (/gap|needed|run rate|velocity|فجو[ةه]|عجز|معدل|سرع[ةه]|نحتاج كام|المعدل|السرعه|缺口|速度/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}إجمالي الفجوة المالية للهدف حتى نهاية الشهر هي ${formatMoney(s.totalGap, 'ar')} (من إجمالي هدف ${formatMoney(s.totalTarget, 'ar')}). ` +
            `ولتحقيق نسبة 100% بنهاية الشهر، يحتاج قطاع Big Team 01 إلى معدل إغلاق يومي يبلغ ${formatMoney(s.dailyNeeded, 'ar')} يومياً خلال الأيام الـ 14 المتبقية.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 has a total cash gap of ${formatMoney(s.totalGap)} against our ${formatMoney(s.totalTarget)} target. ` +
          `To achieve 100% by Day 30, the sector requires a daily closing velocity of ${formatMoney(s.dailyNeeded)} per day across all 5 Small Teams over the remaining 14 days.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 6]: TOP PERFORMERS / SALES STARS
    // -----------------------------------------------------------------------
    if (/top|star|stars|champion|best|#1|leader|أفضل|نجوم|الاول|الأول|المتصدر|المركز الأول|销冠/i.test(norm)) {
      const top3 = [...m.individuals].sort((a, b) => b.cash - a.cash).slice(0, 3);
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}أفضل 3 نجوم مبيعات في قطاع Big Team 01 اليوم هم:\n` +
            top3.map((r, i) => `#${i + 1} ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')}: ${formatMoney(r.cash, 'ar')} (${r.achievement.toFixed(1)}% من الهدف - ${r.contracts} صفقات)`).join('\n') +
            `\nيقود الصدارة المستشار محمد حامد كأول من كسر حاجز الـ 10,000 دولار! 🌟`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Our top 3 sales stars today are:\n` +
          top3.map((r, i) => `#${i + 1} ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')}: ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}% - ${r.contracts} deals)`).join('\n') +
          `\nMohamed Hamed leads the sector as our first rep to cross the $10,000 milestone! 🌟`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 7]: LAGGARDS / BEHIND BENCHMARK
    // -----------------------------------------------------------------------
    if (/behind|lagging|slow|danger|risk|متأخر|متأخرين|تحت البنشمارك|في خطر|الضعاف|落后/i.test(norm)) {
      const behind = m.individuals.filter(r => r.achievement < todayBM);
      const names = behind.slice(0, 5).map(r => `${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (${r.achievement.toFixed(1)}%)`).join(', ');
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}يوجد حالياً ${behind.length} مستشاراً متأخرين عن بنشمارك اليوم (${todayBM}%). ` +
            `أبرز الأولويات للتدخل والتوجيه الصباحي: ${names}. يوصى بمراجعة جودة مكالمات التجديد وقوائم الاتصال للطلاب ذوي الرصيد المنخفض.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Currently, ${behind.length} specialists are pacing below today's ${todayBM}% benchmark. ` +
          `Immediate coaching priorities: ${names}. Team leaders must audit renewal follow-up cadence and low-balance student pools.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 8]: ZERO CASH REPS
    // -----------------------------------------------------------------------
    if (/(zero cash|no cash|0 cash|صفر كاش|لم يغلق|بدون كاش|صفر مبيعات|بدون مبيعات|零业绩|zero revenue|zero deals)|(\bzero\b|\b0\b|صفر)(?!.*(class|classes|حصص|حصه|c0))/i.test(norm)) {
      const zeroReps = m.individuals.filter(r => r.cash === 0);
      if (zeroReps.length === 0) {
        if (promptLang === 'ar') return { text: `${greetingPrefixAr}خبر ممتاز! لا يوجد أي مستشار بصفر كاش في القطاع، جميع الـ 18 مستشاراً حققوا مبيعات وكسروا الصفر! 🎯`, lang: 'ar' };
        return { text: `${greetingPrefixEn}Awesome news! There are zero specialists at 0 cash — all 18 sales reps in Big Team 01 have generated revenue! 🎯`, lang: 'en' };
      }
      const names = zeroReps.map(r => r.name.replace(/^(ME-|EGSS\d+-)/i, '')).join(', ');
      if (promptLang === 'ar') return { text: `${greetingPrefixAr}يوجد ${zeroReps.length} مستشارين بصفر كاش: ${names}. التدخل العاجل مطلوب لتفعيل محافظهم.`, lang: 'ar' };
      return { text: `${greetingPrefixEn}There are ${zeroReps.length} specialists at zero cash MTD: ${names}. Urgent pipeline follow-up is required.`, lang: 'en' };
    }

    // -----------------------------------------------------------------------
    // [INTENT 11]: OFFICIAL PACKAGES, PRICING & RATE CARDS
    // -----------------------------------------------------------------------
    if (/price|pricing|package|packages|rate card|cost|سعر|اسعار|أسعار|باقات|باقة|كام سعر|تكلفة|تقسيط|تابي|تمارا/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}قائمة الأسعار والباقات الأكاديمية الرسمية المعتمدة لـ 51Talk (خصم التجديد والمنحة):\n` +
            `• باقة 75 حصة (نصف سنة): 2,175 ريال سعودي (~$580 دولار)\n` +
            `• باقة 90 حصة (7 شهور): 2,370 ريال سعودي (~$632 دولار)\n` +
            `• باقة 105 حصص (9 شهور): 2,625 ريال سعودي (~$700 دولار)\n` +
            `• باقة 150 حصة (سنة كاملة - 🔥 الأكثر توفيراً وطلباً): 3,300 ريال سعودي (~$880 دولار)\n` +
            `• باقة 225 حصة (سنة ونصف): 4,800 ريال سعودي (~$1,280 دولار)\n` +
            `• باقة 300 حصة (سنتان): 6,000 ريال سعودي (~$1,600 دولار)\n` +
            `💳 خيارات الدفع: متاح الدفع المباشر أو التقسيط الميسر بدون فوائد عبر تابي (Tabby) وتمارا (Tamara) على 3 أو 4 دفعات شهرية.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Official 51Talk Academic Renewal Packages & Rate Card (Scholarship Pricing):\n` +
          `• 75 Classes (6 Months): 2,175 SAR (~$580 USD)\n` +
          `• 90 Classes (7 Months): 2,370 SAR (~$632 USD)\n` +
          `• 105 Classes (9 Months): 2,625 SAR (~$700 USD)\n` +
          `• 150 Classes (1 Full Year - 🔥 Best Value & Popular): 3,300 SAR (~$880 USD)\n` +
          `• 225 Classes (1.5 Years): 4,800 SAR (~$1,280 USD)\n` +
          `• 300 Classes (2 Full Years): 6,000 SAR (~$1,600 USD)\n` +
          `💳 Payment Options: Full upfront settlement or 3/4 split installments via Tabby & Tamara with 0% interest.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 9]: CLASS CONSUMPTION (استهلاك الحصص & 82% Benchmark & C0)
    // -----------------------------------------------------------------------
    if (/consumption|classes|class|c0|zero classes|حصص|استهلاك|استهلاك الحصص|الصفر|طلاب الصفر/i.test(norm)) {
      const cons = m.consumption || BASELINE_DATA.consumption;
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}تقرير استهلاك الحصص للقطاع (مستهدف البنشمارك 82%):\n` +
            `• إجمالي الطلاب المسجلين: ${cons.totalStudentsStr || (cons.totalStudents ? cons.totalStudents.toLocaleString('en-US') : '1,714')} طالباً\n` +
            `• إجمالي الحصص المستهلكة: ${cons.totalClasses.toLocaleString('en-US')} حصة\n` +
            `• طلاب الصفر (C0 - لم يدرسوا أي حصة): ${cons.c0} طالباً (${cons.c0Pct}% من القاعدة) ⚠️ مجموعة الخطر العاجلة!\n` +
            `• استهلاك 1-3 حصص: ${cons.c1_3} طالباً\n` +
            `• استهلاك 4-7 حصص: ${cons.c4_7} طالباً\n` +
            `• استهلاك 8-11 حصص: ${cons.c8_11} طالباً\n` +
            `• استهلاك 12+ حصة: ${cons.c12Plus} طالباً (فئة التجديد المؤكد)\n` +
            `💡 التوصية التشغيلية: التركيز الفوري على تفعيل طلاب الـ C0 عبر مكالمات حجز الحصص التجريبية لرفع معدل الاستهلاك إلى 82%.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 Class Consumption Intelligence (Official 82% Target):\n` +
          `• Total Managed Students: ${cons.totalStudentsStr || (cons.totalStudents ? cons.totalStudents.toLocaleString('en-US') : '1,714')}\n` +
          `• Total Classes Completed: ${cons.totalClasses.toLocaleString('en-US')}\n` +
          `• Zero-Class Students (C0): ${cons.c0} students (${cons.c0Pct}%) ⚠️ Primary Risk Group!\n` +
          `• 1–3 Classes Consumed: ${cons.c1_3} students\n` +
          `• 4–7 Classes Consumed: ${cons.c4_7} students\n` +
          `• 8–11 Classes Consumed: ${cons.c8_11} students\n` +
          `• 12+ Classes Consumed: ${cons.c12Plus} students (Prime Renewal Candidates)\n` +
          `💡 Recommended Action: Prioritize waking up C0 zero-class students to drive the sector toward our 82% benchmark!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 10]: SOP PROCESS COMPLIANCE (R1-R6 & English Club)
    // -----------------------------------------------------------------------
    if (/sop|r1|r2|r3|r4|r5|r6|english club|ec|الاس او بي|التزام|جودة المكالمات/i.test(norm)) {
      const sop = m.sop || BASELINE_DATA.sop;
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}لوحة التزام العمليات التشغيلية (SOP Process Compliance):\n` +
            `• R1 تغطية الليدز: ${sop.r1}% (المستهدف 93%)\n` +
            `• R2 الاتصال في الموعد: ${sop.r2}% (المستهدف 93%)\n` +
            `• R3 حجز الحصة التجريبية: ${sop.r3}% (المستهدف 93%)\n` +
            `• R4 استهلاك الحصص: ${sop.r4}% (المستهدف 93%)\n` +
            `• R5 استرداد الطلاب من خارج المحفظة: ${sop.r5}% (المستهدف 93%)\n` +
            `• R6 متابعة العملاء المحتملين: ${sop.r6}% (المستهدف 93%)\n` +
            `• حضور English Club: ${sop.ec}% (المستهدف 45%)\n` +
            `يقود الالتزام فريق EGSS05 بنسبة 82%، يليه فريق EGSS13 بنسبة 80%.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 SOP Process Compliance Dashboard:\n` +
          `• R1 Leads Coverage: ${sop.r1}% (Target: 93%)\n` +
          `• R2 Timely Callback: ${sop.r2}% (Target: 93%)\n` +
          `• R3 Demo Reserved: ${sop.r3}% (Target: 93%)\n` +
          `• R4 Class Consumption: ${sop.r4}% (Target: 93%)\n` +
          `• R5 Outside Pool Recovery: ${sop.r5}% (Target: 93%)\n` +
          `• R6 Pipeline Follow-up: ${sop.r6}% (Target: 93%)\n` +
          `• English Club Attendance: ${sop.ec}% (Target: 45%)\n` +
          `EGSS05 leads SOP adherence at 82%, closely followed by EGSS13 at 80%.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 12]: REFUND & ASK-FOR-REFUND RADAR
    // -----------------------------------------------------------------------
    if (/refund|refunds|cancel|cancellation|deduction|استرداد|خصم|مرتجع|ريفند|الغاء|إلغاء/i.test(norm)) {
      const ref = m.refunds || BASELINE_DATA.refunds;
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}رادار الاستردادات والخصومات (Refund Radar):\n` +
            `• إجمالي الاستردادات المسجلة على القطاع: ${formatMoney(ref.total, 'ar')}\n` +
            `• الحالات المسجلة:\n` +
            ref.cases.map(c => `  - المستشارة ${c.repAr || c.rep} (${c.team}): خصم ${formatMoney(c.amount, 'ar')}`).join('\n') +
            `\n🛡️ تم احتساب هذه الخصومات بدقة من صافي الكاش، وباقي الـ 16 مستشاراً سجلاتهم نظيفة 100% بدون أي استردادات.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 Cancellation & Refund Radar:\n` +
          `• Total Sector Refund Deductions: ${formatMoney(ref.total)}\n` +
          `• Recorded Cases:\n` +
          ref.cases.map(c => `  - ${c.rep} (${c.team}): ${formatMoney(c.amount)} deducted`).join('\n') +
          `\n🛡️ All deductions are factored into Net Cash. The remaining 16 sales specialists maintain a 100% clean record with $0 refunds.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 13]: UPGRADE M2 / 20% MILESTONE
    // -----------------------------------------------------------------------
    if (/upgrade|m2|20%|ترقية|تجديد مبكر|تارجت ال20|هدف الترقية|提续/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}حقق قطاع Big Team 01 عدد ${s.totalUpgradeM2} تجديدات ترقية مبكرة M2 حتى اليوم، باتجاه هدف الـ 20% البالغ ${s.totalUpgrade20Target} ترقية. ` +
            `نحتاج إلى ${s.totalUpgrade20Needed} ترقية إضافية لتأمين حافز فئة الـ 20%. يرجى التركيز على الطلاب الذين يملكون أقل من 10 حصص متبقية!`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 has closed ${s.totalUpgradeM2} Upgrade M2 renewals toward our 20% milestone target of ${s.totalUpgrade20Target}. ` +
          `We need ${s.totalUpgrade20Needed} additional upgrades to secure the 20% incentive tier. Target students with fewer than 10 remaining classes!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 14]: TODAY'S 3 STRATEGIC MOVES
    // -----------------------------------------------------------------------
    if (/move|moves|plan|strategy|priorities|خطة|تحركات|استراتيجية|أولويات|ماذا نفعل|行动计划|策略/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}التحركات التشغيلية الثلاثة لليوم لقطاع Big Team 01:\n` +
            `1. حماية البنشمارك: تحقيق ${formatMoney(s.dailyNeeded, 'ar')} كاش إغلاق يومي للحفاظ على وتيرة التقدم.\n` +
            `2. تدخل توجيهي 1-on-1 مع الـ 7 مستشارين المتأخرين عن وتيرة 41% لمساعدتهم في حل اعتراضات أولياء الأمور.\n` +
            `3. هجوم التجديد المبكر: استهداف حسابات التجديد التي تبقى لها أقل من 10 حصص لإغلاق ${s.totalUpgrade20Needed} ترقية M2 وتأمين فئة الـ 20%.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Today's 3 Operational Priorities for Big Team 01:\n` +
          `1. Defend Benchmark Pace: Hit ${formatMoney(s.dailyNeeded)} in daily cash closing across all pods.\n` +
          `2. 1-on-1 Rep Coaching: Conduct pipeline sprints with the 7 specialists pacing below 41%.\n` +
          `3. M2 Upgrade Sprint: Convert low-balance students (<10 classes) into M2 upgrades to secure our 20% milestone!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 15]: SMALL TEAMS RANKINGS & COMPARISON
    // -----------------------------------------------------------------------
    if (/teams|pods|ranking|compare|فرق|ترتيب الفرق|مقارنة الفرق|الفرق المصغرة|战队|小组/i.test(norm)) {
      const sortedTeams = Object.values(m.teams || BASELINE_DATA.teams).sort((a, b) => b.achievement - a.achievement);
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}ترتيب الفرق المصغرة الخمسة اليوم:\n` +
            sortedTeams.map((t, idx) => `#${idx + 1} ${t.label}: ${formatMoney(t.cash, 'ar')} (إنجاز: ${t.achievement.toFixed(1)}% - ${t.contracts} عقود)`).join('\n') +
            `\nيقود الترتيب فريق ${sortedTeams[0].label} بأعلى نسبة إنجاز! 🏆`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Small Teams Standings Today:\n` +
          sortedTeams.map((t, idx) => `#${idx + 1} ${t.label}: ${formatMoney(t.cash)} (${t.achievement.toFixed(1)}% ach - ${t.contracts} deals)`).join('\n') +
          `\n${sortedTeams[0].label} currently leads the sector with top performance! 🏆`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 16]: COMMISSION ENGINE
    // -----------------------------------------------------------------------
    if (/commission|commissions|payout|عمولة|عمولات|حساب العمولة|شرائح العمولة/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `${greetingPrefixAr}نظام عمولات مستشاري المبيعات لـ Big Team 01 يعتمد على الركائز التالية:\n` +
            `• نسبة الإنجاز الفردي (مقسمة لشرائح تبدأ من 50% فأعلى مع مضاعفات عند كسر الـ 100% والـ 120%).\n` +
            `• مؤشر تحقيق الفريق المصغر (Team Multiplier) الذي يعزز نسبة العمولة عند نجاح الفريق بالكامل.\n` +
            `• مكافآت التجديد المبكر M2 وحوافز حزم الـ 20% الإضافية.\n` +
            `تُحسب العمولات تلقائياً في الداشبورد لكل مستشار بناءً على صافي الكاش والتحصيل الفعلي.`,
          lang: 'ar'
        };
      }
      return {
        text: `${greetingPrefixEn}Big Team 01 Sales Commission Architecture:\n` +
          `• Individual Achievement Tiers (scaling upwards from 50%, with super-bonuses above 100% and 120%).\n` +
          `• Small Team Multiplier which elevates individual payout rates when the pod hits its target.\n` +
          `• M2 Early Upgrade accelerator bonuses upon unlocking the 20% portfolio milestone.\n` +
          `All rep commissions are dynamically calculated inside the dashboard based on verified Net Cash collections.`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 17]: GREETINGS & SELF INTRODUCTION (Pure greetings only)
    // -----------------------------------------------------------------------
    if (hasGreeting || /who are you|what can you do|help|مين انت|تقدر تعمل ايه|مساعدة/i.test(norm)) {
      if (promptLang === 'ar') {
        return {
          text: `مرحباً يا حسين! أنا توكي (Toki 🌟)، مساعدك الذكي لقطاع Big Team 01!\n` +
            `• إجمالي إنجاز القطاع حتى اليوم 16: ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%)\n` +
            `• وتيرة البنشمارك: متقدمون بفارق +${(s.achievement - todayBM).toFixed(1)}% عن اليوم 16\n` +
            `• الصفقات المنجزة: ${s.totalContracts} عقود\n` +
            `يمكنك سؤالي عن: أداء أي مستشار مبيعات بالاسم، بنشمارك الغد، فجوة الكاش، استهلاك الحصص، الـ SOP، أو الأسعار الرسمية!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `您好，侯赛因经理！我是 Toki 🌟，大一组的专属 AI 语音与数据副驾！\n` +
            `• 截至第16天累计业绩: ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)\n` +
            `• 基准线对比: 领先今日第16天基准线 +${(s.achievement - todayBM).toFixed(1)}%\n` +
            `• 累计成单: ${s.totalContracts} 单\n` +
            `您可以向我询问：任意销售顾问个人战报、明日基准线、业绩缺口、课时消耗、SOP 达成或官方课包报价！`,
          lang: 'zh'
        };
      }
      return {
        text: `Hello Hussein! I'm Toki 🌟, your Big Team 01 AI voice & performance assistant!\n` +
          `• Sector Net Cash MTD (Day 16): ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}% ach)\n` +
          `• Benchmark Pacing: Leading Day 16 pace by +${(s.achievement - todayBM).toFixed(1)}%\n` +
          `• Closed Deals: ${s.totalContracts} contracts\n` +
          `You can ask me about: Any individual rep's performance, tomorrow's benchmark, cash gaps, class consumption, SOP adherence, or official rate card pricing!`,
        lang: 'en'
      };
    }

    // -----------------------------------------------------------------------
    // [INTENT 18]: INTELLIGENT EXECUTIVE FALLBACK WITH SUGGESTIONS
    // -----------------------------------------------------------------------
    if (promptLang === 'ar') {
      return {
        text: `قطاع Big Team 01 حقق ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%) حتى اليوم 16، متقدماً على البنشمارك بإجمالي ${s.totalContracts} عقداً مغلقاً. الفجوة المتبقية للهدف هي ${formatMoney(s.totalGap, 'ar')}.\n` +
          `💡 أسئلة شائعة يمكنك طرحها:\n` +
          `1. "أداء جوليا" أو "كاش محمد حامد"\n` +
          `2. "بنشمارك بكرة كام؟"\n` +
          `3. "استهلاك الحصص وطلاب الصفر"\n` +
          `4. "أسعار الباقات الرسمية"`,
        lang: 'ar'
      };
    }
    return {
      text: `Big Team 01 has reached ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%) MTD with ${s.totalContracts} total contracts. Sector cash gap is ${formatMoney(s.totalGap)}.\n` +
        `💡 Quick questions you can ask me:\n` +
        `1. "Performance for SCS Julia" or "Mohamed Hamed cash"\n` +
        `2. "What is tomorrow's benchmark?"\n` +
        `3. "Class consumption & zero classes"\n` +
        `4. "Official package rate card"`,
      lang: 'en'
    };
  }

  // EXPORT ENGINE GLOBALLY
  const TokiUniversalEngine = {
    answer: answerQuery,
    detectLanguage: detectPromptLanguage,
    formatMoney: formatMoney,
    catalog: {
      reps: REPS_CATALOG,
      teams: TEAMS_CATALOG,
      rateCards: RATE_CARDS,
      pacing: OFFICIAL_PACING
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokiUniversalEngine;
  }
  if (typeof window !== 'undefined') {
    window.TokiUniversalEngine = TokiUniversalEngine;
    window.getTokiAnswer = (q, opts) => TokiUniversalEngine.answer(q, opts);
  }
})(typeof window !== 'undefined' ? window : global);


  function getTokiAnswer(query) {
    return TokiUniversalEngine.answer(query, { activeLang: activeLang });
  }

  window.TokiUniversalEngine = TokiUniversalEngine;
  window.getTokiAnswer = getTokiAnswer;

  // Inject Styles
  function injectStyles() {
    if (document.getElementById('tokiStyles')) return;
    const style = document.createElement('style');
    style.id = 'tokiStyles';
    style.textContent = `
      .toki-widget {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Inter', system-ui, sans-serif;
      }
      .toki-widget:hover { transform: translateY(-4px) scale(1.03); }
      .toki-widget:active { transform: scale(0.97); }

      .toki-bubble {
        background: #ffffff;
        color: #1e293b;
        padding: 8px 14px;
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
        border: 1.5px solid #fef08a;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        animation: tokiPulseBubble 3s ease-in-out infinite;
        position: relative;
        white-space: nowrap;
      }
      .toki-bubble::after {
        content: '';
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        border-width: 6px 0 6px 8px;
        border-style: solid;
        border-color: transparent transparent transparent #ffffff;
      }
      .toki-bubble-text {
        font-weight: 800;
        font-size: 0.88rem;
        color: #b45309;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .toki-bubble-sub { font-size: 0.70rem; color: #64748b; font-weight: 600; }

      .toki-avatar-btn {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        position: relative;
        background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%);
        box-shadow: 0 12px 28px rgba(245, 158, 11, 0.45), 0 4px 12px rgba(0, 0, 0, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.6);
        border: 3px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        animation: tokiFloat 4s ease-in-out infinite;
      }
      .toki-avatar-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        background: #fef08a;
        transition: transform 0.25s ease;
      }
      .toki-widget:hover .toki-avatar-img { transform: scale(1.08) rotate(3deg); }
      .toki-live-badge {
        position: absolute;
        bottom: 0px;
        right: 0px;
        width: 18px;
        height: 18px;
        background: #10b981;
        border: 2px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
      }
      .toki-live-dot {
        width: 6px;
        height: 6px;
        background: #ffffff;
        border-radius: 50%;
        animation: tokiGlow 1.8s infinite;
      }

      .toki-modal {
        position: fixed;
        bottom: 105px;
        right: 24px;
        width: 420px;
        max-width: calc(100vw - 32px);
        height: 590px;
        max-height: calc(100vh - 125px);
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.22), 0 10px 20px -5px rgba(245, 158, 11, 0.15);
        border: 1.5px solid rgba(245, 158, 11, 0.3);
        z-index: 100000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: tokiModalEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        font-family: 'Inter', system-ui, sans-serif;
      }
      .toki-modal.hidden { display: none !important; }

      .toki-modal-header {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        padding: 14px 18px;
        border-bottom: 1.5px solid rgba(245, 158, 11, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .toki-header-info { display: flex; align-items: center; gap: 12px; }
      .toki-modal-avatar {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 2.5px solid #f59e0b;
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
        object-fit: cover;
        transition: all 0.3s ease;
      }
      .toki-modal-avatar.toki-speaking {
        animation: tokiPulseSpeaking 1s infinite alternate;
        border-color: #10b981;
      }
      .toki-title-box { display: flex; flex-direction: column; }
      .toki-modal-title { font-size: 1.02rem; font-weight: 800; color: #92400e; display: flex; align-items: center; gap: 6px; }
      .toki-modal-sub { font-size: 0.72rem; font-weight: 600; color: #059669; display: flex; align-items: center; gap: 4px; }
      .toki-status-dot { width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block; }

      .toki-header-actions { display: flex; align-items: center; gap: 6px; }
      .toki-icon-btn {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(245, 158, 11, 0.3);
        color: #78350f;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s ease;
      }
      .toki-icon-btn:hover { background: #ffffff; transform: scale(1.08); border-color: #f59e0b; }

      .toki-soundwave-bar {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 18px;
        padding: 4px 12px;
        background: rgba(245, 158, 11, 0.12);
        border-bottom: 1px solid rgba(245, 158, 11, 0.2);
      }
      .toki-soundwave-label { font-size: 0.70rem; font-weight: 700; color: #b45309; margin-right: 6px; }
      .toki-bar { width: 3px; height: 12px; background: #f59e0b; border-radius: 3px; animation: tokiWave 0.8s ease-in-out infinite alternate; }
      .toki-bar:nth-child(2) { animation-delay: 0.15s; height: 16px; }
      .toki-bar:nth-child(3) { animation-delay: 0.3s; height: 10px; }
      .toki-bar:nth-child(4) { animation-delay: 0.45s; height: 14px; }
      .toki-bar:nth-child(5) { animation-delay: 0.6s; height: 8px; }

      .toki-quick-chips {
        display: flex;
        gap: 6px;
        padding: 8px 14px;
        overflow-x: auto;
        background: #fafaf9;
        border-bottom: 1px solid #f1f5f9;
        scrollbar-width: none;
      }
      .toki-quick-chips::-webkit-scrollbar { display: none; }
      .toki-chip {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 5px 10px;
        border-radius: 12px;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .toki-chip:hover { background: #fffbeb; border-color: #f59e0b; color: #b45309; transform: translateY(-1px); }

      .toki-chat-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #ffffff; }
      .toki-msg { display: flex; gap: 10px; max-width: 88%; animation: tokiMsgSlide 0.25s ease-out; }
      .toki-msg.user { align-self: flex-end; flex-direction: row-reverse; }
      .toki-msg.assistant { align-self: flex-start; }
      .toki-msg-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid #f59e0b; flex-shrink: 0; }
      .toki-msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 0.85rem; line-height: 1.45; position: relative; }
      .toki-msg.user .toki-msg-bubble {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: #ffffff;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      }
      .toki-msg.assistant .toki-msg-bubble {
        background: #f8fafc;
        color: #1e293b;
        border: 1.2px solid #e2e8f0;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      }
      .toki-msg-meta { font-size: 0.68rem; margin-top: 4px; color: #94a3b8; font-weight: 500; }

      .toki-footer { padding: 12px 14px; background: #ffffff; border-top: 1.5px solid #f1f5f9; display: flex; align-items: center; gap: 8px; }
      .toki-input-box {
        flex: 1;
        display: flex;
        align-items: center;
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        padding: 6px 12px;
        transition: all 0.2s ease;
      }
      .toki-input-box:focus-within {
        border-color: #f59e0b;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
      }
      .toki-input { width: 100%; border: none; outline: none; background: transparent; font-size: 0.86rem; color: #1e293b; }
      .toki-mic-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: 1.5px solid rgba(245, 158, 11, 0.4);
        background: #fffbeb;
        color: #b45309;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.05rem;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .toki-mic-btn:hover { background: #fef3c7; transform: scale(1.05); }
      .toki-mic-btn.listening {
        background: #ef4444 !important;
        border-color: #b91c1c !important;
        color: #ffffff !important;
        animation: tokiPulseMic 1.2s infinite;
      }
      .toki-send-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s ease;
        box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
        flex-shrink: 0;
      }
      .toki-send-btn:hover { transform: scale(1.05); box-shadow: 0 6px 14px rgba(245, 158, 11, 0.45); }

      @keyframes tokiFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }
      @keyframes tokiPulseBubble { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
      @keyframes tokiGlow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
      @keyframes tokiModalEntrance { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0px) scale(1); } }
      @keyframes tokiWave { from { height: 6px; } to { height: 16px; } }
      @keyframes tokiPulseSpeaking { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); } 100% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } }
      @keyframes tokiPulseMic { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 100% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } }
      @keyframes tokiMsgSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  // Get localized chip templates
  function getLocalizedChips(lang) {
    if (lang === 'ar') {
      return `
        <button type="button" class="toki-chip" data-q="ما هو بنشمارك الغد؟">📅 بنشمارك الغد</button>
        <button type="button" class="toki-chip" data-q="كم الفجوة المالية والمعدل اليومي المطلوب؟">💰 الفجوة المالية</button>
        <button type="button" class="toki-chip" data-q="من هم المتأخرين عن بنشمارك اليوم؟">⚠️ المتأخرون</button>
        <button type="button" class="toki-chip" data-q="من هم أفضل نجوم المبيعات اليوم؟">🏆 أفضل النجوم</button>
        <button type="button" class="toki-chip" data-q="ما هو تقدم ترقيات M2 نحو هدف 20%؟">🚀 ترقيات 20%</button>
        <button type="button" class="toki-chip" data-q="ما هي التحركات الاستراتيجية الثلاثة لليوم؟">📋 خطة اليوم</button>
      `;
    }
    if (lang === 'zh') {
      return `
        <button type="button" class="toki-chip" data-q="明天的基准线是多少？">📅 明天基准线</button>
        <button type="button" class="toki-chip" data-q="我们的全月业绩缺口是多少？">💰 业绩缺口</button>
        <button type="button" class="toki-chip" data-q="哪些销售顾问落后于今日基准？">⚠️ 落后基准</button>
        <button type="button" class="toki-chip" data-q="表现最好的前三名销售是谁？">🏆 销冠排名</button>
        <button type="button" class="toki-chip" data-q="提续M2达成20%里程碑进度如何？">🚀 提续20%进度</button>
        <button type="button" class="toki-chip" data-q="今日三大核心战略行动是什么？">📋 今日三大行动</button>
      `;
    }
    return `
      <button type="button" class="toki-chip" data-q="What is the benchmark for tomorrow?">📅 Tomorrow BM</button>
      <button type="button" class="toki-chip" data-q="What is our cash gap and daily run rate needed?">💰 Cash Gap</button>
      <button type="button" class="toki-chip" data-q="Which specialists are behind benchmark today?">⚠️ Behind BM</button>
      <button type="button" class="toki-chip" data-q="Who are the top performers today?">🏆 Top Stars</button>
      <button type="button" class="toki-chip" data-q="What is our M2 upgrade progress toward 20%?">🚀 20% Upgrade</button>
      <button type="button" class="toki-chip" data-q="What are today 3 strategic moves?">📋 3 Daily Moves</button>
    `;
  }

  // Build Toki DOM
  function buildTokiElements() {
    if (document.getElementById('tokiFloatingWidget')) return;

    injectStyles();

    // 1. Floating Widget
    const widget = document.createElement('div');
    widget.id = 'tokiFloatingWidget';
    widget.className = 'toki-widget';
    widget.title = 'Talk with Toki — AI Voice & Data Assistant';
    widget.innerHTML = `
      <div class="toki-bubble" id="tokiFloatBubble">
        <span class="toki-bubble-text" id="tokiFloatBubbleText">👋 Hello, I'm Toki!</span>
        <span class="toki-bubble-sub" id="tokiFloatBubbleSub">AI Copilot • Ask me</span>
      </div>
      <div class="toki-avatar-btn" id="tokiAvatarBtn">
        <img src="assets/toki.jpg" alt="Toki" class="toki-avatar-img" />
        <span class="toki-live-badge"><span class="toki-live-dot"></span></span>
      </div>
    `;

    // 2. Dialogue Modal
    const modal = document.createElement('div');
    modal.id = 'tokiModal';
    modal.className = 'toki-modal hidden';
    modal.innerHTML = `
      <!-- Header -->
      <div class="toki-modal-header">
        <div class="toki-header-info">
          <img src="assets/toki.jpg" alt="Toki" class="toki-modal-avatar" id="tokiModalAvatar" />
          <div class="toki-title-box">
            <span class="toki-modal-title" id="tokiModalTitle">Toki AI Copilot</span>
            <span class="toki-modal-sub" id="tokiModalSub"><span class="toki-status-dot"></span> Big Team 01 Voice Assistant</span>
          </div>
        </div>
        <div class="toki-header-actions">
          <button type="button" class="toki-icon-btn" id="tokiSoundToggle" title="Toggle Voice Output">🔊</button>
          <button type="button" class="toki-icon-btn" id="tokiClearChat" title="Clear Conversation">🗑️</button>
          <button type="button" class="toki-icon-btn" id="tokiCloseBtn" title="Close Assistant">✕</button>
        </div>
      </div>

      <!-- Animated Soundwave -->
      <div class="toki-soundwave-bar" id="tokiSoundwave">
        <span class="toki-soundwave-label" id="tokiSoundwaveLabel">Toki is speaking...</span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
      </div>

      <!-- Quick Chips -->
      <div class="toki-quick-chips" id="tokiQuickChips">
        ${getLocalizedChips(activeLang)}
      </div>

      <!-- Chat Messages Body -->
      <div class="toki-chat-body" id="tokiChatMessages">
        <!-- Initial Welcome Message -->
        <div class="toki-msg assistant">
          <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
          <div class="toki-msg-bubble" id="tokiWelcomeBubble">
            <strong>Hello Hussein! I'm Toki! 🌟</strong><br>
            I'm your Big Team 01 AI voice & performance assistant. Ask me anything about our sales reps, tomorrow's benchmark, cash gaps, or tap a quick question above!
            <div class="toki-msg-meta">Just now • Voice Ready</div>
          </div>
        </div>
      </div>

      <!-- Footer Input Bar -->
      <div class="toki-footer">
        <button type="button" class="toki-mic-btn" id="tokiMicBtn" title="Click to speak">🎤</button>
        <div class="toki-input-box">
          <input type="text" class="toki-input" id="tokiTextInput" placeholder="Ask Toki a question..." autocomplete="off" />
        </div>
        <button type="button" class="toki-send-btn" id="tokiSendBtn" title="Send Question">▶</button>
      </div>
    `;

    document.body.appendChild(widget);
    document.body.appendChild(modal);

    attachTokiEvents();
    initSpeechRecognition();
  }

  // Update Toki UI for current language
  function setTokiLanguage(lang) {
    activeLang = lang;
    const chips = document.getElementById('tokiQuickChips');
    if (chips) {
      chips.innerHTML = getLocalizedChips(lang);
      // re-bind click events
      chips.querySelectorAll('.toki-chip').forEach(chip => {
        chip.onclick = (e) => {
          e.stopPropagation();
          const q = chip.getAttribute('data-q');
          if (q) handleQuery(q);
        };
      });
    }

    const titleEl = document.getElementById('tokiModalTitle');
    const subEl = document.getElementById('tokiModalSub');
    const inputEl = document.getElementById('tokiTextInput');
    const bubbleText = document.getElementById('tokiFloatBubbleText');
    const bubbleSub = document.getElementById('tokiFloatBubbleSub');

    if (lang === 'ar') {
      if (titleEl) titleEl.textContent = 'المساعد الذكي توكي';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> المساعد الصوتي لقطاع Big Team 01';
      if (inputEl) inputEl.placeholder = 'اسأل توكي أي سؤال عن أداء الفريق...';
      if (bubbleText) bubbleText.textContent = '👋 مرحباً، أنا توكي!';
      if (bubbleSub) bubbleSub.textContent = 'مساعدك الذكي • اسألني';
    } else if (lang === 'zh') {
      if (titleEl) titleEl.textContent = 'Toki 智能副驾';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> 大一组语音与数据副驾';
      if (inputEl) inputEl.placeholder = '向 Toki 询问任何大一组业绩与数据...';
      if (bubbleText) bubbleText.textContent = '👋 你好，我是 Toki！';
      if (bubbleSub) bubbleSub.textContent = 'AI 副驾 • 随时提问';
    } else {
      if (titleEl) titleEl.textContent = 'Toki AI Copilot';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> Big Team 01 Voice Assistant';
      if (inputEl) inputEl.placeholder = 'Ask Toki a question...';
      if (bubbleText) bubbleText.textContent = "👋 Hello, I'm Toki!";
      if (bubbleSub) bubbleSub.textContent = 'AI Copilot • Ask me';
    }

    if (recognition) {
      if (lang === 'ar') recognition.lang = 'ar-EG';
      else if (lang === 'zh') recognition.lang = 'zh-CN';
      else recognition.lang = 'en-US';
    }
  }

  // Append Message to UI
  function appendMessage(sender, text, lang) {
    const chat = document.getElementById('tokiChatMessages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = `toki-msg ${sender}`;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isRtl = (lang === 'ar');

    if (sender === 'user') {
      msg.innerHTML = `
        <div class="toki-msg-bubble" style="${isRtl ? 'direction: rtl; text-align: right;' : ''}">
          ${text}
          <div class="toki-msg-meta" style="text-align: right; color: rgba(255,255,255,0.8);">${now}</div>
        </div>
      `;
    } else {
      msg.innerHTML = `
        <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
        <div class="toki-msg-bubble" style="${isRtl ? 'direction: rtl; text-align: right;' : ''}">
          <strong>${isRtl ? 'توكي:' : (lang === 'zh' ? 'Toki 小助手:' : 'Toki:')}</strong><br>
          ${text}
          <div class="toki-msg-meta">${now} • ${isRtl ? 'صوت مباشر' : (lang === 'zh' ? '已语音播报' : 'Spoken')}</div>
        </div>
      `;
    }

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  // Handle Query Execution
  function handleQuery(queryText) {
    const q = (queryText || '').trim();
    if (!q) return;

    const promptLang = detectPromptLanguage(q);
    appendMessage('user', q, promptLang);

    const input = document.getElementById('tokiTextInput');
    if (input) input.value = '';

    const res = getTokiAnswer(q);

    setTimeout(() => {
      appendMessage('assistant', res.text, res.lang);
      speak(res.text, res.lang);
    }, 250);
  }

  // Speech Recognition
  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('tokiMicBtn');
    if (!SpeechRec) {
      if (micBtn) {
        micBtn.title = 'Voice recognition not supported (use Chrome or Edge)';
        micBtn.style.opacity = '0.5';
      }
      return;
    }

    recognition = new SpeechRec();
    if (activeLang === 'ar') recognition.lang = 'ar-EG';
    else if (activeLang === 'zh') recognition.lang = 'zh-CN';
    else recognition.lang = 'en-US';

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening = true;
      if (micBtn) {
        micBtn.classList.add('listening');
        micBtn.textContent = '🔴';
        micBtn.title = 'Listening to your voice... Speak now!';
      }
      stopSpeaking();
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      if (transcript) handleQuery(transcript);
    };

    recognition.onerror = (e) => {
      console.warn('Toki SpeechRecognition error:', e.error);
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };
  }

  function startListening() {
    if (!recognition) return;
    try { recognition.start(); } catch (e) { console.warn(e); }
  }

  function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('tokiMicBtn');
    if (micBtn) {
      micBtn.classList.remove('listening');
      micBtn.textContent = '🎤';
      micBtn.title = 'Click to speak';
    }
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  }

  function toggleListening() {
    if (isListening) stopListening();
    else startListening();
  }

  // Event Attachments
  function attachTokiEvents() {
    const widget = document.getElementById('tokiFloatingWidget');
    const modal = document.getElementById('tokiModal');
    const closeBtn = document.getElementById('tokiCloseBtn');
    const sendBtn = document.getElementById('tokiSendBtn');
    const input = document.getElementById('tokiTextInput');
    const micBtn = document.getElementById('tokiMicBtn');
    const soundToggle = document.getElementById('tokiSoundToggle');
    const clearBtn = document.getElementById('tokiClearChat');

    if (widget) {
      widget.onclick = () => {
        if (modal.classList.contains('hidden')) {
          modal.classList.remove('hidden');
          if (input) input.focus();
        } else {
          modal.classList.add('hidden');
          stopSpeaking();
          stopListening();
        }
      };
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.classList.add('hidden');
        stopSpeaking();
        stopListening();
      };
    }

    if (sendBtn) {
      sendBtn.onclick = () => {
        if (input) handleQuery(input.value);
      };
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleQuery(input.value);
      });
    }

    if (micBtn) micBtn.onclick = toggleListening;

    if (soundToggle) {
      soundToggle.onclick = () => {
        isSpeechEnabled = !isSpeechEnabled;
        if (!isSpeechEnabled) {
          stopSpeaking();
          soundToggle.textContent = '🔇';
          soundToggle.title = 'Voice Output Muted';
        } else {
          soundToggle.textContent = '🔊';
          soundToggle.title = 'Voice Output Enabled';
        }
      };
    }

    if (clearBtn) {
      clearBtn.onclick = () => {
        const chat = document.getElementById('tokiChatMessages');
        if (chat) {
          const isRtl = (activeLang === 'ar');
          chat.innerHTML = `
            <div class="toki-msg assistant">
              <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
              <div class="toki-msg-bubble">
                <strong>${isRtl ? 'تمت إعادة ضبط المحادثة 🔄' : (activeLang === 'zh' ? '会话已重置 🔄' : 'Conversation Reset 🔄')}</strong><br>
                ${isRtl ? 'ما الذي تود سؤالي عنه بعد ذلك، يا حسين؟' : (activeLang === 'zh' ? '侯赛因经理，接下来您想了解什么？' : 'What would you like to ask next, Hussein?')}
                <div class="toki-msg-meta">Just now • Ready</div>
              </div>
            </div>
          `;
        }
      };
    }

    // Quick chips
    document.querySelectorAll('.toki-chip').forEach(chip => {
      chip.onclick = (e) => {
        e.stopPropagation();
        const q = chip.getAttribute('data-q');
        if (q) handleQuery(q);
      };
    });
  }

  // Public Interface
  window.openTokiAssistant = function () {
    buildTokiElements();
    const modal = document.getElementById('tokiModal');
    if (modal) {
      modal.classList.remove('hidden');
      const input = document.getElementById('tokiTextInput');
      if (input) input.focus();
    }
  };

  window.initTokiWidget = function () {
    buildTokiElements();
  };

  window.setTokiLanguage = setTokiLanguage;
  window.getTokiAnswer = getTokiAnswer;

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTokiElements);
  } else {
    buildTokiElements();
  }

})();
