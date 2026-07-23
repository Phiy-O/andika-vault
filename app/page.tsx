export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Andika home">A<span>.</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#journal">Journal</a><a href="#contact">Contact</a></nav>
        <a className="header-cta" href="#contact">Let&apos;s talk <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> Available for thoughtful work</p><h1 id="hero-title">Digital products<br /><em>with a point of view.</em></h1><p className="hero-intro">I&apos;m Andika, a software engineer who turns complex ideas into clear, useful, and quietly memorable digital experiences.</p><div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <span aria-hidden="true">↘</span></a><a className="text-link" href="#about">More about me <span aria-hidden="true">→</span></a></div></div>
        <div className="hero-aside" aria-label="Introduction details"><div className="orbit-mark" aria-hidden="true"><span>✦</span></div><p>Based in Indonesia<br />Working worldwide</p><p className="hero-index">01 <span>/ 04</span></p></div>
      </section>

      <section className="marquee" aria-label="Areas of expertise"><div>PRODUCT ENGINEERING <span>✦</span> DIGITAL CRAFT <span>✦</span> HUMAN-CENTERED SYSTEMS <span>✦</span></div></section>

      <section className="section work-section" id="work" aria-labelledby="work-title"><div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="work-title">A few things<br /><em>I&apos;ve shaped.</em></h2><a className="text-link" href="#contact">View all projects <span aria-hidden="true">↗</span></a></div><div className="project-grid"><article className="project-card project-card-large"><div className="project-art art-violet"><span>01</span><strong>RENTALIN</strong><i>Rental, reimagined.</i></div><div className="project-meta"><div><h3>Rentalin</h3><p>Product design · Full-stack development</p></div><span>2025</span></div></article><article className="project-card"><div className="project-art art-amber"><span>02</span><strong>ANDIKA VAULT</strong><i>A home for ideas.</i></div><div className="project-meta"><div><h3>Andika Vault</h3><p>Design system · Development</p></div><span>2025</span></div></article></div></section>

      <section className="section about-section" id="about" aria-labelledby="about-title"><div className="about-number">02</div><div className="about-copy"><p className="eyebrow">A little context</p><h2 id="about-title">Making the digital<br /><em>feel more human.</em></h2></div><div className="about-body"><p>Good work lives somewhere between a sharp strategy and a genuine curiosity about people. I care about the details, the architecture underneath, and the moment a product simply clicks.</p><a className="text-link" href="#contact">Get to know me <span aria-hidden="true">↗</span></a></div></section>

      <section className="section journal-section" id="journal" aria-labelledby="journal-title"><div className="section-heading journal-heading"><p className="eyebrow">From the journal</p><h2 id="journal-title">Notes on making<br /><em>better things.</em></h2><a className="text-link" href="#journal">Read the journal <span aria-hidden="true">↗</span></a></div><div className="journal-list"><a href="#journal" className="journal-item"><span>01</span><h3>Building products that earn attention</h3><small>Perspective · 06 min read</small><b aria-hidden="true">↗</b></a><a href="#journal" className="journal-item"><span>02</span><h3>Notes from a life in progress</h3><small>Personal · 04 min read</small><b aria-hidden="true">↗</b></a></div></section>

      <footer className="footer" id="contact"><div><p className="eyebrow">Have a good idea?</p><h2>Let&apos;s make<br /><em>it real.</em></h2></div><div className="footer-contact"><a className="email-link" href="mailto:hello@andika.dev">hello@andika.dev <span aria-hidden="true">↗</span></a><div className="footer-links"><a href="#top">LinkedIn</a><a href="#top">GitHub</a><a href="#top">Instagram</a></div><p>© 2025 Andika. Built with care.</p></div></footer>
    </main>
  );
}
