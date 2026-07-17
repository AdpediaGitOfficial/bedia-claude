import {
  createCategory,
  deleteCategoryById,
  fetchAllCategories,
  fetchCategoryById,
  getCategoriesCount,
  updateCategoryById,
  fetchAllCategoriesForAdmin,
  hasChildCategories,
} from '../repos/categoryRepo';
import { ICategoryBody, ICategoryModel, IGetAllQuery } from '../../types/categoryTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllCategoriesUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const totalCount = await getCategoriesCount(query);
  if (!totalCount) return { totalCount: 0, categories: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const categories = await fetchAllCategories(query, skip, parseInt(limit));
  return { totalCount, categories };
};
export const getAllCategoriesForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const totalCount = await getCategoriesCount(query);
  if (!totalCount) return { totalCount: 0, categories: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const categories = await fetchAllCategoriesForAdmin(query, skip, parseInt(limit));
  return { totalCount, categories };
};

export const createCategoryUseCase = async (data: ICategoryBody): Promise<boolean> => {
  // check for  unique value duplications
  const category = await createCategory(data);
  if (!category) {
    throw new AppError('Couldn\'t Create new Category. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateCategoryByIdUseCase = async (
  id: string,
  data: ICategoryBody,
): Promise<ICategoryModel> => {
  if (ObjectID(id)) {
    // const existingCategory = await fetchCategoryById(id);
    // check for  unique value updations

    const category = await updateCategoryById(id, data);
    if (!category) throw new AppError('Couldn\'t update Category', HttpStatus.NOT_FOUND);
    return category;
  }
  throw new AppError('No Category Found', HttpStatus.NOT_FOUND);
};

// export const deleteCategoryByIdUseCase = async (id: string): Promise<boolean> => {
//   if (ObjectID(id)) {
//     const category = await deleteCategoryById(id);
//     // check for  unique value updations
//     if (category) return true;
//   }
//   throw new AppError('No Category Found', HttpStatus.NOT_FOUND);
// };

export const deleteCategoryByIdUseCase = async (id: string): Promise<boolean> => {
  if (!ObjectID(id)) {
    throw new AppError('Invalid Category ID', HttpStatus.BAD_REQUEST);
  }

  const hasChildren = await hasChildCategories(id);
  if (hasChildren) {
    throw new AppError('Cannot delete. This category has sub-categories.', HttpStatus.BAD_REQUEST);
  }

  //Delete if no children
  const category = await deleteCategoryById(id);
  if (category) return true;

  throw new AppError('No Category Found', HttpStatus.NOT_FOUND);
};

export const getCategoryByIdUseCase = async (query: { _id: string }): Promise<ICategoryModel> => {
  if (ObjectID(query._id)) {
    const category = await fetchCategoryById(query._id);
    if (category) return category;
  }
  throw new AppError('No Category Found', HttpStatus.NOT_FOUND);
};
