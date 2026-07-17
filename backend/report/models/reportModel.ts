import { Schema, model } from 'mongoose';
import { IReportModel } from '../../types/reportTypes';

const reportsDataSchema = new Schema<IReportModel>(
  {
    path: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const leadModel = model<IReportModel>('reports', reportsDataSchema);
export default leadModel;
