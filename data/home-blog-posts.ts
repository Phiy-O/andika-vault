export type HomeBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  slug: string;
  thumbnail?: string;
  sortOrder: number;
  isVisible: boolean;
};

export const homeBlogPosts: HomeBlogPost[] = [
  {
    id: "building-products-that-earn-attention",
    title: "Building products that earn attention",
    excerpt:
      "A note on clarity, restraint, and the small product decisions that make people want to stay.",
    category: "Perspective",
    readTime: "06 min read",
    publishedAt: "2026-07-12",
    slug: "building-products-that-earn-attention",
    thumbnail: "/images/thumbnails/blog-web.png",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "notes-from-a-life-in-progress",
    title: "Notes from a life in progress",
    excerpt:
      "A personal reflection on learning, consistency, and building a meaningful digital identity over time.",
    category: "Personal",
    readTime: "04 min read",
    publishedAt: "2026-07-08",
    slug: "notes-from-a-life-in-progress",
    thumbnail: "/images/thumbnails/blog-personal.png",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "what-makes-a-digital-product-feel-clear",
    title: "What makes a digital product feel clear",
    excerpt:
      "How structure, language, and interface rhythm help turn complex ideas into experiences that feel simple.",
    category: "Process",
    readTime: "05 min read",
    publishedAt: "2026-07-01",
    slug: "what-makes-a-digital-product-feel-clear",
    thumbnail: "/images/thumbnails/blog-tutorial.png",
    sortOrder: 3,
    isVisible: true,
  },
];
