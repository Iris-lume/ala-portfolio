export function previewMarkup(p,detail=false){return `<div class="video-project-media video-preview ${p.previewBackground==="white"?"video-preview-light":""}${p.previewBackground==="black"?"video-preview-dark":""} ${p.videoShape==="portrait"?"video-portrait":""} ${detail?'video-project-detail':''}" data-video-preview><video muted loop playsinline autoplay preload="metadata" src="${p.video}#t=${p.videoStart||0.1}" data-project-video></video></div>`}
export function mountPreviews(root){
 const previews=[...root.querySelectorAll('[data-video-preview]')];if(!previews.length)return ()=>{};
 const controller=new AbortController(),signal=controller.signal;
 function pause(box){const video=box.querySelector('video');video.pause()}
 function play(box){const video=box.querySelector('video');video.muted=true;video.defaultMuted=true;video.volume=0;video.play().catch(()=>{})}
 const view=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)play(entry.target);else pause(entry.target)}},{threshold:.15});
 previews.forEach(box=>{const video=box.querySelector('video');video.muted=true;video.defaultMuted=true;video.volume=0;view.observe(box)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)previews.forEach(pause)},{signal});
 return ()=>{controller.abort();view.disconnect();previews.forEach(pause)};
}

