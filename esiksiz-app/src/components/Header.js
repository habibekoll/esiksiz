import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Ear, Sparkles, Sliders, HandMetal, Award, ShieldCheck } from 'lucide-react-native';

export const Header = ({ onOpenAccessibility }) => {
  const { theme, currentMode } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;

  const getModeInfo = () => {
    switch (currentMode) {
      case MODES.VISUAL:
        return {
          label: '16.1:1 Kontrast • 555nm Sarı',
          subLabel: 'Oftalmolojik Görme Modu',
          icon: Eye,
          color: '#FFE600',
          textColor: '#000000',
        };
      case MODES.HEARING:
        return {
          label: 'TİD & Ses Betimleme',
          subLabel: 'İşitme Desteği',
          icon: Ear,
          color: '#E0F2FE',
          textColor: '#0284C7',
        };
      case MODES.NEURO:
        return {
          label: 'Biyonik & Odak Cetveli',
          subLabel: 'DEHB & Sakin Mod',
          icon: Sparkles,
          color: '#CCFBF1',
          textColor: '#0F766E',
        };
      case MODES.MOTOR:
        return {
          label: '56px+ Dev Dokunma',
          subLabel: 'Motor Engel Modu',
          icon: HandMetal,
          color: '#F3E8FF',
          textColor: '#7C3AED',
        };
      default:
        return {
          label: 'Erişilebilirlik',
          subLabel: 'Mod Seçin',
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
          borderBottomWidth: isVisual ? 2.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="NSosyal Başlık Alanı"
    >
      {/* NSosyal Logosu ve Doğrulama Rozeti */}
      <View style={styles.logoRow}>
        <Text style={[styles.logoText, { color: isVisual ? '#FFE600' : colors.primary }]}>
          N<Text style={{ color: isVisual ? '#FFFFFF' : '#0F172A' }}>Sosyal</Text>
        </Text>
        <View
          style={[
            styles.wcagBadge,
            {
              backgroundColor: isVisual ? '#000000' : '#F8FAFC',
              borderColor: isVisual ? '#FFE600' : '#E2E8F0',
            },
          ]}
        >
          <ShieldCheck size={11} color={isVisual ? '#FFE600' : '#16A34A'} />
          <Text style={[styles.wcagBadgeText, { color: isVisual ? '#FFE600' : '#15803D' }]}>
            WCAG 2.2 AAA
          </Text>
        </View>
      </View>

      {/* Aktif Mod Göstergesi / Ayarlara Geçiş Butonu */}
      <TouchableOpacity
        onPress={onOpenAccessibility}
        style={[
          styles.quickModeBtn,
          {
            backgroundColor: modeInfo.color,
            borderColor: isVisual ? '#FFE600' : colors.border,
            borderWidth: isVisual ? 2 : 1,
            minHeight: isVisual ? 44 : 38,
          },
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Aktif mod: ${modeInfo.label}. Ayarları açmak için dokunun.`}
      >
        <ModeIcon size={16} color={modeInfo.textColor} />
        <View>
          <Text style={[styles.quickModeText, { color: modeInfo.textColor }]}>
            {modeInfo.label}
          </Text>
        </View>
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
    minHeight: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  wcagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  wcagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  quickModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  quickModeText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
