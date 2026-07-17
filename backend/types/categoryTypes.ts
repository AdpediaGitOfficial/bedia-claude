import { Document, Types } from 'mongoose';

export interface ICategoryModel extends Document {
  title: string;
  image?: string[];
  description?: string;
  parentId?: Types.ObjectId | null;
  isDeleted: boolean;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  shortDescription?: string;
  slug: string;
}

export interface ICategoryBody {
  title: string;
  image?: string[];
  description?: string;
  parentId?: string | null;
  showOnHomepage?: boolean;
  shortDescription?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
  parentId?: string;
}
