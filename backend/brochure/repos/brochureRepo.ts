import { IBrochureModel, IBrochureBody, IGetAllQuery } from '../../types/brochureTypes';
import { ObjectID } from '../../utils/objectIdParser';
import brochureModel from '../models/brochureModel';

export const getBrochuresCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await brochureModel.countDocuments(query);
};
export const fetchAllBrochures = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IBrochureModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await brochureModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchAllBrochuresForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IBrochureModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await brochureModel
    .find(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchBrochureById = async (id: string): Promise<IBrochureModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await brochureModel.findOne(dbQuery).select({ isDeleted: 0, updatedAt: 0, __v: 0 }).lean();
};
export const deleteBrochureById = async (id: string): Promise<IBrochureModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await brochureModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateBrochureById = async (
  id: string,
  data: IBrochureBody,
): Promise<IBrochureModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await brochureModel.findOneAndUpdate(dbQuery, data);
};
export const createBrochure = async (data: IBrochureBody): Promise<IBrochureModel | null> => {
  return await brochureModel.create(data);
};
