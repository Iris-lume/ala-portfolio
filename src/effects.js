const presets={slash:{name:'苍蓝裂空',english:'Azure cleave',color:[79,183,255],duration:1.8},impact:{name:'熔核坠落',english:'Ember impact',color:[255,133,61],duration:3.4},portal:{name:'星环传送',english:'Astral gate',color:[162,128,255],duration:4.2}};
export function effectMarkup(type){const p=presets[type];return `<div class="effect-demo" data-effect="${type}"><div class="effect-stage"><canvas tabindex="0" role="button" aria-label="${p.name}特效，点击或按回车重新释放"></canvas><div class="effect-top"><span>${p.english}</span><span data-effect-phase>准备释放</span></div><div class="effect-bottom"><span>点击画面释放技能</span><button type="button" data-effect-pause aria-pressed="false">暂停</button></div></div><div class="effect-controls"><label>技能强度<input type="range" min="40" max="100" value="75" aria-label="${p.name}技能强度"></label><button type="button" data-effect-replay>重新释放 ↻</button></div><p class="effect-feedback" aria-live="polite">蓄力 → 释放 → 消散 · 静音实时演示</p></div>`}
export function mountEffects(root){const cleanups=[...root.querySelectorAll('[data-effect]')].map(mount);return()=>cleanups.forEach(fn=>fn())}
function mount(host){const type=host.dataset.effect,p=presets[type],canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return()=>{};
 const controller=new AbortController(),{signal}=controller,pauseButton=host.querySelector('[data-effect-pause]'),phase=host.querySelector('[data-effect-phase]'),feedback=host.querySelector('.effect-feedback'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let w=1,h=1,u=1,age=reduced?(type==='slash'?.62:1.05):0,visible=false,paused=reduced,raf=0,last=0,strength=.75,cycle=0;
 const rgb=p.color.join(','),color=(a=1)=>`rgba(${rgb},${a})`,fract=n=>n-Math.floor(n),rand=n=>fract(Math.sin(n*127.1+cycle*13.7)*43758.5453),ease=n=>1-Math.pow(1-Math.max(0,Math.min(1,n)),3);
 function line(x1,y1,x2,y2,c,width=1){ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
 function ellipse(x,y,rx,ry,c,width=1){ctx.strokeStyle=c;ctx.lineWidth=width;ctx.beginPath();ctx.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,Math.PI*2);ctx.stroke()}
 function glow(x,y,r,a=1){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a*.5})`);g.addColorStop(.2,`rgba(${rgb},${a*.22})`);g.addColorStop(1,color(0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
 function base(){ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='#10151e';ctx.fillRect(0,0,w,h);const bg=ctx.createLinearGradient(0,h*.3,0,h);bg.addColorStop(0,'#10151e');bg.addColorStop(1,'#1d2631');ctx.fillStyle=bg;ctx.fillRect(0,h*.3,w,h*.7);
  const horizon=h*.48;for(let i=-8;i<=8;i++)line(w*.5+i*w*.025,horizon,w*.5+i*w*.25,h,'#75849a13');for(let i=0;i<10;i++){const y=horizon+(h-horizon)*Math.pow(i/9,2);line(0,y,w,y,'#75849a17')}
  ellipse(w*.5,h*.76,u*.25,u*.085,'#92a1b32a');ellipse(w*.5,h*.76,u*.29,u*.10,'#92a1b313');ctx.globalCompositeOperation='lighter';
 }
 function sparks(t,count,cx,cy,power=1){if(t<0)return;for(let i=0;i<count;i++){const life=.5+rand(i+7)*.9,q=t/life;if(q>1)continue;const a=rand(i+81)*Math.PI*2,velocity=u*(.13+rand(i+32)*.55)*power,x=cx+Math.cos(a)*velocity*t,y=cy+Math.sin(a)*velocity*t*.55+u*.22*t*t;const alpha=Math.pow(1-q,2);line(x,y,x-Math.cos(a)*u*.022*(1-q),y-Math.sin(a)*u*.014*(1-q),color(alpha),(.7+rand(i+9)*1.7)*w/650);ctx.fillStyle=`rgba(255,242,217,${alpha*.8})`;ctx.fillRect(x,y,1.2,1.2)}}
 function ring(t,y,scale=1){if(t<0||t>1.3)return;const a=Math.pow(1-t/1.3,2),r=u*(.07+ease(t/1.3)*.6)*scale;ellipse(w*.5,y,r,r*.27,color(a*.8),u*.004*(1-t/1.4));ellipse(w*.5,y,r*.97,r*.26,color(a*.2),u*.014)}
 function slash(){
  const cx=w*.51,cy=h*.5,t=age-.34,power=.7+strength*.4;
  function curve(q,offset=0){const a=2.8+q*3.12;return {x:Math.cos(a)*u*.46,y:Math.sin(a)*u*.24+offset}}
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-.52);
  if(t<0){const q=ease(age/.34),v=curve(0);glow(v.x,v.y,u*.09,q*.5);line(v.x-u*.035*q,v.y,v.x+u*.035*q,v.y,color(q*.7),1);ctx.restore();return}
  const head=ease(t/.23),tail=Math.max(0,(t-.16)/.65),fade=Math.pow(Math.max(0,1-(t-.22)/.65),1.7);
  if(tail<head&&fade>0){
   for(let layer=0;layer<3;layer++){
    const width=u*(layer===0?.065:layer===1?.027:.006)*power,points=[];
    for(let j=0;j<=70;j++){const q=tail+(head-tail)*j/70,v=curve(q),profile=Math.pow(Math.max(0,Math.sin((q-tail)/(head-tail)*Math.PI)),.72),bend=width*profile*(.5+q*.5);points.push({x:v.x,y:v.y,depth:bend})}
    ctx.beginPath();points.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));for(let j=points.length-1;j>=0;j--)ctx.lineTo(points[j].x,points[j].y+points[j].depth);ctx.closePath();
    const fill=ctx.createLinearGradient(-u*.4,0,u*.46,0);fill.addColorStop(0,color(0));fill.addColorStop(.35,layer===2?`rgba(207,243,255,${fade*.65})`:color(fade*.16));fill.addColorStop(.75,layer===2?`rgba(242,253,255,${fade})`:color(fade*(layer===0?.28:.8)));fill.addColorStop(1,color(0));ctx.fillStyle=fill;ctx.shadowColor=color(fade*.6);ctx.shadowBlur=layer===2?u*.018:0;ctx.fill();ctx.shadowBlur=0;
   }
   const tip=curve(head);if(t<.28)glow(tip.x,tip.y,u*.055,(1-t/.28)*.7);
   for(let j=0;j<4;j++){const start=Math.min(.8,tail+.03+j*.035),end=Math.max(start,head-.08-j*.035);ctx.beginPath();for(let k=0;k<=36;k++){const q=start+(end-start)*k/36,v=curve(q,u*(.025+j*.013));if(k)ctx.lineTo(v.x,v.y);else ctx.moveTo(v.x,v.y)}ctx.strokeStyle=color(fade*(.12-j*.025));ctx.lineWidth=u*.001;ctx.stroke()}
  }
  for(let i=0;i<45*strength;i++){const birth=rand(i+31)*.18,pt=t-birth,life=.25+rand(i+4)*.45;if(pt<0||pt>life)continue;const origin=curve(.25+rand(i+9)*.65),v=u*(.12+rand(i+19)*.4),x=origin.x+v*pt,y=origin.y-u*(.12+rand(i+5)*.2)*pt+u*.2*pt*pt,a=Math.pow(1-pt/life,2);line(x,y,x-u*.016*a,y+u*.006*a,i%5===0?`rgba(227,247,255,${a})`:color(a*.7),u*(i%5===0?.002:.001));}
  ctx.restore();glow(cx,h*.76,u*.27,Math.max(0,.18-t*.3));
 }
 function impact(){
  const t=age-.7,cx=w*.54,cy=h*.76,drift=u*(.25+strength*.22),dx=-w*.26,dy=h*.96;
  if(t<0){const q=age/.7,x=cx-dx*(1-q),y=cy-dy*(1-q);glow(x,y,u*.105,.8);const length=Math.hypot(dx,dy),nx=-dx/length,ny=-dy/length;
   for(let j=9;j>=0;j--){const len=u*(.055+j*.022);line(x,y,x+nx*len,y+ny*len,color((1-j/11)*.45),u*(.023-j*.0018))}ctx.fillStyle='#fff3dc';ctx.beginPath();ctx.ellipse(x,y,u*.012,u*.022,Math.atan2(dy,dx)-Math.PI/2,0,Math.PI*2);ctx.fill();ellipse(cx,cy,u*.12,u*.034,color(.2+q*.3));return}
  const flash=Math.max(0,1-t/.18),fade=Math.pow(Math.max(0,1-t/1.55),1.5);glow(cx-drift*Math.min(t,.45),cy-u*.035,u*(.17+ease(t/.45)*.3),fade*.7);if(flash>0)glow(cx,cy,u*.2,flash*.8);
  ctx.save();ctx.translate(cx,cy);ctx.scale(1,.31);
  for(let j=0;j<2;j++){const q=t-j*.1;if(q<0||q>1)continue;const r=u*(.045+ease(q)*.42);ctx.beginPath();ctx.ellipse(-drift*q*.7,0,r*(1+strength*.35),r*.68,0,-.45,Math.PI*1.18);ctx.strokeStyle=color(Math.pow(1-q,2)*.65);ctx.lineWidth=u*.004*(1-q);ctx.stroke()}
  ctx.restore();
  // The forward plume follows the leftward momentum of the incoming projectile.
  for(let j=0;j<18;j++){const q=t-j*.012;if(q<0||q>.7)continue;const len=drift*ease(q/.38)*(.55+rand(j+41)*.65),height=u*(.09+rand(j+17)*.23)*Math.sin(Math.min(1,q/.7)*Math.PI),alpha=Math.pow(1-q/.7,2)*.11;
   const g=ctx.createLinearGradient(cx,cy,cx-len,cy-height);g.addColorStop(0,`rgba(255,233,177,${alpha})`);g.addColorStop(.35,color(alpha*.8));g.addColorStop(1,color(0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx+u*.025,cy);ctx.quadraticCurveTo(cx-len*.3,cy-height*1.25,cx-len,cy-height*(.4+rand(j+33)*.5));ctx.quadraticCurveTo(cx-len*.65,cy-height*.35,cx,cy+u*.008);ctx.fill();
  }
  for(let i=0;i<110*strength;i++){const life=.4+rand(i+19)*1.1;if(t>life)continue;const forward=rand(i+82)>.18,vx=u*(forward?-(.16+rand(i+4)*.62):rand(i+4)*.23)*strength,vy=-u*(.1+rand(i+13)*.52),x=cx+vx*t,y=cy+vy*t+u*.5*t*t,a=Math.pow(1-t/life,1.3),size=u*(.002+rand(i+8)*.006)*a;
   if(i<24){ctx.save();ctx.translate(x,y);ctx.rotate(t*(rand(i)*12-6));ctx.fillStyle=i%3===0?`rgba(255,221,157,${a})`:color(a*.75);ctx.beginPath();ctx.moveTo(-size,-size*.5);ctx.lineTo(size*.5,-size);ctx.lineTo(size,size*.8);ctx.lineTo(-size*.7,size);ctx.fill();ctx.restore()}else{line(x,y,x-vx*.035,y-(vy+u*t)*.035,color(a*.8),Math.max(.5,u*.0015*a));if(i%7===0)glow(x,y,u*.01,a*.35)}
  }
  for(let i=0;i<8;i++){const a=2.5+rand(i+8)*1.3,len=u*(.1+rand(i+2)*.21)*ease(t/.14);line(cx+Math.cos(a)*u*.025,cy+Math.sin(a)*u*.008,cx+Math.cos(a)*len,cy+Math.sin(a)*len*.25,color(Math.max(0,.23-t*.16)),1)}
 }
 function portal(){const enter=ease(age/.8),fade=Math.min(1,Math.max(0,(3.7-age)/.8)),power=enter*fade,cx=w*.5,cy=h*.48,r=u*(.19+strength*.085)*enter;glow(cx,cy,u*.42,power*.65);glow(cx,h*.76,u*.32,power*.5);ring(age-.15,h*.76,.8);
  ctx.save();ctx.translate(cx,cy);ctx.scale(.78,1);for(let j=0;j<3;j++)ellipse(0,0,r*(1+j*.065),r*(1+j*.065),color(power*(j===0?.9:.35)),u*(j===0?.004:.0015));
  const inner=ctx.createRadialGradient(0,0,0,0,0,Math.max(1,r));inner.addColorStop(0,'#070b1b00');inner.addColorStop(.65,color(power*.025));inner.addColorStop(1,color(power*.25));ctx.fillStyle=inner;ctx.beginPath();ctx.arc(0,0,Math.max(0,r),0,Math.PI*2);ctx.fill();
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2+age*.12,x=Math.cos(a)*r*1.13,y=Math.sin(a)*r*1.13;ctx.save();ctx.translate(x,y);ctx.rotate(a);line(-u*.008,-u*.01,u*.008,u*.01,color(power*.8),1);line(u*.008,-u*.01,-u*.008,u*.01,color(power*.8),1);ctx.restore()}
  for(let i=0;i<75;i++){const a=i/75*Math.PI*2+age*(.5+rand(i)*.4),rr=r*(.97+rand(i+14)*.09);ctx.fillStyle=i%4===0?`rgba(241,225,255,${power})`:color(power*.8);ctx.beginPath();ctx.arc(Math.cos(a)*rr,Math.sin(a)*rr,(.7+rand(i+6)*1.8)*u/400,0,Math.PI*2);ctx.fill()}
  ctx.restore();for(let i=0;i<28;i++){const q=fract(age*.22+rand(i)),x=cx+(rand(i+8)-.5)*u*.52,y=h*.77-q*u*.6;glow(x,y,u*.008,power*Math.sin(q*Math.PI)*.5)}
  ellipse(cx,h*.77,u*.25*enter,u*.07*enter,color(power*.5));
 }
 function draw(){base();ctx.save();const shake=type==='impact'&&age>.7&&age<.92?(1-(age-.7)/.22)*u*.008:0;ctx.translate(Math.sin(age*190)*shake,Math.cos(age*170)*shake);if(type==='slash')slash();else if(type==='impact')impact();else portal();ctx.restore();ctx.globalCompositeOperation='source-over';const label=age< (type==='impact'?.7:type==='portal'?.8:.42)?'蓄力':age<p.duration*.65?'释放':'消散';if(phase.textContent!==label)phase.textContent=label}
 function frame(now){raf=0;if(!visible||paused||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;age+=dt;if(age>p.duration+.5){age=0;cycle++}draw();raf=requestAnimationFrame(frame)}
 function run(){if(visible&&!paused&&!document.hidden&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
 function replay(){cycle++;age=paused?(type==='slash'?.62:1.05):0;draw();feedback.textContent='已重新释放 · 可调整技能强度';run()}
 function sync(){pauseButton.textContent=paused?'继续':'暂停';pauseButton.setAttribute('aria-pressed',String(paused))}sync();
 const resize=new ResizeObserver(()=>{const box=canvas.getBoundingClientRect();w=box.width;h=box.height;u=Math.min(w,h);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()});resize.observe(canvas);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)run();else{cancelAnimationFrame(raf);raf=0}},{threshold:.1});observer.observe(canvas);
 canvas.addEventListener('click',replay,{signal});canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();replay()}},{signal});host.querySelector('[data-effect-replay]').addEventListener('click',replay,{signal});host.querySelector('input').addEventListener('input',e=>{strength=Number(e.target.value)/100;replay()},{signal});pauseButton.addEventListener('click',()=>{paused=!paused;sync();if(paused){cancelAnimationFrame(raf);raf=0}else run()},{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else run()},{signal});return()=>{controller.abort();cancelAnimationFrame(raf);resize.disconnect();observer.disconnect()};
}
