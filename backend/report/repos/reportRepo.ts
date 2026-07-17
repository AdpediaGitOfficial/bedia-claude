import { IReportModel } from '../../types/reportTypes';
import reportModel from '../models/reportModel';

export const createReport = async (path: string): Promise<IReportModel | null> => {
  return await reportModel.create({ path });
};

export const fetchLatestReport = async (): Promise<IReportModel | null> => {
  return await reportModel.findOne({ isDeleted: false }).sort({ createdAt: -1 }).select({
    __v: 0,
    isDeleted: 0,
    createdAt: 0,
  });
};
