import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createGoogleReviewUseCase,
  deleteGoogleReviewByIdUseCase,
  getAllGoogleReviewsForAdminUseCase,
  getAllGoogleReviewsUseCase,
  getGoogleReviewByIdUseCase,
  updateGoogleReviewByIdUseCase,
  syncGoogleReviewsUseCase,
} from '../useCases/googleReviewUseCase';
import { IGoogleReviewBody } from '../../types/googleReviewTypes';

export const getAllGoogleReviews = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const googleReviews = await getAllGoogleReviewsUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All GoogleReviews successfully',
      result: googleReviews,
    });
  },
);

export const getAllGoogleReviewsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const googleReviews = await getAllGoogleReviewsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All GoogleReviews successfully',
      result: googleReviews,
    });
  },
);

export const createGoogleReview = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as IGoogleReviewBody;
    await createGoogleReviewUseCase(data);
    res.status(200).json({
      success: true,
      message: 'Created GoogleReview successfully',
      result: true,
    });
  },
);

export const updateGoogleReviewById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IGoogleReviewBody;
    await updateGoogleReviewByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated GoogleReview successfully',
      result: true,
    });
  },
);

export const deleteGoogleReviewById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteGoogleReviewByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted GoogleReview successfully',
      result: true,
    });
  },
);

export const getGoogleReviewById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const googleReview = await getGoogleReviewByIdUseCase({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Fetched GoogleReview successfully',
      result: googleReview,
    });
  },
);

export const syncGoogleReviews = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    await syncGoogleReviewsUseCase();
    res.status(200).json({
      success: true,
      message: 'Google reviews synced successfully',
    });
  },
);
