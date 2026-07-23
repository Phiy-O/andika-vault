import { Navbar } from "./Navbar";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      {children}
      <footer className="footer page-footer">
        <div>
          <p className="eyebrow">Have a good idea?</p>
          <h2>Let&apos;s make<br /><em>it real.</em></h2>
        </div>
        <div className="footer-contact">
          <a className="email-link" href="mailto:hello@andika.dev">hello@andika.dev <span aria-hidden="true">↗</span></a>
          <div className="footer-links"><a href="https://www.linkedin.com" rel="noreferrer">LinkedIn</a><a href="https://github.com" rel="noreferrer">GitHub</a><a href="https://www.instagram.com" rel="noreferrer">Instagram</a></div>
          <p>© 2025 Andika. Built with care.</p>
        </div>
      </footer>
    </main>
  );
}