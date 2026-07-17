export interface ICommunityPropertyBody {
  image: string;
  heading: string;
  description: string;
  price: number;
  bedrooms: string;
  shortTitle: string;
  brochure?: string | null;
  paymentPlan?: string | null;
  highlightTitle: string;
  highlightDescription: string;
  bannerImage?: string | null;
  slug?: string | null;
  floorPlan?: string | null;
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  order?: string;
}
