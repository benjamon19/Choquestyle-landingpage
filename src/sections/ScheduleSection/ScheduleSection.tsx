import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScheduleTable from './ScheduleTable'

gsap.registerPlugin(ScrollTrigger)

export default function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.sched-label', { opacity: 0, y: 22 })
    gsap.set('.sched-title', { opacity: 0, x: -70 })
    gsap.set('.sched-line',  { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.sched-table', { opacity: 0, y: 30 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
    })
      .to('.sched-label', { opacity: 1, y: 0,   duration: 0.5,  ease: 'power2.out' })
      .to('.sched-title', { opacity: 1, x: 0,   duration: 0.95, ease: 'power3.out' }, '-=0.2')
      .to('.sched-line',  { scaleX: 1,          duration: 0.6,  ease: 'power2.inOut' }, '-=0.55')
      .to('.sched-table', { opacity: 1, y: 0,   duration: 0.6,  ease: 'power3.out' }, '-=0.3')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="horario"
      data-sec-num="03"
      className="relative flex flex-col justify-center min-h-[100svh]"
      style={{
        backgroundColor: 'var(--color-bg-2)',
        paddingBlock: 'var(--sec-py)',
        clipPath: 'inset(0)',
      }}
    >

      <div className="relative z-10 px-6 sm:px-8 md:px-16 lg:px-24 max-w-[1440px] mx-auto w-full">
        <div style={{ marginBottom: 'var(--sec-header-mb)' }}>
          <span
            className="sched-label block text-[10px] text-[#FFD600]/60 uppercase tracking-[0.42em] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Planificación semanal
          </span>
          <h2
            className="sched-title text-white mb-4 text-4xl sm:text-5xl md:text-5xl lg:text-[5.5rem] 2xl:text-[7rem]"
            style={{ fontFamily: 'var(--font-display)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
          >
            HORARIO DE CLASES
          </h2>
          <div className="sched-line h-[2px] w-14 bg-[#FFD600]" />
        </div>

        <div className="sched-table">
          <ScheduleTable />
        </div>
      </div>
    </section>
  )
}
