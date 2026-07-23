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
          <div className="journal-list page-journal-list">
            {posts.map((post) => (
              <a href="#" className="journal-item" key={post.number}>
                <span>{post.number}</span>
                <h3>{post.title}</h3>
                <small>{post.detail}</small>
                <b aria-hidden="true">↗</b>
              </a>
            ))}
          </div>
        </ContentSection>
      </ContentPage>
    </PublicShell>
  );
}
