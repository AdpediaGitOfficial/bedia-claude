import { IClayTypeModel, IClayTypeBody, IGetAllQuery } from '../../types/clayTypeTypes';
import { ObjectID } from '../../utils/objectIdParser';
import clayTypeModel from '../models/clayTypeModel';

export const getClayTypesCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await clayTypeModel.countDocuments(query);
};
export const fetchAllClayTypes = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IClayTypeModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
    isActive: true,
  };
  return await clayTypeModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
export const fetchAllClayTypesForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IClayTypeModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await clayTypeModel
    .find(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchClayTypeById = async (id: string): Promise<IClayTypeModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await clayTypeModel
    .findOne(dbQuery)
    .populate('parentId', 'title')
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};
export const deleteClayTypeById = async (id: string): Promise<IClayTypeModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await clayTypeModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};

export const updateClayTypeById = async (
  id: string,
  data: IClayTypeBody,
): Promise<IClayTypeModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await clayTypeModel.findOneAndUpdate(dbQuery, data);
};
export const createClayType = async (data: IClayTypeBody): Promise<IClayTypeModel | null> => {
  return await clayTypeModel.create(data);
};
