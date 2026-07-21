'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Lead } from '@/lib/types';
import { listLeads } from '@/services/content2.service';

const TYPES = ['property', 'contact', 'consultation', 'community'];

// Fields we don't want to show in the "details" blob.
const HIDE = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

function pick(lead: Lead, keys: string[]): string {
  for (const k of keys) {
    const v = lead[k];
    if (v != null && v !== '') return String(v);
  }
  return '—';
}

export default function LeadsPage() {
  const [type, setType] = useState('contact');
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { leads } = await listLeads(type);
      setRows(leads);
    } catch (e) {
      toast.error(apiError(e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: Column<Lead>[] = [
    { header: 'Name', cell: (l) => <span className="font-medium text-gray-900">{pick(l, ['name', 'fullName', 'firstName'])}</span> },
    { header: 'Email', cell: (l) => <span className="text-gray-500">{pick(l, ['email'])}</span> },
    { header: 'Phone', cell: (l) => pick(l, ['phone', 'mobile', 'mobileNumber']) },
    {
      header: 'Details',
      cell: (l) => {
        const extra = Object.entries(l)
          .filter(([k, v]) => !HIDE.has(k) && v != null && v !== '')
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join(' · ');
        return <span className="line-clamp-2 text-xs text-gray-500">{extra || '—'}</span>;
      },
    },
    { header: 'Received', cell: (l) => formatDate(l.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm capitalize focus:border-brand focus:ring-1 focus:ring-brand"
        >
          {TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty={`No ${type} leads.`} />
    </div>
  );
}
