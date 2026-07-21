import {
  createWorkshop,
  deleteWorkshopById,
  fetchAllWorkshops,
  fetchWorkshopById,
  getWorkshopsCount,
  updateWorkshopById,
  fetchAllWorkshopsForAdmin,
  fetchWorkshopBySlug,
  fetchHomepageWorkshops,
  fetchWorkshopsByCategory,
  fetchWorkshopAvailability,
  getSlotBookedCount,
  createWorkshopBookingRepo,
  getWorkshopByIdRepo,
  createWorkshopOrderRepo,
  getAllWorkshopBookings,
  fetchWorkshopBookingById,
  getAllOrders,
  updateBookingStatusById,
  getCartByUserIdRepo,
  createCartRepo,
  fetchPotteryWorkshopAvailability,
  getGiftBookingByIdRepo,
  getBookingByVoucherCodeRepo,
  redeemGiftBookingRepo,
  fetchPotteryWorkshopCapacity,
} from '../repos/workshopRepo';
import {
  IWorkshopBody,
  IWorkshopModel,
  IGetAllQuery,
  IWorkshopBookingDetail,
} from '../../types/workshopTypes';
import { ObjectID } from '../../utils/objectIdParser';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { getCareersCount } from '../../careers/repos/careerRepo';
import { getJobApplicationsCount } from '../../careers/repos/jobApplicationRepo';
import { fetchCategoryBySlug, getCategoriesCount } from '../../category/repos/categoryRepo';
import { stripe } from '../../config/stripe';
import { sendWorkshopBookingConfirmationMail } from '../../services/workshopBookingMailService';
import mongoose from 'mongoose';

export const getAllWorkshopsUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search, categoryId } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }
  if (categoryId) {
    query.categoryId = categoryId;
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  // Run count + page fetch concurrently instead of serially.
  const [totalCount, workshops] = await Promise.all([
    getWorkshopsCount(query),
    fetchAllWorkshops(query, skip, parseInt(limit)),
  ]);
  if (!totalCount) return { totalCount: 0, workshops: [] };
  return { totalCount, workshops };
};
export const getHomepageWorkshopsUseCase = async () => {
  return await fetchHomepageWorkshops();
};

export const getWorkshopsByCategoryUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search, slug } = queryParams;
  const { limit = '10' } = queryParams;

  if (!slug) {
    return { totalCount: 0, workshops: [] };
  }

  // find category first
  const category = await fetchCategoryBySlug(slug);
  if (!category) {
    return { totalCount: 0, workshops: [] };
  }

  const query: any = {
    categoryId: category._id,
    isDeleted: false,
    isActive: true,
  };

  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Run count + page fetch concurrently instead of serially.
  const [totalCount, workshops] = await Promise.all([
    getWorkshopsCount(query),
    fetchWorkshopsByCategory(query, skip, parseInt(limit)),
  ]);

  if (!totalCount) {
    return { totalCount: 0, category, workshops: [] };
  }

  return { totalCount, category, workshops };
};

export const getAllWorkshopsForAdminUseCase = async (queryParams: IGetAllQuery): Promise<any> => {
  const { page = '1', search } = queryParams;
  const { limit = '10' } = queryParams;
  const query: any = { isDeleted: false };
  if (search && search.length > 0) {
    query['$or'] = [{ title: { $regex: search, $options: 'i' } }]; // Case-insensitive search
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  // Run count + page fetch concurrently instead of serially.
  const [totalCount, workshops] = await Promise.all([
    getWorkshopsCount(query),
    fetchAllWorkshopsForAdmin(query, skip, parseInt(limit)),
  ]);
  if (!totalCount) return { totalCount: 0, workshops: [] };
  return { totalCount, workshops };
};

export const createWorkshopUseCase = async (data: IWorkshopBody): Promise<boolean> => {
  // check for  unique value duplications
  const workshop = await createWorkshop(data);
  if (!workshop) {
    throw new AppError("Couldn't Create new Workshop. Try again", HttpStatus.BAD_REQUEST);
  }
  return true;
};

export const updateWorkshopByIdUseCase = async (
  id: string,
  data: IWorkshopBody,
): Promise<IWorkshopModel> => {
  if (ObjectID(id)) {
    // const existingWorkshop = await fetchWorkshopById(id);
    // check for  unique value updations

    const workshop = await updateWorkshopById(id, data);
    if (!workshop) throw new AppError("Couldn't update Workshop", HttpStatus.NOT_FOUND);
    return workshop;
  }
  throw new AppError('No Workshop Found', HttpStatus.NOT_FOUND);
};
export const deleteWorkshopByIdUseCase = async (id: string): Promise<boolean> => {
  if (ObjectID(id)) {
    const workshop = await deleteWorkshopById(id);
    // check for  unique value updations
    if (workshop) return true;
  }
  throw new AppError('No Workshop Found', HttpStatus.NOT_FOUND);
};

export const getWorkshopByIdUseCase = async (query: { _id: string }): Promise<IWorkshopModel> => {
  if (ObjectID(query._id)) {
    const workshop = await fetchWorkshopById(query._id);
    if (workshop) return workshop;
  }
  throw new AppError('No Workshop Found', HttpStatus.NOT_FOUND);
};

export const getWorkshopBySlugUseCase = async (query: {
  slug: string;
}): Promise<IWorkshopModel> => {
  if (query.slug) {
    const workshop = await fetchWorkshopBySlug(query.slug);
    if (workshop) return workshop;
  }
  throw new AppError('No Workshop Found', HttpStatus.NOT_FOUND);
};

export const getDashboardCountsUseCase = async (): Promise<any> => {
  const query: any = { isDeleted: false };
  const [categoryCount, workshopCount, careerCount, jobApplicationCount] = await Promise.all([
    getCategoriesCount(query),
    getWorkshopsCount(query),
    getCareersCount(query),
    getJobApplicationsCount(query),
  ]);

  return {
    categories: categoryCount,
    workshops: workshopCount,
    careers: careerCount,
    jobApplications: jobApplicationCount,
  };
};

export const checkWorkshopAvailabilityUseCase = async (data: {
  workshopId: string;
  bookingDate: string;
  slotId: string;
  guests: number;
}) => {
  const { workshopId, bookingDate, slotId, guests } = data;

  if (!ObjectID(workshopId)) {
    throw new AppError('Invalid Workshop Id', HttpStatus.BAD_REQUEST);
  }

  if (!ObjectID(slotId)) {
    throw new AppError('Invalid Slot Id', HttpStatus.BAD_REQUEST);
  }

  if (!bookingDate || !guests) {
    throw new AppError('Required fields missing', HttpStatus.BAD_REQUEST);
  }

  const result = await fetchWorkshopAvailability({
    workshopId,
    bookingDate,
    slotId,
    guests,
  });

  if (result) return result;

  throw new AppError('Unable to check availability', HttpStatus.BAD_REQUEST);
};

export const checkPotteryWorkshopAvailabilityUseCase = async (data: {
  workshopId: string;
  bookingDate: string;
  slotId: string;
  guests: number;
}) => {
  const { workshopId, bookingDate, slotId, guests } = data;

  if (!ObjectID(workshopId)) {
    throw new AppError('Invalid Workshop Id', HttpStatus.BAD_REQUEST);
  }

  if (!ObjectID(slotId)) {
    throw new AppError('Invalid Slot Id', HttpStatus.BAD_REQUEST);
  }

  if (!bookingDate || !guests) {
    throw new AppError('Required fields missing', HttpStatus.BAD_REQUEST);
  }

  const result = await fetchPotteryWorkshopAvailability({
    workshopId,
    bookingDate,
    slotId,
    guests,
  });

  if (result) return result;

  throw new AppError('Unable to check availability', HttpStatus.BAD_REQUEST);
};

// export const createWorkshopBookingUseCase = async (data: any): Promise<{ checkoutUrl: string }> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const orderNumber = `ORD-${Date.now()}`;

//     let orderSubtotal = 0;
//     let orderTaxAmount = 0;
//     let orderGrandTotal = 0;

//     const orderItems: any[] = [];

//     for (const workshopInput of data.workshops) {
//       const workshop = await getWorkshopByIdRepo(workshopInput.workshopId);

//       if (!workshop) {
//         throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
//       }

//       const slot = workshop.defaultSlots.find((s: any) => s._id.equals(workshopInput.slotId));

//       if (!slot) {
//         throw new AppError('Selected slot not found', HttpStatus.BAD_REQUEST);
//       }

//       const totalRequestedPeople = workshopInput.items.reduce(
//         (sum: number, item: any) => sum + item.people,
//         0,
//       );

//       const bookedCount = await getSlotBookedCount(
//         workshopInput.workshopId,
//         workshopInput.bookingDate,
//         workshopInput.slotId,
//       );

//       if (bookedCount + totalRequestedPeople > slot.capacity) {
//         throw new AppError('Slot capacity exceeded', HttpStatus.BAD_REQUEST);
//       }

//       let totalAmount = 0;
//       const validatedItems: any[] = [];

//       for (const item of workshopInput.items) {
//         const option = workshop.options.find((o: any) => o._id.equals(item.optionId));

//         if (!option) {
//           throw new AppError('Invalid option selected', HttpStatus.BAD_REQUEST);
//         }

//         const subtotal = option.price * item.people;
//         totalAmount += subtotal;

//         validatedItems.push({
//           optionId: option._id,
//           optionTitle: option.title,
//           price: option.price,
//           people: item.people,
//           subtotal,
//         });
//       }

//       const bookingNumber = `WB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//       const taxPercent = 5;
//       const taxAmount = (totalAmount * taxPercent) / 100;
//       const grandTotal = totalAmount + taxAmount;

//       const booking = await createWorkshopBookingRepo(
//         {
//           workshopId: workshop._id,
//           bookingNumber,
//           bookingDate: workshopInput.bookingDate,
//           slotId: workshopInput.slotId,
//           items: validatedItems,
//           totalPeople: totalRequestedPeople,
//           totalAmount,
//           taxPercent,
//           taxAmount,
//           grandTotal,
//           currency: 'AED',
//           customer: data.customer,
//           bookingStatus: 'pending',
//           paymentStatus: 'pending',
//           userId: data.userId,
//         },
//         session,
//       );

//       orderSubtotal += totalAmount;
//       orderTaxAmount += taxAmount;
//       orderGrandTotal += grandTotal;

//       orderItems.push({
//         bookingId: booking._id,
//         workshopId: workshop._id,
//         bookingDate: workshopInput.bookingDate,
//         slotId: workshopInput.slotId,
//         totalAmount: grandTotal,
//       });
//     }

//     const order = await createWorkshopOrderRepo(
//       {
//         orderNumber,
//         userId: data.userId,
//         items: orderItems,
//         subtotal: orderSubtotal,
//         taxPercent: 5,
//         taxAmount: orderTaxAmount,
//         grandTotal: orderGrandTotal,
//         currency: 'AED',
//         paymentStatus: 'pending',
//         isDeleted: false,
//       },
//       session,
//     );

//     if (!order) {
//       throw new AppError('Order creation failed.', HttpStatus.BAD_REQUEST);
//     }

//     const stripeSession = await createOrderPaymentSessionUseCase(order);

//     if (!stripeSession.url) {
//       throw new AppError('Stripe session URL not generated', HttpStatus.BAD_REQUEST);
//     }

//     // commit transaction BEFORE return
//     await session.commitTransaction();
//     session.endSession();

//     return {
//       checkoutUrl: stripeSession.url,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const createWorkshopBookingUseCase = async (data: any): Promise<{ checkoutUrl: string }> => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  //try {
  const orderNumber = `ORD-${Date.now()}`;

  let orderSubtotal = 0;
  let orderTaxAmount = 0;
  let orderGrandTotal = 0;

  const orderItems: any[] = [];

  for (const workshopInput of data.workshops) {
    const workshop = await getWorkshopByIdRepo(workshopInput.workshopId);

    if (!workshop) {
      throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
    }

    // const slot = workshop.defaultSlots.find((s: any) => s._id.equals(workshopInput.slotId));

    // if (!slot) {
    //   throw new AppError('Selected slot not found', HttpStatus.BAD_REQUEST);
    // }
    let slot = null;

    if (data.bookingType !== 'gift') {
      slot = workshop.defaultSlots.find((s: any) => s._id.equals(workshopInput.slotId));

      if (!slot) {
        throw new AppError('Selected slot not found', HttpStatus.BAD_REQUEST);
      }
    }

    const totalRequestedPeople = workshopInput.items.reduce(
      (sum: number, item: any) => sum + item.people,
      0,
    );

    // const bookedCount = await getSlotBookedCount(
    //   workshopInput.workshopId,
    //   workshopInput.bookingDate,
    //   workshopInput.slotId,
    // );

    // if (bookedCount + totalRequestedPeople > slot.capacity) {
    //   throw new AppError('Slot capacity exceeded', HttpStatus.BAD_REQUEST);
    // }

    if (data.bookingType !== 'gift' && slot) {
      // const bookedCount = await getSlotBookedCount(
      //   workshopInput.workshopId,
      //   workshopInput.bookingDate,
      //   workshopInput.slotId,
      // );

      // if (bookedCount + totalRequestedPeople > slot.capacity) {
      //   throw new AppError('Slot capacity exceeded', HttpStatus.BAD_REQUEST);
      // }

      const bookedCount = await getSlotBookedCount(workshopInput.bookingDate, slot.startTime);

      if (bookedCount + totalRequestedPeople > 12) {
        throw new AppError(`Only ${12 - bookedCount} seats remaining`, HttpStatus.BAD_REQUEST);
      }
    }

    let totalAmount = 0;
    const validatedItems: any[] = [];

    for (const item of workshopInput.items) {
      const option = workshop.options.find((o: any) => o._id.equals(item.optionId));

      if (!option) {
        throw new AppError('Invalid option selected', HttpStatus.BAD_REQUEST);
      }

      const subtotal = option.price * item.people;
      totalAmount += subtotal;

      // validatedItems.push({
      //   optionId: option._id,
      //   optionTitle: option.title,
      //   price: option.price,
      //   people: item.people,
      //   subtotal,
      // });
      validatedItems.push({
        optionId: option._id,
        optionTitle: option.title,
        price: option.price,
        people: item.people,
        adult: item.adult || 0,
        child: item.child || 0,
        subtotal,
      });
    }

    const bookingNumber = `WB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const taxPercent = 5;
    const taxAmount = (totalAmount * taxPercent) / 100;
    const grandTotal = totalAmount + taxAmount;

    // const booking = await createWorkshopBookingRepo(
    //   {
    //     workshopId: workshop._id,
    //     bookingNumber,
    //     bookingDate: workshopInput.bookingDate,
    //     slotId: workshopInput.slotId,
    //     items: validatedItems,
    //     totalPeople: totalRequestedPeople,
    //     totalAmount,
    //     taxPercent,
    //     taxAmount,
    //     grandTotal,
    //     currency: 'AED',
    //     customer: data.customer,
    //     bookingStatus: 'pending',
    //     paymentStatus: 'pending',
    //     userId: data.userId,
    //   },
    //   //  session,
    // );
    const booking = await createWorkshopBookingRepo({
      workshopId: workshop._id,
      bookingNumber,

      bookingDate: workshopInput.bookingDate,
      slotId: workshopInput.slotId,

      makingType: workshopInput.makingType,

      items: validatedItems,

      totalPeople: totalRequestedPeople,
      totalAmount,
      taxPercent,
      taxAmount,
      grandTotal,

      currency: 'AED',

      customer: data.customer,

      bookingType: data.bookingType || 'normal',

      giftDetails: data.bookingType === 'gift' ? data.giftDetails : undefined,

      giftValidity:
        data.bookingType === 'gift'
          ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          : undefined,

      bookingStatus: 'pending',
      paymentStatus: 'pending',

      userId: data.userId,
    });

    orderSubtotal += totalAmount;
    orderTaxAmount += taxAmount;
    orderGrandTotal += grandTotal;

    orderItems.push({
      bookingId: booking._id,
      workshopId: workshop._id,
      bookingDate: workshopInput.bookingDate,
      slotId: workshopInput.slotId,
      totalAmount: grandTotal,
    });
  }

  const order = await createWorkshopOrderRepo(
    {
      orderNumber,
      userId: data.userId,
      items: orderItems,
      subtotal: orderSubtotal,
      taxPercent: 5,
      taxAmount: orderTaxAmount,
      grandTotal: orderGrandTotal,
      currency: 'AED',
      paymentStatus: 'pending',
      isDeleted: false,
    },
    //  session,
  );

  if (!order) {
    throw new AppError('Order creation failed.', HttpStatus.BAD_REQUEST);
  }

  const stripeSession = await createOrderPaymentSessionUseCase(order);

  if (!stripeSession.url) {
    throw new AppError('Stripe session URL not generated', HttpStatus.BAD_REQUEST);
  }

  return {
    checkoutUrl: stripeSession.url,
  };

  //await session.commitTransaction();
  //session.endSession();

  // return true;
  //  } catch (error) {
  // await session.abortTransaction();
  // session.endSession();
  // throw error;
  //}
};

export const createOrderPaymentSessionUseCase = async (order: any) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: order.currency.toLowerCase(),
          product_data: {
            name: `Workshop Order ${order.orderNumber}`,
          },
          unit_amount: Math.round(order.grandTotal * 100),
        },
        quantity: 1,
      },
    ],

    // SESSION METADATA
    metadata: {
      orderId: order._id.toString(),
    },

    // IMPORTANT
    payment_intent_data: {
      metadata: {
        orderId: order._id.toString(),
      },
    },

    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/failure`,
  });

  console.log('SESSION CREATED');
  // console.log(session.id);
  // console.log(session.metadata);
  return session;
};

export const getWorkshopBookingsUseCase = async (filters: any, limit: number, page: number) => {
  const result = await getAllWorkshopBookings(filters, limit, page);

  return result;
};

export const getWorkshopBookingByIdUseCase = async (query: {
  _id: string;
}): Promise<IWorkshopBookingDetail> => {
  if (ObjectID(query._id)) {
    const booking = await fetchWorkshopBookingById(query._id);
    if (booking) return booking;
  }
  throw new AppError('No Workshop Booking Found', HttpStatus.NOT_FOUND);
};

// export const addToCartUseCase = async (data: any) => {
//   const { userId, workshopId, bookingDate, slotId, optionId, people } = data;

//   const workshop = await getWorkshopByIdRepo(workshopId);
//   if (!workshop) throw new AppError('Workshop not found', 404);

//   // Validate SLOT
//   const slot = workshop.defaultSlots.find((s: any) =>
//     s._id.equals(new mongoose.Types.ObjectId(slotId)),
//   );

//   if (!slot) {
//     throw new AppError('Invalid slot selected', 400);
//   }

//   //  Validate OPTION
//   const option = workshop.options.find((o: any) =>
//     o._id.equals(new mongoose.Types.ObjectId(optionId)),
//   );

//   if (!option) {
//     throw new AppError('Invalid option selected', 400);
//   }

//   //check non-availability day
//   const dayName = new Date(bookingDate).toLocaleDateString('en-US', {
//     weekday: 'long',
//   });

//   if (workshop.nonAvailabilityDays.includes(dayName)) {
//     throw new AppError('Workshop not available on selected day', 400);
//   }

//   // check blocked dates
//   if (workshop.nonAvailabilityDates?.includes(bookingDate)) {
//     throw new AppError('Workshop not available on selected date', 400);
//   }

//   const price = option.price;
//   const subtotal = price * people;

//   let cart = await getCartByUserIdRepo(userId);

//   if (!cart) {
//     cart = await createCartRepo({
//       userId,
//       items: [],
//     });
//   }

//   // Check existing item
//   const existingItemIndex = cart.items.findIndex(
//     (item: any) =>
//       item.workshopId.equals(workshopId) &&
//       item.slotId.equals(slotId) &&
//       item.bookingDate === bookingDate &&
//       item.optionId.equals(optionId),
//   );

//   if (existingItemIndex > -1) {
//     cart.items[existingItemIndex].people += people;
//     cart.items[existingItemIndex].subtotal += subtotal;
//   } else {
//     cart.items.push({
//       workshopId,
//       bookingDate,
//       slotId,
//       optionId,
//       people,
//       price,
//       subtotal,
//       currency: option.currency || 'AED',
//     });
//   }

//   //  Recalculate totals
//   cart.totalPeople = cart.items.reduce((sum: number, i: any) => sum + i.people, 0);
//   cart.totalAmount = cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);

//   cart.taxPercent = 5;
//   cart.taxAmount = (cart.totalAmount * 5) / 100;
//   cart.grandTotal = cart.totalAmount + cart.taxAmount;

//   await cart.save();

//   return cart;
// };

export const addToCartUseCase = async (data: any) => {
  const {
    userId,
    workshopId,
    bookingDate,
    slotId,
    optionId,
    people,
    bookingType = 'normal',
    giftDetails,
  } = data;

  const workshop = await getWorkshopByIdRepo(workshopId);

  if (!workshop) {
    throw new AppError('Workshop not found', 404);
  }

  let slot = null;

  // Validate slot only for normal bookings
  if (bookingType !== 'gift') {
    slot = workshop.defaultSlots.find((s: any) =>
      s._id.equals(new mongoose.Types.ObjectId(slotId)),
    );

    if (!slot) {
      throw new AppError('Invalid slot selected', 400);
    }

    // Check non-availability day
    const dayName = new Date(bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
    });

    if (workshop.nonAvailabilityDays.includes(dayName)) {
      throw new AppError('Workshop not available on selected day', 400);
    }

    // Check blocked dates
    if (workshop.nonAvailabilityDates?.includes(bookingDate)) {
      throw new AppError('Workshop not available on selected date', 400);
    }
  }

  // Validate option
  const option = workshop.options.find((o: any) =>
    o._id.equals(new mongoose.Types.ObjectId(optionId)),
  );

  if (!option) {
    throw new AppError('Invalid option selected', 400);
  }

  const price = option.price;
  const subtotal = price * people;

  let cart = await getCartByUserIdRepo(userId);

  if (!cart) {
    cart = await createCartRepo({
      userId,
      items: [],
    });
  }

  // Check existing item.
  // Gift items are never merged — each gift can target a different recipient,
  // so it always becomes its own cart line (and later its own booking).
  const existingItemIndex =
    bookingType === 'gift'
      ? -1
      : cart.items.findIndex(
          (item: any) =>
            item.workshopId.equals(workshopId) &&
            item.slotId?.equals(slotId) &&
            item.bookingDate === bookingDate &&
            item.optionId.equals(optionId),
        );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].people += people;
    cart.items[existingItemIndex].subtotal += subtotal;
  } else {
    cart.items.push({
      workshopId,

      bookingDate: bookingType === 'gift' ? undefined : bookingDate,
      slotId: bookingType === 'gift' ? undefined : slotId,

      optionId,
      people,
      price,
      subtotal,

      bookingType,

      giftDetails: bookingType === 'gift' ? giftDetails : undefined,

      currency: option.currency || 'AED',
    });
  }

  // Recalculate totals
  cart.totalPeople = cart.items.reduce((sum: number, i: any) => sum + i.people, 0);

  cart.totalAmount = cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);

  cart.taxPercent = 5;
  cart.taxAmount = (cart.totalAmount * 5) / 100;
  cart.grandTotal = cart.totalAmount + cart.taxAmount;

  await cart.save();

  return cart;
};

export const removeCartItemUseCase = async (data: any) => {
  const { userId, itemIndex } = data;

  const cart = await getCartByUserIdRepo(userId);
  if (!cart) throw new AppError('Cart not found', 404);

  // Validate index
  if (itemIndex === undefined || itemIndex < 0 || itemIndex >= cart.items.length) {
    throw new AppError('Invalid item index', 400);
  }

  //  Remove item
  cart.items.splice(itemIndex, 1);

  // Recalculate totals
  cart.totalPeople = cart.items.reduce((sum: number, i: any) => sum + i.people, 0);

  cart.totalAmount = cart.items.reduce((sum: number, i: any) => sum + i.subtotal, 0);

  // Tax + Grand Total
  cart.taxPercent = 5;
  cart.taxAmount = (cart.totalAmount * cart.taxPercent) / 100;
  cart.grandTotal = cart.totalAmount + cart.taxAmount;
  await cart.save();
  return cart;
};

// export const checkoutCartUseCase = async (data: any) => {
//   const { userId, customer } = data;

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const cart = await getCartByUserIdRepo(userId);
//     if (!cart || cart.items.length === 0) {
//       throw new AppError('Cart is empty', 400);
//     }

//     const orderNumber = `ORD-${Date.now()}`;

//     let orderSubtotal = 0;
//     let orderTaxAmount = 0;
//     let orderGrandTotal = 0;

//     const orderItems: any[] = [];

//     // ✅ Group cart items
//     const groupedItems: Record<string, any> = {};

//     for (const item of cart.items) {
//       const key = `${item.workshopId}_${item.bookingDate}_${item.slotId}`;

//       if (!groupedItems[key]) {
//         groupedItems[key] = {
//           workshopId: item.workshopId,
//           bookingDate: item.bookingDate,
//           slotId: item.slotId,
//           items: [],
//         };
//       }

//       groupedItems[key].items.push(item);
//     }

//     //  Process each group
//     for (const group of Object.values(groupedItems)) {
//       const workshop = await getWorkshopByIdRepo(group.workshopId);
//       if (!workshop || !workshop.isActive) {
//         throw new AppError('Workshop not available', 404);
//       }

//       //  Validate SLOT
//       const slot = workshop.defaultSlots.find((s: any) =>
//         s._id.equals(new mongoose.Types.ObjectId(group.slotId)),
//       );

//       if (!slot) {
//         throw new AppError('Invalid slot selected', 400);
//       }

//       //  Check day availability
//       const dayName = new Date(group.bookingDate).toLocaleDateString('en-US', {
//         weekday: 'long',
//       });

//       if (workshop.nonAvailabilityDays?.includes(dayName)) {
//         throw new AppError('Workshop not available on selected day', 400);
//       }

//       //  Check blocked dates
//       if (workshop.nonAvailabilityDates?.includes(group.bookingDate)) {
//         throw new AppError('Workshop not available on selected date', 400);
//       }

//       //  Capacity check
//       const totalPeople = group.items.reduce((sum: number, i: any) => sum + i.people, 0);

//       const bookedCount = await getSlotBookedCount(
//         group.workshopId,
//         group.bookingDate,
//         group.slotId,
//       );

//       if (bookedCount + totalPeople > slot.capacity) {
//         throw new AppError('Slot capacity exceeded', 400);
//       }

//       let totalAmount = 0;
//       const validatedItems: any[] = [];

//       // Validate options
//       for (const item of group.items) {
//         const option = workshop.options.find((o: any) =>
//           o._id.equals(new mongoose.Types.ObjectId(item.optionId)),
//         );

//         if (!option) {
//           throw new AppError('Invalid option selected', 400);
//         }

//         const subtotal = option.price * item.people;
//         totalAmount += subtotal;

//         validatedItems.push({
//           optionId: option._id,
//           optionTitle: option.title,
//           price: option.price,
//           people: item.people,
//           subtotal,
//         });
//       }

//       const bookingNumber = `WB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//       const taxPercent = 5;
//       const taxAmount = (totalAmount * taxPercent) / 100;
//       const grandTotal = totalAmount + taxAmount;

//       //  Create booking inside transaction
//       const booking = await createWorkshopBookingRepo(
//         {
//           workshopId: group.workshopId,
//           bookingNumber,
//           bookingDate: group.bookingDate,
//           slotId: group.slotId,
//           items: validatedItems,
//           totalPeople,
//           totalAmount,
//           taxPercent,
//           taxAmount,
//           grandTotal,
//           currency: 'AED',
//           customer,
//           bookingStatus: 'pending',
//           paymentStatus: 'pending',
//           userId,
//         },
//         session,
//       );

//       orderSubtotal += totalAmount;
//       orderTaxAmount += taxAmount;
//       orderGrandTotal += grandTotal;

//       orderItems.push({
//         bookingId: booking._id,
//         workshopId: group.workshopId,
//         bookingDate: group.bookingDate,
//         slotId: group.slotId,
//         totalAmount: grandTotal,
//       });
//     }

//     // Create order
//     const order = await createWorkshopOrderRepo(
//       {
//         orderNumber,
//         userId,
//         items: orderItems,
//         subtotal: orderSubtotal,
//         taxPercent: 5,
//         taxAmount: orderTaxAmount,
//         grandTotal: orderGrandTotal,
//         currency: 'AED',
//         paymentStatus: 'pending',
//         isDeleted: false,
//       },
//       session,
//     );

//     if (!order) {
//       throw new AppError('Order creation failed', 400);
//     }

//     // Commit DB changes BEFORE Stripe
//     await session.commitTransaction();
//     session.endSession();

//     // Create Stripe session AFTER commit
//     const stripeSession = await createOrderPaymentSessionUseCase(order);

//     if (!stripeSession.url) {
//       throw new AppError('Stripe session failed', 400);
//     }

//     return {
//       checkoutUrl: stripeSession.url,
//       orderId: order._id,
//     };
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const checkoutCartUseCase = async (data: any) => {
  const { userId, customer } = data;

  try {
    const cart = await getCartByUserIdRepo(userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const orderNumber = `ORD-${Date.now()}`;

    let orderSubtotal = 0;
    let orderTaxAmount = 0;
    let orderGrandTotal = 0;

    const orderItems: any[] = [];

    // Group cart items.
    // Normal items are grouped by workshop + date + slot (one booking per slot).
    // Gift items are never grouped — each gift line becomes its own booking so
    // its recipient (giftDetails) is preserved.
    const groupedItems: Record<string, any> = {};

    cart.items.forEach((item: any, index: number) => {
      const isGift = item.bookingType === 'gift';

      const key = isGift
        ? `gift_${index}`
        : `${item.workshopId}_${item.bookingDate}_${item.slotId}`;

      if (!groupedItems[key]) {
        groupedItems[key] = {
          workshopId: item.workshopId,
          bookingDate: item.bookingDate,
          slotId: item.slotId,
          bookingType: item.bookingType || 'normal',
          giftDetails: item.giftDetails,
          items: [],
        };
      }

      groupedItems[key].items.push(item);
    });

    // Process each group
    for (const group of Object.values(groupedItems)) {
      const isGift = group.bookingType === 'gift';

      const workshop = await getWorkshopByIdRepo(group.workshopId);

      if (!workshop || !workshop.isActive) {
        throw new AppError('Workshop not available', 404);
      }

      // Slot, day and date availability checks only apply to non-gift bookings —
      // gift bookings have no scheduled slot until the recipient redeems.
      let slot = null;

      if (!isGift) {
        // Validate SLOT
        slot = workshop.defaultSlots.find((s: any) => s._id.equals(group.slotId));

        if (!slot) {
          throw new AppError('Invalid slot selected', 400);
        }

        // Check day availability
        const dayName = new Date(group.bookingDate).toLocaleDateString('en-US', {
          weekday: 'long',
        });

        if (workshop.nonAvailabilityDays?.includes(dayName)) {
          throw new AppError('Workshop not available on selected day', 400);
        }

        // Check blocked dates
        if (workshop.nonAvailabilityDates?.includes(group.bookingDate)) {
          throw new AppError('Workshop not available on selected date', 400);
        }
      }

      // Capacity check (skipped for gift bookings)
      const totalPeople = group.items.reduce((sum: number, i: any) => sum + i.people, 0);

      if (!isGift && slot) {
        // const bookedCount = await getSlotBookedCount(
        //   group.workshopId,
        //   group.bookingDate,
        //   group.slotId,
        // );
        const bookedCount = await getSlotBookedCount(group.bookingDate, slot.startTime);

        if (bookedCount + totalPeople > 12) {
          throw new AppError('Slot capacity exceeded', 400);
        }
      }

      let totalAmount = 0;
      const validatedItems: any[] = [];

      // Validate options
      for (const item of group.items) {
        const option = workshop.options.find((o: any) => o._id.equals(item.optionId));

        if (!option) {
          throw new AppError('Invalid option selected', 400);
        }

        const subtotal = option.price * item.people;
        totalAmount += subtotal;

        validatedItems.push({
          optionId: option._id,
          optionTitle: option.title,
          price: option.price,
          people: item.people,
          adult: item.adult || 0,
          child: item.child || 0,
          subtotal,
        });
      }

      const bookingNumber = `WB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const taxPercent = 5;
      const taxAmount = (totalAmount * taxPercent) / 100;
      const grandTotal = totalAmount + taxAmount;
      // Create booking
      const booking = await createWorkshopBookingRepo({
        workshopId: group.workshopId,
        bookingNumber,
        bookingDate: isGift ? undefined : group.bookingDate,
        slotId: isGift ? undefined : group.slotId,
        items: validatedItems,
        totalPeople,
        totalAmount,
        taxPercent,
        taxAmount,
        grandTotal,
        currency: 'AED',
        customer,

        bookingType: group.bookingType || 'normal',

        giftDetails: isGift ? group.giftDetails : undefined,

        giftValidity: isGift
          ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          : undefined,

        bookingStatus: 'pending',
        paymentStatus: 'pending',
        userId,
      });

      orderSubtotal += totalAmount;
      orderTaxAmount += taxAmount;
      orderGrandTotal += grandTotal;

      orderItems.push({
        bookingId: booking._id,
        workshopId: group.workshopId,
        bookingDate: isGift ? undefined : group.bookingDate,
        slotId: isGift ? undefined : group.slotId,
        totalAmount: grandTotal,
      });
    }

    // Create order
    const order = await createWorkshopOrderRepo({
      orderNumber,
      userId,
      items: orderItems,
      subtotal: orderSubtotal,
      taxPercent: 5,
      taxAmount: orderTaxAmount,
      grandTotal: orderGrandTotal,
      currency: 'AED',
      paymentStatus: 'pending',
      isDeleted: false,
    });

    if (!order) {
      throw new AppError('Order creation failed', 400);
    }

    //  Create Stripe session AFTER DB save
    const stripeSession = await createOrderPaymentSessionUseCase(order);

    if (!stripeSession.url) {
      throw new AppError('Stripe session failed', 400);
    }

    return {
      checkoutUrl: stripeSession.url,
      orderId: order._id,
    };
  } catch (error) {
    // Preserve specific validation errors (empty cart, invalid slot/option,
    // capacity, gift errors, etc.); only wrap truly unexpected failures.
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Checkout failed', 500);
  }
};

// Load booking details using bookingId from the email URL — no voucher code needed here.
// Returns enough info to display the redeem page; voucher code is NOT returned.
export const validateGiftVoucherUseCase = async (bookingId: string) => {
  if (!ObjectID(bookingId)) {
    throw new AppError('Invalid booking reference', HttpStatus.BAD_REQUEST);
  }

  const booking = await getGiftBookingByIdRepo(bookingId);

  if (!booking) {
    throw new AppError('Booking not found', HttpStatus.NOT_FOUND);
  }

  if (booking.giftStatus === 'redeemed') {
    throw new AppError('This gift voucher has already been redeemed', HttpStatus.BAD_REQUEST);
  }

  if (booking.paymentStatus !== 'paid') {
    throw new AppError('This gift voucher is not yet active', HttpStatus.BAD_REQUEST);
  }

  if (booking.giftValidity && new Date() > new Date(booking.giftValidity)) {
    throw new AppError('This gift voucher has expired', HttpStatus.BAD_REQUEST);
  }

  const workshop = await getWorkshopByIdRepo(booking.workshopId.toString());

  if (!workshop) {
    throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
  }

  return {
    bookingId: booking._id,
    giftStatus: booking.giftStatus,
    recipientName: booking.giftDetails?.recipientName,
    occasion: booking.giftDetails?.occasion,
    personalMessage: booking.giftDetails?.personalMessage,
    workshop: {
      _id: workshop._id,
      title: workshop.title,
      slug: workshop.slug,
      defaultSlots: workshop.defaultSlots,
    },
    items: booking.items,
    totalPeople: booking.totalPeople,
    grandTotal: booking.grandTotal,
    currency: booking.currency,
  };
};

// Confirm redemption — requires BOTH bookingId (from URL) AND voucherCode (typed by recipient).
export const confirmGiftRedemptionUseCase = async (data: {
  bookingId: string;
  voucherCode: string;
  bookingDate: string;
  slotId: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
}) => {
  const {
    bookingId,
    voucherCode,
    bookingDate,
    slotId,
    recipientName,
    recipientPhone,
    recipientEmail,
  } = data;

  if (!ObjectID(bookingId)) {
    throw new AppError('Invalid booking reference', HttpStatus.BAD_REQUEST);
  }

  // Both bookingId AND voucherCode must match the same document
  const booking = await getBookingByVoucherCodeRepo(bookingId, voucherCode);

  if (!booking) {
    throw new AppError('Invalid voucher code', HttpStatus.BAD_REQUEST);
  }

  if (booking.giftStatus === 'redeemed') {
    throw new AppError('This gift voucher has already been redeemed', HttpStatus.BAD_REQUEST);
  }

  if (booking.paymentStatus !== 'paid') {
    throw new AppError('This gift voucher is not yet active', HttpStatus.BAD_REQUEST);
  }

  if (booking.giftValidity && new Date() > new Date(booking.giftValidity)) {
    throw new AppError('This gift voucher has expired', HttpStatus.BAD_REQUEST);
  }

  const workshop = await getWorkshopByIdRepo(booking.workshopId.toString());

  if (!workshop) {
    throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
  }

  const slot = workshop.defaultSlots.find((s: any) => s._id.toString() === slotId);

  if (!slot) {
    throw new AppError('Selected slot not found', HttpStatus.BAD_REQUEST);
  }

  const bookedCount = await getSlotBookedCount(bookingDate, slot.startTime);
  if (bookedCount + booking.totalPeople > 12) {
    throw new AppError(
      `This slot is fully booked. Only ${12 - bookedCount} spot(s) remaining.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  const updatedBooking = await redeemGiftBookingRepo(
    (booking._id as any).toString(),
    bookingDate,
    slotId,
  );

  // Notify the recipient (if we have their email) and the buyer that the gift
  // is now a confirmed, scheduled booking. The mail service swallows its own
  // errors, so a mail failure never blocks the redemption.
  const giftRecipientEmail = recipientEmail || booking.giftDetails?.giftEmail;
  const buyerEmail = booking.customer?.email;

  const toEmail = giftRecipientEmail || buyerEmail;

  if (toEmail) {
    const ccList: string[] = [];
    if (giftRecipientEmail && buyerEmail && giftRecipientEmail !== buyerEmail) {
      ccList.push(buyerEmail);
    }
    if (process.env.CC_EMAIL) {
      ccList.push(process.env.CC_EMAIL);
    }

    await sendWorkshopBookingConfirmationMail({
      order: {
        orderNumber: updatedBooking?.bookingNumber,
        grandTotal: booking.grandTotal,
      },
      bookingsData: [
        {
          booking: updatedBooking,
          workshop,
          slot,
        },
      ],
      to: toEmail,
      cc: ccList,
    });
  }

  return {
    bookingNumber: updatedBooking?.bookingNumber,
    workshopTitle: workshop.title,
    bookingDate,
    slot: {
      label: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
    },
    totalPeople: booking.totalPeople,
    grandTotal: booking.grandTotal,
    currency: booking.currency,
    recipientName: recipientName || booking.giftDetails?.recipientName,
    recipientEmail: recipientEmail || booking.giftDetails?.giftEmail,
    recipientPhone,
    items: booking.items,
  };
};

export const checkPotteryWorkshopCapacityUseCase = async (data: {
  bookingDate: string;
  startTime: string;
  endTime: string;
}) => {
  const { bookingDate, startTime, endTime } = data;

  if (!bookingDate || !startTime || !endTime) {
    throw new AppError(
      'Booking date, start time and end time are required',
      HttpStatus.BAD_REQUEST,
    );
  }

  return await fetchPotteryWorkshopCapacity(data);
};

// --- Admin: orders list + booking status update ---

export const getOrdersUseCase = async (filters: any, limit: number, page: number) => {
  return await getAllOrders(filters, limit, page);
};

export const updateBookingStatusUseCase = async (
  id: string,
  patch: { bookingStatus?: string; paymentStatus?: string },
) => {
  const updated = await updateBookingStatusById(id, patch);
  if (!updated) {
    throw new AppError('Booking not found', HttpStatus.NOT_FOUND);
  }
  return updated;
};
