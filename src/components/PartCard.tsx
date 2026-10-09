import { useRef } from "react";
import { ui, phrases, getNarrationText, responsePractice } from "../data/massParts";
import type { Part } from "../data/massParts";
import { Illustration } from "./Illustration";
import { Icon } from "./Icon";
import { useNarration } from "../hooks/useNarration";
import { ParishArtwork } from "./ParishArtwork";
import { ResponsePractice } from "./ResponsePractice";
import { LessonScene } from "./LessonScene";
export default function PartCard({
  part,
  index,
  onSwipe,
  voice,
  useRecording,
}: {
  part: Part;
  index: number;
  onSwipe: (direction: number) => void;
  voice: SpeechSynthesisVoice | null;
  useRecording: boolean;
}) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  const text = getNarrationText(part);
  const { speaking, audioMessage, read } = useNarration(text, voice, useRecording ? part.id : undefined);
  return (
    <article
      className="part-card"
      onTouchStart={(e) => {
        if ((e.target as Element).closest("button, .response-practice")) {
          touch.current = null;
          return;
        }
        touch.current =
          e.touches.length === 1
            ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
            : null;
      }}
      onTouchCancel={() => {
        touch.current = null;
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || e.changedTouches.length !== 1 || e.touches.length !== 0)
          return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5)
          onSwipe(dx < 0 ? 1 : -1);
      }}
    >
      <div className="part-art">
        <LessonScene partId={part.id}>
        {part.id === "gifts" ? (
          <ParishArtwork kind="altar" />
        ) : (
          <Illustration kind={part.art} alt={part.alt} variant={index} />
        )}
        </LessonScene>
        {part.rite && <span className="rite">{part.rite}</span>}
      </div>
      <div className="part-body">
        <div className="part-title">
          <h2>{part.name}</h2>
          <button
            className="read"
            onClick={read}
            aria-label={speaking ? "Stop reading" : "Read aloud"}
          >
            <Icon name="sound" />
            {speaking ? ui.stop : ui.read}
          </button>
        </div>
        <p className={audioMessage ? undefined : "sr-only"} role="status">
          {audioMessage}
        </p>
        <h3>{ui.happening}</h3>
        <p>{part.happening}</p>
        <h3>{ui.why}</h3>
        <p>{part.why}</p>
        <div className="try">
          <span className="try-label">✦ {ui.try}</span>
          <p>{part.action}</p>
        </div>
        {responsePractice[part.id] && <ResponsePractice key={part.id} partId={part.id} voice={voice} useRecording={useRecording} />}
        {part.glossary && (
          <div className="glossary">
            <span>{ui.glossary}</span>
            <strong>{part.glossary[0]}</strong>
            <p>{part.glossary[1]}</p>
          </div>
        )}
        <details>
          <summary>{phrases.parentReference(part.ccc)}</summary>
          <p>{part.note || ui.referenceDefault}</p>
        </details>
      </div>
    </article>
  );
}
