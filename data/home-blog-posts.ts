export type HomeBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
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
    body: "Every product competes for a scarce resource: attention. Not the kind you buy with ads, but the kind people give freely when they trust you.\n\nIn a landscape of noisy dashboards and feature creep, the products that survive are the ones that respect the user's focus.\n\n## Clarity over density\n\nThe best products I've used feel obvious. Not because they're simple, but because every element earns its place. Each pixel justifies itself.\n\nWhen building, ask: does this feature make the core path clearer or more cluttered? Most of the time, the answer tells you what to cut.\n\n## Restraint as a feature\n\nSaying no to a feature is harder than building it. But every addition dilutes everything else. The products that earn lasting attention are the ones that stay focused on one thing done well.\n\n## The small decisions\n\nIt's rarely the big redesigns that matter. It's the micro-decisions: the copy that clarifies, the transition that feels natural, the empty state that teaches rather than frustrates.\n\nAttention isn't captured. It's earned — one small decision at a time.",
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
    body: "I've been thinking about progress lately. Not the kind you measure in shipped features or completed todos, but the slower kind — the kind that compounds beneath the surface.\n\n## Consistency over intensity\n\nFor years I believed progress required intensity. Long hours. Deep focus sprints. The romanticized version of building.\n\nWhat I've learned is that consistency matters more. Showing up every day, even when the work feels small. A line of code. A paragraph. A sketch. These add up.\n\n## Building a digital identity\n\nYour digital presence isn't a portfolio. It's a garden. It grows unevenly — some sections flourish, others need pruning. The key is to keep tending it.\n\n## What I'm learning now\n\nThat the path isn't linear. That detours teach as much as the main road. That a life in progress is still a life worth documenting.",
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
    body: "Clarity in digital products is invisible. You only notice it when it's absent.\n\nWhen a user opens your app, they should know within seconds: what this is, what they can do here, and where to go next.\n\n## Structure creates understanding\n\nThe best interfaces are hierarchical. Not just visually, but conceptually. Each screen answers one question. Each section has one purpose. The structure itself teaches the user how to navigate.\n\n## Language sets tone\n\nEvery label, every button, every error message is a chance to build trust. Use plain language. Avoid jargon. Write for the person who's trying to get something done, not for the spec document.\n\n## Rhythm builds comfort\n\nConsistent spacing, predictable patterns, familiar interactions — these create a rhythm that makes the product feel solid. When everything works the way the user expects, they stop noticing the interface and start focusing on their goal.",
    category: "Process",
    readTime: "05 min read",
    publishedAt: "2026-07-01",
    slug: "what-makes-a-digital-product-feel-clear",
    thumbnail: "/images/thumbnails/blog-tutorial.png",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "designing-for-edge-cases",
    title: "Designing for edge cases without over-engineering",
    excerpt:
      "Why most edge cases don't need custom logic — and how to know when they actually do.",
    body: "Edge cases are seductive. They make you feel smart for anticipating them, and they're often fun to solve.\n\nBut most edge cases in software aren't worth solving preemptively. Here's how I decide.\n\n## The 80/20 rule of edge cases\n\n80% of users will take 20% of the paths through your app. Focus on those. If an edge case affects less than 1% of users and doesn't cause data loss, ship without handling it and fix it if it comes up.\n\n## When to care\n\nYou should handle an edge case preemptively when:\n- It could cause data loss or corruption\n- It blocks a critical user flow\n- It impacts security or privacy\n- It affects users with disabilities\n\n## When to wait\n\nIf the edge case just means a slightly confusing UI or a feature that degrades gracefully, let it be. Real users are more forgiving than your imagination suggests, and real feedback is worth more than hypothetical scenarios.\n\nFix it when someone reports it. Not before.",
    category: "Process",
    readTime: "04 min read",
    publishedAt: "2026-06-22",
    slug: "designing-for-edge-cases",
    thumbnail: "/images/thumbnails/blog-web.png",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "lessons-from-building-in-public",
    title: "Lessons from building in public",
    excerpt:
      "What sharing work early taught me about feedback, iteration, and letting go of perfectionism.",
    body: "Building in public is uncomfortable. You show unfinished work. You invite critique. You risk looking like you don't know what you're doing.\n\nIt's also one of the best decisions I've made.\n\n## Feedback that actually helps\n\nWhen you build in private, feedback comes late. When you build in public, it comes while there's still time to change direction. Early users tell you what's confusing before you've invested months polishing the wrong thing.\n\n## Letting go of perfect\n\nSharing work early forces you to accept that perfect isn't real. Every project I've shared has had rough edges. But rough edges don't matter as much as momentum.\n\n## What I learned\n\nThe fear of judgment is louder than the judgment itself. Most people are rooting for you. And the ones who aren't are usually not your audience anyway.",
    category: "Perspective",
    readTime: "05 min read",
    publishedAt: "2026-06-14",
    slug: "lessons-from-building-in-public",
    thumbnail: "/images/thumbnails/blog-personal.png",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "state-management-without-overhead",
    title: "State management without the overhead",
    excerpt:
      "A practical look at when to reach for useState, when to useReducer, and when you don't need state at all.",
    body: "State management is one of those topics that generates strong opinions. But most apps don't need Redux, Zustand, or Jotai. Here's what I actually use.\n\n## useState is enough\n\nFor local UI state, useState is almost always the right answer. A form input, a toggle, a filter — useState handles these without ceremony.\n\n## useReducer for related state\n\nWhen multiple state values change together, useReducer keeps things predictable. A form with many fields, a multi-step wizard — that's where reducers shine.\n\n## No state at all\n\nThis is the most underrated option. Can you derive the value from props or existing state? Can you compute it from a URL parameter? If so, don't store it. Derived state has no sync bugs.\n\n## Signals and the future\n\nLibraries like Preact Signals bring the best of fine-grained reactivity to React. But for the majority of components, local state + lifting state up is still the pragmatic choice.",
    category: "Perspective",
    readTime: "07 min read",
    publishedAt: "2026-06-05",
    slug: "state-management-without-overhead",
    thumbnail: "/images/thumbnails/blog-tutorial.png",
    sortOrder: 6,
    isVisible: true,
  },
  {
    id: "writing-clean-component-tests",
    title: "Writing clean component tests that don't break",
    excerpt:
      "A strategy for testing React components that focuses on behavior over implementation details.",
    body: "Tests that break on every refactor are worse than no tests. They waste time, erode confidence, and eventually get deleted.\n\nHere's the strategy I use to write tests that last.\n\n## Test behavior, not implementation\n\nDon't test internal state, prop names, or component methods. Test what the user sees and does. If your component renders a button that says \"Submit\", test for that. If clicking it calls an API, mock the API and assert the result.\n\n## Prefer integration over unit\n\nA test that renders a page and checks the output gives more confidence than three unit tests that mock each child component. Integration tests break when something actually breaks, not when you rename a variable.\n\n## The RTL rule\n\nIf your test uses `getByRole`, you're on the right track. If it uses `getByTestId`, ask why. Test IDs are a last resort — they couple the test to the DOM structure.\n\n## Keep it simple\n\nA good test is three lines: arrange, act, assert. If it's longer, consider whether you're testing the right thing.",
    category: "Process",
    readTime: "06 min read",
    publishedAt: "2026-05-28",
    slug: "writing-clean-component-tests",
    thumbnail: "/images/thumbnails/blog-web.png",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: "balancing-speed-and-quality",
    title: "Balancing speed and quality as a solo developer",
    excerpt:
      "How to ship fast without cutting corners when you're the only person on the team.",
    body: "As a solo developer, you face a constant tension: move fast or build well. Here's how I navigate it.\n\n## Speed is a feature\n\nFor a personal project or early-stage product, speed matters more than polish. The faster you ship, the sooner you learn. A mediocre feature in production is worth more than a perfect one in a branch.\n\n## Where quality is non-negotiable\n\nData integrity, security, and the core user flow — these deserve time. If losing data erodes trust, invest in it. If the core path is broken, nothing else matters.\n\n## The pragmatic trade-off\n\nWrite tests for critical paths. Skip tests for exploration. Refactor when the code hurts, not preemptively. Document decisions, not every function.\n\nBeing solo means you can move fast without meetings or approvals. Use that advantage, but build a reputation for reliability. Users forgive missing features. They don't forgive broken promises.",
    category: "Personal",
    readTime: "04 min read",
    publishedAt: "2026-05-18",
    slug: "balancing-speed-and-quality",
    thumbnail: "/images/thumbnails/blog-personal.png",
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: "choosing-database-for-side-projects",
    title: "Choosing a database for your next side project",
    excerpt:
      "A quick guide to picking between SQLite, PostgreSQL, MongoDB, and other options without analysis paralysis.",
    body: "Picking a database for a side project feels high-stakes. It's not. Here's my framework.\n\n## SQLite for simplicity\n\nIf your project runs on a single machine, doesn't need concurrent writes, and you want zero ops overhead, SQLite is the answer. It's the most deployed database in the world for good reason.\n\n## PostgreSQL for confidence\n\nIf your project might grow, or you want the security of a battle-tested relational database, pick PostgreSQL. It handles JSON, full-text search, and complex queries. The dev experience is excellent with tools like Prisma.\n\n## MongoDB for flexibility\n\nIf your data shape changes frequently, or you're prototyping and don't want to define schemas upfront, MongoDB gives you speed. Just be disciplined about validation as the project matures.\n\n## The real answer\n\nPick the one you know best. The database is rarely the bottleneck for a side project. Your ability to iterate and ship is what matters.",
    category: "Perspective",
    readTime: "05 min read",
    publishedAt: "2026-05-10",
    slug: "choosing-database-for-side-projects",
    thumbnail: "/images/thumbnails/blog-tutorial.png",
    sortOrder: 9,
    isVisible: true,
  },
];
