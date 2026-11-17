PV.spawnEnemy = function(g,type,x,y,small=false) {
  const boss=type==='boss';const hp=boss?(g.wave===10?160:90):type==='splitter'?5:type==='weaver'?3:small?1:2;
  const e={type,x,y,r:boss?(g.wave===10?67:56):small?11:type==='splitter'?25:20,hp,maxHp:hp,angle:g.random()*6.28,phase:g.random()*6.28,shot:1+g.random(),small};g.enemies.push(e);return e;
};
PV.beginWave = function(g) {
  g.wave++;g.state='play';g.waveTime=0;g.queue=[];g.orbs=[];g.bolts=[];
  const count=5+g.wave*2;
  for(let i=0;i<count;i++) {const side=Math.floor(g.random()*4),v=g.random();g.queue.push({at:i*.55,type:g.wave>2&&i%4===0?'splitter':g.wave>1&&i%3===0?'weaver':'chaser',x:side<2?(side?1240:40):80+v*1120,y:side<2?140+v*550:(side===2?120:720)});}
  if(g.wave===5||g.wave===10){PV.spawnEnemy(g,'boss',980,320);PV.audio.play('alarm');}
};
PV.updateEnemies = function(g,dt) {
  g.waveTime+=dt;while(g.queue.length&&g.queue[0].at<=g.waveTime){const s=g.queue.shift();PV.spawnEnemy(g,s.type,s.x,s.y);PV.burst(g,s.x,s.y,'#bf75ff',12);}
  for(const e of g.enemies){const a=Math.atan2(g.player.y-e.y,g.player.x-e.x);e.angle+=dt*(e.type==='boss'?.35:1);e.shot-=dt;
    const speed=e.type==='boss'?24:e.type==='weaver'?60:e.small?150:75+g.wave*4;
    const distance=PV.distance(e,g.player);const move=e.type==='weaver'?a+Math.sin(g.time*2+e.phase)*1.5+(distance<250?1.6:0):a;
    e.x+=Math.cos(move)*speed*dt;e.y+=Math.sin(move)*speed*dt;
    if(e.type==='weaver'||e.type==='boss') {if(e.shot<=0){e.shot=e.type==='boss'?1.5:2.8;const n=e.type==='boss'?(g.wave===10?18:12):1;for(let i=0;i<n;i++){const b=n===1?a:e.angle+i*Math.PI*2/n;g.orbs.push({x:e.x,y:e.y,vx:Math.cos(b)*150,vy:Math.sin(b)*150,life:8,r:6});}}}
    if(distance<e.r+g.player.r) PV.hitPlayer(g,e.type==='boss'?30:18,e.type.toUpperCase()+' COLLISION');
  }
};
PV.killEnemy = function(g,e) {
  e.dead=true;g.kills++;g.shake=e.type==='boss'?14:3;PV.audio.play('explode');PV.burst(g,e.x,e.y,PV.colors[e.type],e.type==='boss'?65:20);
  const count=e.type==='boss'?25:3;for(let i=0;i<count;i++){const a=g.random()*6.28;g.cores.push({x:e.x,y:e.y,vx:Math.cos(a)*100,vy:Math.sin(a)*100,value:e.type==='boss'?40:20});}
  if(e.type==='splitter')for(let i=0;i<3;i++)PV.spawnEnemy(g,'chaser',e.x+Math.cos(i*2.094)*22,e.y+Math.sin(i*2.094)*22,true);
  if(e.type==='boss'&&g.wave===10){g.state='victory';g.score+=2500;}
};
