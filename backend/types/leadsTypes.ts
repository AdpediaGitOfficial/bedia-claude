import { Document } from 'mongoose';

export interface ILeadsModel extends Document {
  userName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  propertyType: string;
  propertySlug?: string;
  message?: string;
  preferredArea?: string;
  idealBudget?: string;
  bedrooms?: string;
  userType?: string;
  expectedPurchaseTime?: string;
  preferredContactMethod?: string;
  preferredContactTime?: string;
  preferredDate?: string;
  propertyIdentifier?: string;
  propertyAddress?: string;
  leadType?: string;
  isDeleted: boolean;
}

export interface ILeadsBody {
  userName: string;
  email: string;
  phone: string;
  preferredLanguage?: string;
  propertyType: string;
  propertySlug: string;
  leadType: string;
  message?: string;
  preferredDate?: string;
  propertyIdentifier?: string;
}
export interface IReportLeadsBody {
  userName: string;
  email: string;
  phone: string;
  leadType: string;
  preferredLanguage: string;
  propertyIdentifier: string;
}

export interface IListPropertyLeadsBody {
  userName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  propertyAddress: string;
  propertyType: string;
  leadType: string;
  bedrooms: string;
  message: string;
}

export interface IQuestionnaireBody {
  userName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  propertyType: string;
  leadType: string;
  // property type, area preferred,  ideal budget, bedrooms, user type, expected time, communication preferred, preferred time,  name , email , phone, language
  preferredArea: string;
  idealBudget: string;
  bedrooms: string;
  userType: string;
  expectedPurchaseTime: string;
  preferredContactMethod: string;
  preferredContactTime: string;
}

export interface IGetAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: string;
}

export interface ILeadsGetDBQuery {
  isDeleted: boolean;
  $or?: {
    userName?: { $regex: string; $options: string };
    preferredLanguage?: { $regex: string; $options: string };
    propertyType?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
  updatedAt?: { $gte: Date; $lte: Date };
  leadType?: string;
}

export interface IGetByDateQuery {
  startDate: string;
  endDate: string;
  leadType?: string;
}

export interface ICreateLeadQuery {
  download?: 'floorplan' | 'brochure' | 'report';
}
export interface IBaseLeadModel extends Document {
  [key: string]: any;
}
