# Eşiksiz: Jüri Soru-Cevap (Q&A) Hazırlık Rehberi

Bu doküman, TEKNOFEST NSosyal İnovasyon Yarışması final değerlendirmesinde jüri üyelerinden gelebilecek en zorlu ve teknik sorulara karşı stratejik cevapları içermektedir.

---

### S1: "Piyasada zaten UserWay veya AccessiBe gibi erişilebilirlik eklentileri (overlay) var. Eşiksiz'in bunlardan farkı nedir?"
**Cevap:**
> *"Hocam çok haklı ve kritik bir soru. Dünya genelinde erişilebilirlik savunucuları ve W3C topluluğu (OverlayFactSheet.com) üçüncü parti overlay'leri şiddetle eleştirmektedir; çünkü overlay'ler yalnızca web sayfasının üzerine yüzeysel bir JavaScript yaması atar, alttaki kod mimarisini düzeltemez ve ekran okuyucuları bozar.*
> *Eşiksiz bir overlay değildir. React Native tabanlı bir Native SDK ve tasarım sistemi bileşenidir. Doğrudan platformun kaynak koduna, butonlarına ve veri akışına entegredir. Ayrıca overlay'ler statiktir; Eşiksiz ise kullanıcının anlık etkileşimini izleyen Uyarlanabilir Öneri Motoru ve yerli Türkçe yapay zekâ hattına sahiptir."*

---

### S2: "Yapay zekâ görsel açıklama ve altyazı modellerini cihazda mı yoksa sunucuda mı çalıştırıyorsunuz? Gecikme ve maliyet nasıl yönetilecek?"
**Cevap:**
> *"Mimarimizi hibrit (uç-bulut) olarak kurguladık. Prototip aşamasında açık kaynak modelleri (Türkçe ASR ve Vision-Language modelleri) optimize ederek kullandık.*
> *Sunucu tarafında görsel betimlemeyi yalnızca görsel ilk yüklendiğinde 'tek seferlik' üretiyoruz ve NSosyal veritabanında meta veri olarak saklıyoruz. Böylece aynı resmi 1 milyon kullanıcı görse bile AI maliyeti 1 kere oluşuyor! Cihaz tarafında ise hafif Web Speech / Mobil TTS motoru ile anında ve sıfır ek bant genişliğiyle seslendirme yapıyoruz."*

---

### S3: "Uyarlanabilir Öneri Motoru kullanıcının kişisel verilerini veya gizliliğini ihlal ediyor mu?"
**Cevap:**
> *"Kesinlikle hayır, gizlilik tasarımın merkezindedir (Privacy by Design). Motorumuz hiçbir kişisel içeriği, mesajı veya kullanıcı kimliğini izlemez.*
> *Yalnızca anonim fiziksel etkileşim sinyallerini izler: Kaydırma ivmesi, ekranda bekleme süresi ve ardışık dokunma denemeleri. Bu sinyaller tamamen cihaz üzerinde (on-device) işlenir, sunucuya aktarılmaz ve hiçbir biyometrik/kişisel veri kaydedilmez."*

---

### S4: "WCAG 2.2 AA kriterlerini gerçekten karşıladığınızı nasıl kanıtlıyorsunuz?"
**Cevap:**
> *"İP4 kapsamında sunduğumuz denetim raporumuzda 17 temel WCAG 2.2 AA kriterini tek tek test ettik.*
> *Örneğin kontrastta AA sınırı 4.5:1 iken, Yüksek Kontrast modumuzda 16.1:1 ile AAA seviyesini aştık. Dokunmatik hedef boyutunda AA standardı 24x24 px iken tüm butonlarımızı asgari 48x48 px yaparak AAA'yı garantiledik. Ayrıca TalkBack ve VoiceOver ekran okuyucularıyla gerçek senaryo yürüyüşleri gerçekleştirdik."*

---

### S5: "NSosyal bu sistemi kendi platformuna nasıl entegre edecek? İş modeliniz nedir?"
**Cevap:**
> *"Eşiksiz, NSosyal'in ana monolitik mimarisini bozmayan modüler bir SDK ve UI kütüphanesi olarak tasarlandı.*
> *İş modelimiz son kullanıcıdan para almak değil; NSosyal çekirdek ekibine bir 'Platform İçi Kapsayıcılık Modülü' olarak lisanslanmaktır. Böylece NSosyal, hem Türkiye'nin ilk ve tek yüzde yüz erişilebilir sosyal medyası unvanını kazanacak, hem de 2,5 milyondan fazla engelli bireyi aktif kullanıcı tabanına katacaktır."*
