'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { ImageUpload } from '@/components/ImageUpload';
import { apiError } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/lib/types';
import { listBlogs, createBlog, updateBlog, deleteBlog } from '@/services/content2.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

const EMPTY = { title: '', content: '', bannerImage: '', category: '', writtenBy: '', metaTitle: '', metaDescription: '' };

export default function BlogPage() {
  const [rows, setRows] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listBlogs());
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
    setForm({ ...EMPTY });
    setOpen(true);
  }
  function openEdit(b: Blog) {
    setEditing(b);
    setForm({
      title: b.title,
      content: b.content,
      bannerImage: b.bannerImage ?? '',
      category: b.category ?? '',
      writtenBy: b.writtenBy ?? '',
      metaTitle: b.metaTitle ?? '',
      metaDescription: b.metaDescription ?? '',
    });
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bannerImage) {
      toast.error('Banner image is required.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateBlog(editing._id, form);
        toast.success('Blog updated');
      } else {
        await createBlog(form);
        toast.success('Blog created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(b: Blog) {
    if (!confirm(`Delete blog "${b.title}"?`)) return;
    try {
      await deleteBlog(b._id);
      toast.success('Blog deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Blog>[] = [
    { header: 'Title', cell: (b) => <span className="font-medium text-gray-900">{b.title}</span> },
    { header: 'Category', cell: (b) => <span className="text-gray-500">{b.category ?? '—'}</span> },
    { header: 'Author', cell: (b) => <span className="text-gray-500">{b.writtenBy ?? '—'}</span> },
    { header: 'Created', cell: (b) => formatDate(b.createdAt) },
    {
      header: '',
      className: 'text-right',
      cell: (b) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(b)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(b)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Blog</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No blog posts yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Post' : 'New Post'} wide>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Title *</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Written by *</Label>
              <Input required value={form.writtenBy} onChange={(e) => setForm({ ...form, writtenBy: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Banner image *</Label>
            <ImageUpload
              images={form.bannerImage ? [form.bannerImage] : []}
              onChange={(urls) => setForm({ ...form, bannerImage: urls[0] ?? '' })}
              max={1}
              location="blog"
            />
          </div>
          <div>
            <Label>Content * (HTML supported)</Label>
            <Textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <Label>Meta title</Label>
              <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
            </div>
            <div>
              <Label>Meta description</Label>
              <Input value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
