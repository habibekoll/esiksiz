import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export const SpeechService = {
  // Metinden Sese (TTS) - Türkçe Seslendirme
  speak: (text, onStart, onDone, onError) => {
    if (!text) return;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onstart = () => {
          if (onStart) onStart();
        };
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

    try {
      Speech.stop();
      if (onStart) onStart();
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

  // Konuşmadan Metne (ASR) - Jüri Canlı Mikrofon Testi
  createRecognizer: (onResult, onError, onEnd) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'tr-TR';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (onResult) onResult(transcript);
        };

        recognition.onerror = (event) => {
          if (onError) onError(event.error);
        };

        recognition.onend = () => {
          if (onEnd) onEnd();
        };

        return recognition;
      }
    }
    return null;
  },
};
