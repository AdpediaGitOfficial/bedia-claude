import { Schema, model } from 'mongoose';
import { IJobApplicationModel } from '../../types/jobApplicationTypes';

const jobApplicationSchema = new Schema<IJobApplicationModel>(
  {
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String },
    jobTitle: { type: String, required: true },
    jobSlug: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const jobApplicationModel = model<IJobApplicationModel>('jobApplication', jobApplicationSchema);
export default jobApplicationModel;
