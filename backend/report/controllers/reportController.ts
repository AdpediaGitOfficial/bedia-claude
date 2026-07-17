import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { uploadReportUseCase, getReportUseCase } from '../useCases/reportUseCase';

export const uploadReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
  }
  const response = await uploadReportUseCase(req.files as Express.Multer.File[]);
  res.status(200).json({
    success: true,
    message: 'Report uploaded successfully',
    result: response,
  });
});

export const getReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const response = await getReportUseCase();
  res.status(200).json({
    success: true,
    message: 'Report fetched successfully',
    result: response,
  });
});
