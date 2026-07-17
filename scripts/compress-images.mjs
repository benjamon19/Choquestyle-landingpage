import sharp from 'sharp'
import { statSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const INPUT_DIR = 'public/images'

const configs = {
  'choque_cage_floor_logo.webp': { width: 1920, quality: 72 },
  'couch1.webp':  { width: 800, quality: 78 },
  'couch2.webp':  { width: 800, quality: 78 },
  'image1.webp':  { width: 900, quality: 75 },
  'image2.webp':  { width: 900, quality: 75 },
  'image3.webp':  { width: 900, quality: 75 },
  'image4.webp':  { width: 900, quality: 75 },
  'image5.webp':  { width: 900, quality: 75 },
  'image6.webp':  { width: 900, quality: 75 },
}

let totalBefore = 0
let totalAfter = 0

for (const [filename, { width, quality }] of Object.entries(configs)) {
  const filePath = join(INPUT_DIR, filename)
  try {
    const before = statSync(filePath).size
    totalBefore += before

    // Read into buffer first so sharp never memory-maps the original file
    const inputBuf = readFileSync(filePath)
    const image = sharp(inputBuf)
    const meta = await image.metadata()
    const resizeOpts = meta.width > width ? { width, withoutEnlargement: true } : null

    const outBuf = await (resizeOpts ? image.resize(resizeOpts) : image)
      .webp({ quality, effort: 5 })
      .toBuffer()

    if (outBuf.length < before) {
      writeFileSync(filePath, outBuf)
      totalAfter += outBuf.length
      console.log(`✓ ${filename}: ${(before/1024).toFixed(0)}KB → ${(outBuf.length/1024).toFixed(0)}KB (-${(((before-outBuf.length)/before)*100).toFixed(0)}%)`)
    } else {
      totalAfter += before
      console.log(`  ${filename}: already optimal, skipped`)
    }
  } catch (e) {
    console.error(`✗ ${filename}: ${e.message}`)
  }
}

console.log(`\nTotal: ${(totalBefore/1024).toFixed(0)}KB → ${(totalAfter/1024).toFixed(0)}KB (-${(((totalBefore-totalAfter)/totalBefore)*100).toFixed(0)}%)`)
