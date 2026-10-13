import { useMassContent } from "../hooks/useMassContent";
import { Icon } from "./Icon";

export function AdventureFooter({ onParents }: { onParents: () => void }) {
  const { copy, ui } = useMassContent();
  const base = import.meta.env.BASE_URL;
  const separator = ui.companionLink.indexOf(":");
  return (
    <footer className="adventure-footer">
      <picture className="footer-landscape" aria-hidden="true">
        <source media="(min-width: 760px)" srcSet={`${base}artwork/footer-desktop-sage.jpg`} />
        <img src={`${base}artwork/footer-mobile-sage.jpg`} alt="" loading="lazy" />
      </picture>
      <div className="footer-content">
        <h2>{copy.brand}</h2>
        <p className="footer-tagline">{copy.tagline}</p>
        <div className="footer-links">
          <button className="footer-parent-link" onClick={onParents}>
            <span>{ui.parentLink}</span><Icon name="arrow" />
          </button>
          <a className="footer-companion-link" href={`${base}at-the-table/`}>
            <svg className="footer-book" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 15c-5-4-11-4-16-2v20c5-2 11-2 16 2 5-4 11-4 16-2V13c-5-2-11-2-16 2v20" />
              <path d="M20 3v5M9 5l3 4M31 5l-3 4" stroke="#a47d25" />
            </svg>
            <span>{separator < 0 ? ui.companionLink : <><span className="footer-adult-label">{ui.companionLink.slice(0, separator)}</span><span>{ui.companionLink.slice(separator + 1).trim()}</span></>}</span><Icon name="arrow" />
          </a>
          <a className="footer-companion-link" href={`${base}rosary/`}><span>Rosary & Divine Mercy</span><Icon name="arrow" /></a>
        </div>
      </div>
      <p className="footer-credit">{ui.footer}</p>
    </footer>
  );
}
