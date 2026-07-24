import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// ─── On-demand revalidation endpoint ──────────────────────────────────────
// URL: POST /api/revalidate
// Body: { "slug": "restaurant-slug", "secret": "your-secret-here" }
//
// Admin panel jab bhi kisi restaurant ka data update kare (is_premium,
// menu, images, etc.), DB update ke turant baad ye endpoint call karo.
// Ye us specific page ka static cache clear karke fresh render trigger
// karega — bina poore site ko rebuild kiye.

export async function POST(req) {
  try {
    const body = await req.json()
    const { slug, secret } = body

    // ── Security check ──────────────────────────────────────────────────
    // .env mein REVALIDATE_SECRET set karo, taaki koi bhi random banda
    // ye endpoint hit karke tumhare pages revalidate na kar sake.
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { revalidated: false, message: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!slug) {
      return NextResponse.json(
        { revalidated: false, message: 'slug is required' },
        { status: 400 }
      )
    }

    // Specific restaurant page revalidate karo
    revalidatePath(`/restaurant/${slug}`)

    return NextResponse.json({
      revalidated: true,
      slug,
      now: Date.now(),
    })
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, message: err.message },
      { status: 500 }
    )
  }
}