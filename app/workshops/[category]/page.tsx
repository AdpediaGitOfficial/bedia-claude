import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import { Content, Title } from "@/components/ui";
import TestimonialsSection from "@/components/testimonial/TestimonialsSection";
import { getCategoryData } from "@/services/category.service";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const data = await getCategoryData(category);

  // Check category exists
  if (!data.totalCount || data.totalCount === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white page-wt">
      <div className="md:py-20 py-10 ">
        {/* Header Section */}
        {/* <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 ">
          <div
            className="relative overflow-hidden w-full flex items-center h-36 md:h-[400px] md:mb-20 mb-10 bg-cover bg-center"
            style={{
              backgroundImage: `url(/images/banner/adults-banner-1.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "bottom",
            }}
          >
            <div className="absolute inset-0 blur-sm " />
          </div>
        </div> */}
         <div className="flex flex-col page-wrapper  lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
          <div className="flex-1">
            <Title className="mb-2.5 font-normal">{data.category.title}</Title>

            <Title className="mb-2.5 font-normal !text-2xl">
              ({data.category.shortDescription})
            </Title>
          </div>

          {data.category.description && (
            <div className="lg:max-w-lg flex-1">
              <Content>{data.category.description}</Content>
            </div>
          )}
        </div>
        {/* Products Grid */}
        {data?.workshops.length > 0 ? (
          <div className=" page-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.workshops.map((workshop) => (
              <ProductCard
                key={workshop._id}
                product={{
                  id: workshop._id,
                  title: workshop.title,
                  imageUrl: workshop.bannerImage,
                  slug: workshop.slug,
                  mainSlug: category,
                  description: workshop.shortDescription,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No workshops available in this category.
            </p>
          </div>
        )}
      </div>

      <TestimonialsSection />
    </main>
  );
}
