import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata = {
  title: 'DineCup — Explore Top-Rated Restaurants & Cafés Near You',
  description: 'Explore curated restaurant & cafés near you with Full menus, verified ratings, online ordering, and instant WhatsApp connections - all in One place',
   icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: '4Q2mk1EHAzWsXtx52zH-yUmH7QlxcGhd7BtMIVCpscI',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <head>
  
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
  {/* Google Analytics */}
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CY556VX04H"></script>
  <script dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CY556VX04H');
    `
  }} />
</head>  

    </head>
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        {children}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="7a7cf1d7-b7be-482b-a7ea-4c9d8346892f"></script>
      </body>
    </html>
  )
}
