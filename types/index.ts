import { CartData } from "@/services/cart.service";

export interface NavigationItem {
  label: string;
  href: string;
  target?: string;
  children?: { label: string; href: string }[];
}

export interface HeroSlideCard {
  _id?: string;
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  bannerImage?: string;
  imageUrl?: string;
  images?: string[];
  ctaText?: string;
  ctaLink?: string;
  slug?: string;
}
export interface HeroCategory {
  _id?: string;
  title?: string;
  image?: string[];
  slug?: string;
}

export interface HeroSlide {
  _id?: string;
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  imageUrl: string;
  layout?: string;
  cards?: HeroSlideCard[];
  category?: HeroCategory;
}
export interface GoogleReview {
  _id: string;
  authorName: string;
  placeId: string;
  rating: number;
  text: string;
  profilePhotoUrl: string;
  reviewTime: number;
  media?: {
    videos?: string[];
    images?: string[];
  };
  source?: string;
  isActive?: boolean;
}

export interface ContentCard {
  id: string;
  type: "image" | "cta" | "imagecard";
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  authorImage: string;
  rating: number;
  text: string;
  daysAgo: number;
  isVideo?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialMedia {
  name: string;
  icon: string;
  href: string;
}

export interface AboutSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  imagePosition?: "left" | "right";
}

export interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    points: string;
  };
  mission: AboutSectionProps & { imagePosition: "right" };
  vision: AboutSectionProps & { imagePosition: "left" };
  fullWidth: {
    title: string;
    subtitle: string;
    backgroundImageUrl: string;
  };
}

export interface Product {
  id: string;
  title: string;
  price?: number;
  originalPrice?: number;
  imageUrl: string;
  videoUrl?: string;
  category?: string;
  slug: string;
  mainSlug: string;
  description?: string;
  longDescription?: string;
  materials?: MaterialOption[];
  materialDescriptions?: Record<string, string>;
}

export interface MaterialOption {
  id: string;
  name: string;
  description?: string;
}

export interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  label: string;
  capacity: boolean;
}

export interface BookingData {
  userId: string;
  workshopId: string;
  bookingDate?: string;
  giftDetails?: {
    occasion: string;
    personalMessage: string;
  };
  bookingType: string;
  slotId?: string;
  optionId: string;
  people: number;
  adult?: number;
  child?: number;
}

export interface CheckoutWorkshopItem {
  optionId: string;
  people: number;
}

export interface CheckoutWorkshopPayload {
  workshopId: string;
  bookingDate?: string;
  bookingType?: string;
  slotId?: string;
  items: CheckoutWorkshopItem[];
}

export interface CheckoutCustomerPayload {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

export interface CheckoutPayload {
  bookingType?: string;
  userId: string;
  workshops: CheckoutWorkshopPayload[];

  customer: CheckoutCustomerPayload;
}

export interface CheckoutWorkshopPayload {
  workshopId: string;
  bookingDate?: string;
  slotId?: string;
  items: CheckoutWorkshopItemPayload[];
}
export interface CheckoutWorkshopItem {
  optionId: string;
  people: number;
  adult?: number;
  child?: number;
}

export interface CheckoutWorkshopPayload {
  workshopId: string;
  bookingDate?: string;
  slotId?: string;
  items: CheckoutWorkshopItem[];
}
export interface CheckoutWorkshopItemPayload {
  optionId: string;
  people: number;
  adult?: number;
  child?: number;
}

export interface CheckoutCustomerPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subtitle?: string;
}

export interface Availability {
  workshopId: string;
  bookingDate: string;
  slotId: string;
  guests: number;
}
export interface AvailabilityResult {
  available: boolean;
  reason: string;
}

export interface AvailabilityResponse {
  success: boolean;
  message: string;
  result: AvailabilityResult;
}
export interface CartStepProps {
  onNext?: () => void;
  getCartData: () => Promise<CartData[]>;
  data: CartData[];
  deleteCart: (input: {
    userId: string;
    itemIndex: number;
  }) => Promise<CartData[]>;
}
