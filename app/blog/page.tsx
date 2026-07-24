import { ContentPage, ContentSection } from "../../components/content/ContentPage";
import { PublicShell } from "../../components/layout/PublicShell";

export const metadata = {
  title: "Blog | Andika",
  description: "Notes on product thinking, engineering, and a life in progress.",
};

const posts = [
  {
    number: "01",
    title: "Building products that earn attention",
    detail: "Perspective · 06 min read",
  },
  {
    number: "02",
    title: "Notes from a life in progress",
    detail: "Personal · 04 min read",
  },
  {
    number: "03",
    title: "What makes a digital product feel clear",
    detail: "Process · 05 min read",
  },
];

export default function BlogPage() {
  return (
    <PublicShell>
      <ContentPage
        eyebrow="The journal"
        title={
          <>
            Notes on making <em>better things.</em>
          </>
        }
        description="Thoughts on product, engineering, design, and the lessons hiding inside the work."
      >
        <ContentSection title="Latest notes">
          <div className="border-t border-line mt-0">
            {posts.map((post) => (
              <a href="#" className="items-center border-b border-line grid gap-5 grid-cols-[.15fr_1fr_.55fr_20px] py-[25px] px-0 max-md:gap-[10px] max-md:grid-cols-[.18fr_1fr_15px]" key={post.number}>
                <span className="text-muted text-[11px]">{post.number}</span>
                <h3 className="text-xl font-normal m-0">{post.title}</h3>
                <small className="text-muted text-[11px] max-md:col-start-2 max-md:row-start-2">{post.detail}</small>
                <b className="text-purple text-lg font-normal max-md:col-start-3 max-md:row-span-2 max-md:row-start-1" aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
