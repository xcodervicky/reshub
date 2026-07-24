import Link from 'next/link'
import Image from 'next/image'

export default function FreeBranding({ isVerified = false }) {
  return (
    <div className="flex items-center justify-center gap-3 bg-[#FAF9F6] border-b border-gray-200 py-2.5 px-4">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className="w-7 h-7 rounded-md overflow-hidden shrink-0 relative">
          <Image
            src="/dinecup.jpeg"
            alt="DineCup Logo"
            fill
            className="object-cover"
          />
        </span>
        <span>
          Basic FREE Listing<span className="font-bold text-gray-900"> powered by DineCup</span>
        </span>
      </Link>

      {isVerified ? (
        // Verified/Claimed listing → show Upgrade CTA
        <a
          href="https://dinecup.netlify.app/membership"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
        >
          <span>✦</span>
          Upgrade
        </a>
      ) : (
        // Unverified/Unclaimed listing → show Claim Listing CTA
        <a
          href="https://dinecup.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
        >
          <span>✦</span>
          Claim 
        </a>
      )}
    </div>
  )
}