'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { WorkshopForm } from '@/components/WorkshopForm';
import { apiError } from '@/lib/api';
import { createWorkshop, type WorkshopInput } from '@/services/workshop.service';

export default function NewWorkshopPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(input: WorkshopInput) {
    setSubmitting(true);
    try {
      await createWorkshop(input);
      toast.success('Workshop created');
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
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">New Workshop</h1>
      <WorkshopForm submitting={submitting} onSubmit={onSubmit} />
    </div>
  );
}
