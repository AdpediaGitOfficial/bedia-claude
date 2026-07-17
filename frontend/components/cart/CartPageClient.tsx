"use client";

import { useEffect, useState } from 'react';
import MobileCart from '@/components/cart/MobileCart';
import { CartData, getCartData } from '@/services/cart.service';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function CartPageClient() {
  const userId = useAuthStore(state => state.user?.userId);
  const [cartData, setCartData] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const router = useRouter()
  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      if (!userId) {
        if (!isMounted) {
          return;
        }

        setCartData([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getCartData();

        if (isMounted) {
          setCartData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load cart.');
          setCartData([]);
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

  const bannerImage = cartData?.[0]?.items?.[0]?.workshopId?.bannerImage || '/images/banner/cart-page.png';
const loadCart = async () => {
  if (!userId) {
    setCartData([]);
    return;
  }

  try {
    const data = await getCartData();
    setCartData(data);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to load cart."
    );
  }
};
const onCheckout = () => {  
  localStorage.setItem('checkoutCartStep',"2");
  router.push('/checkout')
    
}
  return (
    <main className="bg-[#fcfbf9] flex lg:flex-row font-sans">
      <div className="hidden lg:block w-1/2 h-[calc(100vh-76.4px)] sticky top-[76.4px] bg-gray-200 z-0">
        <img
          src={bannerImage}
          alt="Pottery making"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 overflow-y-auto scrollbar-hide relative z-10">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center text-gray-600 px-4 text-center">
            Loading your cart...
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center text-center px-4 text-red-600">
            <div>
              <h1 className="text-2xl font-serif mb-3">Unable to load cart</h1>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        ) : userId ? (
         <MobileCart
  data={cartData}
  onCheckout={onCheckout}
  refreshCart={loadCart}
/>
        ) : (
          <div className="min-h-screen flex items-center justify-center text-center px-4 text-gray-700">
            <div>
              <h1 className="text-2xl font-serif mb-3">Sign in to view your cart</h1>
              <p className="text-sm text-gray-500 max-w-md">
                Your cart is tied to your account. Please log in to continue.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}