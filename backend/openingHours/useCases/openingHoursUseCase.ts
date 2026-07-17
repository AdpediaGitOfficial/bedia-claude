import {
  createOpeningHours,
  deleteOpeningHoursById,
  fetchAllOpeningHours,
  fetchOpeningHoursById,
  getOpeningHoursCount,
  updateOpeningHoursById,
  fetchAllOpeningHoursForAdmin,
} from '../repos/openingHoursRepo';
import { IOpeningHoursBody, IOpeningHoursModel, IGetAllQuery } from '../../types/openingHoursTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllOpeningHoursUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const totalCount = await getOpeningHoursCount(query);
  if (!totalCount) return { totalCount: 0, openingHours: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const openingHours = await fetchAllOpeningHours(query, skip, parseInt(limit));
  return { totalCount, openingHours };
};
export const getAllOpeningHoursForAdminUseCase = async (
  queryParams: IGetAllQuery,
): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const totalCount = await getOpeningHoursCount(query);
  if (!totalCount) return { totalCount: 0, openingHours: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const openingHours = await fetchAllOpeningHoursForAdmin(query, skip, parseInt(limit));
  return { totalCount, openingHours };
};

export const createOpeningHoursUseCase = async (data: IOpeningHoursBody): Promise<boolean> => {
  // check for  unique value duplications
  const openingHours = await createOpeningHours(data);
  if (!openingHours) {
    throw new AppError('Couldn\'t Create new OpeningHours. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateOpeningHoursByIdUseCase = async (
  id: string,
  data: IOpeningHoursBody,
): Promise<IOpeningHoursModel> => {
  if (ObjectID(id)) {
    // const existingOpeningHours = await fetchOpeningHoursById(id);
    // check for  unique value updations

    const openingHours = await updateOpeningHoursById(id, data);
    if (!openingHours) throw new AppError('Couldn\'t update OpeningHours', HttpStatus.NOT_FOUND);
    return openingHours;
  }
  throw new AppError('No OpeningHours Found', HttpStatus.NOT_FOUND);
};

export const deleteOpeningHoursByIdUseCase = async (id: string): Promise<boolean> => {
  if (!ObjectID(id)) {
    throw new AppError('Invalid OpeningHours ID', HttpStatus.BAD_REQUEST);
  }
  const openingHours = await deleteOpeningHoursById(id);
  if (openingHours) return true;

  throw new AppError('No OpeningHours Found', HttpStatus.NOT_FOUND);
};

export const getOpeningHoursByIdUseCase = async (query: {
  _id: string;
}): Promise<IOpeningHoursModel> => {
  if (ObjectID(query._id)) {
    const openingHours = await fetchOpeningHoursById(query._id);
    if (openingHours) return openingHours;
  }
  throw new AppError('No OpeningHours Found', HttpStatus.NOT_FOUND);
};
