/* GIRLFRIENDSOS scoring. Pure functions, no page code, so the simulator runs the exact same logic.
   q   = her answers: {loc, side, cu, hunger, budget, mood:{dishId:'love'|'nope'}, nah:Set}
   ctx = {hour, now, history:[{id,t}]} */
(function(root){
const DATA = typeof module!=='undefined' ? require('./data.js') : root.GFDATA;
const {DISHES,SPOTS,CUISINES,AREAS} = DATA;
const BYID=Object.fromEntries(DISHES.map(d=>[d.id,d]));
const has=(d,flag)=>d.f.split(' ').includes(flag);

// Tunable knobs (tuned with sim.js)
const P = {
  love:8,            // she tapped it in the vibe check
  spotHere:2.2,      // one of her spots in this area sells it
  spotElsewhere:.35, // area has spots, but none sell this
  spotAnywhere:1.5,  // before she says where she is: one of her spots anywhere sells it
  overTol:1.03,      // allow up to 3% over budget ($7.10 dumplings on a $7 budget)
  overPenalty:.95,
  nearFloor:.65,     // how much a dish far from her usual spend at that budget still counts
  vibeList:10, vibeListBroad:12, // dishes shown in the vibe check
  sharpen:1.5,       // percentages = score^sharpen, normalised
  thirdCut:.3,       // show a 3rd pick only if it scores at least 30% of the top
  learnRate:.15, learnCap:1.6, learnDays:21,
  spotLoose:.7,      // big areas (central, north): the mall Momo knows is only one of many places she could be
  // What Sam told Momo about Rinis
  heavy:.65,         // she doesn't like meals that are too heavy
  heavyStarving:.8,  // ...a bit less of a problem when she's starving
  junkRecent:.45,    // unhealthy is fine, just not too often: each recent junk meal knocks it down
  junkDays:2.5, junkFloor:.4,
  spicyMood:1.5,     // spicy is an occasional mood: tapping a spicy dish lifts the other spicy ones
  spicyOff:.75,      // and saying nah to spicy (without tapping any) pushes them down
  spicyRecent:.8     // had something spicy in the last day or two: less likely again
};

// What she probably expects to spend at each budget answer, scaled by how hungry she is
const SPEND = {7:{t:5.5,s:3}, 10:{t:8,s:4}, 15:{t:12,s:6}, 20:{t:25,s:15}};
const HSCALE = {meal:1, between:.85, snack:.45, dunno:.8};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const spotsFor=(id,area)=>SPOTS.filter(o=>o.dish===id&&o.area===area);
const areaHasSpots=area=>SPOTS.some(o=>o.area===area);

function priceAt(d,area){
  const sp=spotsFor(d.id,area);
  if(!sp.length) return {lo:d.lo,hi:d.hi,sp};
  return {lo:Math.min(...sp.map(o=>o.lo)),hi:Math.max(...sp.map(o=>o.hi)),sp};
}
function inPool(d,q){
  if(q.side==='any') return true;
  if(q.side==='snack') return d.cu.includes('sw');
  const ids=q.cu==='any'||!q.cu?CUISINES[q.side].map(c=>c.id):[q.cu];
  return d.cu.some(c=>ids.includes(c));
}
function hungerFit(d,h){
  const v=h==='dunno'?(.35*d.fit.meal+.4*d.fit.between+.25*d.fit.snack):d.fit[h];
  return Math.pow(.08+.92*v,1.3);
}
function budgetFit(lo,hi,cap,hunger,treat){
  let over=1;
  if(cap<20&&lo>cap){ if(lo>cap*P.overTol) return .04; over=P.overPenalty; }
  const afford=cap>=20||lo>cap?1:.6+.4*clamp((cap-lo)/Math.max(1,hi-lo),0,1);
  const k=HSCALE[hunger]??.8, t=SPEND[cap].t*k, s=SPEND[cap].s*Math.max(.6,k);
  const pay=clamp(t,lo,hi);
  const near=P.nearFloor+(1-P.nearFloor)*Math.exp(-Math.pow((pay-t)/s,2));
  return afford*near*over*(cap>=20&&treat?1.1:1);
}
function timeFit(d,hour){
  const late=hour>=22||hour<4, morning=hour>=5&&hour<11;
  let m=1;
  if(late){ if(d.f.includes('late')) m*=1.3; if(d.f.includes('treat')) m*=.7; if(d.f.includes('morning')&&!d.f.includes('late')) m*=.5; }
  if(morning&&d.f.includes('morning')) m*=1.4;
  return m;
}
function placeFit(d,area,sp){
  if(!area) return SPOTS.some(o=>o.dish===d.id)?P.spotAnywhere:1;
  if(sp.length) return P.spotHere*Math.max(...sp.map(o=>o.w));
  if(!areaHasSpots(area)) return 1;
  if(AREAS.find(a=>a.id===area)?.loose) return P.spotLoose;
  return P.spotElsewhere*(area==='home'?.6+.6*d.tr:1);   // at home she could still order delivery
}
function learnedBoost(id,ctx){
  let s=0;
  for(const e of ctx.history||[]) if(e.id===id) s+=Math.exp(-(ctx.now-e.t)/(P.learnDays*864e5));
  return Math.min(P.learnCap,1+P.learnRate*s);
}
// How recently she ate something with this flag (sum of decaying hits from her "I'm eating" history)
function recent(flag,ctx,days){
  let s=0;
  for(const e of ctx.history||[]){const d=BYID[e.id]; if(d&&has(d,flag)) s+=Math.exp(-(ctx.now-e.t)/(days*864e5))}
  return s;
}
// Spicy mood from the vibe check: +1 tapped a spicy dish, -1 only said nah to spicy ones, 0 no signal
function spiceMood(mood){
  let love=false,nope=false;
  for(const [id,m] of Object.entries(mood||{})){const d=BYID[id]; if(!d||!has(d,'spicy')) continue; if(m==='love') love=true; if(m==='nope') nope=true}
  return love?1:nope?-1:0;
}
// What Sam told Momo about her: not too heavy, junk sometimes
function prefFit(d,q,ctx){
  let m=1;
  if(has(d,'heavy')) m*=q.hunger==='meal'?P.heavyStarving:P.heavy;
  if(has(d,'junk')) m*=Math.max(P.junkFloor,1-P.junkRecent*recent('junk',ctx,P.junkDays));
  return m;
}
// ...and spicy when she's in the mood (mood = her vibe-check taps, or {} before she's answered)
function spiceFit(d,mood,ctx){
  if(!has(d,'spicy')) return 1;
  const sm=spiceMood(mood);
  if(sm>0) return P.spicyMood;
  if(sm<0) return P.spicyOff;
  return recent('spicy',ctx,1.5)>.3?P.spicyRecent:1;
}
function core(d,q,ctx,mood){
  const {lo,hi,sp}=priceAt(d,q.loc);
  return d.p*learnedBoost(d.id,ctx)*hungerFit(d,q.hunger)*budgetFit(lo,hi,q.budget,q.hunger,d.f.includes('treat'))*timeFit(d,ctx.hour)*placeFit(d,q.loc,sp)*prefFit(d,q,ctx)*spiceFit(d,mood,ctx);
}
const baseScore=(d,q,ctx)=>core(d,q,ctx,{});
function score(d,q,ctx){
  const mood=q.mood&&q.mood[d.id];
  if(mood==='nope'||(q.nah&&q.nah.has(d.id))) return 0;
  return core(d,q,ctx,q.mood||{})*(mood==='love'?P.love:1);
}
function rank(q,ctx,withMood=true){
  return DISHES.filter(d=>inPool(d,q)).map(d=>({d,s:withMood?score(d,q,ctx):baseScore(d,q,ctx)})).filter(r=>r.s>0).sort((a,b)=>b.s-a.s);
}
// The vibe-check list: top dishes, plus at least one spicy one so she can say if she's in the mood
function vibeList(q,ctx,k){
  const all=rank(q,ctx,false), list=all.slice(0,k);
  if(!list.some(r=>has(r.d,'spicy'))){const sp=all.find(r=>has(r.d,'spicy')); if(sp&&list.length) list[list.length-1]=sp}
  return list;
}
function verdict(q,ctx){
  const ranked=rank(q,ctx);
  if(!ranked.length) return [];
  const n=ranked.length>2&&ranked[2].s/ranked[0].s>=P.thirdCut?3:Math.min(2,ranked.length);
  const top=ranked.slice(0,n);
  const w=top.map(r=>Math.pow(r.s,P.sharpen)),tot=w.reduce((a,b)=>a+b,0);
  const pct=w.map(x=>Math.max(10,Math.round(x/tot*20)*5));
  pct[0]+=100-pct.reduce((a,b)=>a+b,0);
  pct.sort((a,b)=>b-a);                // rounding can flip near-ties; keep the top pick on top
  return top.map((r,i)=>({...r,pct:pct[i]}));
}
function reasons(d,q,ctx){
  const out=[], h=ctx.hour, {lo,hi,sp}=priceAt(d,q.loc);
  if(q.mood&&q.mood[d.id]==='love') out.push('you said yes to this');
  if(sp.length) out.push(sp.length>1?`${sp.length} of your spots have it`:'one of your spots');
  if(learnedBoost(d.id,ctx)>1.05) out.push("you've been into this lately");
  if(has(d,'spicy')&&spiceMood(q.mood)>0) out.push('spicy, since you\'re in the mood');
  if(!has(d,'heavy')&&q.hunger!=='snack'&&d.fit.meal>=.8) out.push('filling but not too heavy');
  const hv=q.hunger==='dunno'?null:d.fit[q.hunger];
  if(hv>=.8) out.push({meal:'proper full-meal portion',between:'just-right portion',snack:'snacky size'}[q.hunger]);
  if(q.budget>=20&&d.f.includes('treat')) out.push('treat-yourself energy');
  else if(q.budget<20&&hi<=q.budget) out.push(`easily under $${q.budget}`);
  else if(q.budget<20&&lo<=q.budget) out.push(`doable under $${q.budget}`);
  else if(q.budget<20&&lo<=q.budget*P.overTol) out.push(`a few cents over $${q.budget}`);
  if((h>=22||h<4)&&d.f.includes('late')) out.push('supper classic');
  if(h>=5&&h<11&&d.f.includes('morning')) out.push('good morning food');
  return out.slice(0,3);
}

const BRAIN={P,SPEND,priceAt,spotsFor,areaHasSpots,inPool,baseScore,score,rank,vibeList,verdict,reasons};
if(typeof module!=='undefined') module.exports=BRAIN; else root.GFBRAIN=BRAIN;
})(this);
