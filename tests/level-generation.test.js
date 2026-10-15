const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function makeLevel(');
const end = html.indexOf('\nfunction startLevel(', start);
assert(start >= 0 && end > start, 'Could not locate makeLevel() in index.html');
const sandbox = {};
vm.runInNewContext(html.slice(start, end) + '\nglobalThis.makeLevel = makeLevel;', sandbox);
const makeLevel = sandbox.makeLevel;
const fingerprints = new Set();
let previousHazardCount = 0;

function reachableCells(level) {
  const startX = Math.floor(level.start.x);
  const startZ = Math.floor(level.start.y);
  const queue = [[startX, startZ]];
  const visited = new Set([`${startX},${startZ}`]);
  for (let i = 0; i < queue.length; i++) {
    const [x, z] = queue[i];
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const nz = z + dz;
      const key = `${nx},${nz}`;
      if (nx < 0 || nz < 0 || nx >= level.cols || nz >= level.rows) continue;
      if (level.walls[nz][nx] || visited.has(key)) continue;
      visited.add(key);
      queue.push([nx, nz]);
    }
  }
  return visited;
}

for (let n = 1; n <= 24; n++) {
  const level = makeLevel(n);
  const visited = reachableCells(level);
  assert(level.hazards.length >= previousHazardCount, `Level ${n}: hazard count should not decrease as levels progress`);
  previousHazardCount = level.hazards.length;
  const cell = (point) => `${Math.floor(point.x)},${Math.floor(point.y)}`;
  const protectedCells = new Set([...level.parts.map(cell), cell(level.crate), cell(level.sensor), cell(level.door)]);
  assert(level.hazards.every((hazard) => !protectedCells.has(cell(hazard))), `Level ${n}: hazard overlaps a part or puzzle object`);
  const canReach = (point) => visited.has(`${Math.floor(point.x)},${Math.floor(point.y)}`);
  assert(level.parts.every(canReach), `Level ${n}: a robot part is unreachable`);
  assert(canReach(level.crate), `Level ${n}: crate is unreachable`);
  assert(canReach(level.sensor), `Level ${n}: pressure plate is unreachable`);
  assert(canReach(level.door), `Level ${n}: exit is unreachable`);
  fingerprints.add(JSON.stringify(level.walls));
}
assert.equal(fingerprints.size, 24, 'All 24 levels should have distinct maze layouts');
console.log('PASS: 24 unique levels; all objectives reachable; hazards increase with difficulty and do not overlap collectibles or puzzle objects.');
