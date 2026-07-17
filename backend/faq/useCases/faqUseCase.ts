import {
  createFaq,
  deleteFaqById,
  fetchAllFaqs,
  fetchAllFaqsForAdmin,
  fetchFaqById,
  getFaqsCount,
  updateFaqById,
} from '../repos/faqRepo';
import { IFaqBody, IFaqModel, IGetAllQuery } from '../../types/faqTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllFaqsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [
      { question: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getFaqsCount(query);

  if (!totalCount) return { totalCount: 0, faqs: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const faqs = await fetchAllFaqs(query, skip, parseInt(limit));
  return { totalCount, faqs };
};

export const getAllFaqsForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { question: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getFaqsCount(query);

  if (!totalCount) return { totalCount: 0, faqs: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const faqs = await fetchAllFaqsForAdmin(query, skip, parseInt(limit));
  return { totalCount, faqs };
};

export const createFaqUseCase = async (data: IFaqBody): Promise<boolean> => {
  // check for  unique value duplications

  const faq = await createFaq(data);
  if (!faq) {
    throw new AppError('Couldn\'t Create new Faq. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateFaqByIdUseCase = async (id: string, data: IFaqBody): Promise<IFaqModel> => {
  if (ObjectID(id)) {
    // const existingFaq = await fetchFaqById(id);
    // check for  unique value updations

    const faq = await updateFaqById(id, data);
    if (!faq) throw new AppError('Couldn\'t update Faq', HttpStatus.NOT_FOUND);
    return faq;
  }
  throw new AppError('No Faq Found', HttpStatus.NOT_FOUND);
};
export const deleteFaqByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const faq = await deleteFaqById(id);
    // check for  unique value updations
    if (faq) return true;
  }
  throw new AppError('No Faq Found', HttpStatus.NOT_FOUND);
};

export const getFaqByIdUseCase = async (query: { _id: string }): Promise<IFaqModel> => {
  if (ObjectID(query._id)) {
    const faq = await fetchFaqById(query._id);
    if (faq) return faq;
  }
  throw new AppError('No Faq Found', HttpStatus.NOT_FOUND);
};
