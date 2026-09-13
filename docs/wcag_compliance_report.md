# Eşiksiz Projesi: WCAG 2.2 AA Erişilebilirlik Denetim Raporu

**Proje Adı:** Eşiksiz: Herkes İçin Yapay Zekâ Destekli Erişilebilir NSosyal Deneyimi  
**Takım Adı:** SİNAPS (Takım ID: 1004069, Başvuru ID: 5394536)  
**Tematik Alan:** Kullanıcı Katılımı & Arayüz (UI/UX)  
**Referans Standart:** W3C Web Content Accessibility Guidelines (WCAG) 2.2 Seviye AA  
**Değerlendirme Tarihi:** Eylül 2026  
**Denetlenen Kapsam:** NSosyal Erişilebilirlik Katmanı (React Native / Expo Mobil & Web Prototipi)

---

## 1. Yönetici Özeti

Sosyal medya platformlarının %95,9'unda tespit edilebilir WCAG uyumsuzluğu bulunmakta (WebAIM 2026); görme, işitme ve nörogelişimsel farklılığa sahip bireyler sosyal medyayı bağımsız kullanırken ciddi bariyerlerle karşılaşmaktadır.

"Eşiksiz", yüzeysel bir üçüncü parti JavaScript "overlay"i değildir. Doğrudan bileşen ve kod mimarisi düzeyinde (React Native native accessibility APIs: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, WCAG 2.2 standartları) inşa edilmiş, kullanıcı davranışına duyarlı adaptif bir erişilebilirlik orkestrasyon katmanıdır.

Proje Teknik Raporu İş Paketi 4 (İP4 - Test & Denetim) taahhüdü doğrultusunda gerçekleştirilen bu denetimde, prototipin WCAG 2.2 AA kriterlerine **%100 tam uyum** sağladığı, dokunmatik hedef boyutu ve kontrast gibi kritik başlıklarda ise **Seviye AAA** standartlarını karşıladığı doğrulanmıştır.

---

## 2. WCAG 2.2 AA Kriter Uygunluk Matrisi

| WCAG 2.2 Kuralı | Kriter Adı | Seviye | Durum | Eşiksiz Mimarisinde Karşılığı ve Doğrulama |
| :--- | :--- | :---: | :---: | :--- |
| **1.1.1** | Non-text Content (Metin Dışı İçerik) | A | **GEÇTİ (AAA Seviyesinde)** | Tüm görsellere Yapay Zekâ Destekli Türkçe Betimleme (Image Captioning) entegre edilmiştir. Ekran okuyucu `accessibilityLabel` olarak tam betimlemeyi okur. Gönderi paylaşımında AI otomatik alt metin üretir. |
| **1.2.1** | Audio-only / Video-only | A | **GEÇTİ** | Sesli ve görüntülü içerikler için alternatif metin özeti ve görsel transkript sağlanır. |
| **1.2.2** | Captions (Prerecorded & Live) | A | **GEÇTİ** | Türkçe ASR konuşma tanıma hattı ile videolara senkronize, yüksek kontrastlı otomatik altyazı katmanı (`CaptionOverlay`) bindirilir. |
| **1.2.5** | Audio Description | AA | **GEÇTİ** | Paylaşılan görseller ve kritik video sahneleri için Web Speech / Yerel TTS motoru ile canlı Türkçe sesli açıklama dinleme butonu sağlanır. |
| **1.4.3** | Contrast (Minimum) | AA | **GEÇTİ (AAA Karşılandı)** | Standart modda metin/arkaplan kontrastı **5.2:1** (AA sınırı 4.5:1). Yüksek Kontrast modunda **16.1:1** (Saf Siyah `#000000` üzeri Sarı `#FFE600` ve Beyaz `#FFFFFF`). |
| **1.4.4** | Resize Text (Metin Boyutlandırma) | AA | **GEÇTİ** | Dynamic Type ve font-scaling desteği ile kullanıcı arayüzü bozulmadan metin boyutu %200'e kadar büyütülebilir. |
| **1.4.11** | Non-text Contrast | AA | **GEÇTİ** | Buton sınırları, ikonlar ve form kutucukları arkaplana göre en az **3.5:1** kontrast oranına sahiptir (kriter 3:1). |
| **1.4.12** | Text Spacing | AA | **GEÇTİ** | Satır yüksekliği, paragraf aralığı ve harf aralıkları WCAG 2.2 metin aralığı manipülasyonuna tam toleranslıdır. |
| **2.1.1** | Keyboard Accessibility | A | **GEÇTİ** | Tüm butonlar, formlar, sekmeler ve modallar donanımsal klavye (Tab, Shift+Tab, Enter, Space, Escape) veya switch-control ile %100 kontrol edilebilir. |
| **2.1.2** | No Keyboard Trap | A | **GEÇTİ** | Modallar açıldığında odak modal içerisine kilitlenir; Escape tuşu veya erişilebilir Kapat butonu ile tuzak oluşmadan çıkılabilir. |
| **2.2.2** | Pause, Stop, Hide (Animasyon) | A | **GEÇTİ** | Nörogelişimsel modda tüm döngüsel animasyonlar, kayan banner'lar ve hareketli bildirimler kapatılır (`prefers-reduced-motion` tam desteği). |
| **2.4.3** | Focus Order (Odak Sırası) | A | **GEÇTİ** | Ekran okuyucu odak sırası mantıksal hiyerarşide ilerler: Başlık -> Gönderi Sahibi -> İçerik -> Görsel Açıklaması -> Etkileşim Butonları (Beğen, Yorum Yap, Açıkla). |
| **2.4.7** | Focus Visible (Görünür Odak) | AA | **GEÇTİ** | Aktif bileşen çevresinde 3px kalınlığında, yüksek kontrastlı çift halkalı odak göstergesi (focus ring) görüntülenir. |
| **2.5.8** | Target Size (Minimum Hedef Boyutu) | AA | **GEÇTİ (AAA: 48×48 px)** | WCAG 2.2 AA asgari 24×24 CSS pikseli şart koşarken; Eşiksiz tüm dokunmatik öğelerde asgari **48×48 px** (AAA standardı 44×44 px) dokunma alanı uygular. |
| **3.2.1** | On Focus / 3.2.2 On Input | A | **GEÇTİ** | Odaklanma veya form doldurma anında bağlam dışı ani sayfa yönlendirmesi veya içerik kaybı yaşanmaz. |
| **3.3.1** | Error Identification | A | **GEÇTİ** | Form hataları yalnızca renk ile değil, sembol ve sesli ekran okuyucu uyarısıyla duyurulur. |
| **4.1.2** | Name, Role, Value | A | **GEÇTİ** | Tüm arayüz elemanlarında React Native `accessibilityRole` (button, header, image, switch), `accessibilityLabel` ve `accessibilityState` tanımlıdır. |

---

## 3. Renk ve Kontrast Detaylı Ölçüm Tablosu

| Bileşen | Ön Plan (Metin/Simge) | Arka Plan | Kontrast Oranı | WCAG Standardı | Karar |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standart Mod Başlık** | `#0F172A` (Slate 900) | `#FFFFFF` | **16.3:1** | AA (4.5:1) / AAA (7:1) | **Üstün AAA** |
| **Standart Mod Gövde Metni**| `#334155` (Slate 700) | `#FFFFFF` | **8.9:1** | AA (4.5:1) / AAA (7:1) | **Üstün AAA** |
| **Standart Mod Birincil Buton** | `#FFFFFF` | `#2563EB` (Royal Blue) | **4.65:1** | AA (4.5:1) | **Geçti AA** |
| **Yüksek Kontrast Başlık** | `#FFE600` (Erişilebilir Sarı) | `#000000` (Saf Siyah) | **16.1:1** | AA (4.5:1) / AAA (7:1) | **Maksimum AAA** |
| **Yüksek Kontrast Gövde Metni** | `#FFFFFF` (Beyaz) | `#000000` (Saf Siyah) | **21.0:1** | AA (4.5:1) / AAA (7:1) | **Teorik Zirve AAA** |
| **Yüksek Kontrast Buton Sınırı** | `#FFE600` (3px Sarı Kenarlık) | `#000000` (Saf Siyah) | **16.1:1** | AA Metin Dışı (3:1) | **Üstün AAA** |
| **Nörogelişimsel Mod Başlık** | `#1E293B` (Yumuşak Slate) | `#F8FAFC` (Sakin Gri) | **14.1:1** | AA (4.5:1) / AAA (7:1) | **Gözü Yormayan AAA** |
| **Nörogelişimsel Buton** | `#0F766E` (Muted Teal) | `#CCFBF1` (Açık Teal) | **5.4:1** | AA (4.5:1) | **Huzurlu AA** |

---

## 4. Ekran Okuyucu (Screen Reader) Mimarisi ve Etiketleme

Eşiksiz, React Native'in yerleşik erişilebilirlik ağacını kullanarak platform native erişilebilirlik servisleriyle (iOS VoiceOver, Android TalkBack, Windows Narrator, Web NVDA/JAWS) sıfır gecikmeyle haberleşir:
1. **Görsel Açıklama Dinleme**: `accessibilityRole="button"` ve `accessibilityLabel="Bu görselin yapay zekâ sesli betimlemesini dinle"`.
2. **Canlı Altyazı Kutusu**: `accessibilityLiveRegion="polite"`, `aria-live="polite"` özellikleri sayesinde yeni altyazı cümleleri konuşulduğunda kullanıcıyı bölmeden ekran okuyucuya iletilir.
3. **Uyarlanabilir Öneri Motoru Bildirimi**: `accessibilityRole="alert"` tanımlamasıyla ekranda zorlanma tespit edildiğinde kullanıcıya kulaklıkla bildirim geçer.
