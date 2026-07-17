import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contactData } from './contactData'
import ContactInfo from './ContactInfo'
import MapComponent from './MapComponent'
import GoogleReviewsCarousel from './GoogleReviewsCarousel'

gsap.registerPlugin(ScrollTrigger)

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.con-label',   { opacity: 0, y: 22 })
    gsap.set('.con-title',   { opacity: 0, x: -70 })
    gsap.set('.con-line',    { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.con-info-item', { opacity: 0, x: -30 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
      .to('.con-label',   { opacity: 1, y: 0,   duration: 0.5,  ease: 'power2.out' })
      .to('.con-title',   { opacity: 1, x: 0,   duration: 0.95, ease: 'power3.out' }, '-=0.2')
      .to('.con-line',    { scaleX: 1,          duration: 0.6,  ease: 'power2.inOut' }, '-=0.55')
      .to('.con-info-item', { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }, '-=0.3')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="contacto"
      data-sec-num="06"
      className="relative py-14 md:py-24 px-6 sm:px-8 md:px-16 lg:px-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-14">
          <span
            className="con-label block text-[10px] text-[#FFD600]/60 uppercase tracking-[0.42em] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Encuéntranos
          </span>
          <h2
            className="con-title text-white mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] 2xl:text-[7rem]"
            style={{
              fontFamily:    'var(--font-display)',
              lineHeight:    0.9,
              letterSpacing: '-0.02em',
            }}
          >
            {contactData.title}
          </h2>
          <div className="con-line h-[2px] w-14 bg-[#FFD600]" />
        </div>

        {/* Content */}
        <div className="con-content grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" style={{ perspective: '1000px' }}>
          <ContactInfo
            contactInfo={contactData.contactInfo}
            schedule={contactData.schedule}
          />
          <div className="con-map flex justify-center lg:justify-start" style={{ transformStyle: 'preserve-3d' }}>
            <MapComponent location={contactData.location} />
          </div>
        </div>

        {/* Google Reviews Carousel */}
        <div className="con-reviews">
          <GoogleReviewsCarousel />
        </div>
      </div>
    </section>
  )
}

export default ContactSection
