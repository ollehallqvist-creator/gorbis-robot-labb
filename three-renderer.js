(function(){
"use strict";
const T=window.THREE;
const api={ready:false,renderer:null,scene:null,camera:null,key:"",stage:null,refs:{}};
const palette=["#79c8a6","#c47a52","#9489c7","#6c9fbd","#79a76e","#b7a85c","#83b8b8","#b96e80"];
const mats={};
function material(color,roughness=.82,metalness=.12,emissive=null){const key=[color,roughness,metalness,emissive].join("|");if(mats[key])return mats[key];const opts={color,roughness,metalness};if(emissive){opts.emissive=emissive;opts.emissiveIntensity=.32}return mats[key]=new T.MeshStandardMaterial(opts)}
function box(parent,w,h,d,color,x,y,z,opts={}){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material(color,opts.roughness??.82,opts.metalness??.12,opts.emissive??null));m.position.set(x,y,z);if(opts.rotationY)m.rotation.y=opts.rotationY;m.castShadow=!!opts.castShadow;m.receiveShadow=opts.receiveShadow!==false;parent.add(m);return m}
function plane(parent,w,d,color,x,y,z){const m=new T.Mesh(new T.PlaneGeometry(w,d),material(color));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m}
function pipe(parent,a,b,r,color){const v1=new T.Vector3(...a),v2=new T.Vector3(...b),dir=new T.Vector3().subVectors(v2,v1),mesh=new T.Mesh(new T.CylinderGeometry(r,r,dir.length(),10),material(color,.56,.58));mesh.position.copy(v1).add(v2).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());parent.add(mesh);return mesh}
function addLights(scene,theme=0){scene.add(new T.HemisphereLight(0x9daeb2,0x191714,2.0));const key=new T.DirectionalLight(0xffe6bd,2.3);key.position.set(-5,10,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-16;key.shadow.camera.right=16;key.shadow.camera.top=12;key.shadow.camera.bottom=-12;key.shadow.camera.near=.5;key.shadow.camera.far=35;scene.add(key);const rim=new T.DirectionalLight(0x7dc7bb,1.15);rim.position.set(7,6,-6);scene.add(rim);const green=new T.PointLight(theme===0?0x4de09b:0x8bafc0,5,10);green.position.set(-4,2,-3);scene.add(green)}
function robot(parent,config={},scale=1){
 const g=new T.Group();g.scale.setScalar(scale);parent.add(g);const wheels=[],armSegments=[];
 const color=palette[(config.color||0)%palette.length],bodyColor=palette[(config.body||0)%palette.length]||color;
 const headVariant=Math.abs(config.head||0)%24,bodyVariant=Math.abs(config.body||0)%24,legVariant=Math.abs(config.legs||0)%24;
 const headW=.48+(headVariant%6)*.025,headH=.36+(Math.floor(headVariant/6)%4)*.035,headD=.44+(headVariant%4)*.02;
 const bodyW=.64+(bodyVariant%5)*.035,bodyH=.72+(Math.floor(bodyVariant/5)%4)*.045,bodyD=.48+(bodyVariant%3)*.035;
 const wheelR=.13+(legVariant%5)*.012,wheelX=.31+(legVariant%4)*.025;
 // Four-wheel base, articulated metal legs and side bearings.
 box(g,.58+(legVariant%4)*.04,.16,.44+(Math.floor(legVariant/4)%3)*.04,"#202a28",0,.18,0,{metalness:.48});
 for(const side of [-1,1]){const wheel=new T.Mesh(new T.CylinderGeometry(wheelR,wheelR,.13,16),material("#202421",.45,.55));wheel.rotation.z=Math.PI/2;wheel.position.set(side*wheelX,.18,.04);g.add(wheel);wheels.push(wheel);const hub=new T.Mesh(new T.CylinderGeometry(wheelR*.48,wheelR*.48,.145,12),material("#9aab9e",.42,.7));hub.rotation.z=Math.PI/2;hub.position.set(side*wheelX,.18,.04);g.add(hub);pipe(g,[side*.24,.28,0],[side*.19,.63,0],.055,"#aab8ad");pipe(g,[side*.19,.63,0],[side*.28,.78,0],.045,"#657c6f")}
 // Variable torso silhouettes and control panels for the collected body parts.
 box(g,bodyW,bodyH,bodyD,"#294d3b",0,1.03,0);
 box(g,bodyW*.92,bodyH*.92,bodyD*.98,bodyColor,0,1.06,.025);
 box(g,bodyW*.76,bodyH*.76,.025,"#c1d6c4",0,1.08,bodyD*.5+.025);
 box(g,bodyW*.60,bodyH*.60,.025,color,0,1.08,bodyD*.5+.045);
 box(g,bodyW*.46,bodyH*.43,.035,"#1d3028",0,1.08,bodyD*.5+.07);
 box(g,bodyW*.30,.025,.035,"#78b995",0,1.20,bodyD*.5+.095,{emissive:"#397b56"});
 for(let i=0;i<3;i++){const button=new T.Mesh(new T.SphereGeometry(.025,8,6),material(i===bodyVariant%3?"#d9c16b":"#84978a",.5,.25,i===bodyVariant%3?"#9b8538":null));button.position.set((i-1)*.095,.91,bodyD*.5+.095);g.add(button)}
 // Shoulder bearings and slim arms.
 for(const side of [-1,1]){const joint=new T.Mesh(new T.SphereGeometry(.12,12,10),material("#8fa49a",.45,.42));joint.position.set(side*.46,1.35,0);g.add(joint);armSegments.push(pipe(g,[side*.46,1.35,0],[side*.62,1.08,.03],.055,"#b5c0b5"));armSegments.push(pipe(g,[side*.62,1.08,.03],[side*.66,.82,.09],.045,"#657e70"));const claw=box(g,.13,.09,.11,"#c0cec0",side*.66,.78,.1);claw.rotation.z=side*.12}
 // Head proportions, face panel, antenna and side sensors vary with each unlocked head.
 box(g,headW,headH,headD,"#3a6a50",0,1.83,0);
 box(g,headW*.9,headH*.9,headD*.96,color,0,1.84,.015);
 const faceZ=headD*.5+.035;
 box(g,headW*.72,headH*.56,.035,"#1b2d25",0,1.83,faceZ);
 for(const side of [-1,1]){const eye=new T.Mesh(new T.SphereGeometry(.045+(headVariant%3)*.004,10,8),material("#f7df74",.32,.08,"#e4c858"));eye.position.set(side*headW*.18,1.83+headH*.04,faceZ+.025);g.add(eye)}
 box(g,headW*.2,.025,.025,"#92dfae",0,1.83-headH*.25,faceZ+.025,{emissive:"#4ebd81"});
 box(g,headW*.9,.035,headD*.98,"#dbe8d8",0,1.83+headH/2+.015,.015);
 for(const side of [-1,1])for(const y of [1.83-headH*.31,1.83+headH*.31]){const bolt=new T.Mesh(new T.SphereGeometry(.026,8,6),material("#d7e0d2",.42,.45));bolt.position.set(side*headW*.4,y,headD*.5+.02);g.add(bolt)}
 if(headVariant%3!==0){const ax=headVariant%2?-.1:.1,topY=1.83+headH/2+.025;pipe(g,[ax,topY,0],[ax-.02,topY+.18+(headVariant%4)*.025,0],.022,"#c0cabe");const tipColor=headVariant%2?"#df6c53":"#f1d56e",tip=new T.Mesh(new T.SphereGeometry(.045+(headVariant%3)*.006,8,8),material(tipColor,.38,.18,tipColor));tip.position.set(ax-.02,topY+.2+(headVariant%4)*.025,0);g.add(tip)}
 if(headVariant%5===0){for(const side of [-1,1]){const ear=box(g,.12,.18,.2,"#a9b9a9",side*(headW*.53),1.83,.01);ear.rotation.z=side*.12}}
 if(legVariant%4===1){for(const side of [-1,1]){const foot=new T.Mesh(new T.CylinderGeometry(.17+(legVariant%3)*.02,.17+(legVariant%3)*.02,.1,16),material("#527f71",.45,.28));foot.rotation.z=Math.PI/2;foot.position.set(side*(wheelX+.06),.14,.06);g.add(foot)}}
 else if(legVariant%4===2){for(const side of [-1,1]){const support=box(g,.12,.3,.14,"#9aa99d",side*.24,.3,-.16);support.rotation.z=side*.18}}
 else if(legVariant%4===3){for(const side of [-1,1]){const plate=box(g,.16,.24,.3,"#65796b",side*.38,.35,.02);plate.rotation.z=side*.15}}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});g.userData.wheels=wheels;g.userData.armSegments=armSegments;return g
}
function addPanel(scene,x,y,z,w,h,color="#34372f"){box(scene,w,h,.18,"#0a0b0a",x+.04,y-.04,z-.08);box(scene,w,h,.18,color,x,y,z);box(scene,w-.16,h-.16,.035,"#10150f",x,y,z+.105)}
function gear(parent,x,y,z,r,color="#8e3c30"){const g=new T.Group();g.position.set(x,y,z);parent.add(g);const disk=new T.Mesh(new T.CylinderGeometry(r,r,r*.22,20),material(color,.5,.45));disk.rotation.x=Math.PI/2;g.add(disk);const ring=new T.Mesh(new T.TorusGeometry(r*.66,r*.09,8,24),material("#d0a96b",.45,.42));ring.position.z=r*.13;g.add(ring);for(let i=0;i<12;i++){const a=i*Math.PI/6,t=box(g,r*.24,r*.12,r*.18,"#b9a06a",Math.cos(a)*r*.88,Math.sin(a)*r*.88,0);t.rotation.z=a}const hub=new T.Mesh(new T.CylinderGeometry(r*.2,r*.2,r*.25,12),material("#27251e",.45,.65));hub.rotation.x=Math.PI/2;hub.position.z=r*.1;g.add(hub);return g}
function makeBuilder(state){
 const scene=new T.Scene();scene.background=new T.Color("#171a19");scene.fog=new T.Fog("#171a19",18,38);
 scene.add(new T.HemisphereLight(0x9ca7a0,0x121412,1.45));const key=new T.DirectionalLight(0xffe6c8,2.0);key.position.set(-4,9,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;scene.add(key);const rim=new T.DirectionalLight(0x4b9d7d,.8);rim.position.set(5,5,-5);scene.add(rim);
 // Dark industrial assembly room, matching the original screenshot rather than a bright showroom.
 plane(scene,18,13,"#292b27",0,0,0);box(scene,18,6,.45,"#292c29",0,3,-5.1);box(scene,.35,5.8,12,"#222522",-8.8,2.9,0);box(scene,.35,5.8,12,"#242724",8.8,2.9,0);for(let row=0;row<9;row++)for(let col=0;col<22;col++){const tile=new T.Mesh(new T.CylinderGeometry(.17,.17,.035,6),material((row+col)%5===0?"#383a35":"#222522",.96,.03));tile.rotation.x=Math.PI/2;tile.position.set(-8.2+col*.39, .35+row*.58,-4.84);scene.add(tile)}for(let i=0;i<9;i++){box(scene,.025,.08,12,"#454840",-8.1+i*2,0.05,0);box(scene,18,.025,.08,"#41443c",0,.05,-5.2+i*1.3)}
 // Robot display plinth with a dark ring and a soft-lit top.
 const plinth=new T.Mesh(new T.CylinderGeometry(2.0,2.12,.22,48),material("#52574f",.68,.2));plinth.position.set(-1.35,.12,.25);scene.add(plinth);const rimRing=new T.Mesh(new T.TorusGeometry(1.92,.035,8,48),material("#9ba99a",.48,.28));rimRing.rotation.x=Math.PI/2;rimRing.position.set(-1.35,.24,.25);scene.add(rimRing);const top=new T.Mesh(new T.CircleGeometry(1.82,48),material("#858a80",.9,.04));top.rotation.x=-Math.PI/2;top.position.set(-1.35,.237,.25);scene.add(top);
 const gorbi=robot(scene,state.robot,1.45);gorbi.position.set(-1.35,.24,.25);
 // Parts rack arranged as selectable head, body, leg and paint rows.
 box(scene,2.55,4.65,.25,"#555b52",4.65,2.45,-2.9);box(scene,2.34,4.42,.12,"#252a25",4.65,2.45,-2.72);
 for(let row=0;row<4;row++){
  const y=4.12-row*.98,selected=(row===0&&state.buildFocus==="head")||(row===1&&state.buildFocus==="body")||(row===2&&state.buildFocus==="legs")||(row===3&&state.buildFocus==="color");
  box(scene,2.18,.065,.68,selected?"#7cae8d":"#4d534a",4.65,y,-2.23,{emissive:selected?"#315a40":null});
  box(scene,2.08,.035,.6,"#9da198",4.65,y+.045,-2.23);
  if(row===0){
   for(let col=0;col<4;col++){const idx=(state.robot.head+col)%24,x=4.65+(col-1.5)*.45,w=.25+(idx%4)*.018,h=.24+Math.floor(idx/6)*.012,d=.22+(idx%3)*.015;box(scene,w,h,d,palette[(idx+state.robot.color)%palette.length],x,y+.22,-1.98);box(scene,w*.7,h*.48,.025,"#172b22",x,y+.22,-1.86);for(const side of [-1,1]){const eye=new T.Mesh(new T.SphereGeometry(.025,8,6),material("#f2d96d",.35,.08,"#d7bb4d"));eye.position.set(x+side*w*.18,y+.23,-1.84);scene.add(eye)}if(idx%3!==0)pipe(scene,[x,y+.22+h/2,-1.98],[x-.025,y+.34+h/2,-1.98],.012,"#aeb9ad")}
  }else if(row===1){
   for(let col=0;col<4;col++){const idx=(state.robot.body+col)%24,x=4.65+(col-1.5)*.45,w=.25+(idx%5)*.015,h=.28+Math.floor(idx/8)*.025;box(scene,w,h,.22,palette[(idx+state.robot.color)%palette.length],x,y+.23,-1.98);box(scene,w*.68,h*.62,.025,"#284432",x,y+.23,-1.855);box(scene,w*.36,.025,.02,"#9ac8a4",x,y+.25,-1.835)}
  }else if(row===2){
   for(let col=0;col<4;col++){const idx=(state.robot.legs+col)%24,x=4.65+(col-1.5)*.45;box(scene,.3,.12,.25,"#29342d",x,y+.12,-1.98);for(const side of [-1,1]){const wheel=new T.Mesh(new T.CylinderGeometry(.065+(idx%3)*.008,.065+(idx%3)*.008,.055,10),material(idx%2?"#202421":"#84978a",.48,.48));wheel.rotation.z=Math.PI/2;wheel.position.set(x+side*.13,y+.12,-1.94);scene.add(wheel)}if(idx%3===1)for(const side of [-1,1])box(scene,.07,.22,.08,palette[(idx+state.robot.color)%palette.length],x+side*.1,y+.23,-1.98)}
  }else{
   for(let col=0;col<6;col++){const idx=(state.robot.color+col)%palette.length;box(scene,.22,.22,.12,palette[idx],4.02+col*.25,y+.22,-1.98);if(col===0)box(scene,.24,.26,.025,"#d8dfd2",4.02+col*.25,y+.22,-1.9)}
  }
 }
 // Side carousel markers and a low-profile tool cabinet.
 box(scene,2.6,.55,.5,"#454a42",4.65,.3,-2.6);for(let i=0;i<5;i++)box(scene,.28,.18,.05,i===state.robot.color%5?"#c8e7b8":"#6e756b",4.0+i*.32,.32,-2.32);
 return {scene,player:gorbi};
}
function makeLab(state,isBuild){
 const scene=new T.Scene();scene.background=new T.Color("#141916");scene.fog=new T.Fog("#141916",15,31);addLights(scene);
 plane(scene,18,13,"#303229",0,0,0);for(let i=0;i<10;i++){box(scene,18,.018,.025,i%2?"#282a24":"#3b3d33",0,.018,-5.5+i*1.2);box(scene,.025,.018,13,"#292b25",-8+i*1.75,.019,0)}
 // Three-dimensional industrial room with heavy side walls and ceiling beams.
 box(scene,18,5.6,.5,"#30332b",0,2.8,-5.2);box(scene,.5,5.5,10,"#222720",-8.8,2.7,0);box(scene,.5,5.5,10,"#1d211d",8.8,2.7,0);box(scene,18,.25,10,"#0d100d",0,5.5,0);
 for(let i=0;i<9;i++){const x=-8+i*2;box(scene,.07,5.1,.11,"#55584a",x,2.75,-4.91);box(scene,1.7,.06,.08,"#45483d",x+.85,4.3,-4.87)}
 // Left green lift and illuminated controls.
 addPanel(scene,-6.5,2.35,-4.85,2.25,3.55,"#3b4035");box(scene,1.45,2.7,.09,"#15251c",-6.5,2.22,-4.65);box(scene,.075,2.45,.1,"#a1e4b9",-7.2,2.28,-4.57,{emissive:"#76d8a1"});box(scene,.65,.45,.08,"#0e2117",-6.5,3.45,-4.55);box(scene,.34,.06,.03,"#8ce5ac",-6.5,3.47,-4.51,{emissive:"#5cc88a"});
 // Inventory monitor and a grid of glowing parts.
 addPanel(scene,-2.7,3.05,-4.82,2.7,2.35,"#383b31");box(scene,2.25,1.28,.06,"#0c1c12",-2.7,3.15,-4.65);for(let r=0;r<4;r++)for(let c=0;c<8;c++)box(scene,.16,.055,.025,(r+c)%4===0?"#d5ed9d":"#4fb67b",-3.58+c*.25,3.58-r*.25,-4.6,{emissive:(r+c)%4===0?"#b4df75":"#3d9c67"});
 // Tool niche and pipes.
 addPanel(scene,.15,2.6,-4.84,1.25,3.1,"#272a23");for(let i=0;i<3;i++){pipe(scene,[ -.2+i*.35,2.4,-4.55],[-.17+i*.35,1.65,-4.5],.055,"#aab1a0")}
 pipe(scene,[-8,1.2,-3.8],[-4.6,1.2,-3.8],.14,"#111512");pipe(scene,[-4.6,1.2,-3.8],[-3.8,1.7,-3.8],.14,"#111512");pipe(scene,[1.1,1.55,-3.8],[4.5,1.55,-3.8],.13,"#101310");pipe(scene,[4.5,1.55,-3.8],[5.2,2.25,-3.8],.13,"#101310");
 // Parts rack and package dispenser on the right.
 addPanel(scene,6.35,2.65,-4.8,2.45,4.3,"#33362d");for(let i=0;i<4;i++){const y=4.15-i*.88;box(scene,2.08,.055,.55,"#11140f",6.35,y,-4.48);box(scene,.48,.48,.38,palette[i],6.35,y+.25,-4.22);box(scene,.31,.22,.04,"#18271e",6.35,y+.25,-4.0);box(scene,.055,.065,.025,"#f0d972",6.25,y+.27,-3.97);box(scene,.055,.065,.025,"#f0d972",6.45,y+.27,-3.97)}
 const hatch=box(scene,2.12,.25,.62,"#10130f",6.35,.65,-4.45);box(scene,1.95,.1,.48,"#4a4d40",6.35,.78,-4.42);pipe(scene,[7.35,.8,-4.02],[7.35,.42,-4.02],.055,"#b2bba8");const handle=box(scene,.35,.1,.16,"#b5c0ae",7.35,.37,-4.02);const packagePart=new T.Group();scene.add(packagePart);box(packagePart,.42,.38,.38,"#91c5a1",0,0,0);box(packagePart,.3,.22,.03,"#1a3024",0,0,.205);box(packagePart,.06,.07,.02,"#f3dd72",-.075,.025,.23,{emissive:"#d8bc4c"});box(packagePart,.06,.07,.02,"#f3dd72",.075,.025,.23,{emissive:"#d8bc4c"});packagePart.visible=false;
 // Hazard-striped service ramp, floor emblem, and foreground cable.
 const ramp=box(scene,3.1,.1,1.4,"#24261e",5.0,.05,-1.3,{rotationY:-.3});for(let i=0;i<8;i++){const stripe=box(scene,.16,.025,1.3,i%2?"#181a14":"#b3a65f",3.75+i*.35,.12,-1.3,{rotationY:-.3})}
 const emblem=new T.Mesh(new T.CircleGeometry(2.2,48),material("#1b3a33",.98,.02));emblem.rotation.x=-Math.PI/2;emblem.position.set(0,.025,1.35);scene.add(emblem);const emblemRing=new T.Mesh(new T.RingGeometry(2.0,2.08,48),material("#597063"));emblemRing.rotation.x=-Math.PI/2;emblemRing.position.set(0,.03,1.35);scene.add(emblemRing);
 pipe(scene,[-9,.1,4.5],[-4,.1,4.5],.1,"#090b0a");pipe(scene,[-4,.1,4.5],[-2,.1,3.9],.1,"#090b0a");pipe(scene,[-2,.1,3.9],[0,.1,4.4],.1,"#090b0a");
 const gorbi=robot(scene,state.robot,isBuild?1.18:1.0);gorbi.position.set(isBuild?-1.0:0,0,isBuild?.1:.15);
 const helper=robot(scene,{head:2,body:1,legs:1,color:3},.42);helper.position.set(-3.1,0,1.7);
 if(isBuild){ // Assembly cradle and component selector carousel.
  box(scene,4.2,.2,2.2,"#111511",-1.0,.2,-.4);box(scene,4.0,.12,2.0,"#4b4e42",-1.0,.32,-.4);
  for(const side of [-1,1]){const g=gear(scene,-1+side*3.2,1.6,-1.7,.42,side<0?"#b04f43":"#488c70");g.rotation.z=Math.PI/2}
  addPanel(scene,4.7,2.5,-4.1,1.7,3.6,"#30342b");for(let i=0;i<4;i++){box(scene,1.35,.05,.48,"#10130f",4.7,3.65-i*.82,-3.85);const piece=robot(scene,{head:i+1,body:i+1,legs:i+1,color:i},.22);piece.position.set(4.7,2.75-i*.82,-3.5)}
 }
 return {scene,player:gorbi,helper,handle,hatch,packagePart};
}
function makeLevel(state){
 const d=state.levelData,scene=new T.Scene();scene.background=new T.Color("#171817");scene.fog=new T.Fog("#171817",17,32);addLights(scene,d.theme);
 const cols=d.cols,rows=d.rows;plane(scene,cols,rows,["#494236","#334142","#48332d","#454136","#2c4240","#3d3548"][d.theme],0,0,0);
 for(let z=0;z<=rows;z+=2)box(scene,cols,.018,.025,"#39382f",0,.018,z-rows/2);for(let x=0;x<=cols;x+=2)box(scene,.025,.018,rows,"#39382f",x-cols/2,.019,0);for(let i=0;i<26;i++){const chip=new T.Mesh(new T.DodecahedronGeometry(.09+(i%3)*.025,0),material(i%2?"#5c5548":"#292a25",.98,.01));chip.scale.set(1.5,.08,.8);chip.position.set(((i*17)%cols)-cols/2+.5,.035,((i*11)%rows)-rows/2+.5);scene.add(chip)}
 // A layered industrial/cavern backdrop, with the large gears and suspended machinery seen in the original levels.
 const backZ=-rows/2-1.25,backW=cols+8;box(scene,backW,5.2,.38,d.theme===1?"#25282a":"#302b25",0,2.6,backZ);
 if(d.theme===1||d.theme===4){for(let rr=0;rr<9;rr++)for(let cc=0;cc<Math.ceil(backW/.36);cc++){const tile=new T.Mesh(new T.CylinderGeometry(.16,.16,.035,6),material((rr+cc)%5===0?"#55564f":"#343633",.95,.08));tile.rotation.x=Math.PI/2;tile.position.set(-backW/2+.2+cc*.36,.25+rr*.56,backZ+.22);scene.add(tile)}}else{for(let i=0;i<Math.ceil(backW/.7);i++){const rock=new T.Mesh(new T.DodecahedronGeometry(.48+(i%3)*.11,1),material(["#494239","#38352f","#5b4a3b"][i%3],.99,.01));rock.scale.set(1.6,1.2+(i%4)*.3,.65);rock.position.set(-backW/2+i*.68,1.1+(i%3)*.28,backZ+.28);scene.add(rock)}}
 for(let i=0;i<Math.ceil(backW/2.4);i++)pipe(scene,[-backW/2+i*2.4,3.2,backZ+.38],[-backW/2+i*2.4+2.0,3.2,backZ+.38],.075,"#111514");
 for(const side of [-1,1]){const bigGear=gear(scene,side*(cols*.25),2.15,backZ+.42,1.0+(side>0?.18:0),d.theme===2?"#a04431":"#916c2e");bigGear.rotation.z=side*.08}
 pipe(scene,[0,4.5,backZ+.4],[0,2.05,backZ+.4],.045,"#101312");const wrecking=new T.Mesh(new T.SphereGeometry(.38,18,14),material("#aeb0a8",.28,.82));wrecking.position.set(0,1.72,backZ+.4);wrecking.castShadow=true;scene.add(wrecking);
 // Cave walls, ledges and pipework around the 24 generated routes.
 for(let side=0;side<2;side++){for(let i=0;i<8;i++){const x=side?cols/2+.5+i*.6:-cols/2-.5-i*.6;const h=1.3+(i%3)*.55;const rock=new T.Mesh(new T.DodecahedronGeometry(.45+(i%3)*.15,0),material(["#39372f","#51483b","#302f2b"][i%3],.98,.02));rock.scale.set(1.4,h,1.2);rock.position.set(x,h*.5,((i*7)%rows)-rows/2);scene.add(rock)}}
 for(let i=0;i<7;i++){pipe(scene,[-cols/2+i*2.2,2.3,-rows/2-.35],[-cols/2+i*2.2+1.6,2.3,-rows/2-.35],.08,"#111514")}
 const wallMats=["#4f473b","#394345","#53392e","#4a4538","#2f4643","#40364b"];
 for(let z=0;z<rows;z++)for(let x=0;x<cols;x++)if(d.walls[z][x]){
  const wx=x-cols/2+.5,wz=z-rows/2+.5,h=1.15+(z%3)*.08;
  if(d.theme===1||d.theme===4){
   box(scene,.98,h,.98,wallMats[d.theme],wx,h/2,wz);
   for(let rr=0;rr<2;rr++)for(let cc=0;cc<3;cc++){const tile=new T.Mesh(new T.CylinderGeometry(.13,.13,.025,6),material((rr+cc)%3===0?"#9ba39a":"#606760",.8,.18));tile.rotation.x=Math.PI/2;tile.position.set(wx-.3+cc*.3,.25+rr*.42,wz+.505);scene.add(tile)}
  }else{
   const rock=new T.Mesh(new T.DodecahedronGeometry(.62,1),material(wallMats[d.theme],.99,.01));rock.scale.set(1.08,h/1.05,1.08);rock.position.set(wx,h*.48,wz);scene.add(rock);
   const shoulder=new T.Mesh(new T.DodecahedronGeometry(.35,0),material(["#8e8068","#657575","#95684e","#a29669","#5e8880","#8c78a0"][d.theme],.99,.01));shoulder.scale.set(1.2,.8,1.05);shoulder.position.set(wx+(x%2?-.2:.2),h*.82,wz+.08);scene.add(shoulder);
  }
  for(let k=0;k<3;k++){const chip=box(scene,.12,.035,.025,k%2?"#262620":"#82735f",wx-.25+k*.2,h*.55+(k%2)*.18,wz+.48);chip.rotation.z=(k-1)*.2}
 }
 const parts=[];for(let i=0;i<d.parts.length;i++){const q=d.parts[i],type=i%3,g=new T.Group();scene.add(g);if(type===0){box(g,.42,.38,.38,palette[(state.level+i)%palette.length],0,.42,0);box(g,.29,.22,.025,"#15281f",0,.42,.205);box(g,.065,.07,.02,"#f4dc70",-.075,.44,.225,{emissive:"#dfc14d"});box(g,.065,.07,.02,"#f4dc70",.075,.44,.225,{emissive:"#dfc14d"})}else if(type===1){box(g,.48,.42,.32,palette[(state.level+i)%palette.length],0,.35,0);box(g,.26,.25,.035,"#223b2c",0,.36,.18)}else{for(const side of [-1,1]){box(g,.12,.38,.13,palette[(state.level+i)%palette.length],side*.13,.35,0);const wheel=new T.Mesh(new T.CylinderGeometry(.11,.11,.07,10),material("#1e2823",.6,.3));wheel.rotation.z=Math.PI/2;wheel.position.set(side*.13,.14,.02);g.add(wheel)}}g.position.set(q.x-cols/2,0,q.y-rows/2);parts.push(g)}
 const hazards=[];for(const q of d.hazards){let g;if(q.type===0)g=gear(scene,q.x-cols/2,.56,q.y-rows/2,.48,"#8f342c");else{g=new T.Group();scene.add(g);if(q.type===1){box(g,1.1,.07,.07,"#e94d43",0,.65,0,{emissive:"#df332a"});for(const side of [-1,1])box(g,.1,.6,.14,"#8a8c7d",side*.53,.35,0)}else for(let k=-1;k<=1;k++){const spike=new T.Mesh(new T.ConeGeometry(.16,.45,6),material("#b54d3d",.6,.2));spike.position.set(k*.32,.23,0);g.add(spike)}}g.position.x=q.x-cols/2;g.position.z=q.y-rows/2;hazards.push({mesh:g,data:q})}
 const sensor=box(scene,.78,.08,.78,"#536f50",d.sensor.x-cols/2,.06,d.sensor.y-rows/2,{emissive:"#4c8152"});const sensorTop=box(scene,.48,.025,.48,"#9fd36f",d.sensor.x-cols/2,.11,d.sensor.y-rows/2,{emissive:"#6da74c"});
 const doorFrame=box(scene,.95,1.8,.22,"#757565",d.door.x-cols/2,.9,d.door.y-rows/2);const door=box(scene,.68,1.45,.12,"#202a22",d.door.x-cols/2,.8,d.door.y-rows/2,{emissive:"#1c2d20"});
 const crate=box(scene,.64,.64,.64,"#8d6840",state.crate.x-cols/2,.32,state.crate.y-rows/2,{castShadow:true});box(crate,.48,.48,.04,"#b79b67",0,0,.34);const cross1=box(crate,.04,.55,.05,"#5c432a",0,0,.37);const cross2=box(crate,.55,.04,.05,"#5c432a",0,0,.37);
 const player=robot(scene,state.robot,.34);player.position.set(state.player.x-cols/2,0,state.player.y-rows/2);
 return {scene,player,parts,hazards,crate,sensor,sensorTop,door,doorFrame,cols,rows};
}
api.init=function(stage,canvas){if(!T||!stage||!canvas)return false;try{this.stage=stage;this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"low-power"});this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;this.renderer.setSize(stage.clientWidth||960,stage.clientHeight||540,false);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.08;window.addEventListener("resize",()=>{if(!this.ready)return;const w=this.stage.clientWidth||960,h=this.stage.clientHeight||540;this.renderer.setSize(w,h,false);if(this.camera){this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}});this.ready=true;document.body.classList.add("three-d-ready");return true}catch(e){this.ready=false;return false}};
api.hitTest=function(clientX,clientY,canvas){if(!this.ready||!this.camera||!this.refs.handle||!this.refs.hatch)return null;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return null;const ndc=new T.Vector2(((clientX-rect.left)/rect.width)*2-1,-((clientY-rect.top)/rect.height)*2+1);const ray=new T.Raycaster();ray.setFromCamera(ndc,this.camera);const hits=ray.intersectObjects([this.refs.handle,this.refs.hatch],false);if(!hits.length)return null;return hits[0].object===this.refs.handle?"handle":"hatch"};
api.render=function(state){if(!this.ready||state.scene==="title")return;const key=[state.scene,state.level,state.buildFocus,state.robot.head,state.robot.body,state.robot.legs,state.robot.color,(state.openedParts||[]).join(","),(state.parts||[]).join(",")].join("|");if(key!==this.key){this.key=key;this.refs={};if(state.scene==="level"){const built=makeLevel(state);this.scene=built.scene;Object.assign(this.refs,built);this.camera=new T.PerspectiveCamera(48,(this.stage.clientWidth||960)/(this.stage.clientHeight||540),.1,80);this.camera.position.set(0,8.8,12.5);this.camera.lookAt(0,0,0)}else{const built=state.scene==="build"?makeBuilder(state):makeLab(state,false);this.scene=built.scene;Object.assign(this.refs,built);this.camera=new T.PerspectiveCamera(state.scene==="build"?47:50,(this.stage.clientWidth||960)/(this.stage.clientHeight||540),.1,80);this.camera.position.set(state.scene==="build"?-.15:0,state.scene==="build"?4.7:4.3,state.scene==="build"?10.2:14.5);this.camera.lookAt(state.scene==="build"?-.6:0,1.3,0)}}
 const now=performance.now(),moving=!!(state.keys.ArrowLeft||state.keys.ArrowRight||state.keys.ArrowUp||state.keys.ArrowDown||state.keys.KeyA||state.keys.KeyD||state.keys.KeyW||state.keys.KeyS||state.move.left||state.move.right||state.move.up||state.move.down||state.drag);if(this.refs.player){this.refs.player.position.y=state.scene==="level"?(moving?Math.abs(Math.sin(now/75))*.045:Math.sin(now/470)*.012):Math.sin(now/650)*.025;(this.refs.player.userData.wheels||[]).forEach((w,i)=>{w.rotation.x+=moving?.11:.008});(this.refs.player.userData.armSegments||[]).forEach((a,i)=>{a.rotation.z=Math.sin(now/(moving?95:420)+i)*.035})}
 if(state.scene==="lab"&&this.refs.handle){const dispensing=state.dispensedPart!==null,age=performance.now()-(state.dispensedAt||0);this.refs.handle.position.y=state.machinePrimed||state.machinePullStart!==null?.2:.37;this.refs.hatch.material=material(dispensing?"#83b99a":"#4a4d40",.6,.25,dispensing?"#4b9a68":null);this.refs.packagePart.visible=dispensing&&age<1350;this.refs.packagePart.position.set(6.35,1.05+Math.sin(Math.min(1,age/1350)*Math.PI)*.48,-3.78);this.refs.packagePart.scale.setScalar(.72+Math.sin(age/100)*.035)}
 if(state.scene==="level"&&this.refs.player){const d=state.levelData,p=state.player,px=p.x-d.cols/2,pz=p.y-d.rows/2;this.camera.position.x+=(px-this.camera.position.x)*.085;this.camera.position.y+=(7.6-this.camera.position.y)*.045;this.camera.position.z+=(pz+8.8-this.camera.position.z)*.085;this.camera.lookAt(px,.42,pz);this.refs.player.position.set(px,moving?Math.abs(Math.sin(now/75))*.045:Math.sin(now/470)*.012,pz);this.refs.player.rotation.y=p.faceX<0?-Math.PI/2:p.faceX>0?Math.PI/2:p.faceZ<0?Math.PI:0;this.refs.crate.position.set(state.crate.x-d.cols/2,.32,state.crate.y-d.rows/2);this.refs.parts.forEach((m,i)=>{m.visible=!state.collected.includes(i);m.position.y=.08+Math.sin(performance.now()/250+i*1.8)*.06});this.refs.hazards.forEach((h,i)=>{h.mesh.rotation.z=performance.now()/1300+i;h.mesh.position.x=h.data.x-d.cols/2+Math.sin(performance.now()/850+h.data.phase)*h.data.travel});this.refs.sensor.material=material(state.sensorActive?"#a7df72":"#536f50",.7,.12,state.sensorActive?"#75c94f":null);this.refs.door.position.y=state.sensorActive?2.1:.8}
 this.renderer.render(this.scene,this.camera)};
window.Gorbi3D=api;
})();