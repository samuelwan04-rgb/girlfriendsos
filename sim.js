/* GIRLFRIENDSOS simulator: node sim.js [trials]
   Makes a pretend Rinis with hidden tastes, lets her secretly want one dish, has her answer Momo's
   questions the way a person would (with some noise), and checks whether Momo lands on it. */
const DATA=require('./data.js'), B=require('./brain.js');
const {DISHES,CUISINES}=DATA;
const N=+process.argv[2]||20000;

let seed=42;
const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=(items,w)=>{const tot=w.reduce((a,b)=>a+b,0);let r=rnd()*tot;for(let i=0;i<items.length;i++){r-=w[i];if(r<=0)return items[i]}return items[items.length-1]};
const gauss=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(2*Math.PI*rnd());

const ASIAN=CUISINES.asian.map(c=>c.id), ANGMOH=CUISINES.angmoh.map(c=>c.id);
const AREA_W={school:.33,west:.22,home:.22,sengkang:.12,east:.07,central:.04};
const BUDGET_W={sengkang:[.35,.35,.2,.1],school:[.5,.35,.1,.05],west:[.55,.3,.1,.05],home:[.4,.4,.15,.05],east:[.1,.2,.3,.4],central:[.2,.3,.3,.2]};
const TIERS=[7,10,15,20];

function persona(){const t={};for(const d of DISHES)t[d.id]=Math.exp(.5*gauss());return t}
function hourOfDay(){return pick([[12,13,14],[18,19,20],[15,16,17],[22,23,0],[8,9,10]],[.35,.33,.14,.1,.08])[Math.floor(rnd()*3)]}

// What she secretly wants today
function trueDish(taste,loc,H,cap,hour){return pick(DISHES,trueWeights(taste,loc,H,cap,hour))}
function trueWeights(taste,loc,H,cap,hour){
  const ctx={hour,now:0,history:[]};
  return DISHES.map(d=>{
    const {lo,sp}=B.priceAt(d,loc);
    const avail=sp.length?Math.max(...sp.map(o=>o.w)):B.areaHasSpots(loc)?.12:1;
    const afford=lo<=cap*1.03||cap>=20?1:.03;
    const time=B.baseScore(d,{loc:null,hunger:H,budget:20},ctx)/B.baseScore(d,{loc:null,hunger:H,budget:20},{...ctx,hour:13}); // time-of-day part only
    return d.p*taste[d.id]*Math.pow(d.fit[H],2)*avail*afford*time;
  });
}
// Ceilings: a mind-reader who knows her tastes and true hunger/budget, and one who knows everything but her tastes
function ceilings(n){
  let mind1=0,mind3=0,blind1=0;
  const flat={};for(const d of DISHES)flat[d.id]=1;
  for(let i=0;i<n;i++){
    const taste=persona(), loc=pick(Object.keys(AREA_W),Object.values(AREA_W));
    const H=pick(['meal','between','snack'],[.45,.3,.25]), cap=pick(TIERS,BUDGET_W[loc]), hour=hourOfDay();
    const w=trueWeights(taste,loc,H,cap,hour), d=pick(DISHES,w);
    const q=answer(d,H,cap,loc), ok=DISHES.map(x=>B.inPool(x,q)?1:0);   // only what fits her cuisine answer
    const order=w.map((x,i)=>[x*ok[i],i]).sort((a,b)=>b[0]-a[0]).map(x=>DISHES[x[1]].id);
    if(order[0]===d.id)mind1++; if(order.slice(0,3).includes(d.id))mind3++;
    const wb=trueWeights(flat,loc,H,cap,hour).map((x,i)=>x*ok[i]); if(DISHES[wb.indexOf(Math.max(...wb))].id===d.id)blind1++;
  }
  console.log(`Mind-reader (knows her tastes)     hit@1 ${(100*mind1/n).toFixed(0)}%   top-3 ${(100*mind3/n).toFixed(0)}%`);
  console.log(`Knows hunger+budget, not tastes    hit@1 ${(100*blind1/n).toFixed(0)}%   (no vibe check)`);
}

// How she answers Momo
function answer(d,H,cap,loc){
  const q={loc,hunger:H,budget:cap,mood:{},nah:new Set()};
  const isSnacky=d.cu.includes('sw')&&H==='snack';
  if(rnd()<.12) q.side='any';
  else if(isSnacky&&rnd()<.7) q.side='snack';
  else { const a=d.cu.find(c=>ASIAN.includes(c)), w=d.cu.find(c=>ANGMOH.includes(c));
    if(a&&(!w||rnd()<.5)){q.side='asian';q.cu=rnd()<.12?'any':a} else if(w){q.side='angmoh';q.cu=rnd()<.12?'any':w} else q.side='snack'; }
  if(q.side==='snack') q.hunger='snack';
  else { const r=rnd(); if(r<.15) q.hunger='dunno'; else if(r<.25) q.hunger=pick(['meal','between','snack'].filter(x=>x!==H),[1,1]); }
  return q;
}
const DIAG={shown:0,loved:0,n:0};
function vibe(q,d,taste,ctx,locKnown){
  const listQ=locKnown?q:{...q,loc:null};
  const k=q.side==='any'||q.cu==='any'||q.side==='snack'?B.P.vibeListBroad:B.P.vibeList;
  const shown=B.rank(listQ,ctx,false).slice(0,k).map(r=>r.d);
  DIAG.n++; if(shown.some(s=>s.id===d.id)) DIAG.shown++;
  if(rnd()<.3) return; // skipped the vibe check
  for(const s of shown){
    if(s.id===d.id){ if(rnd()<.75) q.mood[s.id]='love'; continue; }
    const t=taste[s.id];
    if(rnd()<clamp(.05+.2*(t-1),0,.35)) q.mood[s.id]='love';
    else if(t<.8&&rnd()<.15) q.mood[s.id]='nope';
  }
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function run(label,{vibeOn=true,locKnown=false,days=1,personas=N,setup}={}){
  const saved={...B.P}; if(setup) setup(B.P);
  let n=0,h1=0,h3=0,inPicks=0,topWhenIn=0; const cal={};
  const byLoc={};
  for(let p=0;p<personas;p++){
    const taste=persona(); const history=[];
    for(let day=0;day<days;day++){
      const loc=pick(Object.keys(AREA_W),Object.values(AREA_W));
      const H=pick(['meal','between','snack'],[.45,.3,.25]);
      const cap=pick(TIERS,BUDGET_W[loc]);
      const hour=hourOfDay();
      const d=trueDish(taste,loc,H,cap,hour);
      const ctx={hour,now:day*864e5,history};
      const q=answer(d,H,cap,loc);
      if(vibeOn) vibe(q,d,taste,ctx,locKnown);
      const v=B.verdict(q,ctx);
      const hit1=v[0]&&v[0].d.id===d.id, hit3=v.some(r=>r.d.id===d.id);
      // calibration among days where the right dish made the shortlist (the percentages only split the shortlist)
      if(hit3){ const bucket=Math.min(90,Math.floor(v[0].pct/10)*10);
        (cal[bucket]??={n:0,hit:0}).n++; if(hit1) cal[bucket].hit++; }
      (byLoc[loc]??={n:0,h1:0,h3:0}).n++; if(hit1) byLoc[loc].h1++; if(hit3) byLoc[loc].h3++;
      if(days===1||day>=days-10){ n++; h1+=hit1; h3+=hit3; if(hit3){inPicks++; topWhenIn+=v[0].pct} }
      if(hit3) history.push({id:d.id,t:day*864e5}); // she taps "I'm eating this"
    }
  }
  Object.assign(B.P,saved);
  const pc=x=>(100*x).toFixed(0).padStart(3)+'%';
  console.log(`${label.padEnd(34)} hit@1 ${pc(h1/n)}   in picks ${pc(h3/n)}`);
  return {h1:h1/n,h3:h3/n,cal,byLoc};
}

if(process.argv[3]==='tune'){
  const best=[];
  for(const love of [2.4,4,6,10]) for(const spotHere of [2.2,4]) for(const spotElsewhere of [.35,.15]) for(const learnRate of [.15,.4])
    best.push({love,spotHere,spotElsewhere,learnRate,...run(`love ${love} here ${spotHere} else ${spotElsewhere} learn ${learnRate}`,{days:10,personas:N/10,setup:P=>Object.assign(P,{love,spotHere,spotElsewhere,learnRate,learnCap:learnRate>.2?2.5:1.6})})});
  best.sort((a,b)=>(b.h1+b.h3)-(a.h1+a.h3)); console.log('best',best.slice(0,3).map(b=>JSON.stringify({love:b.love,spotHere:b.spotHere,spotElsewhere:b.spotElsewhere,learnRate:b.learnRate,h1:b.h1.toFixed(3),h3:b.h3.toFixed(3)})));
  process.exit();
}
if(require.main===module){
  DIAG.shown=DIAG.n=0;
  console.log(`\n${N} simulated days, random pretend-Rinis each time\n`);
  const full=run('Full Momo (location asked last)');
  console.log(`  (right dish was on the vibe-check list ${(100*DIAG.shown/DIAG.n).toFixed(0)}% of the time)`);
  ceilings(N);
  run('  without vibe check',{vibeOn:false});
  run('  if location were asked first',{locKnown:true});
  run('  ignoring her spots',{setup:P=>{P.spotHere=1;P.spotElsewhere=1}});
  run('Same Rinis, days 1-10',{days:10,personas:N/10});
  run('Same Rinis, days 51-60 (learning)',{days:60,personas:N/20});
  console.log('\nBy location (full):');
  for(const [k,v] of Object.entries(full.byLoc)) console.log(`  ${k.padEnd(8)} hit@1 ${(100*v.h1/v.n).toFixed(0)}%  in picks ${(100*v.h3/v.n).toFixed(0)}%  (${v.n} days)`);
  console.log('\nCalibration: when Momo says X% for her top pick, how often is it right?');
  for(const [k,v] of Object.entries(full.cal).sort((a,b)=>a[0]-b[0])) console.log(`  says ${k}-${+k+9}%  →  right ${(100*v.hit/v.n).toFixed(0)}%  (${v.n} days)`);
}
module.exports={run};
if(process.argv[3]==='tune3'){
  for(const a of [1,1.5,2,3]){DIAG.shown=DIAG.n=0;run('spotAnywhere '+a,{setup:P=>P.spotAnywhere=a});console.log(`    list coverage ${(100*DIAG.shown/DIAG.n).toFixed(0)}%`)}
  process.exit();
}
if(process.argv[3]==='tune2'){
  for(const [love,nearFloor,vl,vb] of [[2.4,.45,8,10],[8,.45,8,10],[8,.65,8,10],[8,.8,8,10],[8,.65,10,12],[8,.65,12,14],[8,1,12,14]]){
    DIAG.shown=DIAG.n=0;
    run(`love ${love} near ${nearFloor} list ${vl}/${vb}`,{setup:P=>Object.assign(P,{love,nearFloor,vibeList:vl,vibeListBroad:vb})});
    console.log(`    list coverage ${(100*DIAG.shown/DIAG.n).toFixed(0)}%`);
    run(`    same, no vibe`,{vibeOn:false,setup:P=>Object.assign(P,{love,nearFloor})});
  }
}
