import {
  createGallery,
  deleteGalleryById,
  fetchAllGalleries,
  fetchGalleryById,
  getGalleriesCount,
  updateGalleryById,
  fetchAllGalleriesForAdmin,
} from '../repos/galleryRepo';
import { IGalleryBody, IGalleryModel, IGetAllQuery } from '../../types/galleryTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllGalleriesUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const totalCount = await getGalleriesCount(query);
  if (!totalCount) return { totalCount: 0, galleries: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const galleries = await fetchAllGalleries(query, skip, parseInt(limit));
  return { totalCount, galleries };
};
export const getAllGalleriesForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const totalCount = await getGalleriesCount(query);
  if (!totalCount) return { totalCount: 0, galleries: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const galleries = await fetchAllGalleriesForAdmin(query, skip, parseInt(limit));
  return { totalCount, galleries };
};

export const createGalleryUseCase = async (data: IGalleryBody): Promise<boolean> => {
  // check for  unique value duplications
  const gallery = await createGallery(data);
  if (!gallery) {
    throw new AppError('Couldn\'t Create new Gallery. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateGalleryByIdUseCase = async (
  id: string,
  data: IGalleryBody,
): Promise<IGalleryModel> => {
  if (ObjectID(id)) {
    // const existingGallery = await fetchGalleryById(id);
    // check for  unique value updations

    const gallery = await updateGalleryById(id, data);
    if (!gallery) throw new AppError('Couldn\'t update Gallery', HttpStatus.NOT_FOUND);
    return gallery;
  }
  throw new AppError('No Gallery Found', HttpStatus.NOT_FOUND);
};
export const deleteGalleryByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const gallery = await deleteGalleryById(id);
    // check for  unique value updations
    if (gallery) return true;
  }
  throw new AppError('No Gallery Found', HttpStatus.NOT_FOUND);
};

export const getGalleryByIdUseCase = async (query: { _id: string }): Promise<IGalleryModel> => {
  if (ObjectID(query._id)) {
    const gallery = await fetchGalleryById(query._id);
    if (gallery) return gallery;
  }
  throw new AppError('No Gallery Found', HttpStatus.NOT_FOUND);
};
