import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import configKeys from '../configKeys';

export async function processAndUploadDocument(
  location: string,
  file: Express.Multer.File,
): Promise<string> {
  // Generate a unique filename
  const filename = uuidv4() + '.pdf';
  const filePath = path.join(configKeys.BASE_DIR_PATH, 'uploads', location, filename);
  // Ensure the directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  // Save the file to the local directory
  await fs.writeFile(filePath, file.buffer);
  // Return the file path or a URL to access the file
  return `/uploads/${location}/${filename}`;
}
