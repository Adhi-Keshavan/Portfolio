# DESK.OS

An interactive developer portfolio for Adhi Keshavan B. The homepage is a 3D workstation; selecting the monitor moves the camera toward its screen and opens a functional portfolio desktop. **Quick View** at `/quick-view` provides direct, scrollable access to the same work without using the 3D scene.

## Run and verify

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Vite writes the production site to `dist/`. Open `/` for the workstation, `/quick-view` for the recruiter page, and `/projects/<slug>` for a case study.

## Experience

- The desk, monitor, keyboard, notebook, phone, lamp, mug, plant, and wall art use React Three Fiber and procedural materials. The monitor shows a DESK.OS wallpaper; the desktop itself is crisp HTML.
- GSAP moves the camera to a selected object and cancels an earlier movement when a new object is chosen. Motion for React reveals the desktop from the workstation stage and reverses that reveal on return.
- The desktop has Project Explorer, Terminal, About, Skills, Résumé Viewer, Contact, and Settings. Apps load on demand. Windows can open, close, minimize, restore, stack, drag, resize, and maximize. Mobile uses full-width panels and a touch-friendly launcher.
- The terminal supports `help`, `about`, `skills`, `projects`, `projects list`, `projects open [project-id]`, `education`, `contact`, `resume`, `clear`, `theme light`, `theme dark`, `workspace`, and `exit`. It only parses local commands and never executes shell code. `Tab` completes an unambiguous command.
- Settings control light/dark mode, the desk lamp, and reduced motion. Theme and motion preferences are saved in the browser. `Escape` closes the app menu, then the top window, then returns to the workstation.
- A static workspace replaces the canvas on small screens, low-powered devices, WebGL failure, and reduced-motion mode. The Quick View and case-study routes remain available without WebGL.

## Architecture

- `src/data/portfolio.ts`: typed profile, skills, project descriptions, links, and technical takeaways.
- `src/store/workspaceStore.ts`: Zustand selection, camera phase, desktop mode, settings, and window state.
- `src/components/canvas/workspace/`: 3D scene objects, lighting, textures, and GSAP camera controller.
- `src/components/desktop/`: desktop, window manager, launcher, terminal, projects, and content apps.
- `src/pages/Home.tsx`: studio introduction and monitor handoff.
- `src/pages/QuickView.tsx`: accessible recruiter route.
- `src/pages/ProjectDetail.tsx`: dedicated case-study route.
- `src/App.tsx`: React Router configuration.

## Content and assets

Project descriptions are grounded in the linked repositories. PayReady India is a KYC preparation prototype; it does not make verification decisions. Genuine project screenshots are pending. Current previews are labeled as illustrations. Add images under `public/projects/`, then set `screenshot` and `screenshotAlt` (or `screenshots`) in `src/data/portfolio.ts`. The explorer enables its screenshot viewer when images are present.

The desktop wallpaper is a native 3840 × 2160 image; two smaller editorial image studies decorate the desktop. Sources, dimensions, and generation prompts are documented in `ASSET_CREDITS.md`.

`public/resume.pdf` is an interim one-page résumé generated from verified portfolio and certificate details. Its source is `scripts/generate_resume.py`. Replace it with the final résumé when available. Update the contact details in `src/data/portfolio.ts` if needed.

## Deployment

For Netlify, build with `npm run build` and publish `dist/`. `public/_redirects` sends direct route requests to the SPA entry point. For Vercel, use the same build and output directory; `vercel.json` provides the route fallback. No environment variables or backend service are required.
