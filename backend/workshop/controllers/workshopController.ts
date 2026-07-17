import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

import {
  createWorkshopUseCase,
  deleteWorkshopByIdUseCase,
  getAllWorkshopsUseCase,
  getWorkshopByIdUseCase,
  updateWorkshopByIdUseCase,
  getAllWorkshopsForAdminUseCase,
  getDashboardCountsUseCase,
  getWorkshopBySlugUseCase,
  getHomepageWorkshopsUseCase,
  getWorkshopsByCategoryUseCase,
  checkWorkshopAvailabilityUseCase,
  createWorkshopBookingUseCase,
  getWorkshopBookingsUseCase,
  getWorkshopBookingByIdUseCase,
  addToCartUseCase,
  removeCartItemUseCase,
  checkoutCartUseCase,
  checkPotteryWorkshopAvailabilityUseCase,
  validateGiftVoucherUseCase,
  confirmGiftRedemptionUseCase,
  checkPotteryWorkshopCapacityUseCase,
} from '../useCases/workshopUseCase';
import { IWorkshopBody } from '../../types/workshopTypes';
import { stripe } from '../../config/stripe';
import {
  updateOrderPaymentStatus,
  updateBookingsPaymentStatusByIds,
  getCartByUserIdRepo,
  clearCartRepo,
  getBookingsByIdsRepo,
} from '../repos/workshopRepo';
import { validationResult } from 'express-validator';
import { HttpStatus } from '../../common/httpStatus';
import {
  sendPriveBookingConfirmationMail,
  sendWorkshopBookingConfirmationMail,
  sendGiftVoucherMail,
} from '../../services/workshopBookingMailService';
import { generateGiftVoucher } from '../../utils/generateGiftVoucher';
import { deriveClayType } from '../../utils/deriveClayType';
import workshopModel from '../models/workshopModel';

export const getAllWorkshops = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const workshops = await getAllWorkshopsUseCase(req.query);
  res.status(200).json({
    success: true,
    message: 'Fetched All Workshops successfully',
    result: workshops,
  });
});

export const getHomepageWorkshops = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = await getHomepageWorkshopsUseCase();

    res.status(200).json({
      success: true,
      message: 'Homepage workshops fetched successfully',
      result: data,
    });
  },
);

export const getWorkshopsByCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = await getWorkshopsByCategoryUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Workshops fetched successfully',
      result: data,
    });
  },
);

export const getAllWorkshopsForAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const workshops = await getAllWorkshopsForAdminUseCase(req.query);
    res.status(200).json({
      success: true,
      message: 'Fetched All Workshops successfully',
      result: workshops,
    });
  },
);
export const createWorkshop = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as IWorkshopBody;
  await createWorkshopUseCase(data);
  res.status(200).json({
    success: true,
    message: 'Created Workshop successfully',
    result: true,
  });
});
export const updateWorkshopById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as IWorkshopBody;
    await updateWorkshopByIdUseCase(id, data);
    res.status(200).json({
      success: true,
      message: 'Updated Workshop successfully',
      result: true,
    });
  },
);

export const deleteWorkshopById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await deleteWorkshopByIdUseCase(id);
    res.status(200).json({
      success: true,
      message: 'Deleted Workshop successfully',
      result: true,
    });
  },
);
export const getWorkshopById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const workshop = await getWorkshopByIdUseCase({ _id: id });
  res.status(200).json({
    success: true,
    message: 'Fetched Workshop successfully',
    result: workshop,
  });
});

export const getWorkshopBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const workshop = await getWorkshopBySlugUseCase({ slug: slug });
    res.status(200).json({
      success: true,
      message: 'Fetched Workshop successfully',
      result: workshop,
    });
  },
);

export const getDashboardCounts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const counts = await getDashboardCountsUseCase();

    res.status(200).json({
      success: true,
      message: 'Fetched dashboard counts successfully',
      result: counts,
    });
  },
);

export const checkWorkshopAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { workshopId, bookingDate, slotId, guests } = req.body;

    const result = await checkWorkshopAvailabilityUseCase({
      workshopId,
      bookingDate,
      slotId,
      guests,
    });

    res.status(200).json({
      success: true,
      message: 'Workshop availability checked successfully',
      result,
    });
  },
);

export const checkPotteryWorkshopAvailability = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { workshopId, bookingDate, slotId, guests } = req.body;

    const result = await checkPotteryWorkshopAvailabilityUseCase({
      workshopId,
      bookingDate,
      slotId,
      guests,
    });

    res.status(200).json({
      success: true,
      message: 'Workshop availability checked successfully',
      result,
    });
  },
);

export const createWorkshopBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const result = await createWorkshopBookingUseCase(data);
    res.status(200).json({
      success: true,
      checkoutUrl: result.checkoutUrl,
    });
  },
);

// Generates the voucher PDF, persists the gift status, and emails the voucher
// for a single gift booking. Pulled out so multiple gift bookings can be
// processed concurrently from the webhook.
const processGiftBooking = async (giftBooking: any) => {
  // optionTitle looks like "Air-Dry Clay - Kids" or "Ceramic Clay - Adults";
  // deriveClayType strips the trailing audience suffix.
  const clayType = deriveClayType(giftBooking.items?.[0]?.optionTitle);
  const guests = String(giftBooking.totalPeople);
  const voucherCode = `BP${Date.now()}`;

  const voucher = await generateGiftVoucher({
    personalMessage: giftBooking.giftDetails?.personalMessage || '',
    guests,
    giftFor: giftBooking.giftDetails?.giftFor || '',
    voucherCode,
    clayType,
    redeemUrl: `${process.env.FRONTEND_URL}/redeem?ref=${giftBooking._id}`,
    giftValidity: giftBooking.giftValidity
      ? new Date(giftBooking.giftValidity).toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        })
      : '',
  });

  if (!giftBooking.giftDetails) {
    giftBooking.giftDetails = {};
  }
  giftBooking.giftStatus = 'completed';
  giftBooking.giftDetails.voucherCode = voucherCode;
  giftBooking.giftDetails.voucherPdf = voucher.fileName;
  giftBooking.giftDetails.sentAt = new Date();
  await giftBooking.save();

  await sendGiftVoucherMail({
    booking: giftBooking,
    voucherPath: voucher.outputPath,
    voucherCode,
  });
};

export const stripeWebhookController = async (req: Request, res: Response) => {
  console.log('WEBHOOK HIT');

  try {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing Stripe signature');
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    console.log('EVENT TYPE:', event.type);

    // PAYMENT SUCCESS
    if (event.type === 'payment_intent.succeeded') {
      console.log('PAYMENT SUCCESS WEBHOOK');

      const paymentIntent = event.data.object as any;

      //  console.log('PAYMENT INTENT:', paymentIntent);

      if (paymentIntent.metadata?.partner === 'PaymentPlugins') {
        console.log('Skipping WooCommerce payment');

        return res.json({ received: true });
      }

      // ONLY your MongoDB ObjectId
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        console.log('ORDER ID NOT FOUND');

        return res.json({ received: true });
      }

      // Single source of truth for the order: updateOrderPaymentStatus returns
      // the updated document (findByIdAndUpdate, new: true), so we reuse it
      // instead of re-fetching the same order multiple times.
      const order = await updateOrderPaymentStatus(orderId, {
        paymentStatus: 'paid',
        paymentId: paymentIntent.id,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const bookingIds = order.items.map((item: any) => item.bookingId);

      // Mark the bookings paid, then load the (now-updated) booking documents.
      await updateBookingsPaymentStatusByIds(bookingIds, 'paid');

      console.log('BOOKINGS UPDATED');

      //***************************Send Email

      const orderData = order;

      const bookings = await getBookingsByIdsRepo(bookingIds);

      // Load every referenced workshop in ONE query (deduped) instead of one
      // findById per booking, then resolve slots in memory.
      const workshopIds = [
        ...new Set(bookings.map((b) => b.workshopId?.toString()).filter(Boolean)),
      ];
      const workshops = await workshopModel.find({ _id: { $in: workshopIds } });
      const workshopById = new Map(workshops.map((w) => [String(w._id), w]));

      const bookingDetails = bookings.map((booking) => {
        const workshop = workshopById.get(booking.workshopId?.toString()) || null;
        const slot = workshop?.defaultSlots?.find(
          (s) => s._id?.toString() === booking.slotId?.toString(),
        );
        return { booking, workshop, slot };
      });

      const primaryBooking = bookings[0];
      const bookingType = primaryBooking?.bookingType;

      // Generate a voucher and send the gift email for EVERY gift booking in the
      // order. With cart checkout, gift bookings can appear anywhere among the
      // order's bookings (not just the first one). The gift card email goes to
      // the purchaser (booking.customer.email) only.
      const giftBookings = bookings.filter((b) => b.bookingType === 'gift');

      // The order-confirmation email and the per-gift voucher work are
      // independent, so run them all concurrently instead of one after another.
      await Promise.all([
        bookingType === 'gift' || bookingType === 'pottery'
          ? sendWorkshopBookingConfirmationMail({ order: orderData, bookingsData: bookingDetails })
          : sendPriveBookingConfirmationMail({ order: orderData, bookingsData: bookingDetails }),
        ...giftBookings.map((giftBooking) => processGiftBooking(giftBooking)),
      ]);

      try {
        if (order?.userId) {
          const userId = order.userId.toString();

          const cart = await getCartByUserIdRepo(userId);

          if (cart) {
            await clearCartRepo(userId);
          }
        }
      } catch (err) {
        console.error('Cart clear failed:', err);
      }
    }

    return res.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const getWorkshopBookings = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const filters = {
      search: req.query.search as string,
      bookingStatus: req.query.bookingStatus as string,
      paymentStatus: req.query.paymentStatus as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const result = await getWorkshopBookingsUseCase(filters, limit, page);

    return res.status(200).json({
      success: true,
      message: 'Workshop bookings fetched successfully',
      result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred',
    });
  }
};

export const getWorkshopBookingById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const booking = await getWorkshopBookingByIdUseCase({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Fetched Workshop Booking successfully',
      result: booking,
    });
  },
);

export const addToCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await addToCartUseCase(req.body);

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: result,
  });
});

export const getCartController = asyncHandler(async (req, res) => {
  const cart = await getCartByUserIdRepo(req.params.userId);

  res.json({
    success: true,
    data: cart,
  });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await removeCartItemUseCase(req.body);

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: result,
  });
});

export const checkoutCart = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await checkoutCartUseCase(req.body);

  res.status(200).json({
    success: true,
    message: 'Checkout successful',
    data: result,
  });
});

export const testBookingEmail = asyncHandler(async (req: Request, res: Response) => {
  const testOrder = {
    orderNumber: 'TEST-ORDER-123',
    grandTotal: 250,
  };

  const testBookingsData = [
    {
      booking: {
        customer: {
          firstName: 'Soniya',
          lastName: 'Test',
          email: 'soniyaej@gmail.com',
          phone: '9876543210',
        },

        bookingDate: new Date(),

        totalPeople: 2,

        items: [
          {
            optionTitle: 'Luxury Clay Workshop',
          },
        ],
      },

      slot: {
        startTime: '10:00 AM',
        endTime: '01:00 PM',
      },

      workshop: {
        title: 'Clay Workshop',
      },
    },
  ];

  await sendPriveBookingConfirmationMail({
    order: testOrder,
    bookingsData: testBookingsData,
  });

  res.json({
    success: true,
    message: 'Test email sent successfully',
  });
});

export const validateGiftVoucher = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const result = await validateGiftVoucherUseCase(bookingId);

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Gift booking found',
    result,
  });
});

export const confirmGiftRedemption = asyncHandler(async (req: Request, res: Response) => {
  const {
    bookingId,
    voucherCode,
    bookingDate,
    slotId,
    recipientName,
    recipientPhone,
    recipientEmail,
  } = req.body;

  if (!bookingId || !voucherCode || !bookingDate || !slotId) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'bookingId, voucherCode, bookingDate and slotId are required',
    });
    return;
  }

  const result = await confirmGiftRedemptionUseCase({
    bookingId,
    voucherCode,
    bookingDate,
    slotId,
    recipientName,
    recipientPhone,
    recipientEmail,
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Gift voucher redeemed successfully. Your booking is confirmed!',
    result,
  });
});

export const checkPotteryWorkshopCapacity = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { bookingDate, startTime, endTime } = req.body;

    const result = await checkPotteryWorkshopCapacityUseCase({
      bookingDate,
      startTime,
      endTime,
    });

    res.status(200).json({
      success: true,
      message: 'Workshop capacity fetched successfully',
      result,
    });
  },
);
