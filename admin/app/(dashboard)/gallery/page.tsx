'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { ImageUpload } from '@/components/ImageUpload';
import { apiError } from '@/lib/api';
import type { Gallery } from '@/lib/types';
import { listGalleries, createGallery, updateGallery, deleteGallery } from '@/services/content.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function GalleryPage() {
  const [rows, setRows] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listGalleries());
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
    setTitle('');
    setDescription('');
    setImages([]);
    setIsActive(true);
    setOpen(true);
  }
  function openEdit(g: Gallery) {
    setEditing(g);
    setTitle(g.title);
    setDescription(g.description ?? '');
    setImages(g.images ?? []);
    setIsActive(g.isActive ?? true);
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('At least one image is required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { title, description, images, isActive };
      if (editing) {
        await updateGallery(editing._id, payload);
        toast.success('Gallery updated');
      } else {
        await createGallery(payload);
        toast.success('Gallery created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(g: Gallery) {
    if (!confirm(`Delete gallery "${g.title}"?`)) return;
    try {
      await deleteGallery(g._id);
      toast.success('Gallery deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Gallery>[] = [
    { header: 'Title', cell: (g) => <span className="font-medium text-gray-900">{g.title}</span> },
    { header: 'Images', cell: (g) => g.images?.length ?? 0 },
    {
      header: 'Status',
      cell: (g) => (g.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (g) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(g)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(g)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Gallery</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Gallery</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No galleries yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Gallery' : 'New Gallery'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Images *</Label>
            <ImageUpload images={images} onChange={setImages} max={20} location="gallery" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
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
