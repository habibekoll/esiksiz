import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const MODES = {
  STANDARD: 'standard',
  VISUAL: 'visual',         // Görme Engelli / Az Gören (Yüksek Kontrast, Büyük Hedefler, Sesli Betimleme)
  HEARING: 'hearing',       // İşitme Engelli (Sürekli Altyazı, Görsel Bildirim, Ses Rozetleri)
  NEURO: 'neuro',           // Nörogelişimsel (DEHB/Otizm - Bionic Reading, Sıfır Animasyon, Sakin Arayüz)
};

export const AccessibilityProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(null); // Başlangıçta null, kullanıcı seçim yapınca mod giyilir
  const [fontSizeScale, setFontSizeScale] = useState(1.0);
  const [bionicReading, setBionicReading] = useState(false);
  const [alwaysCaptions, setAlwaysCaptions] = useState(false);
  const [hideClutter, setHideClutter] = useState(false);
  const [adaptiveEngineActive, setAdaptiveEngineActive] = useState(true);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);

  // Mod Seçildiğinde Uygulamanın Davranışını ve Şeklini Belirle
  const selectMode = (mode) => {
    setCurrentMode(mode);
    if (mode === MODES.VISUAL) {
      setFontSizeScale(1.3);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
    } else if (mode === MODES.HEARING) {
      setFontSizeScale(1.05);
      setBionicReading(false);
      setAlwaysCaptions(true);
      setHideClutter(false);
    } else if (mode === MODES.NEURO) {
      setFontSizeScale(1.1);
      setBionicReading(true);
      setAlwaysCaptions(false);
      setHideClutter(true); // Dikkat dağıtıcı beğeni sayıları ve animasyonları gizler
    } else {
      setFontSizeScale(1.0);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
    }
  };

  // Seçilen Moda Özel Renk Paleti ve Tasarım Dili
  const isVisual = currentMode === MODES.VISUAL;
  const isHearing = currentMode === MODES.HEARING;
  const isNeuro = currentMode === MODES.NEURO;
  const isStandard = currentMode === MODES.STANDARD || currentMode === null;

  const theme = {
    mode: currentMode,
    isVisual,
    isHearing,
    isNeuro,
    isStandard,
    isHighContrast: isVisual,
    fontSizeScale,
    bionicReading,
    alwaysCaptions,
    hideClutter,
    colors: isVisual
      ? {
          // GÖRME MODU: Saf Siyah, Canlı Sarı (#FFE600), Beyaz (#FFFFFF) - 16:1 Kontrast
          background: '#000000',
          cardBackground: '#0F0F0F',
          cardBorder: '#FFE600',
          text: '#FFFFFF',
          textMuted: '#FFE600',
          primary: '#FFE600',
          primaryText: '#000000',
          accent: '#00FFFF',
          border: '#FFE600',
          inputBg: '#1C1C1C',
          navBg: '#000000',
          activeNav: '#FFE600',
          inactiveNav: '#888888',
        }
      : isHearing
      ? {
          // İŞİTME MODU: Okyanus Mavisi, Canlı Turkuaz, Net Beyaz Kontrast
          background: '#F0F7FF',
          cardBackground: '#FFFFFF',
          cardBorder: '#0284C7',
          text: '#082F49',
          textMuted: '#0369A1',
          primary: '#0284C7',
          primaryText: '#FFFFFF',
          accent: '#06B6D4',
          border: '#BAE6FD',
          inputBg: '#F8FAFC',
          navBg: '#FFFFFF',
          activeNav: '#0284C7',
          inactiveNav: '#64748B',
        }
      : isNeuro
      ? {
          // NÖROGELİŞİMSEL SAKİN MOD: Pastel Adaçayı / Soft Teal, Göz Yormayan Gri
          background: '#F4F6F8',
          cardBackground: '#FFFFFF',
          cardBorder: '#CBD5E1',
          text: '#1E293B',
          textMuted: '#64748B',
          primary: '#0D9488',
          primaryText: '#FFFFFF',
          accent: '#14B8A6',
          border: '#E2E8F0',
          inputBg: '#F8FAFC',
          navBg: '#FFFFFF',
          activeNav: '#0D9488',
          inactiveNav: '#94A3B8',
        }
      : {
          // STANDART MOD: Modern NSosyal Mavisi ve Temiz Beyaz
          background: '#F8FAFC',
          cardBackground: '#FFFFFF',
          cardBorder: '#E2E8F0',
          text: '#0F172A',
          textMuted: '#64748B',
          primary: '#2563EB',
          primaryText: '#FFFFFF',
          accent: '#3B82F6',
          border: '#E2E8F0',
          inputBg: '#F1F5F9',
          navBg: '#FFFFFF',
          activeNav: '#2563EB',
          inactiveNav: '#64748B',
        },
  };

  return (
    <AccessibilityContext.Provider
      value={{
        currentMode,
        selectMode,
        theme,
        fontSizeScale,
        setFontSizeScale,
        bionicReading,
        setBionicReading,
        alwaysCaptions,
        hideClutter,
        adaptiveEngineActive,
        setAdaptiveEngineActive,
        pendingSuggestion,
        setPendingSuggestion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
