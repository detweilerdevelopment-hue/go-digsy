# QA report — October 16, 2026 recheck

## Result

Final upgraded Playwright suite: **19 passed**. Nine functional/responsive cases plus ten targeted accessibility, keyboard, state-transition, original-art motion, coloring, fallback, edge-case and integrity cases. No known critical or major issues remain in the tested configurations. This does not guarantee error-free behavior on every browser or hosting platform.

## Issues found and fixed during recheck

- Two JavaScript messages had a garbled UTF-8 apostrophe introduced during source cleanup. Repaired the encoding and added exact-message and invalid-character regression checks.
- When movement was paused, animation keyframes could keep the greeting bubble invisible. Paused greetings now show a static bubble and status feedback without restarting movement. Regression tested after the CSS correction.
- Reduced-motion users previously saw “Play movement” even though device preferences still disabled animation. The control now reads “Movement off”, is disabled, and explains the device setting in its tooltip. When the preference changes, controls update without automatically restarting movement.
- Updated artwork alternative text when changing between colored and coloring versions, prevented hint highlighting after success, and made the big-leaf message acknowledge an already completed activity.
- Added a portable original-source test fixture, so integrity tests do not depend on an unbundled original/ directory. Refreshed package metadata and screenshots. Full-page state captures start at the top to avoid a browser screenshot artifact involving the offscreen skip link.

## Environment and reproducibility

Windows, installed Google Chrome controlled by standalone Playwright; local Python HTTP server. In-app Browser discovery returned no browsers in the implementation session. Run `npm ci` and `npm test` with Python and Google Chrome installed. The test configuration now starts/stops its own local server automatically or reuses one already running. An interrupted manual preview had caused connection-refused test failures; the managed test-server configuration resolves that test setup problem. Tests use the installed Google Chrome channel. Source: owl.spec.cjs, playwright.config.cjs, tests/source-baseline.json. Machine-readable results: test-results/results.json; accessibility outputs: test-results/accessibility.json and test-results/accessibility-interactive.json.

## Browser checks actually performed

Functional cases at **320 × 740**, **375 × 812**, **390 × 844**, **480 × 900**, **768 × 1024**, **1024 × 768**, **1280 × 800**, **1440 × 900**, **1920 × 1080**. Each checks story rendering, initial overflow, owl button/hotspot, exact hint text, success/repeated taps, reset, real CSS animation pause/resume, pause persistence, both artwork variants, larger text and overflow, Look & Find, keyboard leaf activation, canopy response, every navigation link’s local target, direct adventure route/refresh, image loading, console errors, runtime errors, and HTTP error responses. No JavaScript or HTTP errors were observed in these cases.

Additional checks:

- Rapid greeting taps, greeting visibility while paused, hint after success, completed-canopy feedback, reset target label, and keyboard Space activation.
- Actual hit-testing of the illustrated small-leaf coordinates at widths 320, 375, 768, 1024, and 1920. Control buttons remain at least 44px high with no intersecting rectangles.
- Coloring artwork alt text and working hunt after switching artwork.
- Reduced-motion initial state, real CSS animation suppression, skip-link focus, keyboard greeting, reset, and changing preferences during the session.
- Two axe-core scans: initial state and 320px coloring/larger-text/completed/open-disclosure state. **Zero reported violations in both scans.**
- SHA-256 equality of both artwork assets to original-source baselines, preservation of both complete story paragraphs, matching root/nested HTML content, existence of all local HTML asset paths, valid Vercel configuration, and invalid-character scanning.
- `node --check dist/assets/site.js`: passed. `npm audit --json`: **0 vulnerabilities**, including development dependencies.

## Upgraded artwork and activity checks

- Verified non-identity transforms on the original SVG owl group and screenshot pixel differences in the owl region during greeting. The base illustration itself remains untransformed.
- Verified that the owl hotspot wrapper and actual owl pixels use identical animation matrices.
- Verified lower-leaf tap response, real artwork pause/frozen transform across a timed interval, leaf resume, and reset preserving pause.
- Exercised all four color choices; confirmed one selected button, corresponding filter, unchanged original image dimensions, scene visibility and green reset.
- Coloring-book view hides moving color layers, disables palette controls, and keeps targets still. Returning to color restores available controls.
- Reduced motion disables owl and leaf transforms but leaves coloring and finding usable; celebratory motion is suppressed.
- Simulated failed clean-plate requests: original image and hunt still work; unavailable palette controls remain disabled with an explanation.
- An implementation-stage palette selector bug was found visually and fixed: only palette buttons are updated, never the scene container. A regression test now verifies that the scene and original image remain present for every color selection.
- Reviewed a doubled-outline artifact during initial motion preparation; expanded the clean-plate edge mask and recaptured motion frames.

## Visual and source audit

Inspected all supplied files, flattened artwork dimensions (1103 × 1426), original responsive behavior, existing toggles, and missing-page links. Kept original story, typography system, navy/cream/yellow/mint colors, Wonder Together, illustration, and navigation labels. Missing pages resolve to an explicit sample explanation rather than fabricated adventures. Inspectable screenshots include nine responsive layouts plus paused greeting, hint, success, golden-leaf coloring, and original-art motion frames at phone and desktop widths. Reviewed representative phone, narrow-phone, tablet, desktop and interaction-state captures: artwork remains recognizable, targets align, and no visible clipping, distortion, or overlapping controls was found. At 320px some button/navigation labels wrap naturally.

## Deployment and package checks

Root and nested adventure route load successfully with local direct refresh. All assets are local. Vercel config declares dist and no build step; the project does not use SPA routing or a backend. ZIP is regenerated after fixes and checked for archive integrity, required files, byte equality with delivered source, and exclusion of node_modules/ and original/.

## Pending / intentional limitations

- Live Vercel deployment has not been performed; hosting behavior remains pending verification on an actual account.
- Safari, Firefox, physical touch devices, screen-reader reading, and zoom-specific manual checks remain unverified. Automated accessibility checks do not constitute certification.
- The original scene is flattened. Three original-pixel masks now provide a gentle owl lean and independent leaf sway/rustle; a generated clean plate reconstructs only exposed background. No blink, anatomical head-turn, or tree deformation is claimed. See ASSET_PREPARATION.md.
- Only the supplied Owl adventure exists. The other 29 stories and other original site pages are unavailable.
- Pause state persists within the current page session, not across reloads or navigation.
