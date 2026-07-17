import {
  bulkInsertBlogs,
  createBlog,
  deleteBlogById,
  fetchAllBlogs,
  fetchAllBlogsForAdmin,
  fetchBlogById,
  fetchBlogBySlug,
  fetchBlogMetaBySlug,
  getBlogsCount,
  updateBlogById,
} from '../repos/blogRepo';
import { IBlogBody, IBlogModel, IGetAllQuery } from '../../types/blogTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import xml2js from 'xml2js';
import logger from '../../config/logger';

export const getAllBlogsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getBlogsCount(query);

  if (!totalCount) return { totalCount: 0, blogs: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const blogs = await fetchAllBlogs(query, skip, parseInt(limit));
  return { totalCount, blogs };
};

export const getAllBlogsForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  const totalCount = await getBlogsCount(query);

  if (!totalCount) return { totalCount: 0, blogs: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const blogs = await fetchAllBlogsForAdmin(query, skip, parseInt(limit));
  return { totalCount, blogs };
};

export const createBlogUseCase = async (data: IBlogBody): Promise<boolean> => {
  // check for  unique value duplications

  const blog = await createBlog(data);
  if (!blog) {
    throw new AppError('Couldn\'t Create new Blog. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const fetchBlogFromXmlUseCase = async (files: Express.Multer.File[]): Promise<boolean> => {
  for (const file of files) {
    if (!file.buffer) {
      logger.error('File buffer is undefined');
      throw new AppError('File buffer is undefined', HttpStatus.BAD_REQUEST);
    }
    logger.info('Processing  xml file');
    try {
      // Read the uploaded XML file from the buffer
      const xmlData = file.buffer.toString('utf8');

      // Parse the XML data
      xml2js.parseString(xmlData, async (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
          throw new AppError('Invalid XML format', HttpStatus.BAD_REQUEST);
        }

        // XML successfully parsed to JavaScript object
        // response = result.rss.channel[0].item[4];

        const blogData = result.rss.channel[0].item;
        const newBlogs: IBlogBody[] = blogData
          .map((item: any) => {
            const categoryString =
              item.category && item.category.map((category: any) => category['_']).join(', ');

            const metaDescriptionExist = item['wp:postmeta'].filter(
              (meta: any) => meta['wp:meta_key'][0] === 'post_content',
            );
            const metaDescription =
              metaDescriptionExist && metaDescriptionExist.length > 0
                ? metaDescriptionExist[0]['wp:meta_value'][0]
                : '';

            const content = item['content:encoded'][0];
            if (content) {
              return {
                title: item.title[0],
                content,
                bannerImage: '/uploads/blogs/e12e16f8-5010-4754-b10d-76d432421977.png', // May provide a static banner image here...
                category: categoryString || 'General',
                metaTitle: item['wp:post_name'][0],
                metaDescription: metaDescription || 'sample description',
                createdAt: new Date(item.pubDate[0]),
                updatedAt: new Date(item.pubDate[0]),
              };
            }

            return null; // Return null explicitly if content is falsy
          })
          .filter((blog: IBlogBody | null) => blog !== null); // Filter out null values
        logger.info('Processed xml file');

        await bulkInsertBlogs(newBlogs);
        logger.info('bulk inserted blog data to db');
        // No need to delete files since they are in memory
      });
    } catch (err) {
      logger.error('Error processing file:', err);
      throw new AppError('Error processing file', HttpStatus.BAD_REQUEST);
    }
  }

  return true;
};

export const updateBlogByIdUseCase = async (id: string, data: IBlogBody): Promise<IBlogModel> => {
  if (ObjectID(id)) {
    // const existingBlog = await fetchBlogById(id);
    // check for  unique value updations

    const blog = await updateBlogById(id, data);
    if (!blog) throw new AppError('Couldn\'t update Blog', HttpStatus.NOT_FOUND);
    return blog;
  }
  throw new AppError('No Blog Found', HttpStatus.NOT_FOUND);
};
export const deleteBlogByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const blog = await deleteBlogById(id);
    // check for  unique value updations
    if (blog) return true;
  }
  throw new AppError('No Blog Found', HttpStatus.NOT_FOUND);
};

export const getBlogByIdUseCase = async (query: { _id: string }): Promise<IBlogModel> => {
  if (ObjectID(query._id)) {
    const blog = await fetchBlogById(query._id);
    if (blog) return blog;
  }
  throw new AppError('No Blog Found', HttpStatus.NOT_FOUND);
};

export const getBlogBySlugUseCase = async (slug: string): Promise<IBlogModel> => {
  const blog = await fetchBlogBySlug({ slug, isDeleted: false });
  if (blog) return blog;

  throw new AppError('No Blog Found', HttpStatus.NOT_FOUND);
};

export const getBlogMetaBySlugUseCase = async (slug: string): Promise<IBlogModel> => {
  const blog = await fetchBlogMetaBySlug({ slug, isDeleted: false });
  if (blog) return blog;

  throw new AppError('No Blog Found', HttpStatus.NOT_FOUND);
};
