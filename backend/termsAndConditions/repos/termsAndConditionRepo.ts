import slugify from 'slugify';
import {
  ITermsAndConditionModel,
  ITermsAndConditionBody,
  IGetAllQuery,
} from '../../types/termsAndConditionTypes';
import { ObjectID } from '../../utils/objectIdParser';
import termsAndConditionModel from '../models/termsAndConditionModel';

export const getTermsAndConditionsCount = async (query: {
  isDeleted: boolean;
}): Promise<number> => {
  return await termsAndConditionModel.countDocuments(query);
};

export const fetchAllTermsAndConditions = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ITermsAndConditionModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
    isActive: true,
  };
  return await termsAndConditionModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchAllTermsAndConditionsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<ITermsAndConditionModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await termsAndConditionModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchTermsAndConditionById = async (
  id: string,
): Promise<ITermsAndConditionModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await termsAndConditionModel
    .findOne(dbQuery)
    .select({ _id: 0, isDeleted: 0, __v: 0 })
    .lean();
};
export const fetchTermsAndConditionBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<ITermsAndConditionModel | null> => {
  return await termsAndConditionModel
    .findOne(query)
    .select({ _id: 0, isDeleted: 0, __v: 0 })
    .lean();
};
export const fetchTermsAndConditionMetaBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<ITermsAndConditionModel | null> => {
  return await termsAndConditionModel
    .findOne(query)
    .select({ metaTitle: 1, metaDescription: 1, bannerImage: 1, _id: 0 })
    .lean();
};
export const deleteTermsAndConditionById = async (
  id: string,
): Promise<ITermsAndConditionModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await termsAndConditionModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateTermsAndConditionById = async (
  id: string,
  data: ITermsAndConditionBody,
): Promise<ITermsAndConditionModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await termsAndConditionModel.findOneAndUpdate(dbQuery, data);
};
export const createTermsAndCondition = async (
  data: ITermsAndConditionBody,
): Promise<ITermsAndConditionModel | null> => {
  return await termsAndConditionModel.create(data);
};
export const bulkInsertTermsAndConditions = async (
  data: ITermsAndConditionBody[],
): Promise<boolean | null> => {
  const bulkOps = await Promise.all(
    data.map(async (termsAndCondition) => {
      const slug = await generateSlug(termsAndCondition.title);
      return {
        insertOne: {
          document: { ...termsAndCondition, slug },
        },
      };
    }),
  );
  // const newData = data.map((d) => ({ insertOne: { document: d } }));
  await termsAndConditionModel.bulkWrite(bulkOps);
  return true;
};
const generateSlug = async (title: string): Promise<string> => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    replacement: '-', // Replace every special character with hyphen
    remove: /[^a-zA-Z0-9 -]/g, // Remove everything except letters, numbers, and spaces
  });
  let suffix = 1;
  let slug = `${baseSlug}-1`;

  // Check if the slug already exists in the database
  while (await termsAndConditionModel.exists({ slug })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }
  return slug;
};
