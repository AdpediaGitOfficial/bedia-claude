import { api } from '@/lib/api';
import type { Booking } from '@/lib/types';

export interface BookingFilters {
  search?: string;
  bookingStatus?: string;
  paymentStatus?: string;
}

export async function listBookings(filters: BookingFilters = {}, page = 1, limit = 50) {
  const { data } = await api.get('/workshop/bookings/all', { params: { ...filters, page, limit } });
  return {
    bookings: (data.result?.data ?? []) as Booking[],
    totalCount: data.result?.totalCount ?? 0,
  };
}

export async function updateBookingStatus(
  id: string,
  patch: { bookingStatus?: string; paymentStatus?: string },
) {
  const { data } = await api.patch(`/workshop/workshop-booking/${id}/status`, patch);
  return data;
}
