import { api } from '@/lib/api';
import type { Category } from '@/lib/types';

export interface CategoryInput {
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string[];
  parentId?: string | null;
  showOnHomepage?: boolean;
  isActive?: boolean;
}

export async function listCategories(page = 1, limit = 50, search = '') {
  const { data } = await api.get('/category/adminAll', { params: { page, limit, search } });
  return {
    categories: (data.result?.categories ?? []) as Category[],
    totalCount: data.result?.totalCount ?? 0,
  };
}

export async function createCategory(input: CategoryInput) {
  const { data } = await api.post('/category', input);
  return data;
}

export async function updateCategory(id: string, input: CategoryInput) {
  const { data } = await api.put(`/category/${id}`, input);
  return data;
}

export async function deleteCategory(id: string) {
  const { data } = await api.delete(`/category/${id}`);
  return data;
}
