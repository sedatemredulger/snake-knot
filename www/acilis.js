/* Snake Knot — acilis animasyonlari (iki sahne)

   SAHNE 1: DUKA GAMES studyo acilisi
     Amblem beliriyor, kamera 2700 ms boyunca 1.40x'e yaklasiyor, sonra
     altinda patlayan efektle once DUKA (2700 ms) sonra GAMES (2920 ms)
     yaziyor. Kivilcimlar markadan: turkuaz ve sari.
   SAHNE 2: Snake Knot oyun acilisi
     Yilanlar surekli girip cikiyor; yazi kelime kelime buyukten kucuge
     DUSUYOR: Snake / Knot / Escape / Puzzle, aralarinda 180 ms.

   Emre'nin onayladigi degerler (16 Eylul, prototip uzerinde ayarladi):
     yaklasma 2700 ms · olcek 1.40 · DUKA-GAMES arasi 220 ms · patlama 400 ms
     yilan sikligi 120 ms · yilan gecisi 1000 ms · kelime arasi 180 ms ·
     dusme 300 ms

   KURALLAR (eskisinden devralindi, bozulmadi):
   - Animasyon oyunu ASLA bekletmez. Hata olsa da katman en gec EMNIYET'te kalkar.
   - AYRI ATLAMA (Emre, 16 Eylul): "duka girisini ayri oyun giris ekranini
     ayri gecebilsinler". Sahne 1'e dokunmak yalnizca sahne 1'i atlar,
     sahne 2 yine oynar. Tek dokunusla ikisi birden atlanmaz.
   - prefers-reduced-motion: hicbir hareket yok, kisa bir durus ve kararma.
   - Yazi tipi GEREKMEZ: DUKA GAMES egriye cevrilmis vektor, oyun adi
     sistem serif yazi tipiyle (Georgia) ciziliyor.
   - ILK KARE, Android'in durgun acilis goruntusuyle ayni olmali. Sahne 1
     amblemle basliyor (yazisiz), bu yuzden native splash.png
     dosyalari YENIDEN URETILDI. Cihazda dogrulanmadi — Emre kontrol edecek.
*/
(function () {
  'use strict';
  if (window.__acilisKuruldu) return;
  window.__acilisKuruldu = true;

  var AZ = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sahne sureleri (ms) */
  var S1_YAK = 2700, S1_OLC = 1.40, S1_ARA = 220, S1_PAT = 400;
  var S1_SURE = AZ ? 500 : (S1_YAK + S1_ARA + S1_PAT + 420);   // ~3740
  var S2_SIK = 120, S2_GEC = 1000, S2_KEL = 180, S2_DUS = 300;
  var S2_YAZI_BAS = 300;
  var S2_SURE = AZ ? 400 : (S2_YAZI_BAS + 3 * S2_KEL + S2_DUS + 700); // ~1840
  var EMNIYET = 9000;                  // her kosulda kalkma suresi

  var AMBLEM =
    '<rect x="60" y="92" width="120" height="118" rx="36" fill="#2FB6A8"/>' +
    '<circle cx="100" cy="154" r="7" fill="#123A3C"/>' +
    '<circle cx="140" cy="154" r="7" fill="#123A3C"/>' +
    '<path d="M102,180 Q120,192 138,180" fill="none" stroke="#123A3C" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M76,100 L76,82 L88,46 L104,74 L120,30 L136,74 L152,46 L164,82 L164,100 Z" fill="#F5C542"/>' +
    '<path d="M76,100 L164,100 L164,90 L76,90 Z" fill="#D9A722" opacity=".30"/>' +
    '<g transform="translate(88,40)"><path d="M0,-13 L11,0 L0,13 L-11,0 Z" fill="#2F6BE0"/><path d="M0,-13 L11,0 L0,0 Z" fill="#7BA4F0"/></g>' +
    '<g transform="translate(120,24)"><path d="M0,-13 L11,0 L0,13 L-11,0 Z" fill="#2F6BE0"/><path d="M0,-13 L11,0 L0,0 Z" fill="#7BA4F0"/></g>' +
    '<g transform="translate(152,40)"><path d="M0,-13 L11,0 L0,13 L-11,0 Z" fill="#2F6BE0"/><path d="M0,-13 L11,0 L0,0 Z" fill="#7BA4F0"/></g>';

  var YAZI_DUKA  = "<g fill=\"#123A3C\"><path transform=\"translate(11.059,296.000) scale(0.074000,-0.074000)\" d=\"M343 708Q540 708 636.0 618.5Q732 529 732 362Q732 253 685.0 171.5Q638 90 548.5 45.0Q459 0 334 0Q318 0 292.0 1.0Q266 2 238.0 2.5Q210 3 188 3Q144 3 101.5 2.5Q59 2 34 0V20Q66 22 82.0 28.0Q98 34 103.5 52.0Q109 70 109 106V602Q109 639 103.5 656.5Q98 674 81.5 680.5Q65 687 34 688V708Q59 707 101.5 705.5Q144 704 186 705Q222 706 267.5 707.0Q313 708 343 708ZM342 690Q296 690 282.0 673.0Q268 656 268 604V104Q268 52 282.5 35.0Q297 18 343 18Q427 18 475.5 57.5Q524 97 545.0 173.0Q566 249 566 358Q566 470 543.5 543.5Q521 617 472.0 653.5Q423 690 342 690Z\"/><path transform=\"translate(64.497,296.000) scale(0.074000,-0.074000)\" d=\"M671 708V688Q639 684 622.5 671.5Q606 659 601.0 632.0Q596 605 596 556V291Q596 226 587.0 172.0Q578 118 555 79Q529 36 479.0 11.0Q429 -14 352 -14Q306 -14 258.0 -3.5Q210 7 172 36Q140 63 123.0 97.0Q106 131 100.0 177.5Q94 224 94 288V602Q94 639 88.5 656.5Q83 674 67.0 680.5Q51 687 19 688V708Q44 707 86.5 706.0Q129 705 175 705Q221 705 263.5 706.0Q306 707 334 708V688Q300 687 282.5 680.5Q265 674 259.0 656.5Q253 639 253 602V225Q253 175 259.5 136.5Q266 98 281.5 72.5Q297 47 324.0 34.0Q351 21 391 21Q461 21 500.5 54.0Q540 87 556.5 145.5Q573 204 573 280V544Q573 599 566.0 628.5Q559 658 538.5 671.0Q518 684 476 688V708Q495 707 526.0 706.0Q557 705 584 705Q608 705 631.5 706.0Q655 707 671 708ZM477 917Q507 917 529.5 894.0Q552 871 552 841Q552 810 529.5 788.0Q507 766 477 766Q446 766 423.5 788.0Q401 810 401 842Q401 872 423.5 894.5Q446 917 477 917ZM237 917Q267 917 290.0 894.0Q313 871 313 841Q313 810 290.0 788.0Q267 766 237 766Q206 766 184.0 788.0Q162 810 162 842Q162 872 184.0 894.5Q206 917 237 917Z\"/><path transform=\"translate(117.936,296.000) scale(0.074000,-0.074000)\" d=\"M689 708V689Q657 682 620.5 661.0Q584 640 544 593L356 369L414 452L652 81Q666 58 682.0 44.0Q698 30 724 20V0Q689 2 646.0 2.5Q603 3 568 3Q547 3 517.0 2.5Q487 2 441 0V20Q482 22 490.5 31.5Q499 41 483 65L338 300Q324 323 313.0 334.5Q302 346 291.0 350.5Q280 355 262 356V377Q306 378 340.5 401.0Q375 424 416 471L475 542Q513 587 519.5 619.5Q526 652 506.5 670.0Q487 688 447 689V708Q472 707 494.5 706.5Q517 706 541.5 705.5Q566 705 595 705Q624 705 647.5 706.0Q671 707 689 708ZM343 708V688Q311 687 294.5 680.5Q278 674 273.0 656.5Q268 639 268 602V106Q268 70 273.5 52.0Q279 34 295.0 28.0Q311 22 343 20V0Q316 2 275.0 2.5Q234 3 192 3Q144 3 101.5 2.5Q59 2 34 0V20Q66 22 82.0 28.0Q98 34 103.5 52.0Q109 70 109 106V602Q109 639 103.5 656.5Q98 674 81.5 680.5Q65 687 34 688V708Q59 707 101.5 706.0Q144 705 192 705Q234 705 275.0 706.0Q316 707 343 708Z\"/><path transform=\"translate(175.496,296.000) scale(0.074000,-0.074000)\" d=\"M368 710 611 84Q625 48 642.5 34.5Q660 21 674 20V0Q644 2 603.5 2.5Q563 3 522 3Q476 3 435.0 2.5Q394 2 370 0V20Q421 22 434.5 37.5Q448 53 428 104L258 569L276 595L124 199Q102 144 97.5 109.0Q93 74 102.5 55.0Q112 36 133.5 28.5Q155 21 185 20V0Q152 2 122.0 2.5Q92 3 61 3Q39 3 19.5 2.5Q0 2 -15 0V20Q6 24 28.0 47.0Q50 70 71 125L299 710Q315 709 333.5 709.0Q352 709 368 710ZM438 288V268H140L150 288Z\"/></g>";
  var YAZI_GAMES = "<g fill=\"#123A3C\"><path transform=\"translate(11.065,340.000) scale(0.030000,-0.030000)\" d=\"M376 722Q441 722 481.0 702.5Q521 683 556 657Q569 647 576 647Q595 647 601 708H624Q622 671 621.0 618.0Q620 565 620 478H597Q590 520 580.0 559.0Q570 598 547 626Q518 663 471.0 683.5Q424 704 374 704Q324 704 283.5 679.5Q243 655 214.0 609.0Q185 563 169.5 498.5Q154 434 154 353Q154 173 212.0 89.5Q270 6 392 6Q428 6 454.5 16.5Q481 27 496 37Q515 50 520.0 61.5Q525 73 525 92V188Q525 229 517.0 249.0Q509 269 487.5 276.0Q466 283 424 284V304Q442 303 466.0 302.5Q490 302 516.5 301.5Q543 301 565 301Q598 301 624.5 302.0Q651 303 669 304V284Q647 283 636.0 277.0Q625 271 621.5 253.0Q618 235 618 198V0H598Q597 17 590.5 37.0Q584 57 571 57Q565 57 559.0 54.0Q553 51 538 40Q505 15 468.0 0.5Q431 -14 382 -14Q279 -14 205.5 28.5Q132 71 93.0 151.0Q54 231 54 342Q54 459 96.0 544.0Q138 629 210.5 675.5Q283 722 376 722Z\"/><path transform=\"translate(60.943,340.000) scale(0.030000,-0.030000)\" d=\"M323 713 567 84Q582 46 601.0 33.5Q620 21 636 20V0Q616 2 587.0 2.5Q558 3 529 3Q490 3 456.0 2.5Q422 2 401 0V20Q452 22 466.0 37.5Q480 53 460 104L274 601L290 614L116 162Q100 122 97.0 94.5Q94 67 102.5 51.0Q111 35 131.5 28.0Q152 21 183 20V0Q155 2 124.5 2.5Q94 3 68 3Q43 3 25.5 2.5Q8 2 -7 0V20Q13 25 34.0 43.5Q55 62 72 107L307 713Q311 713 315.0 713.0Q319 713 323 713ZM445 288V268H147L157 288Z\"/><path transform=\"translate(110.821,340.000) scale(0.030000,-0.030000)\" d=\"M829 708V688Q795 687 777.5 680.5Q760 674 754.0 656.5Q748 639 748 602V106Q748 70 754.0 52.0Q760 34 777.5 28.0Q795 22 829 20V0Q806 2 771.5 2.5Q737 3 702 3Q663 3 629.0 2.5Q595 2 574 0V20Q608 22 625.5 28.0Q643 34 649.0 52.0Q655 70 655 106V656L659 653L414 -5H398L146 644V116Q146 80 152.5 59.5Q159 39 178.5 30.5Q198 22 237 20V0Q219 2 190.0 2.5Q161 3 135 3Q110 3 84.5 2.5Q59 2 42 0V20Q76 22 93.5 30.5Q111 39 117.0 59.5Q123 80 123 116V602Q123 639 117.0 656.5Q111 674 93.5 680.5Q76 687 42 688V708Q59 707 84.5 706.0Q110 705 135 705Q157 705 180.5 706.0Q204 707 220 708L447 110L430 102L655 705Q667 705 678.5 705.0Q690 705 702 705Q737 705 771.5 706.0Q806 707 829 708Z\"/><path transform=\"translate(165.711,340.000) scale(0.030000,-0.030000)\" d=\"M541 708Q537 673 535.5 640.0Q534 607 534 590Q534 572 535.0 555.5Q536 539 537 528H514Q508 587 497.0 621.5Q486 656 459.5 670.5Q433 685 380 685H297Q263 685 245.5 679.5Q228 674 222.0 656.5Q216 639 216 602V106Q216 70 222.0 52.0Q228 34 245.5 28.5Q263 23 297 23H370Q433 23 465.5 40.0Q498 57 512.5 95.5Q527 134 534 200H557Q554 173 554 128Q554 109 555.5 73.5Q557 38 561 0Q510 2 446.0 2.5Q382 3 332 3Q310 3 275.5 3.0Q241 3 201.0 2.5Q161 2 120.0 1.5Q79 1 42 0V20Q76 22 93.5 28.0Q111 34 117.0 52.0Q123 70 123 106V602Q123 639 117.0 656.5Q111 674 93.5 680.5Q76 687 42 688V708Q79 707 120.0 706.5Q161 706 201.0 705.5Q241 705 275.5 705.0Q310 705 332 705Q378 705 436.5 705.5Q495 706 541 708ZM369 366Q369 366 369.0 356.0Q369 346 369 346H186Q186 346 186.0 356.0Q186 366 186 366ZM398 498Q394 441 394.5 411.0Q395 381 395 356Q395 331 396.0 301.0Q397 271 401 214H378Q374 246 368.5 276.5Q363 307 344.5 326.5Q326 346 282 346V366Q315 366 332.5 379.5Q350 393 358.0 414.0Q366 435 369.0 457.5Q372 480 375 498Z\"/><path transform=\"translate(212.250,340.000) scale(0.030000,-0.030000)\" d=\"M256 719Q306 719 332.0 707.5Q358 696 378 682Q390 675 397.5 671.5Q405 668 412 668Q422 668 426.5 679.0Q431 690 434 712H457Q456 695 454.5 671.5Q453 648 452.5 609.5Q452 571 452 508H429Q426 556 408.0 600.0Q390 644 355.5 672.0Q321 700 265 700Q212 700 177.5 668.0Q143 636 143 584Q143 539 166.0 508.5Q189 478 227.5 453.5Q266 429 311 401Q363 369 403.5 337.5Q444 306 467.5 268.0Q491 230 491 176Q491 112 462.0 70.0Q433 28 385.0 7.0Q337 -14 279 -14Q226 -14 195.0 -2.0Q164 10 142 23Q120 37 108 37Q98 37 93.5 26.0Q89 15 86 -7H63Q65 14 65.5 42.5Q66 71 66.5 117.0Q67 163 67 233H90Q94 173 112.5 121.0Q131 69 169.5 37.5Q208 6 272 6Q305 6 334.5 19.5Q364 33 383.0 62.5Q402 92 402 139Q402 180 382.5 210.5Q363 241 328.0 267.5Q293 294 246 322Q199 351 158.0 381.0Q117 411 92.5 450.5Q68 490 68 546Q68 605 94.5 643.5Q121 682 164.0 700.5Q207 719 256 719Z\"/></g>";

  /* ---------- ortak katman ---------- */
  var kat = document.createElement('div');
  kat.id = 'acilisKat';
  kat.setAttribute('aria-hidden', 'true');
  kat.innerHTML =
    '<div class="acSahne acS1" id="acS1">' +
      '<div class="acKamera">' +
        '<svg class="acLogo" viewBox="-5.71 -5.77 251.41 368.97" role="img" aria-label="Düka Games">' +
          AMBLEM +
          '<g class="acKelime acK1">' + YAZI_DUKA + '</g>' +
          '<g class="acKelime acK2">' + YAZI_GAMES + '</g>' +
        '</svg>' +
      '</div>' +
      '<div class="acKiv" id="acKiv"></div>' +
    '</div>' +
    '<div class="acSahne acS2" id="acS2">' +
      '<svg class="acOyun" id="acOyun" viewBox="0 0 300 600" preserveAspectRatio="xMidYMid slice">' +
        '<defs><filter id="acGolge" x="-30%" y="-30%" width="160%" height="160%">' +
          '<feDropShadow dx="0" dy="2.5" stdDeviation="2.6" flood-color="#0A2426" flood-opacity="0.38"/>' +
        '</filter></defs>' +
        '<g id="acYilanlar"></g>' +
        '<g id="acYaziKut" filter="url(#acGolge)">' +
          '<text id="acW0" text-anchor="middle" font-size="46" font-weight="700" fill="#123A3C">Snake</text>' +
          '<text id="acW1" text-anchor="middle" font-size="46" font-weight="700" fill="#123A3C">Knot</text>' +
          '<text id="acW2" text-anchor="middle" font-size="32" font-weight="700" fill="#1E5F63" letter-spacing="1">Escape</text>' +
          '<text id="acW3" text-anchor="middle" font-size="32" font-weight="700" fill="#1E5F63" letter-spacing="1">Puzzle</text>' +
        '</g>' +
      '</svg>' +
    '</div>';

  var st = document.createElement('style');
  st.textContent = [
    '#acilisKat{position:fixed;inset:0;z-index:99999;background:#E4F2EF;overflow:hidden;',
    '  transition:opacity .42s ease, visibility .42s;}',
    '#acilisKat.git{opacity:0;visibility:hidden;}',
    '#acilisKat .acSahne{position:absolute;inset:0;display:flex;align-items:center;',
    '  justify-content:center;opacity:0;visibility:hidden;transition:opacity .34s ease;}',
    '#acilisKat .acSahne.acGor{opacity:1;visibility:visible;}',

    /* --- Sahne 1 --- */
    '#acilisKat .acKamera{transform:scale(1);transform-origin:50% 42%;will-change:transform;}',
    '#acilisKat .acS1.acOyna .acKamera{animation:acYak ' + S1_YAK + 'ms cubic-bezier(.33,.02,.28,1) forwards;}',
    '@keyframes acYak{to{transform:scale(' + S1_OLC + ');}}',
    /* OLCU YUKSEKLIKTEN: Android durgun acilis goruntusunu CENTER_CROP ile
       kapatiyor ve olcek yukseklikten geliyor. Web katmani da yukseklikle
       olculmeli; genislikle verirsek cihazda amblem native goruntudekinden
       buyuk cikar ve gecis "zipliyor". native splash.png dosyalari da ayni
       oranla (SVG kutusu = goruntu yuksekliginin %34'u) uretildi. */
    '#acilisKat .acLogo{height:34svh;width:auto;max-width:78vw;display:block;}',
    '#acilisKat .acKelime{opacity:0;transform-box:fill-box;transform-origin:50% 60%;transform:scale(.82);}',
    '#acilisKat .acS1.acOyna .acK1{animation:acPatla ' + S1_PAT + 'ms cubic-bezier(.16,1.02,.3,1) forwards;animation-delay:' + S1_YAK + 'ms;}',
    '#acilisKat .acS1.acOyna .acK2{animation:acPatla ' + S1_PAT + 'ms cubic-bezier(.16,1.02,.3,1) forwards;animation-delay:' + (S1_YAK + S1_ARA) + 'ms;}',
    '@keyframes acPatla{0%{opacity:0;transform:scale(.72)}55%{opacity:1;transform:scale(1.07)}',
    '  78%{transform:scale(.985)}100%{opacity:1;transform:scale(1)}}',
    '#acilisKat .acKiv{position:absolute;left:50%;top:58%;width:0;height:0;pointer-events:none;}',
    '#acilisKat .acKiv i{position:absolute;left:0;top:0;width:6px;height:6px;margin:-3px 0 0 -3px;',
    '  border-radius:50%;background:#F5C542;opacity:0;}',
    '#acilisKat .acS1.acOyna .acKiv i{animation:acSac 640ms cubic-bezier(.2,.75,.3,1) forwards;animation-delay:' + S1_YAK + 'ms;}',
    '@keyframes acSac{0%{opacity:1;transform:translate(0,0) scale(1)}',
    '  100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.35)}}',
    /* Atlandiginda animasyon yerine SON KARE gosterilir */
    '#acilisKat .acS1.acSon .acKamera{transform:scale(' + S1_OLC + ');}',
    '#acilisKat .acS1.acSon .acKelime{opacity:1;transform:scale(1);}',

    /* --- Sahne 2 --- */
    '#acilisKat .acOyun{position:absolute;inset:0;width:100%;height:100%;display:block;}',
    '#acilisKat #acYaziKut{paint-order:stroke fill;stroke:#E4F2EF;stroke-width:5.5;stroke-linejoin:round;}',
    '#acilisKat #acYaziKut text{font-family:Georgia,"Times New Roman",serif;}',

    /* KARANLIK TEMA: native gece acilis goruntusu #131822, web katmani
       eskiden her zaman #E4F2EF idi — karanlik modda acilista renk
       sicramasi oluyordu. Artik ikisi ayni. prefers-color-scheme
       kullaniyoruz cunku native tarafi da onu kullaniyor (oyunun kendi
       yk.dark tercihi ayri bir sey, acilis onu beklemeden ciziliyor). */
    '@media (prefers-color-scheme: dark){',
    '  #acilisKat{background:#131822;}',
    '  #acilisKat .acKelime path{fill:#DCEAE7;}',
    '  #acilisKat #acYaziKut{stroke:#131822;}',
    '  #acilisKat #acW0,#acilisKat #acW1{fill:#EAF5F2;}',
    '  #acilisKat #acW2,#acilisKat #acW3{fill:#7FD9CF;}}',

    '@media (prefers-reduced-motion: reduce){',
    '  #acilisKat .acKamera,#acilisKat .acKelime,#acilisKat .acKiv i{animation:none!important;}',
    '  #acilisKat .acKelime{opacity:1!important;transform:none!important;}}'
  ].join('');

  function ekle() {
    document.head.appendChild(st);
    document.body.appendChild(kat);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { window.__acilisHazir = true; });
    });
  }
  if (document.body) ekle();
  else document.addEventListener('DOMContentLoaded', ekle);

  /* ---------- Sahne 1 ---------- */
  var s1 = kat.querySelector('#acS1'), s2 = kat.querySelector('#acS2');
  var kivKap = kat.querySelector('#acKiv');
  if (!AZ) {
    for (var i = 0; i < 14; i++) {
      var a = (i / 14) * Math.PI * 2 + Math.random() * 0.4, u = 46 + Math.random() * 44;
      var kv = document.createElement('i');
      kv.style.setProperty('--dx', (Math.cos(a) * u).toFixed(1) + 'px');
      kv.style.setProperty('--dy', (Math.sin(a) * u * 0.55).toFixed(1) + 'px');
      if (i % 3 === 0) kv.style.background = '#2FB6A8';
      kivKap.appendChild(kv);
    }
  }

  /* ---------- Sahne 2: yilanlar + dusen kelimeler ---------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var B = {1:{x:86,y:-70},2:{x:214,y:-70},3:{x:370,y:170},4:{x:370,y:430},
           5:{x:214,y:670},6:{x:86,y:670},7:{x:-70,y:430},8:{x:-70,y:170}};
  var GECISLER = [[2,4],[5,3],[8,7],[6,1],[1,5],[3,7],[4,8],[7,2],[2,6],[8,4],[5,1],[3,6]];
  var RENKLER = [['#2F6BE0','#7BA4F0'],['#F5C542','#FFE08A'],['#8B5CF6','#C4A8FF'],
                 ['#E4572E','#FF9470'],['#2FB6A8','#7FD9CF'],['#2F8F6B','#6FC49E']];
  function sel(ad, oz){ var e = document.createElementNS(SVGNS, ad);
    for (var k in oz) e.setAttribute(k, oz[k]); return e; }
  function rast(a, b){ return a + Math.random() * (b - a); }
  function yolUret(a, b){
    var p = B[a], q = B[b], ox = (p.x+q.x)/2, oy = (p.y+q.y)/2;
    var nx = -(q.y-p.y), ny = (q.x-p.x), uz = Math.sqrt(nx*nx+ny*ny) || 1;
    nx /= uz; ny /= uz;
    var k1 = rast(-90,90), k2 = rast(-90,90);
    return 'M '+p.x+','+p.y+' C '+(ox+nx*k1)+','+(oy+ny*k1)+' '+(ox+nx*k2)+','+(oy+ny*k2)+' '+q.x+','+q.y;
  }
  function kafaYap(k, renk){
    var g = sel('g', {});
    g.appendChild(sel('path',{d:'M '+(k*0.95)+',0 L '+(k*1.9)+',0',stroke:'#D62828','stroke-width':Math.max(1.5,k*0.14),fill:'none','stroke-linecap':'round'}));
    g.appendChild(sel('path',{d:'M '+(k*1.9)+',0 L '+(k*2.6)+',-'+(k*0.42),stroke:'#D62828','stroke-width':Math.max(1.3,k*0.13),fill:'none','stroke-linecap':'round'}));
    g.appendChild(sel('path',{d:'M '+(k*1.9)+',0 L '+(k*2.6)+','+(k*0.42),stroke:'#D62828','stroke-width':Math.max(1.3,k*0.13),fill:'none','stroke-linecap':'round'}));
    g.appendChild(sel('ellipse',{cx:0,cy:0,rx:k*0.95,ry:k*0.72,fill:renk}));
    g.appendChild(sel('circle',{cx:k*0.34,cy:-k*0.30,r:Math.max(1.6,k*0.15),fill:'#FFFFFF'}));
    g.appendChild(sel('circle',{cx:k*0.34,cy: k*0.30,r:Math.max(1.6,k*0.15),fill:'#FFFFFF'}));
    g.appendChild(sel('circle',{cx:k*0.42,cy:-k*0.30,r:Math.max(1.0,k*0.08),fill:'#123A3C'}));
    g.appendChild(sel('circle',{cx:k*0.42,cy: k*0.30,r:Math.max(1.0,k*0.08),fill:'#123A3C'}));
    return g;
  }
  var gYil = kat.querySelector('#acYilanlar');
  var KELIME = ['acW0','acW1','acW2','acW3'].map(function(id){ return kat.querySelector('#'+id); });
  var merkez = [], aktif = [], s2t0 = 0, s2Calisiyor = false, sonDogus = 0;

  function yaziyiYerlestir(){
    var u = KELIME.map(function(t){ try{ return t.getComputedTextLength(); }catch(e){ return 100; } });
    var g1 = 16, g2 = 13, s1w = u[0]+g1+u[1], s2w = u[2]+g2+u[3], y1 = 286, y2 = 334;
    var k = [[150-s1w/2+u[0]/2, y1],[150+s1w/2-u[1]/2, y1],
             [150-s2w/2+u[2]/2, y2],[150+s2w/2-u[3]/2, y2]];
    KELIME.forEach(function(t,i){ t.setAttribute('x',k[i][0]); t.setAttribute('y',k[i][1]); });
    merkez = k.map(function(p,i){ return [p[0], p[1]-(i<2?16:11)]; });
  }
  function dogur(){
    var gg = GECISLER[Math.floor(Math.random()*GECISLER.length)];
    var r = RENKLER[Math.floor(Math.random()*RENKLER.length)];
    var kal = rast(11,18), boy = rast(150,260), d = yolUret(gg[0],gg[1]);
    var g = sel('g',{});
    var yol = sel('path',{d:d,fill:'none',stroke:'none'});
    var govde = sel('path',{d:d,fill:'none',stroke:r[0],'stroke-width':kal,'stroke-linecap':'round'});
    var sirt = sel('path',{d:d,fill:'none',stroke:r[1],'stroke-width':Math.max(2,kal*0.22),'stroke-linecap':'round',opacity:.55});
    var kafa = kafaYap(kal, r[0]);
    g.appendChild(yol); g.appendChild(govde); g.appendChild(sirt); g.appendChild(kafa);
    gYil.appendChild(g);
    var y = {g:g,yol:yol,govde:govde,sirt:sirt,kafa:kafa,boy:boy,sure:S2_GEC*rast(0.82,1.18),dogum:performance.now()};
    y.uzunluk = yol.getTotalLength();
    [govde,sirt].forEach(function(p){
      p.setAttribute('stroke-dasharray', boy+' '+(y.uzunluk+boy+10));
      p.setAttribute('stroke-dashoffset', boy);
    });
    kafa.style.opacity = 0;
    aktif.push(y);
  }
  function ciz(y, ilerleme){
    var toplam = y.uzunluk + y.boy, bas = ilerleme * toplam;
    [y.govde,y.sirt].forEach(function(p){ p.setAttribute('stroke-dashoffset', y.boy-bas); });
    if (bas <= 0){ y.kafa.style.opacity = 0; return; }
    var d = Math.min(bas, y.uzunluk);
    var n = y.yol.getPointAtLength(d), o = y.yol.getPointAtLength(Math.max(0, d-1.2));
    var aci = Math.atan2(n.y-o.y, n.x-o.x) * 180 / Math.PI;
    y.kafa.style.opacity = (bas > y.uzunluk) ? 0 : 1;
    y.kafa.setAttribute('transform','translate('+n.x+','+n.y+') rotate('+aci+')');
  }
  function kolay(t){ return 1 - Math.pow(1-t, 3); }
  function s2Kare(zaman){
    if (!s2Calisiyor) return;
    var t = zaman - s2t0;
    if (t < S2_SURE - 400 && zaman - sonDogus >= S2_SIK){ sonDogus = zaman; dogur(); }
    for (var i = aktif.length-1; i >= 0; i--){
      var y = aktif[i], p = (zaman - y.dogum) / y.sure;
      if (p >= 1){ if (y.g.parentNode) y.g.parentNode.removeChild(y.g); aktif.splice(i,1); continue; }
      ciz(y, p);
    }
    KELIME.forEach(function(e, i){
      var bas = S2_YAZI_BAS + i*S2_KEL, kk = (t - bas) / S2_DUS;
      if (kk <= 0){ e.style.opacity = 0; return; }
      var k = Math.min(1, kk), olc = 3.4 + (1-3.4) * kolay(k);
      if (k > 0.82){ var z = (k-0.82)/0.18; olc = 1 + 0.10*Math.sin(z*Math.PI)*(1-z*0.5); }
      e.style.opacity = Math.min(1, kk*2.2);
      var c = merkez[i];
      e.setAttribute('transform','translate('+c[0]+','+c[1]+') scale('+olc.toFixed(3)+') translate('+(-c[0])+','+(-c[1])+')');
    });
    if (t < S2_SURE + 600) requestAnimationFrame(s2Kare);
  }
  function s2Bitir(){         /* atlandiginda: yazilar yerinde, yilanlar temiz */
    s2Calisiyor = false;
    aktif.forEach(function(y){ if (y.g.parentNode) y.g.parentNode.removeChild(y.g); });
    aktif = [];
    KELIME.forEach(function(e){ e.style.opacity = 1; e.removeAttribute('transform'); });
  }

  /* ---------- Akis ---------- */
  var bitti = false, evre = 0;   // 0: sahne1, 1: sahne2, 2: kapandi
  function kapat(){
    if (bitti) return;
    bitti = true; evre = 2; s2Calisiyor = false;
    kat.classList.add('git');
    setTimeout(function(){
      if (kat.parentNode) kat.parentNode.removeChild(kat);
      if (st.parentNode) st.parentNode.removeChild(st);
      window.__acilisBitti = true;
    }, 520);
  }
  window.__acilisKapat = kapat;

  function sahne2Baslat(){
    if (evre >= 1) return;
    evre = 1;
    s1.classList.remove('acGor');
    s2.classList.add('acGor');
    yaziyiYerlestir();
    if (AZ){ s2Bitir(); setTimeout(bitirKontrol, S2_SURE); return; }
    s2Calisiyor = true; s2t0 = performance.now(); sonDogus = 0;
    requestAnimationFrame(s2Kare);
    setTimeout(bitirKontrol, S2_SURE);
  }

  /* Oyun hazir degilse sahne 2'yi uzatmiyoruz; katman duruyor, akis bozulmuyor. */
  function bitirKontrol(){
    var hazir = !!(window.__yk && window.__yk.st && window.__yk.st());
    if (hazir || Date.now() - t0 >= EMNIYET) kapat();
    else setTimeout(bitirKontrol, 80);
  }

  var t0 = Date.now();
  s1.classList.add('acGor');
  if (!AZ) requestAnimationFrame(function(){ s1.classList.add('acOyna'); });
  setTimeout(sahne2Baslat, S1_SURE);
  setTimeout(function(){ if (!bitti) kapat(); }, EMNIYET);

  /* ---- AYRI ATLAMA ----
     Sahne 1'e dokunmak sahne 1'i bitirir ve sahne 2'yi BASLATIR.
     Sahne 2'ye dokunmak sahne 2'yi bitirir ve oyuna gecer. */
  function dokunus(ev){
    if (evre === 0){
      s1.classList.remove('acOyna'); s1.classList.add('acSon');
      sahne2Baslat();
    } else if (evre === 1){
      s2Bitir();
      setTimeout(kapat, 120);
    }
    if (ev && ev.preventDefault) ev.preventDefault();
  }
  ['pointerdown','keydown'].forEach(function(e){
    kat.addEventListener(e, dokunus, { passive:false });
  });
})();
