const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
await p.goto('file:///home/claude/android/snake-escape/www/index.html');
await p.waitForTimeout(1600);
await p.evaluate(()=>window.__yk.go(65));
await p.waitForTimeout(1500);
const bilgi=await p.evaluate(()=>{
  const s=window.__yk.st();
  if(s.king){ s.kingMeter=1; }
  // hud'u tazele
  const km=document.getElementById('kingMeter');
  if(s.king){ km.classList.add('show','over'); document.getElementById('kbarFill').style.width='100%'; }
  return {kral:!!s.king, hudGizli:document.querySelector('.hud').classList.contains('hidden'),
          pct:document.getElementById('pctText').textContent};
});
console.log(JSON.stringify(bilgi));
await p.screenshot({path:'/home/claude/hud-tam.png'});
await b.close();})();
