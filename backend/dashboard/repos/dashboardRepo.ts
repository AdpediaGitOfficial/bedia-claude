import usersModel from '../../user/models/userModel';
import orderModel from '../../workshop/models/workshopOrders';
import workshopBookingModel from '../../workshop/models/workshopBookingModel';

export const getTotalUsers = async (): Promise<number> => {
  return usersModel.countDocuments({ role: 'user', isDeleted: false });
};

export const getNewUsersThisMonth = async (): Promise<number> => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return usersModel.countDocuments({
    role: 'user',
    isDeleted: false,
    createdAt: { $gte: start, $lt: end },
  });
};

export const getCurrentMonthRevenue = async (): Promise<number> => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const result = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        isDeleted: false,
        createdAt: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);
  return result[0]?.total ?? 0;
};

export const getPreviousMonthRevenue = async (): Promise<number> => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const result = await orderModel.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        isDeleted: false,
        createdAt: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);
  return result[0]?.total ?? 0;
};

export const getTotalBookings = async (): Promise<number> => {
  return workshopBookingModel.countDocuments({ isDeleted: false });
};

export const getTotalOrders = async (): Promise<number> => {
  return orderModel.countDocuments({ isDeleted: false });
};

export const getDailyNewUsersThisMonth = async (): Promise<{ date: string; count: number }[]> => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await usersModel.aggregate([
    {
      $match: {
        role: 'user',
        isDeleted: false,
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', count: 1 } },
  ]);
  return result;
};
