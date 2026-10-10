import { useState, type ReactNode } from "react";
import { useMassContent } from "../hooks/useMassContent";
import { SignOfCrossScene } from "./SignOfCrossScene";

import { EntranceProcession } from "./EntranceProcession";

export function LessonScene({ partId, children }: { partId: string; children: ReactNode }) {
  const [replay, setReplay] = useState(0);
  const { activityCopy, lessonScenes } = useMassContent();
  const scene = lessonScenes[partId];
  if (partId === "sign") return <SignOfCrossScene />;
  return (
    <>
      <div key={replay} className={`lesson-scene${scene ? ` scene-animation-${scene.kind}` : ""}`}>
        {scene?.kind === "procession" ? <EntranceProcession alt={scene.alt!} /> : children}
      </div>
      {scene && <div className={`scene-controls${scene.kind === "procession" ? " procession-controls" : ""}`}>
        {scene.kind !== "procession" && <span>{scene.caption}</span>}
        <button onClick={() => setReplay(n => n + 1)}>{activityCopy.replay} <span aria-hidden="true">↻</span></button>
      </div>}
    </>
  );
}
