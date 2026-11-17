# Homepage Figma Design

## Intent
Align homepage with Figma node `313:139` while preserving live content and existing navigation.

## Goals
- Match reference typography, palette, borders, shadows, density, and section hierarchy.
- Rebuild homepage presentation with local components and responsive layouts.
- Preserve dynamic projects, skills, posts, certificates, site settings, resume, email, and links.

## Non-goals
- No admin, blog, projects detail, achievements detail, database, auth, or backend changes.
- No temporary Figma asset URLs.
- No broad global redesign that changes unrelated pages.

## Approach
Rework homepage-local components and `app/page.tsx` only. Use reference tokens: cream `#f4ebdc`, surface `#fffdf7`, ink `#1d1d1b`, coral `#f46d66`, blue `#5d8fef`, green `#2cb67d`; display Fraunces fallback, body DM Sans fallback, technical labels monospace. Build responsive editorial sections: hero, background statement, selected work, capabilities, approach, milestones, writing, contact, and footer treatment.

## Constraints
- Existing Next.js, React, TypeScript, Tailwind v4 stack.
- Preserve current component data contracts and user interactions.
- Use local assets or CSS fallback for reference visuals.
- Maintain semantic headings, keyboard focus, accessible labels, and mobile stacking.

## Verification
Run TypeScript, focused ESLint on changed homepage files, build, and diff checks. Review 320px, 768px, 1024px, and 1440px layouts.
