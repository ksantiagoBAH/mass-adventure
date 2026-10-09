import { useId, useState } from "react";
import { activityCopy, churchDiscoveries, parishArtwork } from "../data/massParts";
import { useNarration } from "../hooks/useNarration";

export function ChurchExplorer({ voice, useRecording }: {
  voice: SpeechSynthesisVoice | null; useRecording: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const title = useId();
  const item = selected === null ? null : churchDiscoveries[selected];
  const { speaking, audioMessage, read } = useNarration(
    item?.text || "", voice, useRecording && item ? `explorer-${item.id}` : undefined,
  );
  return (
    <section className="church-explorer" aria-labelledby={title}>
      <div className="section-heading"><div><h2 id={title}>{activityCopy.explorerTitle}</h2><p>{activityCopy.explorerHint}</p></div></div>
      <div className="explorer-sanctuary">
        <img className="explorer-art" src={parishArtwork.sanctuary.src} alt={parishArtwork.sanctuary.alt} />
        <svg className="explorer-pointers" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {churchDiscoveries.map(discovery => <line key={discovery.id} x1={discovery.x} y1={discovery.y}
            x2={discovery.targetX} y2={discovery.targetY} />)}
        </svg>
        {churchDiscoveries.map((discovery, index) => (
          <button key={discovery.id} className={`explorer-hotspot ${index === selected ? "selected" : ""}`}
            style={{ left: `${discovery.x}%`, top: `${discovery.y}%` }}
            aria-label={`${index + 1}. ${discovery.name}`} aria-pressed={index === selected}
            onClick={() => setSelected(index)}>{index + 1}</button>
        ))}
      </div>
      <div className="explorer-legend">
        {churchDiscoveries.map((discovery, index) => (
          <button key={discovery.id} aria-pressed={index === selected}
            onClick={() => setSelected(index)}><span aria-hidden="true">{index + 1} · </span>{discovery.name}</button>
        ))}
      </div>
      <div className="explorer-discovery">
        <div role="status"><h3>{item?.name || activityCopy.explorerChoose}</h3>{item && <p>{item.text}</p>}</div>
        {item && <button className="activity-listen" onClick={read}>{speaking ? activityCopy.explorerStop : activityCopy.explorerRead} <span aria-hidden="true">♫</span></button>}
        <p role="status" className={audioMessage ? undefined : "sr-only"}>{audioMessage}</p>
      </div>
    </section>
  );
}
