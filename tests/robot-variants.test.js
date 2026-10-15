const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function drawRobot(');
const end = html.indexOf('function drawLab(){', start);
assert(start >= 0 && end > start, 'Could not locate drawRobot()');
const robot = html.slice(start, end);
function casesBetween(from, to) {
  const a = robot.indexOf(from);
  const b = robot.indexOf(to, a + from.length);
  assert(a >= 0 && b > a, `Could not locate variant section ${from}`);
  return [...robot.slice(a, b).matchAll(/case (\d+):/g)].map((m) => Number(m[1]));
}
function expectSequence(actual, first, last, label) {
  assert.deepEqual(actual, Array.from({ length: last - first + 1 }, (_, i) => first + i), `${label} variant cases should be complete and unique`);
}
expectSequence(casesBetween('if(hi>=8)', 'if(bi>=6)'), 8, 24, 'Head');
expectSequence(casesBetween('if(bi>=6)', 'if(li>=6)'), 6, 24, 'Body');
const legStart = robot.indexOf('if(li>=6)');
const legEnd = robot.lastIndexOf('ctx.restore();');
assert(legStart >= 0 && legEnd > legStart, 'Could not locate leg variant section');
expectSequence([...robot.slice(legStart, legEnd).matchAll(/case (\d+):/g)].map((m) => Number(m[1])), 6, 24, 'Leg');
console.log('PASS: all 25 selectable indices (base + 24 unlockable pieces) have dedicated head, body, and leg visual variants.');
