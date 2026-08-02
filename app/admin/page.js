'use client'
// app/admin/page.js

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

const BLANK_FORM = {
  name: '', slug: '', tagline: '', description: '',
  cuisine: '', address: '', phone: '', email: '', hours: '',
  rating: '', review_count: '', price_range: '₹₹', currency: 'INR',
  is_premium: false, is_verified: false, whatsapp: '', swiggy_link: '', zomato_link: '',
  website_link: '', directions_link: '',
  map_embed: '', instagram: '', facebook: '', twitter: '',
  images: '',
  menu: '',
}

function toSlug(name) {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// ─── Revalidation helper ───────────────────────────────────────────────────
// Restaurant page ka static cache clear karta hai taaki DB update hote hi
// live page turant fresh data dikhaye (ISR on-demand revalidation).
async function triggerRevalidate(slug) {
  if (!slug) return
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
      }),
    })
  } catch (err) {
    // Revalidate fail hua toh bhi silently continue karo — DB update toh
    // ho hi chuka hai, page 60 sec ke andar apne aap bhi fresh ho jayega
    console.error('Revalidate failed:', err)
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pass, setPass] = useState('')
  const [passError, setPassError] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('list')
  const [form, setForm] = useState(BLANK_FORM)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadRestaurants = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, slug, rating, is_premium, is_verified, is_active, created_at, cuisine')
      .order('created_at', { ascending: false })
    if (!error) setRestaurants(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) loadRestaurants()
  }, [authed, loadRestaurants])

  const handleLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true)
      setPassError(false)
    } else {
      setPassError(true)
      setPass('')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-5xl">🍽️</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3">Admin Login</h2>
            <p className="text-gray-400 text-sm mt-1">Sirf authorized log hi enter kar sakte hain</p>
          </div>
          <input
            type="password"
            placeholder="Password daalo..."
            value={pass}
            onChange={e => { setPass(e.target.value); setPassError(false) }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 mb-3 ${passError ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
          />
          {passError && (
            <p className="text-red-500 text-xs mb-3 text-center">❌ Galat password! Dobara try karo.</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition"
          >🔐 Login Karo</button>
        </div>
      </div>
    )
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && view === 'add') next.slug = toSlug(value)
      return next
    })
  }

  const openEdit = async (id) => {
    const { data: r } = await supabase
      .from('restaurants')
      .select(`*, restaurant_images(url, sort_order), menu_items(*)`)
      .eq('id', id)
      .single()
    if (!r) return
    setForm({
      name: r.name || '', slug: r.slug || '', tagline: r.tagline || '',
      description: r.description || '', cuisine: (r.cuisine || []).join(', '),
      address: r.address || '', phone: r.phone || '', email: r.email || '',
      hours: r.hours || '', rating: r.rating || '', review_count: r.review_count || '',
      price_range: r.price_range || '₹₹', currency: r.currency || 'INR',
      is_premium: r.is_premium || false, is_verified: r.is_verified || false,
      whatsapp: r.whatsapp || '', swiggy_link: r.swiggy_link || '',
      zomato_link: r.zomato_link || '',
      website_link: r.website_link || '', directions_link: r.directions_link || '',
      map_embed: r.map_embed || '',
      instagram: r.instagram || '', facebook: r.facebook || '', twitter: r.twitter || '',
      images: (r.restaurant_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(i => i.url).join('\n'),
      menu: JSON.stringify(
        (r.menu_items || []).map(m => ({
          name: m.name, price: m.price, description: m.description,
          category: m.category, isPopular: m.is_popular
        })), null, 2
      ),
    })
    setEditId(id)
    setView('edit')
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) return showToast('Name aur Slug required hai!', 'error')
    setSaving(true)
    const payload = {
      name: form.name, slug: form.slug, tagline: form.tagline,
      description: form.description,
      cuisine: form.cuisine.split(',').map(c => c.trim()).filter(Boolean),
      address: form.address, phone: form.phone, email: form.email,
      hours: form.hours,
      rating: parseFloat(form.rating) || 0,
      review_count: parseInt(form.review_count) || 0,
      price_range: form.price_range, currency: form.currency, is_premium: form.is_premium,
      is_verified: form.is_verified,
      whatsapp: form.whatsapp, swiggy_link: form.swiggy_link,
      zomato_link: form.zomato_link,
      website_link: form.website_link, directions_link: form.directions_link,
      map_embed: form.map_embed,
      instagram: form.instagram, facebook: form.facebook, twitter: form.twitter,
    }
    let restaurantId = editId
    // Purane slug ko yaad rakho — agar edit ke dauraan slug change ho jaye
    // toh humein DONO (purana + naya) page revalidate karne honge
    const previousSlug = view === 'edit'
      ? restaurants.find(r => r.id === editId)?.slug
      : null

    if (view === 'add') {
      const { data, error } = await supabase.from('restaurants').insert(payload).select().single()
      if (error) { setSaving(false); return showToast('Error: ' + error.message, 'error') }
      restaurantId = data.id
    } else {
      const { error } = await supabase.from('restaurants').update(payload).eq('id', editId)
      if (error) { setSaving(false); return showToast('Error: ' + error.message, 'error') }
      await supabase.from('restaurant_images').delete().eq('restaurant_id', editId)
      await supabase.from('menu_items').delete().eq('restaurant_id', editId)
    }
    const imageUrls = form.images.split('\n').map(u => u.trim()).filter(Boolean)
    if (imageUrls.length > 0) {
      await supabase.from('restaurant_images').insert(
        imageUrls.map((url, i) => ({ restaurant_id: restaurantId, url, sort_order: i }))
      )
    }
    if (form.menu.trim()) {
      try {
        const menuItems = JSON.parse(form.menu)
        if (Array.isArray(menuItems) && menuItems.length > 0) {
          await supabase.from('menu_items').insert(
            menuItems.map(m => ({
              restaurant_id: restaurantId,
              name: m.name, price: m.price, description: m.description,
              category: m.category || 'Mains', is_popular: m.isPopular || false,
            }))
          )
        }
      } catch { /* invalid JSON, skip */ }
    }

    // ── Revalidate the live page(s) so changes show up immediately ────────
    await triggerRevalidate(form.slug)
    if (previousSlug && previousSlug !== form.slug) {
      await triggerRevalidate(previousSlug)
    }

    setSaving(false)
    showToast(view === 'add' ? '✅ Restaurant add ho gaya!' : '✅ Restaurant update ho gaya!')
    setForm(BLANK_FORM)
    setEditId(null)
    setView('list')
    loadRestaurants()
  }

  const toggleField = async (id, field, current, slug) => {
    await supabase.from('restaurants').update({ [field]: !current }).eq('id', id)
    await triggerRevalidate(slug)
    loadRestaurants()
  }

  const handleDelete = async (id, slug) => {
    await supabase.from('restaurants').delete().eq('id', id)
    await triggerRevalidate(slug)
    setDeleteConfirm(null)
    showToast('🗑️ Restaurant delete ho gaya!', 'error')
    loadRestaurants()
  }

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold text-sm transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'
          }`}>{toast.msg}</div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete karna chahte ho?</h3>
            <p className="text-gray-500 text-sm mb-5">
              <strong>{deleteConfirm.name}</strong> permanently delete ho jayega. Yeh undo nahi hoga.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.slug)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-bold"
              >Haan, Delete Karo</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">RestaurantHub Admin</h1>
              <p className="text-xs text-gray-400">Restaurant Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' ? (
              <button onClick={() => { setForm(BLANK_FORM); setView('add') }}
                className="text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                style={{ background: '#16a34a' }}
              >+ New Restaurant</button>
            ) : (
              <button onClick={() => { setView('list'); setForm(BLANK_FORM); setEditId(null) }}
                className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
              >← Back to List</button>
            )}
            <button onClick={() => setAuthed(false)}
              className="border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
            >🚪 Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {view === 'list' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Restaurants', value: restaurants.length, icon: '🏪' },
                { label: 'Premium', value: restaurants.filter(r => r.is_premium).length, icon: '✦' },
                { label: 'Active', value: restaurants.filter(r => r.is_active).length, icon: '🟢' },
                { label: 'Inactive', value: restaurants.filter(r => !r.is_active).length, icon: '⏸️' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
              <input type="text" placeholder="🔍 Restaurant dhundo (naam ya slug)..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-gray-700" />
            </div>
            {loading ? (
              <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-3">🍽️</div>
                <p>Koi restaurant nahi mila</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="text-left px-4 py-3">Restaurant</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Cuisine</th>
                      <th className="text-center px-4 py-3">Rating</th>
                      <th className="text-center px-4 py-3">Premium</th>
                      <th className="text-center px-4 py-3">Active</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">{r.name}</div>
                          <div className="text-xs text-gray-400">/restaurant/{r.slug}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-xs text-gray-500">{(r.cuisine || []).slice(0, 2).join(', ')}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-yellow-500 font-bold">★ {r.rating}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleField(r.id, 'is_premium', r.is_premium, r.slug)}
                            className={`px-2 py-0.5 rounded-full text-xs font-bold transition ${r.is_premium ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}>{r.is_premium ? '✦ Premium' : 'Free'}</button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleField(r.id, 'is_active', r.is_active, r.slug)}
                            className={`w-8 h-4 rounded-full transition relative ${r.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${r.is_active ? 'left-4' : 'left-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <a href={`/restaurant/${r.slug}`} target="_blank"
                              className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition">View</a>
                            <button onClick={() => openEdit(r.id)}
                              className="text-xs px-2 py-1 text-green-700 hover:bg-green-50 rounded transition">Edit</button>
                            <button onClick={() => setDeleteConfirm({ id: r.id, name: r.name, slug: r.slug })}
                              className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {(view === 'add' || view === 'edit') && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {view === 'add' ? '➕ Naya Restaurant Add Karo' : `✏️ Edit: ${form.name}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Section title="Basic Info">
                <Field label="Restaurant Name *" value={form.name} onChange={v => handleChange('name', v)} placeholder="Spicy Bites" />
                <Field label="Slug (URL) *" value={form.slug} onChange={v => handleChange('slug', v)} placeholder="spicy-bites" />
                <Field label="Tagline" value={form.tagline} onChange={v => handleChange('tagline', v)} placeholder="Where Every Bite Tells a Story" />
                <Field label="Cuisine (comma separated)" value={form.cuisine} onChange={v => handleChange('cuisine', v)} placeholder="Indian, Street Food, Snacks" />
                <Field label="Price Range" value={form.price_range} onChange={v => handleChange('price_range', v)} placeholder="₹₹ or $$" />
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={e => handleChange('currency', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="INR">₹ INR (Indian Rupee)</option>
                    <option value="USD">$ USD (US Dollar)</option>
                  </select>
                </div>
              </Section>
              <Section title="Contact & Location">
                <Field label="Address" value={form.address} onChange={v => handleChange('address', v)} placeholder="Shop 12, Andheri West, Mumbai" />
                <Field label="Phone" value={form.phone} onChange={v => handleChange('phone', v)} placeholder="+91 98765 43210" />
                <Field label="Email" value={form.email} onChange={v => handleChange('email', v)} placeholder="hello@restaurant.in" />
                <Field label="WhatsApp (without +)" value={form.whatsapp} onChange={v => handleChange('whatsapp', v)} placeholder="919876543210" />
                <Field label="Hours" value={form.hours} onChange={v => handleChange('hours', v)} placeholder="Mon–Sun: 11:00 AM – 11:00 PM" />
              </Section>
              <Section title="Ratings & Status">
                <Field label="Rating (0–5)" type="number" value={form.rating} onChange={v => handleChange('rating', v)} placeholder="4.7" />
                <Field label="Review Count" type="number" value={form.review_count} onChange={v => handleChange('review_count', v)} placeholder="1284" />
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input type="checkbox" checked={form.is_premium} onChange={e => handleChange('is_premium', e.target.checked)} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm font-medium text-gray-700">✦ Premium Restaurant</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={form.is_verified}
                      onChange={e => handleChange('is_verified', e.target.checked)}
                      className="w-4 h-4 accent-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">✓ Verified Restaurant</span>
                  </label>
                
              </Section>
              <Section title="Online Ordering & Social">
                <Field label="Swiggy Link" value={form.swiggy_link} onChange={v => handleChange('swiggy_link', v)} placeholder="https://swiggy.com/..." />
                <Field label="Zomato Link" value={form.zomato_link} onChange={v => handleChange('zomato_link', v)} placeholder="https://zomato.com/..." />
                <Field label="Website Link" value={form.website_link} onChange={v => handleChange('website_link', v)} placeholder="https://myrestaurant.com" />
                <Field label="Directions Link (Google Maps)" value={form.directions_link} onChange={v => handleChange('directions_link', v)} placeholder="https://maps.google.com/?q=..." />
                <Field label="Instagram" value={form.instagram} onChange={v => handleChange('instagram', v)} placeholder="https://instagram.com/..." />
                <Field label="Facebook" value={form.facebook} onChange={v => handleChange('facebook', v)} placeholder="https://facebook.com/..." />
              </Section>
              <div className="md:col-span-2">
                <Section title="Description">
                  <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
                    rows={4} placeholder="Restaurant ke baare mein likhein..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
                </Section>
              </div>
              <div className="md:col-span-2">
                <Section title="Images (ek URL per line — pehla image cover banta hai)">
                  <textarea value={form.images} onChange={e => handleChange('images', e.target.value)}
                    rows={4} placeholder="https://images.unsplash.com/photo-xxx&#10;https://images.unsplash.com/photo-yyy"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none font-mono" />
                </Section>
              </div>
              <div className="md:col-span-2">
                <Section title="Menu (JSON format)">
                  <textarea value={form.menu} onChange={e => handleChange('menu', e.target.value)}
                    rows={8}
                    placeholder={`[\n  { "name": "Pav Bhaji", "price": 120, "description": "Mumbai's iconic dish", "category": "Mains", "isPopular": true }\n]`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none font-mono" />
                  <p className="text-xs text-gray-400 mt-1">Fields: name, price, description, category (Mains/Snacks/Beverages/Desserts), isPopular (true/false). Price sirf number likho (currency symbol upar Currency dropdown se decide hoga)</p>
                </Section>
              </div>
              <div className="md:col-span-2">
                <Section title="Google Maps Embed URL">
                  <input value={form.map_embed} onChange={e => handleChange('map_embed', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
                </Section>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => { setView('list'); setForm(BLANK_FORM); setEditId(null) }}
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
              >Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 text-white py-3 rounded-xl font-bold text-sm transition"
                style={{ background: saving ? '#86efac' : '#16a34a' }}
              >{saving ? 'Saving...' : view === 'add' ? '✅ Restaurant Add Karo' : '✅ Changes Save Karo'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400" />
    </div>
  )
}