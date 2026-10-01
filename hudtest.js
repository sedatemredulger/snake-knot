const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
await p.goto('file:///home/claude/android/snake-escape/www/index.html');
await p.waitForTimeout(1400);
// Krali olan bir bolume git ve olceri doldur
await p.evaluate(()=>{ const Y=window.__yk; Y.go(65); });
await p.waitForTimeout(900);
const r=await p.evaluate(()=>{
  const s=window.__yk.st();
  if(!s.king) return {kralYok:true};
  s.kingMeter=1; s.kingLate=true;
  window.__yk.st(); 
  document.getElementById('kbarFill').style.width='100%';
  document.getElementById('kingMeter').classList.add('over');
  const pr=document.getElementById('pctText').getBoundingClientRect();
  const kr=document.getElementById('kingMeter').getBoundingClientRect();
  return {pctSag:Math.round(pr.right), kralSol:Math.round(kr.left),
          aralik:Math.round(kr.left-pr.right), pctMetin:document.getElementById('pctText').textContent};
});
console.log(JSON.stringify(r));
const kutu=await p.evaluate(()=>{const r=document.querySelector('.hud').getBoundingClientRect();
  return {x:Math.max(0,r.x-6),y:Math.max(0,r.y-6),width:Math.min(430,r.width+12),height:r.height+12};});
await p.screenshot({path:'/home/claude/hud-ayrim.png', clip:kutu});
await b.close();})();
