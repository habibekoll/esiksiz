import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, Sliders } from 'lucide-react-native';

export const Header = ({ onOpenAccessibility }) => {
  const { theme, currentMode } = useAccessibility();
  const colors = theme.colors;
  const isHighContrast = theme.isHighContrast;

  const getModeInfo = () => {
    switch (currentMode) {
      case MODES.VISUAL:
        return { label: 'Görme', icon: Eye, color: '#FFE600', textColor: '#000000' };
      case MODES.HEARING:
        return { label: 'İşitme', icon: Volume2, color: '#38BDF8', textColor: '#000000' };
      case MODES.NEURO:
        return { label: 'Sakin', icon: Sparkles, color: '#0D9488', textColor: '#FFFFFF' };
      default:
        return { label: 'Eşiksiz', icon: Sliders, color: colors.inputBg, textColor: colors.text };
    }
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
          borderBottomWidth: isHighContrast ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="NSosyal Ana Başlık"
    >
      {/* Temiz NSosyal Logosu */}
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, { color: isHighContrast ? '#FFE600' : '#2563EB' }]}>
          N<Text style={{ color: isHighContrast ? '#FFFFFF' : '#0F172A' }}>Sosyal</Text>
        </Text>
      </View>

      {/* Doğal Erişilebilirlik Hızlı Butonu */}
      <TouchableOpacity
        onPress={onOpenAccessibility}
        style={[
          styles.quickModeBtn,
          {
            backgroundColor: modeInfo.color,
            borderColor: isHighContrast ? '#FFE600' : colors.border,
            borderWidth: isHighContrast ? 2 : 1,
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Erişilebilirlik ayarları. Aktif mod: ${modeInfo.label}`}
      >
        <ModeIcon size={16} color={modeInfo.textColor} />
        <Text style={[styles.quickModeText, { color: modeInfo.textColor }]}>
          {modeInfo.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  quickModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    minHeight: 40,
  },
  quickModeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
