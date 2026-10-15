const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function soundCue(kind)');
const end = html.indexOf('function toast(', start);
assert(start >= 0 && end > start, 'Could not locate sound cue implementation');
const audio = html.slice(start, end);
for (const cue of ['collect', 'success', 'crate', 'dispense', 'hazard', 'toggle', 'door']) {
  assert(audio.includes(`${cue}:[`), `Missing sound cue: ${cue}`);
}
for (const cue of ['collect', 'success', 'dispense', 'hazard']) {
  assert(html.includes(`soundCue("${cue}")`), `Sound cue is not wired into game event: ${cue}`);
}
assert(html.includes('soundCue(state.sensorActive?"door":"crate")'), 'Crate and pressure plate events need distinct cues');
assert(html.includes('if(!state.sound)return;'), 'Sound cues must respect the sound toggle');
console.log('PASS: all seven synthesized sound cues exist, key events are wired, and mute is respected.');
