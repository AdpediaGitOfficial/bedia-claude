'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import type { OpeningHours } from '@/lib/types';
import {
  listOpeningHours,
  createOpeningHours,
  updateOpeningHours,
  deleteOpeningHours,
} from '@/services/content2.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function OpeningHoursPage() {
  const [rows, setRows] = useState<OpeningHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OpeningHours | null>(null);
  const [form, setForm] = useState({ title: 'Opening Hours', days: '', openTime: '', closeTime: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listOpeningHours());
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ title: 'Opening Hours', days: '', openTime: '', closeTime: '', isActive: true });
    setOpen(true);
  }
  function openEdit(o: OpeningHours) {
    setEditing(o);
    setForm({
      title: o.title ?? 'Opening Hours',
      days: o.days,
      openTime: o.openTime,
      closeTime: o.closeTime,
      isActive: o.isActive ?? true,
    });
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateOpeningHours(editing._id, form);
        toast.success('Updated');
      } else {
        await createOpeningHours(form);
        toast.success('Created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(o: OpeningHours) {
    if (!confirm(`Delete "${o.days}"?`)) return;
    try {
      await deleteOpeningHours(o._id);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<OpeningHours>[] = [
    { header: 'Days', cell: (o) => <span className="font-medium text-gray-900">{o.days}</span> },
    { header: 'Open', cell: (o) => o.openTime },
    { header: 'Close', cell: (o) => o.closeTime },
    {
      header: 'Status',
      cell: (o) => (o.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (o) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(o)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(o)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Opening Hours</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No opening hours yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit' : 'New'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Days *</Label>
            <Input required value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} placeholder="Mon – Fri" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Open time *</Label>
              <Input required value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} placeholder="10:00" />
            </div>
            <div>
              <Label>Close time *</Label>
              <Input required value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} placeholder="20:00" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
