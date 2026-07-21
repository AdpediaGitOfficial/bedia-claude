'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import type { Category } from '@/lib/types';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryInput,
} from '@/services/category.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

const EMPTY: CategoryInput = {
  title: '',
  shortDescription: '',
  description: '',
  image: [],
  showOnHomepage: false,
  isActive: true,
};

export default function CategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);
  const [imageStr, setImageStr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { categories } = await listCategories(1, 100);
      setRows(categories);
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
    setImageStr('');
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      title: c.title,
      shortDescription: c.shortDescription ?? '',
      description: c.description ?? '',
      image: c.image ?? [],
      showOnHomepage: c.showOnHomepage ?? false,
      isActive: c.isActive ?? true,
    });
    setImageStr((c.image ?? []).join(', '));
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: CategoryInput = {
        ...form,
        image: imageStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (editing) {
        await updateCategory(editing._id, payload);
        toast.success('Category updated');
      } else {
        await createCategory(payload);
        toast.success('Category created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(c: Category) {
    if (!confirm(`Delete category "${c.title}"?`)) return;
    try {
      await deleteCategory(c._id);
      toast.success('Category deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Category>[] = [
    { header: 'Title', cell: (c) => <span className="font-medium text-gray-900">{c.title}</span> },
    { header: 'Slug', cell: (c) => <span className="text-gray-500">{c.slug ?? '—'}</span> },
    {
      header: 'Homepage',
      cell: (c) => (c.showOnHomepage ? <Badge color="blue">Yes</Badge> : <span className="text-gray-400">No</span>),
    },
    {
      header: 'Status',
      cell: (c) =>
        c.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>,
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
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} empty="No categories yet." />

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
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
            <Label>Image URLs (comma-separated)</Label>
            <Input value={imageStr} onChange={(e) => setImageStr(e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.showOnHomepage}
                onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
              />
              Show on homepage
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>
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
