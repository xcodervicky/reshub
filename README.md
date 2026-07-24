# 🍽️ RestaurantHub — Scalable Restaurant Listing System

A production-grade restaurant listing platform built with **Next.js App Router**, **Tailwind CSS**, and JSON-based data management. Supports 1000+ restaurant pages via a single master template.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
restaurant-app/
├── app/
│   ├── layout.js                    # Root layout (fonts, metadata)
│   ├── globals.css                  # Global styles + animations
│   ├── page.js                      # Homepage with all restaurant listings
│   ├── not-found.js                 # Custom 404 page
│   ├── components/
│   │   ├── Header.js                # Sticky header with logo + CTA
│   │   ├── HeroSection.js           # Full-screen hero with overlay
│   │   ├── AboutSection.js          # About + stats + social links
│   │   ├── MenuSection.js           # Menu with category filter
│   │   ├── GallerySection.js        # Photo gallery with lightbox
│   │   ├── ContactSection.js        # Contact info + Google Map
│   │   ├── WhatsAppButton.js        # Sticky WhatsApp chat button
│   │   ├── FreeBranding.js          # Free tier branding + upgrade CTA
│   │   ├── RestaurantFooter.js      # Page footer
│   │   └── ScrollReveal.js          # Scroll animation observer
│   └── restaurant/
│       └── [slug]/
│           └── page.js              # ⭐ MASTER TEMPLATE for all restaurants
├── data/
│   └── restaurants.json             # All restaurant data
├── lib/
│   └── restaurants.js               # Data utility functions
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## ➕ How to Add a New Restaurant

Simply add a new object to `data/restaurants.json`:

```json
{
  "id": 6,
  "name": "My Restaurant",
  "slug": "my-restaurant",           // URL: /restaurant/my-restaurant
  "tagline": "Your catchy tagline",
  "description": "Full description of your restaurant...",
  "cuisine": ["Indian", "Chinese"],
  "address": "123 Main St, City, State 000000",
  "phone": "+91 99999 00000",
  "email": "hello@myrestaurant.com",
  "hours": "Mon–Sun: 11:00 AM – 11:00 PM",
  "rating": 4.5,
  "review_count": 500,
  "price_range": "₹₹",
  "isPremium": false,
  "images": [
    "https://your-image-url.com/hero.jpg",
    "https://your-image-url.com/gallery1.jpg"
  ],
  "menu": [
    {
      "name": "Dish Name",
      "price": 250,
      "description": "Short description",
      "category": "Mains",
      "isPopular": true
    }
  ],
  "social": {
    "instagram": "https://instagram.com/yourhandle",
    "facebook": "https://facebook.com/yourpage",
    "twitter": ""
  },
  "swiggy_link": "https://swiggy.com/your-page",
  "zomato_link": "https://zomato.com/your-page",
  "whatsapp": "919999900000",
  "map_embed": "YOUR_GOOGLE_MAPS_EMBED_URL"
}
```

That's it. Run `npm run build` and the new page is automatically generated at `/restaurant/my-restaurant`.

---

## 🌐 Deploy on Vercel

### Method 1: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Method 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Click **Deploy** (zero config needed for Next.js)

### Environment Variables (for future API)
In Vercel dashboard → Settings → Environment Variables:
```
DATABASE_URL=your_database_url
API_SECRET=your_secret
```

---

## 📈 How to Scale to 1000+ Pages

### Current Approach (JSON file)
Works great for up to ~500 restaurants. Build time is fast.

### For 1000+ Restaurants

**Option 1: Keep using JSON** (simplest)
- Split into multiple JSON files by city or category
- Import and merge them in `lib/restaurants.js`

**Option 2: Database + API Routes** (recommended for 1000+)
```js
// app/restaurant/[slug]/page.js
// Change data fetching:

export async function generateStaticParams() {
  const res = await fetch('https://yourapi.com/restaurants/slugs')
  const slugs = await res.json()
  return slugs.map(slug => ({ slug }))
}

export default async function RestaurantPage({ params }) {
  const res = await fetch(`https://yourapi.com/restaurants/${params.slug}`)
  const restaurant = await res.json()
  // ... rest stays the same
}
```

**Option 3: ISR (Incremental Static Regeneration)**
Add `revalidate` for auto-updating pages without full rebuild:
```js
// In page.js, add:
export const revalidate = 3600 // revalidate every hour
```

**Option 4: On-demand revalidation**
```js
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache'

export async function POST(req) {
  const { slug } = await req.json()
  revalidatePath(`/restaurant/${slug}`)
  return Response.json({ revalidated: true })
}
```

---

## 🆓 Free vs ⭐ Premium Logic

Set `"isPremium": true` in the restaurant JSON to:
- ✅ Remove "Powered by RestaurantHub" branding
- ✅ Remove the upgrade CTA section
- ✅ Show Premium badge in header and hero

---

## 🎨 UI Features

- **Dark overlay hero** with restaurant name, rating, and order buttons
- **Category filter** on menu section
- **Lightbox gallery** with navigation
- **Google Maps embed** in contact section
- **Sticky WhatsApp** button with pulse animation
- **Scroll reveal** animations on sections
- **Swiggy** (orange) and **Zomato** (red) branded buttons
- **Free tier branding bar** at top for non-premium

---

## 📱 Mobile First

All components use responsive Tailwind classes:
- `sm:` — 640px+
- `md:` — 768px+
- `lg:` — 1024px+

The hero, menu grid, and contact layout all adapt to mobile.

---

## 🔧 Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 App Router | Framework + SSG |
| Tailwind CSS | Styling |
| `next/font` | Optimized fonts (Playfair Display + Inter) |
| `next/image` | Optimized images |
| JSON | Data source (API-ready) |
| Vercel | Deployment |
