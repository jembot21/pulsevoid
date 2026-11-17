PV.colors={chaser:'#ff567b',weaver:'#b58aff',splitter:'#ffc46b',boss:'#ff557e'};
PV.burst=function(g,x,y,color,count){for(let i=0;i<count;i++){const a=g.fxRandom()*6.28,s=30+g.fxRandom()*210;g.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.25+g.fxRandom()*.55,color});}};
PV.text=function(c,text,x,y,size=14,color='#89a6b9',align='left'){c.fillStyle=color;c.font=`${size>=30?'bold ':''}${size}px ${size>=30?'Arial, sans-serif':'monospace'}`;c.textAlign=align;c.fillText(text,x,y);};
PV.line=function(c,x,y,xx,yy,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
PV.polygon=function(c,x,y,r,n,a,color,fill='#101327'){c.beginPath();for(let i=0;i<n;i++){const b=a+i*6.283/n;c.lineTo(x+Math.cos(b)*r,y+Math.sin(b)*r);}c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=color;c.lineWidth=2;c.stroke();};
PV.render=function(g){const c=g.ctx;c.clearRect(0,0,1280,800);c.fillStyle='#050b17';c.fillRect(0,0,1280,800);
  const glow=c.createRadialGradient(650,430,20,650,430,740);glow.addColorStop(0,'#10283a');glow.addColorStop(1,'#040713');c.fillStyle=glow;c.fillRect(0,0,1280,800);
  for(let x=32;x<1280;x+=48)PV.line(c,x,106,x,746,'#24405930');for(let y=122;y<746;y+=48)PV.line(c,32,y,1248,y,'#24405930');
  for(const s of g.stars){c.globalAlpha=s.a;c.fillStyle='#9bc7e1';c.fillRect(s.x,s.y,s.r,s.r);}c.globalAlpha=1;
  c.strokeStyle='#29516a';c.lineWidth=1;c.strokeRect(24,104,1232,644);
  for(const [x,y,dx,dy] of [[24,104,1,1],[1256,104,-1,1],[24,748,1,-1],[1256,748,-1,-1]]){PV.line(c,x,y,x+dx*32,y,'#57ccd4',2);PV.line(c,x,y,x,y+dy*32,'#57ccd4',2);}
  c.save();if(g.shake>0&&!g.staged)c.translate(Math.sin(g.time*77)*g.shake,Math.cos(g.time*91)*g.shake);
  for(const e of g.enemies){c.shadowBlur=18;c.shadowColor=PV.colors[e.type];PV.polygon(c,e.x,e.y,e.r,e.type==='boss'?6:e.type==='weaver'?4:e.type==='splitter'?5:3,e.type==='chaser'?Math.atan2(g.player.y-e.y,g.player.x-e.x):e.angle,PV.colors[e.type]);c.shadowBlur=0;
    if(e.type==='boss'){PV.polygon(c,e.x,e.y,e.r*.73,6,-e.angle,'#ff789c');PV.polygon(c,e.x,e.y,17,6,e.angle,'#fff0f5','#7b2546');c.strokeStyle='#ff557e40';c.beginPath();c.arc(e.x,e.y,e.r+24,0,6.283);c.stroke();}else{PV.polygon(c,e.x,e.y,e.r*.4,e.type==='weaver'?4:3,-e.angle,PV.colors[e.type]);}
  }
  c.shadowBlur=14;for(const core of g.cores){c.shadowColor='#70ffd1';PV.polygon(c,core.x,core.y,5,4,0,'#7affcf','#317b67');}
  for(const b of g.bolts){c.shadowColor='#64f9ff';PV.line(c,b.x-b.vx*.026,b.y-b.vy*.026,b.x,b.y,'#8ffff6',3);}
  for(const o of g.orbs){c.shadowColor='#ff6093';c.fillStyle='#ff6a9c';c.beginPath();c.arc(o.x,o.y,5,0,6.28);c.fill();c.strokeStyle='#ff609340';c.beginPath();c.arc(o.x,o.y,10,0,6.28);c.stroke();}c.shadowBlur=0;
  for(const q of g.particles){c.globalAlpha=Math.min(1,q.life*2);PV.line(c,q.x,q.y,q.x-q.vx*.05,q.y-q.vy*.05,q.color,2);}c.globalAlpha=1;
  const p=g.player;if(g.state!=='end'&&(!(p.inv>0)||Math.floor(g.time*15)%2===0)){c.save();c.translate(p.x,p.y);c.rotate(p.angle);c.shadowBlur=20;c.shadowColor='#5effed';c.fillStyle='#173f50';c.strokeStyle='#a4fff4';c.lineWidth=2;c.beginPath();c.moveTo(23,0);c.lineTo(-15,-13);c.lineTo(-8,0);c.lineTo(-15,13);c.closePath();c.fill();c.stroke();PV.line(c,-13,0,-29-6*Math.sin(g.time*30),0,'#48cfff',4);c.restore();}
  if(g.state==='play'){c.strokeStyle='#6cf0de80';c.beginPath();c.arc(g.mouse.x,g.mouse.y,10,0,6.28);c.stroke();PV.line(c,g.mouse.x-16,g.mouse.y,g.mouse.x-7,g.mouse.y,'#79f7e6');PV.line(c,g.mouse.x+7,g.mouse.y,g.mouse.x+16,g.mouse.y,'#79f7e6');}
  c.restore();PV.hud(g);
  if(g.flash>0){c.strokeStyle=`rgba(255,50,90,${g.flash*2})`;c.lineWidth=18;c.strokeRect(9,9,1262,782);}
  PV.overlay(g);
};
