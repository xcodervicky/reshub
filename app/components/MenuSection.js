'use client'
import { useState } from 'react'

function MenuItem({ item, currencySymbol }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 text-base group-hover:text-primary-700 transition-colors truncate">
            {item.name}
          </h4>
          {item.isPopular && (
            <span className="shrink-0 text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full">
              🔥 Popular
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-gray-500 text-sm leading-snug">{item.description}</p>
        )}
      </div>
      <div className="shrink-0">
        <span className="font-bold text-primary-700 text-base">
          {currencySymbol}{Number(item.price).toFixed(2)}
        </span>
      </div>
    </div>
  )
}

export default function MenuSection({ restaurant }) {
  const { menu, name, currency } = restaurant
  if (!menu?.length) return null

  // Currency ke hisaab se symbol decide karo — default INR (₹)
  const currencySymbol = currency === 'USD' ? '$' : '₹'

  // Get unique categories
  const categories = ['All', ...new Set(menu.map(item => item.category).filter(Boolean))]
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredMenu = activeCategory === 'All'
    ? menu
    : menu.filter(item => item.category === activeCategory)

  return (
    <section className="py-16 px-4 bg-gray-50" id="menu">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">What We Serve</p>
          <h2 className="section-title mb-3">Our Menu</h2>
          <p className="text-gray-500 max-w-md mx-auto">Fresh ingredients, bold flavours — every dish tells a story</p>
        </div>

        {/* Category filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          {filteredMenu.map((item, idx) => (
            <MenuItem key={idx} item={item} currencySymbol={currencySymbol} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          * Prices are inclusive of taxes. Menu items subject to availability.
        </p>
      </div>
    </section>
  )
}