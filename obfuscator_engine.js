/**
 * Executive Dashboard Security Obfuscator Engine
 * Compiles clean dashboard.src.js into hardened, obfuscated, and self-defending dashboard.js
 */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('D:/Lens/node_modules/javascript-obfuscator');

const srcPath = path.join(__dirname, 'dashboard.src.js');
const distPath = path.join(__dirname, 'dashboard.js');

if (!fs.existsSync(srcPath)) {
    console.warn('  [OBFUSCATOR WARN] dashboard.src.js not found. Copying from dashboard.js...');
    fs.copyFileSync(distPath, srcPath);
}

console.log('  [OBFUSCATOR] Reading source code from dashboard.src.js...');
const code = fs.readFileSync(srcPath, 'utf8');

console.log(`  [OBFUSCATOR] Compiling and obfuscating (${(code.length / 1024).toFixed(1)} KB)...`);
const start = Date.now();

try {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: true,
        debugProtectionInterval: 2500,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        renameGlobals: false,
        target: 'browser'
    });

    const obfuscatedCode = obfuscationResult.getObfuscatedCode();
    fs.writeFileSync(distPath, obfuscatedCode, 'utf8');

    const duration = Date.now() - start;
    console.log(`  [OBFUSCATOR SUCCESS] Encrypted in ${duration}ms! Dist size: ${(obfuscatedCode.length / 1024).toFixed(1)} KB`);
} catch(err) {
    console.error('  [OBFUSCATOR ERROR]:', err.message);
    process.exit(1);
}
