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
          <div className="grid gap-[90px] grid-cols-[1.3fr_1fr] max-md:grid-cols-1 max-md:gap-[45px]">
            <div className="text-muted text-[17px] leading-[1.7] max-w-[450px]">
              <p>
                The best way to reach me is by email. Share a little about what you&apos;re building, where you are in the process, and what you need next.
              </p>
              <a className="border-b border-line block text-lg pb-[15px] text-foreground mt-[45px]" href="mailto:hello@andika.dev">
                hello@andika.dev <span className="text-purple float-right" aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="text-foreground text-[15px] leading-[1.8]">
              <p>
                <span className="text-muted block text-[10px] tracking-[.12em] mb-1 uppercase">Based in</span>
                Indonesia<br />
                Working worldwide
              </p>
              <p className="mt-[30px]">
                <span className="text-muted block text-[10px] tracking-[.12em] mb-1 uppercase">Response time</span>
                Usually within 2–3 days
              </p>
            </div>
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
