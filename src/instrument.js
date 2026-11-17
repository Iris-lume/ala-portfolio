const voices = {
 a:{name:'低频脉冲',color:'#c4b5e4',duration:1.1},
 s:{name:'玻璃音',color:'#e5e9b1',duration:1.5},
 d:{name:'砂砾节拍',color:'#eea98d',duration:.8},
 j:{name:'和弦',color:'#a7cbc4',duration:1.7},
 k:{name:'金属弹音',color:'#b6c5ec',duration:.9},
 l:{name:'气流扫频',color:'#e3bbce',duration:1.5}
};
export function instrumentMarkup(){return `<article class="project-card card-0 av-project" aria-labelledby="av-title"><div class="av-stage"><canvas aria-label="六键音画互动展示区域"></canvas><div class="av-idle"><svg class="av-cover-art" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g transform="translate(210 0)"><path d="M28 241 C98 241 89 156 142 156 S181 280 232 280 S281 211 321 211" fill="none" stroke="#d9c8ee" stroke-width="1.5"/><circle cx="28" cy="241" r="3" fill="#d9c8ee"/><circle cx="321" cy="211" r="3" fill="#d9c8ee"/></g></svg><div class="av-cover-title" aria-hidden="true"><span>Sound</span><span><em>into</em> form.</span></div><div class="av-cover-note"><span>声音的形状</span><small>六个按键，一场即兴。</small></div></div><div class="av-stage-top"><span>Sound / Shape</span><button class="av-mute" type="button" aria-pressed="false" aria-label="静音">声音 开</button></div><span class="av-readout" aria-live="polite">等待第一次触发</span></div><div class="av-keys" role="group" aria-label="音画互动按键">${Object.entries(voices).map(([key,v])=>`<button type="button" data-av-key="${key}" aria-label="${key.toUpperCase()} ${v.name}" style="--key-color:${v.color}"><kbd>${key.toUpperCase()}</kbd><span>${v.name}</span></button>`).join('')}</div><div class="card-caption"><div><h3 id="av-title">Sound into form</h3><p>实时视觉 <span>/ 六键音画实验</span></p></div><span class="av-live">可交互</span></div><p class="av-help">不同按键，不同声音与形态。连续按下，组合你的节奏。</p></article>`}
export function mountInstrument(root){
 const host=root.querySelector('.av-project'); if(!host)return ()=>{};
 const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d'); if(!ctx)return ()=>{};
 const idle=host.querySelector('.av-idle'),readout=host.querySelector('.av-readout'),mute=host.querySelector('.av-mute');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const abort=new AbortController(),signal=abort.signal;
 let audio,master,noiseBuffer,muted=false,destroyed=false,raf=0,width=1,height=1,events=[],visible=false;
 const timers=new Map();
 function setupAudio(){
  if(audio)return audio;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  audio=new AC({latencyHint:'interactive'});
  master=audio.createGain();master.gain.value=muted?0:.55;
  const compressor=audio.createDynamicsCompressor();compressor.threshold.value=-18;compressor.ratio.value=8;master.connect(compressor);compressor.connect(audio.destination);
  noiseBuffer=audio.createBuffer(1,audio.sampleRate,audio.sampleRate);
  const data=noiseBuffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  return audio;
 }
 function tone(frequency,end,type,duration,volume,delay=0){
  const now=audio.currentTime+delay,osc=audio.createOscillator(),gain=audio.createGain();
  osc.type=type;osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(end,now+duration);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.008);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect()};
 }
 function noise(duration,from,to,volume){
  const now=audio.currentTime,source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
  source.buffer=noiseBuffer;filter.type='bandpass';filter.Q.value=2;filter.frequency.setValueAtTime(from,now);filter.frequency.exponentialRampToValueAtTime(to,now+duration);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  source.connect(filter);filter.connect(gain);gain.connect(master);source.start(now);source.stop(now+duration+.02);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect()};
 }
 function play(key){
  if(muted)return;
  if(key==='a'){tone(150,42,'sine',.5,.65);tone(80,35,'triangle',.26,.12)}
  if(key==='s'){tone(880,870,'sine',.9,.22);tone(1320,1300,'sine',.65,.1,.035);tone(2200,2190,'sine',.4,.04)}
  if(key==='d'){noise(.17,2200,750,.32);tone(160,70,'triangle',.13,.13)}
  if(key==='j'){[261.63,329.63,392].forEach((f,i)=>tone(f,f*.995,'sine',1.1,.12,i*.025))}
  if(key==='k'){tone(740,240,'triangle',.25,.25);tone(1560,570,'sine',.18,.1)}
  if(key==='l'){noise(.7,250,4200,.2);tone(180,720,'sine',.6,.08)}
 }
 function clear(){ctx.fillStyle='#242427';ctx.fillRect(0,0,width,height)}
 function resize(){const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(!raf)clear()}
 const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(canvas);resize();
 function circle(x,y,r,fill=false){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);fill?ctx.fill():ctx.stroke()}
 function draw(event,now){
  const v=voices[event.key],t=Math.min(1,(now-event.start)/event.duration),ease=1-(1-t)**3,fade=Math.min(1,(1-t)*4),unit=Math.min(width,height);
  ctx.save();ctx.fillStyle=v.color;ctx.strokeStyle=v.color;ctx.lineWidth=2;ctx.globalAlpha=fade;
  const x=width*event.x,y=height*event.y;
  if(reduced.matches){circle(x,y,unit*.12,true);ctx.restore();return t<1}
  if(event.key==='a'){
   const radius=unit*(.06+ease*.52);ctx.globalAlpha=fade*.9;circle(x,y,radius,true);ctx.globalCompositeOperation='destination-out';circle(x,y,radius*(.2+.78*ease),true);
  }else if(event.key==='s'){
   ctx.translate(x,y);ctx.rotate(event.angle+ease*Math.PI*.55);const r=unit*(.05+ease*.33);
   for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.fillRect(r*.18,-2,r*(1-t)*1.6+3,4)}circle(0,0,r*.13,true);
  }else if(event.key==='d'){
   for(let i=0;i<22;i++){const angle=i*2.399+event.angle,r=unit*(.04+ease*(.15+(i%5)*.06)),side=unit*.035*(1-t);ctx.save();ctx.translate(x+Math.cos(angle)*r,y+Math.sin(angle)*r);ctx.rotate(angle+t*3);ctx.fillRect(-side/2,-side/2,side,side);ctx.restore()}
  }else if(event.key==='j'){
   ctx.translate(x,y);ctx.rotate(event.angle+ease*.7);for(let i=0;i<5;i++){ctx.globalAlpha=fade*(1-i*.14);const r=unit*(.08+ease*.26)+i*unit*.035;ctx.beginPath();for(let n=0;n<=120;n++){const a=n/120*Math.PI*2,rr=r*(1+.13*Math.sin(a*5+t*6));const px=Math.cos(a)*rr,py=Math.sin(a)*rr;n?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.stroke()}
  }else if(event.key==='k'){
   ctx.translate(width/2,height/2);ctx.rotate(-Math.PI/5);ctx.lineWidth=3;ctx.lineCap='round';const length=unit*.8*Math.sin(Math.PI*t)**.55;ctx.beginPath();ctx.moveTo(-length/2,0);ctx.lineTo(length/2,0);ctx.stroke();
  }else if(event.key==='l'){
   ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();for(let n=0;n<=100;n++){const p=n/100,px=width*(.1+p*.8),py=height*.5+Math.sin(p*Math.PI*3-ease*5)*unit*.18*Math.sin(Math.PI*t)*Math.sin(Math.PI*p);n?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();
  }
  ctx.restore();return t<1;
 }
 function frame(now){clear();events=events.filter(e=>draw(e,now));if(events.length)raf=requestAnimationFrame(frame);else{raf=0;idle.classList.remove('is-hidden');readout.textContent='继续按键，组合新的节奏'}}
 function launch(key){
  if(destroyed)return;
  try{const ac=setupAudio();if(ac){if(ac.state==='suspended')ac.resume().then(()=>{if(!destroyed&&ac.state==='running')play(key)}).catch(()=>{readout.textContent='声音未能启动，可继续体验画面'});else play(key)}else readout.textContent='当前浏览器不支持声音，可体验画面'}catch{readout.textContent='声音暂不可用，可继续体验画面'}
  events.push({key,start:performance.now(),duration:reduced.matches?220:voices[key].duration*1000,x:.3+Math.random()*.4,y:.3+Math.random()*.4,angle:Math.random()*Math.PI});if(events.length>28)events.shift();
  idle.classList.add('is-hidden');readout.textContent=`${key.toUpperCase()} / ${voices[key].name}${muted?' / 静音':''}`;
  const button=host.querySelector(`[data-av-key="${key}"]`);button.classList.add('is-playing');clearTimeout(timers.get(key));timers.set(key,setTimeout(()=>button.classList.remove('is-playing'),180));
  if(!raf)raf=requestAnimationFrame(frame);
 }
 host.querySelectorAll('[data-av-key]').forEach(button=>button.addEventListener('click',()=>launch(button.dataset.avKey),{signal}));
 mute.addEventListener('click',()=>{muted=!muted;mute.setAttribute('aria-pressed',String(muted));mute.setAttribute('aria-label',muted?'开启声音':'静音');mute.textContent=muted?'声音 关':'声音 开';if(master)master.gain.setTargetAtTime(muted?0:.55,audio.currentTime,.02)},{signal});
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){events=[];cancelAnimationFrame(raf);raf=0;clear();idle.classList.remove('is-hidden');if(audio?.state==='running')audio.suspend()}},{threshold:.15});visibility.observe(canvas);
 window.addEventListener('keydown',e=>{if(!visible||document.hidden||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const target=e.target;if(target instanceof HTMLElement&&(target.isContentEditable||target.closest('input,textarea,select')))return;const key=e.key.toLowerCase();if(!voices[key])return;e.preventDefault();launch(key)},{signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){events=[];cancelAnimationFrame(raf);raf=0;clear();idle.classList.remove('is-hidden');audio?.suspend()}},{signal});
 return ()=>{destroyed=true;abort.abort();cancelAnimationFrame(raf);sizeObserver.disconnect();visibility.disconnect();timers.forEach(clearTimeout);audio?.close().catch(()=>{})};
}





