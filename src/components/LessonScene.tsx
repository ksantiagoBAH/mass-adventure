import { useId, useState, type ReactNode } from "react";
import { useMassContent } from "../hooks/useMassContent";
import { SignOfCrossScene } from "./SignOfCrossScene";

function EntranceProcession({ alt }: { alt: string }) {
  const title = useId();
  return (
    <svg className="entrance-procession" viewBox="0 0 400 260" role="img" aria-labelledby={title}>
      <title id={title}>{alt}</title>
      <path d="M12 224V82Q200-52 388 82v142z" fill="#e5eff5" />
      <path d="M24 222V90Q200-25 376 90v132z" fill="#f6eddc" />
      {[58, 136, 230].map(x => <g key={x}>
        <path d={`M${x} 116V77a16 16 0 0 1 32 0v39z`} fill="#99c3ce" stroke="#fffdf6" strokeWidth="5" />
        <path d={`M${x + 16} 63v52m-14-26h28`} stroke="#e7bd67" strokeWidth="3" />
      </g>)}
      <path d="M12 222h376v22H12z" fill="#e8d9bb" />
      <path d="M12 222h376" stroke="#c5b18a" strokeWidth="6" />
      <path d="M288 177h82v44h-82z" fill="#c49468" />
      <path d="M282 168h94v20l-15-4-16 4-16-4-16 4-16-4-15 4z" fill="#fffdf6" stroke="#9b957d" strokeWidth="2" />
      <path d="M318 198h22m-11-9v26" stroke="#956629" strokeWidth="3" />
      <path d="M301 149h7v19h-7zm52 0h7v19h-7z" fill="#fffdf6" stroke="#b3935d" strokeWidth="1.5" />
      <path d="M304 147q-6-5 0-13 6 8 0 13m52 0q-6-5 0-13 6 8 0 13" fill="#e5a82d" />
      <path d="M322 76h14v19h18v12h-18v27h-14v-27h-18V95h18z" fill="#d99837" />
      <g className="procession-walk">
        {[{ x: 54, priest: true }, { x: 111, priest: false }, { x: 168, priest: false }].map(({ x, priest }) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <g className="procession-leg leg-left"><path d="M-7 202v19h-8" fill="none" stroke="#485951" strokeWidth="5" strokeLinecap="round" /></g>
            <g className="procession-leg leg-right"><path d="M7 202v19h8" fill="none" stroke="#485951" strokeWidth="5" strokeLinecap="round" /></g>
            <circle cy="145" r="10" fill={priest ? "#c98e69" : "#e1ae89"} />
            <path d="M-10 159h20l6 46h-32z" fill="#fffdf6" stroke="#9b957d" strokeWidth="1.5" />
            {priest && <path d="M-11 160q11-7 22 0l8 29q-19 12-38 0z" fill="#648c71" />}
            <path d="M-9 169l-5 17m23-17 7 12" stroke="#c98e69" strokeWidth="5" strokeLinecap="round" />
            {x === 168 && <>
              <path d="M18 102v109" stroke="#956629" strokeWidth="4" />
              <path d="M14 99h8v15h13v7H22v16h-8v-16H1v-7h13z" fill="#d99837" stroke="#956629" strokeWidth="1.5" />
              <path d="m8 170 10 10" stroke="#e1ae89" strokeWidth="5" strokeLinecap="round" />
            </>}
          </g>
        ))}
      </g>
    </svg>
  );
}

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
      {scene && <div className="scene-controls">
        <span>{scene.caption}</span>
        <button onClick={() => setReplay(n => n + 1)}>{activityCopy.replay} <span aria-hidden="true">↻</span></button>
      </div>}
    </>
  );
}
