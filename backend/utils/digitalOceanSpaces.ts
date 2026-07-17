import {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command,
  // ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import configKeys from '../configKeys';
import logger from '../config/logger';

// Initialize the DigitalOcean Spaces client
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });
const s3Client = new S3Client({
  // endpoint: `https://${configKeys.DO_SPACES_ENDPOINT}`, // Ensure full URL with https://
  region: configKeys.DO_SPACES_REGION,
  // forcePathStyle: true, // Important for non-AWS S3-compatible services
  credentials: {
    accessKeyId: configKeys.DO_SPACES_KEY,
    secretAccessKey: configKeys.DO_SPACES_SECRET,
  },
});

const BUCKET_NAME = configKeys.DO_SPACES_BUCKET;

// Upload file to DigitalOcean Space
export const uploadFile = async (fileBuffer: Buffer, fileName: string, mimeType: string) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    // ❌ remove ACL completely
  };

  try {
    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await upload.done();

    return {
      url: `${process.env.FILE_BASE_URL}/${fileName}`,
      result,
    };
  } catch (error) {
    console.error(error, 'error');
    logger.error('Upload failed', error);
    throw error;
  }
};

// export const uploadFile = async (fileBuffer: Buffer, fileName: string, mimeType: string) => {
//   const uploadParams = {
//     Bucket: BUCKET_NAME,
//     Key: fileName,
//     Body: fileBuffer,
//     ContentType: mimeType,
//     ACL: 'public-read' as ObjectCannedACL,
//   };

//   try {
//     const upload = new Upload({
//       client: s3Client,
//       params: uploadParams,
//     });

//     return await upload.done();
//   } catch (error) {
//     logger.error('Upload failed', error);
//     throw error;
//   }
// };

// Rest of the code remains the same...

// Get file URL from DigitalOcean Space

// export const getFileUrl = (fileName: string): string => {
//   // return `https://${BUCKET_NAME}.${configKeys.DO_SPACES_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
// };

export const getFileUrl = (fileName: string): string => {
  return `https://dev-uploads.s3.me-central-1.amazonaws.com/${fileName}`;
};

// Delete file from DigitalOcean Space
// export const deleteFile = async (fileName: string): Promise<void> => {
//   const deleteParams = {
//     Bucket: BUCKET_NAME,
//     Key: fileName,
//   };

//   try {
//     const command = new DeleteObjectCommand(deleteParams);
//     await s3Client.send(command);
//   } catch (error) {
//     logger.error('Delete failed', error);
//     throw error;
//   }
// };

export const deleteFile = async (fileName: string): Promise<void> => {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: fileName, // e.g. "uploads/partners/image.png"
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    const response = await s3Client.send(command);
    logger.info(`File deleted successfully: ${fileName}`, response);
  } catch (error) {
    logger.error('Delete failed', error);
    throw error;
  }
};

// List files in a DigitalOcean Space
export const listFiles = async () => {
  const listParams = {
    Bucket: BUCKET_NAME,
  };

  try {
    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    logger.error('List files failed', error);
    throw error;
  }
};
