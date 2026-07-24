'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── DATA ────────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  { text: 'Basic restaurant listing',        included: true  },
  { text: 'Add up to 20 menu items',         included: true  },
  { text: 'Google visibility',               included: true  },
  { text: 'Email support',                   included: true  },
  { text: 'Premium badge',                   included: false },
  { text: 'DineCup branding removed',        included: false },
  { text: '3× more Google visibility',       included: false },
  { text: 'Push to top of search results',   included: false },
  { text: 'WhatsApp priority support',       included: false },
  { text: 'Lifetime free updates',           included: false },
]

const PAID_FEATURES = [
  { text: 'Premium restaurant listing',      included: true },
  { text: 'Unlimited menu items',            included: true },
  { text: 'Premium & Verified badge',        included: true },
  { text: 'No DineCup branding on page',     included: true },
  { text: '3× more Google visibility',       included: true },
  { text: 'Push to top of search results',   included: true },
  { text: 'Fast WhatsApp support',           included: true },
  { text: 'Future updates free for lifetime',included: true },
]

const FAQS = [
  {
    q: 'Can I upgrade or downgrade anytime?',
    a: 'Yes, you can upgrade to Premium or go back to Free at any time. Changes take effect immediately.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, all major credit/debit cards, and net banking via Razorpay — completely secure.',
  },
  {
    q: 'What does the Verified badge mean?',
    a: 'The Verified badge tells customers your restaurant has been reviewed and approved by DineCup — significantly boosting trust and click-through rates.',
  },
  {
    q: 'How does 3× more Google visibility work?',
    a: 'Premium listings are structured with rich schema markup, priority indexing, and enhanced metadata that help Google rank your page higher in local search results.',
  },
]

// ─── ICONS ───────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#16a34a" fillOpacity="0.12" />
    <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#e5e7eb" />
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="#f59e0b" aria-hidden="true">
    <path d="M6.5 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6L1.3 4.8l3.6-.5z" />
  </svg>
)

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1l1.6 1.4h2.4l.4 2.3 1.8 1.4-.9 2.3.9 2.3-1.8 1.4-.4 2.3H8.6L7 13.6l-1.6-1.2H2.6l-.4-2.3L.4 8.7l.9-2.3-.9-2.3 1.8-1.4.4-2.3H5.4z" fill="#3b82f6" />
    <path d="M4.5 7l1.5 1.5 3.5-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <path d="M4 6l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── HEADER ──────────────────────────────────────────────────────────────────

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={s.header}>
      <style>{`
        .dc-nav { display: flex; gap: 24px; margin-left: auto; align-items: center; }
        .dc-cta { display: block; }
        .dc-hamburger { display: none; }
        .dc-mobile-menu { display: none; }
        @media (max-width: 640px) {
          .dc-nav { display: none; }
          .dc-cta { display: none; }
          .dc-hamburger { display: flex; }
          .dc-mobile-menu { display: flex; }
        }
      `}</style>

      <div style={s.headerInner}>
        <Link href="/" style={s.logo}>
          <span style={s.logoMark}>D</span>
          <span style={s.logoText}>DineCup</span>
        </Link>

        {/* Desktop nav */}
        <nav className="dc-nav">
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/restaurants" style={s.navLink}>Restaurants</Link>
          <Link href="/pricing" style={{ ...s.navLink, ...s.navActive }}>Pricing</Link>
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://tally.so/r/A74zE0"
          target="_blank"
          rel="noopener noreferrer"
          style={s.headerCta}
          className="dc-cta"
        >
          Add Restaurant →
        </a>

        {/* Hamburger button — mobile only */}
        <button
          className="dc-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={s.hamburgerBtn}
        >
          {menuOpen ? (
            /* X icon */
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 5l12 12M17 5L5 17" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M3 6h16M3 11h16M3 16h16" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="dc-mobile-menu" style={s.mobileMenu}>
          <Link href="/" style={s.mobileNavLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/restaurants" style={s.mobileNavLink} onClick={() => setMenuOpen(false)}>Restaurants</Link>
          <Link href="/pricing" style={{ ...s.mobileNavLink, color: GREEN, fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Pricing</Link>
          <div style={s.mobileDivider} />
          <a
            href="https://tally.so/r/A74zE0"
            target="_blank"
            rel="noopener noreferrer"
            style={s.mobileCtaBtn}
            onClick={() => setMenuOpen(false)}
          >
            Add Restaurant →
          </a>
        </div>
      )}
    </header>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.footerInner}>
        <div style={s.footerTop}>
          <div>
            <div style={s.footerBrand}>
              <span style={s.footerLogoMark}>D</span>
              <span style={s.footerLogoText}>DineCup</span>
            </div>
            <p style={s.footerTagline}>
              Discover the best restaurants near you.<br />Menus, ratings, and direct ordering links.
            </p>
          </div>
          <div style={s.footerLinks}>
            <div style={s.footerCol}>
              <p style={s.footerColHead}>Platform</p>
              <Link href="/" style={s.footerLink}>Home</Link>
              <Link href="/restaurants" style={s.footerLink}>All Restaurants</Link>
              <Link href="/pricing" style={s.footerLink}>Pricing</Link>
            </div>
            <div style={s.footerCol}>
              <p style={s.footerColHead}>Restaurant Owners</p>
              <a href="https://tally.so/r/A74zE0" target="_blank" rel="noopener noreferrer" style={s.footerLink}>Add Your Restaurant</a>
              <Link href="/pricing" style={s.footerLink}>Upgrade to Premium</Link>
            </div>
          </div>
        </div>
        <div style={s.footerBottom}>
          <p style={s.footerCopy}>© 2026 DineCup · Built with Next.js ❤️</p>
          <p style={s.footerPowered}>Powered by DineCup — Restaurant Discovery Platform</p>
        </div>
      </div>
    </footer>
  )
}

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={s.faqItem} onClick={() => setOpen(!open)}>
      <div style={s.faqQ}>
        <span style={s.faqQText}>{q}</span>
        <ChevronIcon open={open} />
      </div>
      {open && <p style={s.faqA}>{a}</p>}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  const monthlyPrice = 499
  const yearlyTotal  = 3999
  const yearlyPerMonth = Math.round(yearlyTotal / 12)

  return (
    <>
      <Header />

      <main style={s.main}>

        {/* ── HERO ── */}
        <section style={s.heroSection}>
          <span style={s.heroBadge}>Simple, transparent pricing</span>
          <h1 style={s.heroTitle}>Grow your restaurant<br />with DineCup</h1>
          <p style={s.heroSub}>
            Start free and upgrade when you're ready. No hidden fees,<br />
            no contracts — cancel anytime.
          </p>

          {/* toggle */}
          <div style={s.toggleRow}>
            <span style={{ ...s.togLabel, ...(yearly ? {} : s.togLabelActive) }}>Monthly</span>
            <button
              style={{ ...s.togBtn, ...(yearly ? s.togBtnOn : {}) }}
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
            >
              <span style={{ ...s.togThumb, ...(yearly ? s.togThumbOn : {}) }} />
            </button>
            <span style={{ ...s.togLabel, ...(yearly ? s.togLabelActive : {}) }}>Yearly</span>
            {yearly && <span style={s.saveChip}>Save ₹2,000</span>}
          </div>
        </section>

        {/* ── CARDS ── */}
        <section style={s.cardsSection}>
          <div style={s.cardsGrid}>

            {/* FREE */}
            <div style={s.card}>
              <p style={s.planLabel}>Free</p>
              <div style={s.priceRow}>
                <span style={s.priceNum}>₹0</span>
                <span style={s.pricePer}>/month</span>
              </div>
              <p style={s.planDesc}>Everything you need to get your restaurant discovered online.</p>

              <Link href="https://tally.so/r/A74zE0" style={s.btnOutline}>
                Get started free
              </Link>

              <div style={s.divider} />

              <ul style={s.featList}>
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} style={s.featItem}>
                    <span style={s.featIconWrap}>{f.included ? <CheckIcon /> : <CrossIcon />}</span>
                    <span style={{ ...s.featText, ...(f.included ? {} : s.featTextOff) }}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PREMIUM */}
            <div style={s.cardPaid}>
              <div style={s.popularBadge}>
                <StarIcon />&nbsp; Most Popular
              </div>

              <p style={s.planLabel}>Premium</p>
              <div style={s.priceRow}>
                <span style={{ ...s.priceNum, color: '#16a34a' }}>
                  ₹{yearly ? yearlyPerMonth.toLocaleString('en-IN') : monthlyPrice.toLocaleString('en-IN')}
                </span>
                <span style={s.pricePer}>/month</span>
              </div>

              {yearly
                ? <p style={s.billedNote}>Billed ₹{yearlyTotal.toLocaleString('en-IN')}/year</p>
                : <p style={s.billedNote}>or ₹3,999/year — save ₹2,000</p>
              }

              <p style={s.planDesc}>
                Maximum visibility, trust badges, and priority placement to grow faster.
              </p>

              <a href="/dashboard/billing/upgrade" style={s.btnPrimary}>
                Upgrade to Premium →
              </a>

              <div style={{ ...s.divider, borderColor: '#bbf7d0' }} />

              <ul style={s.featList}>
                {PAID_FEATURES.map((f, i) => (
                  <li key={i} style={s.featItem}>
                    <span style={s.featIconWrap}><CheckIcon /></span>
                    <span style={s.featText}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* badge showcase */}
              <div style={s.badgeRow}>
                <span style={s.badgePremium}><StarIcon />&nbsp;Premium</span>
                <span style={s.badgeVerified}><VerifiedIcon />&nbsp;Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <section style={s.trustBar}>
          {[
            ['🔒', 'Secure payments via Razorpay'],
            ['↩️', 'Cancel anytime, no lock-in'],
            ['🇮🇳', 'India-based team'],
            ['💬', 'WhatsApp support for Premium'],
          ].map(([icon, text]) => (
            <div key={text} style={s.trustItem}>
              <span style={s.trustIcon}>{icon}</span>
              <span style={s.trustText}>{text}</span>
            </div>
          ))}
        </section>

        {/* ── COMPARISON TABLE ── */}
       

        {/* ── FAQ ── */}
        <section style={s.faqSection}>
          <h2 style={s.sectionTitle}>Frequently asked questions</h2>
          <div style={s.faqList}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={s.ctaSection}>
          <h2 style={s.ctaTitle}>Ready to grow your restaurant?</h2>
          <p style={s.ctaSub}>Join hundreds of restaurants already on DineCup.</p>
          <div style={s.ctaBtns}>
            <a href="https://tally.so/r/A74zE0" target="_blank" rel="noopener noreferrer" style={s.btnPrimary}>
              Add your restaurant free →
            </a>
            <a href="/dashboard/billing/upgrade" style={s.btnOutlineGreen}>
              Upgrade to Premium
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const FONT  = "'Georgia', 'Times New Roman', serif"
const GREEN = '#16a34a'
const GREENBG = '#f0fdf4'

const s = {
  /* header */
  header: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 },
  headerInner: { maxWidth: 1100, margin: '0 auto', padding: '0 1.25rem', height: 60, display: 'flex', alignItems: 'center', gap: 16 },
  logo: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' },
  logoMark: { width: 32, height: 32, background: GREEN, color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 17, flexShrink: 0 },
  logoText: { fontFamily: FONT, fontWeight: 700, fontSize: 18, color: '#111' },
  nav: { display: 'flex', gap: 24, marginLeft: 'auto' },
  navLink: { fontFamily: FONT, fontSize: 14, color: '#6b7280', textDecoration: 'none' },
  navActive: { color: GREEN, fontWeight: 600 },
  headerCta: { background: GREEN, color: '#fff', fontFamily: FONT, fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: 16 },
  /* hamburger */
  hamburgerBtn: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  /* mobile menu */
  mobileMenu: { flexDirection: 'column', padding: '0.75rem 1.25rem 1.25rem', borderTop: '1px solid #f3f4f6', background: '#fff', gap: 2 },
  mobileNavLink: { fontFamily: FONT, fontSize: 15, color: '#374151', textDecoration: 'none', padding: '12px 4px', borderBottom: '1px solid #f9fafb', display: 'block' },
  mobileDivider: { height: 1, background: '#f3f4f6', margin: '8px 0' },
  mobileCtaBtn: { display: 'block', textAlign: 'center', background: GREEN, color: '#fff', fontFamily: FONT, fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 10, textDecoration: 'none', marginTop: 4 },

  /* main */
  main: { background: '#fff', fontFamily: FONT, minHeight: '100vh' },

  /* hero */
  heroSection: { textAlign: 'center', padding: '5rem 1.5rem 2rem', maxWidth: 680, margin: '0 auto' },
  heroBadge: { display: 'inline-block', background: GREENBG, color: GREEN, fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 20, border: `1px solid #bbf7d0`, marginBottom: '1.2rem', letterSpacing: '0.06em', textTransform: 'uppercase' },
  heroTitle: { fontFamily: FONT, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#111', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' },
  heroSub: { fontSize: 16, color: '#6b7280', lineHeight: 1.7, margin: '0 0 2rem' },

  /* toggle */
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  togLabel: { fontFamily: FONT, fontSize: 14, color: '#9ca3af' },
  togLabelActive: { color: '#111', fontWeight: 600 },
  togBtn: { width: 46, height: 26, background: '#e5e7eb', border: 'none', borderRadius: 20, cursor: 'pointer', position: 'relative', padding: 0, transition: 'background 0.2s' },
  togBtnOn: { background: GREEN },
  togThumb: { position: 'absolute', top: 4, left: 4, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', display: 'block' },
  togThumbOn: { left: 24 },
  saveChip: { background: GREENBG, color: GREEN, border: `1px solid #bbf7d0`, fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },

  /* cards */
  cardsSection: { padding: '2.5rem 1.5rem 3rem', maxWidth: 860, margin: '0 auto' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 },

  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '2rem' },
  cardPaid: { background: '#fff', border: `2px solid ${GREEN}`, borderRadius: 16, padding: '2rem', position: 'relative', boxShadow: '0 4px 24px rgba(22,163,74,0.08)' },

  popularBadge: { display: 'inline-flex', alignItems: 'center', background: '#fef9c3', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid #fde68a', marginBottom: '0.75rem', letterSpacing: '0.04em' },

  planLabel: { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 0.5rem' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 4, margin: '0 0 0.25rem' },
  priceNum: { fontFamily: FONT, fontSize: '3rem', fontWeight: 700, color: '#111', lineHeight: 1, letterSpacing: '-0.03em' },
  pricePer: { fontSize: 14, color: '#9ca3af' },
  billedNote: { fontSize: 12, color: '#9ca3af', margin: '0 0 0.75rem' },
  planDesc: { fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: '0.75rem 0 1.25rem' },

  btnOutline: { display: 'block', textAlign: 'center', padding: '11px 0', borderRadius: 10, border: '1px solid #d1d5db', fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#374151', textDecoration: 'none', transition: 'border-color 0.15s' },
  btnPrimary: { display: 'block', textAlign: 'center', padding: '12px 0', borderRadius: 10, background: GREEN, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none' },
  btnOutlineGreen: { display: 'inline-block', textAlign: 'center', padding: '12px 28px', borderRadius: 10, border: `2px solid ${GREEN}`, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: GREEN, textDecoration: 'none' },

  divider: { height: 1, background: '#f3f4f6', border: 'none', margin: '1.5rem 0' },

  featList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 },
  featItem: { display: 'flex', alignItems: 'center', gap: 9 },
  featIconWrap: { flexShrink: 0, display: 'flex' },
  featText: { fontFamily: FONT, fontSize: 14, color: '#374151', lineHeight: 1.4 },
  featTextOff: { color: '#d1d5db', textDecoration: 'line-through' },

  badgeRow: { display: 'flex', gap: 10, marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #dcfce7' },
  badgePremium: { display: 'inline-flex', alignItems: 'center', background: '#fef9c3', color: '#92400e', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: '1px solid #fde68a' },
  badgeVerified: { display: 'inline-flex', alignItems: 'center', background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: '1px solid #bfdbfe' },

  /* trust */
  trustBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem 2.5rem', padding: '1.5rem 1.5rem 2.5rem', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', maxWidth: 860, margin: '0 auto' },
  trustItem: { display: 'flex', alignItems: 'center', gap: 8 },
  trustIcon: { fontSize: 16 },
  trustText: { fontFamily: FONT, fontSize: 13, color: '#6b7280' },

  /* table */
  tableSection: { padding: '3rem 1.5rem', maxWidth: 720, margin: '0 auto' },
  sectionTitle: { fontFamily: FONT, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: '#111', textAlign: 'center', margin: '0 0 2rem', letterSpacing: '-0.01em' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontFamily: FONT },
  th: { fontSize: 13, fontWeight: 700, color: '#374151', padding: '10px 16px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', letterSpacing: '0.04em', textTransform: 'uppercase' },
  trEven: { background: '#f9fafb' },
  tdFeat: { fontFamily: FONT, fontSize: 14, color: '#374151', padding: '11px 16px', borderBottom: '1px solid #f3f4f6' },
  tdVal: { fontSize: 14, color: '#6b7280', padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' },

  /* faq */
  faqSection: { padding: '1rem 1.5rem 3rem', maxWidth: 640, margin: '0 auto' },
  faqList: { display: 'flex', flexDirection: 'column', gap: 0 },
  faqItem: { borderBottom: '1px solid #f3f4f6', padding: '1.1rem 0', cursor: 'pointer' },
  faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  faqQText: { fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#111' },
  faqA: { fontFamily: FONT, fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginTop: '0.75rem', paddingRight: 24 },

  /* bottom cta */
  ctaSection: { background: GREENBG, border: '1px solid #bbf7d0', borderRadius: 20, margin: '1rem 1.5rem 4rem', padding: '3rem 2rem', textAlign: 'center', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' },
  ctaTitle: { fontFamily: FONT, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#111', margin: '0 0 0.75rem', letterSpacing: '-0.01em' },
  ctaSub: { fontFamily: FONT, fontSize: 15, color: '#6b7280', margin: '0 0 1.75rem' },
  ctaBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },

  /* footer */
  footer: { background: '#111', color: '#9ca3af' },
  footerInner: { maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' },
  footerTop: { display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '2.5rem' },
  footerBrand: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' },
  footerLogoMark: { width: 30, height: 30, background: GREEN, color: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 15 },
  footerLogoText: { fontFamily: FONT, fontWeight: 700, fontSize: 16, color: '#fff' },
  footerTagline: { fontFamily: FONT, fontSize: 13, lineHeight: 1.7, color: '#6b7280', maxWidth: 260 },
  footerLinks: { display: 'flex', gap: '3rem', flexWrap: 'wrap' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: 8 },
  footerColHead: { fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 },
  footerLink: { fontFamily: FONT, fontSize: 13, color: '#6b7280', textDecoration: 'none' },
  footerBottom: { borderTop: '1px solid #1f2937', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  footerCopy: { fontFamily: FONT, fontSize: 12, color: '#4b5563', margin: 0 },
  footerPowered: { fontFamily: FONT, fontSize: 12, color: '#374151', margin: 0 },
}