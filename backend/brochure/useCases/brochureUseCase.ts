import {
  createBrochure,
  deleteBrochureById,
  fetchAllBrochures,
  fetchBrochureById,
  getBrochuresCount,
  updateBrochureById,
  fetchAllBrochuresForAdmin,
} from '../repos/brochureRepo';
import { IBrochureBody, IBrochureModel, IGetAllQuery } from '../../types/brochureTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllBrochuresUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const totalCount = await getBrochuresCount(query);
  if (!totalCount) return { totalCount: 0, brochures: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const brochures = await fetchAllBrochures(query, skip, parseInt(limit));
  return { totalCount, brochures };
};
export const getAllBrochuresForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const totalCount = await getBrochuresCount(query);
  if (!totalCount) return { totalCount: 0, brochures: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const brochures = await fetchAllBrochuresForAdmin(query, skip, parseInt(limit));
  return { totalCount, brochures };
};

export const createBrochureUseCase = async (data: IBrochureBody): Promise<boolean> => {
  // check for  unique value duplications
  const brochure = await createBrochure(data);
  if (!brochure) {
    throw new AppError('Couldn\'t Create new Brochure. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateBrochureByIdUseCase = async (
  id: string,
  data: IBrochureBody,
): Promise<IBrochureModel> => {
  if (ObjectID(id)) {
    // const existingBrochure = await fetchBrochureById(id);
    // check for  unique value updations

    const brochure = await updateBrochureById(id, data);
    if (!brochure) throw new AppError('Couldn\'t update Brochure', HttpStatus.NOT_FOUND);
    return brochure;
  }
  throw new AppError('No Brochure Found', HttpStatus.NOT_FOUND);
};
export const deleteBrochureByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const brochure = await deleteBrochureById(id);
    // check for  unique value updations
    if (brochure) return true;
  }
  throw new AppError('No Brochure Found', HttpStatus.NOT_FOUND);
};

export const getBrochureByIdUseCase = async (query: { _id: string }): Promise<IBrochureModel> => {
  if (ObjectID(query._id)) {
    const brochure = await fetchBrochureById(query._id);
    if (brochure) return brochure;
  }
  throw new AppError('No Brochure Found', HttpStatus.NOT_FOUND);
};
