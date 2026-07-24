'use client'
import { useState } from 'react'

const VISIBLE_COUNT = 6 // sirf itni images grid me dikhengi, baaki "+more" ke peeche

export default function GallerySection({ restaurant }) {
  const { images, name } = restaurant
  const [lightboxIdx, setLightboxIdx] = useState(null)

  if (!images?.length) return null

  const displayImages = images.slice(1) // skip hero image, already used
  const visibleImages = displayImages.slice(0, VISIBLE_COUNT)
  const remainingCount = displayImages.length - VISIBLE_COUNT

  return (
    <section className="py-16 px-4 bg-white" id="gallery">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Visuals</p>
          <h2 className="section-title mb-3">Photo Gallery</h2>
          <p className="text-gray-500">A glimpse into the {name} experience</p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleImages.map((img, idx) => {
            const isLastTile = idx === VISIBLE_COUNT - 1 && remainingCount > 0

            return (
              <div
                key={idx}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ height: idx === 0 ? '340px' : '160px' }}
                onClick={() => setLightboxIdx(idx)}
              >
                <img
                  src={img}
                  alt={`${name} gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {isLastTile ? (
                  // "+N more" overlay on the last visible tile
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{remainingCount} more
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                      <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Lightbox — navigates through ALL images, not just visible ones */}
        {lightboxIdx !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light"
              onClick={() => setLightboxIdx(null)}
            >
              ✕
            </button>
            <img
              src={displayImages[lightboxIdx]}
              alt={`${name} ${lightboxIdx + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Navigation */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + displayImages.length) % displayImages.length) }}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-3 transition-all"
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % displayImages.length) }}
            >
              →
            </button>
            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
              {lightboxIdx + 1} / {displayImages.length}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}