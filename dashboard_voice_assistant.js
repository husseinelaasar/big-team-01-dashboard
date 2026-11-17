/**
 * Toki — Big Team 01 Interactive 3D AI Voice & Data Assistant
 * Tri-lingual Domain Intelligence: English, Arabic, Chinese (EN / AR / ZH)
 * Native Light-Theme Corporate Aesthetics | Self-Healing Autonomous Engine
 */

(function () {
  'use strict';

  // Language & Voice State
  let activeLang = (typeof localStorage !== 'undefined' && localStorage.getItem('bt01_lang')) || 'en';
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
    const synth = (typeof window !== 'undefined' && window.speechSynthesis);
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
      matchedVoice = voices.find(v => v.lang && v.lang.startsWith('ar'));
    } else if (targetLang === 'zh') {
      matchedVoice = voices.find(v => v.lang && (v.lang.startsWith('zh') || (v.name && v.name.includes('Chinese'))));
    } else {
      matchedVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (v.name && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy') || v.name.includes('Samantha')))) || voices.find(v => v.lang && v.lang.startsWith('en'));
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
    const synth = (typeof window !== 'undefined' && window.speechSynthesis);
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

  // =========================================================================
  // EMBEDDED TOKI UNIVERSAL DOMAIN INTELLIGENCE ENGINE (v3.0)
  // =========================================================================
/**
 * Toki Universal Domain Intelligence Engine (v4.0)
 * Specialized: Egyptian Arabic (العامية المصرية الأصيلة) | English | Chinese (中文)
 * Big Team 01 — Executive Sales & Operations Platform
 * Senior Manager: Hussein El A'sar | 100% Deterministic & Self-Healing
 */

(function (global) {
  'use strict';

  // 1. OFFICIAL PACING TABLE (Day 1 - 31)
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

  // 3. APPROVED RATE CARDS & PACKAGES
  const RATE_CARDS = [
    { classes: 75, durationEn: '6 Months', durationAr: '6 شهور', durationZh: '6个月', sar: 2175, usd: 580, popular: false },
    { classes: 90, durationEn: '7 Months', durationAr: '7 شهور', durationZh: '7个月', sar: 2370, usd: 632, popular: false },
    { classes: 105, durationEn: '9 Months', durationAr: '9 شهور', durationZh: '9个月', sar: 2625, usd: 700, popular: false },
    { classes: 150, durationEn: '1 Full Year (Best Value)', durationAr: 'سنة كاملة (الجوكر والأكتر طلباً)', durationZh: '1年 (超值畅销)', sar: 3300, usd: 880, popular: true },
    { classes: 225, durationEn: '1.5 Years', durationAr: 'سنة ونص', durationZh: '1.5年', sar: 4800, usd: 1280, popular: false },
    { classes: 300, durationEn: '2 Full Years', durationAr: 'سنتين كاملين', durationZh: '2整年', sar: 6000, usd: 1600, popular: false }
  ];

  // 4. REPS DICTIONARY & COMPREHENSIVE ALIASES (19 Full Reps)
  const REPS_CATALOG = [
    {
      id: 'EGSS-ehabzaky01',
      key: 'ehab',
      nameEn: 'Ehab Zaky',
      nameAr: 'إيهاب زكي',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['ehab', 'ehabzaky', 'ehab zaky', 'zaky', 'إيهاب', 'ايهاب', 'زكي', 'إيهاب زكي', 'ايهاب زكي', 'الموظف ايهاب', 'الموظف إيهاب']
    },
    {
      id: 'EGSS-juliamonir01',
      key: 'julia',
      nameEn: 'Julia Monir',
      nameAr: 'جوليا منير',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['julia', 'juliamonir', 'monir', 'جوليا', 'جوليا منير', 'منير', 'scs julia', 'ss julia', 'الموظفة جوليا']
    },
    {
      id: 'EGSS-mohamedha',
      key: 'mohamed',
      nameEn: 'Mohamed Hamed',
      nameAr: 'محمد حامد',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: false,
      aliases: ['mohamed', 'hamed', 'mohamedha', 'mohamedhamed', 'محمد', 'حامد', 'محمد حامد', 'الموظف محمد حامد']
    },
    {
      id: 'EGSS-mahmoud04',
      key: 'tito',
      nameEn: 'Mahmoud Tito',
      nameAr: 'محمود تيتو',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['mahmoud04', 'tito', 'mahmoud tito', 'تيتو', 'محمود تيتو', 'titooooo', 'الموظف تيتو']
    },
    {
      id: 'EGSS-ashraqatal',
      key: 'ashraqat',
      nameEn: 'Ashraqat Al',
      nameAr: 'إشراقت آل',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: true,
      aliases: ['ashraqat', 'ashraqatal', 'إشراقت', 'اشراقت', 'إشراقة', 'اشراقة', 'ashra', 'إشراقت آل']
    },
    {
      id: 'EGSS-nohayoussry',
      key: 'noha',
      nameEn: 'Noha Youssry',
      nameAr: 'نهى يسري',
      team: 'ME-EGSS01',
      teamCode: 'EGSS01',
      isTL: false,
      aliases: ['noha', 'youssry', 'nohayoussry', 'نهى', 'نهي', 'يسري', 'يسرى', 'نهى يسري', 'الموظفة نهى']
    },
    {
      id: 'EGSS-samira01',
      key: 'samira',
      nameEn: 'Samira',
      nameAr: 'سميرة',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['samira', 'samira01', 'سميرة', 'سميره', 'الموظفة سميرة']
    },
    {
      id: 'EGSS-abdelrahmannasef',
      key: 'nasef',
      nameEn: 'Abdelrahman Nasef',
      nameAr: 'عبدالرحمن ناصف',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['nasef', 'abdelrahmannasef', 'ناصف', 'عبدالرحمن ناصف', 'عبد الرحمن ناصف', 'الموظف ناصف']
    },
    {
      id: 'EGSS-ibrahimismaiel',
      key: 'ibrahim',
      nameEn: 'Ibrahim Ismaiel',
      nameAr: 'إبراهيم إسماعيل',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: true,
      aliases: ['ibrahim', 'ismaiel', 'ibrahimismaiel', 'إبراهيم', 'ابراهيم', 'إسماعيل', 'اسماعيل', 'إبراهيم إسماعيل', 'الموظف ابراهيم']
    },
    {
      id: 'EGSS-khaledgonam',
      key: 'gonam',
      nameEn: 'Khaled Gonam',
      nameAr: 'خالد غنيم',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['khaled', 'gonam', 'khaledgonam', 'خالد', 'غنيم', 'خالد غنيم', 'الموظف خالد غنيم']
    },
    {
      id: 'EGSS-omarmoneb',
      key: 'omarmoneb',
      nameEn: 'Omar Moneb',
      nameAr: 'عمر منيب',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['omarmoneb', 'moneb', 'omar moneb', 'منيب', 'عمر منيب', 'الموظف عمر منيب']
    },
    {
      id: 'EGSS-alihesham01',
      key: 'alihesham',
      nameEn: 'Ali Hesham',
      nameAr: 'علي هشام',
      team: 'ME-EGSS05',
      teamCode: 'EGSS05',
      isTL: false,
      aliases: ['alihesham', 'hesham', 'ali hesham', 'علي هشام', 'على هشام', 'هشام', 'الموظف علي هشام']
    },
    {
      id: 'EGSS-abdelrhmanshehata',
      key: 'shehata',
      nameEn: 'Abdelrahman Shehata',
      nameAr: 'عبدالرحمن شحاتة',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: true,
      aliases: ['shehata', 'abdelrahman', 'abdelrahmanshehata', 'شحاتة', 'شحاته', 'عبدالرحمن', 'عبد الرحمن', 'عبدالرحمن شحاتة', 'شحاته']
    },
    {
      id: 'EGSS-hayamhassan',
      key: 'hayam',
      nameEn: 'Hayam Hassan',
      nameAr: 'هيام حسن',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: false,
      aliases: ['hayam', 'hayamhassan', 'hayam hassan', 'هيام', 'هيام حسن', 'الموظفة هيام']
    },
    {
      id: 'EGSS-titooooo',
      key: 'tito10',
      nameEn: 'Tito',
      nameAr: 'تيتو',
      team: 'ME-EGSS10',
      teamCode: 'EGSS10',
      isTL: false,
      aliases: ['titooooo', 'تيتو 10']
    },
    {
      id: 'EGSS-marwaahmed',
      key: 'marwa',
      nameEn: 'Marwa Ahmed',
      nameAr: 'مروة أحمد',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: false,
      aliases: ['marwa', 'marwaahmed', 'marwa ahmed', 'مروة', 'مروه', 'مروة أحمد', 'مروه احمد', 'الموظفة مروة']
    },
    {
      id: 'EGSS-amrsafwat',
      key: 'amr',
      nameEn: 'Amr Safwat',
      nameAr: 'عمرو صفوت',
      team: 'ME-EGSS13',
      teamCode: 'EGSS13',
      isTL: true,
      aliases: ['amr', 'safwat', 'amrsafwat', 'عمرو', 'صفوت', 'عمرو صفوت', 'الموظف عمرو صفوت']
    },
    {
      id: 'EGSS-ahmedshoukry',
      key: 'shoukry',
      nameEn: 'Ahmed Shoukry',
      nameAr: 'أحمد شكري',
      team: 'ME-EGSS30',
      teamCode: 'EGSS30',
      isTL: false,
      aliases: ['shoukry', 'ahmedshoukry', 'ahmed shoukry', 'شكري', 'احمد شكري', 'أحمد شكري', 'الموظف احمد شكري']
    },
    {
      id: 'EGSS-mahmoudkhamis',
      key: 'khamis',
      nameEn: 'Mahmoud Khamis',
      nameAr: 'محمود خميس',
      team: 'ME-EGSS30',
      teamCode: 'EGSS30',
      isTL: false,
      aliases: ['khamis', 'mahmoudkhamis', 'mahmoud khamis', 'خميس', 'محمود خميس', 'الموظف محمود خميس']
    }
  ];

  // 5. TEAMS DICTIONARY
  const TEAMS_CATALOG = [
    { code: 'EGSS01', label: 'ME-EGSS01', tlNameEn: 'Ashraqat Al', tlNameAr: 'إشراقت آل', aliases: ['egss01', 'team 1', 'team 01', 'pod 1', 'ashraqat team', 'فريق 1', 'فريق 01', 'فريق إشراقت', 'فريق اشراقت', '1组', '01组', '一组', '大一组1队'] },
    { code: 'EGSS05', label: 'ME-EGSS05', tlNameEn: 'Ibrahim Ismaiel', tlNameAr: 'إبراهيم إسماعيل', aliases: ['egss05', 'team 5', 'team 05', 'pod 5', 'ibrahim team', 'فريق 5', 'فريق 05', 'فريق إبراهيم', 'فريق ابراهيم', '5组', '05组', '五组'] },
    { code: 'EGSS10', label: 'ME-EGSS10', tlNameEn: 'Abdelrahman Shehata', tlNameAr: 'عبدالرحمن شحاتة', aliases: ['egss10', 'team 10', 'pod 10', 'shehata team', 'فريق 10', 'فريق شحاتة', 'فريق شحاته', '10组', '十组'] },
    { code: 'EGSS13', label: 'ME-EGSS13', tlNameEn: 'Amr Safwat & Mohamed Hamed', tlNameAr: 'عمرو صفوت ومحمد حامد', aliases: ['egss13', 'team 13', 'pod 13', 'amr team', 'safwat team', 'فريق 13', 'فريق عمرو', 'فريق صفوت', 'فريق حامد', '13组', '十三组'] },
    { code: 'EGSS30', label: 'ME-EGSS30', tlNameEn: 'Hussein El Aasar', tlNameAr: 'حسين الأعصر', aliases: ['egss30', 'team 30', 'pod 30', 'hussein team', 'aasar team', 'فريق 30', 'فريق حسين', 'فريق الأعصر', 'فريق الاعصر', '30组', '三十组'] }
  ];

  // 6. ROBUST LIVE BASELINE MODEL (100% Mirror of Official Lens CRM Sheet)
  const BASELINE_DATA = {
    summary: {
      totalCash: 73566,
      totalTarget: 173541,
      achievement: 42.4,
      totalGap: 99975,
      dailyNeeded: 7141,
      totalContracts: 77,
      totalBase: 438,
      totalRenewals: 15,
      renewalRate: 3.4
    },
    teams: [
      { code: 'EGSS01', name: 'ME-EGSS01', lead: 'Ashraqat Al', cash: 12537, target: 38456, gap: 25919, achievement: 32.6, orders: 13, avgDeal: 964, reps: ['Julia Monir', 'Noha Youssry', 'Mahmoud Tito', 'Ashraqat Al'] },
      { code: 'EGSS05', name: 'ME-EGSS05', lead: 'Ibrahim Ismaiel', cash: 22257, target: 60263, gap: 38006, achievement: 36.9, orders: 28, avgDeal: 795, reps: ['Ibrahim Ismaiel', 'Samira', 'Abdelrahman Nasef', 'Ali Hesham', 'Omar Moneb', 'Khaled Gonam', 'Ehab Zaky'] },
      { code: 'EGSS10', name: 'ME-EGSS10', lead: 'Abdelrahman Shehata', cash: 10698, target: 22284, gap: 11586, achievement: 48.0, orders: 13, avgDeal: 823, reps: ['Abdelrahman Shehata', 'Hayam Hassan', 'Tito'] },
      { code: 'EGSS13', name: 'ME-EGSS13', lead: 'Amr Safwat', cash: 16790, target: 31515, gap: 14725, achievement: 53.3, orders: 12, avgDeal: 1399, reps: ['Mohamed Hamed', 'Marwa Ahmed', 'Amr Safwat'] },
      { code: 'EGSS30', name: 'ME-EGSS30', lead: 'Hussein El Aasar', cash: 12871, target: 21037, gap: 8166, achievement: 61.2, orders: 11, avgDeal: 1170, reps: ['Mahmoud Khamis', 'Ahmed Shoukry'] }
    ],
    individuals: [
      { id: 'EGSS-ashraqatal', name: 'Ashraqat Al', team: 'ME-EGSS01', cash: 2040, target: 10998, achievement: 18.5, contracts: 2, m2Renewals: 0, renewalBase: 31, coverage: 92.5, refund: 0 },
      { id: 'EGSS-juliamonir01', name: 'Julia Monir', team: 'ME-EGSS01', cash: 2480, target: 8486, achievement: 29.2, contracts: 3, m2Renewals: 0, renewalBase: 16, coverage: 80.0, refund: 0 },
      { id: 'EGSS-nohayoussry', name: 'Noha Youssry', team: 'ME-EGSS01', cash: 1157, target: 8486, achievement: 13.6, contracts: 3, m2Renewals: 0, renewalBase: 26, coverage: 88.0, refund: 1383 },
      { id: 'EGSS-mahmoud04', name: 'Mahmoud Tito', team: 'ME-EGSS01', cash: 6860, target: 10486, achievement: 65.4, contracts: 5, m2Renewals: 1, renewalBase: 20, coverage: 75.0, refund: 0 },
      { id: 'EGSS-samira01', name: 'Samira', team: 'ME-EGSS05', cash: 5260, target: 8486, achievement: 62.0, contracts: 6, m2Renewals: 1, renewalBase: 16, coverage: 84.6, refund: 0 },
      { id: 'EGSS-abdelrahmannasef', name: 'Abdelrahman Nasef', team: 'ME-EGSS05', cash: 4747, target: 8486, achievement: 55.9, contracts: 5, m2Renewals: 1, renewalBase: 18, coverage: 35.7, refund: 0 },
      { id: 'EGSS-ibrahimismaiel', name: 'Ibrahim Ismaiel', team: 'ME-EGSS05', cash: 6656, target: 10996, achievement: 60.5, contracts: 8, m2Renewals: 3, renewalBase: 23, coverage: 38.5, refund: 0 },
      { id: 'EGSS-khaledgonam', name: 'Khaled Gonam', team: 'ME-EGSS05', cash: 800, target: 8486, achievement: 9.4, contracts: 2, m2Renewals: 0, renewalBase: 14, coverage: 88.9, refund: 1020 },
      { id: 'EGSS-omarmoneb', name: 'Omar Moneb', team: 'ME-EGSS05', cash: 2140, target: 8843, achievement: 24.2, contracts: 3, m2Renewals: 1, renewalBase: 19, coverage: 78.6, refund: 0 },
      { id: 'EGSS-alihesham01', name: 'Ali Hesham', team: 'ME-EGSS05', cash: 2664, target: 5965, achievement: 44.7, contracts: 4, m2Renewals: 0, renewalBase: 18, coverage: 80.0, refund: 0 },
      { id: 'EGSS-ehabzaky01', name: 'Ehab Zaky', team: 'ME-EGSS05', cash: 0, target: 8986, achievement: 0.0, contracts: 0, m2Renewals: 0, renewalBase: 107, coverage: 76.5, refund: 0 },
      { id: 'EGSS-abdelrhmanshehata', name: 'Abdelrahman Shehata', team: 'ME-EGSS10', cash: 3772, target: 6686, achievement: 56.4, contracts: 5, m2Renewals: 3, renewalBase: 28, coverage: 90.0, refund: 0 },
      { id: 'EGSS-hayamhassan', name: 'Hayam Hassan', team: 'ME-EGSS10', cash: 2734, target: 6111, achievement: 44.7, contracts: 3, m2Renewals: 2, renewalBase: 37, coverage: 85.0, refund: 0 },
      { id: 'EGSS-titooooo', name: 'Tito', team: 'ME-EGSS10', cash: 4192, target: 9486, achievement: 44.2, contracts: 5, m2Renewals: 1, renewalBase: 31, coverage: 88.0, refund: 0 },
      { id: 'EGSS-marwaahmed', name: 'Marwa Ahmed', team: 'ME-EGSS13', cash: 3570, target: 6271, achievement: 56.9, contracts: 4, m2Renewals: 0, renewalBase: 25, coverage: 86.0, refund: 0 },
      { id: 'EGSS-amrsafwat', name: 'Amr Safwat', team: 'ME-EGSS13', cash: 3100, target: 12500, achievement: 24.8, contracts: 2, m2Renewals: 1, renewalBase: 18, coverage: 89.0, refund: 0 },
      { id: 'EGSS-mohamedha', name: 'Mohamed Hamed', team: 'ME-EGSS13', cash: 10120, target: 12744, achievement: 79.4, contracts: 6, m2Renewals: 0, renewalBase: 20, coverage: 87.0, refund: 0 },
      { id: 'EGSS-ahmedshoukry', name: 'Ahmed Shoukry', team: 'ME-EGSS30', cash: 5320, target: 8486, achievement: 62.7, contracts: 4, m2Renewals: 0, renewalBase: 26, coverage: 93.0, refund: 0 },
      { id: 'EGSS-mahmoudkhamis', name: 'Mahmoud Khamis', team: 'ME-EGSS30', cash: 7551, target: 12550, achievement: 60.2, contracts: 7, m2Renewals: 1, renewalBase: 25, coverage: 88.0, refund: 0 }
    ],
    repsAch100: [],
    repsBehind: [
      { name: "Ehab Zaky", team: "EGSS05", cash: 0, target: 8986, ach: 0.0, gap: 8986 },
      { name: "Khaled Gonam", team: "EGSS05", cash: 800, target: 8486, ach: 9.4, gap: 7686 },
      { name: "Noha Youssry", team: "EGSS01", cash: 1157, target: 8486, ach: 13.6, gap: 7329 },
      { name: "Ashraqat Al", team: "EGSS01", cash: 2040, target: 10998, ach: 18.5, gap: 8958 },
      { name: "Omar Moneb", team: "EGSS05", cash: 2140, target: 8843, ach: 24.2, gap: 6703 },
      { name: "Amr Safwat", team: "EGSS13", cash: 3100, target: 12500, ach: 24.8, gap: 9400 },
      { name: "Julia Monir", team: "EGSS01", cash: 2480, target: 8486, ach: 29.2, gap: 6006 }
    ],
    zeroCashReps: [
      { name: "Ehab Zaky", nameAr: "إيهاب زكي", team: "ME-EGSS05", cash: 0, target: 8986, ach: 0.0 }
    ],
    consumption: {
      c0: 242,
      c1_3: 415,
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

  function getModel() {
    if (typeof window !== 'undefined' && window.__model && window.__model.summary && window.__model.individuals && window.__model.individuals.length > 0) {
      return window.__model;
    }
    return BASELINE_DATA;
  }

  // 7. TEXT PRE-PROCESSOR & ENTITY EXTRACTOR (Universal Multi-Script Boundary Separation)
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/([a-zA-Z0-9\u0600-\u06FF])([\u4E00-\u9FFF])/g, (m, p1, p2) => p1 + ' ' + p2)
      .replace(/([\u4E00-\u9FFF])([a-zA-Z0-9\u0600-\u06FF])/g, (m, p1, p2) => p1 + ' ' + p2)
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
      .replace(/[إأآا]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .replace(/[يى]/g, 'ي')
      .replace(/[.,/#!$%^&*;:{}=\-_~`()?"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 8. LANGUAGE DETECTION
  function detectPromptLanguage(text, activeLang) {
    if (!text) return activeLang || 'en';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    if (/(?:speak|talk|switch|in)\s+arabic|تكلم\s*عربي|بالعربي|مصري/i.test(text)) return 'ar';
    if (/(?:speak|talk|switch|in)\s+chinese|说中文|讲中文/i.test(text)) return 'zh';
    if (/(?:speak|talk|switch|in)\s+english|تكلم\s*انجليزي|بالانجليزي/i.test(text)) return 'en';
    return activeLang || 'en';
  }

  // 9. CORE AI INTELLECT & ANSWER GENERATOR (Native Egyptian Arabic, English, Chinese)
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

    // =========================================================================
    // [INTENT 0]: EXPLICIT LANGUAGE SWITCH (Egyptian Arabic, Chinese, English)
    // =========================================================================
    const wantsArabic = /speak\s*(in\s*)?arabic|talk\s*(in\s*)?arabic|switch\s*(to\s*)?arabic|arabic\s*please|تكلم\s*عربي|اتكلم\s*عربي|تكلم\s*مصري|اتكلم\s*مصري|حول\s*عربي|بالعربي|لغة\s*عربية|عامية|مصريه|\barabic\b/i.test(norm) ||
      (norm.includes('عربي') && (norm.includes('تكلم') || norm.includes('تحدث') || norm.includes('حول') || norm.includes('اتكلم')));

    const wantsChinese = /speak\s*(in\s*)?chinese|talk\s*(in\s*)?chinese|switch\s*(to\s*)?chinese|chinese\s*please|说中文|讲中文|用中文|切换到中文|切换中文|普通话|\bchinese\b/i.test(norm) ||
      (norm.includes('中文') && (norm.includes('说') || norm.includes('讲') || norm.includes('用') || norm.includes('切换')));

    const wantsEnglish = /speak\s*(in\s*)?english|talk\s*(in\s*)?english|switch\s*(to\s*)?english|english\s*please|تكلم\s*انجليزي|اتكلم\s*انجليزي|حول\s*انجليزي|بالانجليزي|切换到英文|切换英文|讲英文|说英语|\benglish\b/i.test(norm) ||
      (norm.includes('انجليزي') && (norm.includes('تكلم') || norm.includes('حول') || norm.includes('اتكلم')));

    if (wantsArabic && !wantsChinese && !wantsEnglish) {
      return {
        text: 'من عينيا يا باشا! 🌟 أنا معاك بالعامية المصرية أهو وجاهز أساعدك في كل صغيرة وكبيرة في قطاع Big Team 01!\n' +
          `• إحنا لحد النهاردة مجمعين: ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%) ومعديين بنشمارك النهاردة بـ +${(s.achievement - todayBM).toFixed(1)}%.\n` +
          '• اسألني بقى براحتك عن: أرقام أي موظف أو مستشار، بنشمارك بكرة، فجوة الكاش لحد آخر الشهر، استهلاك الحصص وطلاب الصفر، أو أسعار الباقات المعتمدة!',
        lang: 'ar',
        switchLang: 'ar'
      };
    }

    if (wantsChinese) {
      return {
        text: '当然可以！🌟 我很高兴使用中文与您交流。大一组 (Big Team 01) 的专属智能语音与数据副驾随时为您服务！\n' +
          `• 截至今天全组累计入账: ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，领先今日第16天基准线 +${(s.achievement - todayBM).toFixed(1)}%。\n` +
          '• 您可以随时向我询问：销售顾问战报、明日基准线、全月业绩缺口、课时消耗及官方课包价格！',
        lang: 'zh',
        switchLang: 'zh'
      };
    }

    if (wantsEnglish && !wantsArabic && !wantsChinese) {
      return {
        text: 'Certainly! 🌟 I\'m glad to speak with you in English. Big Team 01 AI assistant is ready to support you with all live performance telemetry!\n' +
          `• Sector Net Cash MTD: ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - todayBM).toFixed(1)}% ahead of Day 16 benchmark.\n` +
          '• Feel free to ask about any specialist, tomorrow\'s benchmark, cash gaps, class consumption, or official package rates!',
        lang: 'en',
        switchLang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 1]: SPECIFIC SALES SPECIALIST LOOKUP (Highest Priority)
    // =========================================================================
    let matchedRep = null;
    let matchedRepMeta = null;

    for (const rep of REPS_CATALOG) {
      for (const alias of rep.aliases) {
        const cleanAlias = normalizeText(alias);
        const pattern = new RegExp('(?:^|\\s)' + cleanAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?:\\s|$)', 'i');
        if (pattern.test(norm)) {
          matchedRepMeta = rep;
          matchedRep = (m.individuals || []).find(ind => ind.name.toLowerCase() === rep.nameEn.toLowerCase() || (ind.id && ind.id.toLowerCase() === rep.id.toLowerCase()));
          if (!matchedRep) {
            matchedRep = {
              name: rep.nameEn,
              nameAr: rep.nameAr,
              team: rep.team,
              cash: 0,
              target: 8000,
              achievement: 0,
              contracts: 0,
              m2Renewals: 0,
              renewalBase: 0,
              coverage: 0,
              refund: 0
            };
          }
          break;
        }
      }
      if (matchedRep) break;
    }

    if (matchedRep) {
      const isArabic = (promptLang === 'ar');
      const isChinese = (promptLang === 'zh');
      const cleanNameEn = matchedRepMeta ? matchedRepMeta.nameEn : matchedRep.name;
      const cleanNameAr = matchedRepMeta ? matchedRepMeta.nameAr : (matchedRep.nameAr || matchedRep.name);
      const cleanNameZh = cleanNameEn;
      const repTeam = matchedRep.team || (matchedRepMeta ? matchedRepMeta.team : 'Big Team 01');
      const gap = Math.max(0, matchedRep.target - matchedRep.cash);
      const repAch = matchedRep.achievement !== undefined ? matchedRep.achievement : (matchedRep.target > 0 ? (matchedRep.cash / matchedRep.target) * 100 : 0);
      const isAhead = repAch >= todayBM;
      const aheadDiff = (repAch - todayBM).toFixed(1);

      // Check specific sub-intents
      const asksRefund = /refund|chargeback|استرداد|مرتجع|خصم|ريفند|退费|退款/i.test(norm);
      const asksM2 = /m2|renewal|upgrade|تجديد|ترقية|ترقيه|قاعدة|بيز|ام تو|提续|续费/i.test(norm);
      const asksContracts = /deals?|contracts?|orders?|عقود|عقد|صفقات|صفقة|ديل|ديلات|成单|订单/i.test(norm);
      const asksCalls = /calls?|coverage|تغطية|مكالمات|اتصالات|تغطيه|通话|覆盖/i.test(norm);

      if (asksRefund) {
        const refAmt = matchedRep.refund || 0;
        if (refAmt > 0) {
          if (isArabic) {
            return {
              text: `بص يا باشا، المستشار ${cleanNameAr} مسجل عليه ريفند بمبلغ ${formatMoney(refAmt, 'ar')}. الكاش الصافي الفعلي بعد الخصم هو ${formatMoney(matchedRep.cash, 'ar')} (وكان عامل Gross مبيعات بـ ${formatMoney(matchedRep.cash + refAmt, 'ar')}).`,
              lang: 'ar'
            };
          }
          if (isChinese) {
            return {
              text: `销售顾问 ${cleanNameZh} 本月有 ${formatMoney(refAmt, 'zh')} 的退费扣除记录。扣除后净入账业绩为 ${formatMoney(matchedRep.cash, 'zh')} (毛单金额为 ${formatMoney(matchedRep.cash + refAmt, 'zh')})。`,
              lang: 'zh'
            };
          }
          return {
            text: `Specialist ${cleanNameEn} has a registered refund deduction of ${formatMoney(refAmt)}. Net cash achieved is ${formatMoney(matchedRep.cash)} (from a gross volume of ${formatMoney(matchedRep.cash + refAmt)}).`,
            lang: 'en'
          };
        } else {
          if (isArabic) {
            return {
              text: `المستشار ${cleanNameAr} سجله أبيض ونظيف تماماً! مفيش عليه أي ريفند أو خصومات (Refund: $0). وصافي الكاش بتاعه ${formatMoney(matchedRep.cash, 'ar')}.`,
              lang: 'ar'
            };
          }
          if (isChinese) {
            return {
              text: `销售顾问 ${cleanNameZh} 本月表现优异，零退费记录 (Refund: $0)！累计净业绩为 ${formatMoney(matchedRep.cash, 'zh')}。`,
              lang: 'zh'
            };
          }
          return {
            text: `Specialist ${cleanNameEn} has zero refunds recorded (Refund: $0). Net cash achieved is ${formatMoney(matchedRep.cash)} across ${matchedRep.contracts} closed deals.`,
            lang: 'en'
          };
        }
      }

      if (asksM2) {
        if (isArabic) {
          return {
            text: `موقف ترقيات الـ M2 والتجديد للمستشار ${cleanNameAr}: قفل ${matchedRep.m2Renewals} ديلات تجديد من إجمالي محفظة تجديد فيها ${matchedRep.renewalBase} طالب (نسبة التحويل: ${matchedRep.renewalBase > 0 ? ((matchedRep.m2Renewals / matchedRep.renewalBase) * 100).toFixed(1) : 0}%).`,
            lang: 'ar'
          };
        }
        if (isChinese) {
          return {
            text: `销售顾问 ${cleanNameZh} 的 M2 提续表现：在读提续池共有 ${matchedRep.renewalBase} 名学员，已成功转化 ${matchedRep.m2Renewals} 单续费，转化率为 ${matchedRep.renewalBase > 0 ? ((matchedRep.m2Renewals / matchedRep.renewalBase) * 100).toFixed(1) : 0}%。`,
            lang: 'zh'
          };
        }
        return {
          text: `Specialist ${cleanNameEn} Early Upgrade (M2) Telemetry: Closed ${matchedRep.m2Renewals} renewals from an active base of ${matchedRep.renewalBase} students (Conversion: ${matchedRep.renewalBase > 0 ? ((matchedRep.m2Renewals / matchedRep.renewalBase) * 100).toFixed(1) : 0}%).`,
          lang: 'en'
        };
      }

      // Default full profile for this Rep
      if (isArabic) {
        if (matchedRep.cash === 0 && matchedRep.contracts === 0) {
          return {
            text: `المستشار ${cleanNameAr} (${repTeam}) يا فندم أرقامه كالتالي:\n` +
              `• الكاش: لسه زيرو كاش ($0) وما قفلش ولا ديل لحد دلوقتي (0 عقود)\n` +
              `• التارجت المطلوب منه: ${formatMoney(matchedRep.target, 'ar')} (العجز 100%)\n` +
              `• تغطية المكالمات: ${matchedRep.coverage.toFixed(1)}%\n` +
              `• قاعدة التجديد: عنده ${matchedRep.renewalBase} طالب في البيز\n` +
              `• الموقف: 🚨 ده المستشار الوحيد اللي زيرو كاش في الفريق، ومحتاج جلسة كوتشينج 1:1 فورية علشان يكسر الصفر ويقفل أول ديل!`,
            lang: 'ar'
          };
        }
        return {
          text: `تقرير أداء المستشار ${cleanNameAr} (${repTeam}) يا باشا:\n` +
            `• الكاش اللي جابه: ${formatMoney(matchedRep.cash, 'ar')} (نسبة إنجازه: ${repAch.toFixed(1)}%)\n` +
            `• التارجت الشهري: ${formatMoney(matchedRep.target, 'ar')} (فاضل له عجز: ${formatMoney(gap, 'ar')})\n` +
            `• عدد العقود: ${matchedRep.contracts} عقود مقفولة\n` +
            `• ترقيات M2: قفل ${matchedRep.m2Renewals} عقود من محفظة فيها ${matchedRep.renewalBase} طالب\n` +
            `• نسبة تغطية المكالمات: ${matchedRep.coverage.toFixed(1)}%\n` +
            `• موقفه من وتيرة النهاردة (${todayBM}%): ` + (isAhead ? `🚀 متقدم على الوتيرة بزيادة +${aheadDiff}%، زي الفل!` : `⚠️ متأخر عن الوتيرة بفارق ${formatMoney(gap, 'ar')} ومحتاج يشد حيله!`),
          lang: 'ar'
        };
      }

      if (isChinese) {
        return {
          text: `销售顾问 ${cleanNameZh} (${repTeam}) 专属业绩档案：\n` +
            `• 累计业绩: ${formatMoney(matchedRep.cash, 'zh')} (达成率: ${repAch.toFixed(1)}%)\n` +
            `• 本月目标: ${formatMoney(matchedRep.target, 'zh')} (缺口: ${formatMoney(gap, 'zh')})\n` +
            `• 成单数量: ${matchedRep.contracts} 单\n` +
            `• 提续 M2: 已完成 ${matchedRep.m2Renewals} 单 (在读续费池: ${matchedRep.renewalBase} 人)\n` +
            `• 通话覆盖率: ${matchedRep.coverage.toFixed(1)}%\n` +
            `• 基准线对比 (${todayBM}%): ` + (isAhead ? `领先今日基准线 +${aheadDiff}%！` : `落后基准线，差额 ${formatMoney(gap, 'zh')}。`),
          lang: 'zh'
        };
      }

      return {
        text: `Specialist ${cleanNameEn} (${repTeam}) Performance Status:\n` +
          `• Cash Achieved: ${formatMoney(matchedRep.cash)} (${repAch.toFixed(1)}% achievement)\n` +
          `• Target: ${formatMoney(matchedRep.target)} (Gap: ${formatMoney(gap)})\n` +
          `• Contracts Closed: ${matchedRep.contracts} deals\n` +
          `• Upgrade M2: ${matchedRep.m2Renewals} closed from base of ${matchedRep.renewalBase} accounts\n` +
          `• Call Coverage: ${matchedRep.coverage.toFixed(1)}%\n` +
          `• Pacing Verdict: ` + (isAhead ? `🚀 Ahead of Day ${CURRENT_DAY} benchmark by +${aheadDiff}%` : `⚠️ Pacing behind Day ${CURRENT_DAY} benchmark by ${formatMoney(gap)}.`),
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 2]: SMALL TEAM / POD SPECIFIC INQUIRY
    // =========================================================================
    let matchedTeam = null;
    let matchedTeamMeta = null;
    for (const team of TEAMS_CATALOG) {
      for (const alias of team.aliases) {
        const cleanAlias = normalizeText(alias);
        const pattern = new RegExp('(?:^|\\s)' + cleanAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?:\\s|$)', 'i');
        if (pattern.test(norm)) {
          matchedTeam = (m.teams || []).find(t => t.code === team.code);
          matchedTeamMeta = team;
          break;
        }
      }
      if (matchedTeam) break;
    }

    if (matchedTeam) {
      const isAhead = matchedTeam.achievement >= todayBM;
      const tlNameAr = (matchedTeamMeta && matchedTeamMeta.tlNameAr) || matchedTeam.lead;
      const repNamesAr = {
        'Ashraqat Al': 'إشراقت آل',
        'Julia Monir': 'جوليا منير',
        'Noha Youssry': 'نهى يسري',
        'Mahmoud Tito': 'محمود تيتو',
        'Ibrahim Ismaiel': 'إبراهيم إسماعيل',
        'Samira': 'سميرة',
        'Abdelrahman Nasef': 'عبدالرحمن ناصف',
        'Ali Hesham': 'علي هشام',
        'Omar Moneb': 'عمر منيب',
        'Khaled Gonam': 'خالد غنيم',
        'Ehab Zaky': 'إيهاب زكي',
        'Abdelrahman Shehata': 'عبدالرحمن شحاتة',
        'Hayam Hassan': 'هيام حسن',
        'Tito': 'تيتو',
        'Marwa Ahmed': 'مروة أحمد',
        'Amr Safwat': 'عمرو صفوت',
        'Mohamed Hamed': 'محمد حامد',
        'Mahmoud Khamis': 'محمود خميس',
        'Ahmed Shoukry': 'أحمد شكري',
        'Hussein El Aasar': 'حسين الأعصر'
      };
      if (promptLang === 'ar') {
        const arReps = matchedTeam.reps.map(r => repNamesAr[r] || r).join('، ');
        return {
          text: `تقرير الفريق المصغر ${matchedTeam.name} يا باشا:\n` +
            `• ليدر الفريق: ${tlNameAr}\n` +
            `• الكاش اللي جمعوه: ${formatMoney(matchedTeam.cash, 'ar')} (نسبة الإنجاز: ${matchedTeam.achievement.toFixed(1)}%)\n` +
            `• التارجت الكلي: ${formatMoney(matchedTeam.target, 'ar')} (العجز اللي فاضل: ${formatMoney(matchedTeam.gap, 'ar')})\n` +
            `• عدد الصفقات: ${matchedTeam.orders} عقود (متوسط سعر الديل: ${formatMoney(matchedTeam.avgDeal, 'ar')})\n` +
            `• المستشارين اللي فيه: ${arReps}.\n` +
            `• الموقف من وتيرة النهاردة (${todayBM}%): ` + (isAhead ? `🚀 متقدمين بزيادة +${(matchedTeam.achievement - todayBM).toFixed(1)}%، شغل عالي!` : `⚠️ متأخرين بعجز ${formatMoney(matchedTeam.gap, 'ar')} ولازم يشدوا حيلهم!`),
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `小团队 ${matchedTeam.name} 专属战报：\n` +
            `• 团队主管: ${matchedTeam.lead}\n` +
            `• 累计业绩: ${formatMoney(matchedTeam.cash, 'zh')} (达成率: ${matchedTeam.achievement.toFixed(1)}%)\n` +
            `• 团队目标: ${formatMoney(matchedTeam.target, 'zh')} (缺口: ${formatMoney(matchedTeam.gap, 'zh')})\n` +
            `• 成单数量: ${matchedTeam.orders} 单 (平均客单价: ${formatMoney(matchedTeam.avgDeal, 'zh')})\n` +
            `• 团队顾问: ${matchedTeam.reps.join('、 ')}。\n` +
            `• 基准线对比 (${todayBM}%): ` + (isAhead ? `领先今日基准线 +${(matchedTeam.achievement - todayBM).toFixed(1)}%！` : `落后基准线，差额 ${formatMoney(matchedTeam.gap, 'zh')}。`),
          lang: 'zh'
        };
      }
      return {
        text: `Small Team ${matchedTeam.name} Telemetry:\n` +
          `• Team Leader: ${matchedTeam.lead}\n` +
          `• Cash Achieved: ${formatMoney(matchedTeam.cash)} (${matchedTeam.achievement.toFixed(1)}%)\n` +
          `• Target: ${formatMoney(matchedTeam.target)} (Gap: ${formatMoney(matchedTeam.gap)})\n` +
          `• Deals Closed: ${matchedTeam.orders} orders (Avg Deal: ${formatMoney(matchedTeam.avgDeal)})\n` +
          `• Specialists: ${matchedTeam.reps.join(', ')}.\n` +
          `• Pacing Verdict: ` + (isAhead ? `🚀 Ahead of Day ${CURRENT_DAY} benchmark by +${(matchedTeam.achievement - todayBM).toFixed(1)}%!` : `⚠️ Pacing behind by ${formatMoney(matchedTeam.gap)}.`),
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 3]: TOMORROW'S BENCHMARK (Exact & Day 17)
    // =========================================================================
    const asksTomorrow = /(?:tomorrow|next\s*day|day\s*17|بكره|غدا|غداً|الغد|بكرة|اليوم\s*التالي|يوم\s*17|明天|次日|第17天)/i.test(norm) &&
      /(?:bm|benchmark|pacing|target|cash|needed|وتيرة|وتيره|بنشمارك|مطلوب|كاش|هدف|تارجت|عايزين|محتاجين|基准线|目标|业绩)/i.test(norm);

    if (asksTomorrow) {
      if (promptLang === 'ar') {
        return {
          text: `بص يا حسين يا بطل، بكرة هو اليوم 17 وبنشمارك بكرة في المنحنى الرسمي هو ${tomorrowBM}% (يعني المفروض نكون مجمعين ${formatMoney(tomorrowExpCash, 'ar')}).\n` +
            `فريقنا Big Team 01 جايب لحد النهاردة ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%). يعني بكرة محتاجين نلم كاش جديد بـ ${formatMoney(tomorrowCashNeeded, 'ar')} بس علشان نفضل معديين الوتيرة وفي الزون الأخضر!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `明天是11月第17天，官方基准线为 ${tomorrowBM}% (${formatMoney(tomorrowExpCash, 'zh')})。 ` +
            `大一组目前累计 ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，明天仅需新增入账 ${formatMoney(tomorrowCashNeeded, 'zh')} 即可保持领先！`,
          lang: 'zh'
        };
      }
      return {
        text: `Tomorrow is Day 17 of November, and the official benchmark is ${tomorrowBM}% (${formatMoney(tomorrowExpCash)}). ` +
          `Big Team 01 has currently achieved ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%). We need ${formatMoney(tomorrowCashNeeded)} in fresh cash tomorrow to maintain our green status ahead of the curve!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 4]: TODAY'S BENCHMARK (Day 16)
    // =========================================================================
    const asksTodayBM = /(?:today|day\s*16|اليوم|النهاردة|النهارده|يوم\s*16|今天|第16天)/i.test(norm) &&
      /(?:bm|benchmark|pacing|target|وتيرة|وتيره|بنشمارك|تارجت|وضعنا|اخبارنا|基准线|目标)/i.test(norm) &&
      !/(?:behind|laggard|trailing|underperforming|late|struggling|low|متأخر|متاخر|متأخرين|متاخرين|واقع|واقعين|مين واقع|مين متأخر|مين مقصر|مين|落后|未达标)/i.test(norm);

    if (asksTodayBM) {
      if (promptLang === 'ar') {
        return {
          text: `النهاردة اليوم 16 وبنشمارك النهاردة هو ${todayBM}% (${formatMoney(todayExpCash, 'ar')}).\n` +
            `إحنا في قطاع Big Team 01 محققين ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%)، يعني متقدمين بزيادة +${(s.achievement - todayBM).toFixed(1)}% (فارق إيجابي +${formatMoney(s.totalCash - todayExpCash, 'ar')}) والوتيرة ماشية زي الفل!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `今天是11月第16天，官方基准线为 ${todayBM}% (${formatMoney(todayExpCash, 'zh')})。\n` +
            `大一组累计入账 ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，领先基准线 +${(s.achievement - todayBM).toFixed(1)}% (${formatMoney(s.totalCash - todayExpCash, 'zh')})！全组节奏保持健康。\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Today is Day 16 of November, and the official benchmark is ${todayBM}% (${formatMoney(todayExpCash)}).\n` +
          `Big Team 01 has reached ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - todayBM).toFixed(1)}% (+${formatMoney(s.totalCash - todayExpCash)}) ahead of schedule!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 5]: CASH GAP, RUN RATE & VELOCITY
    // =========================================================================
    const asksGap = /(?:cash\s*gap|total\s*gap|gap|deficit|shortfall|quota|remaining|run\s*rate|daily\s*needed|فجوة|فجوه|عجز|نقص|متبقي|باقي|المطلوب|ناقص|عشان نقفل|فاضل كام|فاضلنا كام|عايزين كام|缺口|还差|距离目标|日均需)/i.test(norm) &&
      !/(?:package|pricing|rate\s*card|class|consumption|c0|bonds|اسعار|باقات)/i.test(norm);

    if (asksGap) {
      if (promptLang === 'ar') {
        return {
          text: `تحليل فجوة الكاش وسرعة الفريق المطلوبة يا فندم:\n` +
            `• تارجت الشهر الكلي: ${formatMoney(s.totalTarget, 'ar')}\n` +
            `• الكاش اللي جمعناه لحد دلوقتي: ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%)\n` +
            `• الفجوة اللي باقية عشان نقفل 100%: ${formatMoney(s.totalGap, 'ar')}\n` +
            `• الأيام الشغالة اللي باقية في الشهر: 14 يوم\n` +
            `• الرن ريت اليومي المطلوب (Daily Run Rate): محتاجين نلم ${formatMoney(s.dailyNeeded, 'ar')} كل يوم علشان نقفل التارجت بالكامل!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组全月业绩缺口与冲刺节奏分析：\n` +
            `• 全月总目标: ${formatMoney(s.totalTarget, 'zh')}\n` +
            `• 累计已入账: ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)\n` +
            `• 距离100%全月缺口: ${formatMoney(s.totalGap, 'zh')}\n` +
            `• 剩余冲刺天数: 14 天\n` +
            `• 每日需冲刺业绩 (Daily Run Rate): ${formatMoney(s.dailyNeeded, 'zh')}/天。\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 Cash Gap & Pace Telemetry:\n` +
          `• Total Target: ${formatMoney(s.totalTarget)}\n` +
          `• Cash Achieved: ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)\n` +
          `• Cash Gap to 100%: ${formatMoney(s.totalGap)}\n` +
          `• Operational Days Left: 14 days\n` +
          `• Required Daily Run Rate: ${formatMoney(s.dailyNeeded)}/day.`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 6]: TOP PERFORMERS / SALES STARS
    // =========================================================================
    const asksTop = /(?:top\s*stars?|top\s*performers?|best\s*reps?|leaders?|highest|#1|number\s*one|champion|winner|ابطال|أبطال|متصدر|متصدرين|افضل|أفضل|نجوم|الاوائل|الأوائل|مين التوب|مين اعلى|مين احسن|وحوش|الرجالة|销冠|前三|优秀|最高|第一名|冠军|第一)/i.test(norm) &&
      !/(?:behind|gap|zero|laggard|متأخر|متاخر|صفر|واقع)/i.test(norm);

    if (asksTop) {
      if (promptLang === 'ar') {
        return {
          text: `وحوش الصدارة ونجوم Big Team 01 يا باشا:\n` +
            `🥇 المركز الأول: محمد حامد (EGSS13) — $10,120 دولار (إنجاز خرافي 79.4%)\n` +
            `🥈 المركز التاني: محمود خميس (EGSS30) — $7,551 دولار (إنجاز 60.2%)\n` +
            `🥉 المركز التالت: محمود تيتو (EGSS01) — $6,860 دولار (إنجاز 65.4%)\n` +
            `وبعدهم إبراهيم إسماعيل عامل $6,656 دولار، وأحمد شكري $5,320 دولار وسميرة $5,260 دولار! عاش يا رجالة!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组龙虎榜顶尖销冠 (Top Stars)：\n` +
            `🥇 第一名: Mohamed Hamed (EGSS13) — $10,120 美元 (79.4%)\n` +
            `🥈 第二名: Mahmoud Khamis (EGSS30) — $7,551 美元 (60.2%)\n` +
            `🥉 第三名: Mahmoud Tito (EGSS01) — $6,860 美元 (65.4%)\n` +
            `紧随其后: Ibrahim Ismaiel ($6,656 美元) 与 Ahmed Shoukry ($5,320 美元)！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 Top Performers Leaderboard:\n` +
          `🥇 #1: Mohamed Hamed (EGSS13) — $10,120 (79.4%)\n` +
          `🥈 #2: Mahmoud Khamis (EGSS30) — $7,551 (60.2%)\n` +
          `🥉 #3: Mahmoud Tito (EGSS01) — $6,860 (65.4%)\n` +
          `Followed by Ibrahim Ismaiel ($6,656) and Ahmed Shoukry ($5,320)! Outstanding work!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 7]: LAGGARDS / BEHIND BENCHMARK
    // =========================================================================
    const asksBehind = /(?:behind\s*bm|behind\s*benchmark|behind|laggard|trailing|underperforming|curve|late|struggling|low|متأخر|متاخر|متأخرين|متاخرين|تحت|ضعيف|مقصر|واقع|واقعين|مين واقع|مين متأخر|مين مقصر|落后|未达标|偏低)/i.test(norm) &&
      !/(?:zero\s*cash|no\s*deal|صفر\s*كاش)/i.test(norm);

    if (asksBehind) {
      if (promptLang === 'ar') {
        return {
          text: `المستشارين اللي واقعين ورا بنشمارك النهاردة (${todayBM}%) ومحتاجين زقة:\n` +
            `🚨 إيهاب زكي (0% زيرو كاش وبدون عقود)\n` +
            `⚠️ خالد غنيم (9.4% كاش $800)\n` +
            `⚠️ نهى يسري (13.6% كاش $1,157)\n` +
            `⚠️ إشراقت آل (18.5% كاش $2,040)\n` +
            `⚠️ عمر منيب (24.2% كاش $2,140)\n` +
            `⚠️ عمرو صفوت (24.8% كاش $3,100)\n` +
            `⚠️ جوليا منير (29.2% كاش $2,480)\n` +
            `الناس دي محتاجة مننا تركيز فوري على ليدات الـ Uncovered علشان يعوضوا الفارق قبل آخر الأسبوع!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `当前落后今日第16天基准线 (${todayBM}%) 的重点跟进名单：\n` +
            `🚨 Ehab Zaky (0% 零业绩)\n` +
            `⚠️ Khaled Gonam (9.4%)\n` +
            `⚠️ Noha Youssry (13.6%)\n` +
            `⚠️ Ashraqat Al (18.5%)\n` +
            `⚠️ Omar Moneb (24.2%)\n` +
            `⚠️ Amr Safwat (24.8%)\n` +
            `⚠️ Julia Monir (29.2%)\n` +
            `建议主管针对未覆盖线索与在读学员池进行专项1对1辅导！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Specialists currently pacing behind Day ${CURRENT_DAY} benchmark (${todayBM}%):\n` +
          `🚨 Ehab Zaky (0% zero cash)\n` +
          `⚠️ Khaled Gonam (9.4%)\n` +
          `⚠️ Noha Youssry (13.6%)\n` +
          `⚠️ Ashraqat Al (18.5%)\n` +
          `⚠️ Omar Moneb (24.2%)\n` +
          `⚠️ Amr Safwat (24.8%)\n` +
          `⚠️ Julia Monir (29.2%)\n` +
          `Targeted intervention recommended on uncontacted leads and renewals.`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 8]: ZERO CASH REPS
    // =========================================================================
    const asksZeroCash = /(?:zero\s*cash|0\s*cash|no\s*deal|صفر\s*كاش|زيرو\s*كاش|بدون\s*كاش|ما قفلش|ما قفلشى|ما باعش|كسر الصفر|0\s*业绩|未破单|零业绩|零入账)/i.test(norm) &&
      !/(?:class|classes|consumption|c0|حصص|حصة|0\s*class)/i.test(norm);

    if (asksZeroCash) {
      if (promptLang === 'ar') {
        return {
          text: 'حصر زيرو كاش في الفريق يا ريس:\n' +
            '🚨 المستشار الوحيد اللي لسه ما كسرش الصفر وما قفلش ولا ديل لحد النهاردة هو إيهاب زكي (Zero Cash = $0 و 0 عقود)!\n' +
            'باقي الـ 17 مستشار كلهم عملوا مبيعات وقفلوا عقود الحمد لله. إيهاب محتاج مننا جلسة 1:1 عاجلة النهاردة علشان يفتح الحساب ويكسر الصفر!',
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: '大一组零业绩人员排查：\n' +
            '🚨 全组截至目前唯一尚未破单的顾问为：Ehab Zaky (业绩: $0, 0成单)！\n' +
            '全组其余17位顾问均已成功出单。请主管今天务必对 Ehab 进行1对1专项带教，协助破单！\n',
          lang: 'zh'
        };
      }
      return {
        text: 'Zero-Cash Audit Telemetry for Big Team 01:\n' +
          '🚨 Currently, the only specialist who has not yet closed a deal is Ehab Zaky ($0 cash, 0 contracts)!\n' +
          'All other 17 specialists have closed deals. Urgent 1-on-1 coaching is recommended for Ehab today to break zero!',
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 9]: OFFICIAL PACKAGES, PRICING & RATE CARDS
    // =========================================================================
    const asksRateCard = /(?:rate\s*card|packages?|pricing|price|cost|tier|plans?|سعر|اسعار|أسعار|باقة|باقات|اسعار الباقات|أسعار الباقات|تكلفة|كام السعر|عرض|عروض|بكام|بكم|باقه|价格|课包|套餐|学费|价目表|多少钱)/i.test(norm);

    if (asksRateCard) {
      if (promptLang === 'ar') {
        const lines = RATE_CARDS.map(rc => '• ' + rc.classes + ' حصة (' + rc.durationAr + '): ' + rc.sar.toLocaleString('en-US') + ' ريال سعودي ($' + rc.usd.toLocaleString('en-US') + ' دولار)' + (rc.popular ? ' ⭐ (الجوكر والأكتر مبيعاً)' : ''));
        return {
          text: `قائمة أسعار باقات 51Talk الرسمية المعتمدة يا باشا (الدولار = 3.75 ريال سعودي):\n` + lines.join('\n') +
            '\n💡 باقة الـ 150 حصة هي الباقة الذهبية اللي بنركز عليها لأنها بتدي العميل أحسن توفير وبتضمن لنا أعلى عمولة وتجديد M2!',
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        const lines = RATE_CARDS.map(rc => '• ' + rc.classes + ' 课时 (' + rc.durationZh + '): ' + rc.sar.toLocaleString('en-US') + ' SAR ($' + rc.usd.toLocaleString('en-US') + ' 美元)' + (rc.popular ? ' ⭐ 最畅销推荐' : ''));
        return {
          text: `官方授权正式课包价格与体系 (1 USD = 3.75 SAR)：\n` + lines.join('\n') +
            '\n💡 150课时包是团队首推黄金包，达成最佳提续转化率！',
          lang: 'zh'
        };
      }
      const lines = RATE_CARDS.map(rc => '• ' + rc.classes + ' Classes (' + rc.durationEn + '): ' + rc.sar.toLocaleString('en-US') + ' SAR ($' + rc.usd.toLocaleString('en-US') + ')' + (rc.popular ? ' ⭐ Best Value' : ''));
      return {
        text: `Official 51Talk Approved Package Rate Card (Fixed Rate: $1 = 3.75 SAR):\n` + lines.join('\n') +
          '\n💡 The 150-class package is our recommended standard offering optimal retention and M2 upgrade yield!',
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 10]: CLASS CONSUMPTION & C0 RISK
    // =========================================================================
    const asksConsumption = /(?:consumption|consume|classes|zero\s*class|c0|attendance|استهلاك|حصص|حصة|حصص الصفر|صفر حصص|استهلاك الحصص|غياب|حضور|عيال الصفر|الطلاب الصفر|课消|课时|0课时|零课时|消耗|消课)/i.test(norm) &&
      !/(?:rate\s*card|pricing|price|cost|package|اسعار|أسعار|باقات|باقة|سعر|价格|课包|学费|多少钱)/i.test(norm);

    if (asksConsumption) {
      const c = m.consumption || { c0: 242, c1_3: 415, c4_7: 590, c8_11: 341, c12Plus: 118 };
      if (promptLang === 'ar') {
        return {
          text: `تقرير استهلاك الحصص وعيال الصفر (C0) يا فندم (البنشمارك الرسمي: 82%):\n` +
            `• عيال الصفر اللي ما حضروش ولا حصة (C0 High Risk): عندنا 242 طالب في خطر التسرب!\n` +
            `• الطلاب من 1 لـ 3 حصص: 415 طالب\n` +
            `• الطلاب من 4 لـ 7 حصص: 590 طالب\n` +
            `• الطلاب من 8 لـ 11 حصة: 341 طالب\n` +
            `• الطلاب من 12 حصة وطالع: 118 طالب\n` +
            `💡 أهم تحرك مطلوب النهاردة: الـ 242 طالب الصفر دول لازم مستشارينا يكلموا أولياء أمورهم ويحجزوا لهم أول كلاس فوراً علشان نعلي نسبة الاستهلاك!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组在读学员课时消耗战报 (官方基准线: 82%)：\n` +
            `• 0课时未上课学员 (C0 风险预警): ${c.c0} 名高危学员\n` +
            `• 1-3 课时学员: ${c.c1_3} 名\n` +
            `• 4-7 课时学员: ${c.c4_7} 名\n` +
            `• 8-11 课时学员: ${c.c8_11} 名\n` +
            `• 12+ 课时活跃学员: ${c.c12Plus} 名\n` +
            `💡 核心运营指令：优先激活 C0 学员开启首堂课，保障后续续费基石！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 Class Consumption Telemetry (Benchmark: 82%):\n` +
          `• 0-Classes Students (C0 High Risk): ${c.c0} students\n` +
          `• 1-3 Classes: ${c.c1_3} students\n` +
          `• 4-7 Classes: ${c.c4_7} students\n` +
          `• 8-11 Classes: ${c.c8_11} students\n` +
          `• 12+ Classes: ${c.c12Plus} students\n` +
          `💡 Top Priority: Follow up C0 zero-class students to drive the sector toward our 82% benchmark!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 11]: SOP PROCESS COMPLIANCE (R1-R6 & English Club)
    // =========================================================================
    const asksSOP = /(?:sop|rounds?|r1|r2|r3|r4|r5|r6|compliance|اس او بي|مراحل|جولات|التزام|معايير|اسطوانة|合规|流程|跟进)/i.test(norm) &&
      !/(?:english\s*club|club|النادي)/i.test(norm);

    if (asksSOP) {
      const sop = m.sop || { r1: 91.0, r2: 88.0, r3: 84.4, r4: 80.4, r5: 57.8, r6: 77.4, target: 93.0 };
      if (promptLang === 'ar') {
        return {
          text: `موقف الـ SOP وجولات المتابعة في Big Team 01 (التارجت الإداري: ${sop.target}%):\n` +
            `• R1 (ترحيب بالطالب الجديد): ${sop.r1}%\n` +
            `• R2 (متابعة أول أسبوع): ${sop.r2}%\n` +
            `• R3 (تقييم المستوى الأكاديمي): ${sop.r3}%\n` +
            `• R4 (مكالمة نص الكورس): ${sop.r4}%\n` +
            `• R5 (متابعة الاستهلاك الضعيف): ${sop.r5}% (دي واقعة شوية ومحتاجة تركيز!)\n` +
            `• R6 (تمهيد التجديد المبكر M2): ${sop.r6}%.\n` +
            `لازم نشد في جولة R5 علشان نصحي الطلاب الكسلانين!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组 SOP 合规追踪 (考核标准: ${sop.target}%)：\n` +
            `• R1 (首次破冰与迎新触达): ${sop.r1}%\n` +
            `• R2 (首周学习习惯跟进): ${sop.r2}%\n` +
            `• R3 (阶段学情测评反馈): ${sop.r3}%\n` +
            `• R4 (月中课程进度盘点): ${sop.r4}%\n` +
            `• R5 (消课偏低激活 - 重点提升): ${sop.r5}%\n` +
            `• R6 (提续前瞻沟通与锁单): ${sop.r6}%。\n` +
            `请各小组主管重点抓紧 R5 环节沟通，严防学员流失！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 SOP Compliance Scorecard (Target: ${sop.target}%):\n` +
          `• R1 (Welcome & Orientation): ${sop.r1}%\n` +
          `• R2 (First-Week Check-in): ${sop.r2}%\n` +
          `• R3 (Academic Progress Review): ${sop.r3}%\n` +
          `• R4 (Mid-Plan Consultation): ${sop.r4}%\n` +
          `• R5 (Low-Usage Intervention): ${sop.r5}% (Requires Attention)\n` +
          `• R6 (Pre-Renewal & Upgrade Prep): ${sop.r6}%.\n` +
          `Immediate focus needed on R5 to drive student engagement.`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 12]: ENGLISH CLUB ATTENDANCE & CONVERSION
    // =========================================================================
    const asksEnglishClub = /(?:english\s*club|club|ec|النادي|نادي|النادي الانجليزي|النادي الإنجليزي|英语俱乐部|俱乐部)/i.test(norm);

    if (asksEnglishClub) {
      const ec = (m.sop && m.sop.ec) || 31.2;
      const ecTarget = (m.sop && m.sop.ecTarget) || 45.0;
      if (promptLang === 'ar') {
        return {
          text: `أخبار النادي الإنجليزي (English Club) يا ريس:\n` +
            `• نسبة الحضور الحالية: ${ec}%\n` +
            `• التارجت المطلوب من الإدارة: ${ecTarget}%\n` +
            `• العجز اللي لازم نعوضه: +${(ecTarget - ec).toFixed(1)}%\n` +
            `💡 محتاجين نخلي المستشارين يضغطوا على أولياء الأمور قبل يوم الجمعة علشان يحجزوا كلاسات السبت التفاعلية في النادي الإنجليزي!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组英语俱乐部 (English Club) 执行看板：\n` +
            `• 当前学员出勤率: ${ec}%\n` +
            `• 官方目标基准: ${ecTarget}%\n` +
            `• 距离达标缺口: +${(ecTarget - ec).toFixed(1)}%\n` +
            `💡 请各顾问在周五前全力动员家长预约周六互动专场，提升出勤率与平台粘性！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `English Club Attendance Radar for Big Team 01:\n` +
          `• Current Attendance Rate: ${ec}%\n` +
          `• Official Sector Benchmark: ${ecTarget}%\n` +
          `• Gap to Target: +${(ecTarget - ec).toFixed(1)}%\n` +
          `💡 Specialists should actively push parents to book Saturday interactive sessions to strengthen student retention!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 13]: REFUND & ASK-FOR-REFUND RADAR
    // =========================================================================
    const asksRefundGeneral = /(?:refund|cancellation|chargeback|استرداد|مرتجع|استرجاع|الغاء|إلغاء|ريفند|退费|退款)/i.test(norm);

    if (asksRefundGeneral) {
      const ref = m.refunds || { total: 2403, cases: [] };
      if (promptLang === 'ar') {
        return {
          text: `رادار الريفند والاسترجاعات في Big Team 01 يا فندم:\n` +
            `• إجمالي الخصومات المسجلة: ${formatMoney(ref.total, 'ar')}\n` +
            `• الحالات: نهى يسري ($1,383 دولار) وخالد غنيم ($1,020 دولار).\n` +
            `• باقي المستشارين الـ 17 سجلهم أبيض 100% ومفيش عليهم ولا سنت ريفند!\n` +
            '💡 خد بالك الكاش المعروض في الداشبورد صافي (Net Cash) ومخصوم منه مبالغ الريفند دي علشان الحسابات تكون مظبوطة بالمللي.',
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组退费与风控监控：\n` +
            `• 累计已扣除退费总额: ${formatMoney(ref.total, 'zh')}\n` +
            `• 涉及案例数: ${ref.cases.length} 笔\n` +
            (ref.cases.length > 0 ? `• 涉及顾问: ${ref.cases.map(c => `${c.rep} (${formatMoney(c.amount, 'zh')})`).join('、 ')}。\n` : '') +
            '💡 看板所显示的业绩数据均为扣除退费后的净实收 (Net Cash)，确保财务精准。\n',
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 Refund & Chargeback Radar:\n` +
          `• Total Deductions MTD: ${formatMoney(ref.total)}\n` +
          `• Active Refund Cases: ${ref.cases.length} cases\n` +
          (ref.cases.length > 0 ? `• Detail: ${ref.cases.map(c => `${c.rep} (${formatMoney(c.amount)})`).join(', ')}.\n` : '') +
          '💡 All cash telemetry displayed across the dashboard represents Net Cash after deducting refunds.',
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 14]: UPGRADE M2 / 20% MILESTONE
    // =========================================================================
    const asksUpgrade = /(?:20%|upgrade|renewals?|m2|تجديد|ترقية|ترقيات|مبكر|20 بالمية|20 بالميه|20 في المية|ام تو|تجديدات|提续|续费|升级)/i.test(norm);

    if (asksUpgrade) {
      if (promptLang === 'ar') {
        return {
          text: `موقف مبادرة ترقيات الـ M2 وتارجت الـ 20% يا باشا:\n` +
            `• نسبة التحويل الحالية: ${s.renewalRate.toFixed(1)}% (قفلنا ${s.totalRenewals} عقد من أصل ${s.totalBase} طالب في البيز)\n` +
            `• عشان نحقق تارجت الـ 20%: المفروض نقفل 88 عقد تجديد في القطاع\n` +
            `• اللي ناقصنا بالظبط: 73 عقد تجديد\n` +
            `💡 الفرصة الذهبية: نركز اتصالاتنا على الطلاب اللي فاضل معاهم أقل من 10 حصص وندخل عليهم بعرض الـ 150 حصة السنوي!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `20% 提续加速专项战报 (Early Upgrade Hub)：\n` +
            `• 提续目标进度: ${s.renewalRate.toFixed(1)}% (已完成 ${s.totalRenewals} 单 / 目标在读池 ${s.totalBase} 人)\n` +
            `• 达成20%全员指标需完成: 88 单续费\n` +
            `• 剩余待转化缺口: 73 单\n` +
            `💡 请重点跟进在读课时 < 10 节的高意向学员，优先推介 150 课时高价值包！\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Early Upgrade (M2) 20% Milestone Status:\n` +
          `• Current Conversion: ${s.renewalRate.toFixed(1)}% (${s.totalRenewals} closed from base of ${s.totalBase} students)\n` +
          `• Target 20% Volume: 88 renewal deals required\n` +
          `• Remaining Needed: 73 deals to hit milestone\n` +
          `💡 Priority Action: Focus outreach on students with <10 classes remaining with the 150-class annual package!`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 15]: TODAY'S 3 STRATEGIC MOVES
    // =========================================================================
    const asksStrategy = /(?:strategic|moves|priorities|action\s*plan|خطة|استراتيجية|اولويات|أولويات|3 خطوات|تحركات|الخطة|نعمل ايه النهاردة|ايه الخطة|战略|动作|优先级|重点)/i.test(norm);

    if (asksStrategy) {
      if (promptLang === 'ar') {
        return {
          text: 'توجيهات مديرنا الأول حسين الأعصر — أهم 3 تحركات استراتيجية للنهاردة يا وحش:\n' +
            '1. 👥 عيال الصفر (C0): نكلم فوراً الـ 242 طالب اللي ما حضروش ولا حصة ونحجز لهم أول كلاس علشان نحميهم من التسرب!\n' +
            '2. 🚀 زقة الـ 20% M2: نستهدف الـ 73 عقد تجديد الباقيين، ونركز على باقة الـ 150 حصة السنوية كأفضل قيمة.\n' +
            '3. 📞 نلحق المستشارين المتأخرين: جلسة كوتشينج 1:1 مع إيهاب زكي وخالد غنيم ونهى، ونوصل بنسبة تغطية المكالمات لـ 90%+!',
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: '侯赛因高级经理战略部署 — 今日3大关键战役：\n' +
            '1. 👥 激活 0 课时学员 (C0): 立即触达 242 名未上课学员，锁定首堂体验课，筑牢续费底座！\n' +
            '2. 🚀 攻坚 20% 提续指标 (M2): 全力推进剩余 73 单提续转化，重点推广 150 课时高产值套餐。\n' +
            '3. 📞 提升通话覆盖与帮扶落后: 全员通话覆盖率冲刺 90%+，主管1对1带教落后基准线的顾问。\n',
          lang: 'zh'
        };
      }
      return {
        text: 'Senior Manager Hussein El A\'sar — Top 3 Strategic Moves for Today:\n' +
          '1. 👥 Activate C0 Zero-Class Students: Immediate intervention for 242 inactive students to book lesson #1 and curb churn!\n' +
          '2. 🚀 Accelerate Early Upgrade (M2): Secure 73 renewal orders focused on the flagship 150-class package.\n' +
          '3. 📞 Call Coverage & Laggard Turnaround: Drive call coverage to 90%+ and provide 1-on-1 coaching for reps behind benchmark.',
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 16]: COMMISSION ENGINE
    // =========================================================================
    const asksCommission = /(?:commission|incentive|bonus|عمولة|عموله|حوافز|بونص|مكافأة|مكافاه|كوميشن|الكوميشن|العمولات|提成|奖金|佣金)/i.test(norm);

    if (asksCommission) {
      if (promptLang === 'ar') {
        return {
          text: 'نظام العمولات والبونص المعتمد لرجالة Big Team 01 يا بطل:\n' +
            '• إنجاز أقل من 80%: بياخد نسبة عمولة أساسية من 0.5% لـ 2%\n' +
            '• إنجاز من 80% لـ 99%: بتزيد النسبة لـ 2.5% لـ 3%\n' +
            '• إنجاز من 100% لـ 119%: بتنط لـ 3.5% كاملة\n' +
            '• إنجاز 120% فما فوق: بتاخد أعلى شريحة 4% + بونص التميز للـ Top Stars!\n' +
            '💡 كل ديل بتقفله النهاردة بيقربك للشريحة اللي بعدها وبيزود في جيبك!',
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: '大一组官方提成梯度与激励机制：\n' +
            '• 达成率 < 80%: 基础提成 2%\n' +
            '• 达成率 80% - 99%: 进阶提成 4%\n' +
            '• 达成率 100% - 119%: 丰厚提成 6%\n' +
            '• 达成率 120%+: 顶格提成 8% + 销冠专属奖金！\n' +
            '💡 每多成一单，立即冲刺更高提成档位！\n',
          lang: 'zh'
        };
      }
      return {
        text: 'Official Big Team 01 Sales Commission & Incentive Tiers:\n' +
          '• Attainment < 80%: Base Commission 2%\n' +
          '• Attainment 80% - 99%: Accelerated Tier 4%\n' +
          '• Attainment 100% - 119%: High-Performance Tier 6%\n' +
          '• Attainment 120%+: Elite Tier 8% + Top Performer Bonus!\n' +
          '💡 Every closed deal advances the specialist to the next higher commission bracket!',
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 17]: GREETINGS & SELF INTRODUCTION
    // =========================================================================
    const isGreeting = /^(?:hi|hello|hey|welcome|good\s*morning|good\s*evening|who\s*are\s*you|مرحبا|مرحباً|اهلا|أهلا|سلام|صباح الخير|مساء الخير|من انت|من أنت|ازيك|عامل ايه|ازيك يا توكي|صباح الفل|مساء الورد|你好|您好|早上好|晚上好|你是谁)$/i.test(norm) ||
      /^(?:hi\s*toki|hello\s*toki|مرحبا\s*توكي|اهلا\s*توكي|ازيك\s*توكي|你好\s*toki)$/i.test(norm);

    if (isGreeting) {
      if (promptLang === 'ar') {
        return {
          text: `يا هلا يا حسين يا بطل! 🌟 أنا توكي، مساعدك الذكي في Big Team 01! فريقنا النهاردة مجمع ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%) ومعديين وتيرة اليوم بـ +${(s.achievement - todayBM).toFixed(1)}%. أؤمرني، تحب تراجع إيه النهاردة؟`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `您好，侯赛因经理！🌟 我是 Toki，大一组的专属智能数据与语音副驾！截至今天全组累计入账 ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，领先今日第16天基准线 +${(s.achievement - todayBM).toFixed(1)}%。请问接下来您想了解什么？\n`,
          lang: 'zh'
        };
      }
      return {
        text: `Hello Hussein! 🌟 I'm Toki, your Big Team 01 AI Assistant! Right now our team has achieved ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - todayBM).toFixed(1)}% ahead of Day ${CURRENT_DAY} benchmark. What would you like to check?`,
        lang: 'en'
      };
    }

    // =========================================================================
    // [INTENT 18]: INTELLIGENT EXECUTIVE FALLBACK WITH SUGGESTIONS
    // =========================================================================
    if (promptLang === 'ar') {
      return {
        text: `بص يا باشا، قطاع Big Team 01 جايب لحد النهاردة ${formatMoney(s.totalCash, 'ar')} (${s.achievement.toFixed(1)}%) بإجمالي ${s.totalContracts} ديل مقفول. وفاضل لنا فجوة كاش ${formatMoney(s.totalGap, 'ar')}.\n💡 أسئلة سريعة تقدر تسألهالي:\n1. "أرقام الموظف إيهاب" أو "كاش جوليا" أو "ديلات تيتو"\n2. "بنشمارك بكرة كام ومحتاجين نلم كام؟"\n3. "مين واقع ومين التوب في الفريق؟"\n4. "طلاب الصفر واستهلاك الحصص"\n5. "سعر باقة 150 حصة بكام؟"\n6. "Speak English" أو "说中文"`,
        lang: 'ar'
      };
    }

    if (promptLang === 'zh') {
      return {
        text: `大一组截至第16天累计入账: ${formatMoney(s.totalCash, 'zh')} (${s.achievement.toFixed(1)}%)，全月总成单 ${s.totalContracts} 单。全组业绩缺口为 ${formatMoney(s.totalGap, 'zh')}。\n💡 您可以向我提问：\n1. 查询顾问战报: "Julia业绩" 或 "Ehab战报" 或 "Mohamed Hamed入账"\n2. 基准线与进度: "明天基准线是多少？" 或 "落后顾问有哪些？"\n3. 运营与课消: "课消与0课化学员" 或 "提续进度"\n4. 价格与政策: "官方课包价格体系" 或 "今日3大战略动作"\n5. 语言切换: "speak English" 或 "تكلم عربي"\n`,
        lang: 'zh'
      };
    }

    return {
      text: `Big Team 01 has reached ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%) MTD with ${s.totalContracts} total contracts. Sector cash gap is ${formatMoney(s.totalGap)}.\n💡 Quick questions you can ask me:\n1. "Performance for SCS Julia" or "Ehab Zaky numbers"\n2. "What is tomorrow's benchmark?"\n3. "Class consumption & zero classes"\n4. "Official package rate card"\n5. "Can you speak in Arabic" or "Speak Chinese"`,
      lang: 'en'
    };
  }

  // Export
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
      }
      .toki-modal.hidden { display: none !important; }

      .toki-modal-header {
        padding: 16px 20px;
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-bottom: 1px solid #fde68a;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .toki-header-info { display: flex; align-items: center; gap: 12px; }
      .toki-modal-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 2px solid #f59e0b;
        background: #fef08a;
        object-fit: cover;
      }
      .toki-modal-avatar.toki-speaking {
        animation: tokiBounce 0.5s ease-in-out infinite alternate;
        box-shadow: 0 0 12px #f59e0b;
      }
      .toki-title-box { display: flex; flex-direction: column; }
      .toki-modal-title { font-weight: 800; font-size: 1.05rem; color: #78350f; }
      .toki-modal-sub { font-size: 0.75rem; color: #92400e; font-weight: 600; display: flex; align-items: center; gap: 6px; }
      .toki-status-dot { width: 7px; height: 7px; background: #10b981; border-radius: 50%; }

      .toki-header-actions { display: flex; align-items: center; gap: 6px; }
      .toki-icon-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid rgba(180, 83, 9, 0.2);
        background: #ffffff;
        color: #78350f;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.88rem;
      }
      .toki-icon-btn:hover { background: #fef3c7; border-color: #f59e0b; transform: scale(1.08); }

      .toki-soundwave-bar {
        background: #fffbeb;
        padding: 6px 18px;
        border-bottom: 1px dashed #fde68a;
        display: none;
        align-items: center;
        gap: 6px;
      }
      .toki-soundwave-label { font-size: 0.72rem; font-weight: 700; color: #b45309; margin-right: 4px; }
      .toki-bar {
        width: 3px;
        height: 14px;
        background: #f59e0b;
        border-radius: 2px;
        animation: tokiWave 1s ease-in-out infinite alternate;
      }
      .toki-bar:nth-child(2) { animation-delay: 0.15s; height: 18px; }
      .toki-bar:nth-child(3) { animation-delay: 0.3s; height: 10px; }
      .toki-bar:nth-child(4) { animation-delay: 0.45s; height: 20px; }
      .toki-bar:nth-child(5) { animation-delay: 0.6s; height: 12px; }

      .toki-quick-chips {
        padding: 10px 16px;
        display: flex;
        gap: 8px;
        overflow-x: auto;
        white-space: nowrap;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        scrollbar-width: thin;
      }
      .toki-chip {
        padding: 5px 12px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        color: #334155;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .toki-chip:hover {
        background: #fef3c7;
        border-color: #f59e0b;
        color: #b45309;
        transform: translateY(-2px);
      }

      .toki-chat-body {
        flex: 1;
        padding: 18px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: #ffffff;
        scroll-behavior: smooth;
      }

      .toki-msg {
        display: flex;
        gap: 10px;
        max-width: 88%;
        animation: tokiMsgSlide 0.25s ease-out;
      }
      .toki-msg.assistant { align-self: flex-start; }
      .toki-msg.user { align-self: flex-end; flex-direction: row-reverse; }

      .toki-msg-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1.5px solid #f59e0b;
        background: #fef08a;
        object-fit: cover;
        flex-shrink: 0;
      }

      .toki-msg-bubble {
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 0.85rem;
        line-height: 1.5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        word-break: break-word;
      }
      .toki-msg.assistant .toki-msg-bubble {
        background: #fffbeb;
        color: #1e293b;
        border: 1px solid #fef08a;
        border-bottom-left-radius: 4px;
      }
      .toki-msg.user .toki-msg-bubble {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: #ffffff;
        border-bottom-right-radius: 4px;
      }
      .toki-msg-meta {
        font-size: 0.68rem;
        color: #94a3b8;
        margin-top: 4px;
        font-weight: 500;
      }

      .toki-footer {
        padding: 12px 16px;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toki-mic-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1.5px solid #fde68a;
        background: #fffbeb;
        color: #b45309;
        font-size: 1.15rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .toki-mic-btn:hover { background: #fef08a; transform: scale(1.08); }
      .toki-mic-btn.listening {
        background: #fee2e2;
        border-color: #ef4444;
        color: #b91c1c;
        animation: tokiPulseRed 1.2s infinite;
      }

      .toki-input-box { flex: 1; position: relative; }
      .toki-input {
        width: 100%;
        padding: 9px 14px;
        border-radius: 20px;
        border: 1.5px solid #cbd5e1;
        font-size: 0.85rem;
        color: #1e293b;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
        font-family: inherit;
      }
      .toki-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }

      .toki-send-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #ffffff;
        font-size: 0.95rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .toki-send-btn:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); }

      @keyframes tokiFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @keyframes tokiBounce { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
      @keyframes tokiWave { 0% { height: 6px; } 100% { height: 22px; } }
      @keyframes tokiPulseBubble { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
      @keyframes tokiPulseRed { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 50% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } }
      @keyframes tokiGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      @keyframes tokiModalEntrance { 0% { opacity: 0; transform: translateY(30px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    `;
    document.head.appendChild(style);
  }

  // Get Chips based on language
  function getLocalizedChips(lang) {
    if (lang === 'ar') {
      return `
        <button type="button" class="toki-chip" data-q="بكره محتاجين كام كاش؟">📊 بنشمارك بكرة</button>
        <button type="button" class="toki-chip" data-q="فاضل كام عشان نقفل التارجت؟">💰 فجوة الكاش</button>
        <button type="button" class="toki-chip" data-q="مين واقع في البنشمارك النهاردة؟">⚠️ مين واقع في البنشمارك</button>
        <button type="button" class="toki-chip" data-q="مين التوب ومين الوحوش النهاردة؟">🏆 وحوش الصدارة</button>
        <button type="button" class="toki-chip" data-q="عملنا ايه في الـ M2 والـ 20 بالمية؟">🚀 ترقيات 20%</button>
        <button type="button" class="toki-chip" data-q="سعر باقة 150 حصة بكام؟">💳 أسعار الباقات</button>
        <button type="button" class="toki-chip" data-q="كام طالب صفر حصص في الفريق؟">👥 عيال الصفر</button>
      `;
    }
    if (lang === 'zh') {
      return `
        <button type="button" class="toki-chip" data-q="明天第17天的基准线和目标差额是多少？">📊 明日基准线</button>
        <button type="button" class="toki-chip" data-q="团队还差多少业绩达标？">💰 业绩缺口</button>
        <button type="button" class="toki-chip" data-q="目前有哪些员工落后于基准线？">⚠️ 落后名单</button>
        <button type="button" class="toki-chip" data-q="谁是团队业绩第一名？">🏆 团队销冠榜</button>
        <button type="button" class="toki-chip" data-q="提续M2达成20%里程碑进度如何？">🚀 20%提续进度</button>
        <button type="button" class="toki-chip" data-q="150课时官方价格是多少？">💳 官方课包价格</button>
        <button type="button" class="toki-chip" data-q="0课时高危学员数量与课消进度">👥 0课时学员</button>
      `;
    }
    return `
      <button type="button" class="toki-chip" data-q="What is the benchmark for tomorrow?">📊 Tomorrow BM</button>
      <button type="button" class="toki-chip" data-q="What is our cash gap and daily run rate needed?">💰 Cash Gap</button>
      <button type="button" class="toki-chip" data-q="Who is currently trailing the day 16 curve?">⚠️ Behind BM</button>
      <button type="button" class="toki-chip" data-q="Who are the top performers today?">🏆 Top Stars</button>
      <button type="button" class="toki-chip" data-q="What is our M2 upgrade progress toward 20%?">🚀 20% Upgrade</button>
      <button type="button" class="toki-chip" data-q="What are our rate cards for 150 classes?">💳 Rate Card</button>
      <button type="button" class="toki-chip" data-q="How many students have zero classes?">👥 Zero Classes</button>
    `;
  }

  // Welcome message based on language
  function getLocalizedWelcome(lang) {
    if (lang === 'ar') {
      return {
        title: 'يا هلا بيك يا حسين! أنا توكي 🌟',
        body: 'أنا مساعدك الذكي لقطاع Big Team 01. اسألني عن أداء أي مستشار، بنشمارك بكرة، فجوة الكاش، استهلاك الحصص، أو دوس على أي سؤال سريع فوق!',
        meta: 'دلوقتي • جاهز للمحادثة الصوتية'
      };
    }
    if (lang === 'zh') {
      return {
        title: '您好，侯赛因经理！我是 Toki 🌟',
        body: '我是大一组 (Big Team 01) 的专属智能语音与数据副驾。欢迎询问销售战报、明日基准线、全月缺口、课时消耗，或点击上方快捷问题！',
        meta: '刚刚 • 语音已就绪'
      };
    }
    return {
      title: 'Hello Hussein! I\'m Toki! 🌟',
      body: 'I\'m your Big Team 01 AI voice & performance assistant. Ask me anything about our sales reps, tomorrow\'s benchmark, cash gaps, or tap a quick question above!',
      meta: 'Just now • Voice Ready'
    };
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

    const welcome = getLocalizedWelcome(activeLang);

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
            <strong>${welcome.title}</strong><br>
            ${welcome.body}
            <div class="toki-msg-meta">${welcome.meta}</div>
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
    setTokiLanguage(activeLang);
  }

  // Update Toki UI for current language
  function setTokiLanguage(lang) {
    activeLang = lang;
    try { localStorage.setItem('bt01_lang', lang); } catch (e) {}

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
    const soundwaveLabel = document.getElementById('tokiSoundwaveLabel');

    if (lang === 'ar') {
      if (titleEl) titleEl.textContent = 'المساعد الذكي توكي';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> المساعد الصوتي لقطاع Big Team 01';
      if (inputEl) inputEl.placeholder = 'اسأل توكي عن أداء أي مستشار أو باقة...';
      if (bubbleText) bubbleText.textContent = '👋 مرحباً، أنا توكي!';
      if (bubbleSub) bubbleSub.textContent = 'مساعدك الذكي • اسألني';
      if (soundwaveLabel) soundwaveLabel.textContent = 'توكي يتحدث الآن...';
    } else if (lang === 'zh') {
      if (titleEl) titleEl.textContent = 'Toki 智能副驾';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> 大一组语音与数据副驾';
      if (inputEl) inputEl.placeholder = '向 Toki 询问销售战报、基准线或课包价格...';
      if (bubbleText) bubbleText.textContent = '👋 你好，我是 Toki！';
      if (bubbleSub) bubbleSub.textContent = 'AI 副驾 • 随时提问';
      if (soundwaveLabel) soundwaveLabel.textContent = 'Toki 正在播报...';
    } else {
      if (titleEl) titleEl.textContent = 'Toki AI Copilot';
      if (subEl) subEl.innerHTML = '<span class="toki-status-dot"></span> Big Team 01 Voice Assistant';
      if (inputEl) inputEl.placeholder = 'Ask Toki a question...';
      if (bubbleText) bubbleText.textContent = "👋 Hello, I'm Toki!";
      if (bubbleSub) bubbleSub.textContent = 'AI Copilot • Ask me';
      if (soundwaveLabel) soundwaveLabel.textContent = 'Toki is speaking...';
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

    const promptLang = TokiUniversalEngine.detectLanguage(q, activeLang);
    appendMessage('user', q, promptLang);

    const input = document.getElementById('tokiTextInput');
    if (input) input.value = '';

    const res = getTokiAnswer(q);

    // If query was an explicit language switch, sync entire dashboard & assistant language
    if (res.switchLang) {
      setTokiLanguage(res.switchLang);
      if (typeof window.setDashboardLanguage === 'function') {
        window.setDashboardLanguage(res.switchLang);
      }
    }

    setTimeout(() => {
      appendMessage('assistant', res.text, res.lang);
      speak(res.text, res.lang);
    }, 250);
  }

  // Speech Recognition
  function initSpeechRecognition() {
    const SpeechRec = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
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

  function toggleListening(e) {
    if (e) e.stopPropagation();
    if (isListening) stopListening();
    else startListening();
  }

  // Attach Event Handlers
  function attachTokiEvents() {
    const widget = document.getElementById('tokiFloatingWidget');
    const modal = document.getElementById('tokiModal');
    const closeBtn = document.getElementById('tokiCloseBtn');
    const clearBtn = document.getElementById('tokiClearChat');
    const soundToggle = document.getElementById('tokiSoundToggle');
    const micBtn = document.getElementById('tokiMicBtn');
    const sendBtn = document.getElementById('tokiSendBtn');
    const input = document.getElementById('tokiTextInput');

    if (widget && modal) {
      widget.onclick = () => {
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) {
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
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildTokiElements);
    } else {
      buildTokiElements();
    }
  }

})();
