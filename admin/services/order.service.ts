import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

export async function listOrders(
  filters: { search?: string; paymentStatus?: string } = {},
  page = 1,
  limit = 50,
) {
  const { data } = await api.get('/workshop/orders/all', { params: { ...filters, page, limit } });
  return {
    orders: (data.result?.data ?? []) as Order[],
    totalCount: data.result?.totalCount ?? 0,
  };
}
