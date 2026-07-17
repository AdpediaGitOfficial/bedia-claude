import { Document } from 'mongoose';

export interface IFaqModel extends Document {
  question: string;
  answer: string;
  category?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
export interface IFaqBody {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
