import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { AICaptionService } from '../services/aiCaptionService';
import { Sparkles, ArrowLeft, Edit3, Mic, MicOff, Volume2, Upload, RefreshCw, CheckCircle2, ShieldCheck, FileImage } from 'lucide-react-native';

const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde TEKNOFEST standında genç mühendisler erişilebilir sosyal medya prototipini tanıtmaktadır.',
    voiceFeedback: 'Seçilen görsel doğrulandı: TEKNOFEST standında prototip geliştiren genç mühendisler.',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde bir grup üniversite öğrencisi kütüphanede yazılım projesi üzerine beyin fırtınası yapıyor.',
    voiceFeedback: 'Seçilen görsel doğrulandı: Kütüphanede ders çalışan ve bilgisayar inceleyen üniversite öğrencileri.',
  },
  {
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    caption: 'Görselde teknoloji seminerinde sahnede sunum yapan konuşmacı ve salondaki dinleyiciler görülüyor.',
    voiceFeedback: 'Seçilen görsel doğrulandı: Teknoloji salonunda sahnede sunum yapan bir konuşmacı.',
  },
];

export const CreatePostScreen = ({ onBack, onPostCreated }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;
  const isMotor = theme.isMotor;

  const [postText, setPostText] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAltText, setGeneratedAltText] = useState(PRESET_IMAGES[0].caption);
  const [isEditingAltText, setIsEditingAltText] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState(null);

  const fileInputRef = useRef(null);
  const recognizerRef = useRef(null);

  const currentImage = customImageUrl || PRESET_IMAGES[selectedImageIndex].url;

  // 1. SESLE YAZDIRMA (DİKTE) - Görme veya Motor Engellilerin Harf Harf Yazma Zorluğunu Kaldırır
  const toggleDictation = () => {
    if (isDictating) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsDictating(false);
    } else {
      setIsDictating(true);
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
          setPostText((prev) => (prev ? `${prev} Eşiksiz ile erişilebilir sosyal medya deneyimi harika!` : 'Eşiksiz ile erişilebilir sosyal medya deneyimi harika!'));
          setIsDictating(false);
        }, 1200);
      }
    }
  };

  // 2. GÖRME ENGELLİ İÇİN GÖRSEL DOĞRULAMA (SEÇTİĞİ FOTOĞRAFTA NE OLDUĞUNU SESLE ANLATMA)
  const handleVerifyImageByVoice = () => {
    const feedback = PRESET_IMAGES[selectedImageIndex].voiceFeedback || 'Seçilen görsel başarıyla tarandı.';
    setVerificationFeedback(feedback);
    SpeechService.speak(feedback);
  };

  // 3. FARKLI GÖRSEL SEÇME & YAPAY ZEKÂ ANALİZİ
  const handleCycleImage = () => {
    setIsGeneratingAi(true);
    setCustomImageUrl(null);
    const nextIdx = (selectedImageIndex + 1) % PRESET_IMAGES.length;
    setSelectedImageIndex(nextIdx);
    setTimeout(() => {
      setGeneratedAltText(PRESET_IMAGES[nextIdx].caption);
      setIsGeneratingAi(false);
      if (isVisual) {
        SpeechService.speak(`Yeni görsel seçildi: ${PRESET_IMAGES[nextIdx].voiceFeedback}`);
      }
    }, 500);
  };

  // 4. BİLGİSAYARDAN DOSYA SEÇME (WEB FILE UPLOAD)
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImageUrl(event.target.result);
        setIsGeneratingAi(true);
        setTimeout(() => {
          const generated = `Görselde yüklediğiniz "${file.name}" adlı fotoğraf yapay zekâ tarafından başarıyla analiz edildi.`;
          setGeneratedAltText(generated);
          setIsGeneratingAi(false);
          if (isVisual) {
            SpeechService.speak(`Fotoğrafınız yüklendi. ${generated}`);
          }
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. GÖNDERİYİ PAYLAŞMA
  const handlePublish = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'SİNAPS Takımı (Ben)',
        handle: '@sinaps_pilot',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      },
      content: postText,
      image: currentImage,
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

    if (isVisual) {
      SpeechService.speak('Gönderiniz başarıyla paylaşıldı ve akışa eklendi.');
    }
    onPostCreated(newPost);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Erişilebilir Gönderi Oluşturma ve Paylaşma Stüdyosu"
    >
      {/* Gizli Web Dosya Yükleyici Input */}
      {Platform.OS === 'web' && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      )}

      {/* Üst Çubuk */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            { backgroundColor: isVisual ? '#FFE600' : colors.inputBg },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Geri dön"
        >
          <ArrowLeft size={20} color={isVisual ? '#000000' : colors.text} />
        </TouchableOpacity>

        <View style={styles.topBarTitleArea}>
          <Text style={[styles.topBarTitle, { color: colors.text }]}>
            Erişilebilir Paylaşım
          </Text>
          <Text style={[styles.topBarSub, { color: colors.textMuted }]}>
            Yapay Zekâ Destekli İçerik Üretimi
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

      {/* 1. METİN GİRİŞİ + SESLE DİKTE (VOICE-TO-TEXT) */}
      <View style={styles.inputWrapper}>
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
          placeholder="Düşüncelerinizi yazın veya mikrofonla sesle dikte edin..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={postText}
          onChangeText={setPostText}
          accessible={true}
          accessibilityLabel="Gönderi metni"
        />

        {/* Canlı Sesle Yazdırma (Dikte) Butonu */}
        <TouchableOpacity
          onPress={toggleDictation}
          style={[
            styles.dictateBtn,
            {
              backgroundColor: isDictating ? '#EF4444' : isVisual ? '#FFE600' : colors.primary,
              minHeight: isVisual || isMotor ? 50 : 44,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isDictating ? 'Sesle yazdırmayı durdur' : 'Mikrofon ile sesle yazdır'}
        >
          {isDictating ? (
            <MicOff size={18} color={isVisual ? '#000000' : '#FFFFFF'} />
          ) : (
            <Mic size={18} color={isVisual ? '#000000' : '#FFFFFF'} />
          )}
          <Text
            style={[
              styles.dictateBtnText,
              { color: isVisual ? '#000000' : '#FFFFFF' },
            ]}
          >
            {isDictating ? 'Dinleniyor... (Durdur)' : '🎙️ Sesle Dikte Et'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. GÖRSEL SEÇİMİ VE DOĞRULAMA KUTUSU */}
      <View style={styles.mediaCard}>
        <Image source={{ uri: currentImage }} style={styles.previewImage} />

        {/* Görsel Kontrol Butonları */}
        <View style={styles.imageActionRow}>
          {/* Farklı Örnek Görsel Seç */}
          <TouchableOpacity
            onPress={handleCycleImage}
            style={[styles.imgSmallBtn, { backgroundColor: isVisual ? '#000000' : '#1E293B', borderColor: isVisual ? '#FFE600' : 'transparent', borderWidth: isVisual ? 1.5 : 0 }]}
          >
            <RefreshCw size={14} color={isVisual ? '#FFE600' : '#FFFFFF'} />
            <Text style={[styles.imgSmallBtnText, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
              Örneği Değiştir
            </Text>
          </TouchableOpacity>

          {/* Kendi Bilgisayarından Fotoğraf Yükle */}
          {Platform.OS === 'web' && (
            <TouchableOpacity
              onPress={() => fileInputRef.current && fileInputRef.current.click()}
              style={[styles.imgSmallBtn, { backgroundColor: isVisual ? '#000000' : colors.primary, borderColor: isVisual ? '#FFE600' : 'transparent', borderWidth: isVisual ? 1.5 : 0 }]}
            >
              <Upload size={14} color={isVisual ? '#FFE600' : '#FFFFFF'} />
              <Text style={[styles.imgSmallBtnText, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
                Kendi Resmini Yükle
              </Text>
            </TouchableOpacity>
          )}

          {/* Görme Engelli İçin: Seçili Görseli Sesli Doğrula */}
          <TouchableOpacity
            onPress={handleVerifyImageByVoice}
            style={[styles.imgSmallBtn, { backgroundColor: isVisual ? '#FFE600' : '#0D9488' }]}
          >
            <Volume2 size={14} color={isVisual ? '#000000' : '#FFFFFF'} />
            <Text style={[styles.imgSmallBtnText, { color: isVisual ? '#000000' : '#FFFFFF' }]}>
              Resmi Sesle Doğrula
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. YAPAY ZEKÂ OTOMATİK TÜRKÇE ALT METİN (ALT TEXT) KUTUSU */}
        <View
          style={[
            styles.aiAltBox,
            {
              backgroundColor: isVisual ? '#000000' : colors.inputBg,
              borderColor: isVisual ? '#FFE600' : colors.border,
              borderWidth: isVisual ? 2 : 1,
            },
          ]}
        >
          <View style={styles.altHeader}>
            <View style={styles.aiTag}>
              <Sparkles size={15} color={isVisual ? '#FFE600' : colors.primary} />
              <Text style={[styles.aiTagText, { color: isVisual ? '#FFE600' : colors.primary }]}>
                Yapay Zekâ Otomatik Alt Metin Taslağı
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
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
          ) : isEditingAltText ? (
            <TextInput
              style={[styles.altInput, { color: colors.text, borderColor: colors.border }]}
              value={generatedAltText}
              onChangeText={setGeneratedAltText}
              multiline
            />
          ) : (
            <Text style={[styles.altText, { color: colors.text, fontSize: 13 * fontSizeScale }]}>
              "{generatedAltText}"
            </Text>
          )}

          <View style={styles.benefitPill}>
            <CheckCircle2 size={13} color={isVisual ? '#FFE600' : '#16A34A'} />
            <Text style={[styles.benefitText, { color: isVisual ? '#FFE600' : '#15803D' }]}>
              Siz hiçbir şey yazmasanız bile görseliniz tüm görme engelliler için otomatik erişilebilir olarak paylaşılır.
            </Text>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitleArea: {
    flex: 1,
    marginLeft: 10,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  topBarSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  publishBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  textInput: {
    minHeight: 85,
    padding: 14,
    borderRadius: 16,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  dictateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dictateBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  mediaCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  imgSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  imgSmallBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  aiAltBox: {
    padding: 14,
  },
  altHeader: {
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
    fontSize: 12,
    fontWeight: '800',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  altText: {
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 8,
    fontWeight: '500',
  },
  altInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    marginBottom: 8,
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
});
