import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Eye, Volume2, Sparkles, SlidersHorizontal, PlusCircle } from 'lucide-react-native';

export const Header = ({ onOpenSettings, onOpenCreate, onNavigateHome }) => {
  const { theme, currentMode } = useAccessibility();
  const colors = theme.colors;

  const getModeBadge = () => {
    switch (currentMode) {
      case MODES.VISUAL:
        return { label: 'Görme Modu', icon: Eye, color: '#FFE600', textColor: '#000000' };
      case MODES.HEARING:
        return { label: 'İşitme Modu', icon: Volume2, color: '#38BDF8', textColor: '#000000' };
      case MODES.NEURO:
        return { label: 'Sakin Mod', icon: Sparkles, color: '#0D9488', textColor: '#FFFFFF' };
      default:
        return { label: 'Standart', icon: null, color: colors.border, textColor: colors.text };
    }
  };

  const badge = getModeBadge();
  const BadgeIcon = badge.icon;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
          borderBottomWidth: theme.isHighContrast ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel="NSosyal Eşiksiz Ana Başlık Alanı"
    >
      <TouchableOpacity
        onPress={onNavigateHome}
        style={styles.logoRow}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="NSosyal Ana Sayfasına Git"
      >
        <Text style={[styles.logoText, { color: theme.isHighContrast ? colors.primary : colors.text }]}>
          N<Text style={{ color: theme.isHighContrast ? '#FFFFFF' : '#2563EB' }}>Sosyal</Text>
        </Text>
        <View
          style={[
            styles.tagBadge,
            { backgroundColor: theme.isHighContrast ? '#FFE600' : '#DBEAFE' },
          ]}
        >
          <Text
            style={[
              styles.tagText,
              { color: theme.isHighContrast ? '#000000' : '#1E40AF' },
            ]}
          >
            EŞİKSİZ
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        {/* Aktif Mod Rozeti */}
        <TouchableOpacity
          onPress={onOpenSettings}
          style={[
            styles.modeBadge,
            {
              backgroundColor: badge.color,
              borderColor: theme.isHighContrast ? '#FFE600' : 'transparent',
              borderWidth: theme.isHighContrast ? 2 : 0,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Aktif erişilebilirlik modu: ${badge.label}. Ayarları açmak için tıklayın.`}
        >
          {BadgeIcon && <BadgeIcon size={16} color={badge.textColor} style={{ marginRight: 4 }} />}
          <Text style={[styles.modeBadgeText, { color: badge.textColor }]}>{badge.label}</Text>
        </TouchableOpacity>

        {/* Gönderi Paylaş Butonu */}
        <TouchableOpacity
          onPress={onOpenCreate}
          style={[
            styles.iconButton,
            {
              backgroundColor: theme.isHighContrast ? '#000000' : colors.primary,
              borderColor: colors.border,
              borderWidth: theme.isHighContrast ? 2 : 0,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Yeni gönderi oluştur. Yapay zekâ alt metin desteği ile paylaşın."
        >
          <PlusCircle size={22} color={theme.isHighContrast ? '#FFE600' : '#FFFFFF'} />
        </TouchableOpacity>

        {/* Erişilebilirlik Ayarlar Butonu */}
        <TouchableOpacity
          onPress={onOpenSettings}
          style={[
            styles.iconButton,
            {
              backgroundColor: theme.isHighContrast ? '#FFE600' : colors.inputBg,
              borderColor: colors.border,
              borderWidth: theme.isHighContrast ? 2 : 1,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Erişilebilirlik panelini ve modları aç"
        >
          <SlidersHorizontal
            size={20}
            color={theme.isHighContrast ? '#000000' : colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 64, // WCAG Dokunma ve görünürlük alanı
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    minHeight: 44, // WCAG 2.2 AA Dokunma Alanı (min 44px)
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
