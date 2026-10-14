import { Footer } from './Footer';
import { useEffect, useState } from 'react';
import { artwork, mysteries, mysterySets, type MysterySet } from './data/mysteries';
import { prayerIds, prayers, type PrayerId } from './data/prayers';
import { resolveMysteryName, rotatingIndex } from './domain/calendar';
import { buildRosarySteps, beadLabel, parseRosarySession, type RosarySession } from './domain/rosary';
import { buildChapletSteps, chapletBeadProgress, parseChapletSession, type ChapletSession } from './domain/chaplet';
import { parseNarrationVoice, type NarrationVoice } from './domain/narration-voice';
import { recordingForVoice } from './data/voice-recordings';
import { chapletRecordingForVoice, chapletTimingForVoice } from './data/chaplet-recordings';
import { timingForNarration } from './data/narration-timing';
import { mysteryNarrationId, stepNarrationId, type NarrationId } from './data/narration';
import { mysteryVideos } from './data/mystery-videos';
import { chapletVideos } from './data/chaplet-videos';
import { Player } from './Player';
import { Media } from './Media';
import { readSaved, save } from './storage';

type Page = 'today' | 'rosary' | 'chaplet' | 'mysteries' | 'prayers';
const pages: { id: Page; label: string; icon: string }[] = [{ id: 'today', label: 'Today', icon: '☀' }, { id: 'rosary', label: 'The Rosary', icon: '◎' }, { id: 'chaplet', label: 'Divine Mercy', icon: '✧' }, { id: 'mysteries', label: 'Mysteries', icon: '▧' }, { id: 'prayers', label: 'Prayers', icon: '✝' }];
const pageFromHash = (): Page => pages.find(p => p.id === location.hash.slice(1).split('/')[0])?.id ?? 'today';
const days: Record<MysterySet, string> = { Joyful: 'Monday & Saturday', Sorrowful: 'Tuesday & Friday', Glorious: 'Wednesday & Sunday', Luminous: 'Thursday' };
export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [date, setDate] = useState(() => new Date());
  const today = resolveMysteryName(null, date);
  const todayIndex = rotatingIndex(date);
  const [set, setSet] = useState<MysterySet>(today);
  const [fatima, setFatima] = useState(true);
  const [opening, setOpening] = useState(true);
  const [closing, setClosing] = useState(true);
  const [voice, setVoice] = useState<NarrationVoice>(() => readSaved('voice', parseNarrationVoice, 'male'));
  const [rosary, setRosary] = useState<RosarySession | null>(() => readSaved('rosary', parseRosarySession, null));
  const [chaplet, setChaplet] = useState<ChapletSession | null>(() => readSaved('chaplet', parseChapletSession, null));
  const [inSession, setInSession] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [guided, setGuided] = useState(true);
  const [fontSize, setFontSize] = useState(() => readSaved('font-size', value => typeof value === 'number' && value >= 20 && value <= 36 ? value : 26, 26));
  const [librarySet, setLibrarySet] = useState<MysterySet>(today);
  const [reflection, setReflection] = useState<number | null>(null);
  const [prayer, setPrayer] = useState<PrayerId | null>(null);
  const [query, setQuery] = useState('');
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const changed = () => { if (location.hash === '#main') return; setPage(pageFromHash()); setInSession(false); setPlaying(false); setPrayer(null); setReflection(null); window.scrollTo(0, 0); };
    const tick = () => setDate(new Date());
    window.addEventListener('hashchange', changed); const timer = setInterval(tick, 60000);
    return () => { window.removeEventListener('hashchange', changed); clearInterval(timer); };
  }, []);
  useEffect(() => { if (rosary && !save('rosary', rosary)) setStorageError(true); }, [rosary]);
  useEffect(() => { if (chaplet && !save('chaplet', chaplet)) setStorageError(true); }, [chaplet]);
  useEffect(() => { if (!save('voice', { version: 1, voice })) setStorageError(true); }, [voice]);
  useEffect(() => { if (!save('font-size', fontSize)) setStorageError(true); }, [fontSize]);
  function navigate(id: Page) { setPlaying(false); setInSession(false); setReflection(null); setPrayer(null); setPage(id); location.hash = id; window.scrollTo(0, 0); }
  function start(resume = false) {
    setPlaying(false);
    if (page === 'rosary' && (!resume || !rosary)) setRosary({ version: 1, set, includeFatima: fatima, position: 0 });
    if (page === 'chaplet' && (!resume || !chaplet)) setChaplet({ version: 1, includeOpening: opening, includeClosing: closing, position: 0 });
    setInSession(true); window.scrollTo(0, 0);
  }
  const rosarySteps = rosary ? buildRosarySteps(rosary.set, rosary.includeFatima) : [];
  const chapletSteps = chaplet ? buildChapletSteps(chaplet) : [];
  const isRosary = page === 'rosary';
  const position = (isRosary ? rosary : chaplet)?.position ?? 0;
  const steps = isRosary ? rosarySteps : chapletSteps;
  const step = steps[position];
  function jump(value: number, keepPlaying = false) {
    if (!keepPlaying) setPlaying(false);
    const nextPosition = Math.min(Math.max(value, 0), steps.length);
    if (isRosary) setRosary(previous => previous ? { ...previous, position: nextPosition } : previous);
    else setChaplet(previous => previous ? { ...previous, position: nextPosition } : previous);
    if (nextPosition === steps.length) setPlaying(false);
  }
  const settings = <div className="preferences"><label>Voice <select value={voice} onChange={e => { setPlaying(false); setVoice(e.target.value as NarrationVoice); }}><option value="male">Male</option><option value="female">Female</option></select></label><label>Text size <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}><option value="22">Small</option><option value="26">Medium</option><option value="32">Large</option></select></label></div>;
  function libraryPlayer(id: NarrationId, title: string, text: string) {
    const recording = recordingForVoice(id, voice);
    return <div className="reading-panel">{settings}<Player key={`${id}:${voice}`} activeKey={`${id}:${voice}`} recording={recording} timing={timingForNarration(id, recording?.transcript, voice)} title={title} text={text} auto={false} playing={playing} setPlaying={setPlaying} fontSize={fontSize}/></div>;
  }
  return <div className={`app-shell ${(inSession && (page === 'rosary' || page === 'chaplet')) ? 'meditating' : ''}`}>
    <a href="#main" className="skip-link">Skip to content</a>
    <aside className="sidebar"><a className="brand" href="#today" onClick={e => { e.preventDefault(); navigate('today'); }}><span className="brand-mark">✝</span><span>Rosary<small>A quiet space for prayer</small></span></a>
      <nav aria-label="Main navigation">{pages.map(p => <a key={p.id} href={`#${p.id}`} aria-current={page === p.id ? 'page' : undefined} onClick={e => { e.preventDefault(); navigate(p.id); }}><span aria-hidden="true">{p.icon}</span>{p.label}</a>)}</nav>
      <nav className="related-sites" aria-label="Related websites"><a href="../">Mass Adventure <small>For children</small></a><a href="../at-the-table/">At the Table <small>For adults</small></a></nav><div className="sidebar-bottom"><span className="little-cross">✝</span><p>Be still,<br/>and know that I am God.</p><small>Psalm 46:10</small><div className="local-note">Your prayer progress stays<br/>on this device.</div></div>
    </aside>
    <main id="main" tabIndex={-1}><header className="topbar"><span>{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span><span className="daily-label">{today} Mysteries today <span aria-hidden="true">✧</span></span></header>
      {storageError && <p className="notice" role="status">Your browser cannot save progress right now. You can continue praying in this tab.</p>}
      {page === 'today' && <div className="page-content"><div className="page-heading"><p className="eyebrow">A daily invitation</p><h1>A moment of peace.</h1><p>Let the Rosary guide your prayer.</p></div>
        <section className="today-hero"><figure className="hero-art"><img className="hero-image" src={artwork[today][todayIndex]} alt={mysteries[today].list[todayIndex]}/><figcaption><span>Mystery {todayIndex + 1} of 5</span>{mysteries[today].list[todayIndex]}</figcaption></figure><div className="hero-copy"><p className="eyebrow">Today's Rosary</p><h2>{today} Mysteries</h2><p>{mysteries[today].descriptions[todayIndex]}</p><span className="hero-schedule">{days[today]}</span><button className="primary" onClick={() => { setSet(today); navigate('rosary'); }}>Pray the Rosary <span>→</span></button><button className="text-link" onClick={() => { setLibrarySet(today); navigate('mysteries'); }}>Read the reflections →</button></div></section>
        <div className="section-heading"><h2>Continue in prayer</h2><span>One prayer at a time</span></div><div className="devotion-grid"><button className="devotion-card" onClick={() => navigate('chaplet')}><span className="card-symbol">✧</span><span className="eyebrow">Divine Mercy</span><h3>Jesus, I trust in You.</h3><p>Pray the Chaplet with guided narration and gentle sacred animations.</p><span className="card-link">Begin the Chaplet →</span></button><button className="devotion-card" onClick={() => navigate('prayers')}><span className="card-symbol">✝</span><span className="eyebrow">Prayer library</span><h3>Words to return to.</h3><p>Twelve familiar prayers, ready to read or listen to at your own pace.</p><span className="card-link">Open the prayer library →</span></button></div>
        <p className="closing-note">“Pray, hope, and don't worry.” <span>— Saint Padre Pio</span></p>
      </div>}
      {(page === 'rosary' || page === 'chaplet') && !inSession && <div className="page-content"><div className="page-heading"><p className="eyebrow">{isRosary ? 'With Mary, toward Christ' : 'An invitation to mercy'}</p><h1>{isRosary ? 'Pray the Rosary.' : 'The Divine Mercy Chaplet.'}</h1><p>Let the voice guide you, or read quietly at your own pace.</p></div><div className={`setup-grid ${isRosary ? '' : 'chaplet-setup'}`}><Media key={isRosary ? set : 'chaplet'} video={isRosary ? undefined : chapletVideos[0].source} image={isRosary ? artwork[set][0] : chapletVideos[0].still} title={isRosary ? mysteries[set].list[0] : 'Jesus, I trust in You'}/><section className="setup-panel"><h2>Prepare for prayer</h2>{isRosary ? <><label className="field">Mysteries<select value={set} onChange={e => setSet(e.target.value as MysterySet)}>{mysterySets.map(s => <option key={s}>{s}</option>)}</select></label><label className="check"><input type="checkbox" checked={fatima} onChange={e => setFatima(e.target.checked)}/>Include the Fatima Prayer</label></> : <><label className="check"><input type="checkbox" checked={opening} onChange={e => setOpening(e.target.checked)}/>Include optional opening prayers</label><label className="check"><input type="checkbox" checked={closing} onChange={e => setClosing(e.target.checked)}/>Include optional closing prayer</label></>}
          <label className="field">Prayer mode<select value={guided ? 'guided' : 'manual'} onChange={e => setGuided(e.target.value === 'guided')}><option value="guided">Guided narration · Advance automatically</option><option value="manual">Read at my own pace</option></select></label>{settings}<button className="primary full" onClick={() => start()}>Start {isRosary ? 'Rosary' : 'Chaplet'} →</button>{(isRosary ? rosary : chaplet) && <button className="secondary full" onClick={() => start(true)}>Resume saved {isRosary ? 'Rosary' : 'Chaplet'}</button>}<p className="fine-print">Starting a new prayer replaces your saved place. Press Play when you are ready to listen.</p></section></div></div>}
      {(page === 'rosary' || page === 'chaplet') && inSession && <div className="session-content"><div className="session-heading"><div><p className="eyebrow">{isRosary ? `${rosary?.set} Mysteries` : 'Divine Mercy Chaplet'}</p><h1>{step ? 'Remain in prayer.' : 'Your prayer is complete.'}</h1></div><button className="secondary" onClick={() => { setPlaying(false); setInSession(false); }}>Save & exit</button></div>
        {!step ? <section className="completion"><span>✝</span><h2>Go in peace.</h2><p>{isRosary ? 'All five decades of the Rosary' : 'The Divine Mercy Chaplet'} complete. Take a quiet moment of thanksgiving.</p><button className="primary" onClick={() => { setInSession(false); }}>Return to prayer setup →</button></section> : (() => {
          const rs = rosarySteps[position], cs = chapletSteps[position];
          const id = isRosary && rosary ? stepNarrationId(rosary.set, rs) : undefined;
          const recording = isRosary ? (id ? recordingForVoice(id, voice) : undefined) : chapletRecordingForVoice(cs.narrationId, voice);
          const timing = isRosary ? timingForNarration(id, recording?.transcript, voice) : chapletTimingForVoice(cs.narrationId, voice);
          const imageIndex = isRosary ? rs.mysteryIndex ?? (rs.phase === 'closing' ? 4 : 0) : cs.decade === undefined ? 0 : cs.decade + 1;
          const label = isRosary ? beadLabel(rs) : chapletBeadProgress(cs).label;
          const count = isRosary ? (rs.phase === 'opening' ? 4 : 11) : chapletBeadProgress(cs).count;
          const beadStart = isRosary && rs.phase !== 'opening' ? 4 + 11 * (rs.mysteryIndex ?? 4) : 0;
          const bead = isRosary ? rs.beadIndex ?? -1 : chapletBeadProgress(cs).activeIndex;
          return <><div className="prayer-progress"><div><span>{label}</span><span>{position + 1} / {steps.length} prayers</span></div><progress max={steps.length} value={position + 1}/></div><div className="meditation-grid"><div className="visual-panel"><Media key={`${isRosary ? rosary?.set : 'chaplet'}:${imageIndex}`} image={isRosary ? artwork[rosary!.set][imageIndex] : chapletVideos[imageIndex].still} video={isRosary ? mysteryVideos[rosary!.set][imageIndex] : chapletVideos[imageIndex].source} title={isRosary ? mysteries[rosary!.set].list[imageIndex] : chapletVideos[imageIndex].title}/><div className="bead-panel"><p className="eyebrow">{step.instruction}</p><div className="beads" role="img" aria-label={label}><span aria-hidden="true">✝</span>{Array.from({ length: count }, (_, index) => { const absolute = index + beadStart; return <i key={index} className={`${absolute === bead ? 'active' : ''} ${absolute < bead || step.phase === 'closing' ? 'done' : ''} ${index === 0 ? 'large' : ''}`}><span>{index === 0 ? '' : index}</span></i>; })}</div></div></div>
            <div className="reading-panel">{settings}<Player key={`${step.id}:${voice}`} activeKey={`${step.id}:${voice}`} recording={recording} timing={timing} title={step.title} text={step.text} auto={guided} advance={() => jump(position + 1, true)} previous={position > 0 ? () => jump(position - 1) : undefined} next={() => jump(position + 1)} playing={playing} setPlaying={setPlaying} fontSize={fontSize}/></div>
            <details className="contents"><summary>Prayer contents</summary><p className="eyebrow">Prayer contents</p><h2>Your path</h2>{steps.map((item, index) => (item.phase !== 'decade' || (isRosary ? item.id.startsWith('mystery-') : item.id.startsWith('father-'))) && <button key={item.id} className={index === position || (item.phase === 'decade' && step.phase === 'decade' && ('mysteryIndex' in item ? item.mysteryIndex === rs?.mysteryIndex : 'decade' in item && item.decade === cs?.decade)) ? 'selected' : ''} onClick={() => jump(index)}>{item.phase === 'decade' ? <><small>{isRosary ? `Mystery ${(rs && 'mysteryIndex' in item ? item.mysteryIndex ?? 0 : 0) + 1}` : `Decade ${'decade' in item ? (item.decade ?? 0) + 1 : 1}`}</small>{isRosary ? item.title : 'Divine Mercy'}</> : item.title}</button>)}</details></div></>;
        })()}
      </div>}
      {page === 'mysteries' && <div className="page-content"><div className="page-heading"><p className="eyebrow">Twenty moments in the life of Christ</p><h1>The mysteries of the Rosary.</h1><p>Contemplate the life, love, and glory of Jesus with Mary.</p></div><div className="set-tabs" aria-label="Mystery sets">{mysterySets.map(s => <button key={s} aria-pressed={librarySet === s} className={librarySet === s ? 'selected' : ''} onClick={() => { setPlaying(false); setLibrarySet(s); setReflection(null); }}>{s}</button>)}</div><p className="set-schedule">{days[librarySet]} · Sundays follow the app's seasonal convention.</p>{reflection === null ? <div className="mystery-grid">{mysteries[librarySet].list.map((name, index) => <button className="mystery-card" key={name} onClick={() => { setPlaying(false); setReflection(index); }}><img src={artwork[librarySet][index]} alt="" loading="lazy"/><div><p className="eyebrow">Mystery {index + 1}</p><h2>{name}</h2><p>{mysteries[librarySet].descriptions[index]}</p><span className="card-link">Read & listen →</span></div></button>)}</div> : <><button className="text-link back-link" onClick={() => { setPlaying(false); setReflection(null); }}>← All {librarySet} mysteries</button><div className="reflection-grid"><Media key={`${librarySet}:${reflection}`} image={artwork[librarySet][reflection]} video={mysteryVideos[librarySet][reflection]} title={mysteries[librarySet].list[reflection]}/>{libraryPlayer(mysteryNarrationId(librarySet, reflection), mysteries[librarySet].list[reflection], mysteries[librarySet].details[reflection])}</div></>}</div>}
      {page === 'prayers' && <div className="page-content"><div className="page-heading"><p className="eyebrow">Familiar words. Renewed meaning.</p><h1>A treasury of prayer.</h1><p>Read slowly. Listen closely. Come back as often as you need.</p></div>{prayer ? <><button className="text-link back-link" onClick={() => { setPlaying(false); setPrayer(null); }}>← All prayers</button><div className="prayer-library-reader">{libraryPlayer(`prayer:${prayer}`, prayers[prayer].title, prayers[prayer].text)}</div></> : <><label className="search-label">Find a prayer<input type="search" placeholder="Search prayers…" value={query} onChange={e => setQuery(e.target.value)}/></label><div className="prayer-grid">{prayerIds.filter(id => `${prayers[id].title} ${prayers[id].text}`.toLowerCase().includes(query.toLowerCase())).map(id => <button className="prayer-card" key={id} onClick={() => { setPlaying(false); setPrayer(id); }}><span className="eyebrow">{prayers[id].category}</span><h2>{prayers[id].title}</h2><p>{prayers[id].text.slice(0, 108)}…</p><span className="card-link">Read & listen →</span></button>)}</div>{!prayerIds.some(id => `${prayers[id].title} ${prayers[id].text}`.toLowerCase().includes(query.toLowerCase())) && <p role="status">No prayers found. Try a different word.</p>}</>}</div>}
      <Footer />
    </main>
  </div>;
}
