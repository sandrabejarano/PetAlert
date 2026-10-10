(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const ce={ctx:null,on:!0,master:null,rumbleG:null,noiseBuf:null,init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}try{let i=window.AudioContext||window.webkitAudioContext;if(!i)return;let e=this.ctx=new i;this.master=e.createGain(),this.master.gain.value=this.on?1:0,this.master.connect(e.destination);let t=e.sampleRate*2,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0),r=0;for(let h=0;h<t;h++)r=(r+.02*(Math.random()*2-1))/1.02,s[h]=r*3.5;this.noiseBuf=n;let a=e.createBufferSource();a.buffer=n,a.loop=!0;let o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=150,this.rumbleG=e.createGain(),this.rumbleG.gain.value=0;let c=e.createGain();c.gain.value=.75;let l=e.createOscillator();l.frequency.value=6.5;let u=e.createGain();u.gain.value=.25,l.connect(u),u.connect(c.gain),l.start(),a.connect(o),o.connect(this.rumbleG),this.rumbleG.connect(c),c.connect(this.master),a.start(),this.musicInit()}catch{this.ctx=null}},musicOn:!0,duckV:1,mood:"calm",mTimer:null,mNext:0,mStep:0,mBar:0,mBus:null,mIn:null,mLast:3,MOODS:{calm:{bpm:78,vol:1,pad:"sine",p:.55,pulse:0,scale:[72,74,76,79,81,84,86],ch:[[48,[60,64,67,71]],[45,[57,60,64,67]],[41,[57,60,65,69]],[43,[59,62,67,69]]]},tense:{bpm:120,vol:.9,pad:"sawtooth",p:.2,pulse:2,riser:1,scale:[81,82,84,87,88],ch:[[33,[57,60,63,66]],[34,[58,61,64,67]],[32,[56,59,62,65]],[40,[56,59,62,65]]]},suspense:{bpm:66,vol:.8,pad:"triangle",p:.2,pulse:3,scale:[57,58,60,63,65,69],ch:[[38,[57,60,63,69]],[37,[56,60,62,68]],[35,[59,62,65,68]],[36,[58,61,64,67]]]},sizes:{bpm:78,vol:.8,pad:"sine",p:.28,pulse:0,scale:[69,72,74,76,79,81],ch:[[45,[57,60,64,69]],[41,[57,60,65,69]],[43,[55,59,62,67]],[40,[55,59,64,67]]]},hope:{bpm:56,vol:.85,pad:"sine",p:.24,pulse:0,scale:[66,69,71,74,76,78],ch:[[38,[62,66,69,73]],[35,[59,62,66,69]],[43,[55,59,62,66]],[45,[57,61,64,69]]]},close:{bpm:64,vol:.9,pad:"sine",p:.4,pulse:0,scale:[72,74,76,79,81,84],ch:[[48,[60,64,67,71]],[41,[57,60,65,69]],[45,[57,60,64,67]],[43,[59,62,67,69]]]}},mtof(i){return 440*Math.pow(2,(i-69)/12)},musicInit(){let i=this.ctx;this.mIn=i.createGain(),this.mBus=i.createGain(),this.mBus.gain.value=this.musicOn?.5*this.duckV:0,this.mBus.connect(this.master);let e=Math.floor(i.sampleRate*2),t=i.createBuffer(2,e,i.sampleRate);for(let r=0;r<2;r++){let a=t.getChannelData(r);for(let o=0;o<e;o++)a[o]=(Math.random()*2-1)*Math.pow(1-o/e,2.6)}let n=i.createConvolver();n.buffer=t;let s=i.createGain();s.gain.value=.55,this.mIn.connect(this.mBus),this.mIn.connect(n),n.connect(s),s.connect(this.mBus),this.mNext=i.currentTime+.15,this.mStep=0,this.mBar=0,clearInterval(this.mTimer),this.mTimer=setInterval(()=>this.musicTick(),90)},setMood(i){this.MOODS[i]&&i!==this.mood&&(this.mood=i,this.mBar=0,this.mStep=0,this.ctx&&(this.mNext=Math.max(this.mNext,this.ctx.currentTime+.1)))},duck(i){this.duckV=i,this.mBus&&this.mBus.gain.setTargetAtTime(this.musicOn?.5*i:0,this.ctx.currentTime,.4)},toggleMusic(){const i=this.playing;return this.init(),i?(this.ctx.state==="suspended"&&this.ctx.resume(),this.musicOn=!this.musicOn,this.mBus&&this.mBus.gain.setTargetAtTime(this.musicOn?.5*this.duckV:0,this.ctx.currentTime,.15),this.musicOn):this.musicOn},playing:!1,musicTick(){let i=this.ctx;if(this.playing=!!i&&i.state==="running",!(!i||i.state!=="running"))for(this.mNext<i.currentTime-.5&&(this.mNext=i.currentTime+.05);this.mNext<i.currentTime+.5;){this.musicStep(this.mNext);let e=this.MOODS[this.mood];this.mNext+=60/e.bpm/2,this.mStep=(this.mStep+1)%8,this.mStep===0&&this.mBar++}},musicStep(i){let e=this.MOODS[this.mood],t=60/e.bpm/2,n=t*8,s=this.mStep,r=e.ch[this.mBar%e.ch.length];if(s===0&&(this.mNote(r[0]+0,i,n*.95,"sine",.16*e.vol,.05,n*.4),r[1].forEach((a,o)=>{[-5,5].forEach(c=>this.mNote(a,i+o*.03,n*1.15,e.pad,.045*e.vol,n*.35,n*.5,c))})),e.pulse===2){let a=this.mtof(r[0]);s%4===0?this.mThump(a,i,.42*e.vol):s%4===1&&this.mThump(a,i+t*.35,.26*e.vol),s===0&&(this.mNote(r[0]+12,i,n*.95,"sawtooth",.03*e.vol,n*.5,n*.3),this.mBar%4===3&&this.mRiser(i,n))}else if(e.pulse===3)s%4===0&&this.mThump(this.mtof(r[0]),i,.16*e.vol);else if(e.pulse&&s%2===0){let a=this.mtof(r[0]);this.mThump(a,i,.32*e.vol)}if(Math.random()<e.p){let a=this.mLast+Math.floor(Math.random()*3)-1;a=Math.max(0,Math.min(e.scale.length-1,a)),this.mLast=a;let o=e.scale[a];this.mNote(o,i,t*5,"triangle",.07*e.vol,.008,t*4.5),this.mNote(o+12,i,t*2.5,"sine",.02*e.vol,.005,t*2)}},mNote(i,e,t,n,s,r,a,o){let c=this.ctx,l=c.createOscillator(),u=c.createGain();if(l.type=n,l.frequency.value=this.mtof(i),o&&(l.detune.value=o),u.gain.setValueAtTime(1e-4,e),u.gain.linearRampToValueAtTime(s,e+Math.max(.005,r)),u.gain.setTargetAtTime(1e-4,e+Math.max(r+.01,t-a),Math.max(.05,a*.35)),n==="sawtooth"){let h=c.createBiquadFilter();h.type="lowpass",h.frequency.value=650,l.connect(h),h.connect(u)}else l.connect(u);u.connect(this.mIn),l.start(e),l.stop(e+t+a*.6+.2)},mRiser(i,e){let t=this.ctx,n=t.createBufferSource();n.buffer=this.noiseBuf;let s=t.createBiquadFilter();s.type="bandpass",s.Q.value=2.5,s.frequency.setValueAtTime(350,i),s.frequency.exponentialRampToValueAtTime(4200,i+e);let r=t.createGain();r.gain.setValueAtTime(1e-4,i),r.gain.exponentialRampToValueAtTime(.09,i+e*.95),r.gain.exponentialRampToValueAtTime(1e-4,i+e+.05),n.connect(s),s.connect(r),r.connect(this.mIn),n.start(i,Math.random()),n.stop(i+e+.1)},swell(){if(!this.ctx||!this.mIn)return;let i=this.ctx,e=i.currentTime+.05;this.mRiser(e,1.8),[48,55,60,64,67,72,76].forEach((t,n)=>this.mNote(t,e+1.8+n*.04,5,"triangle",.07,.05,3.6)),this.tone(60,30,1.4,"sine",.3,1.8)},whoosh(){if(!this.ctx)return;let i=this.ctx,e=i.currentTime,t=i.createBufferSource();t.buffer=this.noiseBuf;let n=i.createBiquadFilter();n.type="bandpass",n.Q.value=1.4,n.frequency.setValueAtTime(250,e),n.frequency.exponentialRampToValueAtTime(5e3,e+1.2);let s=i.createGain();s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(.32,e+1),s.gain.exponentialRampToValueAtTime(1e-4,e+1.7),t.connect(n),n.connect(s),s.connect(this.master),t.start(e,Math.random()),t.stop(e+1.8),this.tone(220,880,1.2,"sine",.09),[523,659,784,1047].forEach((r,a)=>this.tone(r,r*1.005,.9,"triangle",.06,1.3+a*.07))},mThump(i,e,t){let n=this.ctx,s=n.createOscillator(),r=n.createGain();s.type="sine",s.frequency.setValueAtTime(i*2,e),s.frequency.exponentialRampToValueAtTime(i,e+.12),r.gain.setValueAtTime(1e-4,e),r.gain.exponentialRampToValueAtTime(t,e+.02),r.gain.exponentialRampToValueAtTime(1e-4,e+.5),s.connect(r),r.connect(this.mIn),s.start(e),s.stop(e+.6)},rumble(i){this.ctx&&this.rumbleG.gain.setTargetAtTime(i,this.ctx.currentTime,.25)},tone(i,e,t,n,s,r){if(!this.ctx)return;let a=this.ctx,o=a.currentTime+(r||0),c=a.createOscillator(),l=a.createGain();c.type=n||"sine",c.frequency.setValueAtTime(i,o),c.frequency.exponentialRampToValueAtTime(Math.max(20,e),o+t),l.gain.setValueAtTime(1e-4,o),l.gain.exponentialRampToValueAtTime(s||.1,o+.02),l.gain.exponentialRampToValueAtTime(1e-4,o+t),c.connect(l),l.connect(this.master),c.start(o),c.stop(o+t+.05)},noise(i,e,t){if(!this.ctx)return;let n=this.ctx,s=n.currentTime,r=n.createBufferSource();r.buffer=this.noiseBuf;let a=n.createBiquadFilter();a.type="bandpass",a.frequency.value=e;let o=n.createGain();o.gain.setValueAtTime(t,s),o.gain.exponentialRampToValueAtTime(1e-4,s+i),r.connect(a),a.connect(o),o.connect(this.master),r.start(s,Math.random()),r.stop(s+i+.05)},blip(){this.tone(620,860,.09,"sine",.07)},tick(){this.tone(1e3,900,.09,"sine",.07)},ding(){this.tone(880,1320,.25,"triangle",.09)},ok(){[523,659,784].forEach((i,e)=>this.tone(i,i*1.01,.3,"triangle",.09,e*.09))},no(){this.tone(230,160,.25,"sawtooth",.05)},crash(){this.noise(.4,700,.3),this.tone(90,40,.4,"sine",.25)},creak(){this.tone(180,120,.5,"sawtooth",.03)},alarmSet(i){if(!this.ctx)return;let e=this.ctx;if(!this.alG){let t=e.createOscillator();t.type="square",t.frequency.value=980;let n=e.createOscillator();n.type="square",n.frequency.value=2.2;let s=e.createGain();s.gain.value=190,n.connect(s),s.connect(t.frequency);let r=e.createBiquadFilter();r.type="lowpass",r.frequency.value=2400,this.alG=e.createGain(),this.alG.gain.value=0,t.connect(r),r.connect(this.alG),this.alG.connect(this.master),t.start(),n.start()}this.alG.gain.setTargetAtTime(i,e.currentTime,.08)},thud(){this.noise(.14,420,.09),this.tone(130,60,.16,"sine",.1)},whimper(){this.tone(700,420,.4,"sine",.09),this.tone(650,380,.45,"sine",.08,.5)},meow(){this.tone(500,900,.25,"triangle",.09),this.tone(900,550,.35,"triangle",.09,.22)},bark(){this.tone(320,180,.12,"sawtooth",.07),this.tone(320,180,.12,"sawtooth",.07,.18)},toggle(){return this.on=!this.on,this.master&&this.master.gain.setTargetAtTime(this.on?1:0,this.ctx.currentTime,.05),this.on}},O={scene:null,mode:"orbit",cur:null,curTick:null,curExit:null,interact:null,stepData:{},tipState:null,bgOverride:null,navTo:null,showRot:0,time:0,lastBanner:"#",hideBanner:!1,onQuakePhase:function(){}},rn={done:new Set,sizes:new Set,greeted:!1},$=(i,e=document)=>e.querySelector(i),Ti=(i,e=document)=>Array.prototype.slice.call(e.querySelectorAll(i)),Kt=(i,e,t)=>Math.min(t,Math.max(e,i)),qr=(i,e,t)=>i+(e-i)*t,kt=(i,e,t,n)=>i+(e-i)*(1-Math.exp(-t*n)),Bt=(i,e)=>i+Math.random()*(e-i),pf=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),n},ll=(i,e)=>{let t=e-i;for(;t>Math.PI;)t-=2*Math.PI;for(;t<-Math.PI;)t+=2*Math.PI;return t},Zp=i=>{i=i.slice();for(let e=i.length-1;e>0;e--){let t=Math.floor(Math.random()*(e+1));[i[e],i[t]]=[i[t],i[e]]}return i},Jp=matchMedia("(prefers-reduced-motion: reduce)").matches,ia=matchMedia("(pointer: coarse)").matches,mf=Jp?.3:1;/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const gu="174",$p=0,fh=1,Qp=2,gf=1,_f=2,yi=3,ai=0,Rn=1,jt=2,Vi=0,nr=1,cr=2,ph=3,mh=4,em=5,fs=100,tm=101,nm=102,im=103,sm=104,rm=200,am=201,om=202,cm=203,ul=204,hl=205,lm=206,um=207,hm=208,dm=209,fm=210,pm=211,mm=212,gm=213,_m=214,dl=0,fl=1,pl=2,lr=3,ml=4,gl=5,_l=6,xl=7,xf=0,xm=1,vm=2,Gi=0,ym=1,Mm=2,Sm=3,bm=4,Em=5,Tm=6,wm=7,gh="attached",Am="detached",vf=300,ur=301,hr=302,vl=303,yl=304,zo=306,Wi=1e3,Bi=1001,wo=1002,Mn=1003,yf=1004,Gr=1005,Dn=1006,_o=1007,Si=1008,wi=1009,Mf=1010,Sf=1011,sa=1012,_u=1013,_s=1014,Qn=1015,va=1016,xu=1017,vu=1018,dr=1020,bf=35902,Ef=1021,Tf=1022,Hn=1023,wf=1024,Af=1025,ir=1026,fr=1027,yu=1028,Mu=1029,Rf=1030,Su=1031,bu=1033,xo=33776,vo=33777,yo=33778,Mo=33779,Ml=35840,Sl=35841,bl=35842,El=35843,Tl=36196,wl=37492,Al=37496,Rl=37808,Cl=37809,Pl=37810,Ll=37811,Il=37812,Dl=37813,Nl=37814,Ul=37815,Ol=37816,Fl=37817,kl=37818,Bl=37819,zl=37820,Hl=37821,So=36492,Vl=36494,Gl=36495,Cf=36283,Wl=36284,Xl=36285,ql=36286,Pf=2200,Rm=2201,Cm=2202,ra=2300,aa=2301,rc=2302,$s=2400,Qs=2401,Ao=2402,Eu=2500,Pm=2501,Lm=0,Lf=1,Yl=2,Im=3200,Dm=3201,If=0,Nm=1,ki="",ln="srgb",gn="srgb-linear",Ro="linear",At="srgb",Es=7680,_h=519,Um=512,Om=513,Fm=514,Df=515,km=516,Bm=517,zm=518,Hm=519,Kl=35044,xh="300 es",bi=2e3,Co=2001;class ys{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const hn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let vh=1234567;const Yr=Math.PI/180,pr=180/Math.PI;function Gn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(hn[i&255]+hn[i>>8&255]+hn[i>>16&255]+hn[i>>24&255]+"-"+hn[e&255]+hn[e>>8&255]+"-"+hn[e>>16&15|64]+hn[e>>24&255]+"-"+hn[t&63|128]+hn[t>>8&255]+"-"+hn[t>>16&255]+hn[t>>24&255]+hn[n&255]+hn[n>>8&255]+hn[n>>16&255]+hn[n>>24&255]).toLowerCase()}function rt(i,e,t){return Math.max(e,Math.min(t,i))}function Tu(i,e){return(i%e+e)%e}function Vm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Gm(i,e,t){return i!==e?(t-i)/(e-i):0}function Kr(i,e,t){return(1-t)*i+t*e}function Wm(i,e,t,n){return Kr(i,e,1-Math.exp(-t*n))}function Xm(i,e=1){return e-Math.abs(Tu(i,e*2)-e)}function qm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ym(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Km(i,e){return i+Math.floor(Math.random()*(e-i+1))}function jm(i,e){return i+Math.random()*(e-i)}function Zm(i){return i*(.5-Math.random())}function Jm(i){i!==void 0&&(vh=i);let e=vh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function $m(i){return i*Yr}function Qm(i){return i*pr}function e0(i){return(i&i-1)===0&&i!==0}function t0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function n0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function i0(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),u=a((e+n)/2),h=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*u,c*h,c*d,o*l);break;case"YZY":i.set(c*d,o*u,c*h,o*l);break;case"ZXZ":i.set(c*h,c*d,o*u,o*l);break;case"XZX":i.set(o*u,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*u,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*u,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Jn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Tt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const s0={DEG2RAD:Yr,RAD2DEG:pr,generateUUID:Gn,clamp:rt,euclideanModulo:Tu,mapLinear:Vm,inverseLerp:Gm,lerp:Kr,damp:Wm,pingpong:Xm,smoothstep:qm,smootherstep:Ym,randInt:Km,randFloat:jm,randFloatSpread:Zm,seededRandom:Jm,degToRad:$m,radToDeg:Qm,isPowerOfTwo:e0,ceilPowerOfTwo:t0,floorPowerOfTwo:n0,setQuaternionFromProperEuler:i0,normalize:Tt,denormalize:Jn};class oe{constructor(e=0,t=0){oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class et{constructor(e,t,n,s,r,a,o,c,l){et.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],f=n[5],m=n[8],_=s[0],g=s[3],p=s[6],M=s[1],v=s[4],x=s[7],P=s[2],A=s[5],C=s[8];return r[0]=a*_+o*M+c*P,r[3]=a*g+o*v+c*A,r[6]=a*p+o*x+c*C,r[1]=l*_+u*M+h*P,r[4]=l*g+u*v+h*A,r[7]=l*p+u*x+h*C,r[2]=d*_+f*M+m*P,r[5]=d*g+f*v+m*A,r[8]=d*p+f*x+m*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*r*u+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=u*a-o*l,d=o*c-u*r,f=l*r-a*c,m=t*h+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=h*_,e[1]=(s*l-u*n)*_,e[2]=(o*n-s*a)*_,e[3]=d*_,e[4]=(u*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ac.makeScale(e,t)),this}rotate(e){return this.premultiply(ac.makeRotation(-e)),this}translate(e,t){return this.premultiply(ac.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ac=new et;function Nf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function oa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function r0(){const i=oa("canvas");return i.style.display="block",i}const yh={};function cs(i){i in yh||(yh[i]=!0,console.warn(i))}function a0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function o0(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function c0(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Mh=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sh=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function l0(){const i={enabled:!0,workingColorSpace:gn,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===At&&(s.r=Ei(s.r),s.g=Ei(s.g),s.b=Ei(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===At&&(s.r=sr(s.r),s.g=sr(s.g),s.b=sr(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ki?Ro:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[gn]:{primaries:e,whitePoint:n,transfer:Ro,toXYZ:Mh,fromXYZ:Sh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:e,whitePoint:n,transfer:At,toXYZ:Mh,fromXYZ:Sh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),i}const lt=l0();function Ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function sr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ts;class u0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ts===void 0&&(Ts=oa("canvas")),Ts.width=e.width,Ts.height=e.height;const n=Ts.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ts}return t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=oa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ei(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ei(t[n]/255)*255):t[n]=Ei(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let h0=0;class wu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:h0++}),this.uuid=Gn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(oc(s[a].image)):r.push(oc(s[a]))}else r=oc(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function oc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?u0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let d0=0;class Zt extends ys{constructor(e=Zt.DEFAULT_IMAGE,t=Zt.DEFAULT_MAPPING,n=Bi,s=Bi,r=Dn,a=Si,o=Hn,c=wi,l=Zt.DEFAULT_ANISOTROPY,u=ki){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:d0++}),this.uuid=Gn(),this.name="",this.source=new wu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wi:e.x=e.x-Math.floor(e.x);break;case Bi:e.x=e.x<0?0:1;break;case wo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wi:e.y=e.y-Math.floor(e.y);break;case Bi:e.y=e.y<0?0:1;break;case wo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Zt.DEFAULT_IMAGE=null;Zt.DEFAULT_MAPPING=vf;Zt.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,s=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],m=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,x=(f+1)/2,P=(p+1)/2,A=(u+d)/4,C=(h+_)/4,L=(m+g)/4;return v>x&&v>P?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=C/n):x>P?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=L/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=C/r,s=L/r),this.set(n,s,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(h-_)/M,this.z=(d-u)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this.w=rt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this.w=rt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class f0 extends ys{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Zt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new wu(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xs extends f0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Uf extends Zt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class p0 extends Zt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ei{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3];const d=r[a+0],f=r[a+1],m=r[a+2],_=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=_;return}if(h!==_||c!==d||l!==f||u!==m){let g=1-o;const p=c*d+l*f+u*m+h*_,M=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const P=Math.sqrt(v),A=Math.atan2(P,p*M);g=Math.sin(g*A)/P,o=Math.sin(o*A)/P}const x=o*M;if(c=c*g+d*x,l=l*g+f*x,u=u*g+m*x,h=h*g+_*x,g===1-o){const P=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=P,l*=P,u*=P,h*=P}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+u*h+c*f-l*d,e[t+1]=c*m+u*d+l*h-o*f,e[t+2]=l*m+u*f+o*d-c*h,e[t+3]=u*m-o*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(s/2),h=o(r/2),d=c(n/2),f=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=d*u*h+l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h+d*f*m;break;case"YZX":this._x=d*u*h+l*f*m,this._y=l*f*h+d*u*m,this._z=l*u*m-d*f*h,this._w=l*u*h-d*f*m;break;case"XZY":this._x=d*u*h-l*f*m,this._y=l*f*h-d*u*m,this._z=l*u*m+d*f*h,this._w=l*u*h+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>h){const f=2*Math.sqrt(1+n-o-h);this._w=(u-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>h){const f=2*Math.sqrt(1+o-n-h);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(rt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+s*l-r*c,this._y=s*u+a*c+r*o-n*l,this._z=r*u+a*l+n*c-s*o,this._w=a*u-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,o),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(e=0,t=0,n=0){T.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(bh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(bh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),u=2*(o*t-r*s),h=2*(r*n-a*t);return this.x=t+c*l+a*h-o*u,this.y=n+c*u+o*l-r*h,this.z=s+c*h+r*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=rt(this.x,e.x,t.x),this.y=rt(this.y,e.y,t.y),this.z=rt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=rt(this.x,e,t),this.y=rt(this.y,e,t),this.z=rt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(rt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return cc.copy(this).projectOnVector(e),this.sub(cc)}reflect(e){return this.sub(cc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const cc=new T,bh=new ei;class Ri{constructor(e=new T(1/0,1/0,1/0),t=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Kn):Kn.fromBufferAttribute(r,a),Kn.applyMatrix4(e.matrixWorld),this.expandByPoint(Kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wa.copy(n.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Kn),Kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pr),Aa.subVectors(this.max,Pr),ws.subVectors(e.a,Pr),As.subVectors(e.b,Pr),Rs.subVectors(e.c,Pr),Ci.subVectors(As,ws),Pi.subVectors(Rs,As),$i.subVectors(ws,Rs);let t=[0,-Ci.z,Ci.y,0,-Pi.z,Pi.y,0,-$i.z,$i.y,Ci.z,0,-Ci.x,Pi.z,0,-Pi.x,$i.z,0,-$i.x,-Ci.y,Ci.x,0,-Pi.y,Pi.x,0,-$i.y,$i.x,0];return!lc(t,ws,As,Rs,Aa)||(t=[1,0,0,0,1,0,0,0,1],!lc(t,ws,As,Rs,Aa))?!1:(Ra.crossVectors(Ci,Pi),t=[Ra.x,Ra.y,Ra.z],lc(t,ws,As,Rs,Aa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const fi=[new T,new T,new T,new T,new T,new T,new T,new T],Kn=new T,wa=new Ri,ws=new T,As=new T,Rs=new T,Ci=new T,Pi=new T,$i=new T,Pr=new T,Aa=new T,Ra=new T,Qi=new T;function lc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Qi.fromArray(i,r);const o=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),c=e.dot(Qi),l=t.dot(Qi),u=n.dot(Qi);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const m0=new Ri,Lr=new T,uc=new T;class ci{constructor(e=new T,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):m0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Lr.subVectors(e,this.center);const t=Lr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Lr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(uc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Lr.copy(e.center).add(uc)),this.expandByPoint(Lr.copy(e.center).sub(uc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const pi=new T,hc=new T,Ca=new T,Li=new T,dc=new T,Pa=new T,fc=new T;class ya{constructor(e=new T,t=new T(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=pi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pi.copy(this.origin).addScaledVector(this.direction,t),pi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){hc.copy(e).add(t).multiplyScalar(.5),Ca.copy(t).sub(e).normalize(),Li.copy(this.origin).sub(hc);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ca),o=Li.dot(this.direction),c=-Li.dot(Ca),l=Li.lengthSq(),u=Math.abs(1-a*a);let h,d,f,m;if(u>0)if(h=a*c-o,d=a*o-c,m=r*u,h>=0)if(d>=-m)if(d<=m){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*c)+l}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;else d<=-m?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l):d<=m?(h=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(hc).addScaledVector(Ca,d),f}intersectSphere(e,t){pi.subVectors(e.center,this.origin);const n=pi.dot(this.direction),s=pi.dot(pi)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,pi)!==null}intersectTriangle(e,t,n,s,r){dc.subVectors(t,e),Pa.subVectors(n,e),fc.crossVectors(dc,Pa);let a=this.direction.dot(fc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Li.subVectors(this.origin,e);const c=o*this.direction.dot(Pa.crossVectors(Li,Pa));if(c<0)return null;const l=o*this.direction.dot(dc.cross(Li));if(l<0||c+l>a)return null;const u=-o*Li.dot(fc);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $e{constructor(e,t,n,s,r,a,o,c,l,u,h,d,f,m,_,g){$e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,u,h,d,f,m,_,g)}set(e,t,n,s,r,a,o,c,l,u,h,d,f,m,_,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new $e().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Cs.setFromMatrixColumn(e,0).length(),r=1/Cs.setFromMatrixColumn(e,1).length(),a=1/Cs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=f+m*l,t[5]=d-_*l,t[9]=-o*c,t[2]=_-d*l,t[6]=m+f*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,m=l*u,_=l*h;t[0]=d+_*o,t[4]=m*o-f,t[8]=a*l,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-m,t[6]=_+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,m=l*u,_=l*h;t[0]=d-_*o,t[4]=-a*h,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=c*u,t[4]=m*l-f,t[8]=d*l+_,t[1]=c*h,t[5]=_*l+d,t[9]=f*l-m,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,m=o*c,_=o*l;t[0]=c*u,t[4]=_-d*h,t[8]=m*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=f*h+m,t[10]=d-_*h}else if(e.order==="XZY"){const d=a*c,f=a*l,m=o*c,_=o*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(g0,e,_0)}lookAt(e,t,n){const s=this.elements;return Pn.subVectors(e,t),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Ii.crossVectors(n,Pn),Ii.lengthSq()===0&&(Math.abs(n.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Ii.crossVectors(n,Pn)),Ii.normalize(),La.crossVectors(Pn,Ii),s[0]=Ii.x,s[4]=La.x,s[8]=Pn.x,s[1]=Ii.y,s[5]=La.y,s[9]=Pn.y,s[2]=Ii.z,s[6]=La.z,s[10]=Pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],f=n[13],m=n[2],_=n[6],g=n[10],p=n[14],M=n[3],v=n[7],x=n[11],P=n[15],A=s[0],C=s[4],L=s[8],E=s[12],S=s[1],I=s[5],X=s[9],k=s[13],q=s[2],B=s[6],V=s[10],K=s[14],W=s[3],ue=s[7],me=s[11],Te=s[15];return r[0]=a*A+o*S+c*q+l*W,r[4]=a*C+o*I+c*B+l*ue,r[8]=a*L+o*X+c*V+l*me,r[12]=a*E+o*k+c*K+l*Te,r[1]=u*A+h*S+d*q+f*W,r[5]=u*C+h*I+d*B+f*ue,r[9]=u*L+h*X+d*V+f*me,r[13]=u*E+h*k+d*K+f*Te,r[2]=m*A+_*S+g*q+p*W,r[6]=m*C+_*I+g*B+p*ue,r[10]=m*L+_*X+g*V+p*me,r[14]=m*E+_*k+g*K+p*Te,r[3]=M*A+v*S+x*q+P*W,r[7]=M*C+v*I+x*B+P*ue,r[11]=M*L+v*X+x*V+P*me,r[15]=M*E+v*k+x*K+P*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15];return m*(+r*c*h-s*l*h-r*o*d+n*l*d+s*o*f-n*c*f)+_*(+t*c*f-t*l*d+r*a*d-s*a*f+s*l*u-r*c*u)+g*(+t*l*h-t*o*f-r*a*h+n*a*f+r*o*u-n*l*u)+p*(-s*o*u-t*c*h+t*o*d+s*a*h-n*a*d+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],M=h*g*l-_*d*l+_*c*f-o*g*f-h*c*p+o*d*p,v=m*d*l-u*g*l-m*c*f+a*g*f+u*c*p-a*d*p,x=u*_*l-m*h*l+m*o*f-a*_*f-u*o*p+a*h*p,P=m*h*c-u*_*c-m*o*d+a*_*d+u*o*g-a*h*g,A=t*M+n*v+s*x+r*P;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=M*C,e[1]=(_*d*r-h*g*r-_*s*f+n*g*f+h*s*p-n*d*p)*C,e[2]=(o*g*r-_*c*r+_*s*l-n*g*l-o*s*p+n*c*p)*C,e[3]=(h*c*r-o*d*r-h*s*l+n*d*l+o*s*f-n*c*f)*C,e[4]=v*C,e[5]=(u*g*r-m*d*r+m*s*f-t*g*f-u*s*p+t*d*p)*C,e[6]=(m*c*r-a*g*r-m*s*l+t*g*l+a*s*p-t*c*p)*C,e[7]=(a*d*r-u*c*r+u*s*l-t*d*l-a*s*f+t*c*f)*C,e[8]=x*C,e[9]=(m*h*r-u*_*r-m*n*f+t*_*f+u*n*p-t*h*p)*C,e[10]=(a*_*r-m*o*r+m*n*l-t*_*l-a*n*p+t*o*p)*C,e[11]=(u*o*r-a*h*r-u*n*l+t*h*l+a*n*f-t*o*f)*C,e[12]=P*C,e[13]=(u*_*s-m*h*s+m*n*d-t*_*d-u*n*g+t*h*g)*C,e[14]=(m*o*s-a*_*s-m*n*c+t*_*c+a*n*g-t*o*g)*C,e[15]=(a*h*s-u*o*s+u*n*c-t*h*c-a*n*d+t*o*d)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,u=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,u*o+n,u*c-s*a,0,l*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,u=a+a,h=o+o,d=r*l,f=r*u,m=r*h,_=a*u,g=a*h,p=o*h,M=c*l,v=c*u,x=c*h,P=n.x,A=n.y,C=n.z;return s[0]=(1-(_+p))*P,s[1]=(f+x)*P,s[2]=(m-v)*P,s[3]=0,s[4]=(f-x)*A,s[5]=(1-(d+p))*A,s[6]=(g+M)*A,s[7]=0,s[8]=(m+v)*C,s[9]=(g-M)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Cs.set(s[0],s[1],s[2]).length();const a=Cs.set(s[4],s[5],s[6]).length(),o=Cs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],jn.copy(this);const l=1/r,u=1/a,h=1/o;return jn.elements[0]*=l,jn.elements[1]*=l,jn.elements[2]*=l,jn.elements[4]*=u,jn.elements[5]*=u,jn.elements[6]*=u,jn.elements[8]*=h,jn.elements[9]*=h,jn.elements[10]*=h,t.setFromRotationMatrix(jn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=bi){const c=this.elements,l=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),d=(n+s)/(n-s);let f,m;if(o===bi)f=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===Co)f=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=bi){const c=this.elements,l=1/(t-e),u=1/(n-s),h=1/(a-r),d=(t+e)*l,f=(n+s)*u;let m,_;if(o===bi)m=(a+r)*h,_=-2*h;else if(o===Co)m=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Cs=new T,jn=new $e,g0=new T(0,0,0),_0=new T(1,1,1),Ii=new T,La=new T,Pn=new T,Eh=new $e,Th=new ei;class oi{constructor(e=0,t=0,n=0,s=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-rt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(rt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Eh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Eh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Th.setFromEuler(this),this.setFromQuaternion(Th,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class Au{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let x0=0;const wh=new T,Ps=new ei,mi=new $e,Ia=new T,Ir=new T,v0=new T,y0=new ei,Ah=new T(1,0,0),Rh=new T(0,1,0),Ch=new T(0,0,1),Ph={type:"added"},M0={type:"removed"},Ls={type:"childadded",child:null},pc={type:"childremoved",child:null};class It extends ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=Gn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new T,t=new oi,n=new ei,s=new T(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new et}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Au,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ps.setFromAxisAngle(e,t),this.quaternion.multiply(Ps),this}rotateOnWorldAxis(e,t){return Ps.setFromAxisAngle(e,t),this.quaternion.premultiply(Ps),this}rotateX(e){return this.rotateOnAxis(Ah,e)}rotateY(e){return this.rotateOnAxis(Rh,e)}rotateZ(e){return this.rotateOnAxis(Ch,e)}translateOnAxis(e,t){return wh.copy(e).applyQuaternion(this.quaternion),this.position.add(wh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ah,e)}translateY(e){return this.translateOnAxis(Rh,e)}translateZ(e){return this.translateOnAxis(Ch,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ia.copy(e):Ia.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ir.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mi.lookAt(Ir,Ia,this.up):mi.lookAt(Ia,Ir,this.up),this.quaternion.setFromRotationMatrix(mi),s&&(mi.extractRotation(s.matrixWorld),Ps.setFromRotationMatrix(mi),this.quaternion.premultiply(Ps.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ph),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(M0),pc.child=e,this.dispatchEvent(pc),pc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ph),Ls.child=e,this.dispatchEvent(Ls),Ls.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ir,e,v0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ir,y0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}It.DEFAULT_UP=new T(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Zn=new T,gi=new T,mc=new T,_i=new T,Is=new T,Ds=new T,Lh=new T,gc=new T,_c=new T,xc=new T,vc=new xt,yc=new xt,Mc=new xt;class Bn{constructor(e=new T,t=new T,n=new T){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Zn.subVectors(e,t),s.cross(Zn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Zn.subVectors(s,t),gi.subVectors(n,t),mc.subVectors(e,t);const a=Zn.dot(Zn),o=Zn.dot(gi),c=Zn.dot(mc),l=gi.dot(gi),u=gi.dot(mc),h=a*l-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(l*c-o*u)*d,m=(a*u-o*c)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,_i)===null?!1:_i.x>=0&&_i.y>=0&&_i.x+_i.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,_i)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,_i.x),c.addScaledVector(a,_i.y),c.addScaledVector(o,_i.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return vc.setScalar(0),yc.setScalar(0),Mc.setScalar(0),vc.fromBufferAttribute(e,t),yc.fromBufferAttribute(e,n),Mc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(vc,r.x),a.addScaledVector(yc,r.y),a.addScaledVector(Mc,r.z),a}static isFrontFacing(e,t,n,s){return Zn.subVectors(n,t),gi.subVectors(e,t),Zn.cross(gi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zn.subVectors(this.c,this.b),gi.subVectors(this.a,this.b),Zn.cross(gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Bn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Bn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Is.subVectors(s,n),Ds.subVectors(r,n),gc.subVectors(e,n);const c=Is.dot(gc),l=Ds.dot(gc);if(c<=0&&l<=0)return t.copy(n);_c.subVectors(e,s);const u=Is.dot(_c),h=Ds.dot(_c);if(u>=0&&h<=u)return t.copy(s);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(Is,a);xc.subVectors(e,r);const f=Is.dot(xc),m=Ds.dot(xc);if(m>=0&&f<=m)return t.copy(r);const _=f*l-c*m;if(_<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(n).addScaledVector(Ds,o);const g=u*m-f*h;if(g<=0&&h-u>=0&&f-m>=0)return Lh.subVectors(r,s),o=(h-u)/(h-u+(f-m)),t.copy(s).addScaledVector(Lh,o);const p=1/(g+_+d);return a=_*p,o=d*p,t.copy(n).addScaledVector(Is,a).addScaledVector(Ds,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},Da={h:0,s:0,l:0};function Sc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=Tu(e,1),t=rt(t,0,1),n=rt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Sc(a,r,e+1/3),this.g=Sc(a,r,e),this.b=Sc(a,r,e-1/3)}return lt.toWorkingColorSpace(this,s),this}setStyle(e,t=ln){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const n=Of[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ei(e.r),this.g=Ei(e.g),this.b=Ei(e.b),this}copyLinearToSRGB(e){return this.r=sr(e.r),this.g=sr(e.g),this.b=sr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return lt.fromWorkingColorSpace(dn.copy(this),e),Math.round(rt(dn.r*255,0,255))*65536+Math.round(rt(dn.g*255,0,255))*256+Math.round(rt(dn.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(dn.copy(this),t);const n=dn.r,s=dn.g,r=dn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const h=a-o;switch(l=u<=.5?h/(a+o):h/(2-a-o),a){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(dn.copy(this),t),e.r=dn.r,e.g=dn.g,e.b=dn.b,e}getStyle(e=ln){lt.fromWorkingColorSpace(dn.copy(this),e);const t=dn.r,n=dn.g,s=dn.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Di),this.setHSL(Di.h+e,Di.s+t,Di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Di),e.getHSL(Da);const n=Kr(Di.h,Da.h,t),s=Kr(Di.s,Da.s,t),r=Kr(Di.l,Da.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const dn=new ke;ke.NAMES=Of;let S0=0;class ti extends ys{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:S0++}),this.uuid=Gn(),this.name="",this.type="Material",this.blending=nr,this.side=ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ul,this.blendDst=hl,this.blendEquation=fs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=lr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_h,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Es,this.stencilZFail=Es,this.stencilZPass=Es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==nr&&(n.blending=this.blending),this.side!==ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ul&&(n.blendSrc=this.blendSrc),this.blendDst!==hl&&(n.blendDst=this.blendDst),this.blendEquation!==fs&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==lr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==_h&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Yt extends ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=xf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Wt=new T,Na=new oe;let b0=0;class Jt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:b0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Kl,this.updateRanges=[],this.gpuType=Qn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Na.fromBufferAttribute(this,t),Na.applyMatrix3(e),this.setXY(t,Na.x,Na.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix3(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyMatrix4(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.applyNormalMatrix(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Wt.fromBufferAttribute(this,t),Wt.transformDirection(e),this.setXYZ(t,Wt.x,Wt.y,Wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jn(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jn(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jn(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),s=Tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),s=Tt(s,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Kl&&(e.usage=this.usage),e}}class Ff extends Jt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class kf extends Jt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wt extends Jt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let E0=0;const Fn=new $e,bc=new It,Ns=new T,Ln=new Ri,Dr=new Ri,en=new T;class Vt extends ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=Gn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nf(e)?kf:Ff)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Fn.makeRotationFromQuaternion(e),this.applyMatrix4(Fn),this}rotateX(e){return Fn.makeRotationX(e),this.applyMatrix4(Fn),this}rotateY(e){return Fn.makeRotationY(e),this.applyMatrix4(Fn),this}rotateZ(e){return Fn.makeRotationZ(e),this.applyMatrix4(Fn),this}translate(e,t,n){return Fn.makeTranslation(e,t,n),this.applyMatrix4(Fn),this}scale(e,t,n){return Fn.makeScale(e,t,n),this.applyMatrix4(Fn),this}lookAt(e){return bc.lookAt(e),bc.updateMatrix(),this.applyMatrix4(bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ns).negate(),this.translate(Ns.x,Ns.y,Ns.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ri);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ln.setFromBufferAttribute(r),this.morphTargetsRelative?(en.addVectors(this.boundingBox.min,Ln.min),this.boundingBox.expandByPoint(en),en.addVectors(this.boundingBox.max,Ln.max),this.boundingBox.expandByPoint(en)):(this.boundingBox.expandByPoint(Ln.min),this.boundingBox.expandByPoint(Ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ci);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(e){const n=this.boundingSphere.center;if(Ln.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Dr.setFromBufferAttribute(o),this.morphTargetsRelative?(en.addVectors(Ln.min,Dr.min),Ln.expandByPoint(en),en.addVectors(Ln.max,Dr.max),Ln.expandByPoint(en)):(Ln.expandByPoint(Dr.min),Ln.expandByPoint(Dr.max))}Ln.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)en.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(en));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)en.fromBufferAttribute(o,l),c&&(Ns.fromBufferAttribute(e,l),en.add(Ns)),s=Math.max(s,n.distanceToSquared(en))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let L=0;L<n.count;L++)o[L]=new T,c[L]=new T;const l=new T,u=new T,h=new T,d=new oe,f=new oe,m=new oe,_=new T,g=new T;function p(L,E,S){l.fromBufferAttribute(n,L),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,S),d.fromBufferAttribute(r,L),f.fromBufferAttribute(r,E),m.fromBufferAttribute(r,S),u.sub(l),h.sub(l),f.sub(d),m.sub(d);const I=1/(f.x*m.y-m.x*f.y);isFinite(I)&&(_.copy(u).multiplyScalar(m.y).addScaledVector(h,-f.y).multiplyScalar(I),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(I),o[L].add(_),o[E].add(_),o[S].add(_),c[L].add(g),c[E].add(g),c[S].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let L=0,E=M.length;L<E;++L){const S=M[L],I=S.start,X=S.count;for(let k=I,q=I+X;k<q;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const v=new T,x=new T,P=new T,A=new T;function C(L){P.fromBufferAttribute(s,L),A.copy(P);const E=o[L];v.copy(E),v.sub(P.multiplyScalar(P.dot(E))).normalize(),x.crossVectors(A,E);const I=x.dot(c[L])<0?-1:1;a.setXYZW(L,v.x,v.y,v.z,I)}for(let L=0,E=M.length;L<E;++L){const S=M[L],I=S.start,X=S.count;for(let k=I,q=I+X;k<q;k+=3)C(e.getX(k+0)),C(e.getX(k+1)),C(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new T,r=new T,a=new T,o=new T,c=new T,l=new T,u=new T,h=new T;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),o.add(u),c.add(u),l.add(u),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)en.fromBufferAttribute(e,t),en.normalize(),e.setXYZ(t,en.x,en.y,en.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,h=o.normalized,d=new l.constructor(c.length*u);let f=0,m=0;for(let _=0,g=c.length;_<g;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*u;for(let p=0;p<u;p++)d[m++]=l[f++]}return new Jt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Vt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],h=r[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const h=a[l];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ih=new $e,es=new ya,Ua=new ci,Dh=new T,Oa=new T,Fa=new T,ka=new T,Ec=new T,Ba=new T,Nh=new T,za=new T;class je extends It{constructor(e=new Vt,t=new Yt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ba.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=o[c],h=r[c];u!==0&&(Ec.fromBufferAttribute(h,e),a?Ba.addScaledVector(Ec,u):Ba.addScaledVector(Ec.sub(t),u))}t.add(Ba)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(Ua.containsPoint(es.origin)===!1&&(es.intersectSphere(Ua,Dh)===null||es.origin.distanceToSquared(Dh)>(e.far-e.near)**2))&&(Ih.copy(r).invert(),es.copy(e.ray).applyMatrix4(Ih),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),v=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,P=v;x<P;x+=3){const A=o.getX(x),C=o.getX(x+1),L=o.getX(x+2);s=Ha(this,p,e,n,l,u,h,A,C,L),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const M=o.getX(g),v=o.getX(g+1),x=o.getX(g+2);s=Ha(this,a,e,n,l,u,h,M,v,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],M=Math.max(g.start,f.start),v=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,P=v;x<P;x+=3){const A=x,C=x+1,L=x+2;s=Ha(this,p,e,n,l,u,h,A,C,L),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const M=g,v=g+1,x=g+2;s=Ha(this,a,e,n,l,u,h,M,v,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function T0(i,e,t,n,s,r,a,o){let c;if(e.side===Rn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===ai,o),c===null)return null;za.copy(o),za.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(za);return l<t.near||l>t.far?null:{distance:l,point:za.clone(),object:i}}function Ha(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Oa),i.getVertexPosition(c,Fa),i.getVertexPosition(l,ka);const u=T0(i,e,t,n,Oa,Fa,ka,Nh);if(u){const h=new T;Bn.getBarycoord(Nh,Oa,Fa,ka,h),s&&(u.uv=Bn.getInterpolatedAttribute(s,o,c,l,h,new oe)),r&&(u.uv1=Bn.getInterpolatedAttribute(r,o,c,l,h,new oe)),a&&(u.normal=Bn.getInterpolatedAttribute(a,o,c,l,h,new T),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new T,materialIndex:0};Bn.getNormal(Oa,Fa,ka,d.normal),u.face=d,u.barycoord=h}return u}class Wn extends Vt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new wt(l,3)),this.setAttribute("normal",new wt(u,3)),this.setAttribute("uv",new wt(h,2));function m(_,g,p,M,v,x,P,A,C,L,E){const S=x/C,I=P/L,X=x/2,k=P/2,q=A/2,B=C+1,V=L+1;let K=0,W=0;const ue=new T;for(let me=0;me<V;me++){const Te=me*I-k;for(let Be=0;Be<B;Be++){const vt=Be*S-X;ue[_]=vt*M,ue[g]=Te*v,ue[p]=q,l.push(ue.x,ue.y,ue.z),ue[_]=0,ue[g]=0,ue[p]=A>0?1:-1,u.push(ue.x,ue.y,ue.z),h.push(Be/C),h.push(1-me/L),K+=1}}for(let me=0;me<L;me++)for(let Te=0;Te<C;Te++){const Be=d+Te+B*me,vt=d+Te+B*(me+1),J=d+(Te+1)+B*(me+1),he=d+(Te+1)+B*me;c.push(Be,vt,he),c.push(vt,J,he),W+=6}o.addGroup(f,W,E),f+=W,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function mr(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function vn(i){const e={};for(let t=0;t<i.length;t++){const n=mr(i[t]);for(const s in n)e[s]=n[s]}return e}function w0(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Bf(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}const A0={clone:mr,merge:vn};var R0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,C0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xi extends ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=R0,this.fragmentShader=C0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=mr(e.uniforms),this.uniformsGroups=w0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class zf extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=bi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new T,Uh=new oe,Oh=new oe;class mn extends zf{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=pr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Yr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return pr*2*Math.atan(Math.tan(Yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z)}getViewSize(e,t){return this.getViewBounds(e,Uh,Oh),t.subVectors(Oh,Uh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Yr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Us=-90,Os=1;class P0 extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new mn(Us,Os,e,t);s.layers=this.layers,this.add(s);const r=new mn(Us,Os,e,t);r.layers=this.layers,this.add(r);const a=new mn(Us,Os,e,t);a.layers=this.layers,this.add(a);const o=new mn(Us,Os,e,t);o.layers=this.layers,this.add(o);const c=new mn(Us,Os,e,t);c.layers=this.layers,this.add(c);const l=new mn(Us,Os,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===bi)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Co)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class Hf extends Zt{constructor(e,t,n,s,r,a,o,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:ur,super(e,t,n,s,r,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class L0 extends xs{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Hf(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Dn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Wn(5,5,5),r=new Xi({name:"CubemapFromEquirect",uniforms:mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Rn,blending:Vi});r.uniforms.tEquirect.value=t;const a=new je(s,r),o=t.minFilter;return t.minFilter===Si&&(t.minFilter=Dn),new P0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class tt extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const I0={type:"move"};class Tc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new tt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new tt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new tt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,n),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(I0)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new tt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Ru{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ke(e),this.near=t,this.far=n}clone(){return new Ru(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Vf extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Gf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Kl,this.updateRanges=[],this.version=0,this.uuid=Gn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const xn=new T;class ca{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyMatrix4(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyNormalMatrix(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.transformDirection(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Jn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Tt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Jn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Jn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Jn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Jn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),s=Tt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Tt(t,this.array),n=Tt(n,this.array),s=Tt(s,this.array),r=Tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Jt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ca(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Wf extends ti{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Fs;const Nr=new T,ks=new T,Bs=new T,zs=new oe,Ur=new oe,Xf=new $e,Va=new T,Or=new T,Ga=new T,Fh=new oe,wc=new oe,kh=new oe;class D0 extends It{constructor(e=new Wf){if(super(),this.isSprite=!0,this.type="Sprite",Fs===void 0){Fs=new Vt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gf(t,5);Fs.setIndex([0,1,2,0,2,3]),Fs.setAttribute("position",new ca(n,3,0,!1)),Fs.setAttribute("uv",new ca(n,2,3,!1))}this.geometry=Fs,this.material=e,this.center=new oe(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ks.setFromMatrixScale(this.matrixWorld),Xf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Bs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ks.multiplyScalar(-Bs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Wa(Va.set(-.5,-.5,0),Bs,a,ks,s,r),Wa(Or.set(.5,-.5,0),Bs,a,ks,s,r),Wa(Ga.set(.5,.5,0),Bs,a,ks,s,r),Fh.set(0,0),wc.set(1,0),kh.set(1,1);let o=e.ray.intersectTriangle(Va,Or,Ga,!1,Nr);if(o===null&&(Wa(Or.set(-.5,.5,0),Bs,a,ks,s,r),wc.set(0,1),o=e.ray.intersectTriangle(Va,Ga,Or,!1,Nr),o===null))return;const c=e.ray.origin.distanceTo(Nr);c<e.near||c>e.far||t.push({distance:c,point:Nr.clone(),uv:Bn.getInterpolation(Nr,Va,Or,Ga,Fh,wc,kh,new oe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Wa(i,e,t,n,s,r){zs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ur.x=r*zs.x-s*zs.y,Ur.y=s*zs.x+r*zs.y):Ur.copy(zs),i.copy(e),i.x+=Ur.x,i.y+=Ur.y,i.applyMatrix4(Xf)}const Bh=new T,zh=new xt,Hh=new xt,N0=new T,Vh=new $e,Xa=new T,Ac=new ci,Gh=new $e,Rc=new ya;class U0 extends je{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=gh,this.bindMatrix=new $e,this.bindMatrixInverse=new $e,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ri),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Xa),this.boundingBox.expandByPoint(Xa)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ci),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Xa),this.boundingSphere.expandByPoint(Xa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ac.copy(this.boundingSphere),Ac.applyMatrix4(s),e.ray.intersectsSphere(Ac)!==!1&&(Gh.copy(s).invert(),Rc.copy(e.ray).applyMatrix4(Gh),!(this.boundingBox!==null&&Rc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Rc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new xt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===gh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Am?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;zh.fromBufferAttribute(s.attributes.skinIndex,e),Hh.fromBufferAttribute(s.attributes.skinWeight,e),Bh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Hh.getComponent(r);if(a!==0){const o=zh.getComponent(r);Vh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(N0.copy(Bh).applyMatrix4(Vh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class qf extends It{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Yf extends Zt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=Mn,u=Mn,h,d){super(null,a,o,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Wh=new $e,O0=new $e;class Cu{constructor(e=[],t=[]){this.uuid=Gn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new $e)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new $e;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:O0;Wh.multiplyMatrices(o,t[r]),Wh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Cu(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Yf(t,e,e,Hn,Qn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new qf),this.bones.push(a),this.boneInverses.push(new $e().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=n[s];e.boneInverses.push(o.toArray())}return e}}class jl extends Jt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Hs=new $e,Xh=new $e,qa=[],qh=new Ri,F0=new $e,Fr=new je,kr=new ci;class k0 extends je{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new jl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,F0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ri),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hs),qh.copy(e.boundingBox).applyMatrix4(Hs),this.boundingBox.union(qh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ci),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Hs),kr.copy(e.boundingSphere).applyMatrix4(Hs),this.boundingSphere.union(kr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Fr.geometry=this.geometry,Fr.material=this.material,Fr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),kr.copy(this.boundingSphere),kr.applyMatrix4(n),e.ray.intersectsSphere(kr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Hs),Xh.multiplyMatrices(n,Hs),Fr.matrixWorld=Xh,Fr.raycast(e,qa);for(let a=0,o=qa.length;a<o;a++){const c=qa[a];c.instanceId=r,c.object=this,t.push(c)}qa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new jl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yf(new Float32Array(s*this.count),s,this.count,yu,Qn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Cc=new T,B0=new T,z0=new et;class ls{constructor(e=new T(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Cc.subVectors(n,t).cross(B0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Cc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||z0.getNormalMatrix(e),s=this.coplanarPoint(Cc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new ci,Ya=new T;class Pu{constructor(e=new ls,t=new ls,n=new ls,s=new ls,r=new ls,a=new ls){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=bi){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],u=s[5],h=s[6],d=s[7],f=s[8],m=s[9],_=s[10],g=s[11],p=s[12],M=s[13],v=s[14],x=s[15];if(n[0].setComponents(c-r,d-l,g-f,x-p).normalize(),n[1].setComponents(c+r,d+l,g+f,x+p).normalize(),n[2].setComponents(c+a,d+u,g+m,x+M).normalize(),n[3].setComponents(c-a,d-u,g-m,x-M).normalize(),n[4].setComponents(c-o,d-h,g-_,x-v).normalize(),t===bi)n[5].setComponents(c+o,d+h,g+_,x+v).normalize();else if(t===Co)n[5].setComponents(o,h,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ya.x=s.normal.x>0?e.max.x:e.min.x,Ya.y=s.normal.y>0?e.max.y:e.min.y,Ya.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ya)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Kf extends ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Po=new T,Lo=new T,Yh=new $e,Br=new ya,Ka=new ci,Pc=new T,Kh=new T;class Lu extends It{constructor(e=new Vt,t=new Kf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Po.fromBufferAttribute(t,s-1),Lo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Po.distanceTo(Lo);e.setAttribute("lineDistance",new wt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ka.copy(n.boundingSphere),Ka.applyMatrix4(s),Ka.radius+=r,e.ray.intersectsSphere(Ka)===!1)return;Yh.copy(s).invert(),Br.copy(e.ray).applyMatrix4(Yh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=l){const p=u.getX(_),M=u.getX(_+1),v=ja(this,e,Br,c,p,M,_);v&&t.push(v)}if(this.isLineLoop){const _=u.getX(m-1),g=u.getX(f),p=ja(this,e,Br,c,_,g,m-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=l){const p=ja(this,e,Br,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=ja(this,e,Br,c,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ja(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Po.fromBufferAttribute(o,s),Lo.fromBufferAttribute(o,r),t.distanceSqToSegment(Po,Lo,Pc,Kh)>n)return;Pc.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Pc);if(!(l<e.near||l>e.far))return{distance:l,point:Kh.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const jh=new T,Zh=new T;class H0 extends Lu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)jh.fromBufferAttribute(t,s),Zh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+jh.distanceTo(Zh);e.setAttribute("lineDistance",new wt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class V0 extends Lu{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ma extends ti{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Jh=new $e,Zl=new ya,Za=new ci,Ja=new T;class Ho extends It{constructor(e=new Vt,t=new Ma){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Za.copy(n.boundingSphere),Za.applyMatrix4(s),Za.radius+=r,e.ray.intersectsSphere(Za)===!1)return;Jh.copy(s).invert(),Zl.copy(e.ray).applyMatrix4(Jh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,h=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let m=d,_=f;m<_;m++){const g=l.getX(m);Ja.fromBufferAttribute(h,g),$h(Ja,g,c,s,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,_=f;m<_;m++)Ja.fromBufferAttribute(h,m),$h(Ja,m,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function $h(i,e,t,n,s,r,a){const o=Zl.distanceSqToPoint(i);if(o<t){const c=new T;Zl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class br extends Zt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class jf extends Zt{constructor(e,t,n,s,r,a,o,c,l,u=ir){if(u!==ir&&u!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===ir&&(n=_s),n===void 0&&u===fr&&(n=dr),super(null,s,r,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Mn,this.minFilter=c!==void 0?c:Mn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wu(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class li{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(a-u)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new oe:new T);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new T,s=[],r=[],a=[],o=new T,c=new $e;for(let f=0;f<=e;f++){const m=f/e;s[f]=this.getTangentAt(m,new T)}r[0]=new T,a[0]=new T;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(rt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(rt(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Iu extends li{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new oe){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class G0 extends Iu{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Du(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,u,h){let d=(a-r)/l-(o-r)/(l+u)+(o-a)/u,f=(o-a)/u-(c-a)/(u+h)+(c-o)/h;d*=u,f*=u,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const $a=new T,Lc=new Du,Ic=new Du,Dc=new Du;class Nu extends li{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new T){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,u;this.closed||o>0?l=s[(o-1)%r]:($a.subVectors(s[0],s[1]).add(s[0]),l=$a);const h=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:($a.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=$a),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let m=Math.pow(l.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),Lc.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,m,_,g),Ic.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,m,_,g),Dc.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,m,_,g)}else this.curveType==="catmullrom"&&(Lc.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),Ic.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),Dc.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return n.set(Lc.calc(c),Ic.calc(c),Dc.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new T().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Qh(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function W0(i,e){const t=1-i;return t*t*e}function X0(i,e){return 2*(1-i)*i*e}function q0(i,e){return i*i*e}function jr(i,e,t,n){return W0(i,e)+X0(i,t)+q0(i,n)}function Y0(i,e){const t=1-i;return t*t*t*e}function K0(i,e){const t=1-i;return 3*t*t*i*e}function j0(i,e){return 3*(1-i)*i*i*e}function Z0(i,e){return i*i*i*e}function Zr(i,e,t,n,s){return Y0(i,e)+K0(i,t)+j0(i,n)+Z0(i,s)}class Zf extends li{constructor(e=new oe,t=new oe,n=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new oe){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zr(e,s.x,r.x,a.x,o.x),Zr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class J0 extends li{constructor(e=new T,t=new T,n=new T,s=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new T){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zr(e,s.x,r.x,a.x,o.x),Zr(e,s.y,r.y,a.y,o.y),Zr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Jf extends li{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $0 extends li{constructor(e=new T,t=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new T){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new T){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $f extends li{constructor(e=new oe,t=new oe,n=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new oe){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(jr(e,s.x,r.x,a.x),jr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qf extends li{constructor(e=new T,t=new T,n=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new T){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(jr(e,s.x,r.x,a.x),jr(e,s.y,r.y,a.y),jr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ep extends li{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],u=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return n.set(Qh(o,c.x,l.x,u.x,h.x),Qh(o,c.y,l.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new oe().fromArray(s))}return this}}var Io=Object.freeze({__proto__:null,ArcCurve:G0,CatmullRomCurve3:Nu,CubicBezierCurve:Zf,CubicBezierCurve3:J0,EllipseCurve:Iu,LineCurve:Jf,LineCurve3:$0,QuadraticBezierCurve:$f,QuadraticBezierCurve3:Qf,SplineCurve:ep});class Q0 extends li{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Io[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Io[s.type]().fromJSON(s))}return this}}class ed extends Q0{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Jf(this.currentPoint.clone(),new oe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new $f(this.currentPoint.clone(),new oe(e,t),new oe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Zf(this.currentPoint.clone(),new oe(e,t),new oe(n,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new ep(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new Iu(e,t,n,s,r,a,o,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Vo extends Vt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new T,u=new oe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=t;h++,d+=3){const f=n+h/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),u.x=(a[d]/e+1)/2,u.y=(a[d+1]/e+1)/2,c.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new wt(a,3)),this.setAttribute("normal",new wt(o,3)),this.setAttribute("uv",new wt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vo(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Xn extends Vt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],f=[];let m=0;const _=[],g=n/2;let p=0;M(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new wt(h,3)),this.setAttribute("normal",new wt(d,3)),this.setAttribute("uv",new wt(f,2));function M(){const x=new T,P=new T;let A=0;const C=(t-e)/n;for(let L=0;L<=r;L++){const E=[],S=L/r,I=S*(t-e)+e;for(let X=0;X<=s;X++){const k=X/s,q=k*c+o,B=Math.sin(q),V=Math.cos(q);P.x=I*B,P.y=-S*n+g,P.z=I*V,h.push(P.x,P.y,P.z),x.set(B,C,V).normalize(),d.push(x.x,x.y,x.z),f.push(k,1-S),E.push(m++)}_.push(E)}for(let L=0;L<s;L++)for(let E=0;E<r;E++){const S=_[E][L],I=_[E+1][L],X=_[E+1][L+1],k=_[E][L+1];(e>0||E!==0)&&(u.push(S,I,k),A+=3),(t>0||E!==r-1)&&(u.push(I,X,k),A+=3)}l.addGroup(p,A,0),p+=A}function v(x){const P=m,A=new oe,C=new T;let L=0;const E=x===!0?e:t,S=x===!0?1:-1;for(let X=1;X<=s;X++)h.push(0,g*S,0),d.push(0,S,0),f.push(.5,.5),m++;const I=m;for(let X=0;X<=s;X++){const q=X/s*c+o,B=Math.cos(q),V=Math.sin(q);C.x=E*V,C.y=g*S,C.z=E*B,h.push(C.x,C.y,C.z),d.push(0,S,0),A.x=B*.5+.5,A.y=V*.5*S+.5,f.push(A.x,A.y),m++}for(let X=0;X<s;X++){const k=P+X,q=I+X;x===!0?u.push(q,q+1,k):u.push(q+1,q,k),L+=3}l.addGroup(p,L,x===!0?1:2),p+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class gr extends Xn{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new gr(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class tp extends ed{constructor(e){super(e),this.uuid=Gn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new ed().fromJSON(s))}return this}}class eg{static triangulate(e,t,n=2){const s=t&&t.length,r=s?t[0]*n:e.length;let a=np(e,0,r,n,!0);const o=[];if(!a||a.next===a.prev)return o;let c,l,u,h,d,f,m;if(s&&(a=rg(e,t,a,n)),e.length>80*n){c=u=e[0],l=h=e[1];for(let _=n;_<r;_+=n)d=e[_],f=e[_+1],d<c&&(c=d),f<l&&(l=f),d>u&&(u=d),f>h&&(h=f);m=Math.max(u-c,h-l),m=m!==0?32767/m:0}return la(a,o,n,c,l,m,0),o}}function np(i,e,t,n,s){let r,a;if(s===gg(i,e,t,n)>0)for(r=e;r<t;r+=n)a=td(r,i[r],i[r+1],a);else for(r=t-n;r>=e;r-=n)a=td(r,i[r],i[r+1],a);return a&&Go(a,a.next)&&(ha(a),a=a.next),a}function vs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Go(t,t.next)||Ut(t.prev,t,t.next)===0)){if(ha(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function la(i,e,t,n,s,r,a){if(!i)return;!a&&r&&ug(i,n,s,r);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?ng(i,n,s,r):tg(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),ha(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=ig(vs(i),e,t),la(i,e,t,n,s,r,2)):a===2&&sg(i,e,t,n,s,r):la(vs(i),e,t,n,s,r,1);break}}}function tg(i){const e=i.prev,t=i,n=i.next;if(Ut(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,u=s<r?s<a?s:a:r<a?r:a,h=o<c?o<l?o:l:c<l?c:l,d=s>r?s>a?s:a:r>a?r:a,f=o>c?o>l?o:l:c>l?c:l;let m=n.next;for(;m!==e;){if(m.x>=u&&m.x<=d&&m.y>=h&&m.y<=f&&er(s,o,r,c,a,l,m.x,m.y)&&Ut(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function ng(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Ut(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,u=s.y,h=r.y,d=a.y,f=o<c?o<l?o:l:c<l?c:l,m=u<h?u<d?u:d:h<d?h:d,_=o>c?o>l?o:l:c>l?c:l,g=u>h?u>d?u:d:h>d?h:d,p=Jl(f,m,e,t,n),M=Jl(_,g,e,t,n);let v=i.prevZ,x=i.nextZ;for(;v&&v.z>=p&&x&&x.z<=M;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&er(o,u,c,h,l,d,v.x,v.y)&&Ut(v.prev,v,v.next)>=0||(v=v.prevZ,x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==a&&er(o,u,c,h,l,d,x.x,x.y)&&Ut(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;v&&v.z>=p;){if(v.x>=f&&v.x<=_&&v.y>=m&&v.y<=g&&v!==s&&v!==a&&er(o,u,c,h,l,d,v.x,v.y)&&Ut(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;x&&x.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==a&&er(o,u,c,h,l,d,x.x,x.y)&&Ut(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function ig(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Go(s,r)&&ip(s,n,n.next,r)&&ua(s,r)&&ua(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),ha(n),ha(n.next),n=i=r),n=n.next}while(n!==i);return vs(n)}function sg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&fg(a,o)){let c=sp(a,o);a=vs(a,a.next),c=vs(c,c.next),la(a,e,t,n,s,r,0),la(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function rg(i,e,t,n){const s=[];let r,a,o,c,l;for(r=0,a=e.length;r<a;r++)o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=np(i,o,c,n,!1),l===l.next&&(l.steiner=!0),s.push(dg(l));for(s.sort(ag),r=0;r<s.length;r++)t=og(s[r],t);return t}function ag(i,e){return i.x-e.x}function og(i,e){const t=cg(i,e);if(!t)return e;const n=sp(t,i);return vs(n,n.next),vs(t,t.next)}function cg(i,e){let t=e,n=-1/0,s;const r=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;const o=s,c=s.x,l=s.y;let u=1/0,h;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&er(a<l?r:n,a,c,l,a<l?n:r,a,t.x,t.y)&&(h=Math.abs(a-t.y)/(r-t.x),ua(t,i)&&(h<u||h===u&&(t.x>s.x||t.x===s.x&&lg(s,t)))&&(s=t,u=h)),t=t.next;while(t!==o);return s}function lg(i,e){return Ut(i.prev,i,e.prev)<0&&Ut(e.next,i,i.next)<0}function ug(i,e,t,n){let s=i;do s.z===0&&(s.z=Jl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,hg(s)}function hg(i){let e,t,n,s,r,a,o,c,l=1;do{for(t=i,i=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<l&&(o++,n=n.nextZ,!!n);e++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,o--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,l*=2}while(a>1);return i}function Jl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function dg(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function er(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function fg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!pg(i,e)&&(ua(i,e)&&ua(e,i)&&mg(i,e)&&(Ut(i.prev,i,e.prev)||Ut(i,e.prev,e))||Go(i,e)&&Ut(i.prev,i,i.next)>0&&Ut(e.prev,e,e.next)>0)}function Ut(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Go(i,e){return i.x===e.x&&i.y===e.y}function ip(i,e,t,n){const s=eo(Ut(i,e,t)),r=eo(Ut(i,e,n)),a=eo(Ut(t,n,i)),o=eo(Ut(t,n,e));return!!(s!==r&&a!==o||s===0&&Qa(i,t,e)||r===0&&Qa(i,n,e)||a===0&&Qa(t,i,n)||o===0&&Qa(t,e,n))}function Qa(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function eo(i){return i>0?1:i<0?-1:0}function pg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&ip(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ua(i,e){return Ut(i.prev,i,i.next)<0?Ut(i,e,i.next)>=0&&Ut(i,i.prev,e)>=0:Ut(i,e,i.prev)<0||Ut(i,i.next,e)<0}function mg(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function sp(i,e){const t=new $l(i.i,i.x,i.y),n=new $l(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function td(i,e,t,n){const s=new $l(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ha(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function $l(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function gg(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Jr{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Jr.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];nd(e),id(n,e);let a=e.length;t.forEach(nd);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,id(n,t[c]);const o=eg.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function nd(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function id(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Uu extends Vt{constructor(e=new tp([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new wt(s,3)),this.setAttribute("uv",new wt(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:_g;let v,x=!1,P,A,C,L;p&&(v=p.getSpacedPoints(u),x=!0,d=!1,P=p.computeFrenetFrames(u,!1),A=new T,C=new T,L=new T),d||(g=0,f=0,m=0,_=0);const E=o.extractPoints(l);let S=E.shape;const I=E.holes;if(!Jr.isClockWise(S)){S=S.reverse();for(let ne=0,te=I.length;ne<te;ne++){const R=I[ne];Jr.isClockWise(R)&&(I[ne]=R.reverse())}}const k=Jr.triangulateShape(S,I),q=S;for(let ne=0,te=I.length;ne<te;ne++){const R=I[ne];S=S.concat(R)}function B(ne,te,R){return te||console.error("THREE.ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(te,R)}const V=S.length,K=k.length;function W(ne,te,R){let Ue,ie,Ae;const le=ne.x-te.x,Xe=ne.y-te.y,Me=R.x-ne.x,w=R.y-ne.y,y=le*le+Xe*Xe,F=le*w-Xe*Me;if(Math.abs(F)>Number.EPSILON){const j=Math.sqrt(y),ee=Math.sqrt(Me*Me+w*w),Z=te.x-Xe/j,Ne=te.y+le/j,_e=R.x-w/ee,we=R.y+Me/ee,ct=((_e-Z)*w-(we-Ne)*Me)/(le*w-Xe*Me);Ue=Z+le*ct-ne.x,ie=Ne+Xe*ct-ne.y;const re=Ue*Ue+ie*ie;if(re<=2)return new oe(Ue,ie);Ae=Math.sqrt(re/2)}else{let j=!1;le>Number.EPSILON?Me>Number.EPSILON&&(j=!0):le<-Number.EPSILON?Me<-Number.EPSILON&&(j=!0):Math.sign(Xe)===Math.sign(w)&&(j=!0),j?(Ue=-Xe,ie=le,Ae=Math.sqrt(y)):(Ue=le,ie=Xe,Ae=Math.sqrt(y/2))}return new oe(Ue/Ae,ie/Ae)}const ue=[];for(let ne=0,te=q.length,R=te-1,Ue=ne+1;ne<te;ne++,R++,Ue++)R===te&&(R=0),Ue===te&&(Ue=0),ue[ne]=W(q[ne],q[R],q[Ue]);const me=[];let Te,Be=ue.concat();for(let ne=0,te=I.length;ne<te;ne++){const R=I[ne];Te=[];for(let Ue=0,ie=R.length,Ae=ie-1,le=Ue+1;Ue<ie;Ue++,Ae++,le++)Ae===ie&&(Ae=0),le===ie&&(le=0),Te[Ue]=W(R[Ue],R[Ae],R[le]);me.push(Te),Be=Be.concat(Te)}for(let ne=0;ne<g;ne++){const te=ne/g,R=f*Math.cos(te*Math.PI/2),Ue=m*Math.sin(te*Math.PI/2)+_;for(let ie=0,Ae=q.length;ie<Ae;ie++){const le=B(q[ie],ue[ie],Ue);de(le.x,le.y,-R)}for(let ie=0,Ae=I.length;ie<Ae;ie++){const le=I[ie];Te=me[ie];for(let Xe=0,Me=le.length;Xe<Me;Xe++){const w=B(le[Xe],Te[Xe],Ue);de(w.x,w.y,-R)}}}const vt=m+_;for(let ne=0;ne<V;ne++){const te=d?B(S[ne],Be[ne],vt):S[ne];x?(C.copy(P.normals[0]).multiplyScalar(te.x),A.copy(P.binormals[0]).multiplyScalar(te.y),L.copy(v[0]).add(C).add(A),de(L.x,L.y,L.z)):de(te.x,te.y,0)}for(let ne=1;ne<=u;ne++)for(let te=0;te<V;te++){const R=d?B(S[te],Be[te],vt):S[te];x?(C.copy(P.normals[ne]).multiplyScalar(R.x),A.copy(P.binormals[ne]).multiplyScalar(R.y),L.copy(v[ne]).add(C).add(A),de(L.x,L.y,L.z)):de(R.x,R.y,h/u*ne)}for(let ne=g-1;ne>=0;ne--){const te=ne/g,R=f*Math.cos(te*Math.PI/2),Ue=m*Math.sin(te*Math.PI/2)+_;for(let ie=0,Ae=q.length;ie<Ae;ie++){const le=B(q[ie],ue[ie],Ue);de(le.x,le.y,h+R)}for(let ie=0,Ae=I.length;ie<Ae;ie++){const le=I[ie];Te=me[ie];for(let Xe=0,Me=le.length;Xe<Me;Xe++){const w=B(le[Xe],Te[Xe],Ue);x?de(w.x,w.y+v[u-1].y,v[u-1].x+R):de(w.x,w.y,h+R)}}}J(),he();function J(){const ne=s.length/3;if(d){let te=0,R=V*te;for(let Ue=0;Ue<K;Ue++){const ie=k[Ue];Fe(ie[2]+R,ie[1]+R,ie[0]+R)}te=u+g*2,R=V*te;for(let Ue=0;Ue<K;Ue++){const ie=k[Ue];Fe(ie[0]+R,ie[1]+R,ie[2]+R)}}else{for(let te=0;te<K;te++){const R=k[te];Fe(R[2],R[1],R[0])}for(let te=0;te<K;te++){const R=k[te];Fe(R[0]+V*u,R[1]+V*u,R[2]+V*u)}}n.addGroup(ne,s.length/3-ne,0)}function he(){const ne=s.length/3;let te=0;Ie(q,te),te+=q.length;for(let R=0,Ue=I.length;R<Ue;R++){const ie=I[R];Ie(ie,te),te+=ie.length}n.addGroup(ne,s.length/3-ne,1)}function Ie(ne,te){let R=ne.length;for(;--R>=0;){const Ue=R;let ie=R-1;ie<0&&(ie=ne.length-1);for(let Ae=0,le=u+g*2;Ae<le;Ae++){const Xe=V*Ae,Me=V*(Ae+1),w=te+Ue+Xe,y=te+ie+Xe,F=te+ie+Me,j=te+Ue+Me;ht(w,y,F,j)}}}function de(ne,te,R){c.push(ne),c.push(te),c.push(R)}function Fe(ne,te,R){Oe(ne),Oe(te),Oe(R);const Ue=s.length/3,ie=M.generateTopUV(n,s,Ue-3,Ue-2,Ue-1);gt(ie[0]),gt(ie[1]),gt(ie[2])}function ht(ne,te,R,Ue){Oe(ne),Oe(te),Oe(Ue),Oe(te),Oe(R),Oe(Ue);const ie=s.length/3,Ae=M.generateSideWallUV(n,s,ie-6,ie-3,ie-2,ie-1);gt(Ae[0]),gt(Ae[1]),gt(Ae[3]),gt(Ae[1]),gt(Ae[2]),gt(Ae[3])}function Oe(ne){s.push(c[ne*3+0]),s.push(c[ne*3+1]),s.push(c[ne*3+2])}function gt(ne){r.push(ne.x),r.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return xg(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Io[s.type]().fromJSON(s)),new Uu(n,e.options)}}const _g={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[s*3],u=e[s*3+1];return[new oe(r,a),new oe(o,c),new oe(l,u)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],u=e[n*3+1],h=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],_=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(o-u)<Math.abs(a-l)?[new oe(a,1-c),new oe(l,1-h),new oe(d,1-m),new oe(_,1-p)]:[new oe(o,1-c),new oe(u,1-h),new oe(f,1-m),new oe(g,1-p)]}};function xg(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class nn extends Vt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,u=c+1,h=e/o,d=t/c,f=[],m=[],_=[],g=[];for(let p=0;p<u;p++){const M=p*d-a;for(let v=0;v<l;v++){const x=v*h-r;m.push(x,-M,0),_.push(0,0,1),g.push(v/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){const v=M+l*p,x=M+l*(p+1),P=M+1+l*(p+1),A=M+1+l*p;f.push(v,x,A),f.push(x,P,A)}this.setIndex(f),this.setAttribute("position",new wt(m,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Er extends Vt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],u=[];let h=e;const d=(t-e)/s,f=new T,m=new oe;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){const p=r+g/n*a;f.x=h*Math.cos(p),f.y=h*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,u.push(m.x,m.y)}h+=d}for(let _=0;_<s;_++){const g=_*(n+1);for(let p=0;p<n;p++){const M=p+g,v=M,x=M+n+1,P=M+n+2,A=M+1;o.push(v,x,A),o.push(x,P,A)}}this.setIndex(o),this.setAttribute("position",new wt(c,3)),this.setAttribute("normal",new wt(l,3)),this.setAttribute("uv",new wt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Er(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Wo extends Vt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const u=[],h=new T,d=new T,f=[],m=[],_=[],g=[];for(let p=0;p<=n;p++){const M=[],v=p/n;let x=0;p===0&&a===0?x=.5/t:p===n&&c===Math.PI&&(x=-.5/t);for(let P=0;P<=t;P++){const A=P/t;h.x=-e*Math.cos(s+A*r)*Math.sin(a+v*o),h.y=e*Math.cos(a+v*o),h.z=e*Math.sin(s+A*r)*Math.sin(a+v*o),m.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),g.push(A+x,1-v),M.push(l++)}u.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){const v=u[p][M+1],x=u[p][M],P=u[p+1][M],A=u[p+1][M+1];(p!==0||a>0)&&f.push(v,x,A),(p!==n-1||c<Math.PI)&&f.push(x,P,A)}this.setIndex(f),this.setAttribute("position",new wt(m,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ni extends Vt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],u=new T,h=new T,d=new T;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){const _=m/s*r,g=f/n*Math.PI*2;h.x=(e+t*Math.cos(g))*Math.cos(_),h.y=(e+t*Math.cos(g))*Math.sin(_),h.z=t*Math.sin(g),o.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(m/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){const _=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,M=(s+1)*f+m;a.push(_,g,M),a.push(g,p,M)}this.setIndex(a),this.setAttribute("position",new wt(o,3)),this.setAttribute("normal",new wt(c,3)),this.setAttribute("uv",new wt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ni(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ou extends Vt{constructor(e=new Qf(new T(-1,-1,0),new T(-1,1,0),new T(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new T,c=new T,l=new oe;let u=new T;const h=[],d=[],f=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new wt(h,3)),this.setAttribute("normal",new wt(d,3)),this.setAttribute("uv",new wt(f,2));function _(){for(let v=0;v<t;v++)g(v);g(r===!1?t:0),M(),p()}function g(v){u=e.getPointAt(v/t,u);const x=a.normals[v],P=a.binormals[v];for(let A=0;A<=s;A++){const C=A/s*Math.PI*2,L=Math.sin(C),E=-Math.cos(C);c.x=E*x.x+L*P.x,c.y=E*x.y+L*P.y,c.z=E*x.z+L*P.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=u.x+n*c.x,o.y=u.y+n*c.y,o.z=u.z+n*c.z,h.push(o.x,o.y,o.z)}}function p(){for(let v=1;v<=t;v++)for(let x=1;x<=s;x++){const P=(s+1)*(v-1)+(x-1),A=(s+1)*v+(x-1),C=(s+1)*v+x,L=(s+1)*(v-1)+x;m.push(P,A,L),m.push(A,C,L)}}function M(){for(let v=0;v<=t;v++)for(let x=0;x<=s;x++)l.x=v/t,l.y=x/s,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Ou(new Io[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Nn extends ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=If,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ui extends Nn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new oe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return rt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class vg extends ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Im,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class yg extends ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function to(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Mg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Sg(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function sd(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)s[a++]=i[o+c]}return s}function rp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}class Sa{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class bg extends Sa{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:$s,endingEnd:$s}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Qs:r=e,o=2*t-n;break;case Ao:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Qs:a=e,c=2*n-t;break;case Ao:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}const l=(n-t)*.5,u=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),_=m*m,g=_*m,p=-d*g+2*d*_-d*m,M=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*m+1,v=(-1-f)*g+(1.5+f)*_+.5*m,x=f*g-f*_;for(let P=0;P!==o;++P)r[P]=p*a[u+P]+M*a[l+P]+v*a[c+P]+x*a[h+P];return r}}class ap extends Sa{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,u=(n-t)/(s-t),h=1-u;for(let d=0;d!==o;++d)r[d]=a[l+d]*h+a[c+d]*u;return r}}class Eg extends Sa{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class hi{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=to(t,this.TimeBufferType),this.values=to(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:to(e.times,Array),values:to(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Eg(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ap(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new bg(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ra:t=this.InterpolantFactoryMethodDiscrete;break;case aa:t=this.InterpolantFactoryMethodLinear;break;case rc:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ra;case this.InterpolantFactoryMethodLinear:return aa;case this.InterpolantFactoryMethodSmooth:return rc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Mg(s))for(let o=0,c=s.length;o!==c;++o){const l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===rc,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],u=e[o+1];if(l!==u&&(o!==1||l!==e[0]))if(s)c=!0;else{const h=o*n,d=h-n,f=h+n;for(let m=0;m!==n;++m){const _=t[h+m];if(_!==t[d+m]||_!==t[f+m]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const h=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}hi.prototype.TimeBufferType=Float32Array;hi.prototype.ValueBufferType=Float32Array;hi.prototype.DefaultInterpolation=aa;class Tr extends hi{constructor(e,t,n){super(e,t,n)}}Tr.prototype.ValueTypeName="bool";Tr.prototype.ValueBufferType=Array;Tr.prototype.DefaultInterpolation=ra;Tr.prototype.InterpolantFactoryMethodLinear=void 0;Tr.prototype.InterpolantFactoryMethodSmooth=void 0;class op extends hi{}op.prototype.ValueTypeName="color";class _r extends hi{}_r.prototype.ValueTypeName="number";class Tg extends Sa{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t);let l=e*o;for(let u=l+o;l!==u;l+=4)ei.slerpFlat(r,0,a,l-o,a,l,c);return r}}class xr extends hi{InterpolantFactoryMethodLinear(e){return new Tg(this.times,this.values,this.getValueSize(),e)}}xr.prototype.ValueTypeName="quaternion";xr.prototype.InterpolantFactoryMethodSmooth=void 0;class wr extends hi{constructor(e,t,n){super(e,t,n)}}wr.prototype.ValueTypeName="string";wr.prototype.ValueBufferType=Array;wr.prototype.DefaultInterpolation=ra;wr.prototype.InterpolantFactoryMethodLinear=void 0;wr.prototype.InterpolantFactoryMethodSmooth=void 0;class vr extends hi{}vr.prototype.ValueTypeName="vector";class Ql{constructor(e="",t=-1,n=[],s=Eu){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Gn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Ag(n[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=n.length;r!==a;++r)t.push(hi.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const u=Sg(c);c=sd(c,1,u),l=sd(l,1,u),!s&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new _r(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],u=l.name.match(r);if(u&&u.length>1){const h=u[1];let d=s[h];d||(s[h]=d=[]),d.push(l)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,d,f,m,_){if(f.length!==0){const g=[],p=[];rp(f,g,p,m),g.length!==0&&_.push(new h(d,g,p))}},s=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let h=0;h<l.length;h++){const d=l[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let _=0;_<d[m].morphTargets.length;_++)f[d[m].morphTargets[_]]=-1;for(const _ in f){const g=[],p=[];for(let M=0;M!==d[m].morphTargets.length;++M){const v=d[m];g.push(v.time),p.push(v.morphTarget===_?1:0)}s.push(new _r(".morphTargetInfluence["+_+"]",g,p))}c=f.length*a}else{const f=".bones["+t[h].name+"]";n(vr,f+".position",d,"pos",s),n(xr,f+".quaternion",d,"rot",s),n(vr,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,c,s,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function wg(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return _r;case"vector":case"vector2":case"vector3":case"vector4":return vr;case"color":return op;case"quaternion":return xr;case"bool":case"boolean":return Tr;case"string":return wr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Ag(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=wg(i.type);if(i.times===void 0){const t=[],n=[];rp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const zi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class Rg{constructor(e,t,n){const s=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){const h=l.indexOf(u);return h!==-1&&l.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=l.length;h<d;h+=2){const f=l[h],m=l[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null}}}const Cg=new Rg;class Ar{constructor(e){this.manager=e!==void 0?e:Cg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ar.DEFAULT_MATERIAL_NAME="__DEFAULT";const xi={};class Pg extends Error{constructor(e,t){super(e),this.response=t}}class cp extends Ar{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=zi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(xi[e]!==void 0){xi[e].push({onLoad:t,onProgress:n,onError:s});return}xi[e]=[],xi[e].push({onLoad:t,onProgress:n,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const u=xi[e],h=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0;let _=0;const g=new ReadableStream({start(p){M();function M(){h.read().then(({done:v,value:x})=>{if(v)p.close();else{_+=x.byteLength;const P=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let A=0,C=u.length;A<C;A++){const L=u[A];L.onProgress&&L.onProgress(P)}p.enqueue(x),M()}},v=>{p.error(v)})}}});return new Response(g)}else throw new Pg(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return l.json();default:if(o===void 0)return l.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{zi.add(e,l);const u=xi[e];delete xi[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onLoad&&f.onLoad(l)}}).catch(l=>{const u=xi[e];if(u===void 0)throw this.manager.itemError(e),l;delete xi[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Lg extends Ar{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=zi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=oa("img");function c(){u(),zi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(h){u(),s&&s(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Ig extends Ar{constructor(e){super(e)}load(e,t,n,s){const r=new Zt,a=new Lg(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Xo extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class lp extends Xo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Nc=new $e,rd=new T,ad=new T;class Fu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pu,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;rd.setFromMatrixPosition(e.matrixWorld),t.position.copy(rd),ad.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ad),t.updateMatrixWorld(),Nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Dg extends Fu{constructor(){super(new mn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=pr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Ng extends Xo{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Dg}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const od=new $e,zr=new T,Uc=new T;class Ug extends Fu{constructor(){super(new mn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new oe(4,2),this._viewportCount=6,this._viewports=[new xt(2,1,1,1),new xt(0,1,1,1),new xt(3,1,1,1),new xt(1,1,1,1),new xt(3,0,1,1),new xt(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),zr.setFromMatrixPosition(e.matrixWorld),n.position.copy(zr),Uc.copy(n.position),Uc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Uc),n.updateMatrixWorld(),s.makeTranslation(-zr.x,-zr.y,-zr.z),od.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(od)}}class ba extends Xo{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Ug}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class ku extends zf{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Og extends Fu{constructor(){super(new ku(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bu extends Xo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new Og}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class $r{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,s=e.length;n<s;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Fg extends Ar{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=zi.get(e);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{t&&t(l),r.manager.itemEnd(e)}).catch(l=>{s&&s(l)});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return zi.add(e,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),zi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});zi.add(e,c),r.manager.itemStart(e)}}class kg extends mn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class Bg{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,s=this.valueSize,r=e*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const c=t*this._origIndex;this._mixBufferRegion(n,s,c,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(n[c]!==n[c+t]){o.setValue(n,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,a=s;r!==a;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,s){ei.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){const a=this._workIndex*r;ei.multiplyQuaternionsFlat(e,a,e,t,e,n),ei.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,n,s,r){const a=1-s;for(let o=0;o!==r;++o){const c=t+o;e[c]=e[c]*a+e[n+o]*s}}_lerpAdditive(e,t,n,s,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*s}}}const zu="\\[\\]\\.:\\/",zg=new RegExp("["+zu+"]","g"),Hu="[^"+zu+"]",Hg="[^"+zu.replace("\\.","")+"]",Vg=/((?:WC+[\/:])*)/.source.replace("WC",Hu),Gg=/(WCOD+)?/.source.replace("WCOD",Hg),Wg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Hu),Xg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Hu),qg=new RegExp("^"+Vg+Gg+Wg+Xg+"$"),Yg=["material","materials","bones","map"];class Kg{constructor(e,t,n){const s=n||St.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class St{constructor(e,t,n){this.path=t,this.parsedPath=n||St.parseTrackName(t),this.node=St.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new St.Composite(e,t,n):new St(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(zg,"")}static parseTrackName(e){const t=qg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Yg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=St.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[s];if(a===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}St.Composite=Kg;St.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};St.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};St.prototype.GetterByBindingType=[St.prototype._getValue_direct,St.prototype._getValue_array,St.prototype._getValue_arrayElement,St.prototype._getValue_toArray];St.prototype.SetterByBindingTypeAndVersioning=[[St.prototype._setValue_direct,St.prototype._setValue_direct_setNeedsUpdate,St.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[St.prototype._setValue_array,St.prototype._setValue_array_setNeedsUpdate,St.prototype._setValue_array_setMatrixWorldNeedsUpdate],[St.prototype._setValue_arrayElement,St.prototype._setValue_arrayElement_setNeedsUpdate,St.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[St.prototype._setValue_fromArray,St.prototype._setValue_fromArray_setNeedsUpdate,St.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class jg{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;const r=t.tracks,a=r.length,o=new Array(a),c={endingStart:$s,endingEnd:$s};for(let l=0;l!==a;++l){const u=r[l].createInterpolant(null);o[l]=u,u.settings=c}this._interpolantSettings=c,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Rm,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n){if(e.fadeOut(t),this.fadeIn(t),n){const s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const c=o.parameterPositions,l=o.sampleValues;return c[0]=r,c[1]=r+n,l[0]=e/a,l[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const c=(e-r)*n;c<0||n===0?t=0:(this._startTime=null,t=n*c)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case Pm:for(let u=0,h=c.length;u!==h;++u)c[u].evaluate(a),l[u].accumulateAdditive(o);break;case Eu:default:for(let u=0,h=c.length;u!==h;++u)c[u].evaluate(a),l[u].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let s=this.time+e,r=this._loopCount;const a=n===Cm;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(n===Pf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){const o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);const c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){const l=e<0;this._setEndings(l,!l,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){const s=this._interpolantSettings;n?(s.endingStart=Qs,s.endingEnd=Qs):(e?s.endingStart=this.zeroSlopeAtStart?Qs:$s:s.endingStart=Ao,t?s.endingEnd=this.zeroSlopeAtEnd?Qs:$s:s.endingEnd=Ao)}_scheduleFading(e,t,n){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,c=a.sampleValues;return o[0]=r,c[0]=t,o[1]=r+e,c[1]=n,this}}const Zg=new Float32Array(1);class Jg extends ys{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,c=n.uuid,l=this._bindingsByRootAndName;let u=l[c];u===void 0&&(u={},l[c]=u);for(let h=0;h!==r;++h){const d=s[h],f=d.name;let m=u[f];if(m!==void 0)++m.referenceCount,a[h]=m;else{if(m=a[h],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,c,f));continue}const _=t&&t._propertyBindings[h].binding.parsedPath;m=new Bg(St.create(n,f,_),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,c,f),a[h]=m}o[h].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const s=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],c=o.knownActions,l=c[c.length-1],u=e._byClipCacheIndex;l._byClipCacheIndex=u,c[u]=l,c.pop(),e._byClipCacheIndex=null;const h=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],c.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[t];a===void 0&&(a={},s[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new ap(new Float32Array(2),new Float32Array(2),1,Zg),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const s=t||this._root,r=s.uuid;let a=typeof e=="string"?Ql.findByName(s,e):e;const o=a!==null?a.uuid:e,c=this._actionsByClip[o];let l=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Eu),c!==void 0){const h=c.actionByRoot[r];if(h!==void 0&&h.blendMode===n)return h;l=c.knownActions[0],a===null&&(a=l._clip)}if(a===null)return null;const u=new jg(this,a,t,n);return this._bindAction(u,l),this._addInactiveAction(u,o,r),u}existingAction(e,t){const n=t||this._root,s=n.uuid,r=typeof e=="string"?Ql.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(s,e,r,a);const o=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)o[l].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const a=r.knownActions;for(let o=0,c=a.length;o!==c;++o){const l=a[o];this._deactivateAction(l);const u=l._cacheIndex,h=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(l)}delete s[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,c=o[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const cd=new $e;class $g{constructor(e,t,n=0,s=1/0){this.ray=new ya(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Au,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return cd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(cd),this}intersectObject(e,t=!0,n=[]){return eu(e,this,n,t),n.sort(ld),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)eu(e[s],this,n,t);return n.sort(ld),n}}function ld(i,e){return i.distance-e.distance}function eu(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)eu(r[a],e,t,!0)}}function ud(i,e,t,n){const s=Qg(n);switch(t){case Ef:return i*e;case wf:return i*e;case Af:return i*e*2;case yu:return i*e/s.components*s.byteLength;case Mu:return i*e/s.components*s.byteLength;case Rf:return i*e*2/s.components*s.byteLength;case Su:return i*e*2/s.components*s.byteLength;case Tf:return i*e*3/s.components*s.byteLength;case Hn:return i*e*4/s.components*s.byteLength;case bu:return i*e*4/s.components*s.byteLength;case xo:case vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case yo:case Mo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sl:case El:return Math.max(i,16)*Math.max(e,8)/4;case Ml:case bl:return Math.max(i,8)*Math.max(e,8)/2;case Tl:case wl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Dl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Hl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case So:case Vl:case Gl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Cf:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xl:case ql:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Qg(i){switch(i){case wi:case Mf:return{byteLength:1,components:1};case sa:case Sf:case va:return{byteLength:2,components:1};case xu:case vu:return{byteLength:2,components:4};case _s:case _u:case Qn:return{byteLength:4,components:1};case bf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:gu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=gu);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function up(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function e_(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,c,l){const u=c.array,h=c.updateRanges;if(i.bindBuffer(l,o),h.length===0)i.bufferSubData(l,0,u);else{h.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<h.length;f++){const m=h[d],_=h[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,m=h.length;f<m;f++){const _=h[f];i.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var t_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,n_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,i_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,a_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,o_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,c_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,l_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,u_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,h_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,d_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,f_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,p_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,m_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,g_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,__=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,x_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,v_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,y_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,M_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,S_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,b_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,E_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,T_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,w_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,A_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,R_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,C_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,P_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,L_="gl_FragColor = linearToOutputTexel( gl_FragColor );",I_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,N_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,U_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,O_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,F_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,k_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,B_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,z_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,H_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,V_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,G_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,W_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,q_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Y_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,K_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,j_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Z_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,J_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Q_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ex=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,tx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ix=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ax=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ox=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ux=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,px=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_x=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,vx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,yx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ex=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ax=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Px=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ix=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ux=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ox=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Bx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Vx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Wx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Kx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,jx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$x=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ev=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,av=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ov=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,lv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,uv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,fv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,mv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_v=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,vv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Sv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ev=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Tv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Av=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Cv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Iv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Dv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,st={alphahash_fragment:t_,alphahash_pars_fragment:n_,alphamap_fragment:i_,alphamap_pars_fragment:s_,alphatest_fragment:r_,alphatest_pars_fragment:a_,aomap_fragment:o_,aomap_pars_fragment:c_,batching_pars_vertex:l_,batching_vertex:u_,begin_vertex:h_,beginnormal_vertex:d_,bsdfs:f_,iridescence_fragment:p_,bumpmap_pars_fragment:m_,clipping_planes_fragment:g_,clipping_planes_pars_fragment:__,clipping_planes_pars_vertex:x_,clipping_planes_vertex:v_,color_fragment:y_,color_pars_fragment:M_,color_pars_vertex:S_,color_vertex:b_,common:E_,cube_uv_reflection_fragment:T_,defaultnormal_vertex:w_,displacementmap_pars_vertex:A_,displacementmap_vertex:R_,emissivemap_fragment:C_,emissivemap_pars_fragment:P_,colorspace_fragment:L_,colorspace_pars_fragment:I_,envmap_fragment:D_,envmap_common_pars_fragment:N_,envmap_pars_fragment:U_,envmap_pars_vertex:O_,envmap_physical_pars_fragment:Y_,envmap_vertex:F_,fog_vertex:k_,fog_pars_vertex:B_,fog_fragment:z_,fog_pars_fragment:H_,gradientmap_pars_fragment:V_,lightmap_pars_fragment:G_,lights_lambert_fragment:W_,lights_lambert_pars_fragment:X_,lights_pars_begin:q_,lights_toon_fragment:K_,lights_toon_pars_fragment:j_,lights_phong_fragment:Z_,lights_phong_pars_fragment:J_,lights_physical_fragment:$_,lights_physical_pars_fragment:Q_,lights_fragment_begin:ex,lights_fragment_maps:tx,lights_fragment_end:nx,logdepthbuf_fragment:ix,logdepthbuf_pars_fragment:sx,logdepthbuf_pars_vertex:rx,logdepthbuf_vertex:ax,map_fragment:ox,map_pars_fragment:cx,map_particle_fragment:lx,map_particle_pars_fragment:ux,metalnessmap_fragment:hx,metalnessmap_pars_fragment:dx,morphinstance_vertex:fx,morphcolor_vertex:px,morphnormal_vertex:mx,morphtarget_pars_vertex:gx,morphtarget_vertex:_x,normal_fragment_begin:xx,normal_fragment_maps:vx,normal_pars_fragment:yx,normal_pars_vertex:Mx,normal_vertex:Sx,normalmap_pars_fragment:bx,clearcoat_normal_fragment_begin:Ex,clearcoat_normal_fragment_maps:Tx,clearcoat_pars_fragment:wx,iridescence_pars_fragment:Ax,opaque_fragment:Rx,packing:Cx,premultiplied_alpha_fragment:Px,project_vertex:Lx,dithering_fragment:Ix,dithering_pars_fragment:Dx,roughnessmap_fragment:Nx,roughnessmap_pars_fragment:Ux,shadowmap_pars_fragment:Ox,shadowmap_pars_vertex:Fx,shadowmap_vertex:kx,shadowmask_pars_fragment:Bx,skinbase_vertex:zx,skinning_pars_vertex:Hx,skinning_vertex:Vx,skinnormal_vertex:Gx,specularmap_fragment:Wx,specularmap_pars_fragment:Xx,tonemapping_fragment:qx,tonemapping_pars_fragment:Yx,transmission_fragment:Kx,transmission_pars_fragment:jx,uv_pars_fragment:Zx,uv_pars_vertex:Jx,uv_vertex:$x,worldpos_vertex:Qx,background_vert:ev,background_frag:tv,backgroundCube_vert:nv,backgroundCube_frag:iv,cube_vert:sv,cube_frag:rv,depth_vert:av,depth_frag:ov,distanceRGBA_vert:cv,distanceRGBA_frag:lv,equirect_vert:uv,equirect_frag:hv,linedashed_vert:dv,linedashed_frag:fv,meshbasic_vert:pv,meshbasic_frag:mv,meshlambert_vert:gv,meshlambert_frag:_v,meshmatcap_vert:xv,meshmatcap_frag:vv,meshnormal_vert:yv,meshnormal_frag:Mv,meshphong_vert:Sv,meshphong_frag:bv,meshphysical_vert:Ev,meshphysical_frag:Tv,meshtoon_vert:wv,meshtoon_frag:Av,points_vert:Rv,points_frag:Cv,shadow_vert:Pv,shadow_frag:Lv,sprite_vert:Iv,sprite_frag:Dv},fe={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},ri={basic:{uniforms:vn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:st.meshbasic_vert,fragmentShader:st.meshbasic_frag},lambert:{uniforms:vn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ke(0)}}]),vertexShader:st.meshlambert_vert,fragmentShader:st.meshlambert_frag},phong:{uniforms:vn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30}}]),vertexShader:st.meshphong_vert,fragmentShader:st.meshphong_frag},standard:{uniforms:vn([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag},toon:{uniforms:vn([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new ke(0)}}]),vertexShader:st.meshtoon_vert,fragmentShader:st.meshtoon_frag},matcap:{uniforms:vn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:st.meshmatcap_vert,fragmentShader:st.meshmatcap_frag},points:{uniforms:vn([fe.points,fe.fog]),vertexShader:st.points_vert,fragmentShader:st.points_frag},dashed:{uniforms:vn([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:st.linedashed_vert,fragmentShader:st.linedashed_frag},depth:{uniforms:vn([fe.common,fe.displacementmap]),vertexShader:st.depth_vert,fragmentShader:st.depth_frag},normal:{uniforms:vn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:st.meshnormal_vert,fragmentShader:st.meshnormal_frag},sprite:{uniforms:vn([fe.sprite,fe.fog]),vertexShader:st.sprite_vert,fragmentShader:st.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:st.background_vert,fragmentShader:st.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:st.backgroundCube_vert,fragmentShader:st.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:st.cube_vert,fragmentShader:st.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:st.equirect_vert,fragmentShader:st.equirect_frag},distanceRGBA:{uniforms:vn([fe.common,fe.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:st.distanceRGBA_vert,fragmentShader:st.distanceRGBA_frag},shadow:{uniforms:vn([fe.lights,fe.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:st.shadow_vert,fragmentShader:st.shadow_frag}};ri.physical={uniforms:vn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:st.meshphysical_vert,fragmentShader:st.meshphysical_frag};const no={r:0,b:0,g:0},ns=new oi,Nv=new $e;function Uv(i,e,t,n,s,r,a){const o=new ke(0);let c=r===!0?0:1,l,u,h=null,d=0,f=null;function m(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const P=m(v);P===null?p(o,c):P&&P.isColor&&(p(P,1),x=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(v,x){const P=m(x);P&&(P.isCubeTexture||P.mapping===zo)?(u===void 0&&(u=new je(new Wn(1,1,1),new Xi({name:"BackgroundCubeMaterial",uniforms:mr(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ns.copy(x.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),u.material.uniforms.envMap.value=P,u.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Nv.makeRotationFromEuler(ns)),u.material.toneMapped=lt.getTransfer(P.colorSpace)!==At,(h!==P||d!==P.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=P,d=P.version,f=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new je(new nn(2,2),new Xi({name:"BackgroundMaterial",uniforms:mr(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=lt.getTransfer(P.colorSpace)!==At,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(h!==P||d!==P.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=P,d=P.version,f=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,x){v.getRGB(no,Bf(i)),n.buffers.color.setClear(no.r,no.g,no.b,x,a)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,x=1){o.set(v),c=x,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,p(o,c)},render:_,addToRenderList:g,dispose:M}}function Ov(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(S,I,X,k,q){let B=!1;const V=h(k,X,I);r!==V&&(r=V,l(r.object)),B=f(S,k,X,q),B&&m(S,k,X,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(B||a)&&(a=!1,x(S,I,X,k),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function h(S,I,X){const k=X.wireframe===!0;let q=n[S.id];q===void 0&&(q={},n[S.id]=q);let B=q[I.id];B===void 0&&(B={},q[I.id]=B);let V=B[k];return V===void 0&&(V=d(c()),B[k]=V),V}function d(S){const I=[],X=[],k=[];for(let q=0;q<t;q++)I[q]=0,X[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:k,object:S,attributes:{},index:null}}function f(S,I,X,k){const q=r.attributes,B=I.attributes;let V=0;const K=X.getAttributes();for(const W in K)if(K[W].location>=0){const me=q[W];let Te=B[W];if(Te===void 0&&(W==="instanceMatrix"&&S.instanceMatrix&&(Te=S.instanceMatrix),W==="instanceColor"&&S.instanceColor&&(Te=S.instanceColor)),me===void 0||me.attribute!==Te||Te&&me.data!==Te.data)return!0;V++}return r.attributesNum!==V||r.index!==k}function m(S,I,X,k){const q={},B=I.attributes;let V=0;const K=X.getAttributes();for(const W in K)if(K[W].location>=0){let me=B[W];me===void 0&&(W==="instanceMatrix"&&S.instanceMatrix&&(me=S.instanceMatrix),W==="instanceColor"&&S.instanceColor&&(me=S.instanceColor));const Te={};Te.attribute=me,me&&me.data&&(Te.data=me.data),q[W]=Te,V++}r.attributes=q,r.attributesNum=V,r.index=k}function _(){const S=r.newAttributes;for(let I=0,X=S.length;I<X;I++)S[I]=0}function g(S){p(S,0)}function p(S,I){const X=r.newAttributes,k=r.enabledAttributes,q=r.attributeDivisors;X[S]=1,k[S]===0&&(i.enableVertexAttribArray(S),k[S]=1),q[S]!==I&&(i.vertexAttribDivisor(S,I),q[S]=I)}function M(){const S=r.newAttributes,I=r.enabledAttributes;for(let X=0,k=I.length;X<k;X++)I[X]!==S[X]&&(i.disableVertexAttribArray(X),I[X]=0)}function v(S,I,X,k,q,B,V){V===!0?i.vertexAttribIPointer(S,I,X,q,B):i.vertexAttribPointer(S,I,X,k,q,B)}function x(S,I,X,k){_();const q=k.attributes,B=X.getAttributes(),V=I.defaultAttributeValues;for(const K in B){const W=B[K];if(W.location>=0){let ue=q[K];if(ue===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(ue=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(ue=S.instanceColor)),ue!==void 0){const me=ue.normalized,Te=ue.itemSize,Be=e.get(ue);if(Be===void 0)continue;const vt=Be.buffer,J=Be.type,he=Be.bytesPerElement,Ie=J===i.INT||J===i.UNSIGNED_INT||ue.gpuType===_u;if(ue.isInterleavedBufferAttribute){const de=ue.data,Fe=de.stride,ht=ue.offset;if(de.isInstancedInterleavedBuffer){for(let Oe=0;Oe<W.locationSize;Oe++)p(W.location+Oe,de.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Oe=0;Oe<W.locationSize;Oe++)g(W.location+Oe);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let Oe=0;Oe<W.locationSize;Oe++)v(W.location+Oe,Te/W.locationSize,J,me,Fe*he,(ht+Te/W.locationSize*Oe)*he,Ie)}else{if(ue.isInstancedBufferAttribute){for(let de=0;de<W.locationSize;de++)p(W.location+de,ue.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let de=0;de<W.locationSize;de++)g(W.location+de);i.bindBuffer(i.ARRAY_BUFFER,vt);for(let de=0;de<W.locationSize;de++)v(W.location+de,Te/W.locationSize,J,me,Te*he,Te/W.locationSize*de*he,Ie)}}else if(V!==void 0){const me=V[K];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(W.location,me);break;case 3:i.vertexAttrib3fv(W.location,me);break;case 4:i.vertexAttrib4fv(W.location,me);break;default:i.vertexAttrib1fv(W.location,me)}}}}M()}function P(){L();for(const S in n){const I=n[S];for(const X in I){const k=I[X];for(const q in k)u(k[q].object),delete k[q];delete I[X]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;const I=n[S.id];for(const X in I){const k=I[X];for(const q in k)u(k[q].object),delete k[q];delete I[X]}delete n[S.id]}function C(S){for(const I in n){const X=n[I];if(X[S.id]===void 0)continue;const k=X[S.id];for(const q in k)u(k[q].object),delete k[q];delete X[S.id]}}function L(){E(),a=!0,r!==s&&(r=s,l(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:E,dispose:P,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:g,disableUnusedAttributes:M}}function Fv(i,e,t){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function a(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),t.update(u,n,h))}function o(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let f=0;for(let m=0;m<h;m++)f+=u[m];t.update(f,n,1)}function c(l,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],u[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_]*d[_];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function kv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==Hn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const L=C===va&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==wi&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Qn&&!L)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=m>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:P,maxSamples:A}}function Bv(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new ls,o=new et,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const m=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,p=i.get(h);if(!s||m===null||m.length===0||r&&!g)r?u(null):l();else{const M=r?0:n,v=M*4;let x=p.clippingState||null;c.value=x,x=u(m,d,v,f);for(let P=0;P!==v;++P)x[P]=t[P];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,m){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=c.value,m!==!0||g===null){const p=f+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let v=0,x=f;v!==_;++v,x+=4)a.copy(h[v]).applyMatrix4(M,o),a.normal.toArray(g,x),g[x+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function zv(i){let e=new WeakMap;function t(a,o){return o===vl?a.mapping=ur:o===yl&&(a.mapping=hr),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===vl||o===yl)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new L0(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const tr=4,hd=[.125,.215,.35,.446,.526,.582],ps=20,Oc=new ku,dd=new ke;let Fc=null,kc=0,Bc=0,zc=!1;const us=(1+Math.sqrt(5))/2,Vs=1/us,fd=[new T(-us,Vs,0),new T(us,Vs,0),new T(-Vs,0,us),new T(Vs,0,us),new T(0,us,-Vs),new T(0,us,Vs),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)],Hv=new T;class pd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Hv}=r;Fc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Bc=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_d(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Fc,kc,Bc),this._renderer.xr.enabled=zc,e.scissorTest=!1,io(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ur||e.mapping===hr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fc=this._renderer.getRenderTarget(),kc=this._renderer.getActiveCubeFace(),Bc=this._renderer.getActiveMipmapLevel(),zc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dn,minFilter:Dn,generateMipmaps:!1,type:va,format:Hn,colorSpace:gn,depthBuffer:!1},s=md(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=md(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Vv(r)),this._blurMaterial=Gv(r,e,t)}return s}_compileMaterial(e){const t=new je(this._lodPlanes[0],e);this._renderer.compile(t,Oc)}_sceneToCubeUV(e,t,n,s,r){const c=new mn(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(dd),h.toneMapping=Gi,h.autoClear=!1;const m=new Yt({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),_=new je(new Wn,m);let g=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,g=!0):(m.color.copy(dd),g=!0);for(let M=0;M<6;M++){const v=M%3;v===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[M],r.y,r.z)):v===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[M]));const x=this._cubeSize;io(s,v*x,M>2?x:0,x,x),h.setRenderTarget(s),g&&h.render(_,c),h.render(e,c)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ur||e.mapping===hr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_d()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new je(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;io(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Oc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=fd[(s-r-1)%fd.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new je(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ps-1),_=r/m,g=isFinite(r)?1+Math.floor(u*_):ps;g>ps&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ps}`);const p=[];let M=0;for(let C=0;C<ps;++C){const L=C/_,E=Math.exp(-L*L/2);p.push(E),C===0?M+=E:C<g&&(M+=2*E)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:v}=this;d.dTheta.value=m,d.mipInt.value=v-n;const x=this._sizeLods[s],P=3*x*(s>v-tr?s-v+tr:0),A=4*(this._cubeSize-x);io(t,P,A,3*x,2*x),c.setRenderTarget(t),c.render(h,Oc)}}function Vv(i){const e=[],t=[],n=[];let s=i;const r=i-tr+1+hd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-tr?c=hd[a-i+tr-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,_=3,g=2,p=1,M=new Float32Array(_*m*f),v=new Float32Array(g*m*f),x=new Float32Array(p*m*f);for(let A=0;A<f;A++){const C=A%3*2/3-1,L=A>2?0:-1,E=[C,L,0,C+2/3,L,0,C+2/3,L+1,0,C,L,0,C+2/3,L+1,0,C,L+1,0];M.set(E,_*m*A),v.set(d,g*m*A);const S=[A,A,A,A,A,A];x.set(S,p*m*A)}const P=new Vt;P.setAttribute("position",new Jt(M,_)),P.setAttribute("uv",new Jt(v,g)),P.setAttribute("faceIndex",new Jt(x,p)),e.push(P),s>tr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function md(i,e,t){const n=new xs(i,e,t);return n.texture.mapping=zo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function io(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Gv(i,e,t){const n=new Float32Array(ps),s=new T(0,1,0);return new Xi({name:"SphericalGaussianBlur",defines:{n:ps,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function gd(){return new Xi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function _d(){return new Xi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vi,depthTest:!1,depthWrite:!1})}function Vu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wv(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===vl||c===yl,u=c===ur||c===hr;if(l||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new pd(i)),h=l?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const f=o.image;return l&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new pd(i)),h=l?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Xv(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&cs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function qv(i,e,t,n){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],i.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,m=h.attributes.position;let _=0;if(f!==null){const M=f.array;_=f.version;for(let v=0,x=M.length;v<x;v+=3){const P=M[v+0],A=M[v+1],C=M[v+2];d.push(P,A,A,C,C,P)}}else if(m!==void 0){const M=m.array;_=m.version;for(let v=0,x=M.length/3-1;v<x;v+=3){const P=v+0,A=v+1,C=v+2;d.push(P,A,A,C,C,P)}}else return;const g=new(Nf(d)?kf:Ff)(d,1);g.version=_;const p=r.get(h);p&&e.remove(p),r.set(h,g)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return r.get(h)}return{get:o,update:c,getWireframeAttribute:u}}function Yv(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*a,m),t.update(f,n,m))}function u(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function h(d,f,m,_){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,m);let p=0;for(let M=0;M<m;M++)p+=f[M]*_[M];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Kv(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function jv(i,e,t){const n=new WeakMap,s=new xt;function r(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let S=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var f=S;d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let x=0;m===!0&&(x=1),_===!0&&(x=2),g===!0&&(x=3);let P=o.attributes.position.count*x,A=1;P>e.maxTextureSize&&(A=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const C=new Float32Array(P*A*4*h),L=new Uf(C,P,A,h);L.type=Qn,L.needsUpdate=!0;const E=x*4;for(let I=0;I<h;I++){const X=p[I],k=M[I],q=v[I],B=P*A*4*I;for(let V=0;V<X.count;V++){const K=V*E;m===!0&&(s.fromBufferAttribute(X,V),C[B+K+0]=s.x,C[B+K+1]=s.y,C[B+K+2]=s.z,C[B+K+3]=0),_===!0&&(s.fromBufferAttribute(k,V),C[B+K+4]=s.x,C[B+K+5]=s.y,C[B+K+6]=s.z,C[B+K+7]=0),g===!0&&(s.fromBufferAttribute(q,V),C[B+K+8]=s.x,C[B+K+9]=s.y,C[B+K+10]=s.z,C[B+K+11]=q.itemSize===4?s.w:1)}}d={count:h,texture:L,size:new oe(P,A)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let m=0;for(let g=0;g<l.length;g++)m+=l[g];const _=o.morphTargetsRelative?1:1-m;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Zv(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,h=e.get(c,u);if(s.get(h)!==l&&(e.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const hp=new Zt,xd=new jf(1,1),dp=new Uf,fp=new p0,pp=new Hf,vd=[],yd=[],Md=new Float32Array(16),Sd=new Float32Array(9),bd=new Float32Array(4);function Rr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=vd[s];if(r===void 0&&(r=new Float32Array(s),vd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function $t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Qt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function qo(i,e){let t=yd[e];t===void 0&&(t=new Int32Array(e),yd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Jv(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function $v(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2fv(this.addr,e),Qt(t,e)}}function Qv(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;i.uniform3fv(this.addr,e),Qt(t,e)}}function ey(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4fv(this.addr,e),Qt(t,e)}}function ty(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;bd.set(n),i.uniformMatrix2fv(this.addr,!1,bd),Qt(t,n)}}function ny(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;Sd.set(n),i.uniformMatrix3fv(this.addr,!1,Sd),Qt(t,n)}}function iy(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Qt(t,e)}else{if($t(t,n))return;Md.set(n),i.uniformMatrix4fv(this.addr,!1,Md),Qt(t,n)}}function sy(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ry(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2iv(this.addr,e),Qt(t,e)}}function ay(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3iv(this.addr,e),Qt(t,e)}}function oy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4iv(this.addr,e),Qt(t,e)}}function cy(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ly(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2uiv(this.addr,e),Qt(t,e)}}function uy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3uiv(this.addr,e),Qt(t,e)}}function hy(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4uiv(this.addr,e),Qt(t,e)}}function dy(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(xd.compareFunction=Df,r=xd):r=hp,t.setTexture2D(e||r,s)}function fy(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||fp,s)}function py(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||pp,s)}function my(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||dp,s)}function gy(i){switch(i){case 5126:return Jv;case 35664:return $v;case 35665:return Qv;case 35666:return ey;case 35674:return ty;case 35675:return ny;case 35676:return iy;case 5124:case 35670:return sy;case 35667:case 35671:return ry;case 35668:case 35672:return ay;case 35669:case 35673:return oy;case 5125:return cy;case 36294:return ly;case 36295:return uy;case 36296:return hy;case 35678:case 36198:case 36298:case 36306:case 35682:return dy;case 35679:case 36299:case 36307:return fy;case 35680:case 36300:case 36308:case 36293:return py;case 36289:case 36303:case 36311:case 36292:return my}}function _y(i,e){i.uniform1fv(this.addr,e)}function xy(i,e){const t=Rr(e,this.size,2);i.uniform2fv(this.addr,t)}function vy(i,e){const t=Rr(e,this.size,3);i.uniform3fv(this.addr,t)}function yy(i,e){const t=Rr(e,this.size,4);i.uniform4fv(this.addr,t)}function My(i,e){const t=Rr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Sy(i,e){const t=Rr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function by(i,e){const t=Rr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ey(i,e){i.uniform1iv(this.addr,e)}function Ty(i,e){i.uniform2iv(this.addr,e)}function wy(i,e){i.uniform3iv(this.addr,e)}function Ay(i,e){i.uniform4iv(this.addr,e)}function Ry(i,e){i.uniform1uiv(this.addr,e)}function Cy(i,e){i.uniform2uiv(this.addr,e)}function Py(i,e){i.uniform3uiv(this.addr,e)}function Ly(i,e){i.uniform4uiv(this.addr,e)}function Iy(i,e,t){const n=this.cache,s=e.length,r=qo(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||hp,r[a])}function Dy(i,e,t){const n=this.cache,s=e.length,r=qo(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||fp,r[a])}function Ny(i,e,t){const n=this.cache,s=e.length,r=qo(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||pp,r[a])}function Uy(i,e,t){const n=this.cache,s=e.length,r=qo(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Qt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||dp,r[a])}function Oy(i){switch(i){case 5126:return _y;case 35664:return xy;case 35665:return vy;case 35666:return yy;case 35674:return My;case 35675:return Sy;case 35676:return by;case 5124:case 35670:return Ey;case 35667:case 35671:return Ty;case 35668:case 35672:return wy;case 35669:case 35673:return Ay;case 5125:return Ry;case 36294:return Cy;case 36295:return Py;case 36296:return Ly;case 35678:case 36198:case 36298:case 36306:case 35682:return Iy;case 35679:case 36299:case 36307:return Dy;case 35680:case 36300:case 36308:case 36293:return Ny;case 36289:case 36303:case 36311:case 36292:return Uy}}class Fy{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gy(t.type)}}class ky{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Oy(t.type)}}class By{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Hc=/(\w+)(\])?(\[|\.)?/g;function Ed(i,e){i.seq.push(e),i.map[e.id]=e}function zy(i,e,t){const n=i.name,s=n.length;for(Hc.lastIndex=0;;){const r=Hc.exec(n),a=Hc.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Ed(t,l===void 0?new Fy(o,i,e):new ky(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new By(o),Ed(t,h)),t=h}}}class bo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);zy(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Td(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Hy=37297;let Vy=0;function Gy(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const wd=new et;function Wy(i){lt._getMatrix(wd,lt.workingColorSpace,i);const e=`mat3( ${wd.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case Ro:return[e,"LinearTransferOETF"];case At:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ad(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Gy(i.getShaderSource(e),a)}else return s}function Xy(i,e){const t=Wy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qy(i,e){let t;switch(e){case ym:t="Linear";break;case Mm:t="Reinhard";break;case Sm:t="Cineon";break;case bm:t="ACESFilmic";break;case Tm:t="AgX";break;case wm:t="Neutral";break;case Em:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const so=new T;function Yy(){lt.getLuminanceCoefficients(so);const i=so.x.toFixed(4),e=so.y.toFixed(4),t=so.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ky(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Wr).join(`
`)}function jy(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Zy(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Wr(i){return i!==""}function Rd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Cd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Jy=/^[ \t]*#include +<([\w\d./]+)>/gm;function tu(i){return i.replace(Jy,Qy)}const $y=new Map;function Qy(i,e){let t=st[e];if(t===void 0){const n=$y.get(e);if(n!==void 0)t=st[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return tu(t)}const e1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pd(i){return i.replace(e1,t1)}function t1(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ld(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function n1(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===gf?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===_f?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function i1(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ur:case hr:e="ENVMAP_TYPE_CUBE";break;case zo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function s1(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case hr:e="ENVMAP_MODE_REFRACTION";break}return e}function r1(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case xf:e="ENVMAP_BLENDING_MULTIPLY";break;case xm:e="ENVMAP_BLENDING_MIX";break;case vm:e="ENVMAP_BLENDING_ADD";break}return e}function a1(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function o1(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=n1(t),l=i1(t),u=s1(t),h=r1(t),d=a1(t),f=Ky(t),m=jy(r),_=s.createProgram();let g,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Wr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Wr).join(`
`),p.length>0&&(p+=`
`)):(g=[Ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Wr).join(`
`),p=[Ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gi?"#define TONE_MAPPING":"",t.toneMapping!==Gi?st.tonemapping_pars_fragment:"",t.toneMapping!==Gi?qy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",st.colorspace_pars_fragment,Xy("linearToOutputTexel",t.outputColorSpace),Yy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Wr).join(`
`)),a=tu(a),a=Rd(a,t),a=Cd(a,t),o=tu(o),o=Rd(o,t),o=Cd(o,t),a=Pd(a),o=Pd(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===xh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=M+g+a,x=M+p+o,P=Td(s,s.VERTEX_SHADER,v),A=Td(s,s.FRAGMENT_SHADER,x);s.attachShader(_,P),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(I){if(i.debug.checkShaderErrors){const X=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(P).trim(),q=s.getShaderInfoLog(A).trim();let B=!0,V=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,P,A);else{const K=Ad(s,P,"vertex"),W=Ad(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+X+`
`+K+`
`+W)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(k===""||q==="")&&(V=!1);V&&(I.diagnostics={runnable:B,programLog:X,vertexShader:{log:k,prefix:g},fragmentShader:{log:q,prefix:p}})}s.deleteShader(P),s.deleteShader(A),L=new bo(s,_),E=Zy(s,_)}let L;this.getUniforms=function(){return L===void 0&&C(this),L};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,Hy)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Vy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=A,this}let c1=0;class l1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new u1(e),t.set(e,n)),n}}class u1{constructor(e){this.id=c1++,this.code=e,this.usedTimes=0}}function h1(i,e,t,n,s,r,a){const o=new Au,c=new l1,l=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return l.add(E),E===0?"uv":`uv${E}`}function g(E,S,I,X,k){const q=X.fog,B=k.geometry,V=E.isMeshStandardMaterial?X.environment:null,K=(E.isMeshStandardMaterial?t:e).get(E.envMap||V),W=K&&K.mapping===zo?K.image.height:null,ue=m[E.type];E.precision!==null&&(f=s.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const me=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Te=me!==void 0?me.length:0;let Be=0;B.morphAttributes.position!==void 0&&(Be=1),B.morphAttributes.normal!==void 0&&(Be=2),B.morphAttributes.color!==void 0&&(Be=3);let vt,J,he,Ie;if(ue){const Et=ri[ue];vt=Et.vertexShader,J=Et.fragmentShader}else vt=E.vertexShader,J=E.fragmentShader,c.update(E),he=c.getVertexShaderID(E),Ie=c.getFragmentShaderID(E);const de=i.getRenderTarget(),Fe=i.state.buffers.depth.getReversed(),ht=k.isInstancedMesh===!0,Oe=k.isBatchedMesh===!0,gt=!!E.map,ne=!!E.matcap,te=!!K,R=!!E.aoMap,Ue=!!E.lightMap,ie=!!E.bumpMap,Ae=!!E.normalMap,le=!!E.displacementMap,Xe=!!E.emissiveMap,Me=!!E.metalnessMap,w=!!E.roughnessMap,y=E.anisotropy>0,F=E.clearcoat>0,j=E.dispersion>0,ee=E.iridescence>0,Z=E.sheen>0,Ne=E.transmission>0,_e=y&&!!E.anisotropyMap,we=F&&!!E.clearcoatMap,ct=F&&!!E.clearcoatNormalMap,re=F&&!!E.clearcoatRoughnessMap,Ce=ee&&!!E.iridescenceMap,qe=ee&&!!E.iridescenceThicknessMap,Ye=Z&&!!E.sheenColorMap,Pe=Z&&!!E.sheenRoughnessMap,ut=!!E.specularMap,it=!!E.specularColorMap,Lt=!!E.specularIntensityMap,D=Ne&&!!E.transmissionMap,ve=Ne&&!!E.thicknessMap,Y=!!E.gradientMap,Q=!!E.alphaMap,be=E.alphaTest>0,Se=!!E.alphaHash,Qe=!!E.extensions;let Ot=Gi;E.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Ot=i.toneMapping);const un={shaderID:ue,shaderType:E.type,shaderName:E.name,vertexShader:vt,fragmentShader:J,defines:E.defines,customVertexShaderID:he,customFragmentShaderID:Ie,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Oe,batchingColor:Oe&&k._colorsTexture!==null,instancing:ht,instancingColor:ht&&k.instanceColor!==null,instancingMorph:ht&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:de===null?i.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:gn,alphaToCoverage:!!E.alphaToCoverage,map:gt,matcap:ne,envMap:te,envMapMode:te&&K.mapping,envMapCubeUVHeight:W,aoMap:R,lightMap:Ue,bumpMap:ie,normalMap:Ae,displacementMap:d&&le,emissiveMap:Xe,normalMapObjectSpace:Ae&&E.normalMapType===Nm,normalMapTangentSpace:Ae&&E.normalMapType===If,metalnessMap:Me,roughnessMap:w,anisotropy:y,anisotropyMap:_e,clearcoat:F,clearcoatMap:we,clearcoatNormalMap:ct,clearcoatRoughnessMap:re,dispersion:j,iridescence:ee,iridescenceMap:Ce,iridescenceThicknessMap:qe,sheen:Z,sheenColorMap:Ye,sheenRoughnessMap:Pe,specularMap:ut,specularColorMap:it,specularIntensityMap:Lt,transmission:Ne,transmissionMap:D,thicknessMap:ve,gradientMap:Y,opaque:E.transparent===!1&&E.blending===nr&&E.alphaToCoverage===!1,alphaMap:Q,alphaTest:be,alphaHash:Se,combine:E.combine,mapUv:gt&&_(E.map.channel),aoMapUv:R&&_(E.aoMap.channel),lightMapUv:Ue&&_(E.lightMap.channel),bumpMapUv:ie&&_(E.bumpMap.channel),normalMapUv:Ae&&_(E.normalMap.channel),displacementMapUv:le&&_(E.displacementMap.channel),emissiveMapUv:Xe&&_(E.emissiveMap.channel),metalnessMapUv:Me&&_(E.metalnessMap.channel),roughnessMapUv:w&&_(E.roughnessMap.channel),anisotropyMapUv:_e&&_(E.anisotropyMap.channel),clearcoatMapUv:we&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:ct&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ye&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&_(E.sheenRoughnessMap.channel),specularMapUv:ut&&_(E.specularMap.channel),specularColorMapUv:it&&_(E.specularColorMap.channel),specularIntensityMapUv:Lt&&_(E.specularIntensityMap.channel),transmissionMapUv:D&&_(E.transmissionMap.channel),thicknessMapUv:ve&&_(E.thicknessMap.channel),alphaMapUv:Q&&_(E.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(Ae||y),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!B.attributes.uv&&(gt||Q),fog:!!q,useFog:E.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Fe,skinning:k.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:Be,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ot,decodeVideoTexture:gt&&E.map.isVideoTexture===!0&&lt.getTransfer(E.map.colorSpace)===At,decodeVideoTextureEmissive:Xe&&E.emissiveMap.isVideoTexture===!0&&lt.getTransfer(E.emissiveMap.colorSpace)===At,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===jt,flipSided:E.side===Rn,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Qe&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qe&&E.extensions.multiDraw===!0||Oe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return un.vertexUv1s=l.has(1),un.vertexUv2s=l.has(2),un.vertexUv3s=l.has(3),l.clear(),un}function p(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const I in E.defines)S.push(I),S.push(E.defines[I]);return E.isRawShaderMaterial===!1&&(M(S,E),v(S,E),S.push(i.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function M(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function v(E,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),E.push(o.mask)}function x(E){const S=m[E.type];let I;if(S){const X=ri[S];I=A0.clone(X.uniforms)}else I=E.uniforms;return I}function P(E,S){let I;for(let X=0,k=u.length;X<k;X++){const q=u[X];if(q.cacheKey===S){I=q,++I.usedTimes;break}}return I===void 0&&(I=new o1(i,S,E,r),u.push(I)),I}function A(E){if(--E.usedTimes===0){const S=u.indexOf(E);u[S]=u[u.length-1],u.pop(),E.destroy()}}function C(E){c.remove(E)}function L(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:P,releaseProgram:A,releaseShaderCache:C,programs:u,dispose:L}}function d1(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function f1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Id(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Dd(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h,d,f,m,_,g){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:m,renderOrder:h.renderOrder,z:_,group:g},i[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=h.renderOrder,p.z=_,p.group=g),e++,p}function o(h,d,f,m,_,g){const p=a(h,d,f,m,_,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(h,d,f,m,_,g){const p=a(h,d,f,m,_,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(h,d){t.length>1&&t.sort(h||f1),n.length>1&&n.sort(d||Id),s.length>1&&s.sort(d||Id)}function u(){for(let h=e,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:u,sort:l}}function p1(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Dd,i.set(n,[a])):s>=r.length?(a=new Dd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function m1(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new T,color:new ke};break;case"SpotLight":t={position:new T,direction:new T,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new T,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new T,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new T,halfWidth:new T,halfHeight:new T};break}return i[e.id]=t,t}}}function g1(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let _1=0;function x1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function v1(i){const e=new m1,t=g1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new T);const s=new T,r=new $e,a=new $e;function o(l){let u=0,h=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,M=0,v=0,x=0,P=0,A=0,C=0;l.sort(x1);for(let E=0,S=l.length;E<S;E++){const I=l[E],X=I.color,k=I.intensity,q=I.distance,B=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=X.r*k,h+=X.g*k,d+=X.b*k;else if(I.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(I.sh.coefficients[V],k);C++}else if(I.isDirectionalLight){const V=e.get(I);if(V.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const K=I.shadow,W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=B,n.directionalShadowMatrix[f]=I.shadow.matrix,M++}n.directional[f]=V,f++}else if(I.isSpotLight){const V=e.get(I);V.position.setFromMatrixPosition(I.matrixWorld),V.color.copy(X).multiplyScalar(k),V.distance=q,V.coneCos=Math.cos(I.angle),V.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),V.decay=I.decay,n.spot[_]=V;const K=I.shadow;if(I.map&&(n.spotLightMap[P]=I.map,P++,K.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=K.matrix,I.castShadow){const W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=B,x++}_++}else if(I.isRectAreaLight){const V=e.get(I);V.color.copy(X).multiplyScalar(k),V.halfWidth.set(I.width*.5,0,0),V.halfHeight.set(0,I.height*.5,0),n.rectArea[g]=V,g++}else if(I.isPointLight){const V=e.get(I);if(V.color.copy(I.color).multiplyScalar(I.intensity),V.distance=I.distance,V.decay=I.decay,I.castShadow){const K=I.shadow,W=t.get(I);W.shadowIntensity=K.intensity,W.shadowBias=K.bias,W.shadowNormalBias=K.normalBias,W.shadowRadius=K.radius,W.shadowMapSize=K.mapSize,W.shadowCameraNear=K.camera.near,W.shadowCameraFar=K.camera.far,n.pointShadow[m]=W,n.pointShadowMap[m]=B,n.pointShadowMatrix[m]=I.shadow.matrix,v++}n.point[m]=V,m++}else if(I.isHemisphereLight){const V=e.get(I);V.skyColor.copy(I.color).multiplyScalar(k),V.groundColor.copy(I.groundColor).multiplyScalar(k),n.hemi[p]=V,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==f||L.pointLength!==m||L.spotLength!==_||L.rectAreaLength!==g||L.hemiLength!==p||L.numDirectionalShadows!==M||L.numPointShadows!==v||L.numSpotShadows!==x||L.numSpotMaps!==P||L.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+P-A,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=C,L.directionalLength=f,L.pointLength=m,L.spotLength=_,L.rectAreaLength=g,L.hemiLength=p,L.numDirectionalShadows=M,L.numPointShadows=v,L.numSpotShadows=x,L.numSpotMaps=P,L.numLightProbes=C,n.version=_1++)}function c(l,u){let h=0,d=0,f=0,m=0,_=0;const g=u.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){const v=l[p];if(v.isDirectionalLight){const x=n.directional[h];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),h++}else if(v.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(v.isRectAreaLight){const x=n.rectArea[m];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),a.identity(),r.copy(v.matrixWorld),r.premultiply(g),a.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),m++}else if(v.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(g),d++}else if(v.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:o,setupView:c,state:n}}function Nd(i){const e=new v1(i),t=[],n=[];function s(u){l.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function y1(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Nd(i),e.set(s,[o])):r>=a.length?(o=new Nd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const M1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,S1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function b1(i,e,t){let n=new Pu;const s=new oe,r=new oe,a=new xt,o=new vg({depthPacking:Dm}),c=new yg,l={},u=t.maxTextureSize,h={[ai]:Rn,[Rn]:ai,[jt]:jt},d=new Xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:M1,fragmentShader:S1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new Vt;m.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new je(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gf;let p=this.type;this.render=function(A,C,L){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const E=i.getRenderTarget(),S=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),X=i.state;X.setBlending(Vi),X.buffers.color.setClear(1,1,1,1),X.buffers.depth.setTest(!0),X.setScissorTest(!1);const k=p!==yi&&this.type===yi,q=p===yi&&this.type!==yi;for(let B=0,V=A.length;B<V;B++){const K=A[B],W=K.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const ue=W.getFrameExtents();if(s.multiply(ue),r.copy(W.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ue.x),s.x=r.x*ue.x,W.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ue.y),s.y=r.y*ue.y,W.mapSize.y=r.y)),W.map===null||k===!0||q===!0){const Te=this.type!==yi?{minFilter:Mn,magFilter:Mn}:{};W.map!==null&&W.map.dispose(),W.map=new xs(s.x,s.y,Te),W.map.texture.name=K.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const me=W.getViewportCount();for(let Te=0;Te<me;Te++){const Be=W.getViewport(Te);a.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),X.viewport(a),W.updateMatrices(K,Te),n=W.getFrustum(),x(C,L,W.camera,K,this.type)}W.isPointLightShadow!==!0&&this.type===yi&&M(W,L),W.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(E,S,I)};function M(A,C){const L=e.update(_);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new xs(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(C,null,L,d,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(C,null,L,f,_,null)}function v(A,C,L,E){let S=null;const I=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)S=I;else if(S=L.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const X=S.uuid,k=C.uuid;let q=l[X];q===void 0&&(q={},l[X]=q);let B=q[k];B===void 0&&(B=S.clone(),q[k]=B,C.addEventListener("dispose",P)),S=B}if(S.visible=C.visible,S.wireframe=C.wireframe,E===yi?S.side=C.shadowSide!==null?C.shadowSide:C.side:S.side=C.shadowSide!==null?C.shadowSide:h[C.side],S.alphaMap=C.alphaMap,S.alphaTest=C.alphaTest,S.map=C.map,S.clipShadows=C.clipShadows,S.clippingPlanes=C.clippingPlanes,S.clipIntersection=C.clipIntersection,S.displacementMap=C.displacementMap,S.displacementScale=C.displacementScale,S.displacementBias=C.displacementBias,S.wireframeLinewidth=C.wireframeLinewidth,S.linewidth=C.linewidth,L.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const X=i.properties.get(S);X.light=L}return S}function x(A,C,L,E,S){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===yi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const k=e.update(A),q=A.material;if(Array.isArray(q)){const B=k.groups;for(let V=0,K=B.length;V<K;V++){const W=B[V],ue=q[W.materialIndex];if(ue&&ue.visible){const me=v(A,ue,E,S);A.onBeforeShadow(i,A,C,L,k,me,W),i.renderBufferDirect(L,null,k,me,A,W),A.onAfterShadow(i,A,C,L,k,me,W)}}}else if(q.visible){const B=v(A,q,E,S);A.onBeforeShadow(i,A,C,L,k,B,null),i.renderBufferDirect(L,null,k,B,A,null),A.onAfterShadow(i,A,C,L,k,B,null)}}const X=A.children;for(let k=0,q=X.length;k<q;k++)x(X[k],C,L,E,S)}function P(A){A.target.removeEventListener("dispose",P);for(const L in l){const E=l[L],S=A.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}const E1={[dl]:fl,[pl]:_l,[ml]:xl,[lr]:gl,[fl]:dl,[_l]:pl,[xl]:ml,[gl]:lr};function T1(i,e){function t(){let D=!1;const ve=new xt;let Y=null;const Q=new xt(0,0,0,0);return{setMask:function(be){Y!==be&&!D&&(i.colorMask(be,be,be,be),Y=be)},setLocked:function(be){D=be},setClear:function(be,Se,Qe,Ot,un){un===!0&&(be*=Ot,Se*=Ot,Qe*=Ot),ve.set(be,Se,Qe,Ot),Q.equals(ve)===!1&&(i.clearColor(be,Se,Qe,Ot),Q.copy(ve))},reset:function(){D=!1,Y=null,Q.set(-1,0,0,0)}}}function n(){let D=!1,ve=!1,Y=null,Q=null,be=null;return{setReversed:function(Se){if(ve!==Se){const Qe=e.get("EXT_clip_control");ve?Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.ZERO_TO_ONE_EXT):Qe.clipControlEXT(Qe.LOWER_LEFT_EXT,Qe.NEGATIVE_ONE_TO_ONE_EXT);const Ot=be;be=null,this.setClear(Ot)}ve=Se},getReversed:function(){return ve},setTest:function(Se){Se?de(i.DEPTH_TEST):Fe(i.DEPTH_TEST)},setMask:function(Se){Y!==Se&&!D&&(i.depthMask(Se),Y=Se)},setFunc:function(Se){if(ve&&(Se=E1[Se]),Q!==Se){switch(Se){case dl:i.depthFunc(i.NEVER);break;case fl:i.depthFunc(i.ALWAYS);break;case pl:i.depthFunc(i.LESS);break;case lr:i.depthFunc(i.LEQUAL);break;case ml:i.depthFunc(i.EQUAL);break;case gl:i.depthFunc(i.GEQUAL);break;case _l:i.depthFunc(i.GREATER);break;case xl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Q=Se}},setLocked:function(Se){D=Se},setClear:function(Se){be!==Se&&(ve&&(Se=1-Se),i.clearDepth(Se),be=Se)},reset:function(){D=!1,Y=null,Q=null,be=null,ve=!1}}}function s(){let D=!1,ve=null,Y=null,Q=null,be=null,Se=null,Qe=null,Ot=null,un=null;return{setTest:function(Et){D||(Et?de(i.STENCIL_TEST):Fe(i.STENCIL_TEST))},setMask:function(Et){ve!==Et&&!D&&(i.stencilMask(Et),ve=Et)},setFunc:function(Et,qn,di){(Y!==Et||Q!==qn||be!==di)&&(i.stencilFunc(Et,qn,di),Y=Et,Q=qn,be=di)},setOp:function(Et,qn,di){(Se!==Et||Qe!==qn||Ot!==di)&&(i.stencilOp(Et,qn,di),Se=Et,Qe=qn,Ot=di)},setLocked:function(Et){D=Et},setClear:function(Et){un!==Et&&(i.clearStencil(Et),un=Et)},reset:function(){D=!1,ve=null,Y=null,Q=null,be=null,Se=null,Qe=null,Ot=null,un=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,M=null,v=null,x=null,P=null,A=null,C=new ke(0,0,0),L=0,E=!1,S=null,I=null,X=null,k=null,q=null;const B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,K=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(W)[1]),V=K>=1):W.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),V=K>=2);let ue=null,me={};const Te=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),vt=new xt().fromArray(Te),J=new xt().fromArray(Be);function he(D,ve,Y,Q){const be=new Uint8Array(4),Se=i.createTexture();i.bindTexture(D,Se),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Qe=0;Qe<Y;Qe++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(ve,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(ve+Qe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return Se}const Ie={};Ie[i.TEXTURE_2D]=he(i.TEXTURE_2D,i.TEXTURE_2D,1),Ie[i.TEXTURE_CUBE_MAP]=he(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ie[i.TEXTURE_2D_ARRAY]=he(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ie[i.TEXTURE_3D]=he(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),de(i.DEPTH_TEST),a.setFunc(lr),ie(!1),Ae(fh),de(i.CULL_FACE),R(Vi);function de(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function Fe(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function ht(D,ve){return h[D]!==ve?(i.bindFramebuffer(D,ve),h[D]=ve,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ve),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ve),!0):!1}function Oe(D,ve){let Y=f,Q=!1;if(D){Y=d.get(ve),Y===void 0&&(Y=[],d.set(ve,Y));const be=D.textures;if(Y.length!==be.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Se=0,Qe=be.length;Se<Qe;Se++)Y[Se]=i.COLOR_ATTACHMENT0+Se;Y.length=be.length,Q=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,Q=!0);Q&&i.drawBuffers(Y)}function gt(D){return m!==D?(i.useProgram(D),m=D,!0):!1}const ne={[fs]:i.FUNC_ADD,[tm]:i.FUNC_SUBTRACT,[nm]:i.FUNC_REVERSE_SUBTRACT};ne[im]=i.MIN,ne[sm]=i.MAX;const te={[rm]:i.ZERO,[am]:i.ONE,[om]:i.SRC_COLOR,[ul]:i.SRC_ALPHA,[fm]:i.SRC_ALPHA_SATURATE,[hm]:i.DST_COLOR,[lm]:i.DST_ALPHA,[cm]:i.ONE_MINUS_SRC_COLOR,[hl]:i.ONE_MINUS_SRC_ALPHA,[dm]:i.ONE_MINUS_DST_COLOR,[um]:i.ONE_MINUS_DST_ALPHA,[pm]:i.CONSTANT_COLOR,[mm]:i.ONE_MINUS_CONSTANT_COLOR,[gm]:i.CONSTANT_ALPHA,[_m]:i.ONE_MINUS_CONSTANT_ALPHA};function R(D,ve,Y,Q,be,Se,Qe,Ot,un,Et){if(D===Vi){_===!0&&(Fe(i.BLEND),_=!1);return}if(_===!1&&(de(i.BLEND),_=!0),D!==em){if(D!==g||Et!==E){if((p!==fs||x!==fs)&&(i.blendEquation(i.FUNC_ADD),p=fs,x=fs),Et)switch(D){case nr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cr:i.blendFunc(i.ONE,i.ONE);break;case ph:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cr:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ph:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}M=null,v=null,P=null,A=null,C.set(0,0,0),L=0,g=D,E=Et}return}be=be||ve,Se=Se||Y,Qe=Qe||Q,(ve!==p||be!==x)&&(i.blendEquationSeparate(ne[ve],ne[be]),p=ve,x=be),(Y!==M||Q!==v||Se!==P||Qe!==A)&&(i.blendFuncSeparate(te[Y],te[Q],te[Se],te[Qe]),M=Y,v=Q,P=Se,A=Qe),(Ot.equals(C)===!1||un!==L)&&(i.blendColor(Ot.r,Ot.g,Ot.b,un),C.copy(Ot),L=un),g=D,E=!1}function Ue(D,ve){D.side===jt?Fe(i.CULL_FACE):de(i.CULL_FACE);let Y=D.side===Rn;ve&&(Y=!Y),ie(Y),D.blending===nr&&D.transparent===!1?R(Vi):R(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const Q=D.stencilWrite;o.setTest(Q),Q&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Xe(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):Fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function ie(D){S!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),S=D)}function Ae(D){D!==$p?(de(i.CULL_FACE),D!==I&&(D===fh?i.cullFace(i.BACK):D===Qp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Fe(i.CULL_FACE),I=D}function le(D){D!==X&&(V&&i.lineWidth(D),X=D)}function Xe(D,ve,Y){D?(de(i.POLYGON_OFFSET_FILL),(k!==ve||q!==Y)&&(i.polygonOffset(ve,Y),k=ve,q=Y)):Fe(i.POLYGON_OFFSET_FILL)}function Me(D){D?de(i.SCISSOR_TEST):Fe(i.SCISSOR_TEST)}function w(D){D===void 0&&(D=i.TEXTURE0+B-1),ue!==D&&(i.activeTexture(D),ue=D)}function y(D,ve,Y){Y===void 0&&(ue===null?Y=i.TEXTURE0+B-1:Y=ue);let Q=me[Y];Q===void 0&&(Q={type:void 0,texture:void 0},me[Y]=Q),(Q.type!==D||Q.texture!==ve)&&(ue!==Y&&(i.activeTexture(Y),ue=Y),i.bindTexture(D,ve||Ie[D]),Q.type=D,Q.texture=ve)}function F(){const D=me[ue];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function j(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ne(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function we(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ct(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function re(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qe(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ye(D){vt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),vt.copy(D))}function Pe(D){J.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),J.copy(D))}function ut(D,ve){let Y=l.get(ve);Y===void 0&&(Y=new WeakMap,l.set(ve,Y));let Q=Y.get(D);Q===void 0&&(Q=i.getUniformBlockIndex(ve,D.name),Y.set(D,Q))}function it(D,ve){const Q=l.get(ve).get(D);c.get(ve)!==Q&&(i.uniformBlockBinding(ve,Q,D.__bindingPointIndex),c.set(ve,Q))}function Lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ue=null,me={},h={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,M=null,v=null,x=null,P=null,A=null,C=new ke(0,0,0),L=0,E=!1,S=null,I=null,X=null,k=null,q=null,vt.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:de,disable:Fe,bindFramebuffer:ht,drawBuffers:Oe,useProgram:gt,setBlending:R,setMaterial:Ue,setFlipSided:ie,setCullFace:Ae,setLineWidth:le,setPolygonOffset:Xe,setScissorTest:Me,activeTexture:w,bindTexture:y,unbindTexture:F,compressedTexImage2D:j,compressedTexImage3D:ee,texImage2D:Ce,texImage3D:qe,updateUBOMapping:ut,uniformBlockBinding:it,texStorage2D:ct,texStorage3D:re,texSubImage2D:Z,texSubImage3D:Ne,compressedTexSubImage2D:_e,compressedTexSubImage3D:we,scissor:Ye,viewport:Pe,reset:Lt}}function w1(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new oe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(w,y){return f?new OffscreenCanvas(w,y):oa("canvas")}function _(w,y,F){let j=1;const ee=Me(w);if((ee.width>F||ee.height>F)&&(j=F/Math.max(ee.width,ee.height)),j<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Z=Math.floor(j*ee.width),Ne=Math.floor(j*ee.height);h===void 0&&(h=m(Z,Ne));const _e=y?m(Z,Ne):h;return _e.width=Z,_e.height=Ne,_e.getContext("2d").drawImage(w,0,0,Z,Ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+Z+"x"+Ne+")."),_e}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),w;return w}function g(w){return w.generateMipmaps}function p(w){i.generateMipmap(w)}function M(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,y,F,j,ee=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=y;if(y===i.RED&&(F===i.FLOAT&&(Z=i.R32F),F===i.HALF_FLOAT&&(Z=i.R16F),F===i.UNSIGNED_BYTE&&(Z=i.R8)),y===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.R8UI),F===i.UNSIGNED_SHORT&&(Z=i.R16UI),F===i.UNSIGNED_INT&&(Z=i.R32UI),F===i.BYTE&&(Z=i.R8I),F===i.SHORT&&(Z=i.R16I),F===i.INT&&(Z=i.R32I)),y===i.RG&&(F===i.FLOAT&&(Z=i.RG32F),F===i.HALF_FLOAT&&(Z=i.RG16F),F===i.UNSIGNED_BYTE&&(Z=i.RG8)),y===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RG8UI),F===i.UNSIGNED_SHORT&&(Z=i.RG16UI),F===i.UNSIGNED_INT&&(Z=i.RG32UI),F===i.BYTE&&(Z=i.RG8I),F===i.SHORT&&(Z=i.RG16I),F===i.INT&&(Z=i.RG32I)),y===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),F===i.UNSIGNED_INT&&(Z=i.RGB32UI),F===i.BYTE&&(Z=i.RGB8I),F===i.SHORT&&(Z=i.RGB16I),F===i.INT&&(Z=i.RGB32I)),y===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),F===i.UNSIGNED_INT&&(Z=i.RGBA32UI),F===i.BYTE&&(Z=i.RGBA8I),F===i.SHORT&&(Z=i.RGBA16I),F===i.INT&&(Z=i.RGBA32I)),y===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),y===i.RGBA){const Ne=ee?Ro:lt.getTransfer(j);F===i.FLOAT&&(Z=i.RGBA32F),F===i.HALF_FLOAT&&(Z=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Z=Ne===At?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(w,y){let F;return w?y===null||y===_s||y===dr?F=i.DEPTH24_STENCIL8:y===Qn?F=i.DEPTH32F_STENCIL8:y===sa&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===_s||y===dr?F=i.DEPTH_COMPONENT24:y===Qn?F=i.DEPTH_COMPONENT32F:y===sa&&(F=i.DEPTH_COMPONENT16),F}function P(w,y){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==Mn&&w.minFilter!==Dn?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function A(w){const y=w.target;y.removeEventListener("dispose",A),L(y),y.isVideoTexture&&u.delete(y)}function C(w){const y=w.target;y.removeEventListener("dispose",C),S(y)}function L(w){const y=n.get(w);if(y.__webglInit===void 0)return;const F=w.source,j=d.get(F);if(j){const ee=j[y.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&E(w),Object.keys(j).length===0&&d.delete(F)}n.remove(w)}function E(w){const y=n.get(w);i.deleteTexture(y.__webglTexture);const F=w.source,j=d.get(F);delete j[y.__cacheKey],a.memory.textures--}function S(w){const y=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(y.__webglFramebuffer[j]))for(let ee=0;ee<y.__webglFramebuffer[j].length;ee++)i.deleteFramebuffer(y.__webglFramebuffer[j][ee]);else i.deleteFramebuffer(y.__webglFramebuffer[j]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[j])}else{if(Array.isArray(y.__webglFramebuffer))for(let j=0;j<y.__webglFramebuffer.length;j++)i.deleteFramebuffer(y.__webglFramebuffer[j]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let j=0;j<y.__webglColorRenderbuffer.length;j++)y.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[j]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const F=w.textures;for(let j=0,ee=F.length;j<ee;j++){const Z=n.get(F[j]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(F[j])}n.remove(w)}let I=0;function X(){I=0}function k(){const w=I;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),I+=1,w}function q(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function B(w,y){const F=n.get(w);if(w.isVideoTexture&&le(w),w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){const j=w.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(F,w,y);return}}t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+y)}function V(w,y){const F=n.get(w);if(w.version>0&&F.__version!==w.version){J(F,w,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+y)}function K(w,y){const F=n.get(w);if(w.version>0&&F.__version!==w.version){J(F,w,y);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+y)}function W(w,y){const F=n.get(w);if(w.version>0&&F.__version!==w.version){he(F,w,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+y)}const ue={[Wi]:i.REPEAT,[Bi]:i.CLAMP_TO_EDGE,[wo]:i.MIRRORED_REPEAT},me={[Mn]:i.NEAREST,[yf]:i.NEAREST_MIPMAP_NEAREST,[Gr]:i.NEAREST_MIPMAP_LINEAR,[Dn]:i.LINEAR,[_o]:i.LINEAR_MIPMAP_NEAREST,[Si]:i.LINEAR_MIPMAP_LINEAR},Te={[Um]:i.NEVER,[Hm]:i.ALWAYS,[Om]:i.LESS,[Df]:i.LEQUAL,[Fm]:i.EQUAL,[zm]:i.GEQUAL,[km]:i.GREATER,[Bm]:i.NOTEQUAL};function Be(w,y){if(y.type===Qn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Dn||y.magFilter===_o||y.magFilter===Gr||y.magFilter===Si||y.minFilter===Dn||y.minFilter===_o||y.minFilter===Gr||y.minFilter===Si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,ue[y.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,ue[y.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,ue[y.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,me[y.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,me[y.minFilter]),y.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,Te[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Mn||y.minFilter!==Gr&&y.minFilter!==Si||y.type===Qn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function vt(w,y){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",A));const j=y.source;let ee=d.get(j);ee===void 0&&(ee={},d.set(j,ee));const Z=q(y);if(Z!==w.__cacheKey){ee[Z]===void 0&&(ee[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),ee[Z].usedTimes++;const Ne=ee[w.__cacheKey];Ne!==void 0&&(ee[w.__cacheKey].usedTimes--,Ne.usedTimes===0&&E(y)),w.__cacheKey=Z,w.__webglTexture=ee[Z].texture}return F}function J(w,y,F){let j=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(j=i.TEXTURE_3D);const ee=vt(w,y),Z=y.source;t.bindTexture(j,w.__webglTexture,i.TEXTURE0+F);const Ne=n.get(Z);if(Z.version!==Ne.__version||ee===!0){t.activeTexture(i.TEXTURE0+F);const _e=lt.getPrimaries(lt.workingColorSpace),we=y.colorSpace===ki?null:lt.getPrimaries(y.colorSpace),ct=y.colorSpace===ki||_e===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);let re=_(y.image,!1,s.maxTextureSize);re=Xe(y,re);const Ce=r.convert(y.format,y.colorSpace),qe=r.convert(y.type);let Ye=v(y.internalFormat,Ce,qe,y.colorSpace,y.isVideoTexture);Be(j,y);let Pe;const ut=y.mipmaps,it=y.isVideoTexture!==!0,Lt=Ne.__version===void 0||ee===!0,D=Z.dataReady,ve=P(y,re);if(y.isDepthTexture)Ye=x(y.format===fr,y.type),Lt&&(it?t.texStorage2D(i.TEXTURE_2D,1,Ye,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,Ye,re.width,re.height,0,Ce,qe,null));else if(y.isDataTexture)if(ut.length>0){it&&Lt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,ut[0].width,ut[0].height);for(let Y=0,Q=ut.length;Y<Q;Y++)Pe=ut[Y],it?D&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Pe.width,Pe.height,Ce,qe,Pe.data):t.texImage2D(i.TEXTURE_2D,Y,Ye,Pe.width,Pe.height,0,Ce,qe,Pe.data);y.generateMipmaps=!1}else it?(Lt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,re.width,re.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re.width,re.height,Ce,qe,re.data)):t.texImage2D(i.TEXTURE_2D,0,Ye,re.width,re.height,0,Ce,qe,re.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){it&&Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ye,ut[0].width,ut[0].height,re.depth);for(let Y=0,Q=ut.length;Y<Q;Y++)if(Pe=ut[Y],y.format!==Hn)if(Ce!==null)if(it){if(D)if(y.layerUpdates.size>0){const be=ud(Pe.width,Pe.height,y.format,y.type);for(const Se of y.layerUpdates){const Qe=Pe.data.subarray(Se*be/Pe.data.BYTES_PER_ELEMENT,(Se+1)*be/Pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Se,Pe.width,Pe.height,1,Ce,Qe)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Pe.width,Pe.height,re.depth,Ce,Pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Ye,Pe.width,Pe.height,re.depth,0,Pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else it?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Pe.width,Pe.height,re.depth,Ce,qe,Pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Ye,Pe.width,Pe.height,re.depth,0,Ce,qe,Pe.data)}else{it&&Lt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,ut[0].width,ut[0].height);for(let Y=0,Q=ut.length;Y<Q;Y++)Pe=ut[Y],y.format!==Hn?Ce!==null?it?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Pe.width,Pe.height,Ce,Pe.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Ye,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):it?D&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Pe.width,Pe.height,Ce,qe,Pe.data):t.texImage2D(i.TEXTURE_2D,Y,Ye,Pe.width,Pe.height,0,Ce,qe,Pe.data)}else if(y.isDataArrayTexture)if(it){if(Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ye,re.width,re.height,re.depth),D)if(y.layerUpdates.size>0){const Y=ud(re.width,re.height,y.format,y.type);for(const Q of y.layerUpdates){const be=re.data.subarray(Q*Y/re.data.BYTES_PER_ELEMENT,(Q+1)*Y/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,Ce,qe,be)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,Ce,qe,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ye,re.width,re.height,re.depth,0,Ce,qe,re.data);else if(y.isData3DTexture)it?(Lt&&t.texStorage3D(i.TEXTURE_3D,ve,Ye,re.width,re.height,re.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,Ce,qe,re.data)):t.texImage3D(i.TEXTURE_3D,0,Ye,re.width,re.height,re.depth,0,Ce,qe,re.data);else if(y.isFramebufferTexture){if(Lt)if(it)t.texStorage2D(i.TEXTURE_2D,ve,Ye,re.width,re.height);else{let Y=re.width,Q=re.height;for(let be=0;be<ve;be++)t.texImage2D(i.TEXTURE_2D,be,Ye,Y,Q,0,Ce,qe,null),Y>>=1,Q>>=1}}else if(ut.length>0){if(it&&Lt){const Y=Me(ut[0]);t.texStorage2D(i.TEXTURE_2D,ve,Ye,Y.width,Y.height)}for(let Y=0,Q=ut.length;Y<Q;Y++)Pe=ut[Y],it?D&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Ce,qe,Pe):t.texImage2D(i.TEXTURE_2D,Y,Ye,Ce,qe,Pe);y.generateMipmaps=!1}else if(it){if(Lt){const Y=Me(re);t.texStorage2D(i.TEXTURE_2D,ve,Ye,Y.width,Y.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ce,qe,re)}else t.texImage2D(i.TEXTURE_2D,0,Ye,Ce,qe,re);g(y)&&p(j),Ne.__version=Z.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function he(w,y,F){if(y.image.length!==6)return;const j=vt(w,y),ee=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+F);const Z=n.get(ee);if(ee.version!==Z.__version||j===!0){t.activeTexture(i.TEXTURE0+F);const Ne=lt.getPrimaries(lt.workingColorSpace),_e=y.colorSpace===ki?null:lt.getPrimaries(y.colorSpace),we=y.colorSpace===ki||Ne===_e?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const ct=y.isCompressedTexture||y.image[0].isCompressedTexture,re=y.image[0]&&y.image[0].isDataTexture,Ce=[];for(let Q=0;Q<6;Q++)!ct&&!re?Ce[Q]=_(y.image[Q],!0,s.maxCubemapSize):Ce[Q]=re?y.image[Q].image:y.image[Q],Ce[Q]=Xe(y,Ce[Q]);const qe=Ce[0],Ye=r.convert(y.format,y.colorSpace),Pe=r.convert(y.type),ut=v(y.internalFormat,Ye,Pe,y.colorSpace),it=y.isVideoTexture!==!0,Lt=Z.__version===void 0||j===!0,D=ee.dataReady;let ve=P(y,qe);Be(i.TEXTURE_CUBE_MAP,y);let Y;if(ct){it&&Lt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,ut,qe.width,qe.height);for(let Q=0;Q<6;Q++){Y=Ce[Q].mipmaps;for(let be=0;be<Y.length;be++){const Se=Y[be];y.format!==Hn?Ye!==null?it?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,0,0,Se.width,Se.height,Ye,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,ut,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):it?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,0,0,Se.width,Se.height,Ye,Pe,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be,ut,Se.width,Se.height,0,Ye,Pe,Se.data)}}}else{if(Y=y.mipmaps,it&&Lt){Y.length>0&&ve++;const Q=Me(Ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,ut,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(re){it?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ce[Q].width,Ce[Q].height,Ye,Pe,Ce[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ut,Ce[Q].width,Ce[Q].height,0,Ye,Pe,Ce[Q].data);for(let be=0;be<Y.length;be++){const Qe=Y[be].image[Q].image;it?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,0,0,Qe.width,Qe.height,Ye,Pe,Qe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,ut,Qe.width,Qe.height,0,Ye,Pe,Qe.data)}}else{it?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ye,Pe,Ce[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,ut,Ye,Pe,Ce[Q]);for(let be=0;be<Y.length;be++){const Se=Y[be];it?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,0,0,Ye,Pe,Se.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,be+1,ut,Ye,Pe,Se.image[Q])}}}g(y)&&p(i.TEXTURE_CUBE_MAP),Z.__version=ee.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Ie(w,y,F,j,ee,Z){const Ne=r.convert(F.format,F.colorSpace),_e=r.convert(F.type),we=v(F.internalFormat,Ne,_e,F.colorSpace),ct=n.get(y),re=n.get(F);if(re.__renderTarget=y,!ct.__hasExternalTextures){const Ce=Math.max(1,y.width>>Z),qe=Math.max(1,y.height>>Z);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,Z,we,Ce,qe,y.depth,0,Ne,_e,null):t.texImage2D(ee,Z,we,Ce,qe,0,Ne,_e,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),Ae(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,ee,re.__webglTexture,0,ie(y)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,ee,re.__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(w,y,F){if(i.bindRenderbuffer(i.RENDERBUFFER,w),y.depthBuffer){const j=y.depthTexture,ee=j&&j.isDepthTexture?j.type:null,Z=x(y.stencilBuffer,ee),Ne=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_e=ie(y);Ae(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_e,Z,y.width,y.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,Z,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Z,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ne,i.RENDERBUFFER,w)}else{const j=y.textures;for(let ee=0;ee<j.length;ee++){const Z=j[ee],Ne=r.convert(Z.format,Z.colorSpace),_e=r.convert(Z.type),we=v(Z.internalFormat,Ne,_e,Z.colorSpace),ct=ie(y);F&&Ae(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,we,y.width,y.height):Ae(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,we,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,we,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Fe(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(y.depthTexture);j.__renderTarget=y,(!j.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),B(y.depthTexture,0);const ee=j.__webglTexture,Z=ie(y);if(y.depthTexture.format===ir)Ae(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(y.depthTexture.format===fr)Ae(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function ht(w){const y=n.get(w),F=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const j=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),j){const ee=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,j.removeEventListener("dispose",ee)};j.addEventListener("dispose",ee),y.__depthDisposeCallback=ee}y.__boundDepthTexture=j}if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Fe(y.__webglFramebuffer,w)}else if(F){y.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[j]),y.__webglDepthbuffer[j]===void 0)y.__webglDepthbuffer[j]=i.createRenderbuffer(),de(y.__webglDepthbuffer[j],w,!1);else{const ee=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),de(y.__webglDepthbuffer,w,!1);else{const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,ee)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Oe(w,y,F){const j=n.get(w);y!==void 0&&Ie(j.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&ht(w)}function gt(w){const y=w.texture,F=n.get(w),j=n.get(y);w.addEventListener("dispose",C);const ee=w.textures,Z=w.isWebGLCubeRenderTarget===!0,Ne=ee.length>1;if(Ne||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=y.version,a.memory.textures++),Z){F.__webglFramebuffer=[];for(let _e=0;_e<6;_e++)if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer[_e]=[];for(let we=0;we<y.mipmaps.length;we++)F.__webglFramebuffer[_e][we]=i.createFramebuffer()}else F.__webglFramebuffer[_e]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer=[];for(let _e=0;_e<y.mipmaps.length;_e++)F.__webglFramebuffer[_e]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Ne)for(let _e=0,we=ee.length;_e<we;_e++){const ct=n.get(ee[_e]);ct.__webglTexture===void 0&&(ct.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&Ae(w)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let _e=0;_e<ee.length;_e++){const we=ee[_e];F.__webglColorRenderbuffer[_e]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[_e]);const ct=r.convert(we.format,we.colorSpace),re=r.convert(we.type),Ce=v(we.internalFormat,ct,re,we.colorSpace,w.isXRRenderTarget===!0),qe=ie(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,Ce,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,F.__webglColorRenderbuffer[_e])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),de(F.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Be(i.TEXTURE_CUBE_MAP,y);for(let _e=0;_e<6;_e++)if(y.mipmaps&&y.mipmaps.length>0)for(let we=0;we<y.mipmaps.length;we++)Ie(F.__webglFramebuffer[_e][we],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,we);else Ie(F.__webglFramebuffer[_e],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0);g(y)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let _e=0,we=ee.length;_e<we;_e++){const ct=ee[_e],re=n.get(ct);t.bindTexture(i.TEXTURE_2D,re.__webglTexture),Be(i.TEXTURE_2D,ct),Ie(F.__webglFramebuffer,w,ct,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,0),g(ct)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let _e=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_e=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,j.__webglTexture),Be(_e,y),y.mipmaps&&y.mipmaps.length>0)for(let we=0;we<y.mipmaps.length;we++)Ie(F.__webglFramebuffer[we],w,y,i.COLOR_ATTACHMENT0,_e,we);else Ie(F.__webglFramebuffer,w,y,i.COLOR_ATTACHMENT0,_e,0);g(y)&&p(_e),t.unbindTexture()}w.depthBuffer&&ht(w)}function ne(w){const y=w.textures;for(let F=0,j=y.length;F<j;F++){const ee=y[F];if(g(ee)){const Z=M(w),Ne=n.get(ee).__webglTexture;t.bindTexture(Z,Ne),p(Z),t.unbindTexture()}}}const te=[],R=[];function Ue(w){if(w.samples>0){if(Ae(w)===!1){const y=w.textures,F=w.width,j=w.height;let ee=i.COLOR_BUFFER_BIT;const Z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ne=n.get(w),_e=y.length>1;if(_e)for(let we=0;we<y.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let we=0;we<y.length;we++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),_e){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[we]);const ct=n.get(y[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ct,0)}i.blitFramebuffer(0,0,F,j,0,0,F,j,ee,i.NEAREST),c===!0&&(te.length=0,R.length=0,te.push(i.COLOR_ATTACHMENT0+we),w.depthBuffer&&w.resolveDepthBuffer===!1&&(te.push(Z),R.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,R)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_e)for(let we=0;we<y.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[we]);const ct=n.get(y[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,ct,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const y=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function ie(w){return Math.min(s.maxSamples,w.samples)}function Ae(w){const y=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function le(w){const y=a.render.frame;u.get(w)!==y&&(u.set(w,y),w.update())}function Xe(w,y){const F=w.colorSpace,j=w.format,ee=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==gn&&F!==ki&&(lt.getTransfer(F)===At?(j!==Hn||ee!==wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),y}function Me(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=X,this.setTexture2D=B,this.setTexture2DArray=V,this.setTexture3D=K,this.setTextureCube=W,this.rebindTextures=Oe,this.setupRenderTarget=gt,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=ht,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=Ae}function A1(i,e){function t(n,s=ki){let r;const a=lt.getTransfer(s);if(n===wi)return i.UNSIGNED_BYTE;if(n===xu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===vu)return i.UNSIGNED_SHORT_5_5_5_1;if(n===bf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Mf)return i.BYTE;if(n===Sf)return i.SHORT;if(n===sa)return i.UNSIGNED_SHORT;if(n===_u)return i.INT;if(n===_s)return i.UNSIGNED_INT;if(n===Qn)return i.FLOAT;if(n===va)return i.HALF_FLOAT;if(n===Ef)return i.ALPHA;if(n===Tf)return i.RGB;if(n===Hn)return i.RGBA;if(n===wf)return i.LUMINANCE;if(n===Af)return i.LUMINANCE_ALPHA;if(n===ir)return i.DEPTH_COMPONENT;if(n===fr)return i.DEPTH_STENCIL;if(n===yu)return i.RED;if(n===Mu)return i.RED_INTEGER;if(n===Rf)return i.RG;if(n===Su)return i.RG_INTEGER;if(n===bu)return i.RGBA_INTEGER;if(n===xo||n===vo||n===yo||n===Mo)if(a===At)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===xo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===xo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===yo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ml||n===Sl||n===bl||n===El)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===wl||n===Al)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tl||n===wl)return a===At?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Al)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Rl||n===Cl||n===Pl||n===Ll||n===Il||n===Dl||n===Nl||n===Ul||n===Ol||n===Fl||n===kl||n===Bl||n===zl||n===Hl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Rl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Cl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ll)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Il)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Dl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ul)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Fl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===kl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Bl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===zl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Hl)return a===At?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===So||n===Vl||n===Gl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===So)return a===At?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Cf||n===Wl||n===Xl||n===ql)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===So)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const R1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class P1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Zt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Xi({vertexShader:R1,fragmentShader:C1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new je(new nn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class L1 extends ys{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,m=null;const _=new P1,g=t.getContextAttributes();let p=null,M=null;const v=[],x=[],P=new oe;let A=null;const C=new mn;C.viewport=new xt;const L=new mn;L.viewport=new xt;const E=[C,L],S=new kg;let I=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let he=v[J];return he===void 0&&(he=new Tc,v[J]=he),he.getTargetRaySpace()},this.getControllerGrip=function(J){let he=v[J];return he===void 0&&(he=new Tc,v[J]=he),he.getGripSpace()},this.getHand=function(J){let he=v[J];return he===void 0&&(he=new Tc,v[J]=he),he.getHandSpace()};function k(J){const he=x.indexOf(J.inputSource);if(he===-1)return;const Ie=v[he];Ie!==void 0&&(Ie.update(J.inputSource,J.frame,l||a),Ie.dispatchEvent({type:J.type,data:J.inputSource}))}function q(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",B);for(let J=0;J<v.length;J++){const he=x[J];he!==null&&(x[J]=null,v[J].disconnect(he))}I=null,X=null,_.reset(),e.setRenderTarget(p),f=null,d=null,h=null,s=null,M=null,vt.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",q),s.addEventListener("inputsourceschange",B),g.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(P),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ie=null,de=null,Fe=null;g.depth&&(Fe=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ie=g.stencil?fr:ir,de=g.stencil?dr:_s);const ht={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:r};h=new XRWebGLBinding(s,t),d=h.createProjectionLayer(ht),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new xs(d.textureWidth,d.textureHeight,{format:Hn,type:wi,depthTexture:new jf(d.textureWidth,d.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,Ie),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ie={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ie),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new xs(f.framebufferWidth,f.framebufferHeight,{format:Hn,type:wi,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),vt.setContext(s),vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function B(J){for(let he=0;he<J.removed.length;he++){const Ie=J.removed[he],de=x.indexOf(Ie);de>=0&&(x[de]=null,v[de].disconnect(Ie))}for(let he=0;he<J.added.length;he++){const Ie=J.added[he];let de=x.indexOf(Ie);if(de===-1){for(let ht=0;ht<v.length;ht++)if(ht>=x.length){x.push(Ie),de=ht;break}else if(x[ht]===null){x[ht]=Ie,de=ht;break}if(de===-1)break}const Fe=v[de];Fe&&Fe.connect(Ie)}}const V=new T,K=new T;function W(J,he,Ie){V.setFromMatrixPosition(he.matrixWorld),K.setFromMatrixPosition(Ie.matrixWorld);const de=V.distanceTo(K),Fe=he.projectionMatrix.elements,ht=Ie.projectionMatrix.elements,Oe=Fe[14]/(Fe[10]-1),gt=Fe[14]/(Fe[10]+1),ne=(Fe[9]+1)/Fe[5],te=(Fe[9]-1)/Fe[5],R=(Fe[8]-1)/Fe[0],Ue=(ht[8]+1)/ht[0],ie=Oe*R,Ae=Oe*Ue,le=de/(-R+Ue),Xe=le*-R;if(he.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Xe),J.translateZ(le),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Fe[10]===-1)J.projectionMatrix.copy(he.projectionMatrix),J.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const Me=Oe+le,w=gt+le,y=ie-Xe,F=Ae+(de-Xe),j=ne*gt/w*Me,ee=te*gt/w*Me;J.projectionMatrix.makePerspective(y,F,j,ee,Me,w),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ue(J,he){he===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(he.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let he=J.near,Ie=J.far;_.texture!==null&&(_.depthNear>0&&(he=_.depthNear),_.depthFar>0&&(Ie=_.depthFar)),S.near=L.near=C.near=he,S.far=L.far=C.far=Ie,(I!==S.near||X!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),I=S.near,X=S.far),C.layers.mask=J.layers.mask|2,L.layers.mask=J.layers.mask|4,S.layers.mask=C.layers.mask|L.layers.mask;const de=J.parent,Fe=S.cameras;ue(S,de);for(let ht=0;ht<Fe.length;ht++)ue(Fe[ht],de);Fe.length===2?W(S,C,L):S.projectionMatrix.copy(C.projectionMatrix),me(J,S,de)};function me(J,he,Ie){Ie===null?J.matrix.copy(he.matrixWorld):(J.matrix.copy(Ie.matrixWorld),J.matrix.invert(),J.matrix.multiply(he.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(he.projectionMatrix),J.projectionMatrixInverse.copy(he.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=pr*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let Te=null;function Be(J,he){if(u=he.getViewerPose(l||a),m=he,u!==null){const Ie=u.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let de=!1;Ie.length!==S.cameras.length&&(S.cameras.length=0,de=!0);for(let Oe=0;Oe<Ie.length;Oe++){const gt=Ie[Oe];let ne=null;if(f!==null)ne=f.getViewport(gt);else{const R=h.getViewSubImage(d,gt);ne=R.viewport,Oe===0&&(e.setRenderTargetTextures(M,R.colorTexture,d.ignoreDepthValues?void 0:R.depthStencilTexture),e.setRenderTarget(M))}let te=E[Oe];te===void 0&&(te=new mn,te.layers.enable(Oe),te.viewport=new xt,E[Oe]=te),te.matrix.fromArray(gt.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(gt.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(ne.x,ne.y,ne.width,ne.height),Oe===0&&(S.matrix.copy(te.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),de===!0&&S.cameras.push(te)}const Fe=s.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const Oe=h.getDepthInformation(Ie[0]);Oe&&Oe.isValid&&Oe.texture&&_.init(e,Oe,s.renderState)}}for(let Ie=0;Ie<v.length;Ie++){const de=x[Ie],Fe=v[Ie];de!==null&&Fe!==void 0&&Fe.update(de,he,l||a)}Te&&Te(J,he),he.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:he}),m=null}const vt=new up;vt.setAnimationLoop(Be),this.setAnimationLoop=function(J){Te=J},this.dispose=function(){}}}const is=new oi,I1=new $e;function D1(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Bf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,v,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),h(g,p)):p.isMeshPhongMaterial?(r(g,p),u(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,M,v):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Rn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Rn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=e.get(p),v=M.envMap,x=M.envMapRotation;v&&(g.envMap.value=v,is.copy(x),is.x*=-1,is.y*=-1,is.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),g.envMapRotation.value.setFromMatrix4(I1.makeRotationFromEuler(is)),g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,M,v){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=v*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Rn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function N1(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,v){const x=v.program;n.uniformBlockBinding(M,x)}function l(M,v){let x=s[M.id];x===void 0&&(m(M),x=u(M),s[M.id]=x,M.addEventListener("dispose",g));const P=v.program;n.updateUBOMapping(M,P);const A=e.render.frame;r[M.id]!==A&&(d(M),r[M.id]=A)}function u(M){const v=h();M.__bindingPointIndex=v;const x=i.createBuffer(),P=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,P,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const v=s[M.id],x=M.uniforms,P=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,C=x.length;A<C;A++){const L=Array.isArray(x[A])?x[A]:[x[A]];for(let E=0,S=L.length;E<S;E++){const I=L[E];if(f(I,A,E,P)===!0){const X=I.__offset,k=Array.isArray(I.value)?I.value:[I.value];let q=0;for(let B=0;B<k.length;B++){const V=k[B],K=_(V);typeof V=="number"||typeof V=="boolean"?(I.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,X+q,I.__data)):V.isMatrix3?(I.__data[0]=V.elements[0],I.__data[1]=V.elements[1],I.__data[2]=V.elements[2],I.__data[3]=0,I.__data[4]=V.elements[3],I.__data[5]=V.elements[4],I.__data[6]=V.elements[5],I.__data[7]=0,I.__data[8]=V.elements[6],I.__data[9]=V.elements[7],I.__data[10]=V.elements[8],I.__data[11]=0):(V.toArray(I.__data,q),q+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,X,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,v,x,P){const A=M.value,C=v+"_"+x;if(P[C]===void 0)return typeof A=="number"||typeof A=="boolean"?P[C]=A:P[C]=A.clone(),!0;{const L=P[C];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return P[C]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function m(M){const v=M.uniforms;let x=0;const P=16;for(let C=0,L=v.length;C<L;C++){const E=Array.isArray(v[C])?v[C]:[v[C]];for(let S=0,I=E.length;S<I;S++){const X=E[S],k=Array.isArray(X.value)?X.value:[X.value];for(let q=0,B=k.length;q<B;q++){const V=k[q],K=_(V),W=x%P,ue=W%K.boundary,me=W+ue;x+=ue,me!==0&&P-me<K.storage&&(x+=P-me),X.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=x,x+=K.storage}}}const A=x%P;return A>0&&(x+=P-A),M.__size=x,M.__cache={},this}function _(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function g(M){const v=M.target;v.removeEventListener("dispose",g);const x=a.indexOf(v.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class U1{constructor(e={}){const{canvas:t=r0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const M=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=Gi,this.toneMappingExposure=1;const x=this;let P=!1,A=0,C=0,L=null,E=-1,S=null;const I=new xt,X=new xt;let k=null;const q=new ke(0);let B=0,V=t.width,K=t.height,W=1,ue=null,me=null;const Te=new xt(0,0,V,K),Be=new xt(0,0,V,K);let vt=!1;const J=new Pu;let he=!1,Ie=!1;this.transmissionResolutionScale=1;const de=new $e,Fe=new $e,ht=new T,Oe=new xt,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ne=!1;function te(){return L===null?W:1}let R=n;function Ue(b,N){return t.getContext(b,N)}try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${gu}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",Se,!1),R===null){const N="webgl2";if(R=Ue(N,b),R===null)throw Ue(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let ie,Ae,le,Xe,Me,w,y,F,j,ee,Z,Ne,_e,we,ct,re,Ce,qe,Ye,Pe,ut,it,Lt,D;function ve(){ie=new Xv(R),ie.init(),it=new A1(R,ie),Ae=new kv(R,ie,e,it),le=new T1(R,ie),Ae.reverseDepthBuffer&&d&&le.buffers.depth.setReversed(!0),Xe=new Kv(R),Me=new d1,w=new w1(R,ie,le,Me,Ae,it,Xe),y=new zv(x),F=new Wv(x),j=new e_(R),Lt=new Ov(R,j),ee=new qv(R,j,Xe,Lt),Z=new Zv(R,ee,j,Xe),Ye=new jv(R,Ae,w),re=new Bv(Me),Ne=new h1(x,y,F,ie,Ae,Lt,re),_e=new D1(x,Me),we=new p1,ct=new y1(ie),qe=new Uv(x,y,F,le,Z,f,c),Ce=new b1(x,Z,Ae),D=new N1(R,Xe,Ae,le),Pe=new Fv(R,ie,Xe),ut=new Yv(R,ie,Xe),Xe.programs=Ne.programs,x.capabilities=Ae,x.extensions=ie,x.properties=Me,x.renderLists=we,x.shadowMap=Ce,x.state=le,x.info=Xe}ve();const Y=new L1(x,R);this.xr=Y,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const b=ie.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ie.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(b){b!==void 0&&(W=b,this.setSize(V,K,!1))},this.getSize=function(b){return b.set(V,K)},this.setSize=function(b,N,H=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=b,K=N,t.width=Math.floor(b*W),t.height=Math.floor(N*W),H===!0&&(t.style.width=b+"px",t.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(V*W,K*W).floor()},this.setDrawingBufferSize=function(b,N,H){V=b,K=N,W=H,t.width=Math.floor(b*H),t.height=Math.floor(N*H),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(I)},this.getViewport=function(b){return b.copy(Te)},this.setViewport=function(b,N,H,G){b.isVector4?Te.set(b.x,b.y,b.z,b.w):Te.set(b,N,H,G),le.viewport(I.copy(Te).multiplyScalar(W).round())},this.getScissor=function(b){return b.copy(Be)},this.setScissor=function(b,N,H,G){b.isVector4?Be.set(b.x,b.y,b.z,b.w):Be.set(b,N,H,G),le.scissor(X.copy(Be).multiplyScalar(W).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(b){le.setScissorTest(vt=b)},this.setOpaqueSort=function(b){ue=b},this.setTransparentSort=function(b){me=b},this.getClearColor=function(b){return b.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,H=!0){let G=0;if(b){let U=!1;if(L!==null){const se=L.texture.format;U=se===bu||se===Su||se===Mu}if(U){const se=L.texture.type,ye=se===wi||se===_s||se===sa||se===dr||se===xu||se===vu,Re=qe.getClearColor(),Le=qe.getClearAlpha(),Ke=Re.r,Ze=Re.g,ze=Re.b;ye?(m[0]=Ke,m[1]=Ze,m[2]=ze,m[3]=Le,R.clearBufferuiv(R.COLOR,0,m)):(_[0]=Ke,_[1]=Ze,_[2]=ze,_[3]=Le,R.clearBufferiv(R.COLOR,0,_))}else G|=R.COLOR_BUFFER_BIT}N&&(G|=R.DEPTH_BUFFER_BIT),H&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),qe.dispose(),we.dispose(),ct.dispose(),Me.dispose(),y.dispose(),F.dispose(),Z.dispose(),Lt.dispose(),D.dispose(),Ne.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",ah),Y.removeEventListener("sessionend",oh),Zi.stop()};function Q(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const b=Xe.autoReset,N=Ce.enabled,H=Ce.autoUpdate,G=Ce.needsUpdate,U=Ce.type;ve(),Xe.autoReset=b,Ce.enabled=N,Ce.autoUpdate=H,Ce.needsUpdate=G,Ce.type=U}function Se(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Qe(b){const N=b.target;N.removeEventListener("dispose",Qe),Ot(N)}function Ot(b){un(b),Me.remove(b)}function un(b){const N=Me.get(b).programs;N!==void 0&&(N.forEach(function(H){Ne.releaseProgram(H)}),b.isShaderMaterial&&Ne.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,H,G,U,se){N===null&&(N=gt);const ye=U.isMesh&&U.matrixWorld.determinant()<0,Re=Wp(b,N,H,G,U);le.setMaterial(G,ye);let Le=H.index,Ke=1;if(G.wireframe===!0){if(Le=ee.getWireframeAttribute(H),Le===void 0)return;Ke=2}const Ze=H.drawRange,ze=H.attributes.position;let dt=Ze.start*Ke,yt=(Ze.start+Ze.count)*Ke;se!==null&&(dt=Math.max(dt,se.start*Ke),yt=Math.min(yt,(se.start+se.count)*Ke)),Le!==null?(dt=Math.max(dt,0),yt=Math.min(yt,Le.count)):ze!=null&&(dt=Math.max(dt,0),yt=Math.min(yt,ze.count));const Gt=yt-dt;if(Gt<0||Gt===1/0)return;Lt.setup(U,G,Re,H,Le);let Ft,mt=Pe;if(Le!==null&&(Ft=j.get(Le),mt=ut,mt.setIndex(Ft)),U.isMesh)G.wireframe===!0?(le.setLineWidth(G.wireframeLinewidth*te()),mt.setMode(R.LINES)):mt.setMode(R.TRIANGLES);else if(U.isLine){let He=G.linewidth;He===void 0&&(He=1),le.setLineWidth(He*te()),U.isLineSegments?mt.setMode(R.LINES):U.isLineLoop?mt.setMode(R.LINE_LOOP):mt.setMode(R.LINE_STRIP)}else U.isPoints?mt.setMode(R.POINTS):U.isSprite&&mt.setMode(R.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)cs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ie.get("WEBGL_multi_draw"))mt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const He=U._multiDrawStarts,on=U._multiDrawCounts,Mt=U._multiDrawCount,Yn=Le?j.get(Le).bytesPerElement:1,bs=Me.get(G).currentProgram.getUniforms();for(let Cn=0;Cn<Mt;Cn++)bs.setValue(R,"_gl_DrawID",Cn),mt.render(He[Cn]/Yn,on[Cn])}else if(U.isInstancedMesh)mt.renderInstances(dt,Gt,U.count);else if(H.isInstancedBufferGeometry){const He=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,on=Math.min(H.instanceCount,He);mt.renderInstances(dt,Gt,on)}else mt.render(dt,Gt)};function Et(b,N,H){b.transparent===!0&&b.side===jt&&b.forceSinglePass===!1?(b.side=Rn,b.needsUpdate=!0,Ta(b,N,H),b.side=ai,b.needsUpdate=!0,Ta(b,N,H),b.side=jt):Ta(b,N,H)}this.compile=function(b,N,H=null){H===null&&(H=b),p=ct.get(H),p.init(N),v.push(p),H.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),b!==H&&b.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(p.pushLight(U),U.castShadow&&p.pushShadow(U))}),p.setupLights();const G=new Set;return b.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const se=U.material;if(se)if(Array.isArray(se))for(let ye=0;ye<se.length;ye++){const Re=se[ye];Et(Re,H,U),G.add(Re)}else Et(se,H,U),G.add(se)}),p=v.pop(),G},this.compileAsync=function(b,N,H=null){const G=this.compile(b,N,H);return new Promise(U=>{function se(){if(G.forEach(function(ye){Me.get(ye).currentProgram.isReady()&&G.delete(ye)}),G.size===0){U(b);return}setTimeout(se,10)}ie.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let qn=null;function di(b){qn&&qn(b)}function ah(){Zi.stop()}function oh(){Zi.start()}const Zi=new up;Zi.setAnimationLoop(di),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(b){qn=b,Y.setAnimationLoop(b),b===null?Zi.stop():Zi.start()},Y.addEventListener("sessionstart",ah),Y.addEventListener("sessionend",oh),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(N),N=Y.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,N,L),p=ct.get(b,v.length),p.init(N),v.push(p),Fe.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),J.setFromProjectionMatrix(Fe),Ie=this.localClippingEnabled,he=re.init(this.clippingPlanes,Ie),g=we.get(b,M.length),g.init(),M.push(g),Y.enabled===!0&&Y.isPresenting===!0){const se=x.xr.getDepthSensingMesh();se!==null&&ic(se,N,-1/0,x.sortObjects)}ic(b,N,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(ue,me),ne=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,ne&&qe.addToRenderList(g,b),this.info.render.frame++,he===!0&&re.beginShadows();const H=p.state.shadowsArray;Ce.render(H,b,N),he===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=g.opaque,U=g.transmissive;if(p.setupLights(),N.isArrayCamera){const se=N.cameras;if(U.length>0)for(let ye=0,Re=se.length;ye<Re;ye++){const Le=se[ye];lh(G,U,b,Le)}ne&&qe.render(b);for(let ye=0,Re=se.length;ye<Re;ye++){const Le=se[ye];ch(g,b,Le,Le.viewport)}}else U.length>0&&lh(G,U,b,N),ne&&qe.render(b),ch(g,b,N);L!==null&&C===0&&(w.updateMultisampleRenderTarget(L),w.updateRenderTargetMipmap(L)),b.isScene===!0&&b.onAfterRender(x,b,N),Lt.resetDefaultState(),E=-1,S=null,v.pop(),v.length>0?(p=v[v.length-1],he===!0&&re.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function ic(b,N,H,G){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)H=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||J.intersectsSprite(b)){G&&Oe.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Fe);const ye=Z.update(b),Re=b.material;Re.visible&&g.push(b,ye,Re,H,Oe.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||J.intersectsObject(b))){const ye=Z.update(b),Re=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Oe.copy(b.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Oe.copy(ye.boundingSphere.center)),Oe.applyMatrix4(b.matrixWorld).applyMatrix4(Fe)),Array.isArray(Re)){const Le=ye.groups;for(let Ke=0,Ze=Le.length;Ke<Ze;Ke++){const ze=Le[Ke],dt=Re[ze.materialIndex];dt&&dt.visible&&g.push(b,ye,dt,H,Oe.z,ze)}}else Re.visible&&g.push(b,ye,Re,H,Oe.z,null)}}const se=b.children;for(let ye=0,Re=se.length;ye<Re;ye++)ic(se[ye],N,H,G)}function ch(b,N,H,G){const U=b.opaque,se=b.transmissive,ye=b.transparent;p.setupLightsView(H),he===!0&&re.setGlobalState(x.clippingPlanes,H),G&&le.viewport(I.copy(G)),U.length>0&&Ea(U,N,H),se.length>0&&Ea(se,N,H),ye.length>0&&Ea(ye,N,H),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function lh(b,N,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new xs(1,1,{generateMipmaps:!0,type:ie.has("EXT_color_buffer_half_float")||ie.has("EXT_color_buffer_float")?va:wi,minFilter:Si,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));const se=p.state.transmissionRenderTarget[G.id],ye=G.viewport||I;se.setSize(ye.z*x.transmissionResolutionScale,ye.w*x.transmissionResolutionScale);const Re=x.getRenderTarget();x.setRenderTarget(se),x.getClearColor(q),B=x.getClearAlpha(),B<1&&x.setClearColor(16777215,.5),x.clear(),ne&&qe.render(H);const Le=x.toneMapping;x.toneMapping=Gi;const Ke=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),he===!0&&re.setGlobalState(x.clippingPlanes,G),Ea(b,H,G),w.updateMultisampleRenderTarget(se),w.updateRenderTargetMipmap(se),ie.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let ze=0,dt=N.length;ze<dt;ze++){const yt=N[ze],Gt=yt.object,Ft=yt.geometry,mt=yt.material,He=yt.group;if(mt.side===jt&&Gt.layers.test(G.layers)){const on=mt.side;mt.side=Rn,mt.needsUpdate=!0,uh(Gt,H,G,Ft,mt,He),mt.side=on,mt.needsUpdate=!0,Ze=!0}}Ze===!0&&(w.updateMultisampleRenderTarget(se),w.updateRenderTargetMipmap(se))}x.setRenderTarget(Re),x.setClearColor(q,B),Ke!==void 0&&(G.viewport=Ke),x.toneMapping=Le}function Ea(b,N,H){const G=N.isScene===!0?N.overrideMaterial:null;for(let U=0,se=b.length;U<se;U++){const ye=b[U],Re=ye.object,Le=ye.geometry,Ke=G===null?ye.material:G,Ze=ye.group;Re.layers.test(H.layers)&&uh(Re,N,H,Le,Ke,Ze)}}function uh(b,N,H,G,U,se){b.onBeforeRender(x,N,H,G,U,se),b.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),U.onBeforeRender(x,N,H,G,b,se),U.transparent===!0&&U.side===jt&&U.forceSinglePass===!1?(U.side=Rn,U.needsUpdate=!0,x.renderBufferDirect(H,N,G,U,b,se),U.side=ai,U.needsUpdate=!0,x.renderBufferDirect(H,N,G,U,b,se),U.side=jt):x.renderBufferDirect(H,N,G,U,b,se),b.onAfterRender(x,N,H,G,U,se)}function Ta(b,N,H){N.isScene!==!0&&(N=gt);const G=Me.get(b),U=p.state.lights,se=p.state.shadowsArray,ye=U.state.version,Re=Ne.getParameters(b,U.state,se,N,H),Le=Ne.getProgramCacheKey(Re);let Ke=G.programs;G.environment=b.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(b.isMeshStandardMaterial?F:y).get(b.envMap||G.environment),G.envMapRotation=G.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Ke===void 0&&(b.addEventListener("dispose",Qe),Ke=new Map,G.programs=Ke);let Ze=Ke.get(Le);if(Ze!==void 0){if(G.currentProgram===Ze&&G.lightsStateVersion===ye)return dh(b,Re),Ze}else Re.uniforms=Ne.getUniforms(b),b.onBeforeCompile(Re,x),Ze=Ne.acquireProgram(Re,Le),Ke.set(Le,Ze),G.uniforms=Re.uniforms;const ze=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(ze.clippingPlanes=re.uniform),dh(b,Re),G.needsLights=qp(b),G.lightsStateVersion=ye,G.needsLights&&(ze.ambientLightColor.value=U.state.ambient,ze.lightProbe.value=U.state.probe,ze.directionalLights.value=U.state.directional,ze.directionalLightShadows.value=U.state.directionalShadow,ze.spotLights.value=U.state.spot,ze.spotLightShadows.value=U.state.spotShadow,ze.rectAreaLights.value=U.state.rectArea,ze.ltc_1.value=U.state.rectAreaLTC1,ze.ltc_2.value=U.state.rectAreaLTC2,ze.pointLights.value=U.state.point,ze.pointLightShadows.value=U.state.pointShadow,ze.hemisphereLights.value=U.state.hemi,ze.directionalShadowMap.value=U.state.directionalShadowMap,ze.directionalShadowMatrix.value=U.state.directionalShadowMatrix,ze.spotShadowMap.value=U.state.spotShadowMap,ze.spotLightMatrix.value=U.state.spotLightMatrix,ze.spotLightMap.value=U.state.spotLightMap,ze.pointShadowMap.value=U.state.pointShadowMap,ze.pointShadowMatrix.value=U.state.pointShadowMatrix),G.currentProgram=Ze,G.uniformsList=null,Ze}function hh(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=bo.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function dh(b,N){const H=Me.get(b);H.outputColorSpace=N.outputColorSpace,H.batching=N.batching,H.batchingColor=N.batchingColor,H.instancing=N.instancing,H.instancingColor=N.instancingColor,H.instancingMorph=N.instancingMorph,H.skinning=N.skinning,H.morphTargets=N.morphTargets,H.morphNormals=N.morphNormals,H.morphColors=N.morphColors,H.morphTargetsCount=N.morphTargetsCount,H.numClippingPlanes=N.numClippingPlanes,H.numIntersection=N.numClipIntersection,H.vertexAlphas=N.vertexAlphas,H.vertexTangents=N.vertexTangents,H.toneMapping=N.toneMapping}function Wp(b,N,H,G,U){N.isScene!==!0&&(N=gt),w.resetTextureUnits();const se=N.fog,ye=G.isMeshStandardMaterial?N.environment:null,Re=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:gn,Le=(G.isMeshStandardMaterial?F:y).get(G.envMap||ye),Ke=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Ze=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),ze=!!H.morphAttributes.position,dt=!!H.morphAttributes.normal,yt=!!H.morphAttributes.color;let Gt=Gi;G.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(Gt=x.toneMapping);const Ft=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,mt=Ft!==void 0?Ft.length:0,He=Me.get(G),on=p.state.lights;if(he===!0&&(Ie===!0||b!==S)){const _n=b===S&&G.id===E;re.setState(G,b,_n)}let Mt=!1;G.version===He.__version?(He.needsLights&&He.lightsStateVersion!==on.state.version||He.outputColorSpace!==Re||U.isBatchedMesh&&He.batching===!1||!U.isBatchedMesh&&He.batching===!0||U.isBatchedMesh&&He.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&He.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&He.instancing===!1||!U.isInstancedMesh&&He.instancing===!0||U.isSkinnedMesh&&He.skinning===!1||!U.isSkinnedMesh&&He.skinning===!0||U.isInstancedMesh&&He.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&He.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&He.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&He.instancingMorph===!1&&U.morphTexture!==null||He.envMap!==Le||G.fog===!0&&He.fog!==se||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==re.numPlanes||He.numIntersection!==re.numIntersection)||He.vertexAlphas!==Ke||He.vertexTangents!==Ze||He.morphTargets!==ze||He.morphNormals!==dt||He.morphColors!==yt||He.toneMapping!==Gt||He.morphTargetsCount!==mt)&&(Mt=!0):(Mt=!0,He.__version=G.version);let Yn=He.currentProgram;Mt===!0&&(Yn=Ta(G,N,U));let bs=!1,Cn=!1,Cr=!1;const Nt=Yn.getUniforms(),Un=He.uniforms;if(le.useProgram(Yn.program)&&(bs=!0,Cn=!0,Cr=!0),G.id!==E&&(E=G.id,Cn=!0),bs||S!==b){le.buffers.depth.getReversed()?(de.copy(b.projectionMatrix),o0(de),c0(de),Nt.setValue(R,"projectionMatrix",de)):Nt.setValue(R,"projectionMatrix",b.projectionMatrix),Nt.setValue(R,"viewMatrix",b.matrixWorldInverse);const bn=Nt.map.cameraPosition;bn!==void 0&&bn.setValue(R,ht.setFromMatrixPosition(b.matrixWorld)),Ae.logarithmicDepthBuffer&&Nt.setValue(R,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Nt.setValue(R,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,Cn=!0,Cr=!0)}if(U.isSkinnedMesh){Nt.setOptional(R,U,"bindMatrix"),Nt.setOptional(R,U,"bindMatrixInverse");const _n=U.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),Nt.setValue(R,"boneTexture",_n.boneTexture,w))}U.isBatchedMesh&&(Nt.setOptional(R,U,"batchingTexture"),Nt.setValue(R,"batchingTexture",U._matricesTexture,w),Nt.setOptional(R,U,"batchingIdTexture"),Nt.setValue(R,"batchingIdTexture",U._indirectTexture,w),Nt.setOptional(R,U,"batchingColorTexture"),U._colorsTexture!==null&&Nt.setValue(R,"batchingColorTexture",U._colorsTexture,w));const On=H.morphAttributes;if((On.position!==void 0||On.normal!==void 0||On.color!==void 0)&&Ye.update(U,H,Yn),(Cn||He.receiveShadow!==U.receiveShadow)&&(He.receiveShadow=U.receiveShadow,Nt.setValue(R,"receiveShadow",U.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Un.envMap.value=Le,Un.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&N.environment!==null&&(Un.envMapIntensity.value=N.environmentIntensity),Cn&&(Nt.setValue(R,"toneMappingExposure",x.toneMappingExposure),He.needsLights&&Xp(Un,Cr),se&&G.fog===!0&&_e.refreshFogUniforms(Un,se),_e.refreshMaterialUniforms(Un,G,W,K,p.state.transmissionRenderTarget[b.id]),bo.upload(R,hh(He),Un,w)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(bo.upload(R,hh(He),Un,w),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Nt.setValue(R,"center",U.center),Nt.setValue(R,"modelViewMatrix",U.modelViewMatrix),Nt.setValue(R,"normalMatrix",U.normalMatrix),Nt.setValue(R,"modelMatrix",U.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const _n=G.uniformsGroups;for(let bn=0,sc=_n.length;bn<sc;bn++){const Ji=_n[bn];D.update(Ji,Yn),D.bind(Ji,Yn)}}return Yn}function Xp(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function qp(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(b,N,H){Me.get(b.texture).__webglTexture=N,Me.get(b.depthTexture).__webglTexture=H;const G=Me.get(b);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||ie.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,N){const H=Me.get(b);H.__webglFramebuffer=N,H.__useDefaultFramebuffer=N===void 0};const Yp=R.createFramebuffer();this.setRenderTarget=function(b,N=0,H=0){L=b,A=N,C=H;let G=!0,U=null,se=!1,ye=!1;if(b){const Le=Me.get(b);if(Le.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(Le.__webglFramebuffer===void 0)w.setupRenderTarget(b);else if(Le.__hasExternalTextures)w.rebindTextures(b,Me.get(b.texture).__webglTexture,Me.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const ze=b.depthTexture;if(Le.__boundDepthTexture!==ze){if(ze!==null&&Me.has(ze)&&(b.width!==ze.image.width||b.height!==ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(b)}}const Ke=b.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(ye=!0);const Ze=Me.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ze[N])?U=Ze[N][H]:U=Ze[N],se=!0):b.samples>0&&w.useMultisampledRTT(b)===!1?U=Me.get(b).__webglMultisampledFramebuffer:Array.isArray(Ze)?U=Ze[H]:U=Ze,I.copy(b.viewport),X.copy(b.scissor),k=b.scissorTest}else I.copy(Te).multiplyScalar(W).floor(),X.copy(Be).multiplyScalar(W).floor(),k=vt;if(H!==0&&(U=Yp),le.bindFramebuffer(R.FRAMEBUFFER,U)&&G&&le.drawBuffers(b,U),le.viewport(I),le.scissor(X),le.setScissorTest(k),se){const Le=Me.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+N,Le.__webglTexture,H)}else if(ye){const Le=Me.get(b.texture),Ke=N;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Le.__webglTexture,H,Ke)}else if(b!==null&&H!==0){const Le=Me.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Le.__webglTexture,H)}E=-1},this.readRenderTargetPixels=function(b,N,H,G,U,se,ye){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=Me.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re){le.bindFramebuffer(R.FRAMEBUFFER,Re);try{const Le=b.texture,Ke=Le.format,Ze=Le.type;if(!Ae.textureFormatReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ae.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-G&&H>=0&&H<=b.height-U&&R.readPixels(N,H,G,U,it.convert(Ke),it.convert(Ze),se)}finally{const Le=L!==null?Me.get(L).__webglFramebuffer:null;le.bindFramebuffer(R.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(b,N,H,G,U,se,ye){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=Me.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re){const Le=b.texture,Ke=Le.format,Ze=Le.type;if(!Ae.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ae.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=b.width-G&&H>=0&&H<=b.height-U){le.bindFramebuffer(R.FRAMEBUFFER,Re);const ze=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,ze),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),R.readPixels(N,H,G,U,it.convert(Ke),it.convert(Ze),0);const dt=L!==null?Me.get(L).__webglFramebuffer:null;le.bindFramebuffer(R.FRAMEBUFFER,dt);const yt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await a0(R,yt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,ze),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(ze),R.deleteSync(yt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,N=null,H=0){b.isTexture!==!0&&(cs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,b=arguments[1]);const G=Math.pow(2,-H),U=Math.floor(b.image.width*G),se=Math.floor(b.image.height*G),ye=N!==null?N.x:0,Re=N!==null?N.y:0;w.setTexture2D(b,0),R.copyTexSubImage2D(R.TEXTURE_2D,H,0,0,ye,Re,U,se),le.unbindTexture()};const Kp=R.createFramebuffer(),jp=R.createFramebuffer();this.copyTextureToTexture=function(b,N,H=null,G=null,U=0,se=null){b.isTexture!==!0&&(cs("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,b=arguments[1],N=arguments[2],se=arguments[3]||0,H=null),se===null&&(U!==0?(cs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=U,U=0):se=0);let ye,Re,Le,Ke,Ze,ze,dt,yt,Gt;const Ft=b.isCompressedTexture?b.mipmaps[se]:b.image;if(H!==null)ye=H.max.x-H.min.x,Re=H.max.y-H.min.y,Le=H.isBox3?H.max.z-H.min.z:1,Ke=H.min.x,Ze=H.min.y,ze=H.isBox3?H.min.z:0;else{const On=Math.pow(2,-U);ye=Math.floor(Ft.width*On),Re=Math.floor(Ft.height*On),b.isDataArrayTexture?Le=Ft.depth:b.isData3DTexture?Le=Math.floor(Ft.depth*On):Le=1,Ke=0,Ze=0,ze=0}G!==null?(dt=G.x,yt=G.y,Gt=G.z):(dt=0,yt=0,Gt=0);const mt=it.convert(N.format),He=it.convert(N.type);let on;N.isData3DTexture?(w.setTexture3D(N,0),on=R.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(w.setTexture2DArray(N,0),on=R.TEXTURE_2D_ARRAY):(w.setTexture2D(N,0),on=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,N.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,N.unpackAlignment);const Mt=R.getParameter(R.UNPACK_ROW_LENGTH),Yn=R.getParameter(R.UNPACK_IMAGE_HEIGHT),bs=R.getParameter(R.UNPACK_SKIP_PIXELS),Cn=R.getParameter(R.UNPACK_SKIP_ROWS),Cr=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,Ft.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Ft.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ke),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ze),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ze);const Nt=b.isDataArrayTexture||b.isData3DTexture,Un=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){const On=Me.get(b),_n=Me.get(N),bn=Me.get(On.__renderTarget),sc=Me.get(_n.__renderTarget);le.bindFramebuffer(R.READ_FRAMEBUFFER,bn.__webglFramebuffer),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,sc.__webglFramebuffer);for(let Ji=0;Ji<Le;Ji++)Nt&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Me.get(b).__webglTexture,U,ze+Ji),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Me.get(N).__webglTexture,se,Gt+Ji)),R.blitFramebuffer(Ke,Ze,ye,Re,dt,yt,ye,Re,R.DEPTH_BUFFER_BIT,R.NEAREST);le.bindFramebuffer(R.READ_FRAMEBUFFER,null),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(U!==0||b.isRenderTargetTexture||Me.has(b)){const On=Me.get(b),_n=Me.get(N);le.bindFramebuffer(R.READ_FRAMEBUFFER,Kp),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,jp);for(let bn=0;bn<Le;bn++)Nt?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,On.__webglTexture,U,ze+bn):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,On.__webglTexture,U),Un?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,_n.__webglTexture,se,Gt+bn):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,_n.__webglTexture,se),U!==0?R.blitFramebuffer(Ke,Ze,ye,Re,dt,yt,ye,Re,R.COLOR_BUFFER_BIT,R.NEAREST):Un?R.copyTexSubImage3D(on,se,dt,yt,Gt+bn,Ke,Ze,ye,Re):R.copyTexSubImage2D(on,se,dt,yt,Ke,Ze,ye,Re);le.bindFramebuffer(R.READ_FRAMEBUFFER,null),le.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else Un?b.isDataTexture||b.isData3DTexture?R.texSubImage3D(on,se,dt,yt,Gt,ye,Re,Le,mt,He,Ft.data):N.isCompressedArrayTexture?R.compressedTexSubImage3D(on,se,dt,yt,Gt,ye,Re,Le,mt,Ft.data):R.texSubImage3D(on,se,dt,yt,Gt,ye,Re,Le,mt,He,Ft):b.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,se,dt,yt,ye,Re,mt,He,Ft.data):b.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,se,dt,yt,Ft.width,Ft.height,mt,Ft.data):R.texSubImage2D(R.TEXTURE_2D,se,dt,yt,ye,Re,mt,He,Ft);R.pixelStorei(R.UNPACK_ROW_LENGTH,Mt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Yn),R.pixelStorei(R.UNPACK_SKIP_PIXELS,bs),R.pixelStorei(R.UNPACK_SKIP_ROWS,Cn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Cr),se===0&&N.generateMipmaps&&R.generateMipmap(on),le.unbindTexture()},this.copyTextureToTexture3D=function(b,N,H=null,G=null,U=0){return b.isTexture!==!0&&(cs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,b=arguments[2],N=arguments[3],U=arguments[4]||0),cs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,N,H,G,U)},this.initRenderTarget=function(b){Me.get(b).__webglFramebuffer===void 0&&w.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?w.setTextureCube(b,0):b.isData3DTexture?w.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?w.setTexture2DArray(b,0):w.setTexture2D(b,0),le.unbindTexture()},this.resetState=function(){A=0,C=0,L=null,le.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}}const Dt={scroll:{hint:"Desplázate para avanzar",hintTouch:"Desliza para avanzar"},start:{beats:[{pos:"a",small:"ahora comienza",big:"el simulacro",at:.4,dur:3.2},{pos:"b",small:"estás en casa",big:"con tu mascota",at:2.8,dur:3.2},{pos:"c",small:"antes de que ocurra un",big:"sismo",at:5,dur:3},{pos:"d",small:"hay cosas que",big:"puedes preparar",at:6.6,dur:3,hold:!0}],cta:"Entrar a la casa →"},walk:{a:{t:"Camina por la casa",s:"Explora el espacio con calma."},b:{t:"Acércate al kit de emergencia",s:"Sigue la marca coral."},open:"Abrir el kit",enter:"Entrar a la casa",greetStop:{t:"Cacao y Nube",s:"Tus compañeros en este simulacro"},stop:{t:"Kit de emergencia",s:"Todo lo esencial para cuidar a tus mascotas"},greet:{t:"¡Bienvenido a casa!",s:"Cacao y Nube vienen a saludarte."},hall:{t:"Entra a la casa",s:"Sigue a Cacao y a Nube."}},kit:{title:"El kit de emergencia",text:"Conoce los elementos básicos para tus mascotas. Toca cada punto para descubrir para qué sirve.",items:[{icon:"drop",title:"Agua potable",text:"Reserva agua para al menos 3 días. Calcula unos 50 ml por kilo de peso al día, y más si hace calor."},{icon:"kit",title:"Alimento y platos",text:"Comida para 3 a 5 días en un envase hermético y con fecha de vencimiento. Renuévala cada seis meses."},{icon:"cross",title:"Botiquín veterinario",text:"Gasas, vendas, suero fisiológico, antiséptico, guantes y el teléfono de tu veterinario. Suma sus medicinas habituales si las usa."},{icon:"paw",title:"Correa y arnés",text:"Un arnés bien ajustado sujeta mejor que un collar cuando hay pánico. Añade una correa resistente."},{icon:"doc",title:"Documentos y foto",text:"Copia del carné de vacunas, historial médico y una foto reciente donde salgas con tu mascota."},{icon:"heart",title:"Manta y juguete",text:"Una manta con su olor y su juguete favorito la calman en un lugar desconocido."}]},petwalk:{t:"Acércate a tus mascotas",s:"Cacao y Nube descansan juntos en el sofá.",open:"Saludar a Cacao y Nube",stop:{t:"Cacao y Nube",s:"Descansan juntos en el sofá. Acércate con calma"}},track:{title:"Rastreo para perros",text:"Conoce cómo se identifica y se encuentra a Cacao si se pierde. Toca cada elemento del collar.",items:[{icon:"phone",title:"Placa de identificación",text:"Lleva su nombre y dos teléfonos de contacto. Es lo primero que verá quien la encuentre."},{icon:"pin",title:"Rastreador GPS o Bluetooth",text:"Muestra su ubicación en tu celular. Revisa la batería cada semana y comprueba que haya cobertura en tu zona."},{icon:"shield",title:"Microchip",text:"Es del tamaño de un grano de arroz y va bajo la piel. No tiene GPS: un veterinario lo lee y te identifica como dueño, así que mantén tus datos al día."}]},trackCat:{title:"Rastreo para gatos",text:"Los gatos se escapan y se esconden distinto. Toca cada elemento del collar de Nube.",items:[{icon:"phone",title:"Collar de seguridad y placa",text:"Usa un collar con cierre de liberación rápida: si se engancha, se abre solo y no la lastima. Añade una placa pequeña y liviana con su nombre y tus teléfonos."},{icon:"pin",title:"Localizador ligero",text:"Busca uno de menos de 30 g para que no la incomode. Un gato asustado suele esconderse cerca: revisa closets, camas y rincones antes de salir a buscarla lejos."},{icon:"shield",title:"Microchip",text:"Va bajo la piel entre los hombros y lo lee un veterinario. Los gatos pierden el collar con facilidad, así que el microchip es su identificación más segura. Mantén tus datos al día."}]},antesEnd:{kick:"Etapa 1 · Antes",title:"Todo listo en casa.",text:"Durante el Antes conocimos cómo prepararnos para un sismo: desde organizar nuestro kit de emergencia hasta conocer herramientas de rastreo y ubicación que pueden ser útiles en una situación de riesgo.",cta:"Siguiente momento"},quakeIntro:{kick:"Etapa 2 · Durante",title:"¡Está temblando!",text:"El movimiento comienza y todo cambia en cuestión de segundos. Mantén la calma, protege tu cuerpo y presta atención a lo que ocurre a tu alrededor.",cta:"Continuar simulacro"},banner:{strong:{t:"¡Sismo! Mantén la calma",s:"Avanza con cuidado y busca a tu mascota antes de que se acabe el tiempo."},pick:{t:"¡El sismo continúa!",s:"Escoge una de las tres experiencias para ir por tu mascota.",limit:"⏱ Tiempo límite: {n} segundos en cada experiencia."}},controls:{move:"Moverte",act:"Interactuar",or:"o",touch:"Muévete con el joystick · botón E para interactuar"},hub:{title:"Tienes tres experiencias por descubrir",sub:"El sismo continúa. Escoge la que quieras y ve por tu mascota con calma.",limit:"⏱ Tiempo límite: {n} segundos en cada experiencia.",cards:[{k:"hide",pet:"dog",t:"Un perro que se esconde",d:"Encuentra a Cacao y descubre por qué busca refugio."},{k:"still",pet:"dog",t:"Un perro que se queda quieto",d:"Acércate a Cacao y observa su reacción."},{k:"cat",pet:"cat",t:"Una gata que intenta escapar",d:"Persigue a Nube con calma y aprende a acercarte."}],cta:"Explorar",done:"Vista",next:"Continuar"},mission:{fail:{t:"No pudiste salir a tiempo",s:"El sismo continúa y se acabó el tiempo. Mantén la calma y vuelve a intentarlo desde el inicio.",cta:"Intentar de nuevo"},hide:{obj:{t:"Busca a tu mascota",s:"Cacao se escondió. Acércate a los 3 lugares marcados y presiona E para revisar."},open:"Revisar",spots:["Debajo de la mesa","Junto a la cama","Junto al librero"],empty:{t:"Aquí no está Cacao",s:"Revisa los otros lugares marcados."},title:"Cacao se esconde",text:"Muchos perros buscan un rincón oscuro y cerrado cuando sienten el temblor: es su forma de sentirse a salvo. No lo saques a la fuerza ni te expongas a objetos que caen. Cuando pare el movimiento, háblale con voz suave y acércate despacio."},still:{obj:{t:"Acércate a tu mascota",s:"Cacao está en el sofá."},open:"Acercarme a Cacao",title:"Cacao se queda quieto",text:"Algunos animales se paralizan por el miedo: no responden, tiemblan o jadean. No es desobediencia. Quédate a su lado, háblale con calma y espera a que termine el movimiento antes de moverlo."},cat:{obj:{t:"Busca a tu mascota",s:"Nube puede estar en cualquiera de los tres lugares marcados."},open:"Calmar a Nube",title:"Nube intenta escapar",text:"Los gatos suelen correr hacia las salidas o esconderse en sitios altos y estrechos. No la persigas: mantén puertas y ventanas cerradas y, cuando pase el temblor, usa una toalla y la transportadora para protegerla."}},sizeIntro:{text:"No todas las mascotas pueden ser evacuadas de la misma manera. Su tamaño y características influyen en cómo debemos sujetarlas, transportarlas y mantenerlas seguras durante un sismo."},sizePick:{title:"Escoge el tamaño de tu mascota"},sizes:{large:{name:"Perro grande",text:"Más de 25 kg. Su fuerza y su peso cambian la forma de moverlo.",items:[{a:"neck",t:"Arnés y correa corta",d:"Un arnés de pecho resistente es la forma más segura de guiarlo si se asusta."},{a:"back",t:"No lo cargues solo",d:"Pide ayuda a otra persona o usa una manta firme como camilla si está herido."},{a:"paws",t:"Cuida sus patas",d:"Tras un sismo puede haber vidrios y escombros. Revisa sus almohadillas."},{a:"rear",t:"Planea el traslado",d:"No cabe en cualquier transportadora. Ten definido en qué lo llevarás y a dónde."}]},medium:{name:"Perro mediano",text:"Entre 10 y 25 kg. Se puede cargar por trayectos cortos.",items:[{a:"neck",t:"Arnés con manija",d:"Te deja una mano libre y un agarre firme para guiarlo."},{a:"back",t:"Cárgalo con apoyo",d:"Sostén pecho y patas traseras al mismo tiempo. Nunca lo jales de las patas."},{a:"rear",t:"Transportadora grande",d:"Una plegable, con una manta con su olor, lo hace sentir seguro."},{a:"paws",t:"Practica la salida",d:"Ensaya salir con correa y transportadora para que no le sea extraño."}]},cat:{name:"Gato",text:"Pequeño, ágil y muy asustadizo bajo estrés.",items:[{a:"neck",t:"Arnés ajustable",d:"Un gato asustado se escapa de collares flojos. Suma una placa con tu teléfono."},{a:"back",t:"Toalla o manta",d:"Sirve para sujetarlo con suavidad y para cubrir la transportadora y calmarlo."},{a:"paws",t:"No lo saques a la fuerza",d:"Suelen esconderse en lugares estrechos. Espera a que pare el movimiento y háblale bajito."},{a:"rear",t:"Transportadora rígida",d:"Con cierre seguro y ventilación. Déjala abierta en casa para que la conozca."}]}},despIntro:{kick:"Etapa 3 · Después",title:"El sismo terminó.",text:"Una vez termina el sismo, conoceremos nociones básicas de primeros auxilios para perros y gatos: qué revisar y cómo actuar mientras llegas al veterinario.",cta:"Abrir el kit"},guide:{hint:"Falta leer la hoja hasta el final: los perros a la izquierda y los gatos a la derecha.",done:"Listo. Continúa cuando quieras.",tabs:[{id:"dog",label:"Perros",title:"Primeros auxilios para perros",intro:"Antes de tocarlo, revisa que no haya vidrios ni cables. Un perro asustado puede morder.",steps:[{ill:"dogMuzzle",t:"Ponle un bozal de emergencia",d:"Con una venda, da una vuelta al hocico y amarra detrás de las orejas."},{ill:"dogCheck",t:"Revisa su respiración",d:"En reposo respira de 10 a 30 veces por minuto. Encías pálidas o jadeo fuerte: urgencia."},{ill:"dogBleed",t:"Controla el sangrado",d:"Presiona con una gasa limpia sobre la herida, sin levantarla, y ve al veterinario."},{ill:"dogCPR",t:"Sin respiración ni pulso",d:"Comprime el pecho de 100 a 120 veces por minuto y pide que llamen al veterinario."},{ill:"dogStretcher",t:"Trasládalo sobre una manta",d:"Si no puede caminar, levántenlo entre dos personas con el cuerpo recto."}]},{id:"cat",label:"Gatos",title:"Primeros auxilios para gatos",intro:"Un gato herido se esconde y ataca por miedo. Muévete despacio y háblale bajito.",steps:[{ill:"catTowel",t:"Envuélvela en una toalla",d:"Deja la cabeza libre y sujeta con suavidad: la calma y protege tus manos."},{ill:"catBreath",t:"Cuenta su respiración",d:"En 30 segundos, multiplica por dos: lo normal son de 20 a 30 por minuto."},{ill:"catBleed",t:"Controla el sangrado",d:"Presiona con una gasa limpia, sin quitarla, y busca atención veterinaria."},{ill:"catCPR",t:"Sin respiración ni pulso",d:"Rodea su pecho con una mano y comprime de 100 a 120 veces por minuto."},{ill:"catCarrier",t:"Llévala en su transportadora",d:"Cúbrela con una toalla y mantenla nivelada al cargarla."}]}]},quiz:{q:"El sismo terminó. Cacao, tu perro mediano, se cortó una pata con un vidrio: sangra, está asustado y gruñe cuando te acercas. ¿Qué haces primero?",hint:"Toca una tarjeta para darle la vuelta y ver la respuesta.",opts:[{text:"Reviso que no haya más vidrios cerca y le pongo un bozal de emergencia con una venda. Luego presiono una gasa limpia sobre la herida, sin levantarla para mirar, y lo llevo con el veterinario.",ok:!0,fb:"Te proteges de una mordida, controlas el sangrado con presión directa y buscas atención veterinaria. Un perro asustado o con dolor puede morder, incluso a quien más quiere."},{text:"Lo abrazo fuerte para calmarlo, le saco el vidrio de un tirón y le lavo la herida con alcohol.",ok:!1,fb:"Sujetarlo sin protección puede terminar en una mordida, y sacar un objeto de golpe puede abrir más la herida. El alcohol lastima el tejido: lo mejor es presionar con una gasa limpia."},{text:"Espero a que se calme solo y reviso la herida mañana: si no se queja, no debe ser grave.",ok:!1,fb:"Una herida que sangra no debe esperar. El dolor y el susto a veces no se notan: presiona con una gasa limpia y busca a un veterinario cuanto antes."}],good:"Correcto",bad:"Esta no es la mejor opción",cta:"Continuar",wait:"Sigue probando hasta encontrar la respuesta correcta."},close:{words:["Conocer","Actuar","Cuidar"],kicker:"Simulacro completado",text:"Estar preparados puede marcar la diferencia. Conocer, actuar y cuidar también es una forma de proteger.",chips:["Kit de emergencia","Identificación y rastreo","Mantener la calma en el sismo","Primeros auxilios"],cta:"Finalizar"},about:{title:"Conoce un poco sobre nosotros",text:"PetAlert es una experiencia interactiva para enseñar a quienes viven con perros y gatos cómo actuar antes, durante y después de un sismo. Está pensada para practicar con calma, antes de que ocurra una emergencia.",cta:"Reiniciar experiencia"}},wn={cacao:{fur:"#d9a066",light:"#fff0d9",ear:"#a86a3a",nose:"#3b2a25"},husky:{fur:"#9fb0cc",light:"#ffffff",ear:"#5f6f8f",nose:"#2a2f3d"},nube:{fur:"#f4bb52",light:"#fff1cf"}},Gu=20,yr={intensity:.7,alarmSeconds:2.5,alarmVolume:.035},ii=Math.PI,O1=340,F1=-16,k1=.24,B1=.12,z1=.6,Ud=140,H1=.05,V1=1.4,G1=.6,Od={};function fn(i,e){let t=i+(e?JSON.stringify(e):"");return Od[t]||(Od[t]=new Nn(Object.assign({color:i,roughness:.78,metalness:0},e||{})))}function qt(i,e,t){let n=new je(i,e&&e.isMaterial?e:fn(e,t));return n.castShadow=!0,n.receiveShadow=!0,n}function nt(i,e,t,n,s,r){let a=qt(new Wo(i,20,14),e,r);return a.scale.set(t||1,n||1,s||1),a}function Rt(i,e,t,n,s){return qt(new Xn(i,e,t,s||16),n)}function z(i,e,t,n){return i.position.set(e,t,n),i}function De(i,e,t,n,s,r){let a=Math.max(.004,Math.min(n,i*.45,e*.45,t*.45)),o=i-2*a,c=e-2*a,l=Math.min(o,c)*.18,u=-o/2,h=-c/2,d=new tp;d.moveTo(u+l,h),d.lineTo(u+o-l,h),d.quadraticCurveTo(u+o,h,u+o,h+l),d.lineTo(u+o,h+c-l),d.quadraticCurveTo(u+o,h+c,u+o-l,h+c),d.lineTo(u+l,h+c),d.quadraticCurveTo(u,h+c,u,h+c-l),d.lineTo(u,h+l),d.quadraticCurveTo(u,h,u+l,h);let f=Math.max(.002,t-2*a),m=new Uu(d,{depth:f,bevelEnabled:!0,bevelThickness:a,bevelSize:a,bevelSegments:3,curveSegments:5});return m.translate(0,0,-f/2),qt(m,s,r)}function sn(i,e,t,n){let s=new It;return s.position.set(e,t,n),i.add(s),s}lt.enabled=!1;const js=$("#gl"),Ms=new U1({canvas:js,antialias:!0,alpha:!0});Ms.outputColorSpace=gn;Ms.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Ms.shadowMap.enabled=!0;Ms.shadowMap.type=_f;Ms.setClearColor(0,0);const Sn=new Vf,rr=new Vf,We=new mn(40,1,.1,120);We.rotation.order="YXZ";Object.assign(O,{scene:Sn});const nu=new lp("#eaf3ff","#e6d3b8",.62*ii),Ai=new Bu("#ffffff",.56*ii),Yo=new ba("#ffd9a0",.5*ii,7,0),Wu=new ba("#ffd9a0",0,9,0);Wu.position.set(-10.2,2.4,.5);Sn.add(nu,Ai,Yo,Wu,Ai.target);Ai.position.set(7,14,8);Ai.castShadow=!0;Ai.shadow.mapSize.set(ia?1024:2048,ia?1024:2048);Object.assign(Ai.shadow.camera,{left:-11,right:11,top:11,bottom:-11,near:1,far:40});Ai.shadow.bias=-6e-4;rr.add(new lp("#ffffff","#bcd4ff",.8*ii));const mp=new Bu("#ffffff",.62*ii);mp.position.set(3,7,6);rr.add(mp);function gp(){const i=innerWidth,e=innerHeight;Ms.setSize(i,e,!1),We.aspect=i/e,We.updateProjectionMatrix()}function Do(){let i=new tt,e="#4a8bdd",t=z(Rt(.62,.62,1.35,e,28),0,.75,0);t.scale.z=.62,i.add(t),i.add(z(nt(.62,e,1,.62,.62),0,1.42,0)),i.add(z(nt(.62,e,1,.35,.62),0,.1,0));let n=z(Rt(.45,.45,.7,"#6aa5f0",24),0,.5,.33);n.scale.z=.4,i.add(n);let s=z(Rt(.24,.24,.04,"#ffffff",24),0,1.02,.4);s.rotation.x=Math.PI/2,i.add(s),i.add(z(De(.3,.08,.03,.01,"#ff7a66"),0,1.02,.43)),i.add(z(De(.08,.3,.03,.01,"#ff7a66"),0,1.02,.43));let r=z(qt(new ni(.16,.04,8,16,Math.PI),"#14305e"),0,1.78,0);return i.add(r),i}function W1(i){let e=new tt;if(i==="water")e.add(z(qt(new Xn(.17,.17,.6,20),"#cdeeff",{transparent:!0,opacity:.85}),0,0,0)),e.add(z(Rt(.155,.155,.42,"#6fd6f0",20),0,-.08,0)),e.add(z(Rt(.1,.1,.08,"#dff5ff",16),0,.34,0)),e.add(z(Rt(.09,.09,.1,"#ff7a66",16),0,.42,0));else if(i==="food")e.add(De(.6,.75,.24,.08,"#ffc24d")),e.add(z(De(.38,.32,.02,.02,"#ffffff"),0,.05,.13)),e.add(z(nt(.07,"#8a5a33",1,.9,.4),0,.02,.15)),[-1,0,1].forEach(t=>e.add(z(nt(.03,"#8a5a33",1,1,.4),t*.07,.11+(t===0?.03:0),.15)));else if(i==="aid")e.add(De(.78,.56,.3,.08,"#ffffff")),e.add(z(De(.3,.08,.03,.01,"#ff7a66"),0,0,.16)),e.add(z(De(.08,.3,.03,.01,"#ff7a66"),0,0,.16)),e.add(z(qt(new ni(.14,.03,8,14,Math.PI),"#14305e"),0,.28,0));else if(i==="leash")e.add(qt(new ni(.28,.05,10,24),"#ff7a66")),e.add(z(qt(new ni(.13,.04,10,20),"#ff7a66"),.5,0,0)),e.add(z(Rt(.025,.025,.3,"#14305e",8),.29,0,0)).children[2].rotation.z=Math.PI/2;else if(i==="doc")e.add(De(.66,.82,.06,.03,"#9cc9cc")),e.add(z(De(.52,.66,.02,.01,"#ffffff"),0,.05,.05)),[.2,.08,-.04].forEach(t=>e.add(z(De(.34,.03,.01,.005,"#c9dbff"),0,t,.07)));else{let t=Rt(.055,.055,.5,"#fff0d9",12);t.rotation.z=Math.PI/2,e.add(t),[[-.25,.06],[-.25,-.06],[.25,.06],[.25,-.06]].forEach(n=>e.add(z(nt(.075,"#fff0d9"),n[0],n[1],0))),e.add(z(nt(.16,"#ff7a66"),.05,-.32,.1))}return e}function si(i){let e=document.createElement("canvas");e.width=e.height=64;let t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(20,48,94,.35)"),n.addColorStop(1,"rgba(20,48,94,0)"),t.fillStyle=n,t.fillRect(0,0,64,64);let s=new je(new nn(i*2,i*2),new Yt({map:new br(e),transparent:!0,depthWrite:!1}));return s.rotation.x=-Math.PI/2,s.position.y=.02,s}function X1(){let i=document.createElement("canvas");i.width=i.height=128;let e=i.getContext("2d");e.fillStyle="rgba(255,255,255,.95)",e.strokeStyle="#ff7a66",e.lineWidth=8,e.beginPath(),e.arc(64,70,38,0,7),e.fill(),e.stroke(),[[28,44,34,12,52,34],[100,44,94,12,76,34]].forEach(n=>{e.beginPath(),e.moveTo(n[0],n[1]),e.lineTo(n[2],n[3]),e.lineTo(n[4],n[5]),e.closePath(),e.fill(),e.stroke()}),e.fillStyle="#14305e",e.beginPath(),e.arc(50,68,5,0,7),e.arc(78,68,5,0,7),e.fill();let t=new D0(new Wf({map:new br(i),transparent:!0,depthTest:!1}));return t.scale.set(.9,.9,1),t.renderOrder=10,t}const Ge={walls:{},books:[],pics:[],colliders:[],plant:null,shade:null,dust:null,beacon:null,ceil:null,root:new tt};Sn.add(Ge.root);function Fd(){let i=document.createElement("canvas");i.width=256,i.height=256;let e=i.getContext("2d");e.fillStyle="#e8d2ae",e.fillRect(0,0,256,256);for(let n=0;n<8;n++)e.fillStyle=n%2?"#e2caa3":"#ecd8b6",e.fillRect(0,n*32,256,32),e.fillStyle="rgba(120,80,40,.22)",e.fillRect(0,n*32,256,2),e.fillRect(n*83%256,n*32,2,32);let t=new br(i);return t.wrapS=t.wrapT=Wi,t.repeat.set(5,3.6),t}function q1(){let i=Ge.root,e=(B,V,K,W)=>Ge.colliders.push({x0:B,x1:V,z0:K,z1:W}),t=new je(new nn(14,10),new Nn({map:Fd(),roughness:.9}));t.rotation.x=-Math.PI/2,t.receiveShadow=!0,i.add(t);let n=fn("#d6e4ff"),s=fn("#c8dbfc"),r=(B,V,K,W,ue,me,Te)=>{let Be=new je(new Wn(B,V,K),Te);return Be.position.set(W,ue,me),Be.receiveShadow=!0,i.add(Be),Be};r(14.6,3,.3,0,1.5,-5.15,n),r(.3,3,4.8,-7.15,1.5,-2.9,s),r(.3,3,3.8,-7.15,1.5,3.4,s),r(.3,.7,2,-7.15,2.65,.5,s),Ge.walls.front=r(14.6,3,.3,0,1.5,5.15,n),Ge.walls.right=r(.3,3,10.6,7.15,1.5,0,s),r(14,.14,.06,0,.07,-4.98,fn("#ffffff")),r(.06,.14,4.5,-6.98,.07,-2.75,fn("#ffffff")),r(.06,.14,3.5,-6.98,.07,3.25,fn("#ffffff")),Ge.ceil=new je(new nn(14.6,10.6),new Nn({color:"#f4f8ff",side:jt})),Ge.ceil.rotation.x=Math.PI/2,Ge.ceil.position.y=3,i.add(Ge.ceil),i.add(z(new je(new nn(2.2,1.5),new Yt({color:"#bfe6ff"})),2.2,1.75,-4.99)),i.add(z(De(2.4,.1,.12,.03,"#ffffff"),2.2,2.55,-4.95)),i.add(z(De(2.4,.1,.12,.03,"#ffffff"),2.2,.95,-4.95)),i.add(z(De(.1,1.7,.12,.03,"#ffffff"),1.05,1.75,-4.95)),i.add(z(De(.1,1.7,.12,.03,"#ffffff"),3.35,1.75,-4.95)),i.add(z(De(.06,1.6,.1,.02,"#ffffff"),2.2,1.75,-4.95)),i.add(z(De(.34,2.3,.1,.02,"#c48b5a"),-7.15,1.15,-.5)),i.add(z(De(.34,2.3,.1,.02,"#c48b5a"),-7.15,1.15,1.5)),i.add(z(De(.34,.1,2.1,.02,"#c48b5a"),-7.15,2.32,.5));let a=Ge.plug=new tt;i.add(a);let o=new je(new Wn(.3,2.3,2),s);o.position.set(-7.15,1.15,.5),o.receiveShadow=!0,a.add(o),a.add(z(De(.12,2.3,1.2,.04,"#c48b5a"),-6.97,1.15,.5)),a.add(z(nt(.06,"#ffc24d"),-6.88,1.1,.05)),e(-7.3,-7,-5.3,-.5),e(-7.3,-7,1.5,5.3),i.add(z(De(4.4,.04,3,.3,"#a9d9f2"),-.6,.02,1.8)),i.add(z(De(3.6,.045,2.2,.3,"#c9e9fa"),-.6,.025,1.8));let c=new tt;c.position.set(-4,0,-4.2),i.add(c),c.add(z(De(3.2,.45,1.3,.12,"#4f86dc"),0,.3,0)),c.add(z(De(3.2,.85,.36,.14,"#4a7fd0"),0,.78,-.5)),[-1,1].forEach(B=>{c.add(z(De(.36,.7,1.3,.14,"#4a7fd0"),B*1.42,.55,0)),c.add(z(De(1.2,.22,1,.09,"#79a6ee"),B*.62,.64,.06))});let l=z(De(.5,.45,.18,.08,"#ff8a6f"),1,.98,-.2);l.rotation.z=.25,l.rotation.y=-.3,c.add(l),e(-5.6,-2.4,-4.85,-3.55);let u=new tt;u.position.set(-.8,0,-4.75),i.add(u),u.add(z(De(1.6,.08,.45,.02,"#c48b5a"),0,.04,0)),u.add(z(De(1.6,.08,.45,.02,"#c48b5a"),0,2.2,0)),[-.76,.76].forEach(B=>u.add(z(De(.08,2.2,.45,.02,"#c48b5a"),B,1.1,0))),u.add(z(De(1.6,2.2,.04,.01,"#b57b4b"),0,1.1,-.2)),[.8,1.5].forEach(B=>u.add(z(De(1.6,.06,.45,.02,"#c48b5a"),0,B,0)));let h=["#ff7a66","#ffc24d","#6fd6f0","#4a8bdd","#9cc9cc","#ff8a6f","#c9dbff"];[.86,1.56,2.26].slice(0,2).forEach((B,V)=>{for(let K=0;K<5;K++){let W=De(.13,.42+(K+V)%3*.05,.3,.03,h[(K*2+V)%7]),ue=-.55+K*.26,me=B-.02+.21;W.position.set(ue,me,0),u.add(W),new T,Ge.books.push({m:W,home:W.position.clone(),homeRot:W.rotation.clone(),parent:u,delay:(V*5+K)*.1,state:0,v:new T,rv:new T})}}),e(-1.6,0,-5,-4.5),i.add(z(De(2,.9,.7,.06,"#dcae7d"),5,.45,-4.6)),i.add(z(De(.94,.7,.02,.01,"#c48b5a"),4.5,.47,-4.24)),i.add(z(De(.94,.7,.02,.01,"#c48b5a"),5.5,.47,-4.24)),e(4,6,-5,-4.2);let d=Do();d.scale.setScalar(.36),d.position.set(5,.9,-4.55),d.rotation.y=.12,i.add(d),Ge.kitBag=d;let f=new tt;f.position.set(5,2.35,-4.95),f.add(z(De(.95,.72,.06,.03,"#ffffff"),0,-.4,0)),f.add(z(new je(new nn(.78,.55),new Yt({color:"#9fd0f2"})),0,-.4,.04)),i.add(f),Ge.pics.push(f);let m=new tt;m.position.set(-6.94,2.3,-2.4),m.rotation.y=Math.PI/2,m.add(z(De(.9,.7,.06,.03,"#ffffff"),0,-.4,0)),m.add(z(new je(new nn(.74,.54),new Yt({color:"#ffd9a0"})),0,-.4,.04)),i.add(m),Ge.pics.push(m);let _=new tt;_.position.set(3.2,0,1.8),i.add(_),_.add(z(De(2.3,.12,1.3,.05,"#e6c199"),0,.85,0)),[[-1,-.5],[1,-.5],[-1,.5],[1,.5]].forEach(B=>_.add(z(Rt(.06,.06,.85,"#c48b5a",10),B[0]*1,.42,B[1]*.52))),e(2.05,4.35,1.15,2.45),[2.6,3.8].forEach(B=>{let V=new tt;V.position.set(B,0,.65),V.add(z(De(.6,.1,.6,.04,"#79a6ee"),0,.5,0)),V.add(z(De(.6,.6,.08,.04,"#79a6ee"),0,.85,-.26)),[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(K=>V.add(z(Rt(.035,.035,.5,"#c48b5a",8),K[0]*.24,.25,K[1]*.24))),i.add(V),e(B-.3,B+.3,.35,.95)});let g=new tt;g.position.set(-5.6,0,3.7),i.add(g),g.add(z(De(2.8,.35,2.2,.08,"#c48b5a"),0,.18,0)),g.add(z(De(2.7,.3,2.1,.1,"#f1f6ff"),0,.5,0)),g.add(z(De(1.5,.34,2.14,.1,"#9cc9cc"),.6,.52,0)),g.add(z(De(.6,.2,.9,.08,"#ffffff"),-1.05,.72,0)),g.add(z(De(.1,1,2.2,.04,"#b57b4b"),-1.4,.6,0)),e(-7,-4.2,2.6,4.8);let p=new tt;p.position.set(6.2,0,-4.2),i.add(p),p.add(z(Rt(.3,.24,.5,"#ff8a6f",16),0,.25,0)),[[0,.9,0,.42],[-.2,.7,.1,.3],[.22,.75,-.1,.3],[.05,1.15,.05,.28]].forEach(B=>p.add(z(nt(B[3],"#7cc8a0",1,1.2,1),B[0],B[1],B[2]))),Ge.plant=p,e(5.8,6.6,-4.6,-3.8);let M=new tt;M.position.set(-6.4,0,-4.4),i.add(M),M.add(z(Rt(.22,.26,.06,"#14305e",16),0,.03,0)),M.add(z(Rt(.03,.03,1.5,"#14305e",8),0,.78,0));let v=z(qt(new Xn(.22,.36,.42,20,1,!0),"#fff2d0",{emissive:"#ffd9a0",emissiveIntensity:.5,side:jt}),0,1.65,0);M.add(v),Ge.shade=v,Yo.position.set(-6.4,1.6,-4.4),e(-6.7,-6.1,-4.7,-4.1);let x=Ge.hall=new tt;x.visible=!1,i.add(x);let P=(B,V,K,W,ue,me,Te)=>{let Be=new je(new Wn(B,V,K),Te);return Be.position.set(W,ue,me),Be.receiveShadow=!0,x.add(Be),Be},A=Fd();A.repeat.set(2.4,1);let C=new je(new nn(6.3,2.6),new Nn({map:A,roughness:.9}));C.rotation.x=-Math.PI/2,C.position.set(-10.15,.005,.5),C.receiveShadow=!0,x.add(C);let L=new je(new nn(6.3,3.2),new Nn({color:"#f4f8ff",side:jt}));L.rotation.x=Math.PI/2,L.position.set(-10.3,3,.5),x.add(L),P(6.3,3,.3,-10.3,1.5,-.95,n),P(6.3,3,.3,-10.3,1.5,1.95,n),P(.3,3,3.2,-13.45,1.5,.5,s),P(6,.14,.06,-10.3,.07,-.78,fn("#ffffff")),P(6,.14,.06,-10.3,.07,1.78,fn("#ffffff")),P(.06,.14,2.6,-13.28,.07,.5,fn("#ffffff")),x.add(z(qt(new Xn(.34,.34,.05,24),"#fff2d0",{emissive:"#ffd9a0",emissiveIntensity:.8}),-10.3,2.96,.5)),x.add(z(De(.12,2.3,1.2,.04,"#e8917a"),-13.27,1.15,.5)),x.add(z(nt(.06,"#ffc24d"),-13.16,1.1,.05)),x.add(z(De(1.3,.03,.9,.02,"#4a7fd0"),-12.4,.03,.5)),x.add(z(De(1.5,.08,.42,.03,"#e6c199"),-9.4,.78,-.55)),x.add(z(De(1.4,.3,.38,.03,"#dcae7d"),-9.4,.6,-.55)),[-1,1].forEach(B=>[-1,1].forEach(V=>x.add(z(Rt(.03,.03,.76,"#c48b5a",8),-9.4+B*.68,.38,-.55+V*.16)))),x.add(z(Rt(.05,.07,.3,"#14305e",10),-9.9,.97,-.55)),x.add(z(qt(new Xn(.11,.16,.2,16,1,!0),"#fff2d0",{emissive:"#ffd9a0",emissiveIntensity:.5,side:jt}),-9.9,1.22,-.55)),x.add(z(Rt(.1,.08,.16,"#ff8a6f",12),-8.85,.9,-.55)),x.add(z(nt(.14,"#7cc8a0",1,1.2,1),-8.85,1.08,-.55)),x.add(z(De(.9,.7,.05,.03,"#ffffff"),-9.4,1.75,-.77)),x.add(z(new je(new nn(.74,.54),new Yt({color:"#9fd0f2"})),-9.4,1.75,-.74)),x.add(z(De(.9,.08,.06,.02,"#c48b5a"),-11.5,1.55,-.76)),x.add(z(qt(new ni(.13,.03,8,18),"#ff7a66"),-11.75,1.35,-.72)),x.add(z(qt(new ni(.1,.03,8,18),"#14305e"),-11.3,1.38,-.72)),x.add(z(De(1.3,.42,.42,.06,"#79a6ee"),-11.8,.21,1.55)),x.add(z(De(.14,.1,.3,.04,"#ff8a6f"),-12.1,.47,1.55)),x.add(z(De(.14,.1,.3,.04,"#ff8a6f"),-11.92,.47,1.55)),e(-13.6,-7.3,-1.1,-.8),e(-13.6,-7.3,1.8,2.1),e(-13.6,-13.3,-1.1,2.1),e(-10.15,-8.65,-.8,-.34),e(-12.45,-11.15,1.3,1.8);let E=140,S=new Float32Array(E*3);for(let B=0;B<E;B++)S[B*3]=Bt(-6.5,6.5),S[B*3+1]=Bt(0,3),S[B*3+2]=Bt(-4.5,4.5);let I=new Vt;I.setAttribute("position",new Jt(S,3)),Ge.dust=new Ho(I,new Ma({color:"#ffffff",size:.07,transparent:!0,opacity:0,depthWrite:!1})),Ge.dust.frustumCulled=!1,i.add(Ge.dust);let X=new tt,k=qt(new gr(.22,.5,4),"#ff7a66",{emissive:"#ff7a66",emissiveIntensity:.35});k.rotation.x=Math.PI,k.castShadow=!1,X.add(k);let q=new je(new Er(.5,.62,32),new Yt({color:"#ff7a66",transparent:!0,opacity:.8,side:jt}));q.rotation.x=-Math.PI/2,X.add(q),X.userData={cone:k,ring:q},X.visible=!1,Sn.add(X),Ge.beacon=X}function _p(i){Ti("#bg i").forEach(e=>e.classList.toggle("on",e.dataset.bg===i))}function iu(i){$("#timer").hidden=!i}function kd(i,e){let t=$("#timer");t.querySelector("b").textContent=Math.max(0,Math.ceil(i)),t.querySelector("u").style.transform="scaleX("+Kt(i/e,0,1)+")",t.classList.toggle("low",i<=5)}function zn(i,e){let t=$("#objective");if(!i){t.hidden=!0;return}$("strong",t).textContent=i,$("small",t).textContent=e||"",$("small",t).hidden=!e,t.hidden=!1}let Qr=null;function da(i){const e=$("#scrollHint");e.hidden=!i,e.classList.remove("quiet"),$("b",e).textContent=ia?Dt.scroll.hintTouch:Dt.scroll.hint,$("#tourRail").hidden=!i}function Y1(){const i=$("#moveHint"),e=Dt.controls;i.innerHTML=ia?'<span class="hl">'+e.touch+"</span>":'<span class="mk"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><i>'+e.or+'</i><span class="mk"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></span><span class="hl">'+e.move+'</span><span class="sep"></span><span class="mk"><kbd>E</kbd></span><span class="hl">'+e.act+"</span>",i.hidden=!1,i.classList.remove("go"),i.offsetWidth,i.classList.add("go")}function K1(){const i=$("#moveHint");i.hidden=!0,i.classList.remove("go")}function xp(){$("#scrollHint").classList.add("quiet")}function Xu(i,e){$("#tourRail i").style.transform="scaleY("+i.toFixed(3)+")",$("#vignette").style.opacity=(e*.9).toFixed(3),$("#scrollHint").classList.toggle("gone",e>.85)}function su(i,e){const t=$("#stopLabel");gs(),t.hidden=!1,t.classList.add("typing");const n=$("h2",t),s=$("p",t);let r=0;Qr=setInterval(()=>{r++,r<=i.length?n.textContent=i.slice(0,r):s.textContent=e.slice(0,r-i.length),r>=i.length+e.length&&(clearInterval(Qr),Qr=null)},26)}function gs(){clearInterval(Qr),Qr=null;const i=$("#stopLabel");i.hidden=!0,i.classList.remove("typing"),$("h2",i).textContent="",$("p",i).textContent=""}const j1=new ke("#eaf3ff"),Z1=new ke("#7f9ccc"),J1=new ke("#ffffff"),$1=new ke("#9fbfff"),No=[];function Q1(){let i=[new Wn(.22,.12,.18),new Wn(.14,.14,.14),new Wn(.3,.06,.2)],e=["#f4f8ff","#c9d5e8","#ffc24d","#ff8a6f","#9cc9cc"];for(let t=0;t<16;t++){let n=qt(i[t%3],e[t%5]);n.visible=!1,Ge.root.add(n),No.push({m:n,st:0,t:0,h:.07,v:new T,rv:new T})}}function eM(i){if(Ve.active&&O.mode!=="show"&&Ve.k>.25&&Math.random()<i*2){let e=No.find(t=>t.st===0);e&&(e.st=1,e.t=0,e.m.visible=!0,e.m.scale.setScalar(1),e.m.position.set(Bt(-6,6),3.2,Bt(-4.2,4.2)),e.v.set(Bt(-.4,.4),0,Bt(-.4,.4)),e.rv.set(Bt(-6,6),Bt(-4,4),Bt(-6,6)))}No.forEach(e=>{if(!e.st)return;let t=e.m;if(e.st===1)e.v.y-=9.8*i,t.position.addScaledVector(e.v,i),t.rotation.x+=e.rv.x*i,t.rotation.y+=e.rv.y*i,t.rotation.z+=e.rv.z*i,t.position.y<e.h&&(t.position.y=e.h,Math.abs(e.v.y)>2.2?(e.v.y*=-.28,e.v.x*=.5,e.v.z*=.5,e.rv.multiplyScalar(.4),Math.random()<.4&&ce.thud()):(e.st=2,e.t=0,e.v.set(0,0,0)));else if(e.st===2&&(e.t+=i,e.t>2)){let n=1-(e.t-2)/.5;t.scale.setScalar(Math.max(.001,n)),n<=0&&(e.st=0,t.visible=!1)}})}function vp(i){let e=0;Ge.books.forEach(t=>{t.state===0&&e<i&&(t.state=1,t.t=-t.delay,e++)})}function Ko(){Ge.books.forEach(i=>{i.state=0,i.m.position.copy(i.home),i.m.rotation.copy(i.homeRot),i.m.parent!==i.parent&&i.parent.add(i.m)})}function tM(i){Ge.books.forEach(e=>{if(e.state===1){if(e.t+=i,e.t>0){e.state=2;let t=new T;e.m.getWorldPosition(t),e.parent.remove(e.m),e.m.position.copy(t),Ge.root.add(e.m),e.v.set(Bt(-.6,.6),Bt(.3,1),Bt(.8,2)),e.rv.set(Bt(-5,5),Bt(-3,3),Bt(-5,5)),ce.crash()}}else e.state===2&&(e.v.y-=9.8*i,e.m.position.addScaledVector(e.v,i),e.m.rotation.x+=e.rv.x*i,e.m.rotation.z+=e.rv.z*i,e.m.position.y<.08&&(e.m.position.y=.08,e.state=3,e.m.rotation.set(Math.PI/2,Bt(0,6),Bt(-.4,.4))))})}function nM(i){let e=Ve.shakeK*mf,t=Ve.k;Ge.root.position.set((Math.random()-.5)*.06*e,0,(Math.random()-.5)*.06*e),Ge.pics.forEach((r,a)=>{r.rotation.z=Math.sin(O.time*7+a*2)*.22*t}),Ge.plant.rotation.z=Math.sin(O.time*11)*.06*t,Ge.shade.rotation.z=Math.sin(O.time*8)*.16*t;let n=t>.3?.55+.45*Math.abs(Math.sin(O.time*23)*Math.sin(O.time*7.3)):1;if(n=1-(1-n)*Math.min(1,Ve.shake),nu.color.copy(j1).lerp(Z1,t),nu.intensity=qr(.62,.38,t)*n*ii,Ai.color.copy(J1).lerp($1,t),Ai.intensity=qr(.56,.24,t)*n*ii,Yo.intensity=.5*ii*(t>.3?n:1),Ge.dust.material.opacity=Kt(t*1.3,0,.7),Ge.dust.visible=t>.02,Ge.dust.visible){let r=Ge.dust.geometry.attributes.position;for(let a=0;a<r.count;a++){let o=r.getY(a)-i*(.3+a%5*.15);o<0&&(o=3),r.setY(a,o)}r.needsUpdate=!0}let s=O.mode!=="show"&&Ve.k>.2;_p(O.bgOverride||(O.mode==="show"?"show":s?"dusk":"day")),$("#fx").classList.toggle("quake",Ve.k>.35&&Ve.shake>.6)}const Ve={active:!1,t:0,k:0,target:0,alarmT:0,shakeTarget:1,shakeK:0,shake:1};function qu(){Ve.active=!0,Ve.t=0,Ve.alarmT=0,Ve.target=yr.intensity,Ve.shakeTarget=1,ce.rumble(.6),ce.duck(.4),ce.crash(),vp(99),ce.alarmSet(yr.alarmVolume),O.onQuakePhase()}function yp(){Ve.active=!1,Ve.target=0,Ve.shakeTarget=1,ce.rumble(0),ce.duck(1),ce.alarmSet(0),No.forEach(i=>{i.st=0,i.m.visible=!1}),O.onQuakePhase()}function ru(i){let e=O.mode==="show";Ve.active&&!e&&(Ve.t+=i,Ve.alarmT+=i,Ve.shake>.5&&Math.random()<i*.6&&ce.creak());let t=Ve.active&&!e?Ve.target:0;Ve.k=kt(Ve.k,t,3,i),Ve.k<.002&&(Ve.k=0),Ve.shake=kt(Ve.shake,Ve.shakeTarget,2.5,i),Ve.shakeK=Ve.k*Ve.shake,ce.rumble(Ve.active&&!e?.6*Ve.shake:0);let n=Ve.active&&!e&&Ve.alarmT<yr.alarmSeconds?yr.alarmVolume:0;n!==ru.al&&(ru.al=n,ce.alarmSet(n));let s=$("#alarmTag");s&&(s.hidden=!(Ve.active&&!e&&O.mode!=="orbit"||Ve.active&&O.mode==="orbit"&&O.cur==="hub"))}const ae={active:!1,locked:!1,progress:0,vel:0,target:0,length:1,curve:null,look:new T,entryLook:null,lookAtStart:null,intro:null,closeFrom:.7,eye:V1,closeness:0,bob:0,mx:0,my:0,lookX:0,lookY:0,onProgress:null},vi=new T,Vc=new T,En=new T,Mp=new T,ro=new T,Gc=new T,Wc=new T(1,0,0),ao=(i,e,t)=>{const n=Kt((t-i)/(e-i),0,1);return n*n*(3-2*n)};function iM(i,e,t,n){const s=2/t,r=s*n,a=1/(1+r+.48*r*r+.235*r*r*r),o=i.progress-e,c=(i.vel+s*o)*n;return i.vel=(i.vel-s*c)*a,e+(o+c)*a}function Uo({path:i,look:e,startAt:t=0,closeFrom:n=.7,continueLook:s=!1,lookDown:r=.55,lookAtStart:a=null,introFrom:o=null,introTime:c=1.8,onProgress:l}){ae.curve=new Nu(i.map(u=>new T(u.x,0,u.z)),!1,"centripetal"),ae.length=ae.curve.getLength(),ae.entryLook=s?Mp.clone():null,ae.look.set(e[0],e[1],e[2]),ae.closeFrom=n,ae.lookAtStart=a?new T(...a):null,ae.intro=o?{from:new T(...o),t:0,dur:c}:null,ae.lookDown=r,ae.progress=ae.target=t,ae.vel=0,ae.closeness=0,ae.onProgress=l||null,ae.active=!0,ae.locked=!!ae.intro,Xu(t,0)}function Sp(){ae.locked=!0,ae.target=ae.progress,xp()}function sM(){ae.active=!1,ae.onProgress=null,ae.closeness=0,Ee.moving=!1,Xu(0,0)}function Yu(i){!ae.active||ae.locked||(i>0&&xp(),i=Kt(i,-Ud,Ud),ae.target=Kt(ae.target+i/(ae.length*O1),0,1))}function rM(){return ae.active?ae.closeness*F1:0}function aM(i){const e=ae.progress;ae.progress=iM(ae,ae.target,z1,i),Math.abs(ae.target-ae.progress)<2e-4&&Math.abs(ae.vel)<.002&&(ae.progress=ae.target,ae.vel=0);const t=ae.progress;ae.curve.getPointAt(t,vi),ae.curve.getPointAt(Math.min(1,t+.04),Vc),Gc.set(Vc.x-vi.x,0,Vc.z-vi.z),Gc.lengthSq()>1e-6&&Wc.copy(Gc.normalize());const n=ao(ae.closeFrom,.97,t);ae.closeness=n;const s=ae.eye;En.set(vi.x+Wc.x*6,s+H1*6,vi.z+Wc.z*6),En.x+=(ae.look.x-En.x)*n,En.z+=(ae.look.z-En.z)*n,En.y+=(ae.look.y-En.y)*n*ae.lookDown,ae.entryLook&&(En.lerpVectors(ae.entryLook,ae.look,ao(0,1,t)),ae.closeness=1),ae.lookAtStart&&(ro.copy(En),En.lerpVectors(ae.lookAtStart,ro,ao(.02,.3,t))),ae.intro&&(ae.intro.t+=i,ro.copy(En),En.lerpVectors(ae.intro.from,ro,ao(0,1,ae.intro.t/ae.intro.dur)),ae.intro.t>=ae.intro.dur&&(ae.intro=null,ae.locked=!1)),Mp.copy(En);const r=Math.abs(t-e)*ae.length/Math.max(i,.001);ae.bob+=i*9*Math.min(1,r/2);const a=Math.sin(ae.bob)*.03*Math.min(1,r/2)*(1-n);We.position.set(vi.x,ae.eye+a,vi.z),We.lookAt(En);const o=c=>Math.sign(c)*Math.abs(c)**1.5;ae.lookX=kt(ae.lookX,o(ae.mx),3,i),ae.lookY=kt(ae.lookY,o(ae.my),3,i),We.rotateY(-ae.lookX*k1),We.rotateX(-ae.lookY*B1),Ee.pos.set(vi.x,0,vi.z),Ee.moving=r>.2,Xu(t,n),ae.onProgress&&ae.onProgress(t)}function oM(){let i=new tt,e="#f2c9a5",t="#ff8a6f",n="#2b4c8c",s=i.userData;return[-1,1].forEach(r=>{let a=new tt;a.position.set(r*.11,.55,0),a.add(z(Rt(.088,.09,.27,n,12),0,-.135,0));const o=new tt;o.position.set(0,-.27,0),o.add(z(Rt(.085,.08,.25,n,12),0,-.125,0)),o.add(z(nt(.1,"#ffffff",1,.6,1.4),0,-.25,.04)),a.add(o),i.add(a),r<0?(s.legL=a,s.kneeL=o):(s.legR=a,s.kneeR=o);let c=new tt;c.position.set(r*.27,1.03,0),c.add(z(Rt(.06,.06,.42,t,10),0,-.19,0)),c.add(z(nt(.065,e),0,-.42,0)),i.add(c),r<0?s.armL=c:s.armR=c}),i.add(z(Rt(.2,.22,.5,t,16),0,.82,0)),i.add(z(nt(.21,t,1,.55,.85),0,1.06,0)),i.add(z(nt(.2,e),0,1.32,0)),i.add(z(nt(.215,"#5a3a2a",1,.75,1.02),0,1.38,-.03)),[-1,1].forEach(r=>i.add(z(nt(.024,"#1c2233"),r*.075,1.33,.18))),s.pack=z(De(.3,.4,.15,.05,"#ffc24d"),0,.86,-.25),i.add(s.pack),i}const Ku=[];function Oi(i){let e=new tt,t=e.userData;t.type="dog",t.base=new T,t.wag=1,t.shiver=0,t.hop=0,t.ph=Math.random()*6,e.add(z(nt(.42,i.fur,.9,1.15,.95),0,.5,-.05)),e.add(z(nt(.3,i.light,.95,1.1,.8),0,.6,.14)),[-1,1].forEach(c=>{e.add(z(nt(.27,i.fur,1,1,1.05),c*.27,.27,-.17)),e.add(z(Rt(.085,.085,.55,i.fur,12),c*.15,.3,.24)),e.add(z(nt(.11,i.light,1,.7,1.3),c*.15,.06,.3))});let n=new tt;n.position.set(0,1.02,.12),e.add(n),t.head=n,n.add(nt(.3,i.fur)),n.add(z(nt(.15,i.light,1,.8,1.25),0,-.08,.27)),n.add(z(nt(.055,i.nose,1.2,.85,1),0,-.02,.42)),n.add(z(nt(.05,"#ff8f9e",.8,.3,1),0,-.15,.36)),t.eyes=[],[-1,1].forEach(c=>{let l=z(nt(.05,"#1c2233"),c*.11,.07,.26);l.add(z(nt(.016,"#ffffff"),.015,.02,.04)),n.add(l),t.eyes.push(l);let u=z(nt(1,i.ear,.09,.2,.14),c*.25,.06,-.02);u.rotation.z=-c*.35,n.add(u)});let s=z(qt(new ni(.2,.035,10,24),"#ff7a66"),0,.86,.14);s.rotation.x=Math.PI/2,e.add(s);let r=z(Rt(.06,.06,.02,"#ffc24d",16),0,.74,.36);r.rotation.x=Math.PI/2,e.add(r),e.add(z(De(.12,.09,.06,.02,"#4a8bdd"),.21,.85,.06));let a=new tt;a.position.set(0,.14,-.38);let o=Rt(.045,.06,.5,i.fur,10);return o.position.set(0,.2,-.1),o.rotation.x=-.5,a.add(o),e.add(a),t.tail=a,t.anchors={neck:sn(e,0,.86,.3),back:sn(e,0,.95,-.3),paws:sn(e,0,.12,.42),rear:sn(e,0,.35,-.55),head:sn(e,0,1.55,.1),tag:sn(e,0,.74,.42),gps:sn(e,.24,.86,.08),chip:sn(e,0,1,-.15)},Ku.push(e),e}function Zs(i){let e=new tt,t=e.userData;t.type="cat",t.base=new T,t.wag=1,t.shiver=0,t.hop=0,t.ph=Math.random()*6;let n={emissive:i.fur,emissiveIntensity:.12};e.add(z(nt(.3,i.fur,.95,1.15,.95,n),0,.38,-.03)),e.add(z(nt(.22,i.light,.9,1,.8),0,.4,.14)),[-1,1].forEach(l=>{e.add(z(nt(.2,i.fur,1,1,1.05,n),l*.2,.2,-.16)),e.add(z(Rt(.055,.055,.36,i.fur,10),l*.11,.2,.2)),e.add(z(nt(.075,i.light,1,.7,1.3),l*.11,.05,.25))});let s=new tt;s.position.set(0,.86,.1),e.add(s),t.head=s,s.add(nt(.25,i.fur,1.1,.95,1,n)),s.add(z(nt(.09,i.light,1.2,.8,1),0,-.07,.2)),s.add(z(nt(.03,"#ff9aa8"),0,-.02,.28)),t.eyes=[],[-1,1].forEach(l=>{let u=z(qt(new gr(.1,.2,4),i.fur),l*.15,.22,0);u.rotation.z=-l*.25,s.add(u);let h=z(qt(new gr(.055,.13,4),"#ffb3a6"),l*.15,.21,.03);h.rotation.z=-l*.25,s.add(h);let d=z(nt(.055,"#2f8f6d"),l*.1,.05,.2);d.add(z(nt(.026,"#10151f",.6,1.3,.6),0,0,.04)),s.add(d),t.eyes.push(d)});const r=z(qt(new ni(.23,.03,10,28),"#ff7a66"),0,.68,.1);r.rotation.x=Math.PI/2,e.add(r);const a=z(Rt(.05,.05,.015,"#ffc24d",16),0,.61,.33);a.rotation.x=Math.PI/2,e.add(a),e.add(z(De(.09,.07,.05,.015,"#4a8bdd"),.23,.68,.1));let o=new tt,c=new Nu([new T(0,.16,-.28),new T(0,.1,-.55),new T(0,.28,-.72),new T(0,.55,-.62),new T(0,.72,-.45)]);return o.add(qt(new Ou(c,20,.05,8,!1),i.fur)),e.add(o),t.tail=o,t.anchors={neck:sn(e,0,.66,.22),back:sn(e,0,.62,-.25),paws:sn(e,0,.1,.3),rear:sn(e,0,.35,-.45),head:sn(e,0,1.22,.1),tag:sn(e,0,.62,.36),gps:sn(e,.26,.68,.1),chip:sn(e,0,.74,-.14)},Ku.push(e),e}const Ct={},au=new T(0,1.5,.1),cn={};function cM(){let i=new je(new Xn(4.2,4.4,.16,48),new Nn({color:"#f6faff",roughness:.9}));i.position.y=-.08,i.receiveShadow=!0,rr.add(i);let e=new je(new Er(3.5,3.62,48),new Yt({color:"#6fd6f0",transparent:!0,opacity:.7,side:jt}));e.rotation.x=-Math.PI/2,e.position.y=.01,rr.add(e);let t=m=>{let _=new tt;return _.visible=!1,rr.add(_),Ct[m]=_,_},n=t("pets");n.dog=Oi(wn.cacao),n.cat=Zs(wn.nube),n.add(n.dog,n.cat),bt(n.dog,-1.3,0,0,.35,1.5),bt(n.cat,1.4,0,0,-.35,1.65),n.add(z(si(1.2),-1.3,0,0),z(si(1.1),1.4,0,0)),n=t("kit");let s=Do();n.add(s,z(si(1.2),0,0,0)),n.bag=s,n.lid=s.children[1],n.handle=s.children[7],n.bagAnchor=sn(s,0,1.3,0),n.open=0,n.lidTarget=0,n.intro=1,n.items=[],[["water",-2.1,1.7],["food",2.1,1.7],["aid",-2.2,.3],["leash",1.9,.3],["doc",0,2.6],["toy",0,.35]].forEach((m,_)=>{let g=W1(m[0]),p=m[0]==="toy"?1.5:.2;g.position.set(m[1],m[2],p),g.userData={base:new T(m[1],m[2],p),ph:_*1.3,sel:!1,stage:"out",t:0},m[0]==="doc"&&g.scale.setScalar(1.15),n.add(g),g.userData.anchor=sn(g,0,0,0),n.items.push(g)}),n=t("bag");let r=Do();r.scale.setScalar(1.25),n.add(r,z(si(1.6),0,0,0)),n=t("track"),n.dog=Oi(wn.cacao),n.add(n.dog,z(si(1.6),0,0,0)),bt(n.dog,0,0,0,.25,2.1),n=t("trackCat"),n.cat=Zs(wn.nube),n.add(n.cat,z(si(1.6),0,0,0)),bt(n.cat,0,0,0,.25,2.7),n=t("sizes"),n.large=Oi(wn.husky),n.medium=Oi(wn.cacao),n.cat=Zs(wn.nube),n.add(n.large,n.medium,n.cat),n.shadow=si(1.3),n.add(n.shadow),n.baseS={large:1.4,medium:1,cat:1.3},n=t("cHide"),n.dog=Oi(wn.cacao),n.add(n.dog),bt(n.dog,0,0,0,-.2,2),n.dog.scale.y=1.5,n.add(z(De(5.4,.3,3.4,.1,"#e6c199"),0,2.75,-.3)),[-2.4,2.4].forEach(m=>n.add(z(Rt(.14,.14,2.75,"#c48b5a",10),m,1.37,-.9))),n=t("cStill"),n.dog=Oi(wn.cacao),n.add(n.dog,z(si(1.6),0,0,0)),bt(n.dog,0,0,0,.15,2.1),n=t("cCat"),n.cat=Zs(wn.nube),n.add(n.cat),bt(n.cat,0,0,.3,-Math.PI/2,2.4),n.add(z(De(.2,4.6,3.4,.05,"#c48b5a"),-2.2,2.3,0)),n.add(z(nt(.14,"#ffc24d"),-2.05,2.1,1.2)),n=t("fin"),n.dog=Oi(wn.cacao),n.cat=Zs(wn.nube),n.add(n.dog,n.cat),bt(n.dog,-.95,0,.3,.45,1.7),bt(n.cat,.95,0,.45,-.45,1.9),n.add(z(si(1.9),-.95,0,.3),z(si(1.6),.95,0,.45));let a=document.createElement("canvas");a.width=a.height=256;let o=a.getContext("2d"),c=o.createRadialGradient(128,128,0,128,128,128);c.addColorStop(0,"rgba(255,214,140,.95)"),c.addColorStop(.35,"rgba(255,170,120,.4)"),c.addColorStop(1,"rgba(255,170,120,0)"),o.fillStyle=c,o.fillRect(0,0,256,256);let l=new je(new nn(14,14),new Yt({map:new br(a),transparent:!0,opacity:.4,depthWrite:!1,blending:cr}));l.position.set(0,2,-3),n.add(l);let u=130,h=new Float32Array(u*3);for(let m=0;m<u;m++)h[m*3]=Bt(-5.5,5.5),h[m*3+1]=Bt(-.2,6),h[m*3+2]=Bt(-3,2.5);let d=new Vt;d.setAttribute("position",new Jt(h,3)),n.motes=new Ho(d,new Ma({color:"#ffd27a",size:.12,transparent:!0,opacity:.5,depthWrite:!1,blending:cr})),n.motes.frustumCulled=!1,n.add(n.motes);let f=new ba("#ffcf7a",.55*ii,16,0);f.position.set(0,3.5,3.5),n.add(f),cn.fin={t:[0,1.35,0],d:8.6,sway:.22},cn.pets={t:[0,1,0],d:7.6,sway:.35},cn.kit={t:[0,1.15,0],d:9.6,sway:.28},cn.bag={t:[0,3.6,0],d:9.5,sway:.25},cn.trackCat={t:[0,1.25,0],d:7.4,sway:.4},cn.track={t:[0,1.35,0],d:7.4,sway:.4},cn.sizes={t:[0,1,0],d:11.2,sway:.15},cn.one={t:[0,1.2,0],d:7.6,sway:.35},cn.cHide={t:[0,1.15,0],d:8.2,sway:.12},cn.cStill={t:[0,1.3,0],d:7.6,sway:.25},cn.cCat={t:[0,1.2,0],d:8,sway:.1},cn.quiz={t:[0,-.9,0],d:8.4,sway:.3},cn.far={t:[0,.9,0],d:8.4,sway:.4}}function lM(i){let e=Ct.sizes,t={large:-2.6,medium:0,cat:2.6};["large","medium","cat"].forEach(n=>{let s=e[n];s.userData;let r=e.baseS[n],a=i===n;s.visible=!i;let o=a?0:t[n],c=a?r*1.45:r;bt(s,o,0,0,a?.3:n==="large"?.5:n==="cat"?-.5:0,c)}),e.shadow.position.x=0,e.shadow.scale.setScalar(3.2)}function uM(){const i=Ct.kit;i.open=0,i.lidTarget=0,i.intro=0,i.items.forEach(e=>{e.userData.stage="in",e.userData.t=0,e.userData.sel=!1,e.visible=!1,e.scale.setScalar(.001),e.position.copy(au)})}function hM(i=1.6){Ct.kit.items.forEach((e,t)=>{e.userData.stage="emerging",e.userData.t=-(i+t*.35)/.9})}function Xc(i){Ct.kit.lidTarget=i?1:0}function dM(i){const e=Ct.kit.items[i];e.userData.stage="storing",e.userData.t=0,e.userData.sel=!1,e.userData.from=e.position.clone()}let xe,ge,Je;const ju=[],ea=[[-6.2,0,.5],[-5.4,.65,3.5],[4.3,.9,-4.6]];function bt(i,e,t,n,s,r){let a=i.userData;a.path=null,a.walking=!1,a.pop=null,a.ty=null,a.faceTo=null,a.sc=r||1,a.base.set(e,t,n),i.position.set(e,t,n),i.rotation.y=s||0,i.scale.setScalar(r||1),i.scale.y=r||1}function Hi(i,e,t){let n=i.userData;n.path=e.map(s=>Object.assign({},s)),n.speed=t||3.4,n.walking=!0,n.faceTo=null}function ot(i,e){let t=i.userData;t.wag=e.wag!=null?e.wag:1,t.shiver=e.shiver||0,t.eyes.forEach(n=>n.scale.setScalar(e.eyes||1))}function fM(){xe=Oi(wn.cacao),ge=Zs(wn.nube),Je=oM(),Je.visible=!1,Sn.add(xe,ge,Je),ea.forEach(i=>{let e=X1();e.position.set(i[0],i[1]+1.4,i[2]),e.visible=!1,Sn.add(e),ju.push(e)})}function pM(i){if(Ku.forEach(e=>{let t=e.userData;if(t.path&&t.path.length){let s=t.path[0];t.ty=s.y||0;let r=s.x-t.base.x,a=s.z-t.base.z,o=Math.hypot(r,a),c=t.speed*i;o<=c?(t.base.x=s.x,t.base.z=s.z,t.path.shift(),t.path.length||(t.walking=!1,t.faceTo=s.ry!=null?s.ry:null)):(t.base.x+=r/o*c,t.base.z+=a/o*c,e.rotation.y+=ll(e.rotation.y,Math.atan2(r,a))*Math.min(1,i*10))}else t.faceTo!=null&&(e.rotation.y+=ll(e.rotation.y,t.faceTo)*Math.min(1,i*8));if(t.ty!=null&&(t.base.y=kt(t.base.y,t.ty,7,i)),t.pop!=null){t.pop=Math.min(1,t.pop+i*2.4);let s=t.pop-1,r=1+2.70158*s*s*s+1.70158*s*s,a=(t.sc||1)*Math.max(.001,r);e.scale.set(a,a,a),t.pop>=1&&(t.pop=null)}t.type==="dog"&&t.tail?t.tail.rotation.z=Math.sin(O.time*9+t.ph)*.5*t.wag:t.tail&&(t.tail.rotation.y=Math.sin(O.time*3+t.ph)*.35*t.wag),t.head&&!(t.shiver>.3)?(t.head.rotation.y=Math.sin(O.time*.8+t.ph)*.25,t.head.rotation.z=Math.sin(O.time*1.3+t.ph)*.05):t.head&&(t.head.rotation.y=Math.sin(O.time*2+t.ph)*.12,t.head.rotation.z=0),e.position.x=t.base.x+(t.shiver?Math.sin(O.time*55+t.ph)*.012*t.shiver*e.scale.x:0),e.position.z=t.base.z;let n=t.walking?Math.abs(Math.sin(O.time*(t.run?22:13)+t.ph))*(t.run?.17:.07)*e.scale.x:0;t.hop>0?(t.hop=Math.max(0,t.hop-i*2.2),e.position.y=t.base.y+n+Math.sin((1-t.hop)*Math.PI)*.35*e.scale.x):e.position.y=t.base.y+n}),Ct.fin&&Ct.fin.visible){let e=Ct.fin.motes.geometry.attributes.position;for(let t=0;t<e.count;t++){let n=e.getY(t)+i*(.28+t%5*.09);n>6&&(n=-.2),e.setY(t,n),e.setX(t,e.getX(t)+Math.sin(O.time*.8+t)*.002)}e.needsUpdate=!0}if(Ct.kit&&Ct.kit.visible){const e=Ct.kit;let t=0;e.items.forEach(a=>{const o=a.userData;if(o.stage==="in"||o.stage==="stored"){a.visible=!1;return}if(o.stage==="emerging"||o.stage==="storing"){const l=o.stage==="emerging";if(o.t+=i/(l?.9:.6),o.t<0){a.visible=!1;return}a.visible=!0;const u=Math.min(1,o.t);if(l){const h=mM(u);a.position.lerpVectors(au,o.base,h),a.position.y+=Math.sin(u*Math.PI)*.9,a.scale.setScalar(Math.max(.001,h))}else{const h=u*u*(3-2*u);a.position.lerpVectors(o.from,au,h),a.position.y+=Math.sin(u*Math.PI)*.5,a.scale.setScalar(Math.max(.001,1-h))}a.rotation.y+=i*3,t=Math.max(t,Math.sin(Math.min(1,u*2)*Math.PI)),u>=1&&(o.stage=l?"out":"stored",l||(a.visible=!1));return}a.position.y=o.base.y+Math.sin(O.time*1.6+o.ph)*.08,a.rotation.y+=i*.6;const c=kt(a.scale.x,o.sel?1.35:a.children.length&&o.base.y===2.6?1.15:1,8,i);a.scale.setScalar(c)}),e.intro=Math.min(1,e.intro+i/1.5);const n=e.intro,s=Math.min(1,n/.45),r=Math.min(1,Math.max(0,(n-.45)/.55));e.bag.position.y=n<.45?2.6*(1-s*s):.35*Math.sin(r*Math.PI)*(1-r),e.bag.rotation.y=(1-(1-(1-n)**3))*Math.PI*2,n>=.45&&r<.35&&(t=Math.max(t,1.6*Math.sin(r/.35*Math.PI))),e.open=kt(e.open,e.lidTarget,7,i),e.lid.position.set(0,1.42+.5*e.open,-.3*e.open),e.lid.rotation.x=-1*e.open,e.handle.position.set(0,1.78+.5*e.open,-.3*e.open),e.handle.rotation.x=-1*e.open,e.bag.scale.set(1+.05*t,1-.06*t,1+.05*t)}}const mM=i=>1+2.70158*(i-1)**3+1.70158*(i-1)**2,Ee={pos:new T(0,0,3.5),yaw:0,pitch:0,moving:!1,vx:0,vz:0,walked:0,face:0,bob:0},jo=new Set,Fi={x:0,y:0},gM={x0:-7.3,x1:-7,z0:-.5,z1:1.5};function _M(i){i.x=Kt(i.x,Ge.hallOn?-13:-6.6,6.6),i.z=Kt(i.z,-4.6,4.6);let e=t=>{let n=Kt(i.x,t.x0,t.x1),s=Kt(i.z,t.z0,t.z1),r=i.x-n,a=i.z-s,o=r*r+a*a;if(o<.35*.35)if(o>1e-6){let c=Math.sqrt(o);i.x=n+r/c*.35,i.z=s+a/c*.35}else{let c=i.x-t.x0,l=t.x1-i.x,u=i.z-t.z0,h=t.z1-i.z,d=Math.min(c,l,u,h);d===c?i.x=t.x0-.35:d===l?i.x=t.x1+.35:d===u?i.z=t.z0-.35:i.z=t.z1+.35}};Ge.colliders.forEach(e),Ge.hallOn||e(gM)}function Zu(i,e,t){Ee.locked=!1,Ee.pos.set(i,0,e),Ee.yaw=0,Ee.pitch=0,Ee.walked=0,Ee.vx=0,Ee.vz=0,Ee.face=Math.PI*.75}function xM(i){if(O.mode!=="fp"&&O.mode!=="tp"||ae.active)return;const e=h=>jo.has(h);let t=(e("KeyW")||e("ArrowUp")?1:0)-(e("KeyS")||e("ArrowDown")?1:0)-Fi.y,n=(e("KeyD")?1:0)-(e("KeyA")?1:0)+Fi.x;O.mode==="tp"?n+=(e("ArrowRight")?1:0)-(e("ArrowLeft")?1:0):Ee.yaw+=((e("ArrowLeft")?1:0)-(e("ArrowRight")?1:0))*i*1.9,Ee.locked&&(t=0,n=0);const s=Math.hypot(t,n);s>1&&(t/=s,n/=s);let r=O.mode==="fp"?3.1:4.4;Ve.active&&(r*=.9);let a,o;O.mode==="fp"?(a=-Math.sin(Ee.yaw)*t+Math.cos(Ee.yaw)*n,o=-Math.cos(Ee.yaw)*t-Math.sin(Ee.yaw)*n):(a=(-t+n)*.7071,o=(-t-n)*.7071);const c=s>.06,l=c?16:22;Ee.vx=kt(Ee.vx,c?a*r:0,l,i),Ee.vz=kt(Ee.vz,c?o*r:0,l,i);const u=Math.hypot(Ee.vx,Ee.vz);if(Ee.moving=u>.35,Ee.moving){const h=Ee.pos.x,d=Ee.pos.z;Ee.pos.x+=Ee.vx*i,Ee.pos.z+=Ee.vz*i,_M(Ee.pos);const f=Math.hypot(Ee.pos.x-h,Ee.pos.z-d);f<u*i*.5&&(Ee.vx*=.5,Ee.vz*=.5),Ee.walked+=f,Ee.bob+=i*(O.mode==="fp"?9:12)*Math.min(1,u/r+.3),O.mode==="tp"&&(Ee.face+=ll(Ee.face,Math.atan2(Ee.vx,Ee.vz))*Math.min(1,i*14))}if(O.mode==="tp"){Je.position.set(Ee.pos.x,0,Ee.pos.z),Je.rotation.y=Ee.face;const h=Ee.moving?Math.sin(Ee.bob)*.7:0,d=Je.userData;d.legL.rotation.x=h,d.legR.rotation.x=-h,d.armL.rotation.x=-h*.8,d.armR.rotation.x=h*.8,Je.scale.y=kt(Je.scale.y,1,14,i)}}function Bd(i,e){if(e===Lm)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Yl||e===Lf){let t=i.getIndex();if(t===null){const a=[],o=i.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);i.setIndex(a),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===Yl)for(let a=1;a<=n;a++)s.push(t.getX(0)),s.push(t.getX(a)),s.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(s.push(t.getX(a)),s.push(t.getX(a+1)),s.push(t.getX(a+2))):(s.push(t.getX(a+2)),s.push(t.getX(a+1)),s.push(t.getX(a)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class vM extends Ar{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new EM(t)}),this.register(function(t){return new TM(t)}),this.register(function(t){return new NM(t)}),this.register(function(t){return new UM(t)}),this.register(function(t){return new OM(t)}),this.register(function(t){return new AM(t)}),this.register(function(t){return new RM(t)}),this.register(function(t){return new CM(t)}),this.register(function(t){return new PM(t)}),this.register(function(t){return new bM(t)}),this.register(function(t){return new LM(t)}),this.register(function(t){return new wM(t)}),this.register(function(t){return new DM(t)}),this.register(function(t){return new IM(t)}),this.register(function(t){return new MM(t)}),this.register(function(t){return new FM(t)}),this.register(function(t){return new kM(t)})}load(e,t,n,s){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=$r.extractUrlBase(e);a=$r.resolveURL(l,this.path)}else a=$r.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new cp(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(u){t(u),r.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===bp){try{a[at.KHR_BINARY_GLTF]=new BM(e)}catch(h){s&&s(h);return}r=JSON.parse(a[at.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new $M(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](l);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const h=r.extensionsUsed[u],d=r.extensionsRequired||[];switch(h){case at.KHR_MATERIALS_UNLIT:a[h]=new SM;break;case at.KHR_DRACO_MESH_COMPRESSION:a[h]=new zM(r,this.dracoLoader);break;case at.KHR_TEXTURE_TRANSFORM:a[h]=new HM;break;case at.KHR_MESH_QUANTIZATION:a[h]=new VM;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function yM(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const at={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class MM{constructor(e){this.parser=e,this.name=at.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const u=new ke(16777215);c.color!==void 0&&u.setRGB(c.color[0],c.color[1],c.color[2],gn);const h=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Bu(u),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new ba(u),l.distance=h;break;case"spot":l=new Ng(u),l.distance=h,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Mi(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class SM{constructor(){this.name=at.KHR_MATERIALS_UNLIT}getMaterialType(){return Yt}extendParams(e,t,n){const s=[];e.color=new ke(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],gn),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,ln))}return Promise.all(s)}}class bM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class EM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new oe(o,o)}return Promise.all(r)}}class TM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class wM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(r)}}class AM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new ke(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=s.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],gn)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,ln)),a.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(r)}}class RM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(r)}}class CM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new ke().setRGB(o[0],o[1],o[2],gn),Promise.all(r)}}class PM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class LM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new ke().setRGB(o[0],o[1],o[2],gn),a.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,ln)),Promise.all(r)}}class IM{constructor(e){this.parser=e,this.name=at.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(r)}}class DM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ui}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],a=s.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(r)}}class NM{constructor(e){this.parser=e,this.name=at.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class UM{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class OM{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=s.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class FM{constructor(e){this.name=at.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const c=s.byteOffset||0,l=s.byteLength||0,u=s.count,h=s.byteStride,d=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,d,s.mode,s.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(f),u,h,d,s.mode,s.filter),f})})}else return null}}class kM{constructor(e){this.name=at.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==kn.TRIANGLES&&l.mode!==kn.TRIANGLE_STRIP&&l.mode!==kn.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(u=>(c[l]=u,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const u=l.pop(),h=u.isGroup?u.children:[u],d=l[0].count,f=[];for(const m of h){const _=new $e,g=new T,p=new ei,M=new T(1,1,1),v=new k0(m.geometry,m.material,d);for(let x=0;x<d;x++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,x),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,x),c.SCALE&&M.fromBufferAttribute(c.SCALE,x),v.setMatrixAt(x,_.compose(g,p,M));for(const x in c)if(x==="_COLOR_0"){const P=c[x];v.instanceColor=new jl(P.array,P.itemSize,P.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&m.geometry.setAttribute(x,c[x]);It.prototype.copy.call(v,m),this.parser.assignFinalMaterial(v),f.push(v)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const bp="glTF",Hr=12,zd={JSON:1313821514,BIN:5130562};class BM{constructor(e){this.name=at.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Hr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==bp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Hr,r=new DataView(e,Hr);let a=0;for(;a<s;){const o=r.getUint32(a,!0);a+=4;const c=r.getUint32(a,!0);if(a+=4,c===zd.JSON){const l=new Uint8Array(e,Hr+a,o);this.content=n.decode(l)}else if(c===zd.BIN){const l=Hr+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class zM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=at.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const u in a){const h=ou[u]||u.toLowerCase();o[h]=a[u]}for(const u in e.attributes){const h=ou[u]||u.toLowerCase();if(a[u]!==void 0){const d=n.accessors[e.attributes[u]],f=ar[d.componentType];l[h]=f.name,c[h]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(h,d){s.decodeDracoFile(u,function(f){for(const m in f.attributes){const _=f.attributes[m],g=c[m];g!==void 0&&(_.normalized=g)}h(f)},o,l,gn,d)})})}}class HM{constructor(){this.name=at.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class VM{constructor(){this.name=at.KHR_MESH_QUANTIZATION}}class Ep extends Sa{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,u=s-t,h=(n-t)/u,d=h*h,f=d*h,m=e*l,_=m-l,g=-2*f+3*d,p=f-d,M=1-g,v=p-d+h;for(let x=0;x!==o;x++){const P=a[_+x+o],A=a[_+x+c]*u,C=a[m+x+o],L=a[m+x]*u;r[x]=M*P+v*A+g*C+p*L}return r}}const GM=new ei;class WM extends Ep{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return GM.fromArray(r).normalize().toArray(r),r}}const kn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ar={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Hd={9728:Mn,9729:Dn,9984:yf,9985:_o,9986:Gr,9987:Si},Vd={33071:Bi,33648:wo,10497:Wi},qc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ou={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ui={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},XM={CUBICSPLINE:void 0,LINEAR:aa,STEP:ra},Yc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function qM(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Nn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ai})),i.DefaultMaterial}function ss(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Mi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function YM(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,u=e.length;l<u;l++){const h=e[l];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(s=!0),h.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const a=[],o=[],c=[];for(let l=0,u=e.length;l<u;l++){const h=e[l];if(n){const d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):i.attributes.position;a.push(d)}if(s){const d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):i.attributes.normal;o.push(d)}if(r){const d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const u=l[0],h=l[1],d=l[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=h),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function KM(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function jM(i){let e;const t=i.extensions&&i.extensions[at.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Kc(t.attributes):e=i.indices+":"+Kc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Kc(i.targets[n]);return e}function Kc(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function cu(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ZM(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const JM=new $e;class $M{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new yM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new Ig(this.options.manager):this.textureLoader=new Fg(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new cp(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return ss(r,o,s),Mi(o,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const a=t[s].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,u]of a.children.entries())r(u,o.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[at.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,a){n.load($r.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const a=qc[s.type],o=ar[s.componentType],c=s.normalized===!0,l=new o(s.count*a);return Promise.resolve(new Jt(l,a,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],c=qc[s.type],l=ar[s.componentType],u=l.BYTES_PER_ELEMENT,h=u*c,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0;let _,g;if(f&&f!==h){const p=Math.floor(d/f),M="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let v=t.cache.get(M);v||(_=new l(o,p*f,s.count*f/u),v=new Gf(_,f/u),t.cache.add(M,v)),g=new ca(v,c,d%f/u,m)}else o===null?_=new l(s.count*c):_=new l(o,d,s.count*c),g=new Jt(_,c,m);if(s.sparse!==void 0){const p=qc.SCALAR,M=ar[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,x=s.sparse.values.byteOffset||0,P=new M(a[1],v,s.sparse.count*p),A=new l(a[2],x,s.sparse.count*c);o!==null&&(g=new Jt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,L=P.length;C<L;C++){const E=P[C];if(g.setX(E,A[C*c]),c>=2&&g.setY(E,A[C*c+1]),c>=3&&g.setZ(E,A[C*c+2]),c>=4&&g.setW(E,A[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const s=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return u.magFilter=Hd[d.magFilter]||Dn,u.minFilter=Hd[d.minFilter]||Si,u.wrapS=Vd[d.wrapS]||Wi,u.wrapT=Vd[d.wrapT]||Wi,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Mn&&u.minFilter!==Dn,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const a=s.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(h){l=!0;const d=new Blob([h],{type:a.mimeType});return c=o.createObjectURL(d),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(c).then(function(h){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(_){const g=new Zt(_);g.needsUpdate=!0,d(g)}),t.load($r.resolveURL(h,r.path),m,void 0,f)})}).then(function(h){return l===!0&&o.revokeObjectURL(c),Mi(h,a),h.userData.mimeType=a.mimeType||ZM(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[at.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[at.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=r.associations.get(a);a=r.extensions[at.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Ma,ti.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Kf,ti.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Nn}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let a;const o={},c=r.extensions||{},l=[];if(c[at.KHR_MATERIALS_UNLIT]){const h=s[at.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),l.push(h.extendParams(o,r,t))}else{const h=r.pbrMetallicRoughness||{};if(o.color=new ke(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],gn),o.opacity=d[3]}h.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",h.baseColorTexture,ln)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=jt);const u=r.alphaMode||Yc.OPAQUE;if(u===Yc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Yc.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Yt&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new oe(1,1),r.normalTexture.scale!==void 0)){const h=r.normalTexture.scale;o.normalScale.set(h,h)}if(r.occlusionTexture!==void 0&&a!==Yt&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Yt){const h=r.emissiveFactor;o.emissive=new ke().setRGB(h[0],h[1],h[2],gn)}return r.emissiveTexture!==void 0&&a!==Yt&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,ln)),Promise.all(l).then(function(){const h=new a(o);return r.name&&(h.name=r.name),Mi(h,r),t.associations.set(h,{materials:e}),r.extensions&&ss(s,h,r),h})}createUniqueName(e){const t=St.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[at.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return Gd(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],u=jM(l),h=s[u];if(h)a.push(h.promise);else{let d;l.extensions&&l.extensions[at.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Gd(new Vt,l,t),s[u]={primitive:l,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const u=a[c].material===void 0?qM(this.cache):this.getDependency("material",a[c].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),u=c[c.length-1],h=[];for(let f=0,m=u.length;f<m;f++){const _=u[f],g=a[f];let p;const M=l[f];if(g.mode===kn.TRIANGLES||g.mode===kn.TRIANGLE_STRIP||g.mode===kn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new U0(_,M):new je(_,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===kn.TRIANGLE_STRIP?p.geometry=Bd(p.geometry,Lf):g.mode===kn.TRIANGLE_FAN&&(p.geometry=Bd(p.geometry,Yl));else if(g.mode===kn.LINES)p=new H0(_,M);else if(g.mode===kn.LINE_STRIP)p=new Lu(_,M);else if(g.mode===kn.LINE_LOOP)p=new V0(_,M);else if(g.mode===kn.POINTS)p=new Ho(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&KM(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Mi(p,r),g.extensions&&ss(s,p,g),t.assignFinalMaterial(p),h.push(p)}for(let f=0,m=h.length;f<m;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return r.extensions&&ss(s,h[0],r),h[0];const d=new tt;r.extensions&&ss(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=h.length;f<m;f++)d.add(h[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new mn(s0.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new ku(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Mi(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),a=s,o=[],c=[];for(let l=0,u=a.length;l<u;l++){const h=a[l];if(h){o.push(h);const d=new $e;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Cu(o,c)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],c=[],l=[],u=[];for(let h=0,d=s.channels.length;h<d;h++){const f=s.channels[h],m=s.samplers[f.sampler],_=f.target,g=_.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,M=s.parameters!==void 0?s.parameters[m.output]:m.output;_.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",M)),l.push(m),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(u)]).then(function(h){const d=h[0],f=h[1],m=h[2],_=h[3],g=h[4],p=[];for(let M=0,v=d.length;M<v;M++){const x=d[M],P=f[M],A=m[M],C=_[M],L=g[M];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const E=n._createAnimationTracks(x,P,A,C,L);if(E)for(let S=0;S<E.length;S++)p.push(E[S])}return new Ql(r,void 0,p)})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=s.weights.length;c<l;c++)o.morphTargetInfluences[c]=s.weights[c]}),a})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let l=0,u=o.length;l<u;l++)a.push(n.getDependency("node",o[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){const u=l[0],h=l[1],d=l[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,JM)});for(let f=0,m=h.length;f<m;f++)u.add(h[f]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let u;if(r.isBone===!0?u=new qf:l.length>1?u=new tt:l.length===1?u=l[0]:u=new It,u!==l[0])for(let h=0,d=l.length;h<d;h++)u.add(l[h]);if(r.name&&(u.userData.name=r.name,u.name=a),Mi(u,r),r.extensions&&ss(n,u,r),r.matrix!==void 0){const h=new $e;h.fromArray(r.matrix),u.applyMatrix4(h)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);return s.associations.has(u)||s.associations.set(u,{}),s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new tt;n.name&&(r.name=s.createUniqueName(n.name)),Mi(r,n),n.extensions&&ss(t,r,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(s.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let u=0,h=c.length;u<h;u++)r.add(c[u]);const l=u=>{const h=new Map;for(const[d,f]of s.associations)(d instanceof ti||d instanceof Zt)&&h.set(d,f);return u.traverse(d=>{const f=s.associations.get(d);f!=null&&h.set(d,f)}),h};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){const a=[],o=e.name?e.name:e.uuid,c=[];Ui[r.path]===Ui.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(o);let l;switch(Ui[r.path]){case Ui.weights:l=_r;break;case Ui.rotation:l=xr;break;case Ui.position:case Ui.scale:l=vr;break;default:switch(n.itemSize){case 1:l=_r;break;case 2:case 3:default:l=vr;break}break}const u=s.interpolation!==void 0?XM[s.interpolation]:aa,h=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const m=new l(c[d]+"."+Ui[r.path],t.array,h,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=cu(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof xr?WM:Ep;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function QM(i,e,t){const n=e.attributes,s=new Ri;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(s.set(new T(c[0],c[1],c[2]),new T(l[0],l[1],l[2])),o.normalized){const u=cu(ar[o.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new T,c=new T;for(let l=0,u=r.length;l<u;l++){const h=r[l];if(h.POSITION!==void 0){const d=t.json.accessors[h.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){const _=cu(ar[d.componentType]);c.multiplyScalar(_)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;const a=new ci;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function Gd(i,e,t){const n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){i.setAttribute(o,c)})}for(const a in n){const o=ou[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){const a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return lt.workingColorSpace!==gn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${lt.workingColorSpace}" not supported.`),Mi(i,e),QM(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?YM(i,e.targets,t):i})}let jc=7;const Xr=()=>(jc=jc*16807%2147483647,jc/2147483647),Zc=i=>i[Math.floor(Xr()*i.length)];function oo(i,e=256){const t=document.createElement("canvas");t.width=t.height=e,i(t.getContext("2d"),e);const n=new br(t);return n.wrapS=n.wrapT=Wi,n.anisotropy=4,n}const rs={},eS=()=>(rs.brick||(rs.brick=oo((i,e)=>{i.fillStyle="#b7a090",i.fillRect(0,0,e,e);const t=24,n=6,s=e/t,r=e/n;for(let a=0;a<t;a++)for(let o=-1;o<n;o++){const c=.82+Xr()*.3;i.fillStyle=`rgb(${110*c|0},${42*c|0},${38*c|0})`,i.fillRect(o*r+a%2*(r/2)+1,a*s+1,r-2,s-2)}}),rs.mosaic=oo((i,e)=>{for(let n=0;n<16;n++)for(let s=0;s<16;s++)i.fillStyle=Zc(["#c99a6b","#d8b48a","#b98055","#e0a56e","#c4b09a","#a8805a"]),i.fillRect(s*e/16+1,n*e/16+1,e/16-2,e/16-2)}),rs.stone=oo((i,e)=>{i.fillStyle="#8f9094",i.fillRect(0,0,e,e);let t=0;for(;t<e;){const n=14+Xr()*12;let s=-Xr()*30;for(;s<e;){const r=30+Xr()*42;i.fillStyle=Zc(["#c9c9c4","#b6b7b3","#d8d8d3","#a9aaa6","#bdbdb8"]),i.fillRect(s+1,t+1,r-2,n-2),s+=r}t+=n}}),rs.sidewalk=oo((i,e)=>{for(let n=0;n<4;n++)for(let s=0;s<4;s++)i.fillStyle=Zc(["#c8553d","#d9694a","#b8442f","#e08a60","#d0603f"]),i.fillRect(s*e/4+2,n*e/4+2,e/4-4,e/4-4)})),rs);function Eo(i,e,t,n){const s=eS()[i].clone();return s.needsUpdate=!0,s.repeat.set(e/n,t/n),new Nn({map:s,roughness:.92,metalness:0})}function ft(i,e,t,n){return new je(new Wn(i,e,t),typeof n=="string"?fn(n):n)}const pt=(i,e,t,n)=>(i.position.set(e,t,n),i),pn="#f4f6fa",fa="#1b2438";function co(i,{z:e,y:t,w:n,h:s,barsH:r=0,barsV:a=0,glass:o=fa}){i.add(pt(ft(.1,s+.16,n+.16,pn),.05,t,e)),i.add(pt(ft(.1,s,n,o),.07,t,e));for(let c=1;c<=r;c++)i.add(pt(ft(.12,.05,n,pn),.1,t-s/2+s*c/(r+1),e));for(let c=1;c<=a;c++)i.add(pt(ft(.12,s,.045,pn),.1,t,e-n/2+n*c/(a+1)))}function Wd(i,{z:e,w:t,h:n,vertical:s=!1}){if(i.add(pt(ft(.08,n,t,fa),.04,n/2,e)),i.add(pt(ft(.12,n,.08,pn),.1,n/2,e-t/2)),i.add(pt(ft(.12,n,.08,pn),.1,n/2,e+t/2)),i.add(pt(ft(.12,.08,t,pn),.1,n,e)),s){const r=Math.round(t/.17);for(let a=0;a<r;a++)i.add(pt(ft(.1,n-.1,.1,pn),.12,n/2,e-t/2+.1+a*(t-.2)/(r-1)));i.add(pt(ft(.1,.1,t,pn),.13,.4,e))}else{const r=Math.round(n/.27);for(let a=0;a<r;a++)i.add(pt(ft(.11,.06,t,pn),.11,.18+a*(n-.3)/(r-1),e));i.add(pt(ft(.12,n,.06,pn),.1,n/2,e))}}function Xd(i,e,t=1.2){i.add(pt(ft(.14,.55,.32,pn),.07,t,e)),i.add(pt(ft(.15,.2,.16,"#9aa1ad"),.075,t+.08,e))}function tS(i,e,t){i.add(pt(ft(.1,.5,e-.3,fa),.05,t,0)),i.add(pt(ft(.12,.05,e-.3,pn),.1,t+.27,0)),i.add(pt(ft(.12,.05,e-.3,pn),.1,t-.27,0));const n=Math.floor((e-.5)/.2);for(let s=0;s<n;s++)i.add(pt(ft(.1,.46,.07,pn),.11,t,-(e-.5)/2+s*.2))}function qd(i,e,t,n){const s=new je(new Xn(.45,.45,1.1,14),fn("#2b3040"));s.position.set(e,n+1,t),i.add(s),[-.3,.3].forEach(r=>i.add(pt(ft(.08,.5,.08,"#6b7280"),e,n+.3,t+r)))}const Tp={A:{w:6.6,floors:1},B:{w:5.2,floors:1},C:{w:6.6,floors:1},D:{w:6,floors:2}};function nS(i){const{w:e,floors:t}=Tp[i],n=new tt,s=t===2?6:i==="C"?3.5:3.1,r=8.2;n.add(pt(ft(r,s,e,"#e9e4dc"),-r/2,s/2,0));const a=i==="A"?Eo("brick",e,s,1.2):i==="B"?Eo("mosaic",e,s,1):i==="C"?Eo("stone",e,s,1.4):fn("#f1ece4"),o=new je(new nn(e,s).rotateY(Math.PI/2),a);if(o.position.set(.01,s/2,0),n.add(o),n.add(pt(ft(r+.2,.2,e+.1,"#cfd3da"),-r/2,s+.1,0)),n.add(pt(ft(.18,.4,e+.1,i==="B"?"#c9a77c":i==="C"?"#b6b7b3":pn),.02,s+.3,0)),i==="A")tS(n,e,s-.45),Wd(n,{z:-e/2+1.55,w:2.6,h:2.4}),Xd(n,.55),co(n,{z:e/2-1.75,y:1.6,w:2.7,h:1.45,barsH:4}),qd(n,-2.5,.8,s+.2);else if(i==="B")co(n,{z:-e/2+.95,y:1.6,w:1.4,h:1.5,barsV:7}),Xd(n,-.25,1.1),Wd(n,{z:e/2-1.5,w:2.4,h:2.4,vertical:!0}),qd(n,-3,-.5,s+.2);else if(i==="C"){n.add(pt(ft(.1,2.14,4.4,pn),.05,1.75,.2)),n.add(pt(ft(.1,1.98,4.24,"#2a4fa8"),.08,1.75,.2));for(let l=0;l<=4;l++)n.add(pt(ft(.12,1.98,.05,fa),.12,1.75,.2-2.1+l*1.05));[-1.05,1.05].forEach(l=>{const u=new je(new ni(.42,.035,8,24),fn(fa));u.rotation.y=Math.PI/2,u.position.set(.13,1.75,.2+l),n.add(u)}),n.add(pt(ft(.14,.5,.6,"#b6b3ab"),.07,.55,e/2-.9)),n.add(pt(ft(.14,2.2,.9,"#cfd3da"),.07,1.1,-e/2+.55))}else[1.6,4.5].forEach(c=>{co(n,{z:-e/4,y:c,w:1.6,h:1.3,barsV:3,glass:"#7fa6d6"}),co(n,{z:e/4,y:c,w:1.6,h:1.3,barsV:3,glass:"#7fa6d6"})}),n.add(pt(ft(.5,.12,e,"#cfd3da"),.25,3.1,0));return n}function Jc(i,{x:e,face:t,zStart:n,dir:s,styles:r}){let a=n;r.forEach(o=>{const c=Tp[o].w,l=nS(o);l.position.set(e,0,a+s*c/2),l.rotation.y=t===1?0:Math.PI,i.add(l),a+=s*c})}function $c(i,e,t,n){const s=new je(new Xn(.14,.2,9,10),fn("#aeb2b8"));s.position.set(e,4.5,t),i.add(s),i.add(pt(ft(.12,.12,1.8,"#6b7280"),e,8.3,t)),i.add(pt(ft(.12,.12,1.4,"#6b7280"),e,7.7,t)),[-.7,0,.7].forEach(r=>{const a=Math.abs(n-t),o=new je(new Xn(.015,.015,a,4),fn("#1b2438"));o.rotation.x=Math.PI/2,o.position.set(e+r*.3,8.2-Math.abs(r)*.3,(t+n)/2),i.add(o)})}function iS(i){((n,s,r,a,o,c)=>{const l=new je(new nn(n,s),r);l.rotation.x=-Math.PI/2,l.position.set(a,o,c),l.receiveShadow=!0,i.add(l)})(5.8,160,fn("#6d7280"),11.1,.005,0);const t=n=>{const s=Eo("sidewalk",2.2,160,1.6),r=new je(new nn(2.2,160),s);r.rotation.x=-Math.PI/2,r.position.set(n,.165,0),i.add(r),i.add(pt(ft(2.2,.16,160,"#cfd3da"),n,.08,0))};t(7.1),t(15.1),i.add(pt(ft(.18,.2,160,"#e4e8f0"),8.3,.1,0)),i.add(pt(ft(.18,.2,160,"#e4e8f0"),13.9,.1,0)),Jc(i,{x:6,face:1,zStart:3.07,dir:1,styles:["B","A","C","D","B","A","C","B","D","A"]}),Jc(i,{x:6,face:1,zStart:-3.07,dir:-1,styles:["A","C","B","D","A","B","C","A","D","B"]}),Jc(i,{x:16.2,face:-1,zStart:-34,dir:1,styles:["C","B","A","D","B","C","A","B","D","A","C"]}),$c(i,7.9,-7,12),$c(i,7.9,12,31),$c(i,14.3,2,-17)}const Xt={root:new tt,mixer:null,doorAction:null,bag:null};Xt.root.visible=!1;Sn.add(Xt.root);const sS=/^Cube006_Cube/,rS={sofa:["#4a7fd0","#79a6ee"],sillon:["#4a7fd0","#79a6ee"],"mesa-primeros-auxilios":["#dcae7d","#c48b5a","#ffffff"],"mesa-televisor":["#dcae7d","#ffffff"],mesita:"#c48b5a",televisor:"#14305e",cuadro1:"#9fd0f2",cuadro2:"#ffd9a0",cuadro3:"#c9dbff",ventana1:"#e4f1ff",ventana2:"#e4f1ff",ventana3:"#e4f1ff",ventana4:"#e4f1ff",puerta1:"#c48b5a",puerta1001:"#b57b4b",reja_casa:"#f4f8ff",muro:"#d6e4ff",reja:"#f4f8ff",puerta2:"#c48b5a",puerta2001:"#b57b4b"},aS="#d6e4ff",oS="#e8d2ae",cS="#f4f8ff",lS="#ff8a6f",uS="#7cc8a0",Qc={},wp=(i,e=!1,t=!1)=>{const n=i+e+t;return Qc[n]||(Qc[n]=new Nn({color:e?"#ffffff":i,vertexColors:e,side:t?jt:ai,roughness:.82,metalness:0}))};function Yd(i,e){const t=i.geometry,n=t.attributes.position,s=t.attributes.normal,r=new Float32Array(n.count*3),a=new ke;for(let o=0;o<n.count;o++)a.set(e(s.getY(o),n.getY(o))),r.set([a.r,a.g,a.b],o*3);t.setAttribute("color",new Jt(r,3)),i.material=wp("#ffffff",!0)}function hS(i){const e=[];i.traverse(n=>n.isMesh&&e.push(n));const t=i.name;e.forEach((n,s)=>{if(n.receiveShadow=!0,n.castShadow=t!=="casa"&&!t.startsWith("ventana"),t==="casa")Yd(n,(r,a)=>r>.8&&a<.2?oS:r<-.8?cS:aS);else if(t.startsWith("matera"))Yd(n,(r,a)=>a<.38?lS:uS);else{const r=rS[t]||"#ffffff",a=t.startsWith("reja");n.material=wp(Array.isArray(r)?r[Math.min(s,r.length-1)]:r,!1,a)}})}async function dS(){const i=await new vM().loadAsync("./casa3.glb"),e=i.scene;if([...e.children].forEach(r=>{sS.test(r.name)?r.visible=!1:hS(r)}),Xt.root.add(e),Xt.mixer=new Jg(e),i.animations.length){const r=Xt.mixer.clipAction(i.animations[0]);r.setLoop(Pf,1),r.clampWhenFinished=!0,r.play(),r.paused=!0,Xt.doorAction=r}const t=Do();t.scale.setScalar(.22),t.position.set(-1.75,.58,-2.15),t.rotation.y=Math.PI/2,Xt.bag=t,Xt.root.add(t);const n=new je(new Vo(140,48),new Nn({color:"#c9cdd6",roughness:1}));n.rotation.x=-Math.PI/2,n.position.y=-.03,n.receiveShadow=!0,Xt.root.add(n),iS(Xt.root);const s=new ba("#ffe2b0",.2*ii,10,0);s.position.set(.7,2.3,0),Xt.root.add(s)}function qi(i,e=!1){const t=Xt.doorAction;if(!t)return;const n=t.getClip().duration;if(e){t.reset(),t.play(),t.paused=!0,t.time=i?n:0,Xt.mixer.update(0);return}!i||t.time>=n-.001||(t.reset(),t.timeScale=G1,t.paused=!1,t.play())}function fS(i){Xt.mixer&&Xt.mixer.update(i)}const Tn={theta:.8,r:16.5,h:10,tx:0,ty:1,tz:0,speed:.09,amp:.3,sx:0,sy:0},pe={goal:new T,tgt:new T(0,1,0),cur:new T(0,1,0),key:"pets",d:10,sx:0,sy:0,follow:null,offY:0,rate:4},Vn={v:0,t:0},Kd=new T,pS=new T,yn={target:null,k:0,off:new T(3.4,1.9,3.4)},Gs={x:9,y:9.2,z:9};function mS(i,e,t=Math.PI/4,n=2.3){yn.target=i?i.clone():null,yn.off.set(Math.sin(t)*n,.5,Math.cos(t)*n),e&&(yn.k=i?1:0,i&&pe.cur.copy(i))}const _t={active:!1,group:null,origin:new T,yaw:0,s:1,lift:0,liftGoal:0,offset:new T},Ap=new T(0,1,0),lu=new T,Oo=new T,Rp=i=>i.sub(_t.origin).applyAxisAngle(Ap,-_t.yaw).multiplyScalar(1/_t.s),uu=i=>i.multiplyScalar(_t.s).applyAxisAngle(Ap,_t.yaw).add(_t.origin);function Ju(i,e,t,n=.12){const s=Ct[i],r=We.position.clone();We.getWorldDirection(Oo);const a=Math.hypot(r.x-e.x,r.z-e.z),o=r.clone().addScaledVector(Oo,a);Sn.add(s),s.position.copy(e),s.scale.setScalar(t),_t.group=s,_t.origin.copy(e),_t.s=t,_t.yaw=Math.atan2(r.x-e.x,r.z-e.z),_t.active=!0,Qu(i),pe.tgt.copy(Rp(o.clone())),pe.d=Math.max(1,a/t);const c=e.y+t*(pe.tgt.y+pe.d*.14);_t.lift=r.y-c,_t.liftGoal=n,s.rotation.y=_t.yaw;const l=uu(lu.set(pe.tgt.x,pe.tgt.y+pe.d*.14,pe.tgt.z+pe.d));_t.offset.set(r.x-l.x,0,r.z-l.z)}const zt={pos:new T,look:new T,goalPos:new T,goalLook:new T,rate:3};function $u(){We.getWorldDirection(Oo),zt.pos.copy(We.position),zt.look.copy(We.position).addScaledVector(Oo,3),zt.goalPos.copy(zt.pos),zt.goalLook.copy(zt.look)}function hu(i,e,t=3){zt.goalPos.copy(i),zt.goalLook.copy(e),zt.rate=t}function Zo(i,e){zt.pos.copy(i),zt.look.copy(e),zt.goalPos.copy(i),zt.goalLook.copy(e)}function gS(i){let e=Ve.shakeK*mf*(O.mode==="tp"?1-.9*yn.k:1);if(O.mode==="fp"&&ae.active)aM(i);else if(O.mode==="fp"){let t=1.55+(Ee.moving?Math.sin(Ee.bob)*.035:0);We.position.set(Ee.pos.x,t,Ee.pos.z),We.rotation.set(Ee.pitch,Ee.yaw,0)}else if(O.mode==="tp"){const t=yn.target||pS.set(Ee.pos.x*.75,.9,Ee.pos.z*.75);pe.cur.lerp(t,1-Math.exp(-(yn.target?2.6:5)*i)),yn.k=kt(yn.k,yn.target?1:0,2.2,i);const n=yn.k;We.position.set(pe.cur.x+Gs.x+(yn.off.x-Gs.x)*n,pe.cur.y+Gs.y+(yn.off.y-Gs.y)*n,pe.cur.z+Gs.z+(yn.off.z-Gs.z)*n),We.lookAt(pe.cur)}else if(O.mode==="cine"){const t=1-Math.exp(-zt.rate*i);zt.pos.lerp(zt.goalPos,t),zt.look.lerp(zt.goalLook,t),We.position.copy(zt.pos),We.lookAt(zt.look)}else if(O.mode==="orbit"){let t=Tn.theta+Math.sin(O.time*Tn.speed)*Tn.amp;We.position.set(Tn.tx+Math.cos(t)*Tn.r,Tn.h,Tn.tz+Math.sin(t)*Tn.r),We.lookAt(Tn.tx,Tn.ty,Tn.tz),We.translateX(-Tn.sx),We.translateY(-Tn.sy)}else{const t=O.mode==="stage"&&_t.active;let n=pe.follow?pe.follow.getWorldPosition(Kd):Kd.fromArray(pe.goalT);t&&pe.follow&&(n=Rp(n)),pe.tgt.lerp(n,1-Math.exp(-4*i)),pe.d=kt(pe.d,pe.goalD,pe.rate||4,i);let s=pe.d;t?(_t.lift=kt(_t.lift,_t.liftGoal,2.5,i),We.position.copy(uu(lu.set(pe.tgt.x,pe.tgt.y+s*.14,pe.tgt.z+s))),We.position.y+=_t.lift,_t.offset.x=kt(_t.offset.x,0,2.5,i),_t.offset.z=kt(_t.offset.z,0,2.5,i),We.position.add(_t.offset),We.lookAt(uu(lu.copy(pe.tgt)))):(We.position.set(pe.tgt.x,pe.tgt.y+s*.14,pe.tgt.z+s),We.lookAt(pe.tgt));let r=innerWidth>820;pe.sx=kt(pe.sx,pe.follow&&r?s*.2:0,4,i),pe.sy=kt(pe.sy,pe.follow?r?0:s*.17:pe.offY?pe.offY*s:0,2.5,i);const a=t?_t.s:1;We.translateX(pe.sx*a),We.translateY(-pe.sy*a);let o=cn[pe.key]||{sway:.3};Ct[pe.grp]&&(Ct[pe.grp].rotation.y=kt(Ct[pe.grp].rotation.y,(t?_t.yaw:0)+O.showRot+Math.sin(O.time*.6)*o.sway*(pe.follow?0:1),10,i))}e>.001&&(We.position.x+=(Math.random()-.5)*.16*e,We.position.y+=(Math.random()-.5)*.12*e,We.position.z+=(Math.random()-.5)*.16*e,We.rotateZ((Math.random()-.5)*.025*e))}function an(i){const e=O.mode;O.mode=i,O.scene=i==="show"?rr:Sn,i!=="stage"&&(_t.active=!1,_t.group&&(_t.group.visible=!1));let t=i==="orbit"||i==="tp",n=i==="fp"||i==="stage"||i==="cine";Ge.walls.front.visible=!t,Ge.walls.right.visible=!t,Ge.ceil.visible=n,Ge.hallOn=n,Ge.hall.visible=n,Ge.plug.visible=!n,Wu.intensity=n?.45*ii:0,Je.visible=i==="tp",Xt.root.visible=n,Ge.root.visible=!n,Yo.visible=!n;const s=a=>a==="fp"||a==="stage"||a==="cine";e!==i&&s(e)&&s(i)||(We.fov=i==="cine"?50:i==="stage"?36:n?68:i==="show"?36:34,We.updateProjectionMatrix()),i==="tp"&&(pe.cur.set(Ee.pos.x*.75,.9,Ee.pos.z*.75),yn.target=null,yn.k=0)}function Jo(i){Object.assign(Tn,{theta:.8,r:16.5,h:10,tx:0,ty:1,tz:0,speed:.09,amp:.3,sx:0,sy:0},i||{})}function Qu(i,e){Object.keys(Ct).forEach(s=>Ct[s].visible=s===i);let t=cn[i];pe.key=i,pe.grp=i,pe.goalT=t.t,pe.goalD=t.d,pe.follow=null,pe.offY=0,pe.rate=4,O.showRot=0;let n=Ct[i];["dog","cat"].forEach(s=>{n[s]&&n[s].userData&&n[s].userData.type&&(n[s].userData.hop=0)})}function ta(i,e,t){if(!i){let n=cn[pe.key];pe.follow=null,pe.goalD=n.d,O.showRot=0;return}pe.follow=i,pe.goalD=e||3.6,O.showRot=t||0}function _S(){return!Ve.active||O.hideBanner||O.cur==="hub"?"":"strong"}function Cp(){let i=O.cur&&Pt[O.cur]&&Pt[O.cur].stage===2&&O.mode!=="show"&&O.cur==="mission"?_S():"";if(i===O.lastBanner)return;O.lastBanner=i;let e=$("#quakeBanner");if(!i){e.hidden=!0;return}let t=Dt.banner[i];e.hidden=!1,e.className=i==="strong"?"strong":"calm",e.innerHTML="<h3>"+t.t+"</h3><p>"+t.s+"</p>"+(t.limit?'<p class="blimit">'+t.limit.replace("{n}",Gu)+"</p>":"")}function Yi(i,e,t,n=1){let s=Ge.beacon;if(i==null){s.visible=!1;return}s.scale.setScalar(n),s.position.set(i,0,e),s.visible=!0,s.userData.baseY=t??1.2}function An(i){O.interact=i}function xS(i){let e=Ge.beacon;e.visible&&(e.userData.cone.position.y=(e.userData.baseY==null?1.2:e.userData.baseY)+Math.sin(O.time*3)*.15,e.userData.ring.scale.setScalar(1+Math.sin(O.time*3)*.12))}function Pp(){if(!O.interact||O.mode!=="fp"&&O.mode!=="tp")return null;const i=Array.isArray(O.interact)?O.interact:[O.interact];let e=null,t=1/0;return i.forEach(n=>{const s=Math.hypot(Ee.pos.x-n.x,Ee.pos.z-n.z);s<n.r&&s<t&&(e=n,t=s)}),e}function vS(){const i=$("#prompt"),e=Pp();return e?($("span",i).textContent=e.label,i.hidden=!1):i.hidden=!0,!!e}function Lp(){const i=Pp();i&&(ce.blip(),Array.isArray(O.interact)||(O.interact=null),i.fn())}const Fo=[];function yS(){let i=$("#tip");if(!O.tipState||i.hidden)return;let e=innerWidth,t=innerHeight;if(e<=820){i.classList.add("dock"),i.style.transform="";return}i.classList.remove("dock"),ms.setFromMatrixPosition(O.tipState.anchor.matrixWorld).project(We);let n=(ms.x*.5+.5)*e,s=(-ms.y*.5+.5)*t,r=i.offsetWidth,a=i.offsetHeight,o=Math.max(80,t*.15),c=n+o,l=!1;c+r>e-16&&(c=n-o-r,l=!0),c=Kt(c,16,e-r-16);let u=Kt(s-a/2,96,Math.max(96,t-a-16));i.classList.toggle("left",l),i.style.setProperty("--ay",Kt(s-u,18,a-18)+"px"),i.style.transform="translate("+c.toFixed(1)+"px,"+u.toFixed(1)+"px)"}function Ip(){Fo.forEach(i=>i.b.remove()),Fo.length=0}function pa(i){let e=pf("button","hs "+(i.cls||"dot"));return e.type="button",e.setAttribute("aria-label",i.aria||i.label||"Punto "+(i.num||"")),e.innerHTML=i.cls==="pill"?"<span>"+i.label+"</span>":i.cls==="tag"?'<i class="stem"></i><b>'+i.label+"</b>":"<i></i>"+(i.num?"<b>"+i.num+"</b>":""),i.height&&e.style.setProperty("--h",i.height+"px"),e.addEventListener("click",t=>{t.stopPropagation(),i.onClick&&i.onClick(e)}),$("#hotspots").appendChild(e),Fo.push({b:e,anchor:i.anchor}),e}const ms=new T;function MS(){let i=innerWidth,e=innerHeight;Fo.forEach(t=>{ms.setFromMatrixPosition(t.anchor.matrixWorld).project(We);let n=ms.z<1;t.b.style.display=n?"":"none",n&&(t.b.style.transform="translate("+((ms.x*.5+.5)*i).toFixed(1)+"px,"+((-ms.y*.5+.5)*e).toFixed(1)+"px) translate(-50%,-50%)")})}function Ss(i){let e=$("#panel");e.className="card "+(i.cls||""),e.hidden=!1,e.innerHTML=(i.title?"<h2>"+i.title+"</h2>":"")+(i.text?"<p>"+i.text+"</p>":"")+(i.html||"")+(i.actions&&i.actions.length?'<div class="actions"></div>':"");let t=$(".actions",e);return(i.actions||[]).forEach(n=>{let s=pf("button","btn"+(n.ghost?" ghost":"")+(n.cls?" "+n.cls:""));s.textContent=n.label,s.disabled=!!n.disabled,s.addEventListener("click",()=>{ce.blip(),n.fn()}),t.appendChild(s),n.el=s}),e}function ji(i){let e=$("#dyn");return e.innerHTML=i,e.classList.add("active"),e}function SS(i){let e=$("#hint");{e.hidden=!0;return}}function bS(){$("#panel").hidden=!0,$("#dyn").classList.remove("active"),$("#dyn").innerHTML="",$("#home").classList.remove("active"),$("#callouts").hidden=!0,$("#callouts").className="",$("#callouts").innerHTML="",$("#tip").hidden=!0,O.tipState=null,pe.follow=null,$("#hotspots").style.visibility="",$("#timer").hidden=!0,Ip(),zn(null),Yi(null),An(null),SS(),sM(),da(!1),gs(),$("#prompt").hidden=!0,$("#stick").hidden=!0,$("#quakeBanner").hidden=!0,$("#blackout").classList.remove("on","full"),K1(),ju.forEach(i=>i.visible=!1)}const ES=460,el=15,na=92,Vr=[[0,0],[.2,0],[.3,1.8],[.4,5],[.5,12],[.6,13],[.75,6],[.9,2],[1,.8]],tn={len:1,p:0,tp:0};function TS(i){for(let e=1;e<Vr.length;e++){const[t,n]=Vr[e];if(i<=t){const[s,r]=Vr[e-1];return r+(n-r)*(i-s)/(t-s)}}return Vr[Vr.length-1][1]}function wS(){let i="M0 "+el,e={x:0,y:el};tn.cum=[0];for(let t=1;t<=na;t++){const n=t/na,s={x:n*ES,y:el+(t%2?-1:1)*TS(n)};tn.cum.push(tn.cum[t-1]+Math.hypot(s.x-e.x,s.y-e.y)),i+=" L"+s.x.toFixed(1)+" "+s.y.toFixed(1),e=s}$("#sBase").setAttribute("d",i),$("#sFill").setAttribute("d",i),tn.len=$("#sFill").getTotalLength(),$("#sFill").style.strokeDasharray=tn.len,$("#sFill").style.strokeDashoffset=tn.len}function AS(i){tn.p=kt(tn.p,tn.tp,3,i);const e=Kt(tn.p,0,1)*na,t=Math.min(na-1,Math.floor(e)),n=tn.cum[t]+(tn.cum[t+1]-tn.cum[t])*(e-t),s=tn.len/tn.cum[na];$("#sFill").style.strokeDashoffset=tn.len-n*s;const r=$("#sFill").getPointAtLength(Kt(n*s,.001,tn.len));$("#sDot").setAttribute("cx",r.x),$("#sDot").setAttribute("cy",r.y)}function RS(i,e){tn.tp=(i+e)/5,Ti("#stages button").forEach((t,n)=>{t.classList.toggle("on",n===i),t.setAttribute("aria-current",n===i?"step":"false")}),$("#seismo").setAttribute("aria-label","Progreso: etapa "+["Inicio","Antes","Durante","Después","Cierre"][i])}function CS(){O.curExit&&(O.curExit(),O.curExit=null),O.stepData.io&&(O.stepData.io.disconnect(),O.stepData.io=null),O.curTick=null,O.onQuakePhase=function(){},O.stepData={}}let tl=!1;const PS={quakeIntro:1500,sizeIntro:1200};function Ki(i,e,t){if(tl)return;tl=!0;const n=t||PS[i]||800;let s=$("#fade");s.style.transitionDuration=n+"ms",s.classList.add("on"),setTimeout(()=>{Ht(i,e),requestAnimationFrame(()=>setTimeout(()=>{s.classList.remove("on"),setTimeout(()=>{s.style.transitionDuration="",tl=!1},n)},250))},n)}let nl=!1;function LS(i){if(nl)return;nl=!0;const e=$("#wipe"),t=i.getBoundingClientRect();e.style.setProperty("--x",t.left+t.width/2+"px"),e.style.setProperty("--y",t.top+t.height/2+"px"),e.className="on",e.offsetWidth,e.classList.add("go"),ce.whoosh(),Vn.t=.8,setTimeout(()=>{Ht("start"),Vn.t=0,e.classList.remove("go"),e.classList.add("open")},1500),setTimeout(()=>{e.className="",nl=!1},2800)}function jd(i,e){return typeof i=="function"?i(e):i}function IS(i,e,t){const n=$("#navBack"),s=$("#navNext");n.hidden=!e.prev,s.hidden=!e.next,$("#navbar").classList.toggle("nav-off",i==="home"),O.navTo={back:e.prev?()=>Ki(jd(e.prev,t)):null,next:e.next?()=>{const r=jd(e.next,t);typeof r=="string"&&Ki(r)}:null}}function Dp(i){const e=O.navTo&&O.navTo[i];e&&(ce.blip(),e())}function Ht(i,e){CS(),bS(),Ee.locked=!1,O.bgOverride=null,O.hideBanner=!1;let t=Pt[i];if(!t)return;O.cur=i,O.lastBanner="#",$("#hud").hidden=i==="home"&&!1;let n=t.stage===2&&i!=="quakeIntro";!n&&Ve.active&&yp();const s=t.stage===2?i.startsWith("size")?"sizes":n||i==="quakeIntro"?"suspense":"calm":t.stage===3?"hope":"calm";ce.setMood(s),RS(t.stage,t.w||0),IS(i,t,e||{}),t.enter(e||{}),Cp()}function DS(){yp(),Ko(),rn.done.clear(),rn.sizes.clear(),rn.greeted=!1,xe.visible=ge.visible=!0,Ht("home")}let il=!1;function NS(i){if(il)return;il=!0;let e=$("#wipe"),t=i.getBoundingClientRect();e.style.setProperty("--x",t.left+t.width/2+"px"),e.style.setProperty("--y",t.top+t.height/2+"px"),e.className="on",e.offsetWidth,e.classList.add("go"),ce.whoosh(),Vn.t=1,setTimeout(()=>e.classList.add("hold"),1e3),setTimeout(()=>{DS(),Vn.t=0},1750),setTimeout(()=>{e.classList.remove("go","hold"),e.classList.add("open")},2600),setTimeout(()=>{e.className="",il=!1},3900)}const Pt={},or={r:7.5,h:3.2,ty:1},lo={r:30,h:10},Zd=4.6,as={group:null,clouds:[],fog:null},US=i=>1-Math.pow(1-Math.min(1,Math.max(0,i)),3);function OS(){if(as.group)return as;const i=getComputedStyle(document.documentElement),e=new ke(i.getPropertyValue("--bg2").trim()||"#e6f1ff"),t=new tt,n=new je(new Vo(400,48),new Nn({color:e.clone().lerp(new ke("#ffffff"),.25),roughness:1}));n.rotation.x=-Math.PI/2,n.receiveShadow=!0,t.add(n);const s=new Yt({color:"#ffffff",transparent:!0,opacity:.92,fog:!1});for(let m=0;m<16;m++){const _=new tt;for(let p=0;p<4;p++){const M=new je(new Wo(1,14,10),s);M.position.set((p-1.5)*1.5,Math.sin(p*2.1)*.35,Math.cos(p*1.7)*.4),M.scale.set(1.6-Math.abs(p-1.5)*.25,.8,1),_.add(M)}const g=1.2+m%4*.5;_.scale.setScalar(g),_.position.set(-90+m*53%180,9+m%5*2.2,-20-m*37%90),_.userData.speed=.5+m%3*.3,t.add(_),as.clouds.push(_)}const r=document.createElement("canvas");r.width=r.height=256;const a=r.getContext("2d"),o=a.createRadialGradient(128,128,0,128,128,128);o.addColorStop(0,"rgba(255,214,140,.9)"),o.addColorStop(.45,"rgba(255,190,120,.35)"),o.addColorStop(1,"rgba(255,190,120,0)"),a.fillStyle=o,a.fillRect(0,0,256,256);const c=new je(new nn(10,10),new Yt({map:new br(r),transparent:!0,opacity:.38,depthWrite:!1,blending:cr,fog:!1}));c.rotation.x=-Math.PI/2,c.position.set(0,.02,.6);const l=new je(new Er(3.3,3.42,64),new Yt({color:"#ffd27a",transparent:!0,opacity:.22,side:jt,depthWrite:!1,fog:!1}));l.rotation.x=-Math.PI/2,l.position.set(0,.025,.6);const u=80,h=new Float32Array(u*3);for(let m=0;m<u;m++){const _=Math.random()*Math.PI*2,g=4.2*Math.sqrt(Math.random());h.set([Math.cos(_)*g,Math.random()*4.5,.6+Math.sin(_)*g],m*3)}const d=new Vt;d.setAttribute("position",new Jt(h,3));const f=new Ho(d,new Ma({color:"#ffd27a",size:.09,transparent:!0,opacity:.45,depthWrite:!1,blending:cr,fog:!1}));return f.frustumCulled=!1,t.add(c,l,f),as.motes=f,as.fog=new Ru(e,24,130),as.group=t,Sn.add(t),as}function Jd(){const i=innerWidth<720,e=i?.66:.74,t=i?-.8:-.62,n=i?.7:1,s=new mn(34,innerWidth/innerHeight,.1,200);s.position.set(0,or.h,or.r),s.lookAt(0,or.ty,0),s.updateMatrixWorld(),s.updateProjectionMatrix();const r=(c,l)=>{const u=new T(c,l,.5).unproject(s).sub(s.position);return s.position.clone().addScaledVector(u,-s.position.y/u.y)},a=r(-e,t),o=r(e,t);bt(xe,a.x,0,a.z,.55,n),bt(ge,o.x,0,o.z,-.55,n)}Pt.home={stage:0,w:0,layout:Jd,enter(){an("orbit"),Ge.root.visible=!1,_p("day");const i=OS();i.group.visible=!0,Sn.fog=i.fog,xe.visible=ge.visible=!0,ot(xe,{wag:2.4,eyes:1.1}),ot(ge,{wag:2,eyes:1.1}),Jd();const e=s=>Jo({theta:Math.PI/2,r:lo.r+(or.r-lo.r)*s,h:lo.h+(or.h-lo.h)*s,ty:or.ty,speed:0,amp:0});e(0);let t=-.5,n=Zd+.5;O.curTick=s=>{t+=s,e(US(t/Zd)),i.clouds.forEach(a=>{a.position.x+=a.userData.speed*s,a.position.x>100&&(a.position.x=-100)});const r=i.motes.geometry.attributes.position;for(let a=0;a<r.count;a++){let o=r.getY(a)+s*(.22+a%5*.07);o>4.8&&(o=0),r.setY(a,o),r.setX(a,r.getX(a)+Math.sin(O.time*.8+a)*.0015)}r.needsUpdate=!0,t>n&&(n=t+3.2,(Math.random()<.5?xe:ge).userData.hop=1)},O.curExit=()=>{i.group.visible=!1,Sn.fog=null},$("#home").classList.add("active"),$("#hud").hidden=!1}};const sl=8.5,FS=7.8,kS=[{x:14.5,z:-2},{x:5.3,z:-2}],BS=[3.46,1.05,-2],zS="M0 30 H110 L120 27 L128 34 L136 24 L146 38 L156 20 L168 42 L180 14 L194 48 L208 8 L224 52 L240 4 L258 56 L276 30 H520";Pt.start={stage:1,w:0,prev:"home",next:()=>{var i;return(i=$(".introfx .cta"))==null?void 0:i.click()},enter(){rn.greeted=!1,rn.enterSmooth=!1,xe.visible=ge.visible=!1,an("fp"),qi(!1,!0),ot(xe,{}),ot(ge,{}),Uo({path:kS,look:BS,closeFrom:.85,lookDown:.6}),Sp();const i=Dt.start,e=i.beats.map(o=>'<div class="beat '+o.pos+(o.hold?" hold":"")+'" style="--at:'+o.at+"s;--dur:"+o.dur+'s"><span class="small">'+o.small+'</span><span class="big">'+o.big+"</span></div>").join(""),t=ji('<div class="introfx" style="--cta:'+FS+'s">'+e+'<svg class="introline" viewBox="0 0 520 60" aria-hidden="true"><path pathLength="1" d="'+zS+'"/></svg><button class="btn big cta">'+i.cta+"</button></div>");let n=!1;$(".cta",t).addEventListener("click",()=>{n||(n=!0,ce.blip(),ce.creak(),$(".introfx",t).classList.add("out"),qi(!0),rn.enterSmooth=!0,setTimeout(()=>Ht("walk"),1700))});let s=0,r=!1,a=!1;O.curTick=o=>{s+=o,n||(ae.target=Math.min(1,s/sl)),!r&&s>sl-.6&&(r=!0,ce.bark()),!a&&s>sl+.1&&(a=!0,ce.meow())}}};const HS={cross:'<path d="M12 5v14M5 12h14"/>',drop:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',paw:'<circle cx="7" cy="10" r="2"/><circle cx="17" cy="10" r="2"/><circle cx="10.5" cy="5.5" r="2"/><circle cx="13.5" cy="5.5" r="2"/><path d="M12 12c-3 0-6 3-6 6 0 2 2 2 3 1.5s2-.7 3-.7 2 .2 3 .7 3 .5 3-1.5c0-3-3-6-6-6z"/>',door:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16"/><circle cx="14.5" cy="12" r=".8"/>',phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',kit:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 10.5v6M9 13.5h6"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',pulse:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>',doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',hand:'<path d="M8 12V6a1.500 1.500 0 0 1 3 0v5m0-6a1.500 1.500 0 0 1 3 0v6m0-4a1.500 1.500 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.500 1.500 0 0 1 2.500-1.500L8 15"/>',no:'<circle cx="12" cy="12" r="9"/><path d="M6 18L18 6"/>'},Np=i=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+HS[i]+"</svg>",Up={dog:'<svg class="pet" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="14" cy="30" rx="8" ry="15" fill="#a86a3a" transform="rotate(12 14 30)"/><ellipse cx="50" cy="30" rx="8" ry="15" fill="#a86a3a" transform="rotate(-12 50 30)"/><circle cx="32" cy="32" r="20" fill="#d9a066"/><ellipse cx="32" cy="40" rx="10" ry="8" fill="#fff0d9"/><circle cx="25" cy="29" r="2.600" fill="#1c2233"/><circle cx="39" cy="29" r="2.600" fill="#1c2233"/><ellipse cx="32" cy="37" rx="3.400" ry="2.400" fill="#3b2a25"/></svg>',cat:'<svg class="pet" viewBox="0 0 64 64" aria-hidden="true"><polygon points="12,26 14,4 30,16" fill="#f4bb52"/><polygon points="52,26 50,4 34,16" fill="#f4bb52"/><circle cx="32" cy="35" r="21" fill="#f4bb52"/><ellipse cx="32" cy="42" rx="9" ry="7" fill="#fff1cf"/><circle cx="24" cy="32" r="3" fill="#2f8f6d"/><circle cx="40" cy="32" r="3" fill="#2f8f6d"/><ellipse cx="32" cy="38" rx="2.500" ry="1.800" fill="#ff9aa8"/></svg>'};function eh(i){const e=i.items.length,t=new Set,n=new Set,s=[],r=O.cur,a=Ss({title:i.title,text:i.text,html:'<p class="count"></p>',actions:[{label:"Continuar",fn:i.next}]}),o=$(".count",a),c=$("#tip"),l=()=>{const m=i.autoNext?n.size:t.size,_=e-m;o.textContent=_>0?"Faltan "+_+" por descubrir · toca un punto para acercarte":"Ya descubriste los "+e},u=()=>{O.tipState=null,c.hidden=!0,a.hidden=!1,$("#hotspots").style.visibility="",s.forEach(m=>m.classList.remove("on")),ta(null),i.onPick&&i.onPick(-1),l()},h=m=>!i.autoNext||n.has(m)?0:(n.add(m),i.onSeen&&i.onSeen(m)||0),d=(m,_)=>{if(!m)return _();O.tipState=null,c.hidden=!0,setTimeout(()=>O.cur===r&&_(),m)},f=m=>{const _=i.items[m];t.add(m),s.forEach((g,p)=>g.classList.toggle("on",m===p)),s[m].classList.add("seen"),i.onPick&&i.onPick(m),ta(_.anchor,i.zoom,_.rot),a.hidden=!0,$("#hotspots").style.visibility="hidden",c.innerHTML='<div class="num">'+(m+1)+" de "+e+'</div><div class="ttl"><span class="ico">'+Np(_.icon)+"</span><h3>"+_.title+"</h3></div><p>"+_.text+'</p><div class="row"><button class="btn" data-a="all">'+(i.backLabel||"Ver otros")+"</button></div>",c.hidden=!1,O.tipState={anchor:_.anchor},$("[data-a=all]",c).addEventListener("click",()=>{ce.blip(),d(h(m),u)}),ce.ding(),l()};return i.items.forEach((m,_)=>s.push(pa({anchor:m.anchor,aria:m.title,onClick:()=>f(_)}))),l(),i.openFirst&&setTimeout(()=>O.cur===r&&f(0),900),{buttons:s,seen:n,opened:t}}const $d=.42,Qd=.4,du=.8,VS=1.05,GS=1.95,hs=2.3,th=1.5,WS=2.2,Ws={x:th,z:1.6};let uo=null;function In(){if(uo!=null)return uo;Xt.root.updateMatrixWorld(!0);const e=new $g(new T(th,2,hs),new T(0,-1,0)).intersectObject(Xt.root,!0)[0];return e?(uo=e.point.y>.25&&e.point.y<.7?e.point.y:.45,uo):.45}const XS=()=>In()+.05*du-.55*du;function qS(i){const e=Je.userData;e.legL.rotation.x=e.legR.rotation.x=-1.5*i,e.kneeL.rotation.x=e.kneeR.rotation.x=1.5*i,e.armL.rotation.x=e.armR.rotation.x=-.6*i}function ko(){const i=Je.userData;Je.scale.set(1,1,1),Je.userData.pack.visible=!0,[i.legL,i.legR,i.armL,i.armR,i.kneeL,i.kneeR].forEach(e=>e.rotation.x=0)}const ho="#f2c9a5",YS="#ff8a6f",ef=new T(.55,-.45,.72).normalize();function KS(){const i=new tt;i.add(nt(.075,ho,1,.42,1.15)),[-.045,-.015,.015,.045].forEach((s,r)=>{const a=1-Math.abs(r-1.5)*.12;i.add(z(nt(.021,ho,1,.9,2.7*a),s,0,-.105))});const e=z(nt(.023,ho,1,.9,2.2),.085,0,-.03);e.rotation.y=.6,i.add(e);const t=new T(0,1,0),n=(s,r,a,o)=>{const c=Rt(s,s,a,o,14);c.quaternion.setFromUnitVectors(t,ef),c.position.copy(ef).multiplyScalar(r+a/2),i.add(c)};return n(.034,.05,.07,ho),n(.052,.12,.1,YS),i.traverse(s=>{s.isMesh&&(s.castShadow=!1)}),i}const Xs=.9,qs=1.3,tf=.7,rl=.7,nf=new T(.3,-.5,-.75);let $n=null,Bo=null;const al=new T;new T;const Ys=new T,ol=i=>{const e=Math.min(1,Math.max(0,i));return e*e*(3-2*e)};function jS(){$n||($n=new tt,Bo=KS(),$n.add(Bo),$n.visible=!1,Sn.add($n))}function ZS(){$n&&($n.visible=!1)}function JS(i,e){const t=Array.isArray(i)?i:[i];jS(),Sp(),$n.visible=!0,t.forEach(h=>{const d=h.userData.type==="cat";ot(h,{wag:d?2.2:2.8,eyes:.55})}),ce.ok();const n=t.length,s=qs+rl,r=n*qs+(n-1)*rl,a=Xs+r+tf,o=t.map(()=>new T);let c=0,l=!1,u=!1;return h=>{c+=h,$n.position.copy(We.position),$n.quaternion.copy(We.quaternion),t.forEach((m,_)=>{m.userData.anchors.head.getWorldPosition(al),al.y-=.1,o[_].copy(We.worldToLocal(al))});let d=0,f=0;if(c<Xs)Ys.lerpVectors(nf,o[0],ol(c/Xs));else if(c<Xs+r){const m=c-Xs,_=Math.min(n-1,Math.floor(m/s)),g=m-_*s;g<qs?(Ys.copy(o[_]),f=g,d=Math.min(1,g/.3,Math.max(0,(qs-g)/.3+.2))):Ys.lerpVectors(o[_],o[_+1],ol((g-qs)/rl))}else Ys.lerpVectors(o[n-1],nf,ol((c-Xs-r)/tf));d>0&&(Ys.y+=.07*Math.abs(Math.sin(f/qs*Math.PI*2))*d),Bo.rotation.z=0,Bo.position.copy(Ys),!l&&c>a&&(l=!0,$n.visible=!1,t.forEach((m,_)=>{m.userData.hop=1,setTimeout(()=>m.userData.type==="cat"?ce.meow():ce.bark(),_*380)})),!u&&c>a+.9&&(u=!0,e())}}const Op=.42,Fp=.4,Mr={x:1.15,z:2.3},Sr={x:1.85,z:2.3},ma=()=>{bt(xe,Mr.x,In(),Mr.z,Math.PI,Op),bt(ge,Sr.x,In(),Sr.z,Math.PI,Fp)},$S=[{x:5.3,z:-2},{x:2.6,z:-2}],QS=[1.3,.3,-2],eb=[{x:2.6,z:-2},{x:1,z:-2},{x:-.55,z:-2.05}],kp=[-1.75,.75,-2.15],tb=[{x:-.55,z:-2.05},{x:-1,z:-.5},{x:-.6,z:.4},{x:.1,z:1},{x:.75,z:1.45}],nb=[1.5,.8,2.3],ib=[{x:.2,z:1.6},{x:-1,z:.8},{x:-1,z:-1.9},{x:1.3,z:-2.3,ry:Math.PI/2}],sb=[{x:.4,z:1.9},{x:-.9,z:.9},{x:-.9,z:-1.8},{x:1.3,z:-1.7,ry:Math.PI/2}],rb=[{x:-1,z:-1.9},{x:-1,z:.9},{x:.8,z:2},{x:Mr.x,z:Mr.z,get y(){return In()},ry:Math.PI}],ab=[{x:-.9,z:-1.8},{x:-.9,z:1},{x:1,z:2.1},{x:Sr.x,z:Sr.z,get y(){return In()},ry:Math.PI}];Pt.walk={stage:1,w:.05,prev:"start",next:"kit",enter(){an("fp"),Ko();const i=Dt.walk;let e=0;const t=_=>{e<1&&_>.3&&(e=1,Yi(null),zn(i.a.t,i.a.s)),e<2&&_>.55&&(e=2,zn(i.b.t,i.b.s),Yi(-1.75,-2.15,1.2,.4),ce.ding()),e<3&&_>.95?(e=3,su(i.stop.t,i.stop.s),An({x:-1.75,z:-2.15,r:1.6,label:i.open,fn:()=>Ht("kit")})):e===3&&_<.9&&(e=2,gs(),An(null))},n=_=>{da(!0),Uo({path:eb,look:kp,startAt:_,lookDown:.85,onProgress:t})};if(ot(xe,{}),ot(ge,{}),qi(!0,rn.greeted),rn.greeted){ma(),xe.visible=ge.visible=!0,e=1,zn(i.a.t,i.a.s),n(.4);return}rn.greeted=!0,ma(),xe.visible=ge.visible=!0,zn(i.greet.t,i.greet.s);const s=[pa({cls:"pill",label:"Cacao",anchor:xe.userData.anchors.head,onClick:()=>{xe.userData.hop=1,ce.bark()}}),pa({cls:"pill",label:"Nube",anchor:ge.userData.anchors.head,onClick:()=>{ge.userData.hop=1,ce.meow()}})];s.forEach(_=>_.hidden=!0);const r=()=>{Ip(),gs(),An(null),O.curTick=null,ot(xe,{}),ot(ge,{}),Hi(xe,rb,3.4),Hi(ge,ab,3.9),zn(i.hall.t,i.hall.s),n(0),ce.blip()};let a=!1,o=()=>{};da(!0),Uo({path:$S,look:QS,closeFrom:.35,continueLook:rn.enterSmooth,lookDown:.95,onProgress:_=>{!a&&_>.95?(a=!0,s.forEach(g=>g.hidden=!1),o(),su(i.greetStop.t,i.greetStop.s),An({x:1.3,z:-2,r:2.2,label:i.enter,fn:r})):a&&_<.9&&(a=!1,s.forEach(g=>g.hidden=!0),gs(),An(null))}});let c=0,l=!1,u=!1,h=!1,d=!1,f=0;const m=()=>{xe.userData.hop=1,ce.bark(),setTimeout(()=>{ge.userData.hop=1,ce.meow()},420)};o=m,O.curTick=_=>{c+=_,!l&&c>.7&&(l=!0,Hi(xe,ib,3.8),ot(xe,{wag:2.6,eyes:1.1}),ce.bark()),!u&&c>1.4&&(u=!0,Hi(ge,sb,3.4),ot(ge,{wag:2.4,eyes:1.1}),ce.meow()),l&&!h&&!xe.userData.walking&&(h=!0,xe.userData.hop=1,ce.bark()),u&&!d&&!ge.userData.walking&&(d=!0,ge.userData.hop=1,ce.meow()),h&&d&&(f+=_,f>2.6&&(f=0,m()))}}};const sf=new T(-1.75,.58,-2.15),rf=.22,af=5.45;Pt.kit={stage:1,w:.4,prev:"walk",next:()=>O.stepData.exitKit&&O.stepData.exitKit("petwalk"),enter(){an("stage"),Xt.bag.visible=!1,Ju("kit",sf,rf,.12),O.curExit=()=>Xt.bag.visible=!0;const i=Ct.kit,e=Dt.kit;let t=!1;O.stepData.exitKit=u=>{t||(t=!0,Xc(!1),ta(null),O.showRot=0,pe.follow=null,pe.goalT=[0,.77,0],pe.goalD=af,_t.liftGoal=1.4-(sf.y+rf*(.77+af*.14)),Vn.t=.9,setTimeout(()=>{O.cur==="kit"&&(Vn.t=0,Ht(u))},1300))},uM();const n=e.items.length,s=eh({title:e.title,text:e.text,zoom:5.4,autoNext:!0,backLabel:"Ver otros objetos",items:e.items.map((u,h)=>({anchor:i.items[h].userData.anchor,...u})),next:()=>O.stepData.exitKit("petwalk"),onPick:u=>i.items.forEach((h,d)=>h.userData.sel=u===d),onSeen:u=>(dM(u),ta(i.items[u].userData.anchor,6),setTimeout(()=>ta(i.bagAnchor,6.6),480),s.seen.size===n&&setTimeout(()=>Xc(!1),700),1200)});hM(),ce.blip();const r=u=>{const h=Math.min(1,Math.max(0,u));return h*h*(3-2*h)},a=(u,h,d)=>u+(h-u)*d;let o=0,c=!1;const l=cn.kit;O.curTick=u=>{if(o+=u,i.items.forEach((h,d)=>{s.buttons[d].hidden=h.userData.stage!=="out"}),!c&&o>1.45&&(c=!0,Xc(!0),Vn.t=.3,setTimeout(()=>Vn.t=0,450),ce.ding()),!(o>6.6||s.opened.size>0||t))if(o<1.6){const h=r(o/1.6);O.showRot=a(-1.4,-.5,h),pe.goalD=a(5.8,6.6,h),pe.goalT=[0,a(1.6,1,h),0]}else if(o<5.6){const h=r((o-1.6)/4);O.showRot=a(-.5,.5,h),pe.goalD=a(6.6,l.d+.6,h),pe.goalT=[0,a(1,1.3,h),0]}else{const h=r((o-5.6)/1);O.showRot=a(.5,0,h),pe.goalD=a(l.d+.6,l.d,h),pe.goalT=[0,a(1.3,l.t[1],h),0]}}}};Pt.petwalk={stage:1,w:.6,prev:"kit",next:"track",enter(){an("fp"),qi(!0,!0);const i=Dt.petwalk;ma(),ot(xe,{}),ot(ge,{}),xe.visible=ge.visible=!0,zn(i.t,i.s),Yi(1.5,2.3,1.35,.4),da(!0);let e=!1;Uo({path:tb,look:nb,lookDown:.85,introFrom:kp,onProgress:t=>{!e&&t>.95?(e=!0,su(i.stop.t,i.stop.s),An({x:1.5,z:2.3,r:2.4,label:i.open,fn:()=>{gs(),zn(null),Yi(null),da(!1),O.curExit=ZS,O.curTick=JS([xe,ge],()=>Ht("track"))}})):e&&t<.9&&(e=!1,gs(),An(null))}}),ce.bark()}};Pt.track={stage:1,w:.72,prev:"petwalk",next:"trackCat",enter(){an("stage"),qi(!0,!0),ma(),xe.visible=!1,ge.visible=!0,ot(ge,{}),Ju("track",new T(Mr.x,In()+.005,Mr.z),Op/2.1,.15),O.curExit=()=>xe.visible=ge.visible=!0;let i=Ct.track.dog.userData.anchors,e=Dt.track;ot(Ct.track.dog,{}),eh({title:e.title,text:e.text,zoom:4.4,backLabel:"Ver otros puntos",items:[i.tag,i.gps,i.chip].map((t,n)=>Object.assign({anchor:t,rot:[0,-1,Math.PI*.9][n]},e.items[n])),next:()=>Ht("trackCat")})}};Pt.trackCat={stage:1,w:.85,prev:"track",next:"antesEnd",enter(){an("stage"),qi(!0,!0),ma(),xe.visible=!0,ge.visible=!1,ot(xe,{}),Ju("trackCat",new T(Sr.x,In()+.005,Sr.z),Fp/2.7,.15),O.curExit=()=>xe.visible=ge.visible=!0;const i=Ct.trackCat.cat.userData.anchors,e=Dt.trackCat;ot(Ct.trackCat.cat,{}),eh({title:e.title,text:e.text,zoom:4.4,backLabel:"Ver otros puntos",items:[i.tag,i.gps,i.chip].map((t,n)=>({anchor:t,rot:[0,-1,Math.PI*.9][n],...e.items[n]})),next:()=>Ht("antesEnd")})}};const ob=1.5,of=2.2,cl=1.2,cf=1.4,lf={pos:new T(2.7,1.45,.55),look:new T(1.5,.85,2.3)},os=i=>{const e=Math.min(1,Math.max(0,i));return e*e*(3-2*e)},Ks=(i,e,t)=>i+(e-i)*t;Pt.antesEnd={stage:1,w:.95,prev:"trackCat",next:"quakeIntro",enter(){an("cine"),$u(),qi(!0,!0);const i=new T;We.getWorldDirection(i);const e={x:Kt(We.position.x,-1.7,3.1),z:Kt(We.position.z,-2.5,1.5)},t=Math.atan2(i.x,i.z),n=Ws.x-e.x,s=Ws.z-e.z,r=Math.hypot(n,s),a=r>.05?Math.atan2(n,s):0,o=r/ob,c=cl+o,l=r>.05?new T(-n/r,0,-s/r):new T(0,0,-1),u=A=>new T(Kt(A.x+l.x*2.3,-1.7,3.2),1.95,Kt(A.z+l.z*2.3,-1,2.6)),h=A=>new T(A.x,1.1,A.z),d=Je.userData;Je.visible=!1,Je.scale.setScalar(du),Je.userData.pack.visible=!0,Je.position.set(e.x,0,e.z),Je.rotation.y=t,xe.visible=ge.visible=!0,ot(xe,{wag:1.6,eyes:1.05}),ot(ge,{wag:1.4,eyes:1.05}),bt(xe,1.15,In(),hs,Math.PI,$d),bt(ge,1.85,In(),hs,Math.PI,Qd),O.curExit=()=>{ko(),bt(xe,1.15,In(),hs,Math.PI,$d),bt(ge,1.85,In(),hs,Math.PI,Qd)};const f=Dt.antesEnd,m=ji('<div class="closefx"><span class="kick">'+f.kick+"</span><h2>"+f.title+"</h2><p>"+f.text+'</p><button class="btn big cta">'+f.cta+"</button></div>");$(".cta",m).addEventListener("click",()=>{ce.blip(),Ki("quakeIntro")});const _=zt.pos.clone(),g=zt.look.clone(),p=new T;let M=0,v=!1,x=!1,P=0;O.curTick=A=>{if(M+=A,M<c){const L=os((M-cl)/Math.max(o,.01));p.set(Ks(e.x,Ws.x,L),0,Ks(e.z,Ws.z,L)),Je.position.copy(p),Je.rotation.y=Ks(t,t+Math.atan2(Math.sin(a-t),Math.cos(a-t)),os((M-.6)/.8));const S=M>cl&&M<c?Math.sin(M*8)*.65:0;d.legL.rotation.x=S,d.legR.rotation.x=-S,d.armL.rotation.x=-S*.8,d.armR.rotation.x=S*.8,Je.visible=M>.3}else{const L=os((M-c)/cf),E=XS();L>.2&&(Je.userData.pack.visible=!1),Je.position.set(Ks(Ws.x,th,L),E*os((L-.4)/.6),Ks(Ws.z,WS,L)),Je.rotation.y=Ks(a,Math.PI,os(L*1.6));const S=os((L-.3)/.7);qS(S),p.copy(Je.position),!x&&L>.3&&(x=!0,Hi(xe,[{x:VS,z:hs,y:In(),ry:Math.PI}],.5),Hi(ge,[{x:GS,z:hs,y:In(),ry:Math.PI}],.5)),!v&&L>=1&&(v=!0,ce.ok(),ot(xe,{wag:2.8,eyes:1.15}),ot(ge,{wag:2.4,eyes:1.15}),xe.userData.hop=1,ce.bark(),setTimeout(()=>{ge.userData.hop=1,ce.meow()},350)),v&&(P+=A,P>2.2&&(P=0,(Math.random()<.5?xe:ge).userData.hop=1,ce.blip()))}const C=p.clone();if(M<of){const L=os(M/of);Zo(_.clone().lerp(u(C),L),g.clone().lerp(h(C),L))}else M<c+cf*.3?hu(u(C),h(C),3.2):hu(lf.pos,lf.look,1.1)}}};const fo={spot:1,flees:0,dash:null,cornered:!1,reset(){this.flees=0,this.cornered=!1,this.dash=null,this.spot=Math.random()<.5?1:2;let i=ea[this.spot];bt(ge,i[0],i[1],i[2],Bt(0,6),.6)},update(i){let e=ge.userData;if(this.dash){let t=this.dash;t.t+=i/t.dur;let n=Math.min(1,t.t);e.base.x=qr(t.a[0],t.b[0],n),e.base.z=qr(t.a[2],t.b[2],n),e.base.y=qr(t.a[1],t.b[1],n),e.walking=!0,e.run=!0,ge.position.copy(e.base),ge.rotation.y=Math.atan2(t.b[0]-t.a[0],t.b[2]-t.a[2]),n>=1&&(e.walking=!1,e.run=!1,this.dash=null,this.spot=t.to,this.cornered&&(ge.rotation.y=-Math.PI/2,ot(ge,{wag:.2,shiver:.7,eyes:1.4})));return}if(!this.cornered&&Math.hypot(Ee.pos.x-e.base.x,Ee.pos.z-e.base.z)<2.2){let t;this.flees===0?t=this.spot===1?2:1:(t=0,this.cornered=!0),this.flees++;let n=ea[this.spot],s=ea[t];this.dash={a:n,b:s,t:0,to:t,dur:Math.hypot(s[0]-n[0],s[2]-n[2])/4.5},ce.meow()}}},fu=[{x:3.2,z:1.8,r:2.1,dog:{x:3.2,z:1.8,ry:Math.PI/2}},{x:-3.9,z:3.6,r:1.8,dog:{x:-3.95,z:3.6,ry:Math.PI}},{x:-.8,z:-3.7,r:1.8,dog:{x:-.8,z:-4.2,ry:0}}],cb={hide:Math.PI/2,still:0,cat:Math.PI/2};function Bp(i,e){const t=Dt.mission[i];rn.done.add(i),Ee.locked=!0,Je.visible=!1,O.hideBanner=!0,$("#hotspots").style.visibility="hidden",zn(null),Yi(null),An(null),iu(!1),ju.forEach(o=>o.visible=!1);const n=i==="cat"?ge:xe;n.visible=!0;const s=n.userData.base,r=cb[i];n.userData.faceTo=r,e&&(n.rotation.y=r),mS(new T(s.x,s.y+.45,s.z),e,r,2.3),Ve.shakeTarget=.15;const a=O.curExit;O.curExit=()=>{a&&a(),Ve.shakeTarget=1},i==="hide"?(ot(xe,{wag:0,shiver:.9,eyes:1.35}),ce.whimper()):i==="still"?(ot(xe,{wag:0,shiver:.4,eyes:1.4}),ce.whimper()):(ot(ge,{wag:.4,shiver:.3,eyes:1.4}),ce.meow()),setTimeout(()=>{O.stepData.reveal&&Ss({title:t.title,text:t.text,actions:[{label:"Regresar",fn:()=>Ki("hub",null,900)}]})},e?300:1900),O.stepData.reveal=!0}Pt.quakeIntro={stage:2,w:.04,prev:"antesEnd",next:"hub",enter(){an("orbit"),Jo({r:18,h:11}),Ko(),Zu(0,3.5),rn.done.clear(),ce.init(),qu(),O.bgOverride="night";const i=Dt.quakeIntro,e=i.text.split(" ").map((n,s)=>'<span style="--i:'+s+'">'+n+"</span>").join(" "),t=Ss({cls:"center quakecard",html:'<svg class="qline" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 20H120l8-4 8 8 8-16 8 28 8-34 8 30 8-22 8 14 8-6 8 4H400"/></svg><span class="qkick">'+i.kick+'</span><h2 class="qtitle">'+i.title+'</h2><p class="qtext">'+e+"</p>",actions:[{label:i.cta,cls:"danger",fn:()=>{t.classList.add("leaving"),Ki("hub",null,1100)}}]})}};Pt.hub={stage:2,w:.3,prev:"quakeIntro",next:"sizeIntro",enter(){an("orbit"),Jo({r:19,h:12,sy:innerWidth>720?2.6:3.6,amp:.12}),Ve.shakeTarget=1,Ve.target=yr.intensity;let i=Dt.hub;bt(xe,-4.4,.75,-4.05,.1,.62),ot(xe,{wag:0,shiver:.6,eyes:1.25}),xe.visible=!1,ge.visible=!1,O.curExit=()=>{xe.visible=!0,ge.visible=!0},bt(ge,-3.5,.75,-4.05,-.1,.6),ot(ge,{wag:0,shiver:.6,eyes:1.25}),Ve.active||qu();let e=ji('<div id="hub" class="active"><div class="wrap"><div class="hhead card"><h2>'+i.title+'</h2><p class="sub">'+i.sub+'</p><p class="limit">'+i.limit.replace("{n}",Gu)+'</p></div><div class="cards">'+i.cards.map((t,n)=>'<div class="exp card" style="--d:'+(.75+n*.35).toFixed(2)+'s">'+Up[t.pet]+'<div class="txt"><h3>'+t.t+"</h3><p>"+t.d+'</p></div><button class="btn" data-k="'+t.k+'">'+i.cta+"</button>"+(rn.done.has(t.k)?'<span class="badge">'+i.done+"</span>":"")+"</div>").join("")+'</div><div class="foot" style="--d:1.8s"><button class="btn" id="hubNext" '+(rn.done.size<3?"hidden":"")+">"+i.next+"</button></div></div></div>");Ti(".exp .btn",e).forEach(t=>t.addEventListener("click",()=>{ce.blip(),Ki("mission",{k:t.dataset.k},1e3)})),$("#hubNext",e).addEventListener("click",()=>{ce.blip(),Ht("sizeIntro")})}};Pt.mission={stage:2,w:.5,prev:"hub",next:i=>"close_"+i.k,enter(i){let e=i.k,t=Dt.mission[e],n=Gu;an("tp"),Zu(e==="cat"?0:-1,3.2),Je.scale.y=1,Y1(),ia&&($("#stick").hidden=!1),i.retry&&(Ko(),vp(6));let s=0,r=!1,a=n,o=n,c=!1,l=null,u=d=>{c=!0,d&&(bt(xe,d.x,0,d.z,d.ry,.62),xe.scale.y=.5),Bp(e,!1)},h=()=>{c=!0,Ee.locked=!0,An(null),Yi(null),zn(null),iu(!1),ce.no(),ce.whimper(),$("#blackout").classList.add("on");let d=Dt.mission.fail;Ss({title:d.t,text:d.s,cls:"center fail",actions:[{label:d.cta,fn:()=>{$("#panel").classList.add("leaving"),$("#blackout").classList.add("full"),setTimeout(()=>O.cur==="mission"&&Ht("mission",{k:e,retry:!0}),1e3)}}]})};if(iu(!0),kd(a,n),e==="hide"){ge.visible=!1,xe.visible=!1;const d=Math.floor(Math.random()*fu.length),f=fu.map((_,g)=>{const p=new tt,M=new je(new Er(.62,.78,40),new Yt({color:"#ffc24d",transparent:!0,opacity:.9,side:jt}));M.rotation.x=-Math.PI/2,M.position.y=.04;const v=new je(new gr(.2,.46,4),new Yt({color:"#ffc24d"}));v.rotation.x=Math.PI,v.position.y=1.5,p.add(M,v),p.position.set(_.x,0,_.z),Sn.add(p);const x=pa({cls:"pill",label:t.spots[g],anchor:v});return x.classList.add("search"),{marker:p,ring:M,cone:v,label:x,spot:_,k:g,checked:!1}});O.curExit=()=>f.forEach(_=>Sn.remove(_.marker));const m=()=>An(f.filter(_=>!_.checked).map(_=>({x:_.spot.x,z:_.spot.z,r:_.spot.r,label:t.open+" "+t.spots[_.k].toLowerCase(),fn:()=>{if(_.k===d)return f.forEach(g=>g.marker.visible=!1),u(_.spot.dog);_.checked=!0,_.ring.material.color.set("#9aa8c4"),_.cone.visible=!1,_.label.firstChild.textContent="✓ "+t.spots[_.k]+" · vacío",_.label.classList.add("checked"),ce.no(),zn(t.empty.t,t.empty.s),setTimeout(()=>O.cur==="mission"&&zn(null),2200),m()}})));m(),l=_=>{s+=_,s>4&&!r&&(r=!0,ce.whimper()),f.forEach(g=>{g.cone.position.y=1.5+Math.sin(O.time*3+g.k)*.15,g.ring.scale.setScalar(g.checked?1:1+Math.sin(O.time*3+g.k)*.12)})}}else e==="still"?(ge.visible=!1,xe.visible=!0,bt(xe,-4.4,.75,-4.05,.1,.62),ot(xe,{wag:0,shiver:.35,eyes:1.35}),Yi(-4.4,-4.05,2.1),An({x:-4.4,z:-4.05,r:2.6,label:t.open,fn:u})):(xe.visible=!1,ge.visible=!0,fo.reset(),ot(ge,{wag:1,shiver:.5,eyes:1.4}),l=d=>{fo.update(d),fo.cornered&&!fo.dash?An({x:ge.userData.base.x,z:ge.userData.base.z,r:2.3,label:t.open,fn:u}):An(null)});O.curTick=d=>{if(!c&&(l&&l(d),!c)){a-=d,kd(a,n);const f=Math.ceil(a);f!==o&&f>=1&&f<=5&&ce.tick(),o=f,a<=0&&h()}}}};["hide","still","cat"].forEach(i=>{Pt["close_"+i]={stage:2,w:.6,prev:"hub",next:()=>rn.done.size>=3?"sizeIntro":"hub",enter(){if(an("tp"),Zu(-1,3.2),i==="hide"){const e=fu[0].dog;ge.visible=!1,bt(xe,e.x,0,e.z,e.ry,.62),xe.scale.y=.5}else if(i==="still")ge.visible=!1,bt(xe,-4.4,.75,-4.05,.1,.62);else{xe.visible=!1;const e=ea[0];bt(ge,e[0],e[1],e[2],-Math.PI/2,.6)}Bp(i,!0)}}});const lb=["large","medium","cat"],ub=.2,$o=()=>({theta:.8,r:19,h:12,tx:0,ty:1,tz:0,sx:0,sy:innerWidth>720?2.6:3.6,amp:.12}),hb=()=>({...$o(),sy:0}),nh={theta:0,r:5.4,h:2.4,tx:-6.1,ty:.85,tz:.5,sx:0,sy:.15,amp:0},To=$o();let pu=$o();function ih(i){Object.keys(pu).forEach(e=>To[e]=kt(To[e],pu[e],2.2,i)),Jo({...To,speed:.09})}const ga={x:-6,z:-.25},_a={x:-6,z:1.25},mu={pick:.65,large:.82,medium:.56},db=.6,uf=.9;function Qo(i=mu.pick){bt(xe,ga.x,0,ga.z,uf,i),bt(ge,_a.x,0,_a.z,uf,db),xe.visible=ge.visible=!0,ot(xe,{wag:1.2,eyes:1.05}),ot(ge,{wag:1.1,eyes:1.05})}let po=null;function zp(){if(po)return po;const i=new tt;i.position.set(-7.15,0,-.5),i.add(z(De(.1,2.28,1.96,.03,"#c48b5a"),0,1.14,.99)),i.add(z(De(.04,1.8,1.4,.02,"#b57b4b"),.06,1.14,.99)),i.add(z(nt(.07,"#ffc24d"),.1,1.1,1.75));const e=z(De(.2,3.2,6,.01,"#050d1f"),-9.8,1.5,.5);return i.visible=e.visible=!1,Ge.root.add(i,e),po={group:i,dark:e},po}function fb(){Ve.active||qu(),Ve.shakeTarget=ub,Ve.target=yr.intensity*.4,ce.duck(.75)}function ec(i){an("orbit"),Je.visible=!1;const e=zp();Ge.plug.visible=!1,e.group.visible=e.dark.visible=!0,e.group.rotation.y=0,fb(),pu=i,O.curTick=ih,O.curExit=()=>{e.group.visible=e.dark.visible=!1,Ge.plug.visible=!0,xe.visible=ge.visible=!0,ko()}}const ds=i=>{const e=Math.min(1,Math.max(0,i));return e*e*(3-2*e)},Js=(i,e,t)=>i+(e-i)*t;Pt.sizeIntro={stage:2,w:.85,prev:"hub",next:"sizePick",enter(){Object.assign(To,$o()),ec(hb()),Qo(),Ss({text:Dt.sizeIntro.text,cls:"center soft",actions:[{label:"Continuar",fn:()=>Ht("sizePick")}]})}};Pt.sizePick={stage:2,w:.92,prev:"sizeIntro",next:"despIntro",enter(){ec({...nh}),Qo();const i=Ss({title:Dt.sizePick.title,html:'<p class="count"></p>',cls:"top gentle",actions:[{label:"Continuar",fn:()=>Ht("sizeOut")}]}),e=lb.length-rn.sizes.size;$(".count",i).textContent=e>0?"Faltan "+e+" tamaño"+(e>1?"s":"")+" por ver · toca uno":"Ya viste todos los tamaños";const t=innerWidth<720;[{key:"large",pet:xe,side:t?70:120,shift:-24},{key:"medium",pet:xe,side:t?70:120,shift:24},{key:"cat",pet:ge,side:t?-70:-110,shift:0}].forEach(({key:n,pet:s,side:r,shift:a})=>{const o=rn.sizes.has(n),c=pa({cls:"pill",label:(o?"✓ ":"")+Dt.sizes[n].name,anchor:s.userData.anchors.head,onClick:()=>Ht("sizeInfo",{key:n})});c.style.marginLeft=r+"px",c.style.marginTop=a+"px",c.classList.toggle("seen",o)})}};Pt.sizeInfo={stage:2,w:.97,prev:"sizePick",next:"despIntro",enter(i){const e=i.key,t=Dt.sizes[e];rn.sizes.add(e);const n=e==="cat",s=n?_a:ga;ec({...nh,r:3,h:1.3,tx:s.x-.1,ty:.5,tz:s.z,sx:-.58,sy:0}),Qo(),(n?xe:ge).visible=!1,Ss({title:t.name,text:t.text,cls:"top gentle",actions:[{label:"Ver otros tamaños",fn:()=>Ht("sizePick")}]});const r=$("#callouts");r.hidden=!1,r.className="near",r.innerHTML=t.items.map((c,l)=>'<div class="callout card" data-i="'+l+'"><div><h3>'+c.t+"</h3><p>"+c.d+"</p></div></div>").join("");const a=c=>{Ti(".callout",r).forEach((l,u)=>l.classList.toggle("on",c===u)),ce.ding()};Ti(".callout",r).forEach((c,l)=>c.addEventListener("click",()=>a(l))),a(0);let o=0;O.curTick=c=>{if(ih(c),o+=c,!n){const l=Js(mu.pick,mu[e],ds((o-.5)/1.2));xe.scale.set(l,l,l)}}}};Pt.sizeOut={stage:2,w:.99,prev:"sizePick",next:"despIntro",enter(){ec({...nh}),Qo();const i=zp().group,e=Je.userData,t={x:-5.4,z:5.3},n={x:-5.4,z:.5},s=2.5,r=3.4,a=1.4,o=r+a+.2,c=2.2,l=o+c+.3,u=1.2,h=l+u+.3;Je.scale.set(1,1,1),Je.visible=!0,Je.position.set(t.x,0,t.z),Je.rotation.y=Math.PI;let d=0,f=!1,m=!1,_=!1,g=!1;O.curTick=p=>{if(ih(p),d+=p,d<s){const M=ds(d/s);Je.position.set(Js(t.x,n.x,M),0,Js(t.z,n.z,M));const v=Math.sin(d*9)*.65;e.legL.rotation.x=v,e.legR.rotation.x=-v,e.armL.rotation.x=-v*.8,e.armR.rotation.x=v*.8}else d<o&&(e.legL.rotation.x=e.legR.rotation.x=0,e.armL.rotation.x=0,Je.rotation.y=Js(Math.PI,Math.PI*1.5,ds((d-s)/.6)),e.armR.rotation.x=Js(0,-1.3,ds((d-r+.5)/.5)));if(d>r&&d<l&&(f||(f=!0,ce.creak()),i.rotation.y=-1.45*ds((d-r)/a)),d>o&&!m&&(m=!0,ot(xe,{wag:2.6,eyes:1.1}),ot(ge,{wag:2.4,eyes:1.1}),Hi(xe,[{x:-7,z:ga.z+.2},{x:-9,z:ga.z+.2,ry:-Math.PI/2}],2.1),Hi(ge,[{x:-7,z:_a.z-.2},{x:-9,z:_a.z-.2,ry:-Math.PI/2}],1.9),ce.bark()),d>o&&d<l){const M=ds((d-o)/c);Je.position.set(Js(n.x,-9.2,M),0,.5),Je.rotation.y=-Math.PI/2;const v=M>0&&M<1?Math.sin(d*9)*.65:0;e.legL.rotation.x=v,e.legR.rotation.x=-v,e.armL.rotation.x=-v*.8,e.armR.rotation.x=v*.8}Je.position.x<-7.35&&(Je.visible=!1),xe.position.x<-7.35&&(xe.visible=!1),ge.position.x<-7.35&&(ge.visible=!1),d>l&&(_||(_=!0,ce.creak()),i.rotation.y=-1.45*(1-ds((d-l)/u))),d>h&&!g&&(g=!0,Ki("despIntro",null,1800))}}};const pb=(function(){let i="#f6c9a6",e="#d99a72",t="#4a8bdd",n="#3a73c2",s="#ff7a66",r="#14305e",a="#ffc24d",o="#9cc9cc",c={dog:{fur:"#d9a066",light:"#fff0d9",ear:"#a86a3a",nose:"#3b2a25"},cat:{fur:"#f4bb52",light:"#fff1cf",ear:"#e39a2f",nose:"#f08a7e"}},l=(M,v)=>'<svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+M+'"><rect width="240" height="150" rx="16" fill="#e4f1ff"/><ellipse cx="120" cy="136" rx="116" ry="18" fill="#cfe3fb"/>'+v+"</svg>",u=(M,v,x,P,A,C)=>{A=A||s,C=C||3;let L=Math.atan2(P-v,x-M),E=8,S=I=>I.toFixed(1);return'<path d="M'+M+" "+v+"L"+x+" "+P+'" stroke="'+A+'" stroke-width="'+C+'" stroke-linecap="round" fill="none"/><path d="M'+S(x-E*Math.cos(L-.5))+" "+S(P-E*Math.sin(L-.5))+"L"+x+" "+P+"L"+S(x-E*Math.cos(L+.5))+" "+S(P-E*Math.sin(L+.5))+'" stroke="'+A+'" stroke-width="'+C+'" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'},h=(M,v,x,P)=>'<g transform="translate('+M+" "+v+") rotate("+(x||0)+')"><rect x="-84" y="-15" width="52" height="30" rx="9" fill="'+(P||t)+'"/><rect x="-38" y="-15" width="8" height="30" rx="3" fill="'+n+'"/><rect x="-30" y="-9" width="18" height="18" fill="'+i+'"/><rect x="-16" y="-12" width="30" height="24" rx="10" fill="'+i+'" stroke="'+e+'" stroke-width="1.5"/>'+[-10,-3.5,3,9.5].map(function(A,C){return'<rect x="6" y="'+A+'" width="'+(22-Math.abs(C-1.5)*2)+'" height="6" rx="3" fill="'+i+'" stroke="'+e+'" stroke-width="1.3"/>'}).join("")+'<ellipse cx="-4" cy="-13" rx="9" ry="4.6" transform="rotate(-18 -4 -13)" fill="'+i+'" stroke="'+e+'" stroke-width="1.3"/></g>',d=(M,v,x,P,A)=>'<g transform="translate('+M+" "+v+") rotate("+(A||0)+')"><rect x="'+-x/2+'" y="'+-P/2+'" width="'+x+'" height="'+P+'" rx="4" fill="#fff" stroke="#c9d5e8" stroke-width="1.5"/><rect x="'+(-x/2+4)+'" y="'+(-P/2+4)+'" width="'+(x-8)+'" height="'+(P-8)+'" rx="2" fill="#ffe3df"/><circle cx="0" cy="0" r="'+Math.min(x,P)/5+'" fill="'+s+'" opacity=".75"/></g>',f=(M,v,x)=>'<path transform="translate('+M+" "+v+") scale("+(x||1)+')" d="M0-7C3-2 5 1 5 3.500a5 5 0 0 1-10 0C-5 1-3-2 0-7z" fill="#e5483a"/>',m=(M,v)=>[8,15,22].map(function(x,P){return'<path d="M'+(M-x*.7)+" "+(v-x*.7)+"A"+x+" "+x+" 0 0 1 "+(M+x*.7)+" "+(v-x*.7)+'" stroke="'+s+'" stroke-width="3" fill="none" stroke-linecap="round" opacity="'+(1-P*.25)+'"/>'}).join(""),_=(M,v,x,P)=>{let A=c.dog;return'<g transform="translate('+M+" "+v+") scale("+x+')"><ellipse cx="100" cy="82" rx="94" ry="6" fill="#14305e" opacity=".1"/><path d="M28 44Q8 40 6 20" stroke="'+A.fur+'" stroke-width="10" stroke-linecap="round" fill="none"/><rect x="30" y="54" width="14" height="27" rx="7" fill="'+A.ear+'"/><rect x="118" y="58" width="13" height="24" rx="6.500" fill="'+A.ear+'"/><ellipse cx="88" cy="50" rx="64" ry="30" fill="'+A.fur+'"/><ellipse cx="92" cy="66" rx="46" ry="13" fill="'+A.light+'" opacity=".9"/><rect x="46" y="58" width="15" height="24" rx="7.500" fill="'+A.fur+'"/><rect x="102" y="60" width="14" height="22" rx="7" fill="'+A.fur+'"/><ellipse cx="53" cy="80" rx="9" ry="4" fill="'+A.light+'"/><ellipse cx="109" cy="80" rx="8.500" ry="4" fill="'+A.light+'"/><circle cx="158" cy="44" r="23" fill="'+A.fur+'"/><ellipse cx="177" cy="52" rx="14" ry="10" fill="'+A.light+'"/><circle cx="188" cy="48" r="4.500" fill="'+A.nose+'"/><ellipse cx="146" cy="30" rx="8" ry="16" transform="rotate(22 146 30)" fill="'+A.ear+'"/>'+(P==="open"?'<circle cx="166" cy="40" r="3" fill="'+r+'"/>':'<path d="M160 41q4 3.500 8 0" stroke="'+r+'" stroke-width="2.200" fill="none" stroke-linecap="round"/>')+'<path d="M132 44a24 24 0 0 0 5 18" stroke="'+s+'" stroke-width="5" fill="none" stroke-linecap="round"/></g>'},g=(M,v,x,P)=>{let A=c.cat;return'<g transform="translate('+M+" "+v+") scale("+x+')"><ellipse cx="92" cy="78" rx="84" ry="5.500" fill="#14305e" opacity=".1"/><path d="M42 58Q14 66 10 42Q8 30 20 30" stroke="'+A.fur+'" stroke-width="9" stroke-linecap="round" fill="none"/><rect x="38" y="52" width="13" height="25" rx="6.500" fill="'+A.ear+'"/><rect x="112" y="56" width="12" height="22" rx="6" fill="'+A.ear+'"/><ellipse cx="86" cy="50" rx="52" ry="25" fill="'+A.fur+'"/><ellipse cx="90" cy="63" rx="38" ry="11" fill="'+A.light+'" opacity=".9"/><rect x="54" y="56" width="13" height="21" rx="6.500" fill="'+A.fur+'"/><rect x="100" y="58" width="12" height="19" rx="6" fill="'+A.fur+'"/><circle cx="146" cy="44" r="21" fill="'+A.fur+'"/><path d="M130 32L133 10L148 26Z" fill="'+A.fur+'"/><path d="M148 26L162 10L164 36Z" fill="'+A.fur+'"/><path d="M134 27L135 17L142 25Z" fill="#f7a8a0"/><ellipse cx="154" cy="53" rx="10" ry="7.500" fill="'+A.light+'"/><path d="M151 49h7l-3.500 4z" fill="'+A.nose+'"/>'+('<path d="M137 43q4 3.500 8 0M152 42q4 3.500 8 0" stroke="'+r+'" stroke-width="2" fill="none" stroke-linecap="round"/>')+'<path d="M162 50l14-3M162 54l14 1" stroke="'+r+'" stroke-width="1.200" stroke-linecap="round" opacity=".55"/></g>'},p={};return p.dogMuzzle=()=>{let M=c.dog;return l("Bozal de emergencia con una tira de tela",'<ellipse cx="128" cy="130" rx="70" ry="7" fill="#14305e" opacity=".1"/><ellipse cx="72" cy="52" rx="16" ry="34" transform="rotate(14 72 52)" fill="'+M.ear+'"/><circle cx="102" cy="74" r="46" fill="'+M.fur+'"/><ellipse cx="146" cy="92" rx="38" ry="25" fill="'+M.light+'"/><circle cx="176" cy="84" r="7" fill="'+M.nose+'"/><circle cx="118" cy="62" r="4.500" fill="'+r+'"/><path d="M110 51q9-6 17-1" stroke="'+M.ear+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M128 78Q104 56 78 62" stroke="'+s+'" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="126" y="76" width="34" height="34" rx="10" fill="'+s+'"/><path d="M130 88h26M130 98h26" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/><circle cx="76" cy="63" r="8" fill="#e8604c"/><path d="M72 68l-10 16M79 69l4 17" stroke="'+s+'" stroke-width="6" stroke-linecap="round"/>'+u(204,44,178,66,r,3)+h(212,24,150,t))},p.dogCheck=()=>l("Revisar respiración y pulso en el pecho del perro",_(22,50,.95)+m(146,52)+h(132,78,90)+u(190,40,190,26,s,3)+u(198,26,198,40,s,3)),p.dogBleed=()=>l("Presionar una herida con gasa limpia",_(22,52,.95)+d(123,110,26,20,-8)+f(105,124,.9)+f(146,126,.8)+h(124,96,90)+u(172,60,172,84,s,3)),p.dogCPR=()=>l("Compresiones sobre el pecho con las manos apiladas",_(20,56,.95)+h(126,84,90,t)+h(130,74,90,"#6aa5f0")+u(184,46,184,62,s,3)+u(194,62,194,46,s,3)+'<circle cx="58" cy="30" r="3.500" fill="'+s+'"/><circle cx="72" cy="30" r="3.500" fill="'+s+'" opacity=".7"/><circle cx="86" cy="30" r="3.500" fill="'+s+'" opacity=".45"/>'),p.dogStretcher=()=>l("Trasladar a un perro herido sobre una manta",'<ellipse cx="120" cy="132" rx="84" ry="8" fill="#14305e" opacity=".12"/><g transform="translate(0 -14)"><path d="M28 92L212 92L226 112L14 112Z" fill="'+o+'"/><path d="M28 92L212 92L226 112L14 112Z" fill="none" stroke="#7fb0b3" stroke-width="2"/><path d="M50 94L44 110M90 94L86 110M130 94L128 110M170 94L172 110M208 94L212 110" stroke="#7fb0b3" stroke-width="2" opacity=".6"/>'+_(28,34,.86,"closed").replace('<ellipse cx="100" cy="82" rx="94" ry="6" fill="#14305e" opacity=".1"/>',"")+"</g>"+h(14,96,-20)+'<g transform="translate(240 0) scale(-1 1)">'+h(14,96,-20)+"</g>"+u(120,60,120,40,s,3)),p.catTowel=()=>{let M=c.cat;return l("Envolver al gato en una toalla dejando la cabeza libre",'<ellipse cx="124" cy="128" rx="78" ry="7" fill="#14305e" opacity=".1"/><rect x="42" y="58" width="120" height="64" rx="32" fill="#fff"/><path d="M62 58v64M92 58v64M122 58v64" stroke="'+o+'" stroke-width="9" opacity=".85"/><rect x="42" y="58" width="120" height="64" rx="32" fill="none" stroke="#c9d5e8" stroke-width="2"/><circle cx="170" cy="86" r="26" fill="'+M.fur+'"/><path d="M152 72L154 46L172 64Z" fill="'+M.fur+'"/><path d="M172 64L190 48L192 76Z" fill="'+M.fur+'"/><path d="M156 66L157 54L166 64Z" fill="#f7a8a0"/><ellipse cx="180" cy="97" rx="12" ry="9" fill="'+M.light+'"/><path d="M176 92h8l-4 4.500z" fill="'+M.nose+'"/><circle cx="163" cy="82" r="3.200" fill="#2f8f6d"/><circle cx="180" cy="81" r="3.200" fill="#2f8f6d"/>'+h(100,52,90)+u(206,50,196,66,r,3))},p.catBreath=()=>l("Observar cuántas veces respira el gato por minuto",g(24,54,1)+u(96,44,96,30,s,3)+u(106,30,106,44,s,3)+u(116,44,116,30,s,3)+'<g transform="translate(196 34)"><circle r="19" fill="#fff" stroke="'+r+'" stroke-width="3"/><path d="M0-11V0l7 5" stroke="'+s+'" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="-4" y="-27" width="8" height="5" rx="2" fill="'+r+'"/></g>'),p.catBleed=()=>l("Presionar una herida de la pata con gasa",g(22,54,1)+d(122,116,22,18,-6)+f(104,122,.8)+f(142,124,.7)+h(122,98,90)+u(170,64,170,86,s,3)),p.catCPR=()=>l("Compresiones con una sola mano rodeando el pecho",g(22,56,1)+'<ellipse cx="112" cy="80" rx="15" ry="4.500" fill="'+i+'" stroke="'+e+'" stroke-width="1.300"/><ellipse cx="104" cy="82" rx="10" ry="4" fill="'+i+'" stroke="'+e+'" stroke-width="1.300"/>'+h(112,72,90)+u(170,50,170,66,s,3)+u(180,66,180,50,s,3)),p.catCarrier=()=>{let M=c.cat;return l("Llevar al gato en una transportadora cubierta con una toalla",'<ellipse cx="120" cy="132" rx="82" ry="7" fill="#14305e" opacity=".12"/><path d="M92 58Q92 32 120 32Q148 32 148 58" stroke="'+r+'" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="50" y="56" width="140" height="72" rx="14" fill="'+t+'"/><rect x="118" y="66" width="62" height="54" rx="8" fill="#14305e" opacity=".9"/><circle cx="138" cy="90" r="6" fill="'+M.fur+'"/><circle cx="160" cy="90" r="6" fill="'+M.fur+'"/><circle cx="138" cy="90" r="2.500" fill="#2f8f6d"/><circle cx="160" cy="90" r="2.500" fill="#2f8f6d"/><path d="M143 100h12" stroke="'+M.light+'" stroke-width="3" stroke-linecap="round"/>'+[126,138,150,162,174].map(function(v){return'<path d="M'+v+' 66V120" stroke="#dfe8f7" stroke-width="2.500"/>'}).join("")+'<path d="M44 58Q80 46 116 60Q124 88 118 104Q86 110 52 100Z" fill="#fff" stroke="#c9d5e8" stroke-width="2"/><path d="M62 62v36M84 58v42M104 62v36" stroke="'+o+'" stroke-width="7" opacity=".85"/>'+h(120,24,90))},p.evac=()=>{let M=c.dog;return l("Salir con las mascotas por la ruta segura hacia el punto de encuentro",'<rect x="8" y="46" width="52" height="58" rx="6" fill="#fff"/><path d="M4 50L34 22L64 50Z" fill="'+s+'"/><rect x="26" y="70" width="16" height="34" rx="3" fill="'+a+'"/><path d="M50 118Q120 96 178 112" stroke="'+t+'" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" fill="none"/><g transform="translate(76 76)"><circle cx="14" cy="8" r="9" fill="'+i+'"/><path d="M14 18v28M14 26l-11 14M14 26l14 12M14 46l-8 20M14 46l10 20" stroke="'+t+'" stroke-width="6" stroke-linecap="round" fill="none"/></g><path d="M104 104Q118 108 132 116" stroke="'+s+'" stroke-width="3" fill="none"/><g transform="translate(118 96) scale(.34)"><ellipse cx="60" cy="78" rx="52" ry="30" fill="'+M.fur+'"/><rect x="24" y="90" width="14" height="34" rx="7" fill="'+M.ear+'"/><rect x="84" y="90" width="14" height="34" rx="7" fill="'+M.ear+'"/><circle cx="118" cy="42" r="26" fill="'+M.fur+'"/><ellipse cx="136" cy="50" rx="15" ry="11" fill="'+M.light+'"/><circle cx="148" cy="46" r="5" fill="'+M.nose+'"/><ellipse cx="106" cy="26" rx="9" ry="18" fill="'+M.ear+'"/></g><g transform="translate(180 62)"><rect x="0" y="0" width="5" height="52" fill="'+r+'"/><path d="M5 0h40l-10 12 10 12H5z" fill="#2fbf71"/><circle cx="2.500" cy="54" r="7" fill="'+r+'"/></g><g transform="translate(60 84)"><rect x="0" y="0" width="22" height="16" rx="4" fill="'+t+'"/><path d="M4 0Q11-9 18 0" stroke="'+r+'" stroke-width="2.500" fill="none"/></g>')},p})(),tc=new T(10.6,1.65,-2.35),mb=new T(8.4,1.5,-2.2),nc=new T(4.6,1,-2),gb=28;let xa=0;const sh=i=>{xa+=i,hu(tc.clone().lerp(mb,Kt(xa/gb,0,1)),nc,1.6)};function rh(){qi(!1,!0),ko(),Je.visible=!0,Je.scale.setScalar(.85),Je.position.set(5.4,0,-2.05),Je.rotation.y=Math.PI/2,bt(xe,5.2,0,-3.05,Math.PI/2-.3,.5),bt(ge,5.2,0,-1.05,Math.PI/2+.3,.48),xe.visible=ge.visible=!0,ot(xe,{wag:1.8,eyes:1.05}),ot(ge,{wag:1.4,eyes:1.05}),O.curExit=()=>{ko(),xe.visible=ge.visible=!0}}Pt.despIntro={stage:3,w:.05,prev:"sizePick",next:"guide",enter(){an("cine"),Zo(tc,nc),xa=0,rh(),O.curTick=sh;const i=Dt.despIntro,e=ji('<div class="closefx quick"><span class="kick">'+i.kick+"</span><h2>"+i.title+"</h2><p>"+i.text+'</p><button class="btn big cta">'+i.cta+"</button></div>");$(".cta",e).addEventListener("click",()=>{ce.blip(),Ht("guide")})}};const _b='<svg class="kitbag" viewBox="0 0 220 210" aria-hidden="true"><path d="M78 42c0-22 12-34 32-34s32 12 32 34" fill="none" stroke="#14305e" stroke-width="9" stroke-linecap="round"/><rect x="14" y="36" width="192" height="172" rx="52" fill="#ff7a66"/><rect x="14" y="36" width="192" height="70" rx="34" fill="#ff917f"/><rect x="52" y="116" width="116" height="78" rx="20" fill="#ffc24d"/><path d="M110 130v50M85 155h50" stroke="#fff" stroke-width="13" stroke-linecap="round"/><path d="M60 70h100" stroke="#14305e" stroke-width="6" stroke-linecap="round" opacity=".35"/></svg>';Pt.guide={stage:3,w:.4,prev:"despIntro",next:"quiz",enter(){const i=O.mode==="cine";an("cine"),i?$u():(Zo(tc,nc),xa=0),rh(),O.curTick=sh;const e=Dt.guide,t=(c,l)=>'<div class="fa"><figure>'+pb[c.ill]()+'<span class="n">'+(l+1)+"</span></figure><div><h3>"+c.t+"</h3><p>"+c.d+"</p></div></div>",n=(c,l)=>'<section class="gcol"><header>'+Up[l]+"<h2>"+c.title+'</h2></header><p class="gintro">'+c.intro+"</p>"+c.steps.map(t).join("")+'<p class="end">Fin de la sección</p></section>',s=ji('<div class="kitrise"><div class="sheet" role="document"><div class="sheetcols">'+n(e.tabs[0],"dog")+n(e.tabs[1],"cat")+'</div><div class="sheetfoot"><p id="gMsg">'+e.hint+'</p><button class="btn" id="gNext">Continuar</button></div></div>'+_b+"</div>");ce.whoosh(),setTimeout(()=>O.cur==="guide"&&ce.ding(),1500);const r=new Set,a=new IntersectionObserver(c=>c.forEach(l=>{!l.isIntersecting||l.target.dataset.seen||(l.target.dataset.seen=1,l.target.classList.add("ok"),r.add(l.target),ce.ding(),r.size>=2&&($("#gMsg",s).textContent=e.done))}),{threshold:.9});Ti(".gcol .end",s).forEach(c=>a.observe(c)),O.stepData.io=a;let o=!1;$("#gNext",s).addEventListener("click",()=>{o||(o=!0,ce.blip(),$(".kitrise",s).classList.add("closing"),setTimeout(()=>O.cur==="guide"&&Ht("quiz"),2300))})}};Pt.quiz={stage:3,w:.8,prev:"guide",next:"close",enter(){const i=O.mode==="cine";an("cine"),i?$u():(Zo(tc,nc),xa=0),rh(),O.curTick=sh,document.body.classList.add("blurred");const e=Dt.quiz,t=["a","b","c"],n=Zp([0,1,2]),s=ji('<div class="quiz"><div class="qcard card"><h2 class="qtype" aria-label="'+e.q+'"></h2><p class="qhint">'+e.hint+'</p></div><div class="flips">'+n.map((u,h)=>{const d=e.opts[u];return'<button class="flip" data-ok="'+(d.ok?1:0)+'" aria-label="Opción '+t[h]+'"><span class="face front"><b>'+t[h]+"</b><span>"+d.text+'</span></span><span class="face back '+(d.ok?"ok":"no")+'"><strong>'+(d.ok?e.good:e.bad)+"</strong><span>"+d.fb+"</span></span></button>"}).join("")+'</div><div class="quizfoot"><button class="btn" id="qNext" disabled>'+e.cta+'</button><small id="qMsg">'+e.wait+"</small></div></div>"),r=$(".qtype",s),a=[];let o=0;const c=setInterval(()=>{o++,r.textContent=e.q.slice(0,o),o>=e.q.length&&(clearInterval(c),r.classList.add("done"),a.push(setTimeout(()=>$(".qhint",s).classList.add("show"),300)),Ti(".flip",s).forEach((u,h)=>a.push(setTimeout(()=>{u.classList.add("in"),ce.blip()},700+h*650))),a.push(setTimeout(()=>$(".quizfoot",s).classList.add("in"),700+3*650)))},26),l=O.curExit;O.curExit=()=>{clearInterval(c),a.forEach(clearTimeout),document.body.classList.remove("blurred"),l&&l()},Ti(".flip",s).forEach(u=>u.addEventListener("click",()=>{u.classList.contains("flipped")||(u.classList.add("flipped"),u.dataset.ok==="1"?(ce.ok(),$("#qNext",s).disabled=!1,$("#qMsg",s).textContent="",ge.userData.hop=1,xe.userData.hop=1):ce.no())})),$("#qNext",s).addEventListener("click",()=>{ce.blip(),Ht("close")})}};Pt.close={stage:4,w:.6,prev:"quiz",next:"about",enter(){an("show"),Qu("fin"),O.bgOverride="dawn",pe.d=15,pe.rate=1.1,pe.offY=-.14;let i=Dt.close,e=Ct.fin;ot(e.dog,{}),ot(e.cat,{});let t='<svg viewBox="0 0 24 24"><path d="M5 12l4.5 4.5L19 7"/></svg>',n=ji('<div class="fin"><span class="kick">'+i.kicker+'</span><div class="words">'+i.words.map(l=>'<span class="w">'+l+"</span>").join("")+'</div><p class="line">'+i.text+'</p><ul class="chips">'+i.chips.map(l=>"<li>"+t+l+"</li>").join("")+'</ul><button class="btn big cta" id="finBtn">'+i.cta+"</button></div>");$("#finBtn",n).addEventListener("click",()=>{ce.blip(),Ht("about")});let s=$("#flash");s.classList.remove("on"),s.offsetWidth,s.classList.add("on"),ce.swell();let r=0,a=0,o=0,c=0;O.curTick=l=>{r+=l,!a&&r>1.6&&(a=1,e.dog.userData.hop=1,ce.bark()),!o&&r>2.8&&(o=1,e.cat.userData.hop=1,ce.meow()),r>6&&(c+=l,c>3&&(c=0,(Math.random()<.5?e.dog:e.cat).userData.hop=1))}}};Pt.about={stage:4,w:.9,prev:"close",enter(){an("show"),Qu("fin"),O.bgOverride="dawn",pe.offY=-.26;let i=Dt.about,e=ji('<div class="about dawn card"><div class="logo-c">'+Np("paw")+"</div><h2>"+i.title+"</h2><p>"+i.text+'</p><button class="btn" id="restart">'+i.cta+"</button></div>");$("#restart",e).addEventListener("click",n=>{ce.blip(),NS(n.currentTarget)});let t=0;O.curTick=n=>{t+=n,t>3&&(t=0,(Math.random()<.5?Ct.fin.dog:Ct.fin.cat).userData.hop=1)}}};addEventListener("wheel",i=>{ae.active&&(i.preventDefault(),Yu(i.deltaMode===1?i.deltaY*16:i.deltaY))},{passive:!1});addEventListener("pointermove",i=>{ae.mx=i.clientX/innerWidth*2-1,ae.my=i.clientY/innerHeight*2-1});const hf={ArrowDown:140,PageDown:400,Space:400,ArrowUp:-140,PageUp:-400};addEventListener("keydown",i=>{if(ae.active&&hf[i.code]!==void 0&&document.activeElement===document.body){i.preventDefault(),Yu(hf[i.code]);return}i.repeat&&(i.code==="KeyE"||i.code==="Enter")||(jo.add(i.code),(O.mode==="fp"||O.mode==="tp")&&["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(i.code)>=0&&i.preventDefault(),(i.code==="KeyE"||i.code==="Enter"&&document.activeElement===document.body)&&Lp())});addEventListener("keyup",i=>jo.delete(i.code));addEventListener("blur",()=>jo.clear());$("#prompt .btn").addEventListener("click",Lp);$("#navBack").addEventListener("click",()=>Dp("back"));$("#navNext").addEventListener("click",()=>Dp("next"));const df=["home","start","quakeIntro","despIntro","close"];Ti("#stages button").forEach((i,e)=>i.addEventListener("click",()=>{!Pt[O.cur]||O.cur==="home"||O.cur===df[e]||(ce.blip(),Ki(df[e]))}));const Hp=i=>{i.target.closest&&i.target.closest("#musicBtn")||(ce.init(),["pointerdown","keydown","wheel","touchstart"].forEach(e=>removeEventListener(e,Hp,!0)))};["pointerdown","keydown","wheel","touchstart"].forEach(i=>addEventListener(i,Hp,{capture:!0,passive:!0}));$("#musicBtn").addEventListener("click",()=>{let i=ce.toggleMusic();Vp(i)});function Vp(i){let e=$("#musicBtn");e.setAttribute("aria-pressed",i),e.innerHTML='<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>'+(i?"":'<path d="M3 3l18 18"/>')+"</svg>"}Vp(!0);document.addEventListener("visibilitychange",()=>{let i=ce.ctx;i&&(document.hidden?i.suspend():ce.on&&i.resume())});$("#startBtn").addEventListener("click",i=>{ce.init(),ce.blip(),LS(i.currentTarget)});(function(){let i=$("#stick"),e=$("i",i),t=null,n=r=>{let a=i.getBoundingClientRect(),o=(r.clientX-a.left-a.width/2)/(a.width/2),c=(r.clientY-a.top-a.height/2)/(a.height/2),l=Math.hypot(o,c)||1,u=Math.min(1,l);Fi.x=o/l*u,Fi.y=c/l*u,e.style.transform="translate("+Fi.x*36+"px,"+Fi.y*36+"px)"};i.addEventListener("pointerdown",r=>{t=r.pointerId,i.setPointerCapture(t),n(r)}),i.addEventListener("pointermove",r=>{r.pointerId===t&&n(r)});let s=r=>{r.pointerId===t&&(t=null,Fi.x=Fi.y=0,e.style.transform="")};i.addEventListener("pointerup",s),i.addEventListener("pointercancel",s)})();(function(){let i=null;js.addEventListener("pointerdown",t=>{i={x:t.clientX,y:t.clientY,id:t.pointerId},js.setPointerCapture(t.pointerId)}),js.addEventListener("pointermove",t=>{if(!i||t.pointerId!==i.id)return;let n=t.clientX-i.x,s=t.clientY-i.y;i.x=t.clientX,i.y=t.clientY,ae.active?t.pointerType==="touch"&&Yu(-s*2):O.mode==="fp"?(Ee.yaw-=n*.005,Ee.pitch=Kt(Ee.pitch-s*.004,-.9,.9)):(O.mode==="show"||O.mode==="stage")&&(O.showRot+=n*.01)});let e=()=>{i=null};js.addEventListener("pointerup",e),js.addEventListener("pointercancel",e)})();addEventListener("resize",()=>{gp(),O.cur==="home"&&Pt.home.layout()});window.petalert={goTo:Ht,steps:Pt,state:O,player:Ee};const xb={fp:68,show:36,stage:36,cine:50,orbit:34,tp:34};let ff=performance.now(),mo=0;function Gp(i){const e=Math.min(.05,(i-ff)/1e3);ff=i,O.time+=e,xM(e),O.curTick&&O.curTick(e),ru(e),tM(e),eM(e),nM(e),xS(),pM(e),fS(e),gS(e),Vn.v=kt(Vn.v,Vn.t,3,e);const t=xb[O.mode]+Vn.v*26+rM(),n=O.mode==="stage"||O.mode==="cine",s=n||mo>0?kt(We.fov,t,3,e):t;mo>0&&(mo-=e),n&&(mo=1.6),Math.abs(We.fov-s)>.02&&(We.fov=s,We.updateProjectionMatrix()),AS(e),vS(),Cp(),Ms.render(O.scene,We),MS(),yS(),requestAnimationFrame(Gp)}const go=(i=60)=>new Promise(e=>setTimeout(e,i));async function vb(){const i=$("#loadBar"),e=$("#loaderMsg");gp(),wS();try{i.style.width="15%",await go(),q1(),Q1(),i.style.width="45%",e.textContent="Cargando la sala…",await dS(),i.style.width="60%",e.textContent="Acomodando a las mascotas…",await go(),fM(),i.style.width="75%",e.textContent="Guardando el kit de emergencia…",await go(),cM(),lM(null),i.style.width="100%",e.textContent="Todo listo",await go(500)}catch(t){e.textContent="Ocurrió un error al preparar la escena. Recarga la página.",console.error(t);return}requestAnimationFrame(Gp),ce.init(),Ht("home"),$("#loader").classList.add("out"),setTimeout(()=>{$("#loader").hidden=!0},800)}vb();
//# sourceMappingURL=index-Uyoqf41D.js.map
