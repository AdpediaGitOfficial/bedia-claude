import mongoose, { Schema, Document, Types } from 'mongoose';
import slugify from 'slugify';
import { Community } from '../../types/communityTypes';

export interface CommunityDocument extends Omit<Community, '_id'>, Document {
  _id: Types.ObjectId;
  slug: string;
}

const PropertyFeatureSchema = new Schema({
  image: { type: String, required: true },
  heading: { type: String, required: true },
  description: { type: String, required: true },
});

const NewLaunchProjectSchema = new Schema(
  {
    image: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    bedrooms: { type: String, required: true },
    shortTitle: { type: String, required: true },
    brochure: { type: String },
    paymentPlan: { type: String },
    highlightTitle: { type: String, required: true },
    highlightDescription: { type: String, required: true },
    bannerImage: { type: String },
    slug: { type: String, unique: true, index: true },
    floorPlan: { type: String },
  },
  { timestamps: true },
);

const TimeBasedLocationSchema = new Schema({
  time: { type: String, required: true },
  location: { type: String, required: true },
});

const NearbyCommunitySchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const CommunitySchema = new Schema<CommunityDocument>(
  {
    title: { type: String, required: true },
    shortTitle: { type: String },
    shortDescription: { type: String },
    developer: { type: String },
    bannerImage: { type: String },
    propertyImage: { type: String },
    propertyImages: [{ type: String }],
    brochure: { type: String },
    aboutCommunityTitle: { type: String },
    aboutCommunityDescription: { type: String },
    communityImage: { type: String },
    bedrooms: { type: Number },
    paymentPlan: { type: String },
    startingPrice: { type: Number },
    communityFloorPlan: { type: String },
    propertyFeatures: [PropertyFeatureSchema],
    timeBasedLocations: [TimeBasedLocationSchema],
    nearbyCommunities: [NearbyCommunitySchema],
    newLaunchProjects: [NewLaunchProjectSchema],
    slug: { type: String, unique: true, index: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ✅ Pre-save hook for slug generation
CommunitySchema.pre<CommunityDocument>('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      replacement: '-',
      remove: /[^a-zA-Z0-9 -]/g,
    });

    let slug = baseSlug;
    let suffix = 1;

    // ✅ Ensure uniqueness
    while (await mongoose.model('Community').exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    this.slug = slug;
  }
  if (this.newLaunchProjects && this.newLaunchProjects.length > 0) {
    for (const project of this.newLaunchProjects) {
      if (!project.slug && project.shortTitle) {
        const baseSlug = slugify(project.shortTitle, {
          lower: true,
          strict: true,
          replacement: '-',
          remove: /[^a-zA-Z0-9 -]/g,
        });

        let slug = baseSlug;
        let suffix = 1;

        while (
          await mongoose.model('Community').exists({
            'newLaunchProjects.slug': slug,
          })
        ) {
          slug = `${baseSlug}-${suffix}`;
          suffix++;
        }

        project.slug = slug;
      }
    }
  }

  next();
});

export const CommunityModel =
  mongoose.models.Community || mongoose.model<CommunityDocument>('Community', CommunitySchema);
