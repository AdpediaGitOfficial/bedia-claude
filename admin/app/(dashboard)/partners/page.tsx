'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, Label, Modal } from '@/components/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { ImageUpload } from '@/components/ImageUpload';
import { apiError } from '@/lib/api';
import type { Partner } from '@/lib/types';
import { listPartners, createPartner, updatePartner, deletePartner } from '@/services/content.service';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function PartnersPage() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listPartners());
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
    setName('');
    setLogo('');
    setWebsiteUrl('');
    setOpen(true);
  }
  function openEdit(p: Partner) {
    setEditing(p);
    setName(p.name);
    setLogo(p.logo ?? '');
    setWebsiteUrl(p.websiteUrl ?? '');
    setOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!logo) {
      toast.error('Logo is required.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name, logo, websiteUrl };
      if (editing) {
        await updatePartner(editing._id, payload);
        toast.success('Partner updated');
      } else {
        await createPartner(payload);
        toast.success('Partner created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p: Partner) {
    if (!confirm(`Delete partner "${p.name}"?`)) return;
    try {
      await deletePartner(p._id);
      toast.success('Partner deleted');
      load();
    } catch (e) {
      toast.error(apiError(e));
    }
  }

  const columns: Column<Partner>[] = [
    {
      header: 'Logo',
      cell: (p) =>
        p.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logo} alt="" className="h-8 w-8 rounded object-contain" />
        ) : (
          '—'
        ),
    },
    { header: 'Name', cell: (p) => <span className="font-medium text-gray-900">{p.name}</span> },
    {
      header: 'Website',
      cell: (p) =>
        p.websiteUrl ? (
          <a href={p.websiteUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">
            {p.websiteUrl}
          </a>
        ) : (
          '—'
        ),
    },
    {
      header: '',
      className: 'text-right',
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(p)} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Partners</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Partner</Button>
      </div>
      <DataTable columns={columns} rows={rows} loading={loading} empty="No partners yet." />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Partner' : 'New Partner'}>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Website URL</Label>
            <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div>
            <Label>Logo *</Label>
            <ImageUpload
              images={logo ? [logo] : []}
              onChange={(urls) => setLogo(urls[0] ?? '')}
              max={1}
              location="partners"
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
