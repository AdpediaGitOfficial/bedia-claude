import { ICareerModel, ICareerBody, IGetAllDBQuery } from '../../types/careerTypes';
import { ObjectID } from '../../utils/objectIdParser';
import careerModel from '../models/careerModel';

export const getCareersCount = async (query: IGetAllDBQuery): Promise<number> => {
  return await careerModel.countDocuments(query);
};
export const fetchAllCareers = async (
  query: IGetAllDBQuery,
  skip: number,
  limit: number,
): Promise<ICareerModel[]> => {
  return await careerModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
};
export const fetchAllCareersForAdmin = async (
  query: IGetAllDBQuery,
  skip: number,
  limit: number,
): Promise<ICareerModel[]> => {
  return await careerModel
    .find(query)
    .select({
      isDeleted: 0,
      responsibilities: 0,
      requirements: 0,
      updatedAt: 0,
      __v: 0,
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchCareerById = async (id: string): Promise<ICareerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerModel
    .findOne(dbQuery)
    .select({ _id: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, slug: 0, __v: 0 })
    .lean();
};
export const fetchCareerBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<ICareerModel | null> => {
  return await careerModel
    .findOne(query)
    .select({ _id: 0, isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};
export const fetchCareerMetaBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<ICareerModel | null> => {
  return await careerModel.findOne(query).select({ _id: 0, title: 1, description: 1 }).lean();
};
export const deleteCareerById = async (id: string): Promise<ICareerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};

export const updateCareerById = async (
  id: string,
  data: ICareerBody,
): Promise<ICareerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await careerModel.findOneAndUpdate(dbQuery, data);
};

export const createCareer = async (data: ICareerBody): Promise<ICareerModel | null> => {
  return await careerModel.create(data);
};
