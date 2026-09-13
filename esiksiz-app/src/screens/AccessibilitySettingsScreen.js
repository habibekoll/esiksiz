import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Ear, Sparkles, LayoutGrid, Check, ArrowLeft, RefreshCcw, HandMetal } from 'lucide-react-native';

export const AccessibilitySettingsScreen = ({ onBack, onResetToOnboarding }) => {
  const {
    currentMode,
    selectMode,
    theme,
    fontSizeScale,
    setFontSizeScale,
  } = useAccessibility();

  const colors = theme.colors;
  const isVisual = theme.isVisual;

  const modeList = [
    {
      id: MODES.VISUAL,
      title: 'Görme Desteği (Sesli Okuma & Betimleme)',
      desc: 'Tüm karta dokunarak hem yazıyı hem görseli dinleme, 16:1 kontrastlı sarı-siyah zemin.',
      icon: Eye,
    },
    {
      id: MODES.HEARING,
      title: 'İşitme Desteği (Ses Betimlemesi & TİD)',
      desc: 'Duyulamayan çevresel seslerin (müzik, alkış) detaylı metin betimlemesi ve Türk İşaret Dili.',
      icon: Ear,
    },
    {
      id: MODES.NEURO,
      title: 'Nörogelişimsel Sakin Mod (DEHB / Otizm)',
      desc: 'Bionic Reading, odak cetveli, sıfır animasyon ve sakinleştirilmiş akış.',
      icon: Sparkles,
    },
    {
      id: MODES.MOTOR,
      title: 'Fiziksel & Motor Beceri Desteği',
      desc: 'El titremesi ve motor kısıtlar için devasa dokunma alanları (min 56px) ve hata toleransı.',
      icon: HandMetal,
    },
    {
      id: MODES.STANDARD,
      title: 'Standart Görünüm',
      desc: 'NSosyal varsayılan modern tasarım ve arayüzü.',
      icon: LayoutGrid,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessible={true}
      accessibilityRole="region"
      accessibilityLabel="Erişilebilirlik ve Deneyim Ayarları"
    >
      {/* Üst Başlık */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
        {onBack && (
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
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Erişilebilirlik ve Görünüm
        </Text>
      </View>

      {/* 1. Deneyim Modu Seçimi */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          AKTİF MODU DEĞİŞTİR
        </Text>

        <View style={styles.cardGroup}>
          {modeList.map((item) => {
            const isSelected = currentMode === item.id;
            const IconComp = item.icon;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => selectMode(item.id)}
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
                accessibilityLabel={`${item.title}. ${item.desc}. ${isSelected ? 'Aktif mod.' : 'Geçmek için dokunun.'}`}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isSelected
                        ? isVisual
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
                        ? isVisual
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
                      { backgroundColor: isVisual ? '#FFE600' : colors.primary },
                    ]}
                  >
                    <Check
                      size={14}
                      color={isVisual ? '#000000' : '#FFFFFF'}
                      strokeWidth={3}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 2. Metin Boyutu */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          YAZI TİPİ BOYUTU
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
                      ? isVisual
                        ? '#FFE600'
                        : colors.primary
                      : 'transparent',
                  },
                ]}
              >
                <Text
                  style={{
                    color: isSelected
                      ? isVisual
                        ? '#000000'
                        : '#FFFFFF'
                      : colors.text,
                    fontWeight: isSelected ? '800' : '600',
                    fontSize: 14,
                  }}
                >
                  %{Math.round(scale * 100)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Başlangıç Seçim Ekranına Dönüş */}
      {onResetToOnboarding && (
        <TouchableOpacity
          onPress={onResetToOnboarding}
          style={[
            styles.resetBtn,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <RefreshCcw size={16} color={colors.text} />
          <Text style={[styles.resetBtnText, { color: colors.text }]}>
            Karşılama & Mod Seçim Ekranına Dön
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardGroup: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    fontSize: 14,
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
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
