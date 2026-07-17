import { IGoogleReviewModel, IGoogleReviewBody, IGetAllQuery } from '../../types/googleReviewTypes';
import { ObjectID } from '../../utils/objectIdParser';
import googleReviewModel from '../models/googleReviewModel';

export const getGoogleReviewsCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await googleReviewModel.countDocuments(query);
};

export const fetchAllGoogleReviews = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IGoogleReviewModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await googleReviewModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchAllGoogleReviewsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IGoogleReviewModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await googleReviewModel
    .find(dbQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchGoogleReviewById = async (id: string): Promise<IGoogleReviewModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await googleReviewModel
    .findOne(dbQuery)
    .select({ _id: 0, isDeleted: 0, createdAt: 0, __v: 0 })
    .lean();
};
export const fetchGoogleReviewBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<IGoogleReviewModel | null> => {
  return await googleReviewModel.findOne(query).select({ _id: 0, isDeleted: 0, __v: 0 }).lean();
};
export const fetchGoogleReviewMetaBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<IGoogleReviewModel | null> => {
  return await googleReviewModel
    .findOne(query)
    .select({ metaTitle: 1, metaDescription: 1, bannerImage: 1, _id: 0 })
    .lean();
};
export const deleteGoogleReviewById = async (id: string): Promise<IGoogleReviewModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await googleReviewModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateGoogleReviewById = async (
  id: string,
  data: IGoogleReviewBody,
): Promise<IGoogleReviewModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await googleReviewModel.findOneAndUpdate(dbQuery, data);
};
export const createGoogleReview = async (
  data: IGoogleReviewBody,
): Promise<IGoogleReviewModel | null> => {
  return await googleReviewModel.create(data);
};

export const upsertGoogleReview = async (data: IGoogleReviewBody): Promise<void> => {
  await googleReviewModel.updateOne(
    {
      authorName: data.authorName,
      reviewTime: data.reviewTime,
    },
    {
      $set: {
        placeId: data.placeId,
        authorName: data.authorName,
        rating: data.rating,
        text: data.text,
        profilePhotoUrl: data.profilePhotoUrl,
        reviewTime: data.reviewTime,
      },
    },
    { upsert: true },
  );
};
