import { Document } from 'mongoose';

export interface ICareerFooterModel extends Document {
  title: string;
  content: string;
  image: string;
  isDeleted: boolean;
}
export interface ICareerFooterBody {
  title: string;
  content: string;
  image: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
