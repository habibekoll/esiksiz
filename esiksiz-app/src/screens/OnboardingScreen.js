import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, LayoutGrid, ArrowRight, ShieldCheck } from 'lucide-react-native';

export const OnboardingScreen = ({ onComplete }) => {
  const { setMode, setAdaptiveEngineActive } = useAccessibility();

  const handleSelectMode = (modeId) => {
    setMode(modeId);
    setAdaptiveEngineActive(true);
    onComplete();
  };

  const handleSmartAdaptive = () => {
    setMode(MODES.STANDARD);
    setAdaptiveEngineActive(true);
    onComplete();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Eşiksiz Karşılama ve İhtiyaç Belirleme Ekranı"
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <ShieldCheck size={16} color="#2563EB" />
          <Text style={styles.badgeText}>TEKNOFEST 2026 SOSYAL İNOVASYON</Text>
        </View>
        <Text style={styles.title}>
          Hoş Geldiniz, <Text style={styles.titleAccent}>Eşiksiz</Text> NSosyal
        </Text>
        <Text style={styles.subtitle}>
          Sosyal medyayı engelsiz ve eşit koşullarda kullanmanız için size en uygun deneyim modunu seçin veya akıllı motorumuza bırakın.
        </Text>
      </View>

      {/* Akıllı Öneri ile Devam Et Butonu */}
      <TouchableOpacity
        onPress={handleSmartAdaptive}
        style={styles.smartButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Akıllı öneri ile başla. Davranışlarınıza göre en uygun modu Eşiksiz proaktif olarak önerir."
      >
        <View style={styles.smartIconBox}>
          <Sparkles size={24} color="#FFFFFF" />
        </View>
        <View style={styles.smartTextContainer}>
          <Text style={styles.smartTitle}>🤖 Akıllı Öneri ile Başla (Tavsiye Edilen)</Text>
          <Text style={styles.smartDesc}>
            Uygulamayı kullanırken davranışlarınızı anonim analiz eder, ihtiyacınız olduğunda doğru modu teklif eder.
          </Text>
        </View>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.dividerText}>VEYA DOĞRUDAN BİR MOD SEÇİN</Text>

      {/* Mod Seçenekleri Kartları */}
      <View style={styles.cardsGrid}>
        <TouchableOpacity
          onPress={() => handleSelectMode(MODES.VISUAL)}
          style={[styles.card, { borderColor: '#FFE600', backgroundColor: '#000000' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Görme Engelli ve Az Gören Modu. Saf siyah zemin, 16'ya 1 sarı kontrast, sesli görsel betimleme."
        >
          <Eye size={28} color="#FFE600" />
          <Text style={[styles.cardTitle, { color: '#FFE600' }]}>Görme Engelli / Az Gören</Text>
          <Text style={[styles.cardDesc, { color: '#FFFFFF' }]}>
            Yüksek kontrast (Saf Siyah / Sarı), büyük dokunma hedefleri ve yapay zekâ sesli görsel betimlemesi.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectMode(MODES.HEARING)}
          style={[styles.card, { borderColor: '#38BDF8', backgroundColor: '#F0F9FF' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="İşitme Engelli Modu. Otomatik Türkçe altyazı ve görsel uyarılar."
        >
          <Volume2 size={28} color="#0284C7" />
          <Text style={[styles.cardTitle, { color: '#0369A1' }]}>İşitme Engelli</Text>
          <Text style={[styles.cardDesc, { color: '#334155' }]}>
            Videolara Türkçe otomatik altyazı, sesli bildirimler yerine titreşimli ve renkli görsel uyarılar.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectMode(MODES.NEURO)}
          style={[styles.card, { borderColor: '#0D9488', backgroundColor: '#F0FDFA' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Nörogelişimsel Sakin Mod. DEHB ve Otizm için sıfır animasyon, pastel tonlar ve sakin akış."
        >
          <Sparkles size={28} color="#0D9488" />
          <Text style={[styles.cardTitle, { color: '#0F766E' }]}>Nörogelişimsel Sakin (DEHB/Otizm)</Text>
          <Text style={[styles.cardDesc, { color: '#334155' }]}>
            Duyusal yükü azaltan pastel palet, döngüsel animasyonların durdurulması ve basitleştirilmiş arayüz.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectMode(MODES.STANDARD)}
          style={[styles.card, { borderColor: '#CBD5E1', backgroundColor: '#FFFFFF' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Standart NSosyal Modu. Varsayılan modern sosyal medya arayüzü."
        >
          <LayoutGrid size={28} color="#2563EB" />
          <Text style={[styles.cardTitle, { color: '#0F172A' }]}>Standart Deneyim</Text>
          <Text style={[styles.cardDesc, { color: '#475569' }]}>
            Varsayılan modern NSosyal arayüzü. İstediğiniz zaman sağ üst köşeden erişilebilirlik moduna geçebilirsiniz.
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
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 34,
  },
  titleAccent: {
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    marginTop: 8,
    lineHeight: 22,
  },
  smartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    minHeight: 56, // WCAG 2.2 AA Dokunma Alanı
  },
  smartIconBox: {
    marginRight: 14,
  },
  smartTextContainer: {
    flex: 1,
  },
  smartTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  smartDesc: {
    color: '#DBEAFE',
    fontSize: 12,
    lineHeight: 16,
  },
  dividerText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginVertical: 14,
  },
  cardsGrid: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    minHeight: 60,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
