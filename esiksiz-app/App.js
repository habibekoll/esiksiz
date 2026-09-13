import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { AccessibilityProvider, useAccessibility, MODES } from './src/context/AccessibilityContext';
import { Header } from './src/components/Header';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { SettingsModal } from './src/components/SettingsModal';
import { JuryConsole } from './src/components/JuryConsole';
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isHighContrast ? 'light-content' : 'dark-content'}
        backgroundColor={isHighContrast ? '#000000' : '#FFFFFF'}
      />

      {/* Ana Çift Panel Düzeni: Mobil Cihaz + Jüri Konsolu */}
      <View style={styles.desktopLayout}>
        {/* 1. Mobil Cihaz Mockup Çerçevesi */}
        <View
          style={[
            styles.phoneFrame,
            {
              backgroundColor: theme.colors.background,
              borderColor: isHighContrast ? '#FFE600' : '#334155',
              borderWidth: Platform.OS === 'web' ? (isHighContrast ? 3.5 : 2) : 0,
            },
          ]}
        >
          {/* Mobil Dynamic Island / Çentik Simülasyonu */}
          {Platform.OS === 'web' && (
            <View style={styles.notchContainer}>
              <View style={styles.dynamicIsland}>
                <View style={styles.cameraHole} />
              </View>
            </View>
          )}

          {/* Üst Başlık (Sadece Feed ve Create ekranlarında) */}
          {currentScreen !== 'onboarding' && (
            <Header
              currentScreen={currentScreen}
              onOpenSettings={() => setSettingsVisible(true)}
              onOpenCreate={() => setCurrentScreen('create')}
              onNavigateHome={() => setCurrentScreen('feed')}
            />
          )}

          {/* Ekranlar */}
          <View style={styles.screenBody}>
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
          </View>
        </View>

        {/* 2. TEKNOFEST Jüri Sunum Konsolu (Masaüstü/Sunum Modunda Yan Panel) */}
        {Platform.OS === 'web' && (
          <JuryConsole
            onNavigateScreen={(screen) => setCurrentScreen(screen)}
            onTriggerStruggle={() => engineRef.current?.simulateVisualStruggle()}
            onTriggerSensory={() => engineRef.current?.simulateSensoryOverload()}
            onTriggerHearing={() => engineRef.current?.simulateHearingNeed()}
          />
        )}
      </View>

      {/* Erişilebilirlik ve Simülasyon Ayarları Modalı */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSimulateStruggle={() => engineRef.current?.simulateVisualStruggle()}
        onSimulateSensory={() => engineRef.current?.simulateSensoryOverload()}
        onSimulateHearing={() => engineRef.current?.simulateHearingNeed()}
      />
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
    backgroundColor: '#090D16', // Profesyonel koyu sahne arkaplanı
  },
  desktopLayout: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 16 : 0,
    gap: 20,
  },
  phoneFrame: {
    width: Platform.OS === 'web' ? 440 : '100%',
    height: Platform.OS === 'web' ? '96vh' : '100%',
    maxHeight: Platform.OS === 'web' ? 880 : '100%',
    borderRadius: Platform.OS === 'web' ? 36 : 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 12,
  },
  notchContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  dynamicIsland: {
    width: 110,
    height: 24,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  cameraHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  screenBody: {
    flex: 1,
  },
});
