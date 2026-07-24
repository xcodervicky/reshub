'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header({ restaurantName = null, isPremium = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-glass border-b border-gray-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden relative shadow-sm shrink-0">
            <Image
              src="/dinecup.jpeg"
              alt="DineCup Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-display font-bold text-gray-900 text-lg hidden sm:block">
            Dine<span className="text-primary-600">Cup</span>
          </span>
        </Link>

        {/* Center - restaurant name on detail page */}
        {restaurantName && (
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <p className="text-sm font-semibold text-gray-700 truncate max-w-xs">{restaurantName}</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-3">
           {/* {!isPremium && (
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>✦</span> Upgrade Now 
            </Link>
          )}  */}
          {isPremium && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              ✦ Premium
            </span>
          )}
          <Link
            href="https://tally.so/r/A74zE0"
            className="text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
             Add Restaurants →
          </Link>
        </div>
      </div>
    </header>
  )
}