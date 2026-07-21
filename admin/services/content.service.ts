import { api } from '@/lib/api';
import type { Gallery, Faq, Testimonial, Partner } from '@/lib/types';

/* Gallery */
export async function listGalleries() {
  const { data } = await api.get('/gallery/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.galleries ?? []) as Gallery[];
}
export const createGallery = (i: Partial<Gallery>) => api.post('/gallery', i).then((r) => r.data);
export const updateGallery = (id: string, i: Partial<Gallery>) => api.put(`/gallery/${id}`, i).then((r) => r.data);
export const deleteGallery = (id: string) => api.delete(`/gallery/${id}`).then((r) => r.data);

/* FAQ */
export async function listFaqs() {
  const { data } = await api.get('/faq/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.faqs ?? []) as Faq[];
}
export const createFaq = (i: Partial<Faq>) => api.post('/faq', i).then((r) => r.data);
export const updateFaq = (id: string, i: Partial<Faq>) => api.put(`/faq/${id}`, i).then((r) => r.data);
export const deleteFaq = (id: string) => api.delete(`/faq/${id}`).then((r) => r.data);

/* Testimonials */
export async function listTestimonials() {
  const { data } = await api.get('/testimonial/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.testimonials ?? []) as Testimonial[];
}
export const createTestimonial = (i: Partial<Testimonial>) => api.post('/testimonial', i).then((r) => r.data);
export const updateTestimonial = (id: string, i: Partial<Testimonial>) =>
  api.put(`/testimonial/${id}`, i).then((r) => r.data);
export const deleteTestimonial = (id: string) => api.delete(`/testimonial/${id}`).then((r) => r.data);

/* Partners */
export async function listPartners() {
  const { data } = await api.get('/partner/adminAll', { params: { page: 1, limit: 100 } });
  return (data.result?.partners ?? []) as Partner[];
}
export const createPartner = (i: Partial<Partner>) => api.post('/partner', i).then((r) => r.data);
export const updatePartner = (id: string, i: Partial<Partner>) => api.put(`/partner/${id}`, i).then((r) => r.data);
export const deletePartner = (id: string) => api.delete(`/partner/${id}`).then((r) => r.data);
