import mongoose, { Schema, model } from 'mongoose';
import { IWorkshopBooking } from '../../types/workshopTypes';

const bookingItemSchema = new Schema(
  {
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    optionTitle: { type: String, required: true },
    price: { type: Number, required: true },
    people: { type: Number, required: true },
    adult: { type: Number },
    child: { type: Number },
    subtotal: { type: Number, required: true },
  },
  { _id: false },
);

const workshopBookingSchema = new Schema<IWorkshopBooking>(
  {
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'workshop',
      required: true,
    },

    bookingDate: { type: String },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    items: [bookingItemSchema],
    makingType: { type: String },
    totalPeople: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingNumber: { type: String, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    currency: { type: String, default: 'AED' },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      companyName: { type: String },
      notes: { type: String },
      country: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },

    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    isDeleted: { type: Boolean, default: false },

    bookingType: {
      type: String,
      enum: ['normal', 'gift', 'pottery'],
      default: 'normal',
    },

    giftStatus: {
      type: String,
      enum: ['pending', 'completed', 'redeemed'],
      default: 'pending',
    },

    giftDetails: {
      recipientName: { type: String },
      giftEmail: { type: String },
      giftPhone: { type: String },
      giftFor: { type: String },
      occasion: { type: String },

      personalMessage: { type: String },

      voucherCode: { type: String },

      voucherPdf: { type: String },

      sentAt: { type: Date },
    },

    giftValidity: { type: Date },
  },
  { timestamps: true },
);

workshopBookingSchema.index({ workshopId: 1, bookingDate: 1, slotId: 1 });
workshopBookingSchema.index({ userId: 1 });
const workshopBookingModel = model<IWorkshopBooking>('workshopBookings', workshopBookingSchema);

export default workshopBookingModel;
