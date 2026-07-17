import {
  IGetAllJobApplicationDBQuery,
  IJobApplicationBody,
  IJobApplicationModel,
} from '../../types/jobApplicationTypes';
import jobApplicationModel from '../models/jobApplicationModel';

export const getJobApplicationsCount = async (
  query: IGetAllJobApplicationDBQuery,
): Promise<number> => {
  return await jobApplicationModel.countDocuments(query);
};
export const fetchAllJobApplications = async (
  query: IGetAllJobApplicationDBQuery,
  skip: number,
  limit: number,
): Promise<IJobApplicationModel[]> => {
  return await jobApplicationModel
    .find(query)
    .select({
      isDeleted: 0,
      coverLetter: 0,
      updatedAt: 0,
      __v: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchJobApplicationByEmail = async (query: {
  email: string;
  isDeleted: boolean;
  jobSlug: string;
}): Promise<IJobApplicationModel | null> => {
  return await jobApplicationModel.findOne(query).select({ _id: 1 }).lean();
};
export const createJobApplication = async (
  data: IJobApplicationBody,
): Promise<IJobApplicationModel | null> => {
  return await jobApplicationModel.create(data);
};
