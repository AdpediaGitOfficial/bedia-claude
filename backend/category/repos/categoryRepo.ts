import { ICategoryModel, ICategoryBody, IGetAllQuery } from '../../types/categoryTypes';
import { ObjectID } from '../../utils/objectIdParser';
import categoryModel from '../models/categoryModel';

export const getCategoriesCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await categoryModel.countDocuments(query);
};
export const fetchAllCategories = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ICategoryModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
    isActive: true,
  };
  return await categoryModel
    .find(dbQuery)
    .select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .skip(skip)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};
export const fetchAllCategoriesForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ICategoryModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await categoryModel
    .find(dbQuery)
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchCategoryById = async (id: string): Promise<ICategoryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await categoryModel
    .findOne(dbQuery)
    .populate('parentId', 'title')
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};

export const fetchCategoryBySlug = async (slug: string): Promise<ICategoryModel | null> => {
  const dbQuery = {
    slug: slug,
    isDeleted: false,
    isActive: true,
  };
  return await categoryModel
    .findOne(dbQuery)
    .populate('parentId', 'title')
    .select({
      isDeleted: 0,
      isActive: 0,
      updatedAt: 0,
      __v: 0,
      createdAt: 0,
      showOnHomepage: 0,
      parentId: 0,
    })
    .lean();
};
export const deleteCategoryById = async (id: string): Promise<ICategoryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await categoryModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const hasChildCategories = async (id: string): Promise<boolean> => {
  const count = await categoryModel.countDocuments({
    parentId: ObjectID(id),
    isDeleted: false,
  });

  return count > 0;
};

export const updateCategoryById = async (
  id: string,
  data: ICategoryBody,
): Promise<ICategoryModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };

  // if (data.showOnHomepage === true) {
  //   // Disable homepage flag for all other categories
  //   await categoryModel.updateMany(
  //     {
  //       _id: { $ne: ObjectID(id) },
  //       showOnHomepage: true,
  //     },
  //     { $set: { showOnHomepage: false } },
  //   );
  // }
  return await categoryModel.findOneAndUpdate(dbQuery, data);
};
export const createCategory = async (data: ICategoryBody): Promise<ICategoryModel | null> => {
  //  Disable homepage flag for all other categories

  // if (data.showOnHomepage === true) {
  //   await categoryModel.updateMany({ showOnHomepage: true }, { $set: { showOnHomepage: false } });
  // }
  return await categoryModel.create(data);
};
