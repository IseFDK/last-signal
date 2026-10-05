import {clamp,lerp,range,ease,progressFor,sceneState,beatOpacity} from './math.mjs?v=8b28a8c9dca0';
const root=document.documentElement,body=document.body;
const menu=document.querySelector('#chapter-menu'),openMenu=document.querySelector('.menu-button'),closeMenu=document.querySelector('.close-menu');
let menuOpener=null;
if(menu&&openMenu){openMenu.addEventListener('click',()=>{menuOpener=document.activeElement;if(typeof menu.showModal==='function')menu.showModal();else menu.setAttribute('open','');body.style.overflow='hidden';closeMenu?.focus()});closeMenu?.addEventListener('click',()=>menu.close());menu.addEventListener('click',e=>{if(e.target===menu)menu.close()});menu.addEventListener('close',()=>{body.style.overflow='';menuOpener?.focus({preventScroll:true})});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()))}
const chapters=[...document.querySelectorAll('.chapter')];
if(chapters.length){
 const motionButton=document.querySelector('.motion-button'),label=document.querySelector('.journey-label'),route=document.querySelector('.journey-progress'),stops=[...document.querySelectorAll('.journey-stop')];
 const media=matchMedia('(prefers-reduced-motion: reduce)');let preference=null;
 try{preference=localStorage.getItem('last-signal-motion')}catch{}
 let still=preference==='still'||(preference!=='motion'&&media.matches),textSafety=false,frame=0,metrics=[],active=0,latestProgress=0;
 const cached=chapters.map(el=>({el,heading:el.querySelector('.hero-title,.chapter-heading'),caption:el.querySelector('.hero-caption'),beats:[...el.querySelectorAll('.copy-beat')],nodes:Object.fromEntries(['hero-train','departure-bg','departure-pines','window-world','window-mountains','window-pines','window-moon','ticket-layer','tunnel-vault','tunnel-vanish','tunnel-light','arrival-bg','arrival-pines','arrival-stars','radio-art','tuning-knob','dial-needle','radio-lamp','receiver-wave','dome-art','shutter-left','shutter-right','dome-stars','dawn-bg','dawn-haze'].map(c=>[c,el.querySelector('.'+c)])),wave:el.querySelector('.wave-line')}));
 const css=(el,prop,value)=>{if(el)el.style[prop]=value};
 const transform=(el,value)=>css(el,'transform',value);
 function syncMode(){
  const wasStill=body.classList.contains('still');
  textSafety=parseFloat(getComputedStyle(root).fontSize)>22||(innerHeight<520&&innerWidth<900);
  const effective=still||textSafety;let snapshot=null;
  if(metrics.length&&wasStill!==effective){const old=metrics[active],ending=document.querySelector('#ending');snapshot={index:active,p:progressFor(scrollY,old.top,old.height,innerHeight),endingRelative:scrollY-ending.offsetTop};snapshot.atEnding=snapshot.endingRelative>=-innerHeight*.4}
  body.classList.toggle('still',effective);
  if(effective){cached.forEach(item=>{if(item.caption){item.caption.inert=false;item.caption.style.visibility='visible';item.caption.style.opacity='1'}})}
  motionButton?.setAttribute('aria-pressed',String(effective));
  if(motionButton){motionButton.disabled=textSafety;motionButton.setAttribute('aria-label',textSafety?'Неподвижный режим включён для увеличенного текста или небольшого экрана':effective?'Включить движение иллюстраций':'Остановить движение иллюстраций');motionButton.title=textSafety?'Неподвижный режим для увеличенного текста':effective?'Вернуться к прокрутке с движением':'Читать с неподвижными иллюстрациями'}
  const text=motionButton?.querySelector('.motion-text');if(text)text.textContent=effective?'С движением':'Без движения';measure();
  if(snapshot){const m=metrics[snapshot.index];let target=m.top+Math.max(0,m.height-innerHeight)*snapshot.p;if(snapshot.atEnding)target=document.querySelector('#ending').offsetTop+snapshot.endingRelative;else if(effective&&snapshot.p>=.2){const beat=clamp(Math.floor((snapshot.p-.25)/.245),0,2);target=cached[snapshot.index].beats[beat].getBoundingClientRect().top+scrollY-100}scrollTo({top:target,behavior:'instant'});schedule()}
 }
 function measure(){metrics=chapters.map(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight}));schedule()}

 function applyScene(item,p){const {el,heading,caption,beats,nodes:n,wave}=item,type=el.dataset.scene,state=sceneState(p,type);
  el.dataset.progress=p.toFixed(3);el.style.setProperty('--copy-shade',String(ease(range(p,.12,.23))));
  const headingFade=1-ease(range(p,.1,.29));css(heading,'opacity',headingFade);transform(heading,`translateY(${-p*75}px) scale(${lerp(1,.97,p)})`);css(caption,'opacity',1-ease(range(p,.08,.2)));if(caption){const hidden=p>=.2;caption.inert=hidden;caption.style.visibility=hidden?'hidden':'visible'}
  // Every paragraph remains in document order; only the visual beat follows scroll.
  beats.forEach((beat,j)=>{const opacity=beatOpacity(p,j);css(beat,'opacity',opacity);transform(beat,`translateY(${(1-opacity)*16}px)`);beat.classList.toggle('current',opacity>.7)});
  switch(type){
  case 'departure':transform(n['hero-train'],`translate3d(${state.trainX}%,0,0)`);transform(n['departure-bg'],`scale(${lerp(1.02,1.12,p)}) translateY(${-p*1.8}%)`);transform(n['departure-pines'],`translateX(${-p*8}%)`);break;
  case 'window':transform(n['window-world'],`translateX(${state.moonX}%)`);transform(n['window-mountains'],`translateX(${state.worldX}%)`);transform(n['window-pines'],`translateX(${state.nearX}%)`);transform(n['window-moon'],`translateX(${-p*24}%)`);transform(n['ticket-layer'],`translateY(${p*38}px) rotate(${-11+p*5}deg)`);css(n['ticket-layer'],'opacity',1-range(p,.3,.65));break;
  case 'tunnel':transform(n['tunnel-vault'],`scale(${state.scale})`);transform(n['tunnel-vanish'],`translate(-50%,-50%) scale(${lerp(.6,10,ease(range(p,.6,1)))})`);css(n['tunnel-vanish'],'opacity',lerp(.15,.55,p));css(n['tunnel-light'],'opacity',state.light*.5);if(wave)wave.style.strokeDashoffset=String(2000*(1-state.wave));break;
  case 'arrival':transform(n['arrival-bg'],`scale(${state.zoom})`);transform(n['arrival-pines'],`translateY(${state.foregroundY}%) scale(${lerp(1,1.09,p)})`);css(n['arrival-stars'],'opacity',state.stars*.7);break;
  case 'receiver':transform(n['tuning-knob'],`rotate(${state.dial}deg)`);transform(n['dial-needle'],`translateX(${lerp(-210,140,ease(range(p,.1,.7)))}px)`);css(n['radio-lamp'],'opacity',lerp(.4,1,state.glow));transform(n['radio-art'],`translateY(${p*-15}px) rotate(${-7+p*2}deg) scale(${lerp(1,1.025,p)})`);if(wave)wave.style.strokeDashoffset=String(2000*(1-state.wave));css(n['receiver-wave'],'opacity',lerp(.2,.7,state.glow));break;
  case 'sky':transform(n['shutter-left'],`translateX(${-state.opening*4.4}px)`);transform(n['shutter-right'],`translateX(${state.opening*4.4}px)`);transform(n['dome-art'],`rotate(${state.rotation}deg) scale(${lerp(1,1.06,p)})`);css(n['dome-stars'],'opacity',state.stars);break;
  case 'dawn':transform(n['dawn-bg'],`scale(${state.zoom}) translateY(${-p*1.5}%)`);transform(n['dawn-haze'],`translateX(${state.fogX}%)`);break;
  }
 }
 function update(){frame=0;const y=scrollY,h=innerHeight,effectiveStill=body.classList.contains('still');let idx=0;
  metrics.forEach((m,i)=>{if(y+h*.3>=m.top)idx=i});active=idx;
  if(!effectiveStill){cached.forEach((item,i)=>{const m=metrics[i];if(m.top+m.height>y-h&&m.top<y+h*2){applyScene(item,progressFor(y,m.top,m.height,h))}})}
  const total=Math.max(1,document.querySelector('#ending').offsetTop-h*.4);latestProgress=clamp(y/total);transform(route,`scaleX(${latestProgress})`);
  label.textContent=`0${idx+1} / ${chapters[idx].querySelector('.scene-meta span:last-child').textContent.replace('ПОСЛЕДНИЙ ПОЕЗД / СЕВЕРНОЕ НАПРАВЛЕНИЕ','ПЛАТФОРМА')}`;
  stops.forEach((stop,i)=>{if(i===idx)stop.setAttribute('aria-current','true');else stop.removeAttribute('aria-current')});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 body.classList.add('enhanced');syncMode();
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',syncMode,{passive:true});addEventListener('pageshow',measure);document.fonts?.ready.then(measure);
 new ResizeObserver(()=>measure()).observe(document.querySelector('main'));
 media.addEventListener('change',()=>{if(preference===null){still=media.matches;syncMode()}});
 motionButton?.addEventListener('click',()=>{if(textSafety)return;still=!still;preference=still?'still':'motion';try{localStorage.setItem('last-signal-motion',preference)}catch{}syncMode()});
 document.querySelector('.hero-start')?.addEventListener('click',e=>{if(body.classList.contains('still'))return;e.preventDefault();const m=metrics[0];scrollTo({top:m.top+(m.height-innerHeight)*.32,behavior:media.matches?'instant':'smooth'})});
 document.querySelector('[data-replay]')?.addEventListener('click',()=>{setTimeout(()=>{measure();schedule()},0)});
 window.__lastSignal={getState:()=>({chapter:chapters[active].id,motion:body.classList.contains('still')?'still':'scroll',progress:Number(latestProgress.toFixed(3)),localProgress:chapters[active].dataset.progress||'static',chapters:chapters.length}),refresh:measure};
}
