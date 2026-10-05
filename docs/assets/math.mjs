export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a,b,t) => a+(b-a)*t;
export const ease = t => {t=clamp(t); return t*t*(3-2*t)};
export const range = (value, start, end) => clamp((value-start)/(end-start));
export const progressFor = (scrollY, top, height, viewportHeight) => clamp((scrollY-top)/Math.max(1,height-viewportHeight));
export function seeded(seed){let state=seed>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296}}
export function sceneState(p, type){
 p=clamp(p);
 switch(type){
 case 'departure':return {trainX:lerp(34,-95,ease(range(p,.18,.95))),titleY:lerp(0,-32,p),moonY:lerp(0,-11,p),fogX:lerp(0,-12,p)};
 case 'window':return {worldX:lerp(8,-12,p),nearX:lerp(0,-28,p),moonX:lerp(0,-8,p)};
 case 'tunnel':return {scale:lerp(.5,8,ease(p)),light:range(p,.55,.95),wave:range(p,.12,.78),aperture:lerp(7,155,ease(range(p,.64,1)))};
 case 'arrival':return {zoom:lerp(1.03,1.25,p),foregroundY:lerp(0,18,p),stars:1-range(p,.4,.95)};
 case 'receiver':return {dial:lerp(-65,48,ease(range(p,.1,.7))),wave:range(p,.15,.78),glow:range(p,.45,.85)};
 case 'sky':return {opening:lerp(0,100,ease(range(p,.08,.7))),rotation:lerp(-12,8,p),stars:1-range(p,.5,1)};
 case 'dawn':return {zoom:lerp(1.12,1,p),sunY:lerp(20,-10,p),fogX:lerp(-7,8,p)};
 default:return{};
 }
}

export function beatOpacity(p,j){const starts=[.25,.495,.74],ends=[.48,.725,.98];const a=starts[j],b=ends[j];return Math.min(range(p,a-.01,a+.01),1-range(p,b-.01,b+.005))}
