import { useState } from "react";
import { activityCopy, responsePractice } from "../data/massParts";
import { useNarration } from "../hooks/useNarration";

export function ResponsePractice({ partId, voice, useRecording }: {
  partId: string; voice: SpeechSynthesisVoice | null; useRecording: boolean;
}) {
  const practice = responsePractice[partId];
  const [choice, setChoice] = useState<number | null>(null);
  const { speaking, audioMessage, read } = useNarration(
    practice.cue, voice, useRecording ? `response-${partId}` : undefined,
  );
  const correct = choice === practice.answer;
  return (
    <section className={`response-practice ${correct ? "response-complete" : ""}`} aria-label={activityCopy.responseTitle}>
      <h3>{activityCopy.responseTitle}</h3>
      <p>{activityCopy.responseHint}</p>
      <blockquote>{practice.cue}</blockquote>
      <button className="activity-listen" onClick={read}>
        {speaking ? activityCopy.stop : activityCopy.listen} <span aria-hidden="true">♫</span>
      </button>
      <p role="status" className={audioMessage ? undefined : "sr-only"}>{audioMessage}</p>
      <div className="response-options" role="group" aria-label={activityCopy.responseTitle}>
        {practice.options.map((option, index) => (
          <button key={option} aria-pressed={choice === index} onClick={() => setChoice(index)}
            className={choice === index ? `chosen ${correct ? "correct" : "incorrect"}` : ""}>
            {option}{choice === index && <span aria-hidden="true">{correct ? " ✦" : " ↻"}</span>}
          </button>
        ))}
      </div>
      <p role="status" className="response-feedback">
        {choice !== null && (correct ? `${activityCopy.correct} ${practice.options[practice.answer]}` : activityCopy.retry)}
      </p>
      {correct && <button className="activity-reset" onClick={() => setChoice(null)}>{activityCopy.again}</button>}
    </section>
  );
}
