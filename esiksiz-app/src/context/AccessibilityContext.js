import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
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
  // Sunum için varsayılan olarak doğrudan GÖRME ENGELLİ MODU ile açılır!
  const [currentMode, setCurrentMode] = useState(MODES.VISUAL);
  const [fontSizeScale, setFontSizeScale] = useState(1.25);
  const [bionicReading, setBionicReading] = useState(false);
  const [alwaysCaptions, setAlwaysCaptions] = useState(false);
  const [hideClutter, setHideClutter] = useState(false);
  const [tidActive, setTidActive] = useState(false);
  const [focusRulerActive, setFocusRulerActive] = useState(false);
  const [adaptiveEngineActive, setAdaptiveEngineActive] = useState(true);
  const [pendingSuggestion, setPendingSuggestion] = useState(null);

  // Mod Seçildiğinde Uygulamanın Halini ve Kurallarını Belirle
  const selectMode = (mode, reason) => {
    setCurrentMode(mode);

    if (mode === MODES.VISUAL) {
      setFontSizeScale(1.25);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
      setTidActive(false);
      setFocusRulerActive(false);

      setTimeout(() => {
        const welcomeMsg = reason === 'screen_reader'
          ? 'Ekran okuyucu sisteminiz algılandı. Görme desteği modu sıfır tıklama ile otomatik başlatıldı. 16:1 kontrast devrede. Karta dokunarak yazıyı ve görsel betimlemesini dinleyebilirsiniz.'
          : reason === 'shake'
          ? 'Cihaz sallama jesti algılandı. Görme desteği modu devreye alındı. Karta dokunarak gönderiyi dinleyebilirsiniz.'
          : 'Görme desteği modu devrede. 16:1 rekor kontrast sağlandı. Ekrandaki herhangi bir gönderiye dokunarak hem yazıyı hem yapay zekâ görsel açıklamasını dinleyebilirsiniz.';
        SpeechService.speak(welcomeMsg);
      }, 300);
    } else if (mode === MODES.HEARING) {
      setFontSizeScale(1.05);
      setBionicReading(false);
      setAlwaysCaptions(true);
      setHideClutter(false);
      setTidActive(true);
      setFocusRulerActive(false);
      SpeechService.speak('İşitme modu devrede. Videolarda Türk İşaret Dili avatarı ve çevresel ses betimlemeleri aktif.');
    } else if (mode === MODES.NEURO) {
      setFontSizeScale(1.1);
      setBionicReading(true);
      setAlwaysCaptions(false);
      setHideClutter(true);
      setTidActive(false);
      setFocusRulerActive(true);
      SpeechService.speak('Nörogelişimsel sakin mod devrede. Biyonik okuma ve odak cetveli aktif.');
    } else if (mode === MODES.MOTOR) {
      setFontSizeScale(1.25);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(true);
      setTidActive(false);
      setFocusRulerActive(false);
      SpeechService.speak('Motor beceri modu devrede. Dev dokunma hedefleri aktif.');
    } else {
      setFontSizeScale(1.0);
      setBionicReading(false);
      setAlwaysCaptions(false);
      setHideClutter(false);
      setTidActive(false);
      setFocusRulerActive(false);
      SpeechService.speak('Standart sosyal medya modu devrede.');
    }
  };

  // 1. KADEME: İŞLETİM SİSTEMİ EKRAN OKUYUCU OTOMATİK ALGILAMA
  useEffect(() => {
    if (AccessibilityInfo && AccessibilityInfo.isScreenReaderEnabled) {
      AccessibilityInfo.isScreenReaderEnabled()
        .then((isEnabled) => {
          if (isEnabled) {
            selectMode(MODES.VISUAL, 'screen_reader');
          }
        })
        .catch(() => {});
    }
  }, []);

  // 3. KADEME: CİHAZI SALLAMA (SHAKE TO TOGGLE)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      let lastX = 0, lastY = 0, lastZ = 0;
      let lastTime = 0;
      const handleMotion = (event) => {
        const cur = event.accelerationIncludingGravity;
        if (!cur) return;
        const now = Date.now();
        if (now - lastTime > 120) {
          const diff = now - lastTime;
          lastTime = now;
          const speed = Math.abs(cur.x + cur.y + cur.z - lastX - lastY - lastZ) / diff * 10000;
          if (speed > 850 && currentMode !== MODES.VISUAL) {
            selectMode(MODES.VISUAL, 'shake');
          }
          lastX = cur.x || 0;
          lastY = cur.y || 0;
          lastZ = cur.z || 0;
        }
      };
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [currentMode]);

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
          navBg: '#000000',
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
          navBg: '#FFFFFF',
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
          navBg: '#FFFFFF',
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
          navBg: '#FFFFFF',
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
          navBg: '#FFFFFF',
        },
  };

  return (
    <AccessibilityContext.Provider
      value={{
        currentMode,
        setMode: (m) => selectMode(m),
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
