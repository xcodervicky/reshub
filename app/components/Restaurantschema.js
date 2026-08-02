// RestaurantSchema.js
// Server component — no 'use client' needed, renders a <script type="application/ld+json">
// tag containing schema.org Restaurant structured data, generated from restaurant DB data.
//
// USAGE (in your restaurant detail page — app/restaurant/[slug]/page.js):
//
//   import RestaurantSchema from '@/components/RestaurantSchema'
//
//   export default async function RestaurantPage({ params }) {
//     const restaurant = await getRestaurant(params.slug)   // your existing fetch
//     return (
//       <>
//         <RestaurantSchema restaurant={restaurant} siteUrl="https://yourdomain.com" />
//         <HeroSection restaurant={restaurant} />
//         {/* ...rest of page */}
//       </>
//     )
//   }
//
// This can go ANYWHERE in the page JSX — it renders nothing visible.

function priceRangeToSymbol(priceRange, currency) {
  // schema.org wants priceRange as $, $$, $$$ or $$$$ style — reuse as-is
  // if you already store "₹₹" or "$$" etc, that works directly
  return priceRange || undefined
}

export default function RestaurantSchema({ restaurant, siteUrl }) {
  const {
    name,
    tagline,
    description,
    address,
    phone,
    email,
    rating,
    review_count,
    price_range,
    currency,
    cuisine = [],
    images = [],
    hours,
    slug,
    website_link,
  } = restaurant

  if (!name) return null

  const pageUrl = siteUrl && slug ? `${siteUrl}/restaurant/${slug}` : undefined

  // Convert "Mon–Sun: 11:00 AM – 11:00 PM" style hours into schema's
  // openingHours array as best-effort. If your hours field is structured
  // differently, adjust this parsing — schema just needs a plain string
  // like "Mo-Su 11:00-23:00" ideally, but a readable string is accepted too.
  const openingHoursSpec = hours
    ? [{
        '@type': 'OpeningHoursSpecification',
        description: hours,
      }]
    : undefined

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    ...(tagline || description ? { description: description || tagline } : {}),
    ...(pageUrl ? { url: pageUrl, '@id': pageUrl } : {}),
    ...(website_link ? { sameAs: [website_link] } : {}),
    ...(images.length > 0 ? { image: images } : {}),
    ...(address ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
      }
    } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(cuisine.length > 0 ? { servesCuisine: cuisine } : {}),
    ...(price_range ? { priceRange: priceRangeToSymbol(price_range, currency) } : {}),
    ...(currency ? { currenciesAccepted: currency } : {}),
    ...(openingHoursSpec ? { openingHoursSpecification: openingHoursSpec } : {}),
    ...(rating && review_count ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: review_count,
        bestRating: 5,
        worstRating: 1,
      }
    } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify + this replace guards against </script> breakout in
      // user-entered restaurant names/descriptions (basic XSS safety)
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}