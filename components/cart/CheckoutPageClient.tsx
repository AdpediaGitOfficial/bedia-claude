"use client";

import { useEffect, useState } from 'react';
import CheckoutFlow from '@/components/cart/CheckoutFlow';
import { CartData, getCartData } from '@/services/cart.service';
import { useAuthStore } from '@/store/authStore';

export default function CheckoutPageClient() {
  const userId = useAuthStore(state => state.user?.userId);
  const [data, setData] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!userId) {
        if (!isMounted) {
          return;
        }

        setData([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const latest = await getCartData();

        if (isMounted) {
          setData(latest);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load checkout cart data.');
          setData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600 px-4 text-center">
        Loading checkout...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-4 text-red-600">
        <div>
          <h1 className="text-2xl font-serif mb-3">Unable to load checkout</h1>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center px-4 text-gray-700">
        <div>
          <h1 className="text-2xl font-serif mb-3">Sign in to continue</h1>
          <p className="text-sm text-gray-500 max-w-md">
            Checkout uses your saved cart, so you need to log in first.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <CheckoutFlow initialData={data} />
    </main>
  );
}