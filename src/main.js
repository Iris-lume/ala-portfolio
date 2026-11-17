import {selectedMarkup,mountSelected} from './selected.js';
let cleanupSelected=()=>{};
import {tagsMarkup,mountTags} from './tags.js';
let cleanupTags=()=>{};
import {initLocalEditor} from './editor.js';
import {effectMarkup,mountEffects} from './effects.js';
let cleanupEffects=()=>{};
import {generativeMarkup,mountGenerative} from './generative.js';
let cleanupGenerative=()=>{};
import {previewMarkup,mountPreviews} from './previews.js';
let cleanupPreviews=()=>{};
import {illustrationMarkup,mountIllustration} from './illustration.js';
let cleanupIllustration=()=>{};
import {vfxMarkup,mountVfx} from './vfx.js';
let cleanupVfx=()=>{};
import {gardenMarkup,mountGarden} from './garden.js';
let cleanupGarden=()=>{};
import {instrumentMarkup,mountInstrument} from './instrument.js';
let cleanupInstrument=()=>{};
import {categories,projects} from './data/portfolio.js';
const main=document.querySelector('main');
function videoMarkup(p,detail=false){return previewMarkup(p,detail)}
function art(p,extra=''){
 if(p.effect)return effectMarkup(p.effect);
 if(p.demo)return p.demo==='garden'?gardenMarkup():generativeMarkup(p.demo);
 if(p.video)return videoMarkup(p,true);
 if(!p.cover)return '';
 const shape=p.coverAspect==='wide'?'landscape-art':p.coverAspect==='square'?'square-art':p.coverAspect==='scene'?'scene-art':p.coverAspect==='portrait'?'portrait-art':'';
 return `<div class="art artwork-image ${shape} ${extra}"><img src="${p.cover}" alt="${p.title}" width="${p.width}" height="${p.height}" loading="lazy"></div>`;
}
function card(p,i=0){
 if(p.demo==='garden')return `<div class="coding-garden-card">${gardenMarkup()}<a class="demo-details" href="#/project/${p.id}">查看作品 ↗</a></div>`;
 const caption=`<div class="card-caption"><h3>${p.title}</h3><span class="card-arrow" aria-hidden="true">↗</span></div>`;
 const portrait=p.videoShape==='portrait'?'card-portrait':'';
 if(!p.effect&&!p.demo&&!p.video)return `<a class="project-card card-${i} ${portrait}" href="#/project/${p.id}">${art(p)}${caption}</a>`;
 return `<article class="project-card ${portrait}">${art(p)}<a href="#/project/${p.id}" aria-label="查看${p.title}">${caption}</a></article>`;
}
function placeholder(){return `<div class="project-card project-placeholder"><div class="art placeholder-art"><span>·</span></div><div class="card-caption"><h3>待发布</h3></div></div>`}
function heading(a,b,desc=''){return `<section class="page-heading"><p class="breadcrumb"><a href="#/">首页</a> / ${a}</p><h1>${b}</h1>${desc?`<p class="page-description">${desc}</p>`:''}</section>`}
function home(){return `<section class="hero reference-hero" id="top"><div class="hero-overline"><span class="portfolio-year">(PORTFOLIO / 2026)</span><span class="city-clock">Shenzhen, China / <time data-city-clock></time></span><span class="availability"><i></i> Exploring new possibilities</span></div><div class="hero-name"><h1><button class="hero-type" type="button" aria-label="ALA，点击切换文字视觉效果" aria-pressed="false">ALA</button></h1></div><div class="hero-bottom"><div class="hero-intro"><p>Exploring digital art, motion and interactive experiences.</p><p>探索数字视觉、动态设计与交互体验的更多可能。</p></div><a class="round-link" href="#/work">查看作品 <span>→</span></a></div><a class="hero-scroll" href="#selected">向下滚动<span>↓</span></a></section>${tagsMarkup()}${selectedMarkup()}<section class="disciplines section"><div class="section-head"><h2>创作方向 <span>Fields of practice</span></h2><span class="quiet">01 — 04</span></div>${categories.map(c=>`<a class="discipline" href="#/category/${c.id}"><span class="discipline-no">${c.number}</span><div><h3>${c.title}</h3><p>${c.english}</p></div><span class="discipline-medium">${c.medium}</span><span class="discipline-arrow">↗</span></a>`).join('')}</section><section class="about-teaser section"><p>关于 ALA / About the practice</p><h2>让想法成为图像，<br>让图像成为体验。</h2><div><p>实时视觉、创意编程、三维与平面插画作品。</p><a class="text-link" href="#/about">了解更多 <span>↗</span></a></div></section>`}
function workFolders(){const names=['实时视觉与动态影像','创意编程与生成式设计','三维视觉与动态特效','平面设计与视觉传达'];return `<section class="work-folders"><div class="work-folder-heading"><h1><button class="hero-type" type="button" aria-label="WORK，点击切换文字视觉效果" aria-pressed="false">WORK</button></h1><span>${String(projects.length).padStart(2,'0')} works / 04 collections</span></div><div class="folder-grid">${categories.map((c,i)=>{const p=projects.find(p=>p.category===c.id);const thumb=p.cover?`<img src="${p.cover}" alt="${p.title}" loading="lazy">`:p.video?`<video src="${p.video}#t=0.1" muted playsinline preload="metadata" aria-hidden="true"></video>`:`<div class="folder-demo-preview" inert>${gardenMarkup()}</div>`;return `<article class="folder-item" style="--folder-hue:${[252,276,341,146][i]}"><div class="folder-object" aria-hidden="true"><div class="folder-back"></div><div class="folder-preview">${thumb}</div><div class="folder-glass"><span>${c.number}</span><span>${String(projects.filter(p=>p.category===c.id).length).padStart(2,'0')} works</span></div></div><div class="folder-caption"><div><h2>${c.number} ${names[i]}</h2><p class="folder-caption-en">${['Real-time Visuals & Motion Imagery','Creative Coding & Generative Design','3D Visuals & Motion Effects','Graphic Design & Visual Communication'][i]}</p></div><span>↗</span></div><a class="folder-open" href="#/category/${c.id}" aria-label="打开${names[i]}文件夹"></a></article>`}).join('')}</div></section>`}
function motifWave(){const paths=Array.from({length:7},(_,j)=>{let d='';for(let i=0;i<=140;i++){const x=20+i/140*520,envelope=Math.pow(Math.sin(i/140*Math.PI),1.8),y=150+Math.sin(i/140*Math.PI*4.2+j*.19)*envelope*(27+j*11);d+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)+' '}return `<path d="${d}" stroke-width="${j===3?1.4:.8}" stroke-opacity="${j===3?.8:.2+j*.045}" class="${j===3?'motif-accent':''}"/>`}).join('');return `<svg viewBox="0 0 560 300" fill="none">${paths}</svg>`}
function motifFlow(){
 const orbits=[-58,0,58].map((angle,i)=>`<g class="motif-layer" opacity="${.35+i*.18}"><ellipse cx="280" cy="150" rx="146" ry="45" transform="rotate(${angle} 280 150)"/><circle cx="417" cy="135" r="4" fill="currentColor" transform="rotate(${angle} 280 150)"/></g>`).join('');
 return `<svg viewBox="0 0 560 300" fill="none">${orbits}<g class="motif-layer motif-accent" stroke-width="7" stroke-linecap="round"><path d="M280 124v52m-24-34 48 16m-39 14 30-44"/></g></svg>`;
}
function motifStructure(){
 const slabs=[0,1,2].map((i)=>`<g class="motif-layer" opacity="${.42+i*.24}"><g transform="translate(0 ${64-i*62})"><path d="M280 67 415 120 280 173 145 120Z M145 120v24l135 53 135-53v-24 M280 173v24"/><path d="m190 102 135 53m-90-71 135 53m-135 18 135-53m-180 35 135-53" opacity=".32"/></g></g>`).join('');
 return `<svg viewBox="0 0 560 300" fill="none">${slabs}</svg>`;
}
function motifArcs(){
 const tiles=['<path d="M0 96A96 96 0 0 1 96 0v96Z" fill="currentColor"/>','<circle cx="48" cy="48" r="35" fill="currentColor"/><circle cx="48" cy="48" r="15" fill="#0b0b0b" stroke="none"/>','<path d="M0 96 96 0v96Z" fill="currentColor"/><path d="M0 48 48 0H0Z"/>','<path d="M0 0h96A96 96 0 0 1 0 96Z" fill="currentColor"/>'];
 return `<svg viewBox="0 0 560 300" fill="none" stroke="currentColor">${tiles.map((tile,i)=>`<g class="motif-layer" opacity="${[.85,.5,.64,.95][i]}"><g transform="translate(${180+(i%2)*100} ${50+Math.floor(i/2)*100})"><rect width="96" height="96" opacity=".35"/>${tile}</g></g>`).join('')}</svg>`;
}

function categoryMotif(kind){const art={wave:motifWave,flow:motifFlow,structure:motifStructure,arcs:motifArcs}[kind]||motifWave;return `<div class="realtime-motif" data-motif="${kind||'wave'}" aria-hidden="true">${art()}</div>`}
function categoryHeading(c){return `<section class="page-heading realtime-heading category-heading" data-category="${c.id}"><h1><button class="hero-type" type="button" aria-label="${c.heroAria}，点击切换文字视觉效果" aria-pressed="false">${c.heroTitle}</button></h1><p class="page-description">${c.headingDescription||c.description}</p>${categoryMotif(c.motif)}</section>`}
function work(id){if(!id){const list=projects;const tools=[['TouchDesigner','Blender'],['Photoshop','Illustrator'],['p5.js','Codex']];return `${workFolders()}<section class="section" id="all-works" style="padding-top:60px"><nav class="filters" aria-label="作品分类"><a class="active" href="#/work">全部 <sup>${String(projects.length).padStart(2,'0')}</sup></a>${categories.map(x=>`<a href="#/category/${x.id}">${x.number} ${['实时视觉与动态影像','创意编程与生成式设计','三维视觉与动态特效','平面设计与视觉传达'][categories.indexOf(x)]}</a>`).join('')}</nav><div class="archive-meta"><span>All disciplines</span><span>${String(list.length).padStart(2,'0')} 个项目</span></div><div class="project-grid archive-grid">${list.map(card).join('')}</div></section><section class="section work-toolkit"><span class="toolkit-label">TOOLKIT</span><div class="work-toolkit-grid">${tools.flat().map(t=>`<div class="work-toolkit-item">${t}</div>`).join('')}</div></section>`}const c=categories.find(c=>c.id===id);const list=c?projects.filter(p=>p.category===id):projects;const placeholders=Math.max(0,6-list.length);return `${categoryHeading(c)}<section class="section archive"><nav class="filters" aria-label="作品分类"><a href="#/work" onclick="setTimeout(()=>document.getElementById('all-works')?.scrollIntoView({behavior:'smooth'}),100)">全部 <sup>${String(projects.length).padStart(2,'0')}</sup></a>${categories.map(x=>`<a href="#/category/${x.id}" class="${x.id===id?'active':''}">${x.number} ${['实时视觉与动态影像','创意编程与生成式设计','三维视觉与动态特效','平面设计与视觉传达'][categories.indexOf(x)]}</a>`).join('')}</nav><div class="archive-meta"><span>${id==='realtime'?'音频响应 / 视觉现场（VJ）/ 动态图形':c?c.medium:'All disciplines'}</span><span>${String(list.length).padStart(2,'0')} 个项目</span></div><div class="project-grid archive-grid">${list.map(card).join('')}${Array.from({length:placeholders},placeholder).join('')}</div></section>`}
function detail(id){
 const p=projects.find(x=>x.id===id);if(!p)return missing();
 const c=categories.find(x=>x.id===p.category),list=projects.filter(x=>x.category===p.category),next=list[(list.indexOf(p)+1)%list.length];
 return `<section class="project-heading section"><p class="breadcrumb"><a href="#/work">作品</a> / <a href="#/category/${c.id}">${c.title}</a></p></section><section class="detail-page"><div class="detail-media">${art(p)}${p.screenshot?`<img class="detail-screenshot" src="${p.screenshot}" alt="${p.title} TouchDesigner 工程">`:''}</div><div class="detail-info"><h1>${p.title}</h1><p class="detail-en">${p.english||''}</p>${p.description?`<p class="detail-desc">${p.description}</p>`:''}${p.tags?`<div class="detail-tags">${p.tags.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>`:''}<dl class="detail-meta">${p.tools?`<div><dt>创作工具</dt><dd>${p.tools}</dd></div>`:''}</dl></div></section><a class="next-project section" href="#/project/${next.id}"><span>下一个作品 / Next work</span><h2>${next.title} ↗</h2></a>`;
}
function about(){const tools=[['TouchDesigner','Blender'],['Photoshop','Illustrator'],['p5.js','Codex']];return `<section class="page-heading about-heading"><h1><button class="hero-type" type="button" aria-label="ABOUT，点击切换文字视觉效果" aria-pressed="false">ABOUT</button></h1></section><section class="about-main section"><div class="about-photo"><img src="/public/images/portrait.jpg" alt="ALA portrait"></div><div class="about-text"><h2>Hi, I'm ALA.</h2><p class="about-sub">A Digital Media Artist & Creative Technologist.</p><p>我是一名数字媒体艺术专业的创作者，关注视觉设计、创意编程与交互技术的结合。</p><p>我主要使用 TouchDesigner 探索实时视觉、动态影像与生成式图形，同时结合三维设计和创意编程，尝试不同的数字视觉表达方式。</p><p>我喜欢将视觉构思与技术实现结合，从图形、运动到交互体验，不断探索代码与视觉之间的更多可能。</p><div class="about-toolkit"><span class="toolkit-label">TOOLKIT</span><div class="about-toolkit-grid">${tools.flat().map(t=>`<div class="about-toolkit-item">${t}</div>`).join('')}</div></div></div></section>`}
function contact(){return `<section class="page-heading about-heading"><h1><button class="hero-type" type="button" aria-label="CONTACT，点击切换文字视觉效果" aria-pressed="false">EMAIL<br>ME</button></h1></section><section class="contact-page section"><div class="contact-left"><h2>保持联系</h2><p>欢迎通过邮件交流项目与合作，也可以在小红书查看我的更多创作。</p></div><div class="contact-right"><a class="contact-row" href="mailto:3268468838@qq.com"><span class="contact-label">EMAIL</span><span class="contact-value">发送邮件 ↗</span></a><a class="contact-row" href="https://www.xiaohongshu.com/user/profile/5d27d4900000000012036057" target="_blank" rel="noopener noreferrer"><span class="contact-label">SOCIAL</span><span class="contact-value">小红书 ↗</span></a></div></section>`}
function missing(){return `${heading('页面未找到','Nothing here yet.','这个页面尚未添加。')}<section class="section"><a class="text-link" href="#/work">返回作品索引 ↗</a></section>`}
let cityClockTimer;
function render(){clearInterval(cityClockTimer);cleanupSelected();cleanupTags();cleanupEffects();cleanupGenerative();cleanupPreviews();cleanupInstrument();cleanupGarden();cleanupVfx();cleanupIllustration();const [page='',id]=location.hash.replace(/^#\/?/,'').split('/');main.innerHTML=page==='work'?work():page==='category'?(categories.some(c=>c.id===id)?work(id):missing()):page==='project'?detail(id):page==='about'?about():page==='contact'?contact():home();document.title=`${page==='project'?(projects.find(p=>p.id===id)?.english||'项目'):page==='category'?(categories.find(c=>c.id===id)?.title||'分类'):({work:'作品索引',about:'关于',contact:'联系'}[page]||'Visual practice')} — ALA`;document.querySelectorAll('header nav a').forEach(a=>{const current=a.hash===`#/${page}`||(a.hash==='#/work'&&['category','project'].includes(page));if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});window.scrollTo(0,0);document.body.classList.toggle('home-reference',!page);document.body.classList.toggle('work-reference',page==='work');const role=document.querySelector('header .role');if(role)role.innerHTML='独立视觉创作者<br><span>Independent Visual Creator</span>';document.querySelector('header .header-city-clock')?.remove();const city=main.querySelector('.city-clock');if(city){city.classList.add('header-city-clock');document.querySelector('header').insertBefore(city,document.querySelector('header nav'))}const clock=document.querySelector('header [data-city-clock]');if(clock){const tick=()=>{const now=new Date();clock.dateTime=now.toISOString();clock.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)};tick();cityClockTimer=setInterval(tick,1000)}const scroll=main.querySelector('.hero-scroll');if(scroll)scroll.addEventListener('click',e=>{e.preventDefault();main.querySelector('.tech-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});initHeroType();mountCategoryMotion();mountFooterMotion();cleanupInstrument=mountInstrument(main);cleanupGarden=mountGarden(main);cleanupVfx=mountVfx(main);cleanupIllustration=mountIllustration(main);cleanupPreviews=mountPreviews(main);cleanupGenerative=mountGenerative(main);cleanupEffects=mountEffects(main);cleanupTags=mountTags(main);cleanupSelected=mountSelected(main);initLocalEditor(main)}
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView()});window.addEventListener('hashchange',render);document.querySelector('[data-top]').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});render();



function initHeroType(){
  const type=main.querySelector('.hero-type');
  if(!type)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const reset=()=>{cancelAnimationFrame(frame);type.classList.remove('is-tracking');type.style.setProperty('--drift-x','0px');type.style.setProperty('--drift-y','0px')};
  type.addEventListener('pointermove',event=>{
    const rect=type.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      if(!type.isConnected)return;
      type.style.setProperty('--light-x',`${x*100}%`);
      type.style.setProperty('--light-y',`${y*100}%`);
      type.style.setProperty('--drift-x',reduced.matches?'0px':`${(x-.5)*10}px`);
      type.style.setProperty('--drift-y',reduced.matches?'0px':`${(y-.5)*8}px`);
      type.classList.add('is-tracking');
    });
  });
  type.addEventListener('pointerleave',reset);
  type.addEventListener('pointercancel',reset);
  type.addEventListener('blur',reset);
  type.addEventListener('click',()=>{const active=type.getAttribute('aria-pressed')!=='true';type.setAttribute('aria-pressed',String(active));type.classList.toggle('is-outline',active)});
}

function mountCategoryMotion(){
  const section=main.querySelector('.realtime-heading.category-heading');
  if(!section)return;
  const motif=section.querySelector('.realtime-motif');
  if(!motif)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const reset=()=>{
    cancelAnimationFrame(frame);
    motif.classList.remove('motif-engaged');
    for(const layer of layers)for(const prop of ['--rx','--ry','--spin','--spread'])layer.style.removeProperty(prop);
  };
  const kind=motif.dataset.motif;
  const layers=[...motif.querySelectorAll(kind==='wave'?'path':'.motif-layer')];
  motif.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reduced.matches)return;
    const rect=motif.getBoundingClientRect();
    const x=Math.max(-1,Math.min(1,2*(event.clientX-rect.left)/rect.width-1));
    const y=Math.max(-1,Math.min(1,2*(event.clientY-rect.top)/rect.height-1));
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      if(!motif.isConnected)return;
      motif.classList.add('motif-engaged');
      layers.forEach((layer,i)=>{
        const depth=(i+1)/layers.length;
        layer.style.setProperty('--rx',x*(kind==='structure'?42*depth:kind==='flow'?(i===0?20:7):9*depth)+'px');
        layer.style.setProperty('--ry',y*(kind==='wave'?(-18+depth*42):17*depth)+'px');
        layer.style.setProperty('--spin',(kind==='flow'?(i===0?x*30:0):kind==='arcs'?x*depth*28:0)+'deg');
        layer.style.setProperty('--spread',kind==='wave'?1+depth*(.25-y*.15):kind==='flow'&&i===0?1.15:1);
      });
    });
  });
  motif.addEventListener('pointerleave',reset);
  motif.addEventListener('pointercancel',reset);
}
function mountFooterMotion(){
  const big=document.querySelector('.footer-big');
  if(!big)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  const reset=()=>{cancelAnimationFrame(frame);big.style.transform=''};
  big.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reduced.matches)return;
    const rect=big.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      if(!big.isConnected)return;
      big.style.transform=`translate(${(x-.5)*48}px,0)`;
    });
  });
  big.addEventListener('pointerleave',reset);
  big.addEventListener('pointercancel',reset);
}

const footerClock=document.querySelector('[data-footer-clock]');
if(footerClock){
  const tick=()=>{const now=new Date();footerClock.dateTime=now.toISOString();footerClock.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)};
  tick();setInterval(tick,1000);
}