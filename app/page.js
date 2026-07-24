'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import Header from './components/Header'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const PER_PAGE = 99

// ─── Weighted Random Shuffle ──────────────────────────────────────────────────
// Restaurants with more reviews get a higher chance of appearing first,
// but the order is still randomized on every load (not a strict sort).
function weightedShuffle(arr) {
  const pool = arr.map((r) => ({
    item: r,
    // Boost weight based on review_count, but keep some randomness so
    // low-review restaurants still get a fair chance to show up.
    weight: Math.pow((r.review_count || 0) + 1, 0.6) * Math.random(),
  }))
  pool.sort((a, b) => b.weight - a.weight)
  return pool.map((p) => p.item)
}

// ─── Pagination Component ─────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Build page number array with ellipsis logic
  function getPages() {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const pages = getPages()

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12 mb-4">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
          ${currentPage === 1
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
        </svg>
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm select-none">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[40px] h-10 rounded-xl text-sm font-medium border transition-all duration-150
              ${p === currentPage
                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50'
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
          ${currentPage === totalPages
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50'
          }`}
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  )
}
// ─── Rating Widget ────────────────────────────────────────────────────────────
function RatingWidget() {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [avgRating, setAvgRating] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [thanks, setThanks] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    fetchRatings()
  }, [])

  async function fetchRatings() {
    const { data, error } = await supabase
      .from('site_ratings')
      .select('stars')

    if (!error && data && data.length > 0) {
      const total = data.length
      const sum = data.reduce((acc, r) => acc + r.stars, 0)
      setAvgRating((sum / total).toFixed(1))
      setTotalCount(total)
    }
  }

  async function handleClick(v) {
    if (hasRated || submitting) return
    setSelected(v)
    setSubmitting(true)

    const { error } = await supabase
      .from('site_ratings')
      .insert({ stars: v })

    if (!error) {
      setHasRated(true)
      setThanks(true)
      setTimeout(() => setThanks(false), 3000)
      await fetchRatings()
    }

    setSubmitting(false)
  }

  return (
    <section className="bg-white-900 border-t border-white-800 py-12 px-4 text-center">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
            <Image
              src="/dinecup.jpeg"
              alt="DineCup Logo"
              fill
              className="object-cover"
            />
          </span>
          <span className="text-black font-bold text-lg">DineCup</span>
        </div>

        <h2 className="text-black text-xl font-semibold mb-1 tracking-tight">
          Is DineCup helpful for you?
        </h2>
        <p className="text-gray-500 text-sm mb-7">
          Rate your experience discovering restaurants & cafés
        </p>

        <div className="flex justify-center gap-2 mb-5" role="group" aria-label="Rate DineCup">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              aria-label={`${v} star`}
              onClick={() => handleClick(v)}
              onMouseEnter={() => !hasRated && setHovered(v)}
              onMouseLeave={() => setHovered(0)}
              disabled={hasRated || submitting}
              className={`text-4xl leading-none transition-all duration-100 bg-transparent border-none outline-none
                ${hasRated ? 'cursor-default' : 'cursor-pointer'}
                ${v <= (hovered || selected)
                  ? 'text-amber-400 scale-110'
                  : 'text-gray-700 hover:text-amber-300'
                }`}
            >
              ★
            </button>
          ))}
        </div>

        {(totalCount > 0 || hasRated) && (
          <>
            <div className="border-t border-gray-800 my-5" />
            <div className="flex items-center justify-center">
              <div className="text-center px-7">
                <p className="text-black text-2xl font-bold">{avgRating}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">out of 5</p>
              </div>
              <div className="w-px h-9 bg-gray-800" />
              <div className="text-center px-7">
                <p className="text-black text-2xl font-bold">{totalCount}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">ratings</p>
              </div>
            </div>
          </>
        )}

        <p
          className={`text-sm mt-4 h-5 transition-opacity duration-300 ${
            thanks
              ? 'text-green-400 opacity-100'
              : hasRated && !thanks
              ? 'text-gray-600 opacity-100'
              : 'opacity-0'
          }`}
        >
          {thanks
            ? 'Thanks for rating DineCup!'
            : hasRated
            ? 'You have already rated — thank you!'
            : ''}
        </p>

      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-gray-800">

          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0">
                <Image
                  src="/dinecup.jpeg"
                  alt="DineCup Logo"
                  fill
                  className="object-cover"
                />
              </span>
              <span className="text-white font-bold text-lg">DineCup</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover the best restaurants near you. Menus, ratings, and direct ordering links.
            </p>

            <div className="flex items-center gap-3 mt-4">

              <a href="https://x.com/dinecup" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-all duration-200"
                aria-label="X">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
              </a>

              <a href="https://instagram.com/bulidwithvicky" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
              </a>

              <a href="https://threads.com/@bulidwithvicky" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 hover:bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-black transition-all duration-200"
                aria-label="Threads">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 192 192">
                  <path d="M141.537 88.988a66 66 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.452-15.153 9.898-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.206 17.11 97.015 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.28 0h-.483C69.008.195 47.426 9.6 32.635 27.99 19.458 44.505 12.328 67.538 12.076 96v.5c.252 28.46 7.157 51.494 20.502 68.009C47.579 182.61 69.16 192 97.015 192h.483c24.786-.166 42.273-6.674 56.552-20.94 18.764-18.74 18.1-42.247 11.952-56.73-4.372-10.191-12.75-18.35-24.465-23.342zM96.105 142.89c-10.43.588-21.286-4.098-21.82-14.135-.4-7.513 5.35-15.882 22.706-16.894 1.988-.114 3.942-.169 5.864-.169 6.188 0 11.988.601 17.314 1.752-1.973 24.581-13.858 28.86-24.064 29.446z"/>
                </svg>
              </a>

              <a href="mailto:hellodinecup@hotmail.com"
                className="w-8 h-8 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                </svg>
              </a>

            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Platform</p>
              <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Home</Link>
              <Link href="/restaurants" className="text-sm text-gray-500 hover:text-white transition-colors">All Restaurants</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Restaurant Owners</p>
              <a href="https://tally.so/r/A74zE0" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-white transition-colors">Add Your Restaurant</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 text-xs text-gray-600">
          <p>© 2026 DineCup · Built with Next.js ❤️</p>
          <p>Powered by DineCup — Restaurant Discovery Platform</p>
        </div>

      </div>
    </footer>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [query, setQuery] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const listingsSectionRef = useRef(null)

  useEffect(() => {
    async function fetchRestaurants() {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          id, name, slug, description, cuisine, address,
          rating, review_count, price_range, is_premium,
          restaurant_images (url, sort_order)
        `)
        .eq('is_active', true)

      if (!error && data) {
        const formatted = data.map(r => ({
          ...r,
          isPremium: r.is_premium,
          images: (r.restaurant_images || [])
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(img => img.url),
        }))
        // Random shuffle every load, weighted so restaurants with more
        // reviews have a higher chance of appearing earlier.
        // Phir Premium restaurants ko hamesha top pe le aao — Free restaurants
        // uske baad, dono groups ke andar shuffle wali order preserved rehti hai.
        const shuffled = weightedShuffle(formatted)
        const sorted = [...shuffled].sort(
          (a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0)
        )
        setRestaurants(sorted)
      }
      setLoading(false)
    }

    fetchRestaurants()
  }, [])

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const filtered = restaurants.filter((r) => {
    const q = query.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      (r.cuisine || []).some((c) => c.toLowerCase().includes(q)) ||
      (r.address || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginatedRestaurants = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  )

  function handlePageChange(page) {
    setCurrentPage(page)
    // Smooth scroll back to listings section top
    listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gray-950 text-white py-24 px-4 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#14532d33_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#15803d22_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-green-950/60 border border-green-800/50 text-green-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <i className="bi bi-stars text-green-400 text-sm" />
            Premium Restaurant Discovery
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-5 leading-[1.1] tracking-tight">
            Explore Top-Rated
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
              Restaurants & Cafés
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-regular">
            Explore curated <b>restaurant & cafés</b> near you with Full menus, verified ratings, online ordering, and instant WhatsApp connections
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, or areas..."
                className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-700/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <i className="bi bi-x-lg text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-300 font-medium">
              <i className="bi bi-shop text-green-400 text-sm" />
              {restaurants.length}+ Restaurants
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-300 font-medium">
              <i className="bi bi-star-fill text-green-400 text-sm" />
              Top Rated Picks
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-300 font-medium">
              <i className="bi bi-cup-hot text-green-400 text-sm" />
              Cafés & Fine Dining
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-300 font-medium">
              <i className="bi bi-phone text-green-400 text-sm" />
              Mobile Optimized
            </div>
          </div>

        </div>
      </section>

      {/* Listings */}
      <div className="bg-white" ref={listingsSectionRef}>
        <section className="max-w-7xl mx-auto px-4 py-16 bg-white">

          {/* Section Header */}
          <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
            <div>
              <p className="text-green-600 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                Top-Rated Restaurants & Cafe
              </p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {query ? `Results for "${query}"` : 'All Restaurants'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-sm font-medium block">
                {filtered.length} listings
              </span>
              {totalPages > 1 && (
                <span className="text-gray-300 text-xs mt-0.5 block">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse border border-gray-100">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>

          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <p className="text-gray-800 font-semibold text-lg">No restaurants found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different name or cuisine</p>
            </div>

          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map((r) => (
                  <Link
                    key={r.id}
                    href={`/restaurant/${r.slug}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 overflow-hidden bg-white hover:border-green-200 hover:shadow-[0_8px_40px_-8px_rgba(22,163,74,0.15)] transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-50">
                      <img
                        src={r.images[0]}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {r.isPremium && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          <i className="bi bi-patch-check-fill text-xs" />
                          Premium
                        </div>
                      )}

                      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                        {r.price_range}
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="#16a34a" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <span className="text-xs font-bold text-gray-800">{r.rating}</span>
                        <span className="text-xs text-gray-400">({r.review_count})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(r.cuisine || []).slice(0, 3).map((c, i) => (
                          <span key={i} className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 group-hover:text-green-700 transition-colors">
                        {r.name}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {r.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#16a34a" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                          </svg>
                          <span className="truncate max-w-[160px]">
                            {(r.address || '').split(',').slice(-2).join(',')}
                          </span>
                        </p>
                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold group-hover:gap-2 transition-all duration-200">
                          Explore
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>

      {/* Rating Widget — just above footer */}
      <RatingWidget />

      <Footer />
    </div>
  )
}