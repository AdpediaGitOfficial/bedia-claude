import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCareerUseCase,
  deleteCareerByIdUseCase,
  getAllCareersUseCase,
  getCareerByIdUseCase,
  updateCareerByIdUseCase,
  getCareerBySlugUseCase,
  getAllCareersForAdminUseCase,
  createJobApplicationUseCase,
  getAllJobApplicationsUseCase,
  getCareerMetaBySlugUseCase,
} from '../useCases/careerUseCase';
import { ICareerBody } from '../../types/careerTypes';
import { IJobApplicationBody } from '../../types/jobApplicationTypes';

export const getAllCareers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const careers = await getAllCareersUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Careers successfully',
    result: careers,
  });
});
export const getAllCareersForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const careers = await getAllCareersForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Careers successfully',
      result: careers,
    });
  },
);
export const getAllJobApplications = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const jobApplications = await getAllJobApplicationsUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Job Applications successfully',
      result: jobApplications,
    });
  },
);
export const createCareer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as ICareerBody;
  await createCareerUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Career successfully',
    result: true,
  });
});

export const createJobApplication = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
      return;
    }
    const data = req.body as IJobApplicationBody;
    await createJobApplicationUseCase(data, req.file);
    res.status(200).json({
      success: true,
      message: 'Added Job Application successfully',
      result: true,
    });
  },
);

export const updateCareerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as ICareerBody;
  await updateCareerByIdUseCase(id, data);
  res.status(200).json({
    success: true,
    message: 'Updated Career successfully',
    result: true,
  });
});

export const deleteCareerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteCareerByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: 'Deleted Career successfully',
    result: true,
  });
});
export const getCareerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const career = await getCareerByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Career successfully',
    result: career,
  });
});
export const getCareerBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const career = await getCareerBySlugUseCase(slug);
  res.status(200).json({
    success: true,
    message: 'Fetched Career successfully',
    result: career,
  });
});
export const getCareerMetaBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const career = await getCareerMetaBySlugUseCase(slug);
    res.status(200).json({
      success: true,
      message: 'Fetched meta data successfully',
      result: career,
    });
  },
);
