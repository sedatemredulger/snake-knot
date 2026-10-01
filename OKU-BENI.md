# Snake Escape — Android ön hazırlık

Hazır. Aşağıda üç bölüm var: **benim kararlarım**, **bulduğum bir sorun**,
ve **senin yapacakların**.

---

## ⚠ ÖNCE BUNU OKU: yazı tipi sorunu

Paketlemeye başlayınca ortaya çıktı ve **hem oyunu hem teslim ettiğim
görselleri ilgilendiriyor.**

Oyun üç yazı tipini (Bricolage Grotesque, Karla, Fredoka) **Google Fonts'tan,
internet üzerinden** çekiyordu. Bu tarayıcıda sorun değildi. Ama:

**1. Oyun çevrimdışı çalışacak.** İnterneti olmayan bir telefonda bu üç yazı
tipi hiç yüklenmiyor, her şey sistemin varsayılan yazı tipine düşüyor. Başlık,
HUD, düğmeler, o özenle yaptığımız Fredoka sayaç rozeti — hepsi.

**2. Daha kötüsü:** bu ortamda Google Fonts erişimi bir noktada kapandı ve
**ben fark etmeden** son ürettiğim görseller yedek yazı tipiyle çıktı. Ölçtüm,
doğruladım. Etkilenenler:

- mağaza ekran görüntüleri (TR + EN)
- öne çıkan grafik (1024×500)
- açılış ekranı
- tanıtım videosunun başlık, alt yazı ve kapanış kartları

Logo etkilenmedi — o Playfair'in gerçek dosyasından eğriye çevrilmişti.
Oyunun kendisi de etkilenmedi, sadece nasıl *göründüğü* etkilendi.

**Çözüm:** yazı tipleri uygulamanın içine gömülecek. Ben dosyaları indiremiyorum
(bu ortamdan Google sunucularına erişim kapalı) — **Playfair'i gönderdiğin gibi
bunları da göndermen gerekiyor.** fonts.google.com'dan üçü de ücretsiz:

| Yazı tipi | Adres |
|---|---|
| Bricolage Grotesque | fonts.google.com/specimen/Bricolage+Grotesque |
| Karla | fonts.google.com/specimen/Karla |
| Fredoka | fonts.google.com/specimen/Fredoka |

Zip'leri at, ben `www/fonts/` içine yerleştiririm — altyapı hazır, dosyalar
gelince kod değişmeden devreye giriyor. Sonra bütün görselleri ve videoyu
doğru yazı tipiyle yeniden üretirim. Ekstra bir çalışma değil, hepsi betikle.

---

## Ne kurdum

**Capacitor 8.5** üzerine Android projesi. Oyun uygulamanın içine gömülü,
internet olmadan çalışıyor. 1000 bölümlük pakete dokunulmadı.

| Ayar | Değer | Neden |
|---|---|---|
| Paket adı | `com.dukagames.snakeescape` | Kalıcı, değiştirilemez |
| Sürüm | 1.0.0 (versionCode 1) | Her yüklemede versionCode artacak |
| En düşük Android | 7.0 (API 24) | Cihazların ~%98'i. Daha aşağısı WebView riski |
| Hedef Android | API 36 | Play'in güncel şartı |
| Ekran | Dikey kilitli | Oyun dikey tasarlandı |
| Yedekleme | Açık | Oyuncu telefon değiştirince ilerlemesi taşınır |
| Paket boyutu | ~1.4 MB web + kod | Çok küçük |

**Yaptığım düzenlemeler** (oyunun kaynak dosyasına dokunmadan, `yap.js`
betiğiyle, her biri doğrulanıyor):

- Google Fonts bağlantıları kaldırıldı, yerel yazı tipi altyapısı kuruldu.
- Tarayıcının kendi yakınlaştırması kapatıldı — oyunun kendi yakınlaştırmasıyla
  çakışıyordu.
- Çentik ve alt çubuk için güvenli alan boşluğu eklendi, HUD onların altında
  kalmıyor.
- Metin seçimi, uzun basma menüsü ve mavi dokunma parlaması kapatıldı
  (tarayıcı davranışları, uygulamada yabancı duruyor).
- Reklam için bir kanca eklendi (aşağıda).

**Köprü** (`www/native.js`) — hepsi yoksa sessizce devre dışı kalıyor:

- **Açılış ekranı** oyun gerçekten hazır olunca kapanıyor, arada beyaz bir an
  görünmüyor.
- **Durum çubuğu** temayla uyumlu; koyu temaya geçince ikonlar da değişiyor.
- **Geri tuşu** önce açık katmanı kapatıyor. Oyun ekranındayken tek basışta
  çıkmıyor, iki saniye içinde iki kez basılırsa çıkıyor.
- **Titreşim** native'e bağlandı (WebView'da her cihazda çalışmıyor).
- **Reklam** AdMob'a bağlandı — **ama şu an Google'ın test kimlikleriyle.**
  Reklam yüklenemezse oyunun kendi ekranına düşüyor, yani reklam yüzünden
  oyun asla kilitlenmiyor.

---

## Performans ölçümü

Kabuk yaklaşımının asıl riski buydu; ölçtüm.

| Bölüm | Tahta | Parça | Ortanca kare | p95 | En kötü |
|---|---|---|---|---|---|
| 18 | 12×16 | 72 | 16,7 ms (~60 fps) | 19,1 ms | 56,9 ms |
| 156 | 26×40 | 174 | 16,7 ms (~60 fps) | 20,4 ms | 26,1 ms |
| 660 | 30×46 | 181 | 16,7 ms (~60 fps) | 23,3 ms | 40,9 ms |
| 1000 | 30×46 | 184 | 16,7 ms (~60 fps) | 21,7 ms | 27,3 ms |

Aynı anda dört yılan hareket ederken, tahtanın tamamı görünürken ölçüldü.
En büyük tahtada bile 60 fps'te duruyor.

**Ama bu bir masaüstü tarayıcı.** Telefon daha yavaş. Bu sayılar bir **üst
sınır**, garanti değil. Gerçek cevap ilk APK telefonunda çalıştığında gelecek.
Yine de "SVG bu kadar parçayı kaldırmaz" endişesi için iyi bir işaret:
darboğaz görünmüyor.

---

## Sende bekleyen dört şey

**1. Yazı tipleri.** Yukarıdaki üç zip. En önemlisi bu.

**2. AdMob hesabı.** Şu an test kimlikleri var. **Test kimlikleriyle yayına
çıkılmaz** — AdMob hesabı askıya alınır. Gerçek kimlikler gelince değiştireceğim
yerler: `android/app/src/main/AndroidManifest.xml` (uygulama kimliği) ve
`www/native.js` (reklam birimi kimlikleri). İkisi de işaretli.

**3. İmza anahtarı — senin makinende üreteceksin, buradan çıkmayacak.**
Kaybedersen uygulamayı bir daha güncelleyemezsin; Google bile geri veremez.

**4. Satın alma ürünleri.** Coin ekonomisi kararına bağlı, altyapı hazır.

---

## Senin makinende: kurulum ve derleme

Bir kereye mahsus gerekenler: **JDK 21** ve **Android Studio** (SDK için).

### Anahtarı üret (bir kez, sonsuza kadar)

```bash
keytool -genkey -v -keystore snake-escape.keystore \
  -alias snakeescape -keyalg RSA -keysize 2048 -validity 10000
```

Sorduğu parolayı **bir parola yöneticisine kaydet**. `snake-escape.keystore`
dosyasını da yedekle — iki ayrı yerde dursun. Bu dosya + parola = uygulamanın
kimliği.

### Projeyi hazırla

```bash
cd snake-escape
npm install
npx cap sync android
```

### Test yapısı (kendi telefonuna kur, imza gerekmez)

```bash
cd android
./gradlew assembleDebug
# çıktı: android/app/build/outputs/apk/debug/app-debug.apk
```

APK'yı telefona at, kur (bilinmeyen kaynaklara izin vermen gerekir).
**İlk yapıda kontrol edilecekler:** açılış ekranı düzgün kapanıyor mu, ikon
doğru mu, geri tuşu, titreşim, büyük bölümlerde akıcılık, ekranın çentikle
ilişkisi.

### Yayın yapısı (Play'e yüklenecek)

Anahtar ve parola hazır olunca imzalama ayarını ben ekleyeceğim, sonra:

```bash
./gradlew bundleRelease
# çıktı: android/app/build/outputs/bundle/release/app-release.aab
```

Play'e **AAB** yükleniyor, APK değil.

---

## Not

Derleme araçlarını bu ortama kuramadım — Google'ın sunucuları (dl.google.com,
services.gradle.org) erişime kapalı. Dolayısıyla APK'yı burada üretip sana
gönderemedim; sana söylediğim gibi denedim, olmadı. Proje tam ve tutarlı,
ilk derleme senin makinende olacak. Hata alırsan çıktıyı at, çözerim.
