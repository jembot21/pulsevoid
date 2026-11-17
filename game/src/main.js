const canvas=document.getElementById('game');
const params=new URLSearchParams(location.search);
const seed=Number(params.get('seed')||7319)>>>0;
const g=PV.game={canvas,ctx:canvas.getContext('2d'),seed,keys:{},mouse:{x:850,y:350,down:false},stars:[],state:'title'};
const starRandom=PV.rng(45);for(let i=0;i<180;i++)g.stars.push({x:starRandom()*1280,y:starRandom()*800,r:starRandom()<.9?1:2,a:.12+starRandom()*.45});
PV.reset=function(){Object.assign(g,{random:PV.rng(seed),fxRandom:PV.rng(seed+1),player:PV.newPlayer(),enemies:[],bolts:[],orbs:[],cores:[],particles:[],queue:[],score:0,kills:0,wave:0,time:0,waveTime:0,flash:0,shake:0,cause:'',choices:[]});};
PV.upgrades=[
  {name:'Rapid fire',desc:'Pulse interval reduced by 18%.',apply:p=>p.rate=Math.max(.065,p.rate*.82)},
  {name:'Twin bolts',desc:'Two pulses per trigger pull.',apply:p=>p.twin=true,available:p=>!p.twin},
  {name:'Phase engine',desc:'Dash recharges 20% faster.',apply:p=>p.recharge=Math.max(.65,p.recharge*.8)},
  {name:'Hull plating',desc:'+25 max hull. Repair 25 hull.',apply:p=>{p.maxHull+=25;p.hull=Math.min(p.maxHull,p.hull+25);}},
  {name:'Core magnet',desc:'Expand core attraction by 100.',apply:p=>p.magnet+=100},
  {name:'Piercing pulse',desc:'Bolts pass through hostiles.',apply:p=>p.pierce=true,available:p=>!p.pierce}
];
PV.selectUpgrade=function(index){if(g.state!=='upgrade'||!g.choices[index])return;g.choices[index].apply(g.player);PV.beginWave(g);};
PV.start=function(){g.staged=false;PV.reset();PV.beginWave(g);};
PV.update=function(dt){if(g.state!=='play')return;g.time+=dt;g.flash=Math.max(0,g.flash-dt);g.shake=Math.max(0,g.shake-dt*30);PV.updatePlayer(g,dt);PV.updateEnemies(g,dt);
  for(const b of g.bolts){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;for(const e of g.enemies){if(e.dead||b.life<=0||b.hits.has(e))continue;if(PV.distance(b,e)<e.r+5){b.hits.add(e);e.hp--;PV.burst(g,b.x,b.y,PV.colors[e.type],4);if(!b.pierce)b.life=0;if(e.hp<=0)PV.killEnemy(g,e);}}}
  g.enemies=g.enemies.filter(e=>!e.dead);g.bolts=g.bolts.filter(b=>b.life>0);
  for(const o of g.orbs){o.x+=o.vx*dt;o.y+=o.vy*dt;o.life-=dt;if(PV.distance(o,g.player)<g.player.r+o.r){PV.hitPlayer(g,14,'VOID ORB');o.life=0;}}
  g.orbs=g.orbs.filter(o=>o.life>0&&o.x>-20&&o.x<1300&&o.y>90&&o.y<760);
  for(const q of g.cores){const d=PV.distance(q,g.player);if(d<g.player.magnet){q.vx+=(g.player.x-q.x)*dt*28;q.vy+=(g.player.y-q.y)*dt*28;}q.x=PV.clamp(q.x+q.vx*dt,30,1250);q.y=PV.clamp(q.y+q.vy*dt,110,740);q.vx*=Math.exp(-3*dt);q.vy*=Math.exp(-3*dt);if(d<20){g.score+=q.value;q.taken=true;PV.audio.play('core');}}
  g.cores=g.cores.filter(q=>!q.taken);for(const p of g.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}g.particles=g.particles.filter(p=>p.life>0);
  if(g.state==='play'&&!g.queue.length&&!g.enemies.length){for(const q of g.cores)g.score+=q.value;g.cores=[];g.orbs=[];g.player.hull=Math.min(g.player.maxHull,g.player.hull+10);g.state='upgrade';PV.audio.play('clear');const pool=PV.upgrades.filter(u=>!u.available||u.available(g.player));g.choices=[];while(g.choices.length<3)g.choices.push(pool.splice(Math.floor(g.random()*pool.length),1)[0]);}
};
function pointer(e){const r=canvas.getBoundingClientRect();g.mouse.x=(e.clientX-r.left)*1280/r.width;g.mouse.y=(e.clientY-r.top)*800/r.height;}
canvas.addEventListener('mousemove',pointer);canvas.addEventListener('mousedown',e=>{pointer(e);PV.audio.unlock();if(e.button!==0)return;g.mouse.down=true;
  if(g.state==='title')PV.start();else if(g.state==='end'||g.state==='victory')PV.start();else if(g.state==='paused')g.state='play';else if(g.state==='upgrade'&&g.mouse.y>=389&&g.mouse.y<=599){const i=Math.floor((g.mouse.x-160)/330);if(g.mouse.x>=160+i*330&&g.mouse.x<=460+i*330)PV.selectUpgrade(i);}
});
window.addEventListener('mouseup',()=>g.mouse.down=false);canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();g.keys[e.code]=true;if(e.repeat)return;PV.audio.unlock();if(e.code==='KeyM')PV.audio.muted=!PV.audio.muted;
  if(e.code==='Enter'&&g.state==='title')PV.start();if(e.code==='KeyR'&&(g.state==='end'||g.state==='victory'))PV.start();if(e.code==='KeyP'||e.code==='Escape'){if(g.state==='play')g.state='paused';else if(g.state==='paused')g.state='play';}if(/^Digit[123]$/.test(e.code))PV.selectUpgrade(Number(e.code.slice(-1))-1);
});
window.addEventListener('keyup',e=>g.keys[e.code]=false);window.addEventListener('blur',()=>{g.keys={};g.mouse.down=false;if(g.state==='play')g.state='paused';});
// Staged scenes use the actual entities and renderer, frozen for repeatable captures.
PV.stage=function(shot){g.staged=true;g.wave=shot==='boss'?5:4;g.time=shot==='boss'?143:98;g.waveTime=8;g.score=shot==='boss'?12480:7860;g.player.x=558;g.player.y=455;g.player.angle=-.37;g.mouse={x:850,y:340,down:false};g.state='play';
  const positions=[[190,234],[359,363],[1030,635],[800,245],[1100,395],[950,520],[235,620],[700,665],[435,195],[1160,220],[790,435]];
  positions.forEach(([x,y],i)=>PV.spawnEnemy(g,['chaser','weaver','splitter'][i%3],x,y));
  for(let i=0;i<19;i++){const a=g.random()*6.28,r=35+g.random()*125;g.cores.push({x:680+Math.cos(a)*r,y:510+Math.sin(a)*r,vx:0,vy:0,value:20});}
  for(let i=0;i<7;i++){const x=605+i*32;g.bolts.push({x,y:455-(x-558)*.39,vx:730,vy:-280,life:1});}
  for(let i=0;i<13;i++)g.orbs.push({x:250+i*62,y:310+Math.sin(i)*120,vx:0,vy:0,r:6,life:8});
  PV.burst(g,757,378,'#ffbe69',40);PV.burst(g,650,545,'#79ffcf',25);
  if(shot==='boss'){const b=PV.spawnEnemy(g,'boss',940,330);b.hp=61;g.player.hull=24;g.player.dash=1.2;for(let i=0;i<12;i++){const a=i*6.28/12;g.orbs.push({x:b.x+Math.cos(a)*155,y:b.y+Math.sin(a)*155,vx:0,vy:0,r:6,life:8});}}
  if(shot==='end'){g.state='end';g.wave=7;g.time=224;g.score=18940;g.player.hull=0;g.cause='VOID ORB';}
  if(shot==='title'){g.state='title';g.wave=0;g.time=0;g.score=0;}
};
PV.reset();if(params.has('shot'))PV.stage(params.get('shot'));else {PV.stage('title');g.staged=false;}
let last=performance.now(),accumulator=0;
function frame(now){const elapsed=Math.min(.1,(now-last)/1000);last=now;if(!g.staged){accumulator+=elapsed;while(accumulator>=1/120){PV.update(1/120);accumulator-=1/120;}}PV.render(g);requestAnimationFrame(frame);}
requestAnimationFrame(frame);
