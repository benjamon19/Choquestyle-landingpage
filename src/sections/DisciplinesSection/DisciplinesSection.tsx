import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DisciplineCard from './DisciplineCard'
import { disciplines, sectionContent } from './disciplinesData'

gsap.registerPlugin(ScrollTrigger)

const tripled = [...disciplines, ...disciplines, ...disciplines]

export default function DisciplinesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useGSAP(() => {
    gsap.set('.disc-label', { opacity: 0, y: 22 })
    gsap.set('.disc-title', { opacity: 0, x: -70 })
    gsap.set('.disc-line', { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.disc-desc', { opacity: 0, y: 18 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
    })
      .to('.disc-label', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to('.disc-title', { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' }, '-=0.2')
      .to('.disc-line', { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }, '-=0.55')
      .to('.disc-desc', { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.35')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="disciplinas"
      data-sec-num="01"
      className="relative py-14 md:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-2)' }}
    >

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="relative z-10 px-6 sm:px-8 md:px-16 lg:px-24 mb-10 md:mb-16 max-w-[1440px]">
        <span
          className="disc-label block text-[10px] text-[#FFD600]/60 uppercase tracking-[0.42em] mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Entrena con nosotros
        </span>
        <h2
          className="disc-title text-white mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] 2xl:text-[7rem]"
          style={{
            fontFamily: 'var(--font-display)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}
        >
          {sectionContent.title.replace('DISCIPLINAS', '').trim()} <span className="text-[#FFD600]">DISCIPLINAS</span>
        </h2>
        <div className="disc-line h-[2px] w-14 bg-[#FFD600] mb-5" />
        <p
          className="disc-desc text-gray-400 max-w-md text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {sectionContent.description}
        </p>
      </div>

      {/* ── Infinite carousel ───────────────────────────────────────── */}
      <style>{`
        @keyframes carouselScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-340px * 5)); }
        }
        @keyframes carouselScrollMobile {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-240px * 5)); }
        }
        .carousel-track { animation: carouselScroll 20s linear infinite; will-change: transform; }
        @media (max-width: 768px) {
          .carousel-track { animation: carouselScrollMobile 12s linear infinite; }
        }
      `}</style>

      <div className="w-full overflow-hidden">
        <div className="flex carousel-track" style={{ width: 'max-content', animationPlayState: inView ? 'running' : 'paused' }}>
          {tripled.map((d, i) => (
            <DisciplineCard
              key={i}
              iconName={d.iconName}
              title={d.title}
              description={d.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
