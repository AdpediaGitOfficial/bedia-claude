import { Document } from 'mongoose';

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface IPageMetaBody {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
}
export interface IGetAllDBQuery {
  isDeleted: boolean;
  $or?: {
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    keywords?: { $regex: string; $options: string };
  }[];
}

export interface IPageMetaModel extends Document {
  title: string;
  description: string;
  image: string;
  keywords: string;
  url: string;
  slug: string;
  isDeleted: boolean;
}
