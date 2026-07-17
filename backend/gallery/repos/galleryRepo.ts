import { IGalleryModel, IGalleryBody, IGetAllQuery } from '../../types/galleryTypes';
import { ObjectID } from '../../utils/objectIdParser';
import galleryModel from '../models/galleryModel';

export const getGalleriesCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await galleryModel.countDocuments(query);
};
export const fetchAllGalleries = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IGalleryModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await galleryModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchAllGalleriesForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IGalleryModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await galleryModel
    .find(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchGalleryById = async (id: string): Promise<IGalleryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await galleryModel.findOne(dbQuery).select({ isDeleted: 0, updatedAt: 0, __v: 0 }).lean();
};
export const deleteGalleryById = async (id: string): Promise<IGalleryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await galleryModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateGalleryById = async (
  id: string,
  data: IGalleryBody,
): Promise<IGalleryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await galleryModel.findOneAndUpdate(dbQuery, data);
};
export const createGallery = async (data: IGalleryBody): Promise<IGalleryModel | null> => {
  return await galleryModel.create(data);
};
