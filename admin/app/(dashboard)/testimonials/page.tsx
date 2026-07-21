'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { ImageUpload } from '@/components/ImageUpload';
import { apiError } from '@/lib/api';
import type { Testimonial } from '@/lib/types';
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/services/content.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function TestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [designation, setDesignation] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listTestimonials());
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
    setContent('');
    setAuthor('');
    setDesignation('');
    setAuthorImage('');
    setOpen(true);
  }
  function openEdit(t: Testimonial) {
    setEditing(t);
    setContent(t.content);
    setAuthor(t.author);
    setDesignation(t.designation ?? '');
    setAuthorImage(t.authorImage ?? '');
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { content, author, designation, authorImage };
      if (editing) {
        await updateTestimonial(editing._id, payload);
        toast.success('Testimonial updated');
      } else {
        await createTestimonial(payload);
        toast.success('Testimonial created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(t: Testimonial) {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await deleteTestimonial(t._id);
      toast.success('Testimonial deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Testimonial>[] = [
    { header: 'Author', cell: (t) => <span className="font-medium text-gray-900">{t.author}</span> },
    { header: 'Designation', cell: (t) => <span className="text-gray-500">{t.designation ?? '—'}</span> },
    { header: 'Content', cell: (t) => <span className="line-clamp-1 text-gray-500">{t.content}</span> },
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
        <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Testimonial</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No testimonials yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Content *</Label>
            <Textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Author *</Label>
              <Input required value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
              <Label>Designation</Label>
              <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Author image</Label>
            <ImageUpload
              images={authorImage ? [authorImage] : []}
              onChange={(urls) => setAuthorImage(urls[0] ?? '')}
              max={1}
              location="testimonials"
            />
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
