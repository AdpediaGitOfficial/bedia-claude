"use client";

import React, { useEffect, useState } from "react";
import TestimonialsHeader from "./TestimonialsHeader";
import TestimonialsSlider from "./TestimonialsSlider";
import { getReviewsData } from "@/services/reviewService";

export default function TestimonialsSection() {
  const [initialReviews, setInitialReviews] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch page 1 initially to check if data exists
        const data = await getReviewsData(1, 10);
        setInitialReviews(data.reviews);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to load initial testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // While checking the API, return nothing (or a skeleton loader if preferred)
  if (isLoading) return null;

  // CRITICAL: If no testimonials exist, don't render the section at all
  if (initialReviews.length === 0) return (
    <section className="pb-16  bg-white"></section>
  );

  return (
    <></>
    // <section className="pb-32 pt-16 bg-white">
    //   <div className="page-wrapper px-[17px]">
    //     <TestimonialsHeader />
    //     <TestimonialsSlider 
    //       initialReviews={initialReviews} 
    //       totalPages={totalPages} 
    //     />
    //   </div>
    // </section>
  );
}