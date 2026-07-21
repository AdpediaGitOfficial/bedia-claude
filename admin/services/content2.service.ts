import { api } from '@/lib/api';
import type { OpeningHours, TermsAndCondition, GoogleReview, Blog, AdminUserRow, Lead } from '@/lib/types';

/* Opening Hours */
export async function listOpeningHours() {
  const { data } = await api.get('/opening-hours/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.openingHours ?? []) as OpeningHours[];
}
export const createOpeningHours = (i: Partial<OpeningHours>) => api.post('/opening-hours', i).then((r) => r.data);
export const updateOpeningHours = (id: string, i: Partial<OpeningHours>) =>
  api.put(`/opening-hours/${id}`, i).then((r) => r.data);
export const deleteOpeningHours = (id: string) => api.delete(`/opening-hours/${id}`).then((r) => r.data);

/* Terms & Conditions */
export async function listTerms() {
  const { data } = await api.get('/terms-and-conditions/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.termsAndConditions ?? []) as TermsAndCondition[];
}
export const createTerms = (i: Partial<TermsAndCondition>) => api.post('/terms-and-conditions', i).then((r) => r.data);
export const updateTerms = (id: string, i: Partial<TermsAndCondition>) =>
  api.put(`/terms-and-conditions/${id}`, i).then((r) => r.data);
export const deleteTerms = (id: string) => api.delete(`/terms-and-conditions/${id}`).then((r) => r.data);

/* Google Reviews */
export async function listReviews() {
  const { data } = await api.get('/reviews/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.googleReviews ?? []) as GoogleReview[];
}
export const updateReview = (id: string, i: Partial<GoogleReview>) => api.put(`/reviews/${id}`, i).then((r) => r.data);
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`).then((r) => r.data);
export const syncReviews = () => api.post('/reviews/sync').then((r) => r.data);

/* Blog */
export async function listBlogs() {
  const { data } = await api.get('/blog/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.blogs ?? []) as Blog[];
}
export const createBlog = (i: Partial<Blog>) => api.post('/blog', i).then((r) => r.data);
export const updateBlog = (id: string, i: Partial<Blog>) => api.put(`/blog/${id}`, i).then((r) => r.data);
export const deleteBlog = (id: string) => api.delete(`/blog/${id}`).then((r) => r.data);

/* Users (customers) — read + delete */
export async function listUsers() {
  const { data } = await api.get('/user/all', { params: { page: 1, limit: 100 } });
  return (data.result?.data ?? []) as AdminUserRow[];
}
export const deleteUser = (id: string) => api.delete(`/user/${id}`).then((r) => r.data);

/* Leads — read by type */
export async function listLeads(type: string) {
  const { data } = await api.get(`/customleads/all/${type}`, { params: { page: 1, limit: 100 } });
  return {
    leads: (data.data ?? []) as Lead[],
    total: data.total ?? 0,
  };
}
