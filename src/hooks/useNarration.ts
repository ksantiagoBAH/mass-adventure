import { useEffect, useRef, useState } from "react";
import { useMassContent } from "./useMassContent";
import recordings from "../generated/narration.json";
import spanishRecordings from "../generated/narration-es.json";
import polishRecordings from "../generated/narration-pl.json";
import type { Language } from "../data/massParts";
const clips: Record<Language, Record<string, { text: string; file: string }>> = { en: recordings, es: spanishRecordings, pl: polishRecordings };
// A lesson, response cue, or church discovery may read, but never overlap.
let currentPlayback: { owner: symbol; stop: () => void } | null = null;
export function useNarration(
  text: string,
  voice: SpeechSynthesisVoice | null,
  recordingId?: string,
) {
  const { ui, language } = useMassContent();
  const [speaking, setSpeaking] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const narration = useRef<SpeechSynthesisUtterance | null>(null);
  const recording = useRef<HTMLAudioElement | null>(null);
  const active = useRef(false);
  const owner = useRef(Symbol("narration"));
  const cancel = () => {
    if (currentPlayback?.owner === owner.current) currentPlayback = null;
    active.current = false;
    if (recording.current) {
      const audio = recording.current;
      recording.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
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
  const claimPlayback = () => {
    if (currentPlayback?.owner !== owner.current) currentPlayback?.stop();
    currentPlayback = { owner: owner.current, stop: () => { cancel(); setSpeaking(false); } };
  };
  useEffect(() => {
    setSpeaking(false);
    setAudioMessage("");
    return cancel;
  }, [text, recordingId ? null : voice, recordingId, language]);
  const speak = (fallback = false) => {
    if (
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance !== "function"
    ) {
      setAudioMessage(ui.audioUnavailable);
      active.current = false;
      setSpeaking(false);
      return;
    }
    if (fallback) setAudioMessage(ui.recordingFallback);
    claimPlayback();
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice && voice.lang.toLowerCase().split(/[-_]/)[0] === language) utterance.voice = voice;
      utterance.lang = voice?.lang.toLowerCase().split(/[-_]/)[0] === language ? voice.lang : ({en: "en-US", es: "es-MX", pl: "pl-PL"}[language]);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      narration.current = utterance;
      utterance.onend = () => {
        if (narration.current !== utterance) return;
        narration.current = null;
        active.current = false;
        setSpeaking(false);
      };
      utterance.onerror = (event) => {
        if (narration.current !== utterance) return;
        narration.current = null;
        active.current = false;
        setSpeaking(false);
        if (event.error !== "canceled" && event.error !== "interrupted")
          setAudioMessage(ui.voiceUnavailable);
      };
      setSpeaking(true);
      active.current = true;
      window.speechSynthesis.speak(utterance);
    } catch {
      cancel();
      setSpeaking(false);
      setAudioMessage(ui.voiceUnavailable);
    }
  };
  const read = () => {
    const wasActive = active.current;
    cancel();
    setAudioMessage("");
    setSpeaking(false);
    if (wasActive) return;
    const clip = recordingId ? clips[language][recordingId] : undefined;
    // Never read an old recording after the editable lesson text changes.
    if (!clip || clip.text !== text || typeof Audio !== "function") {
      speak();
      return;
    }
    try {
      const audio = new Audio(`${import.meta.env.BASE_URL}${clip.file}`);
      audio.preload = "none";
      recording.current = audio;
      claimPlayback();
      active.current = true;
      setSpeaking(true);
      const fallback = () => {
        if (recording.current !== audio) return;
        cancel();
        speak(true);
      };
      audio.onended = () => {
        if (recording.current !== audio) return;
        cancel();
        setSpeaking(false);
      };
      audio.onerror = fallback;
      // Called directly from the tap to support mobile autoplay restrictions.
      void audio.play().catch(fallback);
    } catch {
      cancel();
      speak(true);
    }
  };
  return { speaking, audioMessage, read };
}
