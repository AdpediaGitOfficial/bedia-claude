import { Schema, model } from 'mongoose';
import { IBlogModel } from '../../types/blogTypes';
import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new Schema<IBlogModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    bannerImage: { type: String, required: true },
    category: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    slug: { type: String, unique: true },
    writtenBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
// Pre-save hook to generate slug
blogSchema.pre<IBlogModel>('save', async function (next) {
  if (this.isModified('title') || this.isNew) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      replacement: '-', // Replace every special character with hyphen
      remove: /[^a-zA-Z0-9 -]/g, // Remove everything except letters, numbers, and spaces
    });
    let suffix = 1;
    let slug = `${baseSlug}-1`;

    // Check if the slug already exists in the database
    while (await mongoose.model<IBlogModel>('blog').exists({ slug })) {
      suffix++;
      slug = `${baseSlug}-${suffix}`;
    }
    this.slug = slug;
  }
  next();
});

const blogModel = model<IBlogModel>('blog', blogSchema);
export default blogModel;
