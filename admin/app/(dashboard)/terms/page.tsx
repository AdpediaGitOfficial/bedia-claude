'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import type { TermsAndCondition } from '@/lib/types';
import { listTerms, createTerms, updateTerms, deleteTerms } from '@/services/content2.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function TermsPage() {
  const [rows, setRows] = useState<TermsAndCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TermsAndCondition | null>(null);
  const [form, setForm] = useState({ title: '', content: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listTerms());
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
    setForm({ title: '', content: '', isActive: true });
    setOpen(true);
  }
  function openEdit(t: TermsAndCondition) {
    setEditing(t);
    setForm({ title: t.title, content: t.content, isActive: t.isActive ?? true });
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateTerms(editing._id, form);
        toast.success('Updated');
      } else {
        await createTerms(form);
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

  async function onDelete(t: TermsAndCondition) {
    if (!confirm(`Delete "${t.title}"?`)) return;
    try {
      await deleteTerms(t._id);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<TermsAndCondition>[] = [
    { header: 'Title', cell: (t) => <span className="font-medium text-gray-900">{t.title}</span> },
    {
      header: 'Status',
      cell: (t) => (t.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (t) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(t)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Terms &amp; Conditions</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No terms yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit' : 'New'} wide>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Content * (HTML supported)</Label>
            <Textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
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
