const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { URL } = require('url');
const { execFileSync } = require('child_process');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const CHAT_GROUPS = {
  mega: 'cidx9ITXJyqktd2CvhI8op0Ig==',    // Big Team Champs - Mega (26 members)
  updates: 'cidYhX/JCJvNbl0xGGtuL8qdg==', // Big Team 01 updates (5 members)
  leaders: 'cidhasF9F02Sb+TdRuVHmBVRg=='  // Big Team Leaders Only (5 members)
};

const NODE_BIN_CANDIDATES = [
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Program Files (x86)\\nodejs\\node.exe',
  'node'
];
const nodeExe = NODE_BIN_CANDIDATES.find(p => fs.existsSync(p)) || 'node';
const dwsJsCandidates = [
  'C:\\Users\\husse\\AppData\\Roaming\\npm\\node_modules\\dingtalk-workspace-cli\\bin\\dws.js',
  path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'dingtalk-workspace-cli', 'bin', 'dws.js')
];
const dwsJs = dwsJsCandidates.find(p => fs.existsSync(p)) || '';

const server = http.createServer((req, res) => {
  // Global CORS headers for cross-origin local access (e.g., file:/// origin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // API 1: Direct Table/Card Snapshot Broadcast to DingTalk Mega Group
  if (req.method === 'POST' && (reqPath === '/api/send-table-to-dingtalk' || reqPath === '/api/send-table-to-mega')) {
    let chunks = [];
    req.on('data', chunk => { chunks.push(chunk); });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const payload = JSON.parse(raw);
        const title = payload.title || 'Executive Performance Snapshot';
        const groupKey = (payload.group || 'mega').toLowerCase();
        const targetChatId = CHAT_GROUPS[groupKey] || CHAT_GROUPS.mega;
        const base64Data = payload.imageData;

        if (!base64Data || !base64Data.includes('base64,')) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'Missing base64 imageData' }));
          return;
        }

        const snapDir = path.join(__dirname, 'scratch', 'table_snapshots');
        if (!fs.existsSync(snapDir)) {
          fs.mkdirSync(snapDir, { recursive: true });
        }

        const base64Clean = base64Data.split('base64,')[1];
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const safeTitle = (payload.fileName || title).replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
        const filename = `snap_${safeTitle}_${timestamp}.png`;
        const filePath = path.join(snapDir, filename);
        fs.writeFileSync(filePath, Buffer.from(base64Clean, 'base64'));

        const relPath = `./scratch/table_snapshots/${filename}`;
        const dateStr = new Date().toISOString().split('T')[0];

        const markdownText = `### 📊 **${title}**\n> 📅 **التاريخ:** ${dateStr} | 👥 **المجموعة المستهدفة:** Big Team Champs - Mega 🚀\n> 🏢 **51Talk Big Team 01** — Senior Manager: Hussein El A'sar\n\n![${title}](${relPath})`;

        if (!dwsJs || !fs.existsSync(dwsJs)) {
          throw new Error('DingTalk dws.js CLI executable not found at: ' + dwsJs);
        }

        const args = [
          dwsJs,
          'chat', '+messages-send',
          '--as', 'user',
          '--chat-id', targetChatId,
          '--markdown', markdownText
        ];
        if (payload.dryRun) {
          args.push('--dry-run');
        }
        args.push('-y');

        console.log(`[DingTalk Broadcast] Sending "${title}" to group [${groupKey}] (${targetChatId})...`);
        const dwsOutput = execFileSync(nodeExe, args, {
          cwd: __dirname,
          encoding: 'utf8',
          timeout: 45000
        });
        console.log(`[DingTalk Broadcast SUCCESS]:\n`, dwsOutput);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'تم إرسال صورة الجدول إلى Mega Group بنجاح!',
          filename: filename,
          group: groupKey,
          chatId: targetChatId,
          output: dwsOutput
        }));
      } catch (err) {
        console.error('[DingTalk Broadcast ERROR]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: false,
          error: err.message || 'Error executing dws command',
          output: err.stdout || err.stderr || null
        }));
      }
    });
    return;
  }

  // API 2: Legacy Proxy for DingTalk Webhook
  if (req.method === 'POST' && reqPath === '/api/dingtalk') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const webhookUrl = payload.webhook_url;
        const msgText = payload.message || '';
        const title = payload.title || 'تذكرة استرداد ومتابعة - Big Team 01';

        if (!webhookUrl || !webhookUrl.startsWith('https://oapi.dingtalk.com/')) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ errcode: 400, errmsg: 'Invalid or missing DingTalk Webhook URL' }));
          return;
        }

        const dingData = JSON.stringify({
          msgtype: 'markdown',
          markdown: {
            title: title,
            text: msgText
          }
        });

        const parsedUrl = new URL(webhookUrl);
        const options = {
          hostname: parsedUrl.hostname,
          port: 443,
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(dingData)
          }
        };

        const dingReq = https.request(options, (dingRes) => {
          let respBody = '';
          dingRes.on('data', d => { respBody += d; });
          dingRes.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(respBody);
          });
        });

        dingReq.on('error', (e) => {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ errcode: 500, errmsg: e.message }));
        });

        dingReq.write(dingData);
        dingReq.end();
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ errcode: 400, errmsg: err.message }));
      }
    });
    return;
  }

  // API 3: Direct 1-on-1 DingTalk Message to Individual Representative (via dws.exe)
  if (req.method === 'POST' && reqPath === '/api/send-dingtalk-rep') {
    let chunks = [];
    req.on('data', chunk => { chunks.push(chunk); });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const payload = JSON.parse(raw);
        const rawRep = (payload.rep || '').toString().trim();
        const studentId = (payload.student_id || '').toString().trim();
        const msgText = (payload.message || '').toString().trim();

        if (!rawRep) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'missing_rep', message: 'لم يتم تحديد اسم الموظف' }));
          return;
        }

        // Load Rep mapping
        const repMapPath = path.join(__dirname, 'scratch', 'rep_dingtalk_ids.json');
        let repMap = {};
        if (fs.existsSync(repMapPath)) {
          try {
            repMap = JSON.parse(fs.readFileSync(repMapPath, 'utf8'));
          } catch(e) {}
        }

        // Helper to normalize rep key
        const normalize = k => k.toLowerCase().replace(/^(egss-|me-egss|me-)/i, '').replace(/[^a-z0-9]/g, '');
        const targetClean = normalize(rawRep);

        let matchedRepKey = null;
        let repInfo = null;

        // 1. Direct match on normalized keys
        for (const [k, v] of Object.entries(repMap)) {
          if (normalize(k) === targetClean) {
            matchedRepKey = k;
            repInfo = v;
            break;
          }
        }

        // 2. Fallback: match by nick or name
        if (!repInfo) {
          for (const [k, v] of Object.entries(repMap)) {
            const nick = normalize(v.nick || '');
            const name = normalize(v.name || '');
            if (nick.includes(targetClean) || targetClean.includes(nick) || (name && name.includes(targetClean))) {
              matchedRepKey = k;
              repInfo = v;
              break;
            }
          }
        }

        if (!repInfo || !repInfo.openDingtalkId) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            success: false,
            error: 'rep_not_found',
            rep: rawRep,
            message: `الموظف [${rawRep}] ليس مسجلاً ضمن ممثلي Big Team 01 في ملف جهات الاتصال (قد يكون من قطاع خارجي). تم نسخ نص التذكرة للحافظة.`
          }));
          return;
        }

        const openDingtalkId = repInfo.openDingtalkId;
        const repName = repInfo.name || repInfo.nick || matchedRepKey;

        // Clean message text of invalid characters/emojis that could disrupt command args
        const cleanMsg = msgText.replace(/[\u200b-\u200f\u2028-\u202f\ufeff]/g, '');

        // Resolve DWS binary (prefer dws.exe native binary, then dws.cmd)
        const dwsExeCandidates = [
          'C:\\Users\\husse\\AppData\\Roaming\\npm\\node_modules\\dingtalk-workspace-cli\\vendor\\dws.exe',
          'C:\\Users\\husse\\AppData\\Roaming\\npm\\dws.cmd'
        ];
        const dwsBinary = dwsExeCandidates.find(p => fs.existsSync(p));

        if (!dwsBinary) {
          throw new Error('DingTalk CLI (dws.exe) not found');
        }

        console.log(`[DingTalk Rep API] 🚀 Sending direct message to ${repName} (${matchedRepKey}) [${openDingtalkId}]...`);

        let dwsOutput = '';
        if (dwsBinary.endsWith('.exe')) {
          dwsOutput = execFileSync(dwsBinary, [
            'chat', '+messages-send',
            '--as', 'user',
            '--open-dingtalk-id', openDingtalkId,
            '--msg-type', 'text',
            '--text', cleanMsg,
            '--ai-tag=false',
            '-y'
          ], {
            cwd: __dirname,
            encoding: 'utf8',
            timeout: 30000
          });
        } else {
          dwsOutput = execFileSync('cmd.exe', [
            '/c', dwsBinary,
            'chat', '+messages-send',
            '--as', 'user',
            '--open-dingtalk-id', openDingtalkId,
            '--msg-type', 'text',
            '--text', cleanMsg,
            '--ai-tag=false',
            '-y'
          ], {
            cwd: __dirname,
            encoding: 'utf8',
            timeout: 30000
          });
        }

        console.log(`[DingTalk Rep API SUCCESS]: Message delivered to ${repName}!`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          rep: matchedRepKey,
          repName: repName,
          student_id: studentId,
          openDingtalkId: openDingtalkId,
          output: dwsOutput
        }));
      } catch (err) {
        console.error('[DingTalk Rep API ERROR]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: false,
          error: 'dispatch_failed',
          message: err.message || 'خطأ أثناء تنفيذ أمر الإرسال عبر DingTalk',
          output: err.stdout || err.stderr || null
        }));
      }
    });
    return;
  }

  // Static File Serving
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server Error: ' + err.code);
      }
    } else {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const compressable = ['.html', '.js', '.css', '.json', '.svg', '.csv'].includes(ext);
      if (compressable && acceptEncoding.includes('gzip')) {
        zlib.gzip(content, (zErr, gzipped) => {
          if (zErr) {
            res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': content.length });
            res.end(content);
          } else {
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Encoding': 'gzip',
              'Content-Length': gzipped.length,
              'Cache-Control': 'no-cache'
            });
            res.end(gzipped);
          }
        });
      } else {
        res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': content.length });
        res.end(content);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT + '/');
});