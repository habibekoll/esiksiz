import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar, Text } from 'react-native';
import { AccessibilityProvider, useAccessibility, MODES } from './src/context/AccessibilityContext';
import { Header } from './src/components/Header';
import { BottomNavBar } from './src/components/BottomNavBar';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { AccessibilitySettingsScreen } from './src/screens/AccessibilitySettingsScreen';
import { AdaptiveEngine } from './src/engine/AdaptiveEngine';
import { INITIAL_POSTS } from './src/services/aiCaptionService';
import { Compass, Bell } from 'lucide-react-native';

// Hafif Keşfet Ekranı
function ExplorePlaceholderScreen() {
  const { theme } = useAccessibility();
  return (
    <View style={[styles.placeholderCenter, { backgroundColor: theme.colors.background }]}>
      <Compass size={40} color={theme.colors.textMuted} />
      <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Keşfet</Text>
      <Text style={[styles.placeholderSub, { color: theme.colors.textMuted }]}>
        NSosyal gündemindeki popüler konular ve erişilebilir içerikler burada yer alır.
      </Text>
    </View>
  );
}

// Hafif Bildirimler Ekranı
function NotificationsPlaceholderScreen() {
  const { theme } = useAccessibility();
  return (
    <View style={[styles.placeholderCenter, { backgroundColor: theme.colors.background }]}>
      <Bell size={40} color={theme.colors.textMuted} />
      <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Bildirimler</Text>
      <Text style={[styles.placeholderSub, { color: theme.colors.textMuted }]}>
        Yeni etkileşimler ve sesli/görsel uyarı bildirimleriniz burada listelenir.
      </Text>
    </View>
  );
}

function MainApp() {
  const { currentMode, setMode, theme } = useAccessibility();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true); // Gerçek uygulama gibi doğrudan akışta başlar
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'explore' | 'create' | 'notifications' | 'settings'
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  // Uyarlanabilir Öneri Motoru Referansı
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = new AdaptiveEngine((suggestion) => {
      setActiveSuggestion(suggestion);
    });
  }, []);

  const handleAcceptSuggestion = () => {
    if (activeSuggestion) {
      setMode(activeSuggestion.mode);
      setActiveSuggestion(null);
    }
  };

  const handleDismissSuggestion = () => {
    setActiveSuggestion(null);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab('feed');
  };

  const isHighContrast = theme.isHighContrast;

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar
        barStyle={isHighContrast ? 'light-content' : 'dark-content'}
        backgroundColor={isHighContrast ? '#000000' : '#FFFFFF'}
      />

      {/* Telefon Gövdesi Mockup'ı (Masaüstünde odaklanmış gerçek telefon en-boy oranı) */}
      <View
        style={[
          styles.deviceFrame,
          {
            backgroundColor: theme.colors.background,
            borderColor: isHighContrast ? '#FFE600' : '#334155',
            borderWidth: Platform.OS === 'web' ? (isHighContrast ? 3 : 2) : 0,
          },
        ]}
      >
        {/* Mobil Dynamic Island Çentiği */}
        {Platform.OS === 'web' && (
          <View style={styles.topIslandBar}>
            <View style={styles.islandPill} />
          </View>
        )}

        {/* Üst Çubuk (Ayarlar ve Paylaşım hariç her yerde) */}
        {activeTab !== 'settings' && activeTab !== 'create' && (
          <Header onOpenAccessibility={() => setActiveTab('settings')} />
        )}

        {/* Sekme Gövdesi */}
        <View style={styles.tabContent}>
          {activeTab === 'feed' && (
            <FeedScreen
              posts={posts}
              suggestion={activeSuggestion}
              onAcceptSuggestion={handleAcceptSuggestion}
              onDismissSuggestion={handleDismissSuggestion}
            />
          )}

          {activeTab === 'explore' && <ExplorePlaceholderScreen />}

          {activeTab === 'create' && (
            <CreatePostScreen
              onBack={() => setActiveTab('feed')}
              onPostCreated={handlePostCreated}
            />
          )}

          {activeTab === 'notifications' && <NotificationsPlaceholderScreen />}

          {activeTab === 'settings' && (
            <AccessibilitySettingsScreen onBack={() => setActiveTab('feed')} />
          )}
        </View>

        {/* Alt Gezinme Çubuğu (Bottom Navigation Bar) */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={(newTab) => setActiveTab(newTab)}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <MainApp />
    </AccessibilityProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Sade, şık koyu sahne arkaplanı
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceFrame: {
    width: Platform.OS === 'web' ? 440 : '100%',
    height: Platform.OS === 'web' ? '96vh' : '100%',
    maxHeight: Platform.OS === 'web' ? 880 : '100%',
    borderRadius: Platform.OS === 'web' ? 36 : 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 32,
    elevation: 16,
  },
  topIslandBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  islandPill: {
    width: 100,
    height: 22,
    backgroundColor: '#000000',
    borderRadius: 11,
  },
  tabContent: {
    flex: 1,
  },
  placeholderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
