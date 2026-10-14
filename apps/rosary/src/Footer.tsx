export function Footer() {
  return <footer className="rosary-footer">
    <svg className="rosary-footer-flourish" viewBox="0 0 1200 76" fill="none" aria-hidden="true">
      <path d="M0 55Q220 12 430 45Q600 72 770 45Q980 12 1200 55" stroke="currentColor" strokeWidth="1"/>
      {[450, 475, 500, 525, 550, 575, 625, 650, 675, 700, 725, 750].map(x => <circle key={x} cx={x} cy={55 - Math.abs(600 - x) * .07} r="4" stroke="currentColor" fill="#211b15"/>)}
      <path d="M600 32v33m-10-22h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
    <div className="rosary-footer-body">
      <div className="rosary-footer-identity"><div className="rosary-footer-brand"><span aria-hidden="true">✝</span><strong>Rosary</strong></div><p>A quiet space for prayer.</p><span>Walk with Mary. Reflect on the life of Christ.<br/>Rest in His mercy, one prayer at a time.</span></div>
      <nav className="rosary-footer-prayers" aria-label="Prayer and meditation"><h2>Take a moment</h2><a href="#rosary">Pray the Rosary →</a><a href="#chaplet">Divine Mercy Chaplet →</a><a href="#mysteries">Explore the mysteries</a><a href="#prayers">Prayer library</a></nav>
      <nav className="rosary-footer-companions" aria-label="Explore our websites"><h2>Keep growing in faith</h2><a href="../"><span>Mass Adventure <span aria-hidden="true">↗</span></span><small>Discover the Mass with children.</small></a><a href="../at-the-table/"><span>At the Table <span aria-hidden="true">↗</span></span><small>A guide to the Mass for adults.</small></a></nav>
    </div>
    <div className="rosary-footer-bottom"><span>Created by Kenny &amp; Edith Santiago</span><p>No account needed. Your prayer progress stays in this browser.</p></div>
  </footer>;
}
