import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reservationContent, features, rules, texts } from './reservationData'

gsap.registerPlugin(ScrollTrigger)

const ReservationSection = () => {
  const [showRules, setShowRules] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.res-badge',    { opacity: 0, scale: 0.82 })
    gsap.set('.res-title',    { opacity: 0, y: 55 })
    gsap.set('.res-sub',      { opacity: 0, y: 30 })
    gsap.set('.res-feature',  { opacity: 0, y: 28 })
    gsap.set('.res-btn',      { opacity: 0, y: 20, scale: 0.92 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
      .to('.res-badge',   { opacity: 1, scale: 1,  duration: 0.5,  ease: 'back.out(1.5)' })
      .to('.res-title',   { opacity: 1, y: 0,      duration: 1.0,  ease: 'power3.out' }, '-=0.2')
      .to('.res-sub',     { opacity: 1, y: 0,      duration: 0.7,  ease: 'power2.out' }, '-=0.55')
      .to('.res-feature', { opacity: 1, y: 0,      duration: 0.65, ease: 'power2.out', stagger: 0.1 }, '-=0.4')
      .to('.res-btn',     { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.3)' }, '-=0.2')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="reservar"
      data-sec-num="05"
      className="relative py-16 md:py-28 px-6 sm:px-8 md:px-16 lg:px-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Subtle yellow accent bleed */}
      <div
        className="absolute top-0 right-0 w-2/5 h-full pointer-events-none"
        style={{ background: 'linear-gradient(to left, rgba(255,214,0,0.03), transparent)' }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto">

        {/* Badge */}
        <div className="res-badge mb-8 w-fit">
          <span
            className="bg-[#FFD600] text-black text-[10px] uppercase tracking-[0.35em] px-4 py-[6px] font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {texts.badgeText}
          </span>
        </div>

        {/* Title */}
        <h2
          className="res-title text-[#FFD600] mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]"
          style={{
            fontFamily:    'var(--font-display)',
            lineHeight:    0.9,
            letterSpacing: '-0.02em',
          }}
        >
          {reservationContent.title}
        </h2>

        {/* Subtitle */}
        <p
          className="res-sub text-gray-400 mb-8 md:mb-12 max-w-lg text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {reservationContent.subtitle}
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-xl">
          {features.map((f) => (
            <div key={f.id} className="res-feature flex items-start gap-3">
              <div className="mt-[2px] text-[#FFD600] flex-shrink-0">
                <f.icon size={17} />
              </div>
              <div>
                <p
                  className="text-white text-sm font-bold uppercase tracking-wide leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {f.title}
                </p>
                <p
                  className="text-gray-400 text-xs mt-1 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rules toggle */}
        <button
          onClick={() => setShowRules(!showRules)}
          className="text-gray-400 hover:text-[#FFD600] transition-colors text-[11px] uppercase tracking-widest mb-3 cursor-pointer"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {showRules ? texts.rulesToggle.hide : texts.rulesToggle.show}
        </button>

        <div className={`overflow-hidden transition-all duration-500 mb-10 ${showRules ? 'max-h-80' : 'max-h-0'}`}>
          <div className="border-l-2 border-[#FFD600]/25 pl-6 space-y-5 py-3">
            <p
              className="text-[#FFD600] text-[10px] uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {texts.rulesTitle}
            </p>
            {rules.map((r) => (
              <div key={r.id}>
                <p className="text-gray-300 text-xs font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {r.title}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="res-btn flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <button
            onClick={() => window.open(reservationContent.reservationUrl, '_blank')}
            className="group relative overflow-hidden bg-[#FFD600] text-black font-bold uppercase px-8 py-3 sm:px-12 sm:py-4 tracking-[0.12em] transition-all duration-300 hover:shadow-[0_0_60px_rgba(255,214,0,0.38)]"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}
          >
            <span className="relative z-10">{texts.buttonText}</span>
            <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          </button>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              {texts.buttonSubtext}
            </p>
            <p className="text-gray-400 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              {texts.defaultKey}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReservationSection
