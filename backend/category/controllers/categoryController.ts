import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCategoryUseCase,
  deleteCategoryByIdUseCase,
  getAllCategoriesUseCase,
  getCategoryByIdUseCase,
  updateCategoryByIdUseCase,
  getAllCategoriesForAdminUseCase,
} from '../useCases/categoryUseCase';
import { ICategoryBody } from '../../types/categoryTypes';

export const getAllCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = await getAllCategoriesUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Categories successfully',
    result: categories,
  });
});
export const getAllCategoriesForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const categories = await getAllCategoriesForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Categories successfully',
      result: categories,
    });
  },
);
export const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as ICategoryBody;
  await createCategoryUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Category successfully',
    result: true,
  });
});
export const updateCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as ICategoryBody;
    await updateCategoryByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Category successfully',
      result: true,
    });
  },
);

export const deleteCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteCategoryByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Category successfully',
      result: true,
    });
  },
);
export const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await getCategoryByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Category successfully',
    result: category,
  });
});
