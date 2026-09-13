import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { FeedCard } from '../components/FeedCard';
import { AdaptiveBanner } from '../components/AdaptiveBanner';

export const FeedScreen = ({ posts, suggestion, onAcceptSuggestion, onDismissSuggestion }) => {
  const { theme } = useAccessibility();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Uyarlanabilir Öneri Motoru Banner'ı */}
      <AdaptiveBanner
        suggestion={suggestion}
        onAccept={onAcceptSuggestion}
        onDismiss={onDismissSuggestion}
      />

      {/* Gönderi Akışı */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
});
