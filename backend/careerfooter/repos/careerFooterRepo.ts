import { ICareerFooterModel, ICareerFooterBody, IGetAllQuery } from '../../types/careerFooterTypes';
import { ObjectID } from '../../utils/objectIdParser';
import careerFooterModel from '../models/careerFooterModel';

export const getCareerFootersCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await careerFooterModel.countDocuments(query);
};
export const fetchAllCareerFooters = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ICareerFooterModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await careerFooterModel
    .find(dbQuery)
    .select({ title: 1, content: 1, image: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchAllCareerFootersForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ICareerFooterModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await careerFooterModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchCareerFooterById = async (id: string): Promise<ICareerFooterModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerFooterModel
    .findOne(dbQuery)
    .select({ title: 1, content: 1, image: 1, _id: 0 })
    .lean();
};
export const deleteCareerFooterById = async (id: string): Promise<ICareerFooterModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerFooterModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateCareerFooterById = async (
  id: string,
  data: ICareerFooterBody,
): Promise<ICareerFooterModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerFooterModel.findOneAndUpdate(dbQuery, data);
};
export const createCareerFooter = async (
  data: ICareerFooterBody,
): Promise<ICareerFooterModel | null> => {
  return await careerFooterModel.create(data);
};
