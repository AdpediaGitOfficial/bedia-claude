import { api } from '@/lib/api';
import type { Workshop, WorkshopOption, WorkshopSlot } from '@/lib/types';

export interface WorkshopInput {
  title: string;
  shortDescription: string;
  description: string;
  overview?: string;
  bannerImage?: string;
  categoryId: string;
  type?: string;
  showOnHomepage?: boolean;
  isActive?: boolean;
  options?: WorkshopOption[];
  defaultSlots?: WorkshopSlot[];
}

export async function listWorkshops(page = 1, limit = 100, search = '') {
  const { data } = await api.get('/workshop/adminAll', { params: { page, limit, search } });
  return {
    workshops: (data.result?.workshops ?? []) as Workshop[],
    totalCount: data.result?.totalCount ?? 0,
  };
}

export async function getWorkshop(id: string): Promise<Workshop> {
  const { data } = await api.get(`/workshop/${id}`);
  return (data.result ?? data.data ?? data) as Workshop;
}

export async function createWorkshop(input: WorkshopInput) {
  const { data } = await api.post('/workshop', input);
  return data;
}

export async function updateWorkshop(id: string, input: WorkshopInput) {
  const { data } = await api.put(`/workshop/${id}`, input);
  return data;
}

export async function deleteWorkshop(id: string) {
  const { data } = await api.delete(`/workshop/${id}`);
  return data;
}
