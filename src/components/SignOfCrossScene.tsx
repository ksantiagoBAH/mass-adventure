import { useEffect, useId, useRef, useState } from "react";
import { useMassContent } from "../hooks/useMassContent";

import { CartoonArm, rightShoulder, type Point } from "./StorybookCharacters";
const leftShoulder = { x: 154, y: 113 };
const relaxedLeftHand = { x: 162, y: 180 };
const artwork = `${import.meta.env.BASE_URL}artwork/sign-of-cross/`;

export function SignOfCrossScene() {
  const { signOfCrossCopy: copy } = useMassContent();
  const title = useId();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hand, setHand] = useState<Point>(copy.steps[0]);
  const [leftHand, setLeftHand] = useState<Point>(relaxedLeftHand);
  const rightPosition = useRef<Point>(hand), leftPosition = useRef<Point>(leftHand);
  const [tuck, setTuck] = useState(0);
  const tuckPosition = useRef(0);
  const frame = useRef(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReducedMotion(media.matches);
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const start = { ...rightPosition.current };
    const target = copy.steps[step];
    const leftStart = { ...leftPosition.current };
    const tuckStart = tuckPosition.current, tuckTarget = step === 3 ? 1 : 0;
    const leftTarget = step === 4 ? { x: 134, y: 136 } : relaxedLeftHand;
    if (reducedMotion) {
      tuckPosition.current = tuckTarget; setTuck(tuckTarget);
      rightPosition.current = target; setHand(target);
      leftPosition.current = leftTarget; setLeftHand(leftTarget);
      return;
    }
    const began = performance.now();
    const move = (now: number) => {
      const progress = Math.min(1, (now - began) / 650);
      const ease = progress * progress * (3 - 2 * progress);
      const right = { x: start.x + (target.x - start.x) * ease, y: start.y + (target.y - start.y) * ease };
      const left = { x: leftStart.x + (leftTarget.x - leftStart.x) * ease, y: leftStart.y + (leftTarget.y - leftStart.y) * ease };
      const tuckValue = tuckStart + (tuckTarget - tuckStart) * ease;
      tuckPosition.current = tuckValue; setTuck(tuckValue);
      rightPosition.current = right; setHand(right);
      leftPosition.current = left; setLeftHand(left);
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
  const handsTogether = Math.max(0, Math.min(1, (20 - Math.hypot(leftHand.x - hand.x, leftHand.y - hand.y)) / 16));
  return (
    <div className="sign-cross-scene">
      <svg viewBox="0 0 260 250" role="img" aria-labelledby={title}>
        <circle cx="130" cy="126" r="111" fill="#e5eff5" />
        <image href={`${artwork}child.webp`} x="90" y="42" width="80" height="200" preserveAspectRatio="none" />
        <CartoonArm shoulder={leftShoulder} hand={leftHand} left handOpacity={1 - handsTogether} />
        <g className="cross-right-hand" data-step={step}>
          <CartoonArm shoulder={rightShoulder} hand={hand} tuck={tuck} handOpacity={1 - handsTogether} />
          <circle cx={hand.x} cy={hand.y} r="0" aria-hidden="true" />
        </g>
        <image className="cross-praying-hands" href={`${artwork}praying-hands.webp`} x={(hand.x + leftHand.x) / 2 - 8} y={(hand.y + leftHand.y) / 2 - 28} width="16" height="28" opacity={handsTogether} />
      </svg>
      <span id={title} className="sr-only">{copy.alt}</span>
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
