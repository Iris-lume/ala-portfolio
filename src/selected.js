const featured=[
  {title:'海边小屋',english:'Seaside cottage',cover:'/public/images/seaside-fish-house.png',link:'#/project/motion-1'},
  {title:'暖瓦小屋',english:'Terracotta cottage',cover:'/public/images/terracotta-cottage.png',link:'#/project/motion-5'},
  {title:'云庭之树',english:'The cloud courtyard',cover:'/public/images/cloud-courtyard-tree.png',link:'#/project/graphic-3'},
  {title:'云上集市',english:'Market above the clouds',cover:'/public/images/market-above-clouds.png',link:'#/project/graphic-4'}
];
function gallery(f){
 const images=[{src:f.cover,alt:f.title},...(f.extraImages??[])].slice(0,3);
 const count=f.singleImage?1:3;
 return Array.from({length:count},(_,i)=>{
  const image=images[i];
  return image?`<a class="selected-image" href="${f.link}"><img src="${image.src}" alt="${image.alt??f.title}" loading="lazy"></a>`:`<div class="selected-image-slot" aria-hidden="true"><span>0${i+1}</span></div>`;
 }).join('');
}
export function selectedMarkup(){return `<section class="selected-scroll selected-editorial" id="selected" aria-labelledby="selected-heading"><div class="selected-scroll-head"><h2 id="selected-heading">精选探索 <span>Selected explorations</span></h2></div><div class="selected-scroll-layout"><nav class="selected-index" aria-label="精选作品目录">${featured.map((f,i)=>`<a href="#exploration-${i}" data-exploration-link="${i}" ${i===0?'aria-current="true"':''}><b>${f.title}</b><i>${f.english}</i></a>`).join('')}</nav><div class="selected-stream">${featured.map((f,i)=>`<article class="selected-group" id="exploration-${i}" data-exploration-group="${i}" aria-label="${f.title}">${gallery(f)}</article>`).join('')}</div></div></section>`}
export function mountSelected(root){const section=root.querySelector('.selected-scroll');if(!section)return()=>{};const links=[...section.querySelectorAll('[data-exploration-link]')],groups=[...section.querySelectorAll('[data-exploration-group]')],abort=new AbortController(),{signal}=abort,reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,timer=0,active=-1;
 function highlight(index){if(index===active)return;active=index;links.forEach((a,i)=>{if(i===index)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
 function update(){raf=0;const target=innerHeight*.43;let index=0;groups.forEach((g,i)=>{if(g.getBoundingClientRect().top<=target)index=i});highlight(index)}
 function schedule(){if(!raf)raf=requestAnimationFrame(update)}
 function locate(i){groups[i].scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'})}
 links.forEach((link,i)=>{link.addEventListener('click',e=>{e.preventDefault();clearTimeout(timer);locate(i)},{signal});link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){clearTimeout(timer);timer=setTimeout(()=>locate(i),160)}},{signal});link.addEventListener('pointerleave',()=>clearTimeout(timer),{signal})});window.addEventListener('scroll',schedule,{passive:true,signal});window.addEventListener('resize',schedule,{signal});update();return()=>{abort.abort();cancelAnimationFrame(raf);clearTimeout(timer)}}