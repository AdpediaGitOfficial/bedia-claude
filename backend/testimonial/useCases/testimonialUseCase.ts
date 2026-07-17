import {
  createTestimonial,
  deleteTestimonialById,
  fetchAllTestimonials,
  fetchAllTestimonialsForAdmin,
  fetchTestimonialById,
  getTestimonialsCount,
  updateTestimonialById,
} from '../repos/testimonialRepo';
import { ITestimonialBody, ITestimonialModel, IGetAllQuery } from '../../types/testimonialTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllTestimonialsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { author: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { designation: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getTestimonialsCount(query);

  if (!totalCount) return { totalCount: 0, testimonials: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const testimonials = await fetchAllTestimonials(query, skip, parseInt(limit));
  return { totalCount, testimonials };
};

export const getAllTestimonialsForAdminUseCase = async (
  queryParams: IGetAllQuery,
): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { author: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { designation: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getTestimonialsCount(query);

  if (!totalCount) return { totalCount: 0, testimonials: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const testimonials = await fetchAllTestimonialsForAdmin(query, skip, parseInt(limit));
  return { totalCount, testimonials };
};

export const createTestimonialUseCase = async (data: ITestimonialBody): Promise<boolean> => {
  // check for  unique value duplications

  const testimonial = await createTestimonial(data);
  if (!testimonial) {
    throw new AppError('Couldn\'t Create new Testimonial. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateTestimonialByIdUseCase = async (
  id: string,
  data: ITestimonialBody,
): Promise<ITestimonialModel> => {
  if (ObjectID(id)) {
    // const existingTestimonial = await fetchTestimonialById(id);
    // check for  unique value updations

    const testimonial = await updateTestimonialById(id, data);
    if (!testimonial) throw new AppError('Couldn\'t update Testimonial', HttpStatus.NOT_FOUND);
    return testimonial;
  }
  throw new AppError('No Testimonial Found', HttpStatus.NOT_FOUND);
};
export const deleteTestimonialByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const testimonial = await deleteTestimonialById(id);
    // check for  unique value updations
    if (testimonial) return true;
  }
  throw new AppError('No Testimonial Found', HttpStatus.NOT_FOUND);
};

export const getTestimonialByIdUseCase = async (query: {
  _id: string;
}): Promise<ITestimonialModel> => {
  if (ObjectID(query._id)) {
    const testimonial = await fetchTestimonialById(query._id);
    if (testimonial) return testimonial;
  }
  throw new AppError('No Testimonial Found', HttpStatus.NOT_FOUND);
};
