// =============================================
// migrate-to-supabase.js
// Run karo: node scripts/migrate-to-supabase.js
// Yeh existing restaurants.json ka data Supabase mein upload karega
// =============================================

require('dotenv').config({ path: '../.env.local' })
const { createClient } = require('@supabase/supabase-js')
const restaurants = require('../data/restaurants.json')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

async function migrateRestaurants() {
  console.log(`\n🚀 Starting migration of ${restaurants.length} restaurants...\n`)

  for (const r of restaurants) {
    try {
      const { data: restaurant, error: rError } = await supabase
        .from('restaurants')
        .insert({
          name:         r.name,
          slug:         r.slug,
          tagline:      r.tagline,
          description:  r.description,
          cuisine:      r.cuisine || [],
          address:      r.address,
          phone:        r.phone,
          email:        r.email,
          hours:        r.hours,
          rating:       r.rating || 0,
          review_count: r.review_count || 0,
          price_range:  r.price_range || '₹₹',
          is_premium:   r.isPremium || false,
          whatsapp:     r.whatsapp,
          swiggy_link:  r.swiggy_link,
          zomato_link:  r.zomato_link,
          map_embed:    r.map_embed,
          instagram:    r.social?.instagram || null,
          facebook:     r.social?.facebook  || null,
          twitter:      r.social?.twitter   || null,
        })
        .select()
        .single()

      if (rError) throw rError
      const rid = restaurant.id
      console.log(`✅ Restaurant "${r.name}" inserted (ID: ${rid})`)

      if (r.menu && r.menu.length > 0) {
        const menuRows = r.menu.map(item => ({
          restaurant_id: rid,
          name:         item.name,
          price:        item.price,
          description:  item.description,
          category:     item.category || 'Mains',
          is_popular:   item.isPopular || false,
        }))

        const { error: mError } = await supabase.from('menu_items').insert(menuRows)
        if (mError) throw mError
        console.log(`   📋 ${menuRows.length} menu items inserted`)
      }

      if (r.images && r.images.length > 0) {
        const imageRows = r.images.map((url, i) => ({
          restaurant_id: rid,
          url,
          sort_order: i,
        }))

        const { error: iError } = await supabase.from('restaurant_images').insert(imageRows)
        if (iError) throw iError
        console.log(`   🖼️  ${imageRows.length} images inserted`)
      }

    } catch (err) {
      console.error(`❌ Failed for "${r.name}":`, err.message)
    }
  }

  console.log('\n✅ Migration complete!\n')
}

migrateRestaurants()