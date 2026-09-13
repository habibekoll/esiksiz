import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, LayoutGrid, X, CheckCircle2, Zap, HandMetal, Smartphone, Vibrate } from 'lucide-react-native';

export const SettingsModal = ({ visible, onClose, onSimulateStruggle, onSimulateSensory, onSimulateHearing }) => {
  const { currentMode, selectMode, theme, fontSizeScale, setFontSizeScale } = useAccessibility();
  const colors = theme.colors;

  const modeOptions = [
    {
      id: MODES.STANDARD,
      title: 'Standart NSosyal Modu',
      desc: 'Platformun varsayılan zengin içerik akışı ve tasarımı.',
      icon: LayoutGrid,
    },
    {
      id: MODES.VISUAL,
      title: 'Görme Engelli / Az Gören Modu',
      desc: '16.1:1 rekor kontrast (saf siyah & 555nm sarı), karta dokunarak sesli dinleme ve Akıllı Sesli Galeri.',
      icon: Eye,
    },
    {
      id: MODES.HEARING,
      title: 'İşitme Engelli Modu',
      desc: 'Videolarda canlı altyazı, Türk İşaret Dili (TİD) avatarı ve duyulmayan çevresel ses betimlemeleri ([Alkış], [Müzik]).',
      icon: Volume2,
    },
    {
      id: MODES.NEURO,
      title: 'Nörogelişimsel Sakin Mod (DEHB / Otizm)',
      desc: 'Biyonik Okuma (Bionic Reading), imleci takip eden Odak Cetveli ve duyusal sakinlik.',
      icon: Sparkles,
    },
    {
      id: MODES.MOTOR,
      title: 'Fiziksel & Motor Beceri Desteği',
      desc: 'Titreyen ve kas kısıtı olan eller için 56px dev dokunma hedefleri ve yüksek tıklama toleransı.',
      icon: HandMetal,
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              borderWidth: theme.isHighContrast ? 2 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="dialog"
          accessibilityLabel="Erişilebilirlik ve Kişiselleştirme Tercihleri Paneli"
        >
          {/* Modal Başlık */}
          <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Erişilebilirlik & Deneyim Katmanı
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: theme.isHighContrast ? '#FFE600' : colors.inputBg },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Pencereyi kapat"
            >
              <X size={20} color={theme.isHighContrast ? '#000000' : colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              ERİŞİLEBİLİRLİK MODU SEÇİN (5 PROFİL)
            </Text>

            {modeOptions.map((opt) => {
              const isSelected = currentMode === opt.id;
              const IconComp = opt.icon;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => selectMode(opt.id)}
                  style={[
                    styles.modeCard,
                    {
                      backgroundColor: isSelected
                        ? theme.isHighContrast
                          ? '#1A1A1A'
                          : '#EFF6FF'
                        : colors.cardBackground,
                      borderColor: isSelected
                        ? theme.isHighContrast
                          ? '#FFE600'
                          : colors.primary
                        : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${opt.title}. ${opt.desc}. ${isSelected ? 'Şu anda seçili.' : 'Seçmek için tıklayın.'}`}
                >
                  <View style={styles.modeCardTop}>
                    <View style={styles.modeIconTitleRow}>
                      <IconComp
                        size={22}
                        color={
                          isSelected
                            ? theme.isHighContrast
                              ? '#FFE600'
                              : colors.primary
                            : colors.textMuted
                        }
                      />
                      <Text style={[styles.modeCardTitle, { color: colors.text }]}>
                        {opt.title}
                      </Text>
                    </View>
                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        color={theme.isHighContrast ? '#FFE600' : colors.primary}
                      />
                    )}
                  </View>
                  <Text style={[styles.modeCardDesc, { color: colors.textMuted }]}>
                    {opt.desc}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Jüri Canlı Demo Bölümü: Öneri Motoru & Akıllı Algılama Simülatörü */}
            <View
              style={[
                styles.demoBox,
                {
                  backgroundColor: theme.isHighContrast ? '#111111' : '#F0FDF4',
                  borderColor: '#22C55E',
                },
              ]}
            >
              <View style={styles.demoHeader}>
                <Zap size={18} color="#22C55E" />
                <Text style={styles.demoTitle}>Jüri Canlı Demo: Akıllı Tetikleyiciler</Text>
              </View>
              <Text style={styles.demoDesc}>
                Jüriye sıfır tıklama ile ekran okuyucu algılamayı, cihaz sallamayı ve zorlanma adaptasyonunu canlı gösterin:
              </Text>

              <View style={styles.demoButtons}>
                {/* 1. Ekran Okuyucu Algılama Simülatörü */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    selectMode(MODES.VISUAL, 'screen_reader');
                  }}
                  style={[styles.demoActionBtn, { backgroundColor: '#1E293B' }]}
                >
                  <Text style={[styles.demoActionText, { color: '#FFE600' }]}>
                    📱 TalkBack / VoiceOver Algılama Simülasyonu
                  </Text>
                </TouchableOpacity>

                {/* 2. Cihazı Salla Simülatörü */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    selectMode(MODES.VISUAL, 'shake');
                  }}
                  style={[styles.demoActionBtn, { backgroundColor: '#1E293B' }]}
                >
                  <Text style={[styles.demoActionText, { color: '#38BDF8' }]}>
                    📳 Cihazı Salla (Shake) Simülasyonu
                  </Text>
                </TouchableOpacity>

                {/* 3. Görme Zorlanması Simülasyonu */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateStruggle();
                  }}
                  style={styles.demoActionBtn}
                >
                  <Text style={styles.demoActionText}>👀 Görme Güçlüğü Davranış Simülasyonu</Text>
                </TouchableOpacity>

                {/* 4. Duyusal Yük Simülasyonu */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateSensory();
                  }}
                  style={styles.demoActionBtn}
                >
                  <Text style={styles.demoActionText}>🧠 Duyusal Yük (DEHB) Simülasyonu</Text>
                </TouchableOpacity>

                {/* 5. İşitme İhtiyacı Simülasyonu */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateHearing();
                  }}
                  style={styles.demoActionBtn}
                >
                  <Text style={styles.demoActionText}>🧏 İşitme İhtiyacı Simülasyonu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  modeCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  modeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeIconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modeCardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  demoBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 10,
    marginBottom: 20,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  demoDesc: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 10,
    lineHeight: 16,
  },
  demoButtons: {
    gap: 8,
  },
  demoActionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
});
