'use client'

function StarRating({ rating, reviewCount }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalf ? 'text-yellow-300' : 'text-gray-400/50'}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-white font-bold text-lg">{rating}</span>
      <span className="text-white/70 text-sm">({reviewCount?.toLocaleString()} reviews)</span>
    </div>
  )
}

export default function HeroSection({ restaurant }) {
  const {
    name,
    tagline,
    images,
    rating,
    review_count,
    cuisine,
    price_range,
    hours,
    address,
    swiggy_link,
    zomato_link,
    website_link,
    directions_link,
    isPremium,
    isVerified
  } = restaurant

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12 pt-24">
        <div className="max-w-3xl">
          {/* Cuisine tags + Premium + Verified/Unverified — all in one div */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {cuisine?.map((c) => (
              <span key={c} className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {c}
              </span>
            ))}
            {isPremium && (
              <span className="bg-amber-400/90 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                ✦ Premium Restaurant
              </span>
            )}
            {isVerified ? (
              <span className="bg-green-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-patch-check-fill" viewBox="0 0 16 16">
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                </svg> Verified
              </span>
            ) : (
              <span className="bg-gray-400/50 text-white text-xs font-bold px-2 py-1.5 rounded-full inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                </svg> Unverified
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-2">
            {name}
          </h1>

          {/* Tagline */}
          {tagline && (
            <p className="text-primary-300 text-lg md:text-xl font-medium italic mb-5">{tagline}</p>
          )}

          {/* Rating */}
          <div className="mb-5">
            <StarRating rating={rating} reviewCount={review_count} />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-8">
            {price_range && (
              <span className="flex items-center gap-1">
                <span className="text-primary-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                  <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                </svg></span> {price_range}
              </span>
            )}
            {hours && (
              <span className="flex items-center gap-1">
                <span className="text-primary-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                </svg></span> {hours.split('|')[0].trim()}
              </span>
            )}
            {address && (
              <span className="flex items-center gap-1">
                <span className="text-primary-400"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt" viewBox="0 0 16 16">
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg> </span> {address.split(',').slice(-3, -1).join(',')}
              </span>
            )}
          </div>

          {/* Order buttons */}
          <div className="flex flex-wrap gap-3">
            {swiggy_link && (
              <a
                href={swiggy_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#FC8019] hover:bg-[#e5721a] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                </svg>
                Order on Swiggy
              </a>
            )}
            {zomato_link && (
              <a
                href={zomato_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#E23744] hover:bg-[#cb2f3c] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                </svg>
                Order on Zomato
              </a>
            )}
          </div>

          {/* Website & Directions buttons */}
          {(website_link || directions_link) && (
            <div className="flex flex-wrap gap-3 mt-3">
              {website_link && (
                <a
                  href={website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe2" viewBox="0 0 16 16">
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.96 6.96 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5h2.653V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5H1.026c.064.897.313 1.746.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h1.795c.343-.754.592-1.603.656-2.5H12.49a13.7 13.7 0 0 1-.312 2.5m2.451-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461q.339.615.598.933q.34.415.64.933H14.44a7 7 0 0 0-3.072-2.472z"/>
                  </svg>
                  Website
                </a>
              )}
              {directions_link && (
                <a
                  href={directions_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-signpost-2" viewBox="0 0 16 16">
                    <path d="M7 1.414V4H2a1 1 0 0 0-.8.4L.938 5.5l.263.3A1 1 0 0 0 2 6.4h5v1.599h1V6.4h5a1 1 0 0 0 .8-.4l.263-.3-.263-.3a1 1 0 0 0-.8-.4H8V4h5.06a1 1 0 0 1 .733.319l1.703 1.831a.5.5 0 0 1 0 .68l-1.703 1.831a1 1 0 0 1-.733.319H8v6H7v-6H1.94a1 1 0 0 1-.733-.319L-.496 6.83a.5.5 0 0 1 0-.68l1.703-1.831A1 1 0 0 1 1.94 4H7V1.414A1 1 0 0 1 8 .5V0a1 1 0 0 0-1 1.414"/>
                  </svg>
                  Directions
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 right-4 text-white/40 text-xs font-medium flex flex-col items-center gap-1 animate-bounce">
        <span>Scroll</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}