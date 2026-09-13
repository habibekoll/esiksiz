// Uyarlanabilir Öneri Motoru (Adaptive Recommendation Engine)
// Kullanıcının etkileşim örüntülerini (kaydırma dalgalanmaları, arayüzde zorlanma, tereddüt)
// analiz ederek proaktif olarak en uygun erişilebilirlik modunu teklif eder.

export class AdaptiveEngine {
  constructor(onSuggestion) {
    this.onSuggestion = onSuggestion;
    this.tapHistory = [];
    this.isTriggered = false;
  }

  // Kullanıcı dokunma etkileşimini kaydet
  recordTap(x, y) {
    const now = Date.now();
    this.tapHistory.push({ time: now, x, y });

    // Son 3 saniyedeki dokunmaları filtrele
    this.tapHistory = this.tapHistory.filter((t) => now - t.time < 3000);

    // Kural 1: Kullanıcı 3 saniye içinde aynı bölgede 3'ten fazla tıklama yaparsa (hedefi bulamama / zorlanma)
    if (this.tapHistory.length >= 3 && !this.isTriggered) {
      const first = this.tapHistory[0];
      const distance = Math.hypot(x - first.x, y - first.y);
      if (distance < 60) {
        this.triggerSuggestion({
          type: 'high_contrast',
          mode: 'visual',
          title: 'Arayüzü Okumakta Zorlanıyor Musunuz?',
          message: 'Yüksek Kontrast ve Büyük Yazı Modu (16:1 kontrast) metinleri çok daha rahat okumanızı sağlar. Şimdi etkinleştirelim mi?',
          actionText: 'Yüksek Kontrasta Geç',
        });
      }
    }
  }

  // Jüri Sunumu ve Canlı Demo İçin Simülasyon Tetikleyicileri
  simulateVisualStruggle() {
    this.triggerSuggestion({
      type: 'high_contrast',
      mode: 'visual',
      title: 'Okunabilirlik Desteği Önerisi',
      message: 'Arayüzdeki metinleri daha rahat seçebilmeniz için Yüksek Kontrast Modunu (16:1) etkinleştirelim mi?',
      actionText: 'Yüksek Kontrasta Geç',
    });
  }

  simulateSensoryOverload() {
    this.triggerSuggestion({
      type: 'reduced_motion',
      mode: 'neuro',
      title: 'Daha Sakin Bir Akış İster Misiniz?',
      message: 'Hızlı hareketler ve görsel yoğunluk dikkatinizi dağıtıyorsa, Nörogelişimsel Sakin Mod ile sadeleşebilirsiniz.',
      actionText: 'Sakin Moda Geç',
    });
  }

  simulateHearingNeed() {
    this.triggerSuggestion({
      type: 'captions',
      mode: 'hearing',
      title: 'Videoları Altyazıyla Takip Edin',
      message: 'Sesleri kaçırmamak için otomatik Türkçe altyazı ve görsel uyarı sistemini açmak ister misiniz?',
      actionText: 'Altyazıyı Aç',
    });
  }

  triggerSuggestion(suggestion) {
    this.isTriggered = true;
    if (this.onSuggestion) {
      this.onSuggestion(suggestion);
    }
  }

  reset() {
    this.isTriggered = false;
    this.tapHistory = [];
  }
}
