PV.audio = {
  context:null, muted:false,
  unlock() { if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)(); this.context.resume(); },
  play(name) {
    if (!this.context || this.muted) return;
    const sounds = {shot:[620,110,.055,'triangle'],hit:[95,30,.22,'sawtooth'],explode:[160,22,.24,'sawtooth'],core:[950,1500,.08,'sine'],clear:[330,990,.6,'sine'],alarm:[150,65,.9,'square'],dash:[150,800,.16,'triangle']};
    const [a,b,d,type] = sounds[name]; const c=this.context, t=c.currentTime;
    const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(a,t); o.frequency.exponentialRampToValueAtTime(b,t+d); g.gain.setValueAtTime(name==='shot'?.025:.07,t); g.gain.exponentialRampToValueAtTime(.001,t+d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+d);
  }
};
