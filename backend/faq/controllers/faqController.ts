import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createFaqUseCase,
  deleteFaqByIdUseCase,
  getAllFaqsForAdminUseCase,
  getAllFaqsUseCase,
  getFaqByIdUseCase,
  updateFaqByIdUseCase,
} from '../useCases/faqUseCase';
import { IFaqBody } from '../../types/faqTypes';

export const getAllFaqs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const faqs = await getAllFaqsUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Faqs successfully',
    result: faqs,
  });
});

export const getAllFaqsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const faqs = await getAllFaqsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Faqs successfully',
      result: faqs,
    });
  },
);

export const createFaq = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IFaqBody;
  await createFaqUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Faq successfully',
    result: true,
  });
});

export const updateFaqById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as IFaqBody;
  await updateFaqByIdUseCase(id, data);
  res.status(200).json({
    success: true,
    message: 'Updated Faq successfully',
    result: true,
  });
});

export const deleteFaqById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteFaqByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: 'Deleted Faq successfully',
    result: true,
  });
});

export const getFaqById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const faq = await getFaqByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Faq successfully',
    result: faq,
  });
});
