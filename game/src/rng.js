'use strict';
const PV = {};
PV.rng = function(seed) { let s = seed >>> 0; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15,t | 1); t ^= t + Math.imul(t ^ t >>> 7,t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
PV.clamp = (v,a,b) => Math.max(a,Math.min(b,v));
PV.distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
