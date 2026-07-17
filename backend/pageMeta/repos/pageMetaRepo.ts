import { IPageMetaModel, IPageMetaBody, IGetAllDBQuery } from '../../types/pageMetaTypes';
import { ObjectID } from '../../utils/objectIdParser';
import pageMetaModel from '../models/pageMetaModel';

export const getPageMetasCount = async (query: IGetAllDBQuery): Promise<number> => {
  return await pageMetaModel.countDocuments(query);
};
export const fetchAllPageMetasForAdmin = async (
  query: IGetAllDBQuery,
  skip: number,
  limit: number,
): Promise<IPageMetaModel[]> => {
  return await pageMetaModel
    .find(query)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchPageMetaById = async (id: string): Promise<IPageMetaModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await pageMetaModel
    .findOne(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .lean();
};
export const fetchPageMetaByUrl = async (query: {
  url: string;
  isDeleted: boolean;
}): Promise<IPageMetaModel | null> => {
  return await pageMetaModel
    .findOne(query)
    .select({ _id: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .lean();
};
export const deletePageMetaById = async (id: string): Promise<IPageMetaModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await pageMetaModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updatePageMetaById = async (
  id: string,
  data: IPageMetaBody,
): Promise<IPageMetaModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await pageMetaModel.findOneAndUpdate(dbQuery, data);
};
export const createPageMeta = async (data: IPageMetaBody): Promise<IPageMetaModel | null> => {
  return await pageMetaModel.create(data);
};
