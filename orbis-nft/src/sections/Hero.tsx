import { Mail, Twitter, Github } from 'lucide-react'

const NAV_LINKS = ['Homepage', 'Gallery', 'Buy NFT', 'FAQ', 'Contact']

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4'

function SocialButtons({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      {[Mail, Twitter, Github].map((Icon, i) => (
        <button
          key={i}
          className="liquid-glass w-[56px] h-[56px] flex items-center justify-center rounded-[1rem] hover:bg-white/10 transition-colors"
        >
          <Icon size={20} className="text-cream" />
        </button>
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden rounded-b-[32px]">
      {/* Background video */}
      <video
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content layer */}
      <div className="relative z-10 h-full">
        {/* Header */}
        <header className="w-full max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-6 flex items-center justify-between">
          {/* Logo */}
          <span className="font-grotesk text-[16px] uppercase text-cream tracking-wide">
            Orbis.Nft
          </span>

          {/* Center nav */}
          <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-grotesk text-[13px] uppercase text-cream hover:text-neon transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Spacer for centering on desktop */}
          <div className="hidden lg:block w-[56px]" />
        </header>

        {/* Hero content */}
        <div className="max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-end h-[calc(100%-100px)] pb-16 lg:pb-24">
          <div className="relative max-w-[780px] lg:ml-32">
            <h1 className="font-grotesk text-cream uppercase text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] leading-[1.05] sm:leading-[1] md:leading-[1] lg:leading-[1]">
              Beyond earth
              <br />
              and ( its ) familiar boundaries
            </h1>

            {/* Cursive overlay */}
            <span className="absolute right-0 top-0 lg:right-[-60px] lg:top-4 font-condiment text-neon text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] -rotate-1 mix-blend-exclusion opacity-90">
              Nft collection
            </span>
          </div>

          {/* Mobile social icons */}
          <SocialButtons className="flex lg:hidden items-center justify-center gap-4 mt-8" />
        </div>

        {/* Desktop social icons - top right */}
        <SocialButtons className="hidden lg:flex flex-col gap-3 fixed top-1/2 -translate-y-1/2 right-6 xl:right-10 z-20" />
      </div>
    </section>
  )
}
