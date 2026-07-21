'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button, Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { Workshop } from '@/lib/types';
import { listWorkshops, deleteWorkshop } from '@/services/workshop.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function WorkshopsPage() {
  const [rows, setRows] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { workshops } = await listWorkshops();
      setRows(workshops);
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(w: Workshop) {
    if (!confirm(`Delete workshop "${w.title}"?`)) return;
    try {
      await deleteWorkshop(w._id);
      toast.success('Workshop deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Workshop>[] = [
    { header: 'Title', cell: (w) => <span className="font-medium text-gray-900">{w.title}</span> },
    {
      header: 'Packages',
      cell: (w) => <span className="text-gray-500">{w.options?.length ?? 0}</span>,
    },
    {
      header: 'From price',
      cell: (w) => formatCurrency(w.options?.[0]?.price, w.options?.[0]?.currency ?? 'AED'),
    },
    {
      header: 'Homepage',
      cell: (w) => (w.showOnHomepage ? <Badge color="blue">Yes</Badge> : <span className="text-gray-400">No</span>),
    },
    {
      header: 'Status',
      cell: (w) => (w.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (w) => (
        <div className="flex justify-end gap-2">
          <Link href={`/workshops/${w._id}`} className="text-gray-400 hover:text-brand" title="Edit">
            <Pencil className="h-4 w-4" />
          </Link>
          <button onClick={() => onDelete(w)} className="text-gray-400 hover:text-red-600" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Workshops / Packages</h1>
        <Link href="/workshops/new">
          <Button>
            <Plus className="h-4 w-4" /> New Workshop
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No workshops yet." />
    </div>
  );
}
