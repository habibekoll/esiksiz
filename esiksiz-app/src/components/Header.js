import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Ear, Sparkles, Sliders, HandMetal } from 'lucide-react-native';

export const Header = ({ onOpenAccessibility }) => {
  const { theme, currentMode } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;

  const getModeInfo = () => {
    switch (currentMode) {
      case MODES.VISUAL:
        return {
          label: 'Görme Desteği',
          icon: Eye,
          color: '#FFE600',
          textColor: '#000000',
        };
      case MODES.HEARING:
        return {
          label: 'İşitme Desteği',
          icon: Ear,
          color: '#E0F2FE',
          textColor: '#0284C7',
        };
      case MODES.NEURO:
        return {
          label: 'Sakin Mod',
          icon: Sparkles,
          color: '#CCFBF1',
          textColor: '#0F766E',
        };
      case MODES.MOTOR:
        return {
          label: 'Kolay Dokunma',
          icon: HandMetal,
          color: '#F3E8FF',
          textColor: '#7C3AED',
        };
      default:
        return {
          label: 'Standart',
          icon: Sliders,
          color: colors.inputBg,
          textColor: colors.text,
        };
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
          borderBottomColor: isVisual ? '#FFE600' : colors.border,
          borderBottomWidth: isVisual ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="NSosyal Başlık Alanı"
    >
      {/* NSosyal Logosu */}
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, { color: isVisual ? '#FFE600' : colors.primary }]}>
          N<Text style={{ color: isVisual ? '#FFFFFF' : '#0F172A' }}>Sosyal</Text>
        </Text>
      </View>

      {/* Aktif Mod Göstergesi / Ayarlara Geçiş Butonu */}
      <TouchableOpacity
        onPress={onOpenAccessibility}
        style={[
          styles.quickModeBtn,
          {
            backgroundColor: modeInfo.color,
            borderColor: isVisual ? '#FFE600' : 'transparent',
            borderWidth: isVisual ? 1.5 : 0,
            minHeight: isVisual ? 42 : 36,
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Aktif mod: ${modeInfo.label}. Ayarları açmak için dokunun.`}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  quickModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  quickModeText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
