import { ContentPage, ContentSection } from "../../components/content/ContentPage";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
  title: "Contact | Andika",
  description: "Get in touch with Andika about a thoughtful digital project.",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <ContentPage
        eyebrow="Contact"
        title={
          <>
            Let&apos;s make <em>it real.</em>
          </>
        }
        description="Have a product idea, a collaboration in mind, or simply want to say hello? I&apos;d love to hear from you."
      >
        <ContentSection title="Start a conversation">
          <div className="contact-grid">
            <div className="contact-copy">
              <p>
                The best way to reach me is by email. Share a little about what you&apos;re building, where you are in the process, and what you need next.
              </p>
              <a className="email-link" href="mailto:hello@andika.dev">
                hello@andika.dev <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="contact-details">
              <p>
                <span>Based in</span>
                Indonesia<br />
                Working worldwide
              </p>
              <p>
                <span>Response time</span>
                Usually within 2–3 days
              </p>
            </div>
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
