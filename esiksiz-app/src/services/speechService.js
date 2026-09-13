import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export const SpeechService = {
  speak: (text, onDone, onError) => {
    if (!text) return;

    // Web ortamında browser yerel SpeechSynthesis API (Kusursuz Türkçe okuma)
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          if (onDone) onDone();
        };
        utterance.onerror = (e) => {
          if (onError) onError(e);
        };
        window.speechSynthesis.speak(utterance);
        return;
      } catch (err) {
        console.warn('Web SpeechSynthesis hatası:', err);
      }
    }

    // Mobil ortamında Expo Speech API
    try {
      Speech.stop();
      Speech.speak(text, {
        language: 'tr-TR',
        rate: 0.95,
        pitch: 1.0,
        onDone: onDone,
        onError: onError,
      });
    } catch (e) {
      console.warn('Expo speech hatası:', e);
      if (onDone) onDone();
    }
  },

  stop: () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    try {
      Speech.stop();
    } catch (e) {}
  },
};
