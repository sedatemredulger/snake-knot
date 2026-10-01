/* Oyunun tek dosyalik HTML'inden Android web paketini uretir.
   Kaynak oyuna HIC DOKUNULMUYOR; butun donusumler burada, tekrarlanabilir.
   Calistir:  node yap.js            (sonra: npx cap sync android)
*/
const fs = require('fs');
const path = require('path');

const KAYNAK = path.join(__dirname, 'kaynak', 'oyun.html');
const HEDEF  = path.join(__dirname, 'www', 'index.html');

let s = fs.readFileSync(KAYNAK, 'utf8');
const kontrol = [];
function uygula(ad, fn) {
  const onc = s;
  s = fn(s);
  const oldu = s !== onc;
  kontrol.push({ad, oldu});
  if (!oldu) throw new Error('DONUSUM UYGULANMADI: ' + ad);   // sessiz basarisizlik olmasin
}

// 1) Google Fonts baglantilarini kaldir — uygulama cevrimdisi calisiyor
uygula('google fonts baglantilari kaldirildi', t =>
  t.replace(/[ \t]*<link[^>]*(fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>\n?/g, '')
   .replace(/[ \t]*<link[^>]*rel="preconnect"[^>]*>\n?/g, ''));

// 2) Govdedeki <title> head'e tasinacak
uygula('title govdeden alindi', t => t.replace(/<title>.*?<\/title>\n?/, ''));

// 3) Yedek yazi tipi zinciri: font dosyasi yoksa cirkin durmasin
const YEDEK = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
uygula('yedek yazi tipi zinciri', t => t
  .replace(/"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif/g, `"Bricolage Grotesque", ${YEDEK}`)
  .replace(/"Bricolage Grotesque", sans-serif/g, `"Bricolage Grotesque", ${YEDEK}`)
  .replace(/"Karla", ui-sans-serif, system-ui, sans-serif/g, `"Karla", ${YEDEK}`)
  .replace(/"Fredoka", "Bricolage Grotesque", sans-serif/g, `"Fredoka", "Bricolage Grotesque", ${YEDEK}`));

// 4) Reklam koprusu kancasi.
//    showAd oyunun ic kapsaminda; disaridan degistirilemiyor. Buraya tek satirlik
//    bir kontrol koyuyoruz: native koprü varsa ona devret, YOKSA ya da HATA VERIRSE
//    oyunun kendi ekranina don. Oyun hicbir kosulda reklam yuzunden kilitlenmez.
uygula('reklam koprusu kancasi', t => t.replace(
  '  function showAd(title, sub, cb){\n    timerPause();',
  `  function showAd(title, sub, cb){
    // --- Android koprusu (www/native.js). Yoksa asagisi aynen calisir. ---
    if (window.__adBridge){
      var __yedek = function(){ showAdIc(title, sub, cb); };
      // ODULLU mu GECIS mi? Karsilastirmayi oyunun KENDI T() degerleriyle
      // yapiyoruz; boylece dort dilde de dogru calisiyor. Metni burada
      // sabit yazsaydik Turkce disinda her sey 'gecis' sayilirdi.
      var __tur = (sub === T('adHint') || sub === T('adUndo') || sub === T('adRestart')
                   || sub === T('adContinue'))
                  ? 'odul' : 'gecis';
      // Odullu reklam gosterilemezse HAK VERMIYORUZ; oyuncuya kisa bir
      // bildirim cikiyor. Yedek (benzetim) ekrani yalnizca gecis reklaminda.
      var __hata = function(){ odulReklamiYok(); };
      try { window.__adBridge(title, sub, cb, __yedek, __tur, __hata); return; }
      catch(e){ showAdIc(title, sub, cb); return; }
    }
    showAdIc(title, sub, cb);
  }
  function showAdIc(title, sub, cb){
    timerPause();`));


// 6) BOLUM SECICI KALDIRILIYOR.
//    Gelistirme icin kaynak oyunda duruyor; UYGULAMADA olmayacak —
//    yoksa oyuncu (ve testciler) dogrudan 1000. bolume atlayabilir.
uygula('bolum secici HTML kaldirildi', t => {
  const bas = t.indexOf('      <div class="devbox">');
  const son = t.indexOf('      <button id="closeMenuBtn"');
  if (bas < 0 || son < 0 || son < bas) throw new Error('devbox sinirlari bulunamadi');
  return t.slice(0, bas) + t.slice(son);
});

// Kaldirilan ogelere bakan kodu korumaya al (yoksa hata firlatir).
uygula('lvlInput cagrilari korundu', t => {
  const eski = "    document.getElementById('lvlInput').value = state.level;";
  const yeni = "    var __li = document.getElementById('lvlInput'); if (__li) __li.value = state.level;";
  const kac = t.split(eski).length - 1;
  if (kac !== 2) throw new Error('lvlInput satiri 2 kez beklenirken ' + kac + ' bulundu');
  return t.split(eski).join(yeni);
});

uygula('goBtn baglantilari korundu', t => t.replace(
  "  document.getElementById('goBtn').addEventListener('click', function(){ goTo(document.getElementById('lvlInput').value); });\n" +
  "  document.getElementById('lvlInput').addEventListener('keydown', function(e){ if (e.key === 'Enter') goTo(this.value); });",
  "  var __gb = document.getElementById('goBtn');\n" +
  "  if (__gb){\n" +
  "    __gb.addEventListener('click', function(){ goTo(document.getElementById('lvlInput').value); });\n" +
  "    document.getElementById('lvlInput').addEventListener('keydown', function(e){ if (e.key === 'Enter') goTo(this.value); });\n" +
  "  }"));


// 7) GUVENLI ALAN: oyunun KENDI .app kuralindaki padding satirini degistiriyoruz.
//    Head'e ayri kural koymak ise yaramiyor — oyunun stil blogu daha sonra
//    geldigi icin onunki kazaniyor. .app height:100svh + box-sizing:border-box
//    oldugu icin bosluk yukseklige EKLENMIYOR, icinde kaliyor.
uygula('guvenli alan .app padding satirinda', t => {
  const eski = '    padding:12px 14px 16px;';
  if (!t.includes(eski)) throw new Error('.app padding satiri bulunamadi');
  return t.replace(eski,
    '    padding: calc(12px + env(safe-area-inset-top))\n' +
    '             calc(14px + env(safe-area-inset-right))\n' +
    '             calc(16px + env(safe-area-inset-bottom))\n' +
    '             calc(14px + env(safe-area-inset-left));');
});

// 5) Tam HTML belgesi + yerel yazi tipleri + guvenli alan
const BAS = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<!-- user-scalable=no: oyunun KENDI yakinlastirmasi var, tarayicininki onunla cakisiyor -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#BFDCD8">
<meta name="color-scheme" content="light dark">
<title>Snake Knot</title>
<link rel="stylesheet" href="fonts/fonts.css">
<style>
  /* Centik, durum cubugu ve alt gezinme cubugu icin guvenli alan.
     Boşluk .app'in kendi padding'ine EKLENIYOR; .app height:100svh ve
     box-sizing:border-box oldugu icin toplam yukseklik BUYUMEZ.
     (Govdeye padding vermek alt kontrol cubugunu ekran disina tasiyordu.) */
  .app{
    padding-top:    calc(12px + env(safe-area-inset-top));
    padding-right:  calc(14px + env(safe-area-inset-right));
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    padding-left:   calc(14px + env(safe-area-inset-left));
  }
  /* Uygulamada metin secimi, uzun basma menusu ve mavi dokunma parlamasi olmasin */
  *{ -webkit-user-select:none; user-select:none; -webkit-touch-callout:none;
     -webkit-tap-highlight-color:transparent; }
</style>
</head>
<body>
`;
const SON = `
<script src="acilis.js"></script>
<script src="native.js"></script>
</body>
</html>
`;

fs.writeFileSync(HEDEF, BAS + s + SON);

// --- Dogrulama ---
const c = fs.readFileSync(HEDEF, 'utf8');
const testler = [
  ['doctype var',            c.startsWith('<!doctype html>')],
  ['google fonts kalmadi',   !/fonts\.(googleapis|gstatic)\.com/.test(c)],
  ['yerel fonts.css',        c.includes('fonts/fonts.css')],
  ['native.js baglandi',     c.includes('src="native.js"')],
  ['acilis.js baglandi',     c.includes('src="acilis.js"')],
  ['acilis native.js ONCE',  c.indexOf('src="acilis.js"') < c.indexOf('src="native.js"')],
  ['reklam kancasi',         c.includes('__adBridge') && c.includes('function showAdIc')],
  ['odul/gecis ayrimi',      c.includes("__tur") && c.includes("T('adHint')")],
  ['odul basarisizlik yolu', c.includes('odulReklamiYok') && c.includes('__hata')],
  ['guvenli alan .app icinde', c.includes('calc(12px + env(safe-area-inset-top))')],
  ['eski sabit padding YOK',   !c.includes('padding:12px 14px 16px;')],
  ['bolum paketi duruyor',   c.includes('LEVEL_PACK')],
  // NOT: .devbox CSS kurallari stil blogunda kaliyor (olu kod, zararsiz).
  // Onemli olan HTML'in ve baglantilarin olmamasi.
  ['bolum secici YOK',       !c.includes('<div class="devbox">') && !c.includes('data-go=') && !c.includes('id="lvlInput"')],
  ['korumali cagrilar',      c.includes('if (__li)') && c.includes('if (__gb)')],
];
console.log('donusumler:'); kontrol.forEach(k => console.log('  ' + (k.oldu?'OK  ':'HATA') + ' ' + k.ad));
console.log('dogrulama:');  testler.forEach(([a,v]) => console.log('  ' + (v?'OK  ':'HATA') + ' ' + a));
console.log('paket boyutu: ' + (Buffer.byteLength(c)/1048576).toFixed(2) + ' MB');
if (testler.some(t => !t[1])) process.exit(1);
