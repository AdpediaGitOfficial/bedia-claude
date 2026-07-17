import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { removeUploadedFileUseCase } from '../useCases/fileUploadUseCase';
//import { removeUploadedFileUseCase, uploadFileUseCase } from '../useCases/fileUploadUseCase';

// export const uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//   if (!req.files || req.files.length === 0) {
//     res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
//   } else {
//     const { location } = req.query as { location: string };
//     const watermark = req.query.watermark === 'true' ? true : false;
//     if (!location) {
//       throw new Error('location is required');
//     }

//     const imageUrl = await uploadFileUseCase(
//       req.files as Express.Multer.File[],
//       location,
//       watermark,
//     );
//     res.status(201).json({
//       status: 'success',
//       message: 'file uploaded successfully',
//       result: imageUrl,
//     });
//   }
// });

export const uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
  }
  const { location } = req.query as { location: string };

  if (!location) {
    throw new Error('location is required');
  }

  const files = req.files as Express.Multer.File[];

  const urls = files.map((file) => {
    return `${process.env.BASE_URL}/uploads/${file.filename}`;
  });

  res.status(201).json({
    status: 'success',
    message: 'file uploaded successfully',
    result: urls,
  });
});

export const removeUploadedFile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { location } = req.query as { location: string };
    if (!location) {
      throw new Error('location is required');
    }
    if (!location.startsWith('/uploads')) {
      res.status(403).json({
        message: 'Permission denied. You can only delete files from the uploads directory.',
      });
    } else {
      await removeUploadedFileUseCase(location);
      res.status(200).json({
        status: 'success',
        message: 'file removed successfully',
        result: true,
      });
    }
  },
);
