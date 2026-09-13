import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, LayoutGrid, Check, ArrowLeft, Type, Cpu } from 'lucide-react-native';

export const AccessibilitySettingsScreen = ({ onBack }) => {
  const {
    currentMode,
    setMode,
    theme,
    fontSizeScale,
    setFontSizeScale,
    adaptiveEngineActive,
    setAdaptiveEngineActive,
  } = useAccessibility();

  const colors = theme.colors;
  const isHighContrast = theme.isHighContrast;

  const modeList = [
    {
      id: MODES.STANDARD,
      title: 'Standart Görünüm',
      desc: 'NSosyal varsayılan modern tasarım ve arayüzü.',
      icon: LayoutGrid,
    },
    {
      id: MODES.VISUAL,
      title: 'Görme Desteği & Yüksek Kontrast',
      desc: '16:1 kontrast (Siyah/Sarı), büyük yazılar ve sesli görsel betimleme.',
      icon: Eye,
    },
    {
      id: MODES.HEARING,
      title: 'İşitme Desteği & Altyazı',
      desc: 'Videolarda otomatik senkronize Türkçe altyazı ve görsel göstergeler.',
      icon: Volume2,
    },
    {
      id: MODES.NEURO,
      title: 'Nörogelişimsel Sakin Mod (DEHB / Otizm)',
      desc: 'Dikkati dağıtan animasyonlar kapalı, pastel renkler ve sade tek sütun.',
      icon: Sparkles,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Erişilebilirlik Ayarları Ekranı"
    >
      {/* Üst Başlık */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.backBtn,
              { backgroundColor: isHighContrast ? '#FFE600' : colors.inputBg },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
          >
            <ArrowLeft size={20} color={isHighContrast ? '#000000' : colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Erişilebilirlik ve Görünüm
        </Text>
      </View>

      {/* 1. Mod Seçimi Bölümü */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          DENEYİM MODU
        </Text>

        <View style={styles.cardGroup}>
          {modeList.map((item) => {
            const isSelected = currentMode === item.id;
            const IconComp = item.icon;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setMode(item.id)}
                style={[
                  styles.modeRow,
                  {
                    backgroundColor: colors.cardBackground,
                    borderBottomColor: colors.border,
                    borderBottomWidth: 1,
                  },
                ]}
                accessible={true}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${item.title}. ${item.desc}. ${isSelected ? 'Seçili.' : 'Seçmek için tıklayın.'}`}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isSelected
                        ? isHighContrast
                          ? '#FFE600'
                          : colors.primary
                        : colors.inputBg,
                    },
                  ]}
                >
                  <IconComp
                    size={20}
                    color={
                      isSelected
                        ? isHighContrast
                          ? '#000000'
                          : '#FFFFFF'
                        : colors.textMuted
                    }
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.modeTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.modeDesc, { color: colors.textMuted }]}>
                    {item.desc}
                  </Text>
                </View>

                {isSelected && (
                  <View
                    style={[
                      styles.checkCircle,
                      { backgroundColor: isHighContrast ? '#FFE600' : colors.primary },
                    ]}
                  >
                    <Check
                      size={14}
                      color={isHighContrast ? '#000000' : '#FFFFFF'}
                      strokeWidth={3}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 2. Metin Boyutu Bölümü */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          METİN BOYUTU (DYNAMIC TYPE)
        </Text>
        <View style={[styles.scaleContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {[1.0, 1.25, 1.4].map((scale) => {
            const isSelected = fontSizeScale === scale;
            return (
              <TouchableOpacity
                key={scale}
                onPress={() => setFontSizeScale(scale)}
                style={[
                  styles.scaleBtn,
                  {
                    backgroundColor: isSelected
                      ? isHighContrast
                        ? '#FFE600'
                        : colors.primary
                      : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.scaleBtnText,
                    {
                      color: isSelected
                        ? isHighContrast
                          ? '#000000'
                          : '#FFFFFF'
                        : colors.text,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  %{Math.round(scale * 100)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Uyarlanabilir Öneri Motoru Ayarı */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          YAPAY ZEKÂ & ADAPTİF SİSTEM
        </Text>
        <View style={[styles.settingRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Uyarlanabilir Öneri Motoru
            </Text>
            <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
              Kullanım alışkanlıklarınıza göre ihtiyacınız olan modu akıllıca teklif eder.
            </Text>
          </View>
          <Switch
            value={adaptiveEngineActive}
            onValueChange={setAdaptiveEngineActive}
            trackColor={{ false: '#94A3B8', true: isHighContrast ? '#FFE600' : '#2563EB' }}
            thumbColor="#FFFFFF"
          />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  modeDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 6,
  },
  scaleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44,
  },
  scaleBtnText: {
    fontSize: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
