import { ITestimonialModel, ITestimonialBody, IGetAllQuery } from '../../types/testimonialTypes';
import { ObjectID } from '../../utils/objectIdParser';
import testimonialModel from '../models/testimonialModel';

export const getTestimonialsCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await testimonialModel.countDocuments(query);
};

export const fetchAllTestimonials = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ITestimonialModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await testimonialModel
    .find(dbQuery)
    .select({ _id: 0, isDeleted: 0, createdAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchAllTestimonialsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ITestimonialModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await testimonialModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchTestimonialById = async (id: string): Promise<ITestimonialModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await testimonialModel
    .findOne(dbQuery)
    .select({ content: 1, author: 1, designation: 1, authorImage: 1, _id: 0 })
    .lean();
};
export const deleteTestimonialById = async (id: string): Promise<ITestimonialModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await testimonialModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateTestimonialById = async (
  id: string,
  data: ITestimonialBody,
): Promise<ITestimonialModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await testimonialModel.findOneAndUpdate(dbQuery, data);
};
export const createTestimonial = async (
  data: ITestimonialBody,
): Promise<ITestimonialModel | null> => {
  return await testimonialModel.create(data);
};
