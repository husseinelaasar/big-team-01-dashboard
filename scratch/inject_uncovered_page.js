const fs = require('fs');

const indexPath = 'D:/Lens/Dashboard/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Insert tab button if not present
const tabBtnMarkup = `      <button class="tab" data-tab="uncovered" onclick="switchTab('uncovered')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
        Uncovered Leads (5,196)
        <span style="background: linear-gradient(135deg, #ef4444, #f97316); color: #fff; font-size: 0.65rem; padding: 2px 7px; border-radius: 10px; margin-left: 6px; font-weight: 700;">PRIORITY HUB</span>
      </button>`;

if (!content.includes('data-tab="uncovered"')) {
  const targetUpgradeTab = `</button>\n      <button class="tab" data-tab="englishclub"`;
  if (content.includes(targetUpgradeTab)) {
    content = content.replace(
      targetUpgradeTab,
      `</button>\n${tabBtnMarkup}\n      <button class="tab" data-tab="englishclub"`
    );
    console.log('[OK] Tab button injected into tab bar');
  } else {
    console.log('[WARN] Could not find target tab bar insertion point');
  }
} else {
  console.log('[INFO] Tab button already present');
}

// 2. Insert section markup
const sectionMarkup = `    <!-- ============================================== -->
    <!-- TAB: UNCOVERED LEADS & OUTREACH HUB            -->
    <!-- ============================================== -->
    <section id="tab-uncovered" class="tab-content">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <h2 style="display: flex; align-items: center; gap: 10px;">
            <span>🎯</span> Uncovered Leads &amp; Outreach Prioritization Hub
            <span class="status-badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-size: 0.75rem; padding: 2px 8px;">
              STUDENT_DETAIL26 COL H = 0
            </span>
            <span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.75rem; padding: 2px 8px;">
              CRM &amp; SOP RECONCILED
            </span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Targeted outreach cockpit: strictly excludes covered accounts (Col H == 1) and isolates all 5,196 uncovered students. Sorted by priority: high past-month class attendees ranked first, with longest uncontacted accounts escalated for immediate outreach.
          </p>
        </div>
        <span class="source-tag">Source: SS Lens Dashboard (Student_Detail26) + CRM Live + SOP Touches</span>
      </div>

      <!-- Top Executive KPI Deck (4 Cards) -->
      <div class="uncovered-kpi-deck" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 24px;">
        <!-- Card 1: Total Uncovered Accounts -->
        <div class="metric-tile-modern" style="border-top: 3px solid #ef4444;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em;">Total Uncovered Leads</span>
            <span class="pill-badge pill-badge-rose" style="font-size: 0.68rem;">Col H = 0</span>
          </div>
          <div class="kpi-value" style="font-family: var(--font-mono); font-size: 2rem; font-weight: 900; color: #fff; margin-top: 6px;" id="uncovCardTotal">5,196</div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 4px;">84.3% of Sector Total (968 Covered Excluded)</div>
        </div>

        <!-- Card 2: High & VIP Class Attendees -->
        <div class="metric-tile-modern" style="border-top: 3px solid #f59e0b;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em;">High &amp; VIP Attendees</span>
            <span class="pill-badge pill-badge-amber" style="font-size: 0.68rem;">&ge; 8 Classes</span>
          </div>
          <div class="kpi-value" style="font-family: var(--font-mono); font-size: 2rem; font-weight: 900; color: #fbbf24; margin-top: 6px;" id="uncovCardHigh">5</div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 4px;">Highest Churn Risk if Uncontacted</div>
        </div>

        <!-- Card 3: Active Regular Attendees -->
        <div class="metric-tile-modern" style="border-top: 3px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.05em;">Active Regular Learners</span>
            <span class="pill-badge pill-badge-emerald" style="font-size: 0.68rem;">&ge; 4 Classes</span>
          </div>
          <div class="kpi-value" style="font-family: var(--font-mono); font-size: 2rem; font-weight: 900; color: #34d399; margin-top: 6px;" id="uncovCardMed">499</div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 4px;">Prime Renewal &amp; Upgrade Prospects</div>
        </div>

        <!-- Card 4: Longest Uncontacted Accounts -->
        <div class="metric-tile-modern" style="border-top: 3px solid #6366f1;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 0.05em;">Longest Uncontacted</span>
            <span class="pill-badge pill-badge-purple" style="font-size: 0.68rem;">No Contact</span>
          </div>
          <div class="kpi-value" style="font-family: var(--font-mono); font-size: 2rem; font-weight: 900; color: #818cf8; margin-top: 6px;" id="uncovCardUncontacted">1,834</div>
          <div style="font-size: 0.74rem; color: #94a3b8; margin-top: 4px;">No Outreach Record in Current Cycle</div>
        </div>
      </div>

      <!-- Actionable Rep Downloads & Team Quick Access Toolbar -->
      <div class="glass-panel-executive" style="margin-bottom: 24px; padding: 20px; background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.72rem; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.06em;">Self-Service Export Center</span>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 2px 0 0 0; display: flex; align-items: center; gap: 8px;">
              <span>📥</span> Download Uncovered Leads Data (Individual SS, Small Teams &amp; Master)
            </h3>
          </div>
          <a href="leads/uncovered_leads/Master_Uncovered_Leads.csv" download="Master_Uncovered_Leads.csv" class="pill-badge pill-badge-cyan" style="text-decoration: none; padding: 8px 16px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Sector Master (5,196 Leads CSV)
          </a>
        </div>

        <!-- Download Selectors Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; align-items: center;">
          <!-- Individual SS Download Selector -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #a5b4fc; margin-bottom: 8px;">
              👤 Download for Specific Sales Specialist (21 Reps Available):
            </label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <select id="uncovRepDownloadSelect" class="modern-select" style="flex: 1; padding: 8px 12px; font-size: 0.82rem; background: var(--bg-card); color: #fff; border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 6px;">
                <!-- Populated dynamically with all 21 reps -->
              </select>
              <button type="button" id="btnDownloadSelectedRep" class="pill-badge pill-badge-purple" style="cursor: pointer; padding: 8px 14px; font-size: 0.82rem; font-weight: 700; border: none; white-space: nowrap;">
                📥 Download SS CSV
              </button>
            </div>
          </div>

          <!-- Small Teams Fast Download Buttons -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #34d399; margin-bottom: 8px;">
              🏢 Small Teams Quick Download:
            </label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <a href="leads/uncovered_leads/ME-EGSS01_Uncovered_Leads.csv" download="ME-EGSS01_Uncovered_Leads.csv" class="pill-badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); text-decoration: none; padding: 6px 10px; font-size: 0.76rem; font-weight: 700;">
                Team 01 (1,277)
              </a>
              <a href="leads/uncovered_leads/ME-EGSS05_Uncovered_Leads.csv" download="ME-EGSS05_Uncovered_Leads.csv" class="pill-badge" style="background: rgba(6, 182, 212, 0.2); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.4); text-decoration: none; padding: 6px 10px; font-size: 0.76rem; font-weight: 700;">
                Team 05 (1,508)
              </a>
              <a href="leads/uncovered_leads/ME-EGSS10_Uncovered_Leads.csv" download="ME-EGSS10_Uncovered_Leads.csv" class="pill-badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); text-decoration: none; padding: 6px 10px; font-size: 0.76rem; font-weight: 700;">
                Team 10 (836)
              </a>
              <a href="leads/uncovered_leads/ME-EGSS13_Uncovered_Leads.csv" download="ME-EGSS13_Uncovered_Leads.csv" class="pill-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); text-decoration: none; padding: 6px 10px; font-size: 0.76rem; font-weight: 700;">
                Team 13 (919)
              </a>
              <a href="leads/uncovered_leads/ME-EGSS30_Uncovered_Leads.csv" download="ME-EGSS30_Uncovered_Leads.csv" class="pill-badge" style="background: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); text-decoration: none; padding: 6px 10px; font-size: 0.76rem; font-weight: 700;">
                Team 30 (656)
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Data Sheet Table Viewer -->
      <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 18px;">
        <!-- Controls Header: Sorting Modes & Filter Tabs -->
        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
          <!-- Row 1: Sorting Mode Selector -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: rgba(30, 41, 59, 0.5); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-size: 0.78rem; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                ⚡ Sorting Priority:
              </span>
              <button type="button" class="pill-badge active" id="btnSortPriority" data-sort="priority" style="cursor: pointer; padding: 5px 12px; font-size: 0.76rem;">
                🌟 Composite Priority (High Classes First + Oldest Connection First)
              </button>
              <button type="button" class="pill-badge" id="btnSortClasses" data-sort="classes" style="cursor: pointer; padding: 5px 12px; font-size: 0.76rem;">
                🎓 Highest Classes Attended First
              </button>
              <button type="button" class="pill-badge" id="btnSortOldestConn" data-sort="oldest" style="cursor: pointer; padding: 5px 12px; font-size: 0.76rem;">
                ⏳ Longest Uncontacted First (Oldest &rarr; Newest)
              </button>
              <button type="button" class="pill-badge" id="btnSortNewestConn" data-sort="newest" style="cursor: pointer; padding: 5px 12px; font-size: 0.76rem;">
                🆕 Recently Contacted First (Newest &rarr; Oldest)
              </button>
              <button type="button" class="pill-badge" id="btnSortStuId" data-sort="id" style="cursor: pointer; padding: 5px 12px; font-size: 0.76rem;">
                🆔 Student ID
              </button>
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; font-family: var(--font-mono);">
              Default: Classes &darr; &bull; Connection Time &uarr;
            </div>
          </div>

          <!-- Row 2: Filter Tabs & Search Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <!-- Team & Tier Filter Pills -->
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;" id="uncovTableFilterTabs">
              <button type="button" class="pill-badge active" data-team="ALL" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">All Teams (5,196)</button>
              <button type="button" class="pill-badge" data-team="ME-EGSS01" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">Team 01 (1,277)</button>
              <button type="button" class="pill-badge" data-team="ME-EGSS05" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">Team 05 (1,508)</button>
              <button type="button" class="pill-badge" data-team="ME-EGSS10" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">Team 10 (836)</button>
              <button type="button" class="pill-badge" data-team="ME-EGSS13" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">Team 13 (919)</button>
              <button type="button" class="pill-badge" data-team="ME-EGSS30" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">Team 30 (656)</button>
              <span style="color: rgba(255,255,255,0.2); margin: 0 4px;">|</span>
              <button type="button" class="pill-badge pill-badge-amber" data-tier="HIGH" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">🔥 High (&ge;8 cls)</button>
              <button type="button" class="pill-badge pill-badge-emerald" data-tier="MED" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">⭐ Regular (&ge;4 cls)</button>
              <button type="button" class="pill-badge pill-badge-purple" data-tier="UNCONTACTED" style="cursor: pointer; padding: 5px 10px; font-size: 0.75rem;">⏳ Uncontacted (1,834)</button>
            </div>

            <!-- Rep Dropdown, Search & Export View -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <select id="uncovFilterRepSelect" class="modern-select" style="padding: 6px 10px; font-size: 0.78rem; background: var(--bg-card); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; width: 150px;">
                <option value="ALL">All 21 Reps</option>
              </select>
              <select id="uncovFilterPoolSelect" class="modern-select" style="padding: 6px 10px; font-size: 0.78rem; background: var(--bg-card); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; width: 130px;">
                <option value="ALL">All Pools</option>
                <option value="outside pool">outside pool</option>
                <option value="Upgrade M2">Upgrade M2</option>
                <option value="Exp Non-0">Exp Non-0</option>
                <option value="FOE Non-0">FOE Non-0</option>
                <option value="period">period</option>
              </select>
              <input type="text" id="uncovStudentSearchInput" class="modern-input" placeholder="🔍 Search Student ID, Rep, Source..." style="width: 220px; font-size: 0.8rem; padding: 6px 12px;">
              <button type="button" id="btnExportFilteredUncov" class="pill-badge pill-badge-cyan" style="cursor: pointer; padding: 6px 12px; font-size: 0.76rem; border: none; white-space: nowrap;">
                📥 Export Filtered View (CSV)
              </button>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="table-wrapper modern-table-card" style="max-height: 520px; overflow-y: auto;">
          <table class="data-table" id="uncoveredStudentsLiveTable" style="width: 100%;">
            <thead>
              <tr>
                <th style="width: 45px; text-align: center;">Rank #</th>
                <th style="min-width: 105px; text-align: left !important;">Student ID</th>
                <th style="min-width: 155px; text-align: left !important;">Sales Specialist</th>
                <th style="min-width: 110px; text-align: center;">Team</th>
                <th style="min-width: 105px; text-align: center;">Pool</th>
                <th style="min-width: 115px; text-align: center;">Attended Classes</th>
                <th style="min-width: 145px; text-align: center;">Last Connection Time</th>
                <th style="min-width: 140px; text-align: center;">Connection Source</th>
                <th style="min-width: 100px; text-align: center;">Last Paid Date</th>
                <th style="min-width: 180px; text-align: left !important;">Outreach Priority &amp; Directive</th>
                <th style="min-width: 90px; text-align: center;">Rep CSV</th>
              </tr>
            </thead>
            <tbody id="uncoveredStudentsLiveTableBody">
              <tr><td colspan="11" style="text-align: center; padding: 30px; color: var(--text-muted);">Loading uncovered leads data...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; flex-wrap: wrap; gap: 10px; font-size: 0.8rem; color: #94a3b8;">
          <div id="uncovTablePaginationInfo">Showing 1-25 of 5,196 student accounts</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" id="btnUncovFirstPage" class="pill-badge" style="cursor: pointer; padding: 4px 8px;">⏮ First</button>
            <button type="button" id="btnUncovPrevPage" class="pill-badge" style="cursor: pointer; padding: 4px 10px;">◀ Prev</button>
            <span id="uncovCurrentPageDisplay" style="color: #fff; font-weight: 700; font-family: var(--font-mono); margin: 0 4px;">1 / 208</span>
            <button type="button" id="btnUncovNextPage" class="pill-badge" style="cursor: pointer; padding: 4px 10px;">Next ▶</button>
            <button type="button" id="btnUncovLastPage" class="pill-badge" style="cursor: pointer; padding: 4px 8px;">Last ⏭</button>
            <select id="uncovPageSizeSelect" class="modern-select" style="padding: 2px 8px; font-size: 0.75rem; margin-left: 8px;">
              <option value="25" selected>25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
              <option value="250">250 per page</option>
            </select>
          </div>
        </div>
      </div>
    </section>
`;

if (!content.includes('id="tab-uncovered"')) {
  const insertMarker = '    <section id="tab-englishclub" class="tab-content">';
  if (content.includes(insertMarker)) {
    content = content.replace(insertMarker, sectionMarkup + '\n' + insertMarker);
    console.log('[OK] Section tab-uncovered injected before tab-englishclub');
  } else {
    console.log('[WARN] Could not find target section insertion point');
  }
} else {
  console.log('[INFO] Section tab-uncovered already present');
}

// 3. Inject script tag for uncovered_leads_data.js
if (!content.includes('leads/uncovered_leads_data.js')) {
  const scriptMarker = '<script src="dashboard.js';
  if (content.includes(scriptMarker)) {
    content = content.replace(scriptMarker, '<script src="leads/uncovered_leads_data.js" defer></script>\n  <script src="dashboard.js');
    console.log('[OK] Script tag for uncovered_leads_data.js injected');
  }
} else {
  console.log('[INFO] Script tag already present');
}

// Clean up trailing blank lines
content = content.replace(/(\n\s*){10,}$/, '\n');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('[SUCCESS] index.html updated successfully!');
