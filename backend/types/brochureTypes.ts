import { Document } from 'mongoose';

export interface IBrochureModel extends Document {
  title: string;
  isDeleted: boolean;
  isActive: boolean;
  fileUrl?: string;
  description?: string;
}
export interface IBrochureBody {
  title: string;
  fileUrl?: string;
  description?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
