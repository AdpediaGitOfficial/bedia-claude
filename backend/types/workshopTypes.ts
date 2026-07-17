import mongoose, { Document, Types } from 'mongoose';

/* ---------------- TIME SLOT ---------------- */
export interface ITimeSlot {
  label: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
}

/* ---------------- WORKSHOP DATE ---------------- */
export interface IWorkshopDate {
  date: string;
  slots: ITimeSlot[];
}

/* ---------------- WORKSHOP OPTION ---------------- */
export interface IWorkshopOption {
  _id?: Types.ObjectId;
  clayType?: string | null;
  title: string;
  price: number;
  currency?: string | null;
  priceDescription?: string | null;
  description?: string | null;
  inclusions?: string[] | undefined;
  image?: string;
}

export interface IWorkshopOptionBody {
  clayType?: string | null;
  title: string;
  price: number;
  currency?: string | null;
  priceDescription?: string | null;
  description?: string | null;
  inclusions?: string[] | undefined;
  image?: string;
}

/* ---------------- FAQ ---------------- */
export interface IFaq {
  question: string;
  answer: string;
}

export interface IDefaultSlot {
  _id?: Types.ObjectId;
  label: string;
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface IWorkshopInclude {
  title: string;
  icon?: string;
}

export interface IWorkshopMoreDetails {
  title: string;
  icon?: string;
  description?: string;
}

export interface IDefaultSlotBody {
  label: string;
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface IWorkshopImage {
  image: string;
  title?: string;
}

/* ---------------- MAIN WORKSHOP MODEL ---------------- */
export interface IWorkshopModel extends Document {
  title: string;
  slug: string;
  bannerImage?: string;
  images: IWorkshopImage[];
  categoryId: Types.ObjectId;
  shortDescription: string;
  description: string;
  overview?: string;
  defaultSlots: IDefaultSlot[];
  options: IWorkshopOption[];
  nonAvailabilityDates: string[];
  nonAvailabilityDays: string[];
  type?: string;
  showOnHomepage?: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  includes?: IWorkshopInclude[];
  moreDetails?: IWorkshopMoreDetails[];
  journeyImage?: string[];
}

/* ---------------- REQUEST BODY (CREATE / UPDATE) ---------------- */
export interface IWorkshopBody {
  title: string;
  bannerImage?: string | null;
  images: IWorkshopImage[];
  categoryId: string;
  shortDescription: string;
  description: string;
  overview?: string;
  defaultSlots: IDefaultSlotBody[];
  options: IWorkshopOptionBody[];
  nonAvailabilityDates?: string[];
  nonAvailabilityDays?: string[];
  isActive?: boolean;
  showOnHomepage?: boolean;
  type?: string;
  includes?: IWorkshopInclude[];
  moreDetails?: IWorkshopMoreDetails[];
  journeyImage?: string[];
}

/* ---------------- LIST QUERY ---------------- */
export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  isActive?: string;
  slug?: string;
}

/* ---------------- CREATE BOOKING BODY ---------------- */
export interface ICreateWorkshopBookingBody {
  workshops: {
    workshopId: string;
    bookingDate?: string;
    slotId?: string;
    makingType?: string;

    items: {
      optionId: string;
      people: number;
      child?: number;
      adult?: number;
    }[];
  }[];

  bookingType?: 'normal' | 'gift' | 'pottery';
  giftDetails?: {
    recipientName?: string;
    giftEmail?: string;
    giftPhone?: string;
    giftFor?: string;
    occasion?: string;
    personalMessage?: string;
  };

  customer: {
    firstName: string;
    lastName: string;
    companyName?: string;
    notes?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone: string;
    email: string;
  };
}

/* ---------------- BOOKING ITEM ---------------- */
export interface IWorkshopBookingItem {
  optionId?: mongoose.Types.ObjectId;
  optionTitle?: string;
  price?: number;
  people?: number;
  adult?: number;
  child?: number;
  subtotal?: number;
}

/* ---------------- GIFT DETAILS ---------------- */
export interface IGiftDetails {
  recipientName?: string;
  giftEmail?: string;
  giftPhone?: string;
  giftFor?: string;
  occasion?: string;
  personalMessage?: string;
  voucherCode?: string;
  voucherPdf?: string;
  sentAt?: Date;
}

/* ---------------- WORKSHOP BOOKING ---------------- */
export interface IWorkshopBooking extends Document {
  workshopId: mongoose.Types.ObjectId;

  bookingDate: string;

  slotId: mongoose.Types.ObjectId;

  items: IWorkshopBookingItem[];

  totalPeople: number;
  totalAmount: number;

  bookingNumber: string;

  userId?: mongoose.Types.ObjectId;

  currency: string;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;

  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    companyName?: string;
    notes?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };

  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  isDeleted: boolean;

  bookingType?: 'normal' | 'gift' | 'pottery';
  makingType?: string;
  giftStatus: 'pending' | 'completed' | 'redeemed';

  giftDetails?: IGiftDetails;

  giftValidity?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

/* ---------------- BOOKING DETAIL RESPONSE ---------------- */
export interface IWorkshopBookingDetail {
  _id: string;

  bookingNumber: string;

  bookingDate: string;

  workshopTitle: string;

  slotStartTime: string;
  slotEndTime: string;
  makingType?: string;

  // items: {
  //   optionId?: string;
  //   optionTitle: string;
  //   price: number;
  //   people: number;
  //   adult?: number;
  //   child?: number;
  //   subtotal: number;
  // }[];
  items: IWorkshopBookingItem[];

  totalPeople: number;
  totalAmount: number;

  currency: string;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;

  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  bookingType?: 'normal' | 'gift' | 'pottery';

  giftStatus?: 'pending' | 'completed' | 'redeemed';

  giftDetails?: IGiftDetails;

  giftValidity?: Date;

  customer: {
    firstName: string;
    lastName: string;
    companyName?: string;
    notes?: string;
    country?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone: string;
    email: string;
  };

  createdAt: Date;
}

/* ---------------- CHECKOUT CART ---------------- */
export interface ICheckoutCartBody {
  userId: string;

  customer: {
    firstName: string;
    lastName: string;
    companyName?: string | null;
    notes?: string | null;
    country?: string;
    address?: string;
    city?: string;
    state?: string | null;
    zipCode?: string | null;
    phone: string;
    email: string;
  };
}

export interface IWorkshopCapacityBody {
  bookingDate: string;
  startTime: string;
  endTime: string;
}
