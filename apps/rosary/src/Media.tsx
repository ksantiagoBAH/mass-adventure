import { useEffect, useRef, useState } from 'react';
export function Media({ image, video, title }: { image: string; video?: string; title: string }) {
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);
  const element = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setPaused(media.matches);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const update = () => { if (paused || document.hidden) node.pause(); else void node.play().catch(() => setPaused(true)); };
    update(); document.addEventListener('visibilitychange', update);
    return () => { node.pause(); document.removeEventListener('visibilitychange', update); };
  }, [paused]);
  return <figure className="sacred-media">
    {video && !failed ? <video ref={element} src={video} poster={image} muted loop playsInline preload="none" aria-label={title} onError={() => setFailed(true)} /> : <img src={image} alt={title}/>}
    <figcaption><span>{title}</span>{video && !failed && <button onClick={() => setPaused(!paused)}>{paused ? 'Animate' : 'Pause animation'}</button>}</figcaption>
  </figure>;
}
