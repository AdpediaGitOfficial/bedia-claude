'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge, Input } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Booking } from '@/lib/types';
import { listBookings, updateBookingStatus } from '@/services/booking.service';

const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function paymentColor(s?: string) {
  return s === 'paid' ? 'green' : s === 'failed' ? 'red' : s === 'refunded' ? 'blue' : 'yellow';
}

export default function BookingsPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { bookings } = await listBookings({ search, bookingStatus: status || undefined });
      setRows(bookings);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function changeStatus(b: Booking, bookingStatus: string) {
    try {
      await updateBookingStatus(b._id, { bookingStatus });
      toast.success('Booking status updated');
      setRows((prev) =>
        prev.map((r) => (r._id === b._id ? { ...r, bookingStatus: bookingStatus as Booking['bookingStatus'] } : r)),
      );
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Booking>[] = [
    {
      header: 'Booking #',
      cell: (b) => <span className="font-medium text-gray-900">{b.bookingNumber ?? '—'}</span>,
    },
    {
      header: 'Customer',
      cell: (b) => (
        <div>
          <div className="text-gray-900">
            {[b.customer?.firstName, b.customer?.lastName].filter(Boolean).join(' ') || '—'}
          </div>
          <div className="text-xs text-gray-400">{b.customer?.email}</div>
        </div>
      ),
    },
    { header: 'Date', cell: (b) => (b.bookingDate ? formatDate(b.bookingDate) : '—') },
    { header: 'People', cell: (b) => b.totalPeople ?? '—' },
    { header: 'Amount', cell: (b) => formatCurrency(b.grandTotal ?? b.totalAmount, b.currency ?? 'AED') },
    {
      header: 'Payment',
      cell: (b) => <Badge color={paymentColor(b.paymentStatus)}>{b.paymentStatus ?? '—'}</Badge>,
    },
    {
      header: 'Booking status',
      cell: (b) => (
        <select
          value={b.bookingStatus ?? 'pending'}
          onChange={(e) => changeStatus(b, e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand focus:ring-1 focus:ring-brand"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Bookings</h1>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Search booking # or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
        >
          <option value="">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No bookings found." />
    </div>
  );
}
