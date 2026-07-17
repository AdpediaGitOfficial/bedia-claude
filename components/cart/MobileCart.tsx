"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CartData, deleteCart } from "@/services/cart.service";

export default function MobileCart({
  data,
  refreshCart,
  onCheckout,
}: {
  data: CartData[];
  refreshCart: () => void;
  onCheckout?: () => void;
}) {
  const router = useRouter();
  const cartItems = data?.[0]?.items || [];
  const cartTotal = data?.[0]?.totalAmount ?? 0;
  const currency = cartItems?.[0]?.currency || "AED";

  useEffect(() => {
    console.log("Cart data received in MobileCart:", cartItems);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <main className="page-wrapper px-[17px] bg-[#fcfbf9] min-h-screen font-sans text-[#113224]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-20">
          <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
          <p className="text-gray-500 max-w-md">
            Add items to your cart and return here to complete checkout.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper px-[17px]  bg-[#fcfbf9] min-h-screen font-sans text-[#113224]">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6 mt-4 sm:mt-8">
        <h1 className="text-2xl font-serif">Your Cart</h1>
        <span className="text-gray-500 font-medium">({cartItems.length})</span>
      </div>

      <div className="space-y-8">
        {cartItems.map((item, i) => (
          <div className="border-b border-gray-200 pb-6" key={i}>
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-sm shrink-0 overflow-hidden">
                <Image
                  src={
                    item.workshopId.images?.[0]?.image ||
                    "/images/products/pottery1.png"
                  }
                  alt="Beginners pottery"
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex-grow flex flex-col justify-center text-sm relative">
                <button
                  className="text-gray-400 absolute top-0 right-0 hover:text-[#113224] mb-3 border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                  onClick={async () => {
                    await deleteCart({
                      userId: data[0]?.userId || "",
                      itemIndex: i,
                    });

                    await refreshCart();
                  }}
                >
                  ✕
                </button>

                <h3 className="font-semibold text-[15px] mb-2 leading-tight">
                  {item.workshopId.title}
                </h3>
                <div className="flex justify-between items-center text-gray-500">
                  <p>
                    x {item.people}{" "}
                    <span className="ml-1">
                      {item.currency} {item.price.toFixed(2)}
                    </span>
                  </p>
                  <p className="font-medium text-[#113224]">
                    {item.currency} {item.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Totals & Checkout */}
      <div className="mt-8 space-y-6">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-gray-800">TOTAL</span>
          <span className="font-bold">
            {currency} {cartTotal.toFixed(2)}
          </span>
        </div>

        {/* 
          This button uses the onCheckout prop passed down from MasterCartFlow 
          to transition to Step 1 (the detailed CartStep) 
        */}
          <button
            onClick={onCheckout}
            className="w-full bg-[#113224] text-white py-4 font-medium text-[15px] hover:bg-[#0c251a] transition-colors rounded-sm shadow-sm"
          >
            Checkout
          </button>

        {/* Payment Methods */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-medium">
            Secure payments provided by
          </p>
          <div className="flex justify-center gap-2">
            <Image
              src="/images/icons/card.png"
              alt="Payment Cards"
              width={200}
              height={30}
              unoptimized
            />
          </div>
        </div>
      </div>
    </main>
  );
}
