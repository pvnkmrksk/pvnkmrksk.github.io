# Pavan’s home on the web


A personal home for work, experiments, tools and musings. Keep the writing first person, warm and concrete; it should sound like Pavan sharing things with a visitor.

## Run locally

Use Node.js 20.9 or newer. Sharp is the image-processing dependency.

```sh
npm ci
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4321. Rebuild after editing; the preview serves `dist/` rather than watching source files. `/?theme=light` is available for local palette review; the public page follows the visitor’s system setting.

## Change an image or its description

`content/media.mjs` is the editable media catalogue. Each named slot has a caption, alt text, crop position, credit and optional “See more” URL (`href`). You can change the description of an existing image here without adding a file.

To replace a slot’s lead image:

1. Drop an image into `content/images/<slot>/`, using a slot name from the catalogue.
2. Update its caption and alt text in `content/media.mjs`. A caption explains the context; alt text describes what is visible. Keep credits separate.
3. Run `npm run build` and `npm run check`, then inspect the page and enlarged image.

The first image in filename order becomes the lead. Use names such as `01-main.jpg` and `02-detail.jpg` to choose the order. Give additional images their own filename-specific descriptions in the slot’s `files` configuration, following the examples in the catalogue. An image override replaces that slot’s looping video with the image.

The build uses Sharp to generate 480 px, 960 px and full-view images up to 1600 px wide, without enlarging small originals. It strips EXIF metadata. Source originals stay out of `dist/`; only generated images needed by the page are exported. The build never downloads remote media.

## Edit the page

- `data/`: text, project links, research, public events and the formal record.
- `content/media.mjs`: image slots, descriptions, credits and crop positions.
- `scripts/build.mjs`: page markup and build logic.
- `assets/tokens.css` and `assets/layout.css`: colours, type and layout.
- `assets/site.js`: navigation, image viewer, media and reveal behaviour.
- `dist/`: generated output; rebuild instead of editing it.

The hero is separate: edit `data/hero.json` and supply already optimized, silent MP4 files. The current ant clip uses source seconds 10–26, with 1920 × 1080 landscape and 720 × 1280 portrait versions. It uses the full source width without a second CSS zoom. Video transcoding is not part of the build.

Research loops are set in `data/story.json`; their captions and alt text are editable in the `research` and `phd` entries of `content/media.mjs`. Keep the existing `gallery` entries to offer the setup photographs as extra views.

| Placement | Source clip | Snippet | Published file |
| --- | --- | --- | --- |
| Research / moving together | IMG_0209.MOV | 8–20 seconds | `assets/videos/locust-vr-loop.mp4` |
| PhD / MultiMoVR | Supplementary Video 1.mp4 | 36–50 seconds | `assets/videos/multimodal-vr-loop.mp4` |

These clips retain the complete 16:9 frame at 1280 × 720, with silent H.264 playback and optimized posters. The locust recording is converted from HDR to standard web colour. The MultiMoVR footage shows the setup described in the [2020 PNAS paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC7275712/). The source videos remain outside the repository.

Videos load lazily and pause offscreen, inside closed disclosures, behind the image viewer and in hidden tabs. Each clip has its own control. Reduced-motion and data-saving preferences begin with still images. Keep these behaviours when changing media.

## Credits and public content

Pavan’s photos and videos use CC BY-SA 4.0. The Essensari material comes from the company’s original site and retains its company credit. Keep joint and upstream credits on maps, supplied recordings, software and designs; a screenshot or photograph does not replace the underlying project’s attribution.

There is no public CV PDF or formal headshot. The explicitly approved MATREX field photograph and supplied public-event photographs are included. Keep the omitted exhibit proposal, unannounced future roles, referee details and unrelated private notes out of public output. Adding files to a drop folder is a publishing choice: only put images intended for the site there.

The checker covers local assets, responsive image candidates, anchors, basic markup and transfer budgets. It also rejects CV/résumé filenames in tracked source and unignored additions, and checks recursively for PDFs in the public output. Review new captions, crops, credits and image-viewer behaviour in the local preview as well.

`data/site.json` sets the canonical address; `PORTFOLIO_SITE_URL` can override it for another static host. GitHub Pages deployment is configured in `.github/workflows/pages.yml`. In repository Settings → Pages, use **GitHub Actions** as the source. The workflow builds and checks pushes to `master`, then publishes the static artifact.
