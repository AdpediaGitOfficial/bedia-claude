import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createBlogUseCase,
  deleteBlogByIdUseCase,
  fetchBlogFromXmlUseCase,
  getAllBlogsForAdminUseCase,
  getAllBlogsUseCase,
  getBlogByIdUseCase,
  getBlogBySlugUseCase,
  getBlogMetaBySlugUseCase,
  updateBlogByIdUseCase,
} from '../useCases/blogUseCase';
import { IBlogBody } from '../../types/blogTypes';

export const getAllBlogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const blogs = await getAllBlogsUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Blogs successfully',
    result: blogs,
  });
});

export const getAllBlogsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const blogs = await getAllBlogsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Blogs successfully',
      result: blogs,
    });
  },
);

export const createBlog = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IBlogBody;
  await createBlogUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Blog successfully',
    result: true,
  });
});

export const fetchFromXml = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
    return;
  }
  const data = await fetchBlogFromXmlUseCase(req.files as Express.Multer.File[]);
  res.status(200).json({
    success: true,
    message: 'Fetched Blogs successfully',
    result: data,
  });
});

export const updateBlogById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as IBlogBody;
  await updateBlogByIdUseCase(id, data);
  res.status(200).json({
    success: true,
    message: 'Updated Blog successfully',
    result: true,
  });
});

export const deleteBlogById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteBlogByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: 'Deleted Blog successfully',
    result: true,
  });
});

export const getBlogById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const blog = await getBlogByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Blog successfully',
    result: blog,
  });
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const blog = await getBlogBySlugUseCase(slug);
  res.status(200).json({
    success: true,
    message: 'Fetched Blog successfully',
    result: blog,
  });
});

export const getBlogMetaBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const blog = await getBlogMetaBySlugUseCase(slug);
    res.status(200).json({
      success: true,
      message: 'Fetched meta data successfully',
      result: blog,
    });
  },
);
