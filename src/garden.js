export function gardenMarkup(){return `<article class="project-card card-1 garden-project" aria-labelledby="garden-title"><div class="garden-stage"><canvas tabindex="0" role="button" aria-label="粒子花园，移动鼠标拨动花朵，点击或按回车播种一朵新花"></canvas><div class="garden-top"><span>Growing with code</span><button type="button" class="garden-pause" aria-pressed="false">暂停生长</button></div><div class="garden-cover"><span>Particle<br><em>garden.</em></span><p>一片由代码生长的花海</p></div><span class="garden-hint">移动探索 / 点击播种</span></div><div class="card-caption"><div><h3 id="garden-title">Particle garden</h3><p>创意编程 / 生成式视觉 <span>/ 粒子花园</span></p></div><span class="av-live">可交互</span></div><div class="garden-bottom"><p class="garden-status" aria-live="polite">让指尖的风，经过这片花园。</p><button class="garden-reset" type="button">重新生长 ↻</button></div></article>`}
export function mountGarden(root){
 const host=root.querySelector('.garden-project');if(!host)return ()=>{};
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const status=host.querySelector('.garden-status'),pause=host.querySelector('.garden-pause');
 const abort=new AbortController(),signal=abort.signal,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let w=1,h=1,points=[],flowers=[],raf=0,visible=false,paused=reduced.matches,last=0,seed=217,random,planted=0,clock=0;
 const pointer={x:-1000,y:-1000};
 function rng(s){return ()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
 function point(x,y,color,r,alpha,phase,sway=1){points.push({x,y,color,r,alpha,phase,sway,dx:0,dy:0,vx:0,vy:0})}
 function flower(f,index){
  const x=f.x*w,y=f.y*h,r=f.r*Math.min(w,h),phase=index*1.73,colors=['#c4b5e4','#e3b4cf','#e5dfaf','#b7c5ef','#d6bcdf'];const color=colors[index%colors.length];
  const ground=h*(1.04+random()*.12),bend=(random()-.5)*r*1.8;
  for(let n=0;n<65;n++){const t=n/64;point(x+bend*Math.sin(t*Math.PI*.7)+(random()-.5)*2,y+(ground-y)*t,'#819d8b',.45+random()*.5,.25+random()*.25,phase,1-t*.8)}
  for(let side of [-1,1]){const ly=y+(ground-y)*(.4+random()*.2);for(let n=0;n<32;n++){const t=random(),lx=x+side*r*.85*t;point(lx,ly-r*.35*Math.sin(t*Math.PI)+(random()-.5)*r*.12,'#9cb0a0',.5+random()*.5,.35,phase,.5)}}
  const petals=5+index%4,rotation=random()*6.28;
  for(let p=0;p<petals;p++){
   const a=p/petals*Math.PI*2+rotation;
   for(let n=0;n<48;n++){
    const angle=random()*Math.PI*2,rad=Math.sqrt(random()),along=r*(.53+Math.cos(angle)*rad*.47),across=Math.sin(angle)*rad*r*.23;
    point(x+Math.cos(a)*along-Math.sin(a)*across,y+Math.sin(a)*along+Math.cos(a)*across,color,.45+random()*.85,.3+random()*.65,phase);
   }
   for(let n=0;n<32;n++){const a2=n/32*Math.PI*2,along=r*(.53+Math.cos(a2)*.47),across=Math.sin(a2)*r*.23;point(x+Math.cos(a)*along-Math.sin(a)*across,y+Math.sin(a)*along+Math.cos(a)*across,color,.55,.65,phase)}
  }
  for(let n=0;n<40;n++){const a=random()*6.28,rad=Math.sqrt(random())*r*.14;point(x+Math.cos(a)*rad,y+Math.sin(a)*rad,'#f4e4b9',.7+random()*.7,.8,phase)}
 }
 function generate(){
  random=rng(seed);points=[];
  flowers.forEach(flower);
  for(let n=0;n<90;n++)point(random()*w,h*(.15+random()*.85),'#e0c9e7',.3+random()*.65,.12+random()*.35,random()*10,2);
 }
 function initial(){const rand=rng(seed);flowers=Array.from({length:19},(_,i)=>({x:.05+(i/18)*.93+(rand()-.5)*.045,y:.4+rand()*.43,r:.026+rand()*.045}));flowers.push({x:.8,y:.32,r:.085},{x:.62,y:.56,r:.1},{x:.31,y:.76,r:.085});planted=0;generate()}
 function paint(time){
  ctx.fillStyle='#242329';ctx.fillRect(0,0,w,h);
  const glow=ctx.createRadialGradient(w*.6,h*.8,0,w*.6,h*.8,w*.7);glow.addColorStop(0,'#47404d55');glow.addColorStop(1,'#24232900');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(const p of points){
   const breeze=paused?0:Math.sin(time*.0007+p.phase)*2.4*p.sway;
   if(!paused){const dx=p.x+ p.dx-pointer.x,dy=p.y+p.dy-pointer.y,d=Math.hypot(dx,dy),reach=Math.min(w,h)*.18;if(d<reach&&d>.01){const force=(1-d/reach)*1.9;p.vx+=dx/d*force;p.vy+=dy/d*force}p.vx=(p.vx-p.dx*.045)*.84;p.vy=(p.vy-p.dy*.045)*.84;p.dx+=p.vx;p.dy+=p.vy}
   ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x+p.dx+breeze,p.y+p.dy,p.r,0,Math.PI*2);ctx.fill();
  }ctx.globalAlpha=1;
 }
 function loop(now){if(!visible||paused){raf=0;return}if(now-last>32){clock+=Math.min(now-last,50);last=now;paint(clock)}raf=requestAnimationFrame(loop)}
 function run(){if(visible&&!paused&&!raf){last=performance.now();raf=requestAnimationFrame(loop)}}
 function resize(){const rect=canvas.getBoundingClientRect();w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);generate();paint(clock)}
 initial();const sizing=new ResizeObserver(resize);sizing.observe(canvas);resize();
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){paint(clock);run()}else{cancelAnimationFrame(raf);raf=0;pointer.x=pointer.y=-1000}},{threshold:.05});visibility.observe(canvas);
 function add(x,y){if(planted>=8){status.textContent='花园已经盛放，点击「重新生长」开启下一片。';return}flowers.push({x:Math.max(.08,Math.min(.92,x)),y:Math.max(.28,Math.min(.84,y)),r:.045+Math.random()*.035});planted++;generate();paint(clock);status.textContent=`新种下 ${planted} 朵花，花园正在生长。`;run()}
 canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top},{signal});
 canvas.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-1000},{signal});
 canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();add((e.clientX-r.left)/w,(e.clientY-r.top)/h)},{signal});
 canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();add(.15+Math.random()*.7,.35+Math.random()*.35)}},{signal});
 function syncPause(){pause.textContent=paused?'继续生长':'暂停生长';pause.setAttribute('aria-pressed',String(paused))}syncPause();
 pause.addEventListener('click',()=>{paused=!paused;syncPause();if(paused){cancelAnimationFrame(raf);raf=0;paint(clock)}else run()},{signal});
 host.querySelector('.garden-reset').addEventListener('click',()=>{seed+=41;initial();paint(clock);status.textContent='新的花园已生长，点击画面继续播种。';run()},{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else run()},{signal});
 return ()=>{abort.abort();cancelAnimationFrame(raf);visibility.disconnect();sizing.disconnect()};
}
