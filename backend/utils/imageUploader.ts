import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import configKeys from '../configKeys';

export async function processAndUploadImage(
  location: string,
  file: Express.Multer.File,
  watermark: boolean,
): Promise<string> {
  let processedImage: Buffer;

  if (watermark) {
    processedImage = await addWatermark(file.buffer);
  } else {
    processedImage = await sharp(file.buffer).toFormat('png').toBuffer();
  }

  // Generate a unique filename
  const filename = uuidv4() + '.png';
  const filePath = path.join(configKeys.BASE_DIR_PATH, 'uploads', location, filename);

  // Ensure the directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Save the file to the local directory
  await fs.writeFile(filePath, processedImage);

  // Return the file path or a URL to access the file
  return `/uploads/${location}/${filename}`;
}

export async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const watermarkPath = path.join(configKeys.BASE_DIR_PATH, 'assets', 'dejavuicon.png');
  const watermarkImage = await sharp(watermarkPath)
    .resize(200) // Resize watermark if needed
    .toBuffer();

  return await sharp(imageBuffer)
    .composite([
      {
        input: watermarkImage,
        gravity: 'center',
        blend: 'over', // Ensure watermark is applied on top
      },
    ])
    .toFormat('png')
    .toBuffer();
}
