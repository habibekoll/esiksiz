// Türkçe Görsel Betimleme (Vision-Language), Ses/Ortam Betimlemesi (Sound Description) ve ASR Servisi

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Ayşe Yılmaz',
      handle: '@ayse_tekno',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    content: 'TEKNOFEST 2026 hazırlıklarımız hız kesmeden sürüyor! Sinaps Takımı olarak engelleri aşan bir sosyal medya deneyimi için kodluyoruz 🚀🇹🇷',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    aiDescription: 'Görselde modern bir çalışma alanında bir araya gelmiş genç bir yazılım ekibi görülüyor. İki kişi dizüstü bilgisayar ekranında kodları inceliyor, arka duvarda proje planlama şemaları ve renkli not kağıtları asılı.',
    // İşitme Engelliler İçin Çevresel ve Arka Plan Ses Betimlemeleri
    soundDescriptions: [
      '🎶 [Arka planda heyecan verici teknoloji festivali müziği çalıyor]',
      '⌨️ [Klavyede ritmik ve hızlı tuş vuruş sesleri duyuluyor]',
      '🗣️ [Genç yazılımcıların fikir alışverişi yaptığı heyecanlı fısıltılar]',
    ],
    videoUrl: null,
    captions: null,
    likes: 142,
    comments: 28,
    timestamp: '15 dk önce',
  },
  {
    id: 'post-2',
    author: {
      name: 'NSosyal Resmî',
      handle: '@nsosyal',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    },
    content: 'Tüm vatandaşlarımızın bilgiye eşit erişebildiği, kapsayıcı bir dijital kamusal alan inşa ediyoruz. Eşiksiz katmanı ile sosyal medya deneyiminde engeller kalkıyor!',
    image: null,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-close-up-43224-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    aiDescription: 'Videoda modern bir ofiste bilgisayar klavyesinde hızlıca kod yazan eller yakın plandan gösteriliyor.',
    // İşitme Engelliler İçin Altyazı + Ses Olayı Betimlemeleri
    soundDescriptions: [
      '🎵 [Yumuşak ve ilham verici bir yaylı çalgılar melodisi başlıyor]',
      '🎙️ [Konuşmacı sakin ve güven veren bir tonla hitap ediyor]',
      '👏 [Konuşma bitiminde salondan coşkulu alkış sesleri yükseliyor]',
    ],
    captions: [
      { start: 0, end: 3, text: '🎙️ Konuşmacı: NSosyal ailesine hoş geldiniz. [Hafif fon müziği]' },
      { start: 3, end: 7, text: '🎙️ Konuşmacı: Bugün herkes için eşit ve erişilebilir bir geleceği konuşuyoruz.' },
      { start: 7, end: 12, text: '🎙️ Konuşmacı: Eşiksiz katmanı ile engelleri tamamen kaldırıyoruz. [Alkış sesleri]' },
    ],
    likes: 580,
    comments: 94,
    timestamp: '1 saat önce',
  },
  {
    id: 'post-3',
    author: {
      name: 'Mehmet Demir',
      handle: '@mdemir_ist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    content: "İstanbul'da Boğaz'ın gün batımı manzarası her zamanki gibi büyüleyici. Herkesin bu güzelliği eşit paylaşabilmesi dileğiyle.",
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80',
    aiDescription: 'Görselde İstanbul Boğazı üzerinde batan güneşin oluşturduğu turuncu ve kızıl gökyüzü manzarası yer alıyor. Denizde seyreden vapurlar ve tarihi yarımadanın cami silüetleri net biçimde seçiliyor.',
    // İşitme Engelliler İçin Ortam Sesleri
    soundDescriptions: [
      '🚢 [Uzaktan yankılanan nostaljik bir vapur düdüğü sesi]',
      '🕊️ [Gökyüzünde süzülen martıların çığlık sesleri]',
      '🌊 [Kıyıya çarpan hafif ve huzurlu dalga sesleri]',
    ],
    videoUrl: null,
    captions: null,
    likes: 89,
    comments: 12,
    timestamp: '3 saat önce',
  },
];

export const AICaptionService = {
  generateAltTextForUpload: async (imageUri) => {
    await new Promise((res) => setTimeout(res, 500));
    return 'Görselde TEKNOFEST standında genç mühendisler erişilebilir sosyal medya prototipini tanıtmaktadır.';
  },
};
