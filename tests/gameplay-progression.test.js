const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
assert.match(html,/if\(state\.collected\.length===3\)\{finishLevel\(\);return\}/,"collecting all three parts should trigger the full completion dialog");
assert.match(html,/if\(state\.collected\.length>0&&state\.sensorActive&&Math\.hypot\(p\.x-d\.door\.x,p\.y-d\.door\.y\)<\.7\)\{const found=state\.collected\.length;returnLab\(\);toast\(/,"reaching the open exit with one or two parts should return to the lab without claiming all three were found");
assert.match(html,/function finishLevel\(\)\{const n=state\.level/,"full completion should retain progression and saving behavior");
console.log("PASS: partial collection exits return to the lab; three collected parts use the full completion flow.");
