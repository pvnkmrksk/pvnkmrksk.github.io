# Replacing site images

1. Put a JPG, JPEG, PNG, WebP or AVIF in the matching folder here. Keep only the images you want to show. Use names such as `01-main.jpg` and `02-detail.jpg`: the first filename in lexical order is the lead; the rest are its gallery. Empty folders keep the site's current images.
2. Open [`../media.mjs`](../media.mjs). Update that slot's `caption` and `alt` to match the new lead image. A caption explains the context; alt text describes what is visible. Add a `files` entry with its own caption and alt for every additional image. Optional `credit`, `href` and `position` can be set for a slot or individual file.
3. Run `npm run build`, then preview the site. Missing captions or alt text stop the build with the filename and the setting to fix.

For example, inside the relevant slot in `media.mjs`:

```js
caption: 'The experiment running under a field canopy.',
alt: 'A portable VR rig on a table under a canopy, beside a notebook.',
position: '50% 40%',
files: {
  '02-detail.jpg': {
    caption: 'A closer view of the tracking camera.',
    alt: 'A small camera points toward a patterned ball below an insect.',
    credit: 'Pavan · CC BY-SA 4.0',
  },
},
```

The build rotates camera images correctly, preserves their aspect ratio and creates 480/960-pixel WebP and AVIF previews plus a WebP lightbox image up to 1600 pixels wide. Small images are never enlarged. It strips source metadata, including EXIF and GPS. Public derivative names contain the slot and a content hash, never the original filename or local path. Do not put private material in these folders: source images remain local build inputs, but their visible content is published through the derivatives. Default credit is `Pavan · CC BY-SA 4.0`; set a different credit where appropriate.

Generated files are cached in `assets/images/local/`. Changing an image or encoding options creates new derivatives; editing its description reuses them. The preparer does not delete old derivatives. Video replacement is managed separately.
