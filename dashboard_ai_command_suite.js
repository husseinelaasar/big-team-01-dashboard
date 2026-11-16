/**
 * Big Team 01 — AI Command Suite & Executive Voice Cockpit
 * Inspired by OCTOPUS Command Engine with Light Theme Native Styling
 * Features:
 *   1. Dual Currency Switcher (USD $ ⇄ SAR ر.س) at fixed 3.75 rate
 *   2. Voice AI Synthesis Engine (Web Speech API) with Executive Spoken Briefings
 *   3. Ask Big Team 01 Command Palette (Ctrl + K) with instant fuzzy search & filters
 *   4. Date Time-Travel Simulator Slider (Day 1 - 30 Pacing & Gap Simulation)
 *   5. Tactical Action Filter Pills (Behind BM, Zero Cash, 5+ No Deal, 100%+, Pods)
 *   6. Automated Bilingual Daily Action Plan (Top 3 Moves, Backlog, DingTalk copy)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & STATE
  // =========================================================================
  const SAR_EXCHANGE_RATE = 3.75;
  let activeCurrency = localStorage.getItem('bt01_currency') || 'USD';
  let activeSimulationDay = 16; // Live Day
  const LIVE_MTD_DAY = 16;
  let activeActionPill = 'all';
  let dailyPlanLang = 'ar'; // 'ar' or 'en'

  const OFFICIAL_PACING = {
    1: 5,   2: 8,   3: 11,  4: 14,  5: 17,
    6: 20,  7: 23,  8: 24,  9: 25,  10: 26,
    11: 29, 12: 32, 13: 35, 14: 38, 15: 40,
    16: 41, 17: 43, 18: 46, 19: 49, 20: 51,
    21: 54, 22: 56, 23: 57, 24: 58, 25: 60,
    26: 64, 27: 76, 28: 83, 29: 90, 30: 96,
    31: 102
  };

  // =========================================================================
  // 2. CURRENCY ENGINE (USD ⇄ SAR)
  // =========================================================================
  function formatMoney(amountUSD) {
    if (amountUSD === null || amountUSD === undefined || isNaN(amountUSD)) {
      return activeCurrency === 'SAR' ? '0 ر.س' : '$0';
    }
    if (activeCurrency === 'SAR') {
      const sar = Math.round(amountUSD * SAR_EXCHANGE_RATE);
      return sar.toLocaleString('en-US') + ' ر.س';
    }
    return '$' + Math.round(amountUSD).toLocaleString('en-US');
  }

  function setDashboardCurrency(curr) {
    activeCurrency = curr;
    try { localStorage.setItem('bt01_currency', curr); } catch (e) {}
    updateCurrencyButtons();
    // Expose formatMoney globally for dashboard.js
    window.fmtCurr = formatMoney;
    window.__activeCurrency = curr;
    
    // Refresh main dashboard model if loaded
    if (window.__model) {
      if (typeof window.renderKPIs === 'function') window.renderKPIs(window.__model);
      if (typeof window.renderOverviewTable === 'function') window.renderOverviewTable(window.__model);
      if (typeof window.renderSmallTeamsTab === 'function') window.renderSmallTeamsTab(window.__model);
      if (typeof window.renderIndividualsTab === 'function') window.renderIndividualsTab(window.__model);
      if (typeof window.renderBigTeamSummary === 'function') window.renderBigTeamSummary(window.__model);
    }
    // Update Daily Plan if rendered
    renderDailyActionPlan();
  }

  function updateCurrencyButtons() {
    const btnUSD = document.getElementById('btnCurrUSD');
    const btnSAR = document.getElementById('btnCurrSAR');
    if (btnUSD && btnSAR) {
      if (activeCurrency === 'SAR') {
        btnSAR.classList.add('active');
        btnUSD.classList.remove('active');
      } else {
        btnUSD.classList.add('active');
        btnSAR.classList.remove('active');
      }
    }
  }

  window.setDashboardCurrency = setDashboardCurrency;
  window.fmtCurr = formatMoney;

  // =========================================================================
  // 3. AI VOICE SYNTHESIS ENGINE (WEB SPEECH API)
  // =========================================================================
  const VoiceEngine = {
    isSpeaking: false,
    synth: window.speechSynthesis || null,
    currentUtterance: null,

    speak(text, lang = 'ar') {
      if (!this.synth) {
        console.warn('SpeechSynthesis API not supported in this browser.');
        alert('ميزة القراءة الصوتية غير مدعومة في هذا المتصفح. يرجى استخدام Google Chrome أو Microsoft Edge.');
        return;
      }
      this.stop();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      utter.pitch = 1.0;

      // Select Voice
      const voices = this.synth.getVoices();
      if (lang === 'ar') {
        const arVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Hoda') || v.name.includes('Naayf'));
        if (arVoice) utter.voice = arVoice;
        utter.lang = 'ar-SA';
      } else {
        const enVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy')))) || voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utter.voice = enVoice;
        utter.lang = 'en-US';
      }

      utter.onstart = () => {
        this.isSpeaking = true;
        document.body.classList.add('ai-voice-active');
        updateVoiceIcons(true);
      };

      utter.onend = () => {
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceIcons(false);
      };

      utter.onerror = () => {
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceIcons(false);
      };

      this.currentUtterance = utter;
      this.synth.speak(utter);
    },

    stop() {
      if (this.synth) {
        this.synth.cancel();
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceIcons(false);
      }
    }
  };

  function updateVoiceIcons(speaking) {
    const masterBtn = document.getElementById('masterVoiceBtn');
    if (masterBtn) {
      if (speaking) {
        masterBtn.classList.add('speaking');
        const icon = document.getElementById('masterVoiceIcon');
        if (icon) icon.textContent = '⏹️';
        const txt = document.getElementById('masterVoiceText');
        if (txt) txt.textContent = 'إيقاف الصوت';
      } else {
        masterBtn.classList.remove('speaking');
        const icon = document.getElementById('masterVoiceIcon');
        if (icon) icon.textContent = '🔊';
        const txt = document.getElementById('masterVoiceText');
        if (txt) txt.textContent = 'Voice Brief';
      }
    }
  }

  function toggleMasterVoice() {
    if (VoiceEngine.isSpeaking) {
      VoiceEngine.stop();
    } else {
      speakExecutiveBrief();
    }
  }

  function speakExecutiveBrief() {
    const m = window.__model;
    if (!m) return;
    const s = m.summary;
    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const aheadDelta = (s.achievement - currBM).toFixed(1);
    const isAhead = s.achievement >= currBM;

    const repRanked = [...m.individuals].sort((a, b) => b.achievement - a.achievement || b.cash - a.cash);
    const topRep = repRanked[0];
    const topRepName = topRep ? topRep.name.replace(/^(ME-|EGSS\d+-|EOSS\d+-|EGLP\d+-)/i, '') : '';

    let script = '';
    if (dailyPlanLang === 'ar') {
      script = `تقرير القيادة التنفيذي لفريق بيج تيم وان. ` +
        `اليوم هو اليوم السادس عشر من شهر نوفمبر. ` +
        `إجمالي الكاش المحقق حتى الآن بلغ ${formatMoney(s.totalCash)}، بنسبة إنجاز ${s.achievement.toFixed(1)} بالمئة من المستهدف الكلي البالغ ${formatMoney(s.totalTarget)}. ` +
        (isAhead ? `الفريق يتقدم على بنشمارك اليوم البالغ ${currBM} بالمئة بفارق إيجابي قدره ${aheadDelta} نقطة مئوية. ` : `الفريق متأخر عن بنشمارك اليوم بفارق ${Math.abs(aheadDelta)} نقطة. `) +
        `الفجوة المتبقية لتحقيق كامل التارجت هي ${formatMoney(s.totalGap)}، بمعدل تحصيل يومي مطلوب يبلغ ${formatMoney(s.dailyNeeded)} يومياً. ` +
        `نجم الفريق الأول لهذا اليوم هو الزميل ${topRepName} بنسبة إنجاز ${topRep ? topRep.achievement.toFixed(1) : 0} بالمئة. ` +
        `توجيه الإدارة لهذا اليوم: التركيز على تحويل باقات الترقية إم تو وتكثيف المتابعة الفردية مع الموظفين المتأخرين عن خط السير.`;
    } else {
      script = `Executive command briefing for Big Team 01. ` +
        `Today is MTD Day 16 of November. ` +
        `Total cash achieved stands at ${formatMoney(s.totalCash)}, representing ${s.achievement.toFixed(1)} percent of the monthly target ${formatMoney(s.totalTarget)}. ` +
        (isAhead ? `The team is pacing ahead of today's 41 percent benchmark by ${aheadDelta} percentage points. ` : `The team is currently behind today's benchmark. `) +
        `The remaining gap is ${formatMoney(s.totalGap)}, requiring a run rate of ${formatMoney(s.dailyNeeded)} per day. ` +
        `Top performer today is ${topRepName}. ` +
        `Management directive: accelerate M2 upgrade conversions and conduct 1 on 1 coaching for reps behind pace.`;
    }

    VoiceEngine.speak(script, dailyPlanLang);
  }

  function speakRepBrief(repName) {
    const m = window.__model;
    if (!m) return;
    const rep = m.individuals.find(r => r.name.toLowerCase() === repName.toLowerCase());
    if (!rep) return;

    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const cleanName = rep.name.replace(/^(ME-|EGSS\d+-|EOSS\d+-|EGLP\d+-)/i, '');
    const isAhead = rep.achievement >= currBM;
    const delta = Math.abs(rep.achievement - currBM).toFixed(1);

    let script = '';
    if (dailyPlanLang === 'ar') {
      script = `تقرير المستشار ${cleanName}. ` +
        `حقق كاش بقيمة ${formatMoney(rep.cash)} من تارجت ${formatMoney(rep.target)}، بنسبة إنجاز ${rep.achievement.toFixed(1)} بالمئة مع إغلاق ${rep.contracts} صفقات. ` +
        (isAhead ? `المستشار متقدم على بنشمارك اليوم بفارق ${delta} بالمئة. ` : `المستشار متأخر عن بنشمارك اليوم بفارق ${delta} بالمئة. مطلوب تعويض الفجوة البالغة ${formatMoney(rep.gap)}. `) +
        (rep.achievement >= 100 ? `تجاوز التارجت الرسمي وتأهل لأعلى شريحة عمولة!` : `المعدل اليومي المطلوب للوصول للتارجت هو ${formatMoney(rep.dailyNeeded)} يومياً.`);
    } else {
      script = `Specialist briefing for ${cleanName}. ` +
        `Achieved ${formatMoney(rep.cash)} out of ${formatMoney(rep.target)} target, pacing at ${rep.achievement.toFixed(1)} percent with ${rep.contracts} closed deals. ` +
        (isAhead ? `Currently ahead of pace by ${delta} percent. ` : `Behind benchmark by ${delta} percent with a gap of ${formatMoney(rep.gap)}. `) +
        `Daily run rate needed is ${formatMoney(rep.dailyNeeded)}.`;
    }

    VoiceEngine.speak(script, dailyPlanLang);
  }

  window.VoiceEngine = VoiceEngine;
  window.speakExecutiveBrief = speakExecutiveBrief;
  window.speakRepBrief = speakRepBrief;
  window.toggleMasterVoice = toggleMasterVoice;

  // =========================================================================
  // 4. DATE TIME-TRAVEL SIMULATOR (DAY 1 - 30)
  // =========================================================================
  function onDateSliderChange(val) {
    const day = parseInt(val, 10);
    activeSimulationDay = day;
    const bmPct = OFFICIAL_PACING[day] || Math.round((day / 30) * 100);

    const label = document.getElementById('sliderDayLabel');
    if (label) {
      if (day === LIVE_MTD_DAY) {
        label.innerHTML = `🟢 Live Today: <strong>Day ${day}</strong> (${bmPct}% BM)`;
        label.className = 'slider-active-day-badge live';
      } else {
        label.innerHTML = `⏳ Simulation: <strong>Day ${day}</strong> (${bmPct}% BM)`;
        label.className = 'slider-active-day-badge simulated';
      }
    }

    // Recalculate simulation benchmarks for reps
    updateSimulationView(day, bmPct);
  }

  function resetDateSlider() {
    const slider = document.getElementById('datePacingSlider');
    if (slider) slider.value = LIVE_MTD_DAY;
    onDateSliderChange(LIVE_MTD_DAY);
  }

  function updateSimulationView(day, bmPct) {
    const m = window.__model;
    if (!m) return;

    // Update Day benchmark displays in KPI card
    const achSub = document.getElementById('achSub');
    if (achSub) {
      const expCash = Math.round(m.summary.totalTarget * (bmPct / 100));
      achSub.textContent = `Day ${day} BM: ${bmPct}% (${formatMoney(expCash)}) | Target: ${formatMoney(m.summary.totalTarget)}`;
    }

    const achDays = document.getElementById('achDays');
    if (achDays) {
      const daysLeft = Math.max(0, 30 - day);
      achDays.textContent = `Simulated Day ${day} of 30 | Expected Target Pace: ${bmPct}% (${daysLeft} Days Left)`;
    }

    // Refresh Individual Reps list with new simulation benchmark
    if (typeof window.renderIndividualsTab === 'function') {
      window.renderIndividualsTab(m);
    }
  }

  window.onDateSliderChange = onDateSliderChange;
  window.resetDateSlider = resetDateSlider;

  // =========================================================================
  // 5. TACTICAL ACTION FILTER PILLS
  // =========================================================================
  function filterIndividualsByPill(pillKey) {
    if (activeActionPill === pillKey && pillKey !== 'all') {
      pillKey = 'all';
    }
    activeActionPill = pillKey;
    window.activeActionPill = pillKey;

    // Update active pill styling
    document.querySelectorAll('.tactical-pill').forEach(pill => {
      if (pill.dataset.filter === pillKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    const m = window.__model;
    if (!m || !m.individuals) return;

    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const tableBody = document.getElementById('individualFullTableBody');
    const cardsContainer = document.getElementById('individualCards');
    if (!tableBody && !cardsContainer) return;

    // Determine matching reps
    let matching = m.individuals.filter(r => {
      if (pillKey === 'all') return true;
      if (pillKey === 'behind') return r.achievement < currBM;
      if (pillKey === 'zero') return (r.cash || 0) === 0;
      if (pillKey === 'nodeal') return (r.contracts || 0) <= 2;
      if (pillKey === 'pending') return (r.upgradeBase >= 20 && (r.upgradeM2 || 0) === 0);
      if (pillKey === 'calls') return ((r.coverRate || 0) < 70);
      if (pillKey === 'ach100') return r.achievement >= 100;
      if (pillKey.startsWith('pod-')) {
        const podKey = pillKey.replace('pod-', '');
        return r.team === podKey;
      }
      return true;
    });

    // Update reps count tag
    const countTag = document.getElementById('individualRepsCountTag');
    if (countTag) {
      countTag.textContent = `Showing ${matching.length} of ${m.individuals.length} Reps (${getPillLabel(pillKey)})`;
    }

    const matchingNames = new Set(matching.map(r => r.name.toLowerCase()));

    // Filter table rows directly
    if (tableBody) {
      const rows = tableBody.querySelectorAll('tr');
      rows.forEach(tr => {
        const repNameAttr = tr.getAttribute('data-rep-name');
        if (!repNameAttr) return;
        const isMatch = matchingNames.has(repNameAttr.toLowerCase());
        tr.classList.toggle('pill-hidden', !isMatch);
        tr.style.setProperty('display', isMatch ? '' : 'none', 'important');
      });
    }

    // Filter cards
    if (cardsContainer) {
      const cards = cardsContainer.querySelectorAll('.ind-card-pro');
      cards.forEach(card => {
        const repNameAttr = card.getAttribute('data-rep-name');
        if (!repNameAttr) return;
        const isMatch = matchingNames.has(repNameAttr.toLowerCase());
        card.classList.toggle('pill-hidden', !isMatch);
        card.style.setProperty('display', isMatch ? 'flex' : 'none', 'important');
      });
    }
  }

  function updateTacticalPillCounts(model) {
    const m = model || window.__model;
    if (!m || !m.individuals) return;
    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;

    const countAll = m.individuals.length;
    const countBehind = m.individuals.filter(r => r.achievement < currBM).length;
    const countZero = m.individuals.filter(r => (r.cash || 0) === 0).length;
    const countNoDeal = m.individuals.filter(r => (r.contracts || 0) <= 2).length;
    const countPending = m.individuals.filter(r => r.upgradeBase >= 20 && (r.upgradeM2 || 0) === 0).length;
    const countCalls = m.individuals.filter(r => (r.coverRate || 0) < 70).length;
    const count100 = m.individuals.filter(r => r.achievement >= 100).length;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('pillCountAll', countAll);
    const allPillCount = document.querySelector('.tactical-pill[data-filter="all"] .pill-count');
    if (allPillCount) allPillCount.textContent = countAll;

    setEl('pillCountBehind', countBehind);
    setEl('pillCountZero', countZero);
    setEl('pillCountNoDeal', countNoDeal);
    setEl('pillCountPending', countPending);
    setEl('pillCountCalls', countCalls);
    setEl('pillCount100', count100);

    // Pods
    ['EGSS01', 'EGSS05', 'EGSS10', 'EGSS13', 'EGSS30'].forEach(pod => {
      const btn = document.querySelector(`.tactical-pill[data-filter="pod-${pod}"] .pill-count`);
      if (btn) {
        btn.textContent = m.individuals.filter(r => r.team === pod).length;
      }
    });
  }

  function getPillLabel(k) {
    switch (k) {
      case 'behind': return 'Behind BM';
      case 'zero': return 'Zero Cash';
      case 'nodeal': return 'Low Deals (≤2)';
      case 'pending': return 'High Backlog';
      case 'calls': return 'Coverage < 70%';
      case 'ach100': return '100%+ Achieved';
      default: return 'All Specialists';
    }
  }

  window.filterIndividualsByPill = filterIndividualsByPill;
  window.updateTacticalPillCounts = updateTacticalPillCounts;

  // =========================================================================
  // 6. ASK BIG TEAM 01 COMMAND PALETTE (CTRL + K)
  // =========================================================================
  function openCommandPalette() {
    let modal = document.getElementById('commandPaletteModal');
    if (!modal) {
      createCommandPaletteModal();
      modal = document.getElementById('commandPaletteModal');
    }
    modal.classList.add('open');
    const input = document.getElementById('cmdPaletteInput');
    if (input) {
      input.value = '';
      input.focus();
      renderCommandSuggestions('');
    }
  }

  function closeCommandPalette() {
    const modal = document.getElementById('commandPaletteModal');
    if (modal) modal.classList.remove('open');
  }

  function createCommandPaletteModal() {
    const modal = document.createElement('div');
    modal.id = 'commandPaletteModal';
    modal.className = 'cmd-palette-backdrop';
    modal.innerHTML = `
      <div class="cmd-palette-box" onclick="event.stopPropagation()">
        <div class="cmd-palette-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="cmdPaletteInput" class="cmd-palette-input" placeholder="Type a command or rep name (e.g. behind, zero, 100, samira, plan)..." autocomplete="off">
          <button type="button" class="cmd-palette-close" onclick="closeCommandPalette()">ESC</button>
        </div>
        <div class="cmd-palette-results" id="cmdPaletteResults"></div>
        <div class="cmd-palette-footer">
          <div style="display:flex; align-items:center; gap:12px;">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div style="color:#6366f1; font-weight:700;">Big Team 01 AI Command</div>
        </div>
      </div>
    `;
    modal.onclick = closeCommandPalette;
    document.body.appendChild(modal);

    // Attach input event
    const input = modal.querySelector('#cmdPaletteInput');
    input.addEventListener('input', (e) => {
      renderCommandSuggestions(e.target.value.trim().toLowerCase());
    });
  }

  function renderCommandSuggestions(query) {
    const container = document.getElementById('cmdPaletteResults');
    if (!container) return;

    const m = window.__model;
    const items = [];

    // Built-in commands
    const commands = [
      { id: 'plan', title: '📋 Open Daily Action Plan (خطة اليوم)', sub: 'View today top 3 moves and copy DingTalk report', action: () => { window.switchTab('dailyplan'); closeCommandPalette(); } },
      { id: 'voice', title: '🔊 Play Executive Voice Brief (التقرير الصوتي)', sub: 'Listen to AI analysis for Big Team 01', action: () => { speakExecutiveBrief(); closeCommandPalette(); } },
      { id: 'behind', title: '⚠️ Filter Reps: Behind Benchmark', sub: 'Filter table to show only reps below pacing line', action: () => { window.switchTab('individuals'); filterIndividualsByPill('behind'); closeCommandPalette(); } },
      { id: 'zero', title: '🚨 Filter Reps: Zero Cash', sub: 'Filter table to show reps who have not closed cash yet', action: () => { window.switchTab('individuals'); filterIndividualsByPill('zero'); closeCommandPalette(); } },
      { id: 'ach100', title: '🏆 Filter Reps: 100%+ Achievers', sub: 'Show reps who surpassed 100% of their monthly target', action: () => { window.switchTab('individuals'); filterIndividualsByPill('ach100'); closeCommandPalette(); } },
      { id: 'calc', title: '🧮 Open VIP Packages Rate Card Calculator', sub: 'Calculate package pricing, discounts and contracts', action: () => { window.switchTab('calculator'); closeCommandPalette(); } }
    ];

    // Filter commands
    commands.forEach(cmd => {
      if (!query || cmd.id.includes(query) || cmd.title.toLowerCase().includes(query) || cmd.sub.toLowerCase().includes(query)) {
        items.push({
          type: 'cmd',
          title: cmd.title,
          sub: cmd.sub,
          icon: '⚡',
          action: cmd.action
        });
      }
    });

    // Reps matching
    if (m && m.individuals) {
      m.individuals.forEach(r => {
        const cleanName = r.name.replace(/^(ME-|EGSS\d+-|EOSS\d+-|EGLP\d+-)/i, '');
        if (!query || r.name.toLowerCase().includes(query) || cleanName.toLowerCase().includes(query) || r.team.toLowerCase().includes(query)) {
          items.push({
            type: 'rep',
            title: `👤 ${cleanName} (${r.team})`,
            sub: `Cash: ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%) • Target: ${formatMoney(r.target)} • Deals: ${r.contracts}`,
            icon: r.achievement >= 41 ? '🟢' : '⚠️',
            action: () => {
              window.switchTab('individuals');
              closeCommandPalette();
              setTimeout(() => {
                const tr = document.querySelector(`tr[data-rep-name="${r.name}"]`);
                if (tr) {
                  tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  tr.style.background = 'rgba(99, 102, 241, 0.2)';
                  setTimeout(() => { tr.style.background = ''; }, 2500);
                }
              }, 150);
            },
            voiceAction: () => {
              speakRepBrief(r.name);
            }
          });
        }
      });
    }

    if (items.length === 0) {
      container.innerHTML = `<div class="cmd-no-results">No matching commands or reps for "${query}". Try "behind", "samira", "plan", or "zero".</div>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => `
      <div class="cmd-item" onclick="window.__cmdAction(${idx})">
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${item.icon}</span>
          <div>
            <div class="cmd-item-title">${item.title}</div>
            <div class="cmd-item-sub">${item.sub}</div>
          </div>
        </div>
        ${item.voiceAction ? `
          <button type="button" class="btn-cmd-voice" onclick="event.stopPropagation(); window.__cmdVoiceAction(${idx})" title="Listen to Voice Brief">🔊</button>
        ` : ''}
      </div>
    `).join('');

    window.__cmdAction = (idx) => { items[idx].action(); };
    window.__cmdVoiceAction = (idx) => { if (items[idx].voiceAction) items[idx].voiceAction(); };
  }

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });

  window.openCommandPalette = openCommandPalette;
  window.closeCommandPalette = closeCommandPalette;

  // =========================================================================
  // 7. BILINGUAL DAILY ACTION PLAN GENERATOR (خطة العمل اليومية)
  // =========================================================================
  function renderDailyActionPlan() {
    const container = document.getElementById('tab-dailyplan');
    if (!container) return;

    const m = window.__model;
    if (!m) return;

    const s = m.summary;
    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const behindReps = m.individuals.filter(r => r.achievement < currBM);
    const topReps = [...m.individuals].sort((a, b) => b.achievement - a.achievement).slice(0, 3);
    const zeroReps = m.individuals.filter(r => r.cash === 0);

    const isAr = dailyPlanLang === 'ar';

    container.innerHTML = `
      <div class="daily-plan-container">
        <!-- Header with Language and Actions -->
        <div class="daily-plan-header">
          <div class="daily-plan-title-box">
            <div class="plan-badge">⚡ AI OPERATIONAL INTELLIGENCE</div>
            <h2>${isAr ? 'خطة العمل اليومية التكتيكية — بيج تيم 01' : 'Daily Operational Action Plan — Big Team 01'}</h2>
            <p>${isAr ? `توجيهات العمل الميداني ليوم 16 نوفمبر 2026 | الهدف اليومي: ${formatMoney(s.dailyNeeded)}/day` : `Field Directives for Nov 16, 2026 | Required Daily Pace: ${formatMoney(s.dailyNeeded)}/day`}</p>
          </div>
          <div class="daily-plan-controls">
            <div class="lang-toggle-pill">
              <button type="button" class="${isAr ? 'active' : ''}" onclick="window.setDailyPlanLang('ar')">عربي</button>
              <button type="button" class="${!isAr ? 'active' : ''}" onclick="window.setDailyPlanLang('en')">EN</button>
            </div>
            <button type="button" class="btn-copy-plan" onclick="window.copyDailyPlanDingTalk()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>${isAr ? 'نسخ التقرير لدينج توك' : 'Copy Plan for DingTalk'}</span>
            </button>
            <button type="button" class="btn-voice-plan" onclick="window.speakExecutiveBrief()">
              🔊 ${isAr ? 'استمع للخطة' : 'Listen'}
            </button>
          </div>
        </div>

        <!-- 3 Strategic Moves Cards -->
        <div class="plan-moves-grid">
          <div class="plan-move-card move-1">
            <div class="move-header">
              <span class="move-num">1</span>
              <div class="move-title">${isAr ? 'تحصيل الكاش المطلوب لبنشمارك اليوم' : 'Daily Cash Run-Rate Sprint'}</div>
            </div>
            <div class="move-body">
              <p>${isAr ? `مطلوب تحصيل <strong>${formatMoney(s.dailyNeeded)}</strong> اليوم للحفاظ على وتيرة البنشمارك (${currBM}%). الفجوة الكلية: <strong>${formatMoney(s.totalGap)}</strong>.` : `Target <strong>${formatMoney(s.dailyNeeded)}</strong> cash closing today to protect BM pace (${currBM}%). Total gap: <strong>${formatMoney(s.totalGap)}</strong>.`}</p>
              <div class="move-meta">
                <span>🎯 ${isAr ? 'الهدف المباشر: إغلاق 7-9 عقود جديدة' : 'Direct Target: Close 7-9 deals'}</span>
              </div>
            </div>
          </div>

          <div class="plan-move-card move-2">
            <div class="move-header">
              <span class="move-num">2</span>
              <div class="move-title">${isAr ? 'دعم المستشارين المتأخرين (1:1 Coaching)' : 'Recover Reps Behind Benchmark'}</div>
            </div>
            <div class="move-body">
              <p>${isAr ? `يوجد حالياً <strong>${behindReps.length}</strong> مستشاراً تحت خط البنشمارك. التركيز الفوري على: ` : `Currently <strong>${behindReps.length}</strong> reps below benchmark. Immediate 1:1 focus on: `}
                <strong>${behindReps.slice(0, 4).map(r => r.name.replace(/^(ME-|EGSS\d+-)/i, '')).join('، ')}</strong>.
              </p>
              <div class="move-meta">
                <span>⚡ ${isAr ? 'المطلوب: مراجعة قوائم المتابعة الصباحية مع التيم ليدرز' : 'Action: Morning lead list audit with TLs'}</span>
              </div>
            </div>
          </div>

          <div class="plan-move-card move-3">
            <div class="move-header">
              <span class="move-num">3</span>
              <div class="move-title">${isAr ? 'تسريع تحويل باقات الترقية (M2 Accelerator)' : 'M2 Upgrade Conversion Push'}</div>
            </div>
            <div class="move-body">
              <p>${isAr ? `تم إنجاز <strong>${s.totalUpgradeM2}</strong> تجديد ترقية من أصل <strong>${s.totalUpgrade20Target}</strong> مطلوبة لتحقيق هدف الـ 20%. متبقي: <strong>${s.totalUpgrade20Needed}</strong> تجديد.` : `Completed <strong>${s.totalUpgradeM2}</strong> upgrades toward the 20% milestone (${s.totalUpgrade20Target}). Remaining: <strong>${s.totalUpgrade20Needed}</strong> upgrades.`}</p>
              <div class="move-meta">
                <span>🔥 ${isAr ? 'الأولوية: الاتصال بالطلاب ذوي الحصص المتبقية أقل من 10' : 'Priority: Contact students with <10 classes'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Two Columns: Backlog Clearing & Top Closers -->
        <div class="plan-details-grid">
          <!-- Backlog Clearance -->
          <div class="plan-detail-card">
            <div class="detail-card-head">
              <span class="detail-icon">🧹</span>
              <h3>${isAr ? 'خطة تصفية المعلقات والباك لوج (SOP & Backlog)' : 'SOP & Backlog Clearance Directives'}</h3>
            </div>
            <div class="detail-card-body">
              <ul class="plan-list">
                <li>
                  <strong>${isAr ? 'مكالمات الاستهلاك (R4 Consumption):' : 'Consumption Follow-ups (R4):'}</strong>
                  ${isAr ? 'متابعة الطلاب أصحاب الحضور المنخفض لحجز الحصص وتفادي تجميد الباقة.' : 'Engage low-attendance students to secure bookings and avoid frozen credits.'}
                </li>
                <li>
                  <strong>${isAr ? 'معالجة حسابات الصفر كاش:' : 'Zero Cash Intervention:'}</strong>
                  ${isAr ? `يوجد ${zeroReps.length} مستشار بصفر كاش. مراجعة فورية لقوائم الاتصال.` : `Identified ${zeroReps.length} reps with zero cash. Immediate pipeline review.`}
                </li>
                <li>
                  <strong>${isAr ? 'تأكيد حضور نادي الإنجليزي (English Club 45%):' : 'English Club Attendance (45% Goal):'}</strong>
                  ${isAr ? 'تذكير أولياء الأمور بمواعيد جلسات نهاية الأسبوع لرفع نسبة التفاعل.' : 'Remind parents of weekend sessions to maintain target engagement rate.'}
                </li>
              </ul>
            </div>
          </div>

          <!-- Top Closers & Next Tier Accelerators -->
          <div class="plan-detail-card">
            <div class="detail-card-head">
              <span class="detail-icon">⭐</span>
              <h3>${isAr ? 'أبطال اليوم وفرص الترقية للشريحة الأعلى' : 'Top Stars & Next Tier Accelerators'}</h3>
            </div>
            <div class="detail-card-body">
              <div class="top-stars-list">
                ${topReps.map((r, i) => `
                  <div class="top-star-item">
                    <div class="star-rank">#${i + 1}</div>
                    <div class="star-info">
                      <div class="star-name">${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (${r.team})</div>
                      <div class="star-stat">${formatMoney(r.cash)} • ${r.achievement.toFixed(1)}% Achieved • ${r.contracts} Deals</div>
                    </div>
                    <div class="star-badge">ELITE ⚡</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setDailyPlanLang(lang) {
    dailyPlanLang = lang;
    renderDailyActionPlan();
  }

  function copyDailyPlanDingTalk() {
    const m = window.__model;
    if (!m) return;
    const s = m.summary;
    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const topReps = [...m.individuals].sort((a, b) => b.achievement - a.achievement).slice(0, 3);
    const behindCount = m.individuals.filter(r => r.achievement < currBM).length;

    let text = '';
    if (dailyPlanLang === 'ar') {
      text = `⚡ [51Talk] خطة العمل اليومية — Big Team 01
📅 التاريخ: 16 نوفمبر 2026 (اليوم 16 من 30)
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 موقف الكاش والإنجاز المالي:
• إجمالي الكاش المحقق: ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)
• المستهدف الكلي: ${formatMoney(s.totalTarget)}
• بنشمارك اليوم: ${currBM}% (الفريق متقدم بـ +${(s.achievement - currBM).toFixed(1)}%)
• الفجوة المتبقية: ${formatMoney(s.totalGap)}
• المطلوب يومياً: ${formatMoney(s.dailyNeeded)} / يوم

🎯 أهم 3 تحركات ميدانية لليوم:
1️⃣ تركيز المكالمات الصباحية على طلاب التجديد المتبقي لديهم أقل من 10 حصص.
2️⃣ مراجعة 1:1 فورية مع ${behindCount} مستشارين متأخرين عن البنشمارك.
3️⃣ تسريع باقات الـ M2 لتحقيق مستهدف الـ 20% (مطلوب ${s.totalUpgrade20Needed} صفقة).

⭐ أبطال المبيعات اليوم:
${topReps.map((r, i) => `${i + 1}. ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')}: ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join('\n')}

🚀 لنواصل العزم والتركيز لتحقيق 100% تارجت بيج تيم 01!`;
    } else {
      text = `⚡ [51Talk] Daily Operational Action Plan — Big Team 01
📅 Date: Nov 16, 2026 (MTD Day 16 of 30)
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Financial Velocity:
• Cash Achieved: ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)
• Target: ${formatMoney(s.totalTarget)}
• Benchmark Day 16: ${currBM}% (+${(s.achievement - currBM).toFixed(1)}% ahead)
• Total Gap: ${formatMoney(s.totalGap)}
• Daily Needed: ${formatMoney(s.dailyNeeded)}/day

🎯 Top 3 Strategic Moves Today:
1. Target students with < 10 classes remaining for instant renewal.
2. 1:1 coaching sprint for ${behindCount} reps pacing below benchmark.
3. Accelerate M2 upgrades (${s.totalUpgrade20Needed} needed for 20% milestone).

⭐ Top Stars Today:
${topReps.map((r, i) => `${i + 1}. ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')}: ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join('\n')}

Let's accelerate momentum and smash our goals!`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert(dailyPlanLang === 'ar' ? '✓ تم نسخ خطة العمل بنجاح! جاهزة للصق في دينج توك.' : '✓ Daily plan copied! Ready to paste into DingTalk.');
      }).catch(() => {
        window.prompt('Copy plan:', text);
      });
    } else {
      window.prompt('Copy plan:', text);
    }
  }

  window.setDailyPlanLang = setDailyPlanLang;
  window.copyDailyPlanDingTalk = copyDailyPlanDingTalk;
  window.renderDailyActionPlan = renderDailyActionPlan;

  // =========================================================================
  // 8. AUTO-INITIALIZATION & HOOKS
  // =========================================================================
  function initSuite() {
    updateCurrencyButtons();
    // Re-render Daily Action Plan when switching tabs
    const tabBtn = document.querySelector('.tab[data-tab="dailyplan"]');
    if (tabBtn) {
      tabBtn.addEventListener('click', () => {
        renderDailyActionPlan();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuite);
  } else {
    initSuite();
  }

})();
