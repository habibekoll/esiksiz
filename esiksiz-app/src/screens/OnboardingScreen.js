import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { Eye, Ear, Sparkles, LayoutGrid, ChevronRight, HandMetal, Volume2 } from 'lucide-react-native';

export const OnboardingScreen = ({ onComplete }) => {
  const { selectMode } = useAccessibility();
  const hasSpokenWelcomeRef = useRef(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (!hasSpokenWelcomeRef.current) {
      hasSpokenWelcomeRef.current = true;
      setTimeout(() => {
        SpeechService.speak(
          'Eşiksiz NSosyal\'e hoş geldiniz. Görme desteği modunu etkinleştirmek için ekrana iki kez dokunun, veya klavyede 1 tuşuna basın.'
        );
      }, 500);
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleKeyDown = (e) => {
        if (e.key === '1' || e.key === 'g' || e.key === 'G' || e.code === 'Space') {
          handleChooseMode(MODES.VISUAL);
        } else if (e.key === '2' || e.key === 'i' || e.key === 'İ') {
          handleChooseMode(MODES.HEARING);
        } else if (e.key === '3') {
          handleChooseMode(MODES.NEURO);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleChooseMode = (modeId) => {
    selectMode(modeId);
    onComplete();
  };

  const handleDoubleTapAnywhere = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 450) {
      handleChooseMode(MODES.VISUAL);
    }
    lastTapRef.current = now;
  };

  const playVoiceInstructions = () => {
    SpeechService.speak(
      'Seçim Menüsü: 1. Görme desteği modu, sesli görsel betimleme. 2. İşitme desteği modu, altyazı ve işaret dili. 3. Nörogelişimsel sakin mod, biyonik okuma ve odak cetveli. Seçmek için ekrana iki kez dokunun veya kartlara tıklayın.'
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTapAnywhere}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityRole="region"
        accessibilityLabel="Eşiksiz Evrensel Deneyim Seçim Ekranı. Görme moduna geçmek için ekrana iki kez dokunun."
      >
        {/* Şık Başlık Alanı */}
        <View style={styles.headerArea}>
          <Text style={styles.brandText}>
            N<Text style={{ color: '#2563EB' }}>Sosyal</Text>
          </Text>
          <Text style={styles.mainTitle}>Nasıl Bir Deneyim İstersiniz?</Text>
          <Text style={styles.subTitle}>
            İhtiyacınıza uygun modu seçin; uygulama anında o dünyanın kurallarına bürünsün.
          </Text>
        </View>

        {/* SESLİ ÇAĞRI BANNER'I */}
        <TouchableOpacity
          onPress={playVoiceInstructions}
          style={styles.voiceAssistantPrompt}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Seçenekleri sesli dinle"
        >
          <Volume2 size={18} color="#1D4ED8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.voicePromptTitle}>🔊 Sesli Yönlendirmeyi Dinle</Text>
            <Text style={styles.voicePromptSub}>
              Görme modu için ekrana 2 kez dokunun veya Boşluk tuşuna basın.
            </Text>
          </View>
        </TouchableOpacity>

        {/* 5 Evrensel Deneyim Kartı */}
        <View style={styles.optionsList}>
          {/* 1. GÖRME ENGELLİ / AZ GÖREN */}
          <TouchableOpacity
            onPress={() => handleChooseMode(MODES.VISUAL)}
            style={[styles.card, styles.cardVisual]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Görme Desteği Modu."
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconPill, { backgroundColor: '#FFE600' }]}>
                <Eye size={22} color="#000000" />
              </View>
              <View style={styles.tagYellow}>
                <Text style={styles.tagYellowText}>GÖRME DESTEĞİ</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: '#FFE600' }]}>
              Görme Desteği & Sesli Betimleme
            </Text>
            <Text style={[styles.cardDescription, { color: '#FFFFFF' }]}>
              Saf siyah zemin, canlı sarı ve beyaz yüksek kontrast. Karta tek dokunuşla yazar, metin ve yapay zekâ görsel açıklamasını kesintisiz dinleyin.
            </Text>
            <View style={styles.actionPromptRow}>
              <Text style={[styles.actionPromptText, { color: '#FFE600' }]}>Bu Modla Başla 👉</Text>
              <ChevronRight size={18} color="#FFE600" />
            </View>
          </TouchableOpacity>

          {/* 2. İŞİTME ENGELLİ & SAĞIR */}
          <TouchableOpacity
            onPress={() => handleChooseMode(MODES.HEARING)}
            style={[styles.card, styles.cardHearing]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="İşitme Desteği Modu."
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconPill, { backgroundColor: '#0284C7' }]}>
                <Ear size={22} color="#FFFFFF" />
              </View>
              <View style={styles.tagBlue}>
                <Text style={styles.tagBlueText}>İŞİTME DESTEĞİ</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: '#0369A1' }]}>
              İşitme Desteği & Ortam Sesleri
            </Text>
            <Text style={[styles.cardDescription, { color: '#334155' }]}>
              Duyulamayan çevresel seslerin (müzik, alkış, efektler) detaylı metin betimlemesi, altyazı ve Türk İşaret Dili (TİD) avatarı.
            </Text>
            <View style={styles.actionPromptRow}>
              <Text style={[styles.actionPromptText, { color: '#0284C7' }]}>Bu Modla Başla 👉</Text>
              <ChevronRight size={18} color="#0284C7" />
            </View>
          </TouchableOpacity>

          {/* 3. NÖROGELİŞİMSEL SAKİN MOD (DEHB / OTİZM) */}
          <TouchableOpacity
            onPress={() => handleChooseMode(MODES.NEURO)}
            style={[styles.card, styles.cardNeuro]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Nörogelişimsel Sakin Mod."
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconPill, { backgroundColor: '#0D9488' }]}>
                <Sparkles size={22} color="#FFFFFF" />
              </View>
              <View style={styles.tagTeal}>
                <Text style={styles.tagTealText}>SAKİN MOD</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: '#0F766E' }]}>
              Nörogelişimsel Sakin Mod (DEHB / Otizm)
            </Text>
            <Text style={[styles.cardDescription, { color: '#334155' }]}>
              Kelimelerin baş harflerini belirginleştiren Biyonik Okuma, satır takip cetveli ve duyusal yorgunluğu arındıran sade akış.
            </Text>
            <View style={styles.actionPromptRow}>
              <Text style={[styles.actionPromptText, { color: '#0D9488' }]}>Bu Modla Başla 👉</Text>
              <ChevronRight size={18} color="#0D9488" />
            </View>
          </TouchableOpacity>

          {/* 4. FİZİKSEL / MOTOR BECERİ */}
          <TouchableOpacity
            onPress={() => handleChooseMode(MODES.MOTOR)}
            style={[styles.card, styles.cardMotor]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Fiziksel ve Motor Beceri Modu."
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconPill, { backgroundColor: '#7C3AED' }]}>
                <HandMetal size={22} color="#FFFFFF" />
              </View>
              <View style={styles.tagPurple}>
                <Text style={styles.tagPurpleText}>KOLAY DOKUNMA</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: '#6B21A8' }]}>
              Fiziksel & Motor Beceri Desteği
            </Text>
            <Text style={[styles.cardDescription, { color: '#334155' }]}>
              Titreyen veya hareket kısıtı olan eller için geniş dokunma hedefleri, yüksek tıklama toleransı ve basitleştirilmiş arayüz.
            </Text>
            <View style={styles.actionPromptRow}>
              <Text style={[styles.actionPromptText, { color: '#7C3AED' }]}>Bu Modla Başla 👉</Text>
              <ChevronRight size={18} color="#7C3AED" />
            </View>
          </TouchableOpacity>

          {/* 5. STANDART NSOSYAL */}
          <TouchableOpacity
            onPress={() => handleChooseMode(MODES.STANDARD)}
            style={[styles.card, styles.cardStandard]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Standart NSosyal Deneyimi."
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconPill, { backgroundColor: '#64748B' }]}>
                <LayoutGrid size={22} color="#FFFFFF" />
              </View>
              <View style={styles.tagSlate}>
                <Text style={styles.tagSlateText}>STANDART</Text>
              </View>
            </View>
            <Text style={[styles.cardTitle, { color: '#1E293B' }]}>
              Standart NSosyal Modu
            </Text>
            <Text style={[styles.cardDescription, { color: '#475569' }]}>
              Sosyal medyanın varsayılan zengin içerik akışı ve modern etkileşim tasarımı.
            </Text>
            <View style={styles.actionPromptRow}>
              <Text style={[styles.actionPromptText, { color: '#475569' }]}>Bu Modla Başla 👉</Text>
              <ChevronRight size={18} color="#475569" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerArea: {
    marginBottom: 14,
  },
  brandText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  voiceAssistantPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  voicePromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  voicePromptSub: {
    fontSize: 11,
    color: '#1E3A8A',
    marginTop: 2,
    lineHeight: 15,
  },
  optionsList: {
    gap: 14,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
  },
  cardVisual: {
    backgroundColor: '#000000',
    borderColor: '#FFE600',
    borderWidth: 2,
  },
  cardHearing: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  cardNeuro: {
    backgroundColor: '#F0FDFA',
    borderColor: '#99F6E4',
  },
  cardMotor: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  cardStandard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagYellow: {
    backgroundColor: '#FFE600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagYellowText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  tagBlue: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBlueText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284C7',
  },
  tagTeal: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagTealText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F766E',
  },
  tagPurple: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagPurpleText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#7C3AED',
  },
  tagSlate: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagSlateText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionPromptText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
