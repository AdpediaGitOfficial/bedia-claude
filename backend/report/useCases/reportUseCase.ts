// import { processAndUploadDocument } from '../../utils/documentUploader';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { createReport, fetchLatestReport } from '../repos/reportRepo';
import { IReportModel } from '../../types/reportTypes';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from '../../utils/digitalOceanSpaces';

export const uploadReportUseCase = async (file: Express.Multer.File[]): Promise<string> => {
  if (!['application/pdf'].includes(file[0].mimetype))
    throw new AppError('Unsupported file type', HttpStatus.BAD_REQUEST);
  const fileName = 'uploads/reports/' + uuidv4() + path.extname(file[0].originalname);
  await uploadFile(file[0].buffer, fileName, file[0].mimetype);
  // const documentUrl = await processAndUploadDocument('reports', file[0]);
  // if (!documentUrl)
  //   throw new AppError('File upload failed.Please try again', HttpStatus.INTERNAL_SERVER_ERROR);
  await createReport(`/${fileName}`);
  return `/${fileName}`;
};

export const getReportUseCase = async (): Promise<IReportModel> => {
  const report = await fetchLatestReport();
  if (report) return report;
  throw new AppError('Report not found', HttpStatus.NOT_FOUND);
};
