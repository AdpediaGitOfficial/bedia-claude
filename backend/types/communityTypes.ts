import { Types } from 'mongoose';

export interface Community {
  _id?: string | Types.ObjectId;
  title: string;
  shortTitle?: string;
  shortDescription?: string;
  developer?: string;
  bannerImage?: string;
  propertyImage?: string;
  propertyImages?: string[];
  communityImage?: string;
  brochure?: string;
  aboutCommunityTitle?: string;
  aboutCommunityDescription?: string;
  bedrooms?: number;
  paymentPlan?: string;
  startingPrice?: string;
  communityFloorPlan?: string;
  propertyFeatures?: {
    image: string;
    heading: string;
    description: string;
  }[];
  newLaunchProjects?: {
    image: string;
    heading: string;
    description: string;
    price: string;
    bedrooms: string;
    shortTitle: string;
    brochure?: string | null;
    paymentPlan?: string | null;
    highlightTitle: string;
    highlightDescription: string;
    bannerImage?: string | null;
    slug?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: Types.ObjectId;
  }[];
  timeBasedLocations?: {
    time: string;
    location: string;
  }[];
  nearbyCommunities?: {
    image: string;
    title: string;
    description: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}
