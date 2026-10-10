const fs = require('fs');

const jsPath = 'D:/Lens/Dashboard/dashboard.js';
let content = fs.readFileSync(jsPath, 'utf8');

// 1. Connect switchTab('uncovered')
const switchTabMarker = `  if (tabKey === 'comparison' && typeof renderComparisonTab === 'function') {
    renderComparisonTab();
  }`;

const uncoveredSwitchTabCode = `  if (tabKey === 'comparison' && typeof renderComparisonTab === 'function') {
    renderComparisonTab();
  }
  if (tabKey === 'uncovered' && typeof renderUncoveredTab === 'function') {
    renderUncoveredTab();
  }`;

if (!content.includes("tabKey === 'uncovered'")) {
  if (content.includes(switchTabMarker)) {
    content = content.replace(switchTabMarker, uncoveredSwitchTabCode);
    console.log('[OK] Hooked switchTab for uncovered tab');
  } else {
    console.log('[WARN] Could not find switchTab marker');
  }
}

// 2. Add initUncoveredLeads to renderSteps in DOMContentLoaded
const renderStepMarker = `    { name: 'initPersonalTeamSelect', fn: () => initPersonalTeamSelect() }`;
const newRenderStep = `    { name: 'initPersonalTeamSelect', fn: () => initPersonalTeamSelect() },
    { name: 'initUncoveredLeads', fn: () => initUncoveredLeads(model) }`;

if (!content.includes("'initUncoveredLeads'")) {
  if (content.includes(renderStepMarker)) {
    content = content.replace(renderStepMarker, newRenderStep);
    console.log('[OK] Added initUncoveredLeads to renderSteps');
  } else {
    console.log('[WARN] Could not find renderSteps marker');
  }
}

// 3. Append the Uncovered Leads Module Code at the end
const uncoveredModuleCode = `
// =========================================================================
// Official Uncovered Leads Data Hub & SS Prioritization Cockpit
// (Student_Detail26 Col H == 0, strictly excluding 1, prioritized by past classes & connection time)
// =========================================================================

let uncovState = {
  sort: 'priority', // 'priority', 'classes', 'oldest', 'newest', 'id'
  team: 'ALL',
  tier: 'ALL', // 'ALL', 'HIGH' (>=8), 'MED' (>=4), 'UNCONTACTED'
  rep: 'ALL',
  pool: 'ALL',
  search: '',
  page: 1,
  pageSize: 25
};

window.renderUncoveredTab = renderUncoveredTab;
window.initUncoveredLeads = initUncoveredLeads;

function initUncoveredLeads(model) {
  const tableBody = document.getElementById('uncoveredStudentsLiveTableBody');
  if (!tableBody) return;

  const dataset = window.UNCOVERED_LEADS_DATA;
  if (!dataset || !dataset.leads) {
    fetch('leads/uncovered_leads_data.json')
      .then(res => res.json())
      .then(data => {
        window.UNCOVERED_LEADS_DATA = data;
        initUncoveredLeads(model);
      })
      .catch(err => {
        console.error('Could not load uncovered leads data:', err);
      });
    return;
  }

  // 1. Populate Metrics Deck
  const meta = dataset.meta || {};
  const totalElem = document.getElementById('uncovCardTotal');
  const highElem = document.getElementById('uncovCardHigh');
  const medElem = document.getElementById('uncovCardMed');
  const uncontactedElem = document.getElementById('uncovCardUncontacted');

  if (totalElem) totalElem.textContent = (meta.totalUncovered || dataset.leads.length).toLocaleString();
  if (highElem) highElem.textContent = (meta.highTierCount || 0).toLocaleString();
  if (medElem) medElem.textContent = (meta.mediumTierCount || 0).toLocaleString();
  if (uncontactedElem) uncontactedElem.textContent = (meta.uncontactedCount || 0).toLocaleString();

  // 2. Populate Rep Selectors
  const repDownloadSelect = document.getElementById('uncovRepDownloadSelect');
  const filterRepSelect = document.getElementById('uncovFilterRepSelect');

  if (repDownloadSelect && repDownloadSelect.options.length <= 1) {
    repDownloadSelect.innerHTML = '';
    const repKeys = Object.keys(meta.repBreakdown || {}).sort();
    repKeys.forEach(repName => {
      const info = meta.repBreakdown[repName];
      const opt = document.createElement('option');
      opt.value = repName;
      opt.textContent = \`\${repName} (\${info.team}) — \${info.total} Uncovered Leads\`;
      repDownloadSelect.appendChild(opt);
    });
  }

  if (filterRepSelect && filterRepSelect.options.length <= 1) {
    const repKeys = Object.keys(meta.repBreakdown || {}).sort();
    repKeys.forEach(repName => {
      const opt = document.createElement('option');
      opt.value = repName;
      opt.textContent = repName;
      filterRepSelect.appendChild(opt);
    });
  }

  // 3. Download Selected Rep Handler
  const btnDownloadRep = document.getElementById('btnDownloadSelectedRep');
  if (btnDownloadRep && !btnDownloadRep.__bound) {
    btnDownloadRep.__bound = true;
    btnDownloadRep.addEventListener('click', () => {
      const selRep = repDownloadSelect ? repDownloadSelect.value : '';
      if (!selRep) {
        alert('Please select a Sales Specialist from the list first.');
        return;
      }
      downloadRepUncoveredCsv(selRep);
    });
  }

  // 4. Bind Sorting Mode Buttons
  const sortButtons = [
    { id: 'btnSortPriority', mode: 'priority' },
    { id: 'btnSortClasses', mode: 'classes' },
    { id: 'btnSortOldestConn', mode: 'oldest' },
    { id: 'btnSortNewestConn', mode: 'newest' },
    { id: 'btnSortStuId', mode: 'id' }
  ];
  sortButtons.forEach(sb => {
    const btn = document.getElementById(sb.id);
    if (btn && !btn.__bound) {
      btn.__bound = true;
      btn.addEventListener('click', () => {
        sortButtons.forEach(s => {
          const b = document.getElementById(s.id);
          if (b) b.classList.remove('active');
        });
        btn.classList.add('active');
        uncovState.sort = sb.mode;
        uncovState.page = 1;
        renderUncoveredTab();
      });
    }
  });

  // 5. Bind Filter Tabs (Team and Tier)
  const filterTabsContainer = document.getElementById('uncovTableFilterTabs');
  if (filterTabsContainer && !filterTabsContainer.__bound) {
    filterTabsContainer.__bound = true;
    filterTabsContainer.querySelectorAll('button[data-team]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterTabsContainer.querySelectorAll('button[data-team]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        uncovState.team = e.currentTarget.getAttribute('data-team') || 'ALL';
        uncovState.page = 1;
        renderUncoveredTab();
      });
    });

    filterTabsContainer.querySelectorAll('button[data-tier]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.currentTarget.classList.contains('active')) {
          e.currentTarget.classList.remove('active');
          uncovState.tier = 'ALL';
        } else {
          filterTabsContainer.querySelectorAll('button[data-tier]').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          uncovState.tier = e.currentTarget.getAttribute('data-tier') || 'ALL';
        }
        uncovState.page = 1;
        renderUncoveredTab();
      });
    });
  }

  // 6. Bind Rep & Pool Dropdown Filters
  if (filterRepSelect && !filterRepSelect.__bound) {
    filterRepSelect.__bound = true;
    filterRepSelect.addEventListener('change', (e) => {
      uncovState.rep = e.target.value;
      uncovState.page = 1;
      renderUncoveredTab();
    });
  }

  const filterPoolSelect = document.getElementById('uncovFilterPoolSelect');
  if (filterPoolSelect && !filterPoolSelect.__bound) {
    filterPoolSelect.__bound = true;
    filterPoolSelect.addEventListener('change', (e) => {
      uncovState.pool = e.target.value;
      uncovState.page = 1;
      renderUncoveredTab();
    });
  }

  // 7. Bind Search Input
  const searchInput = document.getElementById('uncovStudentSearchInput');
  if (searchInput && !searchInput.__bound) {
    searchInput.__bound = true;
    searchInput.addEventListener('input', (e) => {
      uncovState.search = e.target.value.trim().toLowerCase();
      uncovState.page = 1;
      renderUncoveredTab();
    });
  }

  // 8. Bind Export Filtered View Button
  const btnExport = document.getElementById('btnExportFilteredUncov');
  if (btnExport && !btnExport.__bound) {
    btnExport.__bound = true;
    btnExport.addEventListener('click', () => {
      exportCurrentFilteredUncoveredCsv();
    });
  }

  // 9. Bind Pagination Controls
  const btnFirst = document.getElementById('btnUncovFirstPage');
  const btnPrev = document.getElementById('btnUncovPrevPage');
  const btnNext = document.getElementById('btnUncovNextPage');
  const btnLast = document.getElementById('btnUncovLastPage');
  const pageSizeSelect = document.getElementById('uncovPageSizeSelect');

  if (btnFirst && !btnFirst.__bound) {
    btnFirst.__bound = true;
    btnFirst.addEventListener('click', () => {
      if (uncovState.page > 1) {
        uncovState.page = 1;
        renderUncoveredTab();
      }
    });
  }

  if (btnPrev && !btnPrev.__bound) {
    btnPrev.__bound = true;
    btnPrev.addEventListener('click', () => {
      if (uncovState.page > 1) {
        uncovState.page--;
        renderUncoveredTab();
      }
    });
  }

  if (btnNext && !btnNext.__bound) {
    btnNext.__bound = true;
    btnNext.addEventListener('click', () => {
      const filtered = getFilteredUncoveredLeads();
      const totalPages = Math.ceil(filtered.length / uncovState.pageSize) || 1;
      if (uncovState.page < totalPages) {
        uncovState.page++;
        renderUncoveredTab();
      }
    });
  }

  if (btnLast && !btnLast.__bound) {
    btnLast.__bound = true;
    btnLast.addEventListener('click', () => {
      const filtered = getFilteredUncoveredLeads();
      const totalPages = Math.ceil(filtered.length / uncovState.pageSize) || 1;
      if (uncovState.page < totalPages) {
        uncovState.page = totalPages;
        renderUncoveredTab();
      }
    });
  }

  if (pageSizeSelect && !pageSizeSelect.__bound) {
    pageSizeSelect.__bound = true;
    pageSizeSelect.addEventListener('change', (e) => {
      uncovState.pageSize = parseInt(e.target.value, 10) || 25;
      uncovState.page = 1;
      renderUncoveredTab();
    });
  }

  // Initial Table Render
  renderUncoveredTab();
}

function getFilteredUncoveredLeads() {
  const dataset = window.UNCOVERED_LEADS_DATA;
  if (!dataset || !Array.isArray(dataset.leads)) return [];

  let list = dataset.leads;

  // 1. Team filter
  if (uncovState.team !== 'ALL') {
    list = list.filter(l => l.Team === uncovState.team);
  }

  // 2. Tier filter
  if (uncovState.tier === 'HIGH') {
    list = list.filter(l => (l.AttendedClasses || 0) >= 8);
  } else if (uncovState.tier === 'MED') {
    list = list.filter(l => (l.AttendedClasses || 0) >= 4 && (l.AttendedClasses || 0) < 8);
  } else if (uncovState.tier === 'UNCONTACTED') {
    list = list.filter(l => !l.LastConnectionTime || l.LastConnectionTime === '1970-01-01 00:00:00');
  }

  // 3. Rep filter
  if (uncovState.rep !== 'ALL') {
    list = list.filter(l => l.Rep.toLowerCase() === uncovState.rep.toLowerCase());
  }

  // 4. Pool filter
  if (uncovState.pool !== 'ALL') {
    list = list.filter(l => (l.PoolDetail && l.PoolDetail.includes(uncovState.pool)) || (l.Pool && l.Pool.includes(uncovState.pool)));
  }

  // 5. Search filter
  if (uncovState.search) {
    const q = uncovState.search;
    list = list.filter(l =>
      String(l.StudentId).toLowerCase().includes(q) ||
      String(l.Rep).toLowerCase().includes(q) ||
      String(l.Team).toLowerCase().includes(q) ||
      String(l.PoolDetail).toLowerCase().includes(q) ||
      String(l.ConnectionSource).toLowerCase().includes(q) ||
      String(l.ConnectionDisplay).toLowerCase().includes(q) ||
      String(l.RecommendedAction).toLowerCase().includes(q)
    );
  }

  // 6. Sorting logic
  const sortMode = uncovState.sort;
  const sorted = [...list].sort((a, b) => {
    if (sortMode === 'priority') {
      // Primary: AttendedClasses DESCENDING (High classes first)
      if (b.AttendedClasses !== a.AttendedClasses) {
        return (b.AttendedClasses || 0) - (a.AttendedClasses || 0);
      }
      // Secondary: LastConnectionTime ASCENDING (Oldest to newest)
      const timeA = a.LastConnectionTime || '1970-01-01 00:00:00';
      const timeB = b.LastConnectionTime || '1970-01-01 00:00:00';
      return timeA.localeCompare(timeB);
    } else if (sortMode === 'classes') {
      if (b.AttendedClasses !== a.AttendedClasses) {
        return (b.AttendedClasses || 0) - (a.AttendedClasses || 0);
      }
      return String(a.StudentId).localeCompare(String(b.StudentId));
    } else if (sortMode === 'oldest') {
      const timeA = a.LastConnectionTime || '1970-01-01 00:00:00';
      const timeB = b.LastConnectionTime || '1970-01-01 00:00:00';
      if (timeA !== timeB) return timeA.localeCompare(timeB);
      return (b.AttendedClasses || 0) - (a.AttendedClasses || 0);
    } else if (sortMode === 'newest') {
      const timeA = a.LastConnectionTime || '1970-01-01 00:00:00';
      const timeB = b.LastConnectionTime || '1970-01-01 00:00:00';
      if (timeB !== timeA) return timeB.localeCompare(timeA);
      return (b.AttendedClasses || 0) - (a.AttendedClasses || 0);
    } else if (sortMode === 'id') {
      return String(a.StudentId).localeCompare(String(b.StudentId));
    }
    return 0;
  });

  return sorted;
}

function renderUncoveredTab() {
  const tbody = document.getElementById('uncoveredStudentsLiveTableBody');
  const paginationInfo = document.getElementById('uncovTablePaginationInfo');
  const pageDisplay = document.getElementById('uncovCurrentPageDisplay');
  const btnPrev = document.getElementById('btnUncovPrevPage');
  const btnNext = document.getElementById('btnUncovNextPage');
  const btnFirst = document.getElementById('btnUncovFirstPage');
  const btnLast = document.getElementById('btnUncovLastPage');

  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = getFilteredUncoveredLeads();
  const total = filtered.length;
  const pageSize = uncovState.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (uncovState.page > totalPages) uncovState.page = totalPages;
  if (uncovState.page < 1) uncovState.page = 1;

  const startIdx = (uncovState.page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = filtered.slice(startIdx, endIdx);

  if (pageRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 30px; color: #94a3b8;">No matching uncovered student accounts found for selected filters.</td></tr>';
  } else {
    pageRows.forEach((row, i) => {
      const rankNum = startIdx + i + 1;
      const isHighClass = (row.AttendedClasses || 0) >= 8;
      const isMedClass = (row.AttendedClasses || 0) >= 4 && (row.AttendedClasses || 0) < 8;
      const isUncontacted = (!row.LastConnectionTime || row.LastConnectionTime === '1970-01-01 00:00:00');

      // Rank styling
      let rankBadge = \`<span class="pill-badge" style="background: rgba(148, 163, 184, 0.1); color: #94a3b8; font-weight: 700;">#\${rankNum}</span>\`;
      if (rankNum <= 10) {
        rankBadge = \`<span class="pill-badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 800;">🔥 #\${rankNum}</span>\`;
      } else if (rankNum <= 50) {
        rankBadge = \`<span class="pill-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 800;">⭐ #\${rankNum}</span>\`;
      }

      // Class Attendance Tier Badge
      let classBadge = \`<span style="font-family: var(--font-mono); color: #64748b;">\${row.AttendedClasses || 0} cls</span>\`;
      if ((row.AttendedClasses || 0) >= 12) {
        classBadge = \`<span class="pill-badge pill-badge-purple" style="font-weight: 800; font-family: var(--font-mono); font-size: 0.78rem;">💎 \${row.AttendedClasses} cls</span>\`;
      } else if ((row.AttendedClasses || 0) >= 8) {
        classBadge = \`<span class="pill-badge pill-badge-amber" style="font-weight: 800; font-family: var(--font-mono); font-size: 0.78rem;">🔥 \${row.AttendedClasses} cls</span>\`;
      } else if ((row.AttendedClasses || 0) >= 4) {
        classBadge = \`<span class="pill-badge pill-badge-emerald" style="font-weight: 700; font-family: var(--font-mono); font-size: 0.78rem;">⭐ \${row.AttendedClasses} cls</span>\`;
      } else if ((row.AttendedClasses || 0) > 0) {
        classBadge = \`<span class="pill-badge" style="background: rgba(148, 163, 184, 0.15); color: #cbd5e1; font-family: var(--font-mono);">\${row.AttendedClasses} cls</span>\`;
      }

      // Connection Display & Source Badge
      let connTimeDisplay = \`<span style="font-family: var(--font-mono); font-size: 0.78rem; color: #cbd5e1;">\${row.ConnectionDisplay}</span>\`;
      if (isUncontacted) {
        connTimeDisplay = \`<span class="pill-badge pill-badge-rose" style="font-size: 0.72rem; font-weight: 700;">⚠️ Uncontacted</span>\`;
      }

      // Connection Source Badge
      let sourceBadge = \`<span class="pill-badge" style="background: rgba(148, 163, 184, 0.1); color: #94a3b8; font-size: 0.72rem;">\${row.ConnectionSource}</span>\`;
      if (row.ConnectionSource === 'CRM System Outreach') {
        sourceBadge = \`<span class="pill-badge pill-badge-cyan" style="font-size: 0.72rem;">CRM Live Outreach</span>\`;
      } else if (row.ConnectionSource === 'SOP Completed Touch') {
        sourceBadge = \`<span class="pill-badge pill-badge-emerald" style="font-size: 0.72rem;">SOP Completed</span>\`;
      } else if (row.ConnectionSource === 'Last 1v1 Payment') {
        sourceBadge = \`<span class="pill-badge pill-badge-purple" style="font-size: 0.72rem;">1v1 Paid Record</span>\`;
      } else if (row.ConnectionSource === 'SOP Task Assigned') {
        sourceBadge = \`<span class="pill-badge pill-badge-amber" style="font-size: 0.72rem;">SOP Queued</span>\`;
      }

      // Directive / Action Badge
      let actionHtml = \`<span style="font-size: 0.76rem; color: #94a3b8;">\${row.RecommendedAction || 'Standard Outreach'}</span>\`;
      if (isHighClass) {
        actionHtml = \`<span style="font-size: 0.76rem; color: #f87171; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">🚨 High Consumer Churn Risk</span>\`;
      } else if (isMedClass) {
        actionHtml = \`<span style="font-size: 0.76rem; color: #34d399; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">⭐ Regular Learner - Upgrade Pitch</span>\`;
      } else if (isUncontacted) {
        actionHtml = \`<span style="font-size: 0.76rem; color: #fbbf24; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">⏳ Urgent Reconnection</span>\`;
      }

      const teamBadge = typeof renderTeamBadge === 'function' ? renderTeamBadge(row.Team) : \`<span class="pill-badge">\${row.Team}</span>\`;

      const tr = document.createElement('tr');
      if (isHighClass) {
        tr.style.background = 'rgba(239, 68, 68, 0.06)';
      } else if (isMedClass) {
        tr.style.background = 'rgba(16, 185, 129, 0.04)';
      }

      tr.innerHTML = \`
        <td style="text-align: center;">\${rankBadge}</td>
        <td style="text-align: left !important;">
          <strong style="font-family: var(--font-mono); color: #fff; letter-spacing: 0.5px;">\${row.StudentId}</strong>
        </td>
        <td style="text-align: left !important;">
          <span style="color: #e2e8f0; font-weight: 600;">\${row.Rep}</span>
        </td>
        <td style="text-align: center;">\${teamBadge}</td>
        <td style="text-align: center;">
          <span class="pill-badge" style="background: rgba(255,255,255,0.05); color: #cbd5e1; font-size: 0.72rem;">\${row.PoolDetail || row.Pool}</span>
        </td>
        <td style="text-align: center;">\${classBadge}</td>
        <td style="text-align: center;">\${connTimeDisplay}</td>
        <td style="text-align: center;">\${sourceBadge}</td>
        <td style="text-align: center; font-family: var(--font-mono); font-size: 0.75rem; color: #94a3b8;">\${row.LastPaidDate || '-'}</td>
        <td style="text-align: left !important;">\${actionHtml}</td>
        <td style="text-align: center;">
          <a href="leads/uncovered_leads/\${row.Rep}_Uncovered_Leads.csv" download="\${row.Rep}_Uncovered_Leads.csv" class="pill-badge pill-badge-cyan" style="text-decoration: none; padding: 3px 8px; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 4px;">
            <span>📥</span> CSV
          </a>
        </td>
      \`;
      tbody.appendChild(tr);
    });
  }

  // Update pagination indicators
  if (paginationInfo) {
    paginationInfo.textContent = total > 0
      ? \`Showing \${startIdx + 1}-\${endIdx} of \${total.toLocaleString()} student accounts (Sort: \${uncovState.sort} | Team: \${uncovState.team})\`
      : 'Showing 0 student accounts';
  }
  if (pageDisplay) {
    pageDisplay.textContent = \`\${uncovState.page} / \${totalPages}\`;
  }
  if (btnFirst) btnFirst.disabled = (uncovState.page <= 1);
  if (btnPrev) btnPrev.disabled = (uncovState.page <= 1);
  if (btnNext) btnNext.disabled = (uncovState.page >= totalPages);
  if (btnLast) btnLast.disabled = (uncovState.page >= totalPages);
}

function downloadRepUncoveredCsv(repName) {
  if (!repName) return;
  const link = \`leads/uncovered_leads/\${repName}_Uncovered_Leads.csv\`;
  const a = document.createElement('a');
  a.href = link;
  a.download = \`\${repName}_Uncovered_Leads.csv\`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function exportCurrentFilteredUncoveredCsv() {
  const filtered = getFilteredUncoveredLeads();
  if (filtered.length === 0) {
    alert('No student records in current view to export.');
    return;
  }

  const csvHeader = 'Priority_Rank,Student_ID,Sales_Specialist,Team,Big_Team,Pool,Pool_Detail,Attended_Classes_Prev_Months,Booked_Unattended_Classes,Attendance_Tier,Last_Connection_Time,Connection_Display,Connection_Source,Last_1V1_Payment_Date,Recommended_Action,Is_Covered\\r\\n';
  const csvRows = filtered.map((l, i) =>
    \`"\${i + 1}","\${l.StudentId}","\${l.Rep}","\${l.Team}","\${l.BigTeam}","\${l.Pool}","\${l.PoolDetail}",\${l.AttendedClasses || 0},\${l.BookedUnattended || 0},"\${l.AttendanceTier}","\${l.LastConnectionTime}","\${l.ConnectionDisplay}","\${l.ConnectionSource}","\${l.LastPaidDate}","\${l.RecommendedAction}",0\`
  ).join('\\r\\n');

  const fullCsv = csvHeader + csvRows;
  triggerCsvDownload(fullCsv, \`Uncovered_Leads_Filtered_\${uncovState.team}_\${filtered.length}_accounts.csv\`);
}
`;

if (!content.includes('function initUncoveredLeads')) {
  content += '\n' + uncoveredModuleCode;
  console.log('[OK] Uncovered Leads Module appended to dashboard.js');
} else {
  console.log('[INFO] Uncovered Leads Module already present in dashboard.js');
}

fs.writeFileSync(jsPath, content, 'utf8');
console.log('[SUCCESS] dashboard.js updated successfully!');
