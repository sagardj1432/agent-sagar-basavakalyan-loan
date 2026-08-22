import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('src/assets/images');

async function optimizeImages() {
  if (!fs.existsSync(imagesDir)) {
    console.log('Images directory does not exist:', imagesDir);
    return;
  }

  const files = fs.readdirSync(imagesDir);
  console.log(`Found ${files.length} files in ${imagesDir}`);

  for (const file of files) {
    if (file.match(/\.(jpe?g|png)$/i)) {
      const inputPath = path.join(imagesDir, file);
      const baseName = file.replace(/\.(jpe?g|png)$/i, '');
      const webpPath = path.join(imagesDir, `${baseName}.webp`);

      try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        await sharp(inputPath)
          .webp({ quality: 82, effort: 6 })
          .toFile(webpPath);

        const originalStats = fs.statSync(inputPath);
        const webpStats = fs.statSync(webpPath);
        const savings = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);

        console.log(`✓ Optimized ${file} (${(originalStats.size / 1024).toFixed(1)} KB) -> ${baseName}.webp (${(webpStats.size / 1024).toFixed(1)} KB) [${savings}% saved] - Dimensions: ${metadata.width}x${metadata.height}`);
      } catch (err) {
        console.error(`Failed to optimize ${file}:`, err);
      }
    }
  }
}

optimizeImages().catch(console.error);
