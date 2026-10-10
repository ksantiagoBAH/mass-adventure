import { useId, useState } from "react";
import { useMassContent } from "../hooks/useMassContent";
import { StickerArtwork } from "./StickerArtwork";
import { useNarration } from "../hooks/useNarration";

export function ChurchExplorer({ voice, useRecording, explored, onExplore, onSeeSticker, celebrate }: {
  voice: SpeechSynthesisVoice | null; useRecording: boolean;
  explored: string[]; onExplore: (id: string) => void; onSeeSticker: () => void; celebrate: boolean;
}) {
  const { activityCopy, churchDiscoveries, parishArtwork, explorerReward, ui } = useMassContent();
  const [selected, setSelected] = useState<number | null>(null);
  const title = useId();
  const item = selected === null ? null : churchDiscoveries[selected];
  const earned = explored.length === churchDiscoveries.length;
  const choose = (index: number) => { setSelected(index); onExplore(churchDiscoveries[index].id); };
  const { speaking, audioMessage, read } = useNarration(
    item?.text || "", voice, useRecording && item ? `explorer-${item.id}` : undefined,
  );
  return (
    <section className="church-explorer" aria-labelledby={title}>
      <div className="section-heading"><div><h2 id={title} tabIndex={-1}>{activityCopy.explorerTitle}</h2><p>{activityCopy.explorerHint}</p></div></div>
      <div className="explorer-progress">
        <p role="status">{explorerReward.progress(explored.length, churchDiscoveries.length)}</p>
        <progress value={explored.length} max={churchDiscoveries.length} aria-label={explorerReward.hint} />
        {!earned && <p>{explorerReward.hint}</p>}
      </div>
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
            aria-description={explored.includes(discovery.id) ? explorerReward.visited : undefined}
            onClick={() => choose(index)}>{index + 1}{explored.includes(discovery.id) && <span className="explorer-check" aria-hidden="true">✓</span>}</button>
        ))}
      </div>
      <div className="explorer-legend">
        {churchDiscoveries.map((discovery, index) => (
          <button key={discovery.id} aria-pressed={index === selected}
            aria-description={explored.includes(discovery.id) ? explorerReward.visited : undefined}
            onClick={() => choose(index)}><span aria-hidden="true">{index + 1} · </span>{discovery.name}{explored.includes(discovery.id) && <span aria-hidden="true"> ✓</span>}</button>
        ))}
      </div>
      {earned && <div className="explorer-reward">
        {celebrate && <div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i}
          style={{ left: `${(i * 37) % 100}%`, background: ["#eabc4e", "#769e75", "#e48b76", "#8aaed0"][i % 4], animationDelay: `${(i % 6) * 0.08}s` }} />)}</div>}
        <StickerArtwork kind="explorer" />
        <div role="status"><h3>{explorerReward.earned}</h3><p>{explorerReward.note}</p></div>
        <button className="activity-listen" onClick={onSeeSticker}>{ui.seeSticker}</button>
      </div>}
      <div className="explorer-discovery">
        <div role="status"><h3>{item?.name || activityCopy.explorerChoose}</h3>{item && <p>{item.text}</p>}</div>
        {item && <button className="activity-listen" onClick={read}>{speaking ? activityCopy.explorerStop : activityCopy.explorerRead} <span aria-hidden="true">♫</span></button>}
        <p role="status" className={audioMessage ? undefined : "sr-only"}>{audioMessage}</p>
      </div>
    </section>
  );
}
