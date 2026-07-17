import {
  createPageMeta,
  deletePageMetaById,
  fetchPageMetaById,
  getPageMetasCount,
  updatePageMetaById,
  fetchPageMetaByUrl,
  fetchAllPageMetasForAdmin,
} from '../repos/pageMetaRepo';
import {
  IPageMetaBody,
  IPageMetaModel,
  IGetAllDBQuery,
  IGetAllQuery,
} from '../../types/pageMetaTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllPageMetasForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: IGetAllDBQuery = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { description: { $regex: search, $options: 'i' } },
      { keywords: { $regex: search, $options: 'i' } },
    ];
  }

  const totalCount = await getPageMetasCount(query);
  if (!totalCount) return { totalCount: 0, metaDatas: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const metaDatas = await fetchAllPageMetasForAdmin(query, skip, parseInt(limit));
  return { totalCount, metaDatas };
};

export const createPageMetaUseCase = async (data: IPageMetaBody): Promise<boolean> => {
  // check for  unique value duplications
  const metaData = await createPageMeta(data);
  if (!metaData) {
    throw new AppError('Couldn\'t Create new meta data. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updatePageMetaByIdUseCase = async (
  id: string,
  data: IPageMetaBody,
): Promise<IPageMetaModel> => {
  if (ObjectID(id)) {
    // const existingPageMeta = await fetchPageMetaById(id);
    // check for  unique value updations

    const metaData = await updatePageMetaById(id, data);
    if (!metaData) throw new AppError('Couldn\'t update PageMeta', HttpStatus.NOT_FOUND);
    return metaData;
  }
  throw new AppError('No meta data Found', HttpStatus.NOT_FOUND);
};
export const deletePageMetaByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const metaData = await deletePageMetaById(id);
    // check for  unique value updations
    if (metaData) return true;
  }
  throw new AppError('No meta data Found', HttpStatus.NOT_FOUND);
};

export const getPageMetaByIdUseCase = async (query: { _id: string }): Promise<IPageMetaModel> => {
  if (ObjectID(query._id)) {
    const metaData = await fetchPageMetaById(query._id);
    if (metaData) return metaData;
  }
  throw new AppError('No meta data Found', HttpStatus.NOT_FOUND);
};

export const getPageMetaByUrlUseCase = async (url: string): Promise<IPageMetaModel> => {
  const metaData = await fetchPageMetaByUrl({ url, isDeleted: false });
  if (metaData) return metaData;
  throw new AppError('No meta data Found', HttpStatus.NOT_FOUND);
};
