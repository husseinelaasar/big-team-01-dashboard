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
  // DEEP DOMAIN KNOWLEDGE ENGINE
  // =========================================================================
  function getTokiAnswer(query) {
    const q = (query || '').toLowerCase().trim();
    const promptLang = detectPromptLanguage(query);
    const m = window.__model;

    if (!m) {
      if (promptLang === 'ar') return { text: "أقوم الآن بتحميل أحدث بيانات قطاع Big Team 01، يرجى إعادة المحاولة بعد ثانية واحدة!", lang: 'ar' };
      if (promptLang === 'zh') return { text: "我正在加载大一组的最新业务数据，请稍等一秒后再试！", lang: 'zh' };
      return { text: "I'm currently loading the latest Big Team 01 live data. Please give me one second and ask again!", lang: 'en' };
    }

    const s = m.summary;
    const todayBM = OFFICIAL_PACING[CURRENT_DAY] || 41;
    const tomorrowBM = OFFICIAL_PACING[CURRENT_DAY + 1] || 43;
    const todayExpCash = Math.round(s.totalTarget * (todayBM / 100));
    const tomorrowExpCash = Math.round(s.totalTarget * (tomorrowBM / 100));
    const tomorrowCashNeeded = Math.max(0, tomorrowExpCash - s.totalCash);

    // 1. TOMORROW'S BENCHMARK (Exact Match)
    if (q.includes('tomorrow') || q.includes('next day') || q.includes('غد') || q.includes('بكره') || q.includes('بكرة') || q.includes('غدا') || q.includes('明天') || q.includes('次日') || q.includes('第17天') || q.includes('day 17')) {
      if (promptLang === 'ar') {
        return {
          text: `غداً هو اليوم 17 من شهر نوفمبر. بنشمارك الغد هو ${tomorrowBM}% من الهدف الإجمالي، أي ما يعادل ${formatMoney(tomorrowExpCash)}. ` +
            `وحيث أن الفريق حقق حالياً ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)، فإننا نحتاج فقط إلى ${formatMoney(tomorrowCashNeeded)} كاش إضافي غداً لتخطي بنشمارك اليوم 17 بنجاح!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `明天是11月第17天。明天（第17天）的官方基准线是总目标的 ${tomorrowBM}%，对应业绩金额为 ${formatMoney(tomorrowExpCash)}。 ` +
            `目前大一组累计业绩为 ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)，明天全组仅需新增入账 ${formatMoney(tomorrowCashNeeded)} 即可稳稳达标并超越第17天的基准线！`,
          lang: 'zh'
        };
      }
      return {
        text: `Tomorrow is Day 17 of November. The official benchmark pace for Day 17 is ${tomorrowBM}% of total target, which equals ${formatMoney(tomorrowExpCash)}. ` +
          `Big Team 01 is currently at ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), meaning we need only ${formatMoney(tomorrowCashNeeded)} in additional cash closing tomorrow to secure and beat the Day 17 benchmark!`,
        lang: 'en'
      };
    }

    // 2. TODAY'S BENCHMARK
    if ((q.includes('today') || q.includes('current') || q.includes('اليوم') || q.includes('النهارده') || q.includes('今天') || q.includes('当前') || q.includes('day 16')) && (q.includes('bm') || q.includes('benchmark') || q.includes('بنشمارك') || q.includes('وتيرة') || q.includes('基准') || q.includes('进度'))) {
      const aheadPct = (s.achievement - todayBM).toFixed(1);
      if (promptLang === 'ar') {
        return {
          text: `بنشمارك اليوم 16 هو ${todayBM}% من الهدف الإجمالي (${formatMoney(todayExpCash)}). ` +
            `الفريق متقدم حالياً بإنجاز ${s.achievement.toFixed(1)}% (${formatMoney(s.totalCash)})، متفوقاً على بنشمارك اليوم بفارق +${aheadPct}%!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `今天（第16天）的官方基准线是 ${todayBM}% (${formatMoney(todayExpCash)})。 ` +
            `目前大一组累计达成 ${s.achievement.toFixed(1)}% (${formatMoney(s.totalCash)})，超越今日基准线 +${aheadPct}%，整体进度保持领先！`,
          lang: 'zh'
        };
      }
      return {
        text: `Today's Day 16 benchmark is ${todayBM}% of target (${formatMoney(todayExpCash)}). ` +
          `Big Team 01 is pacing ahead at ${s.achievement.toFixed(1)}% (${formatMoney(s.totalCash)}), leading the benchmark pace by +${aheadPct}%!`,
        lang: 'en'
      };
    }

    // 3. SPECIFIC DAY BENCHMARK (e.g. Day 20, Day 25, Day 30)
    const dayMatch = q.match(/day\s*(\d+)|يوم\s*(\d+)|第\s*(\d+)\s*天/i);
    if (dayMatch && (q.includes('bm') || q.includes('benchmark') || q.includes('بنشمارك') || q.includes('基准'))) {
      const targetDay = parseInt(dayMatch[1] || dayMatch[2] || dayMatch[3], 10);
      if (OFFICIAL_PACING[targetDay]) {
        const pct = OFFICIAL_PACING[targetDay];
        const cash = Math.round(s.totalTarget * (pct / 100));
        if (promptLang === 'ar') return { text: `بنشمارك اليوم ${targetDay} هو ${pct}% (${formatMoney(cash)}).`, lang: 'ar' };
        if (promptLang === 'zh') return { text: `第 ${targetDay} 天的官方基准线为 ${pct}% (${formatMoney(cash)})。`, lang: 'zh' };
        return { text: `The benchmark pace for Day ${targetDay} is ${pct}% of total target, which equals ${formatMoney(cash)}.`, lang: 'en' };
      }
    }

    // 4. INDIVIDUAL SALES SPECIALIST LOOKUP (All 18 Reps)
    const repAliases = {
      'samira': ['samira', 'سميرة', 'سميره'],
      'abdelrahmannasef': ['nasef', 'abdelrahmannasef', 'ناصف', 'عبدالرحمن ناصف'],
      'ibrahimismaiel': ['ibrahim', 'ismaiel', 'abdelshakour', 'ابراهيم', 'إبراهيم', 'عبد الشكور'],
      'khaledgonam': ['khaled', 'gonam', 'خالد', 'غنيم'],
      'omarmoneb': ['omar', 'moneb', 'عمر', 'منيب'],
      'alihesham': ['ali', 'hesham', 'علي', 'هشام'],
      'ashraqat': ['ashraqat', 'إشراقت', 'اشراقت'],
      'juliamonir': ['julia', 'monir', 'جوليا', 'منير'],
      'nohayoussry': ['noha', 'youssry', 'نهى', 'يسري'],
      'mahmoud04': ['mahmoud04', 'محمود 04', 'محمود04'],
      'marwaahmed': ['marwa', 'مروة', 'مروه'],
      'amrsafwat': ['amr', 'safwat', 'عمرو', 'صفوت'],
      'mohamedha': ['mohamedha', 'hamed', 'حامد', 'محمد حامد'],
      'ahmedshoukry': ['shoukry', 'ahmedshoukry', 'شكري', 'احمد شكري'],
      'mahmoudkhamis': ['khamis', 'خميس', 'محمود خميس'],
      'abdelrhmanshehata': ['shehata', 'شحاتة', 'شحاته', 'عبدالرحمن شحاتة'],
      'hayamhassan': ['hayam', 'هيام', 'هيام حسن'],
      'tito': ['tito', 'تيتو']
    };

    for (const r of m.individuals) {
      const lowerRName = r.name.toLowerCase();
      let matched = false;

      for (const [key, aliases] of Object.entries(repAliases)) {
        if (lowerRName.includes(key)) {
          if (aliases.some(alias => q.includes(alias))) {
            matched = true;
            break;
          }
        }
      }

      if (matched || q.includes(lowerRName.replace(/^(me-|egss\d+-)/i, ''))) {
        const cleanName = r.name.replace(/^(ME-|EGSS\d+-)/i, '');
        const isAhead = r.achievement >= todayBM;
        const gap = Math.max(0, r.target - r.cash);

        if (promptLang === 'ar') {
          return {
            text: `تقرير المستشار ${cleanName} (${r.team}): ` +
              `حقق ${formatMoney(r.cash)} بنسبة إنجاز ${r.achievement.toFixed(1)}% من هدف ${formatMoney(r.target)}. ` +
              `أغلق ${r.contracts} صفقات، وقاعدة التجديد لديه ${r.upgradeBase} حساباً (منها ${r.upgradeM2} تجديدات M2)، ومعدل تغطية الاتصال ${r.coverRate.toFixed(1)}%. ` +
              (isAhead ? `وهو متقدم على بنشمارك اليوم (${todayBM}%)!` : `وهو متأخر حالياً عن بنشمارك اليوم (${todayBM}%) بفارق ${formatMoney(gap)}.`),
            lang: 'ar'
          };
        }
        if (promptLang === 'zh') {
          return {
            text: `销售顾问 ${cleanName} (${r.team}) 表现战报: ` +
              `累计业绩 ${formatMoney(r.cash)}，达成率 ${r.achievement.toFixed(1)}%（目标: ${formatMoney(r.target)}）。 ` +
              `累计成单 ${r.contracts} 单，在读提续池 ${r.upgradeBase} 人（其中 M2 提续 ${r.upgradeM2} 单），通话覆盖率 ${r.coverRate.toFixed(1)}%。 ` +
              (isAhead ? `当前进度领先今日基准线 (${todayBM}%)！` : `当前落后今日基准线 (${todayBM}%)，差额为 ${formatMoney(gap)}。`),
            lang: 'zh'
          };
        }
        return {
          text: `Specialist ${cleanName} (${r.team}) performance status: ` +
            `Achieved ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%) against target ${formatMoney(r.target)}. ` +
            `Closed ${r.contracts} contracts, Upgrade Base is ${r.upgradeBase} (with ${r.upgradeM2} M2 upgrades), and Call Cover rate is ${r.coverRate.toFixed(1)}%. ` +
            (isAhead ? `Currently pacing ahead of today's ${todayBM}% benchmark!` : `Currently behind today's ${todayBM}% benchmark by ${formatMoney(gap)}.`),
          lang: 'en'
        };
      }
    }

    // 5. CASH GAP, RUN RATE & TARGET
    if (q.includes('gap') || q.includes('needed') || q.includes('run rate') || q.includes('velocity') || q.includes('فجوة') || q.includes('عجز') || q.includes('معدل') || q.includes('نحتاج') || q.includes('缺口') || q.includes('速度') || q.includes('还需要')) {
      if (promptLang === 'ar') {
        return {
          text: `إجمالي الفجوة المالية للهدف حتى نهاية الشهر هي ${formatMoney(s.totalGap)} (من إجمالي هدف ${formatMoney(s.totalTarget)}). ` +
            `ولتحقيق نسبة 100%، يحتاج قطاع Big Team 01 إلى معدل إغلاق يومي يبلغ ${formatMoney(s.dailyNeeded)} يومياً خلال الـ 14 يوماً المتبقية.`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组目前距离全月100%目标的总业绩缺口为 ${formatMoney(s.totalGap)}（总目标: ${formatMoney(s.totalTarget)}）。 ` +
            `在剩余的14天冲刺期内，全组需要保持每天 ${formatMoney(s.dailyNeeded)} 的入账速度，即可确保100%达成全月总目标！`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 has a total cash gap of ${formatMoney(s.totalGap)} against our ${formatMoney(s.totalTarget)} target. ` +
          `To achieve 100% by Day 30, the sector requires a daily closing velocity of ${formatMoney(s.dailyNeeded)} per day over the remaining 14 days.`,
        lang: 'en'
      };
    }

    // 6. TOP SALES STARS / LEADERS
    if (q.includes('top') || q.includes('star') || q.includes('champion') || q.includes('best') || q.includes('#1') || q.includes('leader') || q.includes('أفضل') || q.includes('اول') || q.includes('أول') || q.includes('نجوم') || q.includes('销冠') || q.includes('第一') || q.includes('前三') || q.includes('优秀')) {
      const top3 = [...m.individuals].sort((a, b) => b.achievement - a.achievement).slice(0, 3);
      if (promptLang === 'ar') {
        return {
          text: `أفضل 3 نجوم مبيعات في القطاع حالياً هم: ` +
            top3.map((r, i) => `#${i + 1} ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} بمبلغ ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join('، ') + `. ` +
            `أداء استثنائي وزخم رائع في إغلاق الباقات المعتمدة!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组当前排名前3的销冠顾问为: ` +
            top3.map((r, i) => `第${i + 1}名 ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (业绩: ${formatMoney(r.cash)}，达成率: ${r.achievement.toFixed(1)}%)`).join('， ') + `。高单价课包续费转化势头强劲！`,
          lang: 'zh'
        };
      }
      return {
        text: `Our top 3 sales stars today are: ` +
          top3.map((r, i) => `#${i + 1} ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} with ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join(', ') + `. Outstanding sales momentum across VIP packages!`,
        lang: 'en'
      };
    }

    // 7. REPS BEHIND BENCHMARK
    if (q.includes('behind') || q.includes('lagging') || q.includes('slow') || q.includes('danger') || q.includes('risk') || q.includes('متأخر') || q.includes('متأخرين') || q.includes('ضعيف') || q.includes('خطر') || q.includes('落后') || q.includes('落后人员') || q.includes('预警')) {
      const behind = m.individuals.filter(r => r.achievement < todayBM);
      const names = behind.slice(0, 5).map(r => `${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (${r.achievement.toFixed(1)}%)`).join(', ');
      if (promptLang === 'ar') {
        return {
          text: `يوجد حالياً ${behind.length} مستشاراً متأخرين عن بنشمارك اليوم (${todayBM}%). ` +
            `أبرز الأسماء التي تحتاج تدخلاً وتوجيهاً عاجلاً: ${names}. يوصى بمراجعة مكالمات التجديد الصباحية مع قادة الفرق.`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `目前共有 ${behind.length} 位销售顾问落后于今日基准线 (${todayBM}%)。 ` +
            `重点需关注辅导人员包括: ${names}。建议组长在早会与1对1对齐中深入排查续费通话与商机池！`,
          lang: 'zh'
        };
      }
      return {
        text: `Currently, ${behind.length} specialists are pacing below today's ${todayBM}% benchmark. ` +
          `Key priorities for coaching: ${names}. Morning 1-on-1 renewal alignment is recommended with their team leaders.`,
        lang: 'en'
      };
    }

    // 8. ZERO CASH REPS
    if (q.includes('zero') || q.includes('no cash') || q.includes('0 cash') || q.includes('صفر') || q.includes('لم يغلق') || q.includes('零业绩') || q.includes('0业绩')) {
      const zeroReps = m.individuals.filter(r => r.cash === 0);
      if (zeroReps.length === 0) {
        if (promptLang === 'ar') return { text: "خبر ممتاز! لا يوجد أي مستشار بصفر كاش في القطاع، جميع الـ 18 مستشاراً حققوا إيرادات!", lang: 'ar' };
        if (promptLang === 'zh') return { text: "极佳的消息！目前大一组没有零业绩销售，全员18名顾问均已破蛋成单！", lang: 'zh' };
        return { text: "Great news! There are zero specialists at 0 cash — all 18 specialists in Big Team 01 have closed revenue!", lang: 'en' };
      }
      const names = zeroReps.map(r => r.name.replace(/^(ME-|EGSS\d+-)/i, '')).join(', ');
      if (promptLang === 'ar') return { text: `يوجد ${zeroReps.length} مستشارين بصفر كاش حالياً: ${names}. يجب متابعتهم فوراً لتفعيل محافظهم.`, lang: 'ar' };
      if (promptLang === 'zh') return { text: `目前有 ${zeroReps.length} 名顾问仍为零业绩: ${names}，需紧急激活商机！`, lang: 'zh' };
      return { text: `There are ${zeroReps.length} specialists at zero cash MTD: ${names}. Urgent pipeline activation is required.`, lang: 'en' };
    }

    // 9. UPGRADE M2 / 20% MILESTONE
    if (q.includes('upgrade') || q.includes('m2') || q.includes('20%') || q.includes('ترقية') || q.includes('تجديد مبكر') || q.includes('提续') || q.includes('提续M2')) {
      if (promptLang === 'ar') {
        return {
          text: `حقق قطاع Big Team 01 عدد ${s.totalUpgradeM2} تجديدات ترقية M2 حتى الآن، باتجاه هدف الـ 20% البالغ ${s.totalUpgrade20Target} ترقية. ` +
            `نحتاج إلى ${s.totalUpgrade20Needed} ترقية إضافية لتأمين حافز فئة الـ 20%. التركيز يجب أن ينصب على الطلاب الذين تبقى لديهم أقل من 10 حصص.`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `大一组目前已成交 ${s.totalUpgradeM2} 单提续 M2 续费单，正在冲刺20%目标阶段（目标: ${s.totalUpgrade20Target}单）。 ` +
            `距达成20%激励里程碑还需 ${s.totalUpgrade20Needed} 单提续。重点攻坚剩余课时少于10节的高意向学员！`,
          lang: 'zh'
        };
      }
      return {
        text: `Big Team 01 has closed ${s.totalUpgradeM2} Upgrade M2 renewals toward our 20% milestone target of ${s.totalUpgrade20Target}. ` +
          `We need ${s.totalUpgrade20Needed} additional upgrades to secure the 20% incentive milestone. Focus on students with fewer than 10 remaining classes.`,
        lang: 'en'
      };
    }

    // 10. TODAY'S 3 STRATEGIC MOVES
    if (q.includes('move') || q.includes('moves') || q.includes('plan') || q.includes('strategy') || q.includes('خطة') || q.includes('تحركات') || q.includes('استراتيجية') || q.includes('行动计划') || q.includes('策略')) {
      if (promptLang === 'ar') {
        return {
          text: `التحركات الاستراتيجية الثلاثة لليوم هي: ` +
            `1. تحقيق ${formatMoney(s.dailyNeeded)} كاش إغلاق يومي لحماية وتيرة البنشمارك. ` +
            `2. جلسات توجيه وتدريب فردية مع الـ 7 مستشارين المتأخرين عن 41%. ` +
            `3. استهداف أولياء الأمور الذين لديهم أقل من 10 حصص متبقية لتحويلهم إلى عقود ترقية M2.`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `今日管理层三大战略行动为: ` +
            `第1项: 全组全力达成今日 ${formatMoney(s.dailyNeeded)} 业绩速度以守擂基准线； ` +
            `第2项: 对进度低于41%的7位顾问开展1对1精准跟进； ` +
            `第3项: 重点突破剩余不足10课时在读生，加速锁定M2高客单提续！`,
          lang: 'zh'
        };
      }
      return {
        text: `Today's 3 operational priorities are: ` +
          `Move 1: Hit ${formatMoney(s.dailyNeeded)} daily cash closing to defend benchmark pace. ` +
          `Move 2: Conduct coaching sprints with the 7 reps pacing below 41%. ` +
          `Move 3: Target renewal students with fewer than 10 remaining classes to accelerate M2 upgrade conversions.`,
        lang: 'en'
      };
    }

    // 11. SMALL TEAMS STANDINGS
    if (q.includes('team') || q.includes('pod') || q.includes('فرق') || q.includes('فريق') || q.includes('小组') || q.includes('战队')) {
      const sortedTeams = Object.values(m.teams).sort((a, b) => b.achievement - a.achievement);
      if (promptLang === 'ar') {
        return {
          text: `ترتيب الفرق المصغرة الخمسة اليوم: ` +
            sortedTeams.map((t, idx) => `#${idx + 1} ${t.label} (إنجاز: ${t.achievement.toFixed(1)}% بمبلغ ${formatMoney(t.cash)})`).join('، ') + `.` +
            ` يقود الترتيب فريق ${sortedTeams[0].label}!`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `今日5个业务小组排名为: ` +
            sortedTeams.map((t, idx) => `第${idx + 1}名 ${t.label} (达成率: ${t.achievement.toFixed(1)}%，业绩: ${formatMoney(t.cash)})`).join('， ') + `。` +
            `由 ${sortedTeams[0].label} 强势领跑！`,
          lang: 'zh'
        };
      }
      return {
        text: `Small Team standings today: ` +
          sortedTeams.map((t, idx) => `#${idx + 1} ${t.label} (${t.achievement.toFixed(1)}% - ${formatMoney(t.cash)})`).join(', ') + `. ` +
          `Leading team: ${sortedTeams[0].label}!`,
        lang: 'en'
      };
    }

    // 12. GREETINGS & SELF INTRODUCTION
    if (q.includes('hi') || q.includes('hello') || q.includes('toki') || q.includes('who are you') || q.includes('مرحبا') || q.includes('اهلا') || q.includes('السلام') || q.includes('مين انت') || q.includes('你好') || q.includes('你是谁')) {
      if (promptLang === 'ar') {
        return {
          text: `مرحباً يا حسين! أنا توكي (Toki)، المساعد الصوتي والبياني الذكي لقطاع Big Team 01! ` +
            `حقق فريقنا حتى اليوم ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)، متقدماً على بنشمارك اليوم 16 بفارق +${(s.achievement - todayBM).toFixed(1)}%. ماذا تود أن تعرف؟`,
          lang: 'ar'
        };
      }
      if (promptLang === 'zh') {
        return {
          text: `您好，侯赛因经理！我是 Toki，大一组的专属 AI 语音与数据副驾！` +
            `截至今天全组累计入账 ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)，领先今日基准线 +${(s.achievement - todayBM).toFixed(1)}%。请问您需要了解哪项业务指标？`,
          lang: 'zh'
        };
      }
      return {
        text: `Hello Hussein! I'm Toki, your Big Team 01 AI assistant! ` +
          `Right now our team has achieved ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - todayBM).toFixed(1)}% ahead of Day 16 benchmark. What would you like to check?`,
        lang: 'en'
      };
    }

    // 13. GENERAL FALLBACK (Clear & Contextual)
    if (promptLang === 'ar') {
      return {
        text: `قطاع Big Team 01 حقق ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%) حتى اليوم 16، متقدماً على البنشمارك مع ${s.totalContracts} عقداً مغلقاً. ` +
          `الفجوة الإجمالية للهدف هي ${formatMoney(s.totalGap)}. يمكنك سؤالي عن بنشمارك الغد، الفجوة المالية، أو أداء أي مستشار مبيعات بالاسم!`,
        lang: 'ar'
      };
    }
    if (promptLang === 'zh') {
      return {
        text: `大一组目前第16天累计业绩为 ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)，成单 ${s.totalContracts} 单，总差额为 ${formatMoney(s.totalGap)}。 ` +
          `您可以随时向我询问明日基准线、现金缺口、销售个人数据或小组排名！`,
        lang: 'zh'
      };
    }
    return {
      text: `Big Team 01 has reached ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%) MTD with ${s.totalContracts} total contracts. ` +
        `Total gap to target is ${formatMoney(s.totalGap)}. Feel free to ask about tomorrow's benchmark, cash gap, or any specific sales rep!`,
      lang: 'en'
    };
  }

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
