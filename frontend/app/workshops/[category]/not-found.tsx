import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white">
      <div className="page-wrapper pt-16 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-primary mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3  font-medium hover:bg-primary-dark transition-colors duration-200 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
