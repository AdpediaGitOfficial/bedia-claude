import { IWorkshopModel, IWorkshopBody, IGetAllQuery } from '../../types/workshopTypes';
import { ObjectID } from '../../utils/objectIdParser';
import workshopModel from '../models/workshopModel';
import categoryModel from '../../category/models/categoryModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import workshopBookingModel from '../models/workshopBookingModel';
import orderModel from '../models/workshopOrders';
import mongoose, { ClientSession } from 'mongoose';
import cartModel from '../models/cartModel';
import { ICartModel } from '../../types/cartTypes';

export const getWorkshopsCount = async (query: { isDeleted: boolean }): Promise<number> => {
  return await workshopModel.countDocuments(query);
};

export const fetchAllWorkshops = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IWorkshopModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await workshopModel
    .find(dbQuery)
    .populate({
      path: 'categoryId',
      select: 'title image description -_id slug',
    })
    .select({
      keyAdvantages: 0,
      overview: 0,
      imageTitle: 0,
      imageDescription: 0,
      isDeleted: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const fetchWorkshopsByCategory = async (query: any, skip: number, limit: number) => {
  // `options` is fetched (not excluded) so we can surface the first option's
  // price as a top-level `price`, then the full options array is dropped from
  // the response.
  const workshops = await workshopModel
    .find(query)
    .select({
      keyAdvantages: 0,
      overview: 0,
      imageTitle: 0,
      imageDescription: 0,
      isDeleted: 0,
      createdAt: 0,
      updatedAt: 0,
      defaultSlots: 0,
      nonAvailabilityDates: 0,
      nonAvailabilityDays: 0,
      showOnHomepage: 0,
      __v: 0,
      isActive: 0,
      categoryId: 0,
      description: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return workshops.map((workshop) => {
    const { options, ...rest } = workshop as typeof workshop & {
      options?: { price?: number }[];
    };
    const price = options && options.length > 0 ? options[0]?.price ?? null : null;
    return { ...rest, price };
  });
};

// export const fetchHomepageWorkshops = async () => {
//   return await categoryModel.aggregate([
//     // Homepage categories
//     {
//       $match: {
//         showOnHomepage: true,
//         isDeleted: false,
//         isActive: true,
//       },
//     },

//     // Fetch child categories
//     {
//       $lookup: {
//         from: 'categories',
//         localField: '_id',
//         foreignField: 'parentId',
//         as: 'childCategories',
//       },
//     },

//     // fetch parent category
//     {
//       $lookup: {
//         from: 'categories',
//         localField: 'parentId',
//         foreignField: '_id',
//         as: 'parentCategory',
//       },
//     },

//     // Convert parent array → object
//     {
//       $addFields: {
//         parentCategory: { $arrayElemAt: ['$parentCategory', 0] },
//       },
//     },

//     // Collect category IDs (parent + children)
//     {
//       $addFields: {
//         allCategoryIds: {
//           $concatArrays: [
//             ['$_id'],
//             {
//               $map: {
//                 input: '$childCategories',
//                 as: 'child',
//                 in: '$$child._id',
//               },
//             },
//           ],
//         },
//       },
//     },

//     // Fetch workshops
//     {
//       $lookup: {
//         from: 'workshops',
//         let: { categoryIds: '$allCategoryIds' },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $and: [
//                   { $in: ['$categoryId', '$$categoryIds'] },
//                   { $eq: ['$showOnHomepage', true] },
//                   { $eq: ['$isActive', true] },
//                   { $eq: ['$isDeleted', false] },
//                 ],
//               },
//             },
//           },
//           {
//             $project: {
//               _id: 1,
//               title: 1,
//               bannerImage: 1,
//               images: 1,
//               shortDescription: 1,
//               slug: 1,
//               type: 1,
//             },
//           },
//         ],
//         as: 'cards',
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         imageUrl: { $arrayElemAt: ['$image', 0] },
//         title: '$title',
//         description: '$description',
//         shortDescription: '$shortDescription',
//         parentTitle: '$parentCategory.title',
//         cards: 1,
//       },
//     },
//   ]);
// };

export const fetchHomepageWorkshops = async () => {
  return await categoryModel.aggregate([
    // Homepage main categories only (child category workshops are merged into the parent's cards)
    {
      $match: {
        parentId: null,
        showOnHomepage: true,
        isDeleted: false,
        isActive: true,
      },
    },

    // Fetch child categories
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parentId',
        as: 'childCategories',
      },
    },

    // Collect category IDs (parent + children)
    {
      $addFields: {
        allCategoryIds: {
          $concatArrays: [
            ['$_id'],
            {
              $map: {
                input: '$childCategories',
                as: 'child',
                in: '$$child._id',
              },
            },
          ],
        },
      },
    },

    // Fetch workshops
    {
      $lookup: {
        from: 'workshops',
        let: { categoryIds: '$allCategoryIds' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$categoryId', '$$categoryIds'] },
                  { $eq: ['$showOnHomepage', true] },
                  { $eq: ['$isActive', true] },
                  { $eq: ['$isDeleted', false] },
                ],
              },
            },
          },
          // Oldest workshops first
          { $sort: { createdAt: 1 } },
          // Attach the workshop's own category (title, 1 image, slug)
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $addFields: {
              category: { $arrayElemAt: ['$category', 0] },
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              bannerImage: 1,
              images: 1,
              shortDescription: 1,
              slug: 1,
              type: 1,
              category: {
                _id: '$category._id',
                title: '$category.title',
                slug: '$category.slug',
                image: { $arrayElemAt: ['$category.image', 0] },
              },
            },
          },
        ],
        as: 'cards',
      },
    },
    {
      $project: {
        _id: 1,
        imageUrl: { $arrayElemAt: ['$image', 0] },
        title: '$title',
        description: '$description',
        shortDescription: '$shortDescription',
        cards: 1,
      },
    },
  ]);
};
export const fetchAllWorkshopsForAdmin = async (
  query: IGetAllQuery,
  skip: number,
  limit: number,
): Promise<IWorkshopModel[]> => {
  const dbQuery = {
    ...query,
    isDeleted: false,
  };
  return await workshopModel
    .find(dbQuery)
    .populate({
      path: 'categoryId',
      select: 'title image description -_id',
    })
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
export const fetchWorkshopById = async (id: string): Promise<IWorkshopModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await workshopModel
    .findOne(dbQuery)
    .populate({
      path: 'categoryId',
      select: 'title',
    })
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};

export const fetchWorkshopBySlug = async (slug: string): Promise<IWorkshopModel | null> => {
  const dbQuery = {
    slug: slug,
    isDeleted: false,
  };
  return await workshopModel
    .findOne(dbQuery)
    .populate({
      path: 'categoryId',
      select: 'title',
    })
    .select({ isDeleted: 0, updatedAt: 0, __v: 0 })
    .lean();
};

export const deleteWorkshopById = async (id: string): Promise<IWorkshopModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };
  return await workshopModel.findOneAndUpdate(dbQuery, { isDeleted: true });
};
// export const updateWorkshopById = async (
//   id: string,
//   data: IWorkshopBody,
// ): Promise<IWorkshopModel | null> => {
//   const dbQuery = {
//     _id: ObjectID(id),
//     isDeleted: false,
//   };
//   return await workshopModel.findOneAndUpdate(dbQuery, data);
// };

export const updateWorkshopById = async (
  id: string,
  data: IWorkshopBody,
): Promise<IWorkshopModel | null> => {
  const dbQuery = {
    _id: ObjectID(id),
    isDeleted: false,
  };

  const existing = await workshopModel.findOne(dbQuery);

  if (!existing) {
    throw new Error('Workshop not found');
  }

  const categoryId = data.categoryId || existing.categoryId;

  // Only validate when switching false → true
  if (data.showOnHomepage === true && existing.showOnHomepage !== true) {
    const count = await getHomepageWorkshopCountByCategory(categoryId.toString());

    if (count >= 3) {
      throw new Error('Only 4 workshops per category can be shown on homepage');
    }
  }

  return await workshopModel.findOneAndUpdate(dbQuery, data, { new: true });
};

// export const createWorkshop = async (data: IWorkshopBody): Promise<IWorkshopModel | null> => {
//   return await workshopModel.create(data);
// };
export const createWorkshop = async (data: IWorkshopBody): Promise<IWorkshopModel | null> => {
  if (data.showOnHomepage === true) {
    const count = await getHomepageWorkshopCountByCategory(data.categoryId as string);

    if (count >= 3) {
      throw new Error('Only 4 workshops per category can be shown on homepage');
    }
  }

  return await workshopModel.create(data);
};

const getHomepageWorkshopCountByCategory = async (categoryId: string): Promise<number> => {
  return workshopModel.countDocuments({
    categoryId: ObjectID(categoryId),
    showOnHomepage: true,
    isDeleted: false,
  });
};

export const fetchWorkshopAvailability = async (data: {
  workshopId: string;
  bookingDate: string;
  slotId: string;
  guests: number;
}) => {
  const { workshopId, bookingDate, slotId, guests } = data;

  const MIN_BOOKING = 2;

  //  Fetch workshop
  const workshop = await workshopModel.findOne({
    _id: ObjectID(workshopId),
    isDeleted: false,
    isActive: true,
  });

  if (!workshop) {
    throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
  }

  // Check non-availability date
  if (workshop.nonAvailabilityDates.includes(bookingDate)) {
    return {
      available: false,
      reason: 'Workshop not available on this date',
    };
  }

  //Check non-availability days

  const bookingDay = new Date(bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
  });

  if (workshop.nonAvailabilityDays.includes(bookingDay)) {
    return {
      available: false,
      reason: `Workshop not available on ${bookingDay}`,
    };
  }

  //  Validate slot
  const slot = workshop.defaultSlots.find((s: any) => s._id.toString() === slotId);

  if (!slot) {
    throw new AppError('Invalid slot selected', HttpStatus.BAD_REQUEST);
  }

  const MAX_CAPACITY = slot.capacity;

  //  Count confirmed people
  const aggregation = await workshopBookingModel.aggregate([
    {
      $match: {
        workshopId: ObjectID(workshopId),
        bookingDate: bookingDate,
        slotId: ObjectID(slotId),
        bookingStatus: { $in: ['confirmed', 'paid'] },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalPeople: { $sum: '$totalPeople' },
      },
    },
  ]);

  const existingPeople = aggregation.length > 0 ? aggregation[0].totalPeople : 0;

  const remainingCapacity = MAX_CAPACITY - existingPeople;

  //  Full
  if (remainingCapacity <= 0) {
    return { available: false, reason: 'Slot fully booked' };
  }

  //  Minimum booking rule
  if (guests < MIN_BOOKING) {
    return { available: false, reason: 'Minimum 2 guests required' };
  }

  //  Near full protection
  if (existingPeople >= 9) {
    return { available: false, reason: 'Slot blocked (near full)' };
  }

  //  Large booking rule
  if (guests >= 9) {
    // if (existingPeople === 0) {
    //   return {
    //     available: true,
    //     willBlockSlot: true,
    //     availableCount: 0,
    //   };
    // }
    if (existingPeople > 0) {
      return { available: false, reason: 'Not enough capacity' };
    }
  }

  //  Capacity overflow
  if (guests > remainingCapacity) {
    return {
      available: false,
      reason: `Only ${remainingCapacity} seats remaining`,
    };
  }

  return {
    available: true,
    availableCount: remainingCapacity,
  };
};

// export const fetchPotteryWorkshopAvailability = async (data: {
//   workshopId: string;
//   bookingDate: string;
//   slotId: string;
//   guests: number;
// }) => {
//   const { workshopId, bookingDate, slotId, guests } = data;

//   const MIN_BOOKING = 1;

//   //  Fetch workshop
//   const workshop = await workshopModel.findOne({
//     _id: ObjectID(workshopId),
//     isDeleted: false,
//     isActive: true,
//   });

//   if (!workshop) {
//     throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
//   }

//   // Check non-availability date
//   if (workshop.nonAvailabilityDates.includes(bookingDate)) {
//     return {
//       available: false,
//       reason: 'Workshop not available on this date',
//     };
//   }

//   //Check non-availability days

//   const bookingDay = new Date(bookingDate).toLocaleDateString('en-US', {
//     weekday: 'long',
//   });

//   if (workshop.nonAvailabilityDays.includes(bookingDay)) {
//     return {
//       available: false,
//       reason: `Workshop not available on ${bookingDay}`,
//     };
//   }

//   //  Validate slot
//   const slot = workshop.defaultSlots.find((s: any) => s._id.toString() === slotId);

//   if (!slot) {
//     throw new AppError('Invalid slot selected', HttpStatus.BAD_REQUEST);
//   }

//   const MAX_CAPACITY = slot.capacity;

//   //  Count confirmed people
//   const aggregation = await workshopBookingModel.aggregate([
//     {
//       $match: {
//         workshopId: ObjectID(workshopId),
//         bookingDate: bookingDate,
//         slotId: ObjectID(slotId),
//         bookingStatus: { $in: ['confirmed', 'paid'] },
//         isDeleted: false,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalPeople: { $sum: '$totalPeople' },
//       },
//     },
//   ]);

//   const existingPeople = aggregation.length > 0 ? aggregation[0].totalPeople : 0;

//   const remainingCapacity = MAX_CAPACITY - existingPeople;

//   //  Full
//   if (remainingCapacity <= 0) {
//     return { available: false, reason: 'Slot fully booked' };
//   }

//   //  Minimum booking rule
//   if (guests < MIN_BOOKING) {
//     return { available: false, reason: 'Minimum 1 guest required' };
//   }

//   //  Capacity overflow
//   if (guests > remainingCapacity) {
//     return {
//       available: false,
//       reason: `Only ${remainingCapacity} seats remaining`,
//     };
//   }

//   return {
//     available: true,
//     availableCount: remainingCapacity,
//   };
// };

export const fetchPotteryWorkshopAvailability = async (data: {
  workshopId: string;
  bookingDate: string;
  slotId: string;
  guests: number;
}) => {
  const { workshopId, bookingDate, slotId, guests } = data;

  const MIN_BOOKING = 1;

  // Fetch workshop
  const workshop = await workshopModel.findOne({
    _id: ObjectID(workshopId),
    isDeleted: false,
    isActive: true,
  });

  if (!workshop) {
    throw new AppError('Workshop not found', HttpStatus.NOT_FOUND);
  }

  // Validate slot
  const slot = workshop.defaultSlots.find((s: any) => s._id.toString() === slotId);

  if (!slot) {
    throw new AppError('Invalid slot selected', HttpStatus.BAD_REQUEST);
  }

  const MAX_CAPACITY = slot.capacity ?? 12;

  // Check non-availability date
  if (workshop.nonAvailabilityDates.includes(bookingDate)) {
    return {
      available: false,
      reason: 'Workshop not available on this date',
      totalCapacity: MAX_CAPACITY,
      bookedCount: 0,
      remainingCapacity: 0,
    };
  }

  // Check non-availability day
  const bookingDay = new Date(bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
  });

  if (workshop.nonAvailabilityDays.includes(bookingDay)) {
    return {
      available: false,
      reason: `Workshop not available on ${bookingDay}`,
      totalCapacity: MAX_CAPACITY,
      bookedCount: 0,
      remainingCapacity: 0,
    };
  }

  // Find all slots having the same start time
  const workshops = await workshopModel.find({
    isDeleted: false,
    isActive: true,
  });

  const matchingSlotIds = workshops.flatMap((workshop) =>
    workshop.defaultSlots.filter((s: any) => s.startTime === slot.startTime).map((s: any) => s._id),
  );

  // Count booked guests
  const aggregation = await workshopBookingModel.aggregate([
    {
      $match: {
        bookingDate,
        slotId: { $in: matchingSlotIds },
        bookingStatus: { $in: ['confirmed', 'paid'] },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalPeople: { $sum: '$totalPeople' },
      },
    },
  ]);

  const bookedCount = aggregation.length > 0 ? aggregation[0].totalPeople : 0;

  const remainingCapacity = Math.max(0, MAX_CAPACITY - bookedCount);

  // Minimum booking validation
  if (guests < MIN_BOOKING) {
    return {
      available: false,
      reason: 'Minimum 1 guest required',
      totalCapacity: MAX_CAPACITY,
      bookedCount,
      remainingCapacity,
    };
  }

  // Slot full
  if (remainingCapacity <= 0) {
    return {
      available: false,
      reason: 'Slot fully booked',
      totalCapacity: MAX_CAPACITY,
      bookedCount,
      remainingCapacity,
    };
  }

  // Not enough seats
  if (guests > remainingCapacity) {
    return {
      available: false,
      reason: `Only ${remainingCapacity} seats remaining`,
      totalCapacity: MAX_CAPACITY,
      bookedCount,
      remainingCapacity,
    };
  }

  // Available
  return {
    available: true,
    reason: null,
    totalCapacity: MAX_CAPACITY,
    bookedCount,
    remainingCapacity,
  };
};

export const getWorkshopByIdRepo = async (workshopId: string) => {
  return await workshopModel.findById(workshopId);
};

export const createWorkshopBookingRepo = async (data: any, session?: ClientSession) => {
  if (session) {
    const booking = await workshopBookingModel.create([data], { session });
    return booking[0];
  }

  return await workshopBookingModel.create(data);
};

// export const getSlotBookedCount = async (
//   workshopId: string,
//   bookingDate: string,
//   slotId: string,
// ): Promise<number> => {
//   const bookings = await workshopBookingModel.find({
//     workshopId,
//     bookingDate,
//     slotId,
//     bookingStatus: { $in: ['confirmed', 'paid'] },
//     isDeleted: false,
//   });

//   let total = 0;

//   bookings.forEach((b) => {
//     total += b.totalPeople;
//   });

//   return total;
// };

export const getSlotBookedCount = async (
  bookingDate: string,
  startTime: string,
): Promise<number> => {
  // Find all active workshops
  const workshops = await workshopModel.find({
    isDeleted: false,
    isActive: true,
  });

  // Get all slot ids having the same start time
  const matchingSlotIds = workshops.flatMap((workshop) =>
    workshop.defaultSlots
      .filter((slot: any) => slot.startTime === startTime)
      .map((slot: any) => slot._id),
  );

  const aggregation = await workshopBookingModel.aggregate([
    {
      $match: {
        bookingDate,
        slotId: {
          $in: matchingSlotIds,
        },
        bookingStatus: {
          $in: ['confirmed', 'paid'],
        },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalPeople: {
          $sum: '$totalPeople',
        },
      },
    },
  ]);

  return aggregation.length > 0 ? aggregation[0].totalPeople : 0;
};

export const createWorkshopOrderRepo = async (data: any, session?: ClientSession) => {
  if (session) {
    const order = await orderModel.create([data], { session });
    return order[0];
  }

  return await orderModel.create(data);
};

interface IUpdateOrderPaymentInput {
  paymentStatus: 'paid' | 'failed' | 'refunded';
  paymentId?: string;
}

export const updateOrderPaymentStatus = async (orderId: string, data: IUpdateOrderPaymentInput) => {
  const updatedOrder = await orderModel.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: data.paymentStatus,
      paymentId: data.paymentId,
    },
    { new: true },
  );

  return updatedOrder;
};

export const updateBookingsPaymentStatusByIds = async (
  bookingIds: any[],
  paymentStatus: 'paid' | 'failed' | 'refunded',
) => {
  return await workshopBookingModel.updateMany(
    { _id: { $in: bookingIds } },
    {
      paymentStatus: paymentStatus,
      bookingStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending',
    },
  );
};

export const getAllWorkshopBookings = async (filters: any, limit: number, page: number) => {
  const query: any = { isDeleted: false };

  if (filters.search) {
    query.$or = [
      { bookingNumber: { $regex: filters.search, $options: 'i' } },
      { 'customer.firstName': { $regex: filters.search, $options: 'i' } },
      { 'customer.lastName': { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters.bookingStatus && filters.bookingStatus !== 'All') {
    query.bookingStatus = filters.bookingStatus;
  }

  /* Payment Status */

  if (filters.paymentStatus && filters.paymentStatus !== 'All') {
    query.paymentStatus = filters.paymentStatus;
  }

  /* Date Range Filter */

  if (filters.startDate && filters.endDate) {
    query.bookingDate = {
      $gte: filters.startDate,
      $lte: filters.endDate,
    };
  }

  const skip = (page - 1) * limit;
  const data = await workshopBookingModel
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const totalCount = await workshopBookingModel.countDocuments(query);

  return {
    data,
    totalCount,
  };
};

export const fetchWorkshopBookingById = async (id: string) => {
  const booking: any = await workshopBookingModel
    .findOne({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    })

    .populate({
      path: 'workshopId',
      select: 'title defaultSlots',
    })
    .select({
      workshopId: 1,
      bookingDate: 1,
      bookingNumber: 1,
      items: 1,
      totalPeople: 1,
      totalAmount: 1,
      currency: 1,
      taxPercent: 1,
      taxAmount: 1,
      grandTotal: 1,
      bookingStatus: 1,
      paymentStatus: 1,
      bookingType: 1,
      makingType: 1,
      giftStatus: 1,
      giftDetails: 1,
      giftValidity: 1,
      customer: 1,
      slotId: 1,
      createdAt: 1,
    })
    .lean();

  if (!booking) return null;

  const workshop: any = booking.workshopId;

  // 🔹 Find slot details
  let slotStartTime = '';
  let slotEndTime = '';

  if (workshop?.defaultSlots && booking.slotId) {
    const slot = workshop.defaultSlots.find(
      (s: any) => s._id.toString() === booking.slotId.toString(),
    );

    slotStartTime = slot?.startTime || '';
    slotEndTime = slot?.endTime || '';
  }

  // 🔹 Optimized response
  const response = {
    _id: booking._id,
    bookingNumber: booking.bookingNumber,
    bookingDate: booking.bookingDate,

    workshopTitle: workshop?.title || '',

    slotStartTime,
    slotEndTime,

    items: booking.items,

    totalPeople: booking.totalPeople,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    taxPercent: booking.taxPercent,
    taxAmount: booking.taxAmount,
    grandTotal: booking.grandTotal,

    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,

    bookingType: booking.bookingType,
    makingType: booking.makingType,
    giftStatus: booking.giftStatus,
    giftDetails: booking.giftDetails,
    giftValidity: booking.giftValidity,

    customer: booking.customer,

    createdAt: booking.createdAt,
  };

  return response;
};

export const createCartRepo = async (data: Partial<ICartModel>) => {
  const cart = new cartModel(data);
  return await cart.save();
};

export const getCartByUserIdRepo = async (userId: string) => {
  return await cartModel
    .findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
    .populate({
      path: 'items.workshopId',
      select: 'title bannerImage images',
    });
};

export const clearCartRepo = async (userId: string) => {
  return await cartModel.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      items: [],
      totalPeople: 0,
      totalAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
    },
  );
};

// Bookingwith session
// export const fetchWorkshopBookingById = async (id: string) => {
//   const dbQuery = {
//     _id: new mongoose.Types.ObjectId(id),
//     isDeleted: false,
//   };

//   return await workshopBookingModel
//     .findOne(dbQuery)

//     .populate({
//       path: 'workshopId',
//       select: 'title slug duration',
//     })

//     .populate({
//       path: 'slotId',
//       select: 'startTime endTime',
//     })

//     .populate({
//       path: 'items.optionId',
//       select: 'title',
//     })

//     .populate({
//       path: 'userId',
//       select: 'firstName lastName email',
//     })

//     .select({
//       isDeleted: 0,
//       updatedAt: 0,
//       __v: 0,
//     })

//     .lean();
// };

export const getBookingsByIdsRepo = async (bookingIds: any[]) => {
  if (!bookingIds?.length) {
    return [];
  }

  return await workshopBookingModel.find({
    _id: { $in: bookingIds },
  });
};

export const getGiftBookingByIdRepo = async (bookingId: string) => {
  return workshopBookingModel.findOne({
    _id: bookingId,
    bookingType: 'gift',
    isDeleted: false,
  });
};

export const getBookingByVoucherCodeRepo = async (bookingId: string, voucherCode: string) => {
  return workshopBookingModel.findOne({
    _id: bookingId,
    'giftDetails.voucherCode': voucherCode,
    bookingType: 'gift',
    isDeleted: false,
  });
};

export const redeemGiftBookingRepo = async (
  bookingId: string,
  bookingDate: string,
  slotId: string,
) => {
  return workshopBookingModel.findByIdAndUpdate(
    bookingId,
    {
      $set: {
        bookingDate,
        slotId,
        giftStatus: 'redeemed',
        bookingStatus: 'confirmed',
      },
    },
    { new: true },
  );
};

export const fetchPotteryWorkshopCapacity = async (data: {
  bookingDate: string;
  startTime: string;
  endTime: string;
}) => {
  const { bookingDate, startTime } = data;

  // Find all active workshops
  const workshops = await workshopModel.find({
    isDeleted: false,
    isActive: true,
  });

  // Find all slot ids having the same start time
  const matchingSlotIds = workshops.flatMap((workshop) =>
    workshop.defaultSlots
      .filter((slot: any) => slot.startTime === startTime)
      .map((slot: any) => slot._id),
  );

  const MAX_CAPACITY = 12;

  const aggregation = await workshopBookingModel.aggregate([
    {
      $match: {
        bookingDate,
        slotId: {
          $in: matchingSlotIds,
        },
        bookingStatus: {
          $in: ['confirmed', 'paid'],
        },
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        bookedCount: {
          $sum: '$totalPeople',
        },
      },
    },
  ]);

  const bookedCount = aggregation.length > 0 ? aggregation[0].bookedCount : 0;

  const remainingCapacity = Math.max(0, MAX_CAPACITY - bookedCount);

  return {
    bookingDate,
    startTime,
    endTime: data.endTime,
    totalCapacity: MAX_CAPACITY,
    bookedCount,
    remainingCapacity,
  };
};
