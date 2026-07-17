import CheckoutPageClient from '@/components/cart/CheckoutPageClient';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = {
  title: 'Checkout | Bedia Pottery',
  description: 'Securely complete your purchase.',
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}