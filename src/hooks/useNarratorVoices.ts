import { useEffect, useState } from "react";
import { matchesVoiceLanguage, type Language } from "../data/massParts";

// Voice names are platform-specific. Prefer enhanced/neural voices when
// available, without pretending a basic system voice is a studio recording.
function score(voice: SpeechSynthesisVoice) {
  const name = voice.name;
  if (
    /novelty|whisper|bells|boing|bubbles|trinoids|bad news|good news|zarvox|organ|cellos|superstar|wobble|jester|bahh|albert|fred|junior/i.test(
      name,
    )
  )
    return -1000;
  return (
    (/natural|neural|premium|enhanced/i.test(name) ? 100 : 0) +
    (/siri|ava|samantha|zoe|allison|jenny|aria|guy|andrew|emma/i.test(name)
      ? 30
      : 0) +
    (/google.*english/i.test(name) ? 25 : 0) +
    (/^en[-_]US$/i.test(voice.lang) ? 15 : 0) +
    (voice.localService ? 5 : 0) +
    (voice.default ? 2 : 0)
  );
}
export function useNarratorVoices(language: Language = "en") {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    setSelected("");
    const synthesis = window.speechSynthesis;
    if (!synthesis) return;
    const refresh = () => {
      try {
        setVoices(
          synthesis
            .getVoices()
            .filter((v) => matchesVoiceLanguage(v.lang, language))
            .sort(
              (a, b) => score(b) - score(a) || a.name.localeCompare(b.name),
            ),
        );
      } catch {
        setVoices([]);
      }
    };
    refresh();
    synthesis.addEventListener("voiceschanged", refresh);
    // Some browsers return an empty list on the initial call.
    const timer = setTimeout(refresh, 500);
    return () => {
      clearTimeout(timer);
      synthesis.removeEventListener("voiceschanged", refresh);
    };
  }, [language]);
  const voice =
    voices.find((v) => v.voiceURI === selected) ||
    voices.find((v) => score(v) > -1000) ||
    null;
  return { voices, selected, setSelected, voice };
}
