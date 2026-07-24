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
                    <div className="text-muted text-lg leading-[1.8] max-w-[680px]">
                        <p>
                            Good work lives somewhere between sharp strategy and genuine curiosity about people. I care about the details, the architecture underneath, and the moment a product simply clicks.
                        </p>
                        <p className="mt-[25px]">
                            My work sits at the intersection of product thinking, thoughtful interface design, and dependable full-stack engineering.
                        </p>
                    </div>
                </ContentSection>
                <ContentSection title="How I work">
                    <div className="grid gap-[25px] grid-cols-3 max-md:grid-cols-1">
                        <article className="border-t border-line pt-[18px]">
                            <span className="text-purple text-xs">01</span>
                            <h2 className="text-[28px] mt-[55px] mb-[15px] mx-0 max-md:mt-[35px]">Start with clarity</h2>
                            <p className="text-muted text-sm leading-[1.6]">Understand the real problem before reaching for a solution.</p>
                        </article>
                        <article className="border-t border-line pt-[18px] mt-5 max-md:mt-5">
                            <span className="text-purple text-xs">02</span>
                            <h2 className="text-[28px] mt-[55px] mb-[15px] mx-0 max-md:mt-[35px]">Build with intent</h2>
                            <p className="text-muted text-sm leading-[1.6]">Choose simple, durable systems that can grow with the idea.</p>
                        </article>
                        <article className="border-t border-line pt-[18px] mt-5 max-md:mt-5">
                            <span className="text-purple text-xs">03</span>
                            <h2 className="text-[28px] mt-[55px] mb-[15px] mx-0 max-md:mt-[35px]">Leave room for people</h2>
                            <p className="text-muted text-sm leading-[1.6]">Make technology feel approachable, useful, and considered.</p>
                        </article>
                    </div>
                </ContentSection>
            </ContentPage>
        </PublicShell>
    );
}
