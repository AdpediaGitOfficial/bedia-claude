import { Document, Types } from 'mongoose';
import { IGiftDetails } from './workshopTypes';

export interface ICartModel extends Document {
  userId: Types.ObjectId;

  items: {
    workshopId: Types.ObjectId;
    bookingDate?: string;
    slotId?: Types.ObjectId;
    optionId: Types.ObjectId;
    people: number;
    price: number;
    adult?: number;
    child?: number;
    subtotal: number;
    bookingType?: string;
    giftDetails?: IGiftDetails;
    makingType?: string;
    currency?: string;
  }[];

  totalPeople: number;
  totalAmount: number;

  taxPercent: number;
  taxAmount: number;
  grandTotal: number;
}
