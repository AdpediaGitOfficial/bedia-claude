import { Document } from 'mongoose';

export interface IPartnerModel extends Document {
  name: string;
  logo: string;
  websiteUrl: string;
  isDeleted: boolean;
}
export interface IPartnerBody {
  name: string;
  logo: string;
  websiteUrl: string;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
