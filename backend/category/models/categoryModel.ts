import mongoose, { Schema, model, Types } from 'mongoose';
import { ICategoryModel } from '../../types/categoryTypes';
import slugify from 'slugify';

const categorySchema = new Schema<ICategoryModel>(
  {
    title: { type: String, required: true },
    image: [{ type: String }],
    description: { type: String },
    shortDescription: { type: String },
    parentId: {
      type: Types.ObjectId,
      ref: 'category',
      default: null, // null = main category
    },
    showOnHomepage: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true },
);

categorySchema.pre<ICategoryModel>('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.model<ICategoryModel>('category').exists({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

categorySchema.index({ slug: 1 });

const categoryModel = model<ICategoryModel>('category', categorySchema);
export default categoryModel;
