const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4'

const BODY_TEXT =
  'A digital object fixed beyond time and place. An exploration of distance, form, and silence in space'

export default function About() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        src={ABOUT_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content layer */}
      <div className="relative z-10 max-w-[1831px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
          {/* Left: Heading */}
          <div className="relative">
            <h2 className="font-grotesk text-cream uppercase text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1.1]">
              Hello!
              <br />
              I'm orbis
            </h2>

            {/* Cursive overlay */}
            <span className="absolute bottom-0 right-0 lg:bottom-1 lg:right-[-20px] font-condiment text-neon text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px] -rotate-1 mix-blend-exclusion">
              Orbis
            </span>
          </div>

          {/* Right: Body paragraph */}
          <p className="font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream max-w-[266px] leading-relaxed">
            {BODY_TEXT}
          </p>
        </div>

        {/* Bottom row - decorative faded paragraphs */}
        <div className="flex justify-between mt-16 sm:mt-20 md:mt-24 lg:mt-32">
          {/* Left column */}
          <div className="flex flex-col gap-8 max-w-[266px]">
            <p className="font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream lg:opacity-10 text-[#010828] lg:text-cream leading-relaxed">
              {BODY_TEXT}
            </p>
            <p className="font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream lg:opacity-10 text-[#010828] lg:text-cream leading-relaxed">
              {BODY_TEXT}
            </p>
          </div>

          {/* Right column - hidden on mobile */}
          <div className="hidden lg:flex flex-col gap-8 max-w-[266px]">
            <p className="font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream opacity-10 leading-relaxed">
              {BODY_TEXT}
            </p>
            <p className="font-mono text-[14px] sm:text-[15px] md:text-[16px] uppercase text-cream opacity-10 leading-relaxed">
              {BODY_TEXT}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
