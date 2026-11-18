import { projects } from './data/portfolio.js';

const selections = [
  ['graphic-9', '视觉传达'],
  ['motion-9', '三维场景'],
  ['graphic-12', '图像实验'],
  ['graphic-5', '装饰纹样']
];

export function workStripMarkup() {
  const ids = ['graphic-22', 'motion-10', 'graphic-21', 'graphic-6', 'motion-5'];
  const works = ids.map(id => projects.find(project => project.id === id)).filter(project => project?.cover);
  return `<section class="work-strip" aria-labelledby="work-strip-heading">
    <div class="work-strip-heading">
      <h2 id="work-strip-heading">更多作品 <span lang="en">More work</span></h2>
      <div class="work-strip-controls">
        <button type="button" data-strip-step="-1" aria-label="向左浏览作品" aria-controls="work-strip-track" disabled>←</button>
        <button type="button" data-strip-step="1" aria-label="向右浏览作品" aria-controls="work-strip-track">→</button>
      </div>
    </div>
    <div class="work-strip-track" id="work-strip-track">${works.map(project => `<a href="#/project/${project.id}">
      <img src="${project.cover}" alt="" loading="lazy" decoding="async">
      <span>${project.title}</span>
    </a>`).join('')}</div>
  </section>`;
}

function mountWorkStrip(root, signal) {
  const track = root.querySelector('.work-strip-track');
  if (!track) return;
  const [previous, next] = root.querySelectorAll('[data-strip-step]');
  function updateControls() {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
  }
  for (const button of [previous, next]) {
    button.addEventListener('click', () => {
      const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      track.scrollBy({left: step * Number(button.dataset.stripStep), behavior});
    }, {signal});
  }
  track.addEventListener('scroll', updateControls, {passive:true, signal});
  window.addEventListener('resize', updateControls, {signal});
  updateControls();
}

export function selectedMarkup() {
  const works = selections.flatMap(([id, label]) => {
    const p = projects.find(p => p.id === id && p.cover);
    return p ? [{...p,label}] : [];
  });
  return `<section class="featured-explorations" id="selected" aria-labelledby="selected-heading"><div class="featured-spread"><div class="featured-side"><h2 id="selected-heading">精选探索 <span lang="en">Selected explorations</span></h2><nav class="featured-index" aria-label="精选作品">${works.map((p,i)=>`<a href="#/project/${p.id}" data-featured-link="${i}" ${i===0?'aria-current="true"':''}><span>${p.title}</span><small>${p.label}</small></a>`).join('')}</nav><a class="featured-all" href="#/work">浏览全部作品 ↗</a></div><div class="featured-rail">${works.map((p,i)=>`<a class="featured-still" href="#/project/${p.id}" data-featured-image="${i}"><img src="${p.cover}" alt="${p.title}" ${p.width&&p.height?`width="${p.width}" height="${p.height}"`:''} loading="lazy"></a>`).join('')}</div></div></section>`;
}

export function mountSelected(root){
  const panel=root.querySelector('.featured-spread');
  if(!panel)return()=>{};
  const links=[...panel.querySelectorAll('[data-featured-link]')], frames=[...panel.querySelectorAll('[data-featured-image]')];
  const controller=new AbortController(),{signal}=controller;
  mountWorkStrip(root, signal);
  let task=0, active=-1;
  function update(){
    task=0;
    const middle=innerHeight*.5;
    let best=Infinity,index=0;
    frames.forEach((frame,i)=>{
      const r=frame.getBoundingClientRect();
      const distance=Math.max(r.top-middle,middle-r.bottom,0);
      if(distance<best){best=distance;index=i}
    });
    if(index!==active){
      active=index;
      links.forEach((link,i)=>i===index?link.setAttribute('aria-current','true'):link.removeAttribute('aria-current'));
    }
  }
  function schedule(){if(!task)task=requestAnimationFrame(update)}
  window.addEventListener('scroll',schedule,{passive:true,signal});
  window.addEventListener('resize',schedule,{signal});
  const resize=new ResizeObserver(schedule);resize.observe(panel);
  update();
  return()=>{controller.abort();resize.disconnect();cancelAnimationFrame(task)};
}
