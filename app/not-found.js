import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🍽️</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Restaurant Not Found</h1>
        <p className="text-gray-500 text-lg mb-8">
          Oops! We couldn't find this restaurant. It may have been removed or the URL might be incorrect.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2"
        >
          ← Browse All Restaurants
        </Link>
      </div>
    </div>
  )
}
