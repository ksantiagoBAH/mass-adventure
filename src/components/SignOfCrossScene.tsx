import { useEffect, useId, useRef, useState } from "react";
import { useMassContent } from "../hooks/useMassContent";

type Point = { x: number; y: number };
function elbow(shoulder: Point, hand: Point, direction = 1) {
  const dx = hand.x - shoulder.x, dy = hand.y - shoulder.y;
  const distance = Math.max(6, Math.hypot(dx, dy));
  const reach = (37 * 37 - 42 * 42 + distance * distance) / (2 * distance);
  const bend = Math.sqrt(Math.max(0, 37 * 37 - reach * reach)) * direction;
  return { x: shoulder.x + dx / distance * reach - dy / distance * bend,
    y: shoulder.y + dy / distance * reach + dx / distance * bend };
}

export function SignOfCrossScene() {
  const { signOfCrossCopy: copy } = useMassContent();
  const title = useId();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hand, setHand] = useState<Point>(copy.steps[0]);
  const position = useRef<Point>(copy.steps[0]);
  const frame = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReducedMotion(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const start = { ...position.current };
    const target = copy.steps[step];
    if (reducedMotion) { position.current = target; setHand(target); return; }
    const began = performance.now();
    const move = (now: number) => {
      const progress = Math.min(1, (now - began) / 650);
      const ease = progress * progress * (3 - 2 * progress);
      const point = { x: start.x + (target.x - start.x) * ease, y: start.y + (target.y - start.y) * ease };
      position.current = point; setHand(point);
      if (progress < 1) frame.current = requestAnimationFrame(move);
    };
    frame.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame.current);
  }, [step, replay, reducedMotion]);
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      if (step === copy.steps.length - 1) setPlaying(false);
      else setStep(n => n + 1);
    }, 1700);
    return () => clearTimeout(timer);
  }, [playing, step]);
  const pause = () => { setPlaying(false); cancelAnimationFrame(frame.current); };
  const joint = elbow({ x: 100, y: 120 }, hand);
  const leftHand = step === 4 ? { x: 134, y: 155 } : { x: 175, y: 177 };
  const leftJoint = elbow({ x: 160, y: 120 }, leftHand, -1);
  return (
    <div className="sign-cross-scene">
      <svg viewBox="0 0 260 250" role="img" aria-labelledby={title}>
        <title id={title}>{copy.alt}</title>
        <circle cx="130" cy="126" r="111" fill="#e5eff5" />
        <path d="M102 194v37m56-37v37" stroke="#48687d" strokeWidth="18" strokeLinecap="round" />
        <path d="M93 124q37-20 74 0l7 75q-44 16-88 0z" fill="#7b9ab8" stroke="#48687d" strokeWidth="3" />
        <path d="M119 106v20q11 10 22 0v-20" fill="#e1ae89" />
        <ellipse cx="130" cy="86" rx="29" ry="31" fill="#e1ae89" />
        <path d="M101 83q-5-37 29-37 35 0 30 39l-9-17q-28 8-44-1z" fill="#735443" />
        <circle cx="120" cy="86" r="2.5" fill="#334b42" /><circle cx="140" cy="86" r="2.5" fill="#334b42" />
        <path d="M122 99q8 6 16 0" fill="none" stroke="#a8654c" strokeWidth="2" strokeLinecap="round" />
        <path d={`M160 120L${leftJoint.x} ${leftJoint.y}`} stroke="#7b9ab8" strokeWidth="17" strokeLinecap="round" />
        <path d={`M${leftJoint.x} ${leftJoint.y}L${leftHand.x} ${leftHand.y}`} stroke="#e1ae89" strokeWidth="11" strokeLinecap="round" />
        <circle cx={leftHand.x} cy={leftHand.y} r="7" fill="#e1ae89" />
        <path d={`M100 120L${joint.x} ${joint.y}`} stroke="#7b9ab8" strokeWidth="17" strokeLinecap="round" />
        <path d={`M${joint.x} ${joint.y}L${hand.x} ${hand.y}`} stroke="#e1ae89" strokeWidth="11" strokeLinecap="round" />
        <g className="cross-right-hand" data-step={step}>
          <circle cx={hand.x} cy={hand.y} r="7" fill="#e1ae89" stroke="#ba805d" strokeWidth="1" />
          <path d={`M${hand.x - 3} ${hand.y - 2}v-5m3 5v-6m3 6v-5`} stroke="#e1ae89" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <p className="gesture-instruction">{copy.instruction}</p>
      <div className="gesture-caption" role="status">
        <strong>{step + 1}. {copy.steps[step].label}</strong>
        <span>{copy.steps[step].words}</span>
      </div>
      <div className="gesture-controls">
        <button onClick={() => {
          if (playing) pause();
          else { if (step === 4) setStep(0); setReplay(n => n + 1); setPlaying(true); }
        }}>{playing ? copy.pause : copy.play}</button>
        <button disabled={step === 4} onClick={() => { pause(); setStep(n => n + 1); }}>{copy.next}</button>
        <button onClick={() => { pause(); setStep(0); setReplay(n => n + 1); }}>{copy.reset}</button>
      </div>
    </div>
  );
}
