document.documentElement.classList.add('js');
const header=document.querySelector('.site-header'),rail=document.querySelector('.nav-rail'),navigation=rail.querySelector('nav');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const hasObserver='IntersectionObserver' in window;
let paused=reduced.matches||!!navigator.connection?.saveData||!hasObserver;
const videos=[...document.querySelectorAll('[data-loop]')],visibleVideos=new Set();
const inOpenContent=el=>!el.closest('[hidden]')&&(!el.closest('details')||el.closest('details').open);
const paintClip=video=>{const b=video.closest('.hero-stage,.project-media')?.querySelector('.clip-toggle');if(!b)return;const stop=video.paused;b.setAttribute('aria-pressed',String(stop));b.setAttribute('aria-label',b.getAttribute('aria-label').replace(/^(Pause|Play)/,stop?'Play':'Pause'));b.firstElementChild.textContent=stop?'▶':'Ⅱ';};
const play=video=>{
  if(!video.dataset.loaded){
    if(video.dataset.src)video.src=video.dataset.src;
    video.querySelectorAll('source[data-src]').forEach(s=>s.src=s.dataset.src);
    video.dataset.loaded='true';video.load();
  }
  video.muted=true;
  video.play().then(()=>{if(document.hidden||document.querySelector('.image-dialog[open]'))video.pause();else video.classList.add('is-playing');paintClip(video);}).catch(()=>{video.classList.remove('is-playing');paintClip(video);});
};
const syncVideos=()=>{const modalOpen=!!document.querySelector('.image-dialog[open]');videos.forEach(v=>{
  const active=(!paused||v.dataset.manual==='true')&&!document.hidden&&!modalOpen&&visibleVideos.has(v)&&inOpenContent(v)&&v.dataset.paused!=='true';
  if(active)play(v);else v.pause();paintClip(v);
});};
videos.forEach(v=>{v.addEventListener('play',()=>paintClip(v));v.addEventListener('pause',()=>paintClip(v));});
const updateMotion=()=>{
  document.documentElement.classList.toggle('motion-paused',paused);
  syncVideos();
};
reduced.addEventListener('change',()=>{paused=reduced.matches||!!navigator.connection?.saveData||!hasObserver;videos.forEach(v=>delete v.dataset.manual);updateMotion();});
document.addEventListener('visibilitychange',syncVideos);
const updateHeader=()=>{document.documentElement.style.setProperty('--header-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);updateRail();};
const updateRail=()=>rail.classList.toggle('at-end',navigation.scrollLeft+navigation.clientWidth>=navigation.scrollWidth-3);
updateHeader();updateMotion();
if('ResizeObserver'in window)new ResizeObserver(updateHeader).observe(header);
window.addEventListener('resize',updateRail,{passive:true});navigation.addEventListener('scroll',updateRail,{passive:true});
if(hasObserver){
  const loops=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting&&e.intersectionRatio>=.08?visibleVideos.add(e.target):visibleVideos.delete(e.target));syncVideos();},{threshold:.08});
  videos.forEach(v=>loops.observe(v));
}
document.querySelectorAll('.clip-toggle').forEach(button=>button.addEventListener('click',()=>{
  const video=button.closest('.hero-stage,.project-media').querySelector('video'),stop=!video.paused;
  video.dataset.paused=String(stop);
  if(!stop){video.dataset.manual=String(paused);if(!hasObserver)visibleVideos.add(video);}else delete video.dataset.manual;
  syncVideos();
}));
const filters=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('[data-tags]')];
filters.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;let count=0;
  filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  cards.forEach(card=>{card.hidden=category!=='All'&&!card.dataset.tags.split('|').includes(category);if(!card.hidden)count++;});
  const workbench=document.querySelector('.workbench'),n=workbench.querySelectorAll('article:not([hidden])').length;
  workbench.querySelector('summary small').textContent=`${n} ${n===1?'project':'projects'}`;
  workbench.hidden=!n;workbench.open=category!=='All'&&n>0;
  document.querySelector('#filter-status').textContent=`${count} ${count===1?'project matches':'projects match'} ${category}.`;syncVideos();
}));
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',syncVideos));
// Measured anchor navigation, with a gentle start and stop. Input always takes over.
let scrollFrame=0,scrollTicket=0;
const cancelScroll=()=>{cancelAnimationFrame(scrollFrame);scrollFrame=0;scrollTicket++;};
['wheel','touchstart','pointerdown'].forEach(type=>window.addEventListener(type,cancelScroll,{passive:true}));
['popstate','hashchange'].forEach(type=>window.addEventListener(type,cancelScroll));
reduced.addEventListener('change',cancelScroll);
window.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Escape',' '].includes(e.key))cancelScroll();});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const href=a.getAttribute('href'),target=document.getElementById(href.slice(1));if(!target)return;
  event.preventDefault();cancelScroll();
  const ticket=scrollTicket,start=scrollY,max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const end=Math.min(max,Math.max(0,start+target.getBoundingClientRect().top-header.getBoundingClientRect().height-12));
  const duration=paused||reduced.matches||Math.abs(end-start)<1?0:Math.min(650,450+Math.abs(end-start)*.025);
  if(location.hash!==href)history.pushState(null,'',href);
  const finish=()=>{scrollFrame=0;if(!target.hasAttribute('tabindex')){target.setAttribute('tabindex','-1');target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});}target.focus({preventScroll:true});};
  if(!duration){scrollTo(0,end);finish();return;}
  const then=performance.now();
  const step=now=>{if(ticket!==scrollTicket)return;const t=Math.min(1,(now-then)/duration),ease=t<.5?4*t**3:1-(-2*t+2)**3/2;scrollTo(0,start+(end-start)*ease);if(t<1)scrollFrame=requestAnimationFrame(step);else finish();};
  scrollFrame=requestAnimationFrame(step);
}));
// Show the current preview now; decoded full images are retained between opens.
const dialog=document.querySelector('.image-dialog'),dialogImage=dialog.querySelector('img'),more=document.querySelector('#lightbox-more');
const caption=document.querySelector('#lightbox-caption'),stage=document.createElement('div'),loading=document.createElement('span');
stage.className='lightbox-stage';dialogImage.classList.add('lightbox-preview');
dialogImage.before(stage);stage.append(dialogImage,loading);
loading.className='lightbox-loading';loading.textContent='Loading image…';loading.setAttribute('role','status');loading.hidden=true;
const lightboxLinks=[...document.querySelectorAll('[data-lightbox]')],decodedImages=new Map(),visiblePreviews=new Set();
let lightboxTicket=0,fullImage=null,lastTrigger=null,idleTimer=0,idleFetching=false;
const ownPreview=a=>a.querySelector('img');
const samePreview=(a,img)=>img?.complete&&img.naturalWidth>0&&(a.href===img.currentSrc||(!img.getAttribute('srcset')&&a.href===img.src));
const fullEntry=(url,retry=false)=>{
  const cached=decodedImages.get(url);if(cached&&(!retry||!cached.failed))return cached;
  const image=new Image(),entry={image,ready:false,failed:false,promise:null};
  image.decoding='async';image.fetchPriority='low';image.className='lightbox-full';decodedImages.set(url,entry);
  entry.promise=new Promise(resolve=>{
    image.onload=async()=>{try{await image.decode();}catch{}entry.ready=!!image.naturalWidth;resolve(entry.ready?image:null);};
    image.onerror=()=>{entry.failed=true;resolve(null);};image.src=url;
  });
  return entry;
};
const warmImage=a=>{const img=ownPreview(a);if(samePreview(a,img))return null;return fullEntry(a.href);};
const actuallyVisible=a=>{const r=a.getBoundingClientRect();return inOpenContent(a)&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;};
const scheduleImageWarmup=()=>{
  if(idleTimer||idleFetching||navigator.connection?.saveData||document.hidden||dialog.open)return;
  idleTimer=setTimeout(()=>{
    const work=()=>{
      idleTimer=0;if(document.hidden||dialog.open)return;
      const a=[...visiblePreviews].find(link=>{const img=ownPreview(link);return actuallyVisible(link)&&img?.complete&&img.naturalWidth&&!samePreview(link,img)&&!decodedImages.has(link.href);});
      if(a){idleFetching=true;warmImage(a).promise.then(()=>{idleFetching=false;scheduleImageWarmup();});}
    };
    if('requestIdleCallback'in window)requestIdleCallback(work,{timeout:1500});else work();
  },450);
};
const showFullImage=(image,ticket)=>{
  if(!image||!dialog.open||ticket!==lightboxTicket)return;
  if(fullImage!==image){fullImage?.remove();fullImage=image;stage.append(image);}
  image.alt=dialogImage.alt;dialogImage.hidden=true;loading.hidden=true;stage.setAttribute('aria-busy','false');
};
lightboxLinks.forEach(a=>{
  a.addEventListener('pointerenter',()=>warmImage(a),{passive:true});
  a.addEventListener('focus',()=>warmImage(a));
  ownPreview(a)?.addEventListener('load',()=>{if(visiblePreviews.has(a))scheduleImageWarmup();});
  a.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof dialog.showModal!=='function')return;
    event.preventDefault();cancelScroll();const ticket=++lightboxTicket,img=ownPreview(a);
    lastTrigger=a;fullImage?.remove();fullImage=null;
    caption.textContent=a.dataset.caption||img?.alt||'Image';
    document.querySelector('#lightbox-credit').textContent=a.dataset.credit||'Pavan · CC BY-SA 4.0';
    const previewSrc=img?.complete&&img.naturalWidth>0?(img.currentSrc||img.src):'';
    dialogImage.hidden=!previewSrc;dialogImage.alt=a.dataset.alt||img?.alt||caption.textContent;
    if(previewSrc&&dialogImage.src!==previewSrc)dialogImage.src=previewSrc;
    if(img){dialogImage.width=img.naturalWidth||img.width;dialogImage.height=img.naturalHeight||img.height;}
    loading.textContent='Loading image…';loading.hidden=!!previewSrc;
    more.hidden=!a.dataset.more;if(a.dataset.more)more.href=a.dataset.more;
    stage.setAttribute('aria-busy',String(!samePreview(a,img)));
    if(!dialog.open)dialog.showModal();document.documentElement.classList.add('dialog-open');syncVideos();
    if(samePreview(a,img)){stage.setAttribute('aria-busy','false');return;}
    const entry=fullEntry(a.href,true);entry.image.fetchPriority='high';
    if(entry.ready)showFullImage(entry.image,ticket);
    else entry.promise.then(image=>{
      if(image)showFullImage(image,ticket);
      else if(dialog.open&&ticket===lightboxTicket){stage.setAttribute('aria-busy','false');loading.textContent='Image unavailable.';loading.hidden=!!previewSrc;}
    });
  });
});
if(hasObserver){
  const imageObserver=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visiblePreviews.add(e.target):visiblePreviews.delete(e.target));scheduleImageWarmup();},{threshold:.2});
  lightboxLinks.filter(ownPreview).forEach(a=>imageObserver.observe(a));
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleImageWarmup();});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{lightboxTicket++;document.documentElement.classList.remove('dialog-open');stage.setAttribute('aria-busy','false');if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});syncVideos();scheduleImageWarmup();});
const nav=[...document.querySelectorAll('[data-nav]')];
const groups={hero:'research',research:'research',phd:'research',matrex:'research',tools:'tools',exhibits:'exhibits',civic:'civic',ventures:'ventures',kutuhula:'exhibits',teaching:'teaching',record:'teaching',press:'teaching',contact:'teaching'};
if('IntersectionObserver'in window){
  const visible=new Map();
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>visible.set(e.target.id,e.isIntersecting));
    const current=[...document.querySelectorAll('main > section')].find(s=>visible.get(s.id));
    nav.forEach(a=>{if(current&&groups[current.id]===a.dataset.nav)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  },{rootMargin:'-90px 0px -55% 0px'});
  document.querySelectorAll('main > section').forEach(s=>observer.observe(s));
  if(!reduced.matches){
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll('.section-heading,.research-grid,.tools-grid>.tool-card,.event-card,.civic-card,.thesis-block,.matrex-grid,.kutuhula-heading,.about-grid,.story-copy>h2,.story-copy>.chapter-lead').forEach(el=>{el.classList.add('reveal');reveal.observe(el);});
  }
}

// Only this small hero transform follows scroll; other sections reveal once.
const scene=document.querySelector('.hero-scene');
let heroFrame=0,heroTop=scene.offsetTop,heroRange=innerHeight*.26,lastProgress=-1;
const updateHero=()=>{heroFrame=0;const p=Math.min(1,Math.max(0,(scrollY-heroTop+header.offsetHeight)/(heroRange||1)));if(p!==lastProgress){scene.style.setProperty('--hero-progress',p.toFixed(3));lastProgress=p;}};
scene.classList.add('hero-motion');updateHero();
window.addEventListener('scroll',()=>{if(!heroFrame)heroFrame=requestAnimationFrame(updateHero);},{passive:true});
window.addEventListener('resize',()=>{heroTop=scene.offsetTop;heroRange=innerHeight*.26;updateHero();},{passive:true});
