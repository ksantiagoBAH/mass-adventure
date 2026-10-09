import { useEffect, useRef, useState } from "react";
import { ui } from "../data/massParts";
export function useNarration(text: string, voice: SpeechSynthesisVoice | null) {
  const [speaking, setSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const narration = useRef<SpeechSynthesisUtterance | null>(null);
  const cancel = () => {
    if (narration.current) {
      narration.current.onend = null;
      narration.current.onerror = null;
      narration.current = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* voice service unavailable */
    }
  };
  useEffect(() => {
    setSpeaking(false);
    setAudioMessage("");
    return cancel;
  }, [text, voice]);
  const read = () => {
    if (
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ) {
      setAudioMessage(ui.audioUnavailable);
      return;
    }
    cancel();
    setAudioMessage("");
    if (speaking) {
      setSpeaking(false);
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      narration.current = utterance;
      utterance.onend = () => {
        if (narration.current !== utterance) return;
        narration.current = null;
        setSpeaking(false);
      };
      utterance.onerror = (event) => {
        if (narration.current !== utterance) return;
        narration.current = null;
        setSpeaking(false);
        if (event.error !== "canceled" && event.error !== "interrupted")
          setAudioMessage(ui.voiceUnavailable);
      };
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      cancel();
      setSpeaking(false);
      setAudioMessage(ui.voiceUnavailable);
    }
  };
  return { speaking, audioMessage, read };
}
