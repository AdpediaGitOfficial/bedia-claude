import {
  createClayType,
  deleteClayTypeById,
  fetchAllClayTypes,
  fetchClayTypeById,
  getClayTypesCount,
  updateClayTypeById,
  fetchAllClayTypesForAdmin,
} from '../repos/clayTypeRepo';
import { IClayTypeBody, IClayTypeModel, IGetAllQuery } from '../../types/clayTypeTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllClayTypesUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const totalCount = await getClayTypesCount(query);
  if (!totalCount) return { totalCount: 0, clayTypes: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const clayTypes = await fetchAllClayTypes(query, skip, parseInt(limit));
  return { totalCount, clayTypes };
};
export const getAllClayTypesForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const totalCount = await getClayTypesCount(query);
  if (!totalCount) return { totalCount: 0, clayTypes: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const clayTypes = await fetchAllClayTypesForAdmin(query, skip, parseInt(limit));
  return { totalCount, clayTypes };
};

export const createClayTypeUseCase = async (data: IClayTypeBody): Promise<boolean> => {
  // check for  unique value duplications
  const clayType = await createClayType(data);
  if (!clayType) {
    throw new AppError('Couldn\'t Create new ClayType. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateClayTypeByIdUseCase = async (
  id: string,
  data: IClayTypeBody,
): Promise<IClayTypeModel> => {
  if (ObjectID(id)) {
    // const existingClayType = await fetchClayTypeById(id);
    // check for  unique value updations

    const clayType = await updateClayTypeById(id, data);
    if (!clayType) throw new AppError('Couldn\'t update ClayType', HttpStatus.NOT_FOUND);
    return clayType;
  }
  throw new AppError('No ClayType Found', HttpStatus.NOT_FOUND);
};

// export const deleteClayTypeByIdUseCase = async (id: string): Promise<boolean> => {
//   if (ObjectID(id)) {
//     const clayType = await deleteClayTypeById(id);
//     // check for  unique value updations
//     if (clayType) return true;
//   }
//   throw new AppError('No ClayType Found', HttpStatus.NOT_FOUND);
// };

export const deleteClayTypeByIdUseCase = async (id: string): Promise<boolean> => {
  if (!ObjectID(id)) {
    throw new AppError('Invalid ClayType ID', HttpStatus.BAD_REQUEST);
  }
  const clayType = await deleteClayTypeById(id);
  if (clayType) return true;
  throw new AppError('No ClayType Found', HttpStatus.NOT_FOUND);
};

export const getClayTypeByIdUseCase = async (query: { _id: string }): Promise<IClayTypeModel> => {
  if (ObjectID(query._id)) {
    const clayType = await fetchClayTypeById(query._id);
    if (clayType) return clayType;
  }
  throw new AppError('No ClayType Found', HttpStatus.NOT_FOUND);
};
