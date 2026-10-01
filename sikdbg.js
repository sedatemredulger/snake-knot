const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:430,height:932}});
const knsl=[]; p.on('console',m=>knsl.push(m.text())); p.on('pageerror',e=>knsl.push('ERR '+e));
await p.goto('file:///home/claude/android/snake-escape/www/index.html');
await p.waitForTimeout(1400);
await p.evaluate(()=>{ window.__reklam=[];
  window.__adBridge=function(t,alt,geri){ window.__reklam.push(alt); geri&&geri(); }; });
const r=await p.evaluate(async()=>{
  const bekle=ms=>new Promise(r=>setTimeout(r,ms));
  const Y=window.__yk, st=()=>Y.st();
  function tik(){ const s=st(),occ=Y.occ();
    let a=s.snakes.find(x=>!x.done&&!x.wrong&&!Y.canExit(x,occ,s.cols,s.rows,s.blocked));
    if(!a){s.snakes.forEach(x=>x.wrong=false);
      a=s.snakes.find(x=>!x.done&&!Y.canExit(x,occ,s.cols,s.rows,s.blocked));} return a; }
  for(let i=0;i<40&&st().hp>0;i++){ const t=tik(); if(!t)break; Y.tap(t); await bekle(360); }
  await bekle(2200);
  const once=Y.zaman();
  const ayarli=Y.zaman({giris: Date.now()-200000});
  const btn=document.getElementById('nextBtn');
  const gorunur = !!btn.offsetParent;
  btn.click(); await bekle(700);
  return {oncekiGiris:once.giris, ayarliGiris:ayarli.giris, simdi:Date.now(),
          fark:Date.now()-ayarli.giris, btnGorunur:gorunur,
          btnMetin:btn.textContent, reklam:window.__reklam.slice(),
          zamanSon:Y.zaman()};
});
console.log(JSON.stringify(r,null,1));
console.log('konsol:',knsl.slice(-5));
await b.close();})();
