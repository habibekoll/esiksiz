import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Ear, Sparkles, LayoutGrid, ChevronRight, HandMetal, ShieldCheck } from 'lucide-react-native';

export const OnboardingScreen = ({ onComplete }) => {
  const { selectMode } = useAccessibility();

  const handleChooseMode = (modeId) => {
    selectMode(modeId);
    onComplete();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Eşiksiz Evrensel Deneyim Seçim Ekranı"
    >
      {/* Şık Başlık Alanı */}
      <View style={styles.headerArea}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>
            N<Text style={{ color: '#2563EB' }}>Sosyal</Text>
          </Text>
          <View style={styles.badgePill}>
            <ShieldCheck size={12} color="#2563EB" />
            <Text style={styles.badgePillText}>EŞİKSİZ ERİŞİLEBİLİRLİK</Text>
          </View>
        </View>

        <Text style={styles.mainTitle}>Nasıl Bir Deneyim İstersiniz?</Text>
        <Text style={styles.subTitle}>
          Seçtiğiniz profile göre uygulamanın tipografisi, renkleri ve etkileşim mantığı anında o dünyanın kurallarına bürünür.
        </Text>
      </View>

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
              <Text style={styles.tagYellowText}>16:1 KONTRAST</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: '#FFE600' }]}>
            Görme Desteği & Sesli Betimleme
          </Text>
          <Text style={[styles.cardDescription, { color: '#FFFFFF' }]}>
            Karta tek dokunuşla hem yazıyı hem görsel açıklamasını kesintisiz dinleyin. Saf siyah zemin üzerine canlı sarı ve beyaz yüksek kontrast.
          </Text>
          <View style={styles.actionPromptRow}>
            <Text style={[styles.actionPromptText, { color: '#FFE600' }]}>Bu Modla Başla</Text>
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
              <Text style={styles.tagBlueText}>ALTYAZI + TİD</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: '#0369A1' }]}>
            İşitme Desteği & Ortam Sesleri
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Duyulamayan çevresel seslerin (müzik, alkış, efektler) detaylı metin betimlemesi, senkronize altyazı ve Türk İşaret Dili (TİD) tercümanı.
          </Text>
          <View style={styles.actionPromptRow}>
            <Text style={[styles.actionPromptText, { color: '#0284C7' }]}>Bu Modla Başla</Text>
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
              <Text style={styles.tagTealText}>BIONIC READING</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: '#0F766E' }]}>
            Nörogelişimsel Sakin Mod (DEHB / Otizm)
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Kelimelerin baş harflerini kalınlaştıran Bionic Reading, odak cetveli, sıfır animasyon ve duyusal aşırı yükü arındıran sakinleştirilmiş arayüz.
          </Text>
          <View style={styles.actionPromptRow}>
            <Text style={[styles.actionPromptText, { color: '#0D9488' }]}>Bu Modla Başla</Text>
            <ChevronRight size={18} color="#0D9488" />
          </View>
        </TouchableOpacity>

        {/* 4. FİZİKSEL / MOTOR BECERİ (EL TİTREMESİ, PARKINSON) */}
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
              <Text style={styles.tagPurpleText}>DEV HEDEFLER 56PX</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: '#6D28D9' }]}>
            Fiziksel & Motor Beceri Desteği
          </Text>
          <Text style={[styles.cardDescription, { color: '#4C1D95' }]}>
            El titremesi ve ince motor kısıtları olan bireyler için genişletilmiş dev dokunma butonları ve yanlış dokunma filtrelemeli ergonomik arayüz.
          </Text>
          <View style={styles.actionPromptRow}>
            <Text style={[styles.actionPromptText, { color: '#7C3AED' }]}>Bu Modla Başla</Text>
            <ChevronRight size={18} color="#7C3AED" />
          </View>
        </TouchableOpacity>

        {/* 5. STANDART NSOSYAL GÖRÜNÜMÜ */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.STANDARD)}
          style={[styles.card, styles.cardStandard]}
          activeOpacity={0.85}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Standart NSosyal Görünümü."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#2563EB' }]}>
              <LayoutGrid size={22} color="#FFFFFF" />
            </View>
            <View style={styles.tagGray}>
              <Text style={styles.tagGrayText}>VARSAYILAN</Text>
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: '#0F172A' }]}>
            Standart Görünüm
          </Text>
          <Text style={[styles.cardDescription, { color: '#64748B' }]}>
            Varsayılan modern NSosyal sosyal medya akışı. Dilediğiniz an ayarlardan erişilebilirlik modlarını değiştirebilirsiniz.
          </Text>
          <View style={styles.actionPromptRow}>
            <Text style={[styles.actionPromptText, { color: '#2563EB' }]}>Bu Modla Başla</Text>
            <ChevronRight size={18} color="#2563EB" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginTop: 10,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePillText: {
    color: '#1E40AF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 19,
  },
  optionsList: {
    gap: 14,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardVisual: {
    backgroundColor: '#000000',
    borderColor: '#FFE600',
  },
  cardHearing: {
    backgroundColor: '#F0F9FF',
    borderColor: '#38BDF8',
  },
  cardNeuro: {
    backgroundColor: '#F0FDFA',
    borderColor: '#14B8A6',
  },
  cardMotor: {
    backgroundColor: '#FAF5FF',
    borderColor: '#C084FC',
  },
  cardStandard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagYellow: {
    backgroundColor: '#FFE600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagYellowText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
  },
  tagBlue: {
    backgroundColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagBlueText: {
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '900',
  },
  tagTeal: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagTealText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '900',
  },
  tagPurple: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagPurpleText: {
    color: '#6D28D9',
    fontSize: 10,
    fontWeight: '900',
  },
  tagGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagGrayText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  actionPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionPromptText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
