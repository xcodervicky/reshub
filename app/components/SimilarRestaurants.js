import Link from 'next/link'
import Image from 'next/image'

// ─── Premium Badge ────────────────────────────────────────────────────────────
function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-500 border border-amber-400/40 text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
        <path d="M5 0L6.12 3.38H9.51L6.82 5.47L7.94 8.85L5 6.76L2.06 8.85L3.18 5.47L0.49 3.38H3.88L5 0Z" />
      </svg>
      Premium
    </span>
  )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill={star <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
          >
            <path d="M6 0L7.35 4.06H11.4L8.18 6.57L9.53 10.63L6 8.12L2.47 10.63L3.82 6.57L0.6 4.06H4.65L6 0Z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-800">{rating?.toFixed(1)}</span>
      {reviewCount && (
        <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  )
}

// ─── Single Restaurant Card ───────────────────────────────────────────────────
function RestaurantCard({ restaurant }) {
  const coverImage = restaurant.images?.[0] || '/placeholder-food.jpg'
  const cuisine = restaurant.cuisine?.slice(0, 2).join(' · ') || ''

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <Image
          src={coverImage}
          alt={restaurant.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Premium badge — top right */}
        {restaurant.isPremium && (
          <div className="absolute top-3 right-3">
            <PremiumBadge />
          </div>
        )}

        {/* Cuisine tag — bottom left on image */}
        {cuisine && (
          <span className="absolute bottom-3 left-3 text-[11px] text-white/90 font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {cuisine}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
          {restaurant.name}
        </h3>

        {/* Rating + Reviews */}
        <StarRating rating={restaurant.rating} reviewCount={restaurant.review_count} />

        {/* Address short */}
        {restaurant.address && (
          <p className="text-xs text-gray-400 line-clamp-1">
            📍 {restaurant.address.split(',').slice(-2).join(',').trim()}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Explore CTA */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">{restaurant.price_range || ''}</span>
          <span className="inline-flex items-center gap-1.5 bg-primary-600 group-hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200">
            Explore
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M2 7a.5.5 0 0 1 .5-.5h7.793L8.146 4.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 7.5H2.5A.5.5 0 0 1 2 7z"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function SimilarRestaurants({ restaurants }) {
  if (!restaurants || restaurants.length === 0) return null

  return (
    <section className="py-14 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-primary-500 font-semibold mb-1">
            You Might Also Like
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
            Explore More on DineCup
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>
    </section>
  )
}