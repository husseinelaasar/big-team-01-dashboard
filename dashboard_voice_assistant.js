/**
 * Toki — Big Team 01 Interactive 3D AI Voice & Data Assistant
 * 100% English Executive Standard | Light Theme Corporate Aesthetics
 */

(function () {
  'use strict';

  // State
  let isListening = false;
  let recognition = null;
  let isSpeechEnabled = true;
  let isSpeaking = false;
  let currentUtterance = null;

  // Sound Engine
  function speak(text, onEnd) {
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
    utter.lang = 'en-US';

    const voices = synth.getVoices() || [];
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Guy') || v.name.includes('Samantha'))) || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utter.voice = enVoice;

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
    if (sw) {
      sw.style.display = active ? 'flex' : 'none';
    }
    if (avatar) {
      if (active) avatar.classList.add('toki-speaking');
      else avatar.classList.remove('toki-speaking');
    }
  }

  // Inject Styles for Toki
  function injectStyles() {
    if (document.getElementById('tokiStyles')) return;
    const style = document.createElement('style');
    style.id = 'tokiStyles';
    style.textContent = `
      /* --- TOKI FLOATING MASCOT WIDGET --- */
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
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .toki-widget:hover {
        transform: translateY(-4px) scale(1.03);
      }
      .toki-widget:active {
        transform: scale(0.97);
      }

      /* Waving Speech Bubble */
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
      .toki-bubble-sub {
        font-size: 0.70rem;
        color: #64748b;
        font-weight: 600;
      }

      /* 3D Avatar Pedestal Button */
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
      .toki-widget:hover .toki-avatar-img {
        transform: scale(1.08) rotate(3deg);
      }
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

      /* --- TOKI INTERACTIVE 3D DIALOGUE MODAL --- */
      .toki-modal {
        position: fixed;
        bottom: 105px;
        right: 24px;
        width: 410px;
        max-width: calc(100vw - 32px);
        height: 580px;
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
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .toki-modal.hidden {
        display: none !important;
      }

      /* Header */
      .toki-modal-header {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        padding: 14px 18px;
        border-bottom: 1.5px solid rgba(245, 158, 11, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .toki-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
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
      .toki-title-box {
        display: flex;
        flex-direction: column;
      }
      .toki-modal-title {
        font-size: 1.02rem;
        font-weight: 800;
        color: #92400e;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .toki-modal-sub {
        font-size: 0.72rem;
        font-weight: 600;
        color: #059669;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .toki-status-dot {
        width: 7px;
        height: 7px;
        background: #10b981;
        border-radius: 50%;
        display: inline-block;
      }

      .toki-header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
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
      .toki-icon-btn:hover {
        background: #ffffff;
        transform: scale(1.08);
        border-color: #f59e0b;
      }

      /* Animated Soundwave */
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
      .toki-soundwave-label {
        font-size: 0.70rem;
        font-weight: 700;
        color: #b45309;
        margin-right: 6px;
      }
      .toki-bar {
        width: 3px;
        height: 12px;
        background: #f59e0b;
        border-radius: 3px;
        animation: tokiWave 0.8s ease-in-out infinite alternate;
      }
      .toki-bar:nth-child(2) { animation-delay: 0.15s; height: 16px; }
      .toki-bar:nth-child(3) { animation-delay: 0.3s; height: 10px; }
      .toki-bar:nth-child(4) { animation-delay: 0.45s; height: 14px; }
      .toki-bar:nth-child(5) { animation-delay: 0.6s; height: 8px; }

      /* Quick Chips Bar */
      .toki-quick-chips {
        display: flex;
        gap: 6px;
        padding: 8px 14px;
        overflow-x: auto;
        background: #fafaf9;
        border-bottom: 1px solid #f1f5f9;
        scrollbar-width: none;
      }
      .toki-quick-chips::-webkit-scrollbar {
        display: none;
      }
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
      .toki-chip:hover {
        background: #fffbeb;
        border-color: #f59e0b;
        color: #b45309;
        transform: translateY(-1px);
      }

      /* Chat Messages Scroll Area */
      .toki-chat-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #ffffff;
      }
      .toki-msg {
        display: flex;
        gap: 10px;
        max-width: 88%;
        animation: tokiMsgSlide 0.25s ease-out;
      }
      .toki-msg.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      .toki-msg.assistant {
        align-self: flex-start;
      }
      .toki-msg-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 1.5px solid #f59e0b;
        flex-shrink: 0;
      }
      .toki-msg-bubble {
        padding: 10px 14px;
        border-radius: 16px;
        font-size: 0.85rem;
        line-height: 1.45;
        position: relative;
      }
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
      .toki-msg-meta {
        font-size: 0.68rem;
        margin-top: 4px;
        color: #94a3b8;
        font-weight: 500;
      }

      /* Input Footer */
      .toki-footer {
        padding: 12px 14px;
        background: #ffffff;
        border-top: 1.5px solid #f1f5f9;
        display: flex;
        align-items: center;
        gap: 8px;
      }
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
      .toki-input {
        width: 100%;
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.86rem;
        color: #1e293b;
      }
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
      .toki-mic-btn:hover {
        background: #fef3c7;
        transform: scale(1.05);
      }
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
      .toki-send-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 14px rgba(245, 158, 11, 0.45);
      }

      /* Animations */
      @keyframes tokiFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-7px); }
      }
      @keyframes tokiPulseBubble {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      @keyframes tokiGlow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.3); }
      }
      @keyframes tokiModalEntrance {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0px) scale(1); }
      }
      @keyframes tokiWave {
        from { height: 6px; }
        to { height: 16px; }
      }
      @keyframes tokiPulseSpeaking {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
        100% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      }
      @keyframes tokiPulseMic {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        100% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      }
      @keyframes tokiMsgSlide {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
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
        <span class="toki-bubble-text">👋 Hello, I'm Toki!</span>
        <span class="toki-bubble-sub">AI Copilot • Ask me</span>
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
            <span class="toki-modal-title">Toki AI Copilot</span>
            <span class="toki-modal-sub"><span class="toki-status-dot"></span> Big Team 01 Voice Assistant</span>
          </div>
        </div>
        <div class="toki-header-actions">
          <button type="button" class="toki-icon-btn" id="tokiSoundToggle" title="Toggle Voice Speech Output">🔊</button>
          <button type="button" class="toki-icon-btn" id="tokiClearChat" title="Clear Conversation">🗑️</button>
          <button type="button" class="toki-icon-btn" id="tokiCloseBtn" title="Close Assistant">✕</button>
        </div>
      </div>

      <!-- Animated Soundwave -->
      <div class="toki-soundwave-bar" id="tokiSoundwave">
        <span class="toki-soundwave-label">Toki is speaking...</span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
        <span class="toki-bar"></span>
      </div>

      <!-- Quick Chips -->
      <div class="toki-quick-chips">
        <button type="button" class="toki-chip" data-q="What is our cash gap and daily run rate needed?">💰 Cash Gap</button>
        <button type="button" class="toki-chip" data-q="Which specialists are behind benchmark today?">⚠️ Behind BM</button>
        <button type="button" class="toki-chip" data-q="Who are the top performers today?">🏆 Top Stars</button>
        <button type="button" class="toki-chip" data-q="What is our M2 upgrade progress toward 20%?">🚀 20% Upgrade</button>
        <button type="button" class="toki-chip" data-q="What are today 3 strategic moves?">📋 3 Daily Moves</button>
        <button type="button" class="toki-chip" data-q="Who has zero cash closed so far?">🎯 Zero Cash Reps</button>
        <button type="button" class="toki-chip" data-q="Check call cover rates for team">📞 Call Coverage</button>
      </div>

      <!-- Chat Messages Body -->
      <div class="toki-chat-body" id="tokiChatMessages">
        <!-- Initial Welcome Message -->
        <div class="toki-msg assistant">
          <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
          <div class="toki-msg-bubble">
            <strong>Hello Hussein! I'm Toki! 🌟</strong><br>
            I'm your Big Team 01 AI voice & performance assistant. Ask me anything about our sales reps, benchmark pacing, cash gaps, or tap a quick question above!
            <div class="toki-msg-meta">Just now • Voice Ready</div>
          </div>
        </div>
      </div>

      <!-- Footer Input Bar -->
      <div class="toki-footer">
        <button type="button" class="toki-mic-btn" id="tokiMicBtn" title="Click to speak (English)">🎤</button>
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

  // Format money helper
  function formatMoney(amountUSD) {
    if (typeof window.fmtCurr === 'function') {
      return window.fmtCurr(amountUSD);
    }
    return '$' + Math.round(amountUSD || 0).toLocaleString('en-US');
  }

  // Intelligent Knowledge Engine
  function generateAnswer(query) {
    const q = (query || '').toLowerCase().trim();
    const m = window.__model;
    const currBM = 41; // Day 16 standard BM

    if (!m) {
      return "I'm still loading Big Team 01 data from the portal. Please give me a second and ask again!";
    }

    const s = m.summary;

    // 1. Rep specific lookup
    for (const r of m.individuals) {
      const cleanName = r.name.replace(/^(ME-|EGSS\d+-)/i, '').toLowerCase();
      if (q.includes(cleanName) || (cleanName.length > 4 && q.includes(cleanName.substring(0, 5)))) {
        const gap = Math.max(0, r.target - r.cash);
        return `Specialist ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} has achieved ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%) against a ${formatMoney(r.target)} target. ` +
          `Closed ${r.contracts} contracts, Upgrade Base is ${r.upgradeBase} (with ${r.upgradeM2} M2 upgrades), and Call Cover rate is ${r.coverRate.toFixed(1)}%. ` +
          (r.achievement >= currBM ? `Pacing well above the ${currBM}% benchmark!` : `Currently behind the ${currBM}% benchmark by ${formatMoney(gap)}.`);
      }
    }

    // 2. Cash Gap & Velocity
    if (q.includes('gap') || q.includes('needed') || q.includes('run rate') || q.includes('velocity')) {
      return `Big Team 01 has a total cash gap of ${formatMoney(s.totalGap)} against our ${formatMoney(s.totalTarget)} monthly target. ` +
        `To close 100% of target by Day 30, the sector requires a daily closing velocity of ${formatMoney(s.dailyNeeded)} per day across all 5 Small Teams.`;
    }

    // 3. Behind Benchmark
    if (q.includes('behind') || q.includes('lagging') || q.includes('slow') || q.includes('danger') || q.includes('risk')) {
      const behind = m.individuals.filter(r => r.achievement < currBM);
      const names = behind.slice(0, 5).map(r => `${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (${r.achievement.toFixed(1)}%)`).join(', ');
      return `Currently, ${behind.length} specialists are pacing below today's ${currBM}% benchmark. ` +
        `Key priorities for coaching: ${names}. Morning 1-on-1 renewal alignment is recommended with their team leaders.`;
    }

    // 4. Top Stars
    if (q.includes('top') || q.includes('star') || q.includes('champion') || q.includes('best') || q.includes('#1') || q.includes('leader')) {
      const top3 = [...m.individuals].sort((a, b) => b.achievement - a.achievement).slice(0, 3);
      return `Our top 3 sales stars today are: ` +
        top3.map((r, i) => `#${i + 1} ${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} with ${formatMoney(r.cash)} (${r.achievement.toFixed(1)}%)`).join(', ') + `. ` +
        `Outstanding momentum across high-tier packages!`;
    }

    // 5. Zero Cash Reps
    if (q.includes('zero') || q.includes('no cash') || q.includes('0 cash')) {
      const zeroReps = m.individuals.filter(r => r.cash === 0);
      if (zeroReps.length === 0) {
        return `Awesome news! There are zero specialists with 0 cash — every rep in Big Team 01 has closed revenue!`;
      }
      return `There are currently ${zeroReps.length} specialists at zero cash MTD: ${zeroReps.map(r => r.name.replace(/^(ME-|EGSS\d+-)/i, '')).join(', ')}. Urgent follow-up is needed to activate their pipelines.`;
    }

    // 6. Upgrade M2 / 20%
    if (q.includes('upgrade') || q.includes('m2') || q.includes('20%')) {
      return `Big Team 01 has closed ${s.totalUpgradeM2} Upgrade M2 renewals toward our 20% milestone target of ${s.totalUpgrade20Target}. ` +
        `We need ${s.totalUpgrade20Needed} additional upgrades to secure the 20% incentive milestone. Focus on renewal students with less than 10 classes remaining.`;
    }

    // 7. Today's 3 Strategic Moves / Action Plan
    if (q.includes('move') || q.includes('moves') || q.includes('plan') || q.includes('strategy') || q.includes('today')) {
      return `Here are today's 3 executive priorities: ` +
        `Move 1: Hit ${formatMoney(s.dailyNeeded)} in daily cash closing to protect benchmark. ` +
        `Move 2: Hold coaching sprints with the 7 reps pacing below 41%. ` +
        `Move 3: Convert students with fewer than 10 remaining classes into M2 upgrade contracts.`;
    }

    // 8. Call Coverage
    if (q.includes('call') || q.includes('cover') || q.includes('coverage')) {
      const lowCall = m.individuals.filter(r => r.coverRate < 70);
      return `Overall team call cover rate is active. However, ${lowCall.length} reps have cover rates below 70%: ` +
        lowCall.slice(0, 4).map(r => `${r.name.replace(/^(ME-|EGSS\d+-)/i, '')} (${r.coverRate.toFixed(1)}%)`).join(', ') + `. Daily call cadence must be raised immediately.`;
    }

    // 9. Small Teams
    if (q.includes('team') || q.includes('pod') || q.includes('small team')) {
      const sortedTeams = Object.values(m.teams).sort((a, b) => b.achievement - a.achievement);
      return `Small Team rankings today: ` +
        sortedTeams.map((t, idx) => `#${idx + 1} ${t.label} (${t.achievement.toFixed(1)}% - ${formatMoney(t.cash)})`).join(', ') + `.`;
    }

    // 10. Greetings & General
    if (q.includes('hi') || q.includes('hello') || q.includes('toki') || q.includes('who are you') || q.includes('help')) {
      return `Hello Hussein! I'm Toki, your Big Team 01 AI Assistant! ` +
        `Right now our team has achieved ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing +${(s.achievement - currBM).toFixed(1)}% ahead of Day 16 benchmark. What would you like to check?`;
    }

    // Fallback Summary
    return `Big Team 01 has reached ${formatMoney(s.totalCash)} (${s.achievement.toFixed(1)}%), pacing ahead of benchmark with ${s.totalContracts} total contracts. ` +
      `Total gap to target is ${formatMoney(s.totalGap)}. Feel free to ask about any specific sales rep or metric!`;
  }

  // Append Message to UI
  function appendMessage(sender, text) {
    const chat = document.getElementById('tokiChatMessages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = `toki-msg ${sender}`;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'user') {
      msg.innerHTML = `
        <div class="toki-msg-bubble">
          ${text}
          <div class="toki-msg-meta" style="text-align: right; color: rgba(255,255,255,0.8);">${now}</div>
        </div>
      `;
    } else {
      msg.innerHTML = `
        <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
        <div class="toki-msg-bubble">
          <strong>Toki:</strong><br>
          ${text}
          <div class="toki-msg-meta">${now} • Spoken</div>
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

    appendMessage('user', q);

    const input = document.getElementById('tokiTextInput');
    if (input) input.value = '';

    const answer = generateAnswer(q);

    setTimeout(() => {
      appendMessage('assistant', answer);
      speak(answer);
    }, 250);
  }

  // Speech Recognition
  function initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('tokiMicBtn');
    if (!SpeechRec) {
      if (micBtn) {
        micBtn.title = 'Voice recognition not supported in this browser (use Chrome or Edge)';
        micBtn.style.opacity = '0.5';
      }
      return;
    }

    recognition = new SpeechRec();
    recognition.lang = 'en-US';
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
      if (transcript) {
        handleQuery(transcript);
      }
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
    try {
      recognition.start();
    } catch (e) {
      console.warn(e);
    }
  }

  function stopListening() {
    isListening = false;
    const micBtn = document.getElementById('tokiMicBtn');
    if (micBtn) {
      micBtn.classList.remove('listening');
      micBtn.textContent = '🎤';
      micBtn.title = 'Click to speak (English)';
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

    if (micBtn) {
      micBtn.onclick = toggleListening;
    }

    if (soundToggle) {
      soundToggle.onclick = () => {
        isSpeechEnabled = !isSpeechEnabled;
        if (!isSpeechEnabled) {
          stopSpeaking();
          soundToggle.textContent = '🔇';
          soundToggle.title = 'Voice Output Muted (Click to Unmute)';
        } else {
          soundToggle.textContent = '🔊';
          soundToggle.title = 'Voice Output Enabled (Click to Mute)';
        }
      };
    }

    if (clearBtn) {
      clearBtn.onclick = () => {
        const chat = document.getElementById('tokiChatMessages');
        if (chat) {
          chat.innerHTML = `
            <div class="toki-msg assistant">
              <img src="assets/toki.jpg" alt="Toki" class="toki-msg-avatar" />
              <div class="toki-msg-bubble">
                <strong>Conversation Reset 🔄</strong><br>
                What would you like to ask next, Hussein?
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

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTokiElements);
  } else {
    buildTokiElements();
  }

})();
