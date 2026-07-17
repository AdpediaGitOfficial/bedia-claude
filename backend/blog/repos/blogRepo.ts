import slugify from 'slugify';
import { IBlogModel, IBlogBody, IGetAllQuery } from '../../types/blogTypes';
import { ObjectID } from '../../utils/objectIdParser';
import blogModel from '../models/blogModel';

export const getBlogsCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await blogModel.countDocuments(query);
};

export const fetchAllBlogs = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IBlogModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await blogModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchAllBlogsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IBlogModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await blogModel
    .find(dbQuery)
    .select({ _id: 1, title: 1, category: 1, bannerImage: 1, writtenBy: 1 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchBlogById = async (id: string): Promise<IBlogModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await blogModel
    .findOne(dbQuery)
    .select({ _id: 0, isDeleted: 0, createdAt: 0, __v: 0 })
    .lean();
};
export const fetchBlogBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<IBlogModel | null> => {
  return await blogModel.findOne(query).select({ _id: 0, isDeleted: 0, __v: 0 }).lean();
};
export const fetchBlogMetaBySlug = async (query: {
  slug: string;
  isDeleted: boolean;
}): Promise<IBlogModel | null> => {
  return await blogModel
    .findOne(query)
    .select({ metaTitle: 1, metaDescription: 1, bannerImage: 1, _id: 0 })
    .lean();
};
export const deleteBlogById = async (id: string): Promise<IBlogModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await blogModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updateBlogById = async (id: string, data: IBlogBody): Promise<IBlogModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await blogModel.findOneAndUpdate(dbQuery, data);
};
export const createBlog = async (data: IBlogBody): Promise<IBlogModel | null> => {
  return await blogModel.create(data);
};
export const bulkInsertBlogs = async (data: IBlogBody[]): Promise<boolean | null> => {
  const bulkOps = await Promise.all(
    data.map(async (blog) => {
      const slug = await generateSlug(blog.title);
      return {
        insertOne: {
          document: { ...blog, slug },
        },
      };
    }),
  );
  // const newData = data.map((d) => ({ insertOne: { document: d } }));
  await blogModel.bulkWrite(bulkOps);
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
  while (await blogModel.exists({ slug })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }
  return slug;
};
