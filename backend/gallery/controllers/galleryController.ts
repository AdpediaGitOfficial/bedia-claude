import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createGalleryUseCase,
  deleteGalleryByIdUseCase,
  getAllGalleriesUseCase,
  getGalleryByIdUseCase,
  updateGalleryByIdUseCase,
  getAllGalleriesForAdminUseCase,
} from '../useCases/galleryUseCase';
import { IGalleryBody } from '../../types/galleryTypes';

export const getAllGalleries = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const galleries = await getAllGalleriesUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Galleries successfully',
    result: galleries,
  });
});
export const getAllGalleriesForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const galleries = await getAllGalleriesForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Galleries successfully',
      result: galleries,
    });
  },
);
export const createGallery = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IGalleryBody;
  await createGalleryUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Gallery successfully',
    result: true,
  });
});
export const updateGalleryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IGalleryBody;
    await updateGalleryByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Gallery successfully',
      result: true,
    });
  },
);

export const deleteGalleryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteGalleryByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Gallery successfully',
      result: true,
    });
  },
);
export const getGalleryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const gallery = await getGalleryByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Gallery successfully',
    result: gallery,
  });
});
