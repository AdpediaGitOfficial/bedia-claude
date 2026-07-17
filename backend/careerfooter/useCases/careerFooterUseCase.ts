import {
  createCareerFooter,
  deleteCareerFooterById,
  fetchAllCareerFooters,
  fetchAllCareerFootersForAdmin,
  fetchCareerFooterById,
  getCareerFootersCount,
  updateCareerFooterById,
} from '../repos/careerFooterRepo';
import { ICareerFooterBody, ICareerFooterModel, IGetAllQuery } from '../../types/careerFooterTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllCareerFootersUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ name: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }
  const totalCount = await getCareerFootersCount(query);

  if (!totalCount) return { totalCount: 0, careerFooters: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const careerFooters = await fetchAllCareerFooters(query, skip, parseInt(limit));
  return { totalCount, careerFooters };
};

export const getAllCareerFootersForAdminUseCase = async (
  queryParams: IGetAllQuery,
): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ name: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }
  const totalCount = await getCareerFootersCount(query);

  if (!totalCount) return { totalCount: 0, careerFooters: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const careerFooters = await fetchAllCareerFootersForAdmin(query, skip, parseInt(limit));
  return { totalCount, careerFooters };
};

export const createCareerFooterUseCase = async (data: ICareerFooterBody): Promise<boolean> => {
  // check for  unique value duplications

  const careerFooter = await createCareerFooter(data);
  if (!careerFooter) {
    throw new AppError('Couldn\'t Create new CareerFooter. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateCareerFooterByIdUseCase = async (
  id: string,
  data: ICareerFooterBody,
): Promise<ICareerFooterModel> => {
  if (ObjectID(id)) {
    // const existingCareerFooter = await fetchCareerFooterById(id);
    // check for  unique value updations

    const careerFooter = await updateCareerFooterById(id, data);
    if (!careerFooter) throw new AppError('Couldn\'t update CareerFooter', HttpStatus.NOT_FOUND);
    return careerFooter;
  }
  throw new AppError('No CareerFooter Found', HttpStatus.NOT_FOUND);
};
export const deleteCareerFooterByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const careerFooter = await deleteCareerFooterById(id);
    // check for  unique value updations
    if (careerFooter) return true;
  }
  throw new AppError('No CareerFooter Found', HttpStatus.NOT_FOUND);
};

export const getCareerFooterByIdUseCase = async (query: {
  _id: string;
}): Promise<ICareerFooterModel> => {
  if (ObjectID(query._id)) {
    const careerFooter = await fetchCareerFooterById(query._id);
    if (careerFooter) return careerFooter;
  }
  throw new AppError('No CareerFooter Found', HttpStatus.NOT_FOUND);
};
