'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { WorkshopForm } from '@/components/WorkshopForm';
import { Spinner } from '@/components/ui';
import { apiError } from '@/lib/api';
import type { Workshop } from '@/lib/types';
import { getWorkshop, updateWorkshop, type WorkshopInput } from '@/services/workshop.service';

export default function EditWorkshopPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getWorkshop(id)
      .then(setWorkshop)
      .catch((e) => setError(apiError(e)));
  }, [id]);

  async function onSubmit(input: WorkshopInput) {
    setSubmitting(true);
    try {
      await updateWorkshop(id, input);
      toast.success('Workshop updated');
      router.push('/workshops');
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/workshops" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> Back to workshops
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Edit Workshop</h1>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {!workshop && !error ? (
        <Spinner label="Loading workshop…" />
      ) : workshop ? (
        <WorkshopForm initial={workshop} submitting={submitting} onSubmit={onSubmit} />
      ) : null}
    </div>
  );
}
