import { useEffect, useRef } from "react";

type Box = [number, number, number, number];
const characterBoxes: Box[] = [[119, 11, 172, 444], [434, 82, 142, 372], [774, 24, 178, 433], [1086, 22, 199, 435]];
const turnBoxes: Box[] = [[265, 13, 187, 532], [637, 6, 215, 539]];
const people = [
  { cell: 0, delay: 0, lane: 0, startY: .81, endX: .365, startSize: 164 },
  { cell: 1, delay: 0, lane: -1, startY: .81, endX: .405, startSize: 138 },
  { cell: 1, delay: 0, lane: 1, startY: .81, endX: .635, startSize: 138 },
  { cell: 2, delay: 4.5, lane: 0, startY: .895, endX: .595, startSize: 171 },
  { cell: 3, delay: 9, lane: 0, startY: .975, endX: .485, startSize: 181 },
];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export function EntranceProcession({ alt }: { alt: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const bg = new Image(), sprites = new Image(), turnSprites = new Image();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, frame = 0, loaded = 0, elapsed = 0, last = 0;
    const duration = 34;
    const playbackRate = duration / 25;
    function sprite(image: HTMLImageElement, box: Box, size: number, opacity = 1, scale = 1) {
      if (!ctx) return;
      const [sx, sy, sw, sh] = box, width = size * sw / sh;
      ctx.save(); ctx.globalAlpha = opacity; ctx.scale(scale, 1);
      ctx.drawImage(image, sx, sy, sw, sh, -width / 2, -size, width, size);
      ctx.restore();
    }
    function draw(t: number) {
      if (!ctx || !canvas || loaded < 3 || disposed) return;
      ctx.clearRect(0, 0, 1200, 780);
      // Fill the lesson's 20:13 frame from the start; ease toward the sanctuary.
      const approach = smooth((t - 12) / 17);
      const zoom = mix(780 / 550, 1.92, approach);
      ctx.save(); ctx.translate(600 - zoom * 582, -30 * approach); ctx.scale(zoom, zoom);
      ctx.drawImage(bg, 0, 0, 1200, 550);
      const poses = people.map(p => {
        const local = t - p.delay;
        const walk = clamp(local / 14), climb = smooth((local - 14) / 6);
        const x = mix(mix(582 + p.lane * 53, 582 + p.lane * 31, walk), p.endX * 1200, climb);
        const y = mix(mix(p.startY * 550, .72 * 550, walk), (p.cell === 3 ? .615 : .625) * 550, climb);
        const size = mix(mix(p.startSize, p.cell === 1 ? 108 : 130, walk), p.cell === 3 ? 114 : p.cell === 1 ? 88 : 106, climb);
        const moving = local > 0 && local < 20;
        const phase = t * 6.4 + p.cell;
        return { ...p, x, y: y + (moving ? Math.sin(phase) * 1.1 : 0), size, roll: moving ? Math.sin(phase) * .008 : 0 };
      }).sort((a, b) => a.y - b.y);
      for (const p of poses) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.roll);
        if (p.cell === 3 && t >= 29) {
          const first = smooth((t - 29) / .8), second = smooth((t - 29.8) / 1.2);
          if (first < 1) sprite(sprites, characterBoxes[3], p.size, 1 - first, mix(1, .75, first));
          if (second < 1) sprite(turnSprites, turnBoxes[0], p.size, first * (1 - second));
          if (second > 0) sprite(turnSprites, turnBoxes[1], p.size, second, mix(.8, 1, second));
        } else sprite(sprites, characterBoxes[p.cell], p.size);
        ctx.restore();
      }
      ctx.restore();
      canvas.dataset.sceneTime = t.toFixed(2);
      canvas.dataset.zoom = zoom.toFixed(3);
    }
    function tick(now: number) {
      if (disposed) return;
      if (!document.hidden) elapsed = Math.min(duration, elapsed + (last ? Math.min((now - last) / 1000, .08) * playbackRate : 0));
      last = now;
      draw(elapsed);
      if (elapsed < duration && !media.matches) frame = requestAnimationFrame(tick);
    }
    function motionChanged() {
      cancelAnimationFrame(frame); last = 0;
      if (media.matches) { elapsed = duration; draw(duration); }
      else if (loaded === 3 && elapsed < duration) frame = requestAnimationFrame(tick);
    }
    media.addEventListener("change", motionChanged);
    for (const im of [bg, sprites, turnSprites]) {
      im.onload = () => {
        if (disposed) return;
        loaded++;
        if (loaded === 3) {
          elapsed = media.matches ? duration : 0;
          draw(elapsed);
          if (!media.matches) frame = requestAnimationFrame(tick);
        }
      };
    }
    const base = import.meta.env.BASE_URL;
    bg.src = `${base}artwork/procession/church.jpg`;
    sprites.src = `${base}artwork/procession/characters.webp`;
    turnSprites.src = `${base}artwork/procession/priest-turn.webp`;
    return () => { disposed = true; cancelAnimationFrame(frame); media.removeEventListener("change", motionChanged); };
  }, []);
  return <canvas ref={ref} className="entrance-procession" width={1200} height={780} role="img" aria-label={alt} />;
}
