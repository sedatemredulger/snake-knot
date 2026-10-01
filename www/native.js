/* Snake Knot — Android koprusu
   Oyunun kendi kodu HIC DEGISMEDI. Bu dosya, native yetenekler VARSA
   devreye giriyor; yoksa her sey eskisi gibi calisiyor.
   Tarayicida acildiginda hicbir sey yapmaz.

   DURUM: bu dosya gercek bir cihazda HENUZ TEST EDILMEDI. Derleme araclari
   bu ortama kurulamadigi icin (Google sunuculari erisime kapali) yalnizca
   mantik gozden gecirildi. Ilk yapida telefonda dogrulanacak.
*/
(function () {
  'use strict';

  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;   // tarayici: cik
  var P = C.Plugins || {};

  function guvenli(fn) { try { return fn(); } catch (e) { console.warn('[native]', e); } }

  /* ---------- 1) Acilis ekrani ----------
     Capacitor'un acilis ekrani otomatik kapanmiyor (launchAutoHide:false).
     Oyun gercekten hazir olunca kapatiyoruz; boylece beyaz bir an gorunmuyor. */
  function acilisiKapat() {
    guvenli(function () { P.SplashScreen && P.SplashScreen.hide({ fadeOutDuration: 260 }); });
  }
  // DIKKAT: artik oyunun hazir olmasini DEGIL, acilis animasyonunun ilk
  // karesinin BOYANMASINI bekliyoruz (www/acilis.js -> __acilisHazir).
  // O kare native acilis goruntusunun aynisi oldugu icin gecis dikissiz.
  // Once oyunu bekleseydik native ekran animasyonun ustunde kalirdi.
  var bekle = setInterval(function () {
    if (window.__acilisHazir) { clearInterval(bekle); setTimeout(acilisiKapat, 60); }
  }, 40);
  setTimeout(function () { clearInterval(bekle); acilisiKapat(); }, 6000);  // emniyet

  /* ---------- 2) TAM EKRAN ----------
     Durum cubugu (saat, sarj, wifi) tamamen gizleniyor: oyun ekranin
     tamamini kullaniyor. Kullanici yukaridan asagi kaydirinca gecici olarak
     yine gorebiliyor, yani bilgiye erisimi kaybetmiyor.
     Yine de guvenli alan boslugu duruyor — on kamera deligi icin gerekli. */
  guvenli(function () {
    if (!P.StatusBar) return;
    P.StatusBar.setOverlaysWebView({ overlay: true });
    P.StatusBar.hide();
  });
  // Uygulama arka plandan donunce Android durum cubugunu geri getirebiliyor
  guvenli(function () {
    P.App && P.App.addListener('appStateChange', function (d) {
      if (d && d.isActive) guvenli(function () { P.StatusBar && P.StatusBar.hide(); });
    });
  });

  /* ---------- 3) Geri tusu ----------
     Once acik olan katmani kapatir. Oyun ekranindayken tek basista
     cikmaz; iki saniye icinde iki kez basilirsa cikar. */
  var sonBasis = 0;
  guvenli(function () {
    P.App && P.App.addListener('backButton', function () {
      /* KATMANI DOGRUDAN KAPATMAK YETMIYOR.
         Eskiden burada sadece classList.remove('show') vardi. Ayarlar
         ekrani acilirken oyun timerPause() cagiriyor ve HUD ile kontrol
         cubugunu gizliyor; kapatma yollarinin hepsi bunlari GERI ALMAK
         zorunda. Geri tusu bunu yapmayinca:
           - bolum suresi bolum bitene kadar DURUYORDU (kazanma ekraninda
             gercek olmayan, cok kisa bir sure gorunuyordu)
           - HUD ve kontrol cubugu geri gelmiyordu (gorunmez ipucu dugmesi)
         Artik oyunun kendi kapatma fonksiyonunu cagiriyoruz; o yoksa
         eski davranisa dusuyoruz.
         AYRICA: liste 'mainMenu' yaziyordu, HTML'deki kimlik 'mainmenu' —
         yani geri tusu ana menuyu hic kapatmiyordu. */
      var K = window.__kapatKatman || {};
      var menuEl = document.getElementById('menu');
      if (menuEl && menuEl.classList.contains('show')) {
        if (typeof K.menu === 'function') K.menu();
        else menuEl.classList.remove('show');
        return;
      }
      var anaEl = document.getElementById('mainmenu');
      if (anaEl && anaEl.classList.contains('show')) {
        if (typeof K.ana === 'function') K.ana();
        else anaEl.classList.remove('show');
        return;
      }
      var katmanlar = ['levelPick', 'ad'];
      for (var i = 0; i < katmanlar.length; i++) {
        var el = document.getElementById(katmanlar[i]);
        if (el && el.classList.contains('show')) { el.classList.remove('show'); return; }
      }
      var simdi = Date.now();
      if (simdi - sonBasis < 2000) { guvenli(function () { P.App.exitApp(); }); }
      else { sonBasis = simdi; }
    });
  });

  /* ---------- 4) Titresim ----------
     WebView'da navigator.vibrate her cihazda calismiyor; native'e baglaniyoruz.
     Oyunun kendi ayari (titresim ac/kapa) zaten cagriyi yapip yapmamaya karar
     veriyor, burada sadece cagrinin gittigi yer degisiyor. */
  guvenli(function () {
    if (!P.Haptics) return;
    var eski = navigator.vibrate && navigator.vibrate.bind(navigator);
    navigator.vibrate = function (ms) {
      var sure = Array.isArray(ms) ? ms[0] : ms;
      guvenli(function () {
        if (sure >= 40) P.Haptics.impact({ style: 'MEDIUM' });
        else            P.Haptics.impact({ style: 'LIGHT' });
      });
      return true;
    };
    window.__vibrateEski = eski;
  });

  /* ---------- 5) Reklam ----------
     Oyunun showAd() akisi duruyor. Native reklam HAZIRSA onu gosteriyoruz,
     gosterilemezse oyunun kendi (benzetim) ekranina dusuyoruz — yani reklam
     yuklenemezse oyun ASLA kilitlenmez.

     GERCEK reklam birimleri (Duka Games / Snake Knot).

     TEST_MODU: true iken gercek reklam kimlikleri kullanilir ama GOSTERILEN
     reklam Google'in test reklamidir; hicbir gosterim/tiklama sayilmaz.
     false iken gercek reklam istegi gider.

     SU ANKI DEGER: false. (Emre, 4 Eylul — 2.2.3)

     TARIHCE, cunku bu satir iki kez degisti ve gerekcesi onemli:
       - 2.2.0 / 2.2.1: false. Hicbir reklam gelmedi. Sebep kodda degildi;
         AdMob, uygulama bir magazaya baglanip incelenmeden reklam yayinina
         sinir koyuyor ve magaza baglama ancak PRODUCTION'dan sonra
         yapilabiliyor (panelde "after release" yaziyor). Panelde
         Requests = 0 gorunmesinin sebebi buydu.
       - 2.2.2 (yayinlanmadi): true yapildi. Amac odullu reklam akisini
         kapali testte deneyebilmekti.
       - 2.2.3: tekrar false. Cunku 2.2.1 yayindayken — yani TEST_MODU
         false iken — telefonlarda "Test Ad" etiketli reklamlar gelmeye
         BASLADI. Hem Emre'nin hem de AdMob test cihazi olarak KAYITLI
         OLMAYAN Esra'nin telefonunda. Demek ki istekler AdMob tarafinda
         kendiliginden test olarak isaretleniyor. Sebebi dogrulanmadi;
         uygulamanin henuz incelenmemis olmasiyla ilgili oldugu tahmin
         ediliyor ama KANITLANMIS DEGIL.
         Test reklami zaten geldigine gore true yapmanin bir kazanci yok;
         tek etkisi production'a yanlislikla true gitme riski.

     >>> PRODUCTION'A CIKARKEN false OLDUGU DOGRULANACAK. <<<
     true kalirsa gelir SIFIR olur ve bunu hicbir hata mesaji soylemez.
     Surum kontrol listesinde zorunlu madde. */
  var TEST_MODU = false;   // Istekler AdMob tarafinda zaten test olarak isaretleniyor.

  var REKLAM = {
    test:  TEST_MODU,
    gecis: 'ca-app-pub-8166678752672055/4419535776',
    odul:  'ca-app-pub-8166678752672055/8350102578'
  };

  var admobHazir = false;
  var reklamVerilebilir = true;   // UMP sonucuna gore guncelleniyor

  /* ---- ADIM IZI ----
     AdMob panelinde "Requests 0" gorunuyorsa iki bambaska sebep olabilir:
       (a) istek AdMob'a hic GITMIYOR   -> kurulum/baslatma sorunu, bizde
       (b) istek gidiyor, reklam DONMUYOR -> No fill / uygulama onayi, Google'da
     Panel ikisini ayirt etmiyor. Bu iz her adimi kaydediyor; tani ekrani
     bunu basiyor, boylece hangisi oldugu telefonda goruluyor. */
  var iz = { eklenti:!!P.AdMob, onay:'-', init:'-', istek:0, hazirla:'-', son:'-' };
  window.__adIz = iz;

  /* --- 5a) ONAY (UMP / GDPR) ---
     AEA, Birlesik Krallik ve Isvicre'de kisisellestirilmis reklam gostermek
     icin onay almak ZORUNLU. Google bunu UMP ile cozuyor.

     Sira onemli: onay akisi AdMob.initialize()'DAN ONCE bitmeli, yoksa
     onay alinmadan reklam istegi gidebilir.

     Onay mesaji AdMob panelinde tanimlanana kadar isConsentFormAvailable
     false doner ve bu blok sessizce atlanir — yani mesaj kurulmadan da
     uygulama calisir, sadece form gorunmez. */
  /* ZAMAN ASIMI SARMALAYICISI. (Monoblock'tan alindi, 5 Eylul)
     ESKI HAL: onay akisi ve initialize ciplakti — yalnizca .catch() vardi.
     .catch bir sozun REDDEDILMESINDE calisir; ASKIDA KALMASINDA calismaz.
     Native taraf cevap vermezse zincir sonsuza kadar bekler, admobHazir
     hicbir zaman true olmaz ve reklam SESSIZCE hic gelmez. Hata da vermez,
     panelde de "istek yok" olarak gorunur — teshis edilmesi en zor durum.
     Monoblock'ta bu bastan dogru kurulmus; buraya tasindi.

     Davranis: soz zamaninda cozulurse degeri gecer; reddedilirse ya da
     sure dolarsa 'yedek' degeriyle COZULUR — asla reddetmez. Cagiran taraf
     "bir sekilde devam et" mantigiyla yazildigi icin dogrusu bu. */
  function sureli(soz, ms, yedek, ad) {
    return new Promise(function (coz) {
      var karar = false;
      var saat = setTimeout(function () {
        if (karar) return; karar = true;
        iz.son = 'zaman asimi: ' + ad + ' (' + ms + 'ms)';
        console.warn('[native] zaman asimi', ad, ms);
        coz(yedek);
      }, ms);
      Promise.resolve(soz).then(function (d) {
        if (karar) return; karar = true; clearTimeout(saat); coz(d);
      }, function (e) {
        if (karar) return; karar = true; clearTimeout(saat);
        console.warn('[native] hata', ad, e);
        coz(yedek);
      });
    });
  }

  function onayAkisi() {
    if (!P.AdMob || !P.AdMob.requestConsentInfo) return Promise.resolve();
    return sureli(P.AdMob.requestConsentInfo({ tagForUnderAgeOfConsent: false }),
                  8000, null, 'requestConsentInfo')
      .then(function (bilgi) {
        window.__gizlilikGerekli =
          bilgi && bilgi.privacyOptionsRequirementStatus === 'REQUIRED';
        if (bilgi && bilgi.isConsentFormAvailable && bilgi.status === 'REQUIRED') {
          // Form kullanicinin okumasini bekliyor; sure genis tutuldu.
          return sureli(P.AdMob.showConsentForm(), 60000, bilgi, 'showConsentForm');
        }
        return bilgi;
      })
      .then(function (sonuc) {
        // canRequestAds false ise reklam ISTEGI BILE gonderilmemeli
        if (sonuc && sonuc.canRequestAds === false) reklamVerilebilir = false;
      });
  }

  guvenli(function () {
    if (!P.AdMob) { iz.init = 'AdMob eklentisi yok'; return; }
    onayAkisi().then(function () {
      iz.onay = reklamVerilebilir ? 'tamam' : 'reklam yasak (canRequestAds=false)';
      // initialize da sarmalandi: askida kalirsa admobHazir hic true olmuyordu.
      return sureli(P.AdMob.initialize({ initializeForTesting: REKLAM.test }),
                    10000, '__zamanasimi__', 'initialize');
    }).then(function (sonuc) {
      if (sonuc === '__zamanasimi__') {
        /* Baslatma cevap vermedi. admobHazir'i YINE DE acmiyoruz: acarsak
           her reklam istegi bos yere gidip yedek yola dusurur. Tani ekrani
           sebebi yaziyor. */
        iz.init = 'CEVAP YOK (10 sn)';
        return;
      }
      admobHazir = true; iz.init = 'tamam';
    }).catch(function (e) {
      iz.init = 'HATA: ' + kisaHata(e);
      console.warn('[native] AdMob baslatilamadi', e);
    });
  });

  // Hata nesnelerinin sekli eklentiye gore degisiyor; hepsinden okunabilir
  // tek satir cikaran ortak yardimci.
  function kisaHata(e) {
    try {
      var g = (e && e.sebep !== undefined) ? e.sebep : e;
      if (g == null) return 'bos';
      if (typeof g === 'string') return g;
      return g.message || g.errorMessage || (g.code !== undefined ? ('kod ' + g.code) : JSON.stringify(g));
    } catch (x) { return 'okunamadi'; }
  }

  /* Gizlilik tercihleri satiri: kullanicinin kararini SONRADAN
     degistirebilmesi gerekiyor (Google'in sarti). Ayarlar sayfasindaki
     baglanti listesine ekliyoruz. Liste bulunamazsa sessizce vazgeciyor. */
  function gizlilikSatiriEkle() {
    if (!window.__gizlilikGerekli) return;
    var yer = document.querySelector('#menu .setlinks');
    if (!yer || document.getElementById('gizlilikBtn')) return;
    var b = document.createElement('button');
    b.id = 'gizlilikBtn';
    b.className = 'ghost';
    b.textContent = 'Privacy options';
    b.addEventListener('click', function () {
      guvenli(function () { P.AdMob.showConsentForm(); });
    });
    yer.appendChild(b);
  }
  setTimeout(gizlilikSatiriEkle, 3000);

  /* Olay dinleyicisi kurma. addListener'in donus SEKLI ortama gore
     degisiyor: bazen dogrudan tutamac, bazen tutamaci veren bir Promise.
     Tip tanimlari Promise diyor ama cihazda dogrudan tutamac donuyor —
     ".then is not a function" hatasi tam olarak buydu. Ikisini de kabul et.
     Once odulDene icinde yereldi; gecis reklami da ihtiyac duyunca
     disari alindi. */
  function dinleyiciKur(kutu, olay, fn) {
    var h;
    try { h = P.AdMob.addListener(olay, fn); }
    catch (e) { console.warn('[native] dinleyici kurulamadi', olay, e); return; }
    if (h && typeof h.then === 'function') {
      h.then(function (t) { kutu.push(t); }).catch(function () {});
    } else if (h) { kutu.push(h); }
  }
  function dinleyicileriBirak(kutu) {
    kutu.forEach(function (h) { if (h && h.remove) guvenli(function () { h.remove(); }); });
    kutu.length = 0;
  }

  /* --- 5b) Reklam gosterme --- */
  /* GECIS REKLAMI — ARTIK KAPANMA OLAYI BEKLENIYOR.
     ESKI HAL: prepareInterstitial().then(showInterstitial()).then(coz)
     Yalnizca soz zincirine guveniyorduk. showInterstitial() bazi
     surumlerde reklam GOSTERILDIGINDE cozuluyor, KAPANDIGINDA degil.
     O durumda cagiran taraf (loadLevel) reklam hala ekrandayken calisiyor;
     oyuncu reklami kapattiginda kendini yeni bolumun ortasinda buluyor.
     Odullu reklamda kapanma olayini zaten dinliyorduk, geciste
     dinlemiyorduk — bosluk buradaydi.
     NOT: bu duzeltme, testciden gelen "birkac hamle yapinca reklam cikti"
     bildirimi HENUZ DOGRULANMADAN eklendi. Kapanmayi beklemek her halukarda
     dogru davranis oldugu icin zararsiz; ama sorunun sebebinin bu oldugu
     KANITLANMIS DEGIL. Emre'nin acikamasi da makul: reklam yuklemesi
     gecikmis olabilir (oyun cevrimdisi calisiyor, reklam calismiyor). */
  function gecisReklami() {
    return new Promise(function (coz, hata) {
      if (!admobHazir || !reklamVerilebilir || !P.AdMob) {
        iz.son = 'hazir degil (admobHazir=' + admobHazir + ' reklamVerilebilir=' + reklamVerilebilir + ')';
        return hata('hazir degil');
      }
      var karar = false, gosterildi = false, dinleyiciler = [], saat = null;
      function bitir() {
        if (karar) return; karar = true;
        dinleyicileriBirak(dinleyiciler); clearTimeout(saat); coz();
      }
      function patla(e) {
        if (karar) return; karar = true;
        dinleyicileriBirak(dinleyiciler); clearTimeout(saat);
        iz.son = kisaHata(e); hata(e);
      }
      dinleyiciKur(dinleyiciler, 'onInterstitialAdShowed', function () { gosterildi = true; });
      // Kapanma: bu olay geldiginde reklam GERCEKTEN ekrandan kalkmistir.
      dinleyiciKur(dinleyiciler, 'onInterstitialAdDismissed', function () { setTimeout(bitir, 120); });
      dinleyiciKur(dinleyiciler, 'onInterstitialAdFailedToLoad', function (e) { patla(e || 'yuklenemedi'); });
      dinleyiciKur(dinleyiciler, 'onInterstitialAdFailedToShow', function (e) { patla(e || 'gosterilemedi'); });

      /* EMNIYET SUPABI: kapanma olayi hic gelmezse akis asili kalmamali,
         yoksa oyuncu bolum gecisinde kilitlenir. Yukleme icin 20 sn;
         reklam gosterildikten sonra 90 sn (en uzun video bile biter). */
      saat = setTimeout(function () {
        if (gosterildi) bitir(); else patla('zaman asimi (yukleme, 20 sn)');
      }, 20000);

      iz.istek++; iz.hazirla = 'gecis gonderildi';
      P.AdMob.prepareInterstitial({ adId: REKLAM.gecis, isTesting: REKLAM.test })
        .then(function () {
          iz.hazirla = 'gecis YUKLENDI';
          clearTimeout(saat);
          saat = setTimeout(function () { bitir(); }, 90000);
          return P.AdMob.showInterstitial();
        })
        .then(function () {
          /* showInterstitial cozuldu — ama bu "kapandi" demek olmayabilir.
             Kapanma olayini bekliyoruz; gelmezse 90 sn'lik supap devreye
             girer. Olay zaten geldiyse bitir() tekrar cagrilsa da 'karar'
             bayragi yuzunden etkisiz. */
          gosterildi = true;
        })
        .catch(patla);
    });
  }

  /* ODULLU reklam.
     showRewardVideoAd() yalnizca kullanici odulu HAK EDINCE cozuluyor.
     Reklami erken kapatirsa hicbir sey cozulmuyor — bu yuzden 'Dismissed'
     olayini da dinleyip "odul yok" olarak sonuclandiriyoruz, aksi halde
     soz burada asili kalirdi.

     GOOGLE'IN RESMI TEST BIRIMI: gercek birim hata verirse, TEST_MODU
     acikken bir kez de Google'in test birimiyle deniyoruz. Amac teshis:
        test birimi CALISIYOR  -> kod dogru, sorun bizim reklam birimimizde
                                  (yeni acilmis birimler bir sure reklam vermiyor)
        test birimi de PATLIYOR -> sorun kodda ya da kurulumda
     Yayin surumunde (TEST_MODU=false) bu yedek deneme hic calismiyor. */
  var GOOGLE_TEST_ODUL = 'ca-app-pub-3940256099942544/5224354917';

  function odulDene(adId) {
    return new Promise(function (coz, hata) {
      if (!P.AdMob) return hata({ gosterildi: false, sebep: 'AdMob eklentisi yok' });
      var karar = false, gosterildi = false, oduluAldi = false, dinleyiciler = [];

      /* addListener'in donus SEKLI ortama gore degisiyor: bazen dogrudan
         tutamac (PluginListenerHandle), bazen tutamaci veren bir Promise.
         Tip tanimlari Promise diyor ama cihazda dogrudan tutamac donuyor —
         ".then is not a function" hatasi tam olarak buydu. Ikisini de kabul et. */
      // Ortak yardimcilar (yukarida tanimli) — tekrar kod yazilmiyor
      function dinle(olay, fn) { dinleyiciKur(dinleyiciler, olay, fn); }
      function temizle() { dinleyicileriBirak(dinleyiciler); }
      function bitir(aldi) { if (karar) return; karar = true; temizle(); coz(aldi); }
      function patla(e)    { if (karar) return; karar = true; temizle();
                             iz.son = kisaHata(e);
                             hata({ gosterildi: gosterildi, sebep: e }); }

      dinle('onRewardedVideoAdShowed',  function () { gosterildi = true; });
      dinle('onRewardedVideoAdReward',  function () { oduluAldi = true; });
      dinle('onRewardedVideoAdDismissed', function () {
        // Kapanista karar: odul olayi geldiyse ver, gelmediyse verme.
        setTimeout(function () { bitir(oduluAldi); }, 250);
      });
      dinle('onRewardedVideoAdFailedToLoad', function (err) { patla(err || 'yuklenemedi'); });
      dinle('onRewardedVideoAdFailedToShow', function (err) { patla(err || 'gosterilemedi'); });

      // Reklam hic cevap vermezse akis asili kalmasin (yalnizca YUKLEME icin)
      var saat = setTimeout(function () { patla('zaman asimi (20 sn)'); }, 20000);

      iz.istek++; iz.hazirla = 'gonderildi (' + adId.slice(-8) + ')';
      P.AdMob.prepareRewardVideoAd({ adId: adId, isTesting: REKLAM.test })
        .then(function () { clearTimeout(saat); iz.hazirla = 'YUKLENDI'; return P.AdMob.showRewardVideoAd(); })
        .then(function () { oduluAldi = true; bitir(true); })
        .catch(function (e) {
          clearTimeout(saat);
          /* KRITIK: reklam GOSTERILDIYSE bu bir hata degil.
             showRewardVideoAd bazi cihazlarda kullanici reklami kapatinca
             reddediyor. Bunu "gosterilemedi" sayip yeniden denersek oyuncuya
             ikinci bir reklam izletiyoruz ve ODULU IKI KEZ veriyoruz —
             telefonda tam olarak bu oldu, ipucu 2'den 4'e cikti.
             Gosterildiyse sonucu odul olayina gore veriyoruz. */
          if (gosterildi) { setTimeout(function () { bitir(oduluAldi); }, 300); return; }
          patla(e);
        });
    });
  }

  function odulReklami() {
    if (!admobHazir || !reklamVerilebilir || !P.AdMob) {
      iz.son = 'hazir degil (admobHazir=' + admobHazir + ' reklamVerilebilir=' + reklamVerilebilir + ')';
      return Promise.reject({ gosterildi: false, sebep: 'hazir degil' });
    }
    return odulDene(REKLAM.odul).catch(function (h) {
      /* Yeniden deneme YALNIZCA hicbir reklam gosterilmediyse.
         Tani anahtari acikken de calisiyor: "bizim birim mi bozuk, kod mu"
         sorusunu ayirt eden tek olcum bu. Siradan oyuncuda anahtar kapali
         oldugu icin bu yol hic isletilmez. */
      if ((!TEST_MODU && !window.__taniAcik) || (h && h.gosterildi)) throw h;
      window.__odulHata1 = h && h.sebep;
      return odulDene(GOOGLE_TEST_ODUL).then(function (r) {
        window.__odulGoogleCalisti = true;
        return r;
      });
    });
  }

  /* Oyun showAd() icinde window.__adBridge'e bakiyor (yap.js kancasi).
     'tur' parametresi oyunun kendi kapsaminda hesaplaniyor:
        'odul'  -> ipucu / geri al / yeniden baslat  (kullanici istedi)
        'gecis' -> bolum arasi reklam

     ONEMLI: odullu reklamda geri() SADECE odul hak edilirse cagriliyor.
     Kullanici reklami yarida kapatirsa hak vermiyoruz — hem AdMob
     politikasi bunu gerektiriyor hem de yarim izlemeye odul vermek
     odullu reklamin gelirini dusuruyor. */
  /* TANI EKRANI — yalnizca TEST_MODU acikken.
     Reklam neden gosterilemedi sorusunun cevabi normalde sadece cihazin
     gunluklerinde (logcat) duruyor ve oraya ulasmak icin USB gerekiyor.
     Test surumunde hatayi dogrudan ekrana basiyoruz ki telefonu kabloya
     baglamadan da teshis edebilelim. Yayin surumunde (TEST_MODU=false)
     bu fonksiyon hicbir sey yapmiyor. */
  function taniGoster(nereden, e) {
    /* ESKIDEN: if (!TEST_MODU) return;
       Yayin surumunde TEST_MODU false oldugu icin tani tam ihtiyac
       duydugumuz anda kapaniyordu. Artik ayarlardaki gizli anahtara bagli
       (ayarlar basligina 5 kez dokun). Siradan oyuncu hicbir sey gormez. */
    if (!TEST_MODU && !window.__taniAcik) return;
    guvenli(function () {
      var k = document.createElement('div');
      k.setAttribute('style',
        'position:fixed;left:8px;right:8px;bottom:8px;z-index:100000;' +
        'background:#123A3C;color:#DCEFEA;font:12px/1.45 monospace;' +
        'padding:10px 12px;border-radius:10px;white-space:pre-wrap;' +
        'box-shadow:0 6px 24px rgba(0,0,0,.35)');
      var mesaj = kisaHata(e);
      var ek = '\n\nADIM IZI' +
        '\n  eklenti : ' + (iz.eklenti ? 'var' : 'YOK') +
        '\n  onay    : ' + iz.onay +
        '\n  init    : ' + iz.init +
        '\n  istek   : ' + iz.istek + ' adet gonderildi' +
        '\n  hazirla : ' + iz.hazirla +
        '\n  son hata: ' + iz.son;
      if (window.__odulHata1 !== undefined) {
        var m1 = window.__odulHata1;
        try { m1 = (m1 && (m1.message || m1.errorMessage || m1.code)) || String(m1); } catch (x) {}
        // DIKKAT: burada '=' vardi ve adim izini eziyordu. '+=' olmali.
        ek += '\n\nCAPRAZ KONTROL' +
              '\n  bizim birim : ' + m1 +
              '\n  google test : ' + (window.__odulGoogleCalisti ? 'CALISTI' : 'o da patladi');
      }
      k.textContent = 'TANI (' + nereden + ')\n' + mesaj + ek +
        '\nadmobHazir=' + admobHazir + '  reklamVerilebilir=' + reklamVerilebilir;
      document.body.appendChild(k);
      k.addEventListener('click', function () { k.remove(); });
      // 12 sn kisaydi: ekrani okuyup not almaya yetmiyordu. Dokununca da kapaniyor.
      setTimeout(function () { k.remove(); }, 30000);
    });
  }

  /* Reklam yuklenirken oyuncu dugmeye tekrar basabiliyor ve her basis
     yeni bir reklam kuyruga sokuyor. Ayni anda tek reklam. */
  var reklamAcik = false;

  window.__adBridge = function (baslik, alt, geri, yedek, tur, hataGeri) {
    if (reklamAcik) return;
    reklamAcik = true;
    var eskiGeri = geri, eskiYedek = yedek, eskiHata = hataGeri;
    geri  = function () { reklamAcik = false; eskiGeri && eskiGeri(); };
    yedek = function () { reklamAcik = false; eskiYedek && eskiYedek(); };
    var kapat = function () { reklamAcik = false; };
    var hata  = function () { reklamAcik = false; eskiHata && eskiHata(); };
    if (tur === 'odul') {
      odulReklami()
        .then(function (oduluAldi) { if (oduluAldi) geri(); else kapat(); })
        .catch(function (e) {
          /* ODULLU reklam gosterilemedi -> HAK YOK.
             Eskiden yedek() cagirip oyunun benzetim ekranina dusuyorduk ve o
             ekran hakki VERIYORDU. Bu, internetini kapatan oyuncunun butun
             ipucu/devam haklarini bedavaya almasi demekti. Artik yalnizca
             kisa bir bildirim cikiyor. Gecis reklaminda yedek yol duruyor:
             orada oyuncuya verilen bir sey yok, akisin durmamasi onemli. */
          console.warn('[native] odullu reklam gosterilemedi', e);
          taniGoster('odullu', e);
          if (eskiHata) hata(); else yedek();
        });
      return;
    }
    gecisReklami()
      .then(function () { geri && geri(); })
      .catch(function (e) {
        console.warn('[native] reklam gosterilemedi', e);
        taniGoster('gecis', e);
        yedek();
      });
  };

  console.log('[native] Snake Knot koprusu kuruldu');
})();
