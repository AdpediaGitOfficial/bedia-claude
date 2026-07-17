import { Document } from 'mongoose';

export interface ITestimonialModel extends Document {
  content: string;
  author: string;
  designation?: string;
  authorImage?: string;
  isDeleted: boolean;
}
export interface ITestimonialBody {
  content: string;
  author: string;
  designation?: string;
  authorImage?: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
