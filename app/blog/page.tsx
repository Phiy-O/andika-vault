import Link from "next/link";
import { BlogContent } from "../../components/blog/BlogContent";
import { PublicShell } from "../../components/layout/PublicShell";
import { PageHero } from "../../components/content/PageHero";
import { CTAButton } from "../../components/content/CTAButton";

export const metadata = {
  title: "Blog | Andika",
  description: "Notes on product thinking, engineering, and a life in progress.",
};

export default function BlogPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="The journal"
        title={<>Notes on making <em>better things.</em></>}
        description="Thoughts on product, engineering, design, and the lessons hiding inside the work."
      />

      <BlogContent />

      <div className="mx-auto w-full py-0 px-[10vw] pb-[130px] max-md:px-[6vw] max-md:pb-[90px]">
        <CTAButton href="/contact" label="Have a project in mind" />
      </div>
    </PublicShell>
  );
}
