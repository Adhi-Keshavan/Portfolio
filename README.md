# The Living Workspace

An interactive developer portfolio for Adhi Keshavan B. Visitors can explore a procedural 3D studio, enter a functional portfolio desktop through the monitor, use the keyboard to open a safe terminal, or browse the same verified content through ordinary page navigation.

## Run and verify

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Vite writes the production site to `dist/`.

## Experience

- The desk, monitor, keyboard, notebook, phone, lamp, mug, plant, and wall art are modeled with React Three Fiber and procedural materials. The lamp toggles and the mug turns gently when selected.
- Monitor selection focuses the camera and enters the desktop. The desktop has Project Explorer, Terminal, About, Skills, and Contact apps. Windows can open, close, minimize, restore, stack, drag, resize, and maximize within the viewport. Mobile uses full-width panels.
- The terminal supports `help`, `about`, `skills`, `projects`, `projects list`, `projects open [project-id]`, `education`, `contact`, `resume`, `clear`, `theme day`, `theme night`, `workspace`, and `exit`. It only parses these local commands and never executes shell code.
- Day/night mode changes both the interface and 3D lighting. The desk lamp contributes local light. Theme preference is stored in the browser.
- Normal scrollable sections and case-study pages preserve all important content for keyboard users and visitors without WebGL. The scene is lazy loaded and pauses when the tab is hidden.

## Architecture

- `src/data/portfolio.ts`: editable typed profile, verified skills, and project case studies.
- `src/store/workspaceStore.ts`: Zustand workspace mode, theme, lamp, selected object, desktop windows, and project state.
- `src/components/canvas/workspace/`: 3D scene, object interactions, lighting, procedural textures, and camera.
- `src/components/desktop/`: desktop environment, window manager, project explorer, terminal, and content apps.
- `src/components/workspace/`: static fallback, object panels, and scrollable portfolio sections.
- `src/pages/ProjectDetail.tsx`: dedicated `/projects/<slug>` case-study routes.

## Content and assets

Project descriptions are grounded in the linked repositories. PayReady India provides KYC preparation guidance and does not make verification decisions. Genuine project screenshots are still pending; the current previews are visibly labeled as illustrations. Add real files under `public/projects/`, then set `screenshot` and `screenshotAlt` for each project in `src/data/portfolio.ts`. The explorer exposes the screenshot viewer when an image exists.

`public/resume.pdf` is an interim one-page résumé generated from verified portfolio and certificate details. The source is `scripts/generate_resume.py`. Replace it with the final résumé when available. Update links and contact information in `src/data/portfolio.ts` if needed.

## Deployment

For Netlify, build with `npm run build` and publish `dist/`. `public/_redirects` sends case-study routes to the SPA entry point. For Vercel, use the same build and output directory; `vercel.json` provides the route fallback. No environment variables or server service are required.
