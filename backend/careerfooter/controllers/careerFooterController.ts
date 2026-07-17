import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCareerFooterUseCase,
  deleteCareerFooterByIdUseCase,
  getAllCareerFootersForAdminUseCase,
  getAllCareerFootersUseCase,
  getCareerFooterByIdUseCase,
  updateCareerFooterByIdUseCase,
} from '../useCases/careerFooterUseCase';
import { ICareerFooterBody } from '../../types/careerFooterTypes';

export const getAllCareerFooters = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const careerFooters = await getAllCareerFootersUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All CareerFooters successfully',
      result: careerFooters,
    });
  },
);

export const getAllCareerFootersForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const careerFooters = await getAllCareerFootersForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All CareerFooters successfully',
      result: careerFooters,
    });
  },
);

export const createCareerFooter = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as ICareerFooterBody;
    await createCareerFooterUseCase(data);
    res.status(200).json({
      success: true,
      message: 'Created CareerFooter successfully',
      result: true,
    });
  },
);
export const updateCareerFooterById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as ICareerFooterBody;
    await updateCareerFooterByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated CareerFooter successfully',
      result: true,
    });
  },
);

export const deleteCareerFooterById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteCareerFooterByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted CareerFooter successfully',
      result: true,
    });
  },
);
export const getCareerFooterById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const careerFooter = await getCareerFooterByIdUseCase({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Fetched CareerFooter successfully',
      result: careerFooter,
    });
  },
);
