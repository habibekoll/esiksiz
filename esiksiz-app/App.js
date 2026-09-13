import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { AccessibilityProvider, useAccessibility, MODES } from './src/context/AccessibilityContext';
import { Header } from './src/components/Header';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { SettingsModal } from './src/components/SettingsModal';
import { AdaptiveEngine } from './src/engine/AdaptiveEngine';
import { INITIAL_POSTS } from './src/services/aiCaptionService';

function MainApp() {
  const { currentMode, setMode, theme } = useAccessibility();
  const [currentScreen, setCurrentScreen] = useState('onboarding'); // 'onboarding' | 'feed' | 'create'
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [settingsVisible, setSettingsVisible] = useState(false);
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
    setCurrentScreen('feed');
  };

  const isHighContrast = theme.isHighContrast;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isHighContrast ? '#000000' : theme.colors.background },
      ]}
    >
      <StatusBar
        barStyle={isHighContrast ? 'light-content' : 'dark-content'}
        backgroundColor={isHighContrast ? '#000000' : '#FFFFFF'}
      />

      {/* Ekran mobil görünüm kapsayıcısı */}
      <View
        style={[
          styles.appContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: isHighContrast ? '#FFE600' : '#E2E8F0',
            borderWidth: Platform.OS === 'web' ? (isHighContrast ? 3 : 1) : 0,
          },
        ]}
      >
        {/* Üst Başlık (Sadece Feed ve Create ekranlarında gösterilir) */}
        {currentScreen !== 'onboarding' && (
          <Header
            currentScreen={currentScreen}
            onOpenSettings={() => setSettingsVisible(true)}
            onOpenCreate={() => setCurrentScreen('create')}
            onNavigateHome={() => setCurrentScreen('feed')}
          />
        )}

        {/* Ekranlar */}
        {currentScreen === 'onboarding' && (
          <OnboardingScreen onComplete={() => setCurrentScreen('feed')} />
        )}

        {currentScreen === 'feed' && (
          <FeedScreen
            posts={posts}
            suggestion={activeSuggestion}
            onAcceptSuggestion={handleAcceptSuggestion}
            onDismissSuggestion={handleDismissSuggestion}
          />
        )}

        {currentScreen === 'create' && (
          <CreatePostScreen
            onBack={() => setCurrentScreen('feed')}
            onPostCreated={handlePostCreated}
          />
        )}

        {/* Erişilebilirlik ve Simülasyon Ayarları Modalı */}
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          onSimulateStruggle={() => engineRef.current?.simulateVisualStruggle()}
          onSimulateSensory={() => engineRef.current?.simulateSensoryOverload()}
          onSimulateHearing={() => engineRef.current?.simulateHearingNeed()}
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
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : '100%', // Masaüstünde jüriye sunarken şık telefon en-boy oranı
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
});
