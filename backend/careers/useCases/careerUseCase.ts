import {
  createCareer,
  deleteCareerById,
  fetchAllCareers,
  fetchCareerById,
  getCareersCount,
  updateCareerById,
  fetchCareerBySlug,
  fetchAllCareersForAdmin,
  fetchCareerMetaBySlug,
} from '../repos/careerRepo';
import { ICareerBody, ICareerModel, IGetAllDBQuery, IGetAllQuery } from '../../types/careerTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  createJobApplication,
  fetchAllJobApplications,
  fetchJobApplicationByEmail,
  getJobApplicationsCount,
} from '../repos/jobApplicationRepo';
import {
  IGetAllJobApplicationDBQuery,
  IGetAllJobApplicationQuery,
  IJobApplicationBody,
} from '../../types/jobApplicationTypes';
// import { processAndUploadDocument } from '../../utils/documentUploader';
import { uploadFile } from '../../utils/digitalOceanSpaces';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getAllCareersUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: IGetAllDBQuery = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { jobType: { $regex: search, $options: 'i' } },
      { workingHours: { $regex: search, $options: 'i' } },
    ];
  }

  const totalCount = await getCareersCount(query);
  if (!totalCount) return { totalCount: 0, Careers: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const careers = await fetchAllCareers(query, skip, parseInt(limit));
  return { totalCount, careers };
};

export const getAllCareersForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: IGetAllDBQuery = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [
      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
      { jobType: { $regex: search, $options: 'i' } },
      { workingHours: { $regex: search, $options: 'i' } },
    ];
  }

  const totalCount = await getCareersCount(query);
  if (!totalCount) return { totalCount: 0, Careers: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const careers = await fetchAllCareersForAdmin(query, skip, parseInt(limit));
  return { totalCount, careers };
};

export const createCareerUseCase = async (data: ICareerBody): Promise<boolean> => {
  // check for  unique value duplications
  const career = await createCareer(data);
  if (!career) {
    throw new AppError('Couldn\'t Create new Career. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateCareerByIdUseCase = async (
  id: string,
  data: ICareerBody,
): Promise<ICareerModel> => {
  if (ObjectID(id)) {
    // const existingCareer = await fetchCareerById(id);
    // check for  unique value updations

    const career = await updateCareerById(id, data);
    if (!career) throw new AppError('Couldn\'t update Career', HttpStatus.NOT_FOUND);
    return career;
  }
  throw new AppError('No Career Found', HttpStatus.NOT_FOUND);
};
export const deleteCareerByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const career = await deleteCareerById(id);
    // check for  unique value updations
    if (career) return true;
  }
  throw new AppError('No Career Found', HttpStatus.NOT_FOUND);
};

export const getCareerByIdUseCase = async (query: { _id: string }): Promise<ICareerModel> => {
  if (ObjectID(query._id)) {
    const career = await fetchCareerById(query._id);
    if (career) return career;
  }
  throw new AppError('No Career Found', HttpStatus.NOT_FOUND);
};

export const getCareerBySlugUseCase = async (slug: string): Promise<ICareerModel> => {
  const career = await fetchCareerBySlug({ slug, isDeleted: false });
  if (career) return career;
  throw new AppError('No Career Found', HttpStatus.NOT_FOUND);
};

export const getCareerMetaBySlugUseCase = async (slug: string): Promise<ICareerModel> => {
  const career = await fetchCareerMetaBySlug({ slug, isDeleted: false });
  if (career) return career;
  throw new AppError('No Career Found', HttpStatus.NOT_FOUND);
};

export const createJobApplicationUseCase = async (
  data: IJobApplicationBody,
  resumeFile: Express.Multer.File,
): Promise<boolean> => {
  // check for  unique value duplications
  const { jobSlug, email } = data;

  const validJob = await fetchCareerBySlug({ slug: jobSlug, isDeleted: false });
  if (!validJob) throw new AppError('Invalid Job Application. Try again', HttpStatus.BAD_REQUEST);

  const alreadyApplied = await fetchJobApplicationByEmail({
    email,
    jobSlug,
    isDeleted: false,
  });
  if (alreadyApplied)
    throw new AppError('You have already applied for this job.', HttpStatus.BAD_REQUEST);

  if (!['application/pdf'].includes(resumeFile.mimetype))
    throw new AppError('Unsupported file type', HttpStatus.BAD_REQUEST);
  // const resume = await processAndUploadDocument('resume', resumeFile);
  const filePath = 'uploads/resume/' + uuidv4() + path.extname(resumeFile.originalname);
  await uploadFile(resumeFile.buffer, filePath, resumeFile.mimetype);
  if (!filePath)
    throw new AppError('File upload failed.Please try again', HttpStatus.INTERNAL_SERVER_ERROR);

  const jobApplication = await createJobApplication({ ...data, resume: `/${filePath}` });
  if (!jobApplication) {
    throw new AppError('Couldn\'t Create new job application. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

// export const createJobApplicationUseCase = async (
//   data: IJobApplicationBody,
// ): Promise<boolean> => {
//   // check for  unique value duplications
//   const { jobSlug, email } = data;

//   const validJob = await fetchCareerBySlug({ slug: jobSlug, isDeleted: false });
//   if (!validJob) throw new AppError('Invalid Job Application. Try again', HttpStatus.BAD_REQUEST);

//   const alreadyApplied = await fetchJobApplicationByEmail({
//     email,
//     jobSlug,
//     isDeleted: false,
//   });
//   if (alreadyApplied)
//     throw new AppError('You have already applied for this job.', HttpStatus.BAD_REQUEST);

//   const jobApplication = await createJobApplication(data);
//   if (!jobApplication) {
//     throw new AppError('Couldn\'t Create new job application. Try again', HttpStatus.BAD_REQUEST);
//   }
//   return true;
// };

export const getAllJobApplicationsUseCase = async (
  queryParams: IGetAllJobApplicationQuery,
): Promise<any> => {
  const { page = '1', search, jobSlug } = queryParams;
  const { limit = '10' } = queryParams;
  const query: IGetAllJobApplicationDBQuery = { isDeleted: false };
  if (jobSlug) {
    query.jobSlug = jobSlug;
  }
  if (search && search.length > 0) {
    query['$or'] = [
      { applicantName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const totalCount = await getJobApplicationsCount(query);
  if (!totalCount) return { totalCount: 0, jobApplications: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const jobApplications = await fetchAllJobApplications(query, skip, parseInt(limit));
  return { totalCount, jobApplications };
};
