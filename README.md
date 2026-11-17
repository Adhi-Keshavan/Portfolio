# Inside My Workspace

An interactive developer portfolio for Adhi Keshavan B. On capable desktop devices, visitors explore a procedurally modeled workstation: monitor for projects, keyboard for skills, notebook for background, and phone for contact. Every panel is HTML and the same information appears in ordinary scrollable sections.

## Run and check

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Vite writes the production site to `dist/`.

## Architecture

- `src/data/portfolio.ts` keeps personal details, verified skills, object labels, and project case studies editable in one typed file.
- `src/components/canvas/workspace/` contains the desk, interactive objects, procedural textures, and camera controller.
- `src/components/workspace/` contains the accessible panels, static workstation fallback, and scrollable portfolio sections.
- `src/hooks/useWorkspaceSelection.ts` owns the selected object. Switching objects immediately changes the camera destination, cancelling the prior focus motion.
- `src/pages/ProjectDetail.tsx` renders dedicated case-study routes at `/projects/<slug>`.

The scene lazy loads after the initial HTML. It uses instanced keyboard keys, shared materials and geometries where practical, capped adaptive DPR, one shadow casting key light, and pauses rendering when the tab is hidden. Mobile, reduced-motion, low-powered, and WebGL-unavailable devices use the interactive CSS workstation and normal vertical content.

## Content and assets

Project descriptions are grounded in the linked GitHub repositories. The PayReady India prototype provides KYC preparation guidance; it does not make verification decisions. Repository screenshots were not available. The project cards label their current visuals as interpretations; replace them with real images by adding files under `public/projects/` and setting each project's `screenshot` and `screenshotAlt` fields in `src/data/portfolio.ts`.

`public/resume.pdf` is an interim one-page résumé generated only from verified portfolio and certificate details. The source is `scripts/generate_resume.py`. Replace the PDF with your final résumé when you provide it; the download links already point to `/resume.pdf`. Update email and professional links in `src/data/portfolio.ts` if needed.

## Deploy

For Netlify, build with `npm run build` and publish `dist/`. `public/_redirects` sends case-study routes to the SPA entry point. For Vercel, use the same build and output directory; `vercel.json` provides the route fallback. No environment variables or server service are required.
