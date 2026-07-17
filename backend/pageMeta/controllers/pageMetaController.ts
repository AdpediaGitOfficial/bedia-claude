import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createPageMetaUseCase,
  deletePageMetaByIdUseCase,
  getPageMetaByIdUseCase,
  updatePageMetaByIdUseCase,
  getPageMetaByUrlUseCase,
  getAllPageMetasForAdminUseCase,
} from '../useCases/pageMetaUseCase';
import { IPageMetaBody } from '../../types/pageMetaTypes';

export const getAllPageMetasForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const metaDatas = await getAllPageMetasForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All meta data successfully',
      result: metaDatas,
    });
  },
);
export const createPageMeta = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IPageMetaBody;
  await createPageMetaUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created meta data successfully',
    result: true,
  });
});
export const updatePageMetaById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IPageMetaBody;
    await updatePageMetaByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated meta data successfully',
      result: true,
    });
  },
);

export const deletePageMetaById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deletePageMetaByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted meta data successfully',
      result: true,
    });
  },
);
export const getPageMetaById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const metaData = await getPageMetaByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched meta data successfully',
    result: metaData,
  });
});
export const getPageMetaByUrl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body as { url: string };
  const metaData = await getPageMetaByUrlUseCase(url);
  res.status(200).json({
    success: true,
    message: 'Fetched meta data successfully',
    result: metaData,
  });
});
