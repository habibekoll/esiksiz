import React, { createContext, useContext, useState } from 'react';
import { SpeechService } from '../services/speechService';

const AccessibilityContext = createContext();

export const MODES = {
  STANDARD: 'standard',
  VISUAL: 'visual',         // Görme Engelli & Az Gören (Yazı+Görsel Seslendirme, 16:1 Kontrast)
  HEARING: 'hearing',       // İşitme Engelli & Sağır (Ortam Sesleri Betimlemesi, Altyazı, TİD İşaret Dili)
  NEURO: 'neuro',           // Nörogelişimsel / DEHB / Otizm (Bionic Reading, Duyusal Sakinlik)
  MOTOR: 'motor',           // Fiziksel & Motor Beceri / El Titremesi (Dev Hedefler, Basit Gezinme)
};

export const AccessibilityProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState(null);
  const [fontSizeScale, setFontSizeScale] = useState(1.0);
  const [bionicReading, setBionicReading] = useState(false);
  const [alwaysCaptions, setAlwaysCaptions] = useState(false);
  const [hideClutter, setHideClutter] = useState(false);
  const [tidActive, setTidActive] = useState(false); // Türk İşaret Dili Avatarı
  const [focusRulerActive, setFocusRulerActive] = useState(false); // DEHB Okuma Cetveli
  const [adaptiveEngineActive, setAdaptiveEngineActive] = useState(true);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);

  // Mod Seçildiğinde Uygulamanın Halini ve Kurallarını Belirle
  const selectMode = (mode) => {
    setCurrentMode(mode);

    if (mode === MODES.VISUAL) {
      setFontSizeScale(1.3);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
      setTidActive(false);
      setFocusRulerActive(false);

      // Görme Engelli Birey İçin Sesli Rehber Karşılama
      setTimeout(() => {
        SpeechService.speak(
          'Görme desteği modu devrede. Ekrandaki herhangi bir gönderiye dokunarak hem yazıyı hem görsel açıklamasını dinleyebilirsiniz. Boşluk tuşu da okumayı başlatır.'
        );
      }, 350);
    } else if (mode === MODES.HEARING) {
      setFontSizeScale(1.05);
      setBionicReading(false);
      setAlwaysCaptions(true);
      setHideClutter(false);
      setTidActive(true); // TİD İşaret dili kutucuğu açılır
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
          // GÖRME MODU: Saf Siyah, Canlı Sarı (#FFE600), Beyaz - 16:1 AAA Kontrast
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
          // İŞİTME MODU: Net Okyanus Mavisi & Yüksek Okunabilirlik
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
          // NÖROGELİŞİMSEL SAKİN MOD: Pastel Adaçayı / Soft Teal
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
      : isMotor
      ? {
          // MOTOR / FİZİKSEL ENGEL MODU: Büyük Mor Vurgu, Yüksek Görünürlük
          background: '#FAF5FF',
          cardBackground: '#FFFFFF',
          cardBorder: '#7C3AED',
          text: '#2E1065',
          textMuted: '#6D28D9',
          primary: '#7C3AED',
          primaryText: '#FFFFFF',
          accent: '#A855F7',
          border: '#DDD6FE',
          inputBg: '#F5F3FF',
          navBg: '#FFFFFF',
          activeNav: '#7C3AED',
          inactiveNav: '#7C3AED',
        }
      : {
          // STANDART MOD
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

export const useAccessibility = () => useContext(AccessibilityContext);
