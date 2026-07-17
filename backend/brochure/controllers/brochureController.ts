import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createBrochureUseCase,
  deleteBrochureByIdUseCase,
  getAllBrochuresUseCase,
  getBrochureByIdUseCase,
  updateBrochureByIdUseCase,
  getAllBrochuresForAdminUseCase,
} from '../useCases/brochureUseCase';
import { IBrochureBody } from '../../types/brochureTypes';

export const getAllBrochures = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const brochures = await getAllBrochuresUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Brochures successfully',
    result: brochures,
  });
});
export const getAllBrochuresForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const brochures = await getAllBrochuresForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Brochures successfully',
      result: brochures,
    });
  },
);
export const createBrochure = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IBrochureBody;
  await createBrochureUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Brochure successfully',
    result: true,
  });
});
export const updateBrochureById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IBrochureBody;
    await updateBrochureByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Brochure successfully',
      result: true,
    });
  },
);

export const deleteBrochureById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteBrochureByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Brochure successfully',
      result: true,
    });
  },
);
export const getBrochureById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const brochure = await getBrochureByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Brochure successfully',
    result: brochure,
  });
});
