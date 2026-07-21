'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Input, Label, Textarea } from '@/components/ui';
import { ImageUpload } from '@/components/ImageUpload';
import type { Category, ClayType, Workshop, WorkshopOption, WorkshopSlot } from '@/lib/types';
import { listCategories } from '@/services/category.service';
import { listClayTypes } from '@/services/clayType.service';
import type { WorkshopInput } from '@/services/workshop.service';
import { Plus, Trash2 } from 'lucide-react';

function emptyOption(): WorkshopOption {
  return { title: '', price: 0, currency: 'AED', clayTypeId: '', priceDescription: '', description: '', inclusions: [], image: '' };
}
function emptySlot(): WorkshopSlot {
  return { label: '', startTime: '', endTime: '', capacity: 12 };
}

export function WorkshopForm({
  initial,
  submitting,
  onSubmit,
}: {
  initial?: Workshop;
  submitting?: boolean;
  onSubmit: (input: WorkshopInput) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [clayTypes, setClayTypes] = useState<ClayType[]>([]);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [overview, setOverview] = useState(initial?.overview ?? '');
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage ?? '');
  const [categoryId, setCategoryId] = useState(
    typeof initial?.categoryId === 'object' ? initial?.categoryId?._id ?? '' : (initial?.categoryId as string) ?? '',
  );
  const [type, setType] = useState(initial?.type ?? '');
  const [showOnHomepage, setShowOnHomepage] = useState(initial?.showOnHomepage ?? false);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [options, setOptions] = useState<WorkshopOption[]>(initial?.options?.length ? initial.options : [emptyOption()]);
  const [slots, setSlots] = useState<WorkshopSlot[]>(initial?.defaultSlots ?? []);

  useEffect(() => {
    listCategories(1, 200).then((r) => setCategories(r.categories)).catch(() => {});
    listClayTypes(1, 200).then((r) => setClayTypes(r.clayTypes)).catch(() => {});
  }, []);

  function updateOption(i: number, patch: Partial<WorkshopOption>) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  }
  function updateSlot(i: number, patch: Partial<WorkshopSlot>) {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: WorkshopInput = {
      title,
      shortDescription,
      description,
      overview: overview || undefined,
      bannerImage: bannerImage || undefined,
      categoryId,
      type: type || undefined,
      showOnHomepage,
      isActive,
      options: options
        .filter((o) => o.title.trim())
        .map((o) => ({
          ...o,
          price: Number(o.price) || 0,
          clayTypeId: o.clayTypeId || undefined,
          inclusions: (o.inclusions ?? []).filter(Boolean),
        })),
      defaultSlots: slots.filter((s) => s.label.trim()),
    };
    onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="space-y-4 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Title *</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Category *</Label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label>Short description *</Label>
          <Input required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div>
          <Label>Description *</Label>
          <Textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label>Overview</Label>
          <Textarea rows={2} value={overview} onChange={(e) => setOverview(e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Banner image</Label>
            <ImageUpload
              images={bannerImage ? [bannerImage] : []}
              onChange={(urls) => setBannerImage(urls[0] ?? '')}
              max={1}
              location="workshops"
            />
          </div>
          <div>
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. pottery / normal" />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} />
            Show on homepage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
        </div>
      </Card>

      {/* Packages / options */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Packages (options)</h2>
          <Button type="button" variant="secondary" onClick={() => setOptions([...options, emptyOption()])}>
            <Plus className="h-4 w-4" /> Add package
          </Button>
        </div>
        {options.map((o, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Package #{i + 1}</span>
              {options.length > 1 && (
                <button type="button" onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label>Title *</Label>
                <Input value={o.title} onChange={(e) => updateOption(i, { title: e.target.value })} />
              </div>
              <div>
                <Label>Price *</Label>
                <Input type="number" value={o.price} onChange={(e) => updateOption(i, { price: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Currency</Label>
                <Input value={o.currency ?? 'AED'} onChange={(e) => updateOption(i, { currency: e.target.value })} />
              </div>
              <div>
                <Label>Clay type</Label>
                <select
                  value={o.clayTypeId ?? ''}
                  onChange={(e) => updateOption(i, { clayTypeId: e.target.value })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand"
                >
                  <option value="">—</option>
                  {clayTypes.map((ct) => (
                    <option key={ct._id} value={ct._id}>
                      {ct.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Price description</Label>
                <Input value={o.priceDescription ?? ''} onChange={(e) => updateOption(i, { priceDescription: e.target.value })} />
              </div>
              <div>
                <Label>Image</Label>
                <ImageUpload
                  images={o.image ? [o.image] : []}
                  onChange={(urls) => updateOption(i, { image: urls[0] ?? '' })}
                  max={1}
                  location="workshops"
                />
              </div>
              <div className="md:col-span-3">
                <Label>Inclusions (comma-separated)</Label>
                <Input
                  value={(o.inclusions ?? []).join(', ')}
                  onChange={(e) => updateOption(i, { inclusions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Slots */}
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Default slots</h2>
          <Button type="button" variant="secondary" onClick={() => setSlots([...slots, emptySlot()])}>
            <Plus className="h-4 w-4" /> Add slot
          </Button>
        </div>
        {slots.length === 0 && <p className="text-sm text-gray-400">No slots. Add one if this workshop has fixed time slots.</p>}
        {slots.map((s, i) => (
          <div key={i} className="grid items-end gap-3 md:grid-cols-5">
            <div>
              <Label>Label</Label>
              <Input value={s.label} onChange={(e) => updateSlot(i, { label: e.target.value })} placeholder="Morning" />
            </div>
            <div>
              <Label>Start</Label>
              <Input value={s.startTime} onChange={(e) => updateSlot(i, { startTime: e.target.value })} placeholder="10:00" />
            </div>
            <div>
              <Label>End</Label>
              <Input value={s.endTime} onChange={(e) => updateSlot(i, { endTime: e.target.value })} placeholder="12:00" />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" value={s.capacity ?? 12} onChange={(e) => updateSlot(i, { capacity: Number(e.target.value) })} />
            </div>
            <button type="button" onClick={() => setSlots(slots.filter((_, idx) => idx !== i))} className="mb-2 text-gray-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={submitting}>
          Save workshop
        </Button>
      </div>
    </form>
  );
}
