import {
  getTotalUsers,
  getNewUsersThisMonth,
  getCurrentMonthRevenue,
  getPreviousMonthRevenue,
  getTotalBookings,
  getTotalOrders,
  getDailyNewUsersThisMonth,
} from '../repos/dashboardRepo';

export const getDashboardStatsUseCase = async () => {
  const [
    totalUsers,
    newUsersThisMonth,
    currentMonthRevenue,
    previousMonthRevenue,
    totalBookings,
    totalOrders,
  ] = await Promise.all([
    getTotalUsers(),
    getNewUsersThisMonth(),
    getCurrentMonthRevenue(),
    getPreviousMonthRevenue(),
    getTotalBookings(),
    getTotalOrders(),
  ]);

  let growthPercentage = 0;
  if (previousMonthRevenue > 0) {
    growthPercentage = parseFloat(
      (((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(2),
    );
  } else if (currentMonthRevenue > 0) {
    growthPercentage = 100;
  }

  return {
    totalUsers,
    newUsersThisMonth,
    currentMonthRevenue,
    previousMonthRevenue,
    growthPercentage,
    totalBookings,
    totalOrders,
  };
};

export const getDailyNewUsersChartUseCase = async () => {
  return getDailyNewUsersThisMonth();
};
