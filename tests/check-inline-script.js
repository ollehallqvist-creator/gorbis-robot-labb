const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert(match, 'Could not find the inline game script in index.html');
new vm.Script(match[1], { filename: 'index.html inline game script' });
console.log('PASS: inline game script parses successfully.');
