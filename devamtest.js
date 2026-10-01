// Canlar bitti -> reklam -> devam akisi. Kalp sayilari ve sinir dogru mu?
const {chromium}=require('playwright');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:430,height:932}});
const hata=[];p.on('pageerror',e=>hata.push(String(e)));
await p.goto('file:///home/claude/android/snake-escape/www/index.html');
await p.waitForTimeout(1500);
// Sahte kopru: odulu HEMEN ver (reklam sonuna kadar izlenmis gibi)
await p.evaluate(()=>{ window.__adBridge=function(t,a,geri){ geri && geri(); }; });

const r=await p.evaluate(async()=>{
  const bekle=ms=>new Promise(r=>setTimeout(r,ms));
  const st=()=>window.__yk.st();
  const gorunur=id=>{const e=document.getElementById(id);
    return !!e && e.style.display!=='none' && !!e.offsetParent;};
  const oldur=async()=>{ // 3 kez kapali yola bas
    for(let i=0;i<5 && !st().dead0;i++){}
    while(st().hp>0){ window.__yk.loseHeart ? window.__yk.loseHeart() : null; break; }
    return null;
  };
  const adim=[];
  // hp'yi dogrudan dusurup showFail tetikleyemiyoruz; oyunun kendi yolunu kullan
  function olum(){ window.__yk.forceFail ? window.__yk.forceFail() : null; }
  return {yok:true};
});
console.log('ic API yok, dogrudan DOM ile deneyecegiz');
await b.close();})();
