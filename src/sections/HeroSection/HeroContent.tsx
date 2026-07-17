import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { scrollToSection } from '../../utils/scrollToSection'
import heroData from './heroData'

const TITLE = 'CHOQUESTYLE'

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // ── Initial states ───────────────────────────────────────────────
    gsap.set('.hero-tag',    { opacity: 0, y: 28 })
    gsap.set('.ch', {
      opacity: 0,
      y: 80,
      rotateX: -70,
      scale: 0.95,
      transformOrigin: 'bottom center',
    })
    gsap.set('.hero-sub',    { opacity: 0, y: 38, skewX: -12 })
    gsap.set('.hero-rule',   { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.hero-desc',   { opacity: 0, y: 24 })
    gsap.set('.hero-cta',    { opacity: 0, y: 20, scale: 0.9 })
    gsap.set('.hero-scroll', { opacity: 0 })

    // ── Timeline ─────────────────────────────────────────────────────
    gsap.timeline({ delay: 0.2 })
      .to('.hero-tag', {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power2.out',
      })
      .to('.ch', {
        opacity: 1, y: 0, rotateX: 0, scale: 1,
        duration: 1.2, stagger: 0.05, ease: 'expo.out',
      }, '-=0.15')
      .to('.hero-sub', {
        opacity: 1, y: 0, skewX: 0,
        duration: 0.85, ease: 'power3.out',
      }, '-=0.7')
      .to('.hero-rule', {
        scaleX: 1,
        duration: 0.55, ease: 'power2.inOut',
      }, '-=0.45')
      .to('.hero-desc', {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power2.out',
      }, '-=0.35')
      .to('.hero-cta', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65, ease: 'back.out(1.3)',
      }, '-=0.3')
      .to('.hero-scroll', {
        opacity: 1,
        duration: 0.6,
      }, '-=0.1')
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      // pt-48 empuja el contenido más abajo en móviles, md:pt-[88px] respeta el diseño original en pantallas grandes.
      className="relative z-10 flex flex-col justify-center min-h-svh pt-[75px] md:pt-[88px] pb-28 md:pb-20 px-6 sm:px-8 md:px-16 lg:px-24"
      style={{ maxWidth: '1440px' }}
    >
      {/* Overline badge */}
      <div className="hero-tag mb-5">
        <div
          className="inline-block text-[11px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.45em] uppercase text-[#FFD600] border-l-2 border-[#FFD600] px-3 py-1 bg-black/40"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Academia de Artes Marciales — Calama, Chile
        </div>
      </div>

      {/* ── CHOQUE STYLE — 3-D letter entrance ───────────────────────── */}
      <div style={{ perspective: '1100px', perspectiveOrigin: '30% 50%' }}>
        <h1
          className="uppercase mb-2 flex flex-wrap gap-x-1 md:gap-x-4 text-[3.8rem] sm:text-[5.5rem] md:text-7xl lg:text-8xl xl:text-[11rem] leading-[0.95] sm:leading-[0.88]"
          style={{
            fontFamily: 'var(--font-display)',
            transformStyle: 'preserve-3d',
            letterSpacing:  '-0.02em',
          }}
        >
          <div className="flex">
            {'CHOQUE'.split('').map((char, i) => (
              <span
                key={`c-${i}`}
                className="ch inline-block text-white"
                style={{ willChange: 'transform, opacity' }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="flex">
            {'STYLE'.split('').map((char, i) => (
              <span
                key={`s-${i}`}
                className="ch inline-block text-[#FFD600]"
                style={{ willChange: 'transform, opacity' }}
              >
                {char}
              </span>
            ))}
          </div>
        </h1>
      </div>

      {/* Subtitle */}
      <h2
        className="hero-sub uppercase text-white mb-3 text-sm sm:text-base md:text-lg lg:text-xl max-w-[300px] sm:max-w-none"
        style={{
          fontFamily:    'var(--font-heading)',
          fontWeight:    700,
          letterSpacing: '0.1em',
        }}
      >
        {heroData.subTitle}
      </h2>

      {/* Gold rule */}
      <div className="hero-rule w-12 h-[2px] bg-[#FFD600] mb-5" />

      {/* Description */}
      <p
        className="hero-desc text-gray-400 mb-10 max-w-md leading-relaxed"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(0.83rem, 1vw, 0.95rem)',
        }}
      >
        {heroData.description}
      </p>

      {/* CTA button — slide-wipe hover effect */}
      <div className="hero-cta">
        <button
          onClick={() => scrollToSection('reservar')}
          className="group relative overflow-hidden bg-[#FFD600] text-black font-bold uppercase px-8 py-3 lg:px-9 lg:py-[13px] transition-all duration-300 hover:shadow-[0_0_55px_rgba(255,214,0,0.35)]"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.14em', fontSize: '0.8rem' }}
          aria-label="Reserva tu primera clase de artes marciales ahora"
        >
          <span className="relative z-10">{heroData.buttonText}</span>
          <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-6 md:bottom-10 left-6 sm:left-8 md:left-16 lg:left-24 flex items-center gap-3">
        <div className="w-px h-14 bg-gradient-to-b from-[#FFD600]/50 to-transparent" />
        <span
          className="text-gray-600 text-[9px] uppercase tracking-[0.35em]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Scroll
        </span>
      </div>
    </div>
  )
}
