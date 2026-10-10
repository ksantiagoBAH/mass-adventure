import { useEffect, useRef, useState } from "react";
import { copy, sections, ui, phrases, artDescriptions, getCatechismLinks, churchDiscoveries, explorerReward } from "./data/massParts";
import { Illustration } from "./components/Illustration";
import { Icon } from "./components/Icon";
import PartCard from "./components/PartCard";
import { ParishArtwork } from "./components/ParishArtwork";
import { useNarratorVoices } from "./hooks/useNarratorVoices";
import { VoiceSettings } from "./components/VoiceSettings";
import { ChurchExplorer } from "./components/ChurchExplorer";
import { StickerArtwork } from "./components/StickerArtwork";
import {
  writeNavigationHistory,
  cancelPendingHistory,
} from "./lib/navigationHistory";
type Screen = "home" | "map" | "section" | "quiz" | "stickers" | "parents";
export default function App() {
  const narrator = useNarratorVoices();
  const [screen, setScreen] = useState<Screen>("home");
  const [selected, setSelected] = useState(0);
  const [card, setCard] = useState(0);
  const [question, setQuestion] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [explored, setExplored] = useState<string[]>([]);
  const explorerEarned = explored.length === churchDiscoveries.length;
  const focusExplorer = useRef(false);
  const [celebrate, setCelebrate] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const section = sections[selected];
  useEffect(() => {
    const restore = (event: PopStateEvent) => {
      cancelPendingHistory();
      const route = event.state?.massAdventure;
      if (
        !route ||
        !["home", "map", "section", "quiz", "stickers", "parents"].includes(
          route.screen,
        )
      )
        return;
      const index =
        Number.isInteger(route.selected) &&
        route.selected >= 0 &&
        route.selected < sections.length
          ? route.selected
          : 0;
      setScreen(route.screen);
      setSelected(index);
      setCard(
        Number.isInteger(route.card)
          ? Math.max(0, Math.min(route.card, sections[index].parts.length - 1))
          : 0,
      );
      setQuestion(
        Number.isInteger(route.question)
          ? Math.max(0, Math.min(route.question, 3))
          : 0,
      );
      setChoice(
        Number.isInteger(route.choice) && route.choice >= 0 && route.choice <= 2
          ? route.choice
          : null,
      );
      setCelebrate(false);
    };
    window.addEventListener("popstate", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      cancelPendingHistory();
    };
  }, []);
  useEffect(() => {
    // Only UI navigation state lives in browser history; completion remains visit-only.
    writeNavigationHistory({
      massAdventure: { screen, selected, card, question, choice },
    });
  }, [screen, selected, card, question, choice]);
  const go = (next: Screen, sectionIndex = selected) => {
    if (next !== screen || sectionIndex !== selected) {
      writeNavigationHistory(
        {
          massAdventure: {
            screen: next,
            selected: sectionIndex,
            card: 0,
            question: 0,
            choice: null,
          },
        },
        true,
      );
    }
    setSelected(sectionIndex);
    setCard(0);
    setQuestion(0);
    setChoice(null);
    setCelebrate(false);
    setScreen(next);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [screen, selected]);
  useEffect(() => {
    if (screen !== "home" || !focusExplorer.current) return;
    focusExplorer.current = false;
    const explorer = document.querySelector<HTMLElement>(".church-explorer");
    explorer?.scrollIntoView({ block: "start" });
    explorer?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [screen]);
  useEffect(() => {
    if (explorerEarned) setCelebrate(true);
  }, [explorerEarned]);
  const move = (d: number) => {
    setCard((c) => Math.max(0, Math.min(section.parts.length - 1, c + d)));
  };
  useEffect(() => {
    if (screen === "section") {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [card, screen]);
  useEffect(() => {
    if (!celebrate) return;
    const timer = setTimeout(() => setCelebrate(false), 3500);
    return () => clearTimeout(timer);
  }, [celebrate]);
  useEffect(() => {
    if (screen === "quiz") {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [question, screen]);
  const nav = (["home", "map", "stickers", "parents"] as const).map((key) => (
    <button
      key={key}
      className={
        screen === key ||
        (key === "map" && ["section", "quiz"].includes(screen))
          ? "active"
          : ""
      }
      onClick={() => go(key)}
      aria-current={screen === key ? "page" : undefined}
    >
      <Icon name={key} />
      <span>{copy.labels[key]}</span>
    </button>
  ));
  const finish = () => {
    setDone((d) => (d.includes(section.id) ? d : [...d, section.id]));
    setQuestion(3);
    setChoice(null);
    setCelebrate(true);
  };
  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <button
          className="brand"
          onClick={() => go("home")}
          aria-label="Mass Adventure home"
        >
          <span className="brand-mark">✦</span>
          <span>
            {copy.brand}
            <small>{copy.tagline}</small>
          </span>
        </button>
        <nav aria-label="Main navigation">{nav}</nav>
        <span className="header-note">
          {ui.headerNote} <span>♡</span>
        </span>
      </header>
      <main id="main">
        {screen === "home" ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span>✦</span> {copy.badge}
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  {copy.title}
                  <br />
                  <span>{copy.titleAccent}</span>
                </h1>
                <p>{copy.intro}</p>
                <button className="primary start" onClick={() => go("map")}>
                  {copy.start}
                  <Icon name="arrow" />
                </button>
                <span className="home-note">
                  <span>♡</span> {copy.homeNote}
                </span>
              </div>
              <div className="hero-art">
                <span className="floating-tag tag-top">{ui.welcomeTag}</span>
                <ParishArtwork kind="church" />
                <span className="floating-tag tag-bottom">
                  {ui.walkTag} <span>✦</span>
                </span>
              </div>
            </section>
            <section className="journey-preview">
              <div className="section-heading">
                <div>
                  <span className="eyebrow small">{ui.journeyEyebrow}</span>
                  <h2>{ui.journeyTitle}</h2>
                </div>
                <span className="hand-note">
                  {ui.discover} <span>↴</span>
                </span>
              </div>
              <div className="preview-grid">
                {sections.map((s, i) => (
                  <button
                    key={s.id}
                    className={`preview-stop ${s.color}`}
                    onClick={() => go("section", i)}
                  >
                    <span className="stop-number">0{i + 1}</span>
                    <Illustration
                      kind={s.art}
                      alt={`${s.name} illustration`}
                      variant={i}
                    />
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <span className="explore">
                      {ui.explore} <Icon name="arrow" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <div className="bottom-note">
              <span>✦</span> {ui.homeFooter} <span>✦</span>
            </div>
            <ChurchExplorer voice={narrator.voice} useRecording={narrator.selected === ""}
              explored={explored} celebrate={celebrate}
              onExplore={id => setExplored(items => items.includes(id) ? items : [...items, id])}
              onSeeSticker={() => go("stickers")} />
          </>
        ) : screen === "map" ? (
          <section className="page map-page">
            <div className="page-top">
              <span className="eyebrow small">{ui.mapEyebrow}</span>
              <h1 ref={heading} tabIndex={-1}>
                {copy.mapTitle}
              </h1>
              <p>{copy.mapIntro}</p>
            </div>
            <div className="progress-info">
              <span>✦ {phrases.progress(done.length)}</span>
              <span>{ui.stepHint}</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Adventure progress"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={done.length}
            >
              <span style={{ width: `${done.length * 25}%` }} />
            </div>
            <div className="adventure-path">
              <svg
                viewBox="0 0 620 740"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M165 80C600 60 540 260 415 260S30 310 165 440 550 470 420 630" />
                <path
                  className="filled-path"
                  d="M165 80C600 60 540 260 415 260S30 310 165 440 550 470 420 630"
                  pathLength="4"
                  style={{ strokeDasharray: `${done.length} 4` }}
                />
              </svg>
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  className={`map-stop ${s.color} stop-${i}`}
                  onClick={() => go("section", i)}
                >
                  <span className="map-art">
                    <Illustration
                      kind={s.art}
                      alt={artDescriptions[s.art]}
                      variant={i}
                    />
                    <b>{done.includes(s.id) ? "★" : i + 1}</b>
                  </span>
                  <span className="map-stop-text">
                    <small>{phrases.mapStop(i, s.parts.length)}</small>
                    <strong>{s.name}</strong>
                    <span>{s.subtitle}</span>
                    <em>
                      {done.includes(s.id) ? ui.again : ui.discoverStop} →
                    </em>
                  </span>
                </button>
              ))}
            </div>
            <p className="map-hint">{ui.mapHint}</p>
          </section>
        ) : screen === "section" ? (
          <section className={`page lesson ${section.color}`}>
            <button className="text-button" onClick={() => go("map")}>
              <Icon name="back" /> {ui.mapBack}
            </button>
            <div className="lesson-heading">
              <span className="eyebrow small">
                STOP 0{selected + 1} · {section.subtitle}
              </span>
              <h1 ref={heading} tabIndex={-1}>
                {section.name}
              </h1>
              <p>
                {phrases.lessonProgress(card, section.parts.length)} ·{" "}
                {ui.swipeHint}
              </p>
            </div>
            <div className="lesson-layout">
              <aside className="part-list" aria-label="Parts in this stop">
                {section.parts.map((p, i) => (
                  <button
                    key={p.id}
                    className={i === card ? "selected" : ""}
                    aria-current={i === card ? "step" : undefined}
                    onClick={() => setCard(i)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {p.name}
                  </button>
                ))}
              </aside>
              <div>
                <PartCard
                  key={section.parts[card].id}
                  part={section.parts[card]}
                  index={card}
                  onSwipe={move}
                  voice={narrator.voice}
                  useRecording={narrator.selected === ""}
                />
                <div className="card-controls">
                  <button
                    className="secondary"
                    disabled={card === 0}
                    onClick={() => move(-1)}
                  >
                    <Icon name="back" />
                    {ui.back}
                  </button>
                  <span
                    role="img"
                    aria-label={`Part ${card + 1} of ${section.parts.length}`}
                  >
                    {section.parts.map((p, i) => (
                      <span
                        className={i === card ? "current-dot" : "dot"}
                        key={p.id}
                      />
                    ))}
                  </span>
                  {card < section.parts.length - 1 ? (
                    <button className="primary" onClick={() => move(1)}>
                      {ui.nextPart}
                      <Icon name="arrow" />
                    </button>
                  ) : (
                    <button className="primary" onClick={() => go("quiz")}>
                      {ui.miniQuiz}
                      <Icon name="arrow" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : screen === "quiz" ? (
          <section className={`page quiz-page ${section.color}`}>
            <button className="text-button" onClick={() => go("section")}>
              <Icon name="back" />
              {phrases.backTo(section.name)}
            </button>
            {question === 3 ? (
              <div className="completion">
                {celebrate && (
                  <div className="confetti" aria-hidden="true">
                    {Array.from({ length: 30 }, (_, i) => (
                      <i
                        key={i}
                        style={{
                          left: `${(i * 37) % 100}%`,
                          background: [
                            "#eabc4e",
                            "#769e75",
                            "#e48b76",
                            "#8aaed0",
                          ][i % 4],
                          animationDelay: `${(i % 6) * 0.08}s`,
                          transform: `rotate(${i * 23}deg)`,
                        }}
                      />
                    ))}
                  </div>
                )}
                <span className="eyebrow">{ui.stopComplete}</span>
                <StickerArtwork kind={section.id} />
                <h1 ref={heading} tabIndex={-1}>
                  {copy.complete}
                </h1>
                <p>{copy.completeNote}</p>
                <span className="earned">★ {section.sticker}</span>
                <button className="primary" onClick={() => go("stickers")}>
                  {ui.seeSticker}
                  <Icon name="arrow" />
                </button>
                <button className="text-button" onClick={() => go("map")}>
                  {ui.backAdventure}
                </button>
              </div>
            ) : (
              <>
                <div className="page-top">
                  <span className="eyebrow small">
                    {section.name} · MINI QUIZ
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    {ui.checkTitle}
                  </h1>
                  <p>{copy.quizIntro}</p>
                </div>
                <div className="quiz-card">
                  <span className="question-count">
                    {phrases.questionCount(question)} <span>✦ ✦ ✦</span>
                  </span>
                  <h2>{section.quiz[question].question}</h2>
                  <div className="answers">
                    {section.quiz[question].options.map((option, i) => (
                      <button
                        key={option}
                        className={choice === i ? `chosen ${i === section.quiz[question].answer ? "correct" : "incorrect"}` : ""}
                        disabled={choice === section.quiz[question].answer}
                        onClick={() => setChoice(i)}
                      >
                        <span>{["A", "B", "C"][i]}</span>
                        {option}
                        {choice === i &&
                          i === section.quiz[question].answer && (
                            <Icon name="check" />
                          )}
                      </button>
                    ))}
                  </div>
                  {choice !== null && (
                    <div className={`feedback ${choice === section.quiz[question].answer ? "correct" : "incorrect"}`} role="status">
                      <strong>
                        {choice === section.quiz[question].answer
                          ? ui.quizLovely
                          : ui.quizHint}
                      </strong>
                      <p>
                        {choice === section.quiz[question].answer
                          ? section.quiz[question].feedback
                          : copy.retry + " " + section.quiz[question].feedback}
                      </p>
                    </div>
                  )}
                  {choice === section.quiz[question].answer && (
                    <button
                      className="primary"
                      onClick={() => {
                        if (question === 2) finish();
                        else {
                          setQuestion(question + 1);
                          setChoice(null);
                        }
                      }}
                    >
                      {question === 2 ? ui.collect : ui.nextQuestion}
                      <Icon name="arrow" />
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        ) : screen === "stickers" ? (
          <section className="page">
            <div className="page-top">
              <span className="eyebrow small">{ui.stickerEyebrow}</span>
              <h1 ref={heading} tabIndex={-1}>
                {copy.stickerTitle}
              </h1>
              <p>{copy.stickerIntro}</p>
            </div>
            <div className="sticker-count">
              ★ {phrases.stickerCount(done.length + Number(explorerEarned))}
            </div>
            <div className="sticker-grid">
              {sections.map((s, i) => {
                const earned = done.includes(s.id);
                return (
                  <button
                    key={s.id}
                    className={`sticker ${s.color} ${earned ? "earned-sticker" : "unearned"}`}
                    onClick={() => go("section", i)}
                    aria-label={`${s.sticker}, ${earned ? "earned, explore again" : "not yet earned, explore " + s.name}`}
                  >
                    <span className="sticker-graphic">
                      <StickerArtwork kind={s.id} />
                      {!earned && <span className="sticker-lock">✦</span>}
                    </span>
                    <h2>{s.sticker}</h2>
                    <p>{earned ? ui.stickerEarned : phrases.explore(s.name)}</p>
                  </button>
                );
              })}
              <button className={`sticker blue ${explorerEarned ? "earned-sticker" : "unearned"}`}
                aria-label={explorerEarned ? explorerReward.openEarned : explorerReward.openLocked}
                onClick={() => { focusExplorer.current = true; go("home"); }}>
                <span className="sticker-graphic">
                  <StickerArtwork kind="explorer" />
                  {!explorerEarned && <span className="sticker-lock">✦</span>}
                </span>
                <h2>{explorerReward.name}</h2>
                <p>{explorerEarned ? ui.stickerEarned : explorerReward.locked}</p>
              </button>
            </div>
            <p className="privacy-note">{copy.privacy}</p>
            <button className="primary centered" onClick={() => go("map")}>
              {ui.keepExploring}
              <Icon name="arrow" />
            </button>
          </section>
        ) : (
          <section className="page parents">
            <div className="page-top">
              <span className="eyebrow small">{ui.parentEyebrow}</span>
              <h1 ref={heading} tabIndex={-1}>
                {copy.parentTitle}
              </h1>
              <p>{copy.parentIntro}</p>
            </div>
            <div className="parent-note">
              <h2>{ui.companion}</h2>
              <p>{copy.parentNote}</p>
              <p>{copy.privacy}</p>
            </div>
            <VoiceSettings preferences={narrator} />
            <h2>{ui.referenceTitle}</h2>
            <p>{ui.referenceNote}</p>
            <p>{ui.referenceLinkNote}</p>
            {sections.map((s) => (
              <details key={s.id} className="reference-group" open>
                <summary>
                  {s.name} <span>{s.subtitle}</span>
                </summary>
                <dl>
                  {s.parts.map((p) => (
                    <div key={p.id}>
                      <dt>
                        {p.name}
                        {p.note && <small>{p.note}</small>}
                      </dt>
                      <dd>
                        {getCatechismLinks(p.ccc).map((reference) =>
                          reference.url ? (
                            <a
                              key={reference.paragraphs}
                              href={reference.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={phrases.catechismLink(reference.paragraphs, p.name)}
                              title={reference.name}
                            >
                              CCC {reference.paragraphs} <span aria-hidden="true">↗</span>
                            </a>
                          ) : <span key={reference.paragraphs}>CCC {reference.paragraphs}</span>,
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
            <div className="parent-note">
              <h2>{ui.reviewTitle}</h2>
              <p>{copy.review}</p>
            </div>
          </section>
        )}
      </main>
      <footer>
        <span>{ui.footer}</span>
        <button onClick={() => go("parents")}>
          {ui.parentLink} <Icon name="arrow" />
        </button>
        <a className="footer-companion-link" href="https://ksantiagobah.github.io/at-the-table/"><span>{ui.companionLink}</span> <Icon name="arrow" /></a>
      </footer>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav}
      </nav>
    </div>
  );
}
