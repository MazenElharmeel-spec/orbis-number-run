const NFT_CARDS = [
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    score: '8.7/10',
  },
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    score: '9/10',
  },
  {
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    score: '8.2/10',
  },
]

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function NftCard({ video, score }: { video: string; score: string }) {
  return (
    <div className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors">
      {/* Square video container */}
      <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Bottom overlay bar */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-grotesk text-[11px] uppercase text-cream/70 tracking-wider">
                Rarity score:
              </p>
              <p className="font-grotesk text-[16px] text-cream">{score}</p>
            </div>

            {/* Arrow button */}
            <button className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Collection() {
  return (
    <section className="bg-background py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16 md:mb-20">
          {/* Left heading */}
          <h2 className="font-grotesk text-cream uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1.1]">
            Collection of
            <br />
            <span className="ml-12 sm:ml-16 md:ml-24 lg:ml-32 inline-block">
              <span className="font-condiment text-neon normal-case">Space</span>{' '}
              objects
            </span>
          </h2>

          {/* Right: SEE ALL CREATORS button */}
          <button className="group flex-shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="font-grotesk text-cream uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-none">
                See
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-grotesk text-cream uppercase text-[20px] sm:text-[26px] md:text-[30px] lg:text-[36px]">
                  All
                </span>
                <span className="font-grotesk text-cream uppercase text-[20px] sm:text-[26px] md:text-[30px] lg:text-[36px]">
                  Creators
                </span>
              </div>
            </div>
            <div className="w-full h-[6px] sm:h-[8px] md:h-[10px] bg-neon mt-2" />
          </button>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {NFT_CARDS.map((card, i) => (
            <NftCard key={i} video={card.video} score={card.score} />
          ))}
        </div>
      </div>
    </section>
  )
}
