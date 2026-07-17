import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTestimonialUseCase,
  deleteTestimonialByIdUseCase,
  getAllTestimonialsForAdminUseCase,
  getAllTestimonialsUseCase,
  getTestimonialByIdUseCase,
  updateTestimonialByIdUseCase,
} from '../useCases/testimonialUseCase';
import { ITestimonialBody } from '../../types/testimonialTypes';

export const getAllTestimonials = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const testimonials = await getAllTestimonialsUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Testimonials successfully',
      result: testimonials,
    });
  },
);

export const getAllTestimonialsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const testimonials = await getAllTestimonialsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Testimonials successfully',
      result: testimonials,
    });
  },
);

export const createTestimonial = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as ITestimonialBody;
    await createTestimonialUseCase(data);
    res.status(200).json({
      success: true,
      message: 'Created Testimonial successfully',
      result: true,
    });
  },
);
export const updateTestimonialById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as ITestimonialBody;
    await updateTestimonialByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Testimonial successfully',
      result: true,
    });
  },
);

export const deleteTestimonialById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteTestimonialByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Testimonial successfully',
      result: true,
    });
  },
);
export const getTestimonialById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const testimonial = await getTestimonialByIdUseCase({ _id: id });
    res.status(200).json({
      success: true,
      message: 'Fetched Testimonial successfully',
      result: testimonial,
    });
  },
);
