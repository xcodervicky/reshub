import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const revalidate = 3600

export default async function sitemap() {
  const baseUrl = 'https://www.dinecup.com'

  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('slug, updated_at')
    .eq('is_active', true)

  if (error) {
    console.error('Sitemap fetch error:', error)
    return [{ url: baseUrl, lastModified: new Date(), priority: 1 }]
  }

  const restaurantPages = restaurants.map((r) => ({
    url: `${baseUrl}/restaurant/${r.slug}`,
    lastModified: new Date(r.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...restaurantPages,
  ]
}