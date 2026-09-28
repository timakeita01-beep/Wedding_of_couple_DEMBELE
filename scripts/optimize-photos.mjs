/**
 * Optimise les photos du couple.
 *
 *   photos/*.jpg|jpeg|png|webp   (originaux, non publiés)
 *        ↓  npm run photos
 *   public/photos/<nom>-<largeur>.webp   (versions responsive)
 *   src/data/photos.generated.json       (dimensions + aperçu flou)
 *
 * Relancez cette commande à chaque ajout ou remplacement de photo.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'photos')
const OUTPUT_DIR = path.join(ROOT, 'public', 'photos')
const MANIFEST = path.join(ROOT, 'src', 'data', 'photos.generated.json')

const WIDTHS = [480, 960, 1600]
const QUALITY = 80

const files = (await readdir(SOURCE_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()

if (files.length === 0) {
  console.error('Aucune photo trouvée dans /photos.')
  process.exit(1)
}

await rm(OUTPUT_DIR, { recursive: true, force: true })
await mkdir(OUTPUT_DIR, { recursive: true })

const manifest = {}

for (const file of files) {
  const name = path.parse(file).name
  const input = sharp(path.join(SOURCE_DIR, file)).rotate()
  const { width, height } = await input.metadata()

  // Never upscale: keep the widths smaller than the original, plus the original width.
  const widths = [...new Set([...WIDTHS.filter((w) => w < width), Math.min(width, WIDTHS.at(-1))])]

  const sources = []
  for (const w of widths) {
    const out = `${name}-${w}.webp`
    await input.clone().resize({ width: w }).webp({ quality: QUALITY }).toFile(path.join(OUTPUT_DIR, out))
    sources.push({ width: w, src: `/photos/${out}` })
  }

  const blur = await input.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()

  manifest[name] = {
    width,
    height,
    sources,
    placeholder: `data:image/webp;base64,${blur.toString('base64')}`,
  }
  console.log(`✓ ${file} → ${widths.join(', ')} px`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${files.length} photo(s) optimisée(s).`)
