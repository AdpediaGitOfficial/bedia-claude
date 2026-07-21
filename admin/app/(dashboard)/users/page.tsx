'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { AdminUserRow } from '@/lib/types';
import { listUsers, deleteUser } from '@/services/content2.service';
import { Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listUsers());
    } catch (e) {
      // 404 from the API means "no users" — treat as empty, not an error.
      setRows([]);
      const msg = apiError(e);
      if (!/no users/i.test(msg)) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(u: AdminUserRow) {
    if (!confirm(`Delete user "${u.fullName || u.name || u.email}"?`)) return;
    try {
      await deleteUser(u._id);
      toast.success('User deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<AdminUserRow>[] = [
    { header: 'Name', cell: (u) => <span className="font-medium text-gray-900">{u.fullName || u.name || '—'}</span> },
    { header: 'Email', cell: (u) => <span className="text-gray-500">{u.email || '—'}</span> },
    { header: 'Mobile', cell: (u) => (u.mobileNumber ? String(u.mobileNumber) : '—') },
    { header: 'Role', cell: (u) => <Badge color={u.role === 'admin' ? 'blue' : 'gray'}>{u.role ?? 'user'}</Badge> },
    { header: 'Joined', cell: (u) => formatDate(u.createdAt) },
    {
      header: '',
      className: 'text-right',
      cell: (u) => (
        <button onClick={() => onDelete(u)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Users</h1>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No users found." />
    </div>
  );
}
