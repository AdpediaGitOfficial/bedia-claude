import { api } from '@/lib/api';
import type { ClayType } from '@/lib/types';

export interface ClayTypeInput {
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string[];
  isActive?: boolean;
}

export async function listClayTypes(page = 1, limit = 100, search = '') {
  const { data } = await api.get('/clay-type/adminAll', { params: { page, limit, search } });
  return {
    clayTypes: (data.result?.clayTypes ?? []) as ClayType[],
    totalCount: data.result?.totalCount ?? 0,
  };
}

export async function createClayType(input: ClayTypeInput) {
  const { data } = await api.post('/clay-type', input);
  return data;
}

export async function updateClayType(id: string, input: ClayTypeInput) {
  const { data } = await api.put(`/clay-type/${id}`, input);
  return data;
}

export async function deleteClayType(id: string) {
  const { data } = await api.delete(`/clay-type/${id}`);
  return data;
}
