import { Document } from 'mongoose';

export interface IClayTypeModel extends Document {
  title: string;
  image?: string[];
  description?: string;
  isDeleted: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  shortDescription?: string;
}

export interface IClayTypeBody {
  title: string;
  image?: string[];
  description?: string;
  shortDescription?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
  parentId?: string;
}
