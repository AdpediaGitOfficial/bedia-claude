'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import type { GoogleReview } from '@/lib/types';
import { listReviews, updateReview, deleteReview, syncReviews } from '@/services/content2.service';
import { Trash2, RefreshCw, Star } from 'lucide-react';

export default function ReviewsPage() {
  const [rows, setRows] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listReviews());
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSync() {
    setSyncing(true);
    try {
      await syncReviews();
      toast.success('Synced from Google');
      load();
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setSyncing(false);
    }
  }

  async function toggleActive(r: GoogleReview) {
    try {
      await updateReview(r._id, { isActive: !r.isActive });
      setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, isActive: !x.isActive } : x)));
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  async function onDelete(r: GoogleReview) {
    if (!confirm(`Delete review by ${r.authorName}?`)) return;
    try {
      await deleteReview(r._id);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<GoogleReview>[] = [
    { header: 'Author', cell: (r) => <span className="font-medium text-gray-900">{r.authorName}</span> },
    {
      header: 'Rating',
      cell: (r) => (
        <span className="inline-flex items-center gap-1 text-amber-500">
          {r.rating} <Star className="h-3.5 w-3.5 fill-current" />
        </span>
      ),
    },
    { header: 'Text', cell: (r) => <span className="line-clamp-1 text-gray-500">{r.text || '—'}</span> },
    { header: 'Source', cell: (r) => <Badge color={r.source === 'manual' ? 'blue' : 'gray'}>{r.source ?? 'google'}</Badge> },
    {
      header: 'Visible',
      cell: (r) => (
        <button onClick={() => toggleActive(r)}>
          {r.isActive ? <Badge color="green">Shown</Badge> : <Badge color="gray">Hidden</Badge>}
        </button>
      ),
    },
    {
      header: '',
      className: 'text-right',
      cell: (r) => (
        <button onClick={() => onDelete(r)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Google Reviews</h1>
        <Button onClick={onSync} loading={syncing} variant="secondary">
          <RefreshCw className="h-4 w-4" /> Sync from Google
        </Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No reviews yet." />
    </div>
  );
}
