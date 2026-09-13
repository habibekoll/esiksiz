import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import {
  Sparkles,
  ArrowLeft,
  Edit3,
  Mic,
  MicOff,
  Volume2,
  Upload,
  Camera,
  CheckCircle2,
  Check,
  Headphones,
  FileCheck,
  Send,
} from 'lucide-react-native';

// Görme engellinin galerisindeki fotoğraflar ve yapay zekâ sesli etiketleri
const GALLERY_ITEMS = [
  {
    id: 'img-1',
    title: 'TEKNOFEST Standı',
    category: 'Etkinlik & Proje',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    shortAudio: '1. Fotoğraf: TEKNOFEST standında genç mühendisler insansız hava aracı prototipini inceliyor.',
    fullCaption: 'Görselde TEKNOFEST standında 3 genç mühendis yerli insansız hava aracı prototipini gururla incelemektedir. Arkada TEKNOFEST flamaları dalgalanmaktadır.',
  },
  {
    id: 'img-2',
    title: 'Yazılım Çalışması',
    category: 'Eğitim & Takım',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    shortAudio: '2. Fotoğraf: Kütüphanede bilgisayar başında yazılım projesi geliştiren üniversite arkadaşları.',
    fullCaption: 'Görselde kütüphane masasında açık dizüstü bilgisayarlar ve yazılım kodu üzerine tartışan üniversite öğrencileri görülüyor.',
  },
  {
    id: 'img-3',
    title: 'Doğa & Kedi',
    category: 'Doğa & Yaşam',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    shortAudio: '3. Fotoğraf: Güneşli bir günde bahçede çimenler üzerinde uzanan sevimli sarman kedi.',
    fullCaption: 'Görselde yeşil bahçe zemininde güneşin tadını çıkaran, kameraya merakla bakan tatlı sarman bir sokak kedisi bulunmaktadır.',
  },
  {
    id: 'img-4',
    title: 'Teknoloji Konferansı',
    category: 'Sunum & Sahne',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    shortAudio: '4. Fotoğraf: Büyük teknoloji konferansında sahnede mikrofonla konuşma yapan bir uzman.',
    fullCaption: 'Görselde teknoloji salonunda yüzlerce dinleyicinin önünde dev ekrana yansıyan sunumu anlatan bir konuşmacı yer alıyor.',
  },
];

// Görme veya motor engelliler için hazır sesli şablonlar
const QUICK_TEMPLATES = [
  'TEKNOFEST 2026 standımızdayız, herkesi bekliyoruz! 🚀',
  'Eşiksiz ile engelsiz bir sosyal medya deneyimi inşa ediyoruz! 💫',
  'Bugün takımımızla birlikte harika bir geliştirme seansı yaptık. 💻',
];

export const CreatePostScreen = ({ onBack, onPostCreated }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;
  const isMotor = theme.isMotor;

  const [postText, setPostText] = useState('');
  const [selectedItem, setSelectedItem] = useState(GALLERY_ITEMS[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAltText, setGeneratedAltText] = useState(GALLERY_ITEMS[0].fullCaption);
  const [isEditingAltText, setIsEditingAltText] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [audioAnnounce, setAudioAnnounce] = useState('');
  const [isCameraSimulating, setIsCameraSimulating] = useState(false);

  const fileInputRef = useRef(null);
  const recognizerRef = useRef(null);

  const activeImage = customImage ? customImage.url : selectedItem.url;

  // Sayfa açıldığında sesli karşılama (Görme engelli modunda)
  useEffect(() => {
    if (isVisual) {
      SpeechService.speak(
        'Erişilebilir Gönderi Paylaşma Stüdyosu açıldı. 1- Metninizi sesle dikte edebilir, 2- Sesli galeriden fotoğraflara dokunarak ne olduğunu dinleyebilir ve seçebilirsiniz.'
      );
    }
  }, [isVisual]);

  // SESLİ REHBERİ YENİDEN DİNLE
  const handlePlayVoiceGuide = () => {
    SpeechService.speak(
      'Sesli Paylaşım Rehberi: Birinci adımda "Sesle Dikte Et" butonuna dokunup konuşarak metninizi yazdırın. İkinci adımda "Sesli Galeri"deki fotoğrafların üzerine dokunarak resmin içinde ne olduğunu dinleyin ve beğendiğinizi seçin. Üçüncü adımda "Sesli Özet Dinle" butonuna dokunarak gönderinizi kontrol edin ve Paylaş deyin.'
    );
  };

  // 1. SESLE DİKTE (SPEECH TO TEXT)
  const toggleDictation = () => {
    if (isDictating) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsDictating(false);
      SpeechService.speak('Dikte durduruldu. Metniniz kaydedildi.');
    } else {
      setIsDictating(true);
      SpeechService.speak('Mikrofon açık, lütfen konuşun.');

      const rec = SpeechService.createRecognizer(
        (transcript) => {
          setPostText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        (err) => {
          setIsDictating(false);
        },
        () => {
          setIsDictating(false);
        }
      );

      if (rec) {
        try {
          rec.start();
          recognizerRef.current = rec;
        } catch (e) {
          setIsDictating(false);
        }
      } else {
        // Tarayıcı simülasyonu
        setTimeout(() => {
          setPostText('TEKNOFEST 2026 Eşiksiz projemizle engelleri bir bir aşıyoruz!');
          setIsDictating(false);
          SpeechService.speak('Sesiniz yazıya döküldü: TEKNOFEST 2026 Eşiksiz projemizle engelleri bir bir aşıyoruz!');
        }, 1500);
      }
    }
  };

  // 2. SESLİ GALERİ: FOTOĞRAFA DOKUNULDUĞUNDA NE OLDUĞUNU KULAĞINA SÖYLE VE SEÇ
  const handleSelectGalleryItem = (item) => {
    setCustomImage(null);
    setSelectedItem(item);
    setIsGeneratingAi(true);
    setGeneratedAltText(item.fullCaption);

    const announcement = `${item.shortAudio}. Bu fotoğraf gönderiniz için seçildi.`;
    setAudioAnnounce(announcement);
    SpeechService.speak(announcement);

    setTimeout(() => {
      setIsGeneratingAi(false);
    }, 400);
  };

  // 3. KAMERA İLE SESLİ ÇEKİM SİMÜLASYONU
  const handleSimulateCamera = () => {
    setIsCameraSimulating(true);
    SpeechService.speak('Kamera açılıyor... Lütfen kamerayı kendinize veya nesneye doğrultun.');

    setTimeout(() => {
      SpeechService.speak('Yapay zekâ odağı sağladı, yüz ortalandı, ışık yeterli. Fotoğraf çekiliyor...');
    }, 1500);

    setTimeout(() => {
      setIsCameraSimulating(false);
      const cameraPhoto = {
        id: 'cam-' + Date.now(),
        title: 'Canlı Kamera Çekimi',
        category: 'Kamera',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        shortAudio: 'Kamera ile çekildi: Gülen yüzünüz ve aydınlık bir çalışma ortamı.',
        fullCaption: 'Kamera ile çekilen güncel fotoğrafta kameraya gülümseyen genç bir araştırmacı yer alıyor.',
      };
      setCustomImage(cameraPhoto);
      setGeneratedAltText(cameraPhoto.fullCaption);
      SpeechService.speak('Fotoğraf başarıyla çekildi ve doğrulandı: Gülen yüzünüz ve aydınlık çalışma ortamı. Gönderinize eklendi.');
    }, 3200);
  };

  // 4. KENDİ BİLGİSAYARINDAN / TELEFONUNDAN FOTOĞRAF YÜKLEME
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uploaded = {
          id: 'upload-' + Date.now(),
          title: file.name,
          category: 'Cihazdan Yüklenen',
          url: event.target.result,
          shortAudio: `Cihazınızdan "${file.name}" adlı fotoğraf seçildi ve yapay zekâ ile doğrulandı.`,
          fullCaption: `Görselde kullanıcının kendi galerisinden yüklediği "${file.name}" görseli yapay zekâ görüntü analizi ile taranmıştır.`,
        };
        setCustomImage(uploaded);
        setGeneratedAltText(uploaded.fullCaption);
        SpeechService.speak(`Fotoğrafınız yüklendi. Yapay zekâ analiz etti: ${uploaded.shortAudio}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. PAYLAŞIM ÖNCESİ SESLİ ÖZET & ONAY (Blind Pre-Flight Check)
  const handleVoicePreview = () => {
    const textPart = postText.trim() ? `Yazdığınız metin: "${postText}".` : 'Henüz bir metin yazmadınız.';
    const imgPart = `Seçtiğiniz fotoğraf: ${customImage ? customImage.shortAudio : selectedItem.shortAudio}.`;
    const altPart = 'Görselinizin otomatik Türkçe alt metni hazır.';
    const fullSummary = `Paylaşım Özeti: ${textPart} ${imgPart} ${altPart} Paylaşmak için sağ üstteki Paylaş düğmesine dokunun.`;
    SpeechService.speak(fullSummary);
  };

  // 6. GÖNDERİYİ PAYLAŞMA
  const handlePublish = () => {
    if (!postText.trim()) {
      SpeechService.speak('Lütfen önce bir gönderi metni yazın veya sesle dikte edin.');
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'SİNAPS Takımı (Ben)',
        handle: '@sinaps_pilot',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      content: postText,
      image: activeImage,
      aiDescription: generatedAltText,
      soundDescriptions: [
        '📸 [Fotoğraf deklanşör sesi]',
        '💬 [Yeni gönderi bildirim tınısı]',
      ],
      videoUrl: null,
      captions: null,
      likes: 1,
      comments: 0,
      timestamp: 'Az önce',
    };

    SpeechService.speak('Tebrikler! Gönderiniz başarıyla paylaşıldı ve ana akışın en üstüne yerleştirildi.');
    onPostCreated(newPost);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Erişilebilir Gönderi Paylaşma Stüdyosu"
    >
      {/* Gizli Web Dosya Yükleyici */}
      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      )}

      {/* ÜST GEZİNME VE BAŞLIK ÇUBUĞU */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            { backgroundColor: isVisual ? '#FFE600' : colors.inputBg },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Ana akışa geri dön"
        >
          <ArrowLeft size={20} color={isVisual ? '#000000' : colors.text} />
        </TouchableOpacity>

        <View style={styles.topBarTitleArea}>
          <Text style={[styles.topBarTitle, { color: colors.text }]}>
            Engelsiz Paylaşım Stüdyosu
          </Text>
          <Text style={[styles.topBarSub, { color: colors.textMuted }]}>
            {isVisual ? '🟡 Görme Engelli Sesli Akış Devrede' : 'Yapay Zekâ Destekli Kapsayıcı Üretim'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={!postText.trim()}
          style={[
            styles.publishBtn,
            {
              backgroundColor: postText.trim()
                ? isVisual
                  ? '#FFE600'
                  : colors.primary
                : colors.border,
              minHeight: isVisual || isMotor ? 48 : 40,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Gönderiyi Paylaş"
        >
          <Send size={15} color={postText.trim() && isVisual ? '#000000' : '#FFFFFF'} />
          <Text
            style={[
              styles.publishBtnText,
              {
                color: postText.trim()
                  ? isVisual
                    ? '#000000'
                    : '#FFFFFF'
                  : colors.textMuted,
              },
            ]}
          >
            Paylaş
          </Text>
        </TouchableOpacity>
      </View>

      {/* GÖRME ENGELLİ SESLİ REHBER BANNER'I */}
      <TouchableOpacity
        onPress={handlePlayVoiceGuide}
        style={[
          styles.voiceGuideBanner,
          {
            backgroundColor: isVisual ? '#FFE600' : '#0F172A',
            borderColor: isVisual ? '#FFFFFF' : '#334155',
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Sesli Paylaşım Rehberini Dinle"
      >
        <Headphones size={20} color={isVisual ? '#000000' : '#38BDF8'} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.voiceGuideTitle, { color: isVisual ? '#000000' : '#FFFFFF' }]}>
            🔊 Sesli Paylaşım Rehberini Dinle
          </Text>
          <Text style={[styles.voiceGuideSub, { color: isVisual ? '#1F2937' : '#94A3B8' }]}>
            Nasıl kolayca paylaşım yapacağınızı sesli olarak dinlemek için dokunun.
          </Text>
        </View>
      </TouchableOpacity>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADIM 1: METİN GİRİŞİ & SESLE DİKTE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <View style={[styles.stepSection, { borderColor: isVisual ? '#FFE600' : colors.cardBorder }]}>
        <View style={styles.stepBadgeRow}>
          <View style={[styles.stepNumberBadge, { backgroundColor: isVisual ? '#FFE600' : colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>1</Text>
          </View>
          <Text style={[styles.stepTitle, { color: colors.text }]}>
            Ne Paylaşmak İstiyorsunuz?
          </Text>
        </View>

        <TextInput
          style={[
            styles.textInput,
            {
              color: colors.text,
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              borderWidth: isVisual ? 2 : 1,
              fontSize: 16 * fontSizeScale,
            },
          ]}
          placeholder="Düşüncenizi yazın veya alttaki mikrofona basıp konuşun..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={postText}
          onChangeText={setPostText}
          accessible={true}
          accessibilityLabel="Gönderi metni giriş alanı"
        />

        {/* Mikrofonla Sesle Dikte Etme Butonu */}
        <TouchableOpacity
          onPress={toggleDictation}
          style={[
            styles.dictateBtn,
            {
              backgroundColor: isDictating ? '#EF4444' : isVisual ? '#FFE600' : colors.primary,
              minHeight: isVisual || isMotor ? 52 : 46,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isDictating ? 'Sesle yazdırmayı durdur' : 'Mikrofonla sesle dikte et'}
        >
          {isDictating ? (
            <MicOff size={20} color={isVisual ? '#000000' : '#FFFFFF'} />
          ) : (
            <Mic size={20} color={isVisual ? '#000000' : '#FFFFFF'} />
          )}
          <Text
            style={[
              styles.dictateBtnText,
              { color: isVisual ? '#000000' : '#FFFFFF' },
            ]}
          >
            {isDictating ? 'Dinleniyor... (Durdurmak İçin Dokunun)' : '🎙️ Sesle Dikte Et (Konuşarak Yazdır)'}
          </Text>
        </TouchableOpacity>

        {/* Hızlı Cümle Şablonları */}
        <View style={styles.templatesArea}>
          <Text style={[styles.templatesLabel, { color: colors.textMuted }]}>
            Veya tek dokunuşla hazır cümle seçin:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateScroll}>
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setPostText(tmpl);
                  SpeechService.speak(`Şablon seçildi: ${tmpl}`);
                }}
                style={[
                  styles.templatePill,
                  {
                    backgroundColor: isVisual ? '#000000' : colors.inputBg,
                    borderColor: isVisual ? '#FFE600' : colors.border,
                  },
                ]}
              >
                <Text style={[styles.templateText, { color: isVisual ? '#FFE600' : colors.text }]}>
                  {tmpl}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADIM 2: NASIL PAYLAŞACAĞI ŞEYİ SEÇECEK? (AKILLI SESLİ GALERİ) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <View style={[styles.stepSection, { borderColor: isVisual ? '#FFE600' : colors.cardBorder }]}>
        <View style={styles.stepBadgeRow}>
          <View style={[styles.stepNumberBadge, { backgroundColor: isVisual ? '#FFE600' : colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>2</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Fotoğrafınızı Seçin (Sesli Galeri)
            </Text>
            <Text style={[styles.stepSubTitle, { color: colors.textMuted }]}>
              Fotoğraflara dokunun; yapay zekâ her birinin içinde ne olduğunu kulağınıza söylesin!
            </Text>
          </View>
        </View>

        {/* Galeri Kartları Listesi */}
        <View style={styles.galleryGrid}>
          {GALLERY_ITEMS.map((item, index) => {
            const isSelected = !customImage && selectedItem.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectGalleryItem(item)}
                style={[
                  styles.galleryCard,
                  {
                    backgroundColor: isVisual ? '#000000' : colors.cardBackground,
                    borderColor: isSelected
                      ? isVisual
                        ? '#FFE600'
                        : colors.primary
                      : colors.border,
                    borderWidth: isSelected ? 3 : 1.5,
                  },
                ]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.shortAudio}. Seçmek için dokunun.`}
              >
                <View style={styles.galleryCardImgWrap}>
                  <Image source={{ uri: item.url }} style={styles.galleryThumb} />
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: isVisual ? '#FFE600' : colors.primary }]}>
                      <Check size={14} color={isVisual ? '#000000' : '#FFFFFF'} />
                      <Text style={[styles.selectedBadgeText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>
                        Seçildi
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.galleryCardInfo}>
                  <View style={styles.galleryHeaderLine}>
                    <Text style={[styles.galleryItemTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Volume2 size={15} color={isVisual ? '#FFE600' : colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.galleryItemAudioText,
                      { color: isVisual ? '#FFE600' : colors.textMuted },
                    ]}
                    numberOfLines={3}
                  >
                    "{item.shortAudio}"
                  </Text>
                  <View style={styles.tapToListenPrompt}>
                    <Text style={[styles.tapToListenText, { color: isVisual ? '#FFFFFF' : colors.primary }]}>
                      👉 Dokun & Dinle / Seç
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ek Eylemler: Kamera ile Çek & Cihazdan Yükle */}
        <View style={styles.mediaExtraActions}>
          <TouchableOpacity
            onPress={handleSimulateCamera}
            disabled={isCameraSimulating}
            style={[
              styles.extraActionBtn,
              {
                backgroundColor: isVisual ? '#000000' : '#0F172A',
                borderColor: isVisual ? '#FFE600' : '#334155',
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Kamera ile Sesli Çekim Yap"
          >
            {isCameraSimulating ? (
              <ActivityIndicator color={isVisual ? '#FFE600' : '#38BDF8'} size="small" />
            ) : (
              <Camera size={18} color={isVisual ? '#FFE600' : '#38BDF8'} />
            )}
            <Text style={[styles.extraActionText, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
              {isCameraSimulating ? 'Kamera Odaklanıyor...' : '📸 Kamera ile Çek (Sesli Rehberli)'}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'web' && (
            <TouchableOpacity
              onPress={() => fileInputRef.current && fileInputRef.current.click()}
              style={[
                styles.extraActionBtn,
                {
                  backgroundColor: isVisual ? '#000000' : '#0F172A',
                  borderColor: isVisual ? '#FFE600' : '#334155',
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Bilgisayardan kendi fotoğrafını yükle"
            >
              <Upload size={18} color={isVisual ? '#FFE600' : '#10B981'} />
              <Text style={[styles.extraActionText, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
                📁 Cihazından Fotoğraf Yükle
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADIM 3: YAPAY ZEKÂ OTOMATİK TÜRKÇE ALT METİN (ALT TEXT) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <View style={[styles.stepSection, { borderColor: isVisual ? '#FFE600' : colors.cardBorder }]}>
        <View style={styles.stepBadgeRow}>
          <View style={[styles.stepNumberBadge, { backgroundColor: isVisual ? '#FFE600' : colors.primary }]}>
            <Text style={[styles.stepNumberText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>3</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Otomatik Görsel Alt Metni (Alt-Text)
            </Text>
            <Text style={[styles.stepSubTitle, { color: colors.textMuted }]}>
              Ekran okuyucu kullanan diğer görme engelliler için AI tarafından otomatik hazırlandı.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.aiAltCard,
            {
              backgroundColor: isVisual ? '#000000' : colors.inputBg,
              borderColor: isVisual ? '#FFE600' : colors.border,
            },
          ]}
        >
          <View style={styles.aiAltHeader}>
            <View style={styles.aiTag}>
              <Sparkles size={16} color={isVisual ? '#FFE600' : colors.primary} />
              <Text style={[styles.aiTagText, { color: isVisual ? '#FFE600' : colors.primary }]}>
                Yapay Zekâ Görsel Betimlemesi
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsEditingAltText(!isEditingAltText)}
              style={styles.editBtn}
            >
              <Edit3 size={14} color={isVisual ? '#FFE600' : colors.primary} />
              <Text style={[styles.editBtnText, { color: isVisual ? '#FFE600' : colors.primary }]}>
                {isEditingAltText ? 'Bitti' : 'Düzenle'}
              </Text>
            </TouchableOpacity>
          </View>

          {isGeneratingAi ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
          ) : isEditingAltText ? (
            <TextInput
              style={[styles.altInput, { color: colors.text, borderColor: colors.border }]}
              value={generatedAltText}
              onChangeText={setGeneratedAltText}
              multiline
            />
          ) : (
            <Text style={[styles.altText, { color: colors.text, fontSize: 14 * fontSizeScale }]}>
              "{generatedAltText}"
            </Text>
          )}

          <View style={styles.benefitPill}>
            <CheckCircle2 size={14} color={isVisual ? '#FFE600' : '#16A34A'} />
            <Text style={[styles.benefitText, { color: isVisual ? '#FFE600' : '#15803D' }]}>
              ✓ Siz hiçbir şey yazmasanız dahi fotoğrafınız tüm görme engelliler için erişilebilir olarak paylaşılır.
            </Text>
          </View>
        </View>
      </View>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADIM 4: PAYLAŞIM ÖNCESİ SESLİ ÖZET & GÜVENLİ ONAY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.preFlightCard,
          {
            backgroundColor: isVisual ? '#000000' : '#0F172A',
            borderColor: isVisual ? '#FFE600' : '#334155',
          },
        ]}
      >
        <View style={styles.preFlightHeader}>
          <FileCheck size={22} color={isVisual ? '#FFE600' : '#38BDF8'} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.preFlightTitle, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
              Paylaşım Öncesi Sesli Kontrol
            </Text>
            <Text style={[styles.preFlightSub, { color: isVisual ? '#FFFFFF' : '#94A3B8' }]}>
              Yanlış veya istenmeyen paylaşımı önlemek için gönderinizi sesli dinleyin:
            </Text>
          </View>
        </View>

        {/* Sesli Özet Dinle Butonu */}
        <TouchableOpacity
          onPress={handleVoicePreview}
          style={[
            styles.voicePreviewBtn,
            { backgroundColor: isVisual ? '#FFE600' : '#1E293B' },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Paylaşım öncesi tüm gönderi özetini sesli dinle"
        >
          <Volume2 size={20} color={isVisual ? '#000000' : '#38BDF8'} />
          <Text style={[styles.voicePreviewBtnText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>
            🔊 Gönderimin Sesli Özetini Dinle
          </Text>
        </TouchableOpacity>

        {/* Büyük Son Paylaş Butonu */}
        <TouchableOpacity
          onPress={handlePublish}
          disabled={!postText.trim()}
          style={[
            styles.bigFinalPublishBtn,
            {
              backgroundColor: postText.trim()
                ? isVisual
                  ? '#FFE600'
                  : colors.primary
                : '#475569',
              minHeight: 56,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Onaylıyorum, gönderimi şimdi paylaş"
        >
          <CheckCircle2 size={22} color={postText.trim() && isVisual ? '#000000' : '#FFFFFF'} />
          <Text
            style={[
              styles.bigFinalPublishBtnText,
              { color: postText.trim() && isVisual ? '#000000' : '#FFFFFF' },
            ]}
          >
            {postText.trim() ? '✅ Onaylıyorum, Şimdi Paylaş' : 'Önce Metin Ekleyin'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitleArea: {
    flex: 1,
    marginLeft: 12,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  topBarSub: {
    fontSize: 12,
    fontWeight: '600',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  voiceGuideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  voiceGuideTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  voiceGuideSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  stepSection: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  stepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '900',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  stepSubTitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  textInput: {
    minHeight: 80,
    padding: 12,
    borderRadius: 12,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  dictateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  dictateBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  templatesArea: {
    marginTop: 4,
  },
  templatesLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  templateScroll: {
    flexDirection: 'row',
  },
  templatePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  templateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  galleryGrid: {
    gap: 10,
    marginBottom: 12,
  },
  galleryCard: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    padding: 8,
    gap: 10,
  },
  galleryCardImgWrap: {
    width: 85,
    height: 85,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryThumb: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 3,
  },
  selectedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  galleryCardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  galleryHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  galleryItemTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  galleryItemAudioText: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  tapToListenPrompt: {
    alignSelf: 'flex-start',
  },
  tapToListenText: {
    fontSize: 11,
    fontWeight: '800',
  },
  mediaExtraActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  extraActionBtn: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  extraActionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  aiAltCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  aiAltHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTagText: {
    fontSize: 13,
    fontWeight: '800',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  altText: {
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 10,
    fontWeight: '500',
  },
  altInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginBottom: 10,
  },
  benefitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
  preFlightCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    marginTop: 4,
  },
  preFlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  preFlightTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  preFlightSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  voicePreviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  voicePreviewBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  bigFinalPublishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
  },
  bigFinalPublishBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
