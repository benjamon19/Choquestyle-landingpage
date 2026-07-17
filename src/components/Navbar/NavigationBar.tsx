import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaBars } from 'react-icons/fa'
import { navItems } from './navItems'
import { scrollToSection } from '../../utils/scrollToSection'
import Logo from './Logo'

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const rafRef = useRef<number | null>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    sectionsRef.current = navItems.map(item => document.getElementById(item.id))

    const handleScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const scrollY = window.scrollY
        setScrolled(scrollY > 50)

        let current = ''
        sectionsRef.current.forEach(section => {
          if (section && scrollY >= section.offsetTop - 150) {
            current = section.id
          }
        })
        if (current) setActiveSection(current)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleNavClick = (id: string) => {
    scrollToSection(id)
    setMenuOpen(false)
  }

  const mainLinks = navItems.filter(item => item.id !== 'reservar')
  const reservarItem = navItems.find(item => item.id === 'reservar')

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 ${menuOpen ? 'bg-black/95 border-b border-white/5' : 'bg-transparent'
        }`}
    >
      <div className="h-[75px] lg:h-[85px] px-8 md:px-14 lg:px-20 max-w-[1440px] mx-auto flex items-center justify-between lg:justify-center">

        {/* Logo */}
        <div className="flex lg:hidden items-center cursor-pointer" onClick={() => handleNavClick('inicio')}>
          <Logo />
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6 lg:gap-8">
          {mainLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative hover:text-[#FFD600] transition-colors duration-300 uppercase text-xs md:text-sm lg:text-[13px] xl:text-sm tracking-[0.2em] group ${activeSection === item.id ? 'text-[#FFD600]' : 'text-white/80'
                }`}
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
            >
              {item.label}
              <span className={`absolute -bottom-2 left-0 h-px bg-[#FFD600] transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
            </button>
          ))}

          {reservarItem && (
            <button
              onClick={() => handleNavClick(reservarItem.id)}
              className="border-2 border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-black transition-all duration-300 uppercase px-6 py-2 lg:px-7 lg:py-2.5 text-xs md:text-sm lg:text-[13px] xl:text-sm tracking-[0.2em] font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {reservarItem.label}
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white p-2 focus:outline-none"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          <div className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}>
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </div>
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } bg-black/95 backdrop-blur-xl border-t border-white/5`}
      >
        <div className="px-8 py-6 space-y-1">
          {navItems.map((item) => {
            const isReservar = item.id === 'reservar';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={isReservar
                  ? "block w-full text-center py-3 px-4 uppercase text-base tracking-[0.15em] transition-all duration-300 border border-[#FFD600] text-[#FFD600] font-bold rounded-md my-3 hover:bg-[#FFD600] hover:text-black cursor-pointer"
                  : `block w-full text-left py-4 px-2 uppercase text-base md:text-lg tracking-[0.15em] transition-all duration-200 border-l-2 cursor-pointer ${activeSection === item.id
                    ? 'text-[#FFD600] border-[#FFD600] pl-4'
                    : 'text-white/80 border-transparent hover:text-[#FFD600] hover:border-[#FFD600] hover:pl-4'
                  }`
                }
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  )
}
