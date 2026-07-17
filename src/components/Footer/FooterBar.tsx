import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { footerData } from './footerData'
import { navItems } from '../Navbar/navItems'
import { scrollToSection } from '../../utils/scrollToSection'
import Logo from '../Navbar/Logo'

gsap.registerPlugin(ScrollTrigger)

type IconComp = React.ComponentType<{ size?: number }>

const iconMap: Record<string, IconComp> = {
  instagram: FaInstagram,
  whatsapp:  FaWhatsapp,
}

const FooterBar = () => {
  const year = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.set('.footer-col', { opacity: 0, y: 30 })
    gsap.set('.footer-bottom', { opacity: 0 })

    gsap.timeline({
      scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
    })
      .to('.footer-col', { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' })
      .to('.footer-bottom', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
  }, { scope: footerRef })

  return (
    <footer 
      ref={footerRef}
      className="flex flex-col min-h-[100svh] md:min-h-0"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Gold gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFD600]/35 to-transparent" />

      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-16 lg:px-24 py-16 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">

          {/* Brand */}
          <div className="footer-col flex flex-col gap-5">
            <div className="hidden md:block">
              <Logo />
            </div>
            <p
              className="text-gray-600 text-xs leading-relaxed max-w-[220px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Academia de artes marciales en Calama, Chile.<br />
              Boxeo · Kick Boxing · Muay Thai · MMA
            </p>
            <div className="flex gap-5">
              {footerData.socialLinks.map((social) => {
                const Icon = iconMap[social.icon]
                return Icon ? (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#FFD600] transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={19} />
                  </a>
                ) : null
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <p
              className="text-white text-[10px] uppercase tracking-[0.28em] mb-5"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
            >
              Navegación
            </p>
            <ul className="space-y-[10px]">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-600 hover:text-[#FFD600] transition-colors text-[11px] uppercase tracking-[0.18em] cursor-pointer"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <p
              className="text-white text-[10px] uppercase tracking-[0.28em] mb-5"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
            >
              Contacto
            </p>
            <div className="space-y-3">
              <p className="text-gray-600 text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Vicuña Mackenna 2320<br />
                Calama, Antofagasta, Chile
              </p>
              <a
                href="https://www.instagram.com/choquestyle2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-[#FFD600] text-xs transition-colors duration-300"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                @choquestyle2.0
              </a>
              <a
                href="mailto:daniel.choque@choquestyle.cl"
                className="block text-gray-600 hover:text-[#FFD600] text-xs transition-colors duration-300"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                daniel.choque@choquestyle.cl
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom flex flex-col sm:flex-row justify-between items-center gap-3 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-gray-700 text-[11px]" style={{ fontFamily: 'var(--font-body)' }}>
            © {year} {footerData.copyright.brand}. {footerData.copyright.text}.
          </p>
          <p className="text-gray-700 text-[11px]" style={{ fontFamily: 'var(--font-body)' }}>
            {footerData.copyright.location}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterBar
