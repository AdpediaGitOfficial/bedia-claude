'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Badge, Input, Label, Modal, Textarea } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { apiError } from '@/lib/api';
import type { Faq } from '@/lib/types';
import { listFaqs, createFaq, updateFaq, deleteFaq } from '@/services/content.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function FaqsPage() {
  const [rows, setRows] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listFaqs());
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
    setQuestion('');
    setAnswer('');
    setCategory('');
    setIsActive(true);
    setOpen(true);
  }
  function openEdit(f: Faq) {
    setEditing(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category ?? '');
    setIsActive(f.isActive ?? true);
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { question, answer, category, isActive };
      if (editing) {
        await updateFaq(editing._id, payload);
        toast.success('FAQ updated');
      } else {
        await createFaq(payload);
        toast.success('FAQ created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(f: Faq) {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await deleteFaq(f._id);
      toast.success('FAQ deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Faq>[] = [
    { header: 'Question', cell: (f) => <span className="font-medium text-gray-900">{f.question}</span> },
    { header: 'Category', cell: (f) => <span className="text-gray-500">{f.category ?? '—'}</span> },
    {
      header: 'Status',
      cell: (f) => (f.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>),
    },
    {
      header: '',
      className: 'text-right',
      cell: (f) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(f)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(f)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">FAQs</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New FAQ</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No FAQs yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit FAQ' : 'New FAQ'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Question *</Label>
            <Input required value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div>
            <Label>Answer *</Label>
            <Textarea required rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
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
