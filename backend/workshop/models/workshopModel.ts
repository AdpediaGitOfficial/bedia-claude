import mongoose, { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { IWorkshopModel } from '../../types/workshopTypes';

const defaultSlotSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  label: { type: String, required: true }, // Morning / Evening
  startTime: { type: String, required: true }, // "10:00"
  endTime: { type: String, required: true }, // "12:00"
  capacity: { type: Number, default: 12 },
});

const workshopOptionSchema = new Schema({
  clayTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clayType',
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  priceDescription: { type: String },
  description: { type: String },
  inclusions: {
    type: [String],
    default: [],
  },
  image: { type: String },
});

const workshopImageSchema = new Schema(
  {
    image: { type: String, required: true },
    title: { type: String },
  },
  { _id: true },
);
const workshopIncludeSchema = new Schema(
  {
    title: { type: String, required: true },
    icon: { type: String },
  },
  { _id: true },
);

const workshopMoreDetailsSchema = new Schema(
  {
    title: { type: String, required: true },
    icon: { type: String },
    description: { type: String },
  },
  { _id: true },
);
const workshopSchema = new Schema<IWorkshopModel>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    bannerImage: { type: String },
    images: [workshopImageSchema],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },

    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    overview: { type: String },
    defaultSlots: [defaultSlotSchema],
    includes: [workshopIncludeSchema],
    moreDetails: [workshopMoreDetailsSchema],
    nonAvailabilityDates: { type: [String], default: [] }, // "2026-01-26"
    nonAvailabilityDays: { type: [String], default: [] }, // "Sunday"

    options: [workshopOptionSchema],

    //faq: { type: [String], default: [] },
    //termsAndConditions: { type: String, default: '' },
    showOnHomepage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    type: { type: String },
    journeyImage: { type: [String], default: [] },
  },
  { timestamps: true },
);

workshopSchema.pre<IWorkshopModel>('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.model<IWorkshopModel>('workshop').exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
    this.slug = slug;
  }
  next();
});

workshopSchema.index({ slug: 1 });
workshopSchema.index({ categoryId: 1 });
workshopSchema.index({ isActive: 1 });

const workshopModel = model<IWorkshopModel>('workshop', workshopSchema);
export default workshopModel;
