# Go Digsy! — Owl adventure trial

An enhancement of the supplied HTML/CSS/vanilla JavaScript sample. Both original 1103 × 1426 WebP illustrations and the complete story are preserved. No runtime dependencies, build step, backend, tracking, or remote assets.

## Run locally

From the project directory, run `python -m http.server 4173 --directory dist` and open http://localhost:4173/. The original adventure route is http://localhost:4173/explore-usa/owl/. A static server of your choice also works.

## Deploy to Vercel

Upload this project to a GitHub repository and import it in Vercel. Choose framework **Other**, leave the build command empty, and use **dist** as the output directory. The included `vercel.json` sets these values. Deploy from the project root, not from inside dist. Alternatively run `vercel --prod` from the root using your own Vercel CLI/account. No environment variables are required. Both root and the adventure route are real static HTML files, so direct refresh works without SPA rewrites. Deployment to an actual Vercel account has not been performed.

## Features

- Original full-color and coloring illustrations, complete story, Wonder Together, Look & Find, and navigation labels.
- Click/tap the original owl or Greet Owl for a gentle lean from its feet, with a friendly greeting. Only the extracted owl moves; the whole scene does not rotate.
- Precisely scaled hotspot on the little green wing leaf; success ring, six-part star celebration, live feedback, hint and replay.
- Two original leaf layers sway independently. Tapping either big leaf produces a short rustle movement and friendly feedback (no audio).
- Four leaf color choices preserve the original shading and linework. Reset returns the leaves to green.
- Pause/resume freezes actual artwork and decorative movement. Reset preserves the user’s pause choice.
- Reduced-motion preference disables animations and displays a disabled “Movement off” control with an explanatory tooltip; keyboard buttons, focus rings, skip link, and live status feedback.
- Larger story text and local coloring toggle.
- Honest sample explanation for navigation to pages not provided.

## Artwork and scope limitations

The supplied artwork is flattened. Editable SVG masks separate the original owl and two leaves, while an AI-assisted background clean plate fills only the narrow areas exposed by movement. Foreground characters are original client pixels. The owl gently leans; no blink or anatomical head-turn is claimed. See ASSET_PREPARATION.md for the exact process and prompt, and CLIENT_REQUIREMENTS.md for the job-posting scope map. The tiny leaf is intentionally named in its accessible button label so keyboard and screen-reader users have an equivalent way to finish the activity. Other 29 adventures and external site pages are not supplied or fabricated. Pause state is maintained within the current page session, not across navigation/reload. Automated accessibility scans do not replace assistive-technology testing. Safari, Firefox, physical devices, and live Vercel hosting remain unverified.

## Source and QA

`dist/` contains all deployable source and assets. `dist/index.html` and `dist/explore-usa/owl/index.html` contain the same story with appropriate relative asset paths; maintain both entry files when editing story markup. Shared behavior and styles are in `dist/assets/`. The original supplied styling is retained with a clearly marked Owl trial extension. Original artwork bytes are unchanged. Editable silhouette paths are in `dist/assets/scene-paths.json`; after editing them, run `node tools/sync-scene.mjs` to synchronize the inline SVG in both entry pages. Shared motion timings and pivots are in CSS. The optional `tools/capture-motion.cjs` captures motion-state screenshots while a local preview server is running.

Development-only QA: install Node.js, Python, and Google Chrome; run `npm ci`, then `npm test`. Playwright starts and stops its local test server automatically, or reuses an existing server on port 4173. Tests use installed Google Chrome via Playwright, with axe-core for accessibility. If Chrome is unavailable, install it or change the Playwright configuration to an installed browser. No npm installation is needed to run or deploy the website. The test fixture in tests/source-baseline.json records original artwork hashes and story text, so the supplied original ZIP is not required to rerun the tests. See QA_REPORT.md and screenshots/ for actual results.
