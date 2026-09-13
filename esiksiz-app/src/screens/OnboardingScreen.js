import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Ear, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react-native';

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
          İhtiyacınıza uygun modu seçtiğinizde uygulama tamamen o modun kurallarına göre çalışacaktır.
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
          accessibilityLabel="Görme Desteği Modu. Yazıyı ve görseli sesli dinleme, yüksek kontrast sarı-siyah arayüz."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#FFE600' }]}>
              <Eye size={24} color="#000000" />
            </View>
            <ArrowRight size={20} color="#FFE600" />
          </View>
          <Text style={[styles.cardTitle, { color: '#FFE600' }]}>
            Görme Desteği (Sesli Okuma & Betimleme)
          </Text>
          <Text style={[styles.cardDescription, { color: '#FFFFFF' }]}>
            Hem paylaşılan yazıyı hem de varsa görselin detaylı betimlemesini tek tıkla sesli dinleme imkânı. Saf siyah zemin ve 16:1 kontrastlı sarı tipografi.
          </Text>
        </TouchableOpacity>

        {/* 2. İŞİTME ENGELLİ (SAĞIR) */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.HEARING)}
          style={[styles.card, styles.cardHearing]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="İşitme Desteği Modu. Duyulamayan seslerin metin betimlemesi ve altyazı."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#0284C7' }]}>
              <Ear size={24} color="#FFFFFF" />
            </View>
            <ArrowRight size={20} color="#0284C7" />
          </View>
          <Text style={[styles.cardTitle, { color: '#0369A1' }]}>
            İşitme Desteği (Ses & Ortam Betimlemesi)
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Videolardaki konuşmaların yanı sıra duyamadığınız çevresel seslerin, müziklerin ve alkışların detaylı metin betimlemesi.
          </Text>
        </TouchableOpacity>

        {/* 3. NÖROGELİŞİMSEL SAKİN MOD (DEHB / OTİZM) */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.NEURO)}
          style={[styles.card, styles.cardNeuro]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Nörogelişimsel Sakin Mod. Bionic reading ve sakinleştirilmiş akış."
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconPill, { backgroundColor: '#0D9488' }]}>
              <Sparkles size={24} color="#FFFFFF" />
            </View>
            <ArrowRight size={20} color="#0D9488" />
          </View>
          <Text style={[styles.cardTitle, { color: '#0F766E' }]}>
            Nörogelişimsel Sakin (DEHB / Otizm)
          </Text>
          <Text style={[styles.cardDescription, { color: '#334155' }]}>
            Kelimelerin ilk harflerini kalınlaştıran Bionic Reading ile hızlı odaklanma, sıfır animasyon ve duyusal yükü azaltılmış sade akış.
          </Text>
        </TouchableOpacity>

        {/* 4. STANDART GÖRÜNÜM */}
        <TouchableOpacity
          onPress={() => handleChooseMode(MODES.STANDARD)}
          style={[styles.card, styles.cardStandard]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Standart NSosyal Modu."
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
            Varsayılan modern NSosyal akışı. Dilediğiniz an ayarlardan erişilebilirlik modunu değiştirebilirsiniz.
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
    marginTop: 14,
    marginBottom: 20,
  },
  appBrand: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  mainTitle: {
    fontSize: 21,
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
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
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
    marginBottom: 10,
  },
  iconPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
});
