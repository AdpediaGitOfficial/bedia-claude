import { Types } from 'mongoose';

export interface IOrderItem {
  bookingId: Types.ObjectId;
  workshopId: Types.ObjectId;
  bookingDate: string;
  slotId: Types.ObjectId;
  totalAmount: number;
}

export interface IOrderModel {
  orderNumber: string;
  userId: Types.ObjectId;

  items: IOrderItem[]; // 🔥 multiple bookings

  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  grandTotal: number;

  currency: string;

  paymentId?: string;
  paymentMethod?: string;

  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  invoiceNumber?: string;
  paymentGatewayResponse?: any;

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
