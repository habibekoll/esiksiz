import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react-native';

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
      accessibilityLabel="Eşiksiz Deneyim ve Mod Belirleme Ekranı"
    >
      <View style={styles.headerArea}>
        <Text style={styles.appBrand}>
          N<Text style={{ color: '#2563EB' }}>Sosyal</Text>
        </Text>
        <Text style={styles.mainTitle}>Size En Uygun Deneyimi Seçin</Text>
        <Text style={styles.subTitle}>
          Uygulama seçtiğiniz ihtiyaca göre anında şekillenecek ve tüm deneyim bu modda devam edecektir.
        </Text>
      </View>

      {/* 4 Ana Seçenek Kartı */}
      <View style={styles.optionsList}>
        {/* 1. GÖRME ENGELLİ / AZ GÖREN */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.VISUAL)}
          style={[styles.card, styles.cardVisual]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Görme Desteği Modu. 16'ya 1 Yüksek kontrast sarı ve siyah, büyük butonlar ve sesli görsel açıklaması."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#FFE600' }]}>
              <Eye size={24} color="#000000" />
            </View>
            <ArrowRight size={20} color="#FFE600" />
          </View>
          <Text style={[styles.cardTitle, { color: '#FFE600' }]}>
            Görme Desteği & Yüksek Kontrast
          </Text>
          <Text style={[styles.cardDescription, { color: '#FFFFFF' }]}>
            Saf siyah arkaplan, canlı sarı vurgular (16:1), büyük dokunmatik hedefler ve yapay zekâ sesli görsel açıklaması.
          </Text>
        </TouchableOpacity>

        {/* 2. İŞİTME ENGELLİ */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.HEARING)}
          style={[styles.card, styles.cardHearing]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="İşitme Desteği Modu. Sürekli açık Türkçe altyazı ve görsel uyarılar."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#0284C7' }]}>
              <Volume2 size={24} color="#FFFFFF" />
            </View>
            <ArrowRight size={20} color="#0284C7" />
          </View>
          <Text style={[styles.cardTitle, { color: '#0369A1' }]}>
            İşitme Desteği & Altyazı
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Tüm video ve seslerde senkronize Türkçe altyazı şeridi ve sesli olaylar için görsel uyarılar.
          </Text>
        </TouchableOpacity>

        {/* 3. NÖROGELİŞİMSEL SAKİN MOD (DEHB / OTİZM) */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.NEURO)}
          style={[styles.card, styles.cardNeuro]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Nörogelişimsel Sakin Mod. DEHB ve Otizm için Bionic Reading, sıfır animasyon ve sade akış."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#0D9488' }]}>
              <Sparkles size={24} color="#FFFFFF" />
            </View>
            <ArrowRight size={20} color="#0D9488" />
          </View>
          <Text style={[styles.cardTitle, { color: '#0F766E' }]}>
            Nörogelişimsel Sakin Mod (DEHB / Otizm)
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Bionic Reading ile hızlı odaklanma, hareketli animasyonların dondurulması ve duyusal yükü azaltılmış arayüz.
          </Text>
        </TouchableOpacity>

        {/* 4. STANDART NSOSYAL MODU */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.STANDARD)}
          style={[styles.card, styles.cardStandard]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Standart NSosyal Modu. Varsayılan modern sosyal medya arayüzü."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#2563EB' }]}>
              <LayoutGrid size={24} color="#FFFFFF" />
            </View>
            <ArrowRight size={20} color="#2563EB" />
          </View>
          <Text style={[styles.cardTitle, { color: '#0F172A' }]}>
            Standart Görünüm
          </Text>
          <Text style={[styles.cardDescription, { color: '#64748B' }]}>
            Varsayılan modern NSosyal arayüzü. Dilediğiniz zaman ayarlardan erişilebilirlik moduna geçebilirsiniz.
          </Text>
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
    marginTop: 16,
    marginBottom: 24,
  },
  appBrand: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
  },
  optionsList: {
    gap: 14,
  },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
    minHeight: 110,
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
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
