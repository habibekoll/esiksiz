import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, LayoutGrid, X, CheckCircle2, Zap } from 'lucide-react-native';

export const SettingsModal = ({ visible, onClose, onSimulateStruggle, onSimulateSensory, onSimulateHearing }) => {
  const { currentMode, setMode, theme, fontSizeScale, setFontSizeScale } = useAccessibility();
  const colors = theme.colors;

  const modeOptions = [
    {
      id: MODES.STANDARD,
      title: 'Standart NSosyal Modu',
      desc: 'Platformun varsayılan görünümü ve akışı.',
      icon: LayoutGrid,
    },
    {
      id: MODES.VISUAL,
      title: 'Görme Engelli / Az Gören Modu',
      desc: 'Saf siyah arkaplan, yüksek kontrast sarı vurgular (16:1), büyük butonlar ve sesli görsel betimleme.',
      icon: Eye,
    },
    {
      id: MODES.HEARING,
      title: 'İşitme Engelli Modu',
      desc: 'Videolarda otomatik senkronize altyazı ve görsel uyarı darbesi.',
      icon: Volume2,
    },
    {
      id: MODES.NEURO,
      title: 'Nörogelişimsel Sakin Mod (DEHB / Otizm)',
      desc: 'Dikkat dağıtıcı animasyonlar kapalı, pastel renkler ve bilişsel yükü azaltan sade arayüz.',
      icon: Sparkles,
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
              ERİŞİLEBİLİRLİK MODU SEÇİN
            </Text>

            {modeOptions.map((opt) => {
              const isSelected = currentMode === opt.id;
              const IconComp = opt.icon;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setMode(opt.id)}
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

            {/* Yazı Boyutu Ölçekleyici (Dynamic Type) */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                YAZI TİPİ BOYUTU (DYNAMIC TYPE)
              </Text>
              <View style={styles.fontScaleRow}>
                {[1.0, 1.2, 1.4].map((scale) => (
                  <TouchableOpacity
                    key={scale}
                    onPress={() => setFontSizeScale(scale)}
                    style={[
                      styles.fontScaleBtn,
                      {
                        backgroundColor:
                          fontSizeScale === scale
                            ? theme.isHighContrast
                              ? '#FFE600'
                              : colors.primary
                            : colors.inputBg,
                      },
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Yazı boyutu ${Math.round(scale * 100)} yüzde`}
                  >
                    <Text
                      style={{
                        fontSize: 14 * scale,
                        fontWeight: '700',
                        color:
                          fontSizeScale === scale
                            ? theme.isHighContrast
                              ? '#000000'
                              : '#FFFFFF'
                            : colors.text,
                      }}
                    >
                      %{Math.round(scale * 100)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Jüri Canlı Demo Bölümü: Öneri Motoru Simülatörü */}
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
                <Text style={styles.demoTitle}>Jüri Canlı Demo: Uyarlanabilir Motoru Tetikle</Text>
              </View>
              <Text style={styles.demoDesc}>
                Kullanıcının zorlanma davranışını simüle ederek jüriye proaktif bildirim akışını canlı gösterin:
              </Text>

              <View style={styles.demoButtons}>
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateStruggle();
                  }}
                  style={styles.demoActionBtn}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Görme Güçlüğü Davranış Simülasyonu"
                >
                  <Text style={styles.demoActionText}>👀 Görme Güçlüğü Simülasyonu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateSensory();
                  }}
                  style={styles.demoActionBtn}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Duyusal Yük Davranış Simülasyonu"
                >
                  <Text style={styles.demoActionText}>🧠 Duyusal Yük Simülasyonu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSimulateHearing();
                  }}
                  style={styles.demoActionBtn}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="İşitme İhtiyacı Davranış Simülasyonu"
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
    maxHeight: '85%',
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  modeCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 64,
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
    fontWeight: '700',
  },
  modeCardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginVertical: 14,
  },
  fontScaleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fontScaleBtn: {
    flex: 1,
    height: 44, // WCAG AA dokunma alanı
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
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
    color: '#16A34A',
  },
  demoDesc: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 10,
  },
  demoButtons: {
    gap: 8,
  },
  demoActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  demoActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
});
