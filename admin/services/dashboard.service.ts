import { api } from '@/lib/api';

export interface DashboardStats {
  totalUsers: number;
  newUsersThisMonth: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthPercentage: number;
  totalBookings: number;
  totalOrders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/dashboard/stats');
  return data.result;
}
