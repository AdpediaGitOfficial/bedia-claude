import { IFaqModel, IFaqBody, IGetAllQuery } from '../../types/faqTypes';
import { ObjectID } from '../../utils/objectIdParser';
import faqModel from '../models/faqModel';

export const getFaqsCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await faqModel.countDocuments(query);
};

export const fetchAllFaqs = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IFaqModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await faqModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchAllFaqsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IFaqModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await faqModel
    .find(dbQuery)
    .select({ _id: 1, question: 1, category: 1, answer: 1, isActive: 1 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchFaqById = async (id: string): Promise<IFaqModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await faqModel.findOne(dbQuery).select({ _id: 0, isDeleted: 0, __v: 0 }).lean();
};

export const deleteFaqById = async (id: string): Promise<IFaqModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await faqModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateFaqById = async (id: string, data: IFaqBody): Promise<IFaqModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await faqModel.findOneAndUpdate(dbQuery, data);
};
export const createFaq = async (data: IFaqBody): Promise<IFaqModel | null> => {
  return await faqModel.create(data);
};
