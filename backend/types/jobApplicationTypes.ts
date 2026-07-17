import { Document } from 'mongoose';

export interface IJobApplicationModel extends Document {
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  jobTitle: string;
  jobSlug: string;
  isDeleted: boolean;
}
export interface IJobApplicationBody {
  applicantName: string;
  email: string;
  phone: string;
  resume?: string;
  coverLetter?: string;
  jobTitle: string;
  jobSlug: string;
}

export interface IGetAllJobApplicationQuery {
  page?: string;
  limit?: string;
  search?: string;
  jobSlug?: string;
}

export interface IGetAllJobApplicationDBQuery {
  isDeleted: boolean;
  jobSlug?: string;
  $or?: {
    jobTitle?: { $regex: string; $options: string };
    applicantName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }[];
}
