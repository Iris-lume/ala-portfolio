const settings={flow:{name:'弹珠绘色',label:'Playful collisions',hint:'点击添加弹珠 · 移动鼠标拨动',parameter:'弹跳力度',value:65},orbit:{name:'引力星轨',label:'Orbital field',hint:'移动鼠标，牵引星点的轨迹',parameter:'引力强度',value:50},branch:{name:'分形生长',label:'Recursive growth',hint:'点击画面，生长另一棵树',parameter:'分枝角度',value:45},terrain:{name:'地形等高线',label:'Topographic contours',hint:'等高线随时间缓慢流动 · 拖动滑块调整层级密度',parameter:'层级密度',value:50}};
export function generativeMarkup(type){const d=settings[type];return `<div class="code-demo" data-code-demo="${type}"><div class="code-stage code-${type}"><canvas tabindex="0" aria-label="${d.name}交互画布，${d.hint}"></canvas><div class="code-stage-top"><span>${d.label}</span><button type="button" data-code-pause aria-pressed="false">暂停</button></div><p class="code-stage-hint">${d.hint}</p></div><div class="code-controls"><label>${d.parameter}<input type="range" min="15" max="85" value="${d.value}" aria-label="${d.parameter}"></label><button type="button" data-code-reset>重新生成 ↻</button></div><p class="code-feedback" aria-live="polite">${type==='flow'?'点击放入一颗弹珠，看颜色在碰撞中相遇。':type==='orbit'?'让星点在引力中相遇，留下缓慢流动的光迹。':type==='branch'?'同一条递归规则，长出不同的枝叶。':'噪声在纸上起伏，等高线像地形一样缓慢生长。'}</p></div>`}
export function mountGenerative(root){const cleanups=[...root.querySelectorAll('[data-code-demo]')].map(mountOne);return ()=>cleanups.forEach(cleanup=>cleanup())}
function makeNoise(seed){let s=seed;const rand=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};const perm=new Uint8Array(512);const g=new Float32Array(256);for(let i=0;i<256;i++){perm[i]=i;g[i]=rand()}for(let i=255;i>0;i--){const j=Math.floor(rand()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]]}for(let i=0;i<256;i++)perm[i+256]=perm[i];return function(x,y){const X=Math.floor(x)&255,Y=Math.floor(y)&256;x-=Math.floor(x);y-=Math.floor(y);const u=x*x*(3-2*x),v=y*y*(3-2*y);const aa=g[perm[perm[X]+Y]],ba=g[perm[perm[X+1]+Y]],ab=g[perm[perm[X]+Y+1]],bb=g[perm[perm[X+1]+Y+1]];return aa+(ba-aa)*u+(ab-aa)*v+(aa-ba-ab+bb)*u*v}}
function mountOne(host){
 const type=host.dataset.codeDemo,canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const abort=new AbortController(),signal=abort.signal,pauseButton=host.querySelector('[data-code-pause]'),slider=host.querySelector('input'),feedback=host.querySelector('.code-feedback'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let w=1,h=1,dpr=1,t=0,last=0,raf=0,visible=false,paused=reduced.matches,value=Number(slider.value),seed=321,particles=[],branches=[],age=0,pointer={x:.57,y:.45,active:false};
 let noise1=null,noise2=null,terrainTime=0,terrainStyle=1;const palettes=[{bg:'#F5F7F2',line:'#39765C',major:'#14583F',text:'#245B45',grid:null,label:'ORGANIC LANDSCAPE'},{bg:'#FAFBFC',line:'#53658F',major:'#263F7D',text:'#263F7D',grid:'#E9EEF5',label:'DIGITAL CARTOGRAPHY'}];
 function random(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
 function clear(){if(type==='terrain'){ctx.fillStyle=palettes[terrainStyle].bg;ctx.fillRect(0,0,w,h)}else{ctx.fillStyle=type==='flow'?'#23212a':type==='orbit'?'#202936':'#dedbd1';ctx.fillRect(0,0,w,h)}}
 function build(){age=0;const rand=random(seed);clear();if(type==='terrain'){noise1=makeNoise(seed);noise2=makeNoise(seed+999);terrainTime=0;drawTerrain()}
 else if(type==='flow'){
  const unit=Math.min(w,h);particles=Array.from({length:12},()=>({x:w*(.13+rand()*.74),y:h*(.18+rand()*.55),vx:(rand()-.5)*3.4,vy:(rand()-.5)*3,r:unit*(.025+rand()*.02),color:Math.floor(rand()*5),flash:0}));flowStep();
 }else if(type==='branch'){
  branches=[];const unit=Math.min(w,h);function split(x,y,len,angle,depth,delay){if(depth>8||len<2)return;const endX=x+Math.cos(angle)*len,endY=y+Math.sin(angle)*len;branches.push({x,y,endX,endY,depth,delay,leaf:rand()});const spread=.2+value*.009;split(endX,endY,len*(.67+rand()*.09),angle-spread*(.6+rand()*.7),depth+1,delay+1);if(depth<7)split(endX,endY,len*(.68+rand()*.08),angle+spread*(.6+rand()*.7),depth+1,delay+1);}
  split(w*.5,h*.91,unit*.21,-Math.PI/2,0,0);drawBranch(paused?20:0);
 }else {const unit=Math.min(w,h),mu=unit*.8;particles=Array.from({length:170},()=>{const a=rand()*Math.PI*2,r=unit*(.12+rand()*.34),v=Math.sqrt(mu/r)*(.85+rand()*.25);return {x:w*.5+Math.cos(a)*r,y:h*.5+Math.sin(a)*r*.72,vx:-Math.sin(a)*v,vy:Math.cos(a)*v*.8,color:rand()};});for(let i=0;i<65;i++)drawOrbit();}}
 function drawTerrain(){
  const unit=Math.min(w,h);
  const cell=Math.max(5,Math.floor(unit/90));
  const cols=Math.ceil(w/cell)+1,rows=Math.ceil(h/cell)+1;
  const levels=Math.floor(mapRange(value,15,85,10,28));
  const scale=.012+ (85-value)*.00008;
  const pal=palettes[terrainStyle];
  clear();
  // subtle grid
  if(pal.grid){ctx.strokeStyle=pal.grid;ctx.lineWidth=.5;const gridStep=Math.max(40,cell*6);ctx.beginPath();for(let x=0;x<=w;x+=gridStep){ctx.moveTo(x,0);ctx.lineTo(x,h)}for(let y=0;y<=h;y+=gridStep){ctx.moveTo(0,y);ctx.lineTo(w,y)}ctx.stroke()}
  // sample terrain
  const tz=terrainTime*.4;
  const terr=new Float32Array(cols*rows);
  for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){const nx=x*scale,ny=y*scale;const n1=noise1(nx,ny+tz);const n2=noise2(nx*2+100,ny*2+100+tz*.7);terr[y*cols+x]=n1*.8+n2*.2}}
  // marching squares contours
  for(let k=0;k<levels;k++){
   const level=mapRange(k,0,levels-1,.25,.75);
   const major=k%4===0;
   ctx.strokeStyle=major?pal.major:pal.line;
   ctx.lineWidth=major?1.4:.6;
   ctx.beginPath();
   for(let x=0;x<cols-1;x++){for(let y=0;y<rows-1;y++){
    const x0=x*cell,y0=y*cell;
    const a=terr[y*cols+x],b=terr[y*cols+x+1],c=terr[(y+1)*cols+x+1],d=terr[(y+1)*cols+x];
    const pts=[];
    if((a<level)!==(b<level)){const f=(level-a)/(b-a);pts.push({x:x0+f*cell,y:y0})}
    if((b<level)!==(c<level)){const f=(level-b)/(c-b);pts.push({x:x0+cell,y:y0+f*cell})}
    if((c<level)!==(d<level)){const f=(level-c)/(d-c);pts.push({x:x0+cell-f*cell,y:y0+cell})}
    if((d<level)!==(a<level)){const f=(level-d)/(a-d);pts.push({x:x0,y:y0+cell-f*cell})}
    if(pts.length===2){ctx.moveTo(pts[0].x,pts[0].y);ctx.lineTo(pts[1].x,pts[1].y)}
    else if(pts.length===4){ctx.moveTo(pts[0].x,pts[0].y);ctx.lineTo(pts[1].x,pts[1].y);ctx.moveTo(pts[2].x,pts[2].y);ctx.lineTo(pts[3].x,pts[3].y)}
   }}
   ctx.stroke();
  }
  // poster text
  ctx.fillStyle=pal.text;ctx.textAlign='left';ctx.textBaseline='alphabetic';
  ctx.font=`700 ${Math.max(18,unit*.045)}px sans-serif`;ctx.fillText('TERRAIN',unit*.04,unit*.09);
  ctx.font=`400 ${Math.max(8,unit*.016)}px sans-serif`;ctx.fillText('GENERATIVE ART / P5.JS',unit*.04,unit*.09+unit*.03);
  ctx.textAlign='right';ctx.font=`400 ${Math.max(8,unit*.016)}px sans-serif`;ctx.fillText('NOISE STUDY',w-unit*.04,unit*.085);
  ctx.fillText('VOL. 001 / 2026',w-unit*.04,unit*.085+unit*.028);
  ctx.textAlign='left';ctx.font=`700 ${Math.max(10,unit*.022)}px sans-serif`;ctx.fillText(pal.label,unit*.04,h-unit*.07);
  ctx.font=`400 ${Math.max(8,unit*.015)}px sans-serif`;ctx.fillText('A STUDY OF FORM AND TOPOGRAPHY',unit*.04,h-unit*.045);
  ctx.textAlign='right';ctx.fillText('01 / 02',w-unit*.04,h-unit*.045);
 }
 function mapRange(v,a,b,c,d){return c+(v-a)/(b-a)*(d-c)}
 function flowStep(){
  const unit=Math.min(w,h),palette=['#cab4e6','#efb19a','#b6d9ce','#e6d891','#94b9d6'],bounce=.5+value*.005;
  ctx.fillStyle='#23212a38';ctx.fillRect(0,0,w,h);
  for(const p of particles){
   if(pointer.active){const dx=p.x-pointer.x*w,dy=p.y-pointer.y*h,d=Math.hypot(dx,dy),reach=unit*.22;if(d>1&&d<reach){const f=(1-d/reach)*.65;p.vx+=dx/d*f;p.vy+=dy/d*f}}
   p.vy+=.025;p.vx*=.999;p.vy*=.999;const speed=Math.hypot(p.vx,p.vy);if(speed>7){p.vx*=7/speed;p.vy*=7/speed}p.x+=p.vx;p.y+=p.vy;
   if(p.x<p.r){p.x=p.r;p.vx=Math.abs(p.vx)*bounce;p.flash=1}if(p.x>w-p.r){p.x=w-p.r;p.vx=-Math.abs(p.vx)*bounce;p.flash=1}if(p.y<p.r){p.y=p.r;p.vy=Math.abs(p.vy)*bounce;p.flash=1}if(p.y>h-p.r){p.y=h-p.r;p.vy=-Math.abs(p.vy)*bounce;p.flash=1}
  }
  for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),min=a.r+b.r;if(d<min&&d>.01){const nx=dx/d,ny=dy/d,overlap=(min-d)*.5;a.x-=nx*overlap;a.y-=ny*overlap;b.x+=nx*overlap;b.y+=ny*overlap;const impact=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(impact>0){const impulse=impact*(1+bounce)*.5;a.vx-=impulse*nx;a.vy-=impulse*ny;b.vx+=impulse*nx;b.vy+=impulse*ny;a.flash=b.flash=1}}}
  for(const p of particles){ctx.fillStyle=palette[p.color];ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffffff50';ctx.lineWidth=.7;ctx.stroke();ctx.fillStyle='#ffffff50';ctx.beginPath();ctx.arc(p.x-p.r*.26,p.y-p.r*.28,p.r*.17,0,Math.PI*2);ctx.fill();if(p.flash>0){ctx.globalAlpha=p.flash*.5;ctx.strokeStyle=palette[p.color];ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.r+(1-p.flash)*unit*.045,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;p.flash=Math.max(0,p.flash-.07)}}
 }
 function addBall(){const unit=Math.min(w,h);if(particles.length>=32)particles.shift();particles.push({x:Math.max(unit*.05,Math.min(w-unit*.05,pointer.x*w)),y:Math.max(unit*.05,Math.min(h-unit*.05,pointer.y*h)),vx:(Math.random()-.5)*4,vy:-2-Math.random()*2,r:unit*(.025+Math.random()*.02),color:Math.floor(Math.random()*5),flash:1});if(paused)flowStep();feedback.textContent=`画面中有 ${particles.length} 颗弹珠，最多可放入 32 颗。`;run()}
 function drawOrbit(){
  ctx.fillStyle='#20293618';ctx.fillRect(0,0,w,h);const unit=Math.min(w,h),cx=w*(pointer.active?pointer.x:.5),cy=h*(pointer.active?pointer.y:.5),mu=unit*(.3+value*.012);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const p of particles){const dx=cx-p.x,dy=cy-p.y,dist=Math.max(unit*.06,Math.hypot(dx,dy)),force=Math.min(.12,mu/(dist*dist));p.vx+=dx/dist*force;p.vy+=dy/dist*force;const speed=Math.hypot(p.vx,p.vy);if(speed>3.5){p.vx*=3.5/speed;p.vy*=3.5/speed}const nx=p.x+p.vx,ny=p.y+p.vy;ctx.strokeStyle=p.color<.6?'#9dc8dc99':p.color<.85?'#c9b6df99':'#ecd6a899';ctx.lineWidth=p.color>.85?1:.65;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(nx,ny);ctx.stroke();ctx.fillStyle=p.color>.85?'#f2ddb5':'#c4dde7';ctx.beginPath();ctx.arc(nx,ny,p.color>.85?1.1:.65,0,Math.PI*2);ctx.fill();p.x=nx;p.y=ny;if(nx<-w*.3||nx>w*1.3||ny<-h*.3||ny>h*1.3){const a=p.color*Math.PI*2+t*.001;p.x=w*.5+Math.cos(a)*unit*.32;p.y=h*.5+Math.sin(a)*unit*.28;p.vx=-Math.sin(a);p.vy=Math.cos(a)}}
  ctx.restore();
 }
 function drawBranch(progress){clear();const unit=Math.min(w,h);for(const b of branches){const growth=Math.max(0,Math.min(1,progress-b.delay));if(!growth)continue;const x=b.x+(b.endX-b.x)*growth,y=b.y+(b.endY-b.y)*growth;ctx.strokeStyle=b.depth<4?'#526458':'#71866d';ctx.lineWidth=Math.max(.5,(8-b.depth)*unit*.0015);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(x,y);ctx.stroke();if(b.depth>=6&&growth>.9){ctx.save();ctx.translate(x,y);ctx.rotate(b.leaf*6.28);ctx.fillStyle=b.leaf>.65?'#b69bc1aa':'#8fa17baa';ctx.beginPath();ctx.ellipse(0,0,unit*.012,unit*.005,0,0,Math.PI*2);ctx.fill();ctx.restore()}}}
 function render(dt){t+=dt;if(type==='terrain'){terrainTime+=dt*.0018;drawTerrain()}else if(type==='flow')flowStep(t);else if(type==='orbit')drawOrbit();else{age+=dt/220;drawBranch(age)}}
 function frame(now){if(!visible||paused||document.hidden){raf=0;return}const dt=now-last;if(dt>32){last=now;render(Math.min(dt,60));if(type==='branch'&&age>10){raf=0;return}}raf=requestAnimationFrame(frame)}
 function run(){if(visible&&!paused&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);build();run()}
 function syncPause(){pauseButton.textContent=paused?'继续':'暂停';pauseButton.setAttribute('aria-pressed',String(paused))}syncPause();
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)run();else{cancelAnimationFrame(raf);raf=0;pointer.active=false}},{threshold:.05});observer.observe(canvas);
 function regenerate(){seed+=71;pointer.active=false;build();feedback.textContent='已生成新的构图，可以继续调整参数。';run()}
 slider.addEventListener('input',()=>{value=Number(slider.value);if(type==='terrain'){drawTerrain();feedback.textContent=`层级密度：${Math.floor(mapRange(value,15,85,10,28))} 层`;run()}else if(type==='flow'){if(paused)build()}else if(type==='branch')build();else drawOrbit();if(type!=='terrain')feedback.textContent=`${settings[type].parameter}：${value}`;run()},{signal});host.querySelector('[data-code-reset]').addEventListener('click',regenerate,{signal});pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();if(paused){cancelAnimationFrame(raf);raf=0;if(type==='branch')drawBranch(20)}else{if(type==='branch'&&age>10)age=0;run()}},{signal});
 function point(e){const r=canvas.getBoundingClientRect();pointer={x:Math.max(0,Math.min(1,(e.clientX-r.left)/w)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/h)),active:true};if(type==='orbit')drawOrbit();if(type==='flow'&&paused)flowStep()}
 canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')point(e)},{signal});canvas.addEventListener('pointerdown',e=>{point(e);if(type==='branch')regenerate();if(type==='flow')addBall();if(type==='terrain'){terrainStyle=(terrainStyle+1)%2;drawTerrain();feedback.textContent=terrainStyle===0?'已切换：自然地形（绿色）':'已切换：数字地图（蓝色）'}},{signal});canvas.addEventListener('pointerleave',()=>pointer.active=false,{signal});canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();regenerate()}if(type==='orbit'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();pointer.active=true;pointer.x=Math.max(.1,Math.min(.9,pointer.x+(e.key==='ArrowRight'?.04:-.04)));drawOrbit()}},{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else run()},{signal});
 return ()=>{abort.abort();cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect()};
}
