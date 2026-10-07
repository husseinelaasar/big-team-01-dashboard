const fs = require('fs');

const jsonPath = 'd:/Lens/Dashboard/leads/upgrade_base_data.json';
const rawJson = fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, '');
const studentsData = JSON.parse(rawJson);

console.log('Read students:', studentsData.length);

const dashboardJsPath = 'd:/Lens/Dashboard/dashboard.js';
let content = fs.readFileSync(dashboardJsPath, 'utf8');

// 1. Prepare UPGRADE_BASE_STUDENTS constant
const upgDataDeclaration = `// Official October 2026 Authoritative Upgrade Base Students Dataset (497 Student Accounts)\nconst UPGRADE_BASE_STUDENTS = ${JSON.stringify(studentsData, null, 2)};\n\n`;

// Check if already present or replace
if (content.includes('const UPGRADE_BASE_STUDENTS =')) {
  content = content.replace(/const UPGRADE_BASE_STUDENTS = [\s\S]*?;\n\n(?=const|function|\/\/)/, upgDataDeclaration);
} else {
  // Insert before renderUpgradeTab
  content = content.replace(/(function renderUpgradeTab\(model\) \{)/, `${upgDataDeclaration}$1`);
}

// 2. Update renderUpgradeTableRows to include the Data Sheet download column
const oldRowHtml = `        <td style="text-align: center;">\${statusBadge}</td>
        <td style="text-align: left !important; font-size: 0.8rem; line-height: 1.4; color: #cbd5e1;">
          \${rec}
        </td>
      \`;
      tbody.appendChild(tr);`;

const newRowHtml = `        <td style="text-align: center;">\${statusBadge}</td>
        <td style="text-align: left !important; font-size: 0.8rem; line-height: 1.4; color: #cbd5e1;">
          \${rec}
        </td>
        <td style="text-align: center;">
          <a href="leads/upgrade_base/\${r.name}_Upgrade_Base.csv" download="\${r.name}_Upgrade_Base.csv" class="pill-badge pill-badge-cyan" style="text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; padding: 3px 8px; cursor: pointer;" title="Download \${r.name}'s assigned Upgrade Base CSV">
            <span>📥</span> Leads
          </a>
        </td>
      \`;
      tbody.appendChild(tr);`;

if (content.includes(oldRowHtml)) {
  content = content.replace(oldRowHtml, newRowHtml);
  console.log('[OK] Added Data Sheet column to upgrade table rows');
} else {
  console.log('[INFO] Old row HTML pattern not matched directly, checking if already updated');
}

// 3. Update tfoot in renderUpgradeTableRows to include the 13th column
const oldFootHtml = `          <td style="text-align: left !important; color: #38bdf8; font-size: 0.8rem; font-weight: 600;">
            \${totalActiveNeed > 0 ? \`Sector Gap: Close \${totalActiveNeed} contracts across remaining \${totalActiveBase - totalActiveUp} students to reach 20% standard.\` : 'Goal fully met!'}
          </td>
        </tr>
      \`;`;

const newFootHtml = `          <td style="text-align: left !important; color: #38bdf8; font-size: 0.8rem; font-weight: 600;">
            \${totalActiveNeed > 0 ? \`Sector Gap: Close \${totalActiveNeed} contracts across remaining \${totalActiveBase - totalActiveUp} students to reach 20% standard.\` : 'Goal fully met!'}
          </td>
          <td style="text-align: center;">
            <a href="leads/upgrade_base/M1_M2_Upgrade_Base_Master.csv" download="M1_M2_Upgrade_Base_Master.csv" class="pill-badge pill-badge-purple" style="text-decoration: none; padding: 4px 8px; font-size: 0.72rem; font-weight: 700;">
              📦 All
            </a>
          </td>
        </tr>
      \`;`;

if (content.includes(oldFootHtml)) {
  content = content.replace(oldFootHtml, newFootHtml);
  console.log('[OK] Added Data Sheet column to upgrade table tfoot');
}

// 4. Ensure initUpgradeBaseLeadsHub is called and defined
const initCallCode = `  // 3. Render Master Full Upgrade Table
  renderUpgradeTableRows();

  // 3b. Initialize & Render Upgrade Base Leads Hub (Data Sheet & Member Downloads)
  initUpgradeBaseLeadsHub(model);`;

content = content.replace(
  /\/\/ 3\. Render Master Full Upgrade Table\s*renderUpgradeTableRows\(\);/,
  initCallCode
);

// 5. Definition of initUpgradeBaseLeadsHub and helper functions
const hubFunctions = `
// =========================================================================
// Official Upgrade Base Data Sheets & Individual Member Downloads Hub
// =========================================================================
let upgHubState = {
  filter: 'ALL',
  search: '',
  page: 1,
  pageSize: 25
};

function initUpgradeBaseLeadsHub(model) {
  const selectElem = document.getElementById('memberUpgradeSelect');
  const btnDownload = document.getElementById('btnDownloadMemberUpg');
  const tableBody = document.getElementById('upgradeStudentsLiveTableBody');

  if (!tableBody) return;

  // 1. Populate Reps Dropdown (if not populated)
  if (selectElem && selectElem.options.length <= 1) {
    // Sort reps by team then name
    const sortedReps = [...model.individuals].sort((a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name));
    sortedReps.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.name;
      const upgBadge = r.upgradeM2 > 0 ? \` | \${r.upgradeM2} Upgrades Met ⭐\` : '';
      opt.textContent = \`\${r.name} (\${r.team}) — \${r.upgradeBase} Leads\${upgBadge}\`;
      selectElem.appendChild(opt);
    });
  }

  // 2. Download Selected Rep Handler
  if (btnDownload && !btnDownload.__bound) {
    btnDownload.__bound = true;
    btnDownload.addEventListener('click', () => {
      const selVal = selectElem?.value;
      if (!selVal) {
        alert('Please select your Sales Specialist name from the dropdown list first.');
        return;
      }
      downloadRepUpgradeCsv(selVal);
    });
  }

  // 3. Bind Table Filter Tabs
  const filterTabsContainer = document.getElementById('upgTableFilterTabs');
  if (filterTabsContainer && !filterTabsContainer.__bound) {
    filterTabsContainer.__bound = true;
    filterTabsContainer.querySelectorAll('button[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterTabsContainer.querySelectorAll('button[data-filter]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        upgHubState.filter = e.currentTarget.getAttribute('data-filter') || 'ALL';
        upgHubState.page = 1;
        renderUpgradeStudentsLiveTable();
      });
    });
  }

  // 4. Bind Search Input
  const searchInput = document.getElementById('upgStudentSearchInput');
  if (searchInput && !searchInput.__bound) {
    searchInput.__bound = true;
    searchInput.addEventListener('input', (e) => {
      upgHubState.search = e.target.value.trim().toLowerCase();
      upgHubState.page = 1;
      renderUpgradeStudentsLiveTable();
    });
  }

  // 5. Bind Export Filtered View Button
  const btnExport = document.getElementById('btnExportFilteredUpg');
  if (btnExport && !btnExport.__bound) {
    btnExport.__bound = true;
    btnExport.addEventListener('click', () => {
      exportCurrentFilteredUpgradeCsv();
    });
  }

  // 6. Bind Pagination Controls
  const btnPrev = document.getElementById('btnUpgPrevPage');
  const btnNext = document.getElementById('btnUpgNextPage');
  const pageSizeSelect = document.getElementById('upgPageSizeSelect');

  if (btnPrev && !btnPrev.__bound) {
    btnPrev.__bound = true;
    btnPrev.addEventListener('click', () => {
      if (upgHubState.page > 1) {
        upgHubState.page--;
        renderUpgradeStudentsLiveTable();
      }
    });
  }

  if (btnNext && !btnNext.__bound) {
    btnNext.__bound = true;
    btnNext.addEventListener('click', () => {
      const filtered = getFilteredUpgradeStudents();
      const totalPages = Math.ceil(filtered.length / upgHubState.pageSize) || 1;
      if (upgHubState.page < totalPages) {
        upgHubState.page++;
        renderUpgradeStudentsLiveTable();
      }
    });
  }

  if (pageSizeSelect && !pageSizeSelect.__bound) {
    pageSizeSelect.__bound = true;
    pageSizeSelect.addEventListener('change', (e) => {
      upgHubState.pageSize = parseInt(e.target.value, 10) || 25;
      upgHubState.page = 1;
      renderUpgradeStudentsLiveTable();
    });
  }

  // Initial Table Render
  renderUpgradeStudentsLiveTable();
}

function getFilteredUpgradeStudents() {
  if (typeof UPGRADE_BASE_STUDENTS === 'undefined' || !Array.isArray(UPGRADE_BASE_STUDENTS)) return [];
  let list = UPGRADE_BASE_STUDENTS;

  // Filter tab
  if (upgHubState.filter === 'UPGRADED') {
    list = list.filter(s => s.UpgradeM2 === 1);
  } else if (upgHubState.filter === 'PENDING') {
    list = list.filter(s => s.UpgradeM2 === 0);
  } else if (upgHubState.filter !== 'ALL') {
    list = list.filter(s => s.TeamCode === upgHubState.filter || (s.TeamName && s.TeamName.includes(upgHubState.filter)));
  }

  // Search filter
  if (upgHubState.search) {
    const q = upgHubState.search;
    list = list.filter(s => 
      String(s.StudentID).toLowerCase().includes(q) ||
      String(s.Representative).toLowerCase().includes(q) ||
      String(s.TeamCode).toLowerCase().includes(q) ||
      String(s.Status).toLowerCase().includes(q)
    );
  }

  return list;
}

function renderUpgradeStudentsLiveTable() {
  const tbody = document.getElementById('upgradeStudentsLiveTableBody');
  const paginationInfo = document.getElementById('upgTablePaginationInfo');
  const pageDisplay = document.getElementById('upgCurrentPageDisplay');
  const btnPrev = document.getElementById('btnUpgPrevPage');
  const btnNext = document.getElementById('btnUpgNextPage');

  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = getFilteredUpgradeStudents();
  const total = filtered.length;
  const pageSize = upgHubState.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (upgHubState.page > totalPages) upgHubState.page = totalPages;
  if (upgHubState.page < 1) upgHubState.page = 1;

  const startIdx = (upgHubState.page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = filtered.slice(startIdx, endIdx);

  if (pageRows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #94a3b8;">No matching upgrade student records found.</td></tr>';
  } else {
    pageRows.forEach((row, i) => {
      const idx = startIdx + i + 1;
      const isUpgraded = row.UpgradeM2 === 1;
      const statusBadge = isUpgraded 
        ? '<span class="pill-badge pill-badge-emerald" style="font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">✅ Upgraded (M2 Closed)</span>'
        : '<span class="pill-badge pill-badge-amber" style="display: inline-flex; align-items: center; gap: 4px;">⏳ Target / In Progress</span>';

      const teamBadge = typeof renderTeamBadge === 'function' ? renderTeamBadge(row.TeamCode) : \`<span class="pill-badge">\${row.TeamCode}</span>\`;

      const tr = document.createElement('tr');
      if (isUpgraded) {
        tr.style.background = 'rgba(16, 185, 129, 0.05)';
      }
      tr.innerHTML = \`
        <td style="font-family: var(--font-mono); color: var(--text-dim); text-align: center;">\${idx}</td>
        <td style="text-align: left !important;">
          <strong style="font-family: var(--font-mono); color: #fff; letter-spacing: 0.5px;">\${row.StudentID}</strong>
        </td>
        <td style="text-align: left !important;">
          <span style="color: #e2e8f0; font-weight: 600;">\${row.Representative}</span>
        </td>
        <td style="text-align: center;">\${teamBadge}</td>
        <td style="text-align: center;">\${statusBadge}</td>
        <td style="text-align: center;">
          <a href="leads/upgrade_base/\${row.Representative}_Upgrade_Base.csv" download="\${row.Representative}_Upgrade_Base.csv" class="pill-badge pill-badge-cyan" style="text-decoration: none; padding: 3px 8px; font-size: 0.72rem; display: inline-flex; align-items: center; gap: 4px;">
            <span>📥</span> Rep CSV
          </a>
        </td>
      \`;
      tbody.appendChild(tr);
    });
  }

  // Update pagination indicators
  if (paginationInfo) {
    paginationInfo.textContent = total > 0 
      ? \`Showing \${startIdx + 1}-\${endIdx} of \${total} student accounts (\${upgHubState.filter} filter)\`
      : 'Showing 0 student accounts';
  }
  if (pageDisplay) {
    pageDisplay.textContent = \`\${upgHubState.page} / \${totalPages}\`;
  }
  if (btnPrev) btnPrev.disabled = (upgHubState.page <= 1);
  if (btnNext) btnNext.disabled = (upgHubState.page >= totalPages);
}

function downloadRepUpgradeCsv(repName) {
  if (!repName) return;
  const filtered = (typeof UPGRADE_BASE_STUDENTS !== 'undefined' ? UPGRADE_BASE_STUDENTS : []).filter(s => s.Representative.toLowerCase() === repName.toLowerCase());
  if (filtered.length === 0) {
    // Direct static link fallback
    window.location.href = \`leads/upgrade_base/\${repName}_Upgrade_Base.csv\`;
    return;
  }

  const csvHeader = 'StudentID,Representative,TeamCode,TeamName,UpgradeM2,Status\\r\\n';
  const csvRows = filtered.map(s => \`"\${s.StudentID}","\${s.Representative}","\${s.TeamCode}","\${s.TeamName}",\${s.UpgradeM2},"\${s.Status}"\`).join('\\r\\n');
  const fullCsv = csvHeader + csvRows;

  triggerCsvDownload(fullCsv, \`\${repName}_Upgrade_Base.csv\`);
}

function exportCurrentFilteredUpgradeCsv() {
  const filtered = getFilteredUpgradeStudents();
  if (filtered.length === 0) {
    alert('No student records in current view to export.');
    return;
  }

  const csvHeader = 'StudentID,Representative,TeamCode,TeamName,UpgradeM2,Status\\r\\n';
  const csvRows = filtered.map(s => \`"\${s.StudentID}","\${s.Representative}","\${s.TeamCode}","\${s.TeamName}",\${s.UpgradeM2},"\${s.Status}"\`).join('\\r\\n');
  const fullCsv = csvHeader + csvRows;

  triggerCsvDownload(fullCsv, \`Upgrade_Base_Filtered_\${upgHubState.filter}_\${filtered.length}_leads.csv\`);
}

function triggerCsvDownload(csvString, filename) {
  const blob = new Blob(["\\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
`;

// Insert hubFunctions if not already present
if (!content.includes('function initUpgradeBaseLeadsHub(')) {
  content += '\n' + hubFunctions;
  console.log('[OK] Added hubFunctions to dashboard.js');
}

fs.writeFileSync(dashboardJsPath, content, 'utf8');
console.log('[OK] Successfully updated dashboard.js');
