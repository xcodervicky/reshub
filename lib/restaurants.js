// lib/restaurants.js
// JSON ki jagah ab Supabase se data fetch hoga

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// ─── Helper: row data ko old JSON format mein convert karo ────────────────────
// (Existing components bina kisi change ke kaam karte rahenge)
function formatRestaurant(r, images = [], menu = []) {
  return {
    id:           r.id,
    name:         r.name,
    slug:         r.slug,
    tagline:      r.tagline,
    description:  r.description,
    cuisine:      r.cuisine || [],
    address:      r.address,
    phone:        r.phone,
    email:        r.email,
    hours:        r.hours,
    rating:       parseFloat(r.rating) || 0,
    review_count: r.review_count || 0,
    price_range:  r.price_range,
    isPremium:    r.is_premium,
    whatsapp:     r.whatsapp,
    swiggy_link:  r.swiggy_link,
    zomato_link:  r.zomato_link,
    map_embed:    r.map_embed,
    social: {
      instagram: r.instagram || '',
      facebook:  r.facebook  || '',
      twitter:   r.twitter   || '',
    },
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.url),
    menu: menu.map(m => ({
      name:        m.name,
      price:       parseFloat(m.price),
      description: m.description,
      category:    m.category,
      isPopular:   m.is_popular,
    })),
  }
}

// ─── Get all restaurants (for homepage listing) ───────────────────────────────
export async function getAllRestaurants() {
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_images (url, sort_order),
      menu_items (name, price, description, category, is_popular)
    `)
    .eq('is_active', true)
    .order('is_premium', { ascending: false })
    .order('rating', { ascending: false })

  if (error) {
    console.error('getAllRestaurants error:', error)
    return []
  }

  return restaurants.map(r =>
    formatRestaurant(r, r.restaurant_images, r.menu_items)
  )
}

// ─── Get single restaurant by slug ───────────────────────────────────────────
export async function getRestaurantBySlug(slug) {
  const { data: r, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      restaurant_images (url, sort_order),
      menu_items (name, price, description, category, is_popular)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !r) return null

  return formatRestaurant(r, r.restaurant_images, r.menu_items)
}

// ─── Get all slugs (for static generation) ───────────────────────────────────
export async function getAllSlugs() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('is_active', true)

  if (error) return []
  return data.map(r => r.slug)
}

// ─── Search restaurants ───────────────────────────────────────────────────────
export async function searchRestaurants(query) {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`*, restaurant_images (url, sort_order), menu_items (*)`)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

  if (error) return []
  return data.map(r => formatRestaurant(r, r.restaurant_images, r.menu_items))
}