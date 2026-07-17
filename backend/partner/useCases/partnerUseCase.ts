import {
  createPartner,
  deletePartnerById,
  fetchAllPartners,
  fetchAllPartnersForAdmin,
  fetchPartnerById,
  getPartnersCount,
  updatePartnerById,
} from '../repos/partnerRepo';
import { IPartnerBody, IPartnerModel, IGetAllQuery } from '../../types/partnerTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export const getAllPartnersUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ name: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }
  const totalCount = await getPartnersCount(query);

  if (!totalCount) return { totalCount: 0, partners: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const partners = await fetchAllPartners(query, skip, parseInt(limit));
  return { totalCount, partners };
};

export const getAllPartnersForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false }; // Assuming you only want non-deleted documents
  if (search && search.length > 0) {
    query['$or'] = [{ name: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }
  const totalCount = await getPartnersCount(query);

  if (!totalCount) return { totalCount: 0, partners: [] };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const partners = await fetchAllPartnersForAdmin(query, skip, parseInt(limit));
  return { totalCount, partners };
};

export const createPartnerUseCase = async (data: IPartnerBody): Promise<boolean> => {
  // check for  unique value duplications

  const partner = await createPartner(data);
  if (!partner) {
    throw new AppError('Couldn\'t Create new Partner. Try again', HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updatePartnerByIdUseCase = async (
  id: string,
  data: IPartnerBody,
): Promise<IPartnerModel> => {
  if (ObjectID(id)) {
    // const existingPartner = await fetchPartnerById(id);
    // check for  unique value updations

    const partner = await updatePartnerById(id, data);
    if (!partner) throw new AppError('Couldn\'t update Partner', HttpStatus.NOT_FOUND);
    return partner;
  }
  throw new AppError('No Partner Found', HttpStatus.NOT_FOUND);
};
export const deletePartnerByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const partner = await deletePartnerById(id);
    // check for  unique value updations
    if (partner) return true;
  }
  throw new AppError('No Partner Found', HttpStatus.NOT_FOUND);
};

export const getPartnerByIdUseCase = async (query: { _id: string }): Promise<IPartnerModel> => {
  if (ObjectID(query._id)) {
    const partner = await fetchPartnerById(query._id);
    if (partner) return partner;
  }
  throw new AppError('No Partner Found', HttpStatus.NOT_FOUND);
};
