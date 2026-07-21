/** Shared API types (mirror the backend response shapes). */

export interface ListResult<T> {
  totalCount: number;
  data?: T[];
}

export interface Category {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  image?: string[];
  parentId?: string | null;
  showOnHomepage?: boolean;
  isActive?: boolean;
}

export interface ClayType {
  _id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string[];
  isActive?: boolean;
}

export interface WorkshopOption {
  _id?: string;
  clayTypeId?: string;
  title: string;
  price: number;
  currency?: string;
  priceDescription?: string;
  description?: string;
  inclusions?: string[];
  image?: string;
}

export interface WorkshopSlot {
  _id?: string;
  label: string;
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface Workshop {
  _id: string;
  title: string;
  slug?: string;
  bannerImage?: string;
  categoryId?: string | Category;
  shortDescription: string;
  description: string;
  overview?: string;
  options?: WorkshopOption[];
  defaultSlots?: WorkshopSlot[];
  nonAvailabilityDates?: string[];
  nonAvailabilityDays?: string[];
  type?: string;
  showOnHomepage?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface BookingCustomer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface Booking {
  _id: string;
  bookingNumber?: string;
  workshopId?: string;
  bookingDate?: string;
  totalPeople?: number;
  totalAmount?: number;
  grandTotal?: number;
  currency?: string;
  customer?: BookingCustomer;
  bookingStatus?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingType?: string;
  createdAt?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  grandTotal?: number;
  subtotal?: number;
  currency?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
  items?: { bookingId?: string; workshopId?: string; totalAmount?: number }[];
}

export interface DashboardStats {
  [key: string]: number | string | undefined;
}

export interface Gallery {
  _id: string;
  title: string;
  images?: string[];
  description?: string;
  isActive?: boolean;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export interface Testimonial {
  _id: string;
  content: string;
  author: string;
  designation?: string;
  authorImage?: string;
}

export interface Partner {
  _id: string;
  name: string;
  logo?: string;
  websiteUrl?: string;
}

export interface OpeningHours {
  _id: string;
  title?: string;
  days: string;
  openTime: string;
  closeTime: string;
  isActive?: boolean;
}

export interface TermsAndCondition {
  _id: string;
  title: string;
  content: string;
  isActive?: boolean;
}

export interface GoogleReview {
  _id: string;
  authorName: string;
  rating: number;
  text?: string;
  profilePhotoUrl?: string;
  reviewTime?: number;
  source?: 'google' | 'manual';
  isActive?: boolean;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  bannerImage?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  writtenBy?: string;
  createdAt?: string;
}

export interface AdminUserRow {
  _id: string;
  fullName?: string;
  name?: string;
  email?: string;
  mobileNumber?: number;
  role?: string;
  status?: number;
  createdAt?: string;
}

export type Lead = { _id: string; createdAt?: string } & Record<string, unknown>;
