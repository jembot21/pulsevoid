PV.newPlayer = () => ({x:640,y:450,r:13,angle:-.5,hull:100,maxHull:100,inv:0,dash:0,dashTime:0,fire:0,rate:.17,twin:false,pierce:false,magnet:100,recharge:2.5});
PV.hitPlayer = function(g,damage,cause) {
  const p=g.player; if(p.inv>0 || g.state!=='play') return;
  p.hull=Math.max(0,p.hull-damage); p.inv=1; g.flash=.35; g.shake=9; PV.audio.play('hit');
  if(!p.hull) {g.state='end';g.cause=cause;PV.burst(g,p.x,p.y,'#6effed',45);}
};
PV.updatePlayer = function(g,dt) {
  const p=g.player,k=g.keys; let dx=Number(k.KeyD||k.ArrowRight||false)-Number(k.KeyA||k.ArrowLeft||false),dy=Number(k.KeyS||k.ArrowDown||false)-Number(k.KeyW||k.ArrowUp||false);
  const len=Math.hypot(dx,dy); if(len){dx/=len;dy/=len;}
  p.angle=Math.atan2(g.mouse.y-p.y,g.mouse.x-p.x); p.inv=Math.max(0,p.inv-dt); p.dash=Math.max(0,p.dash-dt); p.dashTime=Math.max(0,p.dashTime-dt); p.fire-=dt;
  if((k.ShiftLeft||k.ShiftRight)&&p.dash===0){p.dash=p.recharge;p.dashTime=.18;p.inv=Math.max(p.inv,.25);p.dx=len?dx:Math.cos(p.angle);p.dy=len?dy:Math.sin(p.angle);PV.audio.play('dash');}
  if(p.dashTime>0){dx=p.dx;dy=p.dy;PV.burst(g,p.x,p.y,'#55e9f0',1);}
  const speed=p.dashTime>0?950:285; p.x=PV.clamp(p.x+dx*speed*dt,35,1245);p.y=PV.clamp(p.y+dy*speed*dt,118,730);
  if((g.mouse.down||k.Space)&&p.fire<=0){p.fire=p.rate;PV.audio.play('shot');for(const offset of p.twin?[-.075,.075]:[0]){const a=p.angle+offset;g.bolts.push({x:p.x+Math.cos(a)*20,y:p.y+Math.sin(a)*20,vx:Math.cos(a)*790,vy:Math.sin(a)*790,life:1.5,hits:new Set(),pierce:p.pierce});}}
};
