// import path from 'path';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
// import configKeys from '../../configKeys';
// import { processAndUploadDocument } from '../../utils/documentUploader';
import { addWatermark } from '../../utils/imageUploader';
// import { promises as fs } from 'fs';
import logger from '../../config/logger';
import { deleteFile, uploadFile } from '../../utils/digitalOceanSpaces';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadFileUseCase = async (
  files: Express.Multer.File[],
  location: string,
  watermark: boolean,
): Promise<string[]> => {
  const uploads = [];

  for (const file of files) {
    if (
      ![
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'image/webp',
        'image/jpeg',
        'image/svg+xml',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/heic',
        'image/heif',
        'image/avif',
        'image/x-icon',
      ].includes(file.mimetype)
    ) {
      throw new AppError('Unsupported file type', HttpStatus.BAD_REQUEST);
    }

    // if (file.size > 2 * 1024 * 1024) {
    //   throw new AppError('file size exceeded', HttpStatus.BAD_REQUEST);
    // }
    // if (
    //   ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/jpeg'].includes(file.mimetype)
    // ) {
    //   const imageUrl = await processAndUploadImage(location, file, watermark);
    //   if (!imageUrl) throw new AppError('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    //   uploads.push(imageUrl);
    // }
    // if (['application/pdf'].includes(file.mimetype)) {
    //   const documentUrl = await processAndUploadDocument(location, file);
    //   if (!documentUrl) throw new AppError('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    //   uploads.push(documentUrl);
    // }
    let fileBuffer = file.buffer;
    if (
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/jpeg'].includes(
        file.mimetype,
      ) &&
      watermark === true
    ) {
      fileBuffer = await addWatermark(file.buffer);
    }
    const fileName = `uploads/${location}/` + uuidv4() + path.extname(file.originalname);

    await uploadFile(fileBuffer, fileName, file.mimetype);

    uploads.push(`/${fileName}`);
  }
  return uploads;
};

export const removeUploadedFileUseCase = async (location: string): Promise<boolean> => {
  // const absolutePath = path.resolve(location);
  try {
    // await fs.rm(path.join(configKeys.BASE_DIR_PATH, location));
    // Extract file name from the URL
    // const urlParts = location.split('/');
    // const fileName = urlParts.slice(3).join('/'); // Get everything after the bucket's region and space name

    // if (!fileName) {
    //   throw new AppError('File not found', HttpStatus.NOT_FOUND);
    // }
    // Delete the file from DigitalOcean Space
    await deleteFile(location);
    return true;
  } catch (error: any) {
    // if (error.code === 'ENOENT') {
    //   // ENOENT means no such file or directory
    //   throw new AppError('File not found', HttpStatus.NOT_FOUND);
    // } else {
    logger.info({ error });
    throw new AppError('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }
};
