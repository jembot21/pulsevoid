PV.timeLabel=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
PV.hud=function(g){const c=g.ctx,p=g.player; c.fillStyle='#060d1be8';c.fillRect(0,0,1280,94);PV.line(c,24,93,1256,93,'#285068');
  PV.text(c,'PULSEVOID',30,42,27,'#d7fff8');PV.text(c,'VOID RESPONSE DIVISION  /  01',32,67,10,'#698e9f');
  PV.text(c,'SCORE',315,28,11);PV.text(c,String(g.score).padStart(6,'0'),315,59,28,'#f1fff9');
  PV.text(c,'HULL INTEGRITY',525,28,11);PV.text(c,`${Math.ceil(p.hull)} / ${p.maxHull}`,711,28,11,p.hull<30?'#ff6385':'#b0e5df','right');c.fillStyle='#1b2d3d';c.fillRect(525,42,186,9);c.fillStyle=p.hull<30?'#ff557e':'#73fbd0';c.fillRect(525,42,186*p.hull/p.maxHull,9);PV.text(c,p.hull<30?'! CRITICAL — DASH TO EVADE':'SYSTEMS NOMINAL',525,70,10,p.hull<30?'#ff7695':'#668f9b');
  PV.text(c,'WAVE',780,28,11);PV.text(c,`${String(g.wave||1).padStart(2,'0')} / 10`,780,60,27,'#e4f8ff');
  PV.text(c,'SHIFT / DASH',957,28,11);PV.text(c,p.dash>0?`${p.dash.toFixed(1)}s`:'READY',957,58,20,p.dash>0?'#99aebf':'#7affd3');c.fillStyle='#23394a';c.fillRect(957,69,100,3);c.fillStyle='#77ffdb';c.fillRect(957,69,100*(1-p.dash/p.recharge),3);
  PV.text(c,PV.timeLabel(g.time),1238,43,23,'#c5dae5','right');PV.text(c,PV.audio.muted?'M / MUTED':'M / AUDIO',1238,68,10,'#6d8d9d','right');
  PV.text(c,'SURVIVE 10 WAVES  /  BREAK THE VOID',32,778,11,'#769bad');PV.text(c,`SEED ${g.seed}    ·    ${g.state==='play'?g.enemies.length+g.queue.length+' HOSTILES':'PULSE DRIVE ONLINE'}    ·    P / PAUSE`,1248,778,11,'#769bad','right');
  const boss=g.enemies.find(e=>e.type==='boss');if(boss){PV.text(c,g.wave===10?'THE NULL SOVEREIGN':'WARDEN / HEX-05',640,132,13,'#ff8ea7','center');c.fillStyle='#422139';c.fillRect(420,143,440,6);c.fillStyle='#ff6387';c.fillRect(420,143,440*boss.hp/boss.maxHp,6);}
  else if(g.state==='play'&&g.waveTime<3){PV.text(c,`SECTOR ${String(g.wave).padStart(2,'0')} / INCOMING`,640,142,15,'#99fbe5','center');}
};
PV.button=function(g,label,x,y,w=300){const c=g.ctx,hover=g.mouse.x>x&&g.mouse.x<x+w&&g.mouse.y>y&&g.mouse.y<y+54;c.fillStyle=hover?'#254f58':'#123039';c.fillRect(x,y,w,54);c.strokeStyle='#73fbd0';c.lineWidth=1;c.strokeRect(x,y,w,54);PV.text(c,label,x+w/2,y+34,15,'#caffed','center');};
PV.overlay=function(g){const c=g.ctx,s=g.state;if(s==='play')return;
  c.fillStyle=s==='title'?'#040916b8':'#030712cf';c.fillRect(0,95,1280,653);
  if(s==='title'){
    PV.text(c,'A SIGNAL IN THE DARK',640,185,13,'#73fbd0','center');
    c.save();c.shadowBlur=35;c.shadowColor='#4ccabc';PV.text(c,'PULSEVOID',640,284,96,'#e4fff6','center');c.restore();
    PV.text(c,'H O L D   T H E   L A S T   L I G H T',640,321,17,'#73b4c1','center');
    PV.text(c,'Ten waves. Two wardens. One fragile hull.',640,376,19,'#c0d5e1','center');
    PV.text(c,'Destroy the wave-10 boss to escape. Collect cores. Upgrade between waves.',640,406,14,'#8ea7bc','center');
    const cols=[[320,'01 / MOVE','WASD or arrow keys'],[640,'02 / AIM + FIRE','Mouse + hold click / Space'],[960,'03 / PHASE DASH','Shift · brief invulnerability']];
    cols.forEach(([x,a,b])=>{PV.text(c,a,x,474,14,'#85ffda','center');PV.text(c,b,x,503,13,'#b4c8d8','center');});
    PV.button(g,'ENTER / INITIATE RUN',490,555);PV.text(c,'P / ESC pause     ·     1–3 select upgrades     ·     R restart after defeat',640,645,12,'#7495a9','center');
    PV.text(c,'DETERMINISTIC SECTORS  /  SYNTHESIZED AUDIO  /  NO SECOND CHANCES',640,701,10,'#426577','center');
  }else if(s==='upgrade'){
    PV.text(c,`WAVE ${g.wave} CLEARED`,640,228,16,'#78ffda','center');PV.text(c,'REWIRE. RETURN. SURVIVE.',640,293,40,'#e0fff3','center');PV.text(c,'Choose one permanent upgrade · Hull restored by 10 each wave',640,331,14,'#9cb3c5','center');
    g.choices.forEach((u,i)=>{const x=160+i*330;c.fillStyle='#0c2032';c.fillRect(x,389,300,210);c.strokeStyle='#37677c';c.strokeRect(x,389,300,210);PV.text(c,`0${i+1} / AUGMENT`,x+24,425,12,'#7affda');PV.text(c,u.name,x+24,475,24,'#e6fff6');PV.text(c,u.desc,x+24,513,12,'#9db8c9');PV.text(c,`[ ${i+1} ]  INSTALL →`,x+24,568,14,'#7affda');});
  }else if(s==='paused'){PV.text(c,'SIGNAL HELD',640,355,60,'#e2fff4','center');PV.text(c,'P / ESC to resume · Your run is safe here',640,411,17,'#9bbcca','center');PV.button(g,'RESUME',490,465);
  }else{
    const win=s==='victory';PV.text(c,win?'TRANSMISSION RESTORED':'TRANSMISSION LOST',640,226,14,win?'#76ffd4':'#ff7f9e','center');PV.text(c,win?'VOID BROKEN':'SIGNAL ZERO',640,306,66,'#e6fff7','center');PV.text(c,win?'The last light makes it home.':`HULL FAILURE / ${g.cause}`,640,353,15,'#b3a4bb','center');
    PV.text(c,'FINAL SCORE',405,422,12);PV.text(c,String(g.score).padStart(6,'0'),405,468,38,'#83ffda');PV.text(c,'WAVES SURVIVED',640,422,12,'#89a6b9','center');PV.text(c,`${win?10:Math.max(0,g.wave-1)} / 10`,640,468,38,'#e6fff7','center');PV.text(c,'RUN TIME',875,422,12,'#89a6b9','right');PV.text(c,PV.timeLabel(g.time),875,468,38,'#e6fff7','right');
    PV.button(g,'R / REIGNITE',490,535);PV.text(c,win?'You survived all ten sectors. Try a different upgrade path.':'Keep moving. Dash through danger. Rebuild between waves.',640,631,14,'#7998ab','center');
  }
};
