import { useMassContent } from "../hooks/useMassContent";
import type { useNarratorVoices } from "../hooks/useNarratorVoices";
import { useNarration } from "../hooks/useNarration";
import { Icon } from "./Icon";
export function VoiceSettings({
  preferences,
}: {
  preferences: ReturnType<typeof useNarratorVoices>;
}) {
  const { narratorCopy } = useMassContent();
  const { voices, selected, setSelected, voice } = preferences;
  const { speaking, audioMessage, read } = useNarration(
    narratorCopy.sample,
    voice,
    selected === "" ? "preview" : undefined,
  );
  return (
    <section
      className="parent-note voice-settings"
      aria-labelledby="voice-heading"
    >
      <h2 id="voice-heading">{narratorCopy.title}</h2>
      <p>{narratorCopy.description}</p>
      <label htmlFor="narrator-voice">{narratorCopy.label}</label>
      <select
        id="narrator-voice"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">
          {narratorCopy.automatic}
        </option>
        <option value="device">
          {narratorCopy.device}{voice ? ` (${voice.name})` : ""}
        </option>
        {voices.map((v) => (
          <option value={v.voiceURI} key={`${v.voiceURI}-${v.lang}`}>
            {v.name} ({v.lang})
          </option>
        ))}
      </select>
      {!voices.length && <p>{narratorCopy.noVoices}</p>}
      <button className="secondary" onClick={read}>
        <Icon name="sound" />
        {speaking ? narratorCopy.stop : narratorCopy.preview}
      </button>
      <p role="status" className={audioMessage ? undefined : "sr-only"}>
        {audioMessage}
      </p>
      <p className="voice-note">{narratorCopy.note}</p>
    </section>
  );
}
