import { Mail, Twitter, Github } from 'lucide-react'

const CTA_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4'

export default function Cta() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background video - native aspect ratio */}
      <video
        src={CTA_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto block"
      />

      {/* Text content overlay */}
      <div className="absolute inset-0 flex items-center justify-end z-10">
        <div className="relative lg:pr-[20%] lg:pl-[15%] px-4 sm:px-6 md:px-8">
          {/* "Go beyond" cursive accent */}
          <span className="absolute top-0 left-4 sm:left-6 md:left-8 lg:left-[15%] font-condiment text-neon text-[17px] sm:text-[32px] md:text-[48px] lg:text-[68px] mix-blend-exclusion">
            Go beyond
          </span>

          {/* Main heading */}
          <h2 className="font-grotesk text-cream uppercase text-[16px] sm:text-[32px] md:text-[44px] lg:text-[60px] leading-[1.15] mt-6 sm:mt-10 md:mt-16 lg:mt-20">
            <span className="block mb-4 sm:mb-6 md:mb-8 lg:mb-12">Join us.</span>
            Reveal what's hidden.
            <br />
            Define what's next.
            <br />
            Follow the signal.
          </h2>
        </div>
      </div>

      {/* Social icons - bottom left */}
      <div className="absolute left-[8%] bottom-[12%] sm:bottom-[15%] md:bottom-[18%] lg:bottom-[20%] z-10">
        <div className="liquid-glass rounded-[0.5rem] sm:rounded-[0.75rem] md:rounded-[1rem] lg:rounded-[1.25rem] flex flex-col overflow-hidden">
          {[Mail, Twitter, Github].map((Icon, i) => (
            <button
              key={i}
              className={`
                w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]
                h-[14vw] sm:h-[14.375rem] md:h-[10.78125rem] lg:h-[16.77rem]
                flex items-center justify-center
                hover:bg-white/10 transition-colors
                ${i < 2 ? 'border-b border-white/10' : ''}
              `}
            >
              <Icon
                size={20}
                className="text-cream w-[4vw] h-[4vw] sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
