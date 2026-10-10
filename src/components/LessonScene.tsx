import { useState, type ReactNode } from "react";
import { useMassContent } from "../hooks/useMassContent";
import { SignOfCrossScene } from "./SignOfCrossScene";

import { StorybookLessonScene, lessonDurations } from "./StorybookLessonScene";
import { EntranceProcession } from "./EntranceProcession";

export function LessonScene({ partId, children }: { partId: string; children: ReactNode }) {
  const [replay, setReplay] = useState(0);
  const { activityCopy, lessonScenes, sections } = useMassContent();
  const scene = lessonScenes[partId];
  if (partId === "sign") return <SignOfCrossScene />;
  const animated = partId in lessonDurations;
  const part = sections.flatMap(section => section.parts).find(part => part.id === partId);
  return (
    <>
      <div key={replay} className={`lesson-scene${scene && !animated ? ` scene-animation-${scene.kind}` : ""}`}>
        {scene?.kind === "procession" ? <EntranceProcession alt={scene.alt!} /> : animated ? <StorybookLessonScene partId={partId} alt={part?.happening || partId} /> : children}
      </div>
      {(scene || animated) && <div className={`scene-controls${(scene?.kind === "procession" || animated) ? " procession-controls" : ""}`}>
        {!animated && scene?.kind !== "procession" && <span>{scene?.caption}</span>}
        <button onClick={() => setReplay(n => n + 1)}>{activityCopy.replay} <span aria-hidden="true">↻</span></button>
      </div>}
    </>
  );
}
