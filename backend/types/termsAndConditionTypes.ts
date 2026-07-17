import { Document } from 'mongoose';

/* ---------------- DB MODEL ---------------- */
export interface ITermsAndConditionModel extends Document {
  title: string;
  content: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITermsAndConditionBody {
  title: string;
  content: string;
  isActive?: boolean;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
  isActive?: string;
}
