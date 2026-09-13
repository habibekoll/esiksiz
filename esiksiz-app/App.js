import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AccessibilityProvider, useAccessibility, MODES } from './src/context/AccessibilityContext';
import { Header } from './src/components/Header';
import { BottomNavBar } from './src/components/BottomNavBar';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { CreatePostScreen } from './src/screens/CreatePostScreen';
import { AccessibilitySettingsScreen } from './src/screens/AccessibilitySettingsScreen';
import { AdaptiveEngine } from './src/engine/AdaptiveEngine';
import { SpeechService } from './src/services/speechService';
import { INITIAL_POSTS } from './src/services/aiCaptionService';
import { Compass, Bell, Wifi, Sparkles, Eye, Ear, HandMetal, LayoutGrid, RotateCcw } from 'lucide-react-native';

function ExplorePlaceholderScreen() {
  const { theme } = useAccessibility();
  return (
    <View style={[styles.placeholderCenter, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.placeholderIconPill, { backgroundColor: theme.colors.inputBg }]}>
        <Compass size={36} color={theme.colors.primary} />
      </View>
      <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Keşfet</Text>
      <Text style={[styles.placeholderSub, { color: theme.colors.textMuted }]}>
        NSosyal gündemindeki erişilebilir konular, sesli içerikler ve popüler paylaşımlar burada yer alır.
      </Text>
    </View>
  );
}

function NotificationsPlaceholderScreen() {
  const { theme } = useAccessibility();
  return (
    <View style={[styles.placeholderCenter, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.placeholderIconPill, { backgroundColor: theme.colors.inputBg }]}>
        <Bell size={36} color={theme.colors.primary} />
      </View>
      <Text style={[styles.placeholderTitle, { color: theme.colors.text }]}>Bildirimler</Text>
      <Text style={[styles.placeholderSub, { color: theme.colors.textMuted }]}>
        Etkileşim bildirimleriniz, sesli duyurularınız ve görsel bildirim uyarılarınız burada listelenir.
      </Text>
    </View>
  );
}

// Şık ve Doğal Kategori Seçici Barı
function LiveModeBar({ onOpenOnboarding }) {
  const { currentMode, selectMode, theme } = useAccessibility();
  const isVisual = theme.isVisual;

  const modes = [
    { id: MODES.VISUAL, label: '🟡 Görme Desteği', icon: Eye },
    { id: MODES.HEARING, label: '🤟 İşitme Desteği', icon: Ear },
    { id: MODES.NEURO, label: '🧠 Sakin Mod', icon: Sparkles },
    { id: MODES.MOTOR, label: '✋ Kolay Dokunma', icon: HandMetal },
    { id: MODES.STANDARD, label: '🌐 Standart', icon: LayoutGrid },
  ];

  return (
    <View style={[styles.liveModeContainer, { backgroundColor: isVisual ? '#0A0A0A' : '#F8FAFC', borderBottomColor: isVisual ? '#FFE600' : '#E2E8F0' }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveModeScroll}>
        {modes.map((m) => {
          const isCurrent = currentMode === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => selectMode(m.id)}
              style={[
                styles.liveModeBtn,
                {
                  backgroundColor: isCurrent
                    ? isVisual
                      ? '#FFE600'
                      : '#2563EB'
                    : isVisual
                    ? '#171717'
                    : '#FFFFFF',
                  borderColor: isCurrent ? (isVisual ? '#FFE600' : '#2563EB') : (isVisual ? '#333333' : '#E2E8F0'),
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${m.label} moduna geç`}
            >
              <Text
                style={[
                  styles.liveModeBtnText,
                  {
                    color: isCurrent
                      ? isVisual
                        ? '#000000'
                        : '#FFFFFF'
                      : isVisual
                      ? '#FFE600'
                      : '#475569',
                    fontWeight: isCurrent ? '800' : '600',
                  },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Karşılama Ekranına Dönüş Butonu */}
        <TouchableOpacity
          onPress={onOpenOnboarding}
          style={[styles.onbResetBtn, { borderColor: isVisual ? '#FFE600' : '#CBD5E1' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Karşılama ekranına dön"
        >
          <RotateCcw size={12} color={isVisual ? '#FFE600' : '#64748B'} />
          <Text style={[styles.onbResetText, { color: isVisual ? '#FFE600' : '#64748B' }]}>
            Giriş
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MainApp() {
  const { currentMode, selectMode, theme } = useAccessibility();
  // Doğrudan ana akışta Görme Engelli Modu ile açılır!
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = new AdaptiveEngine((suggestion) => {
      setActiveSuggestion(suggestion);
    });
  }, []);

  // Web Klavye Boşluk Tuşu Dinleyicisi
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleKeyDown = (e) => {
        if (e.code === 'Space' && theme.isVisual && activeTab === 'feed' && !isOnboarding) {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const firstPost = posts[0];
            SpeechService.speak(
              `${firstPost.author.name} paylaştı: ${firstPost.content}. Paylaşılan görselin Türkçe betimlemesi: ${firstPost.aiDescription}`
            );
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [theme.isVisual, activeTab, isOnboarding, posts]);

  const handleAcceptSuggestion = () => {
    if (activeSuggestion) {
      selectMode(activeSuggestion.mode);
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
    <SafeAreaView style={styles.outerCanvas}>
      <StatusBar
        barStyle={isHighContrast ? 'light-content' : 'dark-content'}
        backgroundColor={isHighContrast ? '#000000' : '#FFFFFF'}
      />

      {/* iPhone 16 Pro Titanyum Mockup Kasası */}
      <View
        style={[
          styles.titaniumDeviceFrame,
          {
            backgroundColor: theme.colors.background,
            borderColor: isHighContrast ? '#FFE600' : '#384152',
            borderWidth: Platform.OS === 'web' ? (isHighContrast ? 3 : 2.5) : 0,
          },
        ]}
      >
        {/* iOS Üst Durum Çubuğu & Dynamic Island */}
        {Platform.OS === 'web' && (
          <View style={[styles.iosStatusBar, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.statusTimeText, { color: isHighContrast ? '#FFE600' : theme.colors.text }]}>
              09:41
            </Text>

            {/* Apple Dynamic Island */}
            <View style={styles.dynamicIslandPill}>
              <View style={styles.cameraLens} />
              <View style={styles.sensorDot} />
            </View>

            {/* Sağ Üst İkonlar */}
            <View style={styles.statusRightIcons}>
              <Wifi size={13} color={isHighContrast ? '#FFE600' : theme.colors.text} />
              <Text style={[styles.networkText, { color: isHighContrast ? '#FFE600' : theme.colors.text }]}>
                5G
              </Text>
              <View style={[styles.miniBattery, { borderColor: isHighContrast ? '#FFE600' : theme.colors.text }]}>
                <View style={[styles.batteryFill, { backgroundColor: isHighContrast ? '#FFE600' : theme.colors.text }]} />
              </View>
            </View>
          </View>
        )}

        {/* 1. GİRİŞ / TANITIM EKRANI */}
        {isOnboarding ? (
          <OnboardingScreen
            onComplete={() => {
              setIsOnboarding(false);
              setActiveTab('feed');
            }}
          />
        ) : (
          /* 2. ANA UYGULAMA (GÖRME ENGELLİ DOĞAL MODUYLA BAŞLAR) */
          <>
            {/* Üst Çubuk */}
            {activeTab !== 'settings' && activeTab !== 'create' && (
              <>
                <Header onOpenAccessibility={() => setActiveTab('settings')} />
                {/* Mod Seçici Çubuğu */}
                <LiveModeBar onOpenOnboarding={() => setIsOnboarding(true)} />
              </>
            )}

            {/* Gövde */}
            <View style={styles.tabBody}>
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
                <AccessibilitySettingsScreen
                  onBack={() => setActiveTab('feed')}
                  onResetToOnboarding={() => setIsOnboarding(true)}
                />
              )}
            </View>

            {/* Alt Gezinme Çubuğu */}
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={(newTab) => setActiveTab(newTab)}
            />

            {/* iOS Alt Home Gösterge Çizgisi */}
            {Platform.OS === 'web' && (
              <View style={[styles.iosHomeIndicatorArea, { backgroundColor: theme.colors.navBg }]}>
                <View style={[styles.iosHomeBar, { backgroundColor: isHighContrast ? '#FFE600' : '#94A3B8' }]} />
              </View>
            )}
          </>
        )}
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
  outerCanvas: {
    flex: 1,
    backgroundColor: '#07090E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titaniumDeviceFrame: {
    width: Platform.OS === 'web' ? 430 : '100%',
    height: Platform.OS === 'web' ? '96vh' : '100%',
    maxHeight: Platform.OS === 'web' ? 890 : '100%',
    borderRadius: Platform.OS === 'web' ? 44 : 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.65,
    shadowRadius: 40,
    elevation: 20,
  },
  iosStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 6,
    zIndex: 20,
  },
  statusTimeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  dynamicIslandPill: {
    width: 96,
    height: 22,
    backgroundColor: '#000000',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    gap: 8,
  },
  cameraLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  sensorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#052e16',
  },
  statusRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '800',
  },
  miniBattery: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.5,
    padding: 1.5,
    justifyContent: 'center',
  },
  batteryFill: {
    width: '70%',
    height: '100%',
    borderRadius: 1.5,
  },
  liveModeContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  liveModeScroll: {
    paddingHorizontal: 12,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveModeBtn: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  liveModeBtnText: {
    fontSize: 11,
  },
  onbResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginLeft: 4,
  },
  onbResetText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tabBody: {
    flex: 1,
  },
  iosHomeIndicatorArea: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iosHomeBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
  },
  placeholderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderIconPill: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
