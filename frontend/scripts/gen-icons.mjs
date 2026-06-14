// Rasterizes public/favicon.svg into the PNG sizes browsers and social cards want.
// Run with: npm run icons
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const svg = readFileSync(join(publicDir, 'favicon.svg'))

const sizes = {
  'favicon-16.png':       16,
  'favicon-32.png':       32,
  'apple-touch-icon.png': 180,
  'icon-192.png':         192,
  'icon-512.png':         512,
}

for (const [name, size] of Object.entries(sizes)) {
  await sharp(svg, { density: 600 }).resize(size, size).png().toFile(join(publicDir, name))
  console.log('wrote', name)
}
