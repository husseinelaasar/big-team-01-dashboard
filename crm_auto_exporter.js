/**
 * 51Talk Master Live CRM Automated Exporter (v38.0 - PERMANENT PRODUCTION STANDARD)
 * ======================================================================================
 * Official Automated Ingestion Pipeline for Big Team 01 (Senior Manager: Saber Hussien)
 * Downloads all 5 official raw CRM reference workbooks directly & 100% live from QuickBI:
 *   1. Student-Detail (SS Lens Dashboard_Student-Detail_*.xlsx)
 *   2. Area Hierarchy (SS Lens Dashboard_Area_Big Team_Small Team_SS_*.xlsx, Full 33 Rows Expanded)
 *   3. English Club (中东English Club数据看板_ Details_*.xlsx)
 *   4. Full Master Dashboard (SS Lens Dashboard_*.xlsx, Full Multi-Sheet 1.3 MB)
 *   5. Overseas NEW SOP (海外NEW_SOP_*.xlsx, Extracted 100% Fresh from Master Dashboard)
 * ZERO Reliance on Backups - 100% Live Fresh Data Capture
 * ======================================================================================
 */

const puppeteer = require('D:\\Lens\\node_modules\\puppeteer-core');
const fs        = require('fs');
const path      = require('path');
const { execFileSync, execSync } = require('child_process');

const CHROME_PATH   = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR   = 'D:\\Lens\\automation_chrome_profile';
const DOWNLOADS_DIR = 'C:\\Users\\husse\\Downloads';

function getDefaultTargetDir() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return path.join('D:\\Lens\\Dashboard\\Data Center', `${now.getDate()}${months[now.getMonth()]}`);
}
const TARGET_INPUTS_DIR = process.argv[2] || getDefaultTargetDir();

// ============================================================================
// 1. TELEMETRY & TRACKING SYSTEM
// ============================================================================
class TelemetryAuditTracker {
    constructor(targetDir) {
        this.targetDir = targetDir;
        this.startTime = Date.now();
        this.reports = {
            1: { name: 'Student-Detail (All Student Records)', category: 'Student-Detail', status: 'PENDING', attempts: 0, file: null, sizeKb: 0, healingApplied: [], logs: [], diagnostics: [] },
            2: { name: 'Area Hierarchy (33-Row Sector/Team Tree)', category: 'Area Hierarchy', status: 'PENDING', attempts: 0, file: null, sizeKb: 0, healingApplied: [], logs: [], diagnostics: [] },
            3: { name: 'Overseas NEW SOP (Pending & Tasks Details)', category: 'Overseas NEW SOP', status: 'PENDING', attempts: 0, file: null, sizeKb: 0, healingApplied: [], logs: [], diagnostics: [] },
            4: { name: 'English Club (Attendance & Target Base)', category: 'English Club', status: 'PENDING', attempts: 0, file: null, sizeKb: 0, healingApplied: [], logs: [], diagnostics: [] },
            5: { name: 'Full Master Dashboard (33 Multi-Sheet CRM)', category: 'Full Master Dashboard', status: 'PENDING', attempts: 0, file: null, sizeKb: 0, healingApplied: [], logs: [], diagnostics: [] }
        };
    }

    log(id, msg) {
        const ts = new Date().toISOString().substring(11, 19);
        const line = `[${ts}] ${msg}`;
        console.log(`   ${line}`);
        if (this.reports[id]) {
            this.reports[id].logs.push(line);
        }
    }

    recordAttempt(id) {
        if (this.reports[id]) {
            this.reports[id].attempts += 1;
        }
    }

    recordHealing(id, actionDesc) {
        const ts = new Date().toISOString().substring(11, 19);
        const entry = `[${ts}] ${actionDesc}`;
        console.log(`   🛠️ [SELF-HEALING FIX] ${actionDesc}`);
        if (this.reports[id]) {
            this.reports[id].healingApplied.push(entry);
        }
    }

    recordDiagnostic(id, diagData) {
        if (this.reports[id]) {
            this.reports[id].diagnostics.push(diagData);
        }
    }

    recordSuccess(id, filePath, sizeBytes) {
        if (this.reports[id]) {
            this.reports[id].status = 'PASS';
            this.reports[id].file = path.basename(filePath);
            this.reports[id].fullPath = filePath;
            this.reports[id].sizeKb = Number((sizeBytes / 1024).toFixed(1));
        }
    }

    recordFailure(id, errorMsg) {
        if (this.reports[id] && this.reports[id].status !== 'PASS') {
            this.reports[id].status = 'FAIL';
            this.reports[id].error = errorMsg;
        }
    }

    printSummaryAndSave() {
        const durationSec = ((Date.now() - this.startTime) / 1000).toFixed(1);
        let passCount = 0;
        Object.values(this.reports).forEach(r => { if (r.status === 'PASS') passCount++; });

        console.log('\n========================================================================================');
        console.log(`📊 51TALK CRM EXPORT AUDIT & TELEMETRY REPORT (Total Time: ${durationSec}s)`);
        console.log(`   Target Destination: ${this.targetDir}`);
        console.log(`   Success Rate: ${passCount} / 5 Verified Fresh Files`);
        console.log('========================================================================================');
        console.log(
            '#'.padEnd(4) +
            'Category'.padEnd(26) +
            'Status'.padEnd(10) +
            'Attempts'.padEnd(11) +
            'Size (KB)'.padEnd(12) +
            'Healing Fixes Applied'
        );
        console.log('-'.repeat(88));

        for (let i = 1; i <= 5; i++) {
            const r = this.reports[i];
            const statusStr = r.status === 'PASS' ? '✔ PASS' : '❌ FAIL';
            const healingStr = r.healingApplied.length > 0 
                ? r.healingApplied.map(h => h.replace(/^\[.*?\]\s*/, '')).join('; ')
                : 'None (Clean Run)';
            console.log(
                `[${i}]`.padEnd(4) +
                r.category.padEnd(26) +
                statusStr.padEnd(10) +
                String(r.attempts).padEnd(11) +
                String(r.sizeKb || 0).padEnd(12) +
                healingStr
            );
        }
        console.log('========================================================================================\n');

        try {
            const outReportPath = path.join(this.targetDir, 'audit_tracking_report.json');
            fs.writeFileSync(outReportPath, JSON.stringify({
                timestamp: new Date().toISOString(),
                durationSeconds: parseFloat(durationSec),
                passCount: passCount,
                totalExpected: 5,
                success: passCount === 5,
                reports: this.reports
            }, null, 2));
            console.log(`   📝 Telemetry audit report persisted to: ${outReportPath}\n`);
        } catch(e) {}
    }
}

// ============================================================================
// 2. CHROME CRASH PREVENTION & PROFILE CLEANER
// ============================================================================
function sanitizeChromeProfile() {
    console.log('   -> Sanitizing Chrome Profile & Eliminating Crash Warnings...');
    try {
        execFileSync('powershell.exe', [
            '-NoProfile',
            '-Command',
            "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*automation_chrome_profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"
        ], { stdio: 'ignore' });
    } catch(e) {}

    const lockFiles = ['DevToolsActivePort', 'LOCK', 'SingletonLock', 'SingletonSocket', 'SingletonCookie', 'lockfile'];
    for (const lf of lockFiles) {
        try {
            const p = path.join(PROFILE_DIR, lf);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch(e) {}
    }

    try {
        const prefPath = path.join(PROFILE_DIR, 'Default', 'Preferences');
        if (fs.existsSync(prefPath)) {
            let prefs = JSON.parse(fs.readFileSync(prefPath, 'utf8'));
            if (!prefs.profile) prefs.profile = {};
            prefs.profile.exit_type = 'Normal';
            prefs.profile.exited_cleanly = true;
            if (!prefs.profile.default_content_setting_values) prefs.profile.default_content_setting_values = {};
            prefs.profile.default_content_setting_values.automatic_downloads = 1;
            fs.writeFileSync(prefPath, JSON.stringify(prefs));
        }
    } catch(e) {}
}

// ============================================================================
// 3. ROBUST QUICKBI FRAME LOCATOR (EXACT + DYNAMIC RESILIENT FALLBACK)
// ============================================================================
async function findBiFrame(page, pageIdSubstr = null, maxWaitSeconds = 15) {
    const deadline = Date.now() + maxWaitSeconds * 1000;
    const start = Date.now();
    while (Date.now() < deadline) {
        const frames = page.frames();
        let fallbackFrame = null;
        for (const frame of frames) {
            try {
                const url = frame.url();
                const isBi = url.includes('bi.aliyun') || url.includes('quickbi') || url.includes('dashboard') || url.includes('token3rd');
                if (!isBi) continue;

                const alive = await frame.evaluate(() => document.readyState === 'complete' || document.readyState === 'interactive').catch(() => false);
                if (!alive) continue;

                if (pageIdSubstr && url.includes(pageIdSubstr)) {
                    return frame;
                }
                if (!fallbackFrame) {
                    fallbackFrame = frame;
                }
            } catch(e) {}
        }
        if (fallbackFrame && (Date.now() - start >= 4000)) {
            return fallbackFrame;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    return null;
}

async function navigateAndEnsureBiFrame(page, menuName, targetUrl, pageIdSubstr, reportId, tracker) {
    tracker.log(reportId, `Navigating to ${menuName} (${targetUrl})...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));

    // Enforce zh-CN so menu item titles are never empty in Chinese backend
    await page.evaluate(() => {
        try {
            if (localStorage.getItem('actualLangCode') !== 'zh-CN') {
                localStorage.setItem('language', JSON.stringify({ currlang: 'zh-CN', langList: [] }));
                localStorage.setItem('actualLangCode', 'zh-CN');
                localStorage.setItem('ulicb-langcode', 'zh-CN');
                localStorage.setItem('currLang', 'zh-CN');
                localStorage.setItem('responsive-locale', JSON.stringify({ locale: 'zh-CN' }));
            }
        } catch(e) {}
    });

    let currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('ams.51talkjr.com')) {
        tracker.log(reportId, `⚠️ Login screen detected. Submitting stored credentials...`);
        await page.evaluate(() => {
            const btn = document.querySelector('button[type="submit"], .ant-btn-primary, button');
            if (btn) btn.click();
        }).catch(() => {});
        await new Promise(r => setTimeout(r, 4000));
    }

    // Check if QuickBI iframe is already loaded
    let biFrame = await findBiFrame(page, pageIdSubstr, 6);
    if (biFrame) return biFrame;

    // Click data-center and leaf menu item (Multilingual: Chinese, English, Arabic, and SVG Icon Agnostic)
    await page.evaluate((name) => {
        window.dispatchEvent(new Event('resize'));

        // 1. Data Center Menu (Multilingual + SVG Icon #shujuzhongxin)
        const dcKeywords = ['数据中心', 'data center', 'مركز البيانات', 'datacenter'];
        let dc = Array.from(document.querySelectorAll('.wy-sidebar__menu *')).find(e => {
            const txt = (e.innerText || '').trim().toLowerCase();
            return dcKeywords.some(k => txt === k || txt.includes(k));
        });
        if (!dc) {
            dc = document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.closest('.el-sub-menu__title') ||
                 document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.closest('li') ||
                 document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.parentElement;
        }
        if (dc) dc.click();

        // 2. Leaf Item (Multilingual + SVG Icon Agnostic)
        const leafItems = Array.from(document.querySelectorAll('.el-menu-item:not(.el-sub-menu), .wy-menu__item--level-2, .el-menu-item'));
        const isLens = name.includes('Lens') || name.includes('SA-SS') || name.includes('لينس') || name.includes('看板');
        const isEC = name.includes('English') || name.includes('Club') || name.includes('انجليزي') || name.includes('إنجليزي') || name.includes('俱乐部');

        let target = leafItems.find(e => {
            const txt = (e.innerText || '').trim().toLowerCase();
            if (isLens && (txt.includes('lens') || txt.includes('sa-ss') || txt.includes('看板') || txt.includes('لينس'))) return true;
            if (isEC && (txt.includes('english') || txt.includes('club') || txt.includes('英语') || txt.includes('نادي'))) return true;
            return (e.innerText || '').trim() === name || (e.innerText || '').includes(name);
        });

        if (!target) {
            if (isLens) {
                target = leafItems.find(e => e.querySelector('use[*|href*="AIgenjinzhong"]'));
            } else if (isEC) {
                target = leafItems.find(e => e.querySelector('use[*|href*="AIzhuanrengong"]'));
            }
        }
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'center' });
            target.click();
            target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
    }, menuName).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));

    biFrame = await findBiFrame(page, pageIdSubstr, 12);
    if (biFrame) return biFrame;

    // Self-healing: Route transition recovery via welcome bounce
    tracker.recordHealing(reportId, 'QuickBI iframe delayed: triggering route transition recovery via welcome bounce');
    await page.goto('https://lp.51talkjr.com/#/welcome', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate((name) => {
        const dcKeywords = ['数据中心', 'data center', 'مركز البيانات', 'datacenter'];
        let dc = Array.from(document.querySelectorAll('.wy-sidebar__menu *')).find(e => {
            const txt = (e.innerText || '').trim().toLowerCase();
            return dcKeywords.some(k => txt === k || txt.includes(k));
        });
        if (!dc) {
            dc = document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.closest('.el-sub-menu__title') ||
                 document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.closest('li') ||
                 document.querySelector('.wy-sidebar__menu use[*|href*="shujuzhongxin"]')?.parentElement;
        }
        if (dc) dc.click();

        const leafItems = Array.from(document.querySelectorAll('.el-menu-item:not(.el-sub-menu), .wy-menu__item--level-2, .el-menu-item'));
        const isLens = name.includes('Lens') || name.includes('SA-SS') || name.includes('لينس') || name.includes('看板');
        const isEC = name.includes('English') || name.includes('Club') || name.includes('انجليزي') || name.includes('إنجليزي') || name.includes('俱乐部');

        let target = leafItems.find(e => {
            const txt = (e.innerText || '').trim().toLowerCase();
            if (isLens && (txt.includes('lens') || txt.includes('sa-ss') || txt.includes('看板') || txt.includes('لينس'))) return true;
            if (isEC && (txt.includes('english') || txt.includes('club') || txt.includes('英语') || txt.includes('نادي'))) return true;
            return (e.innerText || '').trim() === name || (e.innerText || '').includes(name);
        });

        if (!target) {
            if (isLens) {
                target = leafItems.find(e => e.querySelector('use[*|href*="AIgenjinzhong"]'));
            } else if (isEC) {
                target = leafItems.find(e => e.querySelector('use[*|href*="AIzhuanrengong"]'));
            }
        }
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'center' });
            target.click();
            target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
    }, menuName).catch(() => {});

    biFrame = await findBiFrame(page, pageIdSubstr, 15);
    if (biFrame) return biFrame;

    throw new Error(`QuickBI frame for ${menuName} (${pageIdSubstr}) failed to mount after self-healing.`);
}

// ============================================================================
// 4. PRECISE COORDINATE CLICK & MODAL CONFIRMATION
// ============================================================================
async function clickInFrameViaCoordinates(page, frame, elementInfo) {
    try {
        let clickX, clickY;
        if (!frame || frame === page) {
            clickX = Math.round(elementInfo.x + (elementInfo.width || elementInfo.w || 10) / 2);
            clickY = Math.round(elementInfo.y + (elementInfo.height || elementInfo.h || 10) / 2);
        } else {
            const iframeHandle = await frame.frameElement();
            const iframeBox = await iframeHandle.boundingBox();
            if (!iframeBox) return null;
            clickX = Math.round(iframeBox.x + elementInfo.x + (elementInfo.width || elementInfo.w || 10) / 2);
            clickY = Math.round(iframeBox.y + elementInfo.y + (elementInfo.height || elementInfo.h || 10) / 2);
        }
        if (clickX > 0 && clickY > 0 && clickX < 1920 && clickY < 1080) {
            await page.mouse.move(clickX, clickY);
            await new Promise(r => setTimeout(r, 150));
            await page.mouse.click(clickX, clickY);
            return { clickX, clickY };
        }
    } catch(e) {}
    return null;
}

async function clickModalConfirm(frame, page, maxAttempts = 15) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(r => setTimeout(r, 1000));
        for (const ctx of [frame, page].filter(Boolean)) {
            try {
                const btnInfo = await ctx.evaluate(() => {
                    const modals = Array.from(document.querySelectorAll('.ant-modal, [role="dialog"], .ant-modal-content, .next-dialog, .next-overlay-wrapper, .qbi-modal-content, .bi-modal-content'));
                    for (const m of modals) {
                        const style = window.getComputedStyle(m);
                        if (style.display === 'none' || style.visibility === 'hidden') continue;
                        const buttons = Array.from(m.querySelectorAll('button, .ant-btn, .next-btn'));
                        
                        // 1. Multilingual matching (Chinese, English, Arabic)
                        const confirmWords = ['ok', '确定', '确认', 'confirm', 'yes', 'موافق', 'تأكيد', 'نعم', 'حفظ', 'save'];
                        let btn = buttons.find(b => {
                            const cleanTxt = (b.innerText || '').replace(/\s+/g, '').toLowerCase();
                            return confirmWords.some(w => cleanTxt === w);
                        });

                        // 2. Structural & Class fallback (primary button inside modal footer or modal)
                        if (!btn) {
                            btn = m.querySelector('.ant-modal-footer .ant-btn-primary:not([disabled]), .ant-modal-footer button.ant-btn-primary') ||
                                  m.querySelector('.next-dialog-footer .next-btn-primary:not([disabled])') ||
                                  buttons.find(b => b.classList.contains('ant-btn-primary') && !b.hasAttribute('disabled')) ||
                                  m.querySelector('button[type="submit"]:not([disabled])');
                        }

                        if (btn) {
                            try { btn.click(); } catch(e) {}
                            const r = btn.getBoundingClientRect();
                            return { x: r.x, y: r.y, width: r.width, height: r.height };
                        }
                    }
                    return null;
                });

                if (btnInfo) {
                    await clickInFrameViaCoordinates(page, ctx === page ? null : frame, btnInfo);
                    return true;
                }
            } catch(e) {}
        }
    }
    return false;
}

async function clickExportMenuItem(frame, page) {
    for (const ctx of [frame, page].filter(Boolean)) {
        try {
            const clicked = await ctx.evaluate(() => {
                const selectors = [
                    '.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item',
                    '.ant-dropdown-menu-item:not(.ant-dropdown-menu-item-disabled)',
                    '.bi-menu-item',
                    '.next-menu-item',
                    '[role="menuitem"]',
                    '.ant-dropdown-menu li',
                    '.qbi-dropdown-menu-item',
                    'li', 'div', 'span'
                ];
                // Multilingual keywords: English, Chinese, Arabic
                const exportKeywords = ['export', '导出', 'تصدير', 'download', '下载', 'تحميل', 'تنزيل'];

                for (const sel of selectors) {
                    const items = Array.from(document.querySelectorAll(sel));
                    let target = items.find(i => {
                        if (i.children.length > 2) return false;
                        const txt = (i.innerText || '').trim().toLowerCase();
                        return exportKeywords.some(k => txt.includes(k));
                    });

                    // Structural / Icon fallback: if text didn't match, check for download / export icons
                    if (!target) {
                        target = items.find(i => i.querySelector('i.anticon-download, i.anticon-export, [data-icon="download"], [data-icon="export"], use[*|href*="download"], use[*|href*="daochu"]') !== null);
                    }

                    if (target) {
                        target.scrollIntoView({ behavior: 'instant', block: 'center' });
                        target.click();
                        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                        return true;
                    }
                }
                return false;
            });
            if (clicked) return true;
        } catch(e) {}
    }
    return false;
}

// ============================================================================
// 5. MULTI-CHANNEL DOWNLOAD MONITOR (STAGING + USER DOWNLOADS)
// ============================================================================
async function setupDownload(browser, page, dir) {
    try {
        const cdp = await page.target().createCDPSession();
        await cdp.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: dir });
    } catch(e) {}
    try {
        const cdpBrowser = await browser.target().createCDPSession();
        await cdpBrowser.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dir, eventsEnabled: true }).catch(() => {});
    } catch(e) {}
}

async function waitForNewDownload(existingFiles, timeoutSeconds = 90, minSize = 2000, fileNameFilter = null) {
    const start = Date.now();
    while ((Date.now() - start) < timeoutSeconds * 1000) {
        await new Promise(r => setTimeout(r, 1000));
        
        // 1. Check TARGET_INPUTS_DIR
        let current = [];
        try {
            current = fs.readdirSync(TARGET_INPUTS_DIR).filter(f =>
                f.endsWith('.xlsx') && !f.endsWith('.crdownload') && !f.startsWith('~$'));
        } catch(e) { continue; }

        let newFiles = current.filter(f => {
            if (fileNameFilter && !fileNameFilter.some(kw => f.includes(kw))) return false;
            const fullP = path.join(TARGET_INPUTS_DIR, f);
            try {
                const st = fs.statSync(fullP);
                if (st.mtimeMs >= start - 3000 && st.size >= minSize) return true;
            } catch(e) {}
            if (existingFiles.includes(f)) return false;
            return true;
        });

        // 2. Also check C:\Users\husse\Downloads
        if (newFiles.length === 0 && fs.existsSync(DOWNLOADS_DIR)) {
            try {
                const dlFiles = fs.readdirSync(DOWNLOADS_DIR).filter(f =>
                    f.endsWith('.xlsx') && !f.endsWith('.crdownload') && !f.startsWith('~$'));
                for (const df of dlFiles) {
                    if (fileNameFilter && !fileNameFilter.some(kw => df.includes(kw))) continue;
                    const fullP = path.join(DOWNLOADS_DIR, df);
                    const st = fs.statSync(fullP);
                    if (st.mtimeMs >= start - 15000 && st.size >= minSize) {
                        const targetP = path.join(TARGET_INPUTS_DIR, df);
                        try {
                            fs.copyFileSync(fullP, targetP);
                            newFiles.push(df);
                        } catch(e) {}
                    }
                }
            } catch(e) {}
        }

        if (newFiles.length > 0) {
            newFiles.sort((a,b) => fs.statSync(path.join(TARGET_INPUTS_DIR,b)).mtimeMs - fs.statSync(path.join(TARGET_INPUTS_DIR,a)).mtimeMs);
            const p = path.join(TARGET_INPUTS_DIR, newFiles[0]);
            try {
                if (fs.statSync(p).size >= minSize) {
                    await new Promise(r => setTimeout(r, 1500));
                    return p;
                }
            } catch(e) {}
        }
    }
    return null;
}

// ============================================================================
// 6. MASTER EXPORTER
// ============================================================================
async function runExporter() {
    console.log('========================================================================');
    console.log('   51TALK LIVE CRM EXPORTER (v38.0 - PERMANENT PRODUCTION STANDARD)');
    console.log(`   Target Directory: ${TARGET_INPUTS_DIR}`);
    console.log('========================================================================');

    if (!fs.existsSync(TARGET_INPUTS_DIR)) {
        fs.mkdirSync(TARGET_INPUTS_DIR, { recursive: true });
    }

    const tracker = new TelemetryAuditTracker(TARGET_INPUTS_DIR);
    sanitizeChromeProfile();
    await new Promise(r => setTimeout(r, 1500));

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        userDataDir: PROFILE_DIR,
        headless: false,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-notifications',
            '--disable-session-crashed-bubble',
            '--hide-crash-restore-bubble',
            '--no-default-browser-check',
            '--no-first-run',
            '--disable-features=SessionCrashedBubble,InfiniteSessionRestore',
            '--lang=zh-CN',
            '--window-size=1920,1080'
        ]
    });

    const page = (await browser.pages())[0] || await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await setupDownload(browser, page, TARGET_INPUTS_DIR);

    try {
        // =====================================================================
        // [1/5] Student-Detail Table (Full Student Records)
        // =====================================================================
        const r1Id = 1;
        console.log('\n------------------------------------------------------------------------');
        console.log('>>> [1/5] EXPORTING: Student-Detail Table (Full Student Records)...');
        console.log('------------------------------------------------------------------------');

        for (let attempt = 1; attempt <= 2; attempt++) {
            tracker.recordAttempt(r1Id);
            try {
                let existingFiles = fs.readdirSync(TARGET_INPUTS_DIR);
                let biFrame = await navigateAndEnsureBiFrame(page, '中东 Lens 看板', 'https://lp.51talkjr.com/#/data-center/business/SA-SSdata', '9255940d', r1Id, tracker);
                await setupDownload(browser, page, TARGET_INPUTS_DIR);

                tracker.log(r1Id, 'Switching to Effective Coverage tab...');
                await biFrame.evaluate(() => {
                    const coverageWords = ['effective coverage', 'coverage', '有效覆盖', '覆盖', 'التغطية الفعالة', 'التغطية', 'تغطية'];
                    const tabs = Array.from(document.querySelectorAll('.ant-tabs-tab, .bi-tab, [role="tab"], *')).filter(el => {
                        const t = (el.innerText || '').trim().toLowerCase();
                        return coverageWords.some(w => t.includes(w));
                    });
                    if (tabs.length > 0) tabs[tabs.length - 1].click();
                });
                await new Promise(r => setTimeout(r, 6000));
                biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;

                tracker.log(r1Id, 'Scrolling down 3500px to Student-Detail table...');
                await biFrame.evaluate(() => {
                    window.scrollTo(0, 3500);
                    for (const el of Array.from(document.querySelectorAll('*'))) {
                        if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = 3500;
                    }
                });

                tracker.log(r1Id, 'Waiting 20s for complete Student-Detail table calculation...');
                await new Promise(r => setTimeout(r, 20000));
                biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;

                // Ensure no single-team filter restricts student records
                const filterCleared = await biFrame.evaluate(() => {
                    let clearedCount = 0;
                    const clearIcons = Array.from(document.querySelectorAll('.ant-select-clear, .common-close, .bi-filter-clear, [class*="clear-icon"]'));
                    for (const c of clearIcons) {
                        if (c && c.offsetParent !== null) {
                            try { c.click(); clearedCount++; } catch(e) {}
                        }
                    }
                    return clearedCount;
                });
                if (filterCleared > 0) {
                    tracker.log(r1Id, `Cleared ${filterCleared} filter(s) to guarantee all 5 teams. Waiting 6s...`);
                    await new Promise(r => setTimeout(r, 6000));
                    biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;
                }

                const dotsInfo = await biFrame.evaluate(() => {
                    const titleEl = Array.from(document.querySelectorAll('*')).find(e =>
                        (e.innerText||'').trim() === 'Student-Detail' && e.children.length === 0);
                    if (!titleEl) return null;
                    let card = titleEl.closest('.component-card-wrapper') || titleEl.closest('.bi-layout-tile');
                    if (!card) {
                        let p = titleEl.parentElement;
                        while (p && p.tagName !== 'BODY') {
                            if (p.querySelector('.common-more-outlined, .more-icon, i.anticon-more')) { card = p; break; }
                            p = p.parentElement;
                        }
                    }
                    const searchRoot = card || document;
                    const more = searchRoot.querySelector('.common-more-outlined, .more-icon, i.anticon-more');
                    if (!more) return null;

                    more.classList.remove('card-menu-hide');
                    more.style.opacity = '1';
                    more.style.visibility = 'visible';
                    more.scrollIntoView({ behavior: 'instant', block: 'center' });
                    const rect = more.getBoundingClientRect();
                    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, visible: rect.width > 0 && rect.height > 0 };
                });

                if (dotsInfo && dotsInfo.visible) {
                    tracker.log(r1Id, 'Clicking Student-Detail 3-dots...');
                    await clickInFrameViaCoordinates(page, biFrame, dotsInfo);
                    await new Promise(r => setTimeout(r, 1500));

                    const exportClicked = await biFrame.evaluate(() => {
                        const items = Array.from(document.querySelectorAll('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item, .bi-menu-item, [role="menuitem"], li'));
                        const target = items.find(i => {
                            const txt = (i.innerText || '').trim();
                            return txt === 'Export' || txt === '导出' || txt.includes('Export');
                        });
                        if (target) { target.click(); return true; }
                        return false;
                    });

                    if (exportClicked) {
                        tracker.log(r1Id, 'Confirming export dialog...');
                        await new Promise(r => setTimeout(r, 1500));
                        await clickModalConfirm(biFrame, page);
                        tracker.log(r1Id, 'Waiting for Student-Detail Excel download...');
                        const file1 = await waitForNewDownload(existingFiles, 90, 150000, ['Student-Detail']);
                        if (file1) {
                            const sz = fs.statSync(file1).size;
                            tracker.recordSuccess(r1Id, file1, sz);
                            tracker.log(r1Id, `Captured: ${path.basename(file1)} (${(sz/1024).toFixed(1)} KB)`);
                            break;
                        }
                    }
                }

                if (attempt === 1) {
                    tracker.recordHealing(r1Id, 'Attempt 1 timed out: retrying Student-Detail export');
                }
            } catch(err) {
                tracker.log(r1Id, `Error on attempt ${attempt}: ${err.message}`);
                tracker.recordDiagnostic(r1Id, { attempt, error: err.message });
            }
        }

        // =====================================================================
        // [2/5] Area/Big Team/Small Team/SS Hierarchy Breakdown (33 ROWS EXPANDED)
        // =====================================================================
        const r2Id = 2;
        console.log('\n------------------------------------------------------------------------');
        console.log('>>> [2/5] EXPORTING: Area/Big Team/Small Team/SS (Full 33-Row Hierarchy)...');
        console.log('------------------------------------------------------------------------');

        for (let attempt = 1; attempt <= 2; attempt++) {
            tracker.recordAttempt(r2Id);
            try {
                let existingFiles = fs.readdirSync(TARGET_INPUTS_DIR);
                let biFrame = await navigateAndEnsureBiFrame(page, '中东 Lens 看板', 'https://lp.51talkjr.com/#/data-center/business/SA-SSdata', '9255940d', r2Id, tracker);
                await setupDownload(browser, page, TARGET_INPUTS_DIR);

                tracker.log(r2Id, 'Switching to ACHIEVEMENT tab...');
                await biFrame.evaluate(() => {
                    const achieveWords = ['achievement', 'hourly update', '业绩', 'الإنجاز', 'التحصيل', 'الأداء'];
                    const tabs = Array.from(document.querySelectorAll('.ant-tabs-tab, .bi-tab, [role="tab"], *')).filter(el => {
                        const t = (el.innerText || '').trim().toLowerCase();
                        return achieveWords.some(w => t.includes(w));
                    });
                    if (tabs.length > 0) tabs[tabs.length - 1].click();
                });
                await new Promise(r => setTimeout(r, 6000));
                biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;

                tracker.log(r2Id, 'Scrolling down 2500px to Area table...');
                await biFrame.evaluate(() => {
                    window.scrollTo(0, 2500);
                    for (const el of Array.from(document.querySelectorAll('*'))) {
                        if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = 2500;
                    }
                });
                await new Promise(r => setTimeout(r, 4000));
                biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;

                const expandInfo = await biFrame.evaluate(() => {
                    const op = document.querySelector('.cross-table-expand-operator, [class*="expand-operator"]');
                    if (!op) return null;
                    op.scrollIntoView({ behavior: 'instant', block: 'center' });
                    const r = op.getBoundingClientRect();
                    return { x: r.x, y: r.y, width: r.width, height: r.height };
                });

                if (expandInfo) {
                    await clickInFrameViaCoordinates(page, biFrame, expandInfo);
                    await new Promise(r => setTimeout(r, 1200));

                    const expAll = await biFrame.evaluate(() => {
                        const items = Array.from(document.querySelectorAll('.ant-dropdown:not(.ant-dropdown-hidden) .ant-dropdown-menu-item, .bi-menu-item, li'));
                        const expandWords = ['expand all', '全部展开', '展开全部', 'توسيع الكل', 'توسيع الجميع', 'توسيع'];
                        let t = items.find(i => {
                            const txt = (i.innerText || '').trim().toLowerCase();
                            return expandWords.some(w => txt.includes(w));
                        });
                        if (!t && items.length > 0) {
                            t = items[items.length - 1]; // Structural fallback: last item is typically Expand all
                        }
                        if (t) { t.click(); return true; }
                        return false;
                    });
                    tracker.log(r2Id, `Expand all clicked: ${expAll}`);
                    tracker.log(r2Id, 'Waiting 12s for complete 33-row expansion...');
                    await new Promise(r => setTimeout(r, 12000));
                }

                biFrame = await findBiFrame(page, '9255940d', 15) || biFrame;
                const areaDotsInfo = await biFrame.evaluate(() => {
                    const op = document.querySelector('.cross-table-expand-operator, [class*="expand-operator"]');
                    let card = op ? (op.closest('.component-card-wrapper') || op.closest('.bi-layout-tile')) : null;
                    if (!card) {
                        const cards = Array.from(document.querySelectorAll('.component-card-wrapper, .bi-layout-tile'));
                        card = cards.find(c => {
                            const t = c.innerText || '';
                            return (t.includes('Area') || t.includes('Small Team') || t.includes('SS')) && !t.includes('副本');
                        });
                    }
                    const searchRoot = card || document;
                    const more = searchRoot.querySelector('.common-more-outlined, .more-icon, i.anticon-more');
                    if (!more) return null;
                    more.classList.remove('card-menu-hide');
                    more.style.opacity = '1';
                    more.style.visibility = 'visible';
                    more.scrollIntoView({ behavior: 'instant', block: 'center' });
                    const r = more.getBoundingClientRect();
                    return { x: r.x, y: r.y, width: r.width, height: r.height };
                });

                if (areaDotsInfo) {
                    tracker.log(r2Id, 'Clicking Area 3-dots...');
                    await clickInFrameViaCoordinates(page, biFrame, areaDotsInfo);
                    await new Promise(r => setTimeout(r, 1500));

                    tracker.log(r2Id, 'Selecting Export from menu...');
                    const exportClicked = await clickExportMenuItem(biFrame, page);

                    if (exportClicked) {
                        tracker.log(r2Id, 'Confirming export dialog...');
                        await new Promise(r => setTimeout(r, 1500));
                        await clickModalConfirm(biFrame, page);
                        tracker.log(r2Id, 'Waiting for Area Hierarchy Excel download...');
                        const file2 = await waitForNewDownload(existingFiles, 90, 8000, ['Area', 'Hierarchy', 'Team', 'Small']);
                        if (file2) {
                            const sz = fs.statSync(file2).size;
                            tracker.recordSuccess(r2Id, file2, sz);
                            tracker.log(r2Id, `Captured: ${path.basename(file2)} (${(sz/1024).toFixed(1)} KB)`);
                            break;
                        }
                    }
                }

                if (attempt === 1) {
                    tracker.recordHealing(r2Id, 'Attempt 1 missing Area file: re-executing export');
                }
            } catch(err) {
                tracker.log(r2Id, `Error on attempt ${attempt}: ${err.message}`);
                tracker.recordDiagnostic(r2Id, { attempt, error: err.message });
            }
        }

        // =====================================================================
        // [3/5] English Club Report (Details Table)
        // =====================================================================
        const r4Id = 4;
        console.log('\n------------------------------------------------------------------------');
        console.log('>>> [3/5] EXPORTING: English Club Report (Details Table)...');
        console.log('------------------------------------------------------------------------');

        for (let attempt = 1; attempt <= 2; attempt++) {
            tracker.recordAttempt(r4Id);
            try {
                let existingFiles = fs.readdirSync(TARGET_INPUTS_DIR);
                let biFrameEC = await navigateAndEnsureBiFrame(page, 'English Club数据看板', 'https://lp.51talkjr.com/#/data-center/business/EnglishClub', 'afb30f29', r4Id, tracker);
                await setupDownload(browser, page, TARGET_INPUTS_DIR);

                tracker.log(r4Id, 'Scrolling down 2200px to English Club Details Table...');
                await biFrameEC.evaluate(() => {
                    window.scrollTo(0, 2200);
                    for (const el of Array.from(document.querySelectorAll('*'))) {
                        if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = 2200;
                    }
                });
                await new Promise(r => setTimeout(r, 10000));
                biFrameEC = await findBiFrame(page, 'afb30f29', 15) || biFrameEC;

                const ecDotsInfo = await biFrameEC.evaluate(() => {
                    const candidates = Array.from(document.querySelectorAll('.common-more-outlined, [class*="more-outlined"], i.anticon-more'));
                    const ecKeywords = ['details', '明细', 'club', 'english', 'تفاصيل', 'نادي'];
                    for (const icon of candidates) {
                        const card = icon.closest('.component-card-wrapper') || icon.closest('.bi-layout-tile') || icon.parentElement.parentElement;
                        const txt = card ? (card.innerText || '').toLowerCase() : '';
                        if (ecKeywords.some(k => txt.includes(k))) {
                            icon.classList.remove('card-menu-hide');
                            icon.style.opacity = '1';
                            icon.style.visibility = 'visible';
                            icon.scrollIntoView({ behavior: 'instant', block: 'center' });
                            const rect = icon.getBoundingClientRect();
                            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
                        }
                    }
                    if (candidates.length > 0) {
                        const last = candidates[candidates.length - 1];
                        last.classList.remove('card-menu-hide');
                        last.style.opacity = '1';
                        last.style.visibility = 'visible';
                        last.scrollIntoView({ behavior: 'instant', block: 'center' });
                        const rect = last.getBoundingClientRect();
                        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
                    }
                    return null;
                });

                if (ecDotsInfo) {
                    tracker.log(r4Id, 'Clicking English Club 3-dots...');
                    await clickInFrameViaCoordinates(page, biFrameEC, ecDotsInfo);
                    await new Promise(r => setTimeout(r, 1500));

                    tracker.log(r4Id, 'Selecting Export from menu...');
                    const exportClicked = await clickExportMenuItem(biFrameEC, page);

                    if (exportClicked) {
                        tracker.log(r4Id, 'Confirming export dialog...');
                        await new Promise(r => setTimeout(r, 1500));
                        await clickModalConfirm(biFrameEC, page);
                        tracker.log(r4Id, 'Waiting for English Club Excel download...');
                        const file4 = await waitForNewDownload(existingFiles, 90, 30000, ['EnglishClub', 'English Club', '中东', 'English']);
                        if (file4) {
                            const sz = fs.statSync(file4).size;
                            tracker.recordSuccess(r4Id, file4, sz);
                            tracker.log(r4Id, `Captured: ${path.basename(file4)} (${(sz/1024).toFixed(1)} KB)`);
                            break;
                        }
                    }
                }

                if (attempt === 1) {
                    tracker.recordHealing(r4Id, 'Attempt 1 missing English Club file: retrying');
                }
            } catch(err) {
                tracker.log(r4Id, `Error on attempt ${attempt}: ${err.message}`);
                tracker.recordDiagnostic(r4Id, { attempt, error: err.message });
            }
        }

        // =====================================================================
        // [4/5] Full SS Lens Multi-Sheet Dashboard (Master Workbook)
        // =====================================================================
        const r5Id = 5;
        console.log('\n------------------------------------------------------------------------');
        console.log('>>> [4/5] EXPORTING: Full SS Lens Multi-Sheet Dashboard (Master Workbook)...');
        console.log('------------------------------------------------------------------------');

        for (let attempt = 1; attempt <= 2; attempt++) {
            tracker.recordAttempt(r5Id);
            try {
                let existingFiles = fs.readdirSync(TARGET_INPUTS_DIR);
                let biFullFrame = await navigateAndEnsureBiFrame(page, '中东 Lens 看板', 'https://lp.51talkjr.com/#/data-center/business/SA-SSdata', '9255940d', r5Id, tracker);
                await setupDownload(browser, page, TARGET_INPUTS_DIR);

                tracker.log(r5Id, 'Mounting QuickBI action toolbar: scrolling 1500px and returning to top...');
                await biFullFrame.evaluate(() => {
                    window.scrollTo(0, 1500);
                    for (const el of Array.from(document.querySelectorAll('*'))) {
                        if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = 1500;
                    }
                }).catch(() => {});
                await new Promise(r => setTimeout(r, 3000));

                await biFullFrame.evaluate(() => {
                    window.scrollTo(0, 0);
                    for (const el of Array.from(document.querySelectorAll('*'))) {
                        if (el.scrollHeight > el.clientHeight + 50) el.scrollTop = 0;
                    }
                }).catch(() => {});
                await new Promise(r => setTimeout(r, 2000));

                // Hover mouse over upper right area to awaken toolbar
                await page.mouse.move(1500, 300);
                await new Promise(r => setTimeout(r, 1000));

                let dlBtnInfo = null;
                for (let sec = 0; sec < 15; sec++) {
                    dlBtnInfo = await biFullFrame.evaluate(() => {
                        const icon = document.querySelector('.preview-mini-menu-list-item-icon.common-download-outlined, .preview-mini-menu-list-item .common-download-outlined');
                        if (icon) {
                            const li = icon.closest('li') || icon;
                            const r = li.getBoundingClientRect();
                            if (r.width > 0 && r.height > 0) {
                                return { x: r.x, y: r.y, width: r.width, height: r.height };
                            }
                        }
                        return null;
                    }).catch(() => null);

                    if (dlBtnInfo) break;
                    await new Promise(r => setTimeout(r, 1000));
                }

                tracker.log(r5Id, `Download icon found: ${Boolean(dlBtnInfo)}`);
                if (dlBtnInfo) {
                    tracker.log(r5Id, 'Clicking Full Master download icon via coordinates...');
                    await clickInFrameViaCoordinates(page, biFullFrame, dlBtnInfo);
                    await new Promise(r => setTimeout(r, 2500));

                    tracker.log(r5Id, 'Confirming Export modal (strict modal OK)...');
                    const conf = await clickModalConfirm(biFullFrame, page);
                    tracker.log(r5Id, `Modal confirmed: ${conf}`);

                    tracker.log(r5Id, 'Waiting for Full Master Excel download (up to 270s)...');
                    const file5 = await waitForNewDownload(existingFiles, 270, 200000, ['SS Lens Dashboard_2', 'SS Lens Dashboard']);
                    if (file5) {
                        const sz = fs.statSync(file5).size;
                        tracker.recordSuccess(r5Id, file5, sz);
                        tracker.log(r5Id, `Captured: ${path.basename(file5)} (${(sz/1024).toFixed(1)} KB)`);
                        break;
                    }
                }

                if (attempt === 1) {
                    tracker.recordHealing(r5Id, 'Attempt 1 missing Full Master file: retrying');
                }
            } catch(err) {
                tracker.log(r5Id, `Error on attempt ${attempt}: ${err.message}`);
                tracker.recordDiagnostic(r5Id, { attempt, error: err.message });
            }
        }

        // =====================================================================
        // [5/5] Overseas NEW SOP Report (Extracted 100% Fresh from Master)
        // =====================================================================
        const r3Id = 3;
        console.log('\n------------------------------------------------------------------------');
        console.log('>>> [5/5] EXTRACTING: Overseas NEW SOP Report (From Live Master Dashboard)...');
        console.log('------------------------------------------------------------------------');
        tracker.recordAttempt(r3Id);

        const masterFile = fs.readdirSync(TARGET_INPUTS_DIR).find(f => /^SS Lens Dashboard_\d{8}_\d{4}\.xlsx$/i.test(f) && !f.includes('Student-Detail') && !f.includes('Area'));
        if (masterFile) {
            try {
                const fullMasterPath = path.join(TARGET_INPUTS_DIR, masterFile);
                let extractorPy = path.join(__dirname, 'extract_sop_from_master.py');
                if (!fs.existsSync(extractorPy)) {
                    extractorPy = 'D:\\51Talk_Workspace\\00_core\\extract_sop_from_master.py';
                }
                execSync(`python "${extractorPy}" "${fullMasterPath}" "${TARGET_INPUTS_DIR}"`, { stdio: 'inherit' });
                
                const generatedSop = fs.readdirSync(TARGET_INPUTS_DIR).find(f => (f.includes('NEW_SOP') || f.includes('海外NEW')) && f.endsWith('.xlsx'));
                if (generatedSop) {
                    const sopFullPath = path.join(TARGET_INPUTS_DIR, generatedSop);
                    const sz = fs.statSync(sopFullPath).size;
                    tracker.recordSuccess(r3Id, sopFullPath, sz);
                    tracker.recordHealing(r3Id, 'Extracted live SOP details directly from fresh Master Workbook');
                    tracker.log(r3Id, `Captured: ${generatedSop} (${(sz/1024).toFixed(1)} KB)`);
                } else {
                    tracker.recordFailure(r3Id, 'SOP extractor produced no file');
                }
            } catch(e) {
                tracker.recordFailure(r3Id, `SOP extraction error: ${e.message}`);
                tracker.log(r3Id, `Extraction failed: ${e.message}`);
            }
        } else {
            tracker.recordFailure(r3Id, 'Master Workbook missing, cannot extract SOP');
            tracker.log(r3Id, 'Master Workbook missing, cannot extract SOP');
        }

    } finally {
        await browser.close().catch(() => {});
        tracker.printSummaryAndSave();
    }
}

runExporter().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
