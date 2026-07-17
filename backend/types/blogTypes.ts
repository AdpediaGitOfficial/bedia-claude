import { Document } from 'mongoose';

export interface IBlogModel extends Document {
  title: string;
  content: string;
  category: string;
  bannerImage: string;
  metaTitle: string;
  metaDescription: string;
  writtenBy: string;
  slug: string;
  isDeleted: boolean;
}
export interface IBlogBody {
  title: string;
  content: string;
  category?: string;
  bannerImage: string;
  metaTitle?: string;
  metaDescription?: string;
  writtenBy: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
