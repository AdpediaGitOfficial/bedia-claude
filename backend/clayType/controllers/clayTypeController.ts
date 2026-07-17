import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createClayTypeUseCase,
  deleteClayTypeByIdUseCase,
  getAllClayTypesUseCase,
  getClayTypeByIdUseCase,
  updateClayTypeByIdUseCase,
  getAllClayTypesForAdminUseCase,
} from '../useCases/clayTypeUseCase';
import { IClayTypeBody } from '../../types/clayTypeTypes';

export const getAllClayTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const clayTypes = await getAllClayTypesUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All ClayTypes successfully',
    result: clayTypes,
  });
});
export const getAllClayTypesForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const clayTypes = await getAllClayTypesForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All ClayTypes successfully',
      result: clayTypes,
    });
  },
);
export const createClayType = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IClayTypeBody;
  await createClayTypeUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created ClayType successfully',
    result: true,
  });
});
export const updateClayTypeById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IClayTypeBody;
    await updateClayTypeByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated ClayType successfully',
      result: true,
    });
  },
);

export const deleteClayTypeById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteClayTypeByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted ClayType successfully',
      result: true,
    });
  },
);
export const getClayTypeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const clayType = await getClayTypeByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched ClayType successfully',
    result: clayType,
  });
});
