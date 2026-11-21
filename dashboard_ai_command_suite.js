/**
 * Big Team 01 — AI Command Suite & Executive Voice Cockpit
 * Inspired by OCTOPUS Command Engine with Native Light Theme Styling
 * 100% English Corporate Standards
 *
 * Core Capabilities:
 *   1. Interactive Conversational AI Voice Simulator (Speech Synthesis & Dialogue)
 *   2. Dual Currency Switcher (USD $ ⇄ SAR) at official 3.75 rate
 *   3. Interactive Date Time-Travel Pacing Simulator (Days 1–30)
 *   4. Tactical Action Filter Pills (Behind BM, Zero Cash, Low Deals, Pods)
 *   5. Ask Big Team 01 Command Palette (Ctrl + K) with fuzzy search
 *   6. Automated English Daily Operational Action Plan (DingTalk ready)
 *   7. Floating AI Voice Assistant Drawer
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION & STATE
  // =========================================================================
  const SAR_EXCHANGE_RATE = 3.75;
  let activeCurrency = localStorage.getItem('bt01_currency') || 'USD';
  let activeSimulationDay = 16;
  const LIVE_MTD_DAY = 16;
  let activeActionPill = 'all';

  const OFFICIAL_PACING = {
    1: 5,   2: 8,   3: 11,  4: 14,  5: 17,
    6: 20,  7: 23,  8: 24,  9: 25,  10: 26,
    11: 29, 12: 32, 13: 35, 14: 38, 15: 40,
    16: 41, 17: 43, 18: 50, 19: 53, 20: 56,
    21: 59, 22: 61, 23: 63, 24: 65, 25: 68,
    26: 74, 27: 80, 28: 87, 29: 94, 30: 100,
    31: 102
  };

  // =========================================================================
  // 2. CURRENCY ENGINE (USD ⇄ SAR)
  // =========================================================================
  function formatMoney(amountUSD) {
    if (amountUSD === null || amountUSD === undefined || isNaN(amountUSD)) {
      return activeCurrency === 'SAR' ? '0 SAR' : '$0';
    }
    if (activeCurrency === 'SAR') {
      const sar = Math.round(amountUSD * SAR_EXCHANGE_RATE);
      return sar.toLocaleString('en-US') + ' SAR';
    }
    return '$' + Math.round(amountUSD).toLocaleString('en-US');
  }

  function updateCurrencyHeaders(curr) {
    const isSAR = curr === 'SAR';
    const symbol = isSAR ? '(SAR)' : '($)';
    document.querySelectorAll('.curr-unit').forEach(el => {
      el.textContent = symbol;
    });
    document.querySelectorAll('th').forEach(th => {
      if (isSAR && th.textContent.includes('($)')) {
        th.innerHTML = th.innerHTML.replace(/\(\$\)/g, '(SAR)');
      } else if (!isSAR && th.textContent.includes('(SAR)')) {
        th.innerHTML = th.innerHTML.replace(/\(SAR\)/g, '($)');
      }
    });
  }

  function setDashboardCurrency(curr) {
    activeCurrency = curr;
    try { localStorage.setItem('bt01_currency', curr); } catch (e) {}
    updateCurrencyButtons();
    window.fmtCurr = formatMoney;
    window.__activeCurrency = curr;
    updateCurrencyHeaders(curr);

    if (window.__model) {
      if (typeof window.renderAll === 'function') {
        window.renderAll(window.__model);
      } else {
        if (typeof window.renderKPIs === 'function') window.renderKPIs(window.__model);
        if (typeof window.renderOverviewTable === 'function') window.renderOverviewTable(window.__model);
        if (typeof window.renderSmallTeamsTab === 'function') window.renderSmallTeamsTab(window.__model);
        if (typeof window.renderIndividualsTab === 'function') window.renderIndividualsTab(window.__model);
        if (typeof window.renderBigTeamSummary === 'function') window.renderBigTeamSummary(window.__model);
        if (typeof window.renderUpgradeTab === 'function') window.renderUpgradeTab(window.__model);
      }
    }
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
  // 3. AI VOICE SYNTHESIS ENGINE (ENGLISH NATIVE)
  // =========================================================================
  const VoiceEngine = {
    isSpeaking: false,
    synth: window.speechSynthesis || null,
    currentUtterance: null,
    speakingRate: 1.0,

    speak(text, onStartCallback = null, onEndCallback = null) {
      if (!this.synth) {
        console.warn('SpeechSynthesis API not supported in this browser.');
        alert('Voice synthesis is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
        return;
      }
      this.stop();

      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = this.speakingRate;
      utter.pitch = 1.0;
      utter.lang = 'en-US';

      // Pick natural sounding English voice
      const voices = this.synth.getVoices();
      const enVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy')))) || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utter.voice = enVoice;

      utter.onstart = () => {
        this.isSpeaking = true;
        document.body.classList.add('ai-voice-active');
        updateVoiceUiState(true);
        if (onStartCallback) onStartCallback();
      };

      utter.onend = () => {
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceUiState(false);
        if (onEndCallback) onEndCallback();
      };

      utter.onerror = () => {
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceUiState(false);
      };

      this.currentUtterance = utter;
      this.synth.speak(utter);
    },

    stop() {
      if (this.synth) {
        this.synth.cancel();
        this.isSpeaking = false;
        document.body.classList.remove('ai-voice-active');
        updateVoiceUiState(false);
      }
    }
  };

  function updateVoiceUiState(speaking) {
    // 1. Top Nav Button
    const masterBtn = document.getElementById('masterVoiceBtn');
    if (masterBtn) {
      if (speaking) {
        masterBtn.classList.add('speaking');
        const icon = document.getElementById('masterVoiceIcon');
        if (icon) icon.textContent = '⏹️';
        const txt = document.getElementById('masterVoiceText');
        if (txt) txt.textContent = 'Stop Voice';
      } else {
        masterBtn.classList.remove('speaking');
        const icon = document.getElementById('masterVoiceIcon');
        if (icon) icon.textContent = '🔊';
        const txt = document.getElementById('masterVoiceText');
        if (txt) txt.textContent = 'Voice Brief';
      }
    }

    // 2. Hero Simulator Card Button
    const heroBtn = document.getElementById('btnPlayVoiceSimulation');
    const heroIcon = document.getElementById('voiceSimHeroIcon');
    const heroText = document.getElementById('voiceSimHeroText');
    const waveBar = document.getElementById('soundwaveBar');

    if (heroBtn && heroIcon && heroText) {
      if (speaking) {
        heroBtn.classList.add('speaking');
        heroIcon.textContent = '⏹';
        heroText.textContent = 'STOP VOICE BRIEFING';
        if (waveBar) waveBar.classList.add('active');
      } else {
        heroBtn.classList.remove('speaking');
        heroIcon.textContent = '▶';
        heroText.textContent = 'START SPOKEN EXECUTIVE BRIEFING';
        if (waveBar) waveBar.classList.remove('active');
      }
    }
  }

  function toggleExecutiveVoiceSimulation() {
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
    const behindCount = m.individuals.filter(r => r.achievement < currBM).length;

    const script = `Good day, Senior Management. Here is the operational command briefing for Big Team 01. ` +
      `Today is MTD Day 16 of November. ` +
      `Total cash achieved stands at ${formatMoney(s.totalCash)}, representing ${s.achievement.toFixed(1)} percent of the monthly target ${formatMoney(s.totalTarget)}. ` +
      (isAhead ? `The sector is pacing +${aheadDelta} percentage points ahead of today's ${currBM} percent benchmark. ` : `The team is currently behind today's benchmark. `) +
      `The total revenue gap is ${formatMoney(s.totalGap)}, requiring an average closing run-rate of ${formatMoney(s.dailyNeeded)} per day across the remaining 14 days. ` +
      `Our sector champion today is ${topRepName} with ${topRep ? topRep.achievement.toFixed(1) : 0} percent achievement and ${topRep ? topRep.contracts : 0} closed deals. ` +
      `Operational priorities for today: first, accelerate M2 upgrade conversions, where 15 of 88 target deals have closed. ` +
      `Second, conduct targeted 1-on-1 coaching for the ${behindCount} sales specialists currently behind benchmark.`;

    displayTranscript(script, 'Executive Briefing');
    VoiceEngine.speak(script);
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

    const script = `Performance briefing for ${cleanName}. ` +
      `Total cash closed: ${formatMoney(rep.cash)} out of ${formatMoney(rep.target)} target, achieving ${rep.achievement.toFixed(1)} percent across ${rep.contracts} orders. ` +
      (isAhead ? `Currently pacing ahead of Day ${activeSimulationDay} benchmark by +${delta} percent. ` : `Currently behind Day ${activeSimulationDay} benchmark by ${delta} percent. Gap to target is ${formatMoney(rep.gap)}. `) +
      (rep.achievement >= 100 ? `Monthly target surpassed! Commission multiplier active.` : `Daily run rate required to hit target: ${formatMoney(rep.dailyNeeded)} per day.`);

    displayTranscript(script, `Specialist: ${cleanName}`);
    VoiceEngine.speak(script);
  }

  function displayTranscript(text, title = 'AI Response') {
    const box = document.getElementById('aiTranscriptContent');
    const header = document.getElementById('aiTranscriptHeader');
    if (box) {
      box.textContent = text;
      box.classList.add('pulse-text');
      setTimeout(() => box.classList.remove('pulse-text'), 800);
    }
    if (header) {
      header.textContent = `● ${title}`;
    }
  }

  // =========================================================================
  // 4. INTERACTIVE NATURAL LANGUAGE QUERY ENGINE ("TALK WITH AI")
  // =========================================================================
  function askAiQuestion(query) {
    const input = document.getElementById('aiVoicePromptInput');
    const promptText = (query || (input ? input.value : '')).trim();
    if (!promptText) return;

    let responseText = '';
    let categoryTitle = 'Toki AI Intelligence';

    if (typeof window.TokiUniversalEngine !== 'undefined' && typeof window.TokiUniversalEngine.answer === 'function') {
      const ansObj = window.TokiUniversalEngine.answer(promptText);
      responseText = ansObj.text || '';
    } else if (typeof window.getTokiAnswer === 'function') {
      const ansObj = window.getTokiAnswer(promptText);
      responseText = ansObj.text || '';
    } else {
      const m = window.__model;
      if (!m) return;
      const s = m.summary;
      const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
      responseText = `Big Team 01 has achieved ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - currBM).toFixed(1)}% ahead of Day 16 benchmark. Total gap is ${formatMoney(s.totalGap)}.`;
    }

    displayTranscript(responseText, categoryTitle);
    VoiceEngine.speak(responseText);
  }

  window.askAiQuestion = askAiQuestion;
  window.VoiceEngine = VoiceEngine;
  window.speakExecutiveBrief = speakExecutiveBrief;
  window.speakRepBrief = speakRepBrief;
  window.toggleMasterVoice = toggleExecutiveVoiceSimulation;
  window.toggleExecutiveVoiceSimulation = toggleExecutiveVoiceSimulation;

  // =========================================================================
  // 5. DATE TIME-TRAVEL SIMULATOR (DAY 1 - 30)
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

    if (typeof window.renderIndividualsTab === 'function') {
      window.renderIndividualsTab(m);
    }
  }

  window.onDateSliderChange = onDateSliderChange;
  window.resetDateSlider = resetDateSlider;

  // =========================================================================
  // 6. TACTICAL ACTION FILTER PILLS
  // =========================================================================
  function filterIndividualsByPill(pillKey) {
    activeActionPill = pillKey;

    document.querySelectorAll('.tactical-pill').forEach(pill => {
      if (pill.dataset.filter === pillKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    const m = window.__model;
    if (!m) return;

    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const tableBody = document.getElementById('individualFullTableBody');
    const cardsContainer = document.getElementById('individualCards');
    if (!tableBody && !cardsContainer) return;

    const matching = m.individuals.filter(r => {
      if (pillKey === 'all') return true;
      if (pillKey === 'behind') return r.achievement < currBM;
      if (pillKey === 'zero') return r.cash === 0;
      if (pillKey === 'nodeal') return r.contracts === 0 || (r.contracts <= 1 && r.achievement < 30);
      if (pillKey === 'pending') return (r.upgradeBase >= 20 && r.upgradeM2 === 0);
      if (pillKey === 'calls') return (r.coverRate < 70);
      if (pillKey === 'ach100') return r.achievement >= 100;
      if (pillKey.startsWith('pod-')) {
        const podKey = pillKey.replace('pod-', '');
        return r.team === podKey;
      }
      return true;
    });

    const countTag = document.getElementById('individualRepsCountTag');
    if (countTag) {
      countTag.textContent = `Showing ${matching.length} of ${m.individuals.length} Reps (${getPillLabel(pillKey)})`;
    }

    if (tableBody) {
      const rows = tableBody.querySelectorAll('tr');
      rows.forEach(tr => {
        const repNameAttr = tr.getAttribute('data-rep-name');
        if (!repNameAttr) return;
        const isMatch = matching.some(r => r.name.toLowerCase() === repNameAttr.toLowerCase());
        tr.style.display = isMatch ? '' : 'none';
      });
    }

    if (cardsContainer) {
      const cards = cardsContainer.querySelectorAll('.ind-card-pro');
      cards.forEach(card => {
        const repNameAttr = card.getAttribute('data-rep-name');
        if (!repNameAttr) return;
        const isMatch = matching.some(r => r.name.toLowerCase() === repNameAttr.toLowerCase());
        card.style.display = isMatch ? '' : 'none';
      });
    }
  }

  function getPillLabel(k) {
    switch (k) {
      case 'behind': return 'Behind BM';
      case 'zero': return 'Zero Cash';
      case 'nodeal': return 'Low Deals';
      case 'pending': return 'High Potential Backlog';
      case 'calls': return 'Coverage < 70%';
      case 'ach100': return '100%+ Achieved';
      default: return 'All Specialists';
    }
  }

  window.filterIndividualsByPill = filterIndividualsByPill;

  // =========================================================================
  // 7. ASK BIG TEAM 01 COMMAND PALETTE (CTRL + K)
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
          <input type="text" id="cmdPaletteInput" class="cmd-palette-input" placeholder="Search specialists, teams, or commands (e.g. behind, zero, 100, samira, plan)..." autocomplete="off">
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

    const commands = [
      { id: 'plan', title: '📋 Open Daily Action Plan', sub: 'View today top 3 moves and copy DingTalk report', action: () => { window.switchTab('dailyplan'); closeCommandPalette(); } },
      { id: 'voice', title: '🔊 Play Executive Voice Briefing', sub: 'Listen to AI spoken operational analysis for Big Team 01', action: () => { speakExecutiveBrief(); closeCommandPalette(); } },
      { id: 'behind', title: '⚠️ Filter Reps: Behind Benchmark', sub: 'Filter table to show only reps below pacing line', action: () => { window.switchTab('individuals'); filterIndividualsByPill('behind'); closeCommandPalette(); } },
      { id: 'zero', title: '🚨 Filter Reps: Zero Cash', sub: 'Filter table to show reps who have not closed cash yet', action: () => { window.switchTab('individuals'); filterIndividualsByPill('zero'); closeCommandPalette(); } },
      { id: 'ach100', title: '🏆 Filter Reps: 100%+ Achievers', sub: 'Show reps who surpassed 100% of their monthly target', action: () => { window.switchTab('individuals'); filterIndividualsByPill('ach100'); closeCommandPalette(); } },
      { id: 'calc', title: '🧮 Open VIP Packages Rate Card Calculator', sub: 'Calculate package pricing, discounts and contracts', action: () => { window.switchTab('calculator'); closeCommandPalette(); } }
    ];

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
  // 8. PROMINENT AI VOICE CONVERSATIONAL SIMULATOR CARD IN OVERVIEW
  // =========================================================================
  function renderAiVoiceSimulatorCard() {
    const container = document.getElementById('aiVoiceSimulatorContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="ai-voice-simulator-card">
        <!-- Header -->
        <div class="sim-header">
          <div class="sim-title-group">
            <div class="sim-mic-icon">🎙️</div>
            <div>
              <div class="sim-title">OCTOPUS AI — CONVERSATIONAL VOICE & PACING SIMULATOR</div>
              <div class="sim-subtitle">Interactive spoken operational briefings, live audio synthesis, and natural language query dialogue</div>
            </div>
          </div>
          <div class="sim-badge-group">
            <span class="sim-status-badge">● LIVE AI AUDIO ENGINE (ENGLISH)</span>
          </div>
        </div>

        <!-- Spoken Briefing Hero Control -->
        <div class="sim-hero-strip">
          <button type="button" id="btnPlayVoiceSimulation" class="btn-voice-sim-hero" onclick="toggleExecutiveVoiceSimulation()">
            <span id="voiceSimHeroIcon">▶</span>
            <span id="voiceSimHeroText">START SPOKEN EXECUTIVE BRIEFING</span>
          </button>
          
          <div class="soundwave-bar" id="soundwaveBar">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </div>

          <div class="sim-speed-toggles">
            <span style="font-size:0.72rem; color:#64748b; font-weight:700;">Speed:</span>
            <button type="button" class="speed-btn" onclick="VoiceEngine.speakingRate=0.9; updateSpeedBtns(this)">0.9x</button>
            <button type="button" class="speed-btn active" onclick="VoiceEngine.speakingRate=1.0; updateSpeedBtns(this)">1.0x</button>
            <button type="button" class="speed-btn" onclick="VoiceEngine.speakingRate=1.15; updateSpeedBtns(this)">1.15x</button>
          </div>
        </div>

        <!-- Natural Language "Talk with AI" Prompt -->
        <div class="sim-query-section">
          <div class="sim-query-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="aiVoicePromptInput" class="sim-query-input" placeholder="Talk with Dashboard: Ask a question (e.g. 'What is the cash gap?', 'Who is #1?', 'Who is behind BM?')..." onkeydown="if(event.key==='Enter')askAiQuestion()">
            <button type="button" class="btn-sim-ask" onclick="askAiQuestion()">💬 Ask & Speak</button>
          </div>

          <div class="sim-quick-chips">
            <span class="chip-label">Quick Queries:</span>
            <button type="button" class="sim-chip" onclick="askAiQuestion('What is today cash gap and daily run rate needed?')">💰 Cash Gap & Run-Rate</button>
            <button type="button" class="sim-chip" onclick="askAiQuestion('Who are the top performers today?')">🏆 Top 3 Stars</button>
            <button type="button" class="sim-chip" onclick="askAiQuestion('Which specialists are behind benchmark today?')">⚠️ Reps Behind Benchmark</button>
            <button type="button" class="sim-chip" onclick="askAiQuestion('What is our M2 upgrade progress toward 20%?')">🚀 20% Upgrade Health</button>
            <button type="button" class="sim-chip" onclick="askAiQuestion('What are today 3 strategic moves?')">📋 Today's 3 Strategic Moves</button>
          </div>
        </div>

        <!-- Real-Time Spoken Transcript Display -->
        <div class="sim-transcript-box">
          <div class="transcript-head">
            <span id="aiTranscriptHeader">● Spoken Transcript & AI Response</span>
            <span style="font-size:0.70rem; color:#94a3b8; font-family:var(--font-mono);">Live Text-to-Speech Output</span>
          </div>
          <div class="transcript-body" id="aiTranscriptContent">
            Click "Start Spoken Executive Briefing" above or ask any question to listen to real-time AI audio analysis and view spoken transcript here.
          </div>
        </div>
      </div>
    `;
  }

  function updateSpeedBtns(clickedBtn) {
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    if (clickedBtn) clickedBtn.classList.add('active');
  }
  window.updateSpeedBtns = updateSpeedBtns;

  // =========================================================================
  // 9. DAILY ACTION PLAN GENERATOR (100% ENGLISH)
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

    container.innerHTML = `
      <div class="daily-plan-container">
        <!-- Header -->
        <div class="daily-plan-header">
          <div class="daily-plan-title-box">
            <div class="plan-badge">⚡ AI OPERATIONAL INTELLIGENCE</div>
            <h2>Daily Operational Action Plan — Big Team 01</h2>
            <p>Tactical Field Directives for November 16, 2026 | Required Daily Pace: <strong>${formatMoney(s.dailyNeeded)}/day</strong></p>
          </div>
          <div class="daily-plan-controls">
            <button type="button" class="btn-copy-plan" onclick="window.copyDailyPlanDingTalk()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Plan for DingTalk</span>
            </button>
            <button type="button" class="btn-voice-plan" onclick="window.speakExecutiveBrief()">
              🔊 Listen to Plan
            </button>
          </div>
        </div>

        <!-- 3 Strategic Moves Cards -->
        <div class="plan-moves-grid">
          <div class="plan-move-card move-1">
            <div class="move-header">
              <span class="move-num">1</span>
              <div class="move-title">Daily Cash Run-Rate Sprint</div>
            </div>
            <div class="move-body">
              <p>Target closing <strong>${formatMoney(s.dailyNeeded)}</strong> in cash today to defend the ${currBM}% benchmark pace. Total remaining gap is <strong>${formatMoney(s.totalGap)}</strong>.</p>
              <div class="move-meta">
                <span>🎯 Direct Target: Secure 7–9 new contracts today</span>
              </div>
            </div>
          </div>

          <div class="plan-move-card move-2">
            <div class="move-header">
              <span class="move-num">2</span>
              <div class="move-title">1:1 Coaching for Reps Behind Pace</div>
            </div>
            <div class="move-body">
              <p>Currently <strong>${behindReps.length}</strong> specialists are pacing below benchmark. Immediate 1:1 focus on:
                <strong>${behindReps.slice(0, 4).map(r => r.name.replace(/^(ME-|EGSS\d+-)/i, '')).join(', ')}</strong>.
              </p>
              <div class="move-meta">
                <span>⚡ Action: Review morning contact queues with Small Team Leaders</span>
              </div>
            </div>
          </div>

          <div class="plan-move-card move-3">
            <div class="move-header">
              <span class="move-num">3</span>
              <div class="move-title">M2 Upgrade Conversion Acceleration</div>
            </div>
            <div class="move-body">
              <p>Completed <strong>${s.totalUpgradeM2}</strong> upgrades toward the 20% milestone (${s.totalUpgrade20Target} target). Remaining: <strong>${s.totalUpgrade20Needed}</strong> upgrades.</p>
              <div class="move-meta">
                <span>🔥 Priority: Call renewal students with fewer than 10 remaining classes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Two Columns: Backlog Clearing & Top Closers -->
        <div class="plan-details-grid">
          <div class="plan-detail-card">
            <div class="detail-card-head">
              <span class="detail-icon">🧹</span>
              <h3>SOP & Backlog Clearance Directives</h3>
            </div>
            <div class="detail-card-body">
              <ul class="plan-list">
                <li>
                  <strong>Class Consumption Follow-ups (R4):</strong>
                  Engage low-attendance students to secure booking schedules and prevent frozen student credits.
                </li>
                <li>
                  <strong>Zero Cash Rep Interventions:</strong>
                  Identified ${zeroReps.length} specialists with zero cash. Immediate pipeline review and lead redistribution.
                </li>
                <li>
                  <strong>English Club Attendance (45% Milestone):</strong>
                  Remind parents of upcoming weekend group speaking sessions to maintain target attendance rate.
                </li>
              </ul>
            </div>
          </div>

          <div class="plan-detail-card">
            <div class="detail-card-head">
              <span class="detail-icon">⭐</span>
              <h3>Top Performers & Commission Accelerators</h3>
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

  function copyDailyPlanDingTalk() {
    const m = window.__model;
    if (!m) return;
    const s = m.summary;
    const currBM = OFFICIAL_PACING[activeSimulationDay] || 41;
    const topReps = [...m.individuals].sort((a, b) => b.achievement - a.achievement).slice(0, 3);
    const behindCount = m.individuals.filter(r => r.achievement < currBM).length;

    const text = `⚡ [51Talk] Daily Operational Action Plan — Big Team 01
📅 Date: November 16, 2026 (MTD Day 16 of 30)
━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Financial Velocity & Pacing:
• Cash Achieved: ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%)
• Monthly Target: ${formatMoney(s.totalTarget)}
• Day 16 Benchmark: ${currBM}% (+${(s.achievement - currBM).toFixed(1)}% ahead)
• Remaining Cash Gap: ${formatMoney(s.totalGap)}
• Required Daily Run-Rate: ${formatMoney(s.dailyNeeded)}/day

🎯 Top 3 Strategic Moves Today:
1. Target students with < 10 remaining classes for immediate renewal closure.
2. Conduct 1:1 coaching sprints with ${behindCount} specialists pacing below benchmark.
3. Accelerate M2 upgrades (${s.totalUpgrade20Needed} needed to hit 20% milestone).

⭐ Top Stars Today:
${topReps.map((r, i) => `${i + 1}. ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')}: ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join('\n')}

Let's maintain focus, accelerate momentum, and smash our targets!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('✓ Daily Operational Plan copied successfully! Ready to paste into DingTalk.');
      }).catch(() => {
        window.prompt('Copy plan:', text);
      });
    } else {
      window.prompt('Copy plan:', text);
    }
  }

  window.copyDailyPlanDingTalk = copyDailyPlanDingTalk;
  window.renderDailyActionPlan = renderDailyActionPlan;

  // =========================================================================
  // 10. FLOATING AI ASSISTANT WIDGET (ALWAYS ACCESSIBLE)
  // =========================================================================
  function createFloatingAiWidget() {
    if (typeof window.initTokiWidget === 'function') {
      window.initTokiWidget();
    }
  }

  // =========================================================================
  // 11. INITIALIZATION & DOM HOOKS
  // =========================================================================
  function initSuite() {
    window.fmtCurr = formatMoney;
    window.__activeCurrency = activeCurrency;
    updateCurrencyButtons();
    updateCurrencyHeaders(activeCurrency);
    renderAiVoiceSimulatorCard();
    createFloatingAiWidget();

    // Hook tab switches
    const planTabBtn = document.querySelector('.tab[data-tab="dailyplan"]');
    if (planTabBtn) {
      planTabBtn.addEventListener('click', () => {
        renderDailyActionPlan();
      });
    }

    const simTabBtn = document.querySelector('.tab[data-tab="aisimulator"]');
    if (simTabBtn) {
      simTabBtn.addEventListener('click', () => {
        window.switchTab('overview');
        setTimeout(() => {
          const sim = document.getElementById('aiVoiceSimulatorSection');
          if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuite);
  } else {
    initSuite();
  }

})();
