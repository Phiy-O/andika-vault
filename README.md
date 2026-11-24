# Andika Vault

Personal portfolio website of **Andika** — software engineer. A public site for projects, writing, skills, and certificates, backed by a private admin CMS so every piece of content can be managed without touching code.

**Live site:** [andika-portfolio.my.id](https://andika-portfolio.my.id)

## About

Andika Vault is built with Next.js and TypeScript and styled in a "structured playful neobrutalism" direction — cream background, coral accents, strong black borders. The public site and the admin studio share one codebase and one PostgreSQL database via Prisma.

## Features

**Public site**
- Home, About, Projects, Blog, and Contact pages
- Blog ("dispatches") with categories, tags, cover art, and reading time
- Project case studies, skills, and certificates
- Contact form that lands in the admin inbox

**Admin studio (login required)**
- Manage blog posts with a rich-text editor (Lexical / TipTap), drafts, and publishing
- Manage projects, skills, certificates, and site settings
- Read and handle contact messages
- NextAuth-protected access, with login rate limiting (Upstash Redis / Vercel KV) and hardened input validation

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion, Lucide icons |
| Database | PostgreSQL with Prisma ORM |
| Auth | NextAuth (Auth.js) with Prisma adapter |
| Editors | Lexical and TipTap rich-text editors |
| Media | Cloudinary image hosting |
| Validation | Zod, sanitize-html |
| Deployment | Vercel |

## Getting Started

Prerequisites: Node.js 20+ and [pnpm](https://pnpm.io), plus a PostgreSQL database.

```bash
git clone https://github.com/Phiy-O/andika-vault.git
cd andika-vault
pnpm install
```

Create a `.env` file with at least:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/andika_vault"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
# Cloudinary (media uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
# Optional: distributed login rate limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Then set up the database and run the dev server:

```bash
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the full script-based test suite (Prisma retry, validation, guards, revalidation, db pool, security hardening, login limiting, and more) |

## Project Structure

```text
app/          App Router pages (public site + admin studio)
components/   UI components for the site and the studio
lib/          Shared logic, validation, and utilities
prisma/       Prisma schema, migrations, and seed
public/       Static assets
scripts/      Test and utility scripts
```

## Deployment

The site is deployed on Vercel. The production build runs:

```bash
pnpm prisma generate && pnpm run build
```

---

Built and maintained by Andika. This repository is a personal portfolio; feel free to explore the code, but the content and branding are my own.
