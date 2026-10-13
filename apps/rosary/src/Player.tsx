import { useEffect, useRef, useState } from 'react';
import { readSaved, save } from './storage';
import type { NarrationRecording } from './data/narration';
import type { NarrationTiming } from './domain/narration-progress';
import { narrationPhrases, phraseAtWord, wordAtTime } from './domain/narration-progress';

type Props = { recording?: NarrationRecording; timing?: NarrationTiming; text: string; title: string; auto: boolean; advance?: () => void; previous?: () => void; next?: () => void; activeKey: string; playing: boolean; setPlaying: (value: boolean) => void; fontSize: number };
export function Player({ recording, timing, text, title, auto, advance, previous, next, activeKey, playing, setPlaying, fontSize }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef<HTMLSpanElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(() => readSaved('playback-rate', value => typeof value === 'number' && [0.85, 1, 1.15, 1.25, 2].includes(value) ? value : 1, 1));
  const [error, setError] = useState('');
  const [follow, setFollow] = useState(true);
  const phrases = timing ? narrationPhrases(timing.transcript, timing.words) : [];
  const phraseIndex = timing ? phraseAtWord(phrases, wordAtTime(timing.words, time)) : -1;
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    element.playbackRate = rate;
    if (playing && recording) {
      let cancelled = false;
      void element.play().catch(() => { if (!cancelled) { setError('Playback was paused by your browser. Press Play to continue.'); setPlaying(false); } });
      return () => { cancelled = true; element.pause(); };
    }
    element.pause();
  }, [playing, recording, rate, setPlaying]);
  useEffect(() => {
    const pause = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, [setPlaying]);
  useEffect(() => {
    if (follow && playing && active.current) {
      const reader = active.current.closest<HTMLElement>('.reader');
      if (reader) {
        const word = active.current.getBoundingClientRect();
        const frame = reader.getBoundingClientRect();
        if (word.top < frame.top + 40 || word.bottom > frame.bottom - 40) reader.scrollTo({ top: reader.scrollTop + word.top - frame.top - reader.clientHeight * 0.35, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
    }
  }, [phraseIndex, follow, playing]);
  const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  return <>
    <div className="reader" role="region" aria-label="Prayer text" tabIndex={0} onWheel={() => setFollow(false)} onTouchMove={() => setFollow(false)} style={{ fontSize }}>
      <p className="eyebrow">{auto ? 'Follow the voice · Rest in prayer' : 'Read at your own pace'}</p>
      <h2>{title}</h2>
      <div className="prayer-text">{phrases.length ? phrases.map((phrase, index) => <span key={index} ref={index === phraseIndex ? active : undefined} className={index === phraseIndex ? 'spoken' : ''}>{phrase.text}{' '}</span>) : text}</div>
      {!follow && <button className="quiet follow" onClick={() => setFollow(true)}>Follow voice ↓</button>}
    </div>
    <div className="audio-controls">
      <audio ref={audio} key={activeKey} src={recording?.source} preload="metadata" onLoadedMetadata={() => { setDuration(audio.current?.duration || 0); setTime(0); }} onTimeUpdate={() => setTime(audio.current?.currentTime || 0)} onEnded={() => { if (auto && advance) advance(); else setPlaying(false); }} onError={() => { setError('This recording could not load. Try Replay, or continue at your own pace.'); setPlaying(false); }}/>
      <div className="transport">
        {previous && <button className="icon-button" aria-label="Previous prayer" onClick={previous}>←</button>}
        <button className="play" aria-label={playing ? 'Pause narration' : 'Play narration'} disabled={!recording} onClick={() => { setError(''); setPlaying(!playing); }}>{playing ? 'Ⅱ' : '▶'}</button>
        {next && <button className="icon-button" aria-label="Next prayer" onClick={next}>→</button>}
        <button className="quiet" onClick={() => { if (audio.current) { audio.current.load(); setTime(0); setError(''); setPlaying(false); } }}>Replay</button>
        <span className="time">{clock(time)} / {clock(duration)}</span>
        <label className="speed">Speed <select value={rate} onChange={e => { const value = Number(e.target.value); setRate(value); save('playback-rate', value); }}><option value="0.85">0.85×</option><option value="1">1×</option><option value="1.15">1.15×</option><option value="1.25">1.25×</option><option value="2">2×</option></select></label>
      </div>
      <label className="sr-only" htmlFor="audio-progress">Recording position</label><input id="audio-progress" type="range" min="0" max={duration || 1} step="0.1" value={Math.min(time, duration || 1)} onChange={e => { if (audio.current) audio.current.currentTime = Number(e.target.value); }}/>
      <p className="audio-note">{error || (recording ? `${recording.narrator} · AI-generated narration` : 'Read this prayer at your own pace.')}</p>
    </div>
  </>;
}
