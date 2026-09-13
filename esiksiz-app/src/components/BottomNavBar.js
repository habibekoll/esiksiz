import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility, MODES } from '../context/AccessibilityContext';
import { Home, Compass, PlusSquare, Bell, Sliders } from 'lucide-react-native';

export const BottomNavBar = ({ activeTab, onTabChange }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;
  const isHighContrast = theme.isHighContrast;

  const tabs = [
    { id: 'feed', label: 'Ana Akış', icon: Home },
    { id: 'explore', label: 'Keşfet', icon: Compass },
    { id: 'create', label: 'Paylaş', icon: PlusSquare },
    { id: 'notifications', label: 'Bildirim', icon: Bell },
    { id: 'settings', label: 'Erişilebilirlik', icon: Sliders },
  ];

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          borderTopWidth: isHighContrast ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Alt Gezinme Çubuğu"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComp = tab.icon;
        const iconColor = isActive
          ? isHighContrast
            ? '#FFE600'
            : colors.primary
          : isHighContrast
          ? '#888888'
          : colors.textMuted;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={styles.tabButton}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} sekmesi`}
          >
            <IconComp size={22} color={iconColor} strokeWidth={isActive ? 2.5 : 1.8} />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: iconColor,
                  fontWeight: isActive ? '700' : '500',
                  fontSize: 10 * fontSizeScale,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 12,
    minHeight: 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    minHeight: 44, // WCAG 2.2 AA Dokunma Alanı
    gap: 3,
  },
  tabLabel: {
    marginTop: 2,
  },
});
