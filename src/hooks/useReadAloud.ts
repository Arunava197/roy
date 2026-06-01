import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useReadAloud() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { i18n } = useTranslation();

  // Load voices
  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, []);

  // Sync state with global synthesis
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsPlaying(window.speechSynthesis.speaking);
    }, 100);

    return () => {
      clearInterval(intervalId);
      window.speechSynthesis.cancel();
    };
  }, []);

  const getBestVoice = useCallback((langCode: string) => {
    const langPrefix = langCode.split('-')[0];
    
    // Find all voices matching the language prefix
    const matchingVoices = voices.filter(v => v.lang.startsWith(langPrefix));
    
    if (matchingVoices.length > 0) {
      if (langPrefix === 'en') {
        const preferredNames = ['Google US English', 'Google UK English Female', 'Samantha', 'Karen', 'Tessa'];
        for (const name of preferredNames) {
          const voice = matchingVoices.find(v => v.name === name);
          if (voice) return voice;
        }
      }
      return matchingVoices[0];
    }
    
    return voices[0]; // ultimate fallback
  }, [voices]);

  const speak = useCallback((text: string, langCode: string = 'en') => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [getBestVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback((text: string) => {
    if (isPlaying) {
      stop();
    } else {
      speak(text, i18n.language);
    }
  }, [isPlaying, speak, stop, i18n.language]);

  return { isPlaying, toggle, speak, stop };
}
