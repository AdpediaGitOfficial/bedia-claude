'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/lib/types';
import { listOrders } from '@/services/order.service';

function paymentColor(s?: string) {
  return s === 'paid' ? 'green' : s === 'failed' ? 'red' : s === 'refunded' ? 'blue' : 'yellow';
}

export default function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { orders } = await listOrders();
      setRows(orders);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns: Column<Order>[] = [
    { header: 'Order #', cell: (o) => <span className="font-medium text-gray-900">{o.orderNumber ?? '—'}</span> },
    { header: 'Items', cell: (o) => o.items?.length ?? 0 },
    { header: 'Amount', cell: (o) => formatCurrency(o.grandTotal, o.currency ?? 'AED') },
    { header: 'Payment', cell: (o) => <Badge color={paymentColor(o.paymentStatus)}>{o.paymentStatus ?? '—'}</Badge> },
    { header: 'Created', cell: (o) => formatDate(o.createdAt) },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Orders</h1>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No orders found." />
    </div>
  );
}
