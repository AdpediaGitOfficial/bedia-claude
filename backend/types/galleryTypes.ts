import { Document } from 'mongoose';

export interface IGalleryModel extends Document {
  title: string;
  isDeleted: boolean;
  isActive: boolean;
  images: string[];
  description?: string;
}
export interface IGalleryBody {
  title: string;
  images: string[];
  description?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
