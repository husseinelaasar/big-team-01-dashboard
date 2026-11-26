const fs = require('fs');
const path = require('path');
const puppeteer = require('D:\\Lens\\node_modules\\puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE_DIR = 'D:\\Lens\\automation_chrome_profile';

const PROJECT_DIR = __dirname;
const STUDENTS_FILE = path.join(PROJECT_DIR, 'students_to_scan.json');
const OUTPUT_FILE = path.join(PROJECT_DIR, 'hot_top_matches_final.json');
const CHECKPOINT_FILE = path.join(PROJECT_DIR, 'hot_top_checkpoint.json');
const TOKEN_FILE = path.join(PROJECT_DIR, 'token.txt');
const USER_ID_FILE = path.join(PROJECT_DIR, 'crm_user_id.txt');
const COOKIE_FILE = path.join(PROJECT_DIR, 'phpsessid.txt');

let currentToken = '';
let currentCrmUserId = '4119820';
let currentCookie = '';

async function testTokenValidity(token, crmUserId) {
  if (!token) return false;
  try {
    const ts = Date.now();
    const testUrl = `https://igateway.51talkjr.com/crm/UserOrderPlatformApi/getUserOrderList?appkey=midp&timestamp=${ts}&langcode=zh-CN&tenant_id=1&product_id=5&position=SS&crm_user_id=${crmUserId}&stu_id=63735670&user_id=63735670&status=on,waiting&sortby=add_time&page_no=1&page_size=1`;
    const res = await fetch(testUrl, {
      headers: {
        'authorization': token,
        'langcode': 'zh-CN',
        'accept': 'application/json, text/plain, */*'
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data && data.code === 10000;
  } catch (e) {
    return false;
  }
}

async function testPhpCookieValidity(cookieStr) {
  if (!cookieStr) return false;
  try {
    const res = await fetch('https://crm.51talkjr.com/admin/order/order_batch.php?order_id=1&user_id=63735670', {
      headers: {
        'cookie': cookieStr,
        'user-agent': 'Mozilla/5.0'
      }
    });
    if (!res.ok) return false;
    const html = await res.text();
    return !(/login|Sign in|请登录/i.test(html)) && html.length > 200;
  } catch (e) {
    return false;
  }
}

async function refreshAuthFromBrowser(forceRefresh = false) {
  if (!forceRefresh && fs.existsSync(TOKEN_FILE) && fs.existsSync(USER_ID_FILE) && fs.existsSync(COOKIE_FILE)) {
    const t = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
    const u = fs.readFileSync(USER_ID_FILE, 'utf8').trim() || '4119820';
    const c = fs.readFileSync(COOKIE_FILE, 'utf8').trim();
    const [tokenOk, cookieOk] = await Promise.all([
      testTokenValidity(t, u),
      testPhpCookieValidity(c)
    ]);
    if (tokenOk && cookieOk) {
      console.log('[AUTH] Cached token and PHPSESSID verified active & valid.');
      currentToken = t;
      currentCrmUserId = u;
      currentCookie = c;
      return;
    }
  }

  console.log('[AUTH] Launching headless Chrome to refresh token & PHPSESSID...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    userDataDir: PROFILE_DIR,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 1. Get token & crm_user_id from lp.51talkjr.com
    await page.goto('https://lp.51talkjr.com/#/data-center/business/SA-SSdata', {
      waitUntil: 'networkidle2',
      timeout: 40000
    });
    await new Promise(r => setTimeout(r, 3500));

    const token = await page.evaluate(() => localStorage.getItem('token'));
    const crmUserId = await page.evaluate(() => localStorage.getItem('crm_user_id') || '4119820');
    if (!token) {
      throw new Error('Failed to retrieve token from lp.51talkjr.com localStorage. Please log in to Chrome automation profile.');
    }

    // 2. Get PHPSESSID from crm.51talkjr.com
    await page.goto('https://crm.51talkjr.com/admin/order/order_batch.php?order_id=1&user_id=63735670', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 1500));
    const cookies = await page.cookies('https://crm.51talkjr.com');
    const phpSess = cookies.find(c => c.name === 'PHPSESSID');
    const cookieStr = phpSess ? `PHPSESSID=${phpSess.value}` : '';

    if (!cookieStr) {
      throw new Error('Failed to retrieve PHPSESSID cookie from crm.51talkjr.com.');
    }

    const cookieOk = await testPhpCookieValidity(cookieStr);
    if (!cookieOk) {
      throw new Error('Retrieved PHPSESSID cookie is not authenticated on crm.51talkjr.com.');
    }

    fs.writeFileSync(TOKEN_FILE, token, 'utf8');
    fs.writeFileSync(USER_ID_FILE, crmUserId, 'utf8');
    fs.writeFileSync(COOKIE_FILE, cookieStr, 'utf8');

    currentToken = token;
    currentCrmUserId = crmUserId;
    currentCookie = cookieStr;
    console.log(`[AUTH] Refreshed token (${token.length} chars, crmUserId: ${crmUserId}) and PHPSESSID.`);
  } finally {
    await browser.close();
  }
}

async function fetchOrders(studentId, retries = 2) {
  const ts = Date.now();
  const url = `https://igateway.51talkjr.com/crm/UserOrderPlatformApi/getUserOrderList?appkey=midp&timestamp=${ts}&langcode=zh-CN&tenant_id=1&product_id=5&position=SS&crm_user_id=${currentCrmUserId}&stu_id=${studentId}&user_id=${studentId}&status=on,waiting&sortby=add_time&page_no=1&page_size=20`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'authorization': currentToken,
          'langcode': 'zh-CN',
          'accept': 'application/json, text/plain, */*'
        }
      });
      if (!res.ok) {
        if (attempt === retries) return [];
        await new Promise(r => setTimeout(r, 400));
        continue;
      }
      const data = await res.json();
      if (data && data.code === 920124) {
        console.log('[AUTH] Token expired mid-scan, refreshing...');
        await refreshAuthFromBrowser(true);
        continue;
      }
      return (data && data.res && data.res.list) ? data.res.list : [];
    } catch (e) {
      if (attempt === retries) return [];
      await new Promise(r => setTimeout(r, 400));
    }
  }
  return [];
}

async function fetchBatchDetails(orderId, studentId, retries = 2) {
  const url = `https://crm.51talkjr.com/admin/order/order_batch.php?order_id=${orderId}&user_id=${studentId}`;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'cookie': currentCookie,
          'user-agent': 'Mozilla/5.0'
        }
      });
      if (!res.ok) {
        if (attempt === retries) return { totalPaid: 0, subOrders: [] };
        await new Promise(r => setTimeout(r, 400));
        continue;
      }
      const html = await res.text();

      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const tdRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
      let match;
      const rows = [];
      while ((match = trRegex.exec(html)) !== null) {
        const rowHtml = match[1];
        let tdMatch;
        const cols = [];
        while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
          cols.push(tdMatch[1].replace(/<[^>]+>/g, '').trim());
        }
        if (cols.length > 0) rows.push(cols);
      }

      let totalPaid = 0;
      const subOrders = [];

      for (const r of rows) {
        const fullText = r.join(' ');
        const paidMatch = fullText.match(/Paid[：:]\s*([0-9.]+)/i);
        if (paidMatch) {
          totalPaid = parseFloat(paidMatch[1]) || totalPaid;
        }

        if (r.length >= 7 && /^\d+$/.test(r[0])) {
          const amountMatch = r[1].match(/([0-9.]+)/);
          const subAmount = amountMatch ? parseFloat(amountMatch[1]) : 0;
          subOrders.push({
            sub_order_id: r[0],
            amount_raw: r[1],
            amount: subAmount,
            order_time: r[2],
            payment_method: r[3],
            payment_channels: r[4],
            status: r[5],
            deal_time: r[6]
          });
        }
      }

      return { totalPaid, subOrders };
    } catch (e) {
      if (attempt === retries) return { totalPaid: 0, subOrders: [] };
      await new Promise(r => setTimeout(r, 400));
    }
  }
  return { totalPaid: 0, subOrders: [] };
}

async function fetchStudentBaseInfo(studentId) {
  const ts = Date.now();
  const url = `https://igateway.51talkjr.com/talk_midplatform_workbench/backend/user/base_info?appkey=midp&timestamp=${ts}&langcode=zh-CN&tenant_id=1&product_id=5&position=SS&crm_user_id=${currentCrmUserId}&user_id=${studentId}`;
  try {
    const res = await fetch(url, {
      headers: { 'authorization': currentToken, 'langcode': 'zh-CN' }
    });
    const data = await res.json();
    return (data && data.res) ? data.res : null;
  } catch (e) {
    return null;
  }
}

function parseMoney(str) {
  if (!str) return 0;
  const m = String(str).match(/([0-9.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

function cleanProductName(str) {
  if (!str) return '';
  return String(str).split('<br>')[0].trim();
}

async function main() {
  console.log('=== PROJECT HOT TOP DEPOSITS: LIVE SCANNER ===');
  await refreshAuthFromBrowser(false);

  const allStudents = JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf8'));
  console.log(`Total students to audit: ${allStudents.length}`);

  const matches = [];
  let checkedCount = 0;
  const startTime = Date.now();
  const BATCH_SIZE = 15;

  for (let i = 0; i < allStudents.length; i += BATCH_SIZE) {
    const batch = allStudents.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (stu) => {
      try {
        const orders = await fetchOrders(stu.student_id);
        if (!orders || orders.length === 0) return;

        for (const order of orders) {
          const billStatus = parseInt(order.bill_status, 10);
          const payMethod = order.pay_method;

          let batchInfo = { totalPaid: 0, subOrders: [] };
          if (billStatus > 0 || payMethod === 'batch') {
            batchInfo = await fetchBatchDetails(order.id, stu.student_id);
          }

          if (batchInfo.totalPaid > 0) {
            console.log(`[HOT TOP] Student ${stu.student_id} (${stu.rep} - ${stu.team}) | Order #${order.id} | Paid: ${batchInfo.totalPaid} SAR`);
            const baseInfo = await fetchStudentBaseInfo(stu.student_id);
            const totalMoney = parseMoney(order.order_money);
            const discountMoney = parseMoney(order.discount_money);
            const actuallyPay = parseMoney(order.actually_pay);
            const remainingBalance = Math.max(0, actuallyPay - batchInfo.totalPaid);

            matches.push({
              student_id: stu.student_id,
              student_name_ar: baseInfo ? (baseInfo.real_name || '') : '',
              student_name_en: baseInfo ? (baseInfo.nick_name || '') : '',
              mobile: baseInfo ? (baseInfo.main_mobile || '') : '',
              big_team: stu.big_team,
              team: stu.team,
              rep: stu.rep,
              pool: stu.pool,
              pool_detail: stu.pool_detail,
              current_point: stu.current_point,
              order_id: String(order.id),
              order_add_time: order.add_time,
              package_name: cleanProductName(order.order_content_str),
              total_order_amount: totalMoney,
              discount_amount: discountMoney,
              net_amount: actuallyPay,
              paid_amount: batchInfo.totalPaid,
              remaining_balance: remainingBalance,
              order_status: order.status,
              bill_status: order.bill_status,
              pay_method: order.pay_method,
              sub_orders: batchInfo.subOrders,
              latest_sub_payment_time: batchInfo.subOrders.length > 0
                ? (batchInfo.subOrders[batchInfo.subOrders.length - 1].deal_time || batchInfo.subOrders[batchInfo.subOrders.length - 1].order_time)
                : '',
              crm_profile_url: `https://lp.51talkjr.com/#/user-profile?uid=${stu.student_id}`,
              order_batch_url: `https://crm.51talkjr.com/admin/order/order_batch.php?order_id=${order.id}&user_id=${stu.student_id}`
            });

            fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(matches, null, 2), 'utf8');
          }
        }
      } catch (err) {
        // Continue gracefully on single student error
      }
    }));

    checkedCount += batch.length;
    if (checkedCount % 300 === 0 || checkedCount === allStudents.length) {
      const elapsedSec = Math.max(0.1, (Date.now() - startTime) / 1000);
      const rate = (checkedCount / elapsedSec).toFixed(1);
      const remainingSec = ((allStudents.length - checkedCount) / Math.max(0.1, parseFloat(rate))).toFixed(0);
      console.log(`[PROGRESS] ${checkedCount}/${allStudents.length} (${((checkedCount / allStudents.length) * 100).toFixed(1)}%) | Matches: ${matches.length} | Speed: ${rate} req/s | ETA: ${remainingSec}s`);
    }

    await new Promise(r => setTimeout(r, 30));
  }

  console.log('\n=== SCAN COMPLETE ===');
  console.log(`Total Checked: ${checkedCount}`);
  console.log(`Total HOT TOP Matches Found: ${matches.length}`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(matches, null, 2), 'utf8');
  console.log(`Results saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});

