import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createOpeningHoursUseCase,
  deleteOpeningHoursByIdUseCase,
  getAllOpeningHoursUseCase,
  getOpeningHoursByIdUseCase,
  updateOpeningHoursByIdUseCase,
  getAllOpeningHoursForAdminUseCase,
} from '../useCases/openingHoursUseCase';
import { IOpeningHoursBody } from '../../types/openingHoursTypes';

export const getAllOpeningHours = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const openingHours = await getAllOpeningHoursUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All OpeningHours successfully',
      result: openingHours,
    });
  },
);
export const getAllOpeningHoursForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const openingHours = await getAllOpeningHoursForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All OpeningHours successfully',
      result: openingHours,
    });
  },
);
export const createOpeningHours = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as IOpeningHoursBody;
    await createOpeningHoursUseCase(data);
    res.status(200).json({
      success: true,
      message: 'Created OpeningHours successfully',
      result: true,
    });
  },
);
export const updateOpeningHoursById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IOpeningHoursBody;
    await updateOpeningHoursByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated OpeningHours successfully',
      result: true,
    });
  },
);

export const deleteOpeningHoursById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteOpeningHoursByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted OpeningHours successfully',
      result: true,
    });
  },
);
export const getOpeningHoursById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const openingHours = await getOpeningHoursByIdUseCase({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Fetched OpeningHours successfully',
      result: openingHours,
    });
  },
);
