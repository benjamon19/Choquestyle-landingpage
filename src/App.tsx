import { Suspense, lazy, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from '@studio-freight/lenis'
import NavigationBar from './components/Navbar/NavigationBar'
import HeroBanner from './sections/HeroSection/HeroBanner'
import FooterBar from './components/Footer/FooterBar'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const DisciplinesSection  = lazy(() => import('./sections/DisciplinesSection/DisciplinesSection'))
const InstructorsSection  = lazy(() => import('./sections/InstructorsSection/InstructorsSection'))
const ScheduleSection     = lazy(() => import('./sections/ScheduleSection/ScheduleSection'))
const GallerySection      = lazy(() => import('./sections/GallerySection/GallerySection'))
const ReservationSection  = lazy(() => import('./sections/ReservationSection/ReservationSection'))
const ContactSection      = lazy(() => import('./sections/ContactSection/ContactSection'))

export default function App() {
  useEffect(() => {
    // Forzar que el navegador no recuerde la posición
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    // Obligar a Lenis (motor de scroll) a empezar desde el pixel 0 instantáneamente
    lenis.scrollTo(0, { immediate: true })
    
    // Y un refuerzo nativo por si acaso
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 50)

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return (
    // overflow-x-hidden aquí en vez del body — en iOS Safari, overflow-x: hidden
    // en el body bloquea el scroll horizontal de cualquier hijo (overflow-x: auto),
    // incluso con data-lenis-prevent. Al moverlo a un wrapper div no ocurre ese bug.
    <div style={{ overflowX: 'hidden' }}>
      <NavigationBar />
      <main>
        <HeroBanner />
        <Suspense fallback={null}>
          <DisciplinesSection />
          <InstructorsSection />
          <ScheduleSection />
          <GallerySection />
          <ReservationSection />
          <ContactSection />
        </Suspense>
      </main>
      <FooterBar />
    </div>
  )
}
