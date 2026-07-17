import { Document } from 'mongoose';

export interface ICareerModel extends Document {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  roleSummary?: string;
  jobType: 'Remote' | 'Hybrid' | 'In Person';
  workingHours: 'Full Time' | 'Part Time';
  slug: string;
  isDeleted: boolean;
  isActive: boolean;
}
export interface ICareerBody {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  roleSummary?: string;
  jobType: 'Remote' | 'Hybrid' | 'In Person';
  workingHours: 'Full Time' | 'Part Time';
  isActive: boolean;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface IGetAllDBQuery {
  isDeleted: boolean;
  $or?: {
    title?: { $regex: string; $options: string };
    jobType?: { $regex: string; $options: string };
    workingHours?: { $regex: string; $options: string };
  }[];
}
