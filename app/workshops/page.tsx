import React from 'react'
import { categories } from '@/constants/products'
import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Pottery Workshops - Bedia Pottery',
  description: 'Explore our wide range of pottery workshops and classes. From beginners to advanced, we have something for everyone.',
}

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="page-wrapper px-[17px]  pt-8 pb-16">
        <div className="mb-12">
          <h1 className="text-2xl lg:text-4xl 2xl:text-5xl font-semibold text-primary mb-4">
            Pottery Workshops
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Explore our wide range of pottery workshops and classes. From
            beginners to advanced, we have something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/workshops/${category.slug}`}
              className="bg-white  p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-primary mb-2">
                {category.name}
              </h2>
              {category.subtitle && (
                <p className="text-sm text-gray-500 mb-3">
                  {category.subtitle}
                </p>
              )}
              {category.description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {category.description}
                </p>
              )}
              <div className="mt-4 text-primary font-medium flex items-center gap-2">
                View Workshops
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
