'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { ImageUpload } from '@/components/ImageUpload';
import { apiError } from '@/lib/api';
import type { ClayType } from '@/lib/types';
import {
  listClayTypes,
  createClayType,
  updateClayType,
  deleteClayType,
  type ClayTypeInput,
} from '@/services/clayType.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

const EMPTY: ClayTypeInput = { title: '', shortDescription: '', description: '', image: [], isActive: true };

export default function ClayTypesPage() {
  const [rows, setRows] = useState<ClayType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClayType | null>(null);
  const [form, setForm] = useState<ClayTypeInput>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { clayTypes } = await listClayTypes();
      setRows(clayTypes);
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
    setForm(EMPTY);
    setImages([]);
    setOpen(true);
  }
  function openEdit(c: ClayType) {
    setEditing(c);
    setForm({
      title: c.title,
      shortDescription: c.shortDescription ?? '',
      description: c.description ?? '',
      image: c.image ?? [],
      isActive: c.isActive ?? true,
    });
    setImages(c.image ?? []);
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: ClayTypeInput = {
        ...form,
        image: images,
      };
      if (editing) {
        await updateClayType(editing._id, payload);
        toast.success('Clay type updated');
      } else {
        await createClayType(payload);
        toast.success('Clay type created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(c: ClayType) {
    if (!confirm(`Delete clay type "${c.title}"?`)) return;
    try {
      await deleteClayType(c._id);
      toast.success('Clay type deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<ClayType>[] = [
    { header: 'Title', cell: (c) => <span className="font-medium text-gray-900">{c.title}</span> },
    { header: 'Short description', cell: (c) => <span className="text-gray-500">{c.shortDescription ?? '—'}</span> },
    {
      header: 'Status',
      cell: (c) => (c.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (c) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(c)} className="text-gray-400 hover:text-red-600" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clay Types</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Clay Type
        </Button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} empty="No clay types yet." />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Clay Type' : 'New Clay Type'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Short description</Label>
            <Input
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Images</Label>
            <ImageUpload images={images} onChange={setImages} max={5} location="clay-types" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
