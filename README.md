# Последний сигнал

An original illustrated Russian scrollytelling short story by **IseFDK**. One empty night train, a closed mountain observatory, and a familiar signal. Seven chapters travel from 00:07 to 06:03.

**Live:** https://isefdk.github.io/last-signal/

## Experience

- Native scrolling drives reversible layered motion: train departure, moving landscape, tunnel passage, observatory approach, radio tuning, dome shutters and dawn
- Three original textured illustration panels, plus original code-drawn SVG train, receiver, ticket, mountains, forest and telescope
- Chapter navigation, progress indicator and replay; no scroll interception, autoplay audio, WebGL, runtime libraries or analytics
- Full equivalent reading edition at `read.html`
- System reduced-motion support and a persistent “Без движения” mode; enlarged text uses a safe static layout
- Responsive layouts for phones, tablets and large screens; keyboard navigation and native dialog focus handling

The story, observatory, station and route are fictional. Technical details serve the narrative, rather than documenting real equipment. Story and visual concept were created for this project with OpenAI assistance.

## Develop

Requires Node.js 20 or later. No package install is necessary.

```
npm run check   # tests, deterministic build, local-link/content/size audit
npm run build   # generates docs/
npm run serve   # serves docs/ on port 4178 where permitted
```

Source is in `src/`. `scripts/build.mjs` generates the committed deployment in `docs/`, including versioned CSS/module URLs. GitHub Pages publishes `main:/docs`.

The unlisted `qa.html` is a real same-origin iframe renderer fixture for 320, 390, 768 and 1440 pixel layouts, text enlargement and exact chapter progress. It is excluded from indexing. Its reports distinguish renderer metrics from source tests. It has no network services or telemetry.

## Art and licenses

`ART.md` records art provenance and prompts. Original PNG masters are retained locally and intentionally excluded from the repository; deployment contains optimized 1600px and 960px WebP assets.

Code, original text and SVG drawings: © 2026 IseFDK. No project license grant is provided. Manrope and Noto Serif Display: SIL Open Font License; notices are in `public/fonts/`. Raster art was generated specifically for this project with OpenAI image generation. No reference website imagery or copy is reused.

## Verification

Run `npm run check` for reproducible automated evidence. Renderer checks and publication results are recorded in `VERIFICATION.md`; those checks must be rerun after relevant visual changes. Automated math/source checks alone are not proof of rendered layout or interaction.
