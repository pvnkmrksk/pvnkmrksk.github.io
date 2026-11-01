import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url));
const IMAGE_EXTENSION = /\.(?:jpe?g|png|webp|avif)$/i;
const DEFAULT_CREDIT = 'Pavan · CC BY-SA 4.0';
const ENCODING = {
  version: 1,
  widths: [480, 960],
  fullWidth: 1600,
  webp: { quality: 82 },
  avif: { quality: 58, effort: 5 },
  fullWebp: { quality: 85 },
};
let sharpPromise;
const loadSharp = () => sharpPromise ??= import('sharp').then(module => module.default);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

async function exists(filename) {
  try { return (await stat(filename)).size > 0; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

function descriptionFor(slot, config, filename, index) {
  const override = config.files?.[filename];
  if (override !== undefined && (!override || typeof override !== 'object' || Array.isArray(override))) {
    throw new Error(`Local media: mediaSlots[${JSON.stringify(slot)}].files[${JSON.stringify(filename)}] must be a caption/alt object.`);
  }
  // The lead may inherit the slot description. Every gallery image needs its own words.
  const description = { ...config, ...override };
  const required = index === 0 ? description : override;
  for (const key of ['caption', 'alt']) {
    if (!nonempty(required?.[key])) {
      const location = index === 0 && !override
        ? `mediaSlots[${JSON.stringify(slot)}].${key}`
        : `mediaSlots[${JSON.stringify(slot)}].files[${JSON.stringify(filename)}].${key}`;
      throw new Error(`Local media: ${slot}/${filename} needs its own ${key}. Set ${location} in content/media.mjs to describe this image before building.`);
    }
  }
  const href = typeof description.href === 'string' ? description.href.trim() : description.href;
  if (href !== undefined && href !== '' &&
      (typeof href !== 'string' || /[\u0000-\u001f\u007f]/.test(href) ||
       /^\/\//.test(href) ||
       (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^(?:https?:\/\/|mailto:)/i.test(href)))) {
    throw new Error(`Local media: ${slot}/${filename} has an invalid href; use an HTTP(S), mailto, anchor or relative URL.`);
  }
  return {
    alt: description.alt.trim(),
    caption: description.caption.trim(),
    label: description.caption.trim(),
    position: description.position || '50% 50%',
    credit: nonempty(description.credit) ? description.credit.trim() : DEFAULT_CREDIT,
    ...(nonempty(href) ? { href } : {}),
  };
}

async function writeVariant(sharp, input, filename, width, format, options) {
  if (await exists(filename)) return;
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    // rotate() honours camera orientation; sharp strips EXIF/GPS and other source metadata.
    // All sizes retain the complete frame and avoid enlarging a small original.
    await sharp(input).rotate().resize({ width, withoutEnlargement: true })
      [format](options).toFile(temporary);
    await rename(temporary, filename);
  } finally {
    await rm(temporary, { force: true });
  }
}

/**
 * Prepare content/images/<slot> into public, content-addressed derivatives.
 * Empty folders return []; existing derivatives are cached and never deleted here.
 * projectRoot is optional and allows isolated previews/fixtures outside the site tree.
 */
export async function prepareLocalMedia(slots, { projectRoot = DEFAULT_PROJECT_ROOT } = {}) {
  if (!slots || typeof slots !== 'object' || Array.isArray(slots)) {
    throw new TypeError('Local media: pass the mediaSlots object from content/media.mjs.');
  }
  const prepared = {};
  const outputDirectory = path.join(projectRoot, 'assets/images/local');
  for (const [slot, config] of Object.entries(slots)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slot)) {
      throw new Error(`Local media: invalid slot ${JSON.stringify(slot)}; use lowercase letters, numbers and hyphens.`);
    }
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error(`Local media: ${slot} must have a caption/alt configuration object.`);
    }
    prepared[slot] = [];
    let entries;
    try { entries = await readdir(path.join(projectRoot, 'content/images', slot), { withFileTypes: true }); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    const filenames = entries.filter(entry => entry.isFile() && IMAGE_EXTENSION.test(entry.name))
      .map(entry => entry.name).sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    if (!filenames.length) continue;
    const sharp = await loadSharp();
    await mkdir(outputDirectory, { recursive: true });
    for (const [index, filename] of filenames.entries()) {
      const description = descriptionFor(slot, config, filename, index);
      const input = await readFile(path.join(projectRoot, 'content/images', slot, filename));
      const hash = createHash('sha256').update(JSON.stringify({ ...ENCODING, encoder: sharp.versions }))
        .update(input).digest('hex').slice(0, 20);
      const base = `assets/images/local/${slot}-${hash}`;
      const diskBase = path.join(outputDirectory, `${slot}-${hash}`);
      try {
        await Promise.all([
          ...ENCODING.widths.flatMap(width => [
            writeVariant(sharp, input, `${diskBase}-${width}.webp`, width, 'webp', ENCODING.webp),
            writeVariant(sharp, input, `${diskBase}-${width}.avif`, width, 'avif', ENCODING.avif),
          ]),
          writeVariant(sharp, input, `${diskBase}-full.webp`, ENCODING.fullWidth, 'webp', ENCODING.fullWebp),
        ]);
      } catch (error) {
        throw new Error(`Local media: could not prepare ${slot}/${filename}: ${error.message}`, { cause: error });
      }
      const sizes = await Promise.all(ENCODING.widths.map(width => sharp(`${diskBase}-${width}.webp`).metadata()));
      // Two requested sizes can coincide for small originals: emit one truthful descriptor.
      const uniqueSizes = [...new Map(sizes.map((size, index) => [size.width, { size, suffix: ENCODING.widths[index] }])).values()];
      const display = sizes.at(-1);
      prepared[slot].push({
        base,
        src: `${base}-960.webp`,
        fullSrc: `${base}-full.webp`,
        width: display.width,
        height: display.height,
        srcset: uniqueSizes.map(({ size, suffix }) => `${base}-${suffix}.webp ${size.width}w`).join(', '),
        avifSrcset: uniqueSizes.map(({ size, suffix }) => `${base}-${suffix}.avif ${size.width}w`).join(', '),
        ...description,
      });
    }
  }
  return prepared;
}
