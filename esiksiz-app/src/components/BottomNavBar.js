import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { Home, Compass, PlusSquare, Bell, Sliders } from 'lucide-react-native';

export const BottomNavBar = ({ activeTab, onTabChange }) => {
  const { theme, fontSizeScale } = useAccessibility();
  const colors = theme.colors;
  const isVisual = theme.isVisual;

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
          backgroundColor: colors.navBg,
          borderTopColor: colors.border,
          borderTopWidth: isVisual ? 2.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComp = tab.icon;
        const iconColor = isActive ? colors.activeNav : colors.inactiveNav;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={[styles.tabButton, { minHeight: isVisual ? 48 : 44 }]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} sekmesi`}
          >
            <IconComp
              size={isVisual ? 24 : 21}
              color={iconColor}
              strokeWidth={isActive ? 2.8 : 1.8}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: iconColor,
                  fontWeight: isActive ? '800' : '600',
                  fontSize: (isVisual ? 11 : 10) * fontSizeScale,
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
    paddingBottom: 10,
    minHeight: 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    gap: 3,
  },
  tabLabel: {
    marginTop: 2,
  },
});
