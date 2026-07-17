import {
  createGoogleReview,
  deleteGoogleReviewById,
  fetchAllGoogleReviews,
  fetchAllGoogleReviewsForAdmin,
  fetchGoogleReviewById,
  fetchGoogleReviewBySlug,
  fetchGoogleReviewMetaBySlug,
  getGoogleReviewsCount,
  updateGoogleReviewById,
  upsertGoogleReview,
} from '../repos/googleReviewRepo';
import { IGoogleReviewBody, IGoogleReviewModel, IGetAllQuery } from '../../types/googleReviewTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { fetchGoogleReviewsFromAPI } from '../../services/googleReviewFetch.service';

export const syncGoogleReviewsUseCase = async (): Promise<boolean> => {
  const reviews = await fetchGoogleReviewsFromAPI();

  if (!reviews?.length) return true;

  for (const review of reviews) {
    const payload: IGoogleReviewBody = {
      placeId: process.env.GOOGLE_PLACE_ID as string,
      reviewId: review.review_id,
      authorName: review.author_name,
      rating: review.rating,
      text: review.text,
      profilePhotoUrl: review.profile_photo_url,
      reviewTime: review.time,
    };

    await upsertGoogleReview(payload);
  }

  return true;
};

export const getAllGoogleReviewsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getGoogleReviewsCount(query);

  if (!totalCount) return { totalCount: 0, googleReviews: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const googleReviews = await fetchAllGoogleReviews(query, skip, parseInt(limit));
  return { totalCount, googleReviews };
};

export const getAllGoogleReviewsForAdminUseCase = async (
  queryParams: IGetAllQuery,
): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { authorName: { $regex: search, $options: 'i' } }, // Case-insensitive search
    ];
  }
  const totalCount = await getGoogleReviewsCount(query);

  if (!totalCount) return { totalCount: 0, googleReviews: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const googleReviews = await fetchAllGoogleReviewsForAdmin(query, skip, parseInt(limit));
  return { totalCount, googleReviews };
};

export const createGoogleReviewUseCase = async (data: IGoogleReviewBody): Promise<boolean> => {
  // Reviews created through this endpoint are entered by an admin, not pulled
  // from the Google sync (which uses upsertGoogleReview). Default them to
  // 'manual' so they are distinguishable from synced Google reviews; honour an
  // explicit source if one was provided.
  const payload: IGoogleReviewBody = {
    ...data,
    source: data.source || 'manual',
  };

  const googleReview = await createGoogleReview(payload);
  if (!googleReview) {
    throw new AppError('Couldn\'t Create new GoogleReview. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateGoogleReviewByIdUseCase = async (
  id: string,
  data: IGoogleReviewBody,
): Promise<IGoogleReviewModel> => {
  if (ObjectID(id)) {
    // const existingGoogleReview = await fetchGoogleReviewById(id);
    // check for  unique value updations

    const googleReview = await updateGoogleReviewById(id, data);
    if (!googleReview) throw new AppError('Couldn\'t update GoogleReview', HttpStatus.NOT_FOUND);
    return googleReview;
  }
  throw new AppError('No GoogleReview Found', HttpStatus.NOT_FOUND);
};
export const deleteGoogleReviewByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const googleReview = await deleteGoogleReviewById(id);
    // check for  unique value updations
    if (googleReview) return true;
  }
  throw new AppError('No GoogleReview Found', HttpStatus.NOT_FOUND);
};

export const getGoogleReviewByIdUseCase = async (query: {
  _id: string;
}): Promise<IGoogleReviewModel> => {
  if (ObjectID(query._id)) {
    const googleReview = await fetchGoogleReviewById(query._id);
    if (googleReview) return googleReview;
  }
  throw new AppError('No GoogleReview Found', HttpStatus.NOT_FOUND);
};

export const getGoogleReviewBySlugUseCase = async (slug: string): Promise<IGoogleReviewModel> => {
  const googleReview = await fetchGoogleReviewBySlug({ slug, isDeleted: false });
  if (googleReview) return googleReview;

  throw new AppError('No GoogleReview Found', HttpStatus.NOT_FOUND);
};

export const getGoogleReviewMetaBySlugUseCase = async (
  slug: string,
): Promise<IGoogleReviewModel> => {
  const googleReview = await fetchGoogleReviewMetaBySlug({ slug, isDeleted: false });
  if (googleReview) return googleReview;

  throw new AppError('No GoogleReview Found', HttpStatus.NOT_FOUND);
};
