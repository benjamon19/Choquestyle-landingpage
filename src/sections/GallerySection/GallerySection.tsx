import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GalleryCard from './GalleryCard'
import ImageLightbox from './ImageLightbox'
import { galleries } from './galleryData'

gsap.registerPlugin(ScrollTrigger)

const GallerySection = () => {
  const [selectedGallery, setSelectedGallery] = useState<any>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.gal-label', { opacity: 0, y: 22 })
    gsap.set('.gal-title', { opacity: 0, x: -70 })
    gsap.set('.gal-line', { scaleX: 0, transformOrigin: 'left center' })
    gsap.set('.gal-item', { opacity: 0, y: 50, scale: 0.94 })

    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
    })
      .to('.gal-label', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to('.gal-title', { opacity: 1, x: 0, duration: 0.95, ease: 'power3.out' }, '-=0.2')
      .to('.gal-line', { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, '-=0.55')
      .to('.gal-item', {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85, stagger: 0.09, ease: 'power3.out',
      }, '-=0.25')
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="galeria"
      data-sec-num="04"
      className="relative px-6 sm:px-8 md:px-16 lg:px-24 overflow-hidden flex flex-col justify-center min-h-[100svh]"
      style={{ backgroundColor: 'var(--color-bg-2)', paddingBlock: 'var(--sec-py)' }}
    >

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div style={{ marginBottom: 'var(--sec-header-mb)' }}>
          <span
            className="gal-label block text-[10px] text-[#FFD600]/60 uppercase tracking-[0.42em] mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Nuestra academia
          </span>
          <h2
            className="gal-title text-white mb-4 text-4xl sm:text-5xl md:text-5xl lg:text-[5.5rem] 2xl:text-[7rem]"
            style={{
              fontFamily: 'var(--font-display)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}
          >
            ACADEMIA EN ACCIÓN
          </h2>
          <div className="gal-line h-[2px] w-14 bg-[#FFD600]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleries.map((gallery, index) => (
            <div
              key={gallery.id}
              className="gal-item group relative overflow-hidden cursor-pointer aspect-square md:aspect-auto md:h-[25dvh]"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              onClick={() => setSelectedGallery(gallery)}
            >
              <img
                src={gallery.image}
                alt={gallery.title}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={(e) => (e.currentTarget.src = gallery.fallback)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-9 h-9 border-2 border-[#FFD600] flex items-center justify-center">
                  <span className="text-[#FFD600] text-xl leading-none">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedGallery && (
        <ImageLightbox image={selectedGallery.image} onClose={() => setSelectedGallery(null)} />
      )}
    </section>
  )
}

export default GallerySection
