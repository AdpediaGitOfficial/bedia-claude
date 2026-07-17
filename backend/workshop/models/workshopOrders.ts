import mongoose, { Schema, model } from 'mongoose';
import { IOrderModel } from '../../types/orderTypes';

const orderItemSchema = new Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workshopBookings',
      required: true,
    },

    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workshop',
      required: true,
    },

    bookingDate: String,
    slotId: mongoose.Schema.Types.ObjectId,

    totalAmount: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },

    items: [orderItemSchema],

    subtotal: { type: Number, required: true },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    currency: { type: String, default: 'AED' },

    paymentId: String,
    paymentMethod: String,

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    invoiceNumber: String,

    paymentGatewayResponse: Schema.Types.Mixed,

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model<IOrderModel>('orders', orderSchema);
