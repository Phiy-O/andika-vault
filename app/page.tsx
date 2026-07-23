import { Navbar } from "../components/layout/Navbar";
import { CodeSnippet } from "../components/content/CodeSnippet";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> I&apos;m a software engineer</p>
          <h1 id="hero-title">Hi, I&apos;m <em>Andika</em><br />I build things for <em>Fun</em></h1>
          <p className="hero-intro">I&apos;m passionate about creating thoughtful digital products that are clear, useful, and built to last.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">View my work <span aria-hidden="true">↗</span></a>
            <a className="button button-secondary" href="/resume.pdf">Download CV <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-technologies" aria-label="Technologies I work with">
            <p>Technologies I work with</p>
            <div className="technology-list"><span>HTML</span><span>CSS</span><span>JS</span><span>TS</span><span>React</span><span>Node</span><span>Git</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-label="Portrait of Andika">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-dots" aria-hidden="true" />
          <Image className="profile-image" src="/images/andika-profile.png" alt="Andika working at a laptop" width={640} height={720} priority />
          <CodeSnippet />
        </div>
      </section>

      <section className="marquee" aria-label="Areas of expertise"><div>PRODUCT ENGINEERING <span>✦</span> DIGITAL CRAFT <span>✦</span> HUMAN-CENTERED SYSTEMS <span>✦</span></div></section>

      <section className="section work-section" id="projects" aria-labelledby="work-title"><div className="section-heading"><p className="eyebrow">Selected work</p><h2 id="work-title">A few things<br /><em>I&apos;ve shaped.</em></h2><a className="text-link" href="#contact">View all projects <span aria-hidden="true">↗</span></a></div><div className="project-grid"><article className="project-card project-card-large"><div className="project-art art-violet"><span>01</span><strong>RENTALIN</strong><i>Rental, reimagined.</i></div><div className="project-meta"><div><h3>Rentalin</h3><p>Product design · Full-stack development</p></div><span>2025</span></div></article><article className="project-card"><div className="project-art art-amber"><span>02</span><strong>ANDIKA VAULT</strong><i>A home for ideas.</i></div><div className="project-meta"><div><h3>Andika Vault</h3><p>Design system · Development</p></div><span>2025</span></div></article></div></section>

      <section className="section about-section" id="about" aria-labelledby="about-title"><div className="about-number">02</div><div className="about-copy"><p className="eyebrow">A little context</p><h2 id="about-title">Making the digital<br /><em>feel more human.</em></h2></div><div className="about-body"><p>Good work lives somewhere between a sharp strategy and a genuine curiosity about people. I care about the details, the architecture underneath, and the moment a product simply clicks.</p><a className="text-link" href="#contact">Get to know me <span aria-hidden="true">↗</span></a></div></section>

      <section className="section journal-section" id="blog" aria-labelledby="journal-title"><div className="section-heading journal-heading"><p className="eyebrow">From the journal</p><h2 id="journal-title">Notes on making<br /><em>better things.</em></h2><a className="text-link" href="#blog">Read the journal <span aria-hidden="true">↗</span></a></div><div className="journal-list"><a href="#blog" className="journal-item"><span>01</span><h3>Building products that earn attention</h3><small>Perspective · 06 min read</small><b aria-hidden="true">↗</b></a><a href="#blog" className="journal-item"><span>02</span><h3>Notes from a life in progress</h3><small>Personal · 04 min read</small><b aria-hidden="true">↗</b></a></div></section>

      <footer className="footer" id="contact"><div><p className="eyebrow">Have a good idea?</p><h2>Let&apos;s make<br /><em>it real.</em></h2></div><div className="footer-contact"><a className="email-link" href="mailto:hello@andika.dev">hello@andika.dev <span aria-hidden="true">↗</span></a><div className="footer-links"><a href="#top">LinkedIn</a><a href="#top">GitHub</a><a href="#top">Instagram</a></div><p>© 2025 Andika. Built with care.</p></div></footer>
    </main>
  );
}
