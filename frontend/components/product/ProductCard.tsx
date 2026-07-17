"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Content } from "../ui";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback price if not available on the product object
  const price = product.price ? `${product.price} AED` : "400 AED";

  return (
    <Link
      href={
        product.slug.includes("birthday")
          ? `/workshops/${product.slug}`
          : `/workshops/${product.mainSlug}/${product.slug}`
      }
      className="group block"
    >
      <div 
        className="relative bg-[#F2ECE4] p-4  border-[0.5px]  border-secondary-off
                   transition-all duration-300 ease-in-out 
                   group-hover:bg-white  group-hover:shadow-sm"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden  aspect-[4/5] w-full">
          {!imageError ? (
            <Image
              src={product.imageUrl || "/images/banner/banner-2.png"}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent transition-all duration-500 " />

          {/* Overlay Title (Matches "Couple's Workshop" style) */}
          <div className="absolute top-6 left-0 right-0 px-4 text-center">
           <Content className="text-white text-center   2xl:!text-2xl  xl:!text-xl">
            {product.title}
          </Content>
          </div>
        </div>

        {/* Bottom Booking Bar */}
        <div className="mt-4 flex items-center justify-between bg-[#0D463D] text-white  py-3 px-6">
          <span className="font-bold text-base md:text-lg">{price}</span>
          <span className="font-medium text-sm md:text-base">Book Now</span>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0D463D] transition-transform duration-300 group-hover:translate-x-1">
            <svg
              className="w-5 h-5 stroke-current"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}