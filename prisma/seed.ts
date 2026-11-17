import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { homeBlogPosts } from "../data/home-blog-posts";
import { homeProjects } from "../data/home-projects";
import { homeCertificates } from "../data/home-certificates";
import { homeSkills } from "../data/home-skills";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const dummyProjects = [
  { title: "Edge Monitor", slug: "edge-monitor", description: "A compact dashboard for observing distributed services and edge health.", body: "Edge Monitor turns runtime signals into useful operational decisions.", techStack: ["Next.js", "TypeScript", "PostgreSQL"], category: "tool", sortOrder: 20 },
  { title: "Field Notes", slug: "field-notes", description: "A quiet publishing tool for technical notes and durable documentation.", body: "Field Notes explores structured writing, search, and calm reading.", techStack: ["React", "Node.js", "SQLite"], category: "product", sortOrder: 21 },
  { title: "Runtime Lab", slug: "runtime-lab", description: "Small experiments around timing, state, and system behavior.", body: "Runtime Lab collects experiments with timers, queues, and synchronization.", techStack: ["Go", "Linux", "TypeScript"], category: "tool", sortOrder: 22 },
];
const dummyPosts = [
  { title: "Designing for failure", slug: "designing-for-failure", excerpt: "Reliable systems make failure visible, bounded, and recoverable.", body: "Failure is part of production software. The useful question is whether it remains understandable.", category: "Systems", readTime: "04 min read", date: "2026-11-10", sortOrder: 20 },
  { title: "Small tools, sharp edges", slug: "small-tools-sharp-edges", excerpt: "Small tools teach more when behavior stays visible.", body: "Small experiments shorten the distance between intention and result.", category: "Engineering", readTime: "05 min read", date: "2026-11-03", sortOrder: 21 },
  { title: "Readable architecture", slug: "readable-architecture", excerpt: "Architecture should help people understand what systems do.", body: "Names, boundaries, and boring control flow often outperform cleverness.", category: "Perspective", readTime: "03 min read", date: "2026-10-27", sortOrder: 22 },
];
const dummyCertificates = [
  { id: "dummy-distributed-systems", title: "Completed distributed systems field study", issuer: "Elias Reid Lab", description: "Built experiments around queues, state synchronization, and service failure modes.", date: "2026-11-10", sortOrder: 20 },
  { id: "dummy-edge-prototype", title: "Shipped first edge runtime prototype", issuer: "Elias Reid Lab", description: "Designed and tested a lightweight runtime monitor for constrained environments.", date: "2026-11-03", sortOrder: 21 },
  { id: "dummy-technical-notes", title: "Published technical field notes", issuer: "Elias Reid Lab", description: "Documented practical lessons from frontend, backend, and systems work.", date: "2026-10-27", sortOrder: 22 },
];

async function main() {
  console.log("🌱 Seeding database...");

  // ── BlogPosts ──
  for (const post of homeBlogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        bodyFormat: "markdown",
        category: post.category,
        readTime: post.readTime,
        publishedAt: new Date(post.publishedAt),
        thumbnail: post.thumbnail ?? null,
        isVisible: post.isVisible,
        sortOrder: post.sortOrder,
      },
    });
  }
  for (const post of dummyPosts) await prisma.blogPost.upsert({ where: { slug: post.slug }, update: {}, create: { title: post.title, slug: post.slug, excerpt: post.excerpt, body: post.body, bodyFormat: "markdown", category: post.category, readTime: post.readTime, publishedAt: new Date(post.date), thumbnail: "/images/thumbnails/blog-tutorial.png", isVisible: true, sortOrder: post.sortOrder } });
  // ── Projects ──
  for (const project of homeProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        title: project.title,
        slug: project.slug,
        description: project.description,
        body: project.body,
        bodyFormat: "markdown",
        thumbnail: project.thumbnail ?? null,
        screenshots: project.screenshots ?? [],
        techStack: project.techStack,
        githubUrl: project.githubUrl ?? null,
        liveUrl: project.liveUrl ?? null,
        category: project.category,
        featured: project.featured,
        isVisible: project.isVisible,
        sortOrder: project.sortOrder,
      },
    });
  }
  for (const project of dummyProjects) await prisma.project.upsert({ where: { slug: project.slug }, update: {}, create: { title: project.title, slug: project.slug, description: project.description, body: project.body, bodyFormat: "markdown", thumbnail: "/images/thumbnails/projects-thumbnail.png", screenshots: ["/images/thumbnails/projects-thumbnail.png"], techStack: project.techStack, category: project.category, featured: false, sortOrder: project.sortOrder, isVisible: true } });
  // ── Certificates ──
  for (const cert of homeCertificates) {
    await prisma.certificate.upsert({
      where: { id: cert.id },
      update: {},
      create: {
        id: cert.id,
        title: cert.title,
        issuer: cert.issuer,
        issueDate: new Date(cert.issueDate),
        credentialUrl: cert.credentialUrl ?? null,
        image: cert.image ?? null,
        description: cert.description,
        isVisible: cert.isVisible,
        sortOrder: cert.sortOrder,
      },
    });
  }
  for (const cert of dummyCertificates) await prisma.certificate.upsert({ where: { id: cert.id }, update: {}, create: { id: cert.id, title: cert.title, issuer: cert.issuer, issueDate: new Date(cert.date), description: cert.description, image: "/images/thumbnails/achievements-default.png", isVisible: true, sortOrder: cert.sortOrder } });
  console.log(`  ✓ ${dummyCertificates.length} database dummy achievements`);

  // ── Skills ──
  for (const skill of homeSkills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: {
        id: skill.id,
        name: skill.name,
        iconSrc: skill.iconSrc,
        category: skill.category,
        isVisible: skill.isVisible,
        sortOrder: skill.sortOrder,
      },
    });
  }
  console.log(`  ✓ ${homeSkills.length} skills`);

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
