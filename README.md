# Adhi Keshavan B — Engineering Portfolio

A React and Three.js portfolio organized around the **Engineering Nexus**. The page keeps every section readable in HTML while the 3D sculpture adds a connected scroll narrative on capable desktop devices.

## Run locally

```bash
npm ci
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```

The production build is written to `dist/`.

## Personal details and assets

Edit `src/data/portfolio.ts` to update the name, links, skills, project facts, and case studies. Project claims were checked against the connected GitHub repositories. The three NoviTech R&D internships are supported by certificates in the parent workspace.

No résumé PDF was provided. Set `person.resume` to `/resume.pdf` after placing the final résumé at `public/resume.pdf`. Until then, the résumé links open an email request. `person.email` and `person.linkedin` are sourced from the author's GitHub profile README and can be updated in the same data file.

Project preview artwork is a visual interpretation of documented source, explicitly labeled as such. Add an actual screenshot under `public/projects/` and set `screenshot` and `screenshotAlt` for its project record when available. No live demo URLs are shown without a verified deployment.

## Performance and accessibility

- The WebGL scene is lazy loaded after idle time and omitted on narrow screens, reduced-motion systems, and devices reporting four or fewer CPU cores.
- The scene uses a capped device pixel ratio and a small set of reusable geometries and materials. Rendering pauses when the tab is hidden.
- Native scrolling, keyboard-accessible project navigation, visible focus states, semantic sections, and a static CSS sculpture are available without WebGL.
- GSAP ScrollTrigger only controls the 3D journey state; Motion for React handles small UI transitions.

## Deploy

Build with `npm run build` and publish `dist/`. `public/_redirects` supports Netlify SPA routes; `vercel.json` supports Vercel SPA routes. Each project case study has a direct URL at `/projects/<slug>`.
