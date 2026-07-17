import { useState } from 'react'

const imageMap: Record<string, { webp: string; jpeg: string }> = {
  'Daniel Choque': { webp: '/images/couch1.webp', jpeg: '/images/couch1.webp' },
  'Jhonatan Leuch': { webp: '/images/couch2.webp', jpeg: '/images/couch2.webp' },
}

const descriptions: Record<string, string> = {
  'Daniel Choque': 'Campeón con 14 títulos nacionales e internacionales. Especialista en kickboxing y muay thai con experiencia en Brasil, Chile y Argentina.',
  'Jhonatan Leuch': 'Peleador profesional y cinturón negro especializado en clases personalizadas de MMA, Boxeo y K1. Campeón con 5 títulos profesionales entre Brasil y Chile.',
}

const InstructorProfile = ({ instructor }: { instructor: any; index?: number }) => {
  const [showAchievements, setShowAchievements] = useState(false)
  const imgSrc = imageMap[instructor.name]
  return (
    <div className="w-full h-full flex flex-col group/card">
      {/* ── Ultra Minimalist Image & Overlay ────────────────────────────────────────── */}
      <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[480px] overflow-hidden mb-4 md:mb-6 bg-[#0a0a0a]">
        <picture>
          <source srcSet={imgSrc?.webp} type="image/webp" />
          <img
            src={imgSrc?.jpeg}
            alt={instructor.name}
            className={`w-full h-full object-cover object-top transition-all duration-700 ${showAchievements ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </picture>

        {/* ── Glassmorphism Achievements Overlay ── */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-md p-6 sm:p-8 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showAchievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
        >
          <div className="flex justify-between items-center mb-6">
            <p className="text-[#FFD600] uppercase tracking-[0.2em] font-bold text-xs" style={{ fontFamily: 'var(--font-heading)' }}>
              Palmarés Oficial
            </p>
            <button
              onClick={() => setShowAchievements(false)}
              className="text-white hover:text-[#FFD600] transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div
            className="overflow-y-auto custom-scrollbar flex-grow pr-2 overscroll-contain"
            data-lenis-prevent="true"
          >
            <ul className="space-y-4 list-none p-0 m-0">
              {instructor.achievements?.map((a: string, i: number) => (
                <li
                  key={i}
                  className="text-sm md:text-base text-gray-200 flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <span className="text-[#FFD600] mt-[3px] text-xs">◆</span> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Clean Content ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 sm:gap-4 mb-4">
          <h3
            className="text-white uppercase leading-none m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 4vw, 3.2rem)',
              letterSpacing: '-0.02em'
            }}
          >
            {instructor.name}
          </h3>
          <span
            className="text-[#FFD600] text-xs sm:text-sm uppercase tracking-[0.2em] font-bold pb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {instructor.title}
          </span>
        </div>

        {/* Minimalist separator */}
        <div className="w-full h-[1px] bg-white/10 mb-5" />

        <p
          className="text-gray-400 text-sm leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {descriptions[instructor.name]}
        </p>

        {/* Achievements toggle button */}
        {instructor.achievements && (
          <div className="mt-auto">
            <button
              onClick={() => setShowAchievements(true)}
              className={`transition-colors text-[11px] uppercase tracking-[0.15em] cursor-pointer font-bold ${showAchievements ? 'text-[#FFD600]' : 'text-gray-500 hover:text-white'
                }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {showAchievements ? 'Palmarés Abierto ↑' : '+ Ver Palmarés'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorProfile
