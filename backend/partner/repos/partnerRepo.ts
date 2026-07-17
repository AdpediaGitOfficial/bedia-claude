import { IPartnerModel, IPartnerBody, IGetAllQuery } from '../../types/partnerTypes';
import { ObjectID } from '../../utils/objectIdParser';
import partnerModel from '../models/partnerModel';

export const getPartnersCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await partnerModel.countDocuments(query);
};
export const fetchAllPartners = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IPartnerModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await partnerModel
    .find(dbQuery)
    .select({ name: 1, logo: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchAllPartnersForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IPartnerModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await partnerModel
    .find(dbQuery)
    .select({ isDeleted: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchPartnerById = async (id: string): Promise<IPartnerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await partnerModel
    .findOne(dbQuery)
    .select({ name: 1, logo: 1, websiteUrl: 1, _id: 0 })
    .lean();
};
export const deletePartnerById = async (id: string): Promise<IPartnerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await partnerModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
export const updatePartnerById = async (
  id: string,
  data: IPartnerBody,
): Promise<IPartnerModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await partnerModel.findOneAndUpdate(dbQuery, data);
};
export const createPartner = async (data: IPartnerBody): Promise<IPartnerModel | null> => {
  return await partnerModel.create(data);
};
