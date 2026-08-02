import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Header from '../../components/Header'
import HeroSection from '../../components/HeroSection'
import AboutSection from '../../components/AboutSection'
import MenuSection from '../../components/MenuSection'
import GallerySection from '../../components/GallerySection'
import ContactSection from '../../components/ContactSection'
import WhatsAppButton from '../../components/WhatsAppButton'
import FreeBranding from '../../components/FreeBranding'
import RestaurantFooter from '../../components/RestaurantFooter'
import ScrollReveal from '../../components/ScrollReveal'
import SimilarRestaurants from '../../components/SimilarRestaurants'

// ─── ISR CONFIG ────────────────────────────────────────────────────────────
// Page static banega (fast, SEO-friendly, CDN cached).
// Time-based revalidation HATA diya gaya hai — pehle 1800 sec (30 min) tha,
// jisse ~65 pages ke saath bhi daily ~3000 unnecessary Writes ho rahe the
// (pages × 48 windows/day), chahe data actually change hua ho ya nahi.
//
// Ab page SIRF do tareeko se generate/refresh hota hai:
// 1. Build time par (generateStaticParams se)
// 2. On-demand — admin panel se data update hote hi /api/revalidate call
//    turant is specific page ka cache clear karta hai (revalidatePath)
//
// Isse Writes sirf tab honge jab data actually change hua ho — koi bhi
// "blind" time-based regeneration nahi.
export const dynamic = 'force-static'
export const revalidate = false

// Naya restaurant add hone par uska page build time par exist nahi karta
// (generateStaticParams sirf build ke waqt chalta hai). dynamicParams true
// rakhne se naye slug ki PEHLI visit par page on-the-fly generate + cache
// ho jata hai (ek Write), uske baad wo bhi static/cached rehta hai.
export const dynamicParams = true


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ─── Supabase se restaurant fetch karo ───────────────────────────────────────
async function getRestaurant(slug) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_images (url, sort_order),
      menu_items (name, price, description, category, is_popular)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  return {
    ...data,
    isPremium: data.is_premium,
    isVerified: data.is_verified,
    // Currency har restaurant ke liye alag ho sakti hai — default INR
    currency: data.currency || 'INR',
    images: (data.restaurant_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.url),
    menu: (data.menu_items || []).map(m => ({
      name:        m.name,
      price:       parseFloat(m.price),
      description: m.description,
      category:    m.category,
      isPopular:   m.is_popular,
    })),
    social: {
      instagram: data.instagram || '',
      facebook:  data.facebook  || '',
      twitter:   data.twitter   || '',
    },
  }
}

// ─── Similar restaurants fetch karo (same cuisine, excluding current) ─────────
async function getSimilarRestaurants(restaurant) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      id, name, slug, rating, review_count, cuisine,
      address, price_range, is_premium,
      restaurant_images (url, sort_order)
    `)
    .eq('is_active', true)
    .neq('id', restaurant.id)

  if (error || !data) return []

  // Pehle Math.random() se shuffle hota tha — isse HAR revalidation pe
  // output different aata tha (chahe actual data same ho), jisse Vercel
  // ye samajhta tha ki content change hua hai aur ek naya ISR Write ho
  // jata tha. Ab deterministic order (rating ke hisaab se) use kar rahe
  // hain — same data = same output = koi extra ISR Write nahi.
  return data
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)
    .map(r => ({
      ...r,
      isPremium: r.is_premium,
      images: (r.restaurant_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.url),
    }))
}

// ─── Static generation — build time par sab restaurant pages pre-render honge ─
export async function generateStaticParams() {
  const { data } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('is_active', true)

  return (data || []).map(r => ({ slug: r.slug }))
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// Next.js 15/16: params ab ek Promise hai, isliye pehle await karna zaroori hai
export async function generateMetadata({ params }) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  if (!restaurant) return { title: 'Restaurant Not Found' }

  const city = restaurant.address?.split(',').slice(-2, -1)[0]?.trim() || ''

  return {
    title: `${restaurant.name} | Best ${restaurant.cuisine?.[0]} in ${city}`,
    description: `${restaurant.name} in ${city} — ${restaurant.cuisine?.join(', ')} restaurant. Rating: ${restaurant.rating}★. View full menu, photos, order on Swiggy & Zomato. ${restaurant.tagline || ''}`.slice(0, 160),
    keywords: [
      restaurant.name,
      ...(restaurant.cuisine || []),
      `restaurant in ${city}`,
      `best ${restaurant.cuisine?.[0]} in ${city}`,
      `${restaurant.name} menu`,
      `${restaurant.name} online order`,
      `food delivery ${city}`,
    ].join(', '),
    alternates: {
      canonical: `https://www.dinecup.com/restaurant/${restaurant.slug}`,
    },
    openGraph: {
      title: restaurant.name,
      description: restaurant.tagline || restaurant.description?.slice(0, 100),
      images: restaurant.images?.[0] ? [{ url: restaurant.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: restaurant.name,
      description: restaurant.tagline,
      images: restaurant.images?.[0] ? [restaurant.images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// ─── Page Component ────────────────────────────────────────────────────────────
// Next.js 15/16: params ab ek Promise hai, isliye pehle await karna zaroori hai
export default async function RestaurantPage({ params }) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  // 404 if restaurant not found
  if (!restaurant) notFound()

  // Similar restaurants parallel fetch
  const similarRestaurants = await getSimilarRestaurants(restaurant)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    description: restaurant.description,
    url: `https://www.dinecup.com/restaurant/${restaurant.slug}`,
    telephone: restaurant.phone,
    email: restaurant.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
    },
    servesCuisine: restaurant.cuisine,
    priceRange: restaurant.price_range,
    image: restaurant.images,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      reviewCount: restaurant.review_count,
      bestRating: '5',
    },
    openingHours: restaurant.hours,
    sameAs: [
      restaurant.social?.instagram,
      restaurant.social?.facebook,
    ].filter(Boolean),
  }

  const { isPremium } = restaurant

  return (
    <>
      {/* Schema — Google ke liye */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Scroll reveal script */}
      <ScrollReveal />

      {/* Free tier top branding bar */}
      {!isPremium && <FreeBranding isVerified={restaurant.isVerified} />}

      {/* Sticky header */}
      <Header restaurantName={restaurant.name} isPremium={isPremium} />

      {/* Main content */}
      <main>
        {/* 1. Hero */}
        <HeroSection restaurant={restaurant} />

        {/* 2. About */}
        <div className="reveal">
          <AboutSection restaurant={restaurant} />
        </div>

        {/* 3. Menu */}
        <div>
          <MenuSection restaurant={restaurant} />
        </div>

        {/* 4. Gallery */}
        {restaurant.images?.length > 1 && (
          <div className="reveal">
            <GallerySection restaurant={restaurant} />
          </div>
        )}

        {/* 5. Contact + Map */}
        <div className="reveal">
          <ContactSection restaurant={restaurant} />
        </div>

        {/* 6. Order CTA section */}
        {/* <div className="reveal">
          <section className="py-16 px-4 bg-gradient-to-br from-primary-700 to-primary-600 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Hungry? Order Now!
              </h2>
              <p className="text-primary-200 mb-8 text-lg">
                Get {restaurant.name} delivered right to your door
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {restaurant.swiggy_link && (
                  <a
                    href={restaurant.swiggy_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-[#FC8019] hover:bg-[#e5721a] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 text-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg> Order on Swiggy
                  </a>
                )}
                {restaurant.zomato_link && (
                  <a
                    href={restaurant.zomato_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 bg-[#E23744] hover:bg-[#cb2f3c] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 text-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                    </svg> Order on Zomato
                  </a>
                )}
              </div>
            </div>
          </section>
        </div> */}

        {/* 7. Similar Restaurants — footer ke bilkul upar */}
        {similarRestaurants.length > 0 && (
          <div className="reveal">
            <SimilarRestaurants restaurants={similarRestaurants} />
          </div>
        )}
      </main>

      {/* Footer */}
      <RestaurantFooter restaurant={restaurant} isPremium={isPremium} />

      {/* Sticky WhatsApp */}
      <WhatsAppButton phone={restaurant.whatsapp} restaurantName={restaurant.name} />
    </>
  )
}