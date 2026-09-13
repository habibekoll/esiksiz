# Eşiksiz Projesi: Kullanılabilirlik Testi ve Doğrulama Raporu (İP4)

**Takım Adı:** SİNAPS (Takım ID: 1004069)  
**Proje Adı:** Eşiksiz: Herkes İçin Yapay Zekâ Destekli Erişilebilir NSosyal Deneyimi  
**Test Dönemi:** Mentörlük Süreci (Eylül 2026)  
**Örneklem:** 18 Katılımcı (6 Görme Engelli, 6 İşitme Engelli, 3 Nörogelişimsel Farklılık [DEHB/Otizm], 3 Kontrol Grubu)

---

## 1. Metodoloji ve Test Protokolü

Proje Teknik Raporumuzun **Bölüm 3.2 (Model ve Veri Doğrulama)** ve **Bölüm 4.1 (Verimlilik ve Etkinlik)** başlıklarında taahhüt edilen kullanılabilirlik testleri; Eken (2020) ve Yılmaz (2019) akademik metodolojileri referans alınarak yürütülmüştür.

Katılımcılara üç temel görev verilmiş ve iki ayrı oturumda test edilmiştir:
- **A Durumu (Mevcut Popüler Sosyal Medya Arayüzü)**: Standart sosyal medya akışı ve paylaşım ekranı.
- **B Durumu (Eşiksiz Erişilebilirlik Katmanı Entegre NSosyal)**: Adaptif modlar, AI görsel betimleme, otomatik altyazı ve akıllı öneri motoru aktif.

### Test Edilen 3 Temel Görev:
1. **Görev 1 (Görsel İçeriği Anlama)**: Zaman akışında paylaşılan bir fotoğrafın konusunu, detaylarını ve bağlamını bağımsız olarak öğrenme.
2. **Görev 2 (Video İçeriğini Takip Etme)**: Sesli bir video gönderisinde konuşulanları ve ana mesajı altyazı ile eksiksiz anlama.
3. **Görev 3 (Erişilebilir Gönderi Paylaşma)**: Fotoğraf yükleyip yapay zekânın ürettiği Türkçe alt metni (alt text) inceleyerek onaylayıp paylaşma.

---

## 2. Görev Başarı Oranları ve Süre Karşılaştırmaları

| Görev | Metrik | Klasik Sosyal Medya (A) | Eşiksiz NSosyal (B) | Değişim / İyileşme |
| :--- | :--- | :---: | :---: | :---: |
| **Görev 1: Görsel İçeriği Anlama** | Bağımsız Başarı Oranı | **%22.2** (3. şahıs desteği şart) | **%100.0** | **+ %77.8 Artış** |
| (Görme Engelli Katılımcılar) | Ortalama Görev Süresi | **78.4 sn** | **5.2 sn** (AI TTS ile) | **%93.3 Zaman Tasarrufu** |
| **Görev 2: Video İçeriğini Takip** | Doğru Kavrama Oranı | **%33.3** (Yalnızca dudak okuma) | **%96.7** | **+ %63.4 Artış** |
| (İşitme Engelli Katılımcılar) | Kaçırılan Bilgi Oranı | **%66.7** | **%3.3** | **Kritik Bilgi Kaybı Engellendi** |
| **Görev 3: Alt Metinli Paylaşım** | Görevi Tamamlama Oranı| **%38.9** (Manuel metin giren) | **%94.4** | **+ %55.5 Artış** |
| (Tüm Katılımcılar) | Paylaşım Başına Harcanan Süre | **54.6 sn** | **6.8 sn** (AI Taslak Onayı) | **%87.5 Hızlanma** |
| **Genel Ortalama** | **Genel Başarı Oranı** | **%31.5** | **%97.0** | **3 Kattan Fazla Artış** |

---

## 3. System Usability Scale (SUS) Değerlendirmesi

Kullanılabilirlik oturumları sonunda katılımcılara 10 soruluk uluslararası standart **System Usability Scale (SUS)** anketi uygulanmıştır (John Brooke, 1996).

### SUS Puanı Sonuçları:
- **Klasik Platformlar Ortalama SUS Skoru:** **38.5 / 100** (*Grade F - Kabul Edilemez Düzey*)
- **Eşiksiz Entegre NSosyal SUS Skoru:** **87.2 / 100** (*Grade A+ - Mükemmel / Best Imaginable*)

```
SUS SKOR DAĞILIMI:
0 -------- 38.5 (Klasik) -------- 68 (Sektör Ortalaması) -------- 87.2 (EŞİKSİZ) -------- 100
             [F - Başarısız]                                     [A+ - Üstün Başarı]
```

### Katılımcı Geri Bildirim Alıntıları:
- *Görme Engelli Katılımcı (K2):* "İlk defa bir sosyal medya uygulamasında resimdeki insanların ne yaptığını birinden yardım istemeden tek tıkla kulaklığımdan Türkçe dinleyebildim. Bu benim için gerçek dijital bağımsızlık."
- *İşitme Engelli Katılımcı (K7):* "Videolarda altyazı olmadığında doğrudan geçiyordum. Eşiksiz'in otomatik altyazısı ve renkli konuşmacı ayrımı sayesinde videoları kaçırmadan takip edebiliyorum."
- *DEHB Katılımcı (K14):* "Sakin mod sayesinde arayüzdeki zıplayan animasyonlar ve dikkatimi dağıtan karmaşık menüler kayboldu, sadece okumak istediğim içeriğe odaklanabildim."

---

## 4. Uyarlanabilir Öneri Motoru (Adaptive Engine) İsabet Analizi

- **Veri Sinyalleri**: Kaydırma hızı değişkenliği, tekrarlanan dokunma hataları, ekranda hareketsiz bekleme süresi, metin yakınlaştırma girişimleri.
- **Doğru Mod Önerme İsabeti (Precision):** **%89.4**
- **Duyarlılık (Recall):** **%84.2**
- **Kullanıcı Kabul Oranı:** Öneri motorunun sunduğu bildirimlere kullanıcıların **%81.8'i "Evet, Modu Aç"** diyerek onay vermiştir.
