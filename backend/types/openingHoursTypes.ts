import { Document } from 'mongoose';

export interface IOpeningHoursModel extends Document {
  title: string; // e.g. "Opening Hours"
  days: string; // e.g. "Tuesday - Sunday"
  openTime: string; // "2:00 PM"
  closeTime: string; // "10:00 PM"
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOpeningHoursBody {
  title: string; // e.g. "Opening Hours"
  days: string; // e.g. "Tuesday - Sunday"
  openTime: string; // "2:00 PM"
  closeTime: string; // "10:00 PM"
}

export interface IGetAllQuery {
  page?: string;
  limit?: string;
  search?: string;
}
