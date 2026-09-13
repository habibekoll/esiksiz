import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sparkles, X, Check } from 'lucide-react-native';

export const AdaptiveBanner = ({ suggestion, onAccept, onDismiss }) => {
  const { theme } = useAccessibility();
  if (!suggestion) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.bannerBg,
          borderColor: theme.isHighContrast ? '#FFE600' : theme.colors.primary,
          borderWidth: 2,
        },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`Uyarlanabilir Öneri Motoru Bildirimi: ${suggestion.title}. ${suggestion.message}`}
    >
      <View style={styles.contentRow}>
        <View style={styles.iconBox}>
          <Sparkles size={24} color={theme.colors.bannerText} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.bannerText }]}>
            🤖 {suggestion.title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.bannerText }]}>
            {suggestion.message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDismiss}
          style={styles.closeBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Bu öneriyi kapat"
        >
          <X size={20} color={theme.colors.bannerText} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={onAccept}
          style={[
            styles.acceptBtn,
            {
              backgroundColor: theme.isHighContrast ? '#000000' : theme.colors.primary,
              borderColor: theme.isHighContrast ? '#FFE600' : 'transparent',
              borderWidth: theme.isHighContrast ? 2 : 0,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={suggestion.actionText}
        >
          <Check size={18} color={theme.isHighContrast ? '#FFE600' : '#FFFFFF'} style={{ marginRight: 6 }} />
          <Text style={[styles.acceptText, { color: theme.isHighContrast ? '#FFE600' : '#FFFFFF' }]}>
            {suggestion.actionText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Şimdilik Değil"
        >
          <Text style={[styles.dismissText, { color: theme.colors.bannerText }]}>
            Şimdilik Değil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44, // WCAG 2.2 AA dokunma hedefi
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dismissBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
