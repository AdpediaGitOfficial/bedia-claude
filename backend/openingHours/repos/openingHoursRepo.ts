import { IOpeningHoursModel, IOpeningHoursBody, IGetAllQuery } from '../../types/openingHoursTypes';
import { ObjectID } from '../../utils/objectIdParser';
import openingHoursModel from '../models/openingHoursModel';

export const getOpeningHoursCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await openingHoursModel.countDocuments(query);
};
export const fetchAllOpeningHours = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IOpeningHoursModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
    isActive: true,
  };
  return await openingHoursModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
export const fetchAllOpeningHoursForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IOpeningHoursModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await openingHoursModel
    .find(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchOpeningHoursById = async (id: string): Promise<IOpeningHoursModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await openingHoursModel
    .findOne(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};

export const fetchOpeningHoursBySlug = async (slug: string): Promise<IOpeningHoursModel | null> => {
  const dbQuery = {
    slug: slug,
    isDeleted: false,
    isActive: true,
  };
  return await openingHoursModel
    .findOne(dbQuery)
    .select({
      isDeleted: 0,
      isActive: 0,
      updatedAt: 0,
      __v: 0,
      createdAt: 0,
      showOnHomepage: 0,
    })
    .lean();
};
export const deleteOpeningHoursById = async (id: string): Promise<IOpeningHoursModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await openingHoursModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};

export const updateOpeningHoursById = async (
  id: string,
  data: IOpeningHoursBody,
): Promise<IOpeningHoursModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await openingHoursModel.findOneAndUpdate(dbQuery, data);
};
export const createOpeningHours = async (
  data: IOpeningHoursBody,
): Promise<IOpeningHoursModel | null> => {
  return await openingHoursModel.create(data);
};
