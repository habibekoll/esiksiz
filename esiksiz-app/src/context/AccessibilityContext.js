import React, { createContext, useContext, useState } from 'react';
import { SpeechService } from '../services/speechService';

const AccessibilityContext = createContext();

export const MODES = {
  STANDARD: 'standard',
  VISUAL: 'visual',         // Görme Engelli & Az Gören (Yazı+Görsel Seslendirme, 16.1:1 Kontrast, 555nm Sarı)
  HEARING: 'hearing',       // İşitme Engelli & Sağır (Ortam Sesleri Betimlemesi, Altyazı, TİD İşaret Dili)
  NEURO: 'neuro',           // Nörogelişimsel / DEHB / Otizm (Bionic Reading, Odak Cetveli)
  MOTOR: 'motor',           // Fiziksel & Motor Beceri / El Titremesi (56px+ Dev Hedefler)
};

export const AccessibilityProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(null);
  const [fontSizeScale, setFontSizeScale] = useState(1.0);
  const [bionicReading, setBionicReading] = useState(false);
  const [alwaysCaptions, setAlwaysCaptions] = useState(false);
  const [hideClutter, setHideClutter] = useState(false);
  const [tidActive, setTidActive] = useState(false);
  const [focusRulerActive, setFocusRulerActive] = useState(false);
  const [adaptiveEngineActive, setAdaptiveEngineActive] = useState(true);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);

  // Mod Seçildiğinde Uygulamanın Halini ve Kurallarını Belirle
  const selectMode = (mode) => {
    setCurrentMode(mode);

    if (mode === MODES.VISUAL) {
      setFontSizeScale(1.25);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
      setTidActive(false);
      setFocusRulerActive(false);

      // Görme Engelli Birey İçin Sesli Rehber Karşılama
      setTimeout(() => {
        SpeechService.speak(
          'Görme desteği modu devrede. 16:1 rekor kontrast sağlandı. Ekrandaki herhangi bir gönderiye dokunarak hem yazıyı hem yapay zekâ görsel açıklamasını dinleyebilirsiniz.'
        );
      }, 350);
    } else if (mode === MODES.HEARING) {
      setFontSizeScale(1.05);
      setBionicReading(false);
      setAlwaysCaptions(true);
      setHideClutter(false);
      setTidActive(true);
      setFocusRulerActive(false);
    } else if (mode === MODES.NEURO) {
      setFontSizeScale(1.1);
      setBionicReading(true);
      setAlwaysCaptions(false);
      setHideClutter(true);
      setTidActive(false);
      setFocusRulerActive(true);
    } else if (mode === MODES.MOTOR) {
      setFontSizeScale(1.25);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(true);
      setTidActive(false);
      setFocusRulerActive(false);
    } else {
      setFontSizeScale(1.0);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
      setTidActive(false);
      setFocusRulerActive(false);
    }
  };

  const isVisual = currentMode === MODES.VISUAL;
  const isHearing = currentMode === MODES.HEARING;
  const isNeuro = currentMode === MODES.NEURO;
  const isMotor = currentMode === MODES.MOTOR;

  const theme = {
    mode: currentMode,
    isVisual,
    isHearing,
    isNeuro,
    isMotor,
    isHighContrast: isVisual,
    fontSizeScale,
    bionicReading,
    alwaysCaptions,
    hideClutter,
    tidActive,
    focusRulerActive,
    colors: isVisual
      ? {
          // GÖRME MODU: Saf Siyah, Canlı Sarı (#FFE600), Beyaz - 16.1:1 AAA Kontrast
          background: '#000000',
          cardBackground: '#0B0B0B',
          cardBorder: '#FFE600',
          text: '#FFFFFF',
          textMuted: '#FFE600',
          primary: '#FFE600',
          border: '#FFE600',
          inputBg: '#171717',
        }
      : isHearing
      ? {
          background: '#F0F9FF',
          cardBackground: '#FFFFFF',
          cardBorder: '#BAE6FD',
          text: '#0C4A6E',
          textMuted: '#0284C7',
          primary: '#0284C7',
          border: '#E0F2FE',
          inputBg: '#F8FAFC',
        }
      : isNeuro
      ? {
          background: '#F7FAF9',
          cardBackground: '#FFFFFF',
          cardBorder: '#CCFBF1',
          text: '#134E4A',
          textMuted: '#0F766E',
          primary: '#0D9488',
          border: '#E6F4F1',
          inputBg: '#FAFAF9',
        }
      : isMotor
      ? {
          background: '#FAF5FF',
          cardBackground: '#FFFFFF',
          cardBorder: '#E9D5FF',
          text: '#581C87',
          textMuted: '#7C3AED',
          primary: '#7C3AED',
          border: '#F3E8FF',
          inputBg: '#FDF4FF',
        }
      : {
          background: '#F8FAFC',
          cardBackground: '#FFFFFF',
          cardBorder: '#E2E8F0',
          text: '#0F172A',
          textMuted: '#64748B',
          primary: '#2563EB',
          border: '#CBD5E1',
          inputBg: '#F1F5F9',
        },
  };

  return (
    <AccessibilityContext.Provider
      value={{
        currentMode,
        setMode: selectMode,
        selectMode,
        theme,
        fontSizeScale,
        setFontSizeScale,
        bionicReading,
        setBionicReading,
        alwaysCaptions,
        setAlwaysCaptions,
        hideClutter,
        setHideClutter,
        tidActive,
        setTidActive,
        focusRulerActive,
        setFocusRulerActive,
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

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
