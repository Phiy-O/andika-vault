import { PrismaClient } from "@prisma/client";
import { homeBlogPosts } from "../data/home-blog-posts";
import { homeProjects } from "../data/home-projects";
import { homeCertificates } from "../data/home-certificates";
import { homeSkills } from "../data/home-skills";

const prisma = new PrismaClient();

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
  console.log(`  ✓ ${homeBlogPosts.length} blog posts`);

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
  console.log(`  ✓ ${homeProjects.length} projects`);

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
  console.log(`  ✓ ${homeCertificates.length} certificates`);

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
