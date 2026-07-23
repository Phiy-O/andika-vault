import { ContentPage, ContentSection } from "../../components/content/ContentPage";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
    title: "About | Andika",
    description: "Learn about Andika's approach to building useful digital products.",
};

export default function AboutPage() {
    return (
        <PublicShell>
            <ContentPage
                eyebrow="About me"
                title={
                    <>
                        Making the digital <em>feel more human.</em>
                    </>
                }
                description="I am a software engineer focused on turning complex ideas into clear, useful, and quietly memorable digital experiences."
            >
                <ContentSection title="The short version">
                    <div className="content-copy">
                        <p>
                            Good work lives somewhere between sharp strategy and genuine curiosity about people. I care about the details, the architecture underneath, and the moment a product simply clicks.
                        </p>
                        <p>
                            My work sits at the intersection of product thinking, thoughtful interface design, and dependable full-stack engineering.
                        </p>
                    </div>
                </ContentSection>
                <ContentSection title="How I work">
                    <div className="principles-grid">
                        <article>
                            <span>01</span>
                            <h2>Start with clarity</h2>
                            <p>Understand the real problem before reaching for a solution.</p>
                        </article>
                        <article>
                            <span>02</span>
                            <h2>Build with intent</h2>
                            <p>Choose simple, durable systems that can grow with the idea.</p>
                        </article>
                        <article>
                            <span>03</span>
                            <h2>Leave room for people</h2>
                            <p>Make technology feel approachable, useful, and considered.</p>
                        </article>
                    </div>
                </ContentSection>
            </ContentPage>
        </PublicShell>
    );
}
