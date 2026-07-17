import mongoose, { Schema, model } from 'mongoose';
import { IPageMetaModel } from '../../types/pageMetaTypes';
import slugify from 'slugify';

const pageMetaSchema = new Schema<IPageMetaModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    keywords: { type: String, required: true },
    slug: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
// Pre-save hook to generate slug
pageMetaSchema.pre<IPageMetaModel>('save', async function (next) {
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
    while (await mongoose.model<IPageMetaModel>('page-meta').exists({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
    this.slug = slug;
  }
  next();
});

const pageMetaModel = model<IPageMetaModel>('page-meta', pageMetaSchema);
export default pageMetaModel;
