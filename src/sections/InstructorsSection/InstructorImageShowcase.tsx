import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InstructorProfile from './InstructorProfile'
import { instructors } from './instructorsData'

gsap.registerPlugin(ScrollTrigger)

const InstructorImageShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.inst-label', { opacity: 0, y: 22 })
    gsap.set('.inst-title', { opacity: 0, x: -70 })
    gsap.set('.inst-line',  { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.inst-card',  { opacity: 0, y: 65 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
      .to('.inst-label', { opacity: 1, y: 0,   duration: 0.5,  ease: 'power2.out' })
      .to('.inst-title', { opacity: 1, x: 0,   duration: 0.95, ease: 'power3.out' }, '-=0.2')
      .to('.inst-line',  { scaleX: 1,          duration: 0.6,  ease: 'power2.inOut' }, '-=0.55')
      .to('.inst-card',  {
        opacity: 1, y: 0,
        duration: 1.05, stagger: 0.22, ease: 'power3.out',
      }, '-=0.3')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="instructores"
      data-sec-num="02"
      className="relative px-6 sm:px-8 md:px-16 lg:px-24 overflow-hidden scroll-mt-16 flex flex-col justify-center min-h-[100svh]"
      style={{ backgroundColor: 'var(--color-bg)', paddingBlock: 'var(--sec-py)' }}
    >

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 'var(--sec-header-mb)' }}>
          <span
            className="inst-label block text-[10px] text-[#FFD600]/60 uppercase tracking-[0.42em] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Nuestros entrenadores
          </span>
          <h2
            className="inst-title text-white mb-4 text-4xl sm:text-5xl md:text-5xl lg:text-[5.5rem] 2xl:text-[7rem]"
            style={{
              fontFamily:    'var(--font-display)',
              lineHeight:    0.9,
              letterSpacing: '-0.02em',
            }}
          >
            INSTRUCTORES
          </h2>
          <div className="inst-line h-[2px] w-14 bg-[#FFD600]" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {instructors.map((instructor: any, index: number) => (
            <div key={instructor.id} className="inst-card h-full">
              <InstructorProfile instructor={instructor} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstructorImageShowcase
