import mongoose, { Schema, model } from 'mongoose';
import { ICareerModel } from '../../types/careerTypes';
import slugify from 'slugify';

const careerSchema = new Schema<ICareerModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    responsibilities: { type: String },
    roleSummary: { type: String },
    requirements: { type: String },
    jobType: { type: String, required: true, enum: ['Remote', 'Hybrid', 'In Person'] },
    workingHours: { type: String, required: true, enum: ['Full Time', 'Part Time'] },
    slug: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
// Pre-save hook to generate slug
careerSchema.pre<ICareerModel>('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      replacement: '-', // Replace every special character with hyphen
      remove: /[^a-zA-Z0-9 -]/g, // Remove everything except letters, numbers, and spaces
    });
    let slug = baseSlug;
    let suffix = 1;

    // Check if the slug already exists in the database
    while (await mongoose.model<ICareerModel>('career').exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
    this.slug = slug;
  }
  next();
});

const careerModel = model<ICareerModel>('career', careerSchema);
export default careerModel;
