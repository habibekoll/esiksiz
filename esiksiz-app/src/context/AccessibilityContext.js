import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const MODES = {
  STANDARD: 'standard',
  VISUAL: 'visual',         // Görme Engelli / Az Gören (Yüksek Kontrast, Ekran Okuyucu, Büyük Yazı)
  HEARING: 'hearing',       // İşitme Engelli (Otomatik Altyazı, Görsel Titreşim)
  NEURO: 'neuro',           // Nörogelişimsel Farklılık (DEHB/Otizm - Sakin, Sıfır Animasyon, Sade Akış)
};

export const AccessibilityProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(MODES.STANDARD);
  const [fontSizeScale, setFontSizeScale] = useState(1.0); // 1.0, 1.2, 1.4
  const [adaptiveEngineActive, setAdaptiveEngineActive] = useState(true);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenReaderLog, setScreenReaderLog] = useState('');

  // Mod değiştiğinde otomatik yazı boyutu ve ayarlar
  useEffect(() => {
    if (currentMode === MODES.VISUAL) {
      setFontSizeScale(1.25);
    } else if (currentMode === MODES.NEURO) {
      setFontSizeScale(1.1);
    } else {
      setFontSizeScale(1.0);
    }
  }, [currentMode]);

  const setMode = (mode) => {
    setCurrentMode(mode);
  };

  const announceForScreenReader = (text) => {
    setScreenReaderLog(text);
  };

  // Tema Renk Paletleri (WCAG 2.2 AA ve AAA Uyumlu)
  const theme = {
    mode: currentMode,
    isHighContrast: currentMode === MODES.VISUAL,
    isNeuro: currentMode === MODES.NEURO,
    isHearing: currentMode === MODES.HEARING,
    fontSizeScale,
    colors: currentMode === MODES.VISUAL
      ? {
          // Yüksek Kontrast (16:1 ve 21:1 Contrast - Saf Siyah / Sarı / Beyaz)
          background: '#000000',
          cardBackground: '#121212',
          cardBorder: '#FFE600',
          text: '#FFFFFF',
          textMuted: '#FFE600',
          primary: '#FFE600',
          primaryText: '#000000',
          accent: '#00FFFF',
          border: '#FFE600',
          inputBg: '#1A1A1A',
          bannerBg: '#FFE600',
          bannerText: '#000000',
        }
      : currentMode === MODES.NEURO
      ? {
          // Nörogelişimsel Sakin Mod (Sakin pastel tonlar, gözü yormayan yumuşak kontrast)
          background: '#F1F5F9',
          cardBackground: '#FFFFFF',
          cardBorder: '#CBD5E1',
          text: '#1E293B',
          textMuted: '#64748B',
          primary: '#0D9488',
          primaryText: '#FFFFFF',
          accent: '#14B8A6',
          border: '#E2E8F0',
          inputBg: '#F8FAFC',
          bannerBg: '#CCFBF1',
          bannerText: '#0F766E',
        }
      : {
          // Standart NSosyal Teması (Modern, şık, WCAG AA 5:1 kontrast)
          background: '#F8FAFC',
          cardBackground: '#FFFFFF',
          cardBorder: '#E2E8F0',
          text: '#0F172A',
          textMuted: '#475569',
          primary: '#2563EB',
          primaryText: '#FFFFFF',
          accent: '#3B82F6',
          border: '#CBD5E1',
          inputBg: '#F1F5F9',
          bannerBg: '#DBEAFE',
          bannerText: '#1E40AF',
        },
  };

  return (
    <AccessibilityContext.Provider
      value={{
        currentMode,
        setMode,
        theme,
        fontSizeScale,
        setFontSizeScale,
        adaptiveEngineActive,
        setAdaptiveEngineActive,
        pendingSuggestion,
        setPendingSuggestion,
        isSpeaking,
        setIsSpeaking,
        screenReaderLog,
        announceForScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
